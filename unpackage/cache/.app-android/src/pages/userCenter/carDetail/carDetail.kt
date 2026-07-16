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
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesUserCenterCarDetailCarDetail : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterCarDetailCarDetail) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterCarDetailCarDetail
            val _cache = __ins.renderCache
            val deviceId = ref<String>("")
            val carList = ref(_uO())
            val isEditing = ref(false)
            val carInfo = ref(_uO())
            val editInfo = ref(_uO())
            val deviceTypeSelect = ref(null)
            val carTitle = computed(fun(): Any {
                if (!isTruthy(carInfo.value["carType"])) {
                    return "未知"
                }
                val iconInfo = deviceTypeSelect.value?.getIconByName(carInfo.value["carType"])
                return if (isTruthy(iconInfo)) {
                    iconInfo.title
                } else {
                    "未知"
                }
            }
            )
            val selectIcon = fun(item){
                editInfo.value["carType"] = item.name
                editInfo.value["carTypeValue"] = item.text
                deviceTypeSelect.value?.close()
            }
            val deviceTypeSelectFun = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        deviceTypeSelect.value?.open()
                })
            }
            val handlePlateNumberChange = fun(e: String){
                console.log(e.length, " at pages/userCenter/carDetail/carDetail.uvue:86")
                editInfo.value["plateNo"] = e
            }
            val formattedPlateNo = computed(fun(): Any {
                if (!isTruthy(editInfo.value["plateNo"])) {
                    return "京A"
                }
                return if (editInfo.value["plateNo"].length > 8) {
                    editInfo.value["plateNo"].substring(0, 8)
                } else {
                    editInfo.value["plateNo"]
                }
            }
            )
            val toggleEdit = fun(){
                isEditing.value = !isEditing.value
                if (isEditing.value) {
                    editInfo.value = UTSAndroid.consoleDebugError(JSON.parse(JSON.stringify(carInfo.value)), " at pages/userCenter/carDetail/carDetail.uvue:102")
                    if (isTruthy(editInfo.value["carType"]) && !isTruthy(editInfo.value["carTypeValue"])) {
                        val iconInfo = deviceTypeSelect.value?.getIconByName(editInfo.value["carType"])
                        if (isTruthy(iconInfo)) {
                            editInfo.value["carTypeValue"] = iconInfo.title
                        }
                    }
                }
            }
            val saveChanges = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/userCenter/carDetail/carDetail.uvue", 116, 9), "deviceId" to editInfo.value["deviceId"], "deviceName" to editInfo.value["deviceName"], "carType" to editInfo.value["carType"], "plateNo" to editInfo.value["plateNo"], "carVin" to editInfo.value["carVin"], "engineNum" to editInfo.value["engineNum"])
                        carInfo.value = UTSAndroid.consoleDebugError(JSON.parse(JSON.stringify(editInfo.value)), " at pages/userCenter/carDetail/carDetail.uvue:124")
                        isEditing.value = false
                        val res = await(editDeviceInfo(data))
                        console.log(res, " at pages/userCenter/carDetail/carDetail.uvue:128")
                        uni_showToast(ShowToastOptions(title = "保存成功", icon = "success"))
                })
            }
            val cancelEdit = fun(){
                isEditing.value = false
            }
            onLoad(fun(option){
                console.log("option", option, " at pages/userCenter/carDetail/carDetail.uvue:141")
                if (option["deviceId"] != null) {
                    deviceId.value = option["deviceId"]
                    loadCarListData()
                } else {
                    console.error("deviceId is null", " at pages/userCenter/carDetail/carDetail.uvue:147")
                }
            }
            )
            val loadCarListData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val res = await(getDeviceDetail(deviceId.value))
                        console.log(res.data, " at pages/userCenter/carDetail/carDetail.uvue:153")
                        if (res.msg == "success") {
                            carInfo.value = res.data
                        } else {
                            uni_showToast(ShowToastOptions(title = "获取车辆详情失败"))
                        }
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_car_number_input = resolveEasyComponent("car-number-input", GenUniModulesCarNumberInputComponentsCarNumberInputCarNumberInputClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "车辆详情", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to true, "isIcon" to true, "onCapsuleClick" to toggleEdit, "Icon" to "/static/edit-pen.png")),
                    _cE("view", _uM("class" to "content"), _uA(
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "设备ID"),
                            _cE("text", _uM("class" to "info"), _tD(unref(carInfo)["deviceId"]), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "设备名称"),
                            if (isTrue(!unref(isEditing))) {
                                _cE("text", _uM("key" to 0, "class" to "info"), _tD(unref(carInfo)["deviceName"]), 1)
                            } else {
                                _cV(_component_i_input, _uM("key" to 1, "modelValue" to unref(editInfo)["deviceName"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                    unref(editInfo)["deviceName"] = `$event`
                                }
                                , "border" to "surround", "inputAlign" to "right", "class" to "input"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                ))
                            }
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车标"),
                            if (isTrue(!unref(isEditing))) {
                                _cE("text", _uM("key" to 0, "class" to "info"), _tD(unref(carTitle)), 1)
                            } else {
                                _cE("view", _uM("key" to 1, "class" to "custom-icon", "onClick" to deviceTypeSelectFun), _uA(
                                    _cE("text", null, _tD(unref(editInfo)["carTypeValue"] || "请选择图标"), 1),
                                    _cV(_component_i_icon, _uM("name" to "/static/xiangxia.png", "fontSize" to "15"))
                                ))
                            }
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车牌号"),
                            if (isTrue(!unref(isEditing))) {
                                _cE("text", _uM("key" to 0, "class" to "info"), _tD(unref(carInfo)["plateNo"]), 1)
                            } else {
                                _cE("view", _uM("key" to 1, "class" to "info"), _uA(
                                    _cV(_component_car_number_input, _uM("onNumberInputResult" to handlePlateNumberChange, "defaultStr" to unref(formattedPlateNo)), null, 8, _uA(
                                        "defaultStr"
                                    ))
                                ))
                            }
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车架号"),
                            if (isTrue(!unref(isEditing))) {
                                _cE("text", _uM("key" to 0, "class" to "info"), _tD(unref(carInfo)["carVin"]), 1)
                            } else {
                                _cV(_component_i_input, _uM("key" to 1, "modelValue" to unref(editInfo)["carVin"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                    unref(editInfo)["carVin"] = `$event`
                                }
                                , "border" to "surround", "inputAlign" to "right", "class" to "input"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                ))
                            }
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "发动机号"),
                            if (isTrue(!unref(isEditing))) {
                                _cE("text", _uM("key" to 0, "class" to "info"), _tD(unref(carInfo)["engineNum"]), 1)
                            } else {
                                _cV(_component_i_input, _uM("key" to 1, "modelValue" to unref(editInfo)["engineNum"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                    unref(editInfo)["engineNum"] = `$event`
                                }
                                , "border" to "surround", "inputAlign" to "right", "class" to "input"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                ))
                            }
                        ))
                    )),
                    if (isTrue(unref(isEditing))) {
                        _cE("view", _uM("key" to 0, "class" to "button-group"), _uA(
                            _cE("button", _uM("onClick" to saveChanges, "class" to "save-btn"), "保存"),
                            _cE("button", _uM("onClick" to cancelEdit, "class" to "cancel-btn"), "取消")
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    _cV(unref(GenComponentsCarIconsCarIconsClass), _uM("ref_key" to "deviceTypeSelect", "ref" to deviceTypeSelect, "onSelect" to selectIcon), null, 512)
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#f5f5f5")), "content" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "backgroundColor" to "#ffffff", "paddingTop" to "40rpx", "paddingRight" to "40rpx", "paddingBottom" to "40rpx", "paddingLeft" to "40rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "list" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "title" to _uM(".container .content .list " to _uM("color" to "#999999")), "input" to _uM(".container .content .list " to _uM("textAlign" to "right", "paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "width" to "60%", "height" to 25)), "info" to _uM(".container .content .list " to _uM("color" to "#333333", "textAlign" to "right", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "content:empty::after" to "\"（无）\"", "color:empty::after" to "#999999")), "custom-icon" to _uM(".container .content .list " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "car-input-container" to _uM(".container .content .list " to _uM("display" to "flex", "flexDirection" to "row", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0)), "car-number-input" to _uM(".container .content .list " to _uM("width" to "60%", "textAlign" to "right")), "plate-close" to _uM(".container .content .list .car-number-container " to _uM("height" to 40, "display" to "flex", "textAlign" to "right", "backgroundColor" to "#FFFFFF", "flexDirection" to "row", "justifyContent" to "flex-end", "alignItems" to "center")), "car-input-item" to _uM(".container .content .list .car-input-container .car-input-box " to _uM("position" to "relative", "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#E2E2E2", "borderRightColor" to "#E2E2E2", "borderBottomColor" to "#E2E2E2", "borderLeftColor" to "#E2E2E2", "height" to 40, "lineHeight" to "40px", "textAlign" to "center", "fontSize" to 17, "width" to "auto", "marginLeft" to "5%")), "new-item-img" to _uM(".container .content .list .car-input-container .car-input-box .car-input-item " to _uM("position" to "absolute", "top" to -2, "left" to "50%", "marginLeft" to -15, "height" to 13, "width" to 30, "zIndex" to 9)), "car-input-box" to _uM(".container .content .list .car-input-container " to _uM("verticalAlign" to "middle", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "button-group" to _uM(".container " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginTop" to "40rpx", "marginRight" to "40rpx", "marginBottom" to 0, "marginLeft" to "40rpx")), "grid-text" to _uM(".container " to _uM("marginTop" to "10rpx", "fontSize" to "20rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
