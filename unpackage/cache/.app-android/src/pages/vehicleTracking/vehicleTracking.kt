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
            val imei = ref<String>("")
            val connectionStatus = ref<String>("")
            val deviceId = ref<String>("")
            val deptId = ref<String>("")
            val carType = ref<String>("")
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val isAnimating = ref(false)
            val animationTimer = ref<Number?>(null)
            val currentPosition = reactive<CoordinatePoint>(CoordinatePoint(latitude = 39.90469, longitude = 116.40717))
            val targetPosition = reactive<CoordinatePoint>(CoordinatePoint(latitude = 39.90469, longitude = 116.40717))
            val currentRotation = ref(0)
            val targetRotation = ref(0)
            val animationQueue = ref(_uA<AnimationQueueItem>())
            val isProcessingQueue = ref(false)
            val markers = ref(_uA<Marker>())
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
            fun gen_handleCurrentTimeUpdate_fn(value: String): Unit {
                currentTime.value = value
            }
            val handleCurrentTimeUpdate = ::gen_handleCurrentTimeUpdate_fn
            fun gen_createVehicleMarker_fn(iconPath: String): Marker {
                return Marker(id = 1, latitude = currentPosition.latitude, longitude = currentPosition.longitude, iconPath = iconPath, width = 25, height = 25, rotate = currentRotation.value, anchor = Anchor(x = 0.5, y = 0.5), alpha = 1)
            }
            val createVehicleMarker = ::gen_createVehicleMarker_fn
            fun gen_loadInitialPosition_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 131, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            console.log("data", data, " at pages/vehicleTracking/vehicleTracking.uvue:136")
                            val res = await(getDevicePos(data))
                            console.log("res", res, " at pages/vehicleTracking/vehicleTracking.uvue:140")
                            if (res?.code == 0 && res.data != null && res.data.length > 0) {
                                var foundDevice = false
                                res.data.forEach(fun(item: UTSJSONObject){
                                    val itemImei = item.getString("imei", "")
                                    if (itemImei == imei.value) {
                                        foundDevice = true
                                        val latitude = item.getNumber("latitude", 0)
                                        val longitude = item.getNumber("longitude", 0)
                                        if (latitude == 0 || longitude == 0) {
                                            uni_showToast(ShowToastOptions(title = "位置信息缺失", icon = "none"))
                                            return
                                        }
                                        val direction = item.getNumber("direction", 0)
                                        val speed = item.getNumber("speed", 0)
                                        val positionUpdateTime = item.getString("positionUpdateTime", "定位时间未知")
                                        val status = item.getString("connectionStatus", "unknown")
                                        val convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude)
                                        currentPosition.latitude = convertedCoord.lat
                                        currentPosition.longitude = convertedCoord.lng
                                        targetPosition.latitude = convertedCoord.lat
                                        targetPosition.longitude = convertedCoord.lng
                                        center["latitude"] = convertedCoord.lat
                                        center["longitude"] = convertedCoord.lng
                                        lastDirection.value = direction
                                        var initialRotation = lastDirection.value % 360
                                        if (initialRotation < 0) {
                                            initialRotation += 360
                                        }
                                        currentRotation.value = initialRotation
                                        targetRotation.value = currentRotation.value
                                        currentSpeed.value = speed
                                        currentAddress.value = positionUpdateTime
                                        connectionStatus.value = status
                                        if (!markerInitialized.value) {
                                            val iconPath = getDeviceIcon(connectionStatus.value, carType.value)
                                            lastIconPath = iconPath
                                            markers.value = _uA(
                                                createVehicleMarker(iconPath)
                                            )
                                            markerInitialized.value = true
                                        }
                                    }
                                })
                                if (!foundDevice) {
                                    uni_showToast(ShowToastOptions(title = "未找到车辆设备", icon = "none"))
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = "获取位置失败", icon = "none"))
                            }
                        }
                         catch (err: Throwable) {
                            console.error("获取初始位置失败:", err, " at pages/vehicleTracking/vehicleTracking.uvue:212")
                            uni_showToast(ShowToastOptions(title = "网络请求失败", icon = "none"))
                        }
                })
            }
            val loadInitialPosition = ::gen_loadInitialPosition_fn
            fun gen_initMarker_fn() {
                if (markerInitialized.value) {
                    return
                }
                val iconPath = getDeviceIcon(connectionStatus.value, carType.value)
                lastIconPath = iconPath
                val marker = createVehicleMarker(iconPath)
                markers.value = _uA(
                    marker
                )
                markerInitialized.value = true
                console.log("初始化标记点完成", " at pages/vehicleTracking/vehicleTracking.uvue:233")
            }
            val initMarker = ::gen_initMarker_fn
            fun gen_calculateMapRotation_fn(direction: Number): Number {
                var rotation = direction
                if (rotation >= 360) {
                    rotation -= 360
                }
                if (rotation < 0) {
                    rotation += 360
                }
                return rotation
            }
            val calculateMapRotation = ::gen_calculateMapRotation_fn
            fun gen_normalizeRotation_fn(rotation: Number): Number {
                var normalized = rotation % 360
                if (normalized < 0) {
                    normalized += 360
                }
                return normalized
            }
            val normalizeRotation = ::gen_normalizeRotation_fn
            onLoad(fun(option){
                console.log("option", option, " at pages/vehicleTracking/vehicleTracking.uvue:254")
                connectionStatus.value = option["connectionStatus"] ?: ""
                imei.value = option["imei"] ?: ""
                currentCar.value = option["plateNo"] ?: "未知车辆"
                deptId.value = option["deptId"] ?: ""
                carType.value = option["carType"] ?: ""
                loadInitialPosition()
            }
            )
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
            fun gen_calculateShortestRotation_fn(from: Number, to: Number): Number {
                var diff = to - from
                if (diff > 180) {
                    diff -= 360
                } else if (diff < -180) {
                    diff += 360
                }
                return diff
            }
            val calculateShortestRotation = ::gen_calculateShortestRotation_fn
            val updateMarkerSmooth = fun(){
                if (markers.value.length == 0) {
                    initMarker()
                    return
                }
                val newIconPath = getDeviceIcon(connectionStatus.value, carType.value)
                val needUpdateIcon = newIconPath != lastIconPath
                val updatedMarker = createVehicleMarker(if (needUpdateIcon) {
                    newIconPath
                } else {
                    lastIconPath
                }
                )
                markers.value = _uA(
                    updatedMarker
                )
                if (needUpdateIcon) {
                    lastIconPath = newIconPath
                }
            }
            val startPositionAnimation = fun(duration: Number, onComplete: () -> Unit){
                if (isAnimating.value && animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                }
                isAnimating.value = true
                val startTime = Date.now()
                val startLat = currentPosition.latitude
                val startLng = currentPosition.longitude
                val startRot = currentRotation.value
                val latDiff = targetPosition.latitude - startLat
                val lngDiff = targetPosition.longitude - startLng
                val rotDiff = calculateShortestRotation(startRot, targetRotation.value)
                val interval: Number = 30
                var lastMarkerUpdate = startTime
                animationTimer.value = setInterval(fun(){
                    val now = Date.now()
                    val elapsed = now - startTime
                    val progress = Math.min(elapsed / duration, 1)
                    val linearProgress = progress
                    currentPosition.latitude = startLat + latDiff * linearProgress
                    currentPosition.longitude = startLng + lngDiff * linearProgress
                    currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress)
                    center["latitude"] = currentPosition.latitude
                    center["longitude"] = currentPosition.longitude
                    if (now - lastMarkerUpdate >= MARKER_UPDATE_INTERVAL || progress >= 1) {
                        updateMarkerSmooth()
                        lastMarkerUpdate = now
                    }
                    if (progress >= 1) {
                        clearInterval(animationTimer.value as Number)
                        animationTimer.value = null
                        isAnimating.value = false
                        currentPosition.latitude = targetPosition.latitude
                        currentPosition.longitude = targetPosition.longitude
                        currentRotation.value = normalizeRotation(targetRotation.value)
                        updateMarkerSmooth()
                        onComplete()
                    }
                }
                , interval) as Number
            }
            fun gen_processAnimationQueue_fn(): Unit {
                if (animationQueue.value.length == 0) {
                    isProcessingQueue.value = false
                    return
                }
                isProcessingQueue.value = true
                val nextAnimation = animationQueue.value[0]
                animationQueue.value.splice(0, 1)
                targetPosition.latitude = nextAnimation.position.latitude
                targetPosition.longitude = nextAnimation.position.longitude
                targetRotation.value = nextAnimation.rotation
                currentSpeed.value = nextAnimation.speed
                currentAddress.value = nextAnimation.address
                connectionStatus.value = nextAnimation.connectionStatus
                val distance = calculateDistance(currentPosition.latitude, currentPosition.longitude, targetPosition.latitude, targetPosition.longitude)
                val animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value)
                startPositionAnimation(animationDuration, fun(){
                    isProcessingQueue.value = false
                    if (animationQueue.value.length > 0) {
                        setTimeout(fun(){
                            gen_processAnimationQueue_fn()
                        }
                        , 50)
                    }
                }
                )
            }
            val processAnimationQueue = ::gen_processAnimationQueue_fn
            val addToAnimationQueue = fun(animationData: AnimationQueueItem): Unit {
                if (animationQueue.value.length > 2) {
                    animationQueue.value = animationQueue.value.slice(-1)
                }
                animationQueue.value.push(animationData)
                if (!isProcessingQueue.value && !isAnimating.value) {
                    processAnimationQueue()
                }
            }
            val loadTrackData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 444, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            console.log("222222", " at pages/vehicleTracking/vehicleTracking.uvue:450")
                            if (res?.code == 0 && res.data != null && res.data.length > 0) {
                                val deviceData = res.data.find(fun(item: UTSJSONObject): Boolean {
                                    return item.getString("imei", "") == imei.value
                                }
                                )
                                if (deviceData != null) {
                                    val latitude = deviceData.getNumber("latitude", 0)
                                    val longitude = deviceData.getNumber("longitude", 0)
                                    val speed = deviceData.getNumber("speed", 0)
                                    val address = deviceData.getString("positionUpdateTime", "未知位置")
                                    val status = deviceData.getString("connectionStatus", "unknown")
                                    val direction = deviceData.getNumber("direction", lastDirection.value)
                                    val convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude)
                                    val newDirection = direction
                                    val animationData = AnimationQueueItem(position = CoordinatePoint(latitude = convertedCoord.lat, longitude = convertedCoord.lng), rotation = normalizeRotation(calculateMapRotation(newDirection)), speed = speed, address = address, connectionStatus = status)
                                    addToAnimationQueue(animationData)
                                    lastDirection.value = newDirection
                                }
                            }
                        }
                         catch (err: Throwable) {
                            console.error("获取跟踪位置失败:", err, " at pages/vehicleTracking/vehicleTracking.uvue:479")
                        }
                })
            }
            fun gen_stopTracking_fn(): Unit {
                isTracking.value = false
                if (trackingInterval.value != null) {
                    clearInterval(trackingInterval.value as Number)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                    animationTimer.value = null
                }
                isAnimating.value = false
                uni_showToast(ShowToastOptions(title = "停止跟踪", icon = "success", duration = 1500))
            }
            val stopTracking = ::gen_stopTracking_fn
            fun gen_startTracking_fn(): Unit {
                if (!markerInitialized.value) {
                    initMarker()
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                val interval: Number = 3000
                isTracking.value = true
                if (trackingInterval.value != null) {
                    clearInterval(trackingInterval.value as Number)
                }
                loadTrackData()
                trackingInterval.value = setInterval(fun(){
                    loadTrackData()
                }
                , interval) as Number
                uni_showToast(ShowToastOptions(title = "开始跟踪", icon = "success", duration = 1500))
            }
            val startTracking = ::gen_startTracking_fn
            val toggleTracking = fun(){
                if (isTracking.value) {
                    stopTracking()
                } else {
                    startTracking()
                }
            }
            onHide(fun(){
                console.log("页面隐藏时停止自动刷新", " at pages/vehicleTracking/vehicleTracking.uvue:554")
                isTracking.value = false
                if (trackingInterval.value != null) {
                    clearInterval(trackingInterval.value as Number)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                    animationTimer.value = null
                }
                isAnimating.value = false
            }
            )
            onUnmounted(fun(){
                console.log("页面卸载时停止自动刷新", " at pages/vehicleTracking/vehicleTracking.uvue:575")
                isTracking.value = false
                if (trackingInterval.value != null) {
                    clearInterval(trackingInterval.value as Number)
                    trackingInterval.value = null
                }
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                    animationTimer.value = null
                }
                isAnimating.value = false
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "车辆跟踪", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "map-container"), _uA(
                        _cV(_component_map, _uM("id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "markers" to markers.value, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_sub_navBar, _uM("currentTime" to currentTime.value, "currentCar" to currentCar.value, "times" to times.value, "showCar" to true, "onUpdate:currentTime" to handleCurrentTimeUpdate, "carStatus" to connectionStatus.value), null, 8, _uA(
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
                        _cE("view", _uM("class" to "btn"), _uA(
                            _cV(_component_i_button, _uM("type" to if (isTracking.value) {
                                "danger"
                            } else {
                                "primary"
                            }
                            , "size" to "small", "onClick" to toggleTracking, "style" to _nS(_uM("backgroundColor" to if (isTracking.value) {
                                "#e64340"
                            } else {
                                "#1296db"
                            }
                            )), "text" to if (isTracking.value) {
                                "停止跟踪"
                            } else {
                                "开始跟踪"
                            }
                            ), null, 8, _uA(
                                "type",
                                "style",
                                "text"
                            ))
                        )),
                        _cE("view", _uM("class" to "pos-info-box"), _uA(
                            _cE("view", _uM("class" to "speed"), _uA(
                                _cE("text", _uM("class" to "tracking-info-text"), "时速："),
                                _cE("text", _uM("class" to "tracking-info-text"), _tD(currentSpeed.value) + "Km/h", 1)
                            )),
                            _cE("view", _uM("class" to "address"), _uA(
                                _cE("text", _uM("class" to "tracking-info-text"), "定位时间："),
                                _cE("text", _uM("class" to "tracking-info-text"), _tD(currentAddress.value), 1)
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "40rpx", "paddingBottom" to "20rpx", "paddingLeft" to "40rpx", "display" to "flex", "flexDirection" to "column", "boxShadow" to "0 -2px 10px rgba(0, 0, 0, 0.1)")), "btn" to _uM(".container .tools-panel " to _uM("marginBottom" to "20rpx")), "pos-info-box" to _uM(".container .tools-panel " to _uM("paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0)), "speed" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0)), "address" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0)), "tracking-info-text" to _uM(".container " to _uM("fontSize" to "28rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
