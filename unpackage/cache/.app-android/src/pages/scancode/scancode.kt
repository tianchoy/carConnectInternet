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
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.scanCode as uni_scanCode
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesScancodeScancode : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesScancodeScancode) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesScancodeScancode
            val _cache = __ins.renderCache
            val scanFunctionIsUseable = ref(true)
            val goBack = fun(){
                uni_navigateBack(NavigateBackOptions(delta = 1))
            }
            val handleScanResult = fun(scanResult: String){
                if (!scanFunctionIsUseable.value || scanResult.length == 0) {
                    return
                }
                scanFunctionIsUseable.value = false
                console.log("扫码结果:", scanResult, " at pages/scancode/scancode.uvue:17")
                uni_setStorageSync("scanCodeResult", scanResult)
                uni__emit("scanCodeResult", _uO("result" to scanResult))
                uni_showToast(ShowToastOptions(title = "扫码成功", icon = "success", duration = 1000))
                setTimeout(fun(){
                    uni_navigateBack(NavigateBackOptions(delta = 1))
                }
                , 1000)
            }
            val startScan = fun(){
                if (!scanFunctionIsUseable.value) {
                    return
                }
                uni_scanCode(ScanCodeOptions(onlyFromCamera = true, success = fun(res){
                    console.log("扫码成功res:", res, " at pages/scancode/scancode.uvue:35")
                    val result = res.result
                    if (result != null) {
                        handleScanResult(result)
                    }
                }
                , fail = fun(err){
                    console.log("扫码失败:", err, " at pages/scancode/scancode.uvue:40")
                    uni_showToast(ShowToastOptions(title = "扫码失败", icon = "none"))
                    goBack()
                }
                ))
            }
            onLoad(fun(_options){
                startScan()
            }
            )
            return fun(): Any? {
                return _cE("view")
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("container" to _pS(_uM("height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#000000")), "scan-header" to _pS(_uM("height" to "88rpx", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "backgroundColor" to "#ffffff")), "back-button" to _pS(_uM("width" to "120rpx", "color" to "#333333", "fontSize" to "28rpx", "textAlign" to "center")), "title" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#333333", "fontSize" to "36rpx", "fontWeight" to "bold", "textAlign" to "center", "marginRight" to "120rpx")), "scancode-box" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "scan-button" to _pS(_uM("color" to "#ffffff", "fontSize" to "32rpx", "backgroundColor" to "#007aff", "borderTopLeftRadius" to "12rpx", "borderTopRightRadius" to "12rpx", "borderBottomRightRadius" to "12rpx", "borderBottomLeftRadius" to "12rpx", "paddingTop" to "24rpx", "paddingRight" to "60rpx", "paddingBottom" to "24rpx", "paddingLeft" to "60rpx")), "tip" to _pS(_uM("position" to "fixed", "bottom" to "100rpx", "left" to 0, "right" to 0, "textAlign" to "center", "color" to "#ffffff", "fontSize" to "28rpx", "backgroundColor" to "rgba(0,0,0,0.5)", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
