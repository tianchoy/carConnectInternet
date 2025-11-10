import http from "./http";

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

// 登陆接口
export const login = (data: UTSJSONObject) => {
    return http.post(loginUrl, data)
}

// 退出接口
export const logout = () => {
    return http.post(logoutUrl)
}

// 获取客户列表
export const getCustomList = () => {
    return http.get(customList)
}

// 获取分组设备
export const getCustomDeviceList = (deptId: string) => {
    return http.get(customDeviceList, { deptId })
}

// 获取用户分组设备
export const getUserGroupList = () => {
    return http.get(groupList)
}

// 发送远程指令
export const sendCommand = (data: object) => {
    return http.post(sendcmd, data)
}

// 获取设备位置(跟踪也用此接口)
export const getDevicePos = (data: object) => {
    return http.get(devicePos, data)
}

// 轨迹查询。里程查询
export const getTrackPos = (data: object) => {
    return http.get(trackPos, data)
}

// 获取用户信息
export const getUserInfo = () => {
    return http.get(userinfo)
}

// 添加设备
export const addDevice = (data: object) => {
    return http.post(addDeviceUrl, data)
}

// 删除设备
export const delDevice = (imei: string) => {
    return http.post(deleteDevice, { imei })
}

// 获取用户设备列表
export const getUserDeviceList = (data: object) => {
    return http.post(userDeviceList, data)
}

// 微信授权登陆
export const PostWechatlogin = (data: object) => {
    return http.post(wechatLogin, data)
}

// 修改密码
export const changePassWord = (data: object) => {
    return http.post(changePSW, data)
}

// 获取消息列表
export const getUserMsgList = () => {
    return http.get(userMsgList)
}

// 设置消息状态
export const setMsgState = (msgId: string) => {
    return http.get(`${msgState}${msgId}`);
};

// 编辑设备信息
export const editDeviceInfo = (data: object) => {
    return http.put(updateDevice, data)
}

// 获取设备详情
export const getDeviceDetail = (deviceId: string) => {
    return http.get(`${deviceDetail}${deviceId}`)
}

// 获取车辆品牌型号
export const getCarType = () => {
    return http.get(carType)
}

// 获取地理围栏列表
export const getGeofenceList = () => {
    return http.get(getGeofence)
}

// 添加围栏
export const addGeofence = (data: object) => {
    return http.post(getGeofence, data)
}

// 修改围栏
export const updateGeofence = (data: object) => {
    return http.put(getGeofence, data)
}

// 删除围栏
export const deleteGeofence = (id: string) => {
    return http.delete(`${deleteGeo}${id}`)
}

// 获取未绑定围栏设备列表
export const getUnboundDevices = (params: { pageNum: number, pageSize: number }) => {
    return http.get(unbindDeviceList, params)
}

// 获取围栏内绑定的设备列表
export const getBoundDevices = (params: { pageNum: number, pageSize: number, geoId: string }) => {
    return http.get(bindDeviceList, params)
}

// 设备绑定围栏
export const bindDevices = (data: { geofenceId: string, imeis: string[] }) => {
    return http.post(bindGeofence, data)
}

// 设备解绑围栏
export const unbindDevices = (data: { geofenceId: string, imeis: string[] }) => {
    return http.delete(unbindGeofence, data)
}