@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
import android.app.Activity
import android.os.Build
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import java.util.TimeZone
import kotlin.properties.Delegates
import android.util.Log as AndroidLog
import uts.sdk.modules.jgJpushU.EventCallBackParams
import uts.sdk.modules.externalMapNavigation.ExternalMapNavigationParams
import io.dcloud.uniapp.extapi.exit as uni_exit
import io.dcloud.uniapp.extapi.getAppBaseInfo as uni_getAppBaseInfo
import io.dcloud.uniapp.extapi.getPushClientId as uni_getPushClientId
import io.dcloud.uniapp.extapi.getStorageSync as uni_getStorageSync
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import uts.sdk.modules.jgJpushU.init as initAndroidJPush
import uts.sdk.modules.jgJpushU.setEventCallBack as setJPushEventCallBack
import uts.sdk.modules.jgJpushU.getRegistrationId as getAndroidJPushRegistrationId
import uts.sdk.modules.jgJpushU.setBadgeNumber as setAndroidJPushBadgeNumber
import uts.sdk.modules.jgJpushUHuawei.init as initHuaweiJPushVendor
import io.dcloud.uniapp.extapi.onPushMessage as uni_onPushMessage
import uts.sdk.modules.externalMapNavigation.openExternalMap
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.redirectTo as uni_redirectTo
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.request as uni_request
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showModal as uni_showModal
import io.dcloud.uniapp.extapi.showToast as uni_showToast
import io.dcloud.uniapp.extapi.switchTab as uni_switchTab
val runBlock1 = run {
    __uniConfig.getAppStyles = fun(): Map<String, Map<String, Map<String, Any>>> {
        return GenApp.styles
    }
}
typealias PushProviderName = String
typealias PushEventKind = String
open class NormalizedPushEvent (
    @JsonNotNull
    open var provider: PushProviderName,
    @JsonNotNull
    open var kind: PushEventKind,
    @JsonNotNull
    open var payload: Any,
) : UTSObject()
typealias PushRegistrationIdReadyListener = (registrationId: String) -> Unit
typealias PushSessionAuthenticatedListener = (registrationId: String) -> Unit
val pushRegistrationIdReadyListeners: UTSArray<PushRegistrationIdReadyListener> = _uA()
val pushSessionAuthenticatedListeners: UTSArray<PushSessionAuthenticatedListener> = _uA()
val PUSH_PROVIDER_KEY = "push_provider"
val PUSH_LOCAL_PROVIDER_OVERRIDE_KEY = "push_local_provider_override"
val PUSH_PENDING_MESSAGE_ID_KEY_PREFIX = "push.pending_message_id."
val PUSH_MESSAGE_STALE_KEY_PREFIX = "push.message_stale."
val PUSH_SESSION_KEY_PREFIX = "push.session."
val PUSH_REGISTRATION_ID_KEY_PREFIX = "push.registration_id."
val LEGACY_PUSH_CLIENT_ID_KEY = "push_client_id"
val LEGACY_PUSH_PENDING_MESSAGE_ID_KEY = "push_pending_message_id"
val LEGACY_PUSH_MESSAGE_STALE_KEY = "push_message_stale"
val LEGACY_PUSH_SESSION_KEY = "push_session_key"
val PUSH_REGISTRATION_ID_MAX_RETRY_COUNT: Number = 5
val PUSH_REGISTRATION_ID_RETRY_DELAY: Number = 3000
val PUSH_REGISTRATION_ID_REQUEST_TIMEOUT: Number = 18000
val DEFAULT_PUSH_PROVIDER: PushProviderName = "jpush"
val ENABLE_LOCAL_PROVIDER_SWITCH = false
fun registrationIdKey(provider: PushProviderName): String {
    return PUSH_REGISTRATION_ID_KEY_PREFIX + provider
}
fun pendingMessageIdKey(provider: PushProviderName): String {
    return PUSH_PENDING_MESSAGE_ID_KEY_PREFIX + provider
}
fun messageStaleKey(provider: PushProviderName): String {
    return PUSH_MESSAGE_STALE_KEY_PREFIX + provider
}
fun sessionKey(provider: PushProviderName): String {
    return PUSH_SESSION_KEY_PREFIX + provider
}
fun pushDebug(provider: PushProviderName, message: String): Unit {
    AndroidLog.e("PushManager", "[" + provider + "] " + message)
    console.error("[PushManager][" + provider + "] " + message)
}
fun notifyPushRegistrationIdReady(registrationId: String): Unit {
    run {
        var index: Number = 0
        while(index < pushRegistrationIdReadyListeners.length){
            try {
                pushRegistrationIdReadyListeners[index](registrationId)
            }
             catch (error: Throwable) {
                console.error("[PushManager] RegistrationID 就绪监听执行失败:", error)
            }
            index++
        }
    }
}
fun notifyPushSessionAuthenticated(registrationId: String): Unit {
    run {
        var index: Number = 0
        while(index < pushSessionAuthenticatedListeners.length){
            try {
                pushSessionAuthenticatedListeners[index](registrationId)
            }
             catch (error: Throwable) {
                console.error("[PushManager] 已认证会话监听执行失败:", error)
            }
            index++
        }
    }
}
fun stringValue(value: Any): String {
    if (value == null) {
        return ""
    }
    return value.toString()
}
fun storageString(key: String): String {
    val value = uni_getStorageSync(key)
    return if (value == null) {
        ""
    } else {
        stringValue(value)
    }
}
fun payloadValue(payload: Any, key: String): String {
    if (payload == null) {
        return ""
    }
    if (UTSAndroid.`typeof`(payload) == "string") {
        try {
            val parsedPayload = JSON.parse<UTSJSONObject>(payload as String)
            if (parsedPayload == null) {
                return ""
            }
            return payloadValue(parsedPayload, key)
        }
         catch (error: Throwable) {
            return ""
        }
    }
    try {
        val kObject = payload as UTSJSONObject
        return kObject.getString(key, "")
    }
     catch (error: Throwable) {
        return ""
    }
}
fun nestedPayloadValue(payload: Any, key: String): String {
    var value = payloadValue(payload, key)
    if (value != "") {
        return value
    }
    val nestedKeys = _uA(
        "data",
        "extra",
        "notificationExtras",
        "extras"
    )
    run {
        var index: Number = 0
        while(index < nestedKeys.length){
            val nestedValue = payloadValue(payload, nestedKeys[index])
            if (nestedValue == "") {
                index++
                continue
            }
            value = payloadValue(nestedValue, key)
            if (value != "") {
                return value
            }
            index++
        }
    }
    return ""
}
fun pushMessageId(payload: Any): String {
    var id = nestedPayloadValue(payload, "messageId")
    if (id == "") {
        id = nestedPayloadValue(payload, "message_id")
    }
    if (id == "") {
        id = nestedPayloadValue(payload, "id")
    }
    return id
}
fun selectedPushProvider(): PushProviderName {
    return DEFAULT_PUSH_PROVIDER
}
fun migrateLegacyStorage(provider: PushProviderName): Unit {
    if (provider != "unipush") {
        return
    }
    if (storageString(registrationIdKey(provider)) == "") {
        val legacyId = storageString(LEGACY_PUSH_CLIENT_ID_KEY)
        if (legacyId != "") {
            uni_setStorageSync(registrationIdKey(provider), legacyId)
        }
    }
    if (storageString(pendingMessageIdKey(provider)) == "") {
        val legacyPendingId = storageString(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY)
        if (legacyPendingId != "") {
            uni_setStorageSync(pendingMessageIdKey(provider), legacyPendingId)
        }
    }
    if (storageString(messageStaleKey(provider)) == "") {
        val legacyStale = storageString(LEGACY_PUSH_MESSAGE_STALE_KEY)
        if (legacyStale != "") {
            uni_setStorageSync(messageStaleKey(provider), legacyStale)
        }
    }
    if (storageString(sessionKey(provider)) == "") {
        val legacySession = storageString(LEGACY_PUSH_SESSION_KEY)
        if (legacySession != "") {
            uni_setStorageSync(sessionKey(provider), legacySession)
        }
    }
    uni_removeStorageSync(LEGACY_PUSH_CLIENT_ID_KEY)
    uni_removeStorageSync(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY)
    uni_removeStorageSync(LEGACY_PUSH_MESSAGE_STALE_KEY)
    uni_removeStorageSync(LEGACY_PUSH_SESSION_KEY)
}
interface PushAdapter {
    var provider: PushProviderName
    fun init(onEvent: (event: NormalizedPushEvent) -> Unit, onRegistrationAvailable: () -> Unit, onRegistrationId: (registrationId: String, reason: String) -> Unit)
    fun getRegistrationId(): String
}
open class UniPushAdapter : PushAdapter {
    override var provider: PushProviderName = "unipush"
    private var initialized = false
    override fun init(onEvent: (event: NormalizedPushEvent) -> Unit, onRegistrationAvailable: () -> Unit, onRegistrationId: (registrationId: String, reason: String) -> Unit): Unit {
        if (this.initialized) {
            return
        }
        this.initialized = true
        try {
            uni_onPushMessage(fun(event: Any){
                val eventType = payloadValue(event, "type").toLowerCase()
                onEvent(NormalizedPushEvent(provider = this.provider, kind = if (eventType == "click") {
                    "clicked"
                } else {
                    "received"
                }
                , payload = event))
            }
            , null)
            onRegistrationAvailable()
        }
         catch (error: Throwable) {
            pushDebug(this.provider, "注册 UniPush 监听失败: " + error.toString())
        }
    }
    override fun getRegistrationId(): String {
        return ""
    }
    open fun requestRegistrationId(onSuccess: (registrationId: String) -> Unit, onFailure: (reason: String) -> Unit): Unit {
        try {
            uni_getPushClientId(GetPushClientIdOptions(success = fun(result){
                val registrationId = result.cid
                if (registrationId == "") {
                    onFailure("CID 为空")
                    return
                }
                pushDebug(this.provider, "UniPush CID 已就绪")
                onSuccess(registrationId)
            }
            , fail = fun(error: Any){
                onFailure("调用失败: " + error.toString())
            }
            ))
        }
         catch (error: Throwable) {
            onFailure("调用异常: " + error.toString())
        }
    }
}
open class JPushAdapter : PushAdapter {
    override var provider: PushProviderName = "jpush"
    private var initialized = false
    override fun init(onEvent: (event: NormalizedPushEvent) -> Unit, onRegistrationAvailable: () -> Unit, onRegistrationId: (registrationId: String, reason: String) -> Unit): Unit {
        if (this.initialized) {
            return
        }
        this.initialized = true
        try {
            setJPushEventCallBack(EventCallBackParams(callback = fun(event){
                val eventName = event.eventName
                val eventData = event.eventData
                if (eventName == "onRegister" || (eventName == "onConnected" && eventData == "true")) {
                    onRegistrationAvailable()
                    return
                }
                if (eventName == "onNotifyMessageArrived") {
                    onEvent(NormalizedPushEvent(provider = this.provider, kind = "received", payload = eventData))
                    return
                }
                if (eventName == "onCustomMessage") {
                    onEvent(NormalizedPushEvent(provider = this.provider, kind = "custom", payload = eventData))
                    return
                }
                if (eventName == "onClickMessage") {
                    onEvent(NormalizedPushEvent(provider = this.provider, kind = "clicked", payload = eventData))
                }
            }
            ))
            initHuaweiJPushVendor()
            initAndroidJPush("")
            onRegistrationAvailable()
        }
         catch (error: Throwable) {
            pushDebug(this.provider, "初始化 JPush 失败: " + error.toString())
        }
    }
    override fun getRegistrationId(): String {
        try {
            return getAndroidJPushRegistrationId()
        }
         catch (error: Throwable) {
            pushDebug(this.provider, "获取 RegistrationID 失败: " + error.toString())
        }
        return ""
    }
}
open class PushManager {
    private var provider: PushProviderName = "unipush"
    private var adapter: PushAdapter? = null
    private var initialized = false
    private var registrationRequesting = false
    private var registrationRetryCount: Number = 0
    private var registrationRetryTimer: Number = 0
    private var registrationRequestTimeout: Number = 0
    private var registrationRequestGeneration: Number = 0
    open fun init(): Unit {
        val selectedProvider = selectedPushProvider()
        if (this.initialized && this.provider == selectedProvider) {
            this.refreshRegistrationId()
            return
        }
        if (this.initialized) {
            pushDebug(this.provider, "运行中不能切换推送 provider，请重启应用后生效")
            return
        }
        this.provider = selectedProvider
        pushDebug(this.provider, "已选择推送 provider: " + this.provider)
        migrateLegacyStorage(this.provider)
        uni_setStorageSync(PUSH_PROVIDER_KEY, this.provider)
        this.adapter = if (this.provider == "jpush") {
            JPushAdapter()
        } else {
            UniPushAdapter()
        }
        this.initialized = true
        this.adapter!!.init(fun(event){
            this.handlePushEvent(event)
        }
        , fun(){
            this.refreshRegistrationId()
        }
        , fun(registrationId, reason){
            if (!this.initialized || this.provider != "jpush") {
                return
            }
            if (registrationId != "") {
                this.saveRegistrationId(registrationId)
                return
            }
            if (reason != "") {
                pushDebug(this.provider, reason)
                this.scheduleRegistrationRetry(reason)
            }
        }
        )
        this.refreshRegistrationId()
    }
    open fun refreshRegistrationId(): Unit {
        if (!this.initialized) {
            this.init()
        }
        if (this.adapter == null || this.registrationRequesting) {
            return
        }
        if (this.provider == "unipush") {
            this.requestUniPushRegistrationId(this.adapter as UniPushAdapter)
            return
        }
        this.saveJPushRegistrationId()
    }
    open fun markAuthenticated(): Unit {
        if (!this.initialized) {
            this.init()
        }
        uni_setStorageSync(sessionKey(this.provider), "authenticated")
        val cachedRegistrationId = this.getCachedRegistrationId()
        this.refreshRegistrationId()
        notifyPushSessionAuthenticated(cachedRegistrationId)
    }
    open fun clearSessionState(): Unit {
        uni_removeStorageSync(sessionKey(this.provider))
        uni_removeStorageSync(pendingMessageIdKey(this.provider))
        uni_removeStorageSync(messageStaleKey(this.provider))
        uni_removeStorageSync(LEGACY_PUSH_SESSION_KEY)
        uni_removeStorageSync(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY)
        uni_removeStorageSync(LEGACY_PUSH_MESSAGE_STALE_KEY)
    }
    open fun consumePendingMessageId(): String {
        val value = storageString(pendingMessageIdKey(this.provider))
        uni_removeStorageSync(pendingMessageIdKey(this.provider))
        return value
    }
    open fun consumeStaleFlag(): Boolean {
        val value = storageString(messageStaleKey(this.provider))
        uni_removeStorageSync(messageStaleKey(this.provider))
        return value == "true"
    }
    open fun getCachedRegistrationId(): String {
        return storageString(registrationIdKey(this.provider))
    }
    open fun setLocalProviderForTesting(provider: PushProviderName): Unit {
        if (!ENABLE_LOCAL_PROVIDER_SWITCH) {
            return
        }
        if (provider != "unipush" && provider != "jpush") {
            return
        }
        uni_setStorageSync(PUSH_LOCAL_PROVIDER_OVERRIDE_KEY, provider)
        pushDebug(provider, "本地测试 provider 已设置；请完全重启应用后生效")
    }
    open fun clearBadge(): Unit {
        try {
            setAndroidJPushBadgeNumber(0)
        }
         catch (error: Throwable) {
            pushDebug(this.provider, "清除 Android 应用角标失败: " + error.toString())
        }
    }
    private fun handlePushEvent(event: NormalizedPushEvent): Unit {
        this.clearBadge()
        val messageId = pushMessageId(event.payload)
        if (messageId != "") {
            uni_setStorageSync(pendingMessageIdKey(event.provider), messageId)
        }
        if (event.kind == "received" || event.kind == "clicked" || event.kind == "custom") {
            uni_setStorageSync(messageStaleKey(event.provider), true)
        }
        if (event.kind == "clicked") {
            uni_switchTab(SwitchTabOptions(url = "/pages/message/message"))
        }
    }
    private fun clearRegistrationTimers(): Unit {
        if (this.registrationRetryTimer > 0) {
            clearTimeout(this.registrationRetryTimer)
            this.registrationRetryTimer = 0
        }
        if (this.registrationRequestTimeout > 0) {
            clearTimeout(this.registrationRequestTimeout)
            this.registrationRequestTimeout = 0
        }
    }
    private fun scheduleRegistrationRetry(reason: String): Unit {
        if (this.registrationRetryCount >= PUSH_REGISTRATION_ID_MAX_RETRY_COUNT) {
            pushDebug(this.provider, "设备注册 ID 获取超时，已停止重试。原因: " + reason)
            return
        }
        if (this.registrationRetryTimer > 0) {
            return
        }
        this.registrationRetryCount += 1
        this.registrationRetryTimer = setTimeout(fun(){
            this.registrationRetryTimer = 0
            this.refreshRegistrationId()
        }
        , PUSH_REGISTRATION_ID_RETRY_DELAY)
    }
    private fun saveRegistrationId(registrationId: String): Unit {
        this.clearRegistrationTimers()
        this.registrationRequesting = false
        if (registrationId == "") {
            this.scheduleRegistrationRetry("注册 ID 为空")
            return
        }
        this.registrationRetryCount = 0
        uni_setStorageSync(registrationIdKey(this.provider), registrationId)
        val registrationIdLabel = if (this.provider == "unipush") {
            "UniPush CID 已就绪"
        } else {
            "JPush RegistrationID 已就绪"
        }
        pushDebug(this.provider, registrationIdLabel)
        notifyPushRegistrationIdReady(registrationId)
    }
    private fun requestUniPushRegistrationId(adapter: UniPushAdapter): Unit {
        this.registrationRequesting = true
        this.clearRegistrationTimers()
        val requestGeneration = this.registrationRequestGeneration + 1
        this.registrationRequestGeneration = requestGeneration
        this.registrationRequestTimeout = setTimeout(fun(){
            if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting) {
                return
            }
            this.registrationRequesting = false
            this.registrationRequestTimeout = 0
            this.scheduleRegistrationRetry("UniPush 回调超时")
        }
        , PUSH_REGISTRATION_ID_REQUEST_TIMEOUT)
        adapter.requestRegistrationId(fun(registrationId){
            if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting) {
                return
            }
            this.saveRegistrationId(registrationId)
        }
        , fun(reason){
            if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting) {
                return
            }
            this.clearRegistrationTimers()
            this.registrationRequesting = false
            this.scheduleRegistrationRetry(reason)
        }
        )
    }
    private fun saveJPushRegistrationId(): Unit {
        if (this.adapter == null) {
            return
        }
        this.registrationRequesting = true
        val registrationId = this.adapter!!.getRegistrationId()
        this.registrationRequesting = false
        if (registrationId == "") {
            this.scheduleRegistrationRetry("JPush RegistrationID 为空")
            return
        }
        this.saveRegistrationId(registrationId)
    }
}
val pushManager = PushManager()
fun initPush(): Unit {
    pushManager.init()
}
fun refreshPushRegistrationId(): Unit {
    pushManager.refreshRegistrationId()
}
fun clearPushBadge(): Unit {
    pushManager.clearBadge()
}
fun refreshPushClientId(): Unit {
    refreshPushRegistrationId()
}
fun markPushSessionAuthenticated(): Unit {
    pushManager.markAuthenticated()
}
fun clearPushSessionState(): Unit {
    pushManager.clearSessionState()
}
fun consumePendingMessageId(): String {
    return pushManager.consumePendingMessageId()
}
fun consumePushStaleFlag(): Boolean {
    return pushManager.consumeStaleFlag()
}
fun getCachedPushRegistrationId(): String {
    return pushManager.getCachedRegistrationId()
}
fun onPushRegistrationIdReady(listener: PushRegistrationIdReadyListener): Unit {
    pushRegistrationIdReadyListeners.push(listener)
}
fun onPushSessionAuthenticated(listener: PushSessionAuthenticatedListener): Unit {
    pushSessionAuthenticatedListeners.push(listener)
}
fun showAppToast(options: ShowToastOptions): Unit {
    uni_showToast(options)
}
open class RequestOptions__1 (
    open var url: String? = null,
    open var method: String? = null,
    open var data: Any? = null,
    open var header: UTSJSONObject? = null,
    open var showLoading: Boolean? = null,
    open var showError: Boolean? = null,
) : UTSObject()
open class HttpError (
    @JsonNotNull
    open var statusCode: Number,
    @JsonNotNull
    open var message: String,
    open var data: Any? = null,
) : UTSObject()
val BASE_URL = "https://gpsapp.zdiot.cn"
val CLIENT_ID = "428a8310cd442757ae699df5d894f051"
val DEFAULT_TIME_ZONE = "UTC"
fun getDeviceTimeZone(): String {
    var timeZone = ""
    try {
        timeZone = TimeZone.getDefault().getID()
    }
     catch (error: Throwable) {
        console.warn("获取安卓时区失败", error)
    }
    val normalizedTimeZone = timeZone.trim()
    return if (normalizedTimeZone.length > 0) {
        normalizedTimeZone
    } else {
        DEFAULT_TIME_ZONE
    }
}
var isHandlingTokenExpired = false
fun resetTokenExpiredState(): Unit {
    isHandlingTokenExpired = false
}
fun handleTokenExpired(): Unit {
    if (isHandlingTokenExpired) {
        return
    }
    isHandlingTokenExpired = true
    console.log("检测到token过期，执行跳转登录页逻辑")
    uni_removeStorageSync("token")
    clearPushSessionState()
    showAppToast(ShowToastOptions(title = "登录已过期，请重新登录", icon = "none", duration = 2000))
    setTimeout(fun(){
        console.log("正在跳转到登录页...")
        uni_redirectTo(RedirectToOptions(url = "/pages/login/login", success = fun(_){
            console.log("跳转登录页成功")
        }
        , fail = fun(err){
            console.log("跳转登录页失败:", err)
            uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
        }
        ))
    }
    , 500)
}
fun requestInterceptor(config: RequestOptions__1): RequestOptions__1 {
    val token = uni_getStorageSync("token")
    val authorization = "Bearer " + (if (token != null) {
        token.toString()
    } else {
        ""
    }
    )
    val timeZone = getDeviceTimeZone()
    if (config.header == null) {
        config.header = UTSJSONObject()
    }
    config.header!!.set("Authorization", authorization)
    config.header!!.set("clientId", CLIENT_ID)
    config.header!!.set("x-time-zone", timeZone)
    return config
}
fun responseInterceptor(response: RequestSuccess<Any>, config: RequestOptions__1): Any {
    return response.data!!
}
fun logHttpError(error: HttpError): Unit {
    val detail = "statusCode=" + error.statusCode + ", message=" + error.message + ", data=" + (if (error.data != null) {
        error.data.toString()
    } else {
        ""
    }
    )
    AndroidLog.e("HttpRequest", detail)
    console.error("[HttpRequest] " + detail)
}
fun errorHandler(error: HttpError, config: RequestOptions__1): Unit {
    if (config.showLoading != false) {
        uni_hideLoading(null)
    }
    logHttpError(error)
    if (config.showError == false) {
        return
    }
    if (error.statusCode == 401) {
        handleTokenExpired()
        return
    }
    if (error.statusCode != 0) {
        when (error.statusCode) {
            403 -> 
                showAppToast(ShowToastOptions(title = "没有权限访问", icon = "none"))
            404 -> 
                showAppToast(ShowToastOptions(title = "请求资源不存在", icon = "none"))
            500 -> 
                showAppToast(ShowToastOptions(title = "服务器错误", icon = "none"))
            else -> 
                showAppToast(ShowToastOptions(title = if (error.message != null) {
                    error.message
                } else {
                    "请求错误: " + error.statusCode
                }, icon = "none"))
        }
    } else {
        showAppToast(ShowToastOptions(title = "网络错误，请检查网络连接", icon = "none"))
    }
}
fun request(options: RequestOptions__1): UTSPromise<Any> {
    val requestUrl = if (options.url != null) {
        options.url!!
    } else {
        ""
    }
    val config = RequestOptions__1(url = requestUrl, method = if (options.method != null) {
        options.method
    } else {
        "GET"
    }
    , data = if (options.data != null) {
        options.data
    } else {
        _uO()
    }
    , header = if (options.header != null) {
        options.header
    } else {
        UTSJSONObject()
    }
    , showLoading = options.showLoading != false, showError = options.showError != false)
    if (!config.url!!.startsWith("http")) {
        config.url = BASE_URL + config.url!!
    }
    val processedConfig = requestInterceptor(config)
    return UTSPromise<Any>(fun(resolve, reject){
        uni_request<Any>(RequestOptions(url = processedConfig.url!!, method = processedConfig.method, data = processedConfig.data, header = processedConfig.header, success = fun(res: RequestSuccess<Any>){
            val statusCode = res.statusCode
            if (statusCode == 200) {
                val data = responseInterceptor(res, processedConfig)
                resolve(data)
            } else {
                val httpError = HttpError(statusCode = statusCode, message = "请求失败: " + statusCode, data = res.data)
                errorHandler(httpError, processedConfig)
                reject(httpError)
            }
        }
        , fail = fun(error: RequestFail){
            val httpError = HttpError(statusCode = 0, message = if (error.errMsg != null) {
                error.errMsg
            } else {
                "网络请求失败"
            }
            , data = error)
            errorHandler(httpError, processedConfig)
            reject(httpError)
        }
        ))
    }
    )
}
fun get(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "GET", data = data, header = options.header, showLoading = options.showLoading, showError = options.showError))
}
fun post(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "POST", data = data, header = options.header, showLoading = options.showLoading, showError = options.showError))
}
fun postSilently(url: String, data: Any): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "POST", data = data, showLoading = false, showError = false))
}
fun put(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "PUT", data = data, header = options.header, showLoading = options.showLoading, showError = options.showError))
}
fun remove(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "DELETE", data = data, header = options.header, showLoading = options.showLoading, showError = options.showError))
}
fun asJSONObject(value: Any): UTSJSONObject {
    if (value == null) {
        return UTSJSONObject()
    }
    return value as UTSJSONObject
}
fun getResponseCode(response: UTSJSONObject): Number {
    return response.getNumber("code", -1)
}
fun getResponseMessage(response: UTSJSONObject): String {
    val msg = response.getString("msg", "")
    return if (msg != "") {
        msg
    } else {
        response.getString("message", "")
    }
}
fun getResponseDataObject(response: UTSJSONObject): UTSJSONObject {
    val data = response.getJSON("data")
    return if (data != null) {
        data
    } else {
        UTSJSONObject()
    }
}
fun getResponseDataArray(response: UTSJSONObject): UTSArray<UTSJSONObject> {
    val data = response.getArray<UTSJSONObject>("data")
    return if (data != null) {
        data
    } else {
        _uA()
    }
}
val devicePos = "/gps/lastPosition?deptId="
val trackPos = "/gps/trackPos?"
val userinfo = "/sys/user/info"
val addDeviceUrl = "/userDevice/add"
val userDeviceList = "/userDevice/list"
val authLoginUrl = "/auth/login"
val smsSendCodeUrl = "/resource/sms/code"
val registerUrl = "/auth/register"
val forgotPasswordResetUrl = "/auth/forgot-password/reset"
val smsClientId = "428a8310cd442757ae699df5d894f051"
val defaultTenantId = "000000"
val changePasswordUrl = "/user/profile/updatePassword"
val userMsgList = "/usermessage/listForUser"
val msgState = "/usermessage/detail/"
val updateDevice = "/device/update"
val deviceDetail = "/device/info/"
val logoutUrl = "/auth/logout"
val sendcmd = "/command/sendCmd"
val getGeofence = "/geofence"
val deleteGeo = "/geofence/"
val unbindDeviceList = "/device/unbindGeofenceList"
val bindDeviceList = "/device/bindGeofenceList"
val bindGeofence = "/geofence/bind"
val unbindGeofence = "/geofence/unbind"
val deleteDevice = "/userDevice/del"
val appCommandAvailableUrl = "/app/command/available-cmds"
val appCommandSendUrl = "/app/command/send"
val appCommandListUrl = "/app/command/list"
val appCommandDetailUrl = "/app/command/"
val appCommandRetryUrl = "/app/command/retry/"
val pushBindUrl = "/app/push/bind"
val pushUnbindUrl = "/app/push/unbind"
open class BasicResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
) : UTSObject()
open class PushDeviceBindRequest (
    @JsonNotNull
    open var registrationId: String,
    @JsonNotNull
    open var platform: String,
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var appVersion: String,
) : UTSObject()
open class JsonDataResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject()
open class SendSmsCodeRequest (
    @JsonNotNull
    open var phonenumber: String,
    open var tenantId: String? = null,
) : UTSObject()
open class SmsLoginRequest (
    @JsonNotNull
    open var phonenumber: String,
    @JsonNotNull
    open var smsCode: String,
    open var clientId: String? = null,
    open var tenantId: String? = null,
) : UTSObject()
open class PersonalPasswordLoginRequest (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
    open var clientId: String? = null,
    open var tenantId: String? = null,
) : UTSObject()
open class RegisterRequest (
    open var username: String? = null,
    @JsonNotNull
    open var password: String,
    @JsonNotNull
    open var confirmPassword: String,
    @JsonNotNull
    open var phonenumber: String,
    @JsonNotNull
    open var smsCode: String,
    open var clientId: String? = null,
    open var tenantId: String? = null,
) : UTSObject()
open class ForgotPasswordResetRequest (
    open var tenantId: String? = null,
    @JsonNotNull
    open var phonenumber: String,
    @JsonNotNull
    open var smsCode: String,
    @JsonNotNull
    open var newPassword: String,
    @JsonNotNull
    open var confirmPassword: String,
) : UTSObject()
open class DevicePositionResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject()
open class TrackPosResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject()
open class UserInfoResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject()
open class UserDeviceListData (
    @JsonNotNull
    open var list: UTSArray<UTSJSONObject>,
    @JsonNotNull
    open var totalPage: Number,
    @JsonNotNull
    open var totalCount: Number,
) : UTSObject()
open class UserDeviceListResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UserDeviceListData,
) : UTSObject()
open class DeviceDetailResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject()
open class GeofenceResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject()
open class DevicePageData (
    @JsonNotNull
    open var list: UTSArray<UTSJSONObject>,
    @JsonNotNull
    open var totalPage: Number,
    @JsonNotNull
    open var totalCount: Number,
) : UTSObject()
open class DevicePageResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: DevicePageData,
) : UTSObject()
open class CommandListResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject()
open class SendCmdResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: String,
) : UTSObject()
open class AppCommandPageData (
    @JsonNotNull
    open var total: Number,
    @JsonNotNull
    open var rows: UTSArray<UTSJSONObject>,
) : UTSObject()
open class AppCommandPageResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: AppCommandPageData,
) : UTSObject()
open class AppCommandDetailResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject()
open class ChangePasswordRequest (
    @JsonNotNull
    open var oldPassword: String,
    @JsonNotNull
    open var newPassword: String,
    @JsonNotNull
    open var confirmPassword: String,
) : UTSObject()
open class MessageResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UserDeviceListData,
) : UTSObject()
fun basicResponse(raw: Any): BasicResponse {
    val response = asJSONObject(raw)
    return BasicResponse(code = getResponseCode(response), msg = getResponseMessage(response))
}
fun jsonDataResponse(raw: Any): JsonDataResponse {
    val response = asJSONObject(raw)
    return JsonDataResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataObject(response))
}
fun devicePageResponse(raw: Any): DevicePageResponse {
    val response = asJSONObject(raw)
    val data = getResponseDataObject(response)
    val list = data.getArray<UTSJSONObject>("list")
    return DevicePageResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = DevicePageData(list = if (list != null) {
        list
    } else {
        _uA()
    }
    , totalPage = data.getNumber("totalPage", 0), totalCount = data.getNumber("totalCount", 0)))
}
fun userDevicePageResponse(raw: Any): UserDeviceListResponse {
    val page = devicePageResponse(raw)
    return UserDeviceListResponse(code = page.code, msg = page.msg, data = UserDeviceListData(list = page.data.list, totalPage = page.data.totalPage, totalCount = page.data.totalCount))
}
fun messagePageResponse(raw: Any): MessageResponse {
    val page = devicePageResponse(raw)
    return MessageResponse(code = page.code, msg = page.msg, data = UserDeviceListData(list = page.data.list, totalPage = page.data.totalPage, totalCount = page.data.totalCount))
}
fun userInfoResponse(raw: Any): UserInfoResponse {
    val response = jsonDataResponse(raw)
    return UserInfoResponse(code = response.code, msg = response.msg, data = response.data)
}
fun deviceDetailResponse(raw: Any): DeviceDetailResponse {
    val response = jsonDataResponse(raw)
    return DeviceDetailResponse(code = response.code, msg = response.msg, data = response.data)
}
fun appCommandPageResponse(raw: Any): AppCommandPageResponse {
    val response = asJSONObject(raw)
    val rows = response.getArray<UTSJSONObject>("rows")
    return AppCommandPageResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = AppCommandPageData(total = response.getNumber("total", 0), rows = if (rows != null) {
        rows
    } else {
        _uA()
    }
    ))
}
val logout = fun(): UTSPromise<BasicResponse> {
    return post(logoutUrl).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val sendCommand = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return post(sendcmd, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getDevicePos = fun(data: UTSJSONObject): UTSPromise<DevicePositionResponse> {
    return get(devicePos, data).then(fun(raw: Any): DevicePositionResponse {
        val response = asJSONObject(raw)
        return DevicePositionResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataArray(response))
    }
    )
}
val getTrackPos = fun(data: UTSJSONObject): UTSPromise<TrackPosResponse> {
    return get(trackPos, data).then(fun(raw: Any): TrackPosResponse {
        val response = asJSONObject(raw)
        return TrackPosResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataObject(response))
    }
    )
}
val getUserInfo = fun(): UTSPromise<UserInfoResponse> {
    return get(userinfo).then(fun(raw: Any): UserInfoResponse {
        return userInfoResponse(raw)
    }
    )
}
val addDevice = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return post(addDeviceUrl, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val delDevice = fun(deviceId: String): UTSPromise<BasicResponse> {
    return post(deleteDevice, _uO("deviceId" to deviceId)).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getUserDeviceList = fun(data: UTSJSONObject): UTSPromise<UserDeviceListResponse> {
    return post(userDeviceList, data).then(fun(raw: Any): UserDeviceListResponse {
        return userDevicePageResponse(raw)
    }
    )
}
val sendSmsLoginCode = fun(data: SendSmsCodeRequest): UTSPromise<BasicResponse> {
    return get(smsSendCodeUrl, _uO("phonenumber" to data.phonenumber, "tenantId" to if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    )).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val sendSmsRegisterCode = fun(data: SendSmsCodeRequest): UTSPromise<BasicResponse> {
    return get(smsSendCodeUrl, _uO("phonenumber" to data.phonenumber, "tenantId" to if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    , "scene" to "register")).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val sendSmsForgotPasswordCode = fun(data: SendSmsCodeRequest): UTSPromise<BasicResponse> {
    return get(smsSendCodeUrl, _uO("phonenumber" to data.phonenumber, "tenantId" to if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    , "scene" to "forgot")).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val personalPasswordLogin = fun(data: PersonalPasswordLoginRequest): UTSPromise<JsonDataResponse> {
    val requestData = UTSJSONObject()
    requestData.set("grantType", "password")
    requestData.set("username", data.username)
    requestData.set("password", data.password)
    requestData.set("tenantId", if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    )
    requestData.set("clientId", if (data.clientId != null) {
        data.clientId
    } else {
        smsClientId
    }
    )
    return post(authLoginUrl, requestData).then(fun(raw: Any): JsonDataResponse {
        return jsonDataResponse(raw)
    }
    )
}
val registerPersonalUser = fun(data: RegisterRequest): UTSPromise<JsonDataResponse> {
    val requestData = UTSJSONObject()
    if (data.username != null && data.username != "") {
        requestData.set("username", data.username)
    }
    requestData.set("password", data.password)
    requestData.set("confirmPassword", data.confirmPassword)
    requestData.set("phonenumber", data.phonenumber)
    requestData.set("smsCode", data.smsCode)
    requestData.set("tenantId", if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    )
    requestData.set("clientId", if (data.clientId != null) {
        data.clientId
    } else {
        smsClientId
    }
    )
    return post(registerUrl, requestData).then(fun(raw: Any): JsonDataResponse {
        return jsonDataResponse(raw)
    }
    )
}
val smsLogin = fun(data: SmsLoginRequest): UTSPromise<JsonDataResponse> {
    val requestData = UTSJSONObject()
    requestData.set("clientId", if (data.clientId != null) {
        data.clientId
    } else {
        smsClientId
    }
    )
    requestData.set("grantType", "sms")
    requestData.set("tenantId", if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    )
    requestData.set("phonenumber", data.phonenumber)
    requestData.set("smsCode", data.smsCode)
    return post(authLoginUrl, requestData).then(fun(raw: Any): JsonDataResponse {
        return jsonDataResponse(raw)
    }
    )
}
val resetForgotPassword = fun(data: ForgotPasswordResetRequest): UTSPromise<JsonDataResponse> {
    val requestData = UTSJSONObject()
    requestData.set("tenantId", if (data.tenantId != null) {
        data.tenantId
    } else {
        defaultTenantId
    }
    )
    requestData.set("phonenumber", data.phonenumber)
    requestData.set("smsCode", data.smsCode)
    requestData.set("newPassword", data.newPassword)
    requestData.set("confirmPassword", data.confirmPassword)
    return post(forgotPasswordResetUrl, requestData).then(fun(raw: Any): JsonDataResponse {
        return jsonDataResponse(raw)
    }
    )
}
val updatePassword = fun(data: ChangePasswordRequest): UTSPromise<BasicResponse> {
    return post(changePasswordUrl, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getUserMsgList = fun(data: UTSJSONObject?): UTSPromise<MessageResponse> {
    return (if (data != null) {
        get(userMsgList, data)
    } else {
        get(userMsgList)
    }
    ).then(fun(raw: Any): MessageResponse {
        return messagePageResponse(raw)
    }
    )
}
val setMsgState = fun(msgId: String): UTSPromise<BasicResponse> {
    return get("" + msgState + msgId).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val editDeviceInfo = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return put(updateDevice, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getDeviceDetail = fun(deviceId: String): UTSPromise<DeviceDetailResponse> {
    return get("" + deviceDetail + deviceId).then(fun(raw: Any): DeviceDetailResponse {
        return deviceDetailResponse(raw)
    }
    )
}
val getGeofenceList = fun(): UTSPromise<GeofenceResponse> {
    return get(getGeofence).then(fun(raw: Any): GeofenceResponse {
        val response = asJSONObject(raw)
        return GeofenceResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataArray(response))
    }
    )
}
val addGeofence = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return post(getGeofence, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val updateGeofence = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return put(getGeofence, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val deleteGeofence = fun(id: String): UTSPromise<BasicResponse> {
    return remove("" + deleteGeo + id).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getUnboundDevices = fun(params: UTSJSONObject): UTSPromise<DevicePageResponse> {
    return get(unbindDeviceList, params).then(fun(raw: Any): DevicePageResponse {
        return devicePageResponse(raw)
    }
    )
}
val getBoundDevices = fun(params: UTSJSONObject): UTSPromise<DevicePageResponse> {
    return get(bindDeviceList, params).then(fun(raw: Any): DevicePageResponse {
        return devicePageResponse(raw)
    }
    )
}
val bindDevices = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return post(bindGeofence, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val unbindDevices = fun(data: UTSJSONObject): UTSPromise<BasicResponse> {
    return remove(unbindGeofence, data).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val getAppAvailableCommands = fun(deviceId: String): UTSPromise<CommandListResponse> {
    return get(appCommandAvailableUrl, _uO("deviceId" to deviceId)).then(fun(raw: Any): CommandListResponse {
        val response = asJSONObject(raw)
        return CommandListResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataArray(response))
    }
    )
}
val sendAppCommand = fun(data: UTSJSONObject): UTSPromise<SendCmdResponse> {
    return post(appCommandSendUrl, data).then(fun(raw: Any): SendCmdResponse {
        val response = asJSONObject(raw)
        return SendCmdResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = response.getString("data", ""))
    }
    )
}
val getAppCommandHistory = fun(query: UTSJSONObject): UTSPromise<AppCommandPageResponse> {
    query.set("tenantId", defaultTenantId)
    return get(appCommandListUrl, query).then(fun(raw: Any): AppCommandPageResponse {
        return appCommandPageResponse(raw)
    }
    )
}
val getAppCommandDetail = fun(commandId: Any): UTSPromise<AppCommandDetailResponse> {
    return get("" + appCommandDetailUrl + commandId.toString()).then(fun(raw: Any): AppCommandDetailResponse {
        val response = jsonDataResponse(raw)
        return AppCommandDetailResponse(code = response.code, msg = response.msg, data = response.data)
    }
    )
}
val retryAppCommand = fun(commandId: Any): UTSPromise<BasicResponse> {
    return get("" + appCommandRetryUrl + commandId.toString()).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val unbindPushDevice = fun(registrationId: String): UTSPromise<BasicResponse> {
    return postSilently(pushUnbindUrl + "?registrationId=" + encodeURIComponent(registrationId), UTSJSONObject()).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
val bindPushDevice = fun(data: PushDeviceBindRequest): UTSPromise<BasicResponse> {
    val requestData = UTSJSONObject()
    requestData.set("registrationId", data.registrationId)
    requestData.set("platform", data.platform)
    requestData.set("deviceName", data.deviceName)
    requestData.set("appVersion", data.appVersion)
    return postSilently(pushBindUrl, requestData).then(fun(raw: Any): BasicResponse {
        return basicResponse(raw)
    }
    )
}
var initialized = false
var binding = false
var bindingSessionKey = ""
var pendingRegistrationId = ""
var boundSessionKey = ""
fun pushBindingDebug(message: String): Unit {
    AndroidLog.i("PushBinding", message)
    console.log("[PushBinding] " + message)
}
fun pushBindingWarn(message: String): Unit {
    AndroidLog.w("PushBinding", message)
    console.warn("[PushBinding] " + message)
}
fun getPushBindPlatform(): String {
    return "android"
}
fun getDeviceName(): String {
    try {
        val systemInfo = uni_getSystemInfoSync()
        return systemInfo.deviceModel ?: ""
    }
     catch (error: Throwable) {
        pushBindingWarn("获取设备型号失败")
        return ""
    }
}
fun getAppVersion(): String {
    try {
        return uni_getAppBaseInfo(null).appVersion ?: ""
    }
     catch (error: Throwable) {
        pushBindingWarn("获取应用版本失败")
        return ""
    }
}
fun getLoginToken(): String {
    val value = uni_getStorageSync("token")
    return if (value == null) {
        ""
    } else {
        value.toString()
    }
}
fun bindRegistrationId(registrationId: String): Unit {
    if (registrationId == "") {
        return
    }
    val token = getLoginToken()
    if (token == "") {
        pushBindingDebug("RegistrationID 已就绪，等待用户登录")
        return
    }
    val platform = getPushBindPlatform()
    if (platform == "") {
        return
    }
    val sessionKey = token + ":" + registrationId
    if (binding) {
        if (bindingSessionKey != sessionKey) {
            pendingRegistrationId = registrationId
        }
        return
    }
    if (boundSessionKey == sessionKey) {
        return
    }
    binding = true
    bindingSessionKey = sessionKey
    val data = PushDeviceBindRequest(registrationId = registrationId, platform = platform, deviceName = getDeviceName(), appVersion = getAppVersion())
    pushBindingDebug("开始绑定推送设备，platform=" + platform)
    bindPushDevice(data).then(fun(response){
        if (response.code == 200) {
            boundSessionKey = sessionKey
            pushBindingDebug("推送设备绑定成功，platform=" + platform)
            return
        }
        if (response.code == 500) {
            pushBindingWarn("推送设备绑定返回 500，登录状态已失效，跳转登录页。msg=" + response.msg)
            handleTokenExpired()
            return
        }
        pushBindingWarn("推送设备绑定失败，稍后将重试。code=" + response.code + ", msg=" + response.msg)
    }
    ).`catch`(fun(){
        pushBindingWarn("推送设备绑定请求失败，稍后将重试。")
    }
    ).`finally`(fun(){
        binding = false
        bindingSessionKey = ""
        val nextRegistrationId = pendingRegistrationId
        pendingRegistrationId = ""
        if (nextRegistrationId != "") {
            bindRegistrationId(nextRegistrationId)
        }
    }
    )
}
fun unbindPushDeviceOnLogout(): UTSPromise<Unit> {
    return wrapUTSPromise(suspend w@{
            val registrationId = getCachedPushRegistrationId()
            if (registrationId == "") {
                pushBindingDebug("退出登录时无缓存 RegistrationID，跳过推送设备解绑")
                return@w
            }
            try {
                pushBindingDebug("退出登录时解绑推送设备")
                val response = await(unbindPushDevice(registrationId))
                if (response.code == 200) {
                    pushBindingDebug("推送设备解绑成功")
                    return@w
                }
                pushBindingWarn("推送设备解绑失败，但仍继续退出登录。code=" + response.code + ", msg=" + response.msg)
            }
             catch (error: Throwable) {
                pushBindingWarn("推送设备解绑请求失败，但仍继续退出登录。")
            }
    })
}
fun initPushBinding(): Unit {
    if (initialized) {
        return
    }
    initialized = true
    onPushRegistrationIdReady(fun(registrationId: String): Unit {
        bindRegistrationId(registrationId)
    }
    )
    onPushSessionAuthenticated(fun(registrationId: String): Unit {
        if (registrationId == "") {
            pushBindingDebug("用户已登录，但尚无缓存 RegistrationID")
            return
        }
        pushBindingDebug("用户已登录，使用缓存 RegistrationID 绑定推送设备")
        bindRegistrationId(registrationId)
    }
    )
}
val POST_LOGIN_INITIALIZATION_DELAY: Number = 1200
var pushServicesInitialized = false
var pushServicesInitializationScheduled = false
var pushServicesInitializationTimer: Number? = null
fun startupLog(message: String): Unit {
    console.log("[AppStartup] " + message)
}
fun hasLoginToken(): Boolean {
    val token = uni_getStorageSync("token")
    return token != null && token.toString() != ""
}
fun initializePushServices(): Unit {
    pushServicesInitializationScheduled = false
    null
    if (!hasLoginToken()) {
        startupLog("当前未登录，跳过推送初始化")
        return
    }
    if (pushServicesInitialized) {
        markPushSessionAuthenticated()
        clearPushBadge()
        return
    }
    pushServicesInitialized = true
    startupLog("开始登录后的推送初始化")
    initPushBinding()
    initPush()
    clearPushBadge()
    markPushSessionAuthenticated()
    startupLog("登录后的推送初始化已触发")
}
fun schedulePostLoginInitialization(): Unit {
    if (!hasLoginToken()) {
        return
    }
    if (pushServicesInitialized) {
        markPushSessionAuthenticated()
        clearPushBadge()
        return
    }
    if (pushServicesInitializationScheduled) {
        return
    }
    pushServicesInitializationScheduled = true
    startupLog("已安排登录后的推送初始化")
    pushServicesInitializationTimer = setTimeout(fun(){
        initializePushServices()
    }
    , POST_LOGIN_INITIALIZATION_DELAY) as Number
}
fun refreshInitializedPushServices(): Unit {
    if (!pushServicesInitialized) {
        return
    }
    refreshPushClientId()
}
fun clearInitializedPushBadge(): Unit {
    if (!pushServicesInitialized) {
        return
    }
    clearPushBadge()
}
typealias CameraPermissionStatus = String
typealias NotificationPermissionStatus = CameraPermissionStatus
val CAMERA_PERMISSION = "android.permission.CAMERA"
val POST_NOTIFICATIONS_PERMISSION = "android.permission.POST_NOTIFICATIONS"
fun hasPermission(activity: Activity, permissions: UTSArray<String>): Boolean {
    return UTSAndroid.checkSystemPermissionGranted(activity, permissions)
}
fun requestAndroidPermission(permissions: UTSArray<String>, name: String, callback: (status: CameraPermissionStatus) -> Unit, isGranted: (activity: Activity) -> Boolean): Unit {
    val activity = UTSAndroid.getUniActivity()
    if (activity == null) {
        console.error("❌ [" + name + "] 获取 Activity 失败")
        callback("unavailable")
        return
    }
    val currentActivity = activity as Activity
    try {
        if (isGranted(currentActivity)) {
            callback("granted")
            return
        }
    }
     catch (error: Throwable) {
        console.error("❌ [" + name + "] 检查权限失败:", error)
        callback("unavailable")
        return
    }
    try {
        UTSAndroid.requestSystemPermission(currentActivity, permissions, fun(allRight: Boolean, grantedPermissions: UTSArray<String>?){
            console.log("[" + name + "] 权限请求结果:", allRight, grantedPermissions)
            try {
                callback(if (isGranted(currentActivity)) {
                    "granted"
                } else {
                    "denied"
                }
                )
            }
             catch (error: Throwable) {
                console.error("❌ [" + name + "] 请求后检查权限失败:", error)
                callback("unavailable")
            }
        }
        , fun(doNotAskAgain: Boolean, deniedPermissions: UTSArray<String>?){
            console.warn("[" + name + "] 权限被拒绝:", deniedPermissions)
            callback(if (doNotAskAgain) {
                "settingsRequired"
            } else {
                "denied"
            }
            )
        }
        )
    }
     catch (error: Throwable) {
        console.error("❌ [" + name + "] 请求权限异常:", error)
        callback("unavailable")
    }
}
fun ensureCameraPermission(callback: (status: CameraPermissionStatus) -> Unit): Unit {
    requestAndroidPermission(_uA(
        CAMERA_PERMISSION
    ), "ensureCameraPermission", callback, fun(activity: Activity): Boolean {
        return hasPermission(activity, _uA(
            CAMERA_PERMISSION
        ))
    }
    )
}
fun ensureNotificationPermission(callback: (status: NotificationPermissionStatus) -> Unit): Unit {
    if (Build.VERSION.SDK_INT < 33) {
        callback("granted")
        return
    }
    requestAndroidPermission(_uA(
        POST_NOTIFICATIONS_PERMISSION
    ), "ensureNotificationPermission", callback, fun(activity: Activity): Boolean {
        return hasPermission(activity, _uA(
            POST_NOTIFICATIONS_PERMISSION
        ))
    }
    )
}
fun openCameraPermissionSettings(): Unit {
    val activity = UTSAndroid.getUniActivity()
    if (activity == null) {
        return
    }
    try {
        UTSAndroid.gotoSystemPermissionActivity(activity as Activity, _uA(
            CAMERA_PERMISSION
        ))
    }
     catch (error: Throwable) {
        console.error("❌ [openCameraPermissionSettings] 打开权限设置失败:", error)
    }
}
var firstBackTime: Number = 0
fun checkForUpdates() {}
open class GenApp : BaseApp {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {
        onLaunch(fun(_: OnLaunchOptions) {
            console.log("App onLaunch")
            checkForUpdates()
            if (uni_getStorageSync("token") != null) {
                schedulePostLoginInitialization()
            }
            ensureNotificationPermission(fun(status){
                console.log("[NotificationPermission] " + status)
            }
            )
        }
        , __ins)
        onAppShow(fun(_: OnShowOptions) {
            console.log("App Show")
            clearInitializedPushBadge()
            refreshInitializedPushServices()
        }
        , __ins)
        onAppHide(fun() {
            console.log("App Hide")
            clearInitializedPushBadge()
        }
        , __ins)
        onLastPageBackPress(fun() {
            console.log("App LastPageBackPress")
            if (firstBackTime == 0) {
                uni_showToast(ShowToastOptions(title = "再按一次退出应用", position = "bottom"))
                firstBackTime = Date.now()
                setTimeout(fun(){
                    firstBackTime = 0
                }, 2000)
            } else if (Date.now() - firstBackTime < 2000) {
                firstBackTime = Date.now()
                uni_exit(null)
            }
        }
        , __ins)
        onExit(fun() {
            console.log("App Exit")
        }
        , __ins)
    }
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("uni-row" to _pS(_uM("flexDirection" to "row")), "uni-column" to _pS(_uM("flexDirection" to "column")))
            }
    }
}
val GenAppClass = CreateVueAppComponent(GenApp::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "app", name = "", inheritAttrs = true, inject = Map(), props = Map(), propsNeedCastKeys = _uA(), emits = Map(), components = Map(), styles = GenApp.styles)
}
, fun(instance): GenApp {
    return GenApp(instance)
}
)
open class Coordinate (
    @JsonNotNull
    open var lat: Number,
    @JsonNotNull
    open var lng: Number,
) : UTSObject()
open class CoordTransform {
    companion object {
        private val a: Number = 6378245.0
        private val ee: Number = 0.00669342162296594323
        private val pi: Number = 3.1415926535897932384626
        fun wgs84ToTencent(wgLat: Number, wgLon: Number): Coordinate {
            if (!this.isInChina(wgLon, wgLat)) {
                return Coordinate(lat = wgLat, lng = wgLon)
            }
            var dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0)
            var dLng = this.transformLng(wgLon - 105.0, wgLat - 35.0)
            var radLat = wgLat / 180.0 * this.pi
            var magic = Math.sin(radLat)
            magic = 1 - this.ee * magic * magic
            var sqrtMagic = Math.sqrt(magic)
            dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi)
            dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi)
            val mgLat = wgLat + dLat
            val mgLng = wgLon + dLng
            return Coordinate(lat = parseFloat(mgLat.toFixed(6)), lng = parseFloat(mgLng.toFixed(6)))
        }
        fun wgs84ToTencentPrecise(wgLat: Number, wgLon: Number): Coordinate {
            if (!this.isInChina(wgLon, wgLat)) {
                return Coordinate(lat = wgLat, lng = wgLon)
            }
            var dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0)
            var dLng = this.transformLng(wgLon - 105.0, wgLat - 35.0)
            var radLat = wgLat / 180.0 * this.pi
            var magic = Math.sin(radLat)
            magic = 1 - this.ee * magic * magic
            var sqrtMagic = Math.sqrt(magic)
            dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi)
            dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi)
            return Coordinate(lat = wgLat + dLat, lng = wgLon + dLng)
        }
        fun tencentToWgs84(tcLat: Number, tcLon: Number): Coordinate {
            if (!this.isInChina(tcLon, tcLat)) {
                return Coordinate(lat = tcLat, lng = tcLon)
            }
            var wgsLat = tcLat
            var wgsLng = tcLon
            run {
                var i: Number = 0
                while(i < 5){
                    val gcj02 = this.wgs84ToTencent(wgsLat, wgsLng)
                    val deltaLat = tcLat - gcj02.lat
                    val deltaLng = tcLon - gcj02.lng
                    wgsLat += deltaLat
                    wgsLng += deltaLng
                    if (Math.abs(deltaLat) < 1e-7 && Math.abs(deltaLng) < 1e-7) {
                        break
                    }
                    i++
                }
            }
            return Coordinate(lat = parseFloat(wgsLat.toFixed(6)), lng = parseFloat(wgsLng.toFixed(6)))
        }
        fun batchConvertCoordinates(devices: UTSArray<UTSJSONObject>, targetSystem: String = "tencent"): UTSArray<UTSJSONObject> {
            if (!UTSArray.isArray(devices)) {
                return _uA()
            }
            return devices.map(fun(device): UTSJSONObject {
                if (device == null) {
                    return device
                }
                val item = device as UTSJSONObject
                val latitude = item["latitude"]
                val longitude = item["longitude"]
                if (latitude == null || longitude == null) {
                    return device
                }
                val lat = parseFloat(latitude.toString())
                val lng = parseFloat(longitude.toString())
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn("设备经纬度无效", device)
                    return device
                }
                var converted = Coordinate(lat = lat, lng = lng)
                if (targetSystem === "tencent") {
                    converted = this.wgs84ToTencent(lat, lng)
                } else {
                    converted = this.tencentToWgs84(lat, lng)
                }
                item["latitude"] = converted.lat
                item["longitude"] = converted.lng
                item["originalLatitude"] = lat
                item["originalLongitude"] = lng
                return item
            }
            )
        }
        fun convertCoordinate(lat: Number, lng: Number, fromSystem: String = "wgs84", toSystem: String = "tencent"): Coordinate {
            if (fromSystem === "wgs84" && toSystem === "tencent") {
                return this.wgs84ToTencent(lat, lng)
            } else if (fromSystem === "tencent" && toSystem === "wgs84") {
                return this.tencentToWgs84(lat, lng)
            } else {
                console.warn("不支持的坐标系转换", fromSystem, "->", toSystem)
                return Coordinate(lat = lat, lng = lng)
            }
        }
        fun isInChina(lng: Number, lat: Number): Boolean {
            return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271
        }
        private fun transformLat(x: Number, y: Number): Number {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
            ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
            ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
            ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
            return ret
        }
        private fun transformLng(x: Number, y: Number): Number {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
            ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
            ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
            ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
            return ret
        }
    }
}
open class OpenLocationParams (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
    @JsonNotNull
    open var name: String,
) : UTSObject()
fun isValidCoordinate(latitude: Number, longitude: Number): Boolean {
    return !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude == 0 && longitude == 0)
}
fun showInvalidLocationToast(): Unit {
    showAppToast(ShowToastOptions(title = "暂无有效车辆位置", icon = "none"))
}
fun showOpenMapFailedToast(): Unit {
    showAppToast(ShowToastOptions(title = "无法打开地图，请稍后重试", icon = "none"))
}
fun openAndroidExternalMap(params: OpenLocationParams): Unit {
    val navigationResult = openExternalMap(ExternalMapNavigationParams(latitude = params.latitude, longitude = params.longitude, name = params.name))
    if (navigationResult.code == "opened") {
        return
    }
    if (navigationResult.code == "invalid_coordinate") {
        showInvalidLocationToast()
        return
    }
    if (navigationResult.code == "no_map_app") {
        showAppToast(ShowToastOptions(title = "未检测到可用地图应用", icon = "none"))
        return
    }
    showOpenMapFailedToast()
}
fun openLocation(params: OpenLocationParams): Unit {
    if (!isValidCoordinate(params.latitude, params.longitude)) {
        showInvalidLocationToast()
        return
    }
    openAndroidExternalMap(params)
    return
}
open class AppModalSuccess {
    open var confirm: Boolean = false
    open var cancel: Boolean = false
}
open class AppModalOptions (
    open var title: String? = null,
    open var content: String? = null,
    open var showCancel: Boolean? = null,
    open var confirmText: String? = null,
    open var cancelText: String? = null,
    open var success: ((res: AppModalSuccess) -> Unit)? = null,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return AppModalOptionsReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class AppModalOptionsReactiveObject : AppModalOptions, IUTSReactive<AppModalOptions> {
    override var __v_raw: AppModalOptions
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: AppModalOptions, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(title = __v_raw.title, content = __v_raw.content, showCancel = __v_raw.showCancel, confirmText = __v_raw.confirmText, cancelText = __v_raw.cancelText, success = __v_raw.success) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): AppModalOptionsReactiveObject {
        return AppModalOptionsReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var title: String?
        get() {
            return _tRG(__v_raw, "title", __v_raw.title, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("title")) {
                return
            }
            val oldValue = __v_raw.title
            __v_raw.title = value
            _tRS(__v_raw, "title", oldValue, value)
        }
    override var content: String?
        get() {
            return _tRG(__v_raw, "content", __v_raw.content, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("content")) {
                return
            }
            val oldValue = __v_raw.content
            __v_raw.content = value
            _tRS(__v_raw, "content", oldValue, value)
        }
    override var showCancel: Boolean?
        get() {
            return _tRG(__v_raw, "showCancel", __v_raw.showCancel, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("showCancel")) {
                return
            }
            val oldValue = __v_raw.showCancel
            __v_raw.showCancel = value
            _tRS(__v_raw, "showCancel", oldValue, value)
        }
    override var confirmText: String?
        get() {
            return _tRG(__v_raw, "confirmText", __v_raw.confirmText, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("confirmText")) {
                return
            }
            val oldValue = __v_raw.confirmText
            __v_raw.confirmText = value
            _tRS(__v_raw, "confirmText", oldValue, value)
        }
    override var cancelText: String?
        get() {
            return _tRG(__v_raw, "cancelText", __v_raw.cancelText, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("cancelText")) {
                return
            }
            val oldValue = __v_raw.cancelText
            __v_raw.cancelText = value
            _tRS(__v_raw, "cancelText", oldValue, value)
        }
}
val modalHandlers: UTSArray<(options: AppModalOptions) -> Unit> = _uA()
fun registerAppModalHandler(handler: (options: AppModalOptions) -> Unit): Unit {
    if (modalHandlers.indexOf(handler) == -1) {
        modalHandlers.push(handler)
    }
}
fun unregisterAppModalHandler(handler: (options: AppModalOptions) -> Unit): Unit {
    val index = modalHandlers.indexOf(handler)
    if (index >= 0) {
        modalHandlers.splice(index, 1)
    }
}
fun showAppModal(options: AppModalOptions): Unit {
    val handler = if (modalHandlers.length > 0) {
        modalHandlers[modalHandlers.length - 1]
    } else {
        null
    }
    if (handler != null) {
        handler(options)
        return
    }
    uni_showModal(ShowModalOptions(title = options.title ?: "", content = options.content ?: "", showCancel = options.showCancel ?: true, confirmText = options.confirmText, cancelText = options.cancelText, success = fun(res: ShowModalSuccess){
        val result = AppModalSuccess()
        result.confirm = res.confirm
        result.cancel = res.cancel
        if (options.success != null) {
            options.success!!(result)
        }
    }
    ))
}
fun __uts_large_remixCodeMap_fill_fill_1(__map: Map<String, String>): Unit {
    __map.set("home-3-fill", "ee1a")
    __map.set("chat-3-line", "eb51")
    __map.set("chat-3-fill", "eb50")
    __map.set("contrast-drop-2-fill", "ebd5")
    __map.set("circle-line", "f3c2")
    __map.set("smartphone-line", "f15a")
    __map.set("git-repository-private-fill", "edc8")
    __map.set("mouse-fill", "ef7c")
    __map.set("arrow-up-line", "ea76")
    __map.set("information-line", "ee59")
    __map.set("gps-line", "eddb")
    __map.set("headphone-line", "ee05")
    __map.set("rocket-fill", "f095")
    __map.set("mic-2-line", "ef4e")
    __map.set("image-circle-line", "f413")
    __map.set("plane-line", "f005")
    __map.set("loader-line", "eeca")
    __map.set("refresh-line", "f064")
    __map.set("check-line", "eb7b")
    __map.set("close-line", "eb99")
    __map.set("add-line", "ea13")
    __map.set("subtract-line", "f1af")
    __map.set("search-line", "f0d1")
    __map.set("star-fill", "f186")
    __map.set("map-pin-line", "ef14")
    __map.set("error-warning-line", "eca1")
    __map.set("arrow-right-line", "ea6c")
    __map.set("arrow-left-line", "ea60")
}
fun __uts_large_remixCodeMap_build_0(): Map<String, String> {
    val __map = Map<String, String>()
    __uts_large_remixCodeMap_fill_fill_1(__map)
    return __map
}
open class IIconClickEvent (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var code: String,
    @JsonNotNull
    open var label: String,
) : UTSObject()
val GenUniModulesIUiXComponentsIIconIIconClass = CreateVueComponent(GenUniModulesIUiXComponentsIIconIIcon::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIIconIIcon.name, inheritAttrs = GenUniModulesIUiXComponentsIIconIIcon.inheritAttrs, inject = GenUniModulesIUiXComponentsIIconIIcon.inject, props = GenUniModulesIUiXComponentsIIconIIcon.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIIconIIcon.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIIconIIcon.emits, components = GenUniModulesIUiXComponentsIIconIIcon.components, styles = GenUniModulesIUiXComponentsIIconIIcon.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIIconIIcon.setup(props as GenUniModulesIUiXComponentsIIconIIcon)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIIconIIcon {
    return GenUniModulesIUiXComponentsIIconIIcon(instance)
}
)
val GenUniModulesIUiXComponentsILineProgressILineProgressClass = CreateVueComponent(GenUniModulesIUiXComponentsILineProgressILineProgress::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsILineProgressILineProgress.name, inheritAttrs = GenUniModulesIUiXComponentsILineProgressILineProgress.inheritAttrs, inject = GenUniModulesIUiXComponentsILineProgressILineProgress.inject, props = GenUniModulesIUiXComponentsILineProgressILineProgress.props, propsNeedCastKeys = GenUniModulesIUiXComponentsILineProgressILineProgress.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsILineProgressILineProgress.emits, components = GenUniModulesIUiXComponentsILineProgressILineProgress.components, styles = GenUniModulesIUiXComponentsILineProgressILineProgress.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsILineProgressILineProgress.setup(props as GenUniModulesIUiXComponentsILineProgressILineProgress)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsILineProgressILineProgress {
    return GenUniModulesIUiXComponentsILineProgressILineProgress(instance)
}
)
open class IPickerItem (
    @JsonNotNull
    open var text: String,
    open var value: Any? = null,
    @JsonNotNull
    open var disabled: Boolean = false,
) : UTSObject()
val GenUniModulesIUiXComponentsIPickerIPickerClass = CreateVueComponent(GenUniModulesIUiXComponentsIPickerIPicker::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIPickerIPicker.name, inheritAttrs = GenUniModulesIUiXComponentsIPickerIPicker.inheritAttrs, inject = GenUniModulesIUiXComponentsIPickerIPicker.inject, props = GenUniModulesIUiXComponentsIPickerIPicker.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIPickerIPicker.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIPickerIPicker.emits, components = GenUniModulesIUiXComponentsIPickerIPicker.components, styles = GenUniModulesIUiXComponentsIPickerIPicker.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIPickerIPicker.setup(props as GenUniModulesIUiXComponentsIPickerIPicker, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIPickerIPicker {
    return GenUniModulesIUiXComponentsIPickerIPicker(instance)
}
)
val GenComponentsAppToastAppToastClass = CreateVueComponent(GenComponentsAppToastAppToast::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenComponentsAppToastAppToast.name, inheritAttrs = GenComponentsAppToastAppToast.inheritAttrs, inject = GenComponentsAppToastAppToast.inject, props = GenComponentsAppToastAppToast.props, propsNeedCastKeys = GenComponentsAppToastAppToast.propsNeedCastKeys, emits = GenComponentsAppToastAppToast.emits, components = GenComponentsAppToastAppToast.components, styles = GenComponentsAppToastAppToast.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsAppToastAppToast.setup(props as GenComponentsAppToastAppToast)
    }
    )
}
, fun(instance, renderer): GenComponentsAppToastAppToast {
    return GenComponentsAppToastAppToast(instance)
}
)
val GenComponentsAppModalAppModalClass = CreateVueComponent(GenComponentsAppModalAppModal::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenComponentsAppModalAppModal.name, inheritAttrs = GenComponentsAppModalAppModal.inheritAttrs, inject = GenComponentsAppModalAppModal.inject, props = GenComponentsAppModalAppModal.props, propsNeedCastKeys = GenComponentsAppModalAppModal.propsNeedCastKeys, emits = GenComponentsAppModalAppModal.emits, components = GenComponentsAppModalAppModal.components, styles = GenComponentsAppModalAppModal.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsAppModalAppModal.setup(props as GenComponentsAppModalAppModal)
    }
    )
}
, fun(instance, renderer): GenComponentsAppModalAppModal {
    return GenComponentsAppModalAppModal(instance)
}
)
val `default` = "/static/banner.png"
val default__1 = "/static/pos.png"
val default__2 = "/static/car.png"
val default__3 = "/static/dzwl.png"
val default__4 = "/static/msg.png"
val default__5 = "/static/pay.png"
val default__6 = "/static/online.png"
val default__7 = "/static/logout.png"
val default__8 = "/static/del.png"
open class TodayTimeRange (
    @JsonNotNull
    open var nowTime: Number,
    @JsonNotNull
    open var todayZero: Number,
) : UTSObject()
fun getTodayZeroTime(): TodayTimeRange {
    val now = Date()
    val nowTime = now.getTime()
    val todayZero = Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()
    return TodayTimeRange(nowTime = nowTime, todayZero = todayZero)
}
fun pad(value: Number): String {
    return value.toString(10).padStart(2, "0")
}
fun formatTimes(timestamp: Number): String {
    val d = Date(timestamp)
    return "" + d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
fun formatTimesToMinute(timestamp: Number): String {
    val d = Date(timestamp)
    return "" + d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes())
}
fun parseLocalDateTime(timestamp: String): Number? {
    val match = timestamp.match(UTSRegExp("^(\\d{4})[-\\/](\\d{2})[-\\/](\\d{2})(?:\\s+(\\d{2}):(\\d{2})(?::(\\d{2}))?)?\$", ""))
    if (match == null) {
        return null
    }
    val year = parseInt(match[1] ?: "0")
    val month = parseInt(match[2] ?: "0")
    val day = parseInt(match[3] ?: "0")
    val hour = if (match[4] == null) {
        0
    } else {
        parseInt(match[4] ?: "0")
    }
    val minute = if (match[5] == null) {
        0
    } else {
        parseInt(match[5] ?: "0")
    }
    val second = if (match[6] == null) {
        0
    } else {
        parseInt(match[6] ?: "0")
    }
    val date = Date(year, month - 1, day, hour, minute, second)
    if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day || date.getHours() != hour || date.getMinutes() != minute || date.getSeconds() != second) {
        return null
    }
    return date.getTime()
}
fun normalizeLocalDateTime(timestamp: String): String {
    val milliseconds = parseLocalDateTime(timestamp)
    return if (milliseconds == null) {
        timestamp
    } else {
        formatTimes(milliseconds)
    }
}
fun formatLocalTime(timestamp: String): String {
    val milliseconds = parseLocalDateTime(timestamp)
    if (milliseconds == null) {
        return ""
    }
    val date = Date(milliseconds)
    return "" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds())
}
fun getDeviceIcon(connectionStatus: String, carType: String): String {
    val basePath = if (connectionStatus == "online") {
        "/static/cars/online/"
    } else {
        "/static/cars/offline/"
    }
    val validTypes = _uA(
        "car",
        "bus",
        "bike",
        "moto",
        "diandong",
        "huoche",
        "sanlun",
        "tuola",
        "suv",
        "baby",
        "tank",
        "zhuangjia",
        "wajue",
        "plan",
        "walk",
        "muma",
        "hangmu",
        "junjian",
        "tuiche",
        "train"
    )
    var iconPath = basePath + "default.png"
    if (validTypes.includes(carType)) {
        iconPath = basePath + carType + ".png"
    }
    return iconPath
}
open class Device (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var value: String,
    @JsonNotNull
    open var imei: String,
    @JsonNotNull
    open var deptId: String,
    @JsonNotNull
    open var deviceId: String,
    @JsonNotNull
    open var iccid: String,
    @JsonNotNull
    open var simMerchant: String,
    @JsonNotNull
    open var connectionStatus: String,
    @JsonNotNull
    open var carType: String,
    @JsonNotNull
    open var plateNo: String,
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DeviceReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DeviceReactiveObject : Device, IUTSReactive<Device> {
    override var __v_raw: Device
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: Device, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(name = __v_raw.name, deviceName = __v_raw.deviceName, value = __v_raw.value, imei = __v_raw.imei, deptId = __v_raw.deptId, deviceId = __v_raw.deviceId, iccid = __v_raw.iccid, simMerchant = __v_raw.simMerchant, connectionStatus = __v_raw.connectionStatus, carType = __v_raw.carType, plateNo = __v_raw.plateNo, latitude = __v_raw.latitude, longitude = __v_raw.longitude) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DeviceReactiveObject {
        return DeviceReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var name: String
        get() {
            return _tRG(__v_raw, "name", __v_raw.name, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("name")) {
                return
            }
            val oldValue = __v_raw.name
            __v_raw.name = value
            _tRS(__v_raw, "name", oldValue, value)
        }
    override var deviceName: String
        get() {
            return _tRG(__v_raw, "deviceName", __v_raw.deviceName, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceName")) {
                return
            }
            val oldValue = __v_raw.deviceName
            __v_raw.deviceName = value
            _tRS(__v_raw, "deviceName", oldValue, value)
        }
    override var value: String
        get() {
            return _tRG(__v_raw, "value", __v_raw.value, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("value")) {
                return
            }
            val oldValue = __v_raw.value
            __v_raw.value = value
            _tRS(__v_raw, "value", oldValue, value)
        }
    override var imei: String
        get() {
            return _tRG(__v_raw, "imei", __v_raw.imei, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("imei")) {
                return
            }
            val oldValue = __v_raw.imei
            __v_raw.imei = value
            _tRS(__v_raw, "imei", oldValue, value)
        }
    override var deptId: String
        get() {
            return _tRG(__v_raw, "deptId", __v_raw.deptId, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deptId")) {
                return
            }
            val oldValue = __v_raw.deptId
            __v_raw.deptId = value
            _tRS(__v_raw, "deptId", oldValue, value)
        }
    override var deviceId: String
        get() {
            return _tRG(__v_raw, "deviceId", __v_raw.deviceId, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceId")) {
                return
            }
            val oldValue = __v_raw.deviceId
            __v_raw.deviceId = value
            _tRS(__v_raw, "deviceId", oldValue, value)
        }
    override var iccid: String
        get() {
            return _tRG(__v_raw, "iccid", __v_raw.iccid, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("iccid")) {
                return
            }
            val oldValue = __v_raw.iccid
            __v_raw.iccid = value
            _tRS(__v_raw, "iccid", oldValue, value)
        }
    override var simMerchant: String
        get() {
            return _tRG(__v_raw, "simMerchant", __v_raw.simMerchant, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("simMerchant")) {
                return
            }
            val oldValue = __v_raw.simMerchant
            __v_raw.simMerchant = value
            _tRS(__v_raw, "simMerchant", oldValue, value)
        }
    override var connectionStatus: String
        get() {
            return _tRG(__v_raw, "connectionStatus", __v_raw.connectionStatus, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("connectionStatus")) {
                return
            }
            val oldValue = __v_raw.connectionStatus
            __v_raw.connectionStatus = value
            _tRS(__v_raw, "connectionStatus", oldValue, value)
        }
    override var carType: String
        get() {
            return _tRG(__v_raw, "carType", __v_raw.carType, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("carType")) {
                return
            }
            val oldValue = __v_raw.carType
            __v_raw.carType = value
            _tRS(__v_raw, "carType", oldValue, value)
        }
    override var plateNo: String
        get() {
            return _tRG(__v_raw, "plateNo", __v_raw.plateNo, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("plateNo")) {
                return
            }
            val oldValue = __v_raw.plateNo
            __v_raw.plateNo = value
            _tRS(__v_raw, "plateNo", oldValue, value)
        }
    override var latitude: Number
        get() {
            return _tRG(__v_raw, "latitude", __v_raw.latitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("latitude")) {
                return
            }
            val oldValue = __v_raw.latitude
            __v_raw.latitude = value
            _tRS(__v_raw, "latitude", oldValue, value)
        }
    override var longitude: Number
        get() {
            return _tRG(__v_raw, "longitude", __v_raw.longitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("longitude")) {
                return
            }
            val oldValue = __v_raw.longitude
            __v_raw.longitude = value
            _tRS(__v_raw, "longitude", oldValue, value)
        }
}
open class MapCenter (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return MapCenterReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class MapCenterReactiveObject : MapCenter, IUTSReactive<MapCenter> {
    override var __v_raw: MapCenter
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: MapCenter, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(latitude = __v_raw.latitude, longitude = __v_raw.longitude) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): MapCenterReactiveObject {
        return MapCenterReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var latitude: Number
        get() {
            return _tRG(__v_raw, "latitude", __v_raw.latitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("latitude")) {
                return
            }
            val oldValue = __v_raw.latitude
            __v_raw.latitude = value
            _tRS(__v_raw, "latitude", oldValue, value)
        }
    override var longitude: Number
        get() {
            return _tRG(__v_raw, "longitude", __v_raw.longitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("longitude")) {
                return
            }
            val oldValue = __v_raw.longitude
            __v_raw.longitude = value
            _tRS(__v_raw, "longitude", oldValue, value)
        }
}
typealias PositionState = String
open class DeviceStatus (
    @JsonNotNull
    open var batteryPercent: Number,
    @JsonNotNull
    open var voltage: Number,
    @JsonNotNull
    open var signalStrength: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DeviceStatusReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DeviceStatusReactiveObject : DeviceStatus, IUTSReactive<DeviceStatus> {
    override var __v_raw: DeviceStatus
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DeviceStatus, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(batteryPercent = __v_raw.batteryPercent, voltage = __v_raw.voltage, signalStrength = __v_raw.signalStrength) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DeviceStatusReactiveObject {
        return DeviceStatusReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var batteryPercent: Number
        get() {
            return _tRG(__v_raw, "batteryPercent", __v_raw.batteryPercent, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("batteryPercent")) {
                return
            }
            val oldValue = __v_raw.batteryPercent
            __v_raw.batteryPercent = value
            _tRS(__v_raw, "batteryPercent", oldValue, value)
        }
    override var voltage: Number
        get() {
            return _tRG(__v_raw, "voltage", __v_raw.voltage, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("voltage")) {
                return
            }
            val oldValue = __v_raw.voltage
            __v_raw.voltage = value
            _tRS(__v_raw, "voltage", oldValue, value)
        }
    override var signalStrength: Number
        get() {
            return _tRG(__v_raw, "signalStrength", __v_raw.signalStrength, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("signalStrength")) {
                return
            }
            val oldValue = __v_raw.signalStrength
            __v_raw.signalStrength = value
            _tRS(__v_raw, "signalStrength", oldValue, value)
        }
}
open class DeviceDetailState (
    @JsonNotNull
    open var deviceStatus: DeviceStatus,
    @JsonNotNull
    open var connectionStatus: String,
    @JsonNotNull
    open var lastUpdateTime: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DeviceDetailStateReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DeviceDetailStateReactiveObject : DeviceDetailState, IUTSReactive<DeviceDetailState> {
    override var __v_raw: DeviceDetailState
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DeviceDetailState, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(deviceStatus = __v_raw.deviceStatus, connectionStatus = __v_raw.connectionStatus, lastUpdateTime = __v_raw.lastUpdateTime) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DeviceDetailStateReactiveObject {
        return DeviceDetailStateReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var deviceStatus: DeviceStatus
        get() {
            return _tRG(__v_raw, "deviceStatus", __v_raw.deviceStatus, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceStatus")) {
                return
            }
            val oldValue = __v_raw.deviceStatus
            __v_raw.deviceStatus = value
            _tRS(__v_raw, "deviceStatus", oldValue, value)
        }
    override var connectionStatus: String
        get() {
            return _tRG(__v_raw, "connectionStatus", __v_raw.connectionStatus, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("connectionStatus")) {
                return
            }
            val oldValue = __v_raw.connectionStatus
            __v_raw.connectionStatus = value
            _tRS(__v_raw, "connectionStatus", oldValue, value)
        }
    override var lastUpdateTime: String
        get() {
            return _tRG(__v_raw, "lastUpdateTime", __v_raw.lastUpdateTime, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("lastUpdateTime")) {
                return
            }
            val oldValue = __v_raw.lastUpdateTime
            __v_raw.lastUpdateTime = value
            _tRS(__v_raw, "lastUpdateTime", oldValue, value)
        }
}
open class IPickerOption (
    @JsonNotNull
    open var text: String,
    @JsonNotNull
    open var value: String,
    @JsonNotNull
    open var disabled: Boolean = false,
) : UTSObject()
typealias IPickerColumns = UTSArray<UTSArray<IPickerOption>>
open class SavedDevice (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var imei: String,
    @JsonNotNull
    open var deptId: String,
    @JsonNotNull
    open var deviceId: String,
    @JsonNotNull
    open var iccid: String,
    @JsonNotNull
    open var simMerchant: String,
    @JsonNotNull
    open var connectionStatus: String,
    @JsonNotNull
    open var carType: String,
    @JsonNotNull
    open var plateNo: String,
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSObject()
val GenPagesIndexIndexClass = CreateVueComponent(GenPagesIndexIndex::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesIndexIndex.inheritAttrs, inject = GenPagesIndexIndex.inject, props = GenPagesIndexIndex.props, propsNeedCastKeys = GenPagesIndexIndex.propsNeedCastKeys, emits = GenPagesIndexIndex.emits, components = GenPagesIndexIndex.components, styles = GenPagesIndexIndex.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesIndexIndex.setup(props as GenPagesIndexIndex)
    }
    )
}
, fun(instance, renderer): GenPagesIndexIndex {
    return GenPagesIndexIndex(instance, renderer)
}
)
val GenComponentsCustomNavBarCustomNavBarClass = CreateVueComponent(GenComponentsCustomNavBarCustomNavBar::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenComponentsCustomNavBarCustomNavBar.inheritAttrs, inject = GenComponentsCustomNavBarCustomNavBar.inject, props = GenComponentsCustomNavBarCustomNavBar.props, propsNeedCastKeys = GenComponentsCustomNavBarCustomNavBar.propsNeedCastKeys, emits = GenComponentsCustomNavBarCustomNavBar.emits, components = GenComponentsCustomNavBarCustomNavBar.components, styles = GenComponentsCustomNavBarCustomNavBar.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsCustomNavBarCustomNavBar.setup(props as GenComponentsCustomNavBarCustomNavBar)
    }
    )
}
, fun(instance, renderer): GenComponentsCustomNavBarCustomNavBar {
    return GenComponentsCustomNavBarCustomNavBar(instance)
}
)
val GenUniModulesIUiXComponentsIModalIModalClass = CreateVueComponent(GenUniModulesIUiXComponentsIModalIModal::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIModalIModal.name, inheritAttrs = GenUniModulesIUiXComponentsIModalIModal.inheritAttrs, inject = GenUniModulesIUiXComponentsIModalIModal.inject, props = GenUniModulesIUiXComponentsIModalIModal.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIModalIModal.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIModalIModal.emits, components = GenUniModulesIUiXComponentsIModalIModal.components, styles = GenUniModulesIUiXComponentsIModalIModal.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIModalIModal.setup(props as GenUniModulesIUiXComponentsIModalIModal, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIModalIModal {
    return GenUniModulesIUiXComponentsIModalIModal(instance)
}
)
val GenPagesMessageMessageClass = CreateVueComponent(GenPagesMessageMessage::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesMessageMessage.inheritAttrs, inject = GenPagesMessageMessage.inject, props = GenPagesMessageMessage.props, propsNeedCastKeys = GenPagesMessageMessage.propsNeedCastKeys, emits = GenPagesMessageMessage.emits, components = GenPagesMessageMessage.components, styles = GenPagesMessageMessage.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesMessageMessage.setup(props as GenPagesMessageMessage)
    }
    )
}
, fun(instance, renderer): GenPagesMessageMessage {
    return GenPagesMessageMessage(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIBadgeIBadgeClass = CreateVueComponent(GenUniModulesIUiXComponentsIBadgeIBadge::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIBadgeIBadge.name, inheritAttrs = GenUniModulesIUiXComponentsIBadgeIBadge.inheritAttrs, inject = GenUniModulesIUiXComponentsIBadgeIBadge.inject, props = GenUniModulesIUiXComponentsIBadgeIBadge.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIBadgeIBadge.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIBadgeIBadge.emits, components = GenUniModulesIUiXComponentsIBadgeIBadge.components, styles = GenUniModulesIUiXComponentsIBadgeIBadge.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIBadgeIBadge.setup(props as GenUniModulesIUiXComponentsIBadgeIBadge)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIBadgeIBadge {
    return GenUniModulesIUiXComponentsIBadgeIBadge(instance)
}
)
val GenPagesUserCenterUserCenterClass = CreateVueComponent(GenPagesUserCenterUserCenter::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterUserCenter.inheritAttrs, inject = GenPagesUserCenterUserCenter.inject, props = GenPagesUserCenterUserCenter.props, propsNeedCastKeys = GenPagesUserCenterUserCenter.propsNeedCastKeys, emits = GenPagesUserCenterUserCenter.emits, components = GenPagesUserCenterUserCenter.components, styles = GenPagesUserCenterUserCenter.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterUserCenter.setup(props as GenPagesUserCenterUserCenter)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterUserCenter {
    return GenPagesUserCenterUserCenter(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIInputIInputClass = CreateVueComponent(GenUniModulesIUiXComponentsIInputIInput::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIInputIInput.name, inheritAttrs = GenUniModulesIUiXComponentsIInputIInput.inheritAttrs, inject = GenUniModulesIUiXComponentsIInputIInput.inject, props = GenUniModulesIUiXComponentsIInputIInput.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIInputIInput.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIInputIInput.emits, components = GenUniModulesIUiXComponentsIInputIInput.components, styles = GenUniModulesIUiXComponentsIInputIInput.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIInputIInput.setup(props as GenUniModulesIUiXComponentsIInputIInput, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIInputIInput {
    return GenUniModulesIUiXComponentsIInputIInput(instance)
}
)
val GenUniModulesIUiXComponentsICheckboxICheckboxClass = CreateVueComponent(GenUniModulesIUiXComponentsICheckboxICheckbox::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsICheckboxICheckbox.name, inheritAttrs = GenUniModulesIUiXComponentsICheckboxICheckbox.inheritAttrs, inject = GenUniModulesIUiXComponentsICheckboxICheckbox.inject, props = GenUniModulesIUiXComponentsICheckboxICheckbox.props, propsNeedCastKeys = GenUniModulesIUiXComponentsICheckboxICheckbox.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsICheckboxICheckbox.emits, components = GenUniModulesIUiXComponentsICheckboxICheckbox.components, styles = GenUniModulesIUiXComponentsICheckboxICheckbox.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsICheckboxICheckbox.setup(props as GenUniModulesIUiXComponentsICheckboxICheckbox)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsICheckboxICheckbox {
    return GenUniModulesIUiXComponentsICheckboxICheckbox(instance)
}
)
val GenUniModulesIUiXComponentsIButtonIButtonClass = CreateVueComponent(GenUniModulesIUiXComponentsIButtonIButton::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIButtonIButton.name, inheritAttrs = GenUniModulesIUiXComponentsIButtonIButton.inheritAttrs, inject = GenUniModulesIUiXComponentsIButtonIButton.inject, props = GenUniModulesIUiXComponentsIButtonIButton.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIButtonIButton.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIButtonIButton.emits, components = GenUniModulesIUiXComponentsIButtonIButton.components, styles = GenUniModulesIUiXComponentsIButtonIButton.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIButtonIButton.setup(props as GenUniModulesIUiXComponentsIButtonIButton)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIButtonIButton {
    return GenUniModulesIUiXComponentsIButtonIButton(instance)
}
)
val userAgreement = "\n欢迎使用车联网平台！\n\n一、服务条款的确认和接纳\n本协议是您与车联网平台之间关于使用平台服务的协议。您使用平台服务即表示您已阅读并同意本协议的全部条款。\n\n二、服务内容\n1. 车联网平台提供车辆管理、远程控制、数据分析等服务。\n2. 平台保留随时变更、中断或终止部分或全部网络服务的权利。\n\n三、用户账号\n用户应对其账号的全部行为负责，不得将账号转让或出借给他人使用。\n\n四、用户隐私保护\n保护用户隐私是平台的一项基本政策，详情请参阅《隐私政策》。\n\n五、免责声明\n1. 平台不保证服务一定能满足用户的要求，也不保证服务不会中断。\n2. 对于因不可抗力造成的服务中断，平台不承担责任。\n\n六、法律适用\n本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。\n\n如有任何疑问，请联系我们。"
val privacyPolicy = "\n车联网平台非常重视您的隐私保护！\n\n一、信息收集\n1. 我们可能收集的信息包括：手机号码、车辆信息、位置信息、设备信息等。\n2. 我们会在您注册、使用服务时收集必要的信息。\n\n二、信息使用\n1. 我们使用收集的信息来提供、维护和改进服务。\n2. 我们不会向第三方出售或分享您的个人信息。\n\n三、信息保护\n1. 我们采用行业标准的安全措施保护您的信息。\n2. 我们会定期评估安全措施的有效性。\n\n四、未成年人保护\n我们重视未成年人的隐私保护，如您是未成年人，请在监护人指导下使用服务。\n\n五、政策更新\n我们可能会更新隐私政策，更新后的政策将在平台公布。\n\n如有任何隐私问题，请联系我们。"
open class SmsRegisterContext (
    @JsonNotNull
    open var phonenumber: String,
    @JsonNotNull
    open var smsCode: String,
) : UTSObject()
var pendingContext: SmsRegisterContext? = null
fun saveSmsRegisterContext(phonenumber: String, smsCode: String): Unit {
    pendingContext = SmsRegisterContext(phonenumber = phonenumber, smsCode = smsCode)
}
fun getSmsRegisterContext(): SmsRegisterContext? {
    return pendingContext
}
fun clearSmsRegisterContext(): Unit {
    pendingContext = null
}
open class PersonalLoginForm (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PersonalLoginFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PersonalLoginFormReactiveObject : PersonalLoginForm, IUTSReactive<PersonalLoginForm> {
    override var __v_raw: PersonalLoginForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PersonalLoginForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(username = __v_raw.username, password = __v_raw.password) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PersonalLoginFormReactiveObject {
        return PersonalLoginFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var username: String
        get() {
            return _tRG(__v_raw, "username", __v_raw.username, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("username")) {
                return
            }
            val oldValue = __v_raw.username
            __v_raw.username = value
            _tRS(__v_raw, "username", oldValue, value)
        }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
}
open class EnterpriseLoginForm (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return EnterpriseLoginFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class EnterpriseLoginFormReactiveObject : EnterpriseLoginForm, IUTSReactive<EnterpriseLoginForm> {
    override var __v_raw: EnterpriseLoginForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: EnterpriseLoginForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(username = __v_raw.username, password = __v_raw.password) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): EnterpriseLoginFormReactiveObject {
        return EnterpriseLoginFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var username: String
        get() {
            return _tRG(__v_raw, "username", __v_raw.username, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("username")) {
                return
            }
            val oldValue = __v_raw.username
            __v_raw.username = value
            _tRS(__v_raw, "username", oldValue, value)
        }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
}
val GenPagesLoginLoginClass = CreateVueComponent(GenPagesLoginLogin::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesLoginLogin.inheritAttrs, inject = GenPagesLoginLogin.inject, props = GenPagesLoginLogin.props, propsNeedCastKeys = GenPagesLoginLogin.propsNeedCastKeys, emits = GenPagesLoginLogin.emits, components = GenPagesLoginLogin.components, styles = GenPagesLoginLogin.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesLoginLogin.setup(props as GenPagesLoginLogin)
    }
    )
}
, fun(instance, renderer): GenPagesLoginLogin {
    return GenPagesLoginLogin(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIFormItemIFormItemClass = CreateVueComponent(GenUniModulesIUiXComponentsIFormItemIFormItem::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIFormItemIFormItem.name, inheritAttrs = GenUniModulesIUiXComponentsIFormItemIFormItem.inheritAttrs, inject = GenUniModulesIUiXComponentsIFormItemIFormItem.inject, props = GenUniModulesIUiXComponentsIFormItemIFormItem.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIFormItemIFormItem.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIFormItemIFormItem.emits, components = GenUniModulesIUiXComponentsIFormItemIFormItem.components, styles = GenUniModulesIUiXComponentsIFormItemIFormItem.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIFormItemIFormItem.setup(props as GenUniModulesIUiXComponentsIFormItemIFormItem)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIFormItemIFormItem {
    return GenUniModulesIUiXComponentsIFormItemIFormItem(instance)
}
)
open class IFormField (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var label: String,
    open var value: Any? = null,
    @JsonNotNull
    open var hasValue: Boolean = false,
    @JsonNotNull
    open var required: Boolean = false,
    @JsonNotNull
    open var message: String,
) : UTSObject()
open class IFormError (
    @JsonNotNull
    open var field: String,
    @JsonNotNull
    open var message: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return IFormErrorReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class IFormErrorReactiveObject : IFormError, IUTSReactive<IFormError> {
    override var __v_raw: IFormError
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: IFormError, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(field = __v_raw.field, message = __v_raw.message) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): IFormErrorReactiveObject {
        return IFormErrorReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var field: String
        get() {
            return _tRG(__v_raw, "field", __v_raw.field, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("field")) {
                return
            }
            val oldValue = __v_raw.field
            __v_raw.field = value
            _tRS(__v_raw, "field", oldValue, value)
        }
    override var message: String
        get() {
            return _tRG(__v_raw, "message", __v_raw.message, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("message")) {
                return
            }
            val oldValue = __v_raw.message
            __v_raw.message = value
            _tRS(__v_raw, "message", oldValue, value)
        }
}
open class IFormValidatePayload (
    @JsonNotNull
    open var valid: Boolean = false,
    @JsonNotNull
    open var message: String,
    @JsonNotNull
    open var errors: UTSArray<IFormError>,
    @JsonNotNull
    open var values: UTSJSONObject,
) : UTSObject()
open class IFormSubmitPayload (
    @JsonNotNull
    open var valid: Boolean = false,
    @JsonNotNull
    open var values: UTSJSONObject,
    @JsonNotNull
    open var errors: UTSArray<IFormError>,
    @JsonNotNull
    open var message: String,
) : UTSObject()
open class IFormResetPayload (
    @JsonNotNull
    open var values: UTSJSONObject,
) : UTSObject()
open class IFormScrollPayload (
    @JsonNotNull
    open var field: String,
    @JsonNotNull
    open var targetId: String,
    @JsonNotNull
    open var selector: String,
    @JsonNotNull
    open var offsetTop: Number,
    @JsonNotNull
    open var duration: Number,
) : UTSObject()
val GenUniModulesIUiXComponentsIFormIFormClass = CreateVueComponent(GenUniModulesIUiXComponentsIFormIForm::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIFormIForm.name, inheritAttrs = GenUniModulesIUiXComponentsIFormIForm.inheritAttrs, inject = GenUniModulesIUiXComponentsIFormIForm.inject, props = GenUniModulesIUiXComponentsIFormIForm.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIFormIForm.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIFormIForm.emits, components = GenUniModulesIUiXComponentsIFormIForm.components, styles = GenUniModulesIUiXComponentsIFormIForm.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIFormIForm.setup(props as GenUniModulesIUiXComponentsIFormIForm, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIFormIForm {
    return GenUniModulesIUiXComponentsIFormIForm(instance)
}
)
open class PersonalLoginForm__1 (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PersonalLoginForm__1ReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PersonalLoginForm__1ReactiveObject : PersonalLoginForm__1, IUTSReactive<PersonalLoginForm__1> {
    override var __v_raw: PersonalLoginForm__1
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PersonalLoginForm__1, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(username = __v_raw.username, password = __v_raw.password) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PersonalLoginForm__1ReactiveObject {
        return PersonalLoginForm__1ReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var username: String
        get() {
            return _tRG(__v_raw, "username", __v_raw.username, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("username")) {
                return
            }
            val oldValue = __v_raw.username
            __v_raw.username = value
            _tRS(__v_raw, "username", oldValue, value)
        }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
}
val GenPagesLoginPersonalPasswordLoginClass = CreateVueComponent(GenPagesLoginPersonalPasswordLogin::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesLoginPersonalPasswordLogin.inheritAttrs, inject = GenPagesLoginPersonalPasswordLogin.inject, props = GenPagesLoginPersonalPasswordLogin.props, propsNeedCastKeys = GenPagesLoginPersonalPasswordLogin.propsNeedCastKeys, emits = GenPagesLoginPersonalPasswordLogin.emits, components = GenPagesLoginPersonalPasswordLogin.components, styles = GenPagesLoginPersonalPasswordLogin.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesLoginPersonalPasswordLogin.setup(props as GenPagesLoginPersonalPasswordLogin)
    }
    )
}
, fun(instance, renderer): GenPagesLoginPersonalPasswordLogin {
    return GenPagesLoginPersonalPasswordLogin(instance, renderer)
}
)
open class RegisterForm (
    @JsonNotNull
    open var password: String,
    @JsonNotNull
    open var mobile: String,
    @JsonNotNull
    open var smsCode: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return RegisterFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class RegisterFormReactiveObject : RegisterForm, IUTSReactive<RegisterForm> {
    override var __v_raw: RegisterForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: RegisterForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(password = __v_raw.password, mobile = __v_raw.mobile, smsCode = __v_raw.smsCode) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): RegisterFormReactiveObject {
        return RegisterFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
    override var mobile: String
        get() {
            return _tRG(__v_raw, "mobile", __v_raw.mobile, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("mobile")) {
                return
            }
            val oldValue = __v_raw.mobile
            __v_raw.mobile = value
            _tRS(__v_raw, "mobile", oldValue, value)
        }
    override var smsCode: String
        get() {
            return _tRG(__v_raw, "smsCode", __v_raw.smsCode, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("smsCode")) {
                return
            }
            val oldValue = __v_raw.smsCode
            __v_raw.smsCode = value
            _tRS(__v_raw, "smsCode", oldValue, value)
        }
}
val GenPagesLoginRegisterClass = CreateVueComponent(GenPagesLoginRegister::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesLoginRegister.inheritAttrs, inject = GenPagesLoginRegister.inject, props = GenPagesLoginRegister.props, propsNeedCastKeys = GenPagesLoginRegister.propsNeedCastKeys, emits = GenPagesLoginRegister.emits, components = GenPagesLoginRegister.components, styles = GenPagesLoginRegister.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesLoginRegister.setup(props as GenPagesLoginRegister)
    }
    )
}
, fun(instance, renderer): GenPagesLoginRegister {
    return GenPagesLoginRegister(instance, renderer)
}
)
open class ForgotPasswordForm (
    @JsonNotNull
    open var mobile: String,
    @JsonNotNull
    open var smsCode: String,
    @JsonNotNull
    open var password: String,
    @JsonNotNull
    open var confirmPassword: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return ForgotPasswordFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class ForgotPasswordFormReactiveObject : ForgotPasswordForm, IUTSReactive<ForgotPasswordForm> {
    override var __v_raw: ForgotPasswordForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: ForgotPasswordForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(mobile = __v_raw.mobile, smsCode = __v_raw.smsCode, password = __v_raw.password, confirmPassword = __v_raw.confirmPassword) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): ForgotPasswordFormReactiveObject {
        return ForgotPasswordFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var mobile: String
        get() {
            return _tRG(__v_raw, "mobile", __v_raw.mobile, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("mobile")) {
                return
            }
            val oldValue = __v_raw.mobile
            __v_raw.mobile = value
            _tRS(__v_raw, "mobile", oldValue, value)
        }
    override var smsCode: String
        get() {
            return _tRG(__v_raw, "smsCode", __v_raw.smsCode, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("smsCode")) {
                return
            }
            val oldValue = __v_raw.smsCode
            __v_raw.smsCode = value
            _tRS(__v_raw, "smsCode", oldValue, value)
        }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
    override var confirmPassword: String
        get() {
            return _tRG(__v_raw, "confirmPassword", __v_raw.confirmPassword, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("confirmPassword")) {
                return
            }
            val oldValue = __v_raw.confirmPassword
            __v_raw.confirmPassword = value
            _tRS(__v_raw, "confirmPassword", oldValue, value)
        }
}
val GenPagesLoginForgotPasswordClass = CreateVueComponent(GenPagesLoginForgotPassword::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesLoginForgotPassword.inheritAttrs, inject = GenPagesLoginForgotPassword.inject, props = GenPagesLoginForgotPassword.props, propsNeedCastKeys = GenPagesLoginForgotPassword.propsNeedCastKeys, emits = GenPagesLoginForgotPassword.emits, components = GenPagesLoginForgotPassword.components, styles = GenPagesLoginForgotPassword.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesLoginForgotPassword.setup(props as GenPagesLoginForgotPassword)
    }
    )
}
, fun(instance, renderer): GenPagesLoginForgotPassword {
    return GenPagesLoginForgotPassword(instance, renderer)
}
)
open class PasswordForm (
    @JsonNotNull
    open var password: String,
    @JsonNotNull
    open var confirmPassword: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PasswordFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PasswordFormReactiveObject : PasswordForm, IUTSReactive<PasswordForm> {
    override var __v_raw: PasswordForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PasswordForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(password = __v_raw.password, confirmPassword = __v_raw.confirmPassword) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PasswordFormReactiveObject {
        return PasswordFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var password: String
        get() {
            return _tRG(__v_raw, "password", __v_raw.password, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("password")) {
                return
            }
            val oldValue = __v_raw.password
            __v_raw.password = value
            _tRS(__v_raw, "password", oldValue, value)
        }
    override var confirmPassword: String
        get() {
            return _tRG(__v_raw, "confirmPassword", __v_raw.confirmPassword, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("confirmPassword")) {
                return
            }
            val oldValue = __v_raw.confirmPassword
            __v_raw.confirmPassword = value
            _tRS(__v_raw, "confirmPassword", oldValue, value)
        }
}
val GenPagesLoginSetPasswordClass = CreateVueComponent(GenPagesLoginSetPassword::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesLoginSetPassword.inheritAttrs, inject = GenPagesLoginSetPassword.inject, props = GenPagesLoginSetPassword.props, propsNeedCastKeys = GenPagesLoginSetPassword.propsNeedCastKeys, emits = GenPagesLoginSetPassword.emits, components = GenPagesLoginSetPassword.components, styles = GenPagesLoginSetPassword.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesLoginSetPassword.setup(props as GenPagesLoginSetPassword)
    }
    )
}
, fun(instance, renderer): GenPagesLoginSetPassword {
    return GenPagesLoginSetPassword(instance, renderer)
}
)
open class PickerItem (
    @JsonNotNull
    open var label: String,
    @JsonNotNull
    open var value: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PickerItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PickerItemReactiveObject : PickerItem, IUTSReactive<PickerItem> {
    override var __v_raw: PickerItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PickerItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(label = __v_raw.label, value = __v_raw.value) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PickerItemReactiveObject {
        return PickerItemReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var label: String
        get() {
            return _tRG(__v_raw, "label", __v_raw.label, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("label")) {
                return
            }
            val oldValue = __v_raw.label
            __v_raw.label = value
            _tRS(__v_raw, "label", oldValue, value)
        }
    override var value: String
        get() {
            return _tRG(__v_raw, "value", __v_raw.value, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("value")) {
                return
            }
            val oldValue = __v_raw.value
            __v_raw.value = value
            _tRS(__v_raw, "value", oldValue, value)
        }
}
val GenComponentsSubNavBarSubNavBarClass = CreateVueComponent(GenComponentsSubNavBarSubNavBar::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenComponentsSubNavBarSubNavBar.inheritAttrs, inject = GenComponentsSubNavBarSubNavBar.inject, props = GenComponentsSubNavBarSubNavBar.props, propsNeedCastKeys = GenComponentsSubNavBarSubNavBar.propsNeedCastKeys, emits = GenComponentsSubNavBarSubNavBar.emits, components = GenComponentsSubNavBarSubNavBar.components, styles = GenComponentsSubNavBarSubNavBar.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsSubNavBarSubNavBar.setup(props as GenComponentsSubNavBarSubNavBar)
    }
    )
}
, fun(instance, renderer): GenComponentsSubNavBarSubNavBar {
    return GenComponentsSubNavBarSubNavBar(instance)
}
)
val GenUniModulesIUiXComponentsIGridIGridClass = CreateVueComponent(GenUniModulesIUiXComponentsIGridIGrid::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIGridIGrid.name, inheritAttrs = GenUniModulesIUiXComponentsIGridIGrid.inheritAttrs, inject = GenUniModulesIUiXComponentsIGridIGrid.inject, props = GenUniModulesIUiXComponentsIGridIGrid.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIGridIGrid.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIGridIGrid.emits, components = GenUniModulesIUiXComponentsIGridIGrid.components, styles = GenUniModulesIUiXComponentsIGridIGrid.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIGridIGrid.setup(props as GenUniModulesIUiXComponentsIGridIGrid)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIGridIGrid {
    return GenUniModulesIUiXComponentsIGridIGrid(instance)
}
)
val DEFAULT_TK = "1e3374be3d63de65d44dbfdc7b311afb"
open class AddressResult (
    @JsonNotNull
    open var formatted_address: String,
) : UTSObject()
open class AddressResponse (
    @JsonNotNull
    open var result: AddressResult,
) : UTSObject()
fun getAddress(latitude: Number, longitude: Number, tk: String = DEFAULT_TK): UTSPromise<AddressResponse> {
    return UTSPromise<AddressResponse>(fun(resolve, reject){
        val postStr = JSON.stringify(_uO("lon" to longitude, "lat" to latitude, "ver" to 1))
        uni_request<Any>(RequestOptions(url = "https://api.tianditu.gov.cn/geocoder?postStr=" + encodeURIComponent(postStr) + "&type=geocode&tk=" + tk, method = "GET", header = _uO("User-Agent" to "Mozilla/5.0"), success = fun(res: RequestSuccess<Any>){
            if (res.statusCode != 200 || res.data == null) {
                reject(UTSError("获取地址信息失败，状态码：" + res.statusCode))
                return
            }
            val response = res.data as UTSJSONObject
            val result = response.getJSON("result")
            if (result == null) {
                reject(UTSError("获取地址信息失败：" + response.getString("msg", "响应缺少结果")))
                return
            }
            val formattedAddress = result.getString("formatted_address", "")
            if (formattedAddress == "") {
                reject(UTSError("获取地址信息失败：响应缺少地址"))
                return
            }
            resolve(AddressResponse(result = AddressResult(formatted_address = formattedAddress)))
        }
        , fail = fun(err: RequestFail){
            reject(err)
        }
        ))
    }
    )
}
fun __uts_large_list_fill_fill_1(__arr: UTSArray<UTSJSONObject>): Unit {
    __arr.push(_uO("image" to "/static/gjhf.png", "text" to "轨迹回放"))
    __arr.push(_uO("image" to "/static/clgz.png", "text" to "车辆跟踪"))
    __arr.push(_uO("image" to "/static/lcjl.png", "text" to "里程记录"))
    __arr.push(_uO("image" to "/static/tcjl.png", "text" to "停车记录"))
    __arr.push(_uO("image" to "/static/dzwl.png", "text" to "电子围栏"))
    __arr.push(_uO("image" to "/static/navto.png", "text" to "一键寻车"))
    __arr.push(_uO("image" to "/static/power.png", "text" to "恢复油电"))
    __arr.push(_uO("image" to "/static/offpower.png", "text" to "断开油电"))
}
fun __uts_large_list_build_0(): UTSArray<UTSJSONObject> {
    val __arr = _uA<UTSJSONObject>()
    __uts_large_list_fill_fill_1(__arr)
    return __arr
}
open class MapCenter__1 (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return MapCenter__1ReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class MapCenter__1ReactiveObject : MapCenter__1, IUTSReactive<MapCenter__1> {
    override var __v_raw: MapCenter__1
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: MapCenter__1, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(latitude = __v_raw.latitude, longitude = __v_raw.longitude) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): MapCenter__1ReactiveObject {
        return MapCenter__1ReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var latitude: Number
        get() {
            return _tRG(__v_raw, "latitude", __v_raw.latitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("latitude")) {
                return
            }
            val oldValue = __v_raw.latitude
            __v_raw.latitude = value
            _tRS(__v_raw, "latitude", oldValue, value)
        }
    override var longitude: Number
        get() {
            return _tRG(__v_raw, "longitude", __v_raw.longitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("longitude")) {
                return
            }
            val oldValue = __v_raw.longitude
            __v_raw.longitude = value
            _tRS(__v_raw, "longitude", oldValue, value)
        }
}
open class SignalDetail (
    @JsonNotNull
    open var experience: String,
    @JsonNotNull
    open var quality: String,
    @JsonNotNull
    open var color: String,
    @JsonNotNull
    open var level: Number,
) : UTSObject()
val GenPagesCarInfoDetailCarInfoDetailClass = CreateVueComponent(GenPagesCarInfoDetailCarInfoDetail::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesCarInfoDetailCarInfoDetail.inheritAttrs, inject = GenPagesCarInfoDetailCarInfoDetail.inject, props = GenPagesCarInfoDetailCarInfoDetail.props, propsNeedCastKeys = GenPagesCarInfoDetailCarInfoDetail.propsNeedCastKeys, emits = GenPagesCarInfoDetailCarInfoDetail.emits, components = GenPagesCarInfoDetailCarInfoDetail.components, styles = GenPagesCarInfoDetailCarInfoDetail.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesCarInfoDetailCarInfoDetail.setup(props as GenPagesCarInfoDetailCarInfoDetail)
    }
    )
}
, fun(instance, renderer): GenPagesCarInfoDetailCarInfoDetail {
    return GenPagesCarInfoDetailCarInfoDetail(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIPopupIPopupClass = CreateVueComponent(GenUniModulesIUiXComponentsIPopupIPopup::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIPopupIPopup.name, inheritAttrs = GenUniModulesIUiXComponentsIPopupIPopup.inheritAttrs, inject = GenUniModulesIUiXComponentsIPopupIPopup.inject, props = GenUniModulesIUiXComponentsIPopupIPopup.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIPopupIPopup.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIPopupIPopup.emits, components = GenUniModulesIUiXComponentsIPopupIPopup.components, styles = GenUniModulesIUiXComponentsIPopupIPopup.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIPopupIPopup.setup(props as GenUniModulesIUiXComponentsIPopupIPopup, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIPopupIPopup {
    return GenUniModulesIUiXComponentsIPopupIPopup(instance)
}
)
interface Props {
    var show: Boolean
    var title: String
    var col: Number
    var iconSize: Number
    var safeAreaInsetBottom: Boolean
}
typealias CarIconItem = UTSJSONObject
val GenComponentsCarIconsCarIconsClass = CreateVueComponent(GenComponentsCarIconsCarIcons::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenComponentsCarIconsCarIcons.inheritAttrs, inject = GenComponentsCarIconsCarIcons.inject, props = GenComponentsCarIconsCarIcons.props, propsNeedCastKeys = GenComponentsCarIconsCarIcons.propsNeedCastKeys, emits = GenComponentsCarIconsCarIcons.emits, components = GenComponentsCarIconsCarIcons.components, styles = GenComponentsCarIconsCarIcons.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsCarIconsCarIcons.setup(props as GenComponentsCarIconsCarIcons)
    }
    )
}
, fun(instance, renderer): GenComponentsCarIconsCarIcons {
    return GenComponentsCarIconsCarIcons(instance)
}
)
open class CarFormData (
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var imei: String,
    @JsonNotNull
    open var deviceType: String,
    @JsonNotNull
    open var deviceTypeValue: String,
    @JsonNotNull
    open var plateNo: String,
    @JsonNotNull
    open var carType: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return CarFormDataReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class CarFormDataReactiveObject : CarFormData, IUTSReactive<CarFormData> {
    override var __v_raw: CarFormData
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: CarFormData, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(deviceName = __v_raw.deviceName, imei = __v_raw.imei, deviceType = __v_raw.deviceType, deviceTypeValue = __v_raw.deviceTypeValue, plateNo = __v_raw.plateNo, carType = __v_raw.carType) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): CarFormDataReactiveObject {
        return CarFormDataReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var deviceName: String
        get() {
            return _tRG(__v_raw, "deviceName", __v_raw.deviceName, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceName")) {
                return
            }
            val oldValue = __v_raw.deviceName
            __v_raw.deviceName = value
            _tRS(__v_raw, "deviceName", oldValue, value)
        }
    override var imei: String
        get() {
            return _tRG(__v_raw, "imei", __v_raw.imei, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("imei")) {
                return
            }
            val oldValue = __v_raw.imei
            __v_raw.imei = value
            _tRS(__v_raw, "imei", oldValue, value)
        }
    override var deviceType: String
        get() {
            return _tRG(__v_raw, "deviceType", __v_raw.deviceType, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceType")) {
                return
            }
            val oldValue = __v_raw.deviceType
            __v_raw.deviceType = value
            _tRS(__v_raw, "deviceType", oldValue, value)
        }
    override var deviceTypeValue: String
        get() {
            return _tRG(__v_raw, "deviceTypeValue", __v_raw.deviceTypeValue, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceTypeValue")) {
                return
            }
            val oldValue = __v_raw.deviceTypeValue
            __v_raw.deviceTypeValue = value
            _tRS(__v_raw, "deviceTypeValue", oldValue, value)
        }
    override var plateNo: String
        get() {
            return _tRG(__v_raw, "plateNo", __v_raw.plateNo, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("plateNo")) {
                return
            }
            val oldValue = __v_raw.plateNo
            __v_raw.plateNo = value
            _tRS(__v_raw, "plateNo", oldValue, value)
        }
    override var carType: String
        get() {
            return _tRG(__v_raw, "carType", __v_raw.carType, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("carType")) {
                return
            }
            val oldValue = __v_raw.carType
            __v_raw.carType = value
            _tRS(__v_raw, "carType", oldValue, value)
        }
}
open class ScanResultData (
    @JsonNotNull
    open var result: String,
) : UTSObject()
typealias CarIconItem__1 = UTSJSONObject
val GenPagesAddCarAddCarClass = CreateVueComponent(GenPagesAddCarAddCar::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesAddCarAddCar.inheritAttrs, inject = GenPagesAddCarAddCar.inject, props = GenPagesAddCarAddCar.props, propsNeedCastKeys = GenPagesAddCarAddCar.propsNeedCastKeys, emits = GenPagesAddCarAddCar.emits, components = GenPagesAddCarAddCar.components, styles = GenPagesAddCarAddCar.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesAddCarAddCar.setup(props as GenPagesAddCarAddCar)
    }
    )
}
, fun(instance, renderer): GenPagesAddCarAddCar {
    return GenPagesAddCarAddCar(instance, renderer)
}
)
val GenUniModulesIUiXComponentsISliderISliderClass = CreateVueComponent(GenUniModulesIUiXComponentsISliderISlider::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsISliderISlider.name, inheritAttrs = GenUniModulesIUiXComponentsISliderISlider.inheritAttrs, inject = GenUniModulesIUiXComponentsISliderISlider.inject, props = GenUniModulesIUiXComponentsISliderISlider.props, propsNeedCastKeys = GenUniModulesIUiXComponentsISliderISlider.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsISliderISlider.emits, components = GenUniModulesIUiXComponentsISliderISlider.components, styles = GenUniModulesIUiXComponentsISliderISlider.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsISliderISlider.setup(props as GenUniModulesIUiXComponentsISliderISlider)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsISliderISlider {
    return GenUniModulesIUiXComponentsISliderISlider(instance)
}
)
open class IDatetimePickerEvent (
    @JsonNotNull
    open var value: Any,
    @JsonNotNull
    open var date: String,
    @JsonNotNull
    open var time: String,
    @JsonNotNull
    open var timestamp: Number,
    @JsonNotNull
    open var mode: String,
) : UTSObject()
open class IWheelOption (
    @JsonNotNull
    open var value: Number,
    @JsonNotNull
    open var text: String,
) : UTSObject()
val GenUniModulesIUiXComponentsIDatetimePickerIDatetimePickerClass = CreateVueComponent(GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.name, inheritAttrs = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.inheritAttrs, inject = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.inject, props = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.emits, components = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.components, styles = GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker.setup(props as GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker {
    return GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker(instance)
}
)
open class TrackPoint (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
    @JsonNotNull
    open var rotation: Number,
    @JsonNotNull
    open var deviceTime: String,
    @JsonNotNull
    open var speed: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return TrackPointReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class TrackPointReactiveObject : TrackPoint, IUTSReactive<TrackPoint> {
    override var __v_raw: TrackPoint
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: TrackPoint, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(latitude = __v_raw.latitude, longitude = __v_raw.longitude, rotation = __v_raw.rotation, deviceTime = __v_raw.deviceTime, speed = __v_raw.speed) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): TrackPointReactiveObject {
        return TrackPointReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var latitude: Number
        get() {
            return _tRG(__v_raw, "latitude", __v_raw.latitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("latitude")) {
                return
            }
            val oldValue = __v_raw.latitude
            __v_raw.latitude = value
            _tRS(__v_raw, "latitude", oldValue, value)
        }
    override var longitude: Number
        get() {
            return _tRG(__v_raw, "longitude", __v_raw.longitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("longitude")) {
                return
            }
            val oldValue = __v_raw.longitude
            __v_raw.longitude = value
            _tRS(__v_raw, "longitude", oldValue, value)
        }
    override var rotation: Number
        get() {
            return _tRG(__v_raw, "rotation", __v_raw.rotation, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("rotation")) {
                return
            }
            val oldValue = __v_raw.rotation
            __v_raw.rotation = value
            _tRS(__v_raw, "rotation", oldValue, value)
        }
    override var deviceTime: String
        get() {
            return _tRG(__v_raw, "deviceTime", __v_raw.deviceTime, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceTime")) {
                return
            }
            val oldValue = __v_raw.deviceTime
            __v_raw.deviceTime = value
            _tRS(__v_raw, "deviceTime", oldValue, value)
        }
    override var speed: Number
        get() {
            return _tRG(__v_raw, "speed", __v_raw.speed, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("speed")) {
                return
            }
            val oldValue = __v_raw.speed
            __v_raw.speed = value
            _tRS(__v_raw, "speed", oldValue, value)
        }
}
open class TrackBounds (
    @JsonNotNull
    open var minLat: Number,
    @JsonNotNull
    open var maxLat: Number,
    @JsonNotNull
    open var minLng: Number,
    @JsonNotNull
    open var maxLng: Number,
) : UTSObject()
typealias MapMarker = Marker
val GenPagesPlayBackPlayBackClass = CreateVueComponent(GenPagesPlayBackPlayBack::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesPlayBackPlayBack.inheritAttrs, inject = GenPagesPlayBackPlayBack.inject, props = GenPagesPlayBackPlayBack.props, propsNeedCastKeys = GenPagesPlayBackPlayBack.propsNeedCastKeys, emits = GenPagesPlayBackPlayBack.emits, components = GenPagesPlayBackPlayBack.components, styles = GenPagesPlayBackPlayBack.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesPlayBackPlayBack.setup(props as GenPagesPlayBackPlayBack)
    }
    )
}
, fun(instance, renderer): GenPagesPlayBackPlayBack {
    return GenPagesPlayBackPlayBack(instance, renderer)
}
)
open class CoordinatePoint (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return CoordinatePointReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class CoordinatePointReactiveObject : CoordinatePoint, IUTSReactive<CoordinatePoint> {
    override var __v_raw: CoordinatePoint
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: CoordinatePoint, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(latitude = __v_raw.latitude, longitude = __v_raw.longitude) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): CoordinatePointReactiveObject {
        return CoordinatePointReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var latitude: Number
        get() {
            return _tRG(__v_raw, "latitude", __v_raw.latitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("latitude")) {
                return
            }
            val oldValue = __v_raw.latitude
            __v_raw.latitude = value
            _tRS(__v_raw, "latitude", oldValue, value)
        }
    override var longitude: Number
        get() {
            return _tRG(__v_raw, "longitude", __v_raw.longitude, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("longitude")) {
                return
            }
            val oldValue = __v_raw.longitude
            __v_raw.longitude = value
            _tRS(__v_raw, "longitude", oldValue, value)
        }
}
open class AnimationQueueItem (
    @JsonNotNull
    open var position: CoordinatePoint,
    @JsonNotNull
    open var rotation: Number,
    @JsonNotNull
    open var speed: Number,
    @JsonNotNull
    open var address: String,
    @JsonNotNull
    open var connectionStatus: String,
    @JsonNotNull
    open var positionTime: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return AnimationQueueItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class AnimationQueueItemReactiveObject : AnimationQueueItem, IUTSReactive<AnimationQueueItem> {
    override var __v_raw: AnimationQueueItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: AnimationQueueItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(position = __v_raw.position, rotation = __v_raw.rotation, speed = __v_raw.speed, address = __v_raw.address, connectionStatus = __v_raw.connectionStatus, positionTime = __v_raw.positionTime) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): AnimationQueueItemReactiveObject {
        return AnimationQueueItemReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var position: CoordinatePoint
        get() {
            return _tRG(__v_raw, "position", __v_raw.position, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("position")) {
                return
            }
            val oldValue = __v_raw.position
            __v_raw.position = value
            _tRS(__v_raw, "position", oldValue, value)
        }
    override var rotation: Number
        get() {
            return _tRG(__v_raw, "rotation", __v_raw.rotation, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("rotation")) {
                return
            }
            val oldValue = __v_raw.rotation
            __v_raw.rotation = value
            _tRS(__v_raw, "rotation", oldValue, value)
        }
    override var speed: Number
        get() {
            return _tRG(__v_raw, "speed", __v_raw.speed, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("speed")) {
                return
            }
            val oldValue = __v_raw.speed
            __v_raw.speed = value
            _tRS(__v_raw, "speed", oldValue, value)
        }
    override var address: String
        get() {
            return _tRG(__v_raw, "address", __v_raw.address, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("address")) {
                return
            }
            val oldValue = __v_raw.address
            __v_raw.address = value
            _tRS(__v_raw, "address", oldValue, value)
        }
    override var connectionStatus: String
        get() {
            return _tRG(__v_raw, "connectionStatus", __v_raw.connectionStatus, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("connectionStatus")) {
                return
            }
            val oldValue = __v_raw.connectionStatus
            __v_raw.connectionStatus = value
            _tRS(__v_raw, "connectionStatus", oldValue, value)
        }
    override var positionTime: String
        get() {
            return _tRG(__v_raw, "positionTime", __v_raw.positionTime, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("positionTime")) {
                return
            }
            val oldValue = __v_raw.positionTime
            __v_raw.positionTime = value
            _tRS(__v_raw, "positionTime", oldValue, value)
        }
}
val GenPagesVehicleTrackingVehicleTrackingClass = CreateVueComponent(GenPagesVehicleTrackingVehicleTracking::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesVehicleTrackingVehicleTracking.inheritAttrs, inject = GenPagesVehicleTrackingVehicleTracking.inject, props = GenPagesVehicleTrackingVehicleTracking.props, propsNeedCastKeys = GenPagesVehicleTrackingVehicleTracking.propsNeedCastKeys, emits = GenPagesVehicleTrackingVehicleTracking.emits, components = GenPagesVehicleTrackingVehicleTracking.components, styles = GenPagesVehicleTrackingVehicleTracking.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesVehicleTrackingVehicleTracking.setup(props as GenPagesVehicleTrackingVehicleTracking)
    }
    )
}
, fun(instance, renderer): GenPagesVehicleTrackingVehicleTracking {
    return GenPagesVehicleTrackingVehicleTracking(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIEmptyIEmptyClass = CreateVueComponent(GenUniModulesIUiXComponentsIEmptyIEmpty::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIEmptyIEmpty.name, inheritAttrs = GenUniModulesIUiXComponentsIEmptyIEmpty.inheritAttrs, inject = GenUniModulesIUiXComponentsIEmptyIEmpty.inject, props = GenUniModulesIUiXComponentsIEmptyIEmpty.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIEmptyIEmpty.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIEmptyIEmpty.emits, components = GenUniModulesIUiXComponentsIEmptyIEmpty.components, styles = GenUniModulesIUiXComponentsIEmptyIEmpty.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIEmptyIEmpty.setup(props as GenUniModulesIUiXComponentsIEmptyIEmpty)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIEmptyIEmpty {
    return GenUniModulesIUiXComponentsIEmptyIEmpty(instance)
}
)
val GenUniModulesIUiXComponentsITagITagClass = CreateVueComponent(GenUniModulesIUiXComponentsITagITag::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsITagITag.name, inheritAttrs = GenUniModulesIUiXComponentsITagITag.inheritAttrs, inject = GenUniModulesIUiXComponentsITagITag.inject, props = GenUniModulesIUiXComponentsITagITag.props, propsNeedCastKeys = GenUniModulesIUiXComponentsITagITag.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsITagITag.emits, components = GenUniModulesIUiXComponentsITagITag.components, styles = GenUniModulesIUiXComponentsITagITag.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsITagITag.setup(props as GenUniModulesIUiXComponentsITagITag)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsITagITag {
    return GenUniModulesIUiXComponentsITagITag(instance)
}
)
open class GroupType (
    @JsonNotNull
    open var date: String,
    @JsonNotNull
    open var trips: UTSArray<UTSJSONObject>,
    @JsonNotNull
    open var totalDistance: Number,
) : UTSObject()
open class DateTripGroup (
    @JsonNotNull
    open var date: String,
    @JsonNotNull
    open var trips: UTSArray<UTSJSONObject>,
) : UTSObject()
val GenPagesMileageRecordMileageRecordClass = CreateVueComponent(GenPagesMileageRecordMileageRecord::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesMileageRecordMileageRecord.inheritAttrs, inject = GenPagesMileageRecordMileageRecord.inject, props = GenPagesMileageRecordMileageRecord.props, propsNeedCastKeys = GenPagesMileageRecordMileageRecord.propsNeedCastKeys, emits = GenPagesMileageRecordMileageRecord.emits, components = GenPagesMileageRecordMileageRecord.components, styles = GenPagesMileageRecordMileageRecord.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesMileageRecordMileageRecord.setup(props as GenPagesMileageRecordMileageRecord)
    }
    )
}
, fun(instance, renderer): GenPagesMileageRecordMileageRecord {
    return GenPagesMileageRecordMileageRecord(instance, renderer)
}
)
typealias StopRecord = UTSJSONObject
val GenPagesStopRecordStopRecordClass = CreateVueComponent(GenPagesStopRecordStopRecord::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesStopRecordStopRecord.inheritAttrs, inject = GenPagesStopRecordStopRecord.inject, props = GenPagesStopRecordStopRecord.props, propsNeedCastKeys = GenPagesStopRecordStopRecord.propsNeedCastKeys, emits = GenPagesStopRecordStopRecord.emits, components = GenPagesStopRecordStopRecord.components, styles = GenPagesStopRecordStopRecord.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesStopRecordStopRecord.setup(props as GenPagesStopRecordStopRecord)
    }
    )
}
, fun(instance, renderer): GenPagesStopRecordStopRecord {
    return GenPagesStopRecordStopRecord(instance, renderer)
}
)
open class UserInfo (
    @JsonNotNull
    open var id: String,
    @JsonNotNull
    open var mobile: String,
    @JsonNotNull
    open var type: Number,
    @JsonNotNull
    open var createTime: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return UserInfoReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class UserInfoReactiveObject : UserInfo, IUTSReactive<UserInfo> {
    override var __v_raw: UserInfo
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: UserInfo, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(id = __v_raw.id, mobile = __v_raw.mobile, type = __v_raw.type, createTime = __v_raw.createTime) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UserInfoReactiveObject {
        return UserInfoReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var id: String
        get() {
            return _tRG(__v_raw, "id", __v_raw.id, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("id")) {
                return
            }
            val oldValue = __v_raw.id
            __v_raw.id = value
            _tRS(__v_raw, "id", oldValue, value)
        }
    override var mobile: String
        get() {
            return _tRG(__v_raw, "mobile", __v_raw.mobile, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("mobile")) {
                return
            }
            val oldValue = __v_raw.mobile
            __v_raw.mobile = value
            _tRS(__v_raw, "mobile", oldValue, value)
        }
    override var type: Number
        get() {
            return _tRG(__v_raw, "type", __v_raw.type, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("type")) {
                return
            }
            val oldValue = __v_raw.type
            __v_raw.type = value
            _tRS(__v_raw, "type", oldValue, value)
        }
    override var createTime: String
        get() {
            return _tRG(__v_raw, "createTime", __v_raw.createTime, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("createTime")) {
                return
            }
            val oldValue = __v_raw.createTime
            __v_raw.createTime = value
            _tRS(__v_raw, "createTime", oldValue, value)
        }
}
val GenPagesUserCenterUserInfoUserInfoClass = CreateVueComponent(GenPagesUserCenterUserInfoUserInfo::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterUserInfoUserInfo.inheritAttrs, inject = GenPagesUserCenterUserInfoUserInfo.inject, props = GenPagesUserCenterUserInfoUserInfo.props, propsNeedCastKeys = GenPagesUserCenterUserInfoUserInfo.propsNeedCastKeys, emits = GenPagesUserCenterUserInfoUserInfo.emits, components = GenPagesUserCenterUserInfoUserInfo.components, styles = GenPagesUserCenterUserInfoUserInfo.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterUserInfoUserInfo.setup(props as GenPagesUserCenterUserInfoUserInfo)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterUserInfoUserInfo {
    return GenPagesUserCenterUserInfoUserInfo(instance, renderer)
}
)
open class PasswordForm__1 (
    @JsonNotNull
    open var oldPassword: String,
    @JsonNotNull
    open var newPassword: String,
    @JsonNotNull
    open var confirmPassword: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PasswordForm__1ReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PasswordForm__1ReactiveObject : PasswordForm__1, IUTSReactive<PasswordForm__1> {
    override var __v_raw: PasswordForm__1
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PasswordForm__1, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(oldPassword = __v_raw.oldPassword, newPassword = __v_raw.newPassword, confirmPassword = __v_raw.confirmPassword) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PasswordForm__1ReactiveObject {
        return PasswordForm__1ReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var oldPassword: String
        get() {
            return _tRG(__v_raw, "oldPassword", __v_raw.oldPassword, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("oldPassword")) {
                return
            }
            val oldValue = __v_raw.oldPassword
            __v_raw.oldPassword = value
            _tRS(__v_raw, "oldPassword", oldValue, value)
        }
    override var newPassword: String
        get() {
            return _tRG(__v_raw, "newPassword", __v_raw.newPassword, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("newPassword")) {
                return
            }
            val oldValue = __v_raw.newPassword
            __v_raw.newPassword = value
            _tRS(__v_raw, "newPassword", oldValue, value)
        }
    override var confirmPassword: String
        get() {
            return _tRG(__v_raw, "confirmPassword", __v_raw.confirmPassword, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("confirmPassword")) {
                return
            }
            val oldValue = __v_raw.confirmPassword
            __v_raw.confirmPassword = value
            _tRS(__v_raw, "confirmPassword", oldValue, value)
        }
}
val GenPagesUserCenterEditPasswordEditPasswordClass = CreateVueComponent(GenPagesUserCenterEditPasswordEditPassword::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterEditPasswordEditPassword.inheritAttrs, inject = GenPagesUserCenterEditPasswordEditPassword.inject, props = GenPagesUserCenterEditPasswordEditPassword.props, propsNeedCastKeys = GenPagesUserCenterEditPasswordEditPassword.propsNeedCastKeys, emits = GenPagesUserCenterEditPasswordEditPassword.emits, components = GenPagesUserCenterEditPasswordEditPassword.components, styles = GenPagesUserCenterEditPasswordEditPassword.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterEditPasswordEditPassword.setup(props as GenPagesUserCenterEditPasswordEditPassword)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterEditPasswordEditPassword {
    return GenPagesUserCenterEditPasswordEditPassword(instance, renderer)
}
)
val GenPagesUserCenterCarListCarListClass = CreateVueComponent(GenPagesUserCenterCarListCarList::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterCarListCarList.inheritAttrs, inject = GenPagesUserCenterCarListCarList.inject, props = GenPagesUserCenterCarListCarList.props, propsNeedCastKeys = GenPagesUserCenterCarListCarList.propsNeedCastKeys, emits = GenPagesUserCenterCarListCarList.emits, components = GenPagesUserCenterCarListCarList.components, styles = GenPagesUserCenterCarListCarList.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterCarListCarList.setup(props as GenPagesUserCenterCarListCarList)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterCarListCarList {
    return GenPagesUserCenterCarListCarList(instance, renderer)
}
)
fun __uts_large_carTypeNames_fill_fill_1(__obj: UTSJSONObject): Unit {
    __obj["car"] = "轿车"
    __obj["suv"] = "越野车"
    __obj["bus"] = "公交车"
    __obj["huoche"] = "货车"
    __obj["train"] = "火车"
    __obj["diandong"] = "电动车"
    __obj["moto"] = "摩托车"
    __obj["bike"] = "自行车"
    __obj["sanlun"] = "三轮车"
    __obj["tuola"] = "拖拉机"
    __obj["wajue"] = "挖掘机"
    __obj["tuiche"] = "手推车"
    __obj["baby"] = "婴儿车"
    __obj["muma"] = "木马"
    __obj["tank"] = "坦克"
    __obj["zhuangjia"] = "装甲车"
    __obj["plan"] = "飞机"
    __obj["hangmu"] = "航母"
    __obj["junjian"] = "军舰"
    __obj["walk"] = "步行"
}
fun __uts_large_carTypeNames_build_0(): UTSJSONObject {
    val __obj: UTSJSONObject = _uO()
    __uts_large_carTypeNames_fill_fill_1(__obj)
    return __obj
}
open class VehicleEditInfo (
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var carType: String,
    @JsonNotNull
    open var carTypeValue: String,
    @JsonNotNull
    open var plateNo: String,
    @JsonNotNull
    open var carVin: String,
    @JsonNotNull
    open var engineNum: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return VehicleEditInfoReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class VehicleEditInfoReactiveObject : VehicleEditInfo, IUTSReactive<VehicleEditInfo> {
    override var __v_raw: VehicleEditInfo
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: VehicleEditInfo, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(deviceName = __v_raw.deviceName, carType = __v_raw.carType, carTypeValue = __v_raw.carTypeValue, plateNo = __v_raw.plateNo, carVin = __v_raw.carVin, engineNum = __v_raw.engineNum) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): VehicleEditInfoReactiveObject {
        return VehicleEditInfoReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var deviceName: String
        get() {
            return _tRG(__v_raw, "deviceName", __v_raw.deviceName, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceName")) {
                return
            }
            val oldValue = __v_raw.deviceName
            __v_raw.deviceName = value
            _tRS(__v_raw, "deviceName", oldValue, value)
        }
    override var carType: String
        get() {
            return _tRG(__v_raw, "carType", __v_raw.carType, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("carType")) {
                return
            }
            val oldValue = __v_raw.carType
            __v_raw.carType = value
            _tRS(__v_raw, "carType", oldValue, value)
        }
    override var carTypeValue: String
        get() {
            return _tRG(__v_raw, "carTypeValue", __v_raw.carTypeValue, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("carTypeValue")) {
                return
            }
            val oldValue = __v_raw.carTypeValue
            __v_raw.carTypeValue = value
            _tRS(__v_raw, "carTypeValue", oldValue, value)
        }
    override var plateNo: String
        get() {
            return _tRG(__v_raw, "plateNo", __v_raw.plateNo, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("plateNo")) {
                return
            }
            val oldValue = __v_raw.plateNo
            __v_raw.plateNo = value
            _tRS(__v_raw, "plateNo", oldValue, value)
        }
    override var carVin: String
        get() {
            return _tRG(__v_raw, "carVin", __v_raw.carVin, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("carVin")) {
                return
            }
            val oldValue = __v_raw.carVin
            __v_raw.carVin = value
            _tRS(__v_raw, "carVin", oldValue, value)
        }
    override var engineNum: String
        get() {
            return _tRG(__v_raw, "engineNum", __v_raw.engineNum, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("engineNum")) {
                return
            }
            val oldValue = __v_raw.engineNum
            __v_raw.engineNum = value
            _tRS(__v_raw, "engineNum", oldValue, value)
        }
}
typealias CarIconItem__2 = UTSJSONObject
val GenPagesUserCenterCarDetailCarDetailClass = CreateVueComponent(GenPagesUserCenterCarDetailCarDetail::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterCarDetailCarDetail.inheritAttrs, inject = GenPagesUserCenterCarDetailCarDetail.inject, props = GenPagesUserCenterCarDetailCarDetail.props, propsNeedCastKeys = GenPagesUserCenterCarDetailCarDetail.propsNeedCastKeys, emits = GenPagesUserCenterCarDetailCarDetail.emits, components = GenPagesUserCenterCarDetailCarDetail.components, styles = GenPagesUserCenterCarDetailCarDetail.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterCarDetailCarDetail.setup(props as GenPagesUserCenterCarDetailCarDetail)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterCarDetailCarDetail {
    return GenPagesUserCenterCarDetailCarDetail(instance, renderer)
}
)
val GenUniModulesIUiXComponentsIRadioIRadioClass = CreateVueComponent(GenUniModulesIUiXComponentsIRadioIRadio::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIRadioIRadio.name, inheritAttrs = GenUniModulesIUiXComponentsIRadioIRadio.inheritAttrs, inject = GenUniModulesIUiXComponentsIRadioIRadio.inject, props = GenUniModulesIUiXComponentsIRadioIRadio.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIRadioIRadio.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIRadioIRadio.emits, components = GenUniModulesIUiXComponentsIRadioIRadio.components, styles = GenUniModulesIUiXComponentsIRadioIRadio.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsIRadioIRadio.setup(props as GenUniModulesIUiXComponentsIRadioIRadio)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIRadioIRadio {
    return GenUniModulesIUiXComponentsIRadioIRadio(instance)
}
)
val GenUniModulesIUiXComponentsISwitchISwitchClass = CreateVueComponent(GenUniModulesIUiXComponentsISwitchISwitch::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsISwitchISwitch.name, inheritAttrs = GenUniModulesIUiXComponentsISwitchISwitch.inheritAttrs, inject = GenUniModulesIUiXComponentsISwitchISwitch.inject, props = GenUniModulesIUiXComponentsISwitchISwitch.props, propsNeedCastKeys = GenUniModulesIUiXComponentsISwitchISwitch.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsISwitchISwitch.emits, components = GenUniModulesIUiXComponentsISwitchISwitch.components, styles = GenUniModulesIUiXComponentsISwitchISwitch.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsISwitchISwitch.setup(props as GenUniModulesIUiXComponentsISwitchISwitch)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsISwitchISwitch {
    return GenUniModulesIUiXComponentsISwitchISwitch(instance)
}
)
typealias Coordinate__1 = LocationObject
open class PaginationState (
    @JsonNotNull
    open var pageNum: Number,
    @JsonNotNull
    open var pageSize: Number,
    @JsonNotNull
    open var hasMore: Boolean = false,
    @JsonNotNull
    open var loadingMore: Boolean = false,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PaginationStateReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PaginationStateReactiveObject : PaginationState, IUTSReactive<PaginationState> {
    override var __v_raw: PaginationState
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PaginationState, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(pageNum = __v_raw.pageNum, pageSize = __v_raw.pageSize, hasMore = __v_raw.hasMore, loadingMore = __v_raw.loadingMore) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PaginationStateReactiveObject {
        return PaginationStateReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var pageNum: Number
        get() {
            return _tRG(__v_raw, "pageNum", __v_raw.pageNum, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("pageNum")) {
                return
            }
            val oldValue = __v_raw.pageNum
            __v_raw.pageNum = value
            _tRS(__v_raw, "pageNum", oldValue, value)
        }
    override var pageSize: Number
        get() {
            return _tRG(__v_raw, "pageSize", __v_raw.pageSize, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("pageSize")) {
                return
            }
            val oldValue = __v_raw.pageSize
            __v_raw.pageSize = value
            _tRS(__v_raw, "pageSize", oldValue, value)
        }
    override var hasMore: Boolean
        get() {
            return _tRG(__v_raw, "hasMore", __v_raw.hasMore, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("hasMore")) {
                return
            }
            val oldValue = __v_raw.hasMore
            __v_raw.hasMore = value
            _tRS(__v_raw, "hasMore", oldValue, value)
        }
    override var loadingMore: Boolean
        get() {
            return _tRG(__v_raw, "loadingMore", __v_raw.loadingMore, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("loadingMore")) {
                return
            }
            val oldValue = __v_raw.loadingMore
            __v_raw.loadingMore = value
            _tRS(__v_raw, "loadingMore", oldValue, value)
        }
}
open class Pagination (
    @JsonNotNull
    open var bind: PaginationState,
    @JsonNotNull
    open var unbind: PaginationState,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PaginationReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PaginationReactiveObject : Pagination, IUTSReactive<Pagination> {
    override var __v_raw: Pagination
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: Pagination, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(bind = __v_raw.bind, unbind = __v_raw.unbind) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PaginationReactiveObject {
        return PaginationReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var bind: PaginationState
        get() {
            return _tRG(__v_raw, "bind", __v_raw.bind, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("bind")) {
                return
            }
            val oldValue = __v_raw.bind
            __v_raw.bind = value
            _tRS(__v_raw, "bind", oldValue, value)
        }
    override var unbind: PaginationState
        get() {
            return _tRG(__v_raw, "unbind", __v_raw.unbind, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("unbind")) {
                return
            }
            val oldValue = __v_raw.unbind
            __v_raw.unbind = value
            _tRS(__v_raw, "unbind", oldValue, value)
        }
}
open class CircleData (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
    @JsonNotNull
    open var radius: Number,
) : UTSObject()
open class FenceForm (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var alarmType: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return FenceFormReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class FenceFormReactiveObject : FenceForm, IUTSReactive<FenceForm> {
    override var __v_raw: FenceForm
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: FenceForm, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(name = __v_raw.name, alarmType = __v_raw.alarmType) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): FenceFormReactiveObject {
        return FenceFormReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var name: String
        get() {
            return _tRG(__v_raw, "name", __v_raw.name, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("name")) {
                return
            }
            val oldValue = __v_raw.name
            __v_raw.name = value
            _tRS(__v_raw, "name", oldValue, value)
        }
    override var alarmType: String
        get() {
            return _tRG(__v_raw, "alarmType", __v_raw.alarmType, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("alarmType")) {
                return
            }
            val oldValue = __v_raw.alarmType
            __v_raw.alarmType = value
            _tRS(__v_raw, "alarmType", oldValue, value)
        }
}
open class CoordinateBounds (
    @JsonNotNull
    open var minLat: Number,
    @JsonNotNull
    open var maxLat: Number,
    @JsonNotNull
    open var minLng: Number,
    @JsonNotNull
    open var maxLng: Number,
) : UTSObject()
val GenPagesGeofencingGeofencingClass = CreateVueComponent(GenPagesGeofencingGeofencing::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesGeofencingGeofencing.inheritAttrs, inject = GenPagesGeofencingGeofencing.inject, props = GenPagesGeofencingGeofencing.props, propsNeedCastKeys = GenPagesGeofencingGeofencing.propsNeedCastKeys, emits = GenPagesGeofencingGeofencing.emits, components = GenPagesGeofencingGeofencing.components, styles = GenPagesGeofencingGeofencing.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesGeofencingGeofencing.setup(props as GenPagesGeofencingGeofencing)
    }
    )
}
, fun(instance, renderer): GenPagesGeofencingGeofencing {
    return GenPagesGeofencingGeofencing(instance, renderer)
}
)
val GenPagesScancodeScancodeClass = CreateVueComponent(GenPagesScancodeScancode::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesScancodeScancode.inheritAttrs, inject = GenPagesScancodeScancode.inject, props = GenPagesScancodeScancode.props, propsNeedCastKeys = GenPagesScancodeScancode.propsNeedCastKeys, emits = GenPagesScancodeScancode.emits, components = GenPagesScancodeScancode.components, styles = GenPagesScancodeScancode.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesScancodeScancode.setup(props as GenPagesScancodeScancode)
    }
    )
}
, fun(instance, renderer): GenPagesScancodeScancode {
    return GenPagesScancodeScancode(instance, renderer)
}
)
val GenPagesUserCenterPayDeviceListPayDeviceListClass = CreateVueComponent(GenPagesUserCenterPayDeviceListPayDeviceList::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesUserCenterPayDeviceListPayDeviceList.inheritAttrs, inject = GenPagesUserCenterPayDeviceListPayDeviceList.inject, props = GenPagesUserCenterPayDeviceListPayDeviceList.props, propsNeedCastKeys = GenPagesUserCenterPayDeviceListPayDeviceList.propsNeedCastKeys, emits = GenPagesUserCenterPayDeviceListPayDeviceList.emits, components = GenPagesUserCenterPayDeviceListPayDeviceList.components, styles = GenPagesUserCenterPayDeviceListPayDeviceList.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesUserCenterPayDeviceListPayDeviceList.setup(props as GenPagesUserCenterPayDeviceListPayDeviceList)
    }
    )
}
, fun(instance, renderer): GenPagesUserCenterPayDeviceListPayDeviceList {
    return GenPagesUserCenterPayDeviceListPayDeviceList(instance, renderer)
}
)
val GenUniModulesIUiXComponentsITabsITabsClass = CreateVueComponent(GenUniModulesIUiXComponentsITabsITabs::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsITabsITabs.name, inheritAttrs = GenUniModulesIUiXComponentsITabsITabs.inheritAttrs, inject = GenUniModulesIUiXComponentsITabsITabs.inject, props = GenUniModulesIUiXComponentsITabsITabs.props, propsNeedCastKeys = GenUniModulesIUiXComponentsITabsITabs.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsITabsITabs.emits, components = GenUniModulesIUiXComponentsITabsITabs.components, styles = GenUniModulesIUiXComponentsITabsITabs.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesIUiXComponentsITabsITabs.setup(props as GenUniModulesIUiXComponentsITabsITabs)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsITabsITabs {
    return GenUniModulesIUiXComponentsITabsITabs(instance)
}
)
val GenUniModulesIUiXComponentsIActionSheetIActionSheetClass = CreateVueComponent(GenUniModulesIUiXComponentsIActionSheetIActionSheet::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = GenUniModulesIUiXComponentsIActionSheetIActionSheet.name, inheritAttrs = GenUniModulesIUiXComponentsIActionSheetIActionSheet.inheritAttrs, inject = GenUniModulesIUiXComponentsIActionSheetIActionSheet.inject, props = GenUniModulesIUiXComponentsIActionSheetIActionSheet.props, propsNeedCastKeys = GenUniModulesIUiXComponentsIActionSheetIActionSheet.propsNeedCastKeys, emits = GenUniModulesIUiXComponentsIActionSheetIActionSheet.emits, components = GenUniModulesIUiXComponentsIActionSheetIActionSheet.components, styles = GenUniModulesIUiXComponentsIActionSheetIActionSheet.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesIUiXComponentsIActionSheetIActionSheet.setup(props as GenUniModulesIUiXComponentsIActionSheetIActionSheet, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesIUiXComponentsIActionSheetIActionSheet {
    return GenUniModulesIUiXComponentsIActionSheetIActionSheet(instance)
}
)
val GenPagesCmdCmdClass = CreateVueComponent(GenPagesCmdCmd::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesCmdCmd.inheritAttrs, inject = GenPagesCmdCmd.inject, props = GenPagesCmdCmd.props, propsNeedCastKeys = GenPagesCmdCmd.propsNeedCastKeys, emits = GenPagesCmdCmd.emits, components = GenPagesCmdCmd.components, styles = GenPagesCmdCmd.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesCmdCmd.setup(props as GenPagesCmdCmd)
    }
    )
}
, fun(instance, renderer): GenPagesCmdCmd {
    return GenPagesCmdCmd(instance, renderer)
}
)
val GenPagesWebviewWebviewClass = CreateVueComponent(GenPagesWebviewWebview::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesWebviewWebview.inheritAttrs, inject = GenPagesWebviewWebview.inject, props = GenPagesWebviewWebview.props, propsNeedCastKeys = GenPagesWebviewWebview.propsNeedCastKeys, emits = GenPagesWebviewWebview.emits, components = GenPagesWebviewWebview.components, styles = GenPagesWebviewWebview.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesWebviewWebview.setup(props as GenPagesWebviewWebview)
    }
    )
}
, fun(instance, renderer): GenPagesWebviewWebview {
    return GenPagesWebviewWebview(instance, renderer)
}
)
open class DeviceItem (
    @JsonNotNull
    open var plateNo: String,
    @JsonNotNull
    open var imei: String,
    @JsonNotNull
    open var status: Number,
    @JsonNotNull
    open var companyId: String,
    @JsonNotNull
    open var deviceName: String,
    @JsonNotNull
    open var deviceId: String,
    @JsonNotNull
    open var iccid: String,
    @JsonNotNull
    open var simMerchant: String,
    @JsonNotNull
    open var connectionStatus: String,
) : UTSReactiveObject() {
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DeviceItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DeviceItemReactiveObject : DeviceItem, IUTSReactive<DeviceItem> {
    override var __v_raw: DeviceItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DeviceItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(plateNo = __v_raw.plateNo, imei = __v_raw.imei, status = __v_raw.status, companyId = __v_raw.companyId, deviceName = __v_raw.deviceName, deviceId = __v_raw.deviceId, iccid = __v_raw.iccid, simMerchant = __v_raw.simMerchant, connectionStatus = __v_raw.connectionStatus) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DeviceItemReactiveObject {
        return DeviceItemReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var plateNo: String
        get() {
            return _tRG(__v_raw, "plateNo", __v_raw.plateNo, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("plateNo")) {
                return
            }
            val oldValue = __v_raw.plateNo
            __v_raw.plateNo = value
            _tRS(__v_raw, "plateNo", oldValue, value)
        }
    override var imei: String
        get() {
            return _tRG(__v_raw, "imei", __v_raw.imei, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("imei")) {
                return
            }
            val oldValue = __v_raw.imei
            __v_raw.imei = value
            _tRS(__v_raw, "imei", oldValue, value)
        }
    override var status: Number
        get() {
            return _tRG(__v_raw, "status", __v_raw.status, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("status")) {
                return
            }
            val oldValue = __v_raw.status
            __v_raw.status = value
            _tRS(__v_raw, "status", oldValue, value)
        }
    override var companyId: String
        get() {
            return _tRG(__v_raw, "companyId", __v_raw.companyId, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("companyId")) {
                return
            }
            val oldValue = __v_raw.companyId
            __v_raw.companyId = value
            _tRS(__v_raw, "companyId", oldValue, value)
        }
    override var deviceName: String
        get() {
            return _tRG(__v_raw, "deviceName", __v_raw.deviceName, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceName")) {
                return
            }
            val oldValue = __v_raw.deviceName
            __v_raw.deviceName = value
            _tRS(__v_raw, "deviceName", oldValue, value)
        }
    override var deviceId: String
        get() {
            return _tRG(__v_raw, "deviceId", __v_raw.deviceId, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("deviceId")) {
                return
            }
            val oldValue = __v_raw.deviceId
            __v_raw.deviceId = value
            _tRS(__v_raw, "deviceId", oldValue, value)
        }
    override var iccid: String
        get() {
            return _tRG(__v_raw, "iccid", __v_raw.iccid, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("iccid")) {
                return
            }
            val oldValue = __v_raw.iccid
            __v_raw.iccid = value
            _tRS(__v_raw, "iccid", oldValue, value)
        }
    override var simMerchant: String
        get() {
            return _tRG(__v_raw, "simMerchant", __v_raw.simMerchant, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("simMerchant")) {
                return
            }
            val oldValue = __v_raw.simMerchant
            __v_raw.simMerchant = value
            _tRS(__v_raw, "simMerchant", oldValue, value)
        }
    override var connectionStatus: String
        get() {
            return _tRG(__v_raw, "connectionStatus", __v_raw.connectionStatus, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("connectionStatus")) {
                return
            }
            val oldValue = __v_raw.connectionStatus
            __v_raw.connectionStatus = value
            _tRS(__v_raw, "connectionStatus", oldValue, value)
        }
}
val GenComponentsIndexListModeIndexListModeClass = CreateVueComponent(GenComponentsIndexListModeIndexListMode::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenComponentsIndexListModeIndexListMode.inheritAttrs, inject = GenComponentsIndexListModeIndexListMode.inject, props = GenComponentsIndexListModeIndexListMode.props, propsNeedCastKeys = GenComponentsIndexListModeIndexListMode.propsNeedCastKeys, emits = GenComponentsIndexListModeIndexListMode.emits, components = GenComponentsIndexListModeIndexListMode.components, styles = GenComponentsIndexListModeIndexListMode.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenComponentsIndexListModeIndexListMode.setup(props as GenComponentsIndexListModeIndexListMode)
    }
    )
}
, fun(instance, renderer): GenComponentsIndexListModeIndexListMode {
    return GenComponentsIndexListModeIndexListMode(instance)
}
)
val GenPagesDeviceListDeviceListClass = CreateVueComponent(GenPagesDeviceListDeviceList::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenPagesDeviceListDeviceList.inheritAttrs, inject = GenPagesDeviceListDeviceList.inject, props = GenPagesDeviceListDeviceList.props, propsNeedCastKeys = GenPagesDeviceListDeviceList.propsNeedCastKeys, emits = GenPagesDeviceListDeviceList.emits, components = GenPagesDeviceListDeviceList.components, styles = GenPagesDeviceListDeviceList.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenPagesDeviceListDeviceList.setup(props as GenPagesDeviceListDeviceList)
    }
    )
}
, fun(instance, renderer): GenPagesDeviceListDeviceList {
    return GenPagesDeviceListDeviceList(instance, renderer)
}
)
fun createApp(): UTSJSONObject {
    val app = createSSRApp(GenAppClass)
    return _uO("app" to app)
}
fun main(app: IApp) {
    enableStyleIsolation()
    definePageRoutes()
    defineAppConfig()
    (createApp()["app"] as VueApp).mount(app, GenUniApp())
}
open class UniAppConfig : io.dcloud.uniapp.appframe.AppConfig {
    override var name: String = "中导物联"
    override var appid: String = "__UNI__662B0B4"
    override var versionName: String = "1.0.2"
    override var versionCode: String = "102"
    override var uniCompilerVersion: String = "5.25"
    constructor() : super() {}
}
fun definePageRoutes() {
    __uniRoutes.push(UniPageRoute(path = "pages/index/index", component = GenPagesIndexIndexClass, meta = UniPageMeta(isQuit = true), style = _uM("navigationBarTitleText" to "车联网")))
    __uniRoutes.push(UniPageRoute(path = "pages/message/message", component = GenPagesMessageMessageClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "消息")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/userCenter", component = GenPagesUserCenterUserCenterClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "我的")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/login", component = GenPagesLoginLoginClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "登陆")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/personal-password-login", component = GenPagesLoginPersonalPasswordLoginClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "个人账号登录")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/register", component = GenPagesLoginRegisterClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "个人用户注册")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/forgot-password", component = GenPagesLoginForgotPasswordClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "忘记密码")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/set-password", component = GenPagesLoginSetPasswordClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "设置登录密码")))
    __uniRoutes.push(UniPageRoute(path = "pages/carInfoDetail/carInfoDetail", component = GenPagesCarInfoDetailCarInfoDetailClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "车辆详情")))
    __uniRoutes.push(UniPageRoute(path = "pages/addCar/addCar", component = GenPagesAddCarAddCarClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "添加车辆")))
    __uniRoutes.push(UniPageRoute(path = "pages/playBack/playBack", component = GenPagesPlayBackPlayBackClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "轨迹回放")))
    __uniRoutes.push(UniPageRoute(path = "pages/vehicleTracking/vehicleTracking", component = GenPagesVehicleTrackingVehicleTrackingClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "车辆跟踪")))
    __uniRoutes.push(UniPageRoute(path = "pages/mileageRecord/mileageRecord", component = GenPagesMileageRecordMileageRecordClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/stopRecord/stopRecord", component = GenPagesStopRecordStopRecordClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/userInfo/userInfo", component = GenPagesUserCenterUserInfoUserInfoClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/editPassword/editPassword", component = GenPagesUserCenterEditPasswordEditPasswordClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/carList/carList", component = GenPagesUserCenterCarListCarListClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/carDetail/carDetail", component = GenPagesUserCenterCarDetailCarDetailClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/geofencing/geofencing", component = GenPagesGeofencingGeofencingClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/scancode/scancode", component = GenPagesScancodeScancodeClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/payDeviceList/payDeviceList", component = GenPagesUserCenterPayDeviceListPayDeviceListClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/cmd/cmd", component = GenPagesCmdCmdClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/webview/webview", component = GenPagesWebviewWebviewClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "")))
    __uniRoutes.push(UniPageRoute(path = "pages/deviceList/deviceList", component = GenPagesDeviceListDeviceListClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "设备列表")))
}
val __uniTabBar: Map<String, Any?>? = _uM("color" to "#2c2c2c", "selectedColor" to "#d81e06", "borderStyle" to "black", "backgroundColor" to "#ffffff", "list" to _uA(
    _uM("pagePath" to "pages/index/index", "iconPath" to "/static/tabBar/home.png", "selectedIconPath" to "/static/tabBar/home1.png", "text" to "首页"),
    _uM("pagePath" to "pages/message/message", "iconPath" to "/static/tabBar/message.png", "selectedIconPath" to "/static/tabBar/message1.png", "text" to "消息"),
    _uM("pagePath" to "pages/userCenter/userCenter", "iconPath" to "/static/tabBar/userCenter.png", "selectedIconPath" to "/static/tabBar/userCenter1.png", "text" to "我的")
))
val __uniLaunchPage: Map<String, Any?> = _uM("url" to "pages/index/index", "style" to _uM("navigationBarTitleText" to "车联网"))
fun defineAppConfig() {
    __uniConfig.entryPagePath = "/pages/index/index"
    __uniConfig.globalStyle = _uM("navigationStyle" to "custom", "navigationBarTextStyle" to "black", "navigationBarTitleText" to "车联网", "navigationBarBackgroundColor" to "#F8F8F8", "backgroundColor" to "#F8F8F8")
    __uniConfig.getTabBarConfig = fun(): Map<String, Any>? {
        return _uM("color" to "#2c2c2c", "selectedColor" to "#d81e06", "borderStyle" to "black", "backgroundColor" to "#ffffff", "list" to _uA(
            _uM("pagePath" to "pages/index/index", "iconPath" to "/static/tabBar/home.png", "selectedIconPath" to "/static/tabBar/home1.png", "text" to "首页"),
            _uM("pagePath" to "pages/message/message", "iconPath" to "/static/tabBar/message.png", "selectedIconPath" to "/static/tabBar/message1.png", "text" to "消息"),
            _uM("pagePath" to "pages/userCenter/userCenter", "iconPath" to "/static/tabBar/userCenter.png", "selectedIconPath" to "/static/tabBar/userCenter1.png", "text" to "我的")
        ))
    }
    __uniConfig.tabBar = __uniConfig.getTabBarConfig()
    __uniConfig.conditionUrl = ""
    __uniConfig.uniIdRouter = _uM()
    __uniConfig.ready = true
}
open class UniCloudConfig : io.dcloud.unicloud.InternalUniCloudConfig {
    override var isDev: Boolean = false
    override var spaceList: String = "[{\"provider\":\"aliyun\",\"spaceName\":\"zdiot-car\",\"spaceId\":\"mp-3320fffa-3587-42c6-81f3-3de8de86e2ff\",\"clientSecret\":\"s9pFKgenncFnOUhRGOJpcw==\",\"endpoint\":\"https://api.next.bspapp.com\",\"failoverEndpoint\":\"\"}]"
    override var debuggerInfo: String? = null
    override var secureNetworkEnable: Boolean = false
    override var secureNetworkConfig: String? = "[]"
    constructor() : super() {}
}
open class GenUniApp : UniAppImpl() {
    open val vm: GenApp?
        get() {
            return getAppVm() as GenApp?
        }
    open val `$vm`: GenApp?
        get() {
            return getAppVm() as GenApp?
        }
}
fun getApp(): GenUniApp {
    return getUniApp() as GenUniApp
}
