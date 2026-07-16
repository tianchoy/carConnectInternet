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
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesMileageRecordMileageRecord : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesMileageRecordMileageRecord) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesMileageRecordMileageRecord
            val _cache = __ins.renderCache
            val carStatus = ref("在线")
            val plateNo = ref("")
            val carType = ref("")
            val totalMileage = ref(0)
            val averageSpeed = ref(0)
            val tripData = ref(_uA<Any>())
            val showDateTimePicker = ref(false)
            val currentPickerType = ref("start")
            val pickerTitle = ref("选择开始时间")
            val startTime = ref("")
            val endTime = ref("")
            val imei = ref<String?>("")
            val groupedTrips = computed(fun(): UTSArray<GroupType> {
                val groups = _uA<GroupType>()
                val tripsByDate: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("tripsByDate", "pages/mileageRecord/mileageRecord.uvue", 93, 9))
                tripData.value.forEach(fun(trip){
                    val startTimeStr = if (trip.startTime != null) {
                        trip.startTime.toString()
                    } else {
                        ""
                    }
                    val endTimeStr = if (trip.endTime != null) {
                        trip.endTime.toString()
                    } else {
                        ""
                    }
                    val startTimeParts = startTimeStr.split(" ")
                    val endTimeParts = endTimeStr.split(" ")
                    val date = if (startTimeParts.length > 0 && startTimeParts[0].length > 0) {
                        startTimeParts[0]
                    } else {
                        "未知日期"
                    }
                    if (!isTruthy(tripsByDate[date])) {
                        tripsByDate[date] = _uA()
                    }
                    val startHour = if (startTimeParts.length > 1) {
                        startTimeParts[1]
                    } else {
                        ""
                    }
                    val endHour = if (endTimeParts.length > 1) {
                        endTimeParts[1]
                    } else {
                        ""
                    }
                    tripsByDate[date].push(UTSJSONObject.assign(_uO(), trip, _uO("startHour" to startHour, "endHour" to endHour)))
                }
                )
                for(date in resolveUTSKeyIterator(tripsByDate)){
                    val trips = tripsByDate[date]
                    var totalDistance: Number = 0
                    val sortedTrips = trips.sort(fun(a, b): Number {
                        return Date(b.startTime).getTime() - Date(a.startTime).getTime()
                    }
                    )
                    sortedTrips.forEach(fun(trip){
                        totalDistance += if (isTruthy(trip.distance)) {
                            trip.distance
                        } else {
                            0
                        }
                    }
                    )
                    groups.push(GroupType(date = date, trips = sortedTrips, totalDistance = totalDistance))
                }
                return groups.sort(fun(a, b): Number {
                    return Date(b.date).getTime() - Date(a.date).getTime()
                }
                )
            }
            )
            val totalTrips = computed(fun(): Number {
                return tripData.value.length
            }
            )
            onMounted(fun(){
                initDateTime()
                loadMileageData()
            }
            )
            onLoad(fun(option){
                imei.value = option["imei"]
                carStatus.value = option["connectionStatus"]
                plateNo.value = option["plateNo"]
                carType.value = option["carType"]
            }
            )
            val gotoTripDetail = fun(startTime: String, endTime: String){
                uni_navigateTo(NavigateToOptions(url = "/pages/playBack/playBack?startTime=" + startTime + "&endTime=" + endTime + "&imei=" + imei.value + "&connectionStatus=" + carStatus.value + "&plateNo=" + plateNo.value + "&carType=" + carType.value))
            }
            val loadMileageData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                        if (!isTruthy(imei.value)) {
                            return@w1
                        }
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/mileageRecord/mileageRecord.uvue", 174, 10), "imei" to imei.value, "startTime" to startTime.value, "endTime" to endTime.value, "minParkTime" to 120, "withStop" to false, "withPos" to false, "withTrip" to true)
                            val res = await(getTrackPos(data))
                            console.log("获取里程数据成功:", res, " at pages/mileageRecord/mileageRecord.uvue:184")
                            if (isTruthy(res) && isTruthy(res.data)) {
                                await(processTripData(res.data))
                            }
                        }
                         catch (e: Throwable) {
                            console.error("获取里程数据失败:", e, " at pages/mileageRecord/mileageRecord.uvue:189")
                            uni_showToast(ShowToastOptions(title = "数据加载失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val processTripData = fun(data: Any): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (isTruthy(data.trips) && data.trips.length > 0) {
                            val processedTrips = await(UTSPromise.all(data.trips.map(fun(trip: Any): UTSPromise<Any> {
                                return wrapUTSPromise(suspend w2@{
                                        return@w2 UTSJSONObject.assign(_uO(), trip, _uO("startAddress" to "查看位置", "endAddress" to "查看位置"))
                                })
                            })))
                            tripData.value = processedTrips
                            var totalDistance: Number = 0
                            var totalDuration: Number = 0
                            var totalAvgSpeed: Number = 0
                            processedTrips.forEach(fun(trip: Any){
                                totalDistance += if (isTruthy(trip.distance)) {
                                    trip.distance
                                } else {
                                    0
                                }
                                totalDuration += if (isTruthy(trip.duration)) {
                                    trip.duration
                                } else {
                                    0
                                }
                                totalAvgSpeed += if (isTruthy(trip.averageSpeed)) {
                                    trip.averageSpeed
                                } else {
                                    0
                                }
                            })
                            totalMileage.value = totalDistance
                            averageSpeed.value = if (processedTrips.length > 0) {
                                totalAvgSpeed / processedTrips.length
                            } else {
                                0
                            }
                        } else {
                            tripData.value = _uA()
                            totalMileage.value = 0
                            averageSpeed.value = 0
                        }
                })
            }
            val formatDisplayTime = fun(timeString: String): String {
                if (!(timeString != "")) {
                    return "选择时间"
                }
                return timeString
            }
            val formatDuration = fun(milliseconds: Number): String {
                val seconds = Math.floor(milliseconds / 1000)
                val hours = Math.floor(seconds / 3600)
                val minutes = Math.floor((seconds % 3600) / 60)
                if (hours > 0) {
                    return "" + hours + "小时" + minutes + "分"
                } else if (minutes > 0) {
                    return "" + minutes + "分钟"
                } else {
                    return "" + seconds % 60 + "秒"
                }
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
                showDateTimePicker.value = false
                loadMileageData()
            }
            val onCancel = fun(){
                showDateTimePicker.value = false
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker", GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePickerClass)
                val _component_l_popup = resolveEasyComponent("l-popup", GenUniModulesLimePopupComponentsLPopupLPopupClass)
                val _component_i_empty = resolveEasyComponent("i-empty", GenUniModulesIUiXComponentsIEmptyIEmptyClass)
                val _component_i_tag = resolveEasyComponent("i-tag", GenUniModulesIUiXComponentsITagITagClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "里程记录", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "tools-panel"), _uA(
                        _cE("view", _uM("class" to "Datetime-box"), _uA(
                            _cE("view", _uM("class" to "date-box"), _uA(
                                _cV(_component_i_icon, _uM("name" to "/static/rili.png", "fontSize" to "15")),
                                _cE("text", _uM("class" to "Date", "onClick" to fun(){
                                    showPicker("start")
                                }
                                ), _tD(formatDisplayTime(startTime.value)), 9, _uA(
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
                                ), _tD(formatDisplayTime(endTime.value)), 9, _uA(
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
                    _cE("view", _uM("class" to "summary-panel"), _uA(
                        _cE("view", _uM("class" to "summary-item"), _uA(
                            _cE("text", _uM("class" to "label"), "总里程"),
                            _cE("text", _uM("class" to "value"), _tD((totalMileage.value / 1000).toFixed(2)) + " Km", 1)
                        )),
                        _cE("view", _uM("class" to "summary-item"), _uA(
                            _cE("text", _uM("class" to "label"), "行程次数"),
                            _cE("text", _uM("class" to "value"), _tD(totalTrips.value) + " 次", 1)
                        )),
                        _cE("view", _uM("class" to "summary-item"), _uA(
                            _cE("text", _uM("class" to "label"), "平均速度"),
                            _cE("text", _uM("class" to "value"), _tD(averageSpeed.value.toFixed(1)) + " km/h", 1)
                        ))
                    )),
                    _cE("view", _uM("class" to "content"), _uA(
                        if (groupedTrips.value.length == 0) {
                            _cV(_component_i_empty, _uM("key" to 0, "text" to "当前时间点暂无行程数据", "showButton" to false, "description" to ""))
                        } else {
                            _cE("view", _uM("key" to 1, "class" to "trip-list"), _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(groupedTrips.value, fun(group, groupIndex, __index, _cached): Any {
                                    return _cE("view", _uM("key" to groupIndex, "class" to "trip-group"), _uA(
                                        _cE("view", _uM("class" to "group-header"), _uA(
                                            _cE("view", _uM("class" to "group-header-title"), _uA(
                                                _cE("text", _uM("class" to "group-date"), _tD(group.date), 1),
                                                _cV(_component_i_tag, _uM("text" to (group.trips.length + "段"), "type" to "success", "size" to "small"), null, 8, _uA(
                                                    "text"
                                                ))
                                            )),
                                            _cE("text", null, "里程 " + _tD((group.totalDistance / 1000).toFixed(2)) + " km", 1)
                                        )),
                                        _cE("view", _uM("class" to "group-separator")),
                                        _cE(Fragment, null, RenderHelpers.renderList(group.trips, fun(item, index, __index, _cached): Any {
                                            return _cE("view", _uM("key" to index, "class" to "trip-item", "onClick" to fun(){
                                                gotoTripDetail(item.startTime, item.endTime)
                                            }
                                            ), _uA(
                                                _cE("view", _uM("class" to "trip-index"), _uA(
                                                    _cE("text", _uM("class" to "icon"), _tD(index + 1), 1),
                                                    _cE("view", _uM("class" to "trip-distance-time"), _uA(
                                                        _cE("text", null, _tD(item.startHour) + "-" + _tD(item.endHour), 1),
                                                        _cE("text", null, _tD((item.distance / 1000).toFixed(2)) + " km", 1),
                                                        _cE("text", null, _tD(formatDuration(item.duration)), 1)
                                                    ))
                                                ))
                                            ), 8, _uA(
                                                "onClick"
                                            ))
                                        }
                                        ), 128)
                                    ))
                                }
                                ), 128)
                            ))
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#f5f7fa", "paddingBottom" to "20rpx")), "tools-panel" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#69c2f1", "borderRightColor" to "#69c2f1", "borderBottomColor" to "#69c2f1", "borderLeftColor" to "#69c2f1", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "Datetime-box" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "date-box" to _uM(".container .tools-panel .Datetime-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "Date" to _uM(".container .tools-panel .Datetime-box .date-box " to _uM("fontSize" to "25rpx", "borderTopLeftRadius" to "5rpx", "borderTopRightRadius" to "5rpx", "borderBottomRightRadius" to "5rpx", "borderBottomLeftRadius" to "5rpx", "color" to "#333333")), "summary-panel" to _uM(".container " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-around", "backgroundColor" to "#ffffff", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "15rpx", "borderTopRightRadius" to "15rpx", "borderBottomRightRadius" to "15rpx", "borderBottomLeftRadius" to "15rpx", "boxShadow" to "0 2rpx 10rpx rgba(0, 0, 0, 0.05)")), "summary-item" to _uM(".container .summary-panel " to _uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center")), "label" to _uM(".container .summary-panel .summary-item " to _uM("fontSize" to "24rpx", "color" to "#999999", "marginBottom" to "10rpx")), "value" to _uM(".container .summary-panel .summary-item " to _uM("fontSize" to "28rpx", "color" to "#333333", "fontWeight" to "bold")), "content" to _uM(".container " to _uM("marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to 0, "marginLeft" to "20rpx", "overflowY" to "auto", "WebkitOverflowScrolling" to "touch", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "trip-list" to _uM(".container .content " to _uM("width" to "100%")), "trip-group" to _uM(".container .content .trip-list " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "15rpx", "borderTopRightRadius" to "15rpx", "borderBottomRightRadius" to "15rpx", "borderBottomLeftRadius" to "15rpx")), "group-header" to _uM(".container .content .trip-list .trip-group " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "15rpx", "paddingRight" to 0, "paddingBottom" to "15rpx", "paddingLeft" to 0)), "group-header-title" to _uM(".container .content .trip-list .trip-group .group-header " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "group-date" to _uM(".container .content .trip-list .trip-group .group-header " to _uM("fontSize" to "30rpx", "color" to "#333333", "marginRight" to "30rpx")), "group-separator" to _uM(".container .content .trip-list .trip-group " to _uM("height" to "1rpx", "backgroundColor" to "#eeeeee", "marginTop" to "10rpx", "marginRight" to 0, "marginBottom" to "10rpx", "marginLeft" to 0)), "trip-item" to _uM(".container .content .trip-list .trip-group " to _uM("display" to "flex", "paddingTop" to "25rpx", "paddingRight" to 0, "paddingBottom" to "25rpx", "paddingLeft" to 0, "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f5f5f5")), "trip-index" to _uM(".container .content .trip-list .trip-group .trip-item " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "5rpx")), "icon" to _uM(".container .content .trip-list .trip-group .trip-item .trip-index " to _uM("width" to "40rpx", "height" to "40rpx", "backgroundColor" to "#1296db", "color" to "#ffffff", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "display" to "flex", "justifyContent" to "center", "alignItems" to "center", "fontSize" to "24rpx", "marginRight" to "20rpx")), "trip-distance-time" to _uM(".container .content .trip-list .trip-group .trip-item .trip-index " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "trip-content" to _uM(".container .content .trip-list .trip-group .trip-item " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "icons" to _uM(".container .content .trip-list .trip-group .trip-item .trip-content .trip-locations " to _uM("width" to "50rpx", "height" to "50rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
