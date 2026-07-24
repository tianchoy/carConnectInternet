@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
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
import java.math.BigDecimal
import kotlin.properties.Delegates
import io.dcloud.uniapp.extapi.connectSocket as uni_connectSocket
import io.dcloud.uniapp.extapi.exit as uni_exit
import io.dcloud.uniapp.extapi.getFileSystemManager as uni_getFileSystemManager
import io.dcloud.uniapp.extapi.getStorageSync as uni_getStorageSync
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.redirectTo as uni_redirectTo
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.request as uni_request
import io.dcloud.uniapp.extapi.rpx2px as uni_rpx2px
import io.dcloud.uniapp.extapi.showToast as uni_showToast
val runBlock1 = run {
    __uniConfig.getAppStyles = fun(): Map<String, Map<String, Map<String, Any>>> {
        return GenApp.styles
    }
}
typealias currentPageCaptureScreenshotCallBack = (base64: String, error: String) -> Unit
fun currentPageCaptureScreenshot(fullPage: Boolean, callback: currentPageCaptureScreenshotCallBack) {
    val pages = getCurrentPages() as UTSArray<UniPage>
    val currentPage = pages[pages.length - 1]
    currentPage.vm?.`$viewToTempFilePath`(ViewToTempFilePathOptions(wholeContent = fullPage, overwrite = true, success = fun(res){
        val fileManager = uni_getFileSystemManager()
        fileManager.readFile(ReadFileOptions(encoding = "base64", filePath = res.tempFilePath, success = fun(readFileRes) {
            callback(readFileRes.data as String, "")
        }
        , fail = fun(err) {
            callback("", "captureScreenshot fail: " + JSON.stringify(err))
        }
        ))
    }
    , fail = fun(err){
        callback("", "captureScreenshot fail: " + JSON.stringify(err))
    }
    ))
}
fun initRuntimeSocket(hosts: String, port: String, id: String): UTSPromise<SocketTask?> {
    if (hosts == "" || port == "" || id == "") {
        return UTSPromise.resolve(null)
    }
    return hosts.split(",").reduce<UTSPromise<SocketTask?>>(fun(promise: UTSPromise<SocketTask?>, host: String): UTSPromise<SocketTask?> {
        return promise.then(fun(socket): UTSPromise<SocketTask?> {
            if (socket != null) {
                return UTSPromise.resolve(socket)
            }
            return tryConnectSocket(host, port, id)
        }
        )
    }
    , UTSPromise.resolve(null))
}
val SOCKET_TIMEOUT: Number = 500
fun tryConnectSocket(host: String, port: String, id: String): UTSPromise<SocketTask?> {
    return UTSPromise(fun(resolve, reject){
        val socket = uni_connectSocket(ConnectSocketOptions(url = "ws://" + host + ":" + port + "/" + id, fail = fun(_) {
            resolve(null)
        }
        ))
        val timer = setTimeout(fun(){
            socket.close(CloseSocketOptions(code = 1006, reason = "connect timeout"))
            resolve(null)
        }
        , SOCKET_TIMEOUT)
        socket.onOpen(fun(e){
            clearTimeout(timer)
            resolve(socket)
        }
        )
        socket.onClose(fun(e){
            clearTimeout(timer)
            resolve(null)
        }
        )
        socket.onError(fun(e){
            clearTimeout(timer)
            resolve(null)
        }
        )
        socket.onMessage(fun(result){
            if (UTSAndroid.`typeof`(result["data"]) == "string") {
                val message = UTSAndroid.consoleDebugError(JSON.parse<UTSJSONObject>(result["data"] as String), " at ../../../../../../../../../Applications/HBuilderX-Alpha.app/Contents/HBuilderX/plugins/uniapp-cli-vite/node_modules/@dcloudio/uni-console/src/runtime/app/socket.ts:67")!!
                if ((message["type"] as String) == "screencap") {
                    val id = message["id"] as String
                    currentPageCaptureScreenshot(message["fullPage"] as Boolean, fun(base64: String, error: String){
                        socket.send(SendSocketMessageOptions(data = JSON.stringify(_uO("id" to id, "base64" to base64, "error" to error))))
                    }
                    )
                }
            }
            resolve(null)
        }
        )
    }
    )
}
fun initRuntimeSocketService(): UTSPromise<Boolean> {
    val hosts: String = "127.0.0.1,192.168.1.252"
    val port: String = "8090"
    val id: String = "app-android_j1I-WG"
    if (hosts == "" || port == "" || id == "") {
        return UTSPromise.resolve(false)
    }
    return UTSPromise.resolve().then(fun(): UTSPromise<Boolean> {
        return initRuntimeSocket(hosts, port, id).then(fun(socket): Boolean {
            if (socket == null) {
                return false
            }
            socket
            return true
        }
        )
    }
    ).`catch`(fun(): Boolean {
        return false
    }
    )
}
val runBlock2 = run {
    initRuntimeSocketService()
}
var firstBackTime: Number = 0
fun checkForUpdates() {}
open class GenApp : BaseApp {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {
        onLaunch(fun(_: OnLaunchOptions) {
            console.log("App onLaunch", " at App.uvue:73")
            checkForUpdates()
        }
        , __ins)
        onAppShow(fun(_: OnShowOptions) {
            console.log("App Show", " at App.uvue:77")
        }
        , __ins)
        onAppHide(fun() {
            console.log("App Hide", " at App.uvue:80")
        }
        , __ins)
        onLastPageBackPress(fun() {
            console.log("App LastPageBackPress", " at App.uvue:84")
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
            console.log("App Exit", " at App.uvue:101")
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
open class PickerItem (
    @JsonNotNull
    open var text: String,
    @JsonNotNull
    open var value: Any,
    @JsonNotNull
    open var disabled: Boolean = false,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerItem", "uni_modules/i-ui-x/components/i-picker/i-picker.uvue", 280, 6)
    }
}
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
fun showAppToast(options: ShowToastOptions): Unit {
    uni_showToast(options)
}
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
val `default` = "/static/banner.png"
val default__1 = "/static/pos.png"
val default__2 = "/static/car.png"
val default__3 = "/static/dzwl.png"
val default__4 = "/static/msg.png"
val default__5 = "/static/pay.png"
val default__6 = "/static/online.png"
val default__7 = "/static/del.png"
open class RequestOptions__1 (
    open var url: String? = null,
    open var method: String? = null,
    open var data: Any? = null,
    open var header: UTSJSONObject? = null,
    open var showLoading: Boolean? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("RequestOptions", "api/http.uts", 3, 6)
    }
}
open class HttpError (
    @JsonNotNull
    open var statusCode: Number,
    @JsonNotNull
    open var message: String,
    open var data: Any? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HttpError", "api/http.uts", 15, 6)
    }
}
val BASE_URL = "https://car.zdiot.cn:18443/api"
fun handleTokenExpired(): Unit {
    console.log("检测到token过期，执行跳转登录页逻辑", " at api/http.uts:39")
    uni_removeStorageSync("token")
    showAppToast(ShowToastOptions(title = "登录已过期，请重新登录", icon = "none", duration = 2000))
    setTimeout(fun(){
        console.log("正在跳转到登录页...", " at api/http.uts:53")
        uni_redirectTo(RedirectToOptions(url = "/pages/login/login", success = fun(_){
            console.log("跳转登录页成功", " at api/http.uts:57")
        }
        , fail = fun(err){
            console.log("跳转登录页失败:", err, " at api/http.uts:60")
            uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
        }
        ))
    }
    , 500)
}
fun requestInterceptor(config: RequestOptions__1): RequestOptions__1 {
    val token = uni_getStorageSync("token")
    if (token != null && token.toString().length > 0) {
        if (config.header == null) {
            config.header = UTSJSONObject()
        }
        config.header!!.set("token", token.toString())
    }
    return config
}
fun responseInterceptor(response: RequestSuccess<Any>, config: RequestOptions__1): Any {
    return response.data!!
}
fun errorHandler(error: HttpError, config: RequestOptions__1): Unit {
    if (config.showLoading != false) {
        uni_hideLoading(null)
    }
    console.log("请求错误详情:", error, " at api/http.uts:112")
    if (error.statusCode != 0) {
        when (error.statusCode) {
            401 -> 
                handleTokenExpired()
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
    , showLoading = options.showLoading != false)
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
    return request(RequestOptions__1(url = url, method = "GET", data = data, header = options.header, showLoading = options.showLoading))
}
fun post(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "POST", data = data, header = options.header, showLoading = options.showLoading))
}
fun put(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "PUT", data = data, header = options.header, showLoading = options.showLoading))
}
fun remove(url: String, data: Any = _uO(), options: RequestOptions__1 = RequestOptions__1()): UTSPromise<Any> {
    return request(RequestOptions__1(url = url, method = "DELETE", data = data, header = options.header, showLoading = options.showLoading))
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
val loginUrl = "/sys/login"
val devicePos = "/gps/lastPosition?deptId="
val trackPos = "/gps/trackPos?"
val userinfo = "/sys/user/info"
val addDeviceUrl = "/userDevice/add"
val userDeviceList = "/userDevice/list"
val changePSW = "/sys/user/password"
val userMsgList = "/usermessage/listForUser"
val msgState = "/usermessage/detail/"
val updateDevice = "/device/update"
val deviceDetail = "/device/info/"
val logoutUrl = "/sys/logout"
val sendcmd = "/command/sendCmd"
val getGeofence = "/geofence"
val deleteGeo = "/geofence/"
val unbindDeviceList = "/device/unbindGeofenceList"
val bindDeviceList = "/device/bindGeofenceList"
val bindGeofence = "/geofence/bind"
val unbindGeofence = "/geofence/unbind"
val deleteDevice = "/userDevice/del"
val cmdActionUrl = "/command/cmdAction"
val cmdByMidUrl = "/command/cmdByMid"
val cmdSendUrl = "/command/sendCmd"
open class BasicResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("BasicResponse", "api/request.uts", 32, 13)
    }
}
open class JsonDataResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("JsonDataResponse", "api/request.uts", 36, 13)
    }
}
open class DevicePositionResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var message: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DevicePositionResponse", "api/request.uts", 41, 13)
    }
}
open class TrackPosResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("TrackPosResponse", "api/request.uts", 46, 13)
    }
}
open class UserInfoResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UserInfoResponse", "api/request.uts", 51, 13)
    }
}
open class UserDeviceListData (
    @JsonNotNull
    open var list: UTSArray<UTSJSONObject>,
    @JsonNotNull
    open var totalPage: Number,
    @JsonNotNull
    open var totalCount: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UserDeviceListData", "api/request.uts", 56, 13)
    }
}
open class UserDeviceListResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UserDeviceListData,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UserDeviceListResponse", "api/request.uts", 61, 13)
    }
}
open class DeviceDetailResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSJSONObject,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DeviceDetailResponse", "api/request.uts", 66, 13)
    }
}
open class GeofenceResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("GeofenceResponse", "api/request.uts", 71, 13)
    }
}
open class DevicePageData (
    @JsonNotNull
    open var list: UTSArray<UTSJSONObject>,
    @JsonNotNull
    open var totalPage: Number,
    @JsonNotNull
    open var totalCount: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DevicePageData", "api/request.uts", 76, 13)
    }
}
open class DevicePageResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: DevicePageData,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DevicePageResponse", "api/request.uts", 81, 13)
    }
}
open class CommandListResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UTSArray<UTSJSONObject>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CommandListResponse", "api/request.uts", 86, 13)
    }
}
open class SendCmdResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("SendCmdResponse", "api/request.uts", 91, 13)
    }
}
open class ChangePasswordResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ChangePasswordResponse", "api/request.uts", 96, 13)
    }
}
open class MessageResponse (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var data: UserDeviceListData,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("MessageResponse", "api/request.uts", 100, 13)
    }
}
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
fun changePasswordResponse(raw: Any): ChangePasswordResponse {
    val response = basicResponse(raw)
    return ChangePasswordResponse(code = response.code, msg = response.msg)
}
val login = fun(data: UTSJSONObject): UTSPromise<JsonDataResponse> {
    return post(loginUrl, data).then(fun(raw: Any): JsonDataResponse {
        return jsonDataResponse(raw)
    }
    )
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
        return DevicePositionResponse(code = getResponseCode(response), message = getResponseMessage(response), data = getResponseDataArray(response))
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
val delDevice = fun(imei: String): UTSPromise<BasicResponse> {
    return post(deleteDevice, _uO("imei" to imei)).then(fun(raw: Any): BasicResponse {
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
val changePassWord = fun(data: UTSJSONObject): UTSPromise<ChangePasswordResponse> {
    return put(changePSW, data).then(fun(raw: Any): ChangePasswordResponse {
        return changePasswordResponse(raw)
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
val getCmdAction = fun(): UTSPromise<CommandListResponse> {
    return get(cmdActionUrl).then(fun(raw: Any): CommandListResponse {
        val response = asJSONObject(raw)
        return CommandListResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataArray(response))
    }
    )
}
val getCmdByMid = fun(data: UTSJSONObject): UTSPromise<CommandListResponse> {
    return get(cmdByMidUrl, data).then(fun(raw: Any): CommandListResponse {
        val response = asJSONObject(raw)
        return CommandListResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = getResponseDataArray(response))
    }
    )
}
val sendCmd = fun(data: UTSJSONObject): UTSPromise<SendCmdResponse> {
    return post(cmdSendUrl, data).then(fun(raw: Any): SendCmdResponse {
        val response = asJSONObject(raw)
        return SendCmdResponse(code = getResponseCode(response), msg = getResponseMessage(response), data = response.getString("data", ""))
    }
    )
}
open class Coordinate (
    @JsonNotNull
    open var lat: Number,
    @JsonNotNull
    open var lng: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("Coordinate", "utils/coordTransform.uts", 6, 13)
    }
}
open class CoordTransform : IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CoordTransform", "utils/coordTransform.uts", 10, 7)
    }
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
                    console.warn("设备经纬度无效", device, " at utils/coordTransform.uts:108")
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
                console.warn("不支持的坐标系转换", fromSystem, "->", toSystem, " at utils/coordTransform.uts:143")
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
open class TodayTimeRange (
    @JsonNotNull
    open var nowTime: Number,
    @JsonNotNull
    open var todayZero: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("TodayTimeRange", "utils/gettime.uts", 5, 13)
    }
}
fun getTodayZeroTime(): TodayTimeRange {
    val now = Date()
    val nowTime = now.getTime()
    val todayZero = Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()
    return TodayTimeRange(nowTime = nowTime, todayZero = todayZero)
}
fun formatTimes(timestamp: Number): String {
    val d = Date(timestamp)
    val y = d.getFullYear()
    val m = (d.getMonth() + 1).toString(10).padStart(2, "0")
    val day = d.getDate().toString(10).padStart(2, "0")
    val h = d.getHours().toString(10).padStart(2, "0")
    val mi = d.getMinutes().toString(10).padStart(2, "0")
    val s = d.getSeconds().toString(10).padStart(2, "0")
    return "" + y + "-" + m + "-" + day + " " + h + ":" + mi + ":" + s
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("Device", "pages/index/index.uvue", 205, 6)
    }
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("MapCenter", "pages/index/index.uvue", 222, 6)
    }
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
open class DeviceStatus (
    @JsonNotNull
    open var batteryPercent: Number,
    @JsonNotNull
    open var voltage: Number,
    @JsonNotNull
    open var signalStrength: Number,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DeviceStatus", "pages/index/index.uvue", 257, 6)
    }
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DeviceDetailState", "pages/index/index.uvue", 263, 6)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("SavedDevice", "pages/index/index.uvue", 356, 6)
    }
}
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
open class FormData (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("FormData", "pages/login/login.uvue", 95, 7)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return FormDataReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class FormDataReactiveObject : FormData, IUTSReactive<FormData> {
    override var __v_raw: FormData
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: FormData, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(username = __v_raw.username, password = __v_raw.password) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): FormDataReactiveObject {
        return FormDataReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
open class SavedAccount (
    @JsonNotNull
    open var username: String,
    @JsonNotNull
    open var password: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("SavedAccount", "pages/login/login.uvue", 99, 7)
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
open class PickerItem__1 (
    @JsonNotNull
    open var label: String,
    @JsonNotNull
    open var value: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerItem", "components/sub-navBar/sub-navBar.uvue", 26, 7)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PickerItem__1ReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PickerItem__1ReactiveObject : PickerItem__1, IUTSReactive<PickerItem__1> {
    override var __v_raw: PickerItem__1
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PickerItem__1, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(label = __v_raw.label, value = __v_raw.value) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PickerItem__1ReactiveObject {
        return PickerItem__1ReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("AddressResult", "utils/getAdress.uts", 2, 6)
    }
}
open class AddressResponse (
    @JsonNotNull
    open var result: AddressResult,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("AddressResponse", "utils/getAdress.uts", 5, 6)
    }
}
fun getAddress(latitude: Number, longitude: Number, tk: String = DEFAULT_TK): UTSPromise<AddressResponse> {
    return UTSPromise<AddressResponse>(fun(resolve, reject){
        val postStr = JSON.stringify(_uO("lon" to longitude, "lat" to latitude, "ver" to 1))
        uni_request<Any>(RequestOptions(url = "https://api.tianditu.gov.cn/geocoder?postStr=" + UTSAndroid.consoleDebugError(encodeURIComponent(postStr), " at utils/getAdress.uts:17") + "&type=geocode&tk=" + tk, method = "GET", header = _uO("User-Agent" to "Mozilla/5.0"), success = fun(res: RequestSuccess<Any>){
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("MapCenter", "pages/carInfoDetail/carInfoDetail.uvue", 124, 7)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("SignalDetail", "pages/carInfoDetail/carInfoDetail.uvue", 202, 7)
    }
}
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CarFormData", "pages/addCar/addCar.uvue", 55, 7)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ScanResultData", "pages/addCar/addCar.uvue", 64, 7)
    }
}
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
typealias PickerValue = Any
open class PickerColumnItem (
    open var id: Any? = null,
    @JsonNotNull
    open var label: String,
    open var disabled: Boolean? = null,
    @JsonNotNull
    open var value: String,
    open var children: PickerColumn? = null,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerColumnItem", "uni_modules/lime-picker/components/l-picker/type.uts", 4, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return PickerColumnItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class PickerColumnItemReactiveObject : PickerColumnItem, IUTSReactive<PickerColumnItem> {
    override var __v_raw: PickerColumnItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: PickerColumnItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(id = __v_raw.id, label = __v_raw.label, disabled = __v_raw.disabled, value = __v_raw.value, children = __v_raw.children) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): PickerColumnItemReactiveObject {
        return PickerColumnItemReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var id: Any?
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
    override var disabled: Boolean?
        get() {
            return _tRG(__v_raw, "disabled", __v_raw.disabled, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("disabled")) {
                return
            }
            val oldValue = __v_raw.disabled
            __v_raw.disabled = value
            _tRS(__v_raw, "disabled", oldValue, value)
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
    override var children: PickerColumn?
        get() {
            return _tRG(__v_raw, "children", __v_raw.children, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("children")) {
                return
            }
            val oldValue = __v_raw.children
            __v_raw.children = value
            _tRS(__v_raw, "children", oldValue, value)
        }
}
typealias PickerColumn = UTSArray<PickerColumnItem>
open class PickerPickEvent (
    @JsonNotNull
    open var values: UTSArray<PickerValue>,
    @JsonNotNull
    open var column: Number,
    @JsonNotNull
    open var index: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerPickEvent", "uni_modules/lime-picker/components/l-picker/type.uts", 12, 13)
    }
}
open class PickerConfirmEvent (
    @JsonNotNull
    open var values: UTSArray<PickerValue>,
    @JsonNotNull
    open var indexs: UTSArray<Number>,
    @JsonNotNull
    open var items: UTSArray<PickerColumnItem>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerConfirmEvent", "uni_modules/lime-picker/components/l-picker/type.uts", 17, 13)
    }
}
interface PickerProps {
    var cancelBtn: String?
    var cancelStyle: Any?
    var confirmBtn: String?
    var confirmStyle: Any?
    var title: String?
    var titleStyle: Any?
    var keys: UTSJSONObject?
    var columns: UTSArray<PickerColumn>
    var modelValue: UTSArray<PickerValue>?
    var defaultValue: UTSArray<PickerValue>?
    var value: UTSArray<PickerValue>?
    var loading: Boolean
    var loadingColor: String?
    var loadingMaskColor: String?
    var loadingSize: String
    var itemHeight: String?
    var itemColor: String?
    var itemFontSize: String?
    var itemActiveColor: String?
    var itemActiveFontWeight: Number?
    var indicatorStyle: String?
    var maskColors: UTSArray<String>?
    var bgColor: String?
    var groupHeight: String?
    var radius: String?
    var resetIndex: Boolean
}
fun isString(str: Any?): Boolean {
    return UTSAndroid.`typeof`(str) == "string"
}
fun isNumber(value: Any?): Boolean {
    return _uA(
        "Byte",
        "UByte",
        "Short",
        "UShort",
        "Int",
        "UInt",
        "Long",
        "ULong",
        "Float",
        "Double",
        "number"
    ).includes(UTSAndroid.`typeof`(value))
}
fun isNumeric(value: Any?): Boolean {
    if (value == null) {
        return false
    }
    if (isNumber(value)) {
        return true
    } else if (isString(value)) {
        val regex = UTSRegExp("^(-)?\\d+(\\.\\d+)?\$")
        return regex.test(value as String)
    }
    return false
}
fun unitConvert(value: Any?, base: Number = 0): Number {
    if (value == null) {
        return NaN
    }
    if (isNumber(value)) {
        return value as Number
    }
    if (isNumeric(value)) {
        return parseFloat(value as String)
    }
    if (isString(value)) {
        val reg = UTSRegExp("^-?([0-9]+)?([.]{1}[0-9]+){0,1}(em|rpx|px|%)\$", "g")
        val results = reg.exec(value as String)
        if (results == null) {
            return NaN
        }
        val unit = results[3]
        val _value = parseFloat(value)
        if (unit == "rpx") {
            return uni_rpx2px(_value)
        }
        if (unit == "px") {
            return _value
        }
        if (unit == "%") {
            return _value / 100 * base
        }
    }
    return NaN
}
fun clamp(kVal: Number, min: Number, max: Number): Number {
    return Math.max(min, Math.min(max, kVal))
}
open class MaskConfig (
    @JsonNotNull
    open var maskStartColor: String,
    @JsonNotNull
    open var maskEndColor: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("MaskConfig", "uni_modules/lime-picker/components/l-picker-item/usePickerMask.uts", 2, 13)
    }
}
open class PlatformMaskStyles (
    @JsonNotNull
    open var common: String,
    @JsonNotNull
    open var top: String,
    @JsonNotNull
    open var bottom: String,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PlatformMaskStyles", "uni_modules/lime-picker/components/l-picker-item/usePickerMask.uts", 6, 13)
    }
}
open class UsePickerMaskReturn (
    @JsonNotNull
    open var maskConfig: ComputedRef<MaskConfig>,
    @JsonNotNull
    open var platformMaskStyles: ComputedRef<PlatformMaskStyles>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UsePickerMaskReturn", "uni_modules/lime-picker/components/l-picker-item/usePickerMask.uts", 11, 13)
    }
}
val usePickerMask = fun(backgroundColorRef: ComputedRef<String?>, isDarkModeRef: ComputedRef<Boolean>, maskColorsRef: ComputedRef<UTSArray<String>?>, isInitializedRef: Ref<Boolean>): UsePickerMaskReturn {
    val maskConfig = computed<MaskConfig>(fun(): MaskConfig {
        val bgColor = backgroundColorRef.value
        val isDark = isDarkModeRef.value
        val maskColors = maskColorsRef?.value
        if (maskColors != null && maskColors.length >= 1) {
            val maskStartColor = maskColors!![0]
            val maskEndColor = if (maskColors!!.length > 1) {
                maskColors[1]
            } else {
                "rgba(0,0,0,0)"
            }
            return MaskConfig(maskStartColor = maskStartColor, maskEndColor = maskEndColor)
        }
        val bg = bgColor ?: (if (isTruthy(isDark)) {
            "#242424"
        } else {
            "#ffffff"
        }
        )
        val endColor = if (isTruthy(isDark)) {
            "rgba(36, 36, 36, 0)"
        } else {
            "rgba(255, 255, 255, 0)"
        }
        return MaskConfig(maskStartColor = bg, maskEndColor = endColor)
    }
    )
    val platformMaskStyles = computed<PlatformMaskStyles>(fun(): PlatformMaskStyles {
        val _maskConfig_value = maskConfig.value
        val maskStartColor = _maskConfig_value.maskStartColor
        val maskEndColor = _maskConfig_value.maskEndColor
        val clean = fun(str: String): String {
            return str.replace(UTSRegExp("\\s+", "g"), " ").trim()
        }
        return PlatformMaskStyles(common = if (backgroundColorRef.value == null && !isTruthy(isDarkModeRef.value)) {
            clean("background-image:\n\t\t\t\t\tlinear-gradient(180deg, " + maskStartColor + ", " + maskEndColor + "),\n\t\t\t\t\tlinear-gradient(0deg, " + maskStartColor + ", " + maskEndColor + ")")
        } else {
            ""
        }
        , top = "background-image: linear-gradient(to bottom, " + maskStartColor + ", " + maskEndColor + ")", bottom = "background-image: linear-gradient(to top, " + maskStartColor + ", " + maskEndColor + ")")
    }
    )
    return UsePickerMaskReturn(maskConfig = maskConfig, platformMaskStyles = platformMaskStyles)
}
typealias PickerCanvasElement = UniElement
typealias PickerDrawableContext = DrawableContext
open class PickerCanvasConfig (
    @JsonNotNull
    open var itemHeight: Number,
    @JsonNotNull
    open var itemFontSize: Number,
    open var itemActiveFontWeight: Number? = null,
    open var itemColor: String? = null,
    open var itemActiveColor: String? = null,
    @JsonNotNull
    open var canvasWidth: Number,
    @JsonNotNull
    open var canvasHeight: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerCanvasConfig", "uni_modules/lime-picker/components/l-picker-item/PickerRenderer.uts", 6, 13)
    }
}
open class PickerCanvasRenderer : IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PickerCanvasRenderer", "uni_modules/lime-picker/components/l-picker-item/PickerRenderer.uts", 15, 14)
    }
    private var ctx: PickerDrawableContext? = null
    private var dpr: Number = 1
    private var isInitialized: Boolean = false
    private var canvas: PickerCanvasElement
    private var lastWidth: Number = 0
    private var lastHeight: Number = 0
    constructor(itemRef: PickerCanvasElement){
        this.canvas = itemRef
        this.initCanvas()
    }
    private fun initCanvas() {
        this.isInitialized = true
        return
    }
    private fun setupCanvas(width: Number, height: Number) {
        return
    }
    open fun clearRect(width: Number = 1000, height: Number = 100000) {
        this.ctx?.reset()
        return
    }
    open fun render(options: UTSArray<PickerColumnItem>, curIndex: Number, config: PickerCanvasConfig, isDarkMode: Boolean) {
        val ctx = this.canvas.getDrawableContext()!!
        val itemHeight = config.itemHeight
        val fontSize = config.itemFontSize
        val canvasWidth = config.canvasWidth
        val canvasHeight = config.canvasHeight
        this.setupCanvas(canvasWidth, canvasHeight)
        ctx.reset()
        val x = canvasWidth / 2
        val itemActiveFontWeight = config?.itemActiveFontWeight ?: 700
        val color = config?.itemColor ?: (if (isDarkMode) {
            "rgba(255,255,255,0.88)"
        } else {
            "rgba(0,0,0,0.88)"
        }
        )
        val itemActiveColor = config?.itemActiveColor ?: (if (isDarkMode) {
            "rgba(255,255,255,0.88)"
        } else {
            "rgba(0,0,0,0.88)"
        }
        )
        ctx.font = "" + fontSize + "px"
        ctx.textAlign = "center"
        ctx.lineWidth = 0.5
        this.clearRect(canvasWidth, canvasHeight)
        options.forEach(fun(item, index){
            var offset: Number = 0.4
            val y = itemHeight * index + fontSize + (itemHeight - fontSize) * offset
            val isActive = index == curIndex && itemActiveFontWeight > 600
            ctx.fillStyle = if (isActive) {
                itemActiveColor
            } else {
                color
            }
            ctx.strokeStyle = if (isActive) {
                itemActiveColor
            } else {
                color
            }
            ctx.fillText(item.label, x, y)
            if (isActive) {
                ctx.strokeText(item.label, x, y)
            }
        }
        )
        ctx.update()
    }
    open fun destroy() {
        this.ctx = null
        this.isInitialized = false
    }
}
fun <T> arrayEqual(arr1: UTSArray<T>, arr2: UTSArray<T>): Boolean {
    return (arr1.length == arr2.length && arr1.every(fun(kVal, i): Boolean {
        return kVal == arr2[i]
    }
    ))
}
fun <T> assignAtIndex(arr: UTSArray<T>, index: Number, value: T): Unit {
    if (index < 0) {
        throw UTSError("Index must be a non-negative integer, got " + index)
    }
    if (index < arr.length) {
        arr[index] = value
    } else {
        while(arr.length <= index){
            arr.push(null as T)
        }
        arr[index] = value
    }
}
open class RGB (
    @JsonNotNull
    open var r: Number,
    @JsonNotNull
    open var g: Number,
    @JsonNotNull
    open var b: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("RGB", "uni_modules/lime-color/utssdk/interface.uts", 1, 13)
    }
}
open class RGBA (
    @JsonNotNull
    open var r: Number,
    @JsonNotNull
    open var g: Number,
    @JsonNotNull
    open var b: Number,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("RGBA", "uni_modules/lime-color/utssdk/interface.uts", 6, 13)
    }
}
open class RGBAString (
    @JsonNotNull
    open var r: String,
    @JsonNotNull
    open var g: String,
    @JsonNotNull
    open var b: String,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("RGBAString", "uni_modules/lime-color/utssdk/interface.uts", 12, 13)
    }
}
open class HSL (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var l: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSL", "uni_modules/lime-color/utssdk/interface.uts", 18, 13)
    }
}
open class HSLA (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var l: Number,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSLA", "uni_modules/lime-color/utssdk/interface.uts", 23, 13)
    }
}
open class HSV (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var v: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSV", "uni_modules/lime-color/utssdk/interface.uts", 29, 13)
    }
}
open class HSVA (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var v: Number,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSVA", "uni_modules/lime-color/utssdk/interface.uts", 34, 13)
    }
}
open class HSB (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var b: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSB", "uni_modules/lime-color/utssdk/interface.uts", 41, 13)
    }
}
open class HSBA (
    @JsonNotNull
    open var h: Number,
    @JsonNotNull
    open var s: Number,
    @JsonNotNull
    open var b: Number,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("HSBA", "uni_modules/lime-color/utssdk/interface.uts", 46, 13)
    }
}
open class LColorInfo (
    open var ok: Boolean? = null,
    open var format: LColorFormats? = null,
    @JsonNotNull
    open var r: Number,
    @JsonNotNull
    open var g: Number,
    @JsonNotNull
    open var b: Number,
    @JsonNotNull
    open var a: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("LColorInfo", "uni_modules/lime-color/utssdk/interface.uts", 52, 13)
    }
}
typealias LColorFormats = String
open class LColorOptions (
    open var format: LColorFormats? = null,
    open var gradientType: String? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("LColorOptions", "uni_modules/lime-color/utssdk/interface.uts", 61, 13)
    }
}
typealias LColorInput = Any
fun isNumber__1(value: Any?): Boolean {
    return _uA(
        "Byte",
        "UByte",
        "Short",
        "UShort",
        "Int",
        "UInt",
        "Long",
        "ULong",
        "Float",
        "Double",
        "number"
    ).includes(UTSAndroid.`typeof`(value))
}
fun isString__1(value: Any?): Boolean {
    return UTSAndroid.`typeof`(value) == "string"
}
fun isNumeric__1(value: Any?): Boolean {
    if (isNumber__1(value)) {
        return true
    } else if (isString__1(value)) {
        val regex = UTSRegExp("^(-)?\\d+(\\.\\d+)?\$")
        return regex.test(value as String)
    }
    return false
}
fun toBoolean(value: Any?): Boolean {
    if (isNumber__1(value)) {
        return (value as Number) != 0
    }
    if (isString__1(value)) {
        return ("" + value).length > 0
    }
    if (UTSAndroid.`typeof`(value) == "boolean") {
        return value as Boolean
    }
    return value != null
}
fun isPercentage(n: Any): Boolean {
    return isString__1(n) && (n as String).indexOf("%") != -1
}
fun isOnePointZero(n: Any): Boolean {
    return isString__1(n) && (n as String).indexOf(".") != -1 && parseFloat(n as String) == 1
}
fun bound01(n: String, max: Number): Number {
    return bound01(n as Any, max as Number)
}
fun bound01(n: Number, max: Number): Number {
    return bound01(n as Any, max as Number)
}
fun bound01(reassignedN: Any, max: Number): Number {
    var n = reassignedN
    if (!(isNumber__1(n) || isString__1(n))) {
        return 1
    }
    if (isOnePointZero(n)) {
        n = "100%"
    }
    val isPercent = isPercentage(n)
    n = if (isNumber__1(n)) {
        n
    } else {
        parseFloat(n as String)
    }
     as Number
    n = if (max == 360) {
        n
    } else {
        Math.min(max, Math.max(0, n))
    }
    if (isPercent) {
        n = parseInt("" + Math.min(n, 100) * max, 10) / 100
    }
    if (Math.abs(n - max) < 0.000001) {
        return 1
    }
    if (max == 360) {
        n = (if (n < 0) {
            (n % max) + max
        } else {
            n % max
        }) / max
    } else {
        n = (n % max) / max
    }
    return n
}
fun clamp01(kVal: Number): Number {
    return Math.min(1, Math.max(0, kVal))
}
fun boundAlpha(a: Number): Number {
    return boundAlpha(a as Any?)
}
fun boundAlpha(a: String): Number {
    return boundAlpha(a as Any?)
}
fun boundAlpha(a: Any?): Number {
    var n = if (a == null) {
        1
    } else {
        if (isString__1(a)) {
            parseFloat(a as String)
        } else {
            a as Number
        }
    }
    if (isNaN(n) || n < 0 || n > 1) {
        n = 1
    }
    return n
}
fun convertToPercentage(n: Number): Number {
    return convertToPercentage(n as Any) as Number
}
fun convertToPercentage(n: String): String {
    return convertToPercentage(n as Any) as String
}
fun convertToPercentage(reassignedN: Any): Any {
    var n = reassignedN
    n = if (isNumeric__1(n)) {
        parseFloat(if (UTSAndroid.`typeof`(n) == "string") {
            n as String
        } else {
            BigDecimal.valueOf((n as Number).toDouble()).toPlainString()
        })
    } else {
        n
    }
    if (isNumber__1(n) && (n as Number) <= 1) {
        return ("" + n * 100 + "%").replace(".0%", "%")
    }
    return n
}
fun pad2(c: String): String {
    return if (c.length == 1) {
        "0" + c
    } else {
        "" + c
    }
}
fun rgbToRgb(r: String, g: String, b: String): RGB {
    return rgbToRgb(r as Any, g as Any, b as Any)
}
fun rgbToRgb(r: Number, g: String, b: String): RGB {
    return rgbToRgb(r as Any, g as Any, b as Any)
}
fun rgbToRgb(r: Number, g: Number, b: String): RGB {
    return rgbToRgb(r as Any, g as Any, b as Any)
}
fun rgbToRgb(r: Number, g: Number, b: Number): RGB {
    return rgbToRgb(r as Any, g as Any, b as Any)
}
fun rgbToRgb(r: Any, g: Any, b: Any): RGB {
    return RGB(r = bound01(r, 255) * 255, g = bound01(g, 255) * 255, b = bound01(b, 255) * 255)
}
fun rgbToHsl(r: String, g: String, b: String): HSL {
    return rgbToHsl(r as Any, g as Any, b as Any)
}
fun rgbToHsl(r: Number, g: String, b: String): HSL {
    return rgbToHsl(r as Any, g as Any, b as Any)
}
fun rgbToHsl(r: Number, g: Number, b: String): HSL {
    return rgbToHsl(r as Any, g as Any, b as Any)
}
fun rgbToHsl(r: Number, g: Number, b: Number): HSL {
    return rgbToHsl(r as Any, g as Any, b as Any)
}
fun rgbToHsl(reassignedR: Any, reassignedG: Any, reassignedB: Any): HSL {
    var r = reassignedR
    var g = reassignedG
    var b = reassignedB
    r = bound01(r, 255)
    g = bound01(g, 255)
    b = bound01(b, 255)
    val max = Math.max(r, g, b)
    val min = Math.min(r, g, b)
    var h: Number = 0
    var s: Number
    val l = (max + min) / 2
    if (max == min) {
        s = 0
        h = 0
    } else {
        val d = max - min
        s = if (l > 0.5) {
            d / (2 - max - min)
        } else {
            d / (max + min)
        }
        when (max) {
            r -> 
                h = (g - b) / d + (if (g < b) {
                    6
                } else {
                    0
                }
                )
            g -> 
                h = (b - r) / d + 2
            b -> 
                h = (r - g) / d + 4
            else -> 
                console.log("h", " at uni_modules/lime-color/common/conversion.uts:64")
        }
        h /= 6
    }
    return HSL(h = h, s = s, l = l)
}
fun hue2rgb(p: Number, q: Number, t: Number): Number {
    var _t = t
    if (_t < 0) {
        _t += 1
    }
    if (_t > 1) {
        _t -= 1
    }
    if (_t < (1 as Number) / 6) {
        return p + (q - p) * (6 * _t)
    }
    if (_t < 0.5) {
        return q
    }
    if (_t < (2 as Number) / 3) {
        return p + (q - p) * ((2 as Number) / 3 - _t) * 6
    }
    return p
}
fun hslToRgb(h: String, s: String, l: String): RGB {
    return hslToRgb(h as Any, s as Any, l as Any)
}
fun hslToRgb(h: Number, s: String, l: String): RGB {
    return hslToRgb(h as Any, s as Any, l as Any)
}
fun hslToRgb(h: Number, s: Number, l: String): RGB {
    return hslToRgb(h as Any, s as Any, l as Any)
}
fun hslToRgb(h: Number, s: Number, l: Number): RGB {
    return hslToRgb(h as Any, s as Any, l as Any)
}
fun hslToRgb(reassignedH: Any, reassignedS: Any, reassignedL: Any): RGB {
    var h = reassignedH
    var s = reassignedS
    var l = reassignedL
    var r: Number
    var g: Number
    var b: Number
    h = bound01(h, 360)
    s = bound01(s, 100)
    l = bound01(l, 100)
    if (s == 0) {
        g = l
        b = l
        r = l
    } else {
        val q = if (l < 0.5) {
            l * (1 + s)
        } else {
            l + s - l * s
        }
        val p = 2 * l - q
        r = hue2rgb(p, q, h + (1 as Number) / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - (1 as Number) / 3)
    }
    return RGB(r = r * 255, g = g * 255, b = b * 255)
}
fun rgbToHsv(reassignedR: Number, reassignedG: Number, reassignedB: Number): HSV {
    var r = reassignedR
    var g = reassignedG
    var b = reassignedB
    r = bound01(r, 255)
    g = bound01(g, 255)
    b = bound01(b, 255)
    val max = Math.max(r, g, b)
    val min = Math.min(r, g, b)
    var h: Number = 0
    val v = max
    val d = max - min
    val s = if (max == 0) {
        0
    } else {
        d / max
    }
    if (max == min) {
        h = 0
    } else {
        when (max) {
            r -> 
                h = (g - b) / d + (if (g < b) {
                    6
                } else {
                    0
                }
                )
            g -> 
                h = (b - r) / d + 2
            b -> 
                h = (r - g) / d + 4
            else -> 
                console.log("1", " at uni_modules/lime-color/common/conversion.uts:171")
        }
        h /= 6
    }
    return HSV(h = h, s = s, v = v)
}
fun hsvToRgb(h: String, s: String, v: String): RGB {
    return hsvToRgb(h as Any, s as Any, v as Any)
}
fun hsvToRgb(h: Number, s: String, v: String): RGB {
    return hsvToRgb(h as Any, s as Any, v as Any)
}
fun hsvToRgb(h: Number, s: Number, v: String): RGB {
    return hsvToRgb(h as Any, s as Any, v as Any)
}
fun hsvToRgb(h: Number, s: Number, v: Number): RGB {
    return hsvToRgb(h as Any, s as Any, v as Any)
}
fun hsvToRgb(reassignedH: Any, reassignedS: Any, reassignedV: Any): RGB {
    var h = reassignedH
    var s = reassignedS
    var v = reassignedV
    h = bound01(h, 360) * 6
    s = bound01(s, 100)
    v = bound01(v, 100)
    val i = Math.floor(h)
    val f = h - i
    val p = v * (1 - s)
    val q = v * (1 - f * s)
    val t = v * (1 - (1 - f) * s)
    val mod = i % 6
    val r = _uA(
        v,
        q,
        p,
        p,
        t,
        v
    )[mod]
    val g = _uA(
        t,
        v,
        v,
        q,
        p,
        p
    )[mod]
    val b = _uA(
        p,
        p,
        t,
        v,
        v,
        q
    )[mod]
    return RGB(r = r * 255, g = g * 255, b = b * 255)
}
fun rgbToHex(r: Number, g: Number, b: Number, allow3Char: Boolean = false): String {
    val hex = _uA(
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16))
    )
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0)
    }
    return hex.join("")
}
fun rgbaToHex(r: Number, g: Number, b: Number, a: Number, allow4Char: Boolean = false): String {
    val hex = _uA(
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a))
    )
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0)
    }
    return hex.join("")
}
fun convertDecimalToHex(d: Number): String {
    return convertDecimalToHex(d as Any)
}
fun convertDecimalToHex(d: String): String {
    return convertDecimalToHex(d as Any)
}
fun convertDecimalToHex(d: Any): String {
    return Math.round(parseFloat("" + d) * 255).toString(16)
}
fun convertHexToDecimal(h: String): Number {
    return parseIntFromHex(h) / 255
}
fun parseIntFromHex(kVal: String): Number {
    return parseInt(kVal, 16)
}
fun numberInputToObject(color: Number): RGB {
    return RGB(r = color shr 16, g = (color and 0xff00) shr 8, b = color and 0xff)
}
val names: Map<String, String> = Map<String, String>(_uA(
    _uA(
        "aliceblue",
        "#f0f8ff"
    ),
    _uA(
        "antiquewhite",
        "#faebd7"
    ),
    _uA(
        "aqua",
        "#00ffff"
    ),
    _uA(
        "aquamarine",
        "#7fffd4"
    ),
    _uA(
        "azure",
        "#f0ffff"
    ),
    _uA(
        "beige",
        "#f5f5dc"
    ),
    _uA(
        "bisque",
        "#ffe4c4"
    ),
    _uA(
        "black",
        "#000000"
    ),
    _uA(
        "blanchedalmond",
        "#ffebcd"
    ),
    _uA(
        "blue",
        "#0000ff"
    ),
    _uA(
        "blueviolet",
        "#8a2be2"
    ),
    _uA(
        "brown",
        "#a52a2a"
    ),
    _uA(
        "burlywood",
        "#deb887"
    ),
    _uA(
        "cadetblue",
        "#5f9ea0"
    ),
    _uA(
        "chartreuse",
        "#7fff00"
    ),
    _uA(
        "chocolate",
        "#d2691e"
    ),
    _uA(
        "coral",
        "#ff7f50"
    ),
    _uA(
        "cornflowerblue",
        "#6495ed"
    ),
    _uA(
        "cornsilk",
        "#fff8dc"
    ),
    _uA(
        "crimson",
        "#dc143c"
    ),
    _uA(
        "cyan",
        "#00ffff"
    ),
    _uA(
        "darkblue",
        "#00008b"
    ),
    _uA(
        "darkcyan",
        "#008b8b"
    ),
    _uA(
        "darkgoldenrod",
        "#b8860b"
    ),
    _uA(
        "darkgray",
        "#a9a9a9"
    ),
    _uA(
        "darkgreen",
        "#006400"
    ),
    _uA(
        "darkgrey",
        "#a9a9a9"
    ),
    _uA(
        "darkkhaki",
        "#bdb76b"
    ),
    _uA(
        "darkmagenta",
        "#8b008b"
    ),
    _uA(
        "darkolivegreen",
        "#556b2f"
    ),
    _uA(
        "darkorange",
        "#ff8c00"
    ),
    _uA(
        "darkorchid",
        "#9932cc"
    ),
    _uA(
        "darkred",
        "#8b0000"
    ),
    _uA(
        "darksalmon",
        "#e9967a"
    ),
    _uA(
        "darkseagreen",
        "#8fbc8f"
    ),
    _uA(
        "darkslateblue",
        "#483d8b"
    ),
    _uA(
        "darkslategray",
        "#2f4f4f"
    ),
    _uA(
        "darkslategrey",
        "#2f4f4f"
    ),
    _uA(
        "darkturquoise",
        "#00ced1"
    ),
    _uA(
        "darkviolet",
        "#9400d3"
    ),
    _uA(
        "deeppink",
        "#ff1493"
    ),
    _uA(
        "deepskyblue",
        "#00bfff"
    ),
    _uA(
        "dimgray",
        "#696969"
    ),
    _uA(
        "dimgrey",
        "#696969"
    ),
    _uA(
        "dodgerblue",
        "#1e90ff"
    ),
    _uA(
        "firebrick",
        "#b22222"
    ),
    _uA(
        "floralwhite",
        "#fffaf0"
    ),
    _uA(
        "forestgreen",
        "#228b22"
    ),
    _uA(
        "fuchsia",
        "#ff00ff"
    ),
    _uA(
        "gainsboro",
        "#dcdcdc"
    ),
    _uA(
        "ghostwhite",
        "#f8f8ff"
    ),
    _uA(
        "goldenrod",
        "#daa520"
    ),
    _uA(
        "gold",
        "#ffd700"
    ),
    _uA(
        "gray",
        "#808080"
    ),
    _uA(
        "green",
        "#008000"
    ),
    _uA(
        "greenyellow",
        "#adff2f"
    ),
    _uA(
        "grey",
        "#808080"
    ),
    _uA(
        "honeydew",
        "#f0fff0"
    ),
    _uA(
        "hotpink",
        "#ff69b4"
    ),
    _uA(
        "indianred",
        "#cd5c5c"
    ),
    _uA(
        "indigo",
        "#4b0082"
    ),
    _uA(
        "ivory",
        "#fffff0"
    ),
    _uA(
        "khaki",
        "#f0e68c"
    ),
    _uA(
        "lavenderblush",
        "#fff0f5"
    ),
    _uA(
        "lavender",
        "#e6e6fa"
    ),
    _uA(
        "lawngreen",
        "#7cfc00"
    ),
    _uA(
        "lemonchiffon",
        "#fffacd"
    ),
    _uA(
        "lightblue",
        "#add8e6"
    ),
    _uA(
        "lightcoral",
        "#f08080"
    ),
    _uA(
        "lightcyan",
        "#e0ffff"
    ),
    _uA(
        "lightgoldenrodyellow",
        "#fafad2"
    ),
    _uA(
        "lightgray",
        "#d3d3d3"
    ),
    _uA(
        "lightgreen",
        "#90ee90"
    ),
    _uA(
        "lightgrey",
        "#d3d3d3"
    ),
    _uA(
        "lightpink",
        "#ffb6c1"
    ),
    _uA(
        "lightsalmon",
        "#ffa07a"
    ),
    _uA(
        "lightseagreen",
        "#20b2aa"
    ),
    _uA(
        "lightskyblue",
        "#87cefa"
    ),
    _uA(
        "lightslategray",
        "#778899"
    ),
    _uA(
        "lightslategrey",
        "#778899"
    ),
    _uA(
        "lightsteelblue",
        "#b0c4de"
    ),
    _uA(
        "lightyellow",
        "#ffffe0"
    ),
    _uA(
        "lime",
        "#00ff00"
    ),
    _uA(
        "limegreen",
        "#32cd32"
    ),
    _uA(
        "linen",
        "#faf0e6"
    ),
    _uA(
        "magenta",
        "#ff00ff"
    ),
    _uA(
        "maroon",
        "#800000"
    ),
    _uA(
        "mediumaquamarine",
        "#66cdaa"
    ),
    _uA(
        "mediumblue",
        "#0000cd"
    ),
    _uA(
        "mediumorchid",
        "#ba55d3"
    ),
    _uA(
        "mediumpurple",
        "#9370db"
    ),
    _uA(
        "mediumseagreen",
        "#3cb371"
    ),
    _uA(
        "mediumslateblue",
        "#7b68ee"
    ),
    _uA(
        "mediumspringgreen",
        "#00fa9a"
    ),
    _uA(
        "mediumturquoise",
        "#48d1cc"
    ),
    _uA(
        "mediumvioletred",
        "#c71585"
    ),
    _uA(
        "midnightblue",
        "#191970"
    ),
    _uA(
        "mintcream",
        "#f5fffa"
    ),
    _uA(
        "mistyrose",
        "#ffe4e1"
    ),
    _uA(
        "moccasin",
        "#ffe4b5"
    ),
    _uA(
        "navajowhite",
        "#ffdead"
    ),
    _uA(
        "navy",
        "#000080"
    ),
    _uA(
        "oldlace",
        "#fdf5e6"
    ),
    _uA(
        "olive",
        "#808000"
    ),
    _uA(
        "olivedrab",
        "#6b8e23"
    ),
    _uA(
        "orange",
        "#ffa500"
    ),
    _uA(
        "orangered",
        "#ff4500"
    ),
    _uA(
        "orchid",
        "#da70d6"
    ),
    _uA(
        "palegoldenrod",
        "#eee8aa"
    ),
    _uA(
        "palegreen",
        "#98fb98"
    ),
    _uA(
        "paleturquoise",
        "#afeeee"
    ),
    _uA(
        "palevioletred",
        "#db7093"
    ),
    _uA(
        "papayawhip",
        "#ffefd5"
    ),
    _uA(
        "peachpuff",
        "#ffdab9"
    ),
    _uA(
        "peru",
        "#cd853f"
    ),
    _uA(
        "pink",
        "#ffc0cb"
    ),
    _uA(
        "plum",
        "#dda0dd"
    ),
    _uA(
        "powderblue",
        "#b0e0e6"
    ),
    _uA(
        "purple",
        "#800080"
    ),
    _uA(
        "rebeccapurple",
        "#663399"
    ),
    _uA(
        "red",
        "#ff0000"
    ),
    _uA(
        "rosybrown",
        "#bc8f8f"
    ),
    _uA(
        "royalblue",
        "#4169e1"
    ),
    _uA(
        "saddlebrown",
        "#8b4513"
    ),
    _uA(
        "salmon",
        "#fa8072"
    ),
    _uA(
        "sandybrown",
        "#f4a460"
    ),
    _uA(
        "seagreen",
        "#2e8b57"
    ),
    _uA(
        "seashell",
        "#fff5ee"
    ),
    _uA(
        "sienna",
        "#a0522d"
    ),
    _uA(
        "silver",
        "#c0c0c0"
    ),
    _uA(
        "skyblue",
        "#87ceeb"
    ),
    _uA(
        "slateblue",
        "#6a5acd"
    ),
    _uA(
        "slategray",
        "#708090"
    ),
    _uA(
        "slategrey",
        "#708090"
    ),
    _uA(
        "snow",
        "#fffafa"
    ),
    _uA(
        "springgreen",
        "#00ff7f"
    ),
    _uA(
        "steelblue",
        "#4682b4"
    ),
    _uA(
        "tan",
        "#d2b48c"
    ),
    _uA(
        "teal",
        "#008080"
    ),
    _uA(
        "thistle",
        "#d8bfd8"
    ),
    _uA(
        "tomato",
        "#ff6347"
    ),
    _uA(
        "turquoise",
        "#40e0d0"
    ),
    _uA(
        "violet",
        "#ee82ee"
    ),
    _uA(
        "wheat",
        "#f5deb3"
    ),
    _uA(
        "white",
        "#ffffff"
    ),
    _uA(
        "whitesmoke",
        "#f5f5f5"
    ),
    _uA(
        "yellow",
        "#ffff00"
    ),
    _uA(
        "yellowgreen",
        "#9acd32"
    )
))
open class ColorMatchers (
    @JsonNotNull
    open var CSS_UNIT: UTSRegExp,
    @JsonNotNull
    open var rgb: UTSRegExp,
    @JsonNotNull
    open var rgba: UTSRegExp,
    @JsonNotNull
    open var hsl: UTSRegExp,
    @JsonNotNull
    open var hsla: UTSRegExp,
    @JsonNotNull
    open var hsv: UTSRegExp,
    @JsonNotNull
    open var hsva: UTSRegExp,
    @JsonNotNull
    open var hsb: UTSRegExp,
    @JsonNotNull
    open var hsba: UTSRegExp,
    @JsonNotNull
    open var hex3: UTSRegExp,
    @JsonNotNull
    open var hex6: UTSRegExp,
    @JsonNotNull
    open var hex4: UTSRegExp,
    @JsonNotNull
    open var hex8: UTSRegExp,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ColorMatchers", "uni_modules/lime-color/common/format-input.uts", 6, 6)
    }
}
val CSS_INTEGER = "[-\\+]?\\d+%?"
val CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?"
val CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")"
val PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?"
val PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?"
val matchers = ColorMatchers(CSS_UNIT = UTSRegExp(CSS_UNIT), rgb = UTSRegExp("rgb" + PERMISSIVE_MATCH3), rgba = UTSRegExp("rgba" + PERMISSIVE_MATCH4), hsl = UTSRegExp("hsl" + PERMISSIVE_MATCH3), hsla = UTSRegExp("hsla" + PERMISSIVE_MATCH4), hsv = UTSRegExp("hsv" + PERMISSIVE_MATCH3), hsva = UTSRegExp("hsva" + PERMISSIVE_MATCH4), hsb = UTSRegExp("hsb" + PERMISSIVE_MATCH3), hsba = UTSRegExp("hsba" + PERMISSIVE_MATCH4), hex3 = UTSRegExp("^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})\$", ""), hex6 = UTSRegExp("^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\$", ""), hex4 = UTSRegExp("^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})\$", ""), hex8 = UTSRegExp("^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\$", ""))
fun isValidCSSUnit(color: String): Boolean {
    return isValidCSSUnit(color as Any?)
}
fun isValidCSSUnit(color: Number): Boolean {
    return isValidCSSUnit(color as Any?)
}
fun isValidCSSUnit(color: Any?): Boolean {
    return toBoolean(matchers.CSS_UNIT.exec("" + color))
}
fun inputToRGB(color: String): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: RGB): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: RGBA): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSL): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSLA): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSV): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSVA): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSB): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: HSBA): LColorInfo {
    return inputToRGB(color as Any)
}
fun inputToRGB(color: Any): LColorInfo {
    var _color: UTSJSONObject? = null
    var rgb = RGB(r = 0, g = 0, b = 0)
    var a: Any = 1
    var s: Any?
    var v: Any?
    var l: Any?
    var ok = false
    var format: LColorFormats? = null
    if (UTSAndroid.`typeof`(color) == "string") {
        _color = stringInputToObject(color as String)
    } else if (UTSAndroid.`typeof`(color) == "object") {
        _color = UTSAndroid.consoleDebugError(JSON.parse<UTSJSONObject>(JSON.stringify(color)), " at uni_modules/lime-color/common/format-input.uts:101") as UTSJSONObject
    }
    if (_color != null) {
        if (isValidCSSUnit(_color["r"]) && isValidCSSUnit(_color["g"]) && isValidCSSUnit(_color["b"])) {
            rgb = rgbToRgb(_color["r"]!!, _color["g"]!!, _color["b"]!!)
            ok = true
            format = if (("" + _color["r"]).endsWith("%")) {
                "prgb"
            } else {
                "rgb"
            }
        } else if (isValidCSSUnit(_color["h"]) && isValidCSSUnit(_color["s"]) && (isValidCSSUnit(_color["v"]) || isValidCSSUnit(_color["b"]))) {
            val isHSV = _color["v"] != null
            s = convertToPercentage(_color["s"]!!)
            v = if (isHSV) {
                convertToPercentage(_color["v"]!!)
            } else {
                convertToPercentage(_color["b"]!!)
            }
            rgb = hsvToRgb(_color["h"]!!, s, v)
            ok = true
            format = if (isHSV) {
                "hsv"
            } else {
                "hsb"
            }
        } else if (isValidCSSUnit(_color["h"]) && isValidCSSUnit(_color["s"]) && isValidCSSUnit(_color["l"])) {
            s = convertToPercentage(_color["s"]!!)
            l = convertToPercentage(_color["l"]!!)
            rgb = hslToRgb(_color["h"]!!, s, l)
            ok = true
            format = "hsl"
        }
        if (_color["a"] != null) {
            a = _color["a"]!!
        }
    }
    a = boundAlpha(a)
    return LColorInfo(ok = ok, format = _color?.get("format") as String? ?: format, r = Math.min(255, Math.max(rgb.r, 0)), g = Math.min(255, Math.max(rgb.g, 0)), b = Math.min(255, Math.max(rgb.b, 0)), a = a)
}
fun stringInputToObject(color: String): UTSJSONObject? {
    var _color = color.trim().toLowerCase()
    if (_color.length == 0) {
        return null
    }
    var named = false
    if (names.get(_color) != null) {
        _color = names.get(_color)!!
        named = true
    } else if (_color == "transparent") {
        return _uO("r" to 0, "g" to 0, "b" to 0, "a" to 0, "format" to "name")
    }
    var match = matchers.rgb.exec(_color)
    if (match != null) {
        val r = match[1]
        val g = match[2]
        val b = match[3]
        return _uO("r" to r, "g" to g, "b" to b)
    }
    match = matchers.rgba.exec(_color)
    if (match != null) {
        val r = match[1]
        val g = match[2]
        val b = match[3]
        val a = match[4]
        return _uO("r" to r, "g" to g, "b" to b, "a" to a)
    }
    match = matchers.hsl.exec(_color)
    if (match != null) {
        val h = match[1]
        val s = match[2]
        val l = match[3]
        return _uO("h" to h, "s" to s, "l" to l)
    }
    match = matchers.hsla.exec(_color)
    if (match != null) {
        val h = match[1]
        val s = match[2]
        val l = match[3]
        val a = match[4]
        return _uO("h" to h, "s" to s, "l" to l, "a" to a)
    }
    match = matchers.hsv.exec(_color)
    if (match != null) {
        val h = match[1]
        val s = match[2]
        val v = match[3]
        return _uO("h" to h, "s" to s, "v" to v)
    }
    match = matchers.hsva.exec(_color)
    if (match != null) {
        val h = match[1]
        val s = match[2]
        val v = match[3]
        val a = match[4]
        return _uO("h" to h, "s" to s, "v" to v, "a" to a)
    }
    match = matchers.hex8.exec(_color)
    if (match != null) {
        val r = parseIntFromHex(match[1]!!)
        val g = parseIntFromHex(match[2]!!)
        val b = parseIntFromHex(match[3]!!)
        val a = convertHexToDecimal(match[4]!!)
        return _uO("r" to r, "g" to g, "b" to b, "a" to a, "format" to if (named) {
            "name"
        } else {
            "hex8"
        }
        )
    }
    match = matchers.hex6.exec(_color)
    if (match != null) {
        val r = parseIntFromHex(match[1]!!)
        val g = parseIntFromHex(match[2]!!)
        val b = parseIntFromHex(match[3]!!)
        return _uO("r" to r, "g" to g, "b" to b, "format" to if (named) {
            "name"
        } else {
            "hex"
        }
        )
    }
    match = matchers.hex4.exec(_color)
    if (match != null) {
        val r = parseIntFromHex((match[1] + match[1]))
        val g = parseIntFromHex((match[2] + match[2]))
        val b = parseIntFromHex((match[3] + match[3]))
        val a = convertHexToDecimal((match[4] + match[4]))
        return _uO("r" to r, "g" to g, "b" to b, "a" to a, "format" to if (named) {
            "name"
        } else {
            "hex8"
        }
        )
    }
    match = matchers.hex3.exec(_color)
    if (match != null) {
        val r = parseIntFromHex((match[1] + match[1]))
        val g = parseIntFromHex((match[2] + match[2]))
        val b = parseIntFromHex((match[3] + match[3]))
        return _uO("r" to r, "g" to g, "b" to b, "format" to if (named) {
            "name"
        } else {
            "hex"
        }
        )
    }
    return null
}
open class TinyColor : IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("TinyColor", "uni_modules/lime-color/common/color.uts", 7, 14)
    }
    open lateinit var r: Number
    open lateinit var g: Number
    open lateinit var b: Number
    open lateinit var a: Number
    open var format: LColorFormats? = null
    open lateinit var originalInput: LColorInput
    open var isValid: Boolean by Delegates.notNull()
    open var gradientType: String? = null
    open lateinit var roundA: Number
    open lateinit var reversedNames: Map<String, String>
    constructor(color: LColorInput = "", opts: LColorOptions = LColorOptions()){
        var _color: Any = color
        if (isNumber__1(color)) {
            _color = numberInputToObject(color as Number)
        }
        this.originalInput = _color
        val rgb = inputToRGB(_color)
        this.r = rgb.r
        this.g = rgb.g
        this.b = rgb.b
        this.a = rgb.a
        this.roundA = Math.round(100 * this.a) / 100
        this.format = opts.format ?: rgb.format
        this.gradientType = opts.gradientType
        if (this.r < 1) {
            this.r = Math.round(this.r)
        }
        if (this.g < 1) {
            this.g = Math.round(this.g)
        }
        if (this.b < 1) {
            this.b = Math.round(this.b)
        }
        this.isValid = rgb.ok ?: false
        this.reversedNames = Map<String, String>()
        names.forEach(fun(value: String, key: String){
            this.reversedNames.set(value, key)
        }
        )
    }
    open fun isDark(): Boolean {
        return this.getBrightness() < 128
    }
    open fun isLight(): Boolean {
        return !this.isDark()
    }
    open fun getBrightness(): Number {
        val rgb = this.toRgb()
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    }
    open fun getLuminance(): Number {
        val rgb = this.toRgb()
        var R: Number
        var G: Number
        var B: Number
        val RsRGB: Number = rgb.r / 255
        val GsRGB: Number = rgb.g / 255
        val BsRGB: Number = rgb.b / 255
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92
        } else {
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4)
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92
        } else {
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4)
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92
        } else {
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B
    }
    open fun getAlpha(): Number {
        return this.a
    }
    open fun setAlpha(alpha: String?): TinyColor {
        return this.setAlpha(alpha as Any)
    }
    open fun setAlpha(alpha: Number?): TinyColor {
        return this.setAlpha(alpha as Any)
    }
    open fun setAlpha(alpha: Any?): TinyColor {
        this.a = boundAlpha(alpha)
        this.roundA = Math.round(100 * this.a) / 100
        return this
    }
    open fun isMonochrome(): Boolean {
        val s = this.toHsl().s
        return s == 0
    }
    open fun toHsv(): HSVA {
        val hsv = rgbToHsv(this.r, this.g, this.b)
        return HSVA(h = Math.round(hsv.h * 360), s = hsv.s, v = hsv.v, a = this.a)
    }
    open fun toHsvString(): String {
        val hsv = rgbToHsv(this.r, this.g, this.b)
        val h = Math.round(hsv.h * 360)
        val s = Math.round(hsv.s * 100)
        val v = Math.round(hsv.v * 100)
        return if (this.a == 1) {
            "hsv(" + h + ", " + s + "%, " + v + "%)"
        } else {
            "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")"
        }
    }
    open fun toHsb(): HSBA {
        val hsv = rgbToHsv(this.r, this.g, this.b)
        return HSBA(h = Math.round(hsv.h * 360), s = hsv.s, b = hsv.v, a = this.a)
    }
    open fun toHsbString(): String {
        val hsb = this.toHsb()
        val h = Math.round(hsb.h)
        val s = Math.round(hsb.s * 100)
        val b = Math.round(hsb.b * 100)
        return if (this.a == 1) {
            "hsb(" + h + ", " + s + "%, " + b + "%)"
        } else {
            "hsba(" + h + ", " + s + "%, " + b + "%, " + this.roundA + ")"
        }
    }
    open fun toHsl(): HSLA {
        val hsl = rgbToHsl(this.r, this.g, this.b)
        return HSLA(h = hsl.h * 360, s = hsl.s, l = hsl.l, a = this.a)
    }
    open fun toHslString(): String {
        val hsl = rgbToHsl(this.r, this.g, this.b)
        val h = Math.round(hsl.h * 360)
        val s = Math.round(hsl.s * 100)
        val l = Math.round(hsl.l * 100)
        return if (this.a == 1) {
            "hsl(" + h + ", " + s + "%, " + l + "%)"
        } else {
            "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")"
        }
    }
    open fun toHex(allow3Char: Boolean = false): String {
        return rgbToHex(this.r, this.g, this.b, allow3Char)
    }
    open fun toHexString(allow3Char: Boolean = false): String {
        return "#" + this.toHex(allow3Char)
    }
    open fun toHex8(allow4Char: Boolean = false): String {
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char)
    }
    open fun toHex8String(allow4Char: Boolean = false): String {
        return "#" + this.toHex8(allow4Char)
    }
    open fun toHexShortString(allowShortChar: Boolean = false): String {
        return if (this.a == 1) {
            this.toHexString(allowShortChar)
        } else {
            this.toHex8String(allowShortChar)
        }
    }
    open fun toRgb(): RGBA {
        return RGBA(r = Math.round(this.r), g = Math.round(this.g), b = Math.round(this.b), a = this.a)
    }
    open fun toRgbString(): String {
        val r = Math.round(this.r)
        val g = Math.round(this.g)
        val b = Math.round(this.b)
        return if (this.a == 1) {
            "rgb(" + r + ", " + g + ", " + b + ")"
        } else {
            "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")"
        }
    }
    open fun toPercentageRgb(): RGBAString {
        val fmt = fun(x: Number): String {
            return "" + Math.round(bound01(x, 255) * 100) + "%"
        }
        return RGBAString(r = fmt(this.r), g = fmt(this.g), b = fmt(this.b), a = this.a)
    }
    open fun toPercentageRgbString(): String {
        val rnd = fun(x: Number): Number {
            return Math.round(bound01(x, 255) * 100)
        }
        return if (this.a == 1) {
            "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)"
        } else {
            "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")"
        }
    }
    open fun toName(): String? {
        if (this.a == 0) {
            return "transparent"
        }
        if (this.a < 1) {
            return null
        }
        val hex = this.toHexString()
        return this.reversedNames.get(hex)
    }
    override fun toString(): String {
        return this.toString(null)
    }
    open fun toString(format: LColorFormats?): String {
        val formatSet = toBoolean(format)
        var _format = format ?: this.format
        var formattedString: String? = null
        val hasAlpha = this.a < 1 && this.a >= 0
        val needsAlphaFormat = !formatSet && hasAlpha && (_format != null && _format.startsWith("hex") || _format == "name")
        if (needsAlphaFormat) {
            if (_format == "name" && this.a == 0) {
                return this.toName() ?: "transparent"
            }
            return this.toRgbString()
        }
        if (_format == "rgb") {
            formattedString = this.toRgbString()
        }
        if (_format == "prgb") {
            formattedString = this.toPercentageRgbString()
        }
        if (_format == "hex" || _format == "hex6") {
            formattedString = this.toHexString()
        }
        if (_format == "hex3") {
            formattedString = this.toHexString(true)
        }
        if (_format == "hex4") {
            formattedString = this.toHex8String(true)
        }
        if (_format == "hex8") {
            formattedString = this.toHex8String()
        }
        if (_format == "name") {
            formattedString = this.toName()
        }
        if (_format == "hsl") {
            formattedString = this.toHslString()
        }
        if (_format == "hsv") {
            formattedString = this.toHsvString()
        }
        if (_format == "hsb") {
            formattedString = this.toHsbString()
        }
        return formattedString ?: this.toHexString()
    }
    open fun toNumber(): Number {
        return (Math.round(this.r) shl 16) + (Math.round(this.g) shl 8) + Math.round(this.b)
    }
    open fun clone(): TinyColor {
        return TinyColor(this.toString())
    }
    open fun lighten(amount: Number = 10): TinyColor {
        val hsl = this.toHsl()
        hsl.l += amount / 100
        hsl.l = clamp01(hsl.l)
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun brighten(amount: Number = 10): TinyColor {
        val rgb = this.toRgb()
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))))
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))))
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))))
        return TinyColor(rgb, LColorOptions(format = this.format))
    }
    open fun darken(amount: Number = 10): TinyColor {
        val hsl = this.toHsl()
        hsl.l -= amount / 100
        hsl.l = clamp01(hsl.l)
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun tint(amount: Number = 10): TinyColor {
        return this.mix("white", amount)
    }
    open fun shade(amount: Number = 10): TinyColor {
        return this.mix("black", amount)
    }
    open fun desaturate(amount: Number = 10): TinyColor {
        val hsl = this.toHsl()
        hsl.s -= amount / 100
        hsl.s = clamp01(hsl.s)
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun saturate(amount: Number = 10): TinyColor {
        val hsl = this.toHsl()
        hsl.s += amount / 100
        hsl.s = clamp01(hsl.s)
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun greyscale(): TinyColor {
        return this.desaturate(100)
    }
    open fun spin(amount: Number): TinyColor {
        val hsl = this.toHsl()
        val hue = (hsl.h + amount) % 360
        hsl.h = if (hue < 0) {
            360 + hue
        } else {
            hue
        }
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun mix(color: LColorInput, amount: Number = 50): TinyColor {
        val rgb1 = this.toRgb()
        val rgb2 = TinyColor(color).toRgb()
        val p = amount / 100
        val rgba: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("rgba", "uni_modules/lime-color/common/color.uts", 462, 15), "r" to ((rgb2.r - rgb1.r) * p + rgb1.r), "g" to ((rgb2.g - rgb1.g) * p + rgb1.g), "b" to ((rgb2.b - rgb1.b) * p + rgb1.b), "a" to ((rgb2.a - rgb1.a) * p + rgb1.a))
        return TinyColor(rgba, LColorOptions(format = this.format))
    }
    open fun analogous(results: Number = 6, slices: Number = 30): UTSArray<TinyColor> {
        val hsl = this.toHsl()
        val part = (360 as Number) / slices
        val ret = _uA(
            this
        ) as UTSArray<TinyColor>
        var _results = results
        hsl.h = (hsl.h - ((part * _results) shr 1) + 720) % 360
        while(_results > 0){
            hsl.h = (hsl.h + part) % 360
            ret.push(TinyColor(hsl))
            _results--
        }
        return ret
    }
    open fun complement(): TinyColor {
        val hsl = this.toHsl()
        hsl.h = (hsl.h + 180) % 360
        return TinyColor(hsl, LColorOptions(format = this.format))
    }
    open fun monochromatic(results: Number = 6): UTSArray<TinyColor> {
        val hsv = this.toHsv()
        val h = hsv.h
        val s = hsv.s
        var v = hsv.v
        val res: UTSArray<TinyColor> = _uA()
        val modification = (1 as Number) / results
        var _results = results
        while(_results > 0){
            res.push(TinyColor(_uO("h" to h, "s" to s, "v" to v)))
            v = (v + modification) % 1
            _results--
        }
        return res
    }
    open fun splitcomplement(): UTSArray<TinyColor> {
        val hsl = this.toHsl()
        val h = hsl.h
        return _uA<TinyColor>(this, TinyColor(_uO("h" to ((h + 72) % 360), "s" to hsl.s, "l" to hsl.l)), TinyColor(_uO("h" to ((h + 216) % 360), "s" to hsl.s, "l" to hsl.l)))
    }
    open fun onBackground(background: LColorInput): TinyColor {
        val fg = this.toRgb()
        val bg = TinyColor(background).toRgb()
        val alpha = fg.a + bg.a * (1 - fg.a)
        return TinyColor(_uO("r" to ((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha), "g" to ((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha), "b" to ((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha), "a" to alpha))
    }
    open fun triad(): UTSArray<TinyColor> {
        return this.polyad(3)
    }
    open fun tetrad(): UTSArray<TinyColor> {
        return this.polyad(4)
    }
    open fun polyad(n: Number): UTSArray<TinyColor> {
        val hsl = this.toHsl()
        val h = hsl.h
        val result = _uA(
            this
        ) as UTSArray<TinyColor>
        val increment = (360 as Number) / n
        run {
            var i: Number = 1
            while(i < n){
                result.push(TinyColor(_uO("h" to ((h + i * increment) % 360), "s" to hsl.s, "l" to hsl.l)))
                i++
            }
        }
        return result
    }
    override fun equals(other: LColorInput?): Boolean {
        if (other == null) {
            return false
        } else if (other is TinyColor) {
            return this.toRgbString() == (other as TinyColor).toRgbString()
        }
        return this.toRgbString() == TinyColor(other).toRgbString()
    }
}
fun tinyColor(color: LColorInput = "", opts: LColorOptions = LColorOptions()): TinyColor {
    return TinyColor(color, opts)
}
typealias TickType = String
typealias LoadingType = String
open class UseLoadingReturn (
    @JsonNotNull
    open var ratio: Number,
    @JsonNotNull
    open var type: LoadingType,
    @JsonNotNull
    open var mode: String,
    @JsonNotNull
    open var color: String,
    open var play: () -> Unit,
    open var failed: () -> Unit,
    open var clear: () -> Unit,
    open var destroy: () -> Unit,
    open var pause: () -> Unit,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UseLoadingReturn", "uni_modules/lime-loading/index.uts", 22, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return UseLoadingReturnReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class UseLoadingReturnReactiveObject : UseLoadingReturn, IUTSReactive<UseLoadingReturn> {
    override var __v_raw: UseLoadingReturn
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: UseLoadingReturn, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(ratio = __v_raw.ratio, type = __v_raw.type, mode = __v_raw.mode, color = __v_raw.color, play = __v_raw.play, failed = __v_raw.failed, clear = __v_raw.clear, destroy = __v_raw.destroy, pause = __v_raw.pause) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UseLoadingReturnReactiveObject {
        return UseLoadingReturnReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var ratio: Number
        get() {
            return _tRG(__v_raw, "ratio", __v_raw.ratio, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("ratio")) {
                return
            }
            val oldValue = __v_raw.ratio
            __v_raw.ratio = value
            _tRS(__v_raw, "ratio", oldValue, value)
        }
    override var type: LoadingType
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
    override var mode: String
        get() {
            return _tRG(__v_raw, "mode", __v_raw.mode, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("mode")) {
                return
            }
            val oldValue = __v_raw.mode
            __v_raw.mode = value
            _tRS(__v_raw, "mode", oldValue, value)
        }
    override var color: String
        get() {
            return _tRG(__v_raw, "color", __v_raw.color, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("color")) {
                return
            }
            val oldValue = __v_raw.color
            __v_raw.color = value
            _tRS(__v_raw, "color", oldValue, value)
        }
}
fun getPointOnCircle(centerX: Number, centerY: Number, radius: Number, angleDegrees: Number): UTSArray<Number> {
    val angleRadians = (angleDegrees * Math.PI) / 180
    val x = centerX + radius * Math.cos(angleRadians)
    val y = centerY + radius * Math.sin(angleRadians)
    return _uA(
        x,
        y
    )
}
fun useLoading(element: Ref<UniElement?>): UseLoadingReturn {
    var isPlaying = false
    var canvasWidth = ref(0)
    var canvasHeight = ref(0)
    var canvasSize = ref(0)
    var animationFrameId: Number = -1
    var animation: UniAnimation? = null
    var drawFrame: (() -> Unit)? = null
    val tick = ref<TickType>("pause")
    val context = shallowRef<DrawableContext?>(null)
    val state = reactive<UseLoadingReturn>(UseLoadingReturn(color = "#000", type = "circular", ratio = 1, mode = "raf", play = fun(){
        tick.value = "play"
    }
    , failed = fun(){
        tick.value = "failed"
    }
    , clear = fun(){
        tick.value = "clear"
    }
    , destroy = fun(){
        tick.value = "destroy"
        cancelAnimationFrame(animationFrameId)
        animation?.pause()
        animation?.cancel()
        context.value?.reset()
        context.value?.update()
        context.value = null
        animation = null
        isPlaying = false
    }
    , pause = fun(){
        tick.value = "pause"
    }
    ))
    val size = computed(fun(): Number {
        return if (state.ratio > 1) {
            state.ratio
        } else {
            canvasSize.value * state.ratio
        }
    }
    )
    val drawCircular = fun(){
        var startAngle: Number = 0
        var endAngle: Number = 0
        var rotate: Number = 0
        val MIN_ANGLE: Number = 5
        val ARC_LENGTH: Number = 359.5
        val PI = Math.PI / 180
        val SPEED: Number = 0.0045
        val ROTATE_INTERVAL: Number = 0.0225
        val lineWidth = size.value / 10
        val x = canvasWidth.value / 2
        val y = canvasHeight.value / 2
        val radius = size.value / 2 - lineWidth
        try {
            drawFrame = fun(){
                if (context.value == null || !isPlaying) {
                    return
                }
                var ctx = context.value!!
                ctx.reset()
                ctx.beginPath()
                ctx.arc(x, y, radius, startAngle * PI + rotate, endAngle * PI + rotate)
                ctx.lineWidth = lineWidth
                ctx.strokeStyle = state.color
                ctx.stroke()
                if (endAngle < ARC_LENGTH) {
                    endAngle = Math.min(ARC_LENGTH, endAngle + (ARC_LENGTH - MIN_ANGLE) * SPEED)
                } else if (startAngle < ARC_LENGTH) {
                    startAngle = Math.min(ARC_LENGTH, startAngle + (ARC_LENGTH - MIN_ANGLE) * SPEED)
                } else {
                    startAngle = 0
                    endAngle = MIN_ANGLE
                }
                ctx.update()
                if (state.mode == "raf") {
                    rotate = (rotate + ROTATE_INTERVAL) % 360
                    if (isPlaying && drawFrame != null) {
                        animationFrameId = requestAnimationFrame(drawFrame!!)
                    }
                }
            }
        }
         catch (err: Throwable) {}
    }
    var lastTime = Date.now()
    val drawSpinner = fun(){
        val steps: Number = 12
        val lineWidth = size.value / 10
        val x = canvasWidth.value / 2
        val y = canvasHeight.value / 2
        var step: Number = 0
        val length = size.value / 3.6 - lineWidth
        val offset = size.value / 4
        fun generateColorGradient(hex: String, steps: Number): UTSArray<String> {
            val colors: UTSArray<String> = _uA()
            val _color = tinyColor(hex)
            run {
                var i: Number = 1
                while(i <= steps){
                    _color.setAlpha(i / steps)
                    colors.push(_color.toRgbString())
                    i++
                }
            }
            return colors
        }
        var colors = computed(fun(): UTSArray<String> {
            return generateColorGradient(state.color, steps)
        }
        )
        drawFrame = fun(){
            if (context.value == null || !isPlaying) {
                return
            }
            val delta = Date.now() - lastTime
            if (delta >= 100) {
                lastTime = Date.now()
                var ctx = context.value!!
                ctx.reset()
                run {
                    var i: Number = 0
                    while(i < steps){
                        val stepAngle = (360 as Number) / steps
                        val angle = stepAngle * i
                        val index = (steps + i - step) % steps
                        val radian = angle * Math.PI / 180
                        val cos = Math.cos(radian)
                        val sin = Math.sin(radian)
                        ctx.beginPath()
                        ctx.moveTo(x + offset * cos, y + offset * sin)
                        ctx.lineTo(x + (offset + length) * cos, y + (offset + length) * sin)
                        ctx.lineWidth = lineWidth
                        ctx.lineCap = "round"
                        ctx.strokeStyle = colors.value[index]
                        ctx.stroke()
                        i++
                    }
                }
                ctx.update()
                if (state.mode == "raf") {
                    step = (step + 1) % steps
                }
            }
            if (state.mode == "raf") {
                if (isPlaying && drawFrame != null) {
                    animationFrameId = requestAnimationFrame(drawFrame!!)
                }
            }
        }
    }
    val drwaFailed = fun(){
        if (context.value == null) {
            return
        }
        var ctx = context.value!!
        val innerSize = size.value * 0.8
        val lineWidth = innerSize / 10
        val lineLength = (size.value - lineWidth) / 2
        val centerX = canvasWidth.value / 2
        val centerY = canvasHeight.value / 2
        val radius = (size.value - lineWidth) / 2
        val angleRadians1 = 45 * Math.PI / 180
        val angleRadians2 = -45 * Math.PI / 180
        ctx.reset()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = state.color
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = state.color
        ctx.stroke()
        val _getPointOnCircle = getPointOnCircle(centerX, centerY, lineLength / 2, 225)
        val startX1 = _getPointOnCircle[0]
        val startY = _getPointOnCircle[1]
        val _getPointOnCircle__1 = getPointOnCircle(centerX, centerY, lineLength / 2, 315)
        val startX2 = _getPointOnCircle__1[0]
        val x2 = Math.sin(angleRadians1) * lineLength + startX1
        val y2 = Math.cos(angleRadians1) * lineLength + startY
        ctx.beginPath()
        ctx.moveTo(startX1, startY)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        val x3 = Math.sin(angleRadians2) * lineLength + startX2
        val y3 = Math.cos(angleRadians2) * lineLength + startY
        ctx.beginPath()
        ctx.moveTo(startX2, startY)
        ctx.lineTo(x3, y3)
        ctx.stroke()
        ctx.update()
    }
    var currentType: LoadingType? = null
    val useMode = fun(){
        if (state.mode != "raf") {
            val keyframes = _uA<UTSJSONObject>(_uO("transform" to "rotate(0)"), _uO("transform" to "rotate(360)"))
            animation = element.value!!.animate(keyframes, UniAnimationOption(duration = 80000, easing = "linear", iterations = Infinity))
        }
    }
    val startAnimation = fun(type: String){
        if (context.value == null || element.value == null) {
            return
        }
        animation?.pause()
        if (currentType == type) {
            isPlaying = true
            animation?.play()
            drawFrame?.invoke()
            return
        }
        if (type == "circular") {
            currentType = "circular"
            drawCircular()
            useMode()
        }
        if (type == "spinner") {
            currentType = "spinner"
            drawSpinner()
            useMode()
        }
        isPlaying = true
        drawFrame?.invoke()
    }
    var manualCheckTimer: Number? = null
    val getBoundingClientRect = fun(){
        if (manualCheckTimer != null) {
            clearTimeout(manualCheckTimer!!)
        }
        requestAnimationFrame(fun(_timestamp){
            element.value?.getBoundingClientRectAsync()?.then(fun(rect){
                if (rect.width == 0 || rect.height == 0) {
                    return
                }
                context.value = element.value!!.getDrawableContext() as DrawableContext
                canvasWidth.value = rect.width
                canvasHeight.value = rect.height
                canvasSize.value = Math.min(rect.width, rect.height)
            }
            )
        }
        )
    }
    val resizeObserver: UniResizeObserver = UniResizeObserver(fun(_entries: UTSArray<UniResizeObserverEntry>){
        getBoundingClientRect()
    }
    )
    watchEffect(fun(){
        if (element.value == null) {
            return
        }
        resizeObserver.observe(element.value!!)
    }
    )
    watchEffect(fun(){
        if (context.value == null) {
            return
        }
        if (tick.value == "play") {
            animation?.pause()
            isPlaying = false
            cancelAnimationFrame(animationFrameId)
            startAnimation(state.type)
        }
        if (tick.value == "failed") {
            cancelAnimationFrame(animationFrameId)
            animation?.pause()
            animation?.cancel()
            drwaFailed()
            return
        }
        if (tick.value == "clear") {
            cancelAnimationFrame(animationFrameId)
            animation?.pause()
            animation?.cancel()
            context.value?.reset()
            context.value?.update()
            isPlaying = false
            return
        }
        if (tick.value == "destroy") {
            cancelAnimationFrame(animationFrameId)
            animation?.pause()
            animation?.cancel()
            context.value?.reset()
            context.value?.update()
            context.value = null
            animation = null
            isPlaying = false
            return
        }
        if (tick.value == "pause") {
            if (animation == null) {
                startAnimation(state.type)
            }
            cancelAnimationFrame(animationFrameId)
            isPlaying = false
            animation?.pause()
            return
        }
    }
    )
    watchEffect(fun(){
        if (state.color == "") {
            return
        }
    }
    )
    return state
}
val GenUniModulesLimePickerComponentsLPickerItemLPickerItemClass = CreateVueComponent(GenUniModulesLimePickerComponentsLPickerItemLPickerItem::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.inheritAttrs, inject = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.inject, props = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.props, propsNeedCastKeys = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.propsNeedCastKeys, emits = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.emits, components = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.components, styles = GenUniModulesLimePickerComponentsLPickerItemLPickerItem.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesLimePickerComponentsLPickerItemLPickerItem.setup(props as GenUniModulesLimePickerComponentsLPickerItemLPickerItem, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimePickerComponentsLPickerItemLPickerItem {
    return GenUniModulesLimePickerComponentsLPickerItemLPickerItem(instance)
}
)
typealias ManageChildInList = (child: LPickerItemComponentPublicInstance, shouldAdd: Boolean) -> Unit
val GenUniModulesLimePickerComponentsLPickerLPickerClass = CreateVueComponent(GenUniModulesLimePickerComponentsLPickerLPicker::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenUniModulesLimePickerComponentsLPickerLPicker.inheritAttrs, inject = GenUniModulesLimePickerComponentsLPickerLPicker.inject, props = GenUniModulesLimePickerComponentsLPickerLPicker.props, propsNeedCastKeys = GenUniModulesLimePickerComponentsLPickerLPicker.propsNeedCastKeys, emits = GenUniModulesLimePickerComponentsLPickerLPicker.emits, components = GenUniModulesLimePickerComponentsLPickerLPicker.components, styles = GenUniModulesLimePickerComponentsLPickerLPicker.styles, setup = fun(props: ComponentPublicInstance, ctx: SetupContext): Any? {
        return GenUniModulesLimePickerComponentsLPickerLPicker.setup(props as GenUniModulesLimePickerComponentsLPickerLPicker, ctx)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimePickerComponentsLPickerLPicker {
    return GenUniModulesLimePickerComponentsLPickerLPicker(instance)
}
)
typealias LPickerComponentPublicInstance = GenUniModulesLimePickerComponentsLPickerLPicker
typealias LPickerItemComponentPublicInstance = GenUniModulesLimePickerComponentsLPickerItemLPickerItem
typealias OnPick = (value: PickerValue, index: Number, column: Number) -> Unit
typealias UpdateItems = (value: PickerValue, index: Number, column: Number) -> Unit
interface PickerItemProps {
    var options: UTSArray<PickerColumnItem>
    var value: PickerValue?
    var column: Number
    var name: Any?
}
typealias TimeModeValues = String
typealias DateValue = Any
typealias DateTimePickerColumn = PickerColumn
typealias DateTimePickerColumnItem = PickerColumnItem
interface DateTimePickerProps {
    var cancelBtn: String?
    var cancelStyle: Any?
    var confirmBtn: String?
    var confirmStyle: Any?
    var customLocale: String?
    var end: DateValue?
    var start: DateValue?
    var steps: UTSJSONObject?
    var title: String?
    var titleStyle: Any?
    var value: DateValue?
    var defaultValue: DateValue?
    var modelValue: DateValue?
    var format: String
    var mode: Any
    var customFilter: ((type: TimeModeValues, columns: DateTimePickerColumn) -> DateTimePickerColumn)?
    var renderLabel: ((type: String, value: String) -> String)?
    var showUnit: Boolean
    var itemHeight: String?
    var itemColor: String?
    var itemFontSize: String?
    var itemActiveColor: String?
    var indicatorStyle: String?
    var maskColors: UTSArray<String>?
    var bgColor: String?
    var groupHeight: String?
    var radius: String?
    var resetIndex: Boolean
    var minHour: Number
    var maxHour: Number
    var minMinute: Number
    var maxMinute: Number
}
val MODE_YEAR: Number = 1
val MODE_MONTH: Number = 2
val MODE_DATE: Number = 4
val MODE_HOUR: Number = 8
val MODE_MINUTE: Number = 16
val MODE_SECOND: Number = 32
val MODE_MAP = Map<String, Number>(_uA(
    _uA(
        "年",
        MODE_YEAR
    ),
    _uA(
        "月",
        MODE_MONTH
    ),
    _uA(
        "日",
        MODE_DATE
    ),
    _uA(
        "时",
        MODE_HOUR
    ),
    _uA(
        "分",
        MODE_MINUTE
    ),
    _uA(
        "秒",
        MODE_SECOND
    ),
    _uA(
        "year",
        MODE_YEAR
    ),
    _uA(
        "month",
        MODE_MONTH
    ),
    _uA(
        "date",
        MODE_DATE
    ),
    _uA(
        "hour",
        MODE_HOUR
    ),
    _uA(
        "minute",
        MODE_MINUTE
    ),
    _uA(
        "second",
        MODE_SECOND
    )
))
val FORMAT_MAP = Map<String, String>(_uA(
    _uA(
        "year",
        "YYYY"
    ),
    _uA(
        "month",
        "MM"
    ),
    _uA(
        "date",
        "DD"
    ),
    _uA(
        "hour",
        "HH"
    ),
    _uA(
        "minute",
        "mm"
    ),
    _uA(
        "second",
        "ss"
    )
))
val UNIT_MAP = Map<String, String>(_uA(
    _uA(
        "year",
        "年"
    ),
    _uA(
        "month",
        "月"
    ),
    _uA(
        "date",
        "日"
    ),
    _uA(
        "hour",
        "时"
    ),
    _uA(
        "minute",
        "分"
    ),
    _uA(
        "second",
        "秒"
    )
))
val MODE_NAMES = _uA(
    "year",
    "month",
    "date",
    "hour",
    "minute",
    "second"
) as UTSArray<TimeModeValues>
val DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss"
@Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")
fun <T> coalesce(vararg spreadValues: T?): T? {
    var values = UTSArray(*spreadValues)
    for(value in resolveUTSValueIterator(values)){
        if (value == null) {
            continue
        }
        if (UTSAndroid.`typeof`(value) == "string" && value == "") {
            continue
        }
        return value
    }
    return null
}
fun getMeaningColumn(mode: Any): UTSArray<TimeModeValues> {
    val res: UTSArray<TimeModeValues> = _uA()
    var _mode: Number = 0
    if (UTSAndroid.`typeof`(mode) == "string") {
        if ((mode as String).includes("|") && UTSRegExp("\\d", "").test(mode as String)) {
            val bits = (mode as String).split("|").map(fun(bit): Number {
                return parseInt(bit.trim())
            })
            _mode = bits.reduce(fun(result, bit): Number {
                return result or bit
            }, 0)
        } else {
            MODE_MAP.forEach(fun(value, key){
                if ((mode as String).includes(key)) {
                    _mode = _mode or value
                }
            })
        }
    } else if (UTSAndroid.`typeof`(mode) == "number") {
        _mode = mode as Number
    }
    if (_mode <= 0) {
        return res
    }
    val modeBitmasks = _uA(
        MODE_YEAR,
        MODE_MONTH,
        MODE_DATE,
        MODE_HOUR,
        MODE_MINUTE,
        MODE_SECOND
    )
    val activeBitmasks = modeBitmasks.filter(fun(bitmask): Boolean {
        return (_mode and bitmask) != 0
    }
    )
    if (activeBitmasks.length == 0) {
        return _uA()
    }
    var longestSequence: UTSArray<Number> = _uA()
    var currentSequence: UTSArray<Number> = _uA()
    activeBitmasks.forEach(fun(bitmask){
        if (currentSequence.length == 0 || bitmask == currentSequence[currentSequence.length - 1] * 2) {
            currentSequence.push(bitmask)
        } else {
            if (currentSequence.length > longestSequence.length) {
                longestSequence = currentSequence
            }
            currentSequence = _uA(
                bitmask
            )
        }
    }
    )
    if (currentSequence.length > longestSequence.length) {
        longestSequence = currentSequence
    }
    return longestSequence.map(fun(bitmask): String {
        return MODE_NAMES[modeBitmasks.indexOf(bitmask)]
    }
    )
}
val SECONDS_A_MINUTE: Number = 60
val SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
val SECONDS_A_DAY = SECONDS_A_HOUR * 24
val SECONDS_A_WEEK = SECONDS_A_DAY * 7
val MILLISECONDS_A_SECOND: Number = 1e3
val MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND
val MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND
val MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND
val MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND
val MS = "millisecond"
val S = "second"
val MIN = "minute"
val H = "hour"
val D = "day"
val W = "week"
val M = "month"
val Q = "quarter"
val Y = "year"
val DATE = "date"
val FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ"
val INVALID_DATE_STRING = "Invalid Date"
val REGEX_PARSE = UTSRegExp("^(\\d{4})[-/]?(\\d{1,2})?[-/]?(\\d{0,2})[Tt\\s]*(\\d{1,2})?:?(\\d{1,2})?:?(\\d{1,2})?[.:]?(\\d+)?\$", "")
open class DayutsConfig (
    open var date: Any? = null,
    open var format: String? = null,
    open var locale: String? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsConfig", "uni_modules/lime-dayuts/utssdk/interface.uts", 2, 13)
    }
}
typealias DayutsUnit = String
open class DayutsFormats (
    @JsonNotNull
    open var LT: String,
    @JsonNotNull
    open var LTS: String,
    @JsonNotNull
    @get:JvmName("getL0")
    @set:JvmName("setL0")
    open var L: String,
    @JsonNotNull
    open var LL: String,
    @JsonNotNull
    open var LLL: String,
    @JsonNotNull
    open var LLLL: String,
    @JsonNotNull
    @get:JvmName("getL1")
    @set:JvmName("setL1")
    open var l: String,
    @JsonNotNull
    open var ll: String,
    @JsonNotNull
    open var lll: String,
    @JsonNotNull
    open var llll: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsFormats", "uni_modules/lime-dayuts/utssdk/interface.uts", 8, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DayutsFormatsReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DayutsFormatsReactiveObject : DayutsFormats, IUTSReactive<DayutsFormats> {
    override var __v_raw: DayutsFormats
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DayutsFormats, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(LT = __v_raw.LT, LTS = __v_raw.LTS, L = __v_raw.L, LL = __v_raw.LL, LLL = __v_raw.LLL, LLLL = __v_raw.LLLL, l = __v_raw.l, ll = __v_raw.ll, lll = __v_raw.lll, llll = __v_raw.llll) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DayutsFormatsReactiveObject {
        return DayutsFormatsReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var LT: String
        get() {
            return _tRG(__v_raw, "LT", __v_raw.LT, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("LT")) {
                return
            }
            val oldValue = __v_raw.LT
            __v_raw.LT = value
            _tRS(__v_raw, "LT", oldValue, value)
        }
    override var LTS: String
        get() {
            return _tRG(__v_raw, "LTS", __v_raw.LTS, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("LTS")) {
                return
            }
            val oldValue = __v_raw.LTS
            __v_raw.LTS = value
            _tRS(__v_raw, "LTS", oldValue, value)
        }
    override var L: String
        @JvmName("getL0")
        get() {
            return _tRG(__v_raw, "L", __v_raw.L, __v_isReadonly, __v_isShallow)
        }
        @JvmName("setL0")
        set(value) {
            if (!__v_canSet("L")) {
                return
            }
            val oldValue = __v_raw.L
            __v_raw.L = value
            _tRS(__v_raw, "L", oldValue, value)
        }
    override var LL: String
        get() {
            return _tRG(__v_raw, "LL", __v_raw.LL, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("LL")) {
                return
            }
            val oldValue = __v_raw.LL
            __v_raw.LL = value
            _tRS(__v_raw, "LL", oldValue, value)
        }
    override var LLL: String
        get() {
            return _tRG(__v_raw, "LLL", __v_raw.LLL, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("LLL")) {
                return
            }
            val oldValue = __v_raw.LLL
            __v_raw.LLL = value
            _tRS(__v_raw, "LLL", oldValue, value)
        }
    override var LLLL: String
        get() {
            return _tRG(__v_raw, "LLLL", __v_raw.LLLL, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("LLLL")) {
                return
            }
            val oldValue = __v_raw.LLLL
            __v_raw.LLLL = value
            _tRS(__v_raw, "LLLL", oldValue, value)
        }
    override var l: String
        @JvmName("getL1")
        get() {
            return _tRG(__v_raw, "l", __v_raw.l, __v_isReadonly, __v_isShallow)
        }
        @JvmName("setL1")
        set(value) {
            if (!__v_canSet("l")) {
                return
            }
            val oldValue = __v_raw.l
            __v_raw.l = value
            _tRS(__v_raw, "l", oldValue, value)
        }
    override var ll: String
        get() {
            return _tRG(__v_raw, "ll", __v_raw.ll, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("ll")) {
                return
            }
            val oldValue = __v_raw.ll
            __v_raw.ll = value
            _tRS(__v_raw, "ll", oldValue, value)
        }
    override var lll: String
        get() {
            return _tRG(__v_raw, "lll", __v_raw.lll, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("lll")) {
                return
            }
            val oldValue = __v_raw.lll
            __v_raw.lll = value
            _tRS(__v_raw, "lll", oldValue, value)
        }
    override var llll: String
        get() {
            return _tRG(__v_raw, "llll", __v_raw.llll, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("llll")) {
                return
            }
            val oldValue = __v_raw.llll
            __v_raw.llll = value
            _tRS(__v_raw, "llll", oldValue, value)
        }
}
open class DayutsRelativeTime (
    @JsonNotNull
    open var future: String,
    @JsonNotNull
    open var past: String,
    @JsonNotNull
    open var s: String,
    @JsonNotNull
    @get:JvmName("getM0")
    @set:JvmName("setM0")
    open var m: String,
    @JsonNotNull
    open var mm: String,
    @JsonNotNull
    open var h: String,
    @JsonNotNull
    open var hh: String,
    @JsonNotNull
    open var d: String,
    @JsonNotNull
    open var dd: String,
    @JsonNotNull
    @get:JvmName("getM1")
    @set:JvmName("setM1")
    open var M: String,
    @JsonNotNull
    open var MM: String,
    @JsonNotNull
    open var y: String,
    @JsonNotNull
    open var yy: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsRelativeTime", "uni_modules/lime-dayuts/utssdk/interface.uts", 50, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DayutsRelativeTimeReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DayutsRelativeTimeReactiveObject : DayutsRelativeTime, IUTSReactive<DayutsRelativeTime> {
    override var __v_raw: DayutsRelativeTime
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DayutsRelativeTime, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(future = __v_raw.future, past = __v_raw.past, s = __v_raw.s, m = __v_raw.m, mm = __v_raw.mm, h = __v_raw.h, hh = __v_raw.hh, d = __v_raw.d, dd = __v_raw.dd, M = __v_raw.M, MM = __v_raw.MM, y = __v_raw.y, yy = __v_raw.yy) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DayutsRelativeTimeReactiveObject {
        return DayutsRelativeTimeReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var future: String
        get() {
            return _tRG(__v_raw, "future", __v_raw.future, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("future")) {
                return
            }
            val oldValue = __v_raw.future
            __v_raw.future = value
            _tRS(__v_raw, "future", oldValue, value)
        }
    override var past: String
        get() {
            return _tRG(__v_raw, "past", __v_raw.past, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("past")) {
                return
            }
            val oldValue = __v_raw.past
            __v_raw.past = value
            _tRS(__v_raw, "past", oldValue, value)
        }
    override var s: String
        get() {
            return _tRG(__v_raw, "s", __v_raw.s, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("s")) {
                return
            }
            val oldValue = __v_raw.s
            __v_raw.s = value
            _tRS(__v_raw, "s", oldValue, value)
        }
    override var m: String
        @JvmName("getM0")
        get() {
            return _tRG(__v_raw, "m", __v_raw.m, __v_isReadonly, __v_isShallow)
        }
        @JvmName("setM0")
        set(value) {
            if (!__v_canSet("m")) {
                return
            }
            val oldValue = __v_raw.m
            __v_raw.m = value
            _tRS(__v_raw, "m", oldValue, value)
        }
    override var mm: String
        get() {
            return _tRG(__v_raw, "mm", __v_raw.mm, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("mm")) {
                return
            }
            val oldValue = __v_raw.mm
            __v_raw.mm = value
            _tRS(__v_raw, "mm", oldValue, value)
        }
    override var h: String
        get() {
            return _tRG(__v_raw, "h", __v_raw.h, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("h")) {
                return
            }
            val oldValue = __v_raw.h
            __v_raw.h = value
            _tRS(__v_raw, "h", oldValue, value)
        }
    override var hh: String
        get() {
            return _tRG(__v_raw, "hh", __v_raw.hh, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("hh")) {
                return
            }
            val oldValue = __v_raw.hh
            __v_raw.hh = value
            _tRS(__v_raw, "hh", oldValue, value)
        }
    override var d: String
        get() {
            return _tRG(__v_raw, "d", __v_raw.d, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("d")) {
                return
            }
            val oldValue = __v_raw.d
            __v_raw.d = value
            _tRS(__v_raw, "d", oldValue, value)
        }
    override var dd: String
        get() {
            return _tRG(__v_raw, "dd", __v_raw.dd, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("dd")) {
                return
            }
            val oldValue = __v_raw.dd
            __v_raw.dd = value
            _tRS(__v_raw, "dd", oldValue, value)
        }
    override var M: String
        @JvmName("getM1")
        get() {
            return _tRG(__v_raw, "M", __v_raw.M, __v_isReadonly, __v_isShallow)
        }
        @JvmName("setM1")
        set(value) {
            if (!__v_canSet("M")) {
                return
            }
            val oldValue = __v_raw.M
            __v_raw.M = value
            _tRS(__v_raw, "M", oldValue, value)
        }
    override var MM: String
        get() {
            return _tRG(__v_raw, "MM", __v_raw.MM, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("MM")) {
                return
            }
            val oldValue = __v_raw.MM
            __v_raw.MM = value
            _tRS(__v_raw, "MM", oldValue, value)
        }
    override var y: String
        get() {
            return _tRG(__v_raw, "y", __v_raw.y, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("y")) {
                return
            }
            val oldValue = __v_raw.y
            __v_raw.y = value
            _tRS(__v_raw, "y", oldValue, value)
        }
    override var yy: String
        get() {
            return _tRG(__v_raw, "yy", __v_raw.yy, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("yy")) {
                return
            }
            val oldValue = __v_raw.yy
            __v_raw.yy = value
            _tRS(__v_raw, "yy", oldValue, value)
        }
}
open class DayutsLocale (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var weekdays: UTSArray<String>,
    open var weekdaysShort: UTSArray<String>? = null,
    open var weekdaysMin: UTSArray<String>? = null,
    @JsonNotNull
    open var months: UTSArray<String>,
    open var monthsShort: UTSArray<String>? = null,
    open var ordinal: (number: Number, period: String) -> String,
    open var weekStart: Number? = null,
    open var yearStart: Number? = null,
    open var formats: DayutsFormats? = null,
    open var relativeTime: DayutsRelativeTime? = null,
    open var meridiem: ((hour: Number, minute: Number, isLowercase: Boolean) -> String)? = null,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsLocale", "uni_modules/lime-dayuts/utssdk/interface.uts", 107, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return DayutsLocaleReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class DayutsLocaleReactiveObject : DayutsLocale, IUTSReactive<DayutsLocale> {
    override var __v_raw: DayutsLocale
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: DayutsLocale, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(name = __v_raw.name, weekdays = __v_raw.weekdays, weekdaysShort = __v_raw.weekdaysShort, weekdaysMin = __v_raw.weekdaysMin, months = __v_raw.months, monthsShort = __v_raw.monthsShort, ordinal = __v_raw.ordinal, weekStart = __v_raw.weekStart, yearStart = __v_raw.yearStart, formats = __v_raw.formats, relativeTime = __v_raw.relativeTime, meridiem = __v_raw.meridiem) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): DayutsLocaleReactiveObject {
        return DayutsLocaleReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
    override var weekdays: UTSArray<String>
        get() {
            return _tRG(__v_raw, "weekdays", __v_raw.weekdays, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("weekdays")) {
                return
            }
            val oldValue = __v_raw.weekdays
            __v_raw.weekdays = value
            _tRS(__v_raw, "weekdays", oldValue, value)
        }
    override var weekdaysShort: UTSArray<String>?
        get() {
            return _tRG(__v_raw, "weekdaysShort", __v_raw.weekdaysShort, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("weekdaysShort")) {
                return
            }
            val oldValue = __v_raw.weekdaysShort
            __v_raw.weekdaysShort = value
            _tRS(__v_raw, "weekdaysShort", oldValue, value)
        }
    override var weekdaysMin: UTSArray<String>?
        get() {
            return _tRG(__v_raw, "weekdaysMin", __v_raw.weekdaysMin, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("weekdaysMin")) {
                return
            }
            val oldValue = __v_raw.weekdaysMin
            __v_raw.weekdaysMin = value
            _tRS(__v_raw, "weekdaysMin", oldValue, value)
        }
    override var months: UTSArray<String>
        get() {
            return _tRG(__v_raw, "months", __v_raw.months, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("months")) {
                return
            }
            val oldValue = __v_raw.months
            __v_raw.months = value
            _tRS(__v_raw, "months", oldValue, value)
        }
    override var monthsShort: UTSArray<String>?
        get() {
            return _tRG(__v_raw, "monthsShort", __v_raw.monthsShort, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("monthsShort")) {
                return
            }
            val oldValue = __v_raw.monthsShort
            __v_raw.monthsShort = value
            _tRS(__v_raw, "monthsShort", oldValue, value)
        }
    override var weekStart: Number?
        get() {
            return _tRG(__v_raw, "weekStart", __v_raw.weekStart, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("weekStart")) {
                return
            }
            val oldValue = __v_raw.weekStart
            __v_raw.weekStart = value
            _tRS(__v_raw, "weekStart", oldValue, value)
        }
    override var yearStart: Number?
        get() {
            return _tRG(__v_raw, "yearStart", __v_raw.yearStart, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("yearStart")) {
                return
            }
            val oldValue = __v_raw.yearStart
            __v_raw.yearStart = value
            _tRS(__v_raw, "yearStart", oldValue, value)
        }
    override var formats: DayutsFormats?
        get() {
            return _tRG(__v_raw, "formats", __v_raw.formats, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("formats")) {
                return
            }
            val oldValue = __v_raw.formats
            __v_raw.formats = value
            _tRS(__v_raw, "formats", oldValue, value)
        }
    override var relativeTime: DayutsRelativeTime?
        get() {
            return _tRG(__v_raw, "relativeTime", __v_raw.relativeTime, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("relativeTime")) {
                return
            }
            val oldValue = __v_raw.relativeTime
            __v_raw.relativeTime = value
            _tRS(__v_raw, "relativeTime", oldValue, value)
        }
}
open class DayutsObject (
    @JsonNotNull
    open var years: Number,
    @JsonNotNull
    open var months: Number,
    @JsonNotNull
    open var date: Number,
    @JsonNotNull
    open var hours: Number,
    @JsonNotNull
    open var minutes: Number,
    @JsonNotNull
    open var seconds: Number,
    @JsonNotNull
    open var milliseconds: Number,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsObject", "uni_modules/lime-dayuts/utssdk/interface.uts", 166, 13)
    }
}
val default__8 = DayutsLocale(name = "en", weekdays = _uA(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
), months = _uA(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
), relativeTime = DayutsRelativeTime(future = "in %s", past = "%s ago", s = "a few seconds", m = "a minute", mm = "%d minutes", h = "an hour", hh = "%d hours", d = "a day", dd = "%d days", M = "a month", MM = "%d months", y = "a year", yy = "%d years"), ordinal = fun(n: Number, _: String): String {
    val s = _uA(
        "th",
        "st",
        "nd",
        "rd"
    )
    val v = n % 100
    val i = (v - 20) % 10
    val k = if (i < s.length) {
        i
    } else {
        if (v < s.length) {
            v
        } else {
            0
        }
    }
    return "[" + n + s[k] + "]"
}
)
val locale = DayutsLocale(name = "zh-cn", weekdays = _uA(
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
), weekdaysShort = _uA(
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六"
), weekdaysMin = _uA(
    "日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六"
), months = _uA(
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
), monthsShort = _uA(
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
), ordinal = fun(number: Number, period: String): String {
    if (period == "W") {
        return "" + number + "周"
    }
    return "" + number + "日"
}
, weekStart = 1, yearStart = 4, formats = DayutsFormats(LT = "HH:mm", LTS = "HH:mm:ss", L = "YYYY/MM/DD", LL = "YYYY年M月D日", LLL = "YYYY年M月D日Ah点mm分", LLLL = "YYYY年M月D日ddddAh点mm分", l = "YYYY/M/D", ll = "YYYY年M月D日", lll = "YYYY年M月D日 HH:mm", llll = "YYYY年M月D日dddd HH:mm"), relativeTime = DayutsRelativeTime(future = "%s内", past = "%s前", s = "几秒", m = "1 分钟", mm = "%d 分钟", h = "1 小时", hh = "%d 小时", d = "1 天", dd = "%d 天", M = "1 个月", MM = "%d 个月", y = "1 年", yy = "%d 年"), meridiem = fun(hour: Number, minute: Number, _: Boolean): String {
    val hm = (hour * 100) + minute
    if (hm < 600) {
        return "凌晨"
    } else if (hm < 900) {
        return "早上"
    } else if (hm < 1100) {
        return "上午"
    } else if (hm < 1300) {
        return "中午"
    } else if (hm < 1800) {
        return "下午"
    }
    return "晚上"
}
)
val localesMap = Map<String, DayutsLocale>()
open class LocaleState (
    @JsonNotNull
    open var lang: String,
    @JsonNotNull
    open var locales: Map<String, DayutsLocale>,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("LocaleState", "uni_modules/lime-dayuts/common/use.uts", 7, 6)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return LocaleStateReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class LocaleStateReactiveObject : LocaleState, IUTSReactive<LocaleState> {
    override var __v_raw: LocaleState
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: LocaleState, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(lang = __v_raw.lang, locales = __v_raw.locales) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): LocaleStateReactiveObject {
        return LocaleStateReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
    }
    override var lang: String
        get() {
            return _tRG(__v_raw, "lang", __v_raw.lang, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("lang")) {
                return
            }
            val oldValue = __v_raw.lang
            __v_raw.lang = value
            _tRS(__v_raw, "lang", oldValue, value)
        }
    override var locales: Map<String, DayutsLocale>
        get() {
            return _tRG(__v_raw, "locales", __v_raw.locales, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("locales")) {
                return
            }
            val oldValue = __v_raw.locales
            __v_raw.locales = value
            _tRS(__v_raw, "locales", oldValue, value)
        }
}
var localeState = reactive(LocaleState(lang = "en", locales = localesMap))
val runBlock3 = run {
    localeState.locales.set("en", default__8)
    localeState.locales.set("zh-cn", locale)
}
open class DayutsIntl : IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DayutsIntl", "uni_modules/lime-dayuts/common/use.uts", 17, 7)
    }
    constructor(){}
    open fun use(locale: DayutsLocale): DayutsIntl {
        localeState.locales.set(locale.name, locale)
        return this
    }
    open var locale: String
        get(): String {
            return localeState.lang
        }
        set(locale: String) {
            if (localeState.locales.has(locale)) {
                localeState.lang = locale
            } else {
                var list: UTSArray<String> = _uA()
                localeState.locales.forEach(fun(_: Any, key: String) {
                    list.push(key)
                }
                )
                console.warn("未知语言: \"" + locale + "\". 请使用以下已知语言之一:" + list.join(", "), " at uni_modules/lime-dayuts/common/use.ts:46")
            }
        }
    open fun set(name: String, locale: DayutsLocale) {
        localeState.locales.set(name, locale)
    }
    open fun has(name: String): Boolean {
        return localeState.locales.has(name)
    }
}
val dayutsIntl = DayutsIntl()
open class Threshold (
    @JsonNotNull
    open var l: String,
    open var r: Number? = null,
    open var d: DayutsUnit? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("Threshold", "uni_modules/lime-dayuts/common/index.uts", 6, 6)
    }
}
fun padStart(string: String, length: Number, pad: String): String {
    val str = string
    if (str.length >= length) {
        return str
    }
    return str.padStart(length, pad)
}
fun parseLocale(preset: String?): String? {
    return parseLocale(preset as Any?, null, false)
}
fun parseLocale(preset: DayutsLocale?): String? {
    return parseLocale(preset as Any?, null, false)
}
fun parseLocale(preset: String, kObject: DayutsLocale?, isLocal: Boolean): String? {
    return parseLocale(preset as Any?, kObject as DayutsLocale?, isLocal as Boolean)
}
fun parseLocale(preset: DayutsLocale, kObject: DayutsLocale, isLocal: Boolean): String? {
    return parseLocale(preset as Any?, kObject as DayutsLocale?, isLocal as Boolean)
}
fun parseLocale(preset: Any?, kObject: DayutsLocale? = null, isLocal: Boolean = false): String? {
    var l: String? = null
    if (preset == null) {
        return dayutsIntl.locale
    }
    if (UTSAndroid.`typeof`(preset) == "string") {
        val presetLower = (preset as String).toLowerCase()
        if (dayutsIntl.has(presetLower)) {
            l = presetLower
        }
        if (kObject != null) {
            dayutsIntl.set(presetLower, kObject)
            l = presetLower
        }
        val presetSplit = (preset as String).split("-")
        if (l == null && presetSplit.length > 1) {
            return parseLocale(presetSplit[0])
        }
    } else if (preset is DayutsLocale) {
        dayutsIntl.set(preset.name, preset)
        l = preset.name
    }
    if (!isLocal && l != null) {
        dayutsIntl.locale = l
    }
    return l ?: dayutsIntl.locale
}
fun padZoneStr(instance: Dayuts): String {
    val negMinutes = -instance.utcOffset()
    val minutes = Math.abs(negMinutes)
    val hourOffset = Math.floor(minutes / 60)
    val minuteOffset = minutes % 60
    return "" + (if (negMinutes <= 0) {
        "+"
    } else {
        "-"
    }
    ) + padStart(hourOffset.toString(10), 2, "0") + ":" + padStart(minuteOffset.toString(10), 2, "0")
}
fun isNumber__2(value: Any?): Boolean {
    return _uA(
        "Byte",
        "UByte",
        "Short",
        "UShort",
        "Int",
        "UInt",
        "Long",
        "ULong",
        "Float",
        "Double",
        "number"
    ).includes(UTSAndroid.`typeof`(value))
}
fun tryParseNumberAtIndex(digits: UTSArray<Any?>, index: Number): Number? {
    if (index >= 0 && index < digits.length) {
        if (digits[index] == null) {
            return null
        }
        val parsedNumber = if (isNumber__2(digits[index])) {
            digits[index] as Number
        } else {
            parseInt("" + digits[index], 10)
        }
        if (!isNaN(parsedNumber)) {
            return parsedNumber
        }
    }
    return null
}
fun createDateFromArray(d: UTSArray<Any?>, offset: Number = 0): Date {
    val year = tryParseNumberAtIndex(d, 1 - offset) ?: Date().getFullYear()
    val month = (tryParseNumberAtIndex(d, 2 - offset) ?: 1) - 1
    val day = tryParseNumberAtIndex(d, 3 - offset) ?: 1
    val hour = tryParseNumberAtIndex(d, 4 - offset) ?: 0
    val minute = tryParseNumberAtIndex(d, 5 - offset) ?: 0
    val second = tryParseNumberAtIndex(d, 6 - offset) ?: 0
    val millisecond = (tryParseNumberAtIndex(d, 7 - offset) ?: 0).toString(10).substring(0, 3)
    return Date(year, month, day, hour, minute, second, parseInt(millisecond))
}
fun parseDate(cfg: DayutsConfig): Date? {
    val date = cfg.date
    if (date == null) {
        return Date()
    }
    if (date is Date) {
        return date as Date
    }
    try {
        if (UTSAndroid.`typeof`(date) == "string" && !UTSRegExp("Z\$", "i").test(date as String)) {
            val d = (date as String).match(REGEX_PARSE)
            val isNull = d == null || UTSArray.isArray(d) && d.length == 0
            if (!isNull) {
                return createDateFromArray(d as UTSArray<Any?>)
            }
        }
        if (UTSAndroid.`typeof`(date) == "string") {
            return Date(date as String)
        }
        if (UTSArray.isArray(date)) {
            return createDateFromArray(date as UTSArray<Any?>, 1)
        }
        if (isNumber__2(date)) {
            return Date(date as Number)
        }
        return null
    }
     catch (err: Throwable) {
        return null
    }
}
fun wrapper(date: Any, instance: Dayuts): Dayuts {
    return dayuts(date, instance.`$L`)
}
fun prettyUnit(u: String): DayutsUnit {
    val special = Map<String, String>(_uA(
        _uA(
            "M",
            M
        ),
        _uA(
            "y",
            Y
        ),
        _uA(
            "w",
            W
        ),
        _uA(
            "d",
            D
        ),
        _uA(
            "D",
            DATE
        ),
        _uA(
            "h",
            H
        ),
        _uA(
            "m",
            MIN
        ),
        _uA(
            "s",
            S
        ),
        _uA(
            "ms",
            MS
        ),
        _uA(
            "Q",
            Q
        )
    ))
    return (special.get(u) ?: ("" + u).toLowerCase().replace(UTSRegExp("s\$", ""), "")) as DayutsUnit
}
fun monthDiff(a: Dayuts, b: Dayuts): Number {
    if (a.date() < b.date()) {
        return -monthDiff(b, a)
    }
    val wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month())
    val anchor = a.clone().add(wholeMonthDiff, M).valueOf()
    val c = b.valueOf() - anchor < 0
    val anchor2 = a.clone().add(wholeMonthDiff + (if (c) {
        -1
    } else {
        1
    }
    ), M).valueOf()
    val decimalMonthDiff = (b.valueOf() - anchor) / (if (c) {
        (anchor - anchor2)
    } else {
        (anchor2 - anchor)
    }
    )
    val result = wholeMonthDiff + decimalMonthDiff
    val negatedResult = -result
    val absResult = +negatedResult
    val finalResult = if (!isNaN(absResult)) {
        absResult
    } else {
        0
    }
    return finalResult
}
fun absFloor(n: Number): Number {
    return if (n < 0) {
        Math.max(Math.ceil(n), 0)
    } else {
        Math.floor(n)
    }
}
open class Dayuts : IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("Dayuts", "uni_modules/lime-dayuts/common/index.uts", 104, 14)
    }
    open lateinit var `$L`: String
    private var valid: Boolean = true
    private var `$d`: Date = Date()
    private var `$y`: Number = 0
    private var `$M`: Number = 0
    private var `$D`: Number = 0
    private var `$W`: Number = 0
    private var `$H`: Number = 0
    private var `$m`: Number = 0
    private var `$s`: Number = 0
    private var `$ms`: Number = 0
    private var `$u`: Boolean = false
    constructor(cfg: DayutsConfig){
        this.`$L` = parseLocale(cfg.locale) ?: dayutsIntl.locale
        this.parse(cfg)
    }
    open fun parse(cfg: DayutsConfig) {
        val _d = parseDate(cfg)
        if (_d != null) {
            this.`$d` = parseDate(cfg)!!
            this.init()
        } else {
            this.valid = false
        }
    }
    open fun init() {
        val `$d` = this.`$d`
        this.`$y` = `$d`.getFullYear()
        this.`$M` = `$d`.getMonth()
        this.`$D` = `$d`.getDate()
        this.`$W` = `$d`.getDay()
        this.`$H` = `$d`.getHours()
        this.`$m` = `$d`.getMinutes()
        this.`$s` = `$d`.getSeconds()
        this.`$ms` = `$d`.getMilliseconds()
    }
    open fun isValid(): Boolean {
        return this.valid
    }
    open fun isSame(input: String): Boolean {
        return this.isSame(input as Any, "millisecond")
    }
    open fun isSame(input: Number): Boolean {
        return this.isSame(input as Any, "millisecond")
    }
    open fun isSame(input: Date): Boolean {
        return this.isSame(input as Any, "millisecond")
    }
    open fun isSame(input: Dayuts): Boolean {
        return this.isSame(input as Any, "millisecond")
    }
    open fun isSame(input: UTSJSONObject): Boolean {
        return this.isSame(input as Any, "millisecond")
    }
    open fun isSame(input: String, units: DayutsUnit): Boolean {
        return this.isSame(input as Any, units as DayutsUnit)
    }
    open fun isSame(input: Number, units: DayutsUnit): Boolean {
        return this.isSame(input as Any, units as DayutsUnit)
    }
    open fun isSame(input: Date, units: DayutsUnit): Boolean {
        return this.isSame(input as Any, units as DayutsUnit)
    }
    open fun isSame(input: Dayuts, units: DayutsUnit): Boolean {
        return this.isSame(input as Any, units as DayutsUnit)
    }
    open fun isSame(input: UTSJSONObject, units: DayutsUnit): Boolean {
        return this.isSame(input as Any, units as DayutsUnit)
    }
    open fun isSame(input: Any, units: DayutsUnit = "millisecond"): Boolean {
        val other = if (input is Dayuts) {
            input as Dayuts
        } else {
            dayuts(input)
        }
        val date1 = this.startOf(units).valueOf()
        val date2 = other.valueOf()
        val date3 = this.endOf(units).valueOf()
        return date1 <= date2 && date2 <= date3
    }
    open fun isAfter(input: String): Boolean {
        return this.isAfter(input as Any, "millisecond")
    }
    open fun isAfter(input: Number): Boolean {
        return this.isAfter(input as Any, "millisecond")
    }
    open fun isAfter(input: Date): Boolean {
        return this.isAfter(input as Any, "millisecond")
    }
    open fun isAfter(input: Dayuts): Boolean {
        return this.isAfter(input as Any, "millisecond")
    }
    open fun isAfter(input: UTSJSONObject): Boolean {
        return this.isAfter(input as Any, "millisecond")
    }
    open fun isAfter(input: String, units: DayutsUnit): Boolean {
        return this.isAfter(input as Any, units as DayutsUnit)
    }
    open fun isAfter(input: Number, units: DayutsUnit): Boolean {
        return this.isAfter(input as Any, units as DayutsUnit)
    }
    open fun isAfter(input: Date, units: DayutsUnit): Boolean {
        return this.isAfter(input as Any, units as DayutsUnit)
    }
    open fun isAfter(input: Dayuts, units: DayutsUnit): Boolean {
        return this.isAfter(input as Any, units as DayutsUnit)
    }
    open fun isAfter(input: UTSJSONObject, units: DayutsUnit): Boolean {
        return this.isAfter(input as Any, units as DayutsUnit)
    }
    open fun isAfter(input: Any, units: DayutsUnit = "millisecond"): Boolean {
        val other = if (input is Dayuts) {
            input as Dayuts
        } else {
            dayuts(input)
        }
        val date1 = other.valueOf()
        val date2 = this.startOf(units).valueOf()
        return date1 < date2
    }
    open fun isBefore(input: String): Boolean {
        return this.isBefore(input as Any, "millisecond")
    }
    open fun isBefore(input: Number): Boolean {
        return this.isBefore(input as Any, "millisecond")
    }
    open fun isBefore(input: Date): Boolean {
        return this.isBefore(input as Any, "millisecond")
    }
    open fun isBefore(input: Dayuts): Boolean {
        return this.isBefore(input as Any, "millisecond")
    }
    open fun isBefore(input: UTSJSONObject): Boolean {
        return this.isBefore(input as Any, "millisecond")
    }
    open fun isBefore(input: String, units: DayutsUnit): Boolean {
        return this.isBefore(input as Any, units as DayutsUnit)
    }
    open fun isBefore(input: Number, units: DayutsUnit): Boolean {
        return this.isBefore(input as Any, units as DayutsUnit)
    }
    open fun isBefore(input: Date, units: DayutsUnit): Boolean {
        return this.isBefore(input as Any, units as DayutsUnit)
    }
    open fun isBefore(input: Dayuts, units: DayutsUnit): Boolean {
        return this.isBefore(input as Any, units as DayutsUnit)
    }
    open fun isBefore(input: UTSJSONObject, units: DayutsUnit): Boolean {
        return this.isBefore(input as Any, units as DayutsUnit)
    }
    open fun isBefore(input: Any, units: DayutsUnit = "millisecond"): Boolean {
        val other = if (input is Dayuts) {
            input as Dayuts
        } else {
            dayuts(input)
        }
        val date1 = other.valueOf()
        val date2 = this.endOf(units).valueOf()
        return date2 < date1
    }
    open fun isSameOrBefore(input: String): Boolean {
        return this.isSameOrBefore(input as Any, "millisecond")
    }
    open fun isSameOrBefore(input: Number): Boolean {
        return this.isSameOrBefore(input as Any, "millisecond")
    }
    open fun isSameOrBefore(input: Date): Boolean {
        return this.isSameOrBefore(input as Any, "millisecond")
    }
    open fun isSameOrBefore(input: Dayuts): Boolean {
        return this.isSameOrBefore(input as Any, "millisecond")
    }
    open fun isSameOrBefore(input: UTSJSONObject): Boolean {
        return this.isSameOrBefore(input as Any, "millisecond")
    }
    open fun isSameOrBefore(input: String, units: DayutsUnit): Boolean {
        return this.isSameOrBefore(input as Any, units as DayutsUnit)
    }
    open fun isSameOrBefore(input: Number, units: DayutsUnit): Boolean {
        return this.isSameOrBefore(input as Any, units as DayutsUnit)
    }
    open fun isSameOrBefore(input: Date, units: DayutsUnit): Boolean {
        return this.isSameOrBefore(input as Any, units as DayutsUnit)
    }
    open fun isSameOrBefore(input: Dayuts, units: DayutsUnit): Boolean {
        return this.isSameOrBefore(input as Any, units as DayutsUnit)
    }
    open fun isSameOrBefore(input: UTSJSONObject, units: DayutsUnit): Boolean {
        return this.isSameOrBefore(input as Any, units as DayutsUnit)
    }
    open fun isSameOrBefore(input: Any, units: DayutsUnit = "millisecond"): Boolean {
        return this.isSame(input, units) || this.isBefore(input, units)
    }
    open fun isSameOrAfter(input: String): Boolean {
        return this.isSameOrAfter(input as Any, "millisecond")
    }
    open fun isSameOrAfter(input: Number): Boolean {
        return this.isSameOrAfter(input as Any, "millisecond")
    }
    open fun isSameOrAfter(input: Date): Boolean {
        return this.isSameOrAfter(input as Any, "millisecond")
    }
    open fun isSameOrAfter(input: Dayuts): Boolean {
        return this.isSameOrAfter(input as Any, "millisecond")
    }
    open fun isSameOrAfter(input: UTSJSONObject): Boolean {
        return this.isSameOrAfter(input as Any, "millisecond")
    }
    open fun isSameOrAfter(input: String, units: DayutsUnit): Boolean {
        return this.isSameOrAfter(input as Any, units as DayutsUnit)
    }
    open fun isSameOrAfter(input: Number, units: DayutsUnit): Boolean {
        return this.isSameOrAfter(input as Any, units as DayutsUnit)
    }
    open fun isSameOrAfter(input: Date, units: DayutsUnit): Boolean {
        return this.isSameOrAfter(input as Any, units as DayutsUnit)
    }
    open fun isSameOrAfter(input: Dayuts, units: DayutsUnit): Boolean {
        return this.isSameOrAfter(input as Any, units as DayutsUnit)
    }
    open fun isSameOrAfter(input: UTSJSONObject, units: DayutsUnit): Boolean {
        return this.isSameOrAfter(input as Any, units as DayutsUnit)
    }
    open fun isSameOrAfter(input: Any, units: DayutsUnit = "millisecond"): Boolean {
        return this.isSame(input, units) || this.isAfter(input, units)
    }
    open fun isBetween(input: Any, input2: Any, units: DayutsUnit = "millisecond", interval: String = "()"): Boolean {
        val dA = dayuts(input)
        val dB = dayuts(input2)
        val dAi = interval.startsWith("(")
        val dBi = interval.endsWith(")")
        return ((if (dAi) {
            this.isAfter(dA, units)
        } else {
            !this.isBefore(dA, units)
        }
        ) && (if (dBi) {
            this.isBefore(dB, units)
        } else {
            !this.isAfter(dB, units)
        }
        )) || ((if (dAi) {
            this.isBefore(dA, units)
        } else {
            !this.isAfter(dA, units)
        }
        ) && (if (dBi) {
            this.isAfter(dB, units)
        } else {
            !this.isBefore(dB, units)
        }
        ))
    }
    open fun isLeapYear(): Boolean {
        return ((this.`$y` % 4 == 0) && (this.`$y` % 100 != 0)) || (this.`$y` % 400 == 0)
    }
    open fun isToday(): Boolean {
        val comparisonTemplate = "YYYY-MM-DD"
        val now = dayuts()
        return this.format(comparisonTemplate) == now.format(comparisonTemplate)
    }
    open fun unix(): Number {
        return Math.floor(this.valueOf() / 1000)
    }
    open fun startOf(units: DayutsUnit, startOf: Boolean = true): Dayuts {
        val isStartOf = startOf
        val unit = prettyUnit(units)
        val instanceFactory = fun(d: Number, m: Number): Dayuts {
            val ins = dayuts(Date(this.`$y`, m, d))
            return if (isStartOf) {
                ins
            } else {
                ins.endOf(D)
            }
        }
        val instanceFactorySet = fun(method: String, slice: Number): Dayuts {
            val argumentStart: UTSArray<Number> = _uA(
                0,
                0,
                0,
                0
            )
            val argumentEnd: UTSArray<Number> = _uA(
                23,
                59,
                59,
                999
            )
            val args = (if (isStartOf) {
                argumentStart
            } else {
                argumentEnd
            }
            ).slice(slice)
            val date = this.toDate()
            if (method == "setHours") {
                date.setHours(args[0])
                date.setMinutes(args[1])
                date.setSeconds(args[2])
                date.setMilliseconds(args[3])
            } else if (method == "setMinutes") {
                date.setMinutes(args[0])
                date.setSeconds(args[1])
                date.setMilliseconds(args[2])
            } else if (method == "setSeconds") {
                date.setSeconds(args[0])
                date.setMilliseconds(args[1])
            } else if (method == "setMilliseconds") {
                date.setMilliseconds(args[0])
            }
            return dayuts(date)
        }
        val _this = this
        val `$W` = _this.`$W`
        val `$M` = _this.`$M`
        val `$D` = _this.`$D`
        val utcPad = "set" + (if (this.`$u`) {
            "UTC"
        } else {
            ""
        }
        )
        if (unit == Y) {
            return if (isStartOf) {
                instanceFactory(1, 0)
            } else {
                instanceFactory(31, 11)
            }
        } else if (unit == M) {
            return if (isStartOf) {
                instanceFactory(1, `$M`)
            } else {
                instanceFactory(0, `$M` + 1)
            }
        } else if (unit == W) {
            val weekStart = this.`$locale`().weekStart ?: 0
            val gap = (if (`$W` < weekStart) {
                `$W` + 7
            } else {
                `$W`
            }) - weekStart
            return instanceFactory(if (isStartOf) {
                `$D` - gap
            } else {
                `$D` + (6 - gap)
            }, `$M`)
        } else if (unit == D || unit == DATE) {
            return instanceFactorySet("" + utcPad + "Hours", 0)
        } else if (unit == H) {
            return instanceFactorySet("" + utcPad + "Minutes", 1)
        } else if (unit == MIN) {
            return instanceFactorySet("" + utcPad + "Seconds", 2)
        } else if (unit == S) {
            return instanceFactorySet("" + utcPad + "Milliseconds", 3)
        } else {
            return this.clone()
        }
    }
    open fun endOf(units: DayutsUnit): Dayuts {
        return this.startOf(units, false)
    }
    private fun `$set`(units: DayutsUnit, int: Number): Dayuts {
        val unit = prettyUnit(units)
        val arg = if (unit == D) {
            this.`$D` + (int - this.`$W`)
        } else {
            int
        }
        val setDateUnit = fun(date: Dayuts, unit: DayutsUnit, arg: Number){
            if (unit == D || unit == DATE) {
                date.`$d`.setDate(arg)
            } else if (unit == M) {
                date.`$d`.setMonth(arg)
            } else if (unit == Y) {
                date.`$d`.setFullYear(arg)
            } else if (unit == H) {
                date.`$d`.setHours(arg)
            } else if (unit == MIN) {
                date.`$d`.setMinutes(arg)
            } else if (unit == S) {
                date.`$d`.setSeconds(arg)
            } else if (unit == MS) {
                date.`$d`.setMilliseconds(arg)
            }
        }
        if (unit == M || unit == Y) {
            val date = this.clone().set(DATE, 1)
            setDateUnit(date, unit, arg)
            date.init()
            this.`$d` = date.set(DATE, Math.min(this.`$D`, date.daysInMonth())).`$d`
        } else {
            setDateUnit(this, unit, arg)
        }
        this.init()
        return this
    }
    open fun set(string: DayutsUnit, int: Number): Dayuts {
        return this.clone().`$set`(string, int)
    }
    open fun get(units: DayutsUnit): Number {
        val unit = prettyUnit(units)
        if (unit == D) {
            return this.day()
        } else if (unit == DATE) {
            return this.date()
        } else if (unit == M) {
            return this.month()
        } else if (unit == Y) {
            return this.year()
        } else if (unit == H) {
            return this.hour()
        } else if (unit == MIN) {
            return this.minute()
        } else if (unit == S) {
            return this.second()
        } else if (unit == MS) {
            return this.millisecond()
        }
        return 0
    }
    open fun year(): Number {
        return this.year(null) as Number
    }
    open fun year(input: Number): Dayuts {
        return this.year(input as Number?) as Dayuts
    }
    open fun year(input: Number? = null): Any {
        if (input == null) {
            return this.`$y`
        }
        return this.set(Y, input)
    }
    open fun month(): Number {
        return this.month(null) as Number
    }
    open fun month(input: Number): Dayuts {
        return this.month(input as Number?) as Dayuts
    }
    open fun month(input: Number? = null): Any {
        if (input == null) {
            return this.`$M`
        }
        return this.set(M, input)
    }
    open fun day(): Number {
        return this.day(null) as Number
    }
    open fun day(input: Number): Dayuts {
        return this.day(input as Number?) as Dayuts
    }
    open fun day(input: Number? = null): Any {
        if (input == null) {
            return this.`$W`
        }
        return this.set(D, input)
    }
    open fun date(): Number {
        return this.date(null) as Number
    }
    open fun date(input: Number): Dayuts {
        return this.date(input as Number?) as Dayuts
    }
    open fun date(input: Number? = null): Any {
        if (input == null) {
            return this.`$D`
        }
        return this.set(DATE, input)
    }
    open fun hour(): Number {
        return this.hour(null) as Number
    }
    open fun hour(input: Number): Dayuts {
        return this.hour(input as Number?) as Dayuts
    }
    open fun hour(input: Number? = null): Any {
        if (input == null) {
            return this.`$H`
        }
        return this.set(H, input)
    }
    open fun minute(): Number {
        return this.minute(null) as Number
    }
    open fun minute(input: Number): Dayuts {
        return this.minute(input as Number?) as Dayuts
    }
    open fun minute(input: Number? = null): Any {
        if (input == null) {
            return this.`$m`
        }
        return this.set(MIN, input)
    }
    open fun second(): Number {
        return this.second(null) as Number
    }
    open fun second(input: Number): Dayuts {
        return this.second(input as Number?) as Dayuts
    }
    open fun second(input: Number? = null): Any {
        if (input == null) {
            return this.`$s`
        }
        return this.set(S, input)
    }
    open fun millisecond(): Number {
        return this.millisecond(null) as Number
    }
    open fun millisecond(input: Number): Dayuts {
        return this.millisecond(input as Number?) as Dayuts
    }
    open fun millisecond(input: Number? = null): Any {
        if (input == null) {
            return this.`$ms`
        }
        return this.set(MS, input)
    }
    open fun add(number: Number, units: DayutsUnit): Dayuts {
        val unit = prettyUnit(units)
        val instanceFactorySet = fun(n: Number): Dayuts {
            val d = dayuts(this)
            return d.date(d.date() + Math.round(n * number))
        }
        if (unit == M) {
            return this.set(M, this.`$M` + number)
        }
        if (unit == Y) {
            return this.set(Y, this.`$y` + number)
        }
        if (unit == D) {
            return instanceFactorySet(1)
        }
        if (unit == W) {
            return instanceFactorySet(7)
        }
        val steps = Map<String, Number>(_uA(
            _uA(
                MIN,
                MILLISECONDS_A_MINUTE
            ),
            _uA(
                H,
                MILLISECONDS_A_HOUR
            ),
            _uA(
                S,
                MILLISECONDS_A_SECOND
            )
        ))
        val step = steps.get(unit) ?: 1
        val nextTimeStamp = this.`$d`.getTime() + (number * step)
        return wrapper(nextTimeStamp, this)
    }
    open fun subtract(number: Number, units: DayutsUnit): Dayuts {
        return this.add(number * -1, units)
    }
    open fun format(formatStr: String? = null): String {
        val locale = this.`$locale`()
        if (!this.isValid()) {
            return INVALID_DATE_STRING
        }
        val str = formatStr ?: FORMAT_DEFAULT
        val zoneStr = padZoneStr(this)
        val _this = this
        val `$H` = _this.`$H`
        val `$m` = _this.`$m`
        val `$M` = _this.`$M`
        val weekdays = locale.weekdays
        val months = locale.months
        val meridiem = locale.meridiem
        fun getShort(arr: UTSArray<String>?, index: Number, full: UTSArray<String> = _uA(), length: Number = 0): String {
            if (arr != null && arr.length >= index) {
                return arr[index]
            } else if (full.length >= index) {
                return full[index].slice(0, length)
            }
            return ""
        }
        val `get$H` = fun(num: Number): String {
            return padStart((if (`$H` % 12 == 0) {
                12
            } else {
                `$H` % 12
            }
            ).toString(10), num, "0")
        }
        val meridiemFunc = meridiem ?: (fun(hour: Number, _: Number, isLowercase: Boolean): String {
            val m = if (hour < 12) {
                "AM"
            } else {
                "PM"
            }
            return if (isLowercase) {
                m.toLowerCase()
            } else {
                m
            }
        }
        )
        return str.replace("YYYY", padStart(this.`$y`.toString(10), 4, "0")).replace("YY", this.`$y`.toString(10).slice(-2)).replace("MMMM", getShort(months, `$M`)).replace("MM", padStart((`$M` + 1).toString(10), 2, "0")).replace("M", (`$M` + 1).toString(10)).replace("DD", padStart(this.`$D`.toString(10), 2, "0")).replace("D", this.`$D`.toString(10)).replace("dddd", weekdays[this.`$W`]).replace("ddd", getShort(locale.weekdaysShort, this.`$W`, weekdays, 3)).replace("dd", getShort(locale.weekdaysMin, this.`$W`, weekdays, 2)).replace("d", this.`$W`.toString(10)).replace("HH", padStart(`$H`.toString(10), 2, "0")).replace("H", `$H`.toString(10)).replace("hh", `get$H`(2)).replace("h", `get$H`(1)).replace("mm", padStart(`$m`.toString(10), 2, "0")).replace("m", `$m`.toString(10)).replace("ss", padStart(this.`$s`.toString(10), 2, "0")).replace("s", this.`$s`.toString(10)).replace("SSS", padStart(this.`$ms`.toString(10), 3, "0")).replace("A", meridiemFunc(`$H`, `$m`, false)).replace("a", meridiemFunc(`$H`, `$m`, true)).replace("Z", zoneStr)
    }
    open fun utcOffset(): Number {
        return 0
    }
    open fun diff(input: String): Number {
        return this.diff(input as Any, "millisecond", false)
    }
    open fun diff(input: Number): Number {
        return this.diff(input as Any, "millisecond", false)
    }
    open fun diff(input: Date): Number {
        return this.diff(input as Any, "millisecond", false)
    }
    open fun diff(input: Dayuts): Number {
        return this.diff(input as Any, "millisecond", false)
    }
    open fun diff(input: UTSJSONObject): Number {
        return this.diff(input as Any, "millisecond", false)
    }
    open fun diff(input: String, units: DayutsUnit): Number {
        return this.diff(input as Any, units as DayutsUnit, false)
    }
    open fun diff(input: Number, units: DayutsUnit): Number {
        return this.diff(input as Any, units as DayutsUnit, false)
    }
    open fun diff(input: Date, units: DayutsUnit): Number {
        return this.diff(input as Any, units as DayutsUnit, false)
    }
    open fun diff(input: Dayuts, units: DayutsUnit): Number {
        return this.diff(input as Any, units as DayutsUnit, false)
    }
    open fun diff(input: UTSJSONObject, units: DayutsUnit): Number {
        return this.diff(input as Any, units as DayutsUnit, false)
    }
    open fun diff(input: String, units: DayutsUnit, float: Boolean): Number {
        return this.diff(input as Any, units as DayutsUnit, float as Boolean)
    }
    open fun diff(input: Number, units: DayutsUnit, float: Boolean): Number {
        return this.diff(input as Any, units as DayutsUnit, float as Boolean)
    }
    open fun diff(input: Date, units: DayutsUnit, float: Boolean): Number {
        return this.diff(input as Any, units as DayutsUnit, float as Boolean)
    }
    open fun diff(input: Dayuts, units: DayutsUnit, float: Boolean): Number {
        return this.diff(input as Any, units as DayutsUnit, float as Boolean)
    }
    open fun diff(input: UTSJSONObject, units: DayutsUnit, float: Boolean): Number {
        return this.diff(input as Any, units as DayutsUnit, float as Boolean)
    }
    open fun diff(input: Any, units: DayutsUnit = "millisecond", float: Boolean = false): Number {
        val unit = prettyUnit(units)
        val that = dayuts(input)
        val zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE
        val diff = this.valueOf() - that.valueOf()
        val getMonth = fun(): Number {
            return monthDiff(this, that)
        }
        var result: Number
        when (unit) {
            Y -> 
                result = getMonth() / 12
            M -> 
                result = getMonth()
            Q -> 
                result = getMonth() / 3
            W -> 
                result = (diff - zoneDelta) / MILLISECONDS_A_WEEK
            D -> 
                result = (diff - zoneDelta) / MILLISECONDS_A_DAY
            H -> 
                result = diff / MILLISECONDS_A_HOUR
            MIN -> 
                result = diff / MILLISECONDS_A_MINUTE
            S -> 
                result = diff / MILLISECONDS_A_SECOND
            else -> 
                result = diff
        }
        return if (float) {
            result
        } else {
            absFloor(result)
        }
    }
    open fun toDate(): Date {
        return Date(this.valueOf())
    }
    open fun toJSON(): String? {
        return if (this.isValid()) {
            this.toISOString()
        } else {
            null
        }
    }
    open fun toISOString(): String {
        return this.`$d`.toString()
    }
    open fun toObject(): DayutsObject {
        return DayutsObject(years = this.`$y`, months = this.`$M`, date = this.`$D`, hours = this.`$H`, minutes = this.`$m`, seconds = this.`$s`, milliseconds = this.`$ms`)
    }
    open fun toArray(): UTSArray<Number> {
        return _uA(
            this.`$y`,
            this.`$M`,
            this.`$D`,
            this.`$H`,
            this.`$m`,
            this.`$s`,
            this.`$ms`
        )
    }
    open fun valueOf(): Number {
        return this.`$d`.getTime()
    }
    open fun daysInMonth(): Number {
        return this.endOf(M).`$D`
    }
    private fun `$locale`(): DayutsLocale {
        return localeState.locales.get(this.`$L`)!!
    }
    open fun locale(preset: String, kObject: DayutsLocale): Dayuts {
        return this.locale(preset as Any, kObject as DayutsLocale?)
    }
    open fun locale(preset: DayutsLocale, kObject: DayutsLocale): Dayuts {
        return this.locale(preset as Any, kObject as DayutsLocale?)
    }
    open fun locale(preset: Any, kObject: DayutsLocale? = null): Dayuts {
        val that = this.clone()
        val nextLocaleName = parseLocale(preset, kObject, true)
        if (nextLocaleName != null) {
            that.`$L` = nextLocaleName
        }
        return that
    }
    open fun clone(): Dayuts {
        return wrapper(this.`$d`.getTime(), this)
    }
    override fun toString(): String {
        return this.`$d`.toString()
    }
    open fun dayOfYear(): Number {
        return this.dayOfYear(null) as Number
    }
    open fun dayOfYear(input: Number): Dayuts {
        return this.dayOfYear(input as Number?) as Dayuts
    }
    open fun dayOfYear(input: Number? = null): Any {
        val dayOfYear = Math.round((this.startOf("day").valueOf() - this.startOf("year").valueOf()) / 864e5) + 1
        return if (input == null) {
            dayOfYear
        } else {
            this.add(input - dayOfYear, "day")
        }
    }
    open fun fromToBase(input: String, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        return this.fromToBase(input as Any, withoutSuffix as Boolean, instance as Dayuts, isFrom as Boolean)
    }
    open fun fromToBase(input: Number, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        return this.fromToBase(input as Any, withoutSuffix as Boolean, instance as Dayuts, isFrom as Boolean)
    }
    open fun fromToBase(input: Date, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        return this.fromToBase(input as Any, withoutSuffix as Boolean, instance as Dayuts, isFrom as Boolean)
    }
    open fun fromToBase(input: Dayuts, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        return this.fromToBase(input as Any, withoutSuffix as Boolean, instance as Dayuts, isFrom as Boolean)
    }
    open fun fromToBase(input: UTSJSONObject, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        return this.fromToBase(input as Any, withoutSuffix as Boolean, instance as Dayuts, isFrom as Boolean)
    }
    open fun fromToBase(input: Any, withoutSuffix: Boolean, instance: Dayuts, isFrom: Boolean): String {
        val relObj = localeState.locales.get("en")?.relativeTime
        val loc = instance.`$locale`().relativeTime ?: relObj
        if (loc == null) {
            return ""
        }
        val T__1 = _uA(
            Threshold(l = "s", r = 44, d = S),
            Threshold(l = "m", r = 89),
            Threshold(l = "mm", r = 44, d = MIN),
            Threshold(l = "h", r = 89),
            Threshold(l = "hh", r = 21, d = H),
            Threshold(l = "d", r = 35),
            Threshold(l = "dd", r = 25, d = D),
            Threshold(l = "M", r = 45),
            Threshold(l = "MM", r = 10, d = M),
            Threshold(l = "y", r = 17),
            Threshold(l = "yy", d = Y)
        ) as UTSArray<Threshold>
        val Tl = T__1.length
        var result: Number = 0
        var out: String = ""
        var isFuture: Boolean = false
        run {
            var i: Number = 0
            while(i < Tl){
                var t = T__1[i]
                if (t.d != null) {
                    result = if (isFrom) {
                        dayuts(input).diff(instance, t.d!!, true)
                    } else {
                        instance.diff(input, t.d!!, true)
                    }
                }
                var abs = Math.round(Math.abs(result))
                isFuture = result > 0
                if (t.r == null || t.r != null && abs <= t.r!!) {
                    if (abs <= 1 && i > 0) {
                        t = T__1[i - 1]
                    }
                    val format = loc[t.l]
                    if (UTSAndroid.`typeof`(format) == "string") {
                        out = (format as String).replace("%d", abs.toString(10))
                    }
                    break
                }
                i += 1
            }
        }
        if (withoutSuffix) {
            return out
        }
        val pastOrFuture = if (isFuture) {
            loc.future
        } else {
            loc.past
        }
        return pastOrFuture.replace("%s", out)
    }
    open fun to(input: String): String {
        return this.to(input as Any, false)
    }
    open fun to(input: Number): String {
        return this.to(input as Any, false)
    }
    open fun to(input: Date): String {
        return this.to(input as Any, false)
    }
    open fun to(input: Dayuts): String {
        return this.to(input as Any, false)
    }
    open fun to(input: UTSJSONObject): String {
        return this.to(input as Any, false)
    }
    open fun to(input: String, withoutSuffix: Boolean): String {
        return this.to(input as Any, withoutSuffix as Boolean)
    }
    open fun to(input: Number, withoutSuffix: Boolean): String {
        return this.to(input as Any, withoutSuffix as Boolean)
    }
    open fun to(input: Date, withoutSuffix: Boolean): String {
        return this.to(input as Any, withoutSuffix as Boolean)
    }
    open fun to(input: Dayuts, withoutSuffix: Boolean): String {
        return this.to(input as Any, withoutSuffix as Boolean)
    }
    open fun to(input: UTSJSONObject, withoutSuffix: Boolean): String {
        return this.to(input as Any, withoutSuffix as Boolean)
    }
    open fun to(input: Any, withoutSuffix: Boolean = false): String {
        return this.fromToBase(input, withoutSuffix, this, true)
    }
    open fun from(input: String): String {
        return this.from(input as Any, false)
    }
    open fun from(input: Number): String {
        return this.from(input as Any, false)
    }
    open fun from(input: Date): String {
        return this.from(input as Any, false)
    }
    open fun from(input: Dayuts): String {
        return this.from(input as Any, false)
    }
    open fun from(input: UTSJSONObject): String {
        return this.from(input as Any, false)
    }
    open fun from(input: String, withoutSuffix: Boolean): String {
        return this.from(input as Any, withoutSuffix as Boolean)
    }
    open fun from(input: Number, withoutSuffix: Boolean): String {
        return this.from(input as Any, withoutSuffix as Boolean)
    }
    open fun from(input: Date, withoutSuffix: Boolean): String {
        return this.from(input as Any, withoutSuffix as Boolean)
    }
    open fun from(input: Dayuts, withoutSuffix: Boolean): String {
        return this.from(input as Any, withoutSuffix as Boolean)
    }
    open fun from(input: UTSJSONObject, withoutSuffix: Boolean): String {
        return this.from(input as Any, withoutSuffix as Boolean)
    }
    open fun from(input: Any, withoutSuffix: Boolean = false): String {
        return this.fromToBase(input, withoutSuffix, this, false)
    }
    open fun toNow(): String {
        return this.toNow(false)
    }
    open fun toNow(withoutSuffix: Boolean = false): String {
        return this.to(dayuts(), withoutSuffix)
    }
    open fun fromNow(): String {
        return this.fromNow(false)
    }
    open fun fromNow(withoutSuffix: Boolean = false): String {
        return this.from(dayuts(), withoutSuffix)
    }
}
fun dayuts(): Dayuts {
    return dayuts(null, null, null)
}
fun dayuts(date: String): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: UTSArray<Any>): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: Number): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: UTSJSONObject): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: Date): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: Dayuts): Dayuts {
    return dayuts(date as Any?, null, null)
}
fun dayuts(date: Any? = null, format: String? = null, locale: String? = null): Dayuts {
    if (date != null && date is Dayuts) {
        return (date as Dayuts).clone()
    }
    return Dayuts(DayutsConfig(date = date, format = format, locale = locale))
}
val GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePickerClass = CreateVueComponent(GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.inheritAttrs, inject = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.inject, props = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.props, propsNeedCastKeys = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.propsNeedCastKeys, emits = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.emits, components = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.components, styles = GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker.setup(props as GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker {
    return GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePicker(instance)
}
)
fun raf(fn: UniAnimationFrameCallback): Number {
    return raf(fn as Any)
}
fun raf(fn: UniAnimationFrameCallbackWithNoArgument): Number {
    return raf(fn as Any)
}
fun raf(fn: Any): Number {
    if (UTSAndroid.`typeof`(fn) == "UniAnimationFrameCallback") {
        return requestAnimationFrame(fn as UniAnimationFrameCallback)
    } else {
        return requestAnimationFrame(fn as UniAnimationFrameCallbackWithNoArgument)
    }
}
fun doubleRaf(fn: UniAnimationFrameCallback): Unit {
    return doubleRaf(fn as Any)
}
fun doubleRaf(fn: UniAnimationFrameCallbackWithNoArgument): Unit {
    return doubleRaf(fn as Any)
}
fun doubleRaf(fn: Any): Unit {
    raf(fun(): Number {
        return raf(fn)
    }
    )
}
typealias TransitionEmitStatus = String
typealias TransitionStatus = String
open class UseTransitionOptions (
    open var element: Ref<UniElement?>? = null,
    open var enterClass: String? = null,
    open var enterActiveClass: String? = null,
    open var enterToClass: String? = null,
    open var leaveClass: String? = null,
    open var leaveActiveClass: String? = null,
    open var leaveToClass: String? = null,
    open var appear: Boolean? = null,
    open var defaultName: String? = null,
    open var name: (() -> String)? = null,
    open var visible: (() -> Boolean)? = null,
    open var emits: ((name: TransitionEmitStatus) -> Unit)? = null,
    open var onNextTick: ((name: TransitionEmitStatus) -> UTSPromise<Unit>)? = null,
    open var duration: Number? = null,
    open var removeClasses: Boolean? = null,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UseTransitionOptions", "uni_modules/lime-transition/index.uts", 5, 13)
    }
}
typealias ClassNameMap = Map<String, String>
open class UseTransitionReturn (
    @JsonNotNull
    open var state: Ref<Boolean>,
    @JsonNotNull
    open var display: Ref<Boolean>,
    @JsonNotNull
    open var inited: Ref<Boolean>,
    @JsonNotNull
    open var classes: Ref<String>,
    @JsonNotNull
    open var name: Ref<String>,
    open var finished: () -> Unit,
    open var toggle: (v: Boolean) -> Unit,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UseTransitionReturn", "uni_modules/lime-transition/index.uts", 23, 13)
    }
}
fun useTransition(options: UseTransitionOptions): UseTransitionReturn {
    val state = ref(false)
    val display = ref(false)
    val inited = ref(false)
    val classes = ref("")
    val name = ref(options.defaultName ?: "fade")
    val enterClass = options.enterClass ?: ""
    val enterActiveClass = options.enterActiveClass ?: ""
    val enterToClass = options.enterToClass ?: ""
    val leaveActiveClass = options.leaveActiveClass ?: ""
    val leaveToClass = options.leaveToClass ?: ""
    val leaveClass = options.leaveClass ?: ""
    val appear = options.appear ?: false
    val duration = options.duration ?: 300
    var status: TransitionStatus = ""
    var isTransitionEnd = false
    var isTransitioning = false
    var timeoutId: Number = -1
    var finishTimeoutId: Number = -1
    val emitEvent = fun(event: TransitionEmitStatus){
        options.emits?.invoke(event)
    }
    val finished = fun(){
        if (isTransitionEnd) {
            return
        }
        isTransitionEnd = true
        clearTimeout(finishTimeoutId)
        if (options.removeClasses ?: false) {
            classes.value = ""
        }
        emitEvent("after-" + status)
        if (display.value && !state.value) {
            display.value = false
        }
    }
    val sleep = fun(): UTSPromise<Unit> {
        return UTSPromise(fun(resolve, _reject){
            nextTick(fun(){
                raf(fun(){
                    if (options.element?.value != null) {
                        options.element?.value?.getBoundingClientRectAsync()?.then(fun(res){
                            resolve(Unit)
                        })
                    } else {
                        resolve(Unit)
                    }
                }
                )
            }
            )
        }
        )
    }
    val getClassNames = fun(name: String): ClassNameMap {
        return Map<String, String>(_uA(
            _uA(
                "enter",
                "l-" + name + "-enter l-" + name + "-enter-active " + enterClass + " " + enterActiveClass
            ),
            _uA(
                "enter-to",
                "l-" + name + "-enter-to l-" + name + "-enter-active " + enterToClass + " " + enterActiveClass
            ),
            _uA(
                "leave",
                "l-" + name + "-leave l-" + name + "-leave-active " + leaveClass + " " + leaveActiveClass
            ),
            _uA(
                "leave-to",
                "l-" + name + "-leave-to l-" + name + "-leave-active " + leaveToClass + " " + leaveActiveClass
            )
        ))
    }
    val transitionQueue = ref(_uA<TransitionStatus>())
    val performTransition = fun(newStatus: TransitionStatus, eventName: TransitionStatus): UTSPromise<Unit> {
        return wrapUTSPromise(suspend w1@{
                if (status == newStatus) {
                    return@w1
                }
                transitionQueue.value.push(newStatus)
                if (isTransitioning) {
                    return@w1
                }
                isTransitioning = true
                isTransitionEnd = true
                while(transitionQueue.value.length > 0){
                    val currentStatus = transitionQueue.value.shift()!!
                    status = currentStatus
                    emitEvent("before-" + eventName)
                    await(sleep())
                    await(sleep())
                    await(sleep())
                    await(sleep())
                    await(sleep())
                    if (status != currentStatus) {
                        continue
                    }
                    val classNames = getClassNames(name.value)
                    inited.value = true
                    display.value = true
                    classes.value = classNames.get(eventName)!!
                    emitEvent(eventName)
                    val executeAfterTick = options.onNextTick?.invoke(eventName)
                    if (executeAfterTick != null) {
                        await(executeAfterTick)
                    }
                    await(sleep())
                    if (status != currentStatus) {
                        continue
                    }
                    classes.value = classNames.get("" + eventName + "-to")!!
                    if (status == "leave") {
                        setTimeout(fun(){
                            finished()
                        }
                        , duration)
                    }
                }
                clearTimeout(timeoutId)
                timeoutId = setTimeout(fun(){
                    if (transitionQueue.value.length == 0 && status == newStatus) {
                        isTransitionEnd = false
                    }
                }
                , duration * 0.8)
                isTransitioning = false
        })
    }
    val enter = fun(){
        performTransition("enter", "enter")
    }
    val leave = fun(){
        performTransition("leave", "leave")
    }
    var init = false
    var lastState: Boolean? = null
    watchEffect(fun(){
        if (options.visible == null) {
            return
        }
        state.value = options.visible!!()
        if (lastState == state.value) {
            return
        }
        lastState = state.value
        if (!appear && !init) {
            init = true
            return
        }
        if (state.value) {
            enter()
        } else {
            leave()
        }
    }
    )
    watchEffect(fun(){
        if (options.name == null) {
            return
        }
        name.value = options.name!!()
    }
    )
    val toggle = fun(v: Boolean){
        state.value = v
        if (v) {
            enter()
        } else {
            leave()
        }
    }
    return UseTransitionReturn(state = state, inited = inited, display = display, classes = classes, name = name, finished = finished, toggle = toggle)
}
interface OverlayProps {
    var ariaLabel: String
    var ariaRole: String
    var lClass: String?
    var bgColor: String?
    var lStyle: Any?
    var duration: Number
    var preventScrollThrough: Boolean
    var visible: Boolean
    var zIndex: Number
}
val GenUniModulesLimeOverlayComponentsLOverlayLOverlayClass = CreateVueComponent(GenUniModulesLimeOverlayComponentsLOverlayLOverlay::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.inheritAttrs, inject = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.inject, props = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.props, propsNeedCastKeys = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.propsNeedCastKeys, emits = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.emits, components = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.components, styles = GenUniModulesLimeOverlayComponentsLOverlayLOverlay.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesLimeOverlayComponentsLOverlayLOverlay.setup(props as GenUniModulesLimeOverlayComponentsLOverlayLOverlay)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimeOverlayComponentsLOverlayLOverlay {
    return GenUniModulesLimeOverlayComponentsLOverlayLOverlay(instance)
}
)
fun isDef(value: Any?): Boolean {
    return value != null
}
fun addUnit(value: String): String? {
    return addUnit(value as Any?)
}
fun addUnit(value: Number): String? {
    return addUnit(value as Any?)
}
fun addUnit(reassignedValue: Any?): String? {
    var value = reassignedValue
    if (!isDef(value)) {
        return null
    }
    value = "" + value
    return if (isNumeric(value)) {
        "" + value as String + "px"
    } else {
        value as String
    }
}
fun convertRadius(radius: Any): UTSArray<String> {
    if (UTSArray.isArray(radius)) {
        val values = (radius as UTSArray<Any>).map(fun(item): String? {
            return addUnit(item)
        }
        )
        if (values.length == 1) {
            return _uA(
                values[0]!!,
                values[0]!!,
                values[0]!!,
                values[0]!!
            )
        }
        if (values.length == 2) {
            return _uA(
                values[0]!!,
                values[1]!!,
                values[0]!!,
                values[1]!!
            )
        }
        if (values.length == 3) {
            return _uA(
                values[0]!!,
                values[1]!!,
                values[2]!!,
                values[1]!!
            )
        }
        if (values.length == 4) {
            return _uA(
                values[0]!!,
                values[1]!!,
                values[2]!!,
                values[3]!!
            )
        }
        return _uA(
            "0",
            "0",
            "0",
            "0"
        )
    }
    val value = addUnit(radius) ?: "0"
    return _uA(
        value,
        value,
        value,
        value
    )
}
interface PopupProps {
    var closeable: Boolean
    var closeOnClickOverlay: Boolean
    var destroyOnClose: Boolean
    var overlayStyle: Any?
    var position: String
    var preventScrollThrough: Boolean
    var overlay: Boolean
    var transitionName: String?
    var visible: Boolean?
    var zIndex: Number
    var duration: Number
    var bgColor: String?
    var closeIcon: String
    var iconColor: String?
    var lStyle: Any?
    var safeAreaInsetBottom: Boolean
    var safeAreaInsetTop: Boolean
    var radius: Any?
}
val GenUniModulesLimePopupComponentsLPopupLPopupClass = CreateVueComponent(GenUniModulesLimePopupComponentsLPopupLPopup::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "component", name = "", inheritAttrs = GenUniModulesLimePopupComponentsLPopupLPopup.inheritAttrs, inject = GenUniModulesLimePopupComponentsLPopupLPopup.inject, props = GenUniModulesLimePopupComponentsLPopupLPopup.props, propsNeedCastKeys = GenUniModulesLimePopupComponentsLPopupLPopup.propsNeedCastKeys, emits = GenUniModulesLimePopupComponentsLPopupLPopup.emits, components = GenUniModulesLimePopupComponentsLPopupLPopup.components, styles = GenUniModulesLimePopupComponentsLPopupLPopup.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesLimePopupComponentsLPopupLPopup.setup(props as GenUniModulesLimePopupComponentsLPopupLPopup)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimePopupComponentsLPopupLPopup {
    return GenUniModulesLimePopupComponentsLPopupLPopup(instance)
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("TrackPoint", "pages/playBack/playBack.uvue", 66, 7)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("TrackBounds", "pages/playBack/playBack.uvue", 74, 7)
    }
}
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
open class ActionSheetItem (
    @JsonNotNull
    open var label: String,
    open var color: String? = null,
    @JsonNotNull
    open var disabled: Boolean = false,
    open var icon: String? = null,
    open var iconColor: String? = null,
    open var bgColor: String? = null,
    open var fontSize: String? = null,
    open var radius: String? = null,
    @JsonNotNull
    open var __index: Number,
    @JsonNotNull
    open var __isImage: Boolean = false,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("ActionSheetItem", "uni_modules/lime-action-sheet/components/l-action-sheet/type.uts", 2, 13)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return ActionSheetItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class ActionSheetItemReactiveObject : ActionSheetItem, IUTSReactive<ActionSheetItem> {
    override var __v_raw: ActionSheetItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: ActionSheetItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(label = __v_raw.label, color = __v_raw.color, disabled = __v_raw.disabled, icon = __v_raw.icon, iconColor = __v_raw.iconColor, bgColor = __v_raw.bgColor, fontSize = __v_raw.fontSize, radius = __v_raw.radius, __index = __v_raw.__index, __isImage = __v_raw.__isImage) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): ActionSheetItemReactiveObject {
        return ActionSheetItemReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
    override var color: String?
        get() {
            return _tRG(__v_raw, "color", __v_raw.color, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("color")) {
                return
            }
            val oldValue = __v_raw.color
            __v_raw.color = value
            _tRS(__v_raw, "color", oldValue, value)
        }
    override var disabled: Boolean
        get() {
            return _tRG(__v_raw, "disabled", __v_raw.disabled, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("disabled")) {
                return
            }
            val oldValue = __v_raw.disabled
            __v_raw.disabled = value
            _tRS(__v_raw, "disabled", oldValue, value)
        }
    override var icon: String?
        get() {
            return _tRG(__v_raw, "icon", __v_raw.icon, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("icon")) {
                return
            }
            val oldValue = __v_raw.icon
            __v_raw.icon = value
            _tRS(__v_raw, "icon", oldValue, value)
        }
    override var iconColor: String?
        get() {
            return _tRG(__v_raw, "iconColor", __v_raw.iconColor, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("iconColor")) {
                return
            }
            val oldValue = __v_raw.iconColor
            __v_raw.iconColor = value
            _tRS(__v_raw, "iconColor", oldValue, value)
        }
    override var bgColor: String?
        get() {
            return _tRG(__v_raw, "bgColor", __v_raw.bgColor, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("bgColor")) {
                return
            }
            val oldValue = __v_raw.bgColor
            __v_raw.bgColor = value
            _tRS(__v_raw, "bgColor", oldValue, value)
        }
    override var fontSize: String?
        get() {
            return _tRG(__v_raw, "fontSize", __v_raw.fontSize, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("fontSize")) {
                return
            }
            val oldValue = __v_raw.fontSize
            __v_raw.fontSize = value
            _tRS(__v_raw, "fontSize", oldValue, value)
        }
    override var radius: String?
        get() {
            return _tRG(__v_raw, "radius", __v_raw.radius, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("radius")) {
                return
            }
            val oldValue = __v_raw.radius
            __v_raw.radius = value
            _tRS(__v_raw, "radius", oldValue, value)
        }
    override var __index: Number
        get() {
            return _tRG(__v_raw, "__index", __v_raw.__index, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("__index")) {
                return
            }
            val oldValue = __v_raw.__index
            __v_raw.__index = value
            _tRS(__v_raw, "__index", oldValue, value)
        }
    override var __isImage: Boolean
        get() {
            return _tRG(__v_raw, "__isImage", __v_raw.__isImage, __v_isReadonly, __v_isShallow)
        }
        set(value) {
            if (!__v_canSet("__isImage")) {
                return
            }
            val oldValue = __v_raw.__isImage
            __v_raw.__isImage = value
            _tRS(__v_raw, "__isImage", oldValue, value)
        }
}
val GenUniModulesLimeActionSheetPagesIndexClass = CreateVueComponent(GenUniModulesLimeActionSheetPagesIndex::class.java, fun(): VueComponentOptions {
    return VueComponentOptions(type = "page", name = "", inheritAttrs = GenUniModulesLimeActionSheetPagesIndex.inheritAttrs, inject = GenUniModulesLimeActionSheetPagesIndex.inject, props = GenUniModulesLimeActionSheetPagesIndex.props, propsNeedCastKeys = GenUniModulesLimeActionSheetPagesIndex.propsNeedCastKeys, emits = GenUniModulesLimeActionSheetPagesIndex.emits, components = GenUniModulesLimeActionSheetPagesIndex.components, styles = GenUniModulesLimeActionSheetPagesIndex.styles, setup = fun(props: ComponentPublicInstance): Any? {
        return GenUniModulesLimeActionSheetPagesIndex.setup(props as GenUniModulesLimeActionSheetPagesIndex)
    }
    )
}
, fun(instance, renderer): GenUniModulesLimeActionSheetPagesIndex {
    return GenUniModulesLimeActionSheetPagesIndex(instance, renderer)
}
)
open class CoordinatePoint (
    @JsonNotNull
    open var latitude: Number,
    @JsonNotNull
    open var longitude: Number,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CoordinatePoint", "pages/vehicleTracking/vehicleTracking.uvue", 43, 7)
    }
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("AnimationQueueItem", "pages/vehicleTracking/vehicleTracking.uvue", 48, 7)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return AnimationQueueItemReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class AnimationQueueItemReactiveObject : AnimationQueueItem, IUTSReactive<AnimationQueueItem> {
    override var __v_raw: AnimationQueueItem
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: AnimationQueueItem, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(position = __v_raw.position, rotation = __v_raw.rotation, speed = __v_raw.speed, address = __v_raw.address, connectionStatus = __v_raw.connectionStatus) {
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("GroupType", "pages/mileageRecord/mileageRecord.uvue", 76, 7)
    }
}
open class DateTripGroup (
    @JsonNotNull
    open var date: String,
    @JsonNotNull
    open var trips: UTSArray<UTSJSONObject>,
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DateTripGroup", "pages/mileageRecord/mileageRecord.uvue", 77, 7)
    }
}
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UserInfo", "pages/userCenter/userInfo/userInfo.uvue", 55, 7)
    }
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
open class UserInfo__1 (
    @JsonNotNull
    open var id: String,
    @JsonNotNull
    open var mobile: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("UserInfo", "pages/userCenter/editPassword/editPassword.uvue", 33, 7)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return UserInfo__1ReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class UserInfo__1ReactiveObject : UserInfo__1, IUTSReactive<UserInfo__1> {
    override var __v_raw: UserInfo__1
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: UserInfo__1, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(id = __v_raw.id, mobile = __v_raw.mobile) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UserInfo__1ReactiveObject {
        return UserInfo__1ReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
}
open class FormInstance (
    open var validate: () -> Boolean,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("FormInstance", "pages/userCenter/editPassword/editPassword.uvue", 37, 7)
    }
    override fun __v_create(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): UTSReactiveObject {
        return FormInstanceReactiveObject(this, __v_isReadonly, __v_isShallow, __v_skip)
    }
}
class FormInstanceReactiveObject : FormInstance, IUTSReactive<FormInstance> {
    override var __v_raw: FormInstance
    override var __v_isReadonly: Boolean
    override var __v_isShallow: Boolean
    override var __v_skip: Boolean
    constructor(__v_raw: FormInstance, __v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean) : super(validate = __v_raw.validate) {
        this.__v_raw = __v_raw
        this.__v_isReadonly = __v_isReadonly
        this.__v_isShallow = __v_isShallow
        this.__v_skip = __v_skip
    }
    override fun __v_clone(__v_isReadonly: Boolean, __v_isShallow: Boolean, __v_skip: Boolean): FormInstanceReactiveObject {
        return FormInstanceReactiveObject(this.__v_raw, __v_isReadonly, __v_isShallow, __v_skip)
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("VehicleEditInfo", "pages/userCenter/carDetail/carDetail.uvue", 59, 7)
    }
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("PaginationState", "pages/geofencing/geofencing.uvue", 179, 7)
    }
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("Pagination", "pages/geofencing/geofencing.uvue", 185, 7)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CircleData", "pages/geofencing/geofencing.uvue", 189, 7)
    }
}
open class FenceForm (
    @JsonNotNull
    open var name: String,
    @JsonNotNull
    open var alarmType: String,
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("FenceForm", "pages/geofencing/geofencing.uvue", 197, 7)
    }
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
) : UTSObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("CoordinateBounds", "pages/geofencing/geofencing.uvue", 666, 7)
    }
}
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
) : UTSReactiveObject(), IUTSSourceMap {
    override fun `__$getOriginalPosition`(): UTSSourceMapPosition? {
        return UTSSourceMapPosition("DeviceItem", "utils/device.uts", 1, 13)
    }
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
    definePageRoutes()
    defineAppConfig()
    (createApp()["app"] as VueApp).mount(app, GenUniApp())
}
open class UniAppConfig : io.dcloud.uniapp.appframe.AppConfig {
    override var name: String = "carConnectInternet"
    override var appid: String = "__UNI__662B0B4"
    override var versionName: String = "1.0.0"
    override var versionCode: String = "100"
    override var uniCompilerVersion: String = "5.21"
    constructor() : super() {}
}
fun definePageRoutes() {
    __uniRoutes.push(UniPageRoute(path = "pages/index/index", component = GenPagesIndexIndexClass, meta = UniPageMeta(isQuit = true), style = _uM("navigationBarTitleText" to "车联网")))
    __uniRoutes.push(UniPageRoute(path = "pages/message/message", component = GenPagesMessageMessageClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "消息")))
    __uniRoutes.push(UniPageRoute(path = "pages/userCenter/userCenter", component = GenPagesUserCenterUserCenterClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "我的")))
    __uniRoutes.push(UniPageRoute(path = "pages/login/login", component = GenPagesLoginLoginClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "登陆")))
    __uniRoutes.push(UniPageRoute(path = "pages/carInfoDetail/carInfoDetail", component = GenPagesCarInfoDetailCarInfoDetailClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "车辆详情")))
    __uniRoutes.push(UniPageRoute(path = "pages/addCar/addCar", component = GenPagesAddCarAddCarClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "添加车辆")))
    __uniRoutes.push(UniPageRoute(path = "pages/playBack/playBack", component = GenPagesPlayBackPlayBackClass, meta = UniPageMeta(isQuit = false), style = _uM("navigationBarTitleText" to "轨迹回放")))
    __uniRoutes.push(UniPageRoute(path = "uni_modules/lime-action-sheet/pages/index", component = GenUniModulesLimeActionSheetPagesIndexClass, meta = UniPageMeta(isQuit = false), style = _uM()))
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
