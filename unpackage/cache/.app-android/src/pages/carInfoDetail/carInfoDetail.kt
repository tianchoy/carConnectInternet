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
import io.dcloud.uniapp.extapi.getStorageSync as uni_getStorageSync
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.openLocation as uni_openLocation
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesCarInfoDetailCarInfoDetail : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesCarInfoDetailCarInfoDetail) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesCarInfoDetailCarInfoDetail
            val _cache = __ins.renderCache
            val deptId = ref<String?>("")
            val imei = ref<String?>("")
            val deviceId = ref<String?>("")
            val center = reactive<MapCenter>(MapCenter(latitude = 39.90469, longitude = 116.40717))
            val mapScale = ref(15)
            val datainfo = ref(_uO())
            val address = ref("")
            val currentTime = ref("5s")
            val onCurrentTimeChange = fun(value: String){
                currentTime.value = value
            }
            val times = ref(_uA(
                _uA(
                    _uO("label" to "5s", "value" to "5"),
                    _uO("label" to "10s", "value" to "10"),
                    _uO("label" to "20s", "value" to "20"),
                    _uO("label" to "30s", "value" to "30"),
                    _uO("label" to "停止刷新", "value" to "0")
                )
            ))
            val refreshTimer = ref<Number?>(null)
            val isRefreshing = ref(false)
            val popupRef = ref(false)
            val psw = ref("")
            val currentOperation = ref(0)
            val modalTitle = ref("验证密码")
            val userType = ref("")
            val filterNonLatin = fun(value: String){
                psw.value = value.replace(UTSRegExp("[^\\u0000-\\u007F]", "g"), "")
            }
            val markers = ref(_uA<Any>())
            val showDevicePopup = ref(false)
            val currentDeviceInfo = ref(_uO("deviceName" to "", "carNumber" to "", "deviceSerial" to "", "locationType" to "", "lngLat" to "", "updateTime" to "", "locationTime" to "", "speed" to "", "totalMileage" to "", "address" to ""))
            val currentCarInfo = ref(_uO())
            val signalRssi = computed<Any?>(fun(): Any? {
                val attribute = currentCarInfo.value["attribute"] as UTSJSONObject?
                return if (attribute != null) {
                    attribute["rssi"] as Any?
                } else {
                    null
                }
            }
            )
            val signalSat = computed<Any?>(fun(): Any? {
                val attribute = currentCarInfo.value["attribute"] as UTSJSONObject?
                return if (attribute != null) {
                    attribute["sat"] as Any?
                } else {
                    null
                }
            }
            )
            val carVoltage = computed<Any?>(fun(): Any? {
                return currentCarInfo.value["voltage"] as Any?
            }
            )
            val batteryPercent = computed<Any?>(fun(): Any? {
                return datainfo.value["batteryPercent"] as Any?
            }
            )
            val getBatteryColor = fun(batteryPercent: Any?): String {
                if (batteryPercent == null || batteryPercent == "") {
                    return "#c9c9c9"
                }
                val batteryValue = parseFloat(batteryPercent.toString())
                if (batteryValue >= 70) {
                    return "#07C160"
                } else if (batteryValue >= 30) {
                    return "#FF9C19"
                } else if (batteryValue >= 10) {
                    return "#FF6B00"
                } else {
                    return "#FF0000"
                }
            }
            fun getSignalDetail(rssi: Any?): SignalDetail {
                if (rssi == null || rssi == "") {
                    return SignalDetail(experience = "无信号", quality = "无服务", color = "#999", level = 0)
                }
                val signalValue = parseFloat(rssi.toString())
                if (isNaN(signalValue)) {
                    return SignalDetail(experience = "信号数据无效", quality = "无服务", color = "#999", level = 0)
                }
                if (signalValue >= 26) {
                    return SignalDetail(experience = "极好", quality = "极强", color = "#07C160", level = 5)
                } else if (signalValue >= 20) {
                    return SignalDetail(experience = "良好", quality = "强", color = "#52c41a", level = 4)
                } else if (signalValue >= 15) {
                    return SignalDetail(experience = "一般", quality = "中等", color = "#faad14", level = 3)
                } else if (signalValue >= 10) {
                    return SignalDetail(experience = "差", quality = "较弱", color = "#fa8c16", level = 2)
                } else if (signalValue >= 1) {
                    return SignalDetail(experience = "非常差", quality = "微弱", color = "#f5222d", level = 1)
                } else {
                    return SignalDetail(experience = "无信号", quality = "无服务", color = "#999", level = 0)
                }
            }
            val getMobileSignalBarClass = fun(barIndex: Number, rssi: Any?): String {
                if (rssi == null || rssi == "") {
                    return "bar-off"
                }
                val signalValue = parseFloat(rssi.toString())
                if (isNaN(signalValue)) {
                    return "bar-off"
                }
                val signalDetail = getSignalDetail(signalValue)
                val level = signalDetail.level
                return if (barIndex < level) {
                    "bar-active"
                } else {
                    "bar-off"
                }
            }
            val createMarker = fun(id: Number, lat: Number, lng: Number, type: String, title: String?): UTSJSONObject {
                val connectionStatus = datainfo.value["connectionStatus"] as String?
                val carType = currentCarInfo.value["carType"] as String?
                val marker: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("marker", "pages/carInfoDetail/carInfoDetail.uvue", 303, 9), "id" to id, "latitude" to lat, "longitude" to lng, "width" to 25, "height" to 25, "iconPath" to getDeviceIcon(connectionStatus ?: "", carType ?: ""), "callout" to _uO("content" to if (isTruthy(title)) {
                    title
                } else {
                    "爱车位置"
                }
                , "color" to if (connectionStatus == "online") {
                    "#fff"
                } else {
                    "#666"
                }
                , "borderRadius" to 10, "bgColor" to if (connectionStatus == "online") {
                    "#07C160"
                } else {
                    "#ccc"
                }
                , "padding" to 5, "display" to "ALWAYS"))
                return marker
            }
            val delay = fun(ms: Number): UTSPromise<Unit> {
                return UTSPromise(fun(resolve, _reject){
                    setTimeout(fun(){
                        resolve(Unit)
                    }
                    , ms)
                }
                )
            }
            val loadData = fun(data: UTSJSONObject, retryCount: Number): UTSPromise<Boolean> {
                return wrapUTSPromise(suspend w1@{
                        var retry = retryCount
                        val tryLoad = fun(attempt: Number): UTSPromise<Boolean> {
                            return wrapUTSPromise(suspend w2@{
                                    try {
                                        val res = await(getDevicePos(data))
                                        if (!(res != null) || !(res.data != null) || res.data.length === 0) {
                                            throw UTSError("返回数据为空")
                                        }
                                        console.log("接口请求成功", attempt, " at pages/carInfoDetail/carInfoDetail.uvue:343")
                                        var foundDevice = false
                                        for(item in resolveUTSValueIterator(res.data)){
                                            val itemImei = item["imei"] as String?
                                            if (itemImei != null && itemImei == imei.value) {
                                                foundDevice = true
                                                datainfo.value = item
                                                val latitude = item["latitude"] as Any?
                                                val longitude = item["longitude"] as Any?
                                                if (latitude == null || longitude == null || latitude.toString().length == 0 || longitude.toString().length == 0) {
                                                    console.error("位置信息缺失", item, " at pages/carInfoDetail/carInfoDetail.uvue:359")
                                                    uni_showToast(ShowToastOptions(title = "位置信息缺失", icon = "none"))
                                                    return@w2 false
                                                }
                                                val lat = parseFloat(latitude.toString())
                                                val lng = parseFloat(longitude.toString())
                                                if (isNaN(lat) || isNaN(lng)) {
                                                    console.error("经纬度格式错误", latitude, longitude, " at pages/carInfoDetail/carInfoDetail.uvue:372")
                                                    return@w2 false
                                                }
                                                var convertedLat: Number = lat
                                                var convertedLng: Number = lng
                                                try {
                                                    val coord = CoordTransform.wgs84ToTencent(lat, lng)
                                                    convertedLat = coord.lat
                                                    convertedLng = coord.lng
                                                    console.log("坐标转换结果:", coord, " at pages/carInfoDetail/carInfoDetail.uvue:383")
                                                }
                                                 catch (transformError: Throwable) {
                                                    console.error("坐标转换失败:", transformError, " at pages/carInfoDetail/carInfoDetail.uvue:385")
                                                }
                                                center.latitude = convertedLat
                                                center.longitude = convertedLng
                                                console.log("地图中心点更新:", _uO("latitude" to center.latitude, "longitude" to center.longitude), " at pages/carInfoDetail/carInfoDetail.uvue:391")
                                                await(delay(50))
                                                val deviceMarker = createMarker(1, convertedLat, convertedLng, "device", currentCarInfo.value["deviceName"] as String?)
                                                markers.value = _uA()
                                                await(delay(50))
                                                markers.value = _uA(
                                                    deviceMarker
                                                )
                                                console.log("标记点更新完成", " at pages/carInfoDetail/carInfoDetail.uvue:413")
                                                val connectionStatus = item["connectionStatus"] as String?
                                                if (connectionStatus != "online" && refreshTimer.value != null) {
                                                    val timer = refreshTimer.value!!
                                                    if (timer != null) {
                                                        clearInterval(timer)
                                                    }
                                                    refreshTimer.value = null
                                                    isRefreshing.value = false
                                                    uni_showToast(ShowToastOptions(title = "设备已离线，停止自动刷新", icon = "none"))
                                                }
                                                val attribute = item["attribute"] as UTSJSONObject?
                                                val rssi = if (attribute != null) {
                                                    attribute["rssi"]
                                                } else {
                                                    null
                                                }
                                                if (rssi != null) {
                                                    val signalExp = getSignalDetail(rssi as Any).experience
                                                    if (signalExp === "差" || signalExp === "非常差" || signalExp === "无信号") {
                                                        console.warn("设备 " + imei.value!! + " 信号较弱: " + rssi + "dBm", " at pages/carInfoDetail/carInfoDetail.uvue:436")
                                                    }
                                                }
                                            }
                                        }
                                        if (!foundDevice) {
                                            throw UTSError("未找到对应的设备数据")
                                        }
                                        return@w2 true
                                    }
                                     catch (error: Throwable) {
                                        console.error("第" + attempt + "次加载设备数据失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:450")
                                        if (attempt < retry) {
                                            val delayMs = Math.pow(2, attempt) * 1000
                                            console.log("等待" + delayMs / 1000 + "秒后重试...", " at pages/carInfoDetail/carInfoDetail.uvue:456")
                                            await(delay(delayMs))
                                            return@w2 false
                                        } else {
                                            uni_showToast(ShowToastOptions(title = "数据加载失败，请稍后重试", icon = "none", duration = 2000))
                                            if (datainfo.value["connectionStatus"] == "online" && refreshTimer.value != null) {
                                                val timer = refreshTimer.value!!
                                                if (timer != null) {
                                                    clearInterval(timer)
                                                }
                                                refreshTimer.value = null
                                                isRefreshing.value = false
                                                uni_showToast(ShowToastOptions(title = "数据加载失败，停止自动刷新", icon = "none"))
                                            }
                                            return@w2 false
                                        }
                                    }
                            })
                        }
                        return@w1 tryLoad(1)
                })
            }
            val setupAutoRefresh = fun(intervalValue: String){
                if (refreshTimer.value != null) {
                    val timer = refreshTimer.value!!
                    if (timer != null) {
                        clearInterval(timer)
                    }
                    refreshTimer.value = null
                    isRefreshing.value = false
                }
                if (intervalValue == "0") {
                    isRefreshing.value = false
                    return
                }
                if (datainfo.value["connectionStatus"] != "online") {
                    isRefreshing.value = false
                    return
                }
                val intervalSeconds = parseInt(intervalValue)
                if (intervalSeconds > 0) {
                    isRefreshing.value = true
                    val intervalMs = intervalSeconds * 1000
                    loadData(_uO("deptId" to deptId.value, "deviceids" to imei.value), 3)
                    refreshTimer.value = setInterval(fun(){
                        loadData(_uO("deptId" to deptId.value, "deviceids" to imei.value), 3)
                    }
                    , intervalMs) as Number
                }
            }
            watch(currentTime, fun(newVal: String){
                setupAutoRefresh(newVal)
            }
            )
            val stopAutoRefresh = fun(){
                if (refreshTimer.value != null) {
                    val timer = refreshTimer.value!!
                    if (timer != null) {
                        clearInterval(timer)
                    }
                    refreshTimer.value = null
                    isRefreshing.value = false
                }
            }
            val baseList = computed(fun(): UTSArray<UTSJSONObject> {
                val list = __uts_large_list_build_0()
                val productId = currentCarInfo.value["productId"]
                if (productId === "product-1141811865601576960" || productId === "product-1183161303028600832") {
                    list.push(_uO("image" to "/static/cmd.png", "text" to "发送指令"))
                }
                return list
            }
            )
            fun gen_executeOperation_fn(operationType: Number): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        var predictCmdId: Number = 0
                        var type: Number = 0
                        if (operationType == 1) {
                            predictCmdId = 2
                            type = 2
                        } else if (operationType == 2) {
                            predictCmdId = 1
                            type = 1
                        } else {
                            uni_showToast(ShowToastOptions(title = "操作类型错误", icon = "none"))
                            return@w1
                        }
                        try {
                            uni_showLoading(ShowLoadingOptions(title = "执行中...", mask = true))
                            val res = await(sendCommand(_uO("imei" to imei.value, "password" to if (userType.value == "1") {
                                psw.value
                            } else {
                                ""
                            }
                            , "params" to _uA(
                                "1111"
                            ), "predictCmdId" to predictCmdId, "type" to type)))
                            uni_hideLoading(null)
                            if (res.code == 0) {
                                uni_showToast(ShowToastOptions(title = if (operationType == 1) {
                                    "恢复油电成功"
                                } else {
                                    "断开油电成功"
                                }, icon = "success"))
                                psw.value = ""
                            } else {
                                uni_showToast(ShowToastOptions(title = if (res.msg.length > 0) {
                                    res.msg
                                } else {
                                    "操作失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            uni_hideLoading(null)
                            console.error("操作失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:696")
                            uni_showToast(ShowToastOptions(title = "操作失败，请重试", icon = "none"))
                        }
                })
            }
            val executeOperation = ::gen_executeOperation_fn
            val confirm = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (userType.value == "1" && psw.value == "") {
                            uni_showToast(ShowToastOptions(title = "请输入密码", icon = "none"))
                            return@w1
                        }
                        executeOperation(currentOperation.value)
                })
            }
            val carDetail = fun(){
                stopAutoRefresh()
                uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId.value))
            }
            val refreshAdress = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val addr = await(getAddress(center.latitude, center.longitude))
                        address.value = addr.result.formatted_address
                })
            }
            fun gen_navTo_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (!(address.value != "")) {
                            await(refreshAdress())
                        }
                        uni_openLocation(OpenLocationOptions(latitude = center.latitude, longitude = center.longitude, name = address.value, scale = 18, success = fun(_){
                            uni_showToast(ShowToastOptions(title = "成功调起地图", icon = "none"))
                        }
                        , fail = fun(err){
                            uni_showToast(ShowToastOptions(title = "调起地图失败", icon = "none"))
                            console.error("调起地图失败:", err, " at pages/carInfoDetail/carInfoDetail.uvue:754")
                        }
                        ))
                })
            }
            val navTo = ::gen_navTo_fn
            val handleGridClick = fun(event: Any){
                val name = event as UTSJSONObject
                console.log(name, " at pages/carInfoDetail/carInfoDetail.uvue:762")
                val itemTo = name["text"]
                if (itemTo == "轨迹回放") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value["connectionStatus"] + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"] + "&lat=" + datainfo.value["latitude"] + "&lng=" + datainfo.value["longitude"]))
                }
                if (itemTo == "车辆跟踪") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&deptId=" + deptId.value + "&connectionStatus=" + datainfo.value["connectionStatus"] + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"]))
                }
                if (itemTo == "里程记录") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/mileageRecord/mileageRecord?imei=" + imei.value + "&connectionStatus=" + datainfo.value["connectionStatus"] + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"]))
                }
                if (itemTo == "停车记录") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/stopRecord/stopRecord?imei=" + imei.value + "&deptId=" + deptId.value))
                }
                if (itemTo == "恢复油电") {
                    if (userType.value == "1") {
                        psw.value = ""
                        currentOperation.value = 1
                        modalTitle.value = "验证密码"
                        popupRef.value = true
                    } else {
                        executeOperation(1)
                    }
                }
                if (itemTo == "断开油电") {
                    if (userType.value == "1") {
                        psw.value = ""
                        currentOperation.value = 2
                        modalTitle.value = "验证密码"
                        popupRef.value = true
                    } else {
                        executeOperation(2)
                    }
                }
                if (itemTo == "电子围栏") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/geofencing/geofencing?imei=" + imei.value + "&connectionStatus=" + datainfo.value["connectionStatus"] + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"] + "&deptId=" + deptId.value + "&deviceName=" + currentCarInfo.value["deviceName"]))
                }
                if (itemTo == "一键寻车") {
                    navTo()
                }
                if (itemTo == "发送指令") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/cmd/cmd?imei=" + imei.value))
                }
            }
            val loadDeviceDetail = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (deviceId.value != null) {
                            val res = await(getDeviceDetail(deviceId.value!!))
                            console.log("设备详情：", res.data, " at pages/carInfoDetail/carInfoDetail.uvue:836")
                            currentCarInfo.value = res.data
                        } else {
                            console.error("设备id获取失败", " at pages/carInfoDetail/carInfoDetail.uvue:839")
                        }
                })
            }
            onLoad(fun(option){
                deptId.value = option["deptId"]
                imei.value = option["imei"]
                deviceId.value = option["deviceId"]
                val storedUserType = uni_getStorageSync("userType") as String?
                userType.value = storedUserType ?: ""
                watch(center, fun(newVal: UTSJSONObject, oldVal: UTSJSONObject){
                    console.log("center 变化:", _uO("old" to oldVal, "new" to newVal, "time" to Date().toISOString()), " at pages/carInfoDetail/carInfoDetail.uvue:852")
                }
                , WatchOptions(deep = true))
                loadDeviceDetail().then(fun(){
                    val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/carInfoDetail/carInfoDetail.uvue", 860, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                    uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                    loadData(data, 3).then(fun(success: Boolean){
                        uni_hideLoading(null)
                        if (success && datainfo.value["connectionStatus"] == "online") {
                            setupAutoRefresh(currentTime.value)
                        }
                    }
                    )
                }
                )
            }
            )
            onShow(fun(){
                console.log("页面显示，检查自动刷新状态", " at pages/carInfoDetail/carInfoDetail.uvue:882")
                if (datainfo.value["connectionStatus"] == "online" && !isRefreshing.value) {
                    setupAutoRefresh(currentTime.value)
                }
            }
            )
            onHide(fun(){
                console.log("页面隐藏时停止自动刷新", " at pages/carInfoDetail/carInfoDetail.uvue:891")
                stopAutoRefresh()
            }
            )
            onUnmounted(fun(){
                console.log("页面卸载时停止自动刷新", " at pages/carInfoDetail/carInfoDetail.uvue:896")
                stopAutoRefresh()
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_grid = resolveEasyComponent("i-grid", GenUniModulesIUiXComponentsIGridIGridClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_modal = resolveEasyComponent("i-modal", GenUniModulesIUiXComponentsIModalIModalClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "详情", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "map-container"), _uA(
                        _cV(_component_map, _uM("id" to "myMap", "latitude" to unref(center).latitude, "longitude" to unref(center).longitude, "markers" to unref(markers), "scale" to unref(mapScale), "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_sub_navBar, _uM("currentTime" to unref(currentTime), "showTime" to true, "showPickerTime" to false, "onUpdate:currentTime" to onCurrentTimeChange, "currentCar" to unref(currentCarInfo)["plateNo"], "times" to unref(times), "carStatus" to unref(datainfo)["connectionStatus"], "showPicker" to false, "showCar" to true), null, 8, _uA(
                                    "currentTime",
                                    "currentCar",
                                    "times",
                                    "carStatus"
                                ))
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "latitude",
                            "longitude",
                            "markers",
                            "scale",
                            "style"
                        ))
                    )),
                    _cE("view", _uM("class" to "tools-panel"), _uA(
                        _cE("view", _uM("class" to "Imei-box"), _uA(
                            _cE("view", _uM("class" to "imei-info", "onClick" to carDetail), _uA(
                                _cE("view", _uM("class" to "imeis"), _uA(
                                    _cE("text", null, "ID: " + _tD(unref(imei)), 1),
                                    _cE("text", _uM("class" to "pos-time"))
                                )),
                                _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "16"))
                            )),
                            _cE("view", _uM("class" to "pos-date"), _uA(
                                _cE("view", _uM("class" to "addree-box"), "定位时间: " + _tD(unref(datainfo)["positionUpdateTime"]), 1),
                                _cE("view", _uM("class" to "addree-box"), "通信时间: " + _tD(unref(datainfo)["signalUpdateTime"]), 1)
                            )),
                            _cE("view", _uM("class" to "pos-adress"), _uA(
                                _cE("view", _uM("class" to "addree-box"), _uA(
                                    _cE("text", _uM("style" to _nS(_uM("margin-right" to "10rpx"))), "当前地址:", 4),
                                    if (isTrue(unref(address))) {
                                        _cE("text", _uM("key" to 0, "class" to "address-text"), _tD(unref(address)), 1)
                                    } else {
                                        _cE("text", _uM("key" to 1), _tD(unref(center).latitude) + " , " + _tD(unref(center).longitude), 1)
                                    }
                                    ,
                                    if (isTrue(!(unref(address) != ""))) {
                                        _cE("text", _uM("key" to 2, "style" to _nS(_uM("color" to "#007AFF", "margin-left" to "20rpx", "font-weight" to "bold")), "onClick" to refreshAdress), "中文地址", 4)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            )),
                            if (isTrue(if (isTruthy(unref(signalRssi))) {
                                unref(signalRssi)
                            } else {
                                unref(signalSat)
                            }
                            )) {
                                _cE("view", _uM("key" to 0, "class" to "signal-container"), _uA(
                                    if (isTrue(unref(signalRssi))) {
                                        _cE("view", _uM("key" to 0, "class" to "signal-item"), _uA(
                                            _cE("view", _uM("class" to "mobile-signal"), _uA(
                                                _cE("view", _uM("class" to "signal-bars-horizontal", "style" to _nS(_uM("--signal-color" to getSignalDetail(unref(signalRssi)).color))), _uA(
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h signal-bar-h-1",
                                                        getMobileSignalBarClass(0, unref(signalRssi))
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h signal-bar-h-2",
                                                        getMobileSignalBarClass(1, unref(signalRssi))
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h signal-bar-h-3",
                                                        getMobileSignalBarClass(2, unref(signalRssi))
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h signal-bar-h-4",
                                                        getMobileSignalBarClass(3, unref(signalRssi))
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h signal-bar-h-5",
                                                        getMobileSignalBarClass(4, unref(signalRssi))
                                                    ))), null, 2)
                                                ), 4),
                                                _cE("view", _uM("class" to "signal-info-h"), _uA(
                                                    _cE("text", _uM("class" to "experience", "style" to _nS(_uM("color" to getSignalDetail(unref(signalRssi)).color))), _tD(getSignalDetail(unref(signalRssi)).experience), 5),
                                                    _cE("text", _uM("class" to "signal-value", "style" to _nS(_uM("color" to getSignalDetail(unref(signalRssi)).color))), "CSQ " + _tD(unref(signalRssi)), 5)
                                                ))
                                            ))
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(signalSat))) {
                                        _cE("view", _uM("key" to 1, "class" to "satellite-item-h"), _uA(
                                            _cE("image", _uM("class" to "satellite-icon", "src" to "/static/sate.png")),
                                            _cE("text", _uM("class" to "satellite-text"), _tD(unref(signalSat)), 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(carVoltage))) {
                                        _cE("view", _uM("key" to 2, "class" to "power"), _uA(
                                            _cE("image", _uM("class" to "power-icon", "src" to "/static/v.png")),
                                            _cE("text", null, _tD(unref(carVoltage)) + "V", 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(batteryPercent))) {
                                        _cE("view", _uM("key" to 3, "class" to "battery", "style" to _nS(_uM("color" to getBatteryColor(unref(batteryPercent))))), _uA(
                                            _cE("image", _uM("class" to "battery-icon", "src" to "/static/pow.png", "alt" to "")),
                                            _cE("text", null, _tD(unref(batteryPercent)) + "%", 1)
                                        ), 4)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        )),
                        _cV(_component_i_grid, _uM("items" to unref(baseList), "col" to 5, "itemHeight" to "88", "round" to "8", "imageSize" to 30, "iconColor" to "#3c9cff", "textColor" to "#606266", "showBorder" to true, "onClick" to fun(`$event`: Any){
                            handleGridClick(`$event`)
                        }
                        ), null, 8, _uA(
                            "items",
                            "onClick"
                        ))
                    )),
                    _cE("view", null, _uA(
                        _cV(_component_i_modal, _uM("show" to unref(popupRef), "title" to unref(modalTitle), "onConfirm" to confirm), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cE("view", null, _uA(
                                    _cV(_component_i_input, _uM("modelValue" to unref(psw), "onUpdate:modelValue" to fun(`$event`: String){
                                        trySetRefValue(psw, `$event`)
                                    }
                                    , "onInput" to filterNonLatin, "placeholder" to "请输入密码", "clearable" to "", "password" to true), null, 8, _uA(
                                        "modelValue"
                                    ))
                                ))
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "show",
                            "title"
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "drag-hint" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to "20rpx", "left" to 0, "right" to 0, "zIndex" to 100, "backgroundColor" to "rgba(255,255,255,0.9)", "paddingTop" to "16rpx", "paddingRight" to "16rpx", "paddingBottom" to "16rpx", "paddingLeft" to "16rpx", "textAlign" to "center", "fontSize" to "28rpx", "color" to "#00aa00", "fontWeight" to "bold", "boxShadow" to "0 4rpx 10rpx rgba(0, 0, 0, 0.1)")), "navTo" to _uM(".container .map-container " to _uM("width" to "60rpx", "height" to "60rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "position" to "absolute", "zIndex" to 100, "bottom" to "10%", "right" to "30rpx", "paddingTop" to "5rpx", "paddingRight" to "5rpx", "paddingBottom" to "5rpx", "paddingLeft" to "5rpx")), "tool-nav" to _uM(".container " to _uM("position" to "absolute", "top" to "200rpx", "right" to "20rpx", "zIndex" to 100)), "btn-map-list" to _uM(".container .tool-nav " to _uM("width" to "60rpx", "height" to "60rpx")), "btn-map-list-icon" to _uM(".container .tool-nav " to _uM("width" to "100%", "height" to "100%", "paddingTop" to "8rpx", "paddingRight" to "8rpx", "paddingBottom" to "8rpx", "paddingLeft" to "8rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "backgroundColor" to "#69c2f1")), "tool-more" to _uM(".container " to _uM("position" to "absolute", "top" to "30%", "right" to "20rpx", "zIndex" to 100, "width" to "60rpx", "height" to "60rpx")), "btn-tool-more-icon" to _uM(".container .tool-more " to _uM("width" to "100%", "height" to "100%")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingBottom" to "70rpx")), "refresh-status" to _uM(".container .tools-panel " to _uM("display" to "flex", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "backgroundImage" to "none", "backgroundColor" to "#f8f9fa", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#e8e8e8")), "refresh-text" to _uM(".container .tools-panel .refresh-status " to _uM("fontSize" to "26rpx", "color" to "#666666"), ".container .tools-panel .refresh-status .refreshing" to _uM("color" to "#1890ff")), "refresh-btn" to _uM(".container .tools-panel .refresh-status " to _uM("marginLeft" to "auto", "color" to "#1890ff", "fontSize" to "26rpx")), "Imei-box" to _uM(".container .tools-panel " to _uM("marginTop" to "30rpx", "marginRight" to "30rpx", "marginBottom" to 0, "marginLeft" to "30rpx", "fontSize" to "28rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#dcdfe6")), "imei-info" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "imeis" to _uM(".container .tools-panel .Imei-box .imei-info " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center")), "pos-time" to _uM(".container .tools-panel .Imei-box " to _uM("fontSize" to "20rpx", "color" to "#999999", "marginLeft" to "30rpx")), "pos-date" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center")), "pos-adress" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center")), "addree-box" to _uM(".container .tools-panel .Imei-box .pos-date " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "fontSize" to "22rpx", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "color" to "#999999"), ".container .tools-panel .Imei-box .pos-adress " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "fontSize" to "22rpx", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "color" to "#999999")), "address-text" to _uM(".container .tools-panel .Imei-box .pos-date .addree-box " to _uM("maxWidth" to "490rpx", "lineHeight" to 1.4), ".container .tools-panel .Imei-box .pos-adress .addree-box " to _uM("maxWidth" to "490rpx", "lineHeight" to 1.4)), "pos-icon" to _uM(".container .tools-panel .Imei-box .pos-date .addree-box " to _uM("width" to "30rpx", "height" to "30rpx", "marginRight" to "10rpx"), ".container .tools-panel .Imei-box .pos-adress .addree-box " to _uM("width" to "30rpx", "height" to "30rpx", "marginRight" to "10rpx")), "signal-container" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0)), "signal-item" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center")), "mobile-signal" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "signal-bars-horizontal" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "flex-end", "height" to "40rpx", "marginRight" to "10rpx")), "signal-bar-h" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal " to _uM("width" to "8rpx", "borderTopLeftRadius" to "2rpx", "borderTopRightRadius" to "2rpx", "borderBottomRightRadius" to 0, "borderBottomLeftRadius" to 0, "transitionProperty" to "all", "transitionDuration" to "0.3s", "transitionTimingFunction" to "ease"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-1" to _uM("height" to "12rpx"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-2" to _uM("height" to "16rpx"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-3" to _uM("height" to "20rpx"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-4" to _uM("height" to "24rpx"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-5" to _uM("height" to "28rpx"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .bar-active" to _uM("!background" to "var(--signal-color, #52c41a)"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .bar-off" to _uM("backgroundImage" to "none", "backgroundColor" to "#e8e8e8")), "signal-info-h" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal " to _uM("display" to "flex", "flexDirection" to "column", "justifyContent" to "center", "alignItems" to "center")), "signal-value" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h " to _uM("fontSize" to "18rpx", "color" to "#333333")), "experience" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h " to _uM("fontSize" to "18rpx", "fontWeight" to "normal")), "satellite-item-h" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "satellite-icon" to _uM(".container .tools-panel .Imei-box .signal-container .satellite-item-h " to _uM("width" to "47rpx", "height" to "47rpx", "marginRight" to "10rpx")), "satellite-text" to _uM(".container .tools-panel .Imei-box .signal-container .satellite-item-h " to _uM("fontSize" to "24rpx", "color" to "#1890ff", "fontWeight" to "bold")), "power-icon" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("width" to "47rpx", "height" to "47rpx", "marginRight" to "10rpx")), "battery-icon" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("width" to "47rpx", "height" to "47rpx", "marginRight" to "10rpx")), "power" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "fontSize" to "24rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "battery" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "fontSize" to "24rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "h-line" to _uM(".container .tools-panel " to _uM("width" to "90%", "height" to "2rpx", "backgroundColor" to "#f1f1f1", "marginTop" to "50rpx", "marginRight" to "auto", "marginBottom" to 0, "marginLeft" to "auto")), "tool-tag-item" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "50rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx")), "speed-control" to _uM(".container .tools-panel " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")), "slider" to _uM(".container .tools-panel .speed-control " to _uM("width" to "90%", "marginTop" to 0, "marginRight" to "auto", "marginBottom" to 0, "marginLeft" to "auto")), "grid-text" to _uM(".container .tools-panel " to _uM("paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0, "boxSizing" to "border-box", "fontSize" to "24rpx")), "@TRANSITION" to _uM("signal-bar-h" to _uM("property" to "all", "duration" to "0.3s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
