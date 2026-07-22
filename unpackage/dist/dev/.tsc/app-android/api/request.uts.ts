import { get, post, put, remove } from "./http";
import { asJSONObject, getResponseCode, getResponseDataArray, getResponseDataObject, getResponseMessage } from "./response";

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
const cmdActionUrl = '/command/cmdAction'
const cmdByMidUrl = '/command/cmdByMid'
const cmdSendUrl = '/command/sendCmd'
const cmdRecordByIdUrl = '/command/recordById?id='

export type BasicResponse = { code: number, msg: string }
export type JsonDataResponse = { code: number, msg: string, data: UTSJSONObject }
export type DevicePositionResponse = { code: number, message: string, data: Array<UTSJSONObject> }
export type TrackPosResponse = { code: number, msg: string, data: UTSJSONObject }
export type UserInfoResponse = { code: number, msg: string, data: UTSJSONObject }
export type UserDeviceListData = { list: Array<UTSJSONObject>, totalPage: number, totalCount: number }
export type UserDeviceListResponse = { code: number, msg: string, data: UserDeviceListData }
export type DeviceDetailResponse = { code: number, msg: string, data: UTSJSONObject }
export type GeofenceResponse = { code: number, msg: string, data: Array<UTSJSONObject> }
export type DevicePageData = { list: Array<UTSJSONObject>, totalPage: number, totalCount: number }
export type DevicePageResponse = { code: number, msg: string, data: DevicePageData }
export type CommandListResponse = { code: number, msg: string, data: Array<UTSJSONObject> }
export type SendCmdResponse = { code: number, msg: string, data: string }
export type ChangePasswordResponse = { code: number, msg: string }
export type MessageResponse = { code: number, msg: string, data: UserDeviceListData }

function basicResponse(raw: any): BasicResponse {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response) }
}

function jsonDataResponse(raw: any): JsonDataResponse {
    const response = asJSONObject(raw)
    return {
        code: getResponseCode(response),
        msg: getResponseMessage(response),
        data: getResponseDataObject(response)
    }
}

function devicePageResponse(raw: any): DevicePageResponse {
    const response = asJSONObject(raw)
    const data = getResponseDataObject(response)
    const list = data.getArray<UTSJSONObject>('list')
    return {
        code: getResponseCode(response),
        msg: getResponseMessage(response),
        data: {
            list: list != null ? list : [],
            totalPage: data.getNumber('totalPage', 0),
            totalCount: data.getNumber('totalCount', 0)
        }
    }
}

function userDevicePageResponse(raw: any): UserDeviceListResponse {
    const page = devicePageResponse(raw)
    return {
        code: page.code,
        msg: page.msg,
        data: {
            list: page.data.list,
            totalPage: page.data.totalPage,
            totalCount: page.data.totalCount
        }
    }
}

function messagePageResponse(raw: any): MessageResponse {
    const page = devicePageResponse(raw)
    return {
        code: page.code,
        msg: page.msg,
        data: {
            list: page.data.list,
            totalPage: page.data.totalPage,
            totalCount: page.data.totalCount
        }
    }
}

function userInfoResponse(raw: any): UserInfoResponse {
    const response = jsonDataResponse(raw)
    return { code: response.code, msg: response.msg, data: response.data }
}

function deviceDetailResponse(raw: any): DeviceDetailResponse {
    const response = jsonDataResponse(raw)
    return { code: response.code, msg: response.msg, data: response.data }
}

function changePasswordResponse(raw: any): ChangePasswordResponse {
    const response = basicResponse(raw)
    return { code: response.code, msg: response.msg }
}

export const login = (data: UTSJSONObject): Promise<JsonDataResponse> => post(loginUrl, data).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
export const logout = (): Promise<BasicResponse> => post(logoutUrl).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const getCustomList = (): Promise<JsonDataResponse> => get(customList).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
export const getCustomDeviceList = (deptId: string): Promise<JsonDataResponse> => get(customDeviceList, { deptId } as UTSJSONObject).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
export const getUserGroupList = (): Promise<JsonDataResponse> => get(groupList).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
export const sendCommand = (data: UTSJSONObject): Promise<BasicResponse> => post(sendcmd, data).then((raw: any): BasicResponse => { return basicResponse(raw) })

