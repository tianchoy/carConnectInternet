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
import kotlin.properties.Delegates
import io.dcloud.uniapp.extapi.`$emit` as uni__emit
import io.dcloud.uniapp.extapi.authorize as uni_authorize
import io.dcloud.uniapp.extapi.getSetting as uni_getSetting
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.openSetting as uni_openSetting
import io.dcloud.uniapp.extapi.showModal as uni_showModal
import io.dcloud.uniapp.extapi.showToast as uni_showToast
import io.dcloud.uniapp.extapi.vibrateLong as uni_vibrateLong
open class GenPagesScancodeScancode : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesScancodeScancode) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesScancodeScancode
            val _cache = __ins.renderCache
            val scanFunctionIsUseable = ref(true)
            val handleScan = fun(e: Any){
                if (scanFunctionIsUseable.value && isTruthy(e.detail.result)) {
                    uni_vibrateLong()
                    scanFunctionIsUseable.value = false
                    val scanResult = e.detail.result
                    console.log("扫码结果:", scanResult, " at pages/scancode/scancode.uvue:23")
                    val pages = getCurrentPages()
                    if (pages.length >= 2) {
                        val prevPage = pages[pages.length - 2]
                        if (prevPage != null && isTruthy(prevPage.carInfo)) {
                            prevPage.carInfo.imei = scanResult
                            console.log("已设置上一页面IMEI:", scanResult, " at pages/scancode/scancode.uvue:33")
                        } else {
                            uni__emit("scanCodeResult", _uO("result" to scanResult))
                        }
                    }
                    uni_showToast(ShowToastOptions(title = "扫码成功", icon = "success", duration = 1000))
                    setTimeout(fun(){
                        uni_navigateBack(NavigateBackOptions(delta = 1))
                    }
                    , 1000)
                }
            }
            val error = fun(e: Any){
                console.log("摄像头错误:", e, " at pages/scancode/scancode.uvue:56")
                uni_showToast(ShowToastOptions(title = "摄像头初始化失败", icon = "none"))
            }
            val requestCameraPermission = fun(){
                uni_getSetting(GetSettingOptions(success = fun(res){
                    if (isTruthy(res.authSetting["scope.camera"])) {
                        console.log("已有摄像头权限", " at pages/scancode/scancode.uvue:67")
                        return
                    }
                    uni_authorize(AuthorizeOptions(scope = "scope.camera", success = fun(_){
                        console.log("摄像头权限授权成功", " at pages/scancode/scancode.uvue:74")
                    }
                    , fail = fun(_){
                        uni_showModal(ShowModalOptions(title = "权限提示", content = "需要摄像头权限才能扫码，是否去设置开启？", success = fun(modalRes){
                            if (modalRes.confirm) {
                                uni_openSetting()
                            } else {
                                uni_navigateBack(null)
                            }
                        }
                        ))
                    }
                    ))
                }
                ))
            }
            onLoad(fun(_options){
                requestCameraPermission()
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_camera = resolveComponent("camera")
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "扫码添加ID", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "scancode-box"), _uA(
                        _cV(_component_camera, _uM("device-position" to "back", "mode" to "scanCode", "flash" to "off", "onScancode" to handleScan, "onError" to error, "class" to "scan-code"))
                    )),
                    _cE("view", _uM("class" to "tip"), "请将IMEI码放入框内,自动扫描")
                ))
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("container" to _pS(_uM("display" to "flex", "flexDirection" to "column", "backgroundColor" to "#000000")), "scancode-box" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0)), "scan-code" to _pS(_uM("width" to "100%", "height" to "100%")), "tip" to _pS(_uM("position" to "fixed", "bottom" to "100rpx", "left" to 0, "right" to 0, "textAlign" to "center", "color" to "#ffffff", "fontSize" to "28rpx", "backgroundColor" to "rgba(0,0,0,0.5)", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
