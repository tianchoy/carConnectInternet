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
export const sendCommand = (data: UTSJSONObject) => {
    return post(sendcmd, data)
}

// 获取设备位置(跟踪也用此接口)
export const getDevicePos = (data: UTSJSONObject) => {
    return get(devicePos, data)
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

// 删除设备
export const delDevice = (imei: string) => {
    const data: UTSJSONObject = { imei } as UTSJSONObject
    return post(deleteDevice, data)
}

// 获取用户设备列表
export const getUserDeviceList = (data: UTSJSONObject) => {
    return post(userDeviceList, data)
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
export const getDeviceDetail = (deviceId: string) => {
    return get(`${deviceDetail}${deviceId}`)
}

// 获取车辆品牌型号
export const getCarType = () => {
    return get(carType)
}

// 获取地理围栏列表
export const getGeofenceList = () => {
    return get(getGeofence)
}

// 添加围栏
export const addGeofence = (data: UTSJSONObject) => {
    return post(getGeofence, data)
}

// 修改围栏
export const updateGeofence = (data: UTSJSONObject) => {
    return put(getGeofence, data)
}

// 删除围栏
export const deleteGeofence = (id: string) => {
    return remove(`${deleteGeo}${id}`)
}

// 获取未绑定围栏设备列表
export const getUnboundDevices = (params: UTSJSONObject) => {
    return get(unbindDeviceList, params)
}

// 获取围栏内绑定的设备列表
export const getBoundDevices = (params: UTSJSONObject) => {
    return get(bindDeviceList, params)
}

// 设备绑定围栏
export const bindDevices = (data: UTSJSONObject) => {
    return post(bindGeofence, data)
}

// 设备解绑围栏
export const unbindDevices = (data: UTSJSONObject) => {
    return remove(unbindGeofence, data)
}

// 命令操作 - 获取指令类型列表
export const getCmdAction = () => {
    return get(cmdActionUrl)
}

// 根据类型ID获取指令列表
export const getCmdByMid = (data: UTSJSONObject) => {
    return get(cmdByMidUrl, data)
}

// 发送命令
export const sendCmd = (data: UTSJSONObject) => {
    return post(cmdSendUrl, data)
}

// 根据指令ID获取指令记录详情
export const getCmdRecordById = (id: string) => {
    return get(`${cmdRecordByIdUrl}${id}`)
}