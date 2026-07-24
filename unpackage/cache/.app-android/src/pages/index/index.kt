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
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.hideTabBar as uni_hideTabBar
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.openLocation as uni_openLocation
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showModal as uni_showModal
import io.dcloud.uniapp.extapi.switchTab as uni_switchTab
open class GenPagesIndexIndex : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesIndexIndex) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesIndexIndex
            val _cache = __ins.renderCache
            val timeRange: TodayTimeRange = getTodayZeroTime()
            val nowTime: Number = timeRange.nowTime
            val todayZero: Number = timeRange.todayZero
            val center = reactive<MapCenter>(MapCenter(latitude = 39.90469, longitude = 116.40717))
            val userDeviceList = ref(_uA<UTSJSONObject>())
            val isMapReady = ref(false)
            val mapScale = ref(12)
            val statusBarHeight = ref(20)
            val menuButtonInfo = ref(null)
            val navBarHeight = ref(44)
            val deviceList = ref(_uA<Device>())
            val showPicker = ref(false)
            val pickerDefaultIndex = ref(_uA<Number>(0))
            val pickerKey = ref(0)
            val currentCarImei = ref("")
            val currentCarDeptId = ref("")
            val currentCarDeviceId = ref("")
            val currentCarIccId = ref("")
            val currentCarName = ref("")
            val currentCarSimMerchant = ref("")
            val currentCarConnectionStatus = ref("")
            val currentCarCarType = ref("")
            val currentCarPlateNo = ref("")
            val deviceDetail = ref<DeviceDetailState>(DeviceDetailState(deviceStatus = DeviceStatus(batteryPercent = 0, voltage = 0, signalStrength = 0), connectionStatus = "offline", lastUpdateTime = ""))
            val markers = ref(_uA<Marker>())
            val lastUpdateTime = ref("--:--:--")
            val SELECTED_DEVICE_STORAGE_KEY: String = "selected_device_info"
            val SELECTED_DEVICE_INDEX_STORAGE_KEY: String = "selected_device_index"
            val safeDeviceDetail = computed<DeviceDetailState>(fun(): DeviceDetailState {
                val detail = deviceDetail.value
                return DeviceDetailState(deviceStatus = DeviceStatus(batteryPercent = detail.deviceStatus.batteryPercent, voltage = detail.deviceStatus.voltage, signalStrength = detail.deviceStatus.signalStrength), connectionStatus = detail.connectionStatus, lastUpdateTime = detail.lastUpdateTime)
            }
            )
            val pickerColumns = computed(fun(): UTSArray<UTSArray<UTSJSONObject>> {
                return _uA(
                    deviceList.value.map(fun(device): UTSJSONObject {
                        val displayName = if (device.deviceName != "") {
                            device.deviceName
                        } else {
                            if (device.name != "") {
                                device.name
                            } else {
                                if (device.imei != "") {
                                    device.imei
                                } else {
                                    "未命名设备"
                                }
                            }
                        }
                        val statusText = if (device.connectionStatus == "online") {
                            "在线"
                        } else {
                            "离线"
                        }
                        return _uO("text" to ("" + displayName + " (" + statusText + ")"), "value" to if (device.imei != "") {
                            device.imei
                        } else {
                            device.deviceId
                        }
                        , "disabled" to false)
                    }
                    )
                )
            }
            )
            val closePicker = fun(){
                showPicker.value = false
            }
            val initDimensions = fun(){
                val systemInfo = uni_getSystemInfoSync()
                statusBarHeight.value = if (systemInfo.statusBarHeight != null) {
                    systemInfo.statusBarHeight
                } else {
                    20
                }
            }
            val delay = fun(ms: Number): UTSPromise<Unit> {
                return UTSPromise<Unit>(fun(resolve: (value: Unit) -> Unit, _reject){
                    setTimeout(fun(){
                        resolve(Unit)
                    }
                    , ms)
                }
                )
            }
            val saveSelectedDevice = fun(device: Device){
                try {
                    val deviceInfo: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("deviceInfo", "pages/index/index.uvue", 335, 15), "name" to if (device.deviceName != "") {
                        device.deviceName
                    } else {
                        if (device.name != "") {
                            device.name
                        } else {
                            device.imei
                        }
                    }
                    , "deviceName" to if (device.deviceName != "") {
                        device.deviceName
                    } else {
                        if (device.name != "") {
                            device.name
                        } else {
                            device.imei
                        }
                    }
                    , "imei" to if (device.imei != "") {
                        device.imei
                    } else {
                        device.value
                    }
                    , "deptId" to device.deptId, "deviceId" to device.deviceId, "iccid" to device.iccid, "simMerchant" to device.simMerchant, "connectionStatus" to device.connectionStatus, "carType" to device.carType, "plateNo" to device.plateNo, "latitude" to device.latitude, "longitude" to device.longitude)
                    uni_setStorageSync(SELECTED_DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo))
                    console.log("保存选中设备成功:", deviceInfo, " at pages/index/index.uvue:350")
                }
                 catch (error: Throwable) {
                    console.error("保存选中设备失败:", error, " at pages/index/index.uvue:352")
                }
            }
            val decodeSavedDevice = fun(raw: Any): SavedDevice? {
                if (raw == null || raw == "") {
                    return null
                }
                var data: UTSJSONObject? = null
                if (UTSAndroid.`typeof`(raw) == "string") {
                    try {
                        data = UTSAndroid.consoleDebugError(JSON.parse(raw as String), " at pages/index/index.uvue:376") as UTSJSONObject
                    } catch (error: Throwable) {
                        return null
                    }
                } else {
                    data = raw as UTSJSONObject
                }
                if (data == null) {
                    return null
                }
                val imei = data.getString("imei", "")
                if (imei == "") {
                    return null
                }
                val device = SavedDevice(name = data.getString("name", imei), deviceName = data.getString("deviceName", data.getString("name", imei)), imei = imei, deptId = data.getString("deptId", ""), deviceId = data.getString("deviceId", ""), iccid = data.getString("iccid", ""), simMerchant = data.getString("simMerchant", ""), connectionStatus = data.getString("connectionStatus", ""), carType = data.getString("carType", ""), plateNo = data.getString("plateNo", ""), latitude = data.getNumber("latitude", 0), longitude = data.getNumber("longitude", 0))
                return device
            }
            val getSavedSelectedDevice = fun(): SavedDevice? {
                try {
                    val rawDevice = uni_getStorageSync(SELECTED_DEVICE_STORAGE_KEY)
                    if (rawDevice == null) {
                        return null
                    }
                    return decodeSavedDevice(rawDevice)
                }
                 catch (error: Throwable) {
                    console.error("获取保存设备失败:", error, " at pages/index/index.uvue:410")
                }
                return null
            }
            val clearSavedSelectedDevice = fun(){
                try {
                    uni_removeStorageSync(SELECTED_DEVICE_STORAGE_KEY)
                    console.log("清除保存设备成功", " at pages/index/index.uvue:419")
                }
                 catch (error: Throwable) {
                    console.error("清除保存设备失败:", error, " at pages/index/index.uvue:421")
                }
            }
            val saveSelectedDeviceIndex = fun(index: Number){
                try {
                    uni_setStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY, index)
                }
                 catch (error: Throwable) {
                    console.error("保存选中设备索引失败:", error, " at pages/index/index.uvue:430")
                }
            }
            val getSavedSelectedDeviceIndex = fun(): Number? {
                try {
                    val savedIndex = uni_getStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY)
                    if (savedIndex != null && savedIndex.toString() != "") {
                        val index = parseInt(savedIndex.toString())
                        return if (isNaN(index) || index < 0) {
                            null
                        } else {
                            index
                        }
                    }
                }
                 catch (error: Throwable) {
                    console.error("获取保存设备索引失败:", error, " at pages/index/index.uvue:443")
                }
                return null
            }
            val clearSavedSelectedDeviceIndex = fun(){
                try {
                    uni_removeStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY)
                }
                 catch (error: Throwable) {
                    console.error("清除保存设备索引失败:", error, " at pages/index/index.uvue:453")
                }
            }
            val handlePicker = fun(){
                if (deviceList.value.length == 0) {
                    showAppToast(ShowToastOptions(title = "暂无车辆数据", icon = "none"))
                    return
                }
                pickerKey.value++
                val savedIndex = getSavedSelectedDeviceIndex()
                if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
                    pickerDefaultIndex.value = _uA(
                        savedIndex
                    )
                } else {
                    val currentIndex = deviceList.value.findIndex(fun(device): Boolean {
                        return device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value
                    }
                    )
                    if (currentIndex != -1) {
                        pickerDefaultIndex.value = _uA(
                            currentIndex
                        )
                    } else {
                        pickerDefaultIndex.value = _uA(
                            0
                        )
                    }
                }
                nextTick(fun(){
                    showPicker.value = true
                }
                )
            }
            val createMarker = fun(id: Number, lat: Number, lng: Number, type: String, title: String?): Marker {
                val isOnline = currentCarConnectionStatus.value == "online"
                val callout = MapMarkerCallout(content = if (isTruthy(title)) {
                    title
                } else {
                    "爱车位置"
                }
                , color = if (isOnline) {
                    "#ffffff"
                } else {
                    "#999999"
                }
                , borderRadius = 6, bgColor = if (isOnline) {
                    "#07C160"
                } else {
                    "#CCCCCC"
                }
                , padding = 4, fontSize = 12, display = "ALWAYS")
                return Marker(id = id, latitude = lat, longitude = lng, iconPath = getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value), width = 30, height = 30, anchor = Anchor(x = 0.5, y = 0.5), callout = callout)
            }
            val loadDeviceDetail = fun(deviceId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getDeviceDetail(deviceId))
                            val detail = res.data
                            if (detail != null) {
                                val deviceStatus = detail.getJSON("deviceStatus")
                                deviceDetail.value = DeviceDetailState(deviceStatus = DeviceStatus(batteryPercent = deviceStatus?.getNumber("batteryPercent", 0) ?: 0, voltage = deviceStatus?.getNumber("voltage", 0) ?: 0, signalStrength = deviceStatus?.getNumber("signalStrength", 0) ?: 0), connectionStatus = detail.getString("connectionStatus", "offline"), lastUpdateTime = detail.getString("lastUpdateTime", ""))
                                val updateTime = detail.getString("lastUpdateTime", "")
                                if (updateTime != "") {
                                    val date = Date(updateTime)
                                    lastUpdateTime.value = "" + date.getHours().toString(10).padStart(2, "0") + ":" + date.getMinutes().toString(10).padStart(2, "0") + ":" + date.getSeconds().toString(10).padStart(2, "0")
                                }
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载设备详情失败", error, " at pages/index/index.uvue:556")
                        }
                })
            }
            val trackPosInfo = ref(_uO() as Any)
            val tripData = ref(_uA<UTSJSONObject>())
            val totalMileage = ref(0)
            val averageSpeed = ref(0)
            val processTripData = fun(data: UTSJSONObject): Unit {
                val trips = data.getArray<UTSJSONObject>("trips")
                if (trips != null && trips.length > 0) {
                    tripData.value = trips
                    var totalDistance: Number = 0
                    var totalDuration: Number = 0
                    var totalAvgSpeed: Number = 0
                    trips.forEach(fun(trip: UTSJSONObject): Unit {
                        totalDistance += trip.getNumber("distance", 0)
                        totalDuration += trip.getNumber("duration", 0)
                        totalAvgSpeed += trip.getNumber("averageSpeed", 0)
                    })
                    totalMileage.value = totalDistance
                    averageSpeed.value = totalAvgSpeed / trips.length
                } else {
                    tripData.value = _uA()
                    totalMileage.value = 0
                    averageSpeed.value = 0
                }
            }
            val loadTrackPos = fun(data: UTSJSONObject): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        try {
                            val res = await(getTrackPos(data))
                            if (res.code == 401) {
                                showAppToast(ShowToastOptions(title = "登录过期，请重新登录", icon = "none", duration = 2000))
                                uni_removeStorageSync("token")
                                uni_reLaunch(ReLaunchOptions(url = "/pages/index/index"))
                                return@w1
                            }
                            val trackData = res.data
                            if (trackData != null) {
                                processTripData(trackData)
                            }
                            uni_hideLoading(null)
                        }
                         catch (error: Throwable) {
                            console.error("加载轨迹失败", error, " at pages/index/index.uvue:612")
                        }
                })
            }
            val devicePosInfo = ref<UTSJSONObject?>(null)
            val devicePositionUpdateTime = computed<String>(fun(): String {
                val position = devicePosInfo.value
                return if (position != null) {
                    position.getString("positionUpdateTime", "暂无位置")
                } else {
                    "暂无位置"
                }
            }
            )
            val loadDevicePos = fun(data: UTSJSONObject): UTSPromise<Boolean> {
                return wrapUTSPromise(suspend w1@{
                        try {
                            val res = await(getDevicePos(data))
                            if (res.code == 0 && res.data != null && res.data.length > 0) {
                                val position = res.data[0]
                                devicePosInfo.value = position
                                val lat = position.getNumber("latitude", 0)
                                val lng = position.getNumber("longitude", 0)
                                if (isNaN(lat) || isNaN(lng)) {
                                    console.error("经纬度格式错误", position.getString("latitude", ""), position.getString("longitude", ""), " at pages/index/index.uvue:633")
                                    showAppToast(ShowToastOptions(title = "定位数据异常", icon = "none"))
                                    return@w1 false
                                }
                                val convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                                center.latitude = convertedCoord.lat
                                center.longitude = convertedCoord.lng
                                isMapReady.value = true
                                await(delay(100))
                                val nextMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarName.value)
                                markers.value = _uA(
                                    nextMarker
                                )
                                console.log("标记点更新完成", " at pages/index/index.uvue:659")
                                return@w1 true
                            } else {
                                console.warn("获取设备位置失败", " at pages/index/index.uvue:662")
                                isMapReady.value = false
                                showAppToast(ShowToastOptions(title = "获取位置失败", icon = "none"))
                                return@w1 false
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载设备位置失败", error, " at pages/index/index.uvue:671")
                            showAppToast(ShowToastOptions(title = "定位失败，请重试", icon = "none"))
                            return@w1 false
                        }
                })
            }
            val loadDeviceData = fun(device: Device): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        console.log("开始加载设备数据:", device, " at pages/index/index.uvue:682")
                        try {
                            await(loadDeviceDetail(device.deviceId))
                            await(loadDevicePos(_uO("deviceId" to device.deviceId, "deviceids" to if (device.imei != "") {
                                device.imei
                            } else {
                                device.value
                            }
                            )))
                            await(loadTrackPos(_uO("imei" to if (device.imei != "") {
                                device.imei
                            } else {
                                device.value
                            }
                            , "startTime" to formatTimes(todayZero), "endTime" to formatTimes(nowTime), "minParkTime" to 120, "withStop" to false, "withPos" to false, "withTrip" to true)))
                            showAppToast(ShowToastOptions(title = "切换成功", icon = "none"))
                        }
                         catch (error: Throwable) {
                            console.error("切换车辆失败", error, " at pages/index/index.uvue:703")
                            showAppToast(ShowToastOptions(title = "切换失败，请重试", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val handleConfirm = fun(e: UTSJSONObject){
                showPicker.value = false
                val indexs = e.getArray<Number>("indexs")
                var selectedIndex = if (indexs != null && indexs.length > 0) {
                    indexs[0]
                } else {
                    -1
                }
                if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
                    console.warn("无法解析选中的索引，使用当前设备", " at pages/index/index.uvue:725")
                    val currentIndex = deviceList.value.findIndex(fun(device): Boolean {
                        return device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value
                    }
                    )
                    if (currentIndex != -1) {
                        selectedIndex = currentIndex
                        console.log("使用当前设备索引:", selectedIndex, " at pages/index/index.uvue:731")
                    } else {
                        selectedIndex = 0
                        console.log("使用默认索引: 0", " at pages/index/index.uvue:734")
                    }
                }
                val selectedDevice = deviceList.value[selectedIndex]
                if (!(selectedDevice != null)) {
                    showAppToast(ShowToastOptions(title = "选择设备失败", icon = "none"))
                    return
                }
                if (selectedDevice.imei == currentCarImei.value && selectedDevice.deviceId == currentCarDeviceId.value) {
                    console.log("选择的设备与当前设备相同，不重复加载", " at pages/index/index.uvue:749")
                    return
                }
                val deviceName = if (selectedDevice.deviceName != "") {
                    selectedDevice.deviceName
                } else {
                    if (selectedDevice.name != "") {
                        selectedDevice.name
                    } else {
                        "未命名设备"
                    }
                }
                currentCarName.value = deviceName
                currentCarImei.value = if (selectedDevice.imei != "") {
                    selectedDevice.imei
                } else {
                    selectedDevice.value
                }
                currentCarDeptId.value = selectedDevice.deptId
                currentCarDeviceId.value = selectedDevice.deviceId
                currentCarIccId.value = selectedDevice.iccid
                currentCarSimMerchant.value = selectedDevice.simMerchant
                currentCarConnectionStatus.value = selectedDevice.connectionStatus
                currentCarCarType.value = selectedDevice.carType
                currentCarPlateNo.value = selectedDevice.plateNo
                center.latitude = selectedDevice.latitude
                center.longitude = selectedDevice.longitude
                if (selectedIndex != -1) {
                    saveSelectedDeviceIndex(selectedIndex)
                    pickerDefaultIndex.value = _uA(
                        selectedIndex
                    )
                }
                saveSelectedDevice(selectedDevice)
                uni_showLoading(ShowLoadingOptions(title = "加载车辆数据...", mask = true))
                loadDeviceData(selectedDevice)
            }
            val loadDeviceList = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getUserDeviceList(_uO("pageSize" to 1000)))
                            val code = res.code
                            val data = res.data
                            val list = data.list
                            if (code == 0 && list != null && list.length > 0) {
                                userDeviceList.value = list
                                deviceList.value = list.map(fun(item: UTSJSONObject): Device {
                                    val imei = item.getString("imei", "")
                                    val rawDeviceName = item.getString("deviceName", "")
                                    val deviceName = if (rawDeviceName != "") {
                                        rawDeviceName
                                    } else {
                                        if (imei != "") {
                                            imei
                                        } else {
                                            "未命名设备"
                                        }
                                    }
                                    return Device(name = deviceName, deviceName = deviceName, value = imei, imei = imei, deptId = item.getString("companyId", ""), deviceId = item.getString("deviceId", ""), iccid = item.getString("iccid", ""), simMerchant = item.getString("simMerchant", ""), connectionStatus = item.getString("connectionStatus", ""), carType = item.getString("carType", ""), plateNo = item.getString("plateNo", ""), latitude = item.getNumber("latitude", 0), longitude = item.getNumber("longitude", 0))
                                })
                                val savedDevice = getSavedSelectedDevice()
                                val savedIndex = getSavedSelectedDeviceIndex()
                                var selectedDevice: Device? = null
                                var selectedIdx: Number = -1
                                if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
                                    selectedDevice = deviceList.value[savedIndex]
                                    selectedIdx = savedIndex
                                }
                                if (selectedDevice == null && savedDevice != null && savedDevice.imei != "") {
                                    selectedDevice = deviceList.value.find(fun(device): Boolean {
                                        return device.imei == savedDevice.imei || device.value == savedDevice.imei
                                    }
                                    )
                                    if (isTruthy(selectedDevice)) {
                                        selectedIdx = deviceList.value.indexOf(selectedDevice)
                                    } else {
                                        clearSavedSelectedDevice()
                                        clearSavedSelectedDeviceIndex()
                                    }
                                }
                                if (!isTruthy(selectedDevice) && deviceList.value.length > 0) {
                                    selectedDevice = deviceList.value[0]
                                    selectedIdx = 0
                                    saveSelectedDevice(selectedDevice)
                                    saveSelectedDeviceIndex(0)
                                    console.log("使用第一个设备作为默认:", selectedDevice?.deviceName, " at pages/index/index.uvue:852")
                                }
                                if (selectedDevice != null) {
                                    val device = selectedDevice
                                    val deviceName = if (device.deviceName != "") {
                                        device.deviceName
                                    } else {
                                        if (device.name != "") {
                                            device.name
                                        } else {
                                            "未命名设备"
                                        }
                                    }
                                    currentCarName.value = deviceName
                                    currentCarImei.value = if (device.imei != "") {
                                        device.imei
                                    } else {
                                        device.value
                                    }
                                    currentCarDeptId.value = device.deptId
                                    currentCarDeviceId.value = device.deviceId
                                    currentCarIccId.value = device.iccid
                                    currentCarSimMerchant.value = device.simMerchant
                                    currentCarConnectionStatus.value = device.connectionStatus
                                    currentCarCarType.value = device.carType
                                    currentCarPlateNo.value = device.plateNo
                                    center.latitude = device.latitude
                                    center.longitude = device.longitude
                                    if (selectedIdx != -1) {
                                        pickerDefaultIndex.value = _uA(
                                            selectedIdx
                                        )
                                    }
                                    await(loadDeviceDetail(device.deviceId))
                                    await(loadDevicePos(_uO("deviceId" to device.deviceId, "deviceids" to if (device.imei != "") {
                                        device.imei
                                    } else {
                                        device.value
                                    }
                                    )))
                                    await(loadTrackPos(_uO("imei" to if (device.imei != "") {
                                        device.imei
                                    } else {
                                        device.value
                                    }
                                    , "startTime" to formatTimes(todayZero), "endTime" to formatTimes(nowTime), "minParkTime" to 120, "withStop" to false, "withPos" to false, "withTrip" to true)))
                                }
                            } else {
                                showAppToast(ShowToastOptions(title = "暂无车辆数据", icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载车辆列表失败", error, " at pages/index/index.uvue:898")
                            showAppToast(ShowToastOptions(title = "加载失败，请下拉重试", icon = "none"))
                        }
                })
            }
            val totalTrips = computed(fun(): Number {
                return tripData.value.length
            }
            )
            val refreshLocation = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!(currentCarDeviceId.value != "")) {
                            showAppToast(ShowToastOptions(title = "请先选择车辆", icon = "none"))
                            return@w1
                        }
                        uni_showLoading(ShowLoadingOptions(title = "刷新位置中...", mask = true))
                        try {
                            await(loadDeviceList())
                        }
                         catch (error: Throwable) {
                            console.error("刷新位置失败", error, " at pages/index/index.uvue:927")
                            showAppToast(ShowToastOptions(title = "刷新失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            fun gen_checkToken_fn(): Boolean {
                val token = uni_getStorageSync("token")
                return token != null && token.toString() != ""
            }
            val checkToken = ::gen_checkToken_fn
            fun gen_isLogin_fn(): Boolean {
                if (!checkToken()) {
                    showAppToast(ShowToastOptions(title = "请先登录", icon = "none"))
                    return false
                }
                return true
            }
            val isLogin = ::gen_isLogin_fn
            val toRecordDetail = fun(){
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/playBack/playBack?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&lat=" + center.latitude + "&lng=" + center.longitude, fail = fun(err){
                    if (err.errMsg.indexOf("locked") < 0) {
                        console.error("跳转轨迹详情失败:", err, " at pages/index/index.uvue:959")
                    }
                }
                ))
            }
            val toDeviceList = fun(){
                console.log("toDeviceList", " at pages/index/index.uvue:966")
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/deviceList/deviceList"))
            }
            val toDeviceDetail = fun(e: Any){
                if (!isLogin()) {
                    return
                }
                if (!(currentCarImei.value != "") || !(currentCarDeptId.value != "") || !(currentCarDeviceId.value != "")) {
                    showAppToast(ShowToastOptions(title = "请先选择车辆", icon = "none"))
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/carInfoDetail/carInfoDetail?imei=" + currentCarImei.value + "&deptId=" + currentCarDeptId.value + "&deviceId=" + currentCarDeviceId.value))
            }
            val toAdd = fun(){
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/addCar/addCar", fail = fun(err){
                    if (err.errMsg.indexOf("locked") < 0) {
                        console.error("跳转添加设备失败:", err, " at pages/index/index.uvue:994")
                    }
                }
                ))
            }
            val toMsgCenter = fun(){
                if (!isLogin()) {
                    return
                }
                uni_switchTab(SwitchTabOptions(url = "/pages/message/message"))
            }
            val toFindCar = fun(){
                if (!isLogin()) {
                    return
                }
                uni_openLocation(OpenLocationOptions(latitude = center.latitude, longitude = center.longitude, name = currentCarName.value, scale = 18, success = fun(_){
                    showAppToast(ShowToastOptions(title = "成功调起地图", icon = "none"))
                }
                , fail = fun(err){
                    showAppToast(ShowToastOptions(title = "调起地图失败", icon = "none"))
                    console.error("调起地图失败:", err, " at pages/index/index.uvue:1026")
                }
                ))
            }
            val toFence = fun(){
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/geofencing/geofencing?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&deptId=" + currentCarDeptId.value + "&deviceName=" + currentCarName.value))
            }
            val contactCustomerService = fun(){
                showAppToast(ShowToastOptions(title = "请在微信小程序中联系客服", icon = "none"))
            }
            val needRefresh = ref(false)
            val toPay = fun(reassignedIccid: String, simMerchant: String){
                var iccid = reassignedIccid
                if (!isLogin()) {
                    return
                }
                if (simMerchant.toLowerCase() == "zddx") {
                    iccid = iccid.substring(0, iccid.length - 1)
                }
                needRefresh.value = true
                console.log("iccid", iccid, " at pages/index/index.uvue:1089")
                needRefresh.value = false
                showAppToast(ShowToastOptions(title = "请在微信小程序中完成充值", icon = "none", duration = 2000, mask = true))
            }
            val gotoLogin = fun(){
                uni_navigateTo(NavigateToOptions(url = "/pages/login/login"))
            }
            fun gen_unbindCurrentDevice_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val result = await(delDevice(currentCarImei.value))
                        if (result.code == 0) {
                            showAppToast(ShowToastOptions(title = "解绑成功", icon = "none"))
                            clearSavedSelectedDevice()
                            clearSavedSelectedDeviceIndex()
                        } else {
                            showAppToast(ShowToastOptions(title = "解绑失败", icon = "error"))
                        }
                        await(loadDeviceList())
                })
            }
            val unbindCurrentDevice = ::gen_unbindCurrentDevice_fn
            val unbindDevice = fun(): Unit {
                if (!isLogin()) {
                    return
                }
                uni_showModal(ShowModalOptions(title = "解绑车辆", content = "确定解绑当前车辆吗？", success = fun(res: ShowModalSuccess): Unit {
                    if (res.confirm) {
                        unbindCurrentDevice()
                    }
                }
                ))
            }
            onShow(fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (checkToken()) {
                            val needRefresh = uni_getStorageSync("needRefreshHome")
                            if (isTruthy(needRefresh)) {
                                await(loadDeviceList())
                                uni_removeStorageSync("needRefreshHome")
                            }
                        }
                })
            }
            )
            val handleReload = fun(){
                if (!isLogin()) {
                    return
                }
                loadDeviceList()
            }
            onLoad(fun(_options){
                uni_hideTabBar(null)
                initDimensions()
                if (checkToken()) {
                    loadDeviceList()
                }
            }
            )
            return fun(): Any? {
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_line_progress = resolveEasyComponent("i-line-progress", GenUniModulesIUiXComponentsILineProgressILineProgressClass)
                val _component_map = resolveComponent("map")
                val _component_i_picker = resolveEasyComponent("i-picker", GenUniModulesIUiXComponentsIPickerIPickerClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("scroll-view", _uM("class" to "container", "scroll-y" to "true", "show-scrollbar" to false), _uA(
                        _cE("view", _uM("class" to "page-bg"), _uA(
                            _cE("view", _uM("class" to "top", "style" to _nS(_uM("paddingTop" to (statusBarHeight.value + 10 + "px")))), _uA(
                                _cE("view", _uM("class" to "device-car"), _uA(
                                    _cE("view", _uM("class" to "current-car"), _uA(
                                        if (isTrue(checkToken())) {
                                            _cE("view", _uM("key" to 0), _uA(
                                                if (isTrue(currentCarName.value)) {
                                                    _cE("text", _uM("key" to 0, "class" to "car-id", "onClick" to handlePicker), _tD(currentCarName.value ?: "加载中…"), 1)
                                                } else {
                                                    _cE("text", _uM("key" to 1, "class" to "car-id"), "暂无设备")
                                                }
                                            ))
                                        } else {
                                            _cE("text", _uM("key" to 1, "class" to "login", "onClick" to gotoLogin), "点击登录!")
                                        }
                                        ,
                                        _cV(_component_i_icon, _uM("name" to "/static/right-bottom.png", "fontSize" to "7"))
                                    )),
                                    _cE("view", _uM("class" to "nav-tools"), _uA(
                                        _cC("v-if", true),
                                        _cV(_component_i_icon, _uM("name" to "/static/reload.png", "fontSize" to "18", "onClick" to handleReload)),
                                        _cV(_component_i_icon, _uM("class" to "nav-tool-spacing", "name" to "/static/maps.png", "fontSize" to "20", "onClick" to toDeviceList)),
                                        _cV(_component_i_icon, _uM("class" to "nav-tool-spacing", "name" to "/static/addNew.png", "fontSize" to "18", "onClick" to toAdd))
                                    ))
                                )),
                                if (isTrue(if (safeDeviceDetail.value.deviceStatus.batteryPercent != 0) {
                                    safeDeviceDetail.value.deviceStatus.voltage
                                } else {
                                    safeDeviceDetail.value.deviceStatus.batteryPercent
                                }
                                )) {
                                    _cE("view", _uM("key" to 0, "class" to "device-info"), _uA(
                                        if (isTrue(safeDeviceDetail.value.deviceStatus.batteryPercent)) {
                                            _cV(_component_i_line_progress, _uM("key" to 0, "percent" to safeDeviceDetail.value.deviceStatus.batteryPercent), null, 8, _uA(
                                                "percent"
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(safeDeviceDetail.value.deviceStatus.batteryPercent)) {
                                            _cE("view", _uM("key" to 1, "class" to "info"), "电量: " + _tD(safeDeviceDetail.value.deviceStatus.batteryPercent) + "%", 1)
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(safeDeviceDetail.value.deviceStatus.voltage)) {
                                            _cE("view", _uM("key" to 2, "class" to "info"), "电压: " + _tD(safeDeviceDetail.value.deviceStatus.voltage) + "V", 1)
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                                ,
                                _cE("view", _uM("class" to "banner"), _uA(
                                    _cE("image", _uM("src" to `default`, "mode" to "aspectFit", "class" to "banner-image"))
                                )),
                                _cE("view", _uM("class" to "car-state"), _uA(
                                    _cE("view", _uM("class" to "state-item"), _uA(
                                        _cE("text", _uM("class" to "state-label"), "设备状态"),
                                        _cE("text", _uM("class" to _nC(_uA(
                                            "state-value",
                                            _uM("online" to (safeDeviceDetail.value.connectionStatus == "online"))
                                        ))), _tD(if (safeDeviceDetail.value.connectionStatus == "online") {
                                            "在线"
                                        } else {
                                            "离线"
                                        }
                                        ), 3)
                                    )),
                                    _cE("view", _uM("class" to "state-item"), _uA(
                                        _cE("text", _uM("class" to "state-label"), "最后定位"),
                                        _cE("text", _uM("class" to "state-value"), _tD(devicePositionUpdateTime.value), 1)
                                    ))
                                ))
                            ), 4),
                            _cE("view", _uM("class" to "content"), _uA(
                                _cE("view", _uM("class" to "map-box"), _uA(
                                    _cE("view", _uM("class" to "map-header"), _uA(
                                        _cE("text", _uM("class" to "map-title"), "车辆定位"),
                                        _cE("text", _uM("class" to "map-refresh", "onClick" to refreshLocation), "刷新位置")
                                    )),
                                    _cE("view", _uM("class" to "map-container"), _uA(
                                        if (isTrue(isMapReady.value)) {
                                            _cV(_component_map, _uM("key" to 0, "id" to "myMap", "latitude" to center.latitude, "longitude" to center.longitude, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to true, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to false, "markers" to markers.value), null, 8, _uA(
                                                "latitude",
                                                "longitude",
                                                "scale",
                                                "style",
                                                "markers"
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                )),
                                _cE("view", _uM("class" to "mile-record"), _uA(
                                    _cE("view", _uM("class" to "record-header"), _uA(
                                        _cE("text", _uM("class" to "record-title"), "轨迹记录"),
                                        _cE("text", _uM("class" to "record-desc", "onClick" to toRecordDetail), "更多轨迹")
                                    )),
                                    _cE("view", _uM("class" to "ring-container"), _uA(
                                        _cE("view", _uM("class" to "ring-item"), _uA(
                                            _cE("view", _uM("class" to "ring-bg green"), _uA(
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--top-left"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--track"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--top-right"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--bottom-right"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--bottom-left"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                ))
                                            )),
                                            _cE("view", _uM("class" to "ring-text"), _uA(
                                                _cE("text", _uM("class" to "unit"), "条"),
                                                _cE("text", _uM("class" to "num"), _tD(totalTrips.value), 1),
                                                _cE("text", _uM("class" to "label"), "今日轨迹")
                                            ))
                                        )),
                                        _cE("view", _uM("class" to "ring-item"), _uA(
                                            _cE("view", _uM("class" to "ring-bg orange"), _uA(
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--top-left"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--track"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--top-right"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--bottom-right"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                )),
                                                _cE("view", _uM("class" to "ring-quarter ring-quarter--bottom-left"), _uA(
                                                    _cE("view", _uM("class" to "ring-stroke ring-stroke--active"))
                                                ))
                                            )),
                                            _cE("view", _uM("class" to "ring-text"), _uA(
                                                _cE("text", _uM("class" to "unit"), "km"),
                                                _cE("text", _uM("class" to "num"), _tD((totalMileage.value / 1000).toFixed(2)), 1),
                                                _cE("text", _uM("class" to "label"), "今日里程")
                                            ))
                                        ))
                                    ))
                                )),
                                _cE("view", _uM("class" to "device-list"), _uA(
                                    _cE("view", _uM("class" to "device-item", "onClick" to toDeviceDetail), _uA(
                                        _cE("view", _uM("class" to "item-label"), _uA(
                                            _cE("view", _uM("class" to "icon icon-device"), _uA(
                                                _cE("image", _uM("src" to default__1, "mode" to "aspectFill", "class" to "icon-image"))
                                            )),
                                            _cE("view", _uM("class" to "item-info"), _uA(
                                                _cE("text", _uM("class" to "item-title"), "设备详情"),
                                                _cE("text", _uM("class" to "item-desc"), "查看设备更多详情")
                                            ))
                                        )),
                                        _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                    )),
                                    _cE("view", _uM("class" to "device-item", "onClick" to toFindCar), _uA(
                                        _cE("view", _uM("class" to "item-label"), _uA(
                                            _cE("view", _uM("class" to "icon icon-car"), _uA(
                                                _cE("image", _uM("src" to default__2, "mode" to "aspectFill", "class" to "icon-image"))
                                            )),
                                            _cE("view", _uM("class" to "item-info"), _uA(
                                                _cE("text", _uM("class" to "item-title"), "一键寻车"),
                                                _cE("text", _uM("class" to "item-desc"), "点击立即寻找车辆位置")
                                            ))
                                        )),
                                        _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                    )),
                                    _cE("view", _uM("class" to "device-item", "onClick" to toFence), _uA(
                                        _cE("view", _uM("class" to "item-label"), _uA(
                                            _cE("view", _uM("class" to "icon icon-fence"), _uA(
                                                _cE("image", _uM("src" to default__3, "mode" to "aspectFill", "class" to "icon-image"))
                                            )),
                                            _cE("view", _uM("class" to "item-info"), _uA(
                                                _cE("text", _uM("class" to "item-title"), "电子围栏"),
                                                _cE("text", _uM("class" to "item-desc"), "点击去设置或者查看电子围栏")
                                            ))
                                        )),
                                        _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                    ))
                                )),
                                _cE("view", _uM("class" to "service"), _uA(
                                    _cE("text", _uM("class" to "service-header"), "服务中心"),
                                    _cE("view", _uM("class" to "service-content"), _uA(
                                        _cE("view", _uM("class" to "service-item", "onClick" to toMsgCenter), _uA(
                                            _cE("image", _uM("src" to default__4, "mode" to "aspectFill", "class" to "icon-image")),
                                            _cE("text", _uM("class" to "item-title"), "警报消息")
                                        )),
                                        _cE("view", _uM("class" to "service-item", "onClick" to fun(){
                                            toPay(currentCarIccId.value, currentCarSimMerchant.value)
                                        }
                                        ), _uA(
                                            _cE("image", _uM("src" to default__5, "mode" to "aspectFill", "class" to "icon-image")),
                                            _cE("text", _uM("class" to "item-title"), "一键续费")
                                        ), 8, _uA(
                                            "onClick"
                                        )),
                                        _cE("view", _uM("class" to "service-item", "onClick" to contactCustomerService), _uA(
                                            _cE("image", _uM("src" to default__6, "mode" to "aspectFill", "class" to "icon-image")),
                                            _cE("text", _uM("class" to "item-title"), "在线客服")
                                        )),
                                        _cE("view", _uM("class" to "service-item", "onClick" to unbindDevice), _uA(
                                            _cE("image", _uM("src" to default__7, "mode" to "aspectFill", "class" to "icon-image")),
                                            _cE("text", _uM("class" to "item-title", "style" to _nS(_uM("color" to "#d81e06"))), "删除设备", 4)
                                        ))
                                    ))
                                ))
                            ))
                        )),
                        if (isTrue(showPicker.value)) {
                            _cV(_component_i_picker, _uM("key" to pickerKey.value, "show" to showPicker.value, "columns" to pickerColumns.value, "defaultIndex" to pickerDefaultIndex.value, "visibleItemCount" to 5, "onConfirm" to handleConfirm, "onCancel" to closePicker, "onClose" to closePicker), null, 8, _uA(
                                "show",
                                "columns",
                                "defaultIndex"
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#E6F9E6", "backgroundImage" to "linear-gradient(to right, #E6F9E6, #E0F0FF)")), "page-bg" to _uM(".container " to _uM("paddingTop" to 0, "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx")), "loading-container" to _uM(".container .page-bg " to _uM("position" to "fixed", "top" to "50%", "left" to "50%", "transform" to "translate(-50%, -50%)", "display" to "flex", "flexDirection" to "column", "alignItems" to "center", "zIndex" to 999)), "loading-text" to _uM(".container .page-bg .loading-container " to _uM("marginTop" to "20rpx", "fontSize" to "28rpx", "color" to "#666666")), "device-car" to _uM(".container .page-bg .top " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "current-car" to _uM(".container .page-bg .top .device-car " to _uM("position" to "relative", "display" to "flex", "flexDirection" to "row", "alignItems" to "flex-end")), "car-id" to _uM(".container .page-bg .top .device-car .current-car " to _uM("fontSize" to "36rpx", "fontWeight" to "bold", "color" to "#000000", "textAlign" to "center", "position" to "relative")), "login" to _uM(".container .page-bg .top .device-car .current-car " to _uM("fontSize" to "36rpx", "fontWeight" to "bold", "color" to "#000000", "textAlign" to "center", "paddingRight" to "30rpx")), "nav-tools" to _uM(".container .page-bg .top .device-car " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "nav-tool-spacing" to _uM(".container .page-bg .top .device-car .nav-tools " to _uM("marginLeft" to "30rpx")), "exit" to _uM(".container .page-bg .top .device-car .nav-tools " to _uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "backgroundColor" to "rgba(0,0,0,0.05)", "transitionProperty" to "all", "transitionDuration" to "0.2s", "transitionTimingFunction" to "ease", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%")), "exit-icon" to _uM(".container .page-bg .top .device-car .nav-tools .exit " to _uM("width" to "40rpx", "height" to "40rpx")), "device-info" to _uM(".container .page-bg .top " to _uM("display" to "flex", "flexDirection" to "column", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "width" to "50%")), "info" to _uM(".container .page-bg .top .device-info .info+" to _uM("marginTop" to "16rpx"), ".container .page-bg .top .device-info " to _uM("fontSize" to "26rpx", "color" to "#333333")), "banner-image" to _uM(".container .page-bg .top " to _uM("width" to "100%", "height" to "300rpx")), "car-state" to _uM(".container .page-bg .top " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx")), "state-item" to _uM(".container .page-bg .top .car-state .state-item+" to _uM("marginLeft" to "20rpx"), ".container .page-bg .top .car-state " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "flexDirection" to "column", "alignItems" to "center", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "30rpx", "borderTopRightRadius" to "30rpx", "borderBottomRightRadius" to "30rpx", "borderBottomLeftRadius" to "30rpx")), "state-label" to _uM(".container .page-bg .top .car-state .state-item " to _uM("fontSize" to "24rpx", "color" to "#999999")), "state-value" to _uM(".container .page-bg .top .car-state .state-item " to _uM("marginTop" to "12rpx", "fontSize" to "25rpx", "fontWeight" to "bold", "color" to "#333333"), ".container .page-bg .top .car-state .state-item .online" to _uM("color" to "#07C160")), "map-box" to _uM(".container .page-bg .content " to _uM("width" to "100%", "height" to "400rpx", "marginTop" to "10rpx", "marginRight" to 0, "marginBottom" to "40rpx", "marginLeft" to 0, "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "display" to "flex", "flexDirection" to "column", "overflow" to "hidden", "boxShadow" to "0 4rpx 20rpx rgba(0, 0, 0, 0.08)")), "map-header" to _uM(".container .page-bg .content .map-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")), "map-title" to _uM(".container .page-bg .content .map-box .map-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333")), "map-refresh" to _uM(".container .page-bg .content .map-box .map-header " to _uM("fontSize" to "26rpx", "color" to "#07C160", "paddingTop" to "8rpx", "paddingRight" to "16rpx", "paddingBottom" to "8rpx", "paddingLeft" to "16rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f9f0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx")), "map-container" to _uM(".container .page-bg .content .map-box " to _uM("height" to "300rpx")), "mile-record" to _uM(".container .page-bg .content " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "display" to "flex", "flexDirection" to "column", "overflow" to "hidden", "boxShadow" to "0 4rpx 20rpx rgba(0, 0, 0, 0.08)")), "record-header" to _uM(".container .page-bg .content .mile-record " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")), "record-title" to _uM(".container .page-bg .content .mile-record .record-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333")), "record-desc" to _uM(".container .page-bg .content .mile-record .record-header " to _uM("fontSize" to "26rpx", "color" to "#07C160", "paddingTop" to "8rpx", "paddingRight" to "16rpx", "paddingBottom" to "8rpx", "paddingLeft" to "16rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f9f0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx")), "ring-container" to _uM(".container .page-bg .content .mile-record " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-around", "paddingTop" to "30rpx", "paddingRight" to "20rpx", "paddingBottom" to "30rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#edf7ff", "borderTopLeftRadius" to "24rpx", "borderTopRightRadius" to "24rpx", "borderBottomRightRadius" to "24rpx", "borderBottomLeftRadius" to "24rpx", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx")), "ring-item" to _uM(".container .page-bg .content .mile-record " to _uM("position" to "relative", "width" to "250rpx", "height" to "250rpx", "display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "ring-bg" to _uM(".container .page-bg .content .mile-record " to _uM("position" to "absolute", "width" to "250rpx", "height" to "250rpx", "zIndex" to 2)), "ring-quarter" to _uM(".container .page-bg .content .mile-record " to _uM("position" to "absolute", "width" to "125rpx", "height" to "125rpx", "overflow" to "hidden")), "ring-quarter--top-left" to _uM(".container .page-bg .content .mile-record " to _uM("top" to 0, "left" to 0)), "ring-quarter--top-right" to _uM(".container .page-bg .content .mile-record " to _uM("top" to 0, "right" to 0)), "ring-quarter--bottom-right" to _uM(".container .page-bg .content .mile-record " to _uM("right" to 0, "bottom" to 0)), "ring-quarter--bottom-left" to _uM(".container .page-bg .content .mile-record " to _uM("bottom" to 0, "left" to 0)), "ring-stroke" to _uM(".container .page-bg .content .mile-record " to _uM("position" to "absolute", "width" to "250rpx", "height" to "250rpx", "boxSizing" to "border-box", "borderTopWidth" to "16rpx", "borderRightWidth" to "16rpx", "borderBottomWidth" to "16rpx", "borderLeftWidth" to "16rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999), ".container .page-bg .content .mile-record .ring-quarter--top-left " to _uM("top" to 0, "left" to 0), ".container .page-bg .content .mile-record .ring-quarter--top-right " to _uM("top" to 0, "right" to 0), ".container .page-bg .content .mile-record .ring-quarter--bottom-right " to _uM("right" to 0, "bottom" to 0), ".container .page-bg .content .mile-record .ring-quarter--bottom-left " to _uM("bottom" to 0, "left" to 0)), "ring-stroke--track" to _uM(".container .page-bg .content .mile-record " to _uM("borderTopColor" to "#dceaf3", "borderRightColor" to "#dceaf3", "borderBottomColor" to "#dceaf3", "borderLeftColor" to "#dceaf3")), "ring-stroke--active" to _uM(".container .page-bg .content .mile-record " to _uM("borderTopColor" to "#4cd964", "borderRightColor" to "#4cd964", "borderBottomColor" to "#4cd964", "borderLeftColor" to "#4cd964"), ".container .page-bg .content .mile-record .ring-bg.orange " to _uM("borderTopColor" to "#ff9500", "borderRightColor" to "#ff9500", "borderBottomColor" to "#ff9500", "borderLeftColor" to "#ff9500")), "ring-text" to _uM(".container .page-bg .content .mile-record " to _uM("position" to "relative", "zIndex" to 10)), "num" to _uM(".container .page-bg .content .mile-record " to _uM("fontSize" to "45rpx", "fontWeight" to "bold", "color" to "#333333", "textAlign" to "center")), "unit" to _uM(".container .page-bg .content .mile-record " to _uM("fontSize" to "20rpx", "color" to "#666666", "textAlign" to "right")), "label" to _uM(".container .page-bg .content .mile-record " to _uM("fontSize" to "25rpx", "color" to "#666666", "marginTop" to "12rpx", "textAlign" to "center")), "device-list" to _uM(".container .page-bg .content " to _uM("display" to "flex", "flexDirection" to "column", "marginTop" to "40rpx", "marginRight" to 0, "marginBottom" to "40rpx", "marginLeft" to 0)), "device-item" to _uM(".container .page-bg .content .device-list .device-item+" to _uM("marginTop" to "30rpx"), ".container .page-bg .content .device-list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "item-label" to _uM(".container .page-bg .content .device-list .device-item " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center")), "icon" to _uM(".container .page-bg .content .device-list .device-item .item-label " to _uM("width" to "80rpx", "height" to "80rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "paddingTop" to "18rpx", "paddingRight" to "18rpx", "paddingBottom" to "18rpx", "paddingLeft" to "18rpx"), ".container .page-bg .content .device-list .device-item .item-label .icon-device" to _uM("backgroundColor" to "#f0f9f0"), ".container .page-bg .content .device-list .device-item .item-label .icon-car" to _uM("backgroundColor" to "#f3f8fb"), ".container .page-bg .content .device-list .device-item .item-label .icon-fence" to _uM("backgroundColor" to "#f1f7f4")), "icon-image" to _uM(".container .page-bg .content .device-list .device-item .item-label " to _uM("width" to "45rpx", "height" to "45rpx"), ".container .page-bg .content .service .service-content .service-item " to _uM("width" to "60rpx", "height" to "60rpx")), "item-info" to _uM(".container .page-bg .content .device-list .device-item .item-label " to _uM("marginLeft" to "20rpx")), "item-title" to _uM(".container .page-bg .content .device-list .device-item .item-label .item-info " to _uM("fontSize" to "28rpx", "fontWeight" to "bold", "color" to "#333333"), ".container .page-bg .content .service .service-content .service-item " to _uM("marginTop" to "10rpx", "fontSize" to "25rpx", "color" to "#222222")), "item-desc" to _uM(".container .page-bg .content .device-list .device-item .item-label .item-info " to _uM("color" to "#cccccc", "fontSize" to "24rpx", "marginTop" to "10rpx")), "service" to _uM(".container .page-bg .content " to _uM("display" to "flex", "flexDirection" to "column", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "backgroundColor" to "#ffffff", "marginBottom" to "30rpx")), "service-header" to _uM(".container .page-bg .content .service " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0", "marginBottom" to "30rpx")), "service-content" to _uM(".container .page-bg .content .service " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx")), "service-item" to _uM(".container .page-bg .content .service .service-content " to _uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center")), "@TRANSITION" to _uM("exit" to _uM("property" to "all", "duration" to "0.2s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
