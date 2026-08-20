'use strict'
/**
 * uniCloud 云函数：univerify
 * ------------------------------------------------------------------
 * 作用：接收 ruoyi-app 后端 URL化调用（POST JSON），校验 HMAC-SHA256 签名后
 *       调用 uniCloud.getPhoneNumber 用 openId + accessToken 换取真实手机号，
 *       返回 {code, phoneNumber} 给后端。
 *
 * 部署：
 *   1. 在 uniCloud 控制台创建服务空间，右键本目录「上传部署」；
 *   2. 云函数详情里「URL化」生成 HTTPS 地址，填到 ruoyi-app 的 univerify.url；
 *   3. 把下方 SECRET 改成与 ruoyi-app 配置 univerify.secret 完全一致的密钥
 *      （生产建议用云函数环境变量存储，避免明文）。
 *
 * 约定：
 *   - 后端签名参数按 key 字母序：access_token / appid / openid
 *     sign = HMAC_SHA256(secret, "access_token=..&appid=..&openid=..")
 *   - 请求体：{ access_token, appid, openid, sign }
 *   - DCloud 已废弃 apiKey/apiSecret，本云函数不使用、也不接受这两个参数。
 *   - appid：URL化方式云函数内 getPhoneNumber 必填（callFunction 方式可由 context.APPID 自动获取）。
 */
const crypto = require('crypto')

// 与 ruoyi-app 配置 univerify.secret 保持一致；生产请改用云函数环境变量
const SECRET = '7c61a8e1c84d627e77d16d0f11c791f6a8418fb44fe20393089c5f099b8a7f33'

exports.main = async function (event, context) {
  // URL化调用：event.body 为 JSON 字符串（可能 base64 编码）
  let body = event.body
  if (event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString('utf-8')
  }
  let params
  try {
    params = JSON.parse(body || '{}')
  } catch (e) {
    return { code: 4001, message: '请求参数解析失败' }
  }
  const { access_token, openid, appid, sign } = params || {}

  if (!access_token || !openid || !appid) {
    return { code: 4001, message: '缺少 access_token/openid/appid' }
  }

  // 1) HMAC-SHA256 签名校验（参数按 key 字母序拼接）
  const signParams = { access_token, appid, openid }
  const signStr = Object.keys(signParams).sort()
    .map(k => `${k}=${signParams[k]}`)
    .join('&')
  const expected = crypto.createHmac('sha256', SECRET).update(signStr).digest('hex')
  if (!sign || sign !== expected) {
    return { code: 4001, message: '非法访问' }
  }

  // 2) 调用 DCloud 取号（apiKey/apiSecret 已废弃，仅需 appid + 凭证）
  try {
    const res = await uniCloud.getPhoneNumber({
      provider: 'univerify',
      appid: appid,            // URL化方式必填
      access_token: access_token,
      openid: openid
    })
    // res: { code:0, success:true, phoneNumber:'138xxxx1234' }
    if (res.code !== 0) {
      // 透传 DCloud 错误码给后端（后端按 code 映射友好提示并触发降级）
      return { code: res.code, message: res.message || '换取手机号失败' }
    }
    // 仅返回手机号给可信自有后端（不返回前端）
    return { code: 0, phoneNumber: res.phoneNumber }
  } catch (e) {
    return { code: 5000, message: (e && e.message) || '取号异常' }
  }
}
