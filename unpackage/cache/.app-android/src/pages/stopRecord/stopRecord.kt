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
import io.dcloud.uniapp.extapi.openLocation as uni_openLocation
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showToast as uni_showToast
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
            val imei = ref<String?>("")
            val carStopDetail = ref(_uO())
            val address = ref("")
            val sortedCarStopDetail = computed(fun(): UTSArray<Any> {
                if (!(carStopDetail.value != null) || !UTSArray.isArray(carStopDetail.value)) {
                    return _uA()
                }
                return carStopDetail.value.slice().sort(fun(a, b): Number {
                    val timeA = Date(a.endTime).getTime()
                    val timeB = Date(b.endTime).getTime()
                    return timeB - timeA
                }
                )
            }
            )
            onMounted(fun(){
                initDateTime()
                loadStopData()
            }
            )
            onLoad(fun(option){
                imei.value = option["imei"]
            }
            )
            val loadStopData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                        val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/stopRecord/stopRecord.uvue", 98, 9), "imei" to imei.value, "startTime" to startTime.value, "endTime" to endTime.value, "minParkTime" to 10, "withStop" to true, "withPos" to false, "withTrip" to false)
                        val res = await(getTrackPos(data))
                        val stopsWithAddress = await(UTSPromise.all(res.data.stops.map(fun(stop): UTSPromise<Any> {
                            return wrapUTSPromise(suspend w2@{
                                    val convertedCoord = CoordTransform.wgs84ToTencent(stop.latitude, stop.longitude)
                                    return@w2 UTSJSONObject.assign(_uO(), stop, _uO("latitude" to convertedCoord.lat, "longitude" to convertedCoord.lng))
                            })
                        }
                        )))
                        carStopDetail.value = stopsWithAddress
                        uni_hideLoading(null)
                })
            }
            val initDateTime = fun(){
                val now = Date()
                val formatTime = fun(date: Date): String {
                    return "" + date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + " " + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0")
                }
                endTime.value = formatTime(now)
                val startDate = Date(now.getTime() - 86400000)
                startTime.value = formatTime(startDate)
            }
            val showPicker = fun(type: String){
                currentPickerType.value = type
                pickerTitle.value = if (type === "start") {
                    "选择开始时间"
                } else {
                    "选择结束时间"
                }
                showDateTimePicker.value = true
            }
            val onConfirm = fun(value: String){
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
            val calculateDuration = fun(diff: Number): String {
                val hours = Math.floor(diff / 3600000)
                val minutes = Math.floor((diff % 3600000) / 60000)
                val seconds = Math.floor((diff % 60000) / 1000)
                return "" + hours + "小时" + minutes + "分" + seconds + "秒"
            }
            val showAddress = fun(latitude: String, longitude: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        console.log(latitude, longitude, " at pages/stopRecord/stopRecord.uvue:168")
                        uni_openLocation(OpenLocationOptions(latitude = latitude, longitude = longitude, name = "当前位置", scale = 18, success = fun(_){
                            console.log("成功调起地图", " at pages/stopRecord/stopRecord.uvue:175")
                        }
                        , fail = fun(err){
                            uni_showToast(ShowToastOptions(title = "调起地图失败", icon = "none"))
                            console.error("调起地图失败:", err, " at pages/stopRecord/stopRecord.uvue:182")
                        }
                        ))
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker", GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePickerClass)
                val _component_l_popup = resolveEasyComponent("l-popup", GenUniModulesLimePopupComponentsLPopupLPopupClass)
                val _component_i_empty = resolveEasyComponent("i-empty", GenUniModulesIUiXComponentsIEmptyIEmptyClass)
                return _cE("view", _uM("class" to "container"), _uA(
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
                        _cV(_component_l_popup, _uM("modelValue" to showDateTimePicker.value, "onUpdate:modelValue" to fun(`$event`: Boolean){
                            showDateTimePicker.value = `$event`
                        }
                        , "position" to "bottom", "closeable" to false), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_l_date_time_picker, _uM("confirm-btn" to "确认", "cancel-btn" to "取消", "title" to pickerTitle.value, "mode" to 63, "onConfirm" to onConfirm, "onCancel" to onCancel), null, 8, _uA(
                                    "title"
                                ))
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "modelValue",
                            "onUpdate:modelValue"
                        ))
                    )),
                    _cE("scroll-view", _uM("class" to "content-box", "scroll-y" to ""), _uA(
                        if (sortedCarStopDetail.value.length == 0) {
                            _cV(_component_i_empty, _uM("key" to 0, "text" to "当前时间暂无停车数据", "showButton" to false, "description" to ""))
                        } else {
                            _cE(Fragment, _uM("key" to 1), RenderHelpers.renderList(sortedCarStopDetail.value, fun(item, index, __index, _cached): Any {
                                return _cE("view", _uM("class" to "content", "key" to index), _uA(
                                    _cE("view", _uM("class" to "item"), _uA(
                                        _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/startTime.png")),
                                        _cE("text", null, _tD(item.startTime), 1)
                                    )),
                                    _cE("view", _uM("class" to "item"), _uA(
                                        _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/endTime.png")),
                                        _cE("text", null, _tD(item.endTime), 1)
                                    )),
                                    _cE("view", _uM("class" to "item"), _uA(
                                        _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/stopTime.png")),
                                        _cE("text", null, "停留 " + _tD(calculateDuration(item.duration)), 1)
                                    )),
                                    _cE("view", _uM("class" to "item"), _uA(
                                        _cE("image", _uM("class" to "icons", "mode" to "aspectFit", "src" to "/static/user_location.png")),
                                        if (isTrue(item.address)) {
                                            _cE("text", _uM("key" to 0, "class" to "address"), _tD(if (isTruthy(item.address)) {
                                                item.address
                                            } else {
                                                "加载中..."
                                            }), 1)
                                        } else {
                                            _cE("text", _uM("key" to 1, "onClick" to fun(){
                                                showAddress(item.latitude, item.longitude)
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#f5f7fa")), "tools-panel" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#69c2f1", "borderRightColor" to "#69c2f1", "borderBottomColor" to "#69c2f1", "borderLeftColor" to "#69c2f1", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "Datetime-box" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "date-box" to _uM(".container .tools-panel .Datetime-box " to _uM("width" to "100%", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "Date" to _uM(".container .tools-panel .Datetime-box .date-box " to _uM("fontSize" to "25rpx", "borderTopLeftRadius" to "5rpx", "borderTopRightRadius" to "5rpx", "borderBottomRightRadius" to "5rpx", "borderBottomLeftRadius" to "5rpx")), "mileage_title" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "40rpx", "marginBottom" to 0, "marginLeft" to "40rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "content" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "40rpx", "marginBottom" to "20rpx", "marginLeft" to "40rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "column", "justifyContent" to "flex-start", "alignItems" to "flex-start", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "15rpx", "borderTopRightRadius" to "15rpx", "borderBottomRightRadius" to "15rpx", "borderBottomLeftRadius" to "15rpx")), "content-box" to _uM(".container " to _uM("height" to "80%")), "item" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "15rpx", "paddingRight" to 0, "paddingBottom" to "15rpx", "paddingLeft" to 0)), "icons" to _uM(".container .content .item " to _uM("width" to "40rpx", "height" to "40rpx", "marginRight" to "15rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
