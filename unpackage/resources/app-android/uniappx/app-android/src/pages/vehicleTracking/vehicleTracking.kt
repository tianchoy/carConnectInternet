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
import uts.sdk.modules.DCloudUniMapTencent.Polyline
import uts.sdk.modules.DCloudUniMapTencent.LocationObject as LocationObject__1
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
            val temporaryRenderPoints = ref(_uA<CoordinatePoint>())
            val TRACKING_POLL_INTERVAL_MS: Number = 1000
            val TRACKING_ANIMATION_DURATION_MS: Number = 900
            val MAX_POSITION_JUMP_DISTANCE: Number = 500
            val polyline = ref(_uA<Polyline>())
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
            val MARKER_UPDATE_INTERVAL: Number = 30
            val isTracking = ref(false)
            val trackingInterval = ref<Number?>(null)
            val lastDirection = ref(0)
            val hasValidPosition = ref(false)
            var trackingSessionId: Number = 0
            var isTrackRequestPending = false
            var lastAcceptedPosition: CoordinatePoint? = null
            var lastAcceptedPositionTime = ""
            var lastAcceptedReceivedTime: Number = 0
            var pendingJumpPosition: CoordinatePoint? = null
            var pendingJumpTime = ""
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
                return wrapUTSPromise(suspend w1@{
                        try {
                            val data: UTSJSONObject = _uO("deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            val positions = res.data
                            if (res?.code != 200 || positions == null || positions.length == 0) {
                                showAppToast(ShowToastOptions(title = "获取位置失败", icon = "none"))
                                return@w1
                            }
                            var foundDevice = false
                            positions.forEach(fun(item: UTSJSONObject){
                                val itemImei = item.getString("imei", "")
                                if (itemImei == imei.value) {
                                    foundDevice = true
                                    val latitude = item.getNumber("latitude", 0)
                                    val longitude = item.getNumber("longitude", 0)
                                    if (latitude == 0 || longitude == 0) {
                                        showAppToast(ShowToastOptions(title = "位置信息缺失", icon = "none"))
                                        return
                                    }
                                    val direction = item.getNumber("direction", 0)
                                    val speed = item.getNumber("speed", 0)
                                    val positionUpdateTime = item.getString("positionUpdateTime", "定位时间未知")
                                    val status = item.getString("connectionStatus", "unknown")
                                    val convertedCoord = CoordTransform.wgs84ToTencentPrecise(latitude, longitude)
                                    currentPosition.latitude = convertedCoord.lat
                                    currentPosition.longitude = convertedCoord.lng
                                    hasValidPosition.value = true
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
                            }
                            )
                            if (!foundDevice) {
                                showAppToast(ShowToastOptions(title = "未找到车辆设备", icon = "none"))
                            }
                        }
                         catch (err: Throwable) {
                            console.error("获取初始位置失败:", err)
                            showAppToast(ShowToastOptions(title = "网络请求失败", icon = "none"))
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
                console.log("初始化标记点完成")
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
                console.log("option", option)
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
            fun gen_copyPosition_fn(p: CoordinatePoint): CoordinatePoint {
                return CoordinatePoint(latitude = p.latitude, longitude = p.longitude)
            }
            val copyPosition = ::gen_copyPosition_fn
            fun gen_isSamePosition_fn(first: CoordinatePoint, second: CoordinatePoint): Boolean {
                return first.latitude == second.latitude && first.longitude == second.longitude
            }
            val isSamePosition = ::gen_isSamePosition_fn
            fun gen_parsePositionTime_fn(value: String): Number {
                val time = Date.parse(value.replace(UTSRegExp("-", "g"), "/"))
                return if (isNaN(time)) {
                    0
                } else {
                    time
                }
            }
            val parsePositionTime = ::gen_parsePositionTime_fn
            fun gen_updateTrackingPolyline_fn(): Unit {
                val renderPoints = temporaryRenderPoints.value.map(fun(point: CoordinatePoint): CoordinatePoint {
                    return copyPosition(point)
                }
                )
                if (isAnimating.value && renderPoints.length > 0 && !isSamePosition(renderPoints[renderPoints.length - 1], currentPosition)) {
                    renderPoints.push(copyPosition(currentPosition))
                }
                if (renderPoints.length < 2) {
                    polyline.value = _uA()
                    return
                }
                val points = renderPoints.map(fun(point: CoordinatePoint): LocationObject__1 {
                    return LocationObject__1(point.latitude, point.longitude)
                }
                )
                polyline.value = _uA(
                    Polyline(points, "#888787", 3, false, false, "", "#888787", 0, _uA())
                )
            }
            val updateTrackingPolyline = ::gen_updateTrackingPolyline_fn
            fun gen_appendTemporaryRenderPoint_fn(position: CoordinatePoint): Unit {
                val last = if (temporaryRenderPoints.value.length > 0) {
                    temporaryRenderPoints.value[temporaryRenderPoints.value.length - 1]
                } else {
                    null
                }
                if (last != null && isSamePosition(last, position)) {
                    return
                }
                temporaryRenderPoints.value.push(copyPosition(position))
                if (temporaryRenderPoints.value.length > 1000) {
                    temporaryRenderPoints.value.splice(0, temporaryRenderPoints.value.length - 1000)
                }
                updateTrackingPolyline()
            }
            val appendTemporaryRenderPoint = ::gen_appendTemporaryRenderPoint_fn
            fun gen_resetTemporaryRenderSegment_fn(position: CoordinatePoint): Unit {
                temporaryRenderPoints.value = _uA(
                    copyPosition(position)
                )
                polyline.value = _uA()
            }
            val resetTemporaryRenderSegment = ::gen_resetTemporaryRenderSegment_fn
            fun gen_clearTemporaryRoute_fn(): Unit {
                temporaryRenderPoints.value = _uA()
                polyline.value = _uA()
            }
            val clearTemporaryRoute = ::gen_clearTemporaryRoute_fn
            val startPositionAnimation = fun(duration: Number, sessionId: Number, done: () -> Unit){
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                }
                isAnimating.value = true
                val begin = Date.now()
                val lat = currentPosition.latitude
                val lng = currentPosition.longitude
                val rot = currentRotation.value
                val latDiff = targetPosition.latitude - lat
                val lngDiff = targetPosition.longitude - lng
                val rotDiff = calculateShortestRotation(rot, targetRotation.value)
                var lastDraw = begin
                animationTimer.value = setInterval(fun(){
                    if (!isTracking.value || sessionId != trackingSessionId) {
                        return
                    }
                    val now = Date.now()
                    val progress = Math.min((now - begin) / duration, 1)
                    currentPosition.latitude = lat + latDiff * progress
                    currentPosition.longitude = lng + lngDiff * progress
                    currentRotation.value = normalizeRotation(rot + rotDiff * progress)
                    center["latitude"] = currentPosition.latitude
                    center["longitude"] = currentPosition.longitude
                    if (now - lastDraw >= MARKER_UPDATE_INTERVAL || progress >= 1) {
                        updateMarkerSmooth()
                        updateTrackingPolyline()
                        lastDraw = now
                    }
                    if (progress >= 1) {
                        clearInterval(animationTimer.value as Number)
                        animationTimer.value = null
                        isAnimating.value = false
                        currentPosition.latitude = targetPosition.latitude
                        currentPosition.longitude = targetPosition.longitude
                        currentRotation.value = normalizeRotation(targetRotation.value)
                        updateMarkerSmooth()
                        appendTemporaryRenderPoint(currentPosition)
                        done()
                    }
                }
                , 30) as Number
            }
            fun gen_processAnimationQueue_fn(sessionId: Number): Unit {
                if (!isTracking.value || sessionId != trackingSessionId || animationQueue.value.length == 0) {
                    isProcessingQueue.value = false
                    return
                }
                isProcessingQueue.value = true
                val next = animationQueue.value.shift() as AnimationQueueItem
                targetPosition.latitude = next.position.latitude
                targetPosition.longitude = next.position.longitude
                targetRotation.value = next.rotation
                currentSpeed.value = next.speed
                currentAddress.value = next.address
                connectionStatus.value = next.connectionStatus
                startPositionAnimation(TRACKING_ANIMATION_DURATION_MS, sessionId, fun(){
                    if (!isTracking.value || sessionId != trackingSessionId) {
                        return
                    }
                    isProcessingQueue.value = false
                    if (animationQueue.value.length > 0) {
                        setTimeout(fun(){
                            return gen_processAnimationQueue_fn(sessionId)
                        }
                        , 50)
                    }
                }
                )
            }
            val processAnimationQueue = ::gen_processAnimationQueue_fn
            fun gen_acceptLivePosition_fn(item: UTSJSONObject, position: CoordinatePoint, positionTime: String, sessionId: Number): Unit {
                val direction = item.getNumber("direction", lastDirection.value)
                val animationData = AnimationQueueItem(position = position, rotation = normalizeRotation(calculateMapRotation(direction)), speed = item.getNumber("speed", 0), address = if (positionTime == "") {
                    "未知位置"
                } else {
                    positionTime
                }
                , connectionStatus = item.getString("connectionStatus", "unknown"), positionTime = positionTime)
                lastAcceptedPosition = copyPosition(position)
                lastAcceptedPositionTime = positionTime
                lastAcceptedReceivedTime = Date.now()
                if (isAnimating.value || animationQueue.value.length > 0) {
                    animationQueue.value = _uA()
                }
                animationQueue.value.push(animationData)
                lastDirection.value = direction
                if (!isProcessingQueue.value && !isAnimating.value) {
                    processAnimationQueue(sessionId)
                }
            }
            val acceptLivePosition = ::gen_acceptLivePosition_fn
            fun gen_relocateToConfirmedPosition_fn(item: UTSJSONObject, position: CoordinatePoint, positionTime: String): Unit {
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                }
                animationTimer.value = null
                isAnimating.value = false
                isProcessingQueue.value = false
                animationQueue.value = _uA()
                currentPosition.latitude = position.latitude
                currentPosition.longitude = position.longitude
                targetPosition.latitude = position.latitude
                targetPosition.longitude = position.longitude
                val direction = item.getNumber("direction", lastDirection.value)
                currentRotation.value = normalizeRotation(calculateMapRotation(direction))
                targetRotation.value = currentRotation.value
                center["latitude"] = position.latitude
                center["longitude"] = position.longitude
                currentSpeed.value = item.getNumber("speed", 0)
                currentAddress.value = positionTime
                connectionStatus.value = item.getString("connectionStatus", "unknown")
                lastDirection.value = direction
                lastAcceptedPosition = copyPosition(position)
                lastAcceptedPositionTime = positionTime
                lastAcceptedReceivedTime = Date.now()
                resetTemporaryRenderSegment(position)
                updateMarkerSmooth()
            }
            val relocateToConfirmedPosition = ::gen_relocateToConfirmedPosition_fn
            val loadTrackData = fun(sessionId: Number): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!isTracking.value || sessionId != trackingSessionId || isTrackRequestPending) {
                            return@w1
                        }
                        isTrackRequestPending = true
                        try {
                            val res = await(getDevicePos(_uO("deptId" to deptId.value, "deviceids" to imei.value)))
                            val positions = res.data
                            if (!isTracking.value || sessionId != trackingSessionId || res?.code != 200 || positions == null) {
                                return@w1
                            }
                            val item = positions.find(fun(value: UTSJSONObject): Boolean {
                                return value.getString("imei", "") == imei.value
                            }
                            )
                            if (item == null) {
                                return@w1
                            }
                            val rawLat = item.getNumber("latitude", 0)
                            val rawLng = item.getNumber("longitude", 0)
                            if (rawLat == 0 || rawLng == 0 || !isFinite(rawLat) || !isFinite(rawLng)) {
                                return@w1
                            }
                            val converted = CoordTransform.wgs84ToTencentPrecise(rawLat, rawLng)
                            if (!isFinite(converted.lat) || !isFinite(converted.lng)) {
                                return@w1
                            }
                            val position = CoordinatePoint(latitude = converted.lat, longitude = converted.lng)
                            val positionTime = item.getString("positionUpdateTime", "")
                            val previous = lastAcceptedPosition
                            if (positionTime != "" && positionTime == lastAcceptedPositionTime) {
                                return@w1
                            }
                            if (previous == null || isSamePosition(previous, position)) {
                                return@w1
                            }
                            val sourceTime = parsePositionTime(positionTime)
                            val previousTime = parsePositionTime(lastAcceptedPositionTime)
                            val elapsedSeconds = if (sourceTime > previousTime && previousTime > 0) {
                                (sourceTime - previousTime) / 1000
                            } else {
                                Math.max((Date.now() - lastAcceptedReceivedTime) / 1000, 1)
                            }
                            val distance = calculateDistance(previous.latitude, previous.longitude, position.latitude, position.longitude)
                            val impliedSpeed = distance / elapsedSeconds * 3.6
                            if (distance > MAX_POSITION_JUMP_DISTANCE || impliedSpeed > 210) {
                                val pending = pendingJumpPosition
                                if (pending != null && calculateDistance(pending.latitude, pending.longitude, position.latitude, position.longitude) <= MAX_POSITION_JUMP_DISTANCE && positionTime != pendingJumpTime) {
                                    pendingJumpPosition = null
                                    pendingJumpTime = ""
                                    relocateToConfirmedPosition(item, position, positionTime)
                                } else {
                                    pendingJumpPosition = copyPosition(position)
                                    pendingJumpTime = positionTime
                                }
                                return@w1
                            }
                            pendingJumpPosition = null
                            pendingJumpTime = ""
                            acceptLivePosition(item, position, positionTime, sessionId)
                        }
                         catch (error: Throwable) {
                            console.error("获取跟踪位置失败:", error)
                        }
                         finally {
                            if (sessionId == trackingSessionId) {
                                isTrackRequestPending = false
                            }
                        }
                })
            }
            fun stopTracking(showToast: Boolean = true): Unit {
                trackingSessionId += 1
                isTracking.value = false
                if (trackingInterval.value != null) {
                    clearInterval(trackingInterval.value as Number)
                    trackingInterval.value = null
                }
                if (animationTimer.value != null) {
                    clearInterval(animationTimer.value as Number)
                    animationTimer.value = null
                }
                if (temporaryRenderPoints.value.length > 0) {
                    val lastIndex = temporaryRenderPoints.value.length - 1
                    temporaryRenderPoints.value[lastIndex] = copyPosition(currentPosition)
                    updateTrackingPolyline()
                }
                animationQueue.value = _uA()
                isAnimating.value = false
                isProcessingQueue.value = false
                isTrackRequestPending = false
                pendingJumpPosition = null
                if (showToast) {
                    showAppToast(ShowToastOptions(title = "停止跟踪", icon = "success", duration = 1500))
                }
            }
            fun gen_startTracking_fn(): Unit {
                if (!hasValidPosition.value) {
                    showAppToast(ShowToastOptions(title = "暂无有效定位信息", icon = "none"))
                    return
                }
                if (!markerInitialized.value) {
                    initMarker()
                }
                clearTemporaryRoute()
                resetTemporaryRenderSegment(currentPosition)
                animationQueue.value = _uA()
                isProcessingQueue.value = false
                lastAcceptedPosition = copyPosition(currentPosition)
                lastAcceptedPositionTime = ""
                lastAcceptedReceivedTime = Date.now()
                pendingJumpPosition = null
                trackingSessionId += 1
                val sessionId = trackingSessionId
                isTracking.value = true
                loadTrackData(sessionId)
                trackingInterval.value = setInterval(fun(){
                    loadTrackData(sessionId)
                }
                , TRACKING_POLL_INTERVAL_MS) as Number
                showAppToast(ShowToastOptions(title = "开始跟踪", icon = "success", duration = 1500))
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
                stopTracking(false)
            }
            )
            onUnload(fun(){
                stopTracking(false)
                clearTemporaryRoute()
            }
            )
            onUnmounted(fun(){
                stopTracking(false)
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "车辆跟踪", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "map-container"), _uA(
                            _cV(_component_map, _uM("id" to "myMap", "latitude" to currentPosition.latitude, "longitude" to currentPosition.longitude, "markers" to markers.value, "polyline" to polyline.value, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), null, 8, _uA(
                                "latitude",
                                "longitude",
                                "markers",
                                "polyline",
                                "scale",
                                "style"
                            )),
                            _cV(_component_sub_navBar, _uM("class" to "sub-nav-overlay", "currentTime" to currentTime.value, "currentCar" to currentCar.value, "times" to times.value, "showCar" to true, "onUpdate:currentTime" to handleCurrentTimeUpdate, "carStatus" to connectionStatus.value), null, 8, _uA(
                                "currentTime",
                                "currentCar",
                                "times",
                                "carStatus"
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "sub-nav-overlay" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to 0, "left" to 0, "right" to 0, "zIndex" to 100)), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "40rpx", "paddingBottom" to "20rpx", "paddingLeft" to "40rpx", "display" to "flex", "flexDirection" to "column", "boxShadow" to "0 -2px 10px rgba(0, 0, 0, 0.1)")), "btn" to _uM(".container .tools-panel " to _uM("marginBottom" to "20rpx")), "pos-info-box" to _uM(".container .tools-panel " to _uM("paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0)), "speed" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0)), "address" to _uM(".container .tools-panel .pos-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "paddingTop" to "8rpx", "paddingRight" to 0, "paddingBottom" to "8rpx", "paddingLeft" to 0)), "tracking-info-text" to _uM(".container " to _uM("fontSize" to "28rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
