import { bindPushDevice, type PushDeviceBindRequest } from '../api/request.uts'
import { onPushRegistrationIdReady, onPushSessionAuthenticated } from './push.uts'

import AndroidLog from 'android.util.Log'


let initialized = false
let binding = false
let bindingSessionKey = ''
let pendingRegistrationId = ''
let boundSessionKey = ''

function pushBindingDebug(message: string): void {

	AndroidLog.i('PushBinding', message)

	console.log('[PushBinding] ' + message)
}

function pushBindingWarn(message: string): void {

	AndroidLog.w('PushBinding', message)

	console.warn('[PushBinding] ' + message)
}

function getPushBindPlatform(): string {

	return 'android'




	return ''
}

function getDeviceName(): string {
	try {
		const systemInfo = uni.getSystemInfoSync()
		return systemInfo.deviceModel ?? ''
	} catch (error) {
		pushBindingWarn('获取设备型号失败')
		return ''
	}
}

function getAppVersion(): string {
	try {
		return uni.getAppBaseInfo().appVersion ?? ''
	} catch (error) {
		pushBindingWarn('获取应用版本失败')
		return ''
	}
}

function getLoginToken(): string {
	const value = uni.getStorageSync('token')
	return value == null ? '' : value.toString()
}

function bindRegistrationId(registrationId: string): void {
	if (registrationId == '') return
	const token = getLoginToken()
	if (token == '') {
		pushBindingDebug('RegistrationID 已就绪，等待用户登录')
		return
	}
	const platform = getPushBindPlatform()
	if (platform == '') return
	const sessionKey = token + ':' + registrationId
	if (binding) {
		if (bindingSessionKey != sessionKey) pendingRegistrationId = registrationId
		return
	}
	if (boundSessionKey == sessionKey) return

	binding = true
	bindingSessionKey = sessionKey
	const data: PushDeviceBindRequest = {
		registrationId: registrationId,
		platform: platform,
		deviceName: getDeviceName(),
		appVersion: getAppVersion()
	}

	pushBindingDebug('开始绑定推送设备，platform=' + platform)
	bindPushDevice(data).then((response) => {
		if (response.code == 200) {
			boundSessionKey = sessionKey
			pushBindingDebug('推送设备绑定成功，platform=' + platform)
			return
		}
		pushBindingWarn('推送设备绑定失败，稍后将重试。code=' + response.code + ', msg=' + response.msg)
	}).catch(() => {
		pushBindingWarn('推送设备绑定请求失败，稍后将重试。')
	}).finally(() => {
		binding = false
		bindingSessionKey = ''
		const nextRegistrationId = pendingRegistrationId
		pendingRegistrationId = ''
		if (nextRegistrationId != '') bindRegistrationId(nextRegistrationId)
	})
}

export function initPushBinding(): void {
	if (initialized) return
	initialized = true
	onPushRegistrationIdReady((registrationId: string): void => {
		bindRegistrationId(registrationId)
	})
	onPushSessionAuthenticated((registrationId: string): void => {
		if (registrationId == '') {
			pushBindingDebug('用户已登录，但尚无缓存 RegistrationID')
			return
		}
		pushBindingDebug('用户已登录，使用缓存 RegistrationID 绑定推送设备')
		bindRegistrationId(registrationId)
	})
}