export const getDevicePos = (data: UTSJSONObject): Promise<DevicePositionResponse> => get(devicePos, data).then((raw: any): DevicePositionResponse => {
    const response = asJSONObject(raw)
    return {
        code: getResponseCode(response),
        message: getResponseMessage(response),
        data: getResponseDataArray(response)
    }
})

export const getTrackPos = (data: UTSJSONObject): Promise<TrackPosResponse> => get(trackPos, data).then((raw: any): TrackPosResponse => {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataObject(response) }
})

export const getUserInfo = (): Promise<UserInfoResponse> => get(userinfo).then((raw: any): UserInfoResponse => {
    return userInfoResponse(raw)
})

export const addDevice = (data: UTSJSONObject): Promise<BasicResponse> => post(addDeviceUrl, data).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const delDevice = (imei: string): Promise<BasicResponse> => post(deleteDevice, { imei } as UTSJSONObject).then((raw: any): BasicResponse => { return basicResponse(raw) })

export const getUserDeviceList = (data: UTSJSONObject): Promise<UserDeviceListResponse> => post(userDeviceList, data).then((raw: any): UserDeviceListResponse => {
    return userDevicePageResponse(raw)
})

export const PostWechatlogin = (data: UTSJSONObject): Promise<JsonDataResponse> => post(wechatLogin, data).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
export const changePassWord = (data: UTSJSONObject): Promise<ChangePasswordResponse> => put(changePSW, data).then((raw: any): ChangePasswordResponse => { return changePasswordResponse(raw) })
export const getUserMsgList = (data?: UTSJSONObject): Promise<MessageResponse> => (data != null ? get(userMsgList, data) : get(userMsgList)).then((raw: any): MessageResponse => {
    return messagePageResponse(raw)
})
export const setMsgState = (msgId: string): Promise<BasicResponse> => get(`${msgState}${msgId}`).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const editDeviceInfo = (data: UTSJSONObject): Promise<BasicResponse> => put(updateDevice, data).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const getDeviceDetail = (deviceId: string): Promise<DeviceDetailResponse> => get(`${deviceDetail}${deviceId}`).then((raw: any): DeviceDetailResponse => {
    return deviceDetailResponse(raw)
})
export const getCarType = (): Promise<JsonDataResponse> => get(carType).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })

export const getGeofenceList = (): Promise<GeofenceResponse> => get(getGeofence).then((raw: any): GeofenceResponse => {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) }
})
export const addGeofence = (data: UTSJSONObject): Promise<BasicResponse> => post(getGeofence, data).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const updateGeofence = (data: UTSJSONObject): Promise<BasicResponse> => put(getGeofence, data).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const deleteGeofence = (id: string): Promise<BasicResponse> => remove(`${deleteGeo}${id}`).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const getUnboundDevices = (params: UTSJSONObject): Promise<DevicePageResponse> => get(unbindDeviceList, params).then((raw: any): DevicePageResponse => { return devicePageResponse(raw) })
export const getBoundDevices = (params: UTSJSONObject): Promise<DevicePageResponse> => get(bindDeviceList, params).then((raw: any): DevicePageResponse => { return devicePageResponse(raw) })
export const bindDevices = (data: UTSJSONObject): Promise<BasicResponse> => post(bindGeofence, data).then((raw: any): BasicResponse => { return basicResponse(raw) })
export const unbindDevices = (data: UTSJSONObject): Promise<BasicResponse> => remove(unbindGeofence, data).then((raw: any): BasicResponse => { return basicResponse(raw) })

export const getCmdAction = (): Promise<CommandListResponse> => get(cmdActionUrl).then((raw: any): CommandListResponse => {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) }
})
export const getCmdByMid = (data: UTSJSONObject): Promise<CommandListResponse> => get(cmdByMidUrl, data).then((raw: any): CommandListResponse => {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response), data: getResponseDataArray(response) }
})
export const sendCmd = (data: UTSJSONObject): Promise<SendCmdResponse> => post(cmdSendUrl, data).then((raw: any): SendCmdResponse => {
    const response = asJSONObject(raw)
    return { code: getResponseCode(response), msg: getResponseMessage(response), data: response.getString('data', '') }
})
export const getCmdRecordById = (id: string): Promise<JsonDataResponse> => get(`${cmdRecordByIdUrl}${id}`).then((raw: any): JsonDataResponse => { return jsonDataResponse(raw) })
