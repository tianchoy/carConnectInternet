import { isBusinessSuccessCode } from '../api/response.uts'
import { getNotifyQuota, getDeviceTicket, getNotifyStatus, reportSubscribeResults, type NotifyQuotaItem } from '../api/request.uts'

/**
 * 订阅消息前端封装（对接 /app/notify）
 *
 * 两条通道，由 /app/notify/quota 返回的 mode 决定，前端不硬编码：
 * - device（alarm 告警）：GET /app/notify/deviceTicket 换票 → wx.requestSubscribeDeviceMessage → 长期有效，无需上报
 * - once（order / expire / share）：wx.requestSubscribeMessage → POST /app/notify/subscribeReport 上报记账
 *
 * 后端文档：微信小程序订阅消息-前端对接API完整文档.md
 */

const QUOTA_STORAGE_KEY = 'wx_subscribe_quota'
const DEFAULT_BIZ_CODE = 'alarm'

export type DeviceAuthorizeStatus = 'accept' | 'acceptWithAudio' | 'acceptWithAlert' | 'reject' | 'ban' | 'filter' | 'fail' | 'unsupported' | 'noTemplate'

export type DeviceAuthorizeOutcome = {
    status: DeviceAuthorizeStatus
    errMsg: string
    errCode: number
    templateId: string
}

/**
 * 设备订阅能力探测：非微信小程序端或基础库 < 2.20.0 时不可用，调用方应隐藏入口
 */
export function isDeviceSubscribeSupported() : boolean {








    return false
}

/**
 * 拉取各场景模板 ID 与通道，并写入本地缓存（后端要求缓存以减少请求）
 */
// 请求去重 + 节流：onShow、设备切换等多个入口可能连续触发拉取，避免重复请求 /quota
let quotaInFlight : Promise<Array<NotifyQuotaItem>> | null = null
let quotaFetchedAt : number = 0
const QUOTA_FETCH_MIN_INTERVAL : number = 10 * 1000

export async function fetchNotifyQuota() : Promise<Array<NotifyQuotaItem>> {
    // 并发去重：同一时刻只发一个请求，后到者共享结果
    const inFlight = quotaInFlight
    if (inFlight != null) return inFlight
    // 节流：短时间内直接复用本地缓存
    if (Date.now() - quotaFetchedAt < QUOTA_FETCH_MIN_INTERVAL) {
        const cached = readCachedQuota()
        if (cached.length > 0) return cached
    }
    const task = doFetchQuota()
    quotaInFlight = task
    return task
}

async function doFetchQuota() : Promise<Array<NotifyQuotaItem>> {
    try {
        const res = await getNotifyQuota()
        if (!isBusinessSuccessCode(res.code)) {
            console.warn('[notify] 拉取订阅额度失败:', res.msg)
            return readCachedQuota()
        }
        cacheQuota(res.data)
        quotaFetchedAt = Date.now()
        return res.data
    } catch (error) {
        console.warn('[notify] 拉取订阅额度异常:', error)
        return readCachedQuota()
    } finally {
        quotaInFlight = null
    }
}

/**
 * 查询订阅引导开关（GET /app/notify/status）
 * 后端用 data.enabled 控制首页订阅行的展示与否；查询失败 / 字段缺失按「隐藏」处理（fail-closed）
 */
export async function fetchNotifyStatusEnabled() : Promise<boolean> {
    try {
        const res = await getNotifyStatus()
        if (!isBusinessSuccessCode(res.code) || res.data == null) return false
        return res.data.getBoolean('enabled', false)
    } catch (error) {
        console.warn('[notify] 查询订阅开关失败:', error)
        return false
    }
}

function cacheQuota(list : Array<NotifyQuotaItem>) : void {
    try {
        uni.setStorageSync(QUOTA_STORAGE_KEY, JSON.stringify(list))
    } catch (error) {
        console.warn('[notify] 缓存订阅额度失败:', error)
    }
}

/**
 * 读取本地缓存的额度项；未拉取过时返回 null（调用方决定是否需要联网拉取）
 */
export function getCachedQuota(bizCode : string) : NotifyQuotaItem | null {
    const list = readCachedQuota()
    for (let i = 0; i < list.length; i++) {
        if (list[i].bizCode == bizCode) return list[i]
    }
    return null
}

function readCachedQuota() : Array<NotifyQuotaItem> {
    try {
        const raw = uni.getStorageSync(QUOTA_STORAGE_KEY)
        if (raw == null || raw.toString() == '') return []
        const parsed = JSON.parse(raw.toString()) as Array<UTSJSONObject>
        const list : Array<NotifyQuotaItem> = []
        for (let i = 0; i < parsed.length; i++) {
            const row = parsed[i]
            list.push({
                bizCode: row.getString('bizCode', ''),
                templateId: row.getString('templateId', ''),
                remaining: row.getNumber('remaining', -1),
                mode: row.getString('mode', '')
            })
        }
        return list
    } catch (error) {
        return []
    }
}

/**
 * 设备订阅授权（alarm 告警场景）
 * ⚠️ 必须在用户 tap 手势回调链内调用；deviceNo 传设备原始编号；snTicket 现取现用（5 分钟有效，不缓存）
 */
export async function authorizeDevice(deviceNo : string, bizCode : string = DEFAULT_BIZ_CODE) : Promise<DeviceAuthorizeOutcome> {
    if (!isDeviceSubscribeSupported()) {
        return { status: 'unsupported', errMsg: '当前微信版本不支持设备订阅', errCode: 0, templateId: '' }
    }
    if (deviceNo == '') {
        return { status: 'fail', errMsg: '未选择设备', errCode: 0, templateId: '' }
    }

    let item = getCachedQuota(bizCode)
    if (item == null) {
        await fetchNotifyQuota()
        item = getCachedQuota(bizCode)
    }
    if (item == null) {
        // 未配置模板的场景不会出现在 /quota 返回值中，按「隐藏引导 UI」处理，不算错误
        return { status: 'noTemplate', errMsg: '', errCode: 0, templateId: '' }
    }
    if (item.mode != 'device') {
        return { status: 'noTemplate', errMsg: '当前场景未启用设备订阅', errCode: 0, templateId: item.templateId }
    }

    try {
        const ticketRes = await getDeviceTicket(deviceNo)
        if (!isBusinessSuccessCode(ticketRes.code) || ticketRes.data == null) {
            const msg = ticketRes.msg != '' ? ticketRes.msg : '获取设备票据失败，请稍后重试'
            console.warn('[notify] 换票失败:', msg)
            return { status: 'fail', errMsg: msg, errCode: 0, templateId: item.templateId }
        }
        const sn = ticketRes.data.getString('sn', '')
        const snTicket = ticketRes.data.getString('snTicket', '')
        const modelId = ticketRes.data.getString('modelId', '')
        const templateId = ticketRes.data.getString('templateId', '') != '' ? ticketRes.data.getString('templateId', '') : item.templateId
        if (sn == '' || snTicket == '' || templateId == '') {
            console.warn('[notify] 票据字段不完整:', ticketRes.data)
            return { status: 'fail', errMsg: '设备票据不完整，请稍后重试', errCode: 0, templateId: templateId }
        }
        // 订阅与下发必须同源同值，否则微信报 9800006
        return await callDeviceSubscribe(sn, snTicket, modelId, templateId)
    } catch (error) {
        console.error('[notify] 设备订阅异常:', error)
        return { status: 'fail', errMsg: '订阅请求异常，请稍后重试', errCode: 0, templateId: item.templateId }
    }
}

function callDeviceSubscribe(sn : string, snTicket : string, modelId : string, templateId : string) : Promise<DeviceAuthorizeOutcome> {
    return new Promise((resolve) => {





























        resolve({ status: 'unsupported', errMsg: '当前环境不支持设备订阅', errCode: 0, templateId: templateId })

    })
}

// 微信原生错误信息对用户不可读，按 errCode 优先转成可判断的中文提示（含排障线索）
// 错误码取值：wx.requestSubscribeDeviceMessage 官方错误码表
function normalizeDeviceError(errMsg : string, errCode : number) : string {
    if (errCode == 19720728) return '模板 ID 不存在，请核对后台模板配置'
    if (errCode == 19720736) return '设备型号与模板不匹配'
    if (errCode == 19720726 || errCode == 19720727) return '设备票据失效，请重试'
    if (errCode == 10001 || errCode == 20001) return '模板 ID 未配置'
    if (errCode == 20003) return '单次订阅模板数量超限'
    if (errCode == -12001 || errMsg.indexOf('invalid scope') >= 0) return '设备消息能力未开通，请联系客服'
    if (errMsg.indexOf('cancel') >= 0) return errMsg
    return errMsg
}

function parseDeviceStatus(value : string) : DeviceAuthorizeStatus {
    if (value == 'accept' || value == 'acceptWithAudio' || value == 'acceptWithAlert') return value as DeviceAuthorizeStatus
    if (value == 'reject') return 'reject'
    if (value == 'ban') return 'ban'
    if (value == 'filter') return 'filter'
    return 'reject'
}

/**
 * 查询某模板当前是否处于订阅状态（用户在设置页取消后会变为非 accept）
 */
export function checkTemplateSubscribed(templateId : string) : Promise<boolean> {
    return new Promise((resolve) => {
        if (templateId == '' || !isDeviceSubscribeSupported()) {
            resolve(false)
            return
        }


























        resolve(false)

    })
}

/**
 * 一次性订阅授权（order / expire / share），成功后原样上报后端记账
 * ⚠️ 必须在用户 tap 手势回调链内调用，单次最多 3 个模板
 */
export async function requestSubscribeOnce(bizCodes : Array<string>) : Promise<UTSJSONObject | null> {
    if (bizCodes.length == 0) return null
    let list = readCachedQuota()
    if (list.length == 0) {
        list = await fetchNotifyQuota()
    }
    const tmplIds : Array<string> = []
    for (let i = 0; i < bizCodes.length && tmplIds.length < 3; i++) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].bizCode == bizCodes[i] && list[j].mode == 'once' && list[j].templateId != '') {
                tmplIds.push(list[j].templateId)
                break
            }
        }
    }
    if (tmplIds.length == 0) return null
    return await callOnceSubscribe(tmplIds)
}

function callOnceSubscribe(tmplIds : Array<string>) : Promise<UTSJSONObject | null> {
    return new Promise((resolve) => {















        resolve(null)

    })
}

async function reportOnceResult(result : UTSJSONObject) : Promise<void> {
    try {
        const res = await reportSubscribeResults(result)
        if (!isBusinessSuccessCode(res.code)) {
            console.warn('[notify] 订阅结果上报失败:', res.msg)
        }
    } catch (error) {
        console.warn('[notify] 订阅结果上报异常:', error)
    }
}
