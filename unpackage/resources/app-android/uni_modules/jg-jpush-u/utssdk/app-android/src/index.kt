@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uts.sdk.modules.jgJpushU
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import cn.jiguang.api.JCoreInterface
import cn.jpush.android.api.CmdMessage
import cn.jpush.android.api.CustomMessage
import cn.jpush.android.api.JPushInterface
import cn.jpush.android.api.JPushMessage
import cn.jpush.android.api.NotificationMessage
import cn.jpush.android.api.VoipDataMessage
import cn.jpush.android.data.JPushConfig
import cn.jpush.android.service.JCommonService
import cn.jpush.android.service.JPushMessageReceiver
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import java.util.ArrayList
import kotlin.properties.Delegates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import org.json.JSONObject
open class EventCallBack (
    @JsonNotNull
    open var eventName: String,
    @JsonNotNull
    open var eventData: String,
) : UTSObject()
open class EventCallBackParams (
    open var callback: ((res: EventCallBack) -> Unit)? = null,
) : UTSObject()
open class PushService : JCommonService {
    constructor() : super() {
        console.log("U-PushService", "constructor called")
    }
}
val TAG = "JPUSH-uni-"
open class EventCallbackManager {
    private var callBack: EventCallBackParams? = null
    private var cachedEvents: UTSArray<EventCallBack> = _uA()
    open fun setEventCallBack(param: EventCallBackParams): Unit {
        console.log(TAG, "setEventCallBack")
        this.callBack = param
        if (this.cachedEvents.length > 0) {
            console.log(TAG, "处理缓存事件，数量:", this.cachedEvents.length)
            run {
                var i: Number = 0
                while(i < this.cachedEvents.length){
                    this.triggerCallBack(this.cachedEvents[i])
                    i++
                }
            }
            this.cachedEvents = _uA()
        }
    }
    open fun triggerCallBack(event: EventCallBack): Unit {
        val callBack = this.callBack
        if (callBack != null) {
            console.log(TAG, "触发回调")
            val callback = callBack.callback
            if (callback != null) {
                callback(event)
            } else {
                console.log(TAG, "未设置回调函数，事件内容：", event)
            }
        } else {
            console.log(TAG, "回调未设置，缓存事件")
            this.cachedEvents.push(event)
        }
    }
    open fun getCallBack(): EventCallBackParams? {
        return this.callBack
    }
    open fun hasCallBack(): Boolean {
        val callBack = this.callBack
        return callBack != null && callBack.callback != null
    }
}
val eventCallbackManager = EventCallbackManager()
val init = fun(appKey: String?) {
    JPushInterface.setNotificationCallBackEnable(UTSAndroid.getAppContext(), true)
    if (appKey != null && appKey != "") {
        console.log(TAG, "init with dynamic appKey")
        val config = JPushConfig()
        config.setjAppKey(appKey)
        JPushInterface.init(UTSAndroid.getAppContext(), config)
    } else {
        console.log(TAG, "init with manifest AppKey")
        JPushInterface.init(UTSAndroid.getAppContext())
    }
}
val setDebug = fun(debug: Boolean) {
    console.log(TAG, "setDebug", debug)
    JPushInterface.setDebugMode(debug)
}
val resumePush = fun() {
    console.log(TAG, "resumePush")
    JPushInterface.resumePush(UTSAndroid.getAppContext())
}
val stopPush = fun() {
    console.log(TAG, "stopPush")
    JPushInterface.stopPush(UTSAndroid.getAppContext())
}
val isPushStopped = fun(): Boolean {
    console.log(TAG, "isPushStopped")
    return JPushInterface.isPushStopped(UTSAndroid.getAppContext())
}
val getPushStatus = fun() {
    console.log(TAG, "getPushStatus")
    return JPushInterface.getPushStatus(UTSAndroid.getAppContext())
}
val setChannel = fun(channel: String) {
    console.log(TAG, "setChannel", channel)
    JPushInterface.setChannel(UTSAndroid.getAppContext(), channel)
}
val getRegistrationId = fun(): String {
    console.log(TAG, "getRegistrationId")
    return JPushInterface.getRegistrationID(UTSAndroid.getAppContext())
}
val setLatestNotificationNumber = fun(maxNum: Int) {
    console.log(TAG, "setLatestNotificationNumber", maxNum)
    JPushInterface.setLatestNotificationNumber(UTSAndroid.getAppContext(), maxNum)
}
val clearNotificationAll = fun() {
    console.log(TAG, "clearNotificationAll")
    JPushInterface.clearAllNotifications(UTSAndroid.getAppContext())
}
val clearNotificationById = fun(notificationId: Int) {
    console.log(TAG, "clearNotificationById", notificationId)
    JPushInterface.clearNotificationById(UTSAndroid.getAppContext(), notificationId)
}
val setTags = fun(sequence: Int, tags: UTSArray<String>) {
    console.log(TAG, "setTags", sequence, tags)
    val tagSet = Set<String>()
    run {
        var i: Number = 0
        while(i < tags.length){
            tagSet.add(tags[i])
            i++
        }
    }
    JPushInterface.setTags(UTSAndroid.getAppContext(), sequence, tagSet)
}
val addTags = fun(sequence: Int, tags: UTSArray<String>) {
    console.log(TAG, "addTags", sequence, tags)
    val tagSet = Set<String>()
    run {
        var i: Number = 0
        while(i < tags.length){
            tagSet.add(tags[i])
            i++
        }
    }
    JPushInterface.addTags(UTSAndroid.getAppContext(), sequence, tagSet)
}
val deleteTags = fun(sequence: Int, tags: UTSArray<String>) {
    console.log(TAG, "deleteTags", sequence, tags)
    val tagSet = Set<String>()
    run {
        var i: Number = 0
        while(i < tags.length){
            tagSet.add(tags[i])
            i++
        }
    }
    JPushInterface.deleteTags(UTSAndroid.getAppContext(), sequence, tagSet)
}
val cleanTags = fun(sequence: Int) {
    console.log(TAG, "cleanTags", sequence)
    JPushInterface.cleanTags(UTSAndroid.getAppContext(), sequence)
}
val getAllTags = fun(sequence: Int) {
    console.log(TAG, "getAllTags", sequence)
    JPushInterface.getAllTags(UTSAndroid.getAppContext(), sequence)
}
val checkTagBindState = fun(sequence: Int, tag: String) {
    console.log(TAG, "checkTagBindState", sequence, tag)
    JPushInterface.checkTagBindState(UTSAndroid.getAppContext(), sequence, tag)
}
val setAlias = fun(sequence: Int, alias: String) {
    console.log(TAG, "setAlias", sequence, alias)
    JPushInterface.setAlias(UTSAndroid.getAppContext(), sequence, alias)
}
val deleteAlias = fun(sequence: Int) {
    console.log(TAG, "deleteAlias", sequence)
    JPushInterface.deleteAlias(UTSAndroid.getAppContext(), sequence)
}
val getAlias = fun(sequence: Int) {
    console.log(TAG, "getAlias", sequence)
    JPushInterface.getAlias(UTSAndroid.getAppContext(), sequence)
}
val setMobileNumber = fun(sequence: Int, mobileNumber: String) {
    console.log(TAG, "setMobileNumber", sequence, mobileNumber)
    JPushInterface.setMobileNumber(UTSAndroid.getAppContext(), sequence, mobileNumber)
}
val onResume = fun() {
    console.log(TAG, "onResume")
    JPushInterface.onResume(UTSAndroid.getAppContext())
}
val onPause = fun() {
    console.log(TAG, "onPause")
    JPushInterface.onPause(UTSAndroid.getAppContext())
}
val onFragmentResume = fun(fragmentName: String) {
    console.log(TAG, "onFragmentResume", fragmentName)
    JPushInterface.onFragmentResume(UTSAndroid.getAppContext(), fragmentName)
}
val onFragmentPause = fun(fragmentName: String) {
    console.log(TAG, "onFragmentPause", fragmentName)
    JPushInterface.onFragmentPause(UTSAndroid.getAppContext(), fragmentName)
}
val onKillProcess = fun() {
    console.log(TAG, "onKillProcess")
    JPushInterface.onKillProcess(UTSAndroid.getAppContext())
}
val requestPermission = fun() {
    console.log(TAG, "requestPermission")
    val activity = UTSAndroid.getUniActivity()
    if (activity != null) {
        JPushInterface.requestPermission(activity)
    } else {
        console.log(TAG, "requestPermission: getUniActivity() is null, fallback to getAppContext()")
        JPushInterface.requestPermission(UTSAndroid.getAppContext())
    }
}
val requestRequiredPermission = fun() {
    console.log(TAG, "requestRequiredPermission")
    val activity = UTSAndroid.getUniActivity()
    if (activity != null) {
        JPushInterface.requestRequiredPermission(activity)
    } else {
        console.log(TAG, "requestRequiredPermission: no Activity, skip (call when Activity available)")
    }
}
val isNotificationEnabled = fun(): Number {
    console.log(TAG, "isNotificationEnabled")
    return JPushInterface.isNotificationEnabled(UTSAndroid.getAppContext())
}
val goToAppNotificationSettings = fun() {
    console.log(TAG, "goToAppNotificationSettings")
    JPushInterface.goToAppNotificationSettings(UTSAndroid.getAppContext())
}
val setBadgeNumber = fun(curNum: Int) {
    console.log(TAG, "setBadgeNumber", curNum)
    JPushInterface.setBadgeNumber(UTSAndroid.getAppContext(), curNum)
}
val setSmartPushEnable = fun(isEnable: Boolean) {
    console.log(TAG, "setSmartPushEnable", isEnable)
    JPushInterface.setSmartPushEnable(UTSAndroid.getAppContext(), isEnable)
}
val setGeofenceEnable = fun(isEnable: Boolean) {
    console.log(TAG, "setGeofenceEnable", isEnable)
    JPushInterface.setGeofenceEnable(UTSAndroid.getAppContext(), isEnable)
}
val setDataInsightsEnable = fun(isEnable: Boolean) {
    console.log(TAG, "setDataInsightsEnable", isEnable)
    JPushInterface.setDataInsightsEnable(UTSAndroid.getAppContext(), isEnable)
}
val testCountryCode = fun(code: String) {
    JCoreInterface.testCountryCode(UTSAndroid.getAppContext(), code)
}
val setCountryCode = fun(code: String) {
    JCoreInterface.setCountryCode(UTSAndroid.getAppContext(), code)
}
val setKeepLongConnInBackground = fun(keep: Boolean) {
    console.log(TAG, "setKeepLongConnInBackground", keep)
    JPushInterface.setKeepLongConnInBackground(UTSAndroid.getAppContext(), keep)
}
val requestSubscribeChannel = fun(channelIds: UTSArray<String>) {
    console.log(TAG, "requestSubscribeChannel", channelIds)
    val channels = ArrayList<String>()
    run {
        var i: Number = 0
        while(i < channelIds.length){
            channels.add(channelIds[i])
            i++
        }
    }
    JPushInterface.requestSubscribeChannel(UTSAndroid.getAppContext(), channels)
}
fun setEventCallBack(param: EventCallBackParams): Unit {
    eventCallbackManager.setEventCallBack(param)
}
open class PushMessageReceiver : JPushMessageReceiver {
    constructor() : super() {
        Log.e(PushMessageReceiver.TAG, "PushMessageReceiver constructor called")
    }
    private fun convertJPushMessageToJson(jPushMessage: JPushMessage): String {
        try {
            val jsonObject = JSONObject()
            jsonObject.put("alias", jPushMessage.getAlias())
            jsonObject.put("tags", jPushMessage.getTags())
            jsonObject.put("pros", jPushMessage.getPros())
            jsonObject.put("checkTag", jPushMessage.getCheckTag())
            jsonObject.put("errorCode", jPushMessage.getErrorCode())
            jsonObject.put("tagCheckStateResult", jPushMessage.getTagCheckStateResult())
            jsonObject.put("isTagCheckOperator", jPushMessage.isTagCheckOperator())
            jsonObject.put("sequence", jPushMessage.getSequence())
            jsonObject.put("mobileNumber", jPushMessage.getMobileNumber())
            jsonObject.put("protoType", jPushMessage.getProtoType())
            jsonObject.put("action", jPushMessage.getAction())
            return jsonObject.toString()
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "convertJPushMessageToJson error: " + e.toString())
            return "{}"
        }
    }
    private fun convertCustomMessageToJson(customMessage: CustomMessage): String {
        try {
            val jsonObject = JSONObject()
            jsonObject.put("messageId", customMessage.messageId)
            jsonObject.put("extra", customMessage.extra)
            jsonObject.put("message", customMessage.message)
            jsonObject.put("contentType", customMessage.contentType)
            jsonObject.put("title", customMessage.title)
            jsonObject.put("senderId", customMessage.senderId)
            jsonObject.put("appId", customMessage.appId)
            jsonObject.put("platform", customMessage.platform)
            return jsonObject.toString()
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "convertCustomMessageToJson error: " + e.toString())
            return "{}"
        }
    }
    private fun convertNotificationMessageToJson(message: NotificationMessage): String {
        try {
            val jsonObject = JSONObject()
            jsonObject.put("appkey", message.appkey)
            jsonObject.put("msgId", message.msgId)
            jsonObject.put("notificationContent", message.notificationContent)
            jsonObject.put("notificationAlertType", message.notificationAlertType)
            jsonObject.put("notificationTitle", message.notificationTitle)
            jsonObject.put("notificationSmallIcon", message.notificationSmallIcon)
            jsonObject.put("notificationLargeIcon", message.notificationLargeIcon)
            jsonObject.put("notificationExtras", message.notificationExtras)
            jsonObject.put("notificationStyle", message.notificationStyle)
            jsonObject.put("notificationBuilderId", message.notificationBuilderId)
            jsonObject.put("notificationBigText", message.notificationBigText)
            jsonObject.put("notificationBigPicPath", message.notificationBigPicPath)
            jsonObject.put("notificationInbox", message.notificationInbox)
            jsonObject.put("notificationPriority", message.notificationPriority)
            jsonObject.put("notificationImportance", message.notificationImportance)
            jsonObject.put("notificationCategory", message.notificationCategory)
            jsonObject.put("notificationId", message.notificationId)
            jsonObject.put("developerArg0", message.developerArg0)
            jsonObject.put("platform", message.platform)
            jsonObject.put("appId", message.appId)
            jsonObject.put("notificationType", message.notificationType)
            jsonObject.put("notificationChannelId", message.notificationChannelId)
            jsonObject.put("displayForeground", message.displayForeground)
            jsonObject.put("_webPagePath", message._webPagePath)
            jsonObject.put("isRichPush", message.isRichPush)
            jsonObject.put("richType", message.richType)
            jsonObject.put("deeplink", message.deeplink)
            jsonObject.put("failedAction", message.failedAction)
            jsonObject.put("failedLink", message.failedLink)
            jsonObject.put("targetPkgName", message.targetPkgName)
            jsonObject.put("sspWxAppId", message.sspWxAppId)
            jsonObject.put("sspWmOriginId", message.sspWmOriginId)
            jsonObject.put("sspWmType", message.sspWmType)
            jsonObject.put("isWmDeepLink", message.isWmDeepLink)
            jsonObject.put("inAppMsgType", message.inAppMsgType)
            jsonObject.put("inAppMsgShowType", message.inAppMsgShowType)
            jsonObject.put("inAppMsgShowPos", message.inAppMsgShowPos)
            jsonObject.put("inAppMsgTitle", message.inAppMsgTitle)
            jsonObject.put("inAppMsgContentBody", message.inAppMsgContentBody)
            jsonObject.put("inAppType", message.inAppType)
            jsonObject.put("inAppShowTarget", message.inAppShowTarget)
            jsonObject.put("inAppClickAction", message.inAppClickAction)
            jsonObject.put("inAppExtras", message.inAppExtras)
            return jsonObject.toString()
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "convertNotificationMessageToJson error: " + e.toString())
            return "{}"
        }
    }
    private fun convertCmdMessageToJson(cmdMessage: CmdMessage): String {
        try {
            val jsonObject = JSONObject()
            jsonObject.put("cmd", cmdMessage.cmd)
            jsonObject.put("errorCode", cmdMessage.errorCode)
            jsonObject.put("msg", cmdMessage.msg)
            if (cmdMessage.cmd == 2012) {
                jsonObject.put("extra", this.convertBundleToJson(cmdMessage.extra))
            } else {
                jsonObject.put("extra", cmdMessage.extra)
            }
            return jsonObject.toString()
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "convertCmdMessageToJson error: " + e.toString())
            return "{}"
        }
    }
    private fun convertBundleToJson(bundle: Bundle?): JSONObject {
        try {
            val jsonObject = JSONObject()
            if (bundle != null) {
                val keySet = bundle.keySet()
                val keyList = ArrayList<String>(keySet)
                val size: Int = keyList.size
                run {
                    var i: Int = 0
                    while(i < size){
                        val key = keyList.get(i)
                        jsonObject.put(key, bundle.get(key))
                        i++
                    }
                }
            }
            return jsonObject
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "convertBundleToJson error: " + e.toString())
            return JSONObject()
        }
    }
    private fun triggerEventCallback(eventName: String, eventData: String): Unit {
        val event = EventCallBack(eventName = eventName, eventData = eventData)
        eventCallbackManager.triggerCallBack(event)
    }
    override fun onMessage(context: Context, customMessage: CustomMessage): Unit {
        super.onMessage(context, customMessage)
        Log.e(PushMessageReceiver.TAG, "[onMessage] " + customMessage.toString())
        this.triggerEventCallback("onCustomMessage", this.convertCustomMessageToJson(customMessage))
    }
    override fun onPropertyOperatorResult(context: Context, jPushMessage: JPushMessage): Unit {
        super.onPropertyOperatorResult(context, jPushMessage)
        Log.e(PushMessageReceiver.TAG, "[onPropertyOperatorResult] " + jPushMessage.toString())
        this.triggerEventCallback("onPropertyOperatorResult", this.convertJPushMessageToJson(jPushMessage))
    }
    override fun onNotifyMessageOpened(context: Context, message: NotificationMessage): Unit {
        Log.e(PushMessageReceiver.TAG, "[onNotifyMessageOpened] " + message.toString())
        super.onNotifyMessageOpened(context, message)
        this.triggerEventCallback("onClickMessage", this.convertNotificationMessageToJson(message))
    }
    override fun onNotifyMessageArrived(context: Context, message: NotificationMessage): Unit {
        Log.e(PushMessageReceiver.TAG, "[onNotifyMessageArrived] " + message.toString())
        super.onNotifyMessageArrived(context, message)
        this.triggerEventCallback("onNotifyMessageArrived", this.convertNotificationMessageToJson(message))
    }
    override fun onNotifyMessageDismiss(context: Context, message: NotificationMessage): Unit {
        super.onNotifyMessageDismiss(context, message)
        Log.e(PushMessageReceiver.TAG, "[onNotifyMessageDismiss] " + message.toString())
        this.triggerEventCallback("onNotifyMessageDismiss", this.convertNotificationMessageToJson(message))
    }
    override fun onRegister(context: Context, registrationId: String): Unit {
        super.onRegister(context, registrationId)
        Log.e(PushMessageReceiver.TAG, "[onRegister] " + registrationId)
        this.triggerEventCallback("onRegister", registrationId)
    }
    override fun onConnected(context: Context, isConnected: Boolean): Unit {
        super.onConnected(context, isConnected)
        Log.e(PushMessageReceiver.TAG, "[onConnected] " + isConnected)
        this.triggerEventCallback("onConnected", isConnected.toString())
    }
    override fun onCommandResult(context: Context, cmdMessage: CmdMessage): Unit {
        super.onCommandResult(context, cmdMessage)
        Log.e(PushMessageReceiver.TAG, "[onCommandResult] " + cmdMessage.toString())
        this.triggerEventCallback("onCommandResult", this.convertCmdMessageToJson(cmdMessage))
    }
    override fun onTagOperatorResult(context: Context, jPushMessage: JPushMessage): Unit {
        Log.e(PushMessageReceiver.TAG, "[onTagOperatorResult] " + jPushMessage.toString())
        super.onTagOperatorResult(context, jPushMessage)
        this.triggerEventCallback("onTagOperatorResult", this.convertJPushMessageToJson(jPushMessage))
    }
    override fun onCheckTagOperatorResult(context: Context, jPushMessage: JPushMessage): Unit {
        Log.e(PushMessageReceiver.TAG, "[onCheckTagOperatorResult] " + jPushMessage.toString())
        super.onCheckTagOperatorResult(context, jPushMessage)
        this.triggerEventCallback("onTagOperatorResult", this.convertJPushMessageToJson(jPushMessage))
    }
    override fun onAliasOperatorResult(context: Context, jPushMessage: JPushMessage): Unit {
        Log.e(PushMessageReceiver.TAG, "[onAliasOperatorResult] " + jPushMessage.toString())
        super.onAliasOperatorResult(context, jPushMessage)
        this.triggerEventCallback("onAliasOperatorResult", this.convertJPushMessageToJson(jPushMessage))
    }
    override fun onMobileNumberOperatorResult(context: Context, jPushMessage: JPushMessage): Unit {
        super.onMobileNumberOperatorResult(context, jPushMessage)
        Log.e(PushMessageReceiver.TAG, "[onMobileNumberOperatorResult] " + jPushMessage.toString())
        this.triggerEventCallback("onMobileNumberOperatorResult", this.convertJPushMessageToJson(jPushMessage))
    }
    override fun onNotificationSettingsCheck(context: Context, isOn: Boolean, source: Int): Unit {
        super.onNotificationSettingsCheck(context, isOn, source)
        Log.e(PushMessageReceiver.TAG, "[onNotificationSettingsCheck] isOn:" + isOn + ",source:" + source)
        try {
            val jsonObject = JSONObject()
            jsonObject.put("isOn", isOn)
            jsonObject.put("source", source)
            this.triggerEventCallback("onNotificationSettingsCheck", jsonObject.toString())
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "onNotificationSettingsCheck JSON error: " + e.toString())
            this.triggerEventCallback("onNotificationSettingsCheck", "{\"isOn\":false,\"source\":0}")
        }
    }
    override fun isNeedShowNotification(context: Context, notificationMessage: NotificationMessage, processName: String): Boolean {
        return true
    }
    override fun onNotifyMessageUnShow(context: Context, message: NotificationMessage): Unit {
        super.onNotifyMessageUnShow(context, message)
        Log.e(PushMessageReceiver.TAG, "[onNotifyMessageUnShow] message:" + message.toString())
        this.triggerEventCallback("onNotifyMessageUnShow", this.convertNotificationMessageToJson(message))
    }
    override fun onInAppMessageShow(context: Context, message: NotificationMessage): Unit {
        super.onInAppMessageShow(context, message)
        Log.e(PushMessageReceiver.TAG, "[onInAppMessageShow], " + message.toString())
        this.triggerEventCallback("onInAppMessageShow", this.convertNotificationMessageToJson(message))
    }
    override fun onInAppMessageClick(context: Context, message: NotificationMessage): Unit {
        super.onInAppMessageClick(context, message)
        Log.e(PushMessageReceiver.TAG, "[onInAppMessageClick], " + message.toString())
        this.triggerEventCallback("onInAppMessageClick", this.convertNotificationMessageToJson(message))
    }
    override fun onGeofenceReceived(context: Context, geofences: String): Unit {
        super.onGeofenceReceived(context, geofences)
        Log.e(PushMessageReceiver.TAG, "onGeofenceReceived: " + geofences)
        this.triggerEventCallback("onGeofenceReceived", geofences)
    }
    override fun onMultiActionClicked(context: Context, intent: Intent): Unit {
        super.onMultiActionClicked(context, intent)
        Log.e(PushMessageReceiver.TAG, "[onMultiActionClicked] 用户点击了通知栏按钮")
        try {
            val jsonObject = JSONObject()
            jsonObject.put("action", intent.getAction())
            jsonObject.put("extras", this.convertBundleToJson(intent.getExtras()))
            this.triggerEventCallback("onMultiActionClicked", jsonObject.toString())
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "onMultiActionClicked JSON error: " + e.toString())
            this.triggerEventCallback("onMultiActionClicked", "{\"action\":\"\",\"extras\":{}}")
        }
    }
    override fun onGeofenceRegion(context: Context, geofence: String, longitude: Double, latitude: Double): Unit {
        super.onGeofenceRegion(context, geofence, longitude, latitude)
        Log.e(PushMessageReceiver.TAG, "onGeofenceRegion: " + geofence)
        try {
            val jsonObject = JSONObject()
            jsonObject.put("geofence", geofence)
            jsonObject.put("longitude", longitude)
            jsonObject.put("latitude", latitude)
            this.triggerEventCallback("onGeofenceRegion", jsonObject.toString())
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "onGeofenceRegion JSON error: " + e.toString())
            this.triggerEventCallback("onGeofenceRegion", "{\"geofence\":\"\",\"longitude\":0,\"latitude\":0}")
        }
    }
    override fun onVoipMessage(context: Context, voipDataMessage: VoipDataMessage): Unit {
        super.onVoipMessage(context, voipDataMessage)
        Log.e(PushMessageReceiver.TAG, "[onVoipMessage] " + voipDataMessage.toString())
        try {
            val jsonObject = JSONObject()
            jsonObject.put("messageId", voipDataMessage.getMessageId())
            jsonObject.put("extraData", voipDataMessage.getExtraData())
            jsonObject.put("platform", voipDataMessage.getPlatform())
            this.triggerEventCallback("onVoipMessage", jsonObject.toString())
        }
         catch (e: Throwable) {
            Log.e(PushMessageReceiver.TAG, "onVoipMessage JSON error: " + e.toString())
            this.triggerEventCallback("onVoipMessage", "{\"messageId\":\"\",\"extraData\":\"\",\"platform\":0}")
        }
    }
    companion object {
        private val TAG: String = "U-PushMessageReceiver"
    }
}
