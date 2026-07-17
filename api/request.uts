import { get, post, put, remove } from "./http";

const loginUrl = '/sys/login'
const customList = '/sys/dept/deps'
const customDeviceList = '/group/listByDeptWithDevice?deptId='
const devicePos = '/gps/lastPosition?deptId='
const trackPos = '/gps/trackPos?'
const userinfo = '/sys/user/info'
const addDeviceUrl = '/userDevice/add'
const userDeviceList = '/userDevice/list'
const wechatLogin = '/authLogin'
const changePSW = '/sys/user/password'
const userMsgList = '/usermessage/listForUser'
const msgState = '/usermessage/detail/'
const updateDevice = '/device/update'
const deviceDetail = '/device/info/'
const carType = '/carType/listAll'
const logoutUrl = '/sys/logout'
const groupList = '/group/userGroupList'
const sendcmd = '/command/sendCmd'

const getGeofence = '/geofence'
const deleteGeo = '/geofence/'
const unbindDeviceList = '/device/unbindGeofenceList'
const bindDeviceList = '/device/bindGeofenceList'
const bindGeofence = '/geofence/bind'
const unbindGeofence = '/geofence/unbind'
const deleteDevice = '/userDevice/del'

// 指令相关的URL常量
const cmdActionUrl = '/command/cmdAction'
const cmdByMidUrl = '/command/cmdByMid'
const cmdSendUrl = '/command/sendCmd'
const cmdRecordByIdUrl = '/command/recordById?id='

// 登陆接口
export const login = (data: UTSJSONObject) => {
    return post(loginUrl, data)
}

// 退出接口
export const logout = () => {
    return post(logoutUrl)
}

// 获取客户列表
export const getCustomList = () => {
    return get(customList)
}

// 获取分组设备
export const getCustomDeviceList = (deptId: string) => {
    const params: UTSJSONObject = { deptId } as UTSJSONObject
    return get(customDeviceList, params)
}

// 获取用户分组设备
export const getUserGroupList = () => {
    return get(groupList)
}

// 发送远程指令
type SendCommandResponse = {
    code: number
    msg: string
}

export const sendCommand = (data: UTSJSONObject): Promise<SendCommandResponse> => {
    return post<SendCommandResponse>(sendcmd, data)
}

// 获取设备位置(跟踪也用此接口)
type DevicePositionResponse = {
    code: number
    message: string
    data: UTSJSONObject[]
}

export const getDevicePos = (data: UTSJSONObject): Promise<DevicePositionResponse> => {
    return get<DevicePositionResponse>(devicePos, data)
}

// 轨迹查询。里程查询
export const getTrackPos = (data: UTSJSONObject) => {
    return get(trackPos, data)
}

// 获取用户信息
export const getUserInfo = () => {
    return get(userinfo)
}

// 添加设备
export const addDevice = (data: UTSJSONObject) => {
    return post(addDeviceUrl, data)
}

type BasicResponse = {
    code: number
    msg: string
}

// 删除设备
export const delDevice = (imei: string): Promise<BasicResponse> => {
    const data: UTSJSONObject = { imei } as UTSJSONObject
    return post<BasicResponse>(deleteDevice, data)
}

type UserDeviceListData = {
    list: Array<UTSJSONObject>
}

type UserDeviceListResponse = {
    code: number
    data: UserDeviceListData
}

// 获取用户设备列表
export const getUserDeviceList = (data: UTSJSONObject): Promise<UserDeviceListResponse> => {
    return post<UserDeviceListResponse>(userDeviceList, data)
}

// 微信授权登陆
export const PostWechatlogin = (data: UTSJSONObject) => {
    return post(wechatLogin, data)
}

// 修改密码
export const changePassWord = (data: UTSJSONObject) => {
    return post(changePSW, data)
}

// 获取消息列表
export const getUserMsgList = (data?: UTSJSONObject) => {
    return data != null ? get(userMsgList, data) : get(userMsgList)
}

// 设置消息状态
export const setMsgState = (msgId: string) => {
    return get(`${msgState}${msgId}`)
}

// 编辑设备信息
export const editDeviceInfo = (data: UTSJSONObject) => {
    return put(updateDevice, data)
}

// 获取设备详情
type DeviceDetailResponse = {
    data: UTSJSONObject
}

export const getDeviceDetail = (deviceId: string): Promise<DeviceDetailResponse> => {
    return get<DeviceDetailResponse>(`${deviceDetail}${deviceId}`)
}

// 获取车辆品牌型号
export const getCarType = () => {
    return get(carType)
}

type GeofenceResponse = {
    code: number
    msg: string
    data: Array<UTSJSONObject>
}

type DevicePageData = {
    list: Array<UTSJSONObject>
}

type DevicePageResponse = {
    code: number
    data: DevicePageData
}

// 获取地理围栏列表
export const getGeofenceList = (): Promise<GeofenceResponse> => {
    return get<GeofenceResponse>(getGeofence)
}

// 添加围栏
export const addGeofence = (data: UTSJSONObject): Promise<BasicResponse> => {
    return post<BasicResponse>(getGeofence, data)
}

// 修改围栏
export const updateGeofence = (data: UTSJSONObject): Promise<BasicResponse> => {
    return put<BasicResponse>(getGeofence, data)
}

// 删除围栏
export const deleteGeofence = (id: string): Promise<BasicResponse> => {
    return remove<BasicResponse>(`${deleteGeo}${id}`)
}

// 获取未绑定围栏设备列表
export const getUnboundDevices = (params: UTSJSONObject): Promise<DevicePageResponse> => {
    return get<DevicePageResponse>(unbindDeviceList, params)
}

// 获取围栏内绑定的设备列表
export const getBoundDevices = (params: UTSJSONObject): Promise<DevicePageResponse> => {
    return get<DevicePageResponse>(bindDeviceList, params)
}

// 设备绑定围栏
export const bindDevices = (data: UTSJSONObject): Promise<BasicResponse> => {
    return post<BasicResponse>(bindGeofence, data)
}

// 设备解绑围栏
export const unbindDevices = (data: UTSJSONObject): Promise<BasicResponse> => {
    return remove<BasicResponse>(unbindGeofence, data)
}

type CommandListResponse = {
    code: number
    data: Array<UTSJSONObject>
}

// 命令操作 - 获取指令类型列表
export const getCmdAction = (): Promise<CommandListResponse> => {
    return get<CommandListResponse>(cmdActionUrl)
}

// 根据类型ID获取指令列表
export const getCmdByMid = (data: UTSJSONObject): Promise<CommandListResponse> => {
    return get<CommandListResponse>(cmdByMidUrl, data)
}

type SendCmdResponse = {
    code: number
    msg: string
    data: string
}

// 发送命令
export const sendCmd = (data: UTSJSONObject): Promise<SendCmdResponse> => {
    return post<SendCmdResponse>(cmdSendUrl, data)
}

// 根据指令ID获取指令记录详情
export const getCmdRecordById = (id: string) => {
    return get(`${cmdRecordByIdUrl}${id}`)
}