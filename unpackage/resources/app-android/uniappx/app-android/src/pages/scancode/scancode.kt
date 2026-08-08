@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
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
import kotlin.properties.Delegates
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
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
            val cameraVisible = ref(true)
            val hasFinished = ref(false)
            val pendingBack = ref(false)
            var backTimer: Number? = null
            val clearBackTimer = fun(){
                val timer = backTimer
                if (timer != null) {
                    clearTimeout(timer)
                    backTimer = null
                }
            }
            val releaseCamera = fun(){
                cameraVisible.value = false
            }
            val completeBack = fun(){
                if (!pendingBack.value) {
                    return
                }
                pendingBack.value = false
                clearBackTimer()
                console.log("扫码页已释放相机，返回添加设备页")
                uni_navigateBack(NavigateBackOptions(delta = 1))
            }
            val requestBack = fun(){
                if (pendingBack.value) {
                    return
                }
                pendingBack.value = true
                releaseCamera()
                backTimer = setTimeout(fun(){
                    completeBack()
                }
                , 1200)
            }
            val handleCameraInitDone = fun(){
                console.log("扫码摄像头初始化完成")
            }
            val handleScan = fun(e: UniCameraScanCodeEvent){
                if (hasFinished.value || !scanFunctionIsUseable.value) {
                    return
                }
                val scanResult = e.detail.result
                if (scanResult == null) {
                    return
                }
                val result = scanResult!!!!
                if (result.length == 0) {
                    return
                }
                hasFinished.value = true
                scanFunctionIsUseable.value = false
                uni_vibrateLong(VibrateLongOptions())
                console.log("扫码结果:", result)
                uni_setStorageSync("scanCodeResult", result)
                showAppToast(ShowToastOptions(title = "扫码成功", icon = "success", duration = 500))
                requestBack()
            }
            val handleCameraStop = fun(){
                console.warn("扫码摄像头已停止")
                if (pendingBack.value) {
                    console.log("等待相机资源释放完成后返回添加设备页")
                    return
                }
                console.warn("摄像头停止但扫码页仍保持打开，等待用户返回或重试")
            }
            val handleCameraError = fun(e: UniCameraErrorEvent){
                if (hasFinished.value) {
                    return
                }
                hasFinished.value = true
                console.error("摄像头初始化失败:", e.detail)
                showAppToast(ShowToastOptions(title = "摄像头初始化失败，请检查相机权限", icon = "none", duration = 500))
                requestBack()
            }
            onHide(fun(){
                console.log("扫码页隐藏")
                releaseCamera()
            }
            )
            onUnload(fun(){
                console.log("扫码页卸载")
                clearBackTimer()
                releaseCamera()
            }
            )
            return fun(): Any? {
                val _component_camera = resolveComponent("camera")
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cE("view", _uM("class" to "scancode-box"), _uA(
                        if (isTrue(cameraVisible.value)) {
                            _cV(_component_camera, _uM("key" to 0, "device-position" to "back", "mode" to "scanCode", "flash" to "auto", "class" to "scan-code", "resolution" to "high", "onInitdone" to handleCameraInitDone, "onScancode" to handleScan, "onStop" to handleCameraStop, "onError" to handleCameraError))
                        } else {
                            _cC("v-if", true)
                        }
                    )),
                    _cE("view", _uM("class" to "tip"), "请将设备二维码或条形码放入框内，自动扫描"),
                    _cV(_component_app_toast)
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
                return _uM("container" to _pS(_uM("height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#000000")), "scancode-box" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minHeight" to 0, "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0)), "scan-code" to _pS(_uM("width" to "100%", "height" to "100%")), "tip" to _pS(_uM("position" to "fixed", "bottom" to "100rpx", "left" to 0, "right" to 0, "textAlign" to "center", "color" to "#ffffff", "fontSize" to "28rpx", "backgroundColor" to "rgba(0,0,0,0.5)", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
