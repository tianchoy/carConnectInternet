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
import io.dcloud.uniapp.extapi.showModal as uni_showModal
open class GenPagesGeofencingGeofencing : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesGeofencingGeofencing) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesGeofencingGeofencing
            val _cache = __ins.renderCache
            val imei = ref<String?>(null)
            val connectionStatus = ref<String?>(null)
            val deptId = ref<String?>(null)
            val carType = ref<String?>(null)
            val deviceName = ref<String?>(null)
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val markers = ref(_uA<Marker>())
            val carMarker = ref<Marker?>(null)
            val circles = ref(_uA<Circle>())
            val carInFence = ref(false)
            val isDrawing = ref(false)
            val drawingMode = ref("polygon")
            val points = ref(_uA<Coordinate__1>())
            val polygons = ref(_uA<Polygon>())
            val circleCenter = ref<Coordinate__1?>(null)
            val circleRadius = ref(0)
            val currentSpeed = ref(0)
            val currentAddress = ref("获取中...")
            val currentCar = ref<String?>("京A12345")
            val lastDirection = ref(0)
            val showFenceModal = ref<ComponentPublicInstance?>(null)
            val fenceList = ref(_uA<UTSJSONObject>())
            val selectedFence = ref<UTSJSONObject?>(null)
            val fencesPopup = ref<ComponentPublicInstance?>(null)
            val editDialogPopup = ref<ComponentPublicInstance?>(null)
            val editingFence = ref<UTSJSONObject?>(null)
            val alarmTypeOptions = _uA(
                "0",
                "1",
                "2",
                "3"
            )
            val fenceForm = reactive<FenceForm>(FenceForm(name = "", alarmType = "1"))
            val deviceDialogPopup = ref<ComponentPublicInstance?>(null)
            val activeTab = ref("bind")
            val deviceList = ref(_uA<UTSJSONObject>())
            val boundDevices = ref(_uA<UTSJSONObject>())
            val currentFenceName = ref("")
            val currentFenceId = ref("")
            val loading = ref(false)
            val scrollTop = ref(0)
            val pagination = reactive<Pagination>(Pagination(bind = PaginationState(pageNum = 1, pageSize = 10, hasMore = true, loadingMore = false), unbind = PaginationState(pageNum = 1, pageSize = 10, hasMore = true, loadingMore = false)))
            val canFinishDrawing = computed(fun(): Boolean {
                if (drawingMode.value === "polygon") {
                    return points.value.length >= 3
                } else if (drawingMode.value === "circle") {
                    return circleCenter.value != null && circleRadius.value > 0
                }
                return false
            }
            )
            val loadingMore = computed(fun(): Boolean {
                return if (activeTab.value === "bind") {
                    pagination.bind.loadingMore
                } else {
                    pagination.unbind.loadingMore
                }
            }
            )
            val hasMore = computed(fun(): Boolean {
                return if (activeTab.value === "bind") {
                    pagination.bind.hasMore
                } else {
                    pagination.unbind.hasMore
                }
            }
            )
            val loadInitialPosition = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        uni_showLoading(ShowLoadingOptions(title = "获取车辆位置中..."))
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/geofencing/geofencing.uvue", 300, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            res.data.forEach(fun(item){
                                if (item.getString("imei", "") == imei.value) {
                                    val deviceData = item
                                    val convertedCoord = CoordTransform.wgs84ToTencent(deviceData.getNumber("latitude", 0), deviceData.getNumber("longitude", 0))
                                    center["latitude"] = convertedCoord.lat
                                    center["longitude"] = convertedCoord.lng
                                    val position = LocationObject(latitude = convertedCoord.lat, longitude = convertedCoord.lng)
                                    lastDirection.value = deviceData.getNumber("direction", 0)
                                    carMarker.value = Marker(id = 0, latitude = position.latitude, longitude = position.longitude, iconPath = getDeviceIcon(connectionStatus.value.toString(), carType.value.toString()), width = 25, height = 25, rotate = if (lastDirection.value >= 360) {
                                        lastDirection.value - 360
                                    } else {
                                        if (lastDirection.value < 0) {
                                            lastDirection.value + 360
                                        } else {
                                            lastDirection.value
                                        }
                                    }
                                    , callout = MapMarkerCallout(content = if (isTruthy(deviceName.value)) {
                                        deviceName.value
                                    } else {
                                        "爱车位置"
                                    }
                                    , color = if (connectionStatus.value == "online") {
                                        "#fff"
                                    } else {
                                        "#666"
                                    }
                                    , bgColor = if (connectionStatus.value == "online") {
                                        "#07C160"
                                    } else {
                                        "#ccc"
                                    }
                                    , padding = 5, borderRadius = 4, display = "ALWAYS"))
                                    val marker = carMarker.value!!
                                    if (marker != null) {
                                        markers.value = _uA(
                                            marker
                                        )
                                    }
                                    currentSpeed.value = if (isTruthy(deviceData["speed"])) {
                                        parseFloat(deviceData["speed"].toString())
                                    } else {
                                        0
                                    }
                                    currentAddress.value = if (isTruthy(deviceData["positionUpdateTime"])) {
                                        "最后定位: " + deviceData["positionUpdateTime"]
                                    } else {
                                        "未知位置"
                                    }
                                    connectionStatus.value = if (isTruthy(deviceData["connectionStatus"])) {
                                        deviceData["connectionStatus"].toString()
                                    } else {
                                        "unknown"
                                    }
                                }
                            }
                            )
                        }
                         catch (err: Throwable) {
                            console.error("获取初始位置失败:", err, " at pages/geofencing/geofencing.uvue:357")
                            showAppToast(ShowToastOptions(title = "获取车辆位置失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
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
            fun gen_getFenceType_fn(fence: UTSJSONObject): String {
                val type = fence.getString("type", "")
                if (type != "" && type !== "null") {
                    return type
                }
                val area = fence.getString("area", "")
                if (area.startsWith("CIRCLE")) {
                    return "circle"
                } else if (area.startsWith("POLYGON")) {
                    return "polygon"
                }
                return "polygon"
            }
            val getFenceType = ::gen_getFenceType_fn
            fun gen_isValidCoordinate_fn(latitude: Number, longitude: Number): Boolean {
                return isFinite(latitude) && isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
            }
            val isValidCoordinate = ::gen_isValidCoordinate_fn
            fun gen_parsePolygon_fn(polygonStr: String): UTSArray<Coordinate__1> {
                if (!(polygonStr != "")) {
                    return _uA()
                }
                val coordStr = polygonStr.replace(UTSRegExp("POLYGON \\(\\(", ""), "").replace(UTSRegExp("\\)\\)", ""), "")
                val points: UTSArray<Coordinate__1> = _uA()
                coordStr.split(",").forEach(fun(point: String){
                    val values = point.trim().split(UTSRegExp("\\s+", ""))
                    if (values.length != 2) {
                        return
                    }
                    val latitude = parseFloat(values[0])
                    val longitude = parseFloat(values[1])
                    if (!isValidCoordinate(latitude, longitude)) {
                        return
                    }
                    val convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude)
                    points.push(LocationObject(latitude = convertedCoord.lat, longitude = convertedCoord.lng))
                }
                )
                return points
            }
            val parsePolygon = ::gen_parsePolygon_fn
            fun gen_parseCircle_fn(circleStr: String): CircleData? {
                if (!(circleStr != "") || !circleStr.startsWith("CIRCLE")) {
                    return null
                }
                try {
                    val coordStr = circleStr.replace(UTSRegExp("CIRCLE \\(", ""), "").replace(UTSRegExp("\\)", ""), "")
                    val parts = coordStr.split(",")
                    if (parts.length != 2) {
                        return null
                    }
                    val centerValues = parts[0].trim().split(UTSRegExp("\\s+", ""))
                    if (centerValues.length != 2) {
                        return null
                    }
                    val lat = parseFloat(centerValues[0])
                    val lng = parseFloat(centerValues[1])
                    val radius = parseFloat(parts[1].trim())
                    if (!isValidCoordinate(lat, lng) || !isFinite(radius) || radius <= 0) {
                        console.error("无效的圆形围栏数据:", circleStr, " at pages/geofencing/geofencing.uvue:427")
                        return null
                    }
                    val convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                    return CircleData(latitude = convertedCoord.lat, longitude = convertedCoord.lng, radius = radius)
                }
                 catch (error: Throwable) {
                    console.error("解析圆形围栏失败:", error, "数据:", circleStr, " at pages/geofencing/geofencing.uvue:437")
                    return null
                }
            }
            val parseCircle = ::gen_parseCircle_fn
            fun gen_updateMarkers_fn(): Unit {
                val newMarkers: UTSArray<Marker> = _uA()
                if (isTruthy(carMarker.value)) {
                    newMarkers.push(carMarker.value!!)
                }
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        points.value.forEach(fun(point, index){
                            newMarkers.push(Marker(id = 1000 + index, latitude = point.latitude, longitude = point.longitude, iconPath = "/static/marker.png", width = 32, height = 32, callout = MapMarkerCallout(content = "顶点" + (index + 1), display = "ALWAYS"), anchor = Anchor(x = 0.5, y = 0.5)))
                        })
                    } else if (drawingMode.value === "circle" && isTruthy(circleCenter.value)) {
                        newMarkers.push(Marker(id = 1000, latitude = circleCenter.value!!.latitude, longitude = circleCenter.value!!.longitude, iconPath = "/static/marker.png", width = 32, height = 32, callout = MapMarkerCallout(content = "圆心", display = "ALWAYS"), anchor = Anchor(x = 0.5, y = 0.5)))
                    }
                } else {
                    val selected = selectedFence.value
                    if (selected == null) {
                        markers.value = newMarkers
                        return
                    }
                    val fenceType = getFenceType(selected)
                    val area = selected.getString("area", "")
                    if (fenceType === "circle") {
                        val circleData = parseCircle(area)
                        if (circleData != null) {
                            newMarkers.push(Marker(id = 2000, latitude = circleData.latitude, longitude = circleData.longitude, iconPath = "/static/marker.png", width = 32, height = 32, callout = MapMarkerCallout(content = "圆心", display = "ALWAYS"), anchor = Anchor(x = 0.5, y = 0.5)))
                        }
                    } else {
                        val fencePoints = parsePolygon(area)
                        fencePoints.forEach(fun(point, index){
                            newMarkers.push(Marker(id = 2000 + index, latitude = point.latitude, longitude = point.longitude, iconPath = "/static/marker.png", width = 32, height = 32, callout = MapMarkerCallout(content = "顶点" + (index + 1), display = "ALWAYS"), anchor = Anchor(x = 0.5, y = 0.5)))
                        }
                        )
                    }
                }
                markers.value = newMarkers
            }
            val updateMarkers = ::gen_updateMarkers_fn
            val renderFencesOnMap = fun(){
                if (!(fenceList.value != null) || fenceList.value.length == 0) {
                    polygons.value = _uA()
                    circles.value = _uA()
                    updateMarkers()
                    return
                }
                val fencePolygons: UTSArray<Polygon> = _uA()
                val fenceCircles: UTSArray<Circle> = _uA()
                var colorIndex: Number = 0
                fenceList.value.forEach(fun(fence: UTSJSONObject){
                    val fenceType = getFenceType(fence)
                    if (fenceType === "circle") {
                        val circleData = parseCircle(fence.getString("area", ""))
                        if (circleData != null) {
                            val displayRadius = if (circleData.radius > 100000) {
                                100000
                            } else {
                                circleData.radius
                            }
                            fenceCircles.push(Circle(latitude = circleData.latitude, longitude = circleData.longitude, radius = displayRadius, strokeWidth = 2, color = "#FF0000", fillColor = "rgba(255,0,0,0.2)"))
                        }
                    } else {
                        val fencePoints = parsePolygon(fence.getString("area", ""))
                        if (fencePoints.length >= 3) {
                            fencePolygons.push(Polygon(points = fencePoints, strokeWidth = 2, strokeColor = "#FF0000", fillColor = if (colorIndex++ == 0) {
                                "rgba(255,0,0,0.2)"
                            } else {
                                "rgba(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ",0.2)"
                            }
                            , zIndex = 1))
                        }
                    }
                }
                )
                polygons.value = fencePolygons
                circles.value = fenceCircles
                if (fenceCircles.length > 0 && !isTruthy(selectedFence.value)) {
                    val firstCircle = fenceCircles[0]
                    center["latitude"] = firstCircle.latitude
                    center["longitude"] = firstCircle.longitude
                    mapScale.value = if (firstCircle.radius > 50000) {
                        8
                    } else {
                        if (firstCircle.radius > 20000) {
                            9
                        } else {
                            if (firstCircle.radius > 10000) {
                                10
                            } else {
                                if (firstCircle.radius > 5000) {
                                    11
                                } else {
                                    if (firstCircle.radius > 2000) {
                                        12
                                    } else {
                                        if (firstCircle.radius > 1000) {
                                            13
                                        } else {
                                            if (firstCircle.radius > 500) {
                                                14
                                            } else {
                                                if (firstCircle.radius > 200) {
                                                    15
                                                } else {
                                                    16
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            fun gen_updateMapDisplay_fn(): Unit {
                updateMarkers()
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        polygons.value = if (points.value.length >= 3) {
                            _uA(
                                Polygon(points = points.value, strokeWidth = 2, strokeColor = "#FF0000", fillColor = "rgba(255,0,0,0.2)", zIndex = 1)
                            )
                        } else {
                            _uA()
                        }
                        circles.value = _uA()
                    } else if (drawingMode.value === "circle") {
                        val drawingCenter = circleCenter.value
                        if (drawingCenter != null && circleRadius.value > 0) {
                            val drawingCircle: Circle = Circle(latitude = drawingCenter.latitude, longitude = drawingCenter.longitude, radius = circleRadius.value, strokeWidth = 2, color = "#FF0000", fillColor = "rgba(255,0,0,0.2)")
                            circles.value = _uA(
                                drawingCircle
                            )
                        } else {
                            circles.value = _uA()
                        }
                        polygons.value = _uA()
                    }
                } else {
                    renderFencesOnMap()
                }
            }
            val updateMapDisplay = ::gen_updateMapDisplay_fn
            val loadGeofenceList = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getGeofenceList())
                            if (res.code == 0) {
                                fenceList.value = res.data
                            } else {
                                showAppToast(ShowToastOptions(title = "获取围栏列表失败", icon = "none"))
                                fenceList.value = _uA()
                            }
                            renderFencesOnMap()
                        }
                         catch (error: Throwable) {
                            console.error("加载围栏列表失败:", error, " at pages/geofencing/geofencing.uvue:632")
                            showAppToast(ShowToastOptions(title = "获取围栏列表失败", icon = "none"))
                            fenceList.value = _uA()
                            renderFencesOnMap()
                        }
                })
            }
            val generatePolygonString = fun(points: UTSArray<Coordinate__1>): String {
                val coords = points.map(fun(point: Coordinate__1): String {
                    val originalCoord = CoordTransform.tencentToWgs84(point.latitude, point.longitude)
                    return "" + originalCoord.lat + " " + originalCoord.lng
                }
                ).join(", ")
                return "POLYGON ((" + coords + "))"
            }
            val generateCircleString = fun(center: Coordinate__1, radius: Number): String {
                val originalCoord = CoordTransform.tencentToWgs84(center.latitude, center.longitude)
                return "CIRCLE (" + originalCoord.lat + " " + originalCoord.lng + ", " + radius + ")"
            }
            val calculateZoomLevelFromRadius = fun(radius: Number): Number {
                if (radius > 50000) {
                    return 8
                }
                if (radius > 20000) {
                    return 9
                }
                if (radius > 10000) {
                    return 10
                }
                if (radius > 5000) {
                    return 11
                }
                if (radius > 2000) {
                    return 12
                }
                if (radius > 1000) {
                    return 13
                }
                if (radius > 500) {
                    return 14
                }
                if (radius > 200) {
                    return 15
                }
                return 16
            }
            val calculateBounds = fun(points: UTSArray<Coordinate__1>): CoordinateBounds {
                var minLat = points[0].latitude
                var maxLat = points[0].latitude
                var minLng = points[0].longitude
                var maxLng = points[0].longitude
                points.forEach(fun(point: Coordinate__1): Unit {
                    minLat = Math.min(minLat, point.latitude)
                    maxLat = Math.max(maxLat, point.latitude)
                    minLng = Math.min(minLng, point.longitude)
                    maxLng = Math.max(maxLng, point.longitude)
                }
                )
                return CoordinateBounds(minLat = minLat, maxLat = maxLat, minLng = minLng, maxLng = maxLng)
            }
            val setMapCenterToFence = fun(fence: UTSJSONObject): Unit {
                val fenceType = getFenceType(fence)
                val area = fence.getString("area", "")
                if (fenceType === "circle") {
                    val circleData = parseCircle(area)
                    if (circleData != null) {
                        center["latitude"] = circleData.latitude
                        center["longitude"] = circleData.longitude
                        val displayRadius = if (circleData.radius > 100000) {
                            100000
                        } else {
                            circleData.radius
                        }
                        mapScale.value = calculateZoomLevelFromRadius(displayRadius)
                    }
                } else {
                    val fencePoints = parsePolygon(area)
                    if (fencePoints.length == 0) {
                        return
                    }
                    var totalLat: Number = 0
                    var totalLng: Number = 0
                    fencePoints.forEach(fun(point){
                        totalLat += point.latitude
                        totalLng += point.longitude
                    }
                    )
                    center["latitude"] = totalLat / fencePoints.length
                    center["longitude"] = totalLng / fencePoints.length
                    val bounds = calculateBounds(fencePoints)
                    val latDiff = bounds.maxLat - bounds.minLat
                    val lngDiff = bounds.maxLng - bounds.minLng
                    val maxDiff = Math.max(latDiff, lngDiff)
                    if (maxDiff > 0.1) {
                        mapScale.value = 11
                    } else if (maxDiff > 0.05) {
                        mapScale.value = 12
                    } else if (maxDiff > 0.02) {
                        mapScale.value = 13
                    } else {
                        mapScale.value = 14
                    }
                }
            }
            val showFenceList = fun(){
                fencesPopup.value?.`$callMethod`("open")
            }
            val selectFence = fun(fence: UTSJSONObject): Unit {
                selectedFence.value = fence
                fencesPopup.value?.`$callMethod`("close")
                showFenceModal.value?.`$callMethod`("open")
                val fenceType = getFenceType(fence)
                val area = fence.getString("area", "")
                if (fenceType === "circle") {
                    val circleData = parseCircle(area)
                    if (circleData != null) {
                        circleCenter.value = LocationObject(latitude = circleData.latitude, longitude = circleData.longitude)
                        circleRadius.value = circleData.radius
                        points.value = _uA()
                    }
                } else {
                    val fencePoints = parsePolygon(area)
                    points.value = fencePoints
                    circleCenter.value = null
                    circleRadius.value = 0
                }
                setMapCenterToFence(fence)
                updateMapDisplay()
            }
            val editFence = fun(fence: UTSJSONObject): Unit {
                editingFence.value = fence
                fenceForm.name = fence.getString("name", "")
                val alarmTypeText = fence.getString("alarmType", "")
                val alarmType = if (alarmTypeText.length > 0) {
                    alarmTypeText
                } else {
                    fence.getNumber("alarmType", 1).toString(10)
                }
                fenceForm.alarmType = if (alarmTypeOptions.includes(alarmType)) {
                    alarmType
                } else {
                    "1"
                }
                val fenceType = getFenceType(fence)
                drawingMode.value = fenceType
                val area = fence.getString("area", "")
                if (fenceType === "circle") {
                    val circleData = parseCircle(area)
                    if (circleData != null) {
                        circleCenter.value = LocationObject(latitude = circleData.latitude, longitude = circleData.longitude)
                        circleRadius.value = circleData.radius
                        points.value = _uA()
                    }
                } else {
                    val fencePoints = parsePolygon(area)
                    if (fencePoints.length >= 3) {
                        points.value = fencePoints
                        circleCenter.value = null
                        circleRadius.value = 0
                    }
                }
                updateMapDisplay()
                editDialogPopup.value?.`$callMethod`("open")
            }
            fun gen_deleteFenceById_fn(id: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val result = await(deleteGeofence(id))
                            if (result.code == 0) {
                                showAppToast(ShowToastOptions(title = "删除成功"))
                                selectedFence.value = null
                                points.value = _uA()
                                circleCenter.value = null
                                circleRadius.value = 0
                                isDrawing.value = false
                                polygons.value = _uA()
                                circles.value = _uA()
                                updateMarkers()
                                showFenceModal.value?.`$callMethod`("close")
                                await(loadGeofenceList())
                            } else {
                                showAppToast(ShowToastOptions(title = "删除失败", icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("删除围栏失败:", error, " at pages/geofencing/geofencing.uvue:840")
                            showAppToast(ShowToastOptions(title = "删除失败", icon = "none"))
                        }
                })
            }
            val deleteFenceById = ::gen_deleteFenceById_fn
            val deleteFence = fun(id: String): Unit {
                uni_showModal(ShowModalOptions(title = "确认删除", content = "确定要删除这个围栏吗？", success = fun(res: ShowModalSuccess): Unit {
                    if (res.confirm) {
                        deleteFenceById(id.toString())
                    }
                }
                ))
            }
            val saveFence = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!(fenceForm.name != "")) {
                            showAppToast(ShowToastOptions(title = "请输入围栏名称", icon = "none"))
                            return@w1
                        }
                        var area = ""
                        if (isTruthy(editingFence.value)) {
                            if (drawingMode.value === "polygon" && points.value.length >= 3) {
                                area = generatePolygonString(points.value)
                            } else if (drawingMode.value === "circle" && isTruthy(circleCenter.value) && circleRadius.value > 0) {
                                area = generateCircleString(circleCenter.value!!, circleRadius.value)
                            } else {
                                area = editingFence.value!!.getString("area", "")
                            }
                        } else {
                            if (drawingMode.value === "polygon" && points.value.length < 3) {
                                showAppToast(ShowToastOptions(title = "请绘制有效的围栏区域（至少3个顶点）", icon = "none"))
                                return@w1
                            } else if (drawingMode.value === "circle" && (!isTruthy(circleCenter.value) || circleRadius.value <= 0)) {
                                showAppToast(ShowToastOptions(title = "请绘制有效的圆形围栏", icon = "none"))
                                return@w1
                            }
                            if (drawingMode.value === "polygon") {
                                area = generatePolygonString(points.value)
                            } else if (drawingMode.value === "circle" && isTruthy(circleCenter.value)) {
                                area = generateCircleString(circleCenter.value!!, circleRadius.value)
                            }
                        }
                        if (!(area != "")) {
                            showAppToast(ShowToastOptions(title = "围栏数据无效，请重新绘制", icon = "none"))
                            return@w1
                        }
                        if (!alarmTypeOptions.includes(fenceForm.alarmType)) {
                            showAppToast(ShowToastOptions(title = "请选择有效的告警类型", icon = "none"))
                            return@w1
                        }
                        val fenceData: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("fenceData", "pages/geofencing/geofencing.uvue", 905, 9), "name" to fenceForm.name, "area" to area, "alarmType" to parseInt(fenceForm.alarmType), "type" to drawingMode.value)
                        try {
                            var result: Any
                            if (isTruthy(editingFence.value)) {
                                uni_showLoading(ShowLoadingOptions(title = "更新中..."))
                                result = await(updateGeofence(UTSJSONObject.assign(_uO("id" to editingFence.value!!["id"]), fenceData)))
                            } else {
                                uni_showLoading(ShowLoadingOptions(title = "保存中..."))
                                result = await(addGeofence(fenceData))
                            }
                            uni_hideLoading(null)
                            if (result.code == 0) {
                                showAppToast(ShowToastOptions(title = if (isTruthy(editingFence.value)) {
                                    "更新成功"
                                } else {
                                    "保存成功"
                                }))
                                editDialogPopup.value?.`$callMethod`("close")
                                val tempFence = editingFence.value
                                editingFence.value = null
                                isDrawing.value = false
                                points.value = _uA()
                                circleCenter.value = null
                                circleRadius.value = 0
                                await(loadGeofenceList())
                                if (isTruthy(tempFence)) {
                                    selectedFence.value = null
                                    showFenceModal.value?.`$callMethod`("close")
                                }
                            } else {
                                showAppToast(ShowToastOptions(title = if (isTruthy(result.msg)) {
                                    result.msg
                                } else {
                                    "保存失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            uni_hideLoading(null)
                            console.error("保存围栏失败:", error, " at pages/geofencing/geofencing.uvue:951")
                            showAppToast(ShowToastOptions(title = "保存失败，请重试", icon = "none"))
                        }
                })
            }
            fun gen_resetPagination_fn(page: PaginationState): Unit {
                page.pageNum = 1
                page.pageSize = 10
                page.hasMore = true
                page.loadingMore = false
            }
            val resetPagination = ::gen_resetPagination_fn
            fun gen_initPagination_fn(tabType: String): Unit {
                if (tabType == "bind") {
                    resetPagination(pagination.bind)
                } else {
                    resetPagination(pagination.unbind)
                }
                if (activeTab.value == tabType) {
                    deviceList.value = _uA()
                }
            }
            val initPagination = ::gen_initPagination_fn
            fun gen_loadBoundDevices_fn(fenceId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val page = pagination.bind
                        if (!page.hasMore || page.loadingMore) {
                            return@w1
                        }
                        page.loadingMore = true
                        try {
                            val res = await(getBoundDevices(_uO("pageNum" to page.pageNum, "pageSize" to page.pageSize, "geoId" to fenceId)))
                            if (res.code == 0) {
                                val dataList = if (res.data.list != null) {
                                    res.data.list
                                } else {
                                    _uA()
                                }
                                if (page.pageNum == 1) {
                                    boundDevices.value = dataList
                                    deviceList.value = dataList
                                } else {
                                    deviceList.value = deviceList.value.concat(dataList)
                                }
                                page.hasMore = dataList.length === page.pageSize
                                if (page.hasMore) {
                                    page.pageNum++
                                }
                            } else {
                                page.hasMore = false
                            }
                        }
                         catch (error: Throwable) {
                            page.hasMore = false
                        }
                         finally {
                            page.loadingMore = false
                        }
                })
            }
            val loadBoundDevices = ::gen_loadBoundDevices_fn
            fun gen_loadUnboundDevices_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val page = pagination.unbind
                        if (!page.hasMore || page.loadingMore) {
                            return@w1
                        }
                        page.loadingMore = true
                        try {
                            val res = await(getUnboundDevices(_uO("pageNum" to page.pageNum, "pageSize" to page.pageSize)))
                            if (res.code == 0) {
                                val dataList = if (res.data.list != null) {
                                    res.data.list
                                } else {
                                    _uA()
                                }
                                if (page.pageNum == 1) {
                                    deviceList.value = dataList
                                } else {
                                    deviceList.value = deviceList.value.concat(dataList)
                                }
                                page.hasMore = dataList.length === page.pageSize
                                if (page.hasMore) {
                                    page.pageNum++
                                }
                            } else {
                                page.hasMore = false
                            }
                        }
                         catch (error: Throwable) {
                            page.hasMore = false
                        }
                         finally {
                            page.loadingMore = false
                        }
                })
            }
            val loadUnboundDevices = ::gen_loadUnboundDevices_fn
            val showBindDevices = fun(fenceId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        currentFenceId.value = fenceId
                        val selected = selectedFence.value
                        currentFenceName.value = if (selected != null) {
                            selected.getString("name", "")
                        } else {
                            ""
                        }
                        deviceDialogPopup.value?.`$callMethod`("open")
                        activeTab.value = "bind"
                        scrollTop.value = 0
                        initPagination("bind")
                        await(loadBoundDevices(fenceId))
                })
            }
            val switchTab = fun(tab: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        console.log("switchTab", tab, currentFenceId.value, " at pages/geofencing/geofencing.uvue:1052")
                        if (activeTab.value === tab) {
                            return@w1
                        }
                        activeTab.value = tab
                        scrollTop.value = 0
                        deviceList.value = _uA()
                        initPagination(tab)
                        if (tab === "bind") {
                            console.log("switchTab,bind:", currentFenceId.value, " at pages/geofencing/geofencing.uvue:1064")
                            await(loadBoundDevices(currentFenceId.value))
                        } else {
                            await(loadUnboundDevices())
                        }
                })
            }
            val handleLoadMore = fun(){
                if (loadingMore.value || !hasMore.value) {
                    return
                }
                if (activeTab.value === "bind") {
                    loadBoundDevices(currentFenceId.value)
                } else {
                    loadUnboundDevices()
                }
            }
            val toggleDeviceBinding = fun(deviceImei: String, bound: Boolean): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        console.log("toggleDeviceBinding", deviceImei, bound, " at pages/geofencing/geofencing.uvue:1084")
                        loading.value = true
                        try {
                            val params: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("params", "pages/geofencing/geofencing.uvue", 1087, 10), "geofenceId" to currentFenceId.value, "imeis" to _uA(
                                deviceImei
                            ))
                            console.log("toggleDeviceBindingparams", params, " at pages/geofencing/geofencing.uvue:1091")
                            var result: Any
                            if (bound) {
                                result = await(bindDevices(params))
                            } else {
                                result = await(unbindDevices(params))
                            }
                            if (result.code == 0) {
                                showAppToast(ShowToastOptions(title = if (bound) {
                                    "绑定成功"
                                } else {
                                    "解绑成功"
                                }))
                                initPagination(activeTab.value)
                                scrollTop.value = 0
                                if (activeTab.value === "bind") {
                                    await(loadBoundDevices(currentFenceId.value))
                                } else {
                                    await(loadUnboundDevices())
                                }
                            } else {
                                showAppToast(ShowToastOptions(title = if (isTruthy(result.msg)) {
                                    result.msg
                                } else {
                                    "操作失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("设备绑定操作失败:", error, " at pages/geofencing/geofencing.uvue:1114")
                            showAppToast(ShowToastOptions(title = "操作失败", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            val isDeviceBound = fun(deviceImei: String): Boolean {
                return boundDevices.value.some(fun(device: UTSJSONObject): Boolean {
                    return device.getString("imei", "") === deviceImei
                }
                )
            }
            val setDrawingMode = fun(mode: String): Unit {
                drawingMode.value = mode
                if (isDrawing.value) {
                    points.value = _uA()
                    circleCenter.value = null
                    circleRadius.value = 0
                    updateMapDisplay()
                }
            }
            val startDrawing = fun(){
                isDrawing.value = true
                points.value = _uA()
                circleCenter.value = null
                circleRadius.value = 0
                selectedFence.value = null
                updateMapDisplay()
            }
            fun gen_handleDeviceBindingChange_fn(deviceImei: String, bound: Boolean): Unit {
                toggleDeviceBinding(deviceImei, bound)
            }
            val handleDeviceBindingChange = ::gen_handleDeviceBindingChange_fn
            fun gen_getDeviceImei_fn(device: UTSJSONObject): String {
                return device.getString("imei", "")
            }
            val getDeviceImei = ::gen_getDeviceImei_fn
            fun gen_isDeviceOnline_fn(device: UTSJSONObject): Boolean {
                return device.getString("connectionStatus", "") === "online"
            }
            val isDeviceOnline = ::gen_isDeviceOnline_fn
            fun gen_getDeviceDisplayName_fn(device: UTSJSONObject): String {
                val deviceName = device.getString("deviceName", "")
                return if (deviceName != "") {
                    deviceName
                } else {
                    device.getString("plateNo", "")
                }
            }
            val getDeviceDisplayName = ::gen_getDeviceDisplayName_fn
            fun gen_closeEditDialog_fn(): Unit {
                editDialogPopup.value?.`$callMethod`("close")
            }
            val closeEditDialog = ::gen_closeEditDialog_fn
            fun gen_getSelectedFenceName_fn(): String {
                val fence = selectedFence.value
                return if (fence != null) {
                    fence.getString("name", "")
                } else {
                    ""
                }
            }
            val getSelectedFenceName = ::gen_getSelectedFenceName_fn
            fun gen_editSelectedFence_fn(): Unit {
                val fence = selectedFence.value
                if (fence != null) {
                    editFence(fence)
                }
            }
            val editSelectedFence = ::gen_editSelectedFence_fn
            fun gen_deleteSelectedFence_fn(): Unit {
                val fence = selectedFence.value
                console.log("删除电子围栏", fence, " at pages/geofencing/geofencing.uvue:1184")
                if (fence != null) {
                    val fenceId = fence.getString("id", "")
                    console.log("删除电子围栏ID", fenceId, " at pages/geofencing/geofencing.uvue:1188")
                    if (fenceId !== "") {
                        deleteFence(fenceId)
                    } else {
                        showAppToast(ShowToastOptions(title = "围栏ID无效", icon = "none"))
                    }
                }
            }
            val deleteSelectedFence = ::gen_deleteSelectedFence_fn
            fun gen_showSelectedFenceDevices_fn(): Unit {
                val fence = selectedFence.value
                if (fence != null) {
                    showBindDevices(fence.getString("id", ""))
                }
            }
            val showSelectedFenceDevices = ::gen_showSelectedFenceDevices_fn
            fun gen_calculateDistance_fn(lat1: Number, lng1: Number, lat2: Number, lng2: Number): Number {
                val R: Number = 6371000
                val dLat = (lat2 - lat1) * Math.PI / 180
                val dLng = (lng2 - lng1) * Math.PI / 180
                val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
                val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                return R * c
            }
            val calculateDistance = ::gen_calculateDistance_fn
            fun gen_addNewPoint_fn(lat: Number, lng: Number): Unit {
                val point = Coordinate__1(latitude = lat, longitude = lng)
                points.value.push(point)
                updateMapDisplay()
            }
            val addNewPoint = ::gen_addNewPoint_fn
            val handleMapTap = fun(e: UniMapTapEvent): Unit {
                val detail = e.detail
                if (!isDrawing.value || detail == null || detail.latitude == null || detail.longitude == null) {
                    return
                }
                val latitude = detail.latitude!!
                val longitude = detail.longitude!!
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        addNewPoint(latitude, longitude)
                    } else if (drawingMode.value === "circle") {
                        if (!isTruthy(circleCenter.value)) {
                            circleCenter.value = LocationObject(latitude = latitude, longitude = longitude)
                            updateMapDisplay()
                        } else {
                            val radius = calculateDistance(circleCenter.value!!.latitude, circleCenter.value!!.longitude, latitude, longitude)
                            circleRadius.value = if (radius < 10) {
                                10
                            } else {
                                radius
                            }
                            updateMapDisplay()
                        }
                    }
                }
            }
            val finishDrawing = fun(){
                if (drawingMode.value === "polygon" && points.value.length < 3) {
                    showAppToast(ShowToastOptions(title = "至少需要3个顶点", icon = "none"))
                    return
                } else if (drawingMode.value === "circle" && (!isTruthy(circleCenter.value) || circleRadius.value <= 0)) {
                    showAppToast(ShowToastOptions(title = "请设置有效的圆形围栏", icon = "none"))
                    return
                }
                isDrawing.value = false
                fenceForm.name = "" + (if (drawingMode.value === "circle") {
                    "圆形"
                } else {
                    "多边形"
                }
                ) + "围栏" + (fenceList.value.length + 1)
                editDialogPopup.value?.`$callMethod`("open")
            }
            val clearDrawing = fun(){
                isDrawing.value = false
                points.value = _uA()
                circleCenter.value = null
                circleRadius.value = 0
                selectedFence.value = null
                polygons.value = _uA()
                circles.value = _uA()
                updateMarkers()
                renderFencesOnMap()
            }
            onLoad(fun(option){
                connectionStatus.value = option["connectionStatus"]
                imei.value = option["imei"]
                currentCar.value = option["plateNo"]
                deptId.value = option["deptId"]
                carType.value = option["carType"]
                deviceName.value = option["deviceName"]
                loadInitialPosition()
                loadGeofenceList()
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_popup = resolveEasyComponent("i-popup", GenUniModulesIUiXComponentsIPopupIPopupClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_radio = resolveEasyComponent("i-radio", GenUniModulesIUiXComponentsIRadioIRadioClass)
                val _component_i_switch = resolveEasyComponent("i-switch", GenUniModulesIUiXComponentsISwitchISwitchClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "地理围栏", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "map-container"), _uA(
                            _cV(_component_map, _uM("id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "polygons" to polygons.value, "markers" to markers.value, "circles" to circles.value, "onTap" to handleMapTap, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), null, 8, _uA(
                                "latitude",
                                "longitude",
                                "scale",
                                "style",
                                "polygons",
                                "markers",
                                "circles"
                            )),
                            _cV(_component_sub_navBar, _uM("class" to "sub-nav-overlay", "showTime" to false, "currentCar" to currentCar.value, "showCar" to true, "carStatus" to connectionStatus.value), null, 8, _uA(
                                "currentCar",
                                "carStatus"
                            )),
                            if (isTrue(isDrawing.value)) {
                                _cE("view", _uM("key" to 0, "class" to "drag-hint"), _uA(
                                    if (drawingMode.value === "polygon") {
                                        _cE("text", _uM("key" to 0, "class" to "drag-hint-text"), "点击地图添加围栏点,至少需要3个点")
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (drawingMode.value === "circle") {
                                        _cE("text", _uM("key" to 1, "class" to "drag-hint-text"), "点击地图确定圆心，再点一下地图确定半径")
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        )),
                        _cV(_component_i_popup, _uM("ref_key" to "showFenceModal", "ref" to showFenceModal, "mode" to "bottom", "round" to "10", "showClose" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                if (isTrue(selectedFence.value)) {
                                    _cE("view", _uM("key" to 0, "class" to "fence-operations"), _uA(
                                        _cE("view", _uM("class" to "fence-header"), _uA(
                                            _cE("text", _uM("class" to "fence-name"), _tD(getSelectedFenceName()), 1),
                                            _cV(_component_i_icon, _uM("name" to "close", "onClick" to fun(){
                                                selectedFence.value = null
                                                showFenceModal.value?.`$callMethod`("close")
                                            }), null, 8, _uA(
                                                "onClick"
                                            ))
                                        )),
                                        _cE("view", _uM("class" to "fence-actions"), _uA(
                                            _cV(_component_i_button, _uM("size" to "small", "onClick" to editSelectedFence), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    "编辑"
                                                )
                                            }), "_" to 1)),
                                            _cV(_component_i_button, _uM("size" to "small", "type" to "error", "onClick" to deleteSelectedFence), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    "删除"
                                                )
                                            }), "_" to 1)),
                                            _cV(_component_i_button, _uM("size" to "small", "type" to "primary", "onClick" to showSelectedFenceDevices), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    "绑定设备"
                                                )
                                            }), "_" to 1))
                                        ))
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                            )
                        }
                        ), "_" to 1), 512),
                        _cE("view", _uM("class" to "tools-panel"), _uA(
                            if (isTrue(!isDrawing.value && !isTruthy(selectedFence.value))) {
                                _cE("view", _uM("key" to 0, "class" to "drawing-mode-selector"), _uA(
                                    _cE("text", _uM("class" to "mode-title"), "选择围栏类型:"),
                                    _cE("view", _uM("class" to "mode-buttons"), _uA(
                                        _cV(_component_i_button, _uM("type" to if (drawingMode.value == "polygon") {
                                            "success"
                                        } else {
                                            "default"
                                        }, "size" to "small", "customStyle" to "border:1rpx solid #ebedf0", "onClick" to fun(){
                                            setDrawingMode("polygon")
                                        }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                " 多边形 "
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "type",
                                            "onClick"
                                        )),
                                        _cV(_component_i_button, _uM("class" to "mode-button-spacing", "type" to if (drawingMode.value == "circle") {
                                            "success"
                                        } else {
                                            "default"
                                        }, "size" to "small", "customStyle" to "border:1rpx solid #ebedf0", "onClick" to fun(){
                                            setDrawingMode("circle")
                                        }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                " 圆形 "
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "type",
                                            "onClick"
                                        ))
                                    ))
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            _cE("view", _uM("class" to "tool-tag-item"), _uA(
                                _cV(_component_i_button, _uM("onClick" to startDrawing, "disabled" to (isDrawing.value || selectedFence.value != null), "size" to "small"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        " 开始绘制 "
                                    )
                                }
                                ), "_" to 1), 8, _uA(
                                    "disabled"
                                )),
                                _cV(_component_i_button, _uM("onClick" to finishDrawing, "disabled" to (!isDrawing.value || !canFinishDrawing.value), "size" to "small"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        " 完成绘制 "
                                    )
                                }
                                ), "_" to 1), 8, _uA(
                                    "disabled"
                                )),
                                _cV(_component_i_button, _uM("onClick" to clearDrawing, "size" to "small"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        " 重置绘制 "
                                    )
                                }
                                ), "_" to 1)),
                                _cV(_component_i_button, _uM("onClick" to showFenceList, "size" to "small"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        " 围栏列表 "
                                    )
                                }
                                ), "_" to 1))
                            )),
                            _cE("view", _uM("class" to "status-info"), _uA(
                                _cE("text", _uM("class" to "status-text"), "围栏类型: " + _tD(if (drawingMode.value === "polygon") {
                                    "多边形"
                                } else {
                                    "圆形"
                                }
                                ), 1),
                                if (drawingMode.value === "polygon") {
                                    _cE("text", _uM("key" to 0, "class" to "status-text"), "顶点数量: " + _tD(points.value.length), 1)
                                } else {
                                    _cC("v-if", true)
                                }
                                ,
                                if (drawingMode.value === "circle") {
                                    _cE("text", _uM("key" to 1, "class" to "status-text"), "半径: " + _tD(circleRadius.value.toFixed(2)) + "米", 1)
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        )),
                        _cV(_component_i_popup, _uM("ref_key" to "fencesPopup", "ref" to fencesPopup, "mode" to "bottom", "round" to "10", "height" to "800rpx", "disabledScroll" to true, "contentMargin" to "0", "showClose" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cE("view", _uM("class" to "fence-list"), _uA(
                                    _cE("view", _uM("class" to "list-header"), _uA(
                                        _cE("text", _uM("class" to "title"), "围栏列表")
                                    )),
                                    _cE("scroll-view", _uM("class" to "list-content", "scroll-y" to "true", "show-scrollbar" to false), _uA(
                                        _cE(Fragment, null, RenderHelpers.renderList(fenceList.value, fun(fence, __key, __index, _cached): Any {
                                            return _cE("view", _uM("key" to fence["id"], "class" to "fence-item", "onClick" to fun(){
                                                selectFence(fence)
                                            }
                                            ), _uA(
                                                _cE("view", _uM("class" to "fence-info"), _uA(
                                                    _cE("text", _uM("class" to "name"), _tD(fence["name"]), 1),
                                                    _cE("text", _uM("class" to "type"), _tD(if (getFenceType(fence) === "circle") {
                                                        "圆形"
                                                    } else {
                                                        "多边形"
                                                    }
                                                    ), 1),
                                                    _cE("text", _uM("class" to "devices"), "绑定设备: " + _tD(if (isTruthy(fence["deviceCount"])) {
                                                        fence["deviceCount"]
                                                    } else {
                                                        0
                                                    }
                                                    ) + "台", 1)
                                                )),
                                                _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                            ), 8, _uA(
                                                "onClick"
                                            ))
                                        }
                                        ), 128),
                                        if (fenceList.value.length == 0) {
                                            _cE("view", _uM("key" to 0, "class" to "empty"), _uA(
                                                _cE("text", _uM("class" to "empty-text"), "暂无围栏数据")
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                ))
                            )
                        }
                        ), "_" to 1), 512),
                        _cV(_component_i_popup, _uM("ref_key" to "editDialogPopup", "ref" to editDialogPopup, "mode" to "bottom", "round" to "10", "contentDraggable" to false, "showClose" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cE("view", _uM("class" to "edit-dialog"), _uA(
                                    _cE("view", _uM("class" to "dialog-header"), _uA(
                                        _cE("text", _uM("class" to "dialog-title"), _tD(if (isTruthy(editingFence.value)) {
                                            "编辑围栏"
                                        } else {
                                            "新增围栏"
                                        }
                                        ), 1)
                                    )),
                                    _cE("view", _uM("class" to "dialog-content"), _uA(
                                        _cV(_component_i_input, _uM("modelValue" to fenceForm.name, "onUpdate:modelValue" to fun(`$event`: String){
                                            fenceForm.name = `$event`
                                        }
                                        , "placeholder" to "请输入围栏名称", "border" to "surround"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        )),
                                        _cE("view", _uM("class" to "radio-group"), _uA(
                                            _cE("text", _uM("class" to "label"), "告警类型:"),
                                            _cE("view", _uM("class" to "radio-options"), _uA(
                                                _cV(_component_i_radio, _uM("modelValue" to fenceForm.alarmType, "onUpdate:modelValue" to fun(`$event`: String){
                                                    fenceForm.alarmType = `$event`
                                                }
                                                , "name" to "0", "iconPlacement" to "left"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                    return _uA(
                                                        "不告警"
                                                    )
                                                }
                                                ), "_" to 1), 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                )),
                                                _cV(_component_i_radio, _uM("modelValue" to fenceForm.alarmType, "onUpdate:modelValue" to fun(`$event`: String){
                                                    fenceForm.alarmType = `$event`
                                                }
                                                , "name" to "1", "iconPlacement" to "left"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                    return _uA(
                                                        "出入告警"
                                                    )
                                                }
                                                ), "_" to 1), 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                )),
                                                _cV(_component_i_radio, _uM("modelValue" to fenceForm.alarmType, "onUpdate:modelValue" to fun(`$event`: String){
                                                    fenceForm.alarmType = `$event`
                                                }
                                                , "name" to "2", "iconPlacement" to "left"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                    return _uA(
                                                        "出告警"
                                                    )
                                                }
                                                ), "_" to 1), 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                )),
                                                _cV(_component_i_radio, _uM("modelValue" to fenceForm.alarmType, "onUpdate:modelValue" to fun(`$event`: String){
                                                    fenceForm.alarmType = `$event`
                                                }
                                                , "name" to "3", "iconPlacement" to "left"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                    return _uA(
                                                        "入告警"
                                                    )
                                                }
                                                ), "_" to 1), 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                ))
                                            ))
                                        ))
                                    )),
                                    _cE("view", _uM("class" to "dialog-actions"), _uA(
                                        _cV(_component_i_button, _uM("onClick" to closeEditDialog), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "取消"
                                            )
                                        }
                                        ), "_" to 1)),
                                        _cV(_component_i_button, _uM("type" to "primary", "onClick" to saveFence), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "保存"
                                            )
                                        }
                                        ), "_" to 1))
                                    ))
                                ))
                            )
                        }
                        ), "_" to 1), 512),
                        _cV(_component_i_popup, _uM("ref_key" to "deviceDialogPopup", "ref" to deviceDialogPopup, "mode" to "bottom", "round" to "10", "closeOnMask" to true, "showClose" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cE("view", _uM("class" to "device-dialog"), _uA(
                                    _cE("view", _uM("class" to "dialog-header"), _uA(
                                        _cE("text", _uM("class" to "dialog-title"), "设备绑定 - " + _tD(currentFenceName.value), 1)
                                    )),
                                    _cE("view", _uM("class" to "dialog-tabs"), _uA(
                                        _cE("text", _uM("class" to _nC(_uA(
                                            "tab",
                                            if (activeTab.value === "bind") {
                                                "active"
                                            } else {
                                                ""
                                            }
                                        )), "onClick" to fun(){
                                            switchTab("bind")
                                        }
                                        ), "已绑定设备", 10, _uA(
                                            "onClick"
                                        )),
                                        _cE("text", _uM("class" to _nC(_uA(
                                            "tab",
                                            if (activeTab.value === "unbind") {
                                                "active"
                                            } else {
                                                ""
                                            }
                                        )), "onClick" to fun(){
                                            switchTab("unbind")
                                        }
                                        ), "未绑定设备", 10, _uA(
                                            "onClick"
                                        ))
                                    )),
                                    _cE("scroll-view", _uM("class" to "device-list", "scroll-y" to "true", "show-scrollbar" to false, "scroll-top" to scrollTop.value, "onScrolltolower" to handleLoadMore, "lower-threshold" to 150), _uA(
                                        _cE(Fragment, null, RenderHelpers.renderList(deviceList.value, fun(device, __key, __index, _cached): Any {
                                            return _cE("view", _uM("key" to getDeviceImei(device), "class" to "device-item"), _uA(
                                                _cE("view", _uM("class" to "device-info"), _uA(
                                                    _cE("text", _uM("class" to "name"), _tD(getDeviceDisplayName(device)), 1),
                                                    if (isTrue(getDeviceImei(device))) {
                                                        _cE("text", _uM("key" to 0, "class" to "status"), _tD(if (isDeviceOnline(device)) {
                                                            "在线"
                                                        } else {
                                                            "离线"
                                                        }), 1)
                                                    } else {
                                                        _cC("v-if", true)
                                                    }
                                                )),
                                                _cV(_component_i_switch, _uM("model-value" to isDeviceBound(getDeviceImei(device)), "onChange" to fun(`$event`: Any){
                                                    handleDeviceBindingChange(getDeviceImei(device), `$event` as Boolean)
                                                }
                                                , "disabled" to (loading.value || loadingMore.value), "size" to "20"), null, 8, _uA(
                                                    "model-value",
                                                    "onChange",
                                                    "disabled"
                                                ))
                                            ))
                                        }
                                        ), 128),
                                        if (isTrue(deviceList.value.length == 0 && !loading.value)) {
                                            _cE("view", _uM("key" to 0, "class" to "empty"), _uA(
                                                _cE("text", _uM("class" to "empty-text"), _tD(if (activeTab.value === "bind") {
                                                    "暂无绑定设备"
                                                } else {
                                                    "暂无可用设备"
                                                }), 1)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                        ,
                                        if (isTrue(loadingMore.value)) {
                                            _cE("view", _uM("key" to 1, "class" to "loading-tip"), _uA(
                                                _cE("text", _uM("class" to "empty-text"), "正在加载更多...")
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                        ,
                                        if (isTrue(deviceList.value.length > 0 && !hasMore.value && !loadingMore.value)) {
                                            _cE("view", _uM("key" to 2, "class" to "empty-text-box"), _uA(
                                                _cE("text", _uM("class" to "empty-text"), "暂无更多数据")
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ), 40, _uA(
                                        "scroll-top"
                                    ))
                                ))
                            )
                        }
                        ), "_" to 1), 512)
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "sub-nav-overlay" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to 0, "left" to 0, "right" to 0, "zIndex" to 100)), "drag-hint" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to "150rpx", "left" to 0, "right" to 0, "zIndex" to 100, "backgroundColor" to "rgba(255,255,255,0.9)", "paddingTop" to "16rpx", "paddingRight" to "16rpx", "paddingBottom" to "16rpx", "paddingLeft" to "16rpx", "boxShadow" to "0 4rpx 10rpx rgba(0, 0, 0, 0.1)")), "fence-operations" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx")), "fence-header" to _uM(".container .fence-operations " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "40rpx", "paddingBottom" to "20rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "fence-name" to _uM(".container .fence-operations .fence-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold")), "fence-actions" to _uM(".container .fence-operations " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "column", "boxShadow" to "0 -2px 10px rgba(0, 0, 0, 0.1)")), "drawing-mode-selector" to _uM(".container .tools-panel " to _uM("marginBottom" to "20rpx", "paddingBottom" to "20rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "mode-title" to _uM(".container .tools-panel .drawing-mode-selector " to _uM("fontSize" to "28rpx", "marginBottom" to "15rpx", "color" to "#333333", "fontWeight" to 500)), "mode-buttons" to _uM(".container .tools-panel .drawing-mode-selector " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center")), "mode-button-spacing" to _uM(".container .tools-panel .drawing-mode-selector .mode-buttons " to _uM("marginLeft" to "20rpx")), "tool-tag-item" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "20rpx")), "status-info" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "column", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee")), "fence-list" to _uM(".container " to _uM("height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#ffffff")), "list-header" to _uM(".container .fence-list " to _uM("flexShrink" to 0, "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "title" to _uM(".container .fence-list .list-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold")), "list-content" to _uM(".container .fence-list " to _uM("height" to "640rpx", "boxSizing" to "border-box", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")), "fence-item" to _uM(".container .fence-list .list-content " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f5f5f5")), "fence-info" to _uM(".container .fence-list .list-content .fence-item " to _uM("display" to "flex", "flexDirection" to "column", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "name" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "30rpx", "fontWeight" to 500, "marginBottom" to "8rpx"), ".container .device-dialog .device-list .device-item .device-info " to _uM("fontSize" to "30rpx", "marginBottom" to "8rpx")), "type" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "24rpx", "color" to "#2979ff", "marginBottom" to "8rpx")), "devices" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "24rpx", "color" to "#999999")), "empty" to _uM(".container .fence-list .list-content " to _uM("paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0), ".container .device-dialog .device-list " to _uM("paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0)), "edit-dialog" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "overflow" to "hidden")), "dialog-header" to _uM(".container .edit-dialog " to _uM("paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee"), ".container .device-dialog " to _uM("display" to "flex", "justifyContent" to "space-between", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "dialog-title" to _uM(".container .edit-dialog " to _uM("textAlign" to "center", "fontSize" to "32rpx", "fontWeight" to "bold")), "dialog-content" to _uM(".container .edit-dialog " to _uM("paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx")), "radio-group" to _uM(".container .edit-dialog .dialog-content " to _uM("marginTop" to "30rpx")), "label" to _uM(".container .edit-dialog .dialog-content .radio-group " to _uM("marginBottom" to "30rpx", "fontSize" to "28rpx", "fontWeight" to 500)), "radio-options" to _uM(".container .edit-dialog .dialog-content .radio-group " to _uM("display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap", "alignItems" to "center")), "dialog-actions" to _uM(".container .edit-dialog " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee"), ".container .device-dialog " to _uM("paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee")), "device-dialog" to _uM(".container " to _uM("height" to "800rpx", "backgroundColor" to "#ffffff")), "dialog-tabs" to _uM(".container .device-dialog " to _uM("display" to "flex", "flexDirection" to "row", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "tab" to _uM(".container .device-dialog .dialog-tabs " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "textAlign" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "fontSize" to "28rpx"), ".container .device-dialog .dialog-tabs .active" to _uM("color" to "#2979ff", "borderBottomWidth" to "4rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#2979ff")), "device-list" to _uM(".container .device-dialog " to _uM("height" to "100%", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "75rpx", "paddingLeft" to "20rpx", "boxSizing" to "border-box")), "device-item" to _uM(".container .device-dialog .device-list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f5f5f5")), "device-info" to _uM(".container .device-dialog .device-list .device-item " to _uM("display" to "flex", "flexDirection" to "column")), "status" to _uM(".container .device-dialog .device-list .device-item .device-info " to _uM("fontSize" to "24rpx", "color" to "#999999")), "loading-tip" to _uM(".container .device-dialog .device-list " to _uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0)), "no-more" to _uM(".container .device-dialog .device-list " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "26rpx")), "drag-hint-text" to _uM(".container " to _uM("fontSize" to "28rpx", "color" to "#00aa00", "fontWeight" to "bold", "textAlign" to "center")), "status-text" to _uM(".container " to _uM("fontSize" to "28rpx", "color" to "#333333")), "empty-text-box" to _uM(".container " to _uM("marginTop" to "30rpx")), "empty-text" to _uM(".container " to _uM("textAlign" to "center", "fontSize" to "22rpx", "color" to "#999999")), "i-popup__content" to _uM(".container " to _uM("borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "i-grid-item" to _uM(".container " to _uM("!alignItems" to "flex-start", "marginTop" to "10rpx", "marginRight" to 0, "marginBottom" to "10rpx", "marginLeft" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
