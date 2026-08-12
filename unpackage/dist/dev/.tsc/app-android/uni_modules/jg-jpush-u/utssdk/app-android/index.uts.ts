import JPushInterface from 'cn.jpush.android.api.JPushInterface'
import JCoreInterface from 'cn.jiguang.api.JCoreInterface'
import JPushConfig from 'cn.jpush.android.data.JPushConfig'
import ArrayList from 'java.util.ArrayList'

export * from './PushMessageReceiver.uts'
export { PushService } from "./PushService.uts"


/* 引入 interface.uts 文件中定义的变量 */
import { EventCallBackParams, EventCallBack } from '../interface.uts';

const TAG = "JPUSH-uni-"

// 事件回调管理类
class EventCallbackManager {
	private callBack : EventCallBackParams | null = null
	private cachedEvents : Array<EventCallBack> = []

	setEventCallBack(param : EventCallBackParams) : void {
		__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:21',TAG, "setEventCallBack")
		this.callBack = param

		// 如果有缓存的事件，立即回调
		if (this.cachedEvents.length > 0) {
			__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:26',TAG, "处理缓存事件，数量:", this.cachedEvents.length)
			for (let i = 0; i < this.cachedEvents.length; i++) {
				this.triggerCallBack(this.cachedEvents[i])
			}
			this.cachedEvents = []
		}
	}

	triggerCallBack(event : EventCallBack) : void {
		const callBack = this.callBack
		if (callBack !== null) {
			__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:37',TAG, "触发回调")
			const callback = callBack.callback
			if (callback !== null) {
				callback(event)
			} else {
				__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:42',TAG, "未设置回调函数，事件内容：", event)
			}
		} else {
			__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:45',TAG, "回调未设置，缓存事件")
			this.cachedEvents.push(event)
		}
	}

	getCallBack() : EventCallBackParams | null {
		return this.callBack
	}

	hasCallBack() : boolean {
		const callBack = this.callBack
		return callBack !== null && callBack.callback !== null
	}
}

// 全局事件回调管理器实例
export const eventCallbackManager = new EventCallbackManager()

export const init = function (appKey? : string) {
	JPushInterface.setNotificationCallBackEnable(UTSAndroid.getAppContext(),true)
	if (appKey != null && appKey != '') {
		__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:66',TAG, "init with dynamic appKey")
		// 创建JPushConfig并设置动态 AppKey。
		const config = new JPushConfig()
		config.setjAppKey(appKey)
		JPushInterface.init(UTSAndroid.getAppContext(), config)
	} else {
		__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:72',TAG, "init with manifest AppKey")
		JPushInterface.init(UTSAndroid.getAppContext())
	}
}

export const setDebug = function (debug : boolean) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:78',TAG, "setDebug", debug)
	JPushInterface.setDebugMode(debug)
}

export const resumePush = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:83',TAG, "resumePush")
	JPushInterface.resumePush(UTSAndroid.getAppContext())
}

export const stopPush = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:88',TAG, "stopPush")
	JPushInterface.stopPush(UTSAndroid.getAppContext())
}

export const isPushStopped = function () : boolean {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:93',TAG, "isPushStopped")
	return JPushInterface.isPushStopped(UTSAndroid.getAppContext())
}

export const getPushStatus = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:98',TAG, "getPushStatus")
	return JPushInterface.getPushStatus(UTSAndroid.getAppContext())
}


export const setChannel = function (channel : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:104',TAG, "setChannel", channel)
	JPushInterface.setChannel(UTSAndroid.getAppContext(), channel)
}

export const getRegistrationId = function () : string {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:109',TAG, "getRegistrationId")
	return JPushInterface.getRegistrationID(UTSAndroid.getAppContext())
}


export const setLatestNotificationNumber = function (maxNum : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:115',TAG, "setLatestNotificationNumber", maxNum)
	JPushInterface.setLatestNotificationNumber(UTSAndroid.getAppContext(), maxNum)
}

export const clearNotificationAll = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:120',TAG, "clearNotificationAll")
	JPushInterface.clearAllNotifications(UTSAndroid.getAppContext())
}

export const clearNotificationById = function (notificationId : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:125',TAG, "clearNotificationById", notificationId)
	JPushInterface.clearNotificationById(UTSAndroid.getAppContext(), notificationId)
}

export const setTags = function (sequence : Int, tags : string[]) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:130',TAG, "setTags", sequence, tags)
	// 将string[]转换为Set<string>以适配Android SDK
	const tagSet = new Set<string>()
	for (let i = 0; i < tags.length; i++) {
		tagSet.add(tags[i])
	}
	JPushInterface.setTags(UTSAndroid.getAppContext(), sequence, tagSet)
}

export const addTags = function (sequence : Int, tags : string[]) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:140',TAG, "addTags", sequence, tags)
	// 将string[]转换为Set<string>以适配Android SDK
	const tagSet = new Set<string>()
	for (let i = 0; i < tags.length; i++) {
		tagSet.add(tags[i])
	}
	JPushInterface.addTags(UTSAndroid.getAppContext(), sequence, tagSet)
}

export const deleteTags = function (sequence : Int, tags : string[]) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:150',TAG, "deleteTags", sequence, tags)
	// 将string[]转换为Set<string>以适配Android SDK
	const tagSet = new Set<string>()
	for (let i = 0; i < tags.length; i++) {
		tagSet.add(tags[i])
	}
	JPushInterface.deleteTags(UTSAndroid.getAppContext(), sequence, tagSet)
}

export const cleanTags = function (sequence : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:160',TAG, "cleanTags", sequence)
	JPushInterface.cleanTags(UTSAndroid.getAppContext(), sequence)
}

