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
import io.dcloud.uniapp.extapi.`$off` as uni__off
import io.dcloud.uniapp.extapi.`$on` as uni__on
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesAddCarAddCar : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesAddCarAddCar) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesAddCarAddCar
            val _cache = __ins.renderCache
            val formRef = ref<FormInstance?>(null)
            val deviceTypeSelect = ref<DeviceTypeSelectorInstance?>(null)
            val loading = ref<Boolean>(false)
            val formValid = ref<Boolean>(false)
            val carInfo = ref<CarFormData>(CarFormData(deviceName = "", imei = "", deviceType = "", deviceTypeValue = "", plateNo = "", carType = ""))
            val actions = ref(_uA<Any>())
            val rules: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("rules", "pages/addCar/addCar.uvue", 101, 8), "imei" to _uA(
                _uO("required" to true, "message" to "请输入设备ID", "trigger" to _uA(
                    "blur",
                    "change"
                )),
                _uO("min" to 8, "max" to 18, "message" to "ID长度应在8-18位之间", "trigger" to _uA(
                    "blur",
                    "change"
                ))
            ), "deviceType" to _uA(
                _uO("required" to true, "message" to "请选择设备图标", "trigger" to _uA(
                    "blur",
                    "change"
                ))
            ))
            val handleModelValid = fun(value: Any){
                formValid.value = !!isTruthy(value)
            }
            val scanCode = fun(){
                uni_navigateTo(NavigateToOptions(url = "/pages/scancode/scancode"))
            }
            val handleScanResult = fun(data: ScanResultData){
                console.log("接收到扫码结果:", data.result, " at pages/addCar/addCar.uvue:144")
                if (data.result.length === 15) {
                    carInfo.value.imei = "0" + data.result.slice(4, 15)
                } else if (data.result.length === 11) {
                    carInfo.value.imei = "0" + data.result
                } else {
                    uni_showToast(ShowToastOptions(title = "请输入正确的设备ID", icon = "none"))
                }
            }
            val selectIcon = fun(item: CarIconItem__1){
                console.log(item.name, " at pages/addCar/addCar.uvue:160")
                carInfo.value.deviceType = item.name
                carInfo.value.deviceTypeValue = item.text
                deviceTypeSelect.value?.close()
            }
            val deviceTypeSelectFun = fun(){
                deviceTypeSelect.value?.open()
            }
            val refreshDeviceList = fun(){
                uni__emit("refreshDeviceList", null)
            }
            val validateForm = fun(): UTSPromise<Boolean> {
                return UTSPromise<Boolean>(fun(resolve, reject){
                    val form = formRef.value
                    if (form == null) {
                        reject(UTSError("表单实例不存在"))
                        return
                    }
                    if (form.validate()) {
                        resolve(true)
                    } else {
                        reject(UTSError("表单验证失败"))
                    }
                }
                )
            }
            val submit = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        console.log("=== 开始提交设备 ===", " at pages/addCar/addCar.uvue:195")
                        try {
                            await(validateForm())
                            console.log("✅ 表单验证通过", " at pages/addCar/addCar.uvue:200")
                            loading.value = true
                            uni_showLoading(ShowLoadingOptions(title = "添加中...", mask = true))
                            val submitData: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("submitData", "pages/addCar/addCar.uvue", 208, 10), "deviceName" to carInfo.value.deviceName, "imei" to carInfo.value.imei, "carType" to carInfo.value.deviceType)
                            console.log("📤 提交数据:", submitData, " at pages/addCar/addCar.uvue:215")
                            val res = await(addDevice(submitData)) as AddDeviceResponse
                            console.log("✅ 添加设备返回:", res, " at pages/addCar/addCar.uvue:218")
                            uni_hideLoading(null)
                            loading.value = false
                            if (res.code == 0) {
                                uni_showToast(ShowToastOptions(title = "添加成功", icon = "success"))
                                uni_setStorageSync("needRefreshHome", true)
                                refreshDeviceList()
                                setTimeout(fun(){
                                    uni_navigateBack(null)
                                }, 1500)
                            } else {
                                uni_showToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "添加失败"
                                }
                                , icon = "none", duration = 2000))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("❌ 添加设备失败:", error, " at pages/addCar/addCar.uvue:245")
                            uni_hideLoading(null)
                            loading.value = false
                            uni_showToast(ShowToastOptions(title = "添加设备失败", icon = "none"))
                        }
                })
            }
            onLoad(fun(_options){
                uni__on("scanCodeResult", handleScanResult)
                console.log("formRef 初始值:", formRef.value, " at pages/addCar/addCar.uvue:260")
            }
            )
            onUnload(fun(){
                uni__off("scanCodeResult", handleScanResult)
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_form_item = resolveEasyComponent("i-form-item", GenUniModulesIUiXComponentsIFormItemIFormItemClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_form = resolveEasyComponent("i-form", GenUniModulesIUiXComponentsIFormIFormClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "添加设备", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "content"), _uA(
                        _cV(_component_i_form, _uM("labelPosition" to "left", "modelValue" to carInfo.value, "rules" to rules, "ref_key" to "formRef", "ref" to formRef, "labelDirection" to "horizontal", "watchValidStatus" to "", "onUpdate:modelValid" to handleModelValid), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_i_form_item, _uM("label" to "设备名称", "name" to "deviceName", "labelDirection" to "horizontal"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_input, _uM("border" to "none", "modelValue" to carInfo.value.deviceName, "onUpdate:modelValue" to fun(`$event`: String){
                                            carInfo.value.deviceName = `$event`
                                        }
                                        , "placeholder" to "请输入设备名称"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        ))
                                    )
                                }
                                ), "_" to 1)),
                                _cV(_component_i_form_item, _uM("label" to "*设备ID", "name" to "imei", "labelDirection" to "horizontal"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_input, _uM("border" to "none", "modelValue" to carInfo.value.imei, "onUpdate:modelValue" to fun(`$event`: String){
                                            carInfo.value.imei = `$event`
                                        }
                                        , "placeholder" to "请输入设备ID(必填)"), _uM("suffix" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                _cV(_component_i_icon, _uM("name" to "/static/sancode.png", "fontSize" to "20", "onClick" to scanCode))
                                            )
                                        }
                                        ), "_" to 1), 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        ))
                                    )
                                }
                                ), "_" to 1)),
                                _cV(_component_i_form_item, _uM("label" to "车标", "name" to "deviceType", "labelDirection" to "horizontal"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cE("view", _uM("class" to "car-type-selector", "onClick" to deviceTypeSelectFun), _uA(
                                            _cE("text", _uM("class" to _nC(_uA(
                                                "clickable",
                                                _uM("placeholder" to !(carInfo.value.deviceTypeValue != ""))
                                            ))), _tD(if (carInfo.value.deviceTypeValue != "") {
                                                carInfo.value.deviceTypeValue
                                            } else {
                                                "请选择设备图标(必选)"
                                            }
                                            ), 3)
                                        ))
                                    )
                                }
                                ), "_" to 1)),
                                _cV(unref(GenComponentsCarIconsCarIconsClass), _uM("ref_key" to "deviceTypeSelect", "ref" to deviceTypeSelect, "onSelect" to selectIcon), null, 512)
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "modelValue"
                        ))
                    )),
                    _cE("view", _uM("class" to "btn"), _uA(
                        _cV(_component_i_button, _uM("type" to "primary", "onClick" to submit, "loading" to loading.value), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                "提交"
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "loading"
                        ))
                    ))
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
                return _uM("container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#f5f5f5")), "content" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "paddingTop" to "20rpx", "paddingRight" to "40rpx", "paddingBottom" to "20rpx", "paddingLeft" to "40rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "clickable" to _uM(".container " to _uM("marginTop" to 10, "color" to "#999999", "fontSize" to "28rpx")), "btn" to _uM(".container " to _uM("marginTop" to "50rpx", "marginRight" to "20rpx", "marginBottom" to 0, "marginLeft" to "20rpx")), "plate-input" to _uM(".container " to _uM("width" to "100%")), "input-wrapper" to _uM(".container .plate-input " to _uM("paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0, "borderTopWidth" to "medium", "borderRightWidth" to "medium", "borderBottomWidth" to "medium", "borderLeftWidth" to "medium", "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000")), "car-input-container" to _uM(".container " to _uM("display" to "flex", "flexDirection" to "row")), "car-number-input" to _uM(".container " to _uM("width" to "60%", "textAlign" to "right")), "plate-close" to _uM(".container .car-number-container " to _uM("height" to 40, "display" to "flex", "textAlign" to "right", "backgroundColor" to "#FFFFFF", "flexDirection" to "row", "justifyContent" to "flex-end", "alignItems" to "center")), "car-input-item" to _uM(".container .car-input-container .car-input-box " to _uM("position" to "relative", "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#E2E2E2", "borderRightColor" to "#E2E2E2", "borderBottomColor" to "#E2E2E2", "borderLeftColor" to "#E2E2E2", "height" to 40, "lineHeight" to "40px", "textAlign" to "center", "fontSize" to 17)), "new-item-img" to _uM(".container .car-input-container .car-input-box .car-input-item " to _uM("position" to "absolute", "top" to -2, "left" to "50%", "marginLeft" to -15, "height" to 13, "width" to 30, "zIndex" to 9)), "i-form-item" to _uM(".container " to _uM("paddingTop" to "5rpx", "paddingRight" to "10rpx", "paddingBottom" to "5rpx", "paddingLeft" to "10rpx", "borderTopLeftRadius" to 0, "borderTopRightRadius" to 0, "borderBottomRightRadius" to 0, "borderBottomLeftRadius" to 0, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#99999924")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
