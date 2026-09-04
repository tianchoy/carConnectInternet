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
open class GenPagesStopRecordStopRecord : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesStopRecordStopRecord) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesStopRecordStopRecord
            val _cache = __ins.renderCache
            val carStatus = ref("在线")
            val showDateTimePicker = ref(false)
            val currentPickerType = ref("start")
            val pickerTitle = ref("选择开始时间")
            val startTime = ref("")
            val endTime = ref("")
            val currentPickerValue = computed(fun(): String {
                return if (currentPickerType.value === "start") {
                    startTime.value
                } else {
                    endTime.value
                }
            }
            )
            val imei = ref<String?>("")
            val currentDateTime = ref("")
            val carStopDetail = ref(_uA<StopRecord>())
            val sortedCarStopDetail = computed(fun(): UTSArray<StopRecord> {
                val sorted = carStopDetail.value.slice()
                sorted.sort(fun(a: StopRecord, b: StopRecord): Number {
                    val timeA = parseLocalDateTime(a.getString("endTime", ""))
                    val timeB = parseLocalDateTime(b.getString("endTime", ""))
                    if (timeA == null) {
                        return if (timeB == null) {
                            0
                        } else {
                            1
                        }
                    }
                    if (timeB == null) {
                        return -1
                    }
                    return timeB - timeA
                }
                )
                return sorted
            }
            )
            onLoad(fun(option){
                imei.value = option["imei"]
            }
            )
            val initDateTime = fun(){
                val now = Date()
                endTime.value = formatTimes(now.getTime())
                startTime.value = formatTimes(now.getTime() - 86400000)
                console.log("当前时间戳:", now.getTime(), " at pages/stopRecord/stopRecord.uvue:102")
                console.log("格式化后:", formatTimes(now.getTime()), " at pages/stopRecord/stopRecord.uvue:103")
            }
            val loadStopData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                        val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/stopRecord/stopRecord.uvue", 110, 9), "imei" to imei.value, "startTime" to startTime.value, "endTime" to endTime.value, "minParkTime" to 10, "withStop" to true, "withPos" to false, "withTrip" to false)
                        try {
                            val res = await(getTrackPos(data))
                            val trackData = res.data
                            if (res.code != 200 || trackData == null) {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "数据加载失败"
                                }
                                , icon = "none"))
                                carStopDetail.value = _uA()
                                return@w1
                            }
                            val stopsWithAddress: UTSArray<StopRecord> = _uA()
                            val stops = trackData.getArray<UTSJSONObject>("stops") ?: _uA()
                            stops.forEach(fun(stop: UTSJSONObject): Unit {
                                val convertedCoord = CoordTransform.wgs84ToTencent(stop.getNumber("latitude", 0), stop.getNumber("longitude", 0))
                                stop.set("latitude", convertedCoord.lat)
                                stop.set("longitude", convertedCoord.lng)
                                stopsWithAddress.push(stop)
                            }
                            )
                            carStopDetail.value = stopsWithAddress
                        }
                         catch (error: Throwable) {
                            console.error("获取停车数据失败:", error, " at pages/stopRecord/stopRecord.uvue:137")
                            showAppToast(ShowToastOptions(title = "数据加载失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            onMounted(fun(){
                initDateTime()
                loadStopData()
            }
            )
            val showPicker = fun(type: String){
                currentPickerType.value = type
                pickerTitle.value = if (type === "start") {
                    "选择开始时间"
                } else {
                    "选择结束时间"
                }
                showDateTimePicker.value = true
            }
            val onConfirm = fun(event: UTSJSONObject): Unit {
                val timestamp = event.getNumber("timestamp", 0)
                if (!isFinite(timestamp) || timestamp <= 0) {
                    return
                }
                val value = formatTimes(timestamp)
                if (currentPickerType.value === "start") {
                    startTime.value = value
                } else {
                    endTime.value = value
                }
                loadStopData()
                showDateTimePicker.value = false
            }
            val onCancel = fun(){
                showDateTimePicker.value = false
            }
            val onPickerShowChange = fun(value: Boolean){
                showDateTimePicker.value = value
            }
            val calculateDuration = fun(diff: Number): String {
                val hours = Math.floor(diff / 3600000)
                val minutes = Math.floor((diff % 3600000) / 60000)
                val seconds = Math.floor((diff % 60000) / 1000)
                return "" + hours + "小时" + minutes + "分" + seconds + "秒"
            }
            val showAddress = fun(latitude: Number, longitude: Number){
                openLocation(OpenLocationParams(latitude = latitude, longitude = longitude, name = "停车位置"))
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_datetime_picker = resolveEasyComponent("i-datetime-picker", GenUniModulesIUiXComponentsIDatetimePickerIDatetimePickerClass)
                val _component_i_empty = resolveEasyComponent("i-empty", GenUniModulesIUiXComponentsIEmptyIEmptyClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "停车记录", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "tools-panel"), _uA(
                            _cE("view", _uM("class" to "Datetime-box"), _uA(
                                _cE("view", _uM("class" to "date-box"), _uA(
                                    _cV(_component_i_icon, _uM("name" to "/static/rili.png", "fontSize" to "15")),
                                    _cE("text", _uM("class" to "Date", "onClick" to fun(){
                                        showPicker("start")
                                    }
                                    ), _tD(startTime.value), 9, _uA(
                                        "onClick"
                                    )),
                                    _cV(_component_i_icon, _uM("name" to "/static/xiangxia.png", "fontSize" to "15", "onClick" to fun(){
                                        showPicker("start")
                                    }
                                    ), null, 8, _uA(
                                        "onClick"
                                    )),
                                    _cE("text", _uM("style" to _nS(_uM("padding" to "0 10rpx"))), "至", 4),
                                    _cE("text", _uM("class" to "Date", "onClick" to fun(){
                                        showPicker("end")
                                    }
                                    ), _tD(endTime.value), 9, _uA(
                                        "onClick"
                                    )),
                                    _cV(_component_i_icon, _uM("name" to "/static/xiangxia.png", "fontSize" to "15", "onClick" to fun(){
                                        showPicker("end")
                                    }
                                    ), null, 8, _uA(
                                        "onClick"
                                    ))
                                ))
                            )),
                            _cV(_component_i_datetime_picker, _uM("show" to showDateTimePicker.value, "model-value" to currentPickerValue.value, "mode" to "datetime", "title" to pickerTitle.value, "cancel-text" to "取消", "confirm-text" to "确认", "onConfirm" to onConfirm, "onCancel" to onCancel, "onUpdate:show" to onPickerShowChange), _uM("trigger" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _cE("view")
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "show",
                                "model-value",
                                "title"
                            ))
                        )),
                        _cE("scroll-view", _uM("class" to "content-box", "scroll-y" to "true"), _uA(
                            if (sortedCarStopDetail.value.length == 0) {
                                _cV(_component_i_empty, _uM("key" to 0, "text" to "当前时间暂无停车数据", "showButton" to false, "description" to ""))
                            } else {
                                _cE(Fragment, _uM("key" to 1), RenderHelpers.renderList(sortedCarStopDetail.value, fun(item, index, __index, _cached): Any {
                                    return _cE("view", _uM("class" to "content", "key" to index), _uA(
                                        _cE("view", _uM("class" to "item"), _uA(
                                            _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/startTime.png")),
                                            _cE("text", null, _tD(item["startTime"]), 1)
                                        )),
                                        _cE("view", _uM("class" to "item"), _uA(
                                            _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/endTime.png")),
                                            _cE("text", null, _tD(item["endTime"]), 1)
                                        )),
                                        _cE("view", _uM("class" to "item"), _uA(
                                            _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/stopTime.png")),
                                            _cE("text", null, "停留 " + _tD(calculateDuration(item.getNumber("duration", 0))), 1)
                                        )),
                                        _cE("view", _uM("class" to "item"), _uA(
                                            _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/user_location.png")),
                                            if (isTrue(item["address"])) {
                                                _cE("text", _uM("key" to 0, "class" to "address"), _tD(if (isTruthy(item["address"])) {
                                                    item["address"]
                                                } else {
                                                    "加载中..."
                                                }), 1)
                                            } else {
                                                _cE("text", _uM("key" to 1, "onClick" to fun(){
                                                    showAddress(item.getNumber("latitude", 0), item.getNumber("longitude", 0))
                                                }
                                                ), "点击查看停车位置", 8, _uA(
                                                    "onClick"
                                                ))
                                            }
                                        ))
                                    ))
                                }
                                ), 128)
                            }
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
                return _uM("container" to _pS(_uM("height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "tools-panel" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#69c2f1", "borderRightColor" to "#69c2f1", "borderBottomColor" to "#69c2f1", "borderLeftColor" to "#69c2f1", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "Datetime-box" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "date-box" to _uM(".container .tools-panel .Datetime-box " to _uM("width" to "100%", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "Date" to _uM(".container .tools-panel .Datetime-box .date-box " to _uM("fontSize" to "25rpx", "borderTopLeftRadius" to "5rpx", "borderTopRightRadius" to "5rpx", "borderBottomRightRadius" to "5rpx", "borderBottomLeftRadius" to "5rpx")), "mileage_title" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "40rpx", "marginBottom" to 0, "marginLeft" to "40rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "content" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "40rpx", "marginBottom" to "20rpx", "marginLeft" to "40rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "column", "justifyContent" to "flex-start", "alignItems" to "flex-start", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "15rpx", "borderTopRightRadius" to "15rpx", "borderBottomRightRadius" to "15rpx", "borderBottomLeftRadius" to "15rpx")), "content-box" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minHeight" to 0, "marginBottom" to "30rpx")), "item" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "15rpx", "paddingRight" to 0, "paddingBottom" to "15rpx", "paddingLeft" to 0)), "icons" to _uM(".container .content .item " to _uM("width" to "40rpx", "height" to "40rpx", "marginRight" to "15rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
