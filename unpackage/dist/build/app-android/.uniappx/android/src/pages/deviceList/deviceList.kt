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
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
open class GenPagesDeviceListDeviceList : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesDeviceListDeviceList) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesDeviceListDeviceList
            val _cache = __ins.renderCache
            val mapScale = ref(4)
            val showMap = ref(true)
            val markers = ref(_uA<Marker>())
            val iconColor = ref("#1296db")
            val userLocation = ref(_uO("latitude" to 0, "longitude" to 0))
            val OVERLAP_THRESHOLD_METERS: Number = 12.0
            val SPREAD_REFERENCE_ZOOM: Number = 19.0
            val SPREAD_RADIUS_PX: Number = 26.0
            val DEGREE_PER_METER_LAT = (1.0 as Number) / 111320.0
            val showOverlapPicker = ref(false)
            val overlapDevices = ref(_uA<UTSJSONObject>())
            val overlapPanelMaxHeight = ref(600)
            val updateOverlapPanelMaxHeight = fun(){
                val systemInfo = uni_getSystemInfoSync()
                val windowHeight = if (systemInfo.windowHeight != null) {
                    systemInfo.windowHeight
                } else {
                    600
                }
                overlapPanelMaxHeight.value = Math.floor(windowHeight * 0.6)
            }
            val mapMarkers = computed<UTSArray<Marker>>(fun(): UTSArray<Marker> {
                var result: UTSArray<Marker> = markers.value
                return result
            }
            )
            val pickerStateTitle = ref("全部状态")
            val showWhat = fun(){
                showMap.value = !showMap.value
            }
            val originalDeviceList = ref(_uA<UTSJSONObject>())
            val deviceListItems = computed(fun(): UTSArray<DeviceItem> {
                return originalDeviceList.value.map(fun(item: UTSJSONObject): DeviceItem {
                    val deviceNo = item.getString("deviceNo", "")
                    val rawDeviceName = item.getString("deviceName", "")
                    return DeviceItem(plateNo = item.getString("plateNo", ""), deviceNo = deviceNo, status = item.getNumber("status", 0), companyId = item.getString("companyId", ""), deviceName = if (rawDeviceName != "") {
                        rawDeviceName
                    } else {
                        deviceNo
                    }
                    , deviceId = item.getString("deviceId", ""), iccid = item.getString("iccid", ""), simMerchant = item.getString("simMerchant", ""), connectionStatus = item.getString("connectionStatus", ""))
                }
                )
            }
            )
            val filteredDevices = computed(fun(): UTSArray<UTSJSONObject> {
                if (!UTSArray.isArray(originalDeviceList.value)) {
                    return _uA()
                }
                var result = originalDeviceList.value.slice()
                if (pickerStateTitle.value == "在线") {
                    result = result.filter(fun(device: UTSJSONObject): Boolean {
                        return device["connectionStatus"] == "online"
                    })
                } else if (pickerStateTitle.value === "离线") {
                    result = result.filter(fun(device: UTSJSONObject): Boolean {
                        return device["connectionStatus"] == "offline"
                    }
                    )
                }
                return result
            }
            )
            val totalCount = computed(fun(): Number {
                return originalDeviceList.value.length
            }
            )
            val onlineCount = computed(fun(): Number {
                return originalDeviceList.value.filter(fun(d: UTSJSONObject): Boolean {
                    return d["connectionStatus"] == "online"
                }
                ).length
            }
            )
            val offlineCount = computed(fun(): Number {
                return totalCount.value - onlineCount.value
            }
            )
            val parseCoordinate = fun(value: Any?): Number {
                if (value == null) {
                    return NaN
                }
                return parseFloat(value.toString())
            }
            val distanceMeters = fun(lat1: Number, lng1: Number, lat2: Number, lng2: Number): Number {
                val earthRadius: Number = 6371000.0
                val radLat1 = lat1 * Math.PI / 180.0
                val radLat2 = lat2 * Math.PI / 180.0
                val deltaLat = (lat2 - lat1) * Math.PI / 180.0
                val deltaLng = (lng2 - lng1) * Math.PI / 180.0
                val sinLat = Math.sin(deltaLat / 2.0)
                val sinLng = Math.sin(deltaLng / 2.0)
                val a = sinLat * sinLat + Math.cos(radLat1) * Math.cos(radLat2) * sinLng * sinLng
                val clamped = if (a > 1.0) {
                    1.0
                } else {
                    a
                }
                return 2.0 * earthRadius * Math.atan2(Math.sqrt(clamped), Math.sqrt(1.0 - clamped))
            }
            val analyzeOverlap = fun(devices: UTSArray<UTSJSONObject>): OverlapAnalysis {
                val count = devices.length
                val lats: UTSArray<Number> = _uA()
                val lngs: UTSArray<Number> = _uA()
                val valid: UTSArray<Boolean> = _uA()
                val groupOfIndex: UTSArray<Number> = _uA()
                val orderOfIndex: UTSArray<Number> = _uA()
                val visited: UTSArray<Boolean> = _uA()
                run {
                    var i: Number = 0
                    while(i < count){
                        val lat = parseCoordinate(devices[i]["latitude"] as Any?)
                        val lng = parseCoordinate(devices[i]["longitude"] as Any?)
                        lats.push(lat)
                        lngs.push(lng)
                        valid.push(!isNaN(lat) && !isNaN(lng))
                        groupOfIndex.push(-1)
                        orderOfIndex.push(0)
                        visited.push(false)
                        i++
                    }
                }
                val groups: UTSArray<UTSArray<Number>> = _uA()
                val latLimit = OVERLAP_THRESHOLD_METERS * DEGREE_PER_METER_LAT
                run {
                    var i: Number = 0
                    while(i < count){
                        if (visited[i] || !valid[i]) {
                            i++
                            continue
                        }
                        visited[i] = true
                        val members = _uA(
                            i
                        ) as UTSArray<Number>
                        var head: Number = 0
                        while(head < members.length){
                            val current = members[head]
                            head++
                            run {
                                var j: Number = 0
                                while(j < count){
                                    if (visited[j] || !valid[j]) {
                                        j++
                                        continue
                                    }
                                    if (Math.abs(lats[j] - lats[current]) > latLimit) {
                                        j++
                                        continue
                                    }
                                    if (distanceMeters(lats[current], lngs[current], lats[j], lngs[j]) < OVERLAP_THRESHOLD_METERS) {
                                        visited[j] = true
                                        members.push(j)
                                    }
                                    j++
                                }
                            }
                        }
                        if (members.length > 1) {
                            val groupId = groups.length
                            run {
                                var k: Number = 0
                                while(k < members.length){
                                    groupOfIndex[members[k]] = groupId
                                    orderOfIndex[members[k]] = k
                                    k++
                                }
                            }
                            groups.push(members)
                        }
                        i++
                    }
                }
                return OverlapAnalysis(groupOfIndex = groupOfIndex, orderOfIndex = orderOfIndex, groups = groups)
            }
            val updateMarkers = fun(devices: UTSArray<UTSJSONObject>): Unit {
                val analysis = analyzeOverlap(devices)
                val degreePerPixel = (360.0 as Number) / (256.0 * Math.pow(2.0, SPREAD_REFERENCE_ZOOM))
                val nextMarkers: UTSArray<Marker> = _uA()
                run {
                    var index: Number = 0
                    while(index < devices.length){
                        val device = devices[index]
                        val lat = parseCoordinate(device["latitude"] as Any?)
                        val lng = parseCoordinate(device["longitude"] as Any?)
                        if (isNaN(lat) || isNaN(lng)) {
                            index++
                            continue
                        }
                        val connectionStatus = (device["connectionStatus"] as String?) ?: ""
                        val carType = (device["carType"] as String?) ?: ""
                        val idValue = device["deviceId"] as Any?
                        val parsedId = if (idValue != null) {
                            parseInt(idValue.toString())
                        } else {
                            NaN
                        }
                        val markerId = if (isNaN(parsedId)) {
                            index + 1
                        } else {
                            parsedId
                        }
                        val deviceName = (device["deviceName"] as String?) ?: (device["plateNo"] as String?) ?: "设备"
                        var displayLat = lat
                        var displayLng = lng
                        val groupId = analysis.groupOfIndex[index]
                        if (groupId >= 0) {
                            val members = analysis.groups[groupId]
                            var sumLat: Number = 0.0
                            var sumLng: Number = 0.0
                            run {
                                var k: Number = 0
                                while(k < members.length){
                                    sumLat += parseCoordinate(devices[members[k]]["latitude"] as Any?)
                                    sumLng += parseCoordinate(devices[members[k]]["longitude"] as Any?)
                                    k++
                                }
                            }
                            val centerLat = sumLat / members.length
                            val centerLng = sumLng / members.length
                            val radiusRatio = Math.min(4.0, Math.max(1.0, members.length * 1.0 / 2.0))
                            val radiusPixel = SPREAD_RADIUS_PX * radiusRatio
                            val deltaLng = radiusPixel * degreePerPixel
                            val deltaLat = deltaLng * Math.cos(centerLat * Math.PI / 180.0)
                            val angle = 2.0 * Math.PI * analysis.orderOfIndex[index] / members.length
                            displayLat = centerLat + deltaLat * Math.cos(angle)
                            displayLng = centerLng + deltaLng * Math.sin(angle)
                        }
                        nextMarkers.push(Marker(id = markerId, latitude = displayLat, longitude = displayLng, iconPath = getDeviceIcon(connectionStatus, carType), width = 30, height = 30, callout = MapMarkerCallout(content = deviceName, display = "ALWAYS", padding = 8, borderRadius = 8, bgColor = "#ffffff"), anchor = Anchor(x = 0.5, y = 0.5)))
                        index++
                    }
                }
                markers.value = nextMarkers
                if (nextMarkers.length > 0 && userLocation.value["latitude"] == 0 && userLocation.value["longitude"] == 0) {
                    val firstMarker = nextMarkers[0]
                    userLocation.value["latitude"] = firstMarker.latitude
                    userLocation.value["longitude"] = firstMarker.longitude
                }
            }
            watchEffect(fun(){
                if (showMap.value) {
                    updateMarkers(filteredDevices.value)
                }
            }
            )
            val loadUserDeviceList = fun(data: UTSArray<UTSJSONObject>, from: Boolean): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        try {
                            var deviceList: UTSArray<UTSJSONObject> = data
                            if (from) {
                                val params: UTSJSONObject = _uO("pageSize" to 1000)
                                val res = await(getUserDeviceList(params))
                                val list = if (isBusinessSuccessCode(res.code) && res.data != null) {
                                    res.data.list
                                } else {
                                    null
                                }
                                 as UTSArray<UTSJSONObject>?
                                if (list == null || !UTSArray.isArray(list)) {
                                    console.warn("获取设备列表返回异常:", res)
                                    originalDeviceList.value = _uA()
                                    markers.value = _uA()
                                    return@w1
                                }
                                deviceList = list ?: _uA()
                            }
                            if (!UTSArray.isArray(deviceList)) {
                                deviceList = _uA()
                            }
                            originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, "tencent")
                            updateMarkers(originalDeviceList.value)
                        }
                         catch (err: Throwable) {
                            console.error("获取设备列表失败:", err)
                            originalDeviceList.value = _uA()
                            markers.value = _uA()
                            showAppToast(ShowToastOptions(title = "获取设备列表失败", icon = "none"))
                        }
                })
            }
            val unbindDevice = fun(deviceId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val res = await(delDevice(deviceId))
                        if (isBusinessSuccessCode(res.code)) {
                            showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                res.msg
                            } else {
                                "解绑成功"
                            }, icon = "success"))
                            uni_setStorageSync("needRefreshHome", true)
                        } else {
                            showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                res.msg
                            } else {
                                "解绑失败"
                            }
                            , icon = "error"))
                        }
                        await(loadUserDeviceList(_uA(), true))
                })
            }
            val changeState = fun(type: String){
                pickerStateTitle.value = type
            }
            val deviceDisplayName = fun(device: UTSJSONObject): String {
                val plateNo = (device["plateNo"] as String?) ?: ""
                if (plateNo != "") {
                    return plateNo
                }
                val deviceName = (device["deviceName"] as String?) ?: ""
                if (deviceName != "") {
                    return deviceName
                }
                val deviceNo = (device["deviceNo"] as String?) ?: ""
                return if (deviceNo != "") {
                    deviceNo
                } else {
                    "设备"
                }
            }
            val isDeviceOnline = fun(device: UTSJSONObject): Boolean {
                return (device["connectionStatus"] as String?) == "online"
            }
            val openDeviceDetail = fun(device: UTSJSONObject){
                val deviceNoValue = (device["deviceNo"] as String?) ?: ""
                val companyId = (device["companyId"] as Any?) ?: ""
                val deviceId = (device["deviceId"] as Any?) ?: ""
                uni_navigateTo(NavigateToOptions(url = "/pages/carInfoDetail/carInfoDetail?deviceNo=" + deviceNoValue + "&deptId=" + companyId.toString() + "&deviceId=" + deviceId.toString()))
            }
            val keepOverlapPicker = fun(){}
            val closeOverlapPicker = fun(){
                showOverlapPicker.value = false
                overlapDevices.value = _uA()
            }
            val selectOverlapDevice = fun(device: UTSJSONObject){
                closeOverlapPicker()
                openDeviceDetail(device)
            }
            val handleTap = fun(event: Any){
                val detail = event as UTSJSONObject
                val markerId = if (detail != null) {
                    detail["markerId"]
                } else {
                    null
                }
                if (markerId == null) {
                    return
                }
                val list = filteredDevices.value
                var selectedIndex: Number = -1
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val idValue = list[i]["deviceId"] as Any?
                        if (idValue != null && idValue.toString() == markerId.toString()) {
                            selectedIndex = i
                            break
                        }
                        i++
                    }
                }
                if (selectedIndex < 0) {
                    console.warn("未找到对应的设备信息", markerId)
                    return
                }
                val analysis = analyzeOverlap(list)
                val groupId = analysis.groupOfIndex[selectedIndex]
                if (groupId >= 0) {
                    val members = analysis.groups[groupId]
                    if (members.length > 1) {
                        val candidates: UTSArray<UTSJSONObject> = _uA()
                        run {
                            var k: Number = 0
                            while(k < members.length){
                                candidates.push(list[members[k]])
                                k++
                            }
                        }
                        overlapDevices.value = candidates
                        updateOverlapPanelMaxHeight()
                        showOverlapPicker.value = true
                        return
                    }
                }
                openDeviceDetail(list[selectedIndex])
            }
            onReady(fun(){})
            onLoad(fun(options){
                loadUserDeviceList(_uA(), true)
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_i_tag = resolveEasyComponent("i-tag", GenUniModulesIUiXComponentsITagITagClass)
                val _component_indexListMode = resolveEasyComponent("indexListMode", GenComponentsIndexListModeIndexListModeClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "全部设备", "show-back" to true, "backgroundColor" to "#f1f1f1", "textColor" to "#333", "showCapsule" to true, "isIcon" to true, "onCapsuleClick" to showWhat, "Icon" to "/static/allDevice.png", "iconColor" to iconColor.value), null, 8, _uA(
                            "iconColor"
                        )),
                        if (isTrue(showMap.value)) {
                            _cE("view", _uM("key" to 0, "class" to "map-container"), _uA(
                                _cV(_component_map, _uM("id" to "myMap", "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "onMarkertap" to handleTap, "latitude" to userLocation.value["latitude"], "longitude" to userLocation.value["longitude"], "markers" to mapMarkers.value, "enable-traffic" to true), null, 8, _uA(
                                    "scale",
                                    "style",
                                    "latitude",
                                    "longitude",
                                    "markers"
                                )),
                                if (isTrue(showMap.value)) {
                                    _cE("view", _uM("key" to 0, "class" to "right-bar"), _uA(
                                        _cV(_component_i_tag, _uM("type" to "primary", "onClick" to fun(){
                                            changeState("全部")
                                        }, "text" to ("全部 " + totalCount.value)), null, 8, _uA(
                                            "onClick",
                                            "text"
                                        )),
                                        _cV(_component_i_tag, _uM("type" to "success", "onClick" to fun(){
                                            changeState("在线")
                                        }, "text" to ("在线 " + onlineCount.value)), null, 8, _uA(
                                            "onClick",
                                            "text"
                                        )),
                                        _cV(_component_i_tag, _uM("type" to "danger", "onClick" to fun(){
                                            changeState("离线")
                                        }, "text" to ("离线 " + offlineCount.value)), null, 8, _uA(
                                            "onClick",
                                            "text"
                                        ))
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        } else {
                            _cE("view", _uM("key" to 1), _uA(
                                _cV(_component_indexListMode, _uM("lists" to deviceListItems.value, "onUnbindDevice" to unbindDevice), null, 8, _uA(
                                    "lists"
                                ))
                            ))
                        }
                        ,
                        if (isTrue(showOverlapPicker.value)) {
                            _cE("view", _uM("key" to 2, "class" to "overlap-mask", "onClick" to closeOverlapPicker), _uA(
                                _cE("view", _uM("class" to "overlap-panel", "style" to _nS(_uM("maxHeight" to (overlapPanelMaxHeight.value + "px"))), "onClick" to withModifiers(keepOverlapPicker, _uA(
                                    "stop"
                                ))), _uA(
                                    _cE("view", _uM("class" to "overlap-title"), "此处有 " + _tD(overlapDevices.value.length) + " 台设备", 1),
                                    _cE("scroll-view", _uM("class" to "overlap-list", "scroll-y" to "true"), _uA(
                                        _cE(Fragment, null, RenderHelpers.renderList(overlapDevices.value, fun(device, index, __index, _cached): Any {
                                            return _cE("view", _uM("key" to index, "class" to "overlap-item", "onClick" to fun(){
                                                selectOverlapDevice(device)
                                            }), _uA(
                                                _cE("text", _uM("class" to "overlap-item-name"), _tD(deviceDisplayName(device)), 1),
                                                _cE("text", _uM("class" to _nC(_uA(
                                                    "overlap-item-status",
                                                    if (isDeviceOnline(device)) {
                                                        "status-online"
                                                    } else {
                                                        "status-offline"
                                                    }
                                                ))), _tD(if (isDeviceOnline(device)) {
                                                    "在线"
                                                } else {
                                                    "离线"
                                                }), 3)
                                            ), 8, _uA(
                                                "onClick"
                                            ))
                                        }), 128)
                                    ))
                                ), 4)
                            ))
                        } else {
                            _cC("v-if", true)
                        }
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "tool-nav" to _uM(".container " to _uM("position" to "absolute", "top" to "200rpx", "right" to "20rpx", "zIndex" to 100, "display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "fontSize" to "35rpx")), "btn-map-list" to _uM(".container .tool-nav " to _uM("paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "backgroundColor" to "#1296db", "color" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "right-bar" to _uM(".container " to _uM("position" to "absolute", "top" to "25rpx", "left" to "20rpx", "zIndex" to 100, "display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "status-spacing" to _uM(".container .right-bar " to _uM("marginLeft" to "20rpx")), "allCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#1296db")), "onlineCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#0da117")), "offlineCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#d81e06")), "overlap-mask" to _uM(".container " to _uM("position" to "fixed", "top" to 0, "left" to 0, "right" to 0, "bottom" to 0, "zIndex" to 999, "backgroundColor" to "rgba(0,0,0,0.45)", "display" to "flex", "flexDirection" to "column", "justifyContent" to "flex-end")), "overlap-panel" to _uM(".container " to _uM("width" to "100%", "maxHeight" to "900rpx", "paddingTop" to "24rpx", "paddingRight" to 0, "paddingBottom" to "40rpx", "paddingLeft" to 0, "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "24rpx", "borderTopRightRadius" to "24rpx", "display" to "flex", "flexDirection" to "column")), "overlap-title" to _uM(".container " to _uM("paddingTop" to "12rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "fontSize" to "30rpx", "fontWeight" to 600, "color" to "#333333", "textAlign" to "center")), "overlap-list" to _uM(".container " to _uM("maxHeight" to "700rpx")), "overlap-item" to _uM(".container " to _uM("paddingTop" to "28rpx", "paddingRight" to "32rpx", "paddingBottom" to "28rpx", "paddingLeft" to "32rpx", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#f0f0f0")), "overlap-item-name" to _uM(".container " to _uM("fontSize" to "30rpx", "color" to "#333333")), "overlap-item-status" to _uM(".container " to _uM("fontSize" to "26rpx")), "status-online" to _uM(".container " to _uM("color" to "#0da117")), "status-offline" to _uM(".container " to _uM("color" to "#999999")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
