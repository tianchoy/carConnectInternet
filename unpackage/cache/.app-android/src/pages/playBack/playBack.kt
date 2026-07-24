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
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
open class GenPagesPlayBackPlayBack : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesPlayBackPlayBack) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesPlayBackPlayBack
            val _cache = __ins.renderCache
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val imei = ref<String?>("")
            val carStatus = ref<String?>("")
            val plateNo = ref<String?>("")
            val carType = ref<String?>("")
            val showDateTimePicker = ref(false)
            val currentPickerType = ref("start")
            val pickerTitle = ref("选择开始时间")
            val trackPoints = ref(_uA<TrackPoint>())
            val polyline = ref(_uA<Polyline>())
            var unplayedPolyline: Polyline? = null
            var playedPolyline: Polyline? = null
            val isPlaying = ref(false)
            val isTrackPlayable = ref(false)
            val playbackSpeed = ref(5)
            val totalDistance = ref(0)
            val currentSpeed = ref(0)
            val currentTime = ref("")
            val currentIndex = ref(0)
            val carMarker = ref<MapMarker?>(null)
            var playbackTimer: Number? = null
            var lastTimestamp: Number = 0
            var replaySessionId: Number = 0
            val startTime = ref("")
            val endTime = ref("")
            val lat = ref<String?>("")
            val lng = ref<String?>("")
            val sTime = ref("")
            val eTime = ref("")
            val markers = ref(_uA<MapMarker>())
            fun gen_safeParseDate_fn(dateStr: String): Number {
                if (!(dateStr != "")) {
                    return 0
                }
                val iosCompatibleStr = dateStr.replace(UTSRegExp("-", "g"), "/")
                val date = Date(iosCompatibleStr)
                if (isNaN(date.getTime())) {
                    val isoStr = dateStr.replace(" ", "T")
                    val isoDate = Date(isoStr)
                    if (!isNaN(isoDate.getTime())) {
                        return isoDate.getTime()
                    }
                    return 0
                }
                return date.getTime()
            }
            val safeParseDate = ::gen_safeParseDate_fn
            fun gen_normalizeDateTime_fn(dateStr: String): String {
                if (!(dateStr != "")) {
                    return ""
                }
                var normalized = dateStr.replace(UTSRegExp("-", "g"), "/")
                val parts = normalized.split(" ")
                if (parts.length < 2) {
                    return normalized
                }
                val timeParts = parts[1].split(":")
                if (timeParts.length == 2) {
                    normalized += ":00"
                }
                return normalized
            }
            val normalizeDateTime = ::gen_normalizeDateTime_fn
            fun gen_formatDateForDisplay_fn(dateStr: String): String {
                return normalizeDateTime(dateStr).replace(UTSRegExp("\\/", "g"), "-")
            }
            val formatDateForDisplay = ::gen_formatDateForDisplay_fn
            fun gen_calculateBearing_fn(lat1: Number, lng1: Number, lat2: Number, lng2: Number): Number {
                val degToRad = fun(d: Number): Number {
                    return d * Math.PI / 180
                }
                val radToDeg = fun(r: Number): Number {
                    return r * 180 / Math.PI
                }
                val φ1 = degToRad(lat1)
                val φ2 = degToRad(lat2)
                val Δλ = degToRad(lng2 - lng1)
                val y = Math.sin(Δλ) * Math.cos(φ2)
                val x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
                val θ = Math.atan2(y, x)
                return (radToDeg(θ) + 360) % 360
            }
            val calculateBearing = ::gen_calculateBearing_fn
            fun gen_getDistance_fn(lat1: Number, lng1: Number, lat2: Number, lng2: Number): Number {
                val rad = fun(d: Number): Number {
                    return d * Math.PI / 180.0
                }
                val radLat1 = rad(lat1)
                val radLat2 = rad(lat2)
                val a = radLat1 - radLat2
                val b = rad(lng1) - rad(lng2)
                val s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
                return s * 6378137
            }
            val getDistance = ::gen_getDistance_fn
            fun gen_calculateTrackBounds_fn(): TrackBounds? {
                if (trackPoints.value.length == 0) {
                    return null
                }
                var minLat = trackPoints.value[0].latitude
                var maxLat = trackPoints.value[0].latitude
                var minLng = trackPoints.value[0].longitude
                var maxLng = trackPoints.value[0].longitude
                trackPoints.value.forEach(fun(point: TrackPoint): Unit {
                    minLat = Math.min(minLat, point.latitude)
                    maxLat = Math.max(maxLat, point.latitude)
                    minLng = Math.min(minLng, point.longitude)
                    maxLng = Math.max(maxLng, point.longitude)
                }
                )
                return TrackBounds(minLat = minLat, maxLat = maxLat, minLng = minLng, maxLng = maxLng)
            }
            val calculateTrackBounds = ::gen_calculateTrackBounds_fn
            fun gen_adjustMapToFitTrack_fn() {
                val nullableBounds = calculateTrackBounds()
                if (nullableBounds == null) {
                    return
                }
                val bounds = nullableBounds
                center["latitude"] = (bounds.minLat + bounds.maxLat) / 2
                center["longitude"] = (bounds.minLng + bounds.maxLng) / 2
                val latDiff = bounds.maxLat - bounds.minLat
                val lngDiff = bounds.maxLng - bounds.minLng
                val maxDiff = Math.max(latDiff, lngDiff)
                if (maxDiff > 0.1) {
                    mapScale.value = 10
                } else if (maxDiff > 0.05) {
                    mapScale.value = 12
                } else if (maxDiff > 0.02) {
                    mapScale.value = 15
                } else {
                    mapScale.value = 16
                }
            }
            val adjustMapToFitTrack = ::gen_adjustMapToFitTrack_fn
            fun gen_calculateTrackDistance_fn() {
                totalDistance.value = 0
                run {
                    var i: Number = 1
                    while(i < trackPoints.value.length){
                        totalDistance.value += getDistance(trackPoints.value[i - 1].latitude, trackPoints.value[i - 1].longitude, trackPoints.value[i].latitude, trackPoints.value[i].longitude)
                        i++
                    }
                }
            }
            val calculateTrackDistance = ::gen_calculateTrackDistance_fn
            fun gen_initDateTime_fn() {
                val now = Date()
                val formatTime = fun(date: Date): String {
                    val month = (date.getMonth() + 1).toString(10).padStart(2, "0")
                    val day = date.getDate().toString(10).padStart(2, "0")
                    val hours = date.getHours().toString(10).padStart(2, "0")
                    val minutes = date.getMinutes().toString(10).padStart(2, "0")
                    val seconds = date.getSeconds().toString(10).padStart(2, "0")
                    return "" + date.getFullYear() + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds
                }
                endTime.value = formatTime(now)
                val startDate = Date(now.getTime() - 86400000)
                startTime.value = formatTime(startDate)
            }
            val initDateTime = ::gen_initDateTime_fn
            fun gen_initCarMarker_fn() {
                if (trackPoints.value.length == 0) {
                    return
                }
                val firstPoint = trackPoints.value[0]
                val marker = MapMarker(id = 999, latitude = firstPoint.latitude, longitude = firstPoint.longitude, iconPath = getDeviceIcon(carStatus.value ?: "", carType.value ?: ""), width = 25, height = 25, rotate = firstPoint.rotation, anchor = Anchor(x = 0.5, y = 0.5))
                carMarker.value = marker
                val startMarker = MapMarker(id = 1000, latitude = firstPoint.latitude, longitude = firstPoint.longitude, iconPath = "/static/start.png", width = 24, height = 24, anchor = Anchor(x = 0.5, y = 0.5), callout = MapMarkerCallout(content = "起点", borderRadius = 5, padding = 5, display = "BYCLICK"))
                val lastPoint = trackPoints.value[trackPoints.value.length - 1]
                val endMarker = MapMarker(id = 1001, latitude = lastPoint.latitude, longitude = lastPoint.longitude, iconPath = "/static/end.png", width = 24, height = 24, anchor = Anchor(x = 0.5, y = 0.5), callout = MapMarkerCallout(content = "终点", borderRadius = 5, padding = 5, display = "BYCLICK"))
                markers.value = _uA(
                    marker,
                    startMarker,
                    endMarker
                )
            }
            val initCarMarker = ::gen_initCarMarker_fn
            fun gen_toNativePoints_fn(points: UTSArray<TrackPoint>): UTSArray<LocationObject__1> {
                return points.map(fun(point: TrackPoint): LocationObject__1 {
                    return LocationObject__1(point.latitude, point.longitude)
                }
                )
            }
            val toNativePoints = ::gen_toNativePoints_fn
            fun gen_initPolyline_fn() {
                if (trackPoints.value.length < 2) {
                    unplayedPolyline = null
                    playedPolyline = null
                    polyline.value = _uA()
                    return
                }
                val initialUnplayedPolyline = Polyline(toNativePoints(trackPoints.value), "#888787", 3, true, false, "", "#888787", 0, _uA())
                initialUnplayedPolyline.color = "#888787"
                initialUnplayedPolyline.width = 3
                initialUnplayedPolyline.dottedLine = true
                initialUnplayedPolyline.arrowLine = false
                initialUnplayedPolyline.borderColor = "#888787"
                initialUnplayedPolyline.borderWidth = 0
                val initialPlayedPolyline = Polyline(toNativePoints(trackPoints.value.slice(0, 1)), "#3c5cff", 5, false, true, "", "#FFFFFF", 1, _uA())
                initialPlayedPolyline.color = "#3c5cff"
                initialPlayedPolyline.width = 5
                initialPlayedPolyline.dottedLine = false
                initialPlayedPolyline.arrowLine = true
                initialPlayedPolyline.borderColor = "#FFFFFF"
                initialPlayedPolyline.borderWidth = 1
                unplayedPolyline = initialUnplayedPolyline
                playedPolyline = initialPlayedPolyline
                polyline.value = _uA(
                    initialUnplayedPolyline,
                    initialPlayedPolyline
                )
            }
            val initPolyline = ::gen_initPolyline_fn
            fun gen_updatePolyline_fn() {
                val currentUnplayedPolyline = unplayedPolyline
                val currentPlayedPolyline = playedPolyline
                if (trackPoints.value.length == 0 || currentUnplayedPolyline == null || currentPlayedPolyline == null) {
                    return
                }
                currentUnplayedPolyline.points = toNativePoints(trackPoints.value.slice(currentIndex.value))
                currentPlayedPolyline.points = toNativePoints(trackPoints.value.slice(0, currentIndex.value + 1))
                polyline.value = _uA(
                    currentUnplayedPolyline,
                    currentPlayedPolyline
                )
            }
            val updatePolyline = ::gen_updatePolyline_fn
            fun gen_updateCarPosition_fn() {
                val marker = carMarker.value
                if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
                    val point = trackPoints.value[currentIndex.value]
                    val updatedMarker = MapMarker(id = marker.id, latitude = point.latitude, longitude = point.longitude, iconPath = marker.iconPath, width = marker.width, height = marker.height, rotate = point.rotation, anchor = marker.anchor, callout = marker.callout, label = marker.label)
                    carMarker.value = updatedMarker
                    markers.value = _uA(
                        updatedMarker
                    ).concat(markers.value.slice(1))
                    if (currentIndex.value % 5 == 0 || currentIndex.value == 0 || currentIndex.value == trackPoints.value.length - 1) {
                        center["latitude"] = point.latitude
                        center["longitude"] = point.longitude
                    }
                }
            }
            val updateCarPosition = ::gen_updateCarPosition_fn
            fun gen_showPicker_fn(type: String) {
                currentPickerType.value = type
                pickerTitle.value = if (type == "start") {
                    "选择开始时间"
                } else {
                    "选择结束时间"
                }
                showDateTimePicker.value = true
            }
            val showPicker = ::gen_showPicker_fn
            fun gen_showCurrentPosition_fn() {
                isTrackPlayable.value = false
                val originalLatText = lat.value ?: ""
                val originalLngText = lng.value ?: ""
                val originalLat = parseFloat(originalLatText)
                val originalLng = parseFloat(originalLngText)
                if (isNaN(originalLat) || isNaN(originalLng) || originalLat == 0 || originalLng == 0) {
                    showAppToast(ShowToastOptions(title = "这段时间没有数据", icon = "none", duration = 2000))
                    return
                }
                showAppToast(ShowToastOptions(title = "这段时间没有数据", icon = "none", duration = 2000))
                val convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)
                center["latitude"] = convertedCoord.lat
                center["longitude"] = convertedCoord.lng
                mapScale.value = 15
                val currentPoint = TrackPoint(latitude = convertedCoord.lat, longitude = convertedCoord.lng, rotation = 0, deviceTime = Date().toLocaleString(), speed = 0)
                val marker = MapMarker(id = 999, latitude = currentPoint.latitude, longitude = currentPoint.longitude, iconPath = getDeviceIcon(carStatus.value ?: "", carType.value ?: ""), width = 25, height = 25, rotate = 0, anchor = Anchor(x = 0.5, y = 0.5))
                carMarker.value = marker
                markers.value = _uA(
                    marker
                )
            }
            val showCurrentPosition = ::gen_showCurrentPosition_fn
            fun gen_clearTrackDisplay_fn(): Unit {
                trackPoints.value = _uA()
                isTrackPlayable.value = false
                currentIndex.value = 0
                currentSpeed.value = 0
                currentTime.value = ""
                totalDistance.value = 0
                carMarker.value = null
                markers.value = _uA()
                unplayedPolyline = null
                playedPolyline = null
                polyline.value = _uA()
            }
            val clearTrackDisplay = ::gen_clearTrackDisplay_fn
            fun gen_pausePlayback_fn() {
                isPlaying.value = false
                val timer = playbackTimer
                if (timer != null) {
                    clearTimeout(timer)
                    playbackTimer = null
                }
            }
            val pausePlayback = ::gen_pausePlayback_fn
            fun gen_renderPlaybackIndex_fn(): Unit {
                if (trackPoints.value.length == 0) {
                    return
                }
                updateCarPosition()
                updatePolyline()
                val point = trackPoints.value[currentIndex.value]
                currentSpeed.value = point.speed
                currentTime.value = point.deviceTime
            }
            val renderPlaybackIndex = ::gen_renderPlaybackIndex_fn
            fun gen_processTrackData_fn(positions: UTSArray<UTSJSONObject>): Unit {
                val processedPoints: UTSArray<TrackPoint> = _uA()
                run {
                    var i: Number = 0
                    while(i < positions.length){
                        val point = positions[i]
                        val deviceTimeStr = point.getString("deviceTime", "")
                        val originalLat = point.getNumber("latitude", 0)
                        val originalLng = point.getNumber("longitude", 0)
                        if (originalLat == 0 || originalLng == 0 || !isFinite(originalLat) || !isFinite(originalLng) || deviceTimeStr == "" || safeParseDate(deviceTimeStr) == 0) {
                            i++
                            continue
                        }
                        val convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)
                        if (!isFinite(convertedCoord.lat) || !isFinite(convertedCoord.lng)) {
                            i++
                            continue
                        }
                        processedPoints.push(TrackPoint(latitude = convertedCoord.lat, longitude = convertedCoord.lng, rotation = 0, deviceTime = formatDateForDisplay(deviceTimeStr), speed = point.getNumber("speed", 0)))
                        i++
                    }
                }
                run {
                    var i: Number = 1
                    while(i < processedPoints.length){
                        val previousPoint = processedPoints[i - 1]
                        val currentPoint = processedPoints[i]
                        currentPoint.rotation = calculateBearing(previousPoint.latitude, previousPoint.longitude, currentPoint.latitude, currentPoint.longitude)
                        i++
                    }
                }
                if (processedPoints.length > 1) {
                    processedPoints[processedPoints.length - 1].rotation = processedPoints[processedPoints.length - 2].rotation
                }
                trackPoints.value = processedPoints
                isTrackPlayable.value = processedPoints.length > 1
                currentIndex.value = 0
                calculateTrackDistance()
                initCarMarker()
                initPolyline()
                adjustMapToFitTrack()
                renderPlaybackIndex()
            }
            val processTrackData = ::gen_processTrackData_fn
            val loadTrackPos = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        pausePlayback()
                        val requestId = ++replaySessionId
                        clearTrackDisplay()
                        uni_showLoading(ShowLoadingOptions(title = "加载中..."))
                        val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/playBack/playBack.uvue", 606, 9), "imei" to imei.value, "startTime" to startTime.value.replace(UTSRegExp("\\/", "g"), "-"), "endTime" to endTime.value.replace(UTSRegExp("\\/", "g"), "-"), "minParkTime" to 2, "withStop" to false, "withPos" to true, "withTrip" to false)
                        try {
                            val res = await(getTrackPos(data))
                            if (requestId != replaySessionId) {
                                return@w1
                            }
                            val positions = res.data?.getArray<UTSJSONObject>("positions")
                            if (positions != null && positions.length > 0) {
                                processTrackData(positions)
                                if (trackPoints.value.length == 0) {
                                    showCurrentPosition()
                                }
                            } else {
                                showCurrentPosition()
                            }
                        }
                         catch (error: Throwable) {
                            if (requestId != replaySessionId) {
                                return@w1
                            }
                            console.error("加载轨迹失败:", error, " at pages/playBack/playBack.uvue:631")
                            showAppToast(ShowToastOptions(title = "轨迹加载失败", icon = "none"))
                            if (!isNaN(parseFloat(lat.value ?: "")) && !isNaN(parseFloat(lng.value ?: ""))) {
                                showCurrentPosition()
                            }
                        }
                         finally {
                            if (requestId == replaySessionId) {
                                uni_hideLoading(null)
                            }
                        }
                })
            }
            fun gen_resetPlayback_fn() {
                pausePlayback()
                currentIndex.value = 0
                renderPlaybackIndex()
            }
            val resetPlayback = ::gen_resetPlayback_fn
            fun gen_playNextPoint_fn(): Boolean {
                if (currentIndex.value >= trackPoints.value.length - 1) {
                    pausePlayback()
                    showAppToast(ShowToastOptions(title = "轨迹回放完成", icon = "none", duration = 1500))
                    return false
                }
                currentIndex.value++
                renderPlaybackIndex()
                return true
            }
            val playNextPoint = ::gen_playNextPoint_fn
            fun gen_playbackStep_fn(sessionId: Number) {
                if (!isPlaying.value || sessionId != replaySessionId) {
                    return
                }
                val now = Date.now()
                val elapsed = now - lastTimestamp
                val interval = (1000 as Number) / playbackSpeed.value
                if (elapsed >= interval) {
                    playNextPoint()
                    lastTimestamp = now - (elapsed % interval)
                }
                if (isPlaying.value && sessionId == replaySessionId) {
                    playbackTimer = setTimeout(fun(){
                        gen_playbackStep_fn(sessionId)
                    }
                    , 16)
                }
            }
            val playbackStep = ::gen_playbackStep_fn
            fun gen_startPlayback_fn() {
                if (!isTrackPlayable.value) {
                    showAppToast(ShowToastOptions(title = "没有轨迹数据", icon = "none"))
                    return
                }
                if (currentIndex.value >= trackPoints.value.length - 1) {
                    resetPlayback()
                }
                isPlaying.value = true
                val sessionId = ++replaySessionId
                if (!playNextPoint()) {
                    return
                }
                lastTimestamp = Date.now()
                playbackStep(sessionId)
            }
            val startPlayback = ::gen_startPlayback_fn
            fun gen_togglePlayback_fn() {
                if (isPlaying.value) {
                    pausePlayback()
                } else {
                    startPlayback()
                }
            }
            val togglePlayback = ::gen_togglePlayback_fn
            fun gen_onConfirm_fn(value: String) {
                val formattedValue = normalizeDateTime(value)
                if (currentPickerType.value == "start") {
                    startTime.value = formattedValue
                } else {
                    endTime.value = formattedValue
                }
                resetPlayback()
                loadTrackPos()
                showDateTimePicker.value = false
            }
            val onConfirm = ::gen_onConfirm_fn
            fun gen_onCancel_fn() {
                showDateTimePicker.value = false
            }
            val onCancel = ::gen_onCancel_fn
            fun gen_setPlaybackSpeed_fn(e: Number): Unit {
                val wasPlaying = isPlaying.value
                if (wasPlaying) {
                    pausePlayback()
                }
                playbackSpeed.value = e
                if (wasPlaying) {
                    startPlayback()
                }
            }
            val setPlaybackSpeed = ::gen_setPlaybackSpeed_fn
            onLoad(fun(option){
                imei.value = option["imei"] ?: null
                carStatus.value = option["connectionStatus"] ?: ""
                plateNo.value = option["plateNo"] ?: ""
                carType.value = option["carType"] ?: ""
                lat.value = option["lat"] ?: null
                lng.value = option["lng"] ?: null
                sTime.value = option["startTime"] ?: ""
                eTime.value = option["endTime"] ?: ""
                console.log(sTime.value, eTime.value, " at pages/playBack/playBack.uvue:750")
                if (sTime.value != "" && eTime.value != "") {
                    startTime.value = normalizeDateTime(sTime.value)
                    endTime.value = normalizeDateTime(eTime.value)
                    loadTrackPos()
                } else {
                    initDateTime()
                    loadTrackPos()
                }
            }
            )
            onHide(fun(){
                pausePlayback()
                ++replaySessionId
            }
            )
            onUnload(fun(){
                pausePlayback()
                ++replaySessionId
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_slider = resolveEasyComponent("i-slider", GenUniModulesIUiXComponentsISliderISliderClass)
                val _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker", GenUniModulesLimeDateTimePickerComponentsLDateTimePickerLDateTimePickerClass)
                val _component_l_popup = resolveEasyComponent("l-popup", GenUniModulesLimePopupComponentsLPopupLPopupClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "轨迹回放", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "map-container"), _uA(
                            _cV(_component_map, _uM("id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "markers" to markers.value, "polyline" to polyline.value, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to true, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), null, 8, _uA(
                                "latitude",
                                "longitude",
                                "markers",
                                "polyline",
                                "scale",
                                "style"
                            )),
                            _cV(_component_sub_navBar, _uM("class" to "sub-nav-overlay", "showTime" to false, "currentCar" to plateNo.value, "showCar" to true, "carStatus" to carStatus.value), null, 8, _uA(
                                "currentCar",
                                "carStatus"
                            ))
                        )),
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
                                    _cE("text", null, "至"),
                                    _cE("text", _uM("class" to "Date", "onClick" to fun(){
                                        showPicker("end")
                                    }
                                    ), _tD(endTime.value), 9, _uA(
                                        "onClick"
                                    ))
                                ))
                            )),
                            _cE("view", _uM("class" to "tool-tag-item"), _uA(
                                _cV(_component_i_button, _uM("type" to "primary", "onClick" to togglePlayback, "size" to "small", "text" to if (isPlaying.value) {
                                    "暂停"
                                } else {
                                    "播放"
                                }
                                ), null, 8, _uA(
                                    "text"
                                )),
                                _cE("view", _uM("class" to "slider"), _uA(
                                    _cV(_component_i_slider, _uM("modelValue" to playbackSpeed.value, "onUpdate:modelValue" to fun(`$event`: Number){
                                        playbackSpeed.value = `$event`
                                    }
                                    , "min" to 1, "max" to 50, "step" to 5, "onChange" to setPlaybackSpeed), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                )),
                                _cE("text", _uM("class" to "speed-label"), _tD(playbackSpeed.value) + "x", 1)
                            )),
                            _cE("view", _uM("class" to "play-back-info"), _uA(
                                _cE("view", _uM("class" to "item-info"), _uA(
                                    _cE("text", _uM("class" to "info-label"), _tD(currentTime.value), 1),
                                    _cE("text", _uM("class" to "info-label"), "时间")
                                )),
                                _cE("view", _uM("class" to "item-info"), _uA(
                                    _cE("text", _uM("class" to "info-label"), _tD(currentSpeed.value) + "Km/h", 1),
                                    _cE("text", _uM("class" to "info-label"), "速度")
                                )),
                                _cE("view", _uM("class" to "item-info"), _uA(
                                    _cE("text", _uM("class" to "info-label"), _tD((totalDistance.value / 1000).toFixed(1)) + "Km", 1),
                                    _cE("text", _uM("class" to "info-label"), "里程")
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "sub-nav-overlay" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to 0, "left" to 0, "right" to 0, "zIndex" to 100)), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "50rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx", "boxShadow" to "0 -10rpx 20rpx rgba(0, 0, 0, 0.1)")), "Datetime-box" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "30rpx")), "date-box" to _uM(".container .tools-panel .Datetime-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "Date" to _uM(".container .tools-panel .Datetime-box .date-box " to _uM("fontSize" to "30rpx", "borderTopLeftRadius" to "5rpx", "borderTopRightRadius" to "5rpx", "borderBottomRightRadius" to "5rpx", "borderBottomLeftRadius" to "5rpx", "backgroundColor" to "#f5f5f5", "paddingTop" to 0, "paddingRight" to "10rpx", "paddingBottom" to 0, "paddingLeft" to "10rpx")), "playbackdetail" to _uM(".container .tools-panel .Datetime-box " to _uM("fontSize" to "25rpx", "color" to "#1890FF")), "tool-tag-item" to _uM(".container .tools-panel " to _uM("paddingTop" to "40rpx", "paddingRight" to "20rpx", "paddingBottom" to "40rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "speed-label" to _uM(".container .tools-panel .tool-tag-item " to _uM("borderTopWidth" to "2rpx", "borderRightWidth" to "2rpx", "borderBottomWidth" to "2rpx", "borderLeftWidth" to "2rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#1890FF", "borderRightColor" to "#1890FF", "borderBottomColor" to "#1890FF", "borderLeftColor" to "#1890FF", "fontSize" to "25rpx", "color" to "#1890FF", "paddingTop" to "5rpx", "paddingRight" to "15rpx", "paddingBottom" to "5rpx", "paddingLeft" to "15rpx", "borderTopLeftRadius" to "30rpx", "borderTopRightRadius" to "30rpx", "borderBottomRightRadius" to "30rpx", "borderBottomLeftRadius" to "30rpx", "marginLeft" to "20rpx")), "slider" to _uM(".container .tools-panel .tool-tag-item " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "paddingTop" to 0, "paddingRight" to "20rpx", "paddingBottom" to 0, "paddingLeft" to "30rpx", "overflow" to "visible")), "play-btn" to _uM(".container .tools-panel .tool-tag-item " to _uM("fontSize" to "25rpx", "color" to "#ffffff", "paddingTop" to "10rpx", "paddingRight" to "25rpx", "paddingBottom" to "10rpx", "paddingLeft" to "25rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "marginLeft" to "20rpx", "backgroundColor" to "#1890FF")), "play-back-info" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to "20rpx", "backgroundColor" to "#f9f9f9", "borderTopLeftRadius" to "15rpx", "borderTopRightRadius" to "15rpx", "borderBottomRightRadius" to "15rpx", "borderBottomLeftRadius" to "15rpx")), "item-info" to _uM(".container .tools-panel .play-back-info " to _uM("display" to "flex", "flexDirection" to "column", "justifyContent" to "center", "alignItems" to "center")), "info-label" to _uM(".container .tools-panel .play-back-info " to _uM("fontSize" to "24rpx", "paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0, "color" to "#999999")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
