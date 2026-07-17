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
open class GenPagesVehicleTrackingVehicleTracking : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesVehicleTrackingVehicleTracking) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesVehicleTrackingVehicleTracking
            val _cache = __ins.renderCache
            val imei = ref<String?>("")
            val connectionStatus = ref<String?>("")
            val deviceId = ref<String?>("")
            val deptId = ref<String?>("")
            val carType = ref<String?>("")
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val isAnimating = ref(false)
            val animationTimer = ref<Number?>(null)
            val currentPosition = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val targetPosition = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val currentRotation = ref(0)
            val targetRotation = ref(0)
            val animationQueue = ref(_uA<Any>())
            val isProcessingQueue = ref(false)
            val markers = ref(_uA<Any>())
            val markerInitialized = ref(false)
            var lastIconPath = ""
            val MARKER_UPDATE_INTERVAL: Number = 100
            val isTracking = ref(false)
            val trackingInterval = ref<Number?>(null)
            val lastDirection = ref(0)
            val currentSpeed = ref(0)
            val currentAddress = ref("获取中...")
            val currentTime = ref("1s")
            val currentCar = ref<String?>("京A12345")
            val times = ref(_uA(
                _uA(
                    _uO("label" to "1s", "value" to "1"),
                    _uO("label" to "5s", "value" to "5"),
                    _uO("label" to "10s", "value" to "10"),
                    _uO("label" to "20s", "value" to "20")
                )
            ))
            onLoad(fun(option){
                connectionStatus.value = if (isTruthy(option["connectionStatus"])) {
                    option["connectionStatus"]
                } else {
                    ""
                }
                imei.value = if (isTruthy(option["imei"])) {
                    option["imei"]
                } else {
                    ""
                }
                currentCar.value = if (isTruthy(option["plateNo"])) {
                    option["plateNo"]
                } else {
                    "未知车辆"
                }
                deptId.value = if (isTruthy(option["deptId"])) {
                    option["deptId"]
                } else {
                    ""
                }
                carType.value = if (isTruthy(option["carType"])) {
                    option["carType"]
                } else {
                    ""
                }
                loadInitialPosition()
            }
            )
            val loadInitialPosition = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 112, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            if (res?.code === 0 && res.data != null && res.data.length > 0) {
                                var foundDevice = false
                                res.data.forEach(fun(item: Any){
                                    if (item.imei == imei.value) {
                                        foundDevice = true
                                        if (!isTruthy(item.latitude) || !isTruthy(item.longitude)) {
                                            uni_showToast(ShowToastOptions(title = "位置信息缺失", icon = "none"))
                                            return
                                        }
                                        val deviceData = item
                                        val convertedCoord = CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude))
                                        currentPosition["latitude"] = convertedCoord.lat
                                        currentPosition["longitude"] = convertedCoord.lng
                                        targetPosition["latitude"] = convertedCoord.lat
                                        targetPosition["longitude"] = convertedCoord.lng
                                        center["latitude"] = convertedCoord.lat
                                        center["longitude"] = convertedCoord.lng
                                        lastDirection.value = if (isTruthy(deviceData.direction)) {
                                            deviceData.direction
                                        } else {
                                            0
                                        }
                                        currentRotation.value = normalizeRotation(calculateMapRotation(lastDirection.value))
                                        targetRotation.value = currentRotation.value
                                        currentSpeed.value = if (isTruthy(deviceData.speed)) {
                                            deviceData.speed
                                        } else {
                                            0
                                        }
                                        currentAddress.value = if (isTruthy(deviceData.positionUpdateTime)) {
                                            deviceData.positionUpdateTime
                                        } else {
                                            "定位时间未知"
                                        }
                                        connectionStatus.value = if (isTruthy(deviceData.connectionStatus)) {
                                            deviceData.connectionStatus
                                        } else {
                                            "unknown"
                                        }
                                        initMarker()
                                    }
                                })
                                if (!foundDevice) {
                                    uni_showToast(ShowToastOptions(title = "未找到车辆设备", icon = "none"))
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = if (res?.message != "") {
                                    res?.message
                                } else {
                                    "获取位置失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (err: Throwable) {
                            console.error("获取初始位置失败:", err, " at pages/vehicleTracking/vehicleTracking.uvue:177")
                            uni_showToast(ShowToastOptions(title = "网络请求失败", icon = "none"))
                        }
                })
            }
            val initMarker = fun(){
                if (markerInitialized.value) {
                    return
                }
                val iconPath = getDeviceIcon(connectionStatus.value, carType.value)
                lastIconPath = iconPath
                val marker: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("marker", "pages/vehicleTracking/vehicleTracking.uvue", 194, 9), "id" to 1, "latitude" to currentPosition["latitude"], "longitude" to currentPosition["longitude"], "iconPath" to iconPath, "width" to 25, "height" to 25, "rotate" to currentRotation.value, "anchor" to _uO("x" to 0.5, "y" to 0.5), "alpha" to 1, "fixed" to false)
                markers.value = _uA(
                    marker
                )
                markerInitialized.value = true
                console.log("初始化标记点完成", " at pages/vehicleTracking/vehicleTracking.uvue:209")
            }
            val calculateMapRotation = fun(direction: Number): Number {
                var rotation = direction
                if (rotation >= 360) {
                    rotation -= 360
                }
                if (rotation < 0) {
                    rotation += 360
                }
                return rotation
            }
            val normalizeRotation = fun(rotation: Number): Number {
                var normalized = rotation % 360
                if (normalized < 0) {
                    normalized += 360
                }
                return normalized
            }
            val loadTrackData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 232, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            console.log("222222", " at pages/vehicleTracking/vehicleTracking.uvue:238")
                            if (res?.code === 0 && res.data != null && res.data.length > 0) {
                                val deviceData = res.data.find(fun(item: Any): Boolean {
                                    return item.imei == imei.value
                                }
                                )
                                if (isTruthy(deviceData)) {
                                    val convertedCoord = CoordTransform.wgs84ToTencent(Number(deviceData["latitude"]), Number(deviceData["longitude"]))
                                    val newPosition: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("newPosition", "pages/vehicleTracking/vehicleTracking.uvue", 249, 12), "latitude" to convertedCoord.lat, "longitude" to convertedCoord.lng, "speed" to if (isTruthy(deviceData["speed"])) {
                                        deviceData["speed"]
                                    } else {
                                        0
                                    }
                                    , "address" to if (isTruthy(deviceData["positionUpdateTime"])) {
                                        deviceData["positionUpdateTime"]
                                    } else {
                                        "未知位置"
                                    }
                                    , "connectionStatus" to if (isTruthy(deviceData["connectionStatus"])) {
                                        deviceData["connectionStatus"]
                                    } else {
                                        "unknown"
                                    }
                                    , "direction" to if (deviceData["direction"] !== undefined && deviceData["direction"] != null) {
                                        deviceData["direction"]
                                    } else {
                                        lastDirection.value
                                    }
                                    )
                                    var newDirection = newPosition["direction"]
                                    if (newPosition["direction"] === lastDirection.value) {
                                        newDirection = lastDirection.value
                                    }
                                    addToAnimationQueue(_uO("position" to _uO("latitude" to newPosition["latitude"], "longitude" to newPosition["longitude"]), "rotation" to normalizeRotation(calculateMapRotation(newDirection)), "speed" to newPosition["speed"], "address" to newPosition["address"], "connectionStatus" to newPosition["connectionStatus"]))
                                    lastDirection.value = newDirection
                                }
                            }
                        }
                         catch (err: Throwable) {
                            console.error("获取跟踪位置失败:", err, " at pages/vehicleTracking/vehicleTracking.uvue:283")
                        }
                })
            }
            val addToAnimationQueue = fun(animationData: Any){
                if (animationQueue.value.length > 2) {
                    animationQueue.value = animationQueue.value.slice(-1)
                }
                animationQueue.value.push(animationData)
                if (!isProcessingQueue.value && !isAnimating.value) {
                    processAnimationQueue()
                }
            }
            val processAnimationQueue = fun(){
                if (animationQueue.value.length === 0) {
                    isProcessingQueue.value = false
                    return
                }
                isProcessingQueue.value = true
                val nextAnimation = animationQueue.value.shift()
                targetPosition["latitude"] = nextAnimation.position.latitude
                targetPosition["longitude"] = nextAnimation.position.longitude
                targetRotation.value = nextAnimation.rotation
                currentSpeed.value = nextAnimation.speed
                currentAddress.value = nextAnimation.address
                connectionStatus.value = nextAnimation.connectionStatus
                val distance = calculateDistance(currentPosition["latitude"], currentPosition["longitude"], targetPosition["latitude"], targetPosition["longitude"])
                val animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value)
                startPositionAnimation(animationDuration, fun(){
                    isProcessingQueue.value = false
                    if (animationQueue.value.length > 0) {
                        setTimeout(fun(){
                            processAnimationQueue()
                        }
                        , 50)
                    }
                }
                )
            }
            val calculateDistance = fun(lat1: Number, lng1: Number, lat2: Number, lng2: Number): Number {
                val R: Number = 6371000
                val dLat = (lat2 - lat1) * Math.PI / 180
                val dLng = (lng2 - lng1) * Math.PI / 180
                val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
                val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                return R * c
            }
            val calculateRealisticAnimationDuration = fun(distance: Number, speedKmh: Number): Number {
                if (speedKmh <= 0 || distance <= 0) {
                    return 2000
                }
                val speedMs = speedKmh / 3.6
                val realTimeSeconds = distance / speedMs
                var duration = realTimeSeconds * 1000
                if (duration < 1000) {
                    duration = 1000
                }
                if (duration > 15000) {
                    duration = 15000
                }
                if (speedKmh < 10 && duration < 3000) {
                    duration = 3000
                }
                return duration
            }
            val startPositionAnimation = fun(duration: Number, onComplete: () -> Unit){
                if (isAnimating.value && isTruthy(animationTimer.value)) {
                    clearInterval(animationTimer.value)
                }
                isAnimating.value = true
                val startTime = Date.now()
                val startLat = currentPosition["latitude"]
                val startLng = currentPosition["longitude"]
                val startRot = currentRotation.value
                val latDiff = targetPosition["latitude"] - startLat
                val lngDiff = targetPosition["longitude"] - startLng
                val rotDiff = calculateShortestRotation(startRot, targetRotation.value)
                val interval: Number = 30
                var lastMarkerUpdate = startTime
                animationTimer.value = setInterval(fun(){
                    val now = Date.now()
                    val elapsed = now - startTime
                    val progress = Math.min(elapsed / duration, 1)
                    val linearProgress = progress
                    currentPosition["latitude"] = startLat + latDiff * linearProgress
                    currentPosition["longitude"] = startLng + lngDiff * linearProgress
                    currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress)
                    center["latitude"] = currentPosition["latitude"]
                    center["longitude"] = currentPosition["longitude"]
                    if (now - lastMarkerUpdate >= MARKER_UPDATE_INTERVAL || progress >= 1) {
                        updateMarkerSmooth()
                        lastMarkerUpdate = now
                    }
                    if (progress >= 1) {
                        clearInterval(animationTimer.value as Number)
                        animationTimer.value = null
                        isAnimating.value = false
                        currentPosition["latitude"] = targetPosition["latitude"]
                        currentPosition["longitude"] = targetPosition["longitude"]
                        currentRotation.value = normalizeRotation(targetRotation.value)
                        updateMarkerSmooth()
                        onComplete()
                    }
                }
                , interval) as * as Number
            }
            val calculateShortestRotation = fun(from: Number, to: Number): Number {
                var diff = to - from
                if (diff > 180) {
                    diff -= 360
                } else if (diff < -180) {
                    diff += 360
                }
                return diff
            }
            val updateMarkerSmooth = fun(){
                if (markers.value.length === 0) {
                    initMarker()
                    return
                }
                val newIconPath = getDeviceIcon(connectionStatus.value, carType.value)
                val needUpdateIcon = newIconPath !== lastIconPath
                val updatedMarker: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("updatedMarker", "pages/vehicleTracking/vehicleTracking.uvue", 461, 9), "id" to 1, "latitude" to currentPosition["latitude"], "longitude" to currentPosition["longitude"], "iconPath" to if (needUpdateIcon) {
                    newIconPath
                } else {
                    lastIconPath
                }
                , "width" to 25, "height" to 25, "rotate" to currentRotation.value, "anchor" to _uO("x" to 0.5, "y" to 0.5), "alpha" to 1, "fixed" to false)
                markers.value = _uA(
                    updatedMarker
                )
                if (needUpdateIcon) {
                    lastIconPath = newIconPath
                }
            }
            val toggleTracking = fun(){
                if (isTracking.value) {
                    stopTracking()
                } else {
                    startTracking()
                }
            }
            val startTracking = fun(){
                if (!markerInitialized.value) {
                    initMarker()
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                val interval: Number = 10000
                isTracking.value = true
                if (isTruthy(trackingInterval.value)) {
                    clearInterval(trackingInterval.value)
                }
                getCurrentPosition()
                trackingInterval.value = setInterval(fun(){
                    getCurrentPosition()
                }
                , interval) as * as Number
                uni_showToast(ShowToastOptions(title = "开始跟踪", icon = "success", duration = 1500))
            }
            val stopTracking = fun(){
                isTracking.value = false
                if (isTruthy(trackingInterval.value)) {
                    clearInterval(trackingInterval.value)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (isTruthy(animationTimer.value)) {
                    clearInterval(animationTimer.value)
                    animationTimer.value = null
                }
                isAnimating.value = false
                uni_showToast(ShowToastOptions(title = "停止跟踪", icon = "success", duration = 1500))
            }
            val getCurrentPosition = fun(){
                loadTrackData()
            }
            onHide(fun(){
                console.log("页面隐藏时停止自动刷新", " at pages/vehicleTracking/vehicleTracking.uvue:556")
                isTracking.value = false
                if (isTruthy(trackingInterval.value)) {
                    clearInterval(trackingInterval.value)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (isTruthy(animationTimer.value)) {
                    clearInterval(animationTimer.value)
                    animationTimer.value = null
                }
                isAnimating.value = false
            }
            )
            onUnmounted(fun(){
                console.log("页面卸载时停止自动刷新", " at pages/vehicleTracking/vehicleTracking.uvue:577")
                isTracking.value = false
                if (isTruthy(trackingInterval.value)) {
                    clearInterval(trackingInterval.value)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (isTruthy(animationTimer.value)) {
                    clearInterval(animationTimer.value)
                    animationTimer.value = null
                }
                isAnimating.value = false
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_map = resolveComponent("map")
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "车辆跟踪", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "map-container"), _uA(
                        _cV(_component_map, _uM("id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "markers" to markers.value, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_sub_navBar, _uM("currentTime" to currentTime.value, "currentCar" to currentCar.value, "times" to times.value, "showCar" to true, "onUpdate:currentTime" to fun(kVal): Any {
                                    return currentTime.value = kVal
                                }
                                , "carStatus" to connectionStatus.value), null, 8, _uA(
                                    "currentTime",
                                    "currentCar",
                                    "times",
                                    "onUpdate:currentTime",
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
                        _cE("view", _uM("class" to "btn"), _uA(
                            _cE("button", _uM("onClick" to toggleTracking, "style" to _nS(_uM("backgroundColor" to if (isTracking.value) {
                                "#e64340"
                            } else {
                                "#1296db"
                            }
                            ))), _tD(if (isTracking.value) {
                                "停止跟踪"
                            } else {
                                "开始跟踪"
                            }
                            ), 5)
                        )),
                        _cE("view", _uM("class" to "pos-info-box"), _uA(
                            _cE("view", _uM("class" to "speed"), _uA(
                                _cE("text", null, "时速："),
                                _cE("text", null, _tD(currentSpeed.value) + "Km/h", 1)
                            )),
                            _cE("view", _uM("class" to "address"), _uA(
                                _cE("text", null, "定位时间："),
                                _cE("text", null, _tD(currentAddress.value), 1)
                            ))
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "40rpx", "paddingBottom" to "20rpx", "paddingLeft" to "40rpx", "display" to "flex", "flexDirection" to "column", "boxShadow" to "0 -2px 10px rgba(0, 0, 0, 0.1)")), "btn" to _uM(".container .tools-panel " to _uM("marginBottom" to "20rpx")), "pos-info-box" to _uM(".container .tools-panel " to _uM("paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0)), "speed" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0, "fontSize" to "28rpx")), "address" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0, "fontSize" to "28rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