export const getAllTags = function (sequence : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:165',TAG, "getAllTags", sequence)
	JPushInterface.getAllTags(UTSAndroid.getAppContext(), sequence)
}

export const checkTagBindState = function (sequence : Int, tag : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:170',TAG, "checkTagBindState", sequence, tag)
	JPushInterface.checkTagBindState(UTSAndroid.getAppContext(), sequence, tag)
}

export const setAlias = function (sequence : Int, alias : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:175',TAG, "setAlias", sequence, alias)
	JPushInterface.setAlias(UTSAndroid.getAppContext(), sequence, alias)
}

export const deleteAlias = function (sequence : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:180',TAG, "deleteAlias", sequence)
	JPushInterface.deleteAlias(UTSAndroid.getAppContext(), sequence)
}

export const getAlias = function (sequence : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:185',TAG, "getAlias", sequence)
	JPushInterface.getAlias(UTSAndroid.getAppContext(), sequence)
}

export const setMobileNumber = function (sequence : Int, mobileNumber : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:190',TAG, "setMobileNumber", sequence, mobileNumber)
	JPushInterface.setMobileNumber(UTSAndroid.getAppContext(), sequence, mobileNumber)
}

export const onResume = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:195',TAG, "onResume")
	JPushInterface.onResume(UTSAndroid.getAppContext())
}

export const onPause = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:200',TAG, "onPause")
	JPushInterface.onPause(UTSAndroid.getAppContext())
}

export const onFragmentResume = function (fragmentName : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:205',TAG, "onFragmentResume", fragmentName)
	JPushInterface.onFragmentResume(UTSAndroid.getAppContext(), fragmentName)
}

export const onFragmentPause = function (fragmentName : string) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:210',TAG, "onFragmentPause", fragmentName)
	JPushInterface.onFragmentPause(UTSAndroid.getAppContext(), fragmentName)
}

export const onKillProcess = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:215',TAG, "onKillProcess")
	JPushInterface.onKillProcess(UTSAndroid.getAppContext())
}

export const requestPermission = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:220',TAG, "requestPermission")
	const activity = UTSAndroid.getUniActivity()
	if (activity != null) {
		JPushInterface.requestPermission(activity)
	} else {
		__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:225',TAG, "requestPermission: getUniActivity() is null, fallback to getAppContext()")
		JPushInterface.requestPermission(UTSAndroid.getAppContext())
	}
}

/**
 * 申请必须权限（仅 Android，如 POST_NOTIFICATIONS，Android 13+）
 * 建议在 Activity 可见时调用（如首屏 onReady），以便正确弹出系统权限框。
 */
export const requestRequiredPermission = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:235',TAG, "requestRequiredPermission")
	const activity = UTSAndroid.getUniActivity()
	if (activity != null) {
		JPushInterface.requestRequiredPermission(activity)
	} else {
		__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:240',TAG, "requestRequiredPermission: no Activity, skip (call when Activity available)")
	}
}

export const isNotificationEnabled = function () : number {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:245',TAG, "isNotificationEnabled")
	return JPushInterface.isNotificationEnabled(UTSAndroid.getAppContext())
}

export const goToAppNotificationSettings = function () {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:250',TAG, "goToAppNotificationSettings")
	JPushInterface.goToAppNotificationSettings(UTSAndroid.getAppContext())
}

export const setBadgeNumber = function (curNum : Int) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:255',TAG, "setBadgeNumber", curNum)
	JPushInterface.setBadgeNumber(UTSAndroid.getAppContext(), curNum)
}

export const setSmartPushEnable = function (isEnable : boolean) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:260',TAG, "setSmartPushEnable", isEnable)
	JPushInterface.setSmartPushEnable(UTSAndroid.getAppContext(), isEnable)
}

export const setGeofenceEnable = function (isEnable : boolean) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:265',TAG, "setGeofenceEnable", isEnable)
	JPushInterface.setGeofenceEnable(UTSAndroid.getAppContext(), isEnable)
}

export const setDataInsightsEnable = function (isEnable : boolean) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:270',TAG, "setDataInsightsEnable", isEnable)
	JPushInterface.setDataInsightsEnable(UTSAndroid.getAppContext(), isEnable)
}

export const testCountryCode = function (code:string) {
	JCoreInterface.testCountryCode(UTSAndroid.getAppContext(), code)
}

export const setCountryCode = function (code:string) {
	JCoreInterface.setCountryCode(UTSAndroid.getAppContext(), code)
}

export const setKeepLongConnInBackground = function (keep : boolean) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:283',TAG, "setKeepLongConnInBackground", keep)
	JPushInterface.setKeepLongConnInBackground(UTSAndroid.getAppContext(), keep)
}

/**
 * 请求订阅小米推送消息渠道。
 * 仅已集成并注册小米通道的小米设备支持，单次最多处理 3 个 channelId。
 * 调用结果通过 onCommandResult 回调返回，cmd 为 2012。
 */
export const requestSubscribeChannel = function (channelIds : string[]) {
	__f__('log','at uni_modules/jg-jpush-u/utssdk/app-android/index.uts:293',TAG, "requestSubscribeChannel", channelIds)
	const channels = new ArrayList<string>()
	for (let i = 0; i < channelIds.length; i++) {
		channels.add(channelIds[i])
	}
	JPushInterface.requestSubscribeChannel(UTSAndroid.getAppContext(), channels)
}

@UTSJS.keepAlive
export function setEventCallBack(param : EventCallBackParams) : void {
	eventCallbackManager.setEventCallBack(param)
}
