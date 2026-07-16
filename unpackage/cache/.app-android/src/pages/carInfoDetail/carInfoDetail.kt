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
import io.dcloud.uniapp.extapi.createMapContext as uni_createMapContext
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
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val datainfo = ref(_uO() as Any)
            val address = ref("")
            val currentTime = ref("5s")
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
            val markers = ref(_uA<Any>())
            val showDevicePopup = ref(false)
            val currentDeviceInfo = ref(_uO("deviceName" to "", "carNumber" to "", "deviceSerial" to "", "locationType" to "", "lngLat" to "", "updateTime" to "", "locationTime" to "", "speed" to "", "totalMileage" to "", "address" to ""))
            val currentCarInfo = ref(_uO())
            val getBatteryColor = fun(batteryPercent): String {
                if (!isTruthy(batteryPercent)) {
                    return "#c9c9c9"
                }
                val batteryValue = parseInt(batteryPercent)
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
            fun gen_getSignalDetail_fn(rssi): UTSJSONObject {
                if (rssi == null || rssi === undefined || rssi === "") {
                    return _uO("experience" to "无信号", "quality" to "无服务", "color" to "#999", "level" to 0)
                }
                val signalValue = Number(rssi)
                if (isNaN(signalValue)) {
                    return _uO("experience" to "信号数据无效", "quality" to "无服务", "color" to "#999", "level" to 0)
                }
                if (signalValue >= 26) {
                    return _uO("experience" to "极好", "quality" to "极强", "color" to "#07C160", "level" to 5)
                } else if (signalValue >= 20) {
                    return _uO("experience" to "良好", "quality" to "强", "color" to "#52c41a", "level" to 4)
                } else if (signalValue >= 15) {
                    return _uO("experience" to "一般", "quality" to "中等", "color" to "#faad14", "level" to 3)
                } else if (signalValue >= 10) {
                    return _uO("experience" to "差", "quality" to "较弱", "color" to "#fa8c16", "level" to 2)
                } else if (signalValue >= 1) {
                    return _uO("experience" to "非常差", "quality" to "微弱", "color" to "#f5222d", "level" to 1)
                } else {
                    return _uO("experience" to "无信号", "quality" to "无服务", "color" to "#999", "level" to 0)
                }
            }
            val getSignalDetail = ::gen_getSignalDetail_fn
            val getMobileSignalBarClass = fun(barIndex, rssi): String {
                if (rssi == null || rssi === undefined || rssi === "") {
                    return "bar-off"
                }
                val signalValue = Number(rssi)
                if (isNaN(signalValue)) {
                    return "bar-off"
                }
                val signalDetail = getSignalDetail(signalValue)
                val level = signalDetail["level"]
                return if (barIndex < level) {
                    "bar-active"
                } else {
                    "bar-off"
                }
            }
            watch(currentTime, fun(newVal){
                setupAutoRefresh(newVal)
            }
            )
            val setupAutoRefresh = fun(intervalValue: String){
                if (refreshTimer.value != null) {
                    clearInterval(refreshTimer.value)
                    refreshTimer.value = null
                    isRefreshing.value = false
                }
                if (intervalValue == "0") {
                    isRefreshing.value = false
                    return
                }
                if (datainfo.value.connectionStatus != "online") {
                    isRefreshing.value = false
                    return
                }
                val intervalSeconds = parseInt(intervalValue)
                if (intervalSeconds > 0) {
                    isRefreshing.value = true
                    val intervalMs = intervalSeconds * 1000
                    loadData(_uO("deptId" to deptId.value, "deviceids" to imei.value))
                    refreshTimer.value = setInterval(fun(){
                        loadData(_uO("deptId" to deptId.value, "deviceids" to imei.value))
                    }
                    , intervalMs) as * as Number
                }
            }
            val stopAutoRefresh = fun(){
                if (refreshTimer.value != null) {
                    clearInterval(refreshTimer.value)
                    refreshTimer.value = null
                    isRefreshing.value = false
                }
            }
            val baseList = computed(fun(): UTSArray<UTSJSONObject> {
                val list = __uts_large_list_build_0()
                val productId = currentCarInfo.value["productId"]
                if (productId === "product-1141811865601576960" || productId === "product-1183161303028600832") {
                    list.push(_uO("name" to "/static/cmd.png", "title" to "发送指令"))
                }
                return list
            }
            )
            val click = fun(name){
                console.log(name, " at pages/carInfoDetail/carInfoDetail.uvue:413")
                val itemTo = name.text
                if (itemTo == "轨迹回放") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"] + "&lat=" + datainfo.value.latitude + "&lng=" + datainfo.value.longitude))
                }
                if (itemTo == "车辆跟踪") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&deptId=" + deptId.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"]))
                }
                if (itemTo == "里程记录") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/mileageRecord/mileageRecord?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"]))
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
                    uni_navigateTo(NavigateToOptions(url = "/pages/geofencing/geofencing?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value["deviceName"] + "&carType=" + currentCarInfo.value["carType"] + "&deptId=" + deptId.value + "&deviceName=" + currentCarInfo.value["deviceName"]))
                }
                if (itemTo == "一键寻车") {
                    navTo()
                }
                if (itemTo == "发送指令") {
                    stopAutoRefresh()
                    uni_navigateTo(NavigateToOptions(url = "/pages/cmd/cmd?imei=" + imei.value))
                }
            }
            val executeOperation = fun(operationType): UTSPromise<Unit> {
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
                                uni_showToast(ShowToastOptions(title = if (isTruthy(res.msg)) {
                                    res.msg
                                } else {
                                    "操作失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            uni_hideLoading(null)
                            console.error("操作失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:542")
                            uni_showToast(ShowToastOptions(title = "操作失败，请重试", icon = "none"))
                        }
                })
            }
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
            val navTo = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (!(address.value != "")) {
                            await(refreshAdress())
                        }
                        uni_openLocation(OpenLocationOptions(latitude = center["latitude"], longitude = center["longitude"], name = address.value, scale = 18, success = fun(_){
                            uni_showToast(ShowToastOptions(title = "成功调起地图", icon = "none"))
                        }
                        , fail = fun(err){
                            uni_showToast(ShowToastOptions(title = "调起地图失败", icon = "none"))
                            console.error("调起地图失败:", err, " at pages/carInfoDetail/carInfoDetail.uvue:591")
                        }
                        ))
                })
            }
            val refreshMapView = fun(){
                try {
                    val mapContext = uni_createMapContext("myMap", null)
                    mapContext.moveToLocation(MapContextMoveToLocationOptions(latitude = center["latitude"], longitude = center["longitude"], scale = mapScale.value, success = fun(_result){
                        console.log("地图中心点移动成功，缩放级别：15", " at pages/carInfoDetail/carInfoDetail.uvue:607")
                    }
                    , fail = fun(err){
                        console.error("地图中心点移动失败:", err.errMsg, " at pages/carInfoDetail/carInfoDetail.uvue:610")
                    }
                    ))
                }
                 catch (error: Throwable) {
                    console.error("刷新地图视图失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:616")
                }
            }
            val delay = fun(ms: Number): UTSPromise<*> {
                return UTSPromise(fun(resolve, _reject){
                    return setTimeout(resolve, ms)
                }
                )
            }
            val loadData = fun(data: Any, retryCount: Number = 3): UTSPromise<Any> {
                return wrapUTSPromise(suspend w1@{
                        var retry = retryCount
                        val tryLoad = fun(attempt: Number): Any {
                            return wrapUTSPromise(suspend w2@{
                                    try {
                                        val res = await(getDevicePos(data))
                                        if (!isTruthy(res) || !isTruthy(res.data) || res.data.length === 0) {
                                            throw UTSError("返回数据为空")
                                        }
                                        console.log("接口请求成功", attempt, " at pages/carInfoDetail/carInfoDetail.uvue:634")
                                        var foundDevice = false
                                        for(item in resolveUTSValueIterator(res.data)){
                                            if (item.imei == imei.value) {
                                                foundDevice = true
                                                datainfo.value = UTSAndroid.consoleDebugError(JSON.parse(JSON.stringify(item)), " at pages/carInfoDetail/carInfoDetail.uvue:644")
                                                if (!isTruthy(item.latitude) || !isTruthy(item.longitude)) {
                                                    console.error("位置信息缺失", item, " at pages/carInfoDetail/carInfoDetail.uvue:647")
                                                    uni_showToast(ShowToastOptions(title = "位置信息缺失", icon = "none"))
                                                    return@w2 false
                                                }
                                                val lat = Number(item.latitude)
                                                val lng = Number(item.longitude)
                                                if (isNaN(lat) || isNaN(lng)) {
                                                    console.error("经纬度格式错误", item.latitude, item.longitude, " at pages/carInfoDetail/carInfoDetail.uvue:660")
                                                    return@w2 false
                                                }
                                                var convertedCoord
                                                try {
                                                    convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                                                    console.log("坐标转换结果:", convertedCoord, " at pages/carInfoDetail/carInfoDetail.uvue:668")
                                                }
                                                 catch (transformError: Throwable) {
                                                    console.error("坐标转换失败:", transformError, " at pages/carInfoDetail/carInfoDetail.uvue:670")
                                                    convertedCoord = _uO("lat" to lat, "lng" to lng)
                                                }
                                                center["latitude"] = convertedCoord.lat
                                                center["longitude"] = convertedCoord.lng
                                                console.log("地图中心点更新:", _uO("latitude" to center["latitude"], "longitude" to center["longitude"]), " at pages/carInfoDetail/carInfoDetail.uvue:679")
                                                await(delay(50))
                                                val deviceMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarInfo.value["deviceName"])
                                                markers.value = _uA()
                                                await(delay(50))
                                                markers.value = _uA(
                                                    deviceMarker
                                                )
                                                console.log("标记点更新完成", " at pages/carInfoDetail/carInfoDetail.uvue:701")
                                                if (item.connectionStatus != "online" && refreshTimer.value != null) {
                                                    clearInterval(refreshTimer.value)
                                                    refreshTimer.value = null
                                                    isRefreshing.value = false
                                                    uni_showToast(ShowToastOptions(title = "设备已离线，停止自动刷新", icon = "none"))
                                                }
                                                if (isTruthy(item.attribute?.rssi)) {
                                                    val signalExp = getSignalDetail(item.attribute.rssi)["experience"]
                                                    if (signalExp === "差" || signalExp === "非常差" || signalExp === "无信号") {
                                                        console.warn("设备 " + imei.value + " 信号较弱: " + item.attribute.rssi + "dBm", " at pages/carInfoDetail/carInfoDetail.uvue:718")
                                                    }
                                                }
                                                setTimeout(fun(){
                                                    refreshMapView()
                                                }
                                                , 100)
                                            }
                                        }
                                        if (!foundDevice) {
                                            throw UTSError("未找到对应的设备数据")
                                        }
                                        return@w2 true
                                    }
                                     catch (error: Throwable) {
                                        console.error("第" + attempt + "次加载设备数据失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:737")
                                        if (attempt < retry) {
                                            val delayMs = Math.pow(2, attempt) * 1000
                                            console.log("等待" + delayMs / 1000 + "秒后重试...", " at pages/carInfoDetail/carInfoDetail.uvue:743")
                                            await(UTSPromise(fun(resolve, _reject){
                                                return setTimeout(resolve, delayMs)
                                            }))
                                            return@w2 tryLoad(attempt + 1)
                                        } else {
                                            uni_showToast(ShowToastOptions(title = "数据加载失败，请稍后重试", icon = "none", duration = 2000))
                                            if (datainfo.value.connectionStatus == "online" && refreshTimer.value != null) {
                                                clearInterval(refreshTimer.value)
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
            val refreshAdress = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val addr = await(getAddress(center["latitude"], center["longitude"]))
                        address.value = addr.result.formatted_address
                })
            }
            onLoad(fun(option){
                deptId.value = option["deptId"]
                imei.value = option["imei"]
                deviceId.value = option["deviceId"]
                userType.value = uni_getStorageSync("userType")
                watch(center, fun(newVal, oldVal){
                    console.log("center 变化:", _uO("old" to oldVal, "new" to newVal, "time" to Date().toISOString()), " at pages/carInfoDetail/carInfoDetail.uvue:791")
                }
                , WatchOptions(deep = true))
                loadDeviceDetail().then(fun(){
                    val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/carInfoDetail/carInfoDetail.uvue", 800, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                    uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                    loadData(data, 3).then(fun(success){
                        uni_hideLoading(null)
                        if (isTruthy(success)) {
                            setTimeout(fun(){
                                refreshMapView()
                                if (datainfo.value.connectionStatus == "online") {
                                    setupAutoRefresh(currentTime.value)
                                }
                            }
                            , 500)
                        }
                    }
                    ).`catch`(fun(error){
                        uni_hideLoading(null)
                        console.error("初始化加载失败:", error, " at pages/carInfoDetail/carInfoDetail.uvue:826")
                    }
                    )
                }
                )
            }
            )
            val loadDeviceDetail = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (deviceId.value != null) {
                            val res = await(getDeviceDetail(deviceId.value!!))
                            console.log("设备详情：", res.data, " at pages/carInfoDetail/carInfoDetail.uvue:834")
                            currentCarInfo.value = res.data
                        } else {
                            console.error("设备id获取失败", " at pages/carInfoDetail/carInfoDetail.uvue:837")
                        }
                })
            }
            val createMarker = fun(id: Number, lat: Number, lng: Number, type: String, title: String?): UTSJSONObject {
                val marker: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("marker", "pages/carInfoDetail/carInfoDetail.uvue", 843, 9), "id" to id, "latitude" to lat, "longitude" to lng, "width" to 25, "height" to 25, "iconPath" to getDeviceIcon(datainfo.value.connectionStatus, currentCarInfo.value["carType"]), "callout" to _uO("content" to if (isTruthy(title)) {
                    title
                } else {
                    "爱车位置"
                }
                , "color" to if (datainfo.value.connectionStatus == "online") {
                    "#fff"
                } else {
                    "#666"
                }
                , "borderRadius" to 10, "bgColor" to if (datainfo.value.connectionStatus == "online") {
                    "#07C160"
                } else {
                    "#ccc"
                }
                , "padding" to 5, "display" to "ALWAYS"))
                return marker
            }
            onShow(fun(){
                console.log("页面显示，检查自动刷新状态", " at pages/carInfoDetail/carInfoDetail.uvue:864")
                if (datainfo.value.connectionStatus == "online" && !isRefreshing.value) {
                    setupAutoRefresh(currentTime.value)
                }
            }
            )
            onHide(fun(){
                console.log("页面隐藏时停止自动刷新", " at pages/carInfoDetail/carInfoDetail.uvue:873")
                stopAutoRefresh()
            }
            )
            onUnmounted(fun(){
                console.log("页面卸载时停止自动刷新", " at pages/carInfoDetail/carInfoDetail.uvue:878")
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
                        _cV(_component_map, _uM("id" to "myMap", "latitude" to unref(center)["latitude"], "longitude" to unref(center)["longitude"], "markers" to unref(markers), "scale" to unref(mapScale), "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_sub_navBar, _uM("currentTime" to unref(currentTime), "showTime" to true, "showPickerTime" to false, "onUpdate:currentTime" to fun(kVal): Any {
                                    return currentTime.value = kVal
                                }
                                , "currentCar" to unref(currentCarInfo)["plateNo"], "times" to unref(times), "carStatus" to unref(datainfo)["connectionStatus"], "showPicker" to false, "showCar" to true), null, 8, _uA(
                                    "currentTime",
                                    "onUpdate:currentTime",
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
                                        _cE("text", _uM("key" to 1), _tD(unref(center)["latitude"]) + " , " + _tD(unref(center)["longitude"]), 1)
                                    }
                                    ,
                                    if (isTrue(!(unref(address) != ""))) {
                                        _cE("text", _uM("key" to 2, "style" to _nS(_uM("color" to "#007AFF", "margin-left" to "20rpx", "font-weight" to "bold")), "onClick" to refreshAdress), "中文地址", 4)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            )),
                            if (isTrue(unref(currentCarInfo)["attribute"]?.rssi || unref(currentCarInfo)["attribute"]?.sat)) {
                                _cE("view", _uM("key" to 0, "class" to "signal-container"), _uA(
                                    if (isTrue(unref(currentCarInfo)["attribute"]?.rssi)) {
                                        _cE("view", _uM("key" to 0, "class" to "signal-item"), _uA(
                                            _cE("view", _uM("class" to "mobile-signal"), _uA(
                                                _cE("view", _uM("class" to "signal-bars-horizontal", "style" to _nS(_uM("--signal-color" to getSignalDetail(unref(currentCarInfo)["attribute"]?.rssi)["color"]))), _uA(
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h",
                                                        getMobileSignalBarClass(0, unref(currentCarInfo)["attribute"]?.rssi)
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h",
                                                        getMobileSignalBarClass(1, unref(currentCarInfo)["attribute"]?.rssi)
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h",
                                                        getMobileSignalBarClass(2, unref(currentCarInfo)["attribute"]?.rssi)
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h",
                                                        getMobileSignalBarClass(3, unref(currentCarInfo)["attribute"]?.rssi)
                                                    ))), null, 2),
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "signal-bar-h",
                                                        getMobileSignalBarClass(4, unref(currentCarInfo)["attribute"]?.rssi)
                                                    ))), null, 2)
                                                ), 4),
                                                _cE("view", _uM("class" to "signal-info-h"), _uA(
                                                    _cE("text", _uM("class" to "experience", "style" to _nS(_uM("color" to getSignalDetail(unref(currentCarInfo)["attribute"]?.rssi)["color"]))), _tD(getSignalDetail(unref(currentCarInfo)["attribute"]?.rssi)["experience"]), 5),
                                                    _cE("text", _uM("class" to "signal-value", "style" to _nS(_uM("color" to getSignalDetail(unref(currentCarInfo)["attribute"]?.rssi)["color"]))), "CSQ " + _tD(unref(currentCarInfo)["attribute"]?.rssi), 5)
                                                ))
                                            ))
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(currentCarInfo)["attribute"]?.sat)) {
                                        _cE("view", _uM("key" to 1, "class" to "satellite-item-h"), _uA(
                                            _cE("image", _uM("class" to "satellite-icon", "src" to "/static/sate.png")),
                                            _cE("text", _uM("class" to "satellite-text"), _tD(unref(currentCarInfo)["attribute"]?.sat), 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(currentCarInfo)["voltage"])) {
                                        _cE("view", _uM("key" to 2, "class" to "power"), _uA(
                                            _cE("image", _uM("src" to "/static/v.png")),
                                            _cE("text", null, _tD(unref(currentCarInfo)["voltage"]) + "V", 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(datainfo)["batteryPercent"])) {
                                        _cE("view", _uM("key" to 3, "class" to "battery", "style" to _nS(_uM("color" to getBatteryColor(unref(datainfo)["batteryPercent"])))), _uA(
                                            _cE("image", _uM("src" to "/static/pow.png", "alt" to "")),
                                            _cE("text", null, _tD(unref(datainfo)["batteryPercent"]) + "%", 1)
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
                            click(`$event`)
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
                                    , "onInput" to _ctx.filterNonLatin, "placeholder" to "请输入密码", "clearable" to "", "password" to true), null, 8, _uA(
                                        "modelValue",
                                        "onInput"
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "drag-hint" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to "20rpx", "left" to 0, "right" to 0, "zIndex" to 100, "backgroundColor" to "rgba(255,255,255,0.9)", "paddingTop" to "16rpx", "paddingRight" to "16rpx", "paddingBottom" to "16rpx", "paddingLeft" to "16rpx", "textAlign" to "center", "fontSize" to "28rpx", "color" to "#00aa00", "fontWeight" to "bold", "boxShadow" to "0 4rpx 10rpx rgba(0, 0, 0, 0.1)", "animation" to "pulse 1.5s infinite")), "navTo" to _uM(".container .map-container " to _uM("width" to "60rpx", "height" to "60rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "position" to "absolute", "zIndex" to 100, "bottom" to "10%", "right" to "30rpx", "paddingTop" to "5rpx", "paddingRight" to "5rpx", "paddingBottom" to "5rpx", "paddingLeft" to "5rpx")), "tool-nav" to _uM(".container " to _uM("position" to "absolute", "top" to "200rpx", "right" to "20rpx", "zIndex" to 100)), "btn-map-list" to _uM(".container .tool-nav " to _uM("width" to "60rpx", "height" to "60rpx")), "btn-map-list-icon" to _uM(".container .tool-nav " to _uM("width" to "100%", "height" to "100%", "paddingTop" to "8rpx", "paddingRight" to "8rpx", "paddingBottom" to "8rpx", "paddingLeft" to "8rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "backgroundColor" to "#69c2f1")), "tool-more" to _uM(".container " to _uM("position" to "absolute", "top" to "30%", "right" to "20rpx", "zIndex" to 100, "width" to "60rpx", "height" to "60rpx")), "btn-tool-more-icon" to _uM(".container .tool-more " to _uM("width" to "100%", "height" to "100%")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingBottom" to "70rpx")), "refresh-status" to _uM(".container .tools-panel " to _uM("display" to "flex", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "backgroundImage" to "none", "backgroundColor" to "#f8f9fa", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#e8e8e8")), "refresh-text" to _uM(".container .tools-panel .refresh-status " to _uM("fontSize" to "26rpx", "color" to "#666666"), ".container .tools-panel .refresh-status .refreshing" to _uM("color" to "#1890ff", "animation" to "rotating 2s linear infinite")), "refresh-btn" to _uM(".container .tools-panel .refresh-status " to _uM("marginLeft" to "auto", "color" to "#1890ff", "fontSize" to "26rpx")), "Imei-box" to _uM(".container .tools-panel " to _uM("marginTop" to "30rpx", "marginRight" to "30rpx", "marginBottom" to 0, "marginLeft" to "30rpx", "fontSize" to "28rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#dcdfe6")), "imei-info" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "imeis" to _uM(".container .tools-panel .Imei-box .imei-info " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center")), "pos-time" to _uM(".container .tools-panel .Imei-box " to _uM("fontSize" to "20rpx", "color" to "#999999", "marginLeft" to "30rpx")), "pos-date" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "gap" to "50rpx")), "pos-adress" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "gap" to "50rpx")), "addree-box" to _uM(".container .tools-panel .Imei-box .pos-date " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "fontSize" to "22rpx", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "color" to "#999999"), ".container .tools-panel .Imei-box .pos-adress " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "fontSize" to "22rpx", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "color" to "#999999")), "address-text" to _uM(".container .tools-panel .Imei-box .pos-date .addree-box " to _uM("wordBreak" to "break-all", "wordWrap" to "break-word", "maxWidth" to "490rpx", "verticalAlign" to "top", "lineHeight" to 1.4), ".container .tools-panel .Imei-box .pos-adress .addree-box " to _uM("wordBreak" to "break-all", "wordWrap" to "break-word", "maxWidth" to "490rpx", "verticalAlign" to "top", "lineHeight" to 1.4)), "pos-icon" to _uM(".container .tools-panel .Imei-box .pos-date .addree-box " to _uM("width" to "30rpx", "height" to "30rpx", "marginRight" to "10rpx"), ".container .tools-panel .Imei-box .pos-adress .addree-box " to _uM("width" to "30rpx", "height" to "30rpx", "marginRight" to "10rpx")), "signal-container" to _uM(".container .tools-panel .Imei-box " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "gap" to "10rpx")), "signal-item" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center")), "mobile-signal" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "signal-bars-horizontal" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "flex-end", "height" to "40rpx", "gap" to "3rpx", "marginRight" to "10rpx")), "signal-bar-h" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal " to _uM("width" to "8rpx", "borderTopLeftRadius" to "2rpx", "borderTopRightRadius" to "2rpx", "borderBottomRightRadius" to 0, "borderBottomLeftRadius" to 0, "transitionProperty" to "all", "transitionDuration" to "0.3s", "transitionTimingFunction" to "ease"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .bar-active" to _uM("!background" to "var(--signal-color, #52c41a)"), ".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .bar-off" to _uM("backgroundImage" to "none", "backgroundColor" to "#e8e8e8")), "signal-info-h" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal " to _uM("display" to "flex", "flexDirection" to "column", "justifyContent" to "center", "alignItems" to "center")), "signal-value" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h " to _uM("fontSize" to "18rpx", "color" to "#333333")), "experience" to _uM(".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h " to _uM("fontSize" to "18rpx", "fontWeight" to "normal")), "satellite-item-h" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "satellite-icon" to _uM(".container .tools-panel .Imei-box .signal-container .satellite-item-h " to _uM("width" to "47rpx", "height" to "47rpx", "marginRight" to "10rpx")), "satellite-text" to _uM(".container .tools-panel .Imei-box .signal-container .satellite-item-h " to _uM("fontSize" to "24rpx", "color" to "#1890ff", "fontWeight" to "bold")), "power" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "fontSize" to "24rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "battery" to _uM(".container .tools-panel .Imei-box .signal-container " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "fontSize" to "24rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f8ff", "paddingTop" to "10rpx", "paddingRight" to "20rpx", "paddingBottom" to "10rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "h-line" to _uM(".container .tools-panel " to _uM("width" to "90%", "height" to "2rpx", "backgroundColor" to "#f1f1f1", "marginTop" to "50rpx", "marginRight" to "auto", "marginBottom" to 0, "marginLeft" to "auto")), "tool-tag-item" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "50rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx")), "speed-control" to _uM(".container .tools-panel " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")), "slider" to _uM(".container .tools-panel .speed-control " to _uM("width" to "90%", "marginTop" to 0, "marginRight" to "auto", "marginBottom" to 0, "marginLeft" to "auto")), "grid-text" to _uM(".container .tools-panel " to _uM("paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0, "boxSizing" to "border-box", "fontSize" to "24rpx")), "@TRANSITION" to _uM("signal-bar-h" to _uM("property" to "all", "duration" to "0.3s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
