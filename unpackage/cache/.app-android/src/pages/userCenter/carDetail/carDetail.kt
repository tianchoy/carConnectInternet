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
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
open class GenPagesUserCenterCarDetailCarDetail : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterCarDetailCarDetail) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterCarDetailCarDetail
            val _cache = __ins.renderCache
            val deviceId = ref<String>("")
            val carInfo = ref(_uO())
            val isEditing = ref<Boolean>(false)
            val saving = ref<Boolean>(false)
            val loadingDetail = ref<Boolean>(false)
            val detailLoaded = ref<Boolean>(false)
            val carIconSelectorVisible = ref<Boolean>(false)
            val editInfo = ref<VehicleEditInfo>(VehicleEditInfo(deviceName = "", carType = "", carTypeValue = "", plateNo = "", carVin = "", engineNum = ""))
            val carTitle = computed(fun(): String {
                return carInfo.value.getString("carType", "未知")
            }
            )
            val formattedPlateNo = computed(fun(): String {
                return carInfo.value.getString("plateNo", "京A")
            }
            )
            val createEditInfo = fun(): VehicleEditInfo {
                val carType = carInfo.value.getString("carType", "")
                return VehicleEditInfo(deviceName = carInfo.value.getString("deviceName", ""), carType = carType, carTypeValue = carType, plateNo = carInfo.value.getString("plateNo", ""), carVin = carInfo.value.getString("carVin", ""), engineNum = carInfo.value.getString("engineNum", ""))
            }
            val toggleEdit = fun(): Unit {
                if (loadingDetail.value || saving.value) {
                    return
                }
                if (!detailLoaded.value || deviceId.value.length == 0) {
                    showAppToast(ShowToastOptions(title = "车辆信息尚未加载完成", icon = "none"))
                    return
                }
                editInfo.value = createEditInfo()
                isEditing.value = true
            }
            val updateCarIconSelectorVisible = fun(visible: Boolean): Unit {
                carIconSelectorVisible.value = visible
            }
            val openCarIconSelector = fun(): Unit {
                if (!saving.value) {
                    carIconSelectorVisible.value = true
                }
            }
            val selectIcon = fun(item: CarIconItem__2): Unit {
                editInfo.value.carType = item.getString("name", "")
                editInfo.value.carTypeValue = item.getString("text", "")
                carIconSelectorVisible.value = false
            }
            val normalizePlateNo = fun(value: String): String {
                return value.replace(UTSRegExp("\\s", "g"), "")
            }
            val cancelEdit = fun(): Unit {
                if (saving.value) {
                    return
                }
                carIconSelectorVisible.value = false
                isEditing.value = false
            }
            val saveChanges = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (saving.value) {
                            return@w1
                        }
                        if (deviceId.value.length == 0) {
                            showAppToast(ShowToastOptions(title = "设备ID不能为空", icon = "none"))
                            return@w1
                        }
                        val plateNo = normalizePlateNo(editInfo.value.plateNo)
                        val payload: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("payload", "pages/userCenter/carDetail/carDetail.uvue", 167, 9), "deviceId" to deviceId.value, "deviceName" to editInfo.value.deviceName, "carType" to editInfo.value.carType, "plateNo" to plateNo, "carVin" to editInfo.value.carVin, "engineNum" to editInfo.value.engineNum)
                        saving.value = true
                        uni_showLoading(ShowLoadingOptions(title = "保存中...", mask = true))
                        try {
                            val res = await(editDeviceInfo(payload))
                            if (res.code == 0) {
                                carInfo.value = payload
                                editInfo.value.plateNo = plateNo
                                isEditing.value = false
                                carIconSelectorVisible.value = false
                                showAppToast(ShowToastOptions(title = "保存成功", icon = "success"))
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "保存失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("保存车辆信息失败:", error, " at pages/userCenter/carDetail/carDetail.uvue:190")
                            showAppToast(ShowToastOptions(title = "保存失败，请重试", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                            saving.value = false
                        }
                })
            }
            val loadCarListData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (deviceId.value.length == 0) {
                            return@w1
                        }
                        loadingDetail.value = true
                        try {
                            val res = await(getDeviceDetail(deviceId.value))
                            if (res.code == 0 && res.data != null) {
                                carInfo.value = res.data
                                detailLoaded.value = true
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "获取车辆详情失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("获取车辆详情失败:", error, " at pages/userCenter/carDetail/carDetail.uvue:210")
                            showAppToast(ShowToastOptions(title = "获取车辆详情失败", icon = "none"))
                        }
                         finally {
                            loadingDetail.value = false
                        }
                })
            }
            onLoad(fun(option){
                val id = option["deviceId"]
                if (id != null) {
                    deviceId.value = id
                    loadCarListData()
                }
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "车辆详情", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to (!isEditing.value && !loadingDetail.value), "isIcon" to true, "onCapsuleClick" to toggleEdit, "Icon" to "/static/edit-pen.png"), null, 8, _uA(
                            "showCapsule"
                        )),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "设备ID"),
                                _cE("text", _uM("class" to "info"), _tD(carInfo.value.getString("deviceId", "")), 1)
                            )),
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "设备名称"),
                                if (isTrue(!isEditing.value)) {
                                    _cE("text", _uM("key" to 0, "class" to "info"), _tD(carInfo.value.getString("deviceName", "")), 1)
                                } else {
                                    _cV(_component_i_input, _uM("key" to 1, "modelValue" to editInfo.value.deviceName, "onUpdate:modelValue" to fun(`$event`: String){
                                        editInfo.value.deviceName = `$event`
                                    }
                                    , "border" to "none", "inputAlign" to "right", "class" to "input", "placeholder" to "请输入设备名称"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                }
                            )),
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "车标"),
                                if (isTrue(!isEditing.value)) {
                                    _cE("text", _uM("key" to 0, "class" to "info"), _tD(carTitle.value), 1)
                                } else {
                                    _cE("view", _uM("key" to 1, "class" to "car-type-selector", "onClick" to openCarIconSelector), _uA(
                                        _cE("text", _uM("class" to _nC(_uM("placeholder" to (editInfo.value.carTypeValue.length == 0)))), _tD(if (editInfo.value.carTypeValue != "") {
                                            editInfo.value.carTypeValue
                                        } else {
                                            "请选择车标"
                                        }
                                        ), 3),
                                        _cV(_component_i_icon, _uM("name" to "/static/xiangxia.png", "fontSize" to "18"))
                                    ))
                                }
                            )),
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "车牌号"),
                                if (isTrue(!isEditing.value)) {
                                    _cE("text", _uM("key" to 0, "class" to "info"), _tD(formattedPlateNo.value), 1)
                                } else {
                                    _cV(_component_i_input, _uM("key" to 1, "modelValue" to editInfo.value.plateNo, "onUpdate:modelValue" to fun(`$event`: String){
                                        editInfo.value.plateNo = `$event`
                                    }
                                    , "border" to "none", "inputAlign" to "right", "class" to "input", "placeholder" to "请输入车牌号"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                }
                            )),
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "车架号"),
                                if (isTrue(!isEditing.value)) {
                                    _cE("text", _uM("key" to 0, "class" to "info"), _tD(carInfo.value.getString("carVin", "")), 1)
                                } else {
                                    _cV(_component_i_input, _uM("key" to 1, "modelValue" to editInfo.value.carVin, "onUpdate:modelValue" to fun(`$event`: String){
                                        editInfo.value.carVin = `$event`
                                    }
                                    , "border" to "none", "inputAlign" to "right", "class" to "input", "placeholder" to "请输入车架号"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                }
                            )),
                            _cE("view", _uM("class" to "list"), _uA(
                                _cE("text", _uM("class" to "title"), "发动机号"),
                                if (isTrue(!isEditing.value)) {
                                    _cE("text", _uM("key" to 0, "class" to "info"), _tD(carInfo.value.getString("engineNum", "")), 1)
                                } else {
                                    _cV(_component_i_input, _uM("key" to 1, "modelValue" to editInfo.value.engineNum, "onUpdate:modelValue" to fun(`$event`: String){
                                        editInfo.value.engineNum = `$event`
                                    }
                                    , "border" to "none", "inputAlign" to "right", "class" to "input", "placeholder" to "请输入发动机号"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                }
                            ))
                        )),
                        if (isTrue(isEditing.value)) {
                            _cE("view", _uM("key" to 0, "class" to "button-group"), _uA(
                                _cV(_component_i_button, _uM("class" to "action-button save-btn", "type" to "primary", "loading" to saving.value, "onClick" to saveChanges), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        "保存"
                                    )
                                }), "_" to 1), 8, _uA(
                                    "loading"
                                )),
                                _cV(_component_i_button, _uM("class" to "action-button cancel-btn", "disabled" to saving.value, "onClick" to cancelEdit), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        "取消"
                                    )
                                }), "_" to 1), 8, _uA(
                                    "disabled"
                                ))
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        _cV(unref(GenComponentsCarIconsCarIconsClass), _uM("show" to carIconSelectorVisible.value, "onUpdate:show" to updateCarIconSelectorVisible, "onSelect" to selectIcon), null, 8, _uA(
                            "show"
                        ))
                    )),
                    _cV(_component_app_toast)
                ), 64)
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#f5f5f5")), "content" to _pS(_uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "backgroundColor" to "#ffffff", "paddingTop" to "40rpx", "paddingRight" to "40rpx", "paddingBottom" to "40rpx", "paddingLeft" to "40rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "list" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "minHeight" to "76rpx", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "title" to _pS(_uM("width" to "30%", "color" to "#999999")), "info" to _pS(_uM("color" to "#333333", "textAlign" to "right", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "input" to _pS(_uM("textAlign" to "right", "paddingTop" to 0, "paddingRight" to "10rpx", "paddingBottom" to 0, "paddingLeft" to "10rpx", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "width" to "60%")), "car-type-selector" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "flex-end")), "button-group" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginTop" to "40rpx", "marginRight" to "40rpx", "marginBottom" to 0, "marginLeft" to "40rpx")), "action-button" to _pS(_uM("width" to "40%", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "fontSize" to "32rpx", "height" to "80rpx", "lineHeight" to "80rpx")), "save-btn" to _pS(_uM("backgroundColor" to "#007AFF", "color" to "#FFFFFF")), "cancel-btn" to _pS(_uM("backgroundColor" to "#f5f5f5", "color" to "#333333", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#dddddd", "borderRightColor" to "#dddddd", "borderBottomColor" to "#dddddd", "borderLeftColor" to "#dddddd")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
