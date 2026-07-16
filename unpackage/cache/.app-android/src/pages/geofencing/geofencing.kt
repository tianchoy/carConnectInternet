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
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesGeofencingGeofencing : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesGeofencingGeofencing) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesGeofencingGeofencing
            val _cache = __ins.renderCache
            val imei = ref(null)
            val connectionStatus = ref(null)
            val deptId = ref(null)
            val carType = ref(null)
            val deviceName = ref(null)
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val mapScale = ref(15)
            val markers = ref(_uA())
            val carMarker = ref(null)
            val circles = ref(_uA())
            val carInFence = ref(false)
            val isDrawing = ref(false)
            val drawingMode = ref("polygon")
            val points = ref(_uA())
            val polygons = ref(_uA())
            val circleCenter = ref(null)
            val circleRadius = ref(0)
            val currentSpeed = ref(0)
            val currentAddress = ref("获取中...")
            val currentCar = ref("京A12345")
            val lastDirection = ref(0)
            val showFenceModal = ref(null)
            val fenceList = ref(_uA())
            val selectedFence = ref(null)
            val fencesPopup = ref(null)
            val editDialogPopup = ref(null)
            val editingFence = ref(null)
            val alarmTypeOptions = _uA(
                "0",
                "1",
                "2",
                "3"
            )
            val fenceForm = reactive(_uO("name" to "", "alarmType" to "1"))
            val deviceDialogPopup = ref(null)
            val activeTab = ref("bind")
            val deviceList = ref(_uA())
            val boundDevices = ref(_uA())
            val currentFenceName = ref("")
            val currentFenceId = ref("")
            val loading = ref(false)
            val scrollTop = ref(0)
            val pagination = reactive(_uO("bind" to _uO("pageNum" to 1, "pageSize" to 10, "hasMore" to true, "loadingMore" to false), "unbind" to _uO("pageNum" to 1, "pageSize" to 10, "hasMore" to true, "loadingMore" to false)))
            val currentPagination = computed(fun(){
                return pagination[activeTab.value]
            }
            )
            val canFinishDrawing = computed(fun(): Boolean {
                if (drawingMode.value === "polygon") {
                    return points.value.length >= 3
                } else if (drawingMode.value === "circle") {
                    return circleCenter.value != null && circleRadius.value > 0
                }
                return false
            }
            )
            val loadingMore = computed(fun(){
                return currentPagination.value.loadingMore
            }
            )
            val hasMore = computed(fun(){
                return currentPagination.value.hasMore
            }
            )
            onLoad(fun(option): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        connectionStatus.value = option["connectionStatus"]
                        imei.value = option["imei"]
                        currentCar.value = option["plateNo"]
                        deptId.value = option["deptId"]
                        carType.value = option["carType"]
                        deviceName.value = option["deviceName"]
                        await(loadInitialPosition())
                        await(loadGeofenceList())
                })
            }
            )
            val loadInitialPosition = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        uni_showLoading(ShowLoadingOptions(title = "获取车辆位置中..."))
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/geofencing/geofencing.uvue", 295, 10), "deptId" to deptId.value, "deviceids" to imei.value)
                            val res = await(getDevicePos(data))
                            res.data.forEach(fun(item): UTSPromise<Unit> {
                                return wrapUTSPromise(suspend {
                                        if (item.imei == imei.value) {
                                            val deviceData = item
                                            val convertedCoord = CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude))
                                            center["latitude"] = convertedCoord.lat
                                            center["longitude"] = convertedCoord.lng
                                            val position: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("position", "pages/geofencing/geofencing.uvue", 309, 12), "latitude" to convertedCoord.lat, "longitude" to convertedCoord.lng)
                                            lastDirection.value = if (isTruthy(deviceData.direction)) {
                                                deviceData.direction
                                            } else {
                                                0
                                            }
                                            carMarker.value = _uO("id" to 0, "latitude" to position["latitude"], "longitude" to position["longitude"], "iconPath" to getDeviceIcon(connectionStatus.value, carType.value), "width" to 25, "height" to 25, "rotate" to calculateMapRotation(lastDirection.value), "callout" to _uO("content" to (deviceName.value || "爱车位置"), "color" to if (connectionStatus.value == "online") {
                                                "#fff"
                                            } else {
                                                "#666"
                                            }
                                            , "bgColor" to if (connectionStatus.value == "online") {
                                                "#07C160"
                                            } else {
                                                "#ccc"
                                            }
                                            , "padding" to 5, "borderRadius" to 4, "display" to "ALWAYS"))
                                            updateMarkers()
                                            currentSpeed.value = if (isTruthy(deviceData.speed)) {
                                                deviceData.speed
                                            } else {
                                                0
                                            }
                                            currentAddress.value = if (isTruthy(deviceData.positionUpdateTime)) {
                                                "最后定位: " + deviceData.positionUpdateTime
                                            } else {
                                                "未知位置"
                                            }
                                            connectionStatus.value = if (isTruthy(deviceData.connectionStatus)) {
                                                deviceData.connectionStatus
                                            } else {
                                                "unknown"
                                            }
                                        }
                                })
                            }
                            )
                        }
                         catch (err: Throwable) {
                            console.error("获取初始位置失败:", err, " at pages/geofencing/geofencing.uvue:349")
                            uni_showToast(ShowToastOptions(title = "获取车辆位置失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val calculateMapRotation = fun(direction): Any {
                var rotation = direction
                if (rotation >= 360) {
                    rotation -= 360
                }
                if (rotation < 0) {
                    rotation += 360
                }
                return rotation
            }
            val loadGeofenceList = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getGeofenceList())
                            if (res.code === 0) {
                                fenceList.value = if (isTruthy(res.data)) {
                                    res.data
                                } else {
                                    _uA()
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = "获取围栏列表失败", icon = "none"))
                                fenceList.value = _uA()
                            }
                            renderFencesOnMap()
                        }
                         catch (error: Throwable) {
                            console.error("加载围栏列表失败:", error, " at pages/geofencing/geofencing.uvue:381")
                            uni_showToast(ShowToastOptions(title = "获取围栏列表失败", icon = "none"))
                            fenceList.value = _uA()
                            renderFencesOnMap()
                        }
                })
            }
            val getFenceType = fun(fence): Any {
                if (isTruthy(fence.type) && fence.type !== "null") {
                    return fence.type
                }
                if (isTruthy(fence.area) && isTruthy(fence.area.startsWith("CIRCLE"))) {
                    return "circle"
                } else if (isTruthy(fence.area) && isTruthy(fence.area.startsWith("POLYGON"))) {
                    return "polygon"
                }
                return "polygon"
            }
            val renderFencesOnMap = fun(){
                if (!(fenceList.value != null) || fenceList.value.length === 0) {
                    polygons.value = _uA()
                    circles.value = _uA()
                    updateMarkers()
                    return
                }
                val fencePolygons = _uA()
                val fenceCircles = _uA()
                fenceList.value.forEach(fun(fence, index){
                    val fenceType = getFenceType(fence)
                    if (fenceType === "circle") {
                        val circleData = parseCircle(fence.area)
                        if (isTruthy(circleData)) {
                            val displayRadius = if (circleData.radius > 100000) {
                                100000
                            } else {
                                circleData.radius
                            }
                            fenceCircles.push(_uO("id" to fence.id, "latitude" to circleData.latitude, "longitude" to circleData.longitude, "radius" to displayRadius, "strokeWidth" to 2, "strokeColor" to "#FF0000", "fillColor" to "rgba(255,0,0,0.2)", "zIndex" to 1, "centerMarker" to true))
                        }
                    } else {
                        val fencePoints = parsePolygon(fence.area)
                        if (fencePoints.length >= 3) {
                            fencePolygons.push(_uO("id" to fence.id, "points" to fencePoints, "strokeWidth" to 2, "strokeColor" to "#FF0000", "fillColor" to if (index === 0) {
                                "rgba(255,0,0,0.2)"
                            } else {
                                "rgba(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ",0.2)"
                            }
                            , "zIndex" to 1))
                        }
                    }
                }
                )
                polygons.value = fencePolygons
                circles.value = fenceCircles
                if (fenceCircles.length > 0 && !selectedFence.value) {
                    val firstCircle = fenceCircles[0]
                    center["latitude"] = firstCircle.latitude
                    center["longitude"] = firstCircle.longitude
                    mapScale.value = calculateZoomLevelFromRadius(firstCircle.radius)
                }
            }
            val parsePolygon = fun(polygonStr): Any {
                if (!isTruthy(polygonStr)) {
                    return _uA()
                }
                val coordStr = polygonStr.replace(UTSRegExp("POLYGON \\(\\(", ""), "").replace(UTSRegExp("\\)\\)", ""), "")
                val coordPoints = coordStr.split(",")
                return coordPoints.map(fun(point): UTSJSONObject {
                    val _point_trim_split_map = point.trim().split(" ").map(Number)
                    val lat = _point_trim_split_map[0]
                    val lng = _point_trim_split_map[1]
                    val convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                    return _uO("latitude" to convertedCoord.lat, "longitude" to convertedCoord.lng)
                }
                )
            }
            val parseCircle = fun(circleStr): UTSJSONObject? {
                if (!isTruthy(circleStr) || !isTruthy(circleStr.startsWith("CIRCLE"))) {
                    return null
                }
                try {
                    val coordStr = circleStr.replace(UTSRegExp("CIRCLE \\(", ""), "").replace(UTSRegExp("\\)", ""), "")
                    val parts = coordStr.split(",")
                    if (parts.length !== 2) {
                        return null
                    }
                    val centerStr = parts[0]
                    val radiusStr = parts[1]
                    val _centerStr_trim_split_map = centerStr.trim().split(" ").map(Number)
                    val lat = _centerStr_trim_split_map[0]
                    val lng = _centerStr_trim_split_map[1]
                    val radius = Number(radiusStr.trim())
                    if (isNaN(lat) || isNaN(lng) || isNaN(radius) || radius <= 0) {
                        console.error("无效的圆形围栏数据:", circleStr, " at pages/geofencing/geofencing.uvue:506")
                        return null
                    }
                    val convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                    return _uO("latitude" to convertedCoord.lat, "longitude" to convertedCoord.lng, "radius" to radius)
                }
                 catch (error: Throwable) {
                    console.error("解析圆形围栏失败:", error, "数据:", circleStr, " at pages/geofencing/geofencing.uvue:519")
                    return null
                }
            }
            val generatePolygonString = fun(points): String {
                val coords = points.map(fun(point): String {
                    val originalCoord = CoordTransform.tencentToWgs84(point.latitude, point.longitude)
                    return "" + originalCoord.lat + " " + originalCoord.lng
                }
                ).join(", ")
                return "POLYGON ((" + coords + "))"
            }
            val generateCircleString = fun(center, radius): String {
                val originalCoord = CoordTransform.tencentToWgs84(center.latitude, center.longitude)
                return "CIRCLE (" + originalCoord.lat + " " + originalCoord.lng + ", " + radius + ")"
            }
            val setMapCenterToFence = fun(fence){
                val fenceType = getFenceType(fence)
                if (fenceType === "circle") {
                    val circleData = parseCircle(fence.area)
                    if (isTruthy(circleData)) {
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
                    val fencePoints = parsePolygon(fence.area)
                    if (fencePoints.length === 0) {
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
                    val latDiff = bounds["maxLat"] - bounds["minLat"]
                    val lngDiff = bounds["maxLng"] - bounds["minLng"]
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
            val calculateZoomLevelFromRadius = fun(radius): Number {
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
            val calculateBounds = fun(points): UTSJSONObject {
                var minLat = points[0].latitude
                var maxLat = points[0].latitude
                var minLng = points[0].longitude
                var maxLng = points[0].longitude
                points.forEach(fun(point){
                    minLat = Math.min(minLat, point.latitude)
                    maxLat = Math.max(maxLat, point.latitude)
                    minLng = Math.min(minLng, point.longitude)
                    maxLng = Math.max(maxLng, point.longitude)
                }
                )
                return _uO("minLat" to minLat, "maxLat" to maxLat, "minLng" to minLng, "maxLng" to maxLng)
            }
            val showFenceList = fun(){
                fencesPopup.value?.open()
            }
            val selectFence = fun(fence){
                selectedFence.value = fence
                fencesPopup.value?.close()
                showFenceModal.value?.open()
                val fenceType = getFenceType(fence)
                if (fenceType === "circle") {
                    val circleData = parseCircle(fence.area)
                    if (isTruthy(circleData)) {
                        circleCenter.value = _uO("latitude" to circleData.latitude, "longitude" to circleData.longitude)
                        circleRadius.value = circleData.radius
                        points.value = _uA()
                    }
                } else {
                    val fencePoints = parsePolygon(fence.area)
                    points.value = fencePoints
                    circleCenter.value = null
                    circleRadius.value = 0
                }
                setMapCenterToFence(fence)
                updateMapDisplay()
            }
            val editFence = fun(fence){
                editingFence.value = fence
                fenceForm["name"] = fence.name
                val alarmType = String(fence.alarmType ?: "")
                fenceForm["alarmType"] = if (alarmTypeOptions.includes(alarmType)) {
                    alarmType
                } else {
                    "1"
                }
                val fenceType = getFenceType(fence)
                drawingMode.value = fenceType
                if (fenceType === "circle") {
                    val circleData = parseCircle(fence.area)
                    if (isTruthy(circleData)) {
                        circleCenter.value = _uO("latitude" to circleData.latitude, "longitude" to circleData.longitude)
                        circleRadius.value = circleData.radius
                        points.value = _uA()
                    }
                } else {
                    val fencePoints = parsePolygon(fence.area)
                    if (fencePoints.length >= 3) {
                        points.value = fencePoints
                        circleCenter.value = null
                        circleRadius.value = 0
                    }
                }
                updateMapDisplay()
                editDialogPopup.value?.open()
            }
            val deleteFence = fun(id): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        uni_showModal(ShowModalOptions(title = "确认删除", content = "确定要删除这个围栏吗？", success = fun(res): UTSPromise<Unit> {
                            return wrapUTSPromise(suspend {
                                    if (res.confirm) {
                                        try {
                                            val result = await(deleteGeofence(id))
                                            if (result.code === 0) {
                                                uni_showToast(ShowToastOptions(title = "删除成功"))
                                                selectedFence.value = null
                                                points.value = _uA()
                                                circleCenter.value = null
                                                circleRadius.value = 0
                                                isDrawing.value = false
                                                polygons.value = _uA()
                                                circles.value = _uA()
                                                updateMarkers()
                                                showFenceModal.value?.close()
                                                await(loadGeofenceList())
                                            } else {
                                                uni_showToast(ShowToastOptions(title = "删除失败", icon = "none"))
                                            }
                                        }
                                         catch (error: Throwable) {
                                            console.error("删除围栏失败:", error, " at pages/geofencing/geofencing.uvue:709")
                                            uni_showToast(ShowToastOptions(title = "删除失败", icon = "none"))
                                        }
                                    }
                            })
                        }
                        ))
                })
            }
            val saveFence = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!(fenceForm["name"] != "")) {
                            uni_showToast(ShowToastOptions(title = "请输入围栏名称", icon = "none"))
                            return@w1
                        }
                        var area = ""
                        if (editingFence.value) {
                            if (drawingMode.value === "polygon" && points.value.length >= 3) {
                                area = generatePolygonString(points.value)
                            } else if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
                                area = generateCircleString(circleCenter.value, circleRadius.value)
                            } else {
                                area = editingFence.value!!.area
                            }
                        } else {
                            if (drawingMode.value === "polygon" && points.value.length < 3) {
                                uni_showToast(ShowToastOptions(title = "请绘制有效的围栏区域（至少3个顶点）", icon = "none"))
                                return@w1
                            } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
                                uni_showToast(ShowToastOptions(title = "请绘制有效的圆形围栏", icon = "none"))
                                return@w1
                            }
                            if (drawingMode.value === "polygon") {
                                area = generatePolygonString(points.value)
                            } else if (drawingMode.value === "circle" && circleCenter.value) {
                                area = generateCircleString(circleCenter.value, circleRadius.value)
                            }
                        }
                        if (!(area != "")) {
                            uni_showToast(ShowToastOptions(title = "围栏数据无效，请重新绘制", icon = "none"))
                            return@w1
                        }
                        if (!alarmTypeOptions.includes(fenceForm["alarmType"])) {
                            uni_showToast(ShowToastOptions(title = "请选择有效的告警类型", icon = "none"))
                            return@w1
                        }
                        val fenceData: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("fenceData", "pages/geofencing/geofencing.uvue", 764, 9), "name" to fenceForm["name"], "area" to area, "alarmType" to Number(fenceForm["alarmType"]), "type" to drawingMode.value)
                        try {
                            var result
                            if (editingFence.value) {
                                uni_showLoading(ShowLoadingOptions(title = "更新中..."))
                                result = await(updateGeofence(UTSJSONObject.assign(_uO("id" to editingFence.value!!.id), fenceData)))
                            } else {
                                uni_showLoading(ShowLoadingOptions(title = "保存中..."))
                                result = await(addGeofence(fenceData))
                            }
                            uni_hideLoading(null)
                            if (result.code === 0) {
                                uni_showToast(ShowToastOptions(title = if (editingFence.value) {
                                    "更新成功"
                                } else {
                                    "保存成功"
                                }))
                                editDialogPopup.value?.close()
                                val tempFence = editingFence.value
                                editingFence.value = null
                                isDrawing.value = false
                                points.value = _uA()
                                circleCenter.value = null
                                circleRadius.value = 0
                                await(loadGeofenceList())
                                if (tempFence) {
                                    selectedFence.value = null
                                    showFenceModal.value?.close()
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = if (isTruthy(result.msg)) {
                                    result.msg
                                } else {
                                    "保存失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            uni_hideLoading(null)
                            console.error("保存围栏失败:", error, " at pages/geofencing/geofencing.uvue:810")
                            uni_showToast(ShowToastOptions(title = "保存失败，请重试", icon = "none"))
                        }
                })
            }
            val showBindDevices = fun(fenceId): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        currentFenceId.value = fenceId
                        currentFenceName.value = selectedFence.value.name
                        deviceDialogPopup.value?.open()
                        activeTab.value = "bind"
                        scrollTop.value = 0
                        initPagination("bind")
                        await(loadBoundDevices(fenceId))
                })
            }
            val closeDeviceDialog = fun(){
                deviceDialogPopup.value?.close()
                scrollTop.value = 0
            }
            val switchTab = fun(tab): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (activeTab.value === tab) {
                            return@w1
                        }
                        activeTab.value = tab
                        scrollTop.value = 0
                        deviceList.value = _uA()
                        initPagination(tab)
                        if (tab === "bind") {
                            await(loadBoundDevices(currentFenceId.value))
                        } else {
                            await(loadUnboundDevices())
                        }
                })
            }
            val initPagination = fun(tabType){
                pagination[tabType] = _uO("pageNum" to 1, "pageSize" to 10, "hasMore" to true, "loadingMore" to false)
                if (activeTab.value === tabType) {
                    deviceList.value = _uA()
                }
            }
            val loadBoundDevices = fun(fenceId): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val page = pagination["bind"]
                        if (!page.hasMore || page.loadingMore) {
                            return@w1
                        }
                        page.loadingMore = true
                        try {
                            val res = await(getBoundDevices(_uO("pageNum" to page.pageNum, "pageSize" to page.pageSize, "geoId" to fenceId)))
                            if (res.code === 0) {
                                val dataList = if (isTruthy(res.data.list)) {
                                    res.data.list
                                } else {
                                    _uA()
                                }
                                if (page.pageNum === 1) {
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
            val loadUnboundDevices = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val page = pagination["unbind"]
                        if (!page.hasMore || page.loadingMore) {
                            return@w1
                        }
                        page.loadingMore = true
                        try {
                            val res = await(getUnboundDevices(_uO("pageNum" to page.pageNum, "pageSize" to page.pageSize)))
                            if (res.code === 0) {
                                val dataList = if (isTruthy(res.data.list)) {
                                    res.data.list
                                } else {
                                    _uA()
                                }
                                if (page.pageNum === 1) {
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
            val handleLoadMore = fun(){
                if (isTruthy(loadingMore.value) || !isTruthy(hasMore.value)) {
                    return
                }
                if (activeTab.value === "bind") {
                    loadBoundDevices(currentFenceId.value)
                } else {
                    loadUnboundDevices()
                }
            }
            val toggleDeviceBinding = fun(deviceImei, bound): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        loading.value = true
                        try {
                            val params: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("params", "pages/geofencing/geofencing.uvue", 951, 10), "geofenceId" to currentFenceId.value, "imeis" to _uA(
                                deviceImei
                            ))
                            var result
                            if (isTruthy(bound)) {
                                result = await(bindDevices(params))
                            } else {
                                result = await(unbindDevices(params))
                            }
                            if (result.code === 0) {
                                uni_showToast(ShowToastOptions(title = if (isTruthy(bound)) {
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
                                uni_showToast(ShowToastOptions(title = if (isTruthy(result.msg)) {
                                    result.msg
                                } else {
                                    "操作失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("设备绑定操作失败:", error, " at pages/geofencing/geofencing.uvue:978")
                            uni_showToast(ShowToastOptions(title = "操作失败", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            val isDeviceBound = fun(deviceImei): Boolean {
                return boundDevices.value.some(fun(device): Boolean {
                    return device.imei === deviceImei
                }
                )
            }
            val setDrawingMode = fun(mode){
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
            val handleMapTap = fun(e){
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        addNewPoint(e.detail.latitude, e.detail.longitude)
                    } else if (drawingMode.value === "circle") {
                        if (!circleCenter.value) {
                            circleCenter.value = _uO("latitude" to e.detail.latitude, "longitude" to e.detail.longitude)
                            updateMapDisplay()
                        } else {
                            val radius = calculateDistance(circleCenter.value!!.latitude, circleCenter.value!!.longitude, e.detail.latitude, e.detail.longitude)
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
            val calculateDistance = fun(lat1, lng1, lat2, lng2): Number {
                val R: Number = 6371000
                val dLat = (lat2 - lat1) * Math.PI / 180
                val dLng = (lng2 - lng1) * Math.PI / 180
                val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
                val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                val distance = R * c
                return distance
            }
            val addNewPoint = fun(lat, lng){
                points.value.push(_uO("latitude" to lat, "longitude" to lng))
                updateMapDisplay()
            }
            val finishDrawing = fun(){
                if (drawingMode.value === "polygon" && points.value.length < 3) {
                    uni_showToast(ShowToastOptions(title = "至少需要3个顶点", icon = "none"))
                    return
                } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
                    uni_showToast(ShowToastOptions(title = "请设置有效的圆形围栏", icon = "none"))
                    return
                }
                isDrawing.value = false
                fenceForm["name"] = "" + (if (drawingMode.value === "circle") {
                    "圆形"
                } else {
                    "多边形"
                }
                ) + "围栏" + (fenceList.value.length + 1)
                editDialogPopup.value?.open()
            }
            val updateMarkers = fun(){
                val newMarkers = _uA()
                if (carMarker.value) {
                    newMarkers.push(carMarker.value!!)
                }
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        points.value.forEach(fun(point, index){
                            newMarkers.push(_uO("id" to (1000 + index), "latitude" to point.latitude, "longitude" to point.longitude, "iconPath" to "/static/marker.png", "width" to 32, "height" to 32, "callout" to _uO("content" to ("顶点" + (index + 1)), "display" to "ALWAYS"), "anchor" to _uO("x" to 0.5, "y" to 0.5)))
                        })
                    } else if (drawingMode.value === "circle" && circleCenter.value) {
                        newMarkers.push(_uO("id" to 1000, "latitude" to circleCenter.value!!.latitude, "longitude" to circleCenter.value!!.longitude, "iconPath" to "/static/marker.png", "width" to 32, "height" to 32, "callout" to _uO("content" to "圆心", "display" to "ALWAYS"), "anchor" to _uO("x" to 0.5, "y" to 0.5)))
                    }
                } else if (selectedFence.value) {
                    val fenceType = getFenceType(selectedFence.value)
                    if (fenceType === "circle") {
                        val circleData = parseCircle(selectedFence.value!!.area)
                        if (isTruthy(circleData)) {
                            newMarkers.push(_uO("id" to 2000, "latitude" to circleData.latitude, "longitude" to circleData.longitude, "iconPath" to "/static/marker.png", "width" to 32, "height" to 32, "callout" to _uO("content" to "圆心", "display" to "ALWAYS"), "anchor" to _uO("x" to 0.5, "y" to 0.5)))
                        }
                    } else {
                        val fencePoints = parsePolygon(selectedFence.value!!.area)
                        fencePoints.forEach(fun(point, index){
                            newMarkers.push(_uO("id" to (2000 + index), "latitude" to point.latitude, "longitude" to point.longitude, "iconPath" to "/static/marker.png", "width" to 32, "height" to 32, "callout" to _uO("content" to ("顶点" + (index + 1)), "display" to "ALWAYS"), "anchor" to _uO("x" to 0.5, "y" to 0.5)))
                        }
                        )
                    }
                }
                markers.value = newMarkers
            }
            val updateFencePolygon = fun(){
                if (drawingMode.value === "polygon") {
                    polygons.value = if (points.value.length >= 3) {
                        _uA(
                            _uO("points" to points.value, "strokeWidth" to 2, "strokeColor" to "#FF0000", "fillColor" to "rgba(255,0,0,0.2)", "zIndex" to 1)
                        )
                    } else {
                        _uA()
                    }
                } else {
                    polygons.value = _uA()
                }
            }
            val updateFenceCircle = fun(){
                if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
                    circles.value = _uA(
                        _uO("latitude" to circleCenter.value!!.latitude, "longitude" to circleCenter.value!!.longitude, "radius" to circleRadius.value, "strokeWidth" to 2, "strokeColor" to "#FF0000", "fillColor" to "rgba(255,0,0,0.2)", "zIndex" to 1)
                    )
                } else {
                    circles.value = _uA()
                }
            }
            val updateMapDisplay = fun(){
                updateMarkers()
                if (isDrawing.value) {
                    if (drawingMode.value === "polygon") {
                        updateFencePolygon()
                        circles.value = _uA()
                    } else if (drawingMode.value === "circle") {
                        updateFenceCircle()
                        polygons.value = _uA()
                    }
                } else {
                    renderFencesOnMap()
                }
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
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_sub_navBar = resolveEasyComponent("sub-navBar", GenComponentsSubNavBarSubNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_popup = resolveEasyComponent("i-popup", GenUniModulesIUiXComponentsIPopupIPopupClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_radio = resolveEasyComponent("i-radio", GenUniModulesIUiXComponentsIRadioIRadioClass)
                val _component_i_switch = resolveEasyComponent("i-switch", GenUniModulesIUiXComponentsISwitchISwitchClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "地理围栏", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "map-container"), _uA(
                        _cV(_component_map, _uM("id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to false, "polygons" to polygons.value, "markers" to markers.value, "circles" to circles.value, "onClick" to handleMapTap, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to true), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_sub_navBar, _uM("showTime" to false, "currentCar" to currentCar.value, "showCar" to true, "carStatus" to connectionStatus.value), null, 8, _uA(
                                    "currentCar",
                                    "carStatus"
                                ))
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "latitude",
                            "longitude",
                            "scale",
                            "style",
                            "polygons",
                            "markers",
                            "circles"
                        )),
                        if (isTrue(isDrawing.value)) {
                            _cE("view", _uM("key" to 0, "class" to "drag-hint"), _uA(
                                if (drawingMode.value === "polygon") {
                                    _cE("text", _uM("key" to 0), "点击地图添加围栏点,至少需要3个点")
                                } else {
                                    _cC("v-if", true)
                                },
                                if (drawingMode.value === "circle") {
                                    _cE("text", _uM("key" to 1), "点击地图确定圆心，再点一下地图确定半径")
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                    )),
                    _cV(_component_i_popup, _uM("ref_key" to "showFenceModal", "ref" to showFenceModal, "mode" to "center", "round" to "10"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                        return _uA(
                            if (isTrue(selectedFence.value)) {
                                _cE("view", _uM("key" to 0, "class" to "fence-operations"), _uA(
                                    _cE("view", _uM("class" to "fence-header"), _uA(
                                        _cE("text", _uM("class" to "fence-name"), _tD(selectedFence.value.name), 1),
                                        _cV(_component_i_icon, _uM("name" to "close", "onClick" to fun(){
                                            selectedFence.value = null
                                            showFenceModal.value?.close()
                                        }), null, 8, _uA(
                                            "onClick"
                                        ))
                                    )),
                                    _cE("view", _uM("class" to "fence-actions"), _uA(
                                        _cV(_component_i_button, _uM("size" to "small", "onClick" to fun(){
                                            editFence(selectedFence.value)
                                        }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "编辑"
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "onClick"
                                        )),
                                        _cV(_component_i_button, _uM("size" to "small", "type" to "error", "onClick" to fun(){
                                            deleteFence(selectedFence.value.id)
                                        }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "删除"
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "onClick"
                                        )),
                                        _cV(_component_i_button, _uM("size" to "small", "type" to "primary", "onClick" to fun(){
                                            showBindDevices(selectedFence.value.id)
                                        }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "绑定设备"
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "onClick"
                                        ))
                                    ))
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        )
                    }
                    ), "_" to 1), 512),
                    _cE("view", _uM("class" to "tools-panel"), _uA(
                        if (isTrue(!isDrawing.value && !selectedFence.value)) {
                            _cE("view", _uM("key" to 0, "class" to "drawing-mode-selector"), _uA(
                                _cE("view", _uM("class" to "mode-title"), "选择围栏类型:"),
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
                                    _cV(_component_i_button, _uM("type" to if (drawingMode.value == "circle") {
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
                            _cV(_component_i_button, _uM("onClick" to startDrawing, "disabled" to if (isDrawing.value) {
                                isDrawing.value
                            } else {
                                selectedFence.value
                            }
                            , "size" to "small"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
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
                            _cE("text", null, "围栏类型: " + _tD(if (drawingMode.value === "polygon") {
                                "多边形"
                            } else {
                                "圆形"
                            }
                            ), 1),
                            if (drawingMode.value === "polygon") {
                                _cE("text", _uM("key" to 0), "顶点数量: " + _tD(points.value.length), 1)
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (drawingMode.value === "circle") {
                                _cE("text", _uM("key" to 1), "半径: " + _tD(circleRadius.value.toFixed(2)) + "米", 1)
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    )),
                    _cV(_component_i_popup, _uM("ref_key" to "fencesPopup", "ref" to fencesPopup, "mode" to "bottom", "round" to "10"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                        return _uA(
                            _cE("view", _uM("class" to "fence-list"), _uA(
                                _cE("view", _uM("class" to "list-header"), _uA(
                                    _cE("text", _uM("class" to "title"), "围栏列表"),
                                    _cV(_component_i_icon, _uM("name" to "/static/close.png", "fontSize" to "15", "onClick" to fun(){
                                        fencesPopup.value.close()
                                    }
                                    ), null, 8, _uA(
                                        "onClick"
                                    ))
                                )),
                                _cE("scroll-view", _uM("class" to "list-content", "scroll-y" to ""), _uA(
                                    _cE(Fragment, null, RenderHelpers.renderList(fenceList.value, fun(fence, __key, __index, _cached): Any {
                                        return _cE("view", _uM("key" to fence.id, "class" to "fence-item", "onClick" to fun(){
                                            selectFence(fence)
                                        }
                                        ), _uA(
                                            _cE("view", _uM("class" to "fence-info"), _uA(
                                                _cE("text", _uM("class" to "name"), _tD(fence.name), 1),
                                                _cE("text", _uM("class" to "type"), _tD(if (getFenceType(fence) === "circle") {
                                                    "圆形"
                                                } else {
                                                    "多边形"
                                                }
                                                ), 1),
                                                _cE("text", _uM("class" to "devices"), "绑定设备: " + _tD(if (isTruthy(fence.deviceCount)) {
                                                    fence.deviceCount
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
                                    if (fenceList.value.length === 0) {
                                        _cE("view", _uM("key" to 0, "class" to "empty"), " 暂无围栏数据 ")
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            ))
                        )
                    }
                    ), "_" to 1), 512),
                    _cV(_component_i_popup, _uM("ref_key" to "editDialogPopup", "ref" to editDialogPopup, "mode" to "center", "round" to "10"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                        return _uA(
                            _cE("view", _uM("class" to "edit-dialog"), _uA(
                                _cE("view", _uM("class" to "dialog-header"), _uA(
                                    _cE("text", null, _tD(if (editingFence.value) {
                                        "编辑围栏"
                                    } else {
                                        "新增围栏"
                                    }
                                    ), 1)
                                )),
                                _cE("view", _uM("class" to "dialog-content"), _uA(
                                    _cV(_component_i_input, _uM("modelValue" to fenceForm["name"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                        fenceForm["name"] = `$event`
                                    }
                                    , "placeholder" to "请输入围栏名称", "border" to "surround"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    )),
                                    _cE("view", _uM("class" to "radio-group"), _uA(
                                        _cE("text", _uM("class" to "label"), "告警类型:"),
                                        _cE("view", _uM("class" to "radio-options"), _uA(
                                            _cV(_component_i_radio, _uM("modelValue" to fenceForm["alarmType"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                                fenceForm["alarmType"] = `$event`
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
                                            _cV(_component_i_radio, _uM("modelValue" to fenceForm["alarmType"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                                fenceForm["alarmType"] = `$event`
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
                                            _cV(_component_i_radio, _uM("modelValue" to fenceForm["alarmType"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                                fenceForm["alarmType"] = `$event`
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
                                            _cV(_component_i_radio, _uM("modelValue" to fenceForm["alarmType"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                                fenceForm["alarmType"] = `$event`
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
                                    _cV(_component_i_button, _uM("onClick" to fun(){
                                        editDialogPopup.value.close()
                                    }
                                    ), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            "取消"
                                        )
                                    }
                                    ), "_" to 1), 8, _uA(
                                        "onClick"
                                    )),
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
                    _cV(_component_i_popup, _uM("ref_key" to "deviceDialogPopup", "ref" to deviceDialogPopup, "mode" to "bottom", "round" to "10", "mask-click-able" to false), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                        return _uA(
                            _cE("view", _uM("class" to "device-dialog"), _uA(
                                _cE("view", _uM("class" to "dialog-header"), _uA(
                                    _cE("text", null, "设备绑定 - " + _tD(currentFenceName.value), 1),
                                    _cV(_component_i_icon, _uM("name" to "close", "onClick" to closeDeviceDialog))
                                )),
                                _cE("view", _uM("class" to "dialog-tabs"), _uA(
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "tab",
                                        if (activeTab.value === "bind") {
                                            "active"
                                        } else {
                                            ""
                                        }
                                    )), "onClick" to fun(){
                                        switchTab("bind")
                                    }
                                    ), " 已绑定设备 ", 10, _uA(
                                        "onClick"
                                    )),
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "tab",
                                        if (activeTab.value === "unbind") {
                                            "active"
                                        } else {
                                            ""
                                        }
                                    )), "onClick" to fun(){
                                        switchTab("unbind")
                                    }
                                    ), " 未绑定设备 ", 10, _uA(
                                        "onClick"
                                    ))
                                )),
                                _cE("scroll-view", _uM("class" to "device-list", "scroll-y" to "", "scroll-top" to scrollTop.value, "onScrolltolower" to handleLoadMore, "lower-threshold" to 150), _uA(
                                    _cE(Fragment, null, RenderHelpers.renderList(deviceList.value, fun(device, __key, __index, _cached): Any {
                                        return _cE("view", _uM("key" to device.imei, "class" to "device-item"), _uA(
                                            _cE("view", _uM("class" to "device-info"), _uA(
                                                _cE("text", _uM("class" to "name"), _tD(if (isTruthy(device.deviceName)) {
                                                    device.deviceName
                                                } else {
                                                    device.plateNo
                                                }
                                                ), 1),
                                                if (isTrue(device.connectionStatus)) {
                                                    _cE("text", _uM("key" to 0, "class" to "status"), _tD(if (device.connectionStatus === "online") {
                                                        "在线"
                                                    } else {
                                                        "离线"
                                                    }), 1)
                                                } else {
                                                    _cC("v-if", true)
                                                }
                                            )),
                                            _cV(_component_i_switch, _uM("model-value" to isDeviceBound(device.imei), "onChange" to fun(`$event`: Any){
                                                toggleDeviceBinding(device.imei, `$event`)
                                            }
                                            , "disabled" to if (loading.value) {
                                                loading.value
                                            } else {
                                                loadingMore.value
                                            }
                                            , "size" to "20"), null, 8, _uA(
                                                "model-value",
                                                "onChange",
                                                "disabled"
                                            ))
                                        ))
                                    }
                                    ), 128),
                                    if (isTrue(deviceList.value.length === 0 && !loading.value)) {
                                        _cE("view", _uM("key" to 0, "class" to "empty"), _tD(if (activeTab.value === "bind") {
                                            "暂无绑定设备"
                                        } else {
                                            "暂无可用设备"
                                        }), 1)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                    ,
                                    if (isTrue(loadingMore.value)) {
                                        _cE("view", _uM("key" to 1, "class" to "loading-tip"), _uA(
                                            _cE("text", null, "正在加载更多...")
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    }
                                    ,
                                    if (isTrue(deviceList.value.length > 0 && !isTruthy(hasMore.value) && !isTruthy(loadingMore.value))) {
                                        _cE("view", _uM("key" to 2, "class" to "no-more"), " 暂无更多数据 ")
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "drag-hint" to _uM(".container .map-container " to _uM("position" to "absolute", "top" to "20rpx", "left" to 0, "right" to 0, "zIndex" to 100, "backgroundColor" to "rgba(255,255,255,0.9)", "paddingTop" to "16rpx", "paddingRight" to "16rpx", "paddingBottom" to "16rpx", "paddingLeft" to "16rpx", "textAlign" to "center", "fontSize" to "28rpx", "color" to "#00aa00", "fontWeight" to "bold", "boxShadow" to "0 4rpx 10rpx rgba(0, 0, 0, 0.1)", "animation" to "pulse 1.5s infinite")), "fence-operations" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx", "width" to "500rpx", "height" to "200rpx")), "fence-header" to _uM(".container .fence-operations " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "40rpx", "paddingBottom" to "20rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "fence-name" to _uM(".container .fence-operations .fence-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold")), "fence-actions" to _uM(".container .fence-operations " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between")), "tools-panel" to _uM(".container " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "display" to "flex", "flexDirection" to "column", "boxShadow" to "0 -2px 10px rgba(0, 0, 0, 0.1)")), "drawing-mode-selector" to _uM(".container .tools-panel " to _uM("marginBottom" to "20rpx", "paddingBottom" to "20rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "mode-title" to _uM(".container .tools-panel .drawing-mode-selector " to _uM("fontSize" to "28rpx", "marginBottom" to "15rpx", "color" to "#333333", "fontWeight" to 500)), "mode-buttons" to _uM(".container .tools-panel .drawing-mode-selector " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "gap" to "20rpx")), "tool-tag-item" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "20rpx")), "status-info" to _uM(".container .tools-panel " to _uM("display" to "flex", "flexDirection" to "column", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "fontSize" to "28rpx", "color" to "#333333", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee")), "fence-list" to _uM(".container " to _uM("backgroundColor" to "#ffffff")), "list-header" to _uM(".container .fence-list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "title" to _uM(".container .fence-list .list-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold")), "list-content" to _uM(".container .fence-list " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")), "fence-item" to _uM(".container .fence-list .list-content " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f5f5f5", "backgroundColor:active" to "#f9f9f9")), "fence-info" to _uM(".container .fence-list .list-content .fence-item " to _uM("display" to "flex", "flexDirection" to "column", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "name" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "30rpx", "fontWeight" to 500, "marginBottom" to "8rpx"), ".container .device-dialog .device-list .device-item .device-info " to _uM("fontSize" to "30rpx", "marginBottom" to "8rpx")), "type" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "24rpx", "color" to "#2979ff", "marginBottom" to "8rpx")), "devices" to _uM(".container .fence-list .list-content .fence-item .fence-info " to _uM("fontSize" to "24rpx", "color" to "#999999")), "empty" to _uM(".container .fence-list .list-content " to _uM("textAlign" to "center", "paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0, "color" to "#999999"), ".container .device-dialog .device-list " to _uM("textAlign" to "center", "paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0, "color" to "#999999")), "edit-dialog" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "overflow" to "hidden")), "dialog-header" to _uM(".container .edit-dialog " to _uM("paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "textAlign" to "center", "fontSize" to "32rpx", "fontWeight" to "bold", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee"), ".container .device-dialog " to _uM("display" to "flex", "justifyContent" to "space-between", "flexDirection" to "row", "alignItems" to "center", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee", "fontSize" to "32rpx", "fontWeight" to "bold")), "dialog-content" to _uM(".container .edit-dialog " to _uM("paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx")), "radio-group" to _uM(".container .edit-dialog .dialog-content " to _uM("marginTop" to "30rpx")), "label" to _uM(".container .edit-dialog .dialog-content .radio-group " to _uM("marginBottom" to "30rpx", "fontSize" to "28rpx", "fontWeight" to 500)), "radio-options" to _uM(".container .edit-dialog .dialog-content .radio-group " to _uM("display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap", "alignItems" to "center")), "dialog-actions" to _uM(".container .edit-dialog " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee"), ".container .device-dialog " to _uM("paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#eeeeee")), "device-dialog" to _uM(".container " to _uM("backgroundColor" to "#ffffff")), "dialog-tabs" to _uM(".container .device-dialog " to _uM("display" to "flex", "flexDirection" to "row", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "tab" to _uM(".container .device-dialog .dialog-tabs " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "textAlign" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "fontSize" to "28rpx"), ".container .device-dialog .dialog-tabs .active" to _uM("color" to "#2979ff", "borderBottomWidth" to "4rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#2979ff")), "device-list" to _uM(".container .device-dialog " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "boxSizing" to "border-box")), "device-item" to _uM(".container .device-dialog .device-list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f5f5f5")), "device-info" to _uM(".container .device-dialog .device-list .device-item " to _uM("display" to "flex", "flexDirection" to "column")), "status" to _uM(".container .device-dialog .device-list .device-item .device-info " to _uM("fontSize" to "24rpx", "color" to "#999999")), "loading-tip" to _uM(".container .device-dialog .device-list " to _uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0)), "load-more-text" to _uM(".container .device-dialog .device-list .loading-tip " to _uM("fontSize" to "26rpx", "color" to "#999999")), "no-more" to _uM(".container .device-dialog .device-list " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "26rpx")), "i-popup__content" to _uM(".container " to _uM("borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "i-grid-item" to _uM(".container " to _uM("!alignItems" to "flex-start", "marginTop" to "10rpx", "marginRight" to 0, "marginBottom" to "10rpx", "marginLeft" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
