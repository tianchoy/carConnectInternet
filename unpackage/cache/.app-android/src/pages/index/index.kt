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
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.hideTabBar as uni_hideTabBar
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.openCustomerServiceChat as uni_openCustomerServiceChat
import io.dcloud.uniapp.extapi.openLocation as uni_openLocation
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showModal as uni_showModal
import io.dcloud.uniapp.extapi.showToast as uni_showToast
import io.dcloud.uniapp.extapi.switchTab as uni_switchTab
open class GenPagesIndexIndex : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesIndexIndex) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesIndexIndex
            val _cache = __ins.renderCache
            val _getTodayZeroTime = getTodayZeroTime()
            val nowTime = _getTodayZeroTime.nowTime
            val todayZero = _getTodayZeroTime.todayZero
            val center = reactive(_uO("latitude" to 39.90469, "longitude" to 116.40717))
            val userDeviceList = ref(_uA<Any>())
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
            val deviceDetail = ref(_uO("deviceStatus" to _uO("batteryPercent" to 0, "voltage" to 0, "signalStrength" to 0), "connectionStatus" to "offline", "lastUpdateTime" to null))
            val markers = ref(_uA<Any>())
            val lastUpdateTime = ref("--:--:--")
            val STORAGE_KEYS: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("STORAGE_KEYS", "pages/index/index.uvue", 225, 7), "SELECTED_DEVICE" to "selected_device_info", "SELECTED_DEVICE_INDEX" to "selected_device_index")
            val safeDeviceDetail = computed(fun(): UTSJSONObject {
                return _uO("deviceStatus" to _uO("batteryPercent" to ((deviceDetail.value?.get("deviceStatus") as UTSJSONObject)?.get("batteryPercent") ?: 0), "voltage" to ((deviceDetail.value?.get("deviceStatus") as UTSJSONObject)?.get("voltage") ?: 0), "signalStrength" to ((deviceDetail.value?.get("deviceStatus") as UTSJSONObject)?.get("signalStrength") ?: 0)), "connectionStatus" to (deviceDetail.value?.get("connectionStatus") ?: "offline"), "lastUpdateTime" to (deviceDetail.value?.get("lastUpdateTime") ?: null))
            }
            )
            val pickerColumns = computed(fun(): UTSArray<UTSArray<String>> {
                return _uA(
                    deviceList.value.map(fun(device): String {
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
                        val statusText = if (device.connectionStatus === "online") {
                            "在线"
                        } else {
                            "离线"
                        }
                        return "" + displayName + " (" + statusText + ")"
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
            val delay = fun(ms: Number): UTSPromise<*> {
                return UTSPromise(fun(resolve, _reject){
                    return setTimeout(resolve, ms)
                }
                )
            }
            val saveSelectedDevice = fun(device: Device){
                try {
                    val deviceInfo: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("deviceInfo", "pages/index/index.uvue", 269, 15), "name" to if (device.deviceName != "") {
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
                    , "deptId" to device.deptId, "deviceId" to device.deviceId, "iccid" to device.iccid, "simMerchant" to device.simMerchant, "connectionStatus" to device.connectionStatus, "carType" to device.carType, "plateNo" to device.plateNo)
                    uni_setStorageSync(STORAGE_KEYS["SELECTED_DEVICE"], deviceInfo)
                    console.log("保存选中设备成功:", deviceInfo, " at pages/index/index.uvue:282")
                }
                 catch (error: Throwable) {
                    console.error("保存选中设备失败:", error, " at pages/index/index.uvue:284")
                }
            }
            val getSavedSelectedDevice = fun(): Any {
                try {
                    val savedDevice = uni_getStorageSync(STORAGE_KEYS["SELECTED_DEVICE"])
                    if (isTruthy(savedDevice) && isTruthy(savedDevice.imei)) {
                        return savedDevice
                    }
                }
                 catch (error: Throwable) {
                    console.error("获取保存设备失败:", error, " at pages/index/index.uvue:296")
                }
                return null
            }
            val clearSavedSelectedDevice = fun(){
                try {
                    uni_removeStorageSync(STORAGE_KEYS["SELECTED_DEVICE"])
                    console.log("清除保存设备成功", " at pages/index/index.uvue:305")
                }
                 catch (error: Throwable) {
                    console.error("清除保存设备失败:", error, " at pages/index/index.uvue:307")
                }
            }
            val saveSelectedDeviceIndex = fun(index: Number){
                try {
                    uni_setStorageSync(STORAGE_KEYS["SELECTED_DEVICE_INDEX"], index)
                }
                 catch (error: Throwable) {
                    console.error("保存选中设备索引失败:", error, " at pages/index/index.uvue:316")
                }
            }
            val getSavedSelectedDeviceIndex = fun(): Number? {
                try {
                    val savedIndex = uni_getStorageSync(STORAGE_KEYS["SELECTED_DEVICE_INDEX"])
                    if (savedIndex !== undefined && savedIndex != null) {
                        return savedIndex
                    }
                }
                 catch (error: Throwable) {
                    console.error("获取保存设备索引失败:", error, " at pages/index/index.uvue:328")
                }
                return null
            }
            val clearSavedSelectedDeviceIndex = fun(){
                try {
                    uni_removeStorageSync(STORAGE_KEYS["SELECTED_DEVICE_INDEX"])
                }
                 catch (error: Throwable) {
                    console.error("清除保存设备索引失败:", error, " at pages/index/index.uvue:338")
                }
            }
            val handlePicker = fun(){
                if (deviceList.value.length === 0) {
                    uni_showToast(ShowToastOptions(title = "暂无车辆数据", icon = "none"))
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
                        return device.imei === currentCarImei.value || device.deviceId === currentCarDeviceId.value
                    }
                    )
                    if (currentIndex !== -1) {
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
            val handleConfirm = fun(e: Any){
                showPicker.value = false
                var selectedIndex: Number = -1
                if (isTruthy(e) && isTruthy(e.indexs) && UTSArray.isArray(e.indexs) && e.indexs.length > 0) {
                    selectedIndex = e.indexs[0]
                } else if (isTruthy(e) && e.index !== undefined && e.index != null) {
                    selectedIndex = if (UTSAndroid.`typeof`(e.index) === "number") {
                        e.index
                    } else {
                        parseInt(e.index)
                    }
                } else if (isTruthy(e) && isTruthy(e.detail)) {
                    if (isTruthy(e.detail.indexs) && UTSArray.isArray(e.detail.indexs) && e.detail.indexs.length > 0) {
                        selectedIndex = e.detail.indexs[0]
                    } else if (e.detail.index !== undefined) {
                        selectedIndex = e.detail.index
                    }
                } else if (isTruthy(e) && isTruthy(e.value) && UTSAndroid.`typeof`(e.value) === "object") {
                    val text = if (isTruthy(e.value.text)) {
                        e.value.text
                    } else {
                        e.value.value
                    }
                    if (isTruthy(text) && UTSAndroid.`typeof`(text) === "string") {
                        val matchedDevice = deviceList.value.find(fun(device): Boolean {
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
                            val statusText = if (device.connectionStatus === "online") {
                                "在线"
                            } else {
                                "离线"
                            }
                            val fullDisplay = "" + displayName + " (" + statusText + ")"
                            return fullDisplay === text as String
                        }
                        )
                        if (isTruthy(matchedDevice)) {
                            selectedIndex = deviceList.value.indexOf(matchedDevice)
                        }
                    }
                }
                if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
                    console.warn("无法解析选中的索引，使用当前设备", " at pages/index/index.uvue:437")
                    val currentIndex = deviceList.value.findIndex(fun(device): Boolean {
                        return device.imei === currentCarImei.value || device.deviceId === currentCarDeviceId.value
                    }
                    )
                    if (currentIndex !== -1) {
                        selectedIndex = currentIndex
                        console.log("使用当前设备索引:", selectedIndex, " at pages/index/index.uvue:443")
                    } else {
                        selectedIndex = 0
                        console.log("使用默认索引: 0", " at pages/index/index.uvue:446")
                    }
                }
                val selectedDevice = deviceList.value[selectedIndex]
                if (!(selectedDevice != null)) {
                    uni_showToast(ShowToastOptions(title = "选择设备失败", icon = "none"))
                    return
                }
                if (selectedDevice.imei === currentCarImei.value && selectedDevice.deviceId === currentCarDeviceId.value) {
                    console.log("选择的设备与当前设备相同，不重复加载", " at pages/index/index.uvue:461")
                    return
                }
                console.log("最终选中的设备:", selectedDevice, " at pages/index/index.uvue:465")
                console.log("设备名称:", if (selectedDevice.deviceName != "") {
                    selectedDevice.deviceName
                } else {
                    selectedDevice.name
                }
                , " at pages/index/index.uvue:466")
                console.log("设备 IMEI:", selectedDevice.imei, " at pages/index/index.uvue:467")
                console.log("选中的索引:", selectedIndex, " at pages/index/index.uvue:468")
                console.log("============================================", " at pages/index/index.uvue:469")
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
                center["latitude"] = selectedDevice.latitude
                center["longitude"] = selectedDevice.longitude
                if (selectedIndex !== -1) {
                    saveSelectedDeviceIndex(selectedIndex)
                    pickerDefaultIndex.value = _uA(
                        selectedIndex
                    )
                }
                saveSelectedDevice(selectedDevice)
                uni_showLoading(ShowLoadingOptions(title = "加载车辆数据...", mask = true))
                loadDeviceData(selectedDevice)
            }
            val loadDeviceData = fun(device: Device): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        console.log("开始加载设备数据:", device, " at pages/index/index.uvue:505")
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
                            uni_showToast(ShowToastOptions(title = "切换成功", icon = "success"))
                        }
                         catch (error: Throwable) {
                            console.error("切换车辆失败", error, " at pages/index/index.uvue:526")
                            uni_showToast(ShowToastOptions(title = "切换失败，请重试", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val loadDeviceList = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getUserDeviceList(_uO("pageSize" to 1000)))
                            if (res.code == 0 && res.data != null && res.data.list != null && res.data.list.length > 0) {
                                userDeviceList.value = res.data
                                deviceList.value = res.data.list.map(fun(item: Any): UTSJSONObject {
                                    return (_uO("name" to if (isTruthy(item.deviceName)) {
                                        item.deviceName
                                    } else {
                                        if (isTruthy(item.imei)) {
                                            item.imei
                                        } else {
                                            "未命名设备"
                                        }
                                    }, "deviceName" to if (isTruthy(item.deviceName)) {
                                        item.deviceName
                                    } else {
                                        if (isTruthy(item.imei)) {
                                            item.imei
                                        } else {
                                            "未命名设备"
                                        }
                                    }, "value" to item.imei, "imei" to item.imei, "deptId" to item.companyId, "deviceId" to item.deviceId, "iccid" to item.iccid, "simMerchant" to item.simMerchant, "connectionStatus" to item.connectionStatus, "carType" to item.carType, "plateNo" to item.plateNo, "latitude" to item.latitude, "longitude" to item.longitude))
                                })
                                val savedDevice = getSavedSelectedDevice()
                                val savedIndex = getSavedSelectedDeviceIndex()
                                var selectedDevice = null
                                var selectedIdx: Number = -1
                                if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
                                    selectedDevice = deviceList.value[savedIndex]
                                    selectedIdx = savedIndex
                                }
                                if (!selectedDevice && isTruthy(savedDevice) && isTruthy(savedDevice.imei)) {
                                    selectedDevice = deviceList.value.find(fun(device): Boolean {
                                        return device.imei === savedDevice.imei || device.value === savedDevice.imei
                                    }
                                    )
                                    if (selectedDevice) {
                                        selectedIdx = deviceList.value.indexOf(selectedDevice)
                                    } else {
                                        clearSavedSelectedDevice()
                                        clearSavedSelectedDeviceIndex()
                                    }
                                }
                                if (!selectedDevice && deviceList.value.length > 0) {
                                    selectedDevice = deviceList.value[0]
                                    selectedIdx = 0
                                    saveSelectedDevice(selectedDevice)
                                    saveSelectedDeviceIndex(0)
                                    console.log("使用第一个设备作为默认:", selectedDevice?.deviceName, " at pages/index/index.uvue:596")
                                }
                                if (selectedDevice) {
                                    val deviceName = if (isTruthy(selectedDevice.deviceName)) {
                                        selectedDevice.deviceName
                                    } else {
                                        if (isTruthy(selectedDevice.name)) {
                                            selectedDevice.name
                                        } else {
                                            "未命名设备"
                                        }
                                    }
                                    currentCarName.value = deviceName
                                    currentCarImei.value = if (isTruthy(selectedDevice.imei)) {
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
                                    center["latitude"] = selectedDevice.latitude
                                    center["longitude"] = selectedDevice.longitude
                                    if (selectedIdx !== -1) {
                                        pickerDefaultIndex.value = _uA(
                                            selectedIdx
                                        )
                                    }
                                    await(loadDeviceDetail(selectedDevice.deviceId))
                                    await(loadDevicePos(_uO("deviceId" to selectedDevice.deviceId, "deviceids" to if (isTruthy(selectedDevice.imei)) {
                                        selectedDevice.imei
                                    } else {
                                        selectedDevice.value
                                    }
                                    )))
                                    await(loadTrackPos(_uO("imei" to if (isTruthy(selectedDevice.imei)) {
                                        selectedDevice.imei
                                    } else {
                                        selectedDevice.value
                                    }
                                    , "startTime" to formatTimes(todayZero), "endTime" to formatTimes(nowTime), "minParkTime" to 120, "withStop" to false, "withPos" to false, "withTrip" to true)))
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = if (isTruthy(res.msg)) {
                                    res.msg
                                } else {
                                    "暂无车辆数据"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载车辆列表失败", error, " at pages/index/index.uvue:641")
                            uni_showToast(ShowToastOptions(title = "加载失败，请下拉重试", icon = "none"))
                        }
                })
            }
            val loadDeviceDetail = fun(deviceId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getDeviceDetail(deviceId))
                            if (res.code == 0 && res.data != null) {
                                deviceDetail.value = _uO("deviceStatus" to _uO("batteryPercent" to (res.data.deviceStatus?.batteryPercent ?: 0), "voltage" to (res.data.deviceStatus?.voltage ?: 0), "signalStrength" to (res.data.deviceStatus?.signalStrength ?: 0)), "connectionStatus" to (res.data["connectionStatus"] ?: "offline"), "lastUpdateTime" to (res.data["lastUpdateTime"] ?: null))
                                if (isTruthy(res.data["lastUpdateTime"])) {
                                    val date = Date(res.data["lastUpdateTime"])
                                    lastUpdateTime.value = "" + date.getHours().toString(10).padStart(2, "0") + ":" + date.getMinutes().toString(10).padStart(2, "0") + ":" + date.getSeconds().toString(10).padStart(2, "0")
                                }
                            } else {
                                console.warn("获取设备详情失败:", res.msg, " at pages/index/index.uvue:670")
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载设备详情失败", error, " at pages/index/index.uvue:673")
                        }
                })
            }
            val trackPosInfo = ref(_uO() as Any)
            val tripData = ref(_uA<Any>())
            val totalMileage = ref(0)
            val averageSpeed = ref(0)
            val loadTrackPos = fun(data: Any): UTSPromise<Any> {
                return wrapUTSPromise(suspend w1@{
                        try {
                            val res = await(getTrackPos(data))
                            if (res.code == 401) {
                                uni_showToast(ShowToastOptions(title = "登录过期，请重新登录", icon = "none", duration = 2000))
                                uni_removeStorageSync("token")
                                uni_reLaunch(ReLaunchOptions(url = "/pages/index/index"))
                                return@w1 false
                            }
                            await(processTripData(res.data))
                            uni_hideLoading(null)
                        }
                         catch (error: Throwable) {
                            console.error("加载轨迹失败", error, " at pages/index/index.uvue:701")
                        }
                })
            }
            val totalTrips = computed(fun(): Number {
                return tripData.value.length
            }
            )
            val processTripData = fun(data: Any): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        if (isTruthy(data.trips) && data.trips.length > 0) {
                            val processedTrips = await(UTSPromise.all(data.trips.map(fun(trip: Any): UTSPromise<Any> {
                                return wrapUTSPromise(suspend w2@{
                                        return@w2 UTSJSONObject.assign(_uO(), trip)
                                })
                            })))
                            tripData.value = processedTrips
                            var totalDistance: Number = 0
                            var totalDuration: Number = 0
                            var totalAvgSpeed: Number = 0
                            processedTrips.forEach(fun(trip: Any){
                                totalDistance += if (isTruthy(trip.distance)) {
                                    trip.distance
                                } else {
                                    0
                                }
                                totalDuration += if (isTruthy(trip.duration)) {
                                    trip.duration
                                } else {
                                    0
                                }
                                totalAvgSpeed += if (isTruthy(trip.averageSpeed)) {
                                    trip.averageSpeed
                                } else {
                                    0
                                }
                            })
                            totalMileage.value = totalDistance
                            averageSpeed.value = if (processedTrips.length > 0) {
                                totalAvgSpeed / processedTrips.length
                            } else {
                                0
                            }
                        } else {
                            tripData.value = _uA()
                            totalMileage.value = 0
                            averageSpeed.value = 0
                        }
                })
            }
            val devicePosInfo = ref(_uO() as Any)
            val loadDevicePos = fun(data: Any): UTSPromise<Boolean> {
                return wrapUTSPromise(suspend w1@{
                        try {
                            val res = await(getDevicePos(data))
                            if (res.code == 0 && res.data != null && res.data.length > 0) {
                                devicePosInfo.value = res.data[0]
                                val lat = Number(res.data[0]["latitude"])
                                val lng = Number(res.data[0]["longitude"])
                                if (isNaN(lat) || isNaN(lng)) {
                                    console.error("经纬度格式错误", res.data[0]["latitude"], res.data[0]["longitude"], " at pages/index/index.uvue:754")
                                    uni_showToast(ShowToastOptions(title = "定位数据异常", icon = "none"))
                                    return@w1 false
                                }
                                var convertedCoord
                                try {
                                    convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
                                } catch (transformError: Throwable) {
                                    console.error("坐标转换失败:", transformError, " at pages/index/index.uvue:766")
                                    convertedCoord = _uO("lat" to lat, "lng" to lng)
                                }
                                center["latitude"] = convertedCoord.lat
                                center["longitude"] = convertedCoord.lng
                                isMapReady.value = true
                                await(delay(100))
                                val deviceMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarName.value)
                                markers.value = _uA()
                                await(delay(50))
                                markers.value = _uA(
                                    deviceMarker
                                )
                                console.log("标记点更新完成", " at pages/index/index.uvue:788")
                                return@w1 true
                            } else {
                                console.warn("获取设备位置失败:", res.msg, " at pages/index/index.uvue:791")
                                isMapReady.value = false
                                uni_showToast(ShowToastOptions(title = if (isTruthy(res.msg)) {
                                    res.msg
                                } else {
                                    "获取位置失败"
                                }
                                , icon = "none"))
                                return@w1 false
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载设备位置失败", error, " at pages/index/index.uvue:800")
                            uni_showToast(ShowToastOptions(title = "定位失败，请重试", icon = "none"))
                            return@w1 false
                        }
                })
            }
            val refreshLocation = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!(currentCarDeviceId.value != "")) {
                            uni_showToast(ShowToastOptions(title = "请先选择车辆", icon = "none"))
                            return@w1
                        }
                        uni_showLoading(ShowLoadingOptions(title = "刷新位置中...", mask = true))
                        try {
                            await(loadDeviceDetail(currentCarDeviceId.value))
                            val success = await(loadDevicePos(_uO("deviceId" to currentCarDeviceId.value, "deviceids" to currentCarImei.value)))
                            if (success) {
                                val mapContext = uni_createMapContext("myMap", this)
                                mapContext.moveToLocation(MapContextMoveToLocationOptions(latitude = center["latitude"], longitude = center["longitude"]))
                                uni_showToast(ShowToastOptions(title = "位置已更新", icon = "success"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("刷新位置失败", error, " at pages/index/index.uvue:840")
                            uni_showToast(ShowToastOptions(title = "刷新失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val toRecordDetail = fun(){
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/playBack/playBack?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&lat=" + center["latitude"] + "&lng=" + center["longitude"]))
            }
            val toDeviceList = fun(){
                console.log("toDeviceList", " at pages/index/index.uvue:860")
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/deviceList/deviceList?userDeviceList=" + JSON.stringify(userDeviceList.value)))
            }
            val createMarker = fun(id: Number, lat: Number, lng: Number, type: String, title: String?): UTSJSONObject {
                val isOnline = safeDeviceDetail.value.connectionStatus === "online"
                val iconPath = getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value)
                val marker: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("marker", "pages/index/index.uvue", 871, 11), "id" to id, "latitude" to lat, "longitude" to lng, "width" to 30, "height" to 30, "iconPath" to iconPath, "callout" to _uO("content" to if (isTruthy(title)) {
                    title
                } else {
                    "爱车位置"
                }
                , "color" to if (isOnline) {
                    "#ffffff"
                } else {
                    "#999999"
                }
                , "borderRadius" to 6, "bgColor" to if (isOnline) {
                    "#07C160"
                } else {
                    "#CCCCCC"
                }
                , "padding" to 4, "fontSize" to 12, "display" to "ALWAYS"), "anchor" to _uO("x" to 0.5, "y" to 0.5))
                return marker
            }
            val toDeviceDetail = fun(e: Any){
                if (!isLogin()) {
                    return
                }
                if (!(currentCarImei.value != "") || !(currentCarDeptId.value != "") || !(currentCarDeviceId.value != "")) {
                    uni_showToast(ShowToastOptions(title = "请先选择车辆", icon = "none"))
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/carInfoDetail/carInfoDetail?imei=" + currentCarImei.value + "&deptId=" + currentCarDeptId.value + "&deviceId=" + currentCarDeviceId.value))
            }
            val toAdd = fun(){
                if (!isLogin()) {
                    return
                }
                uni_navigateTo(NavigateToOptions(url = "/pages/addCar/addCar"))
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
                uni_openLocation(OpenLocationOptions(latitude = center["latitude"], longitude = center["longitude"], name = currentCarName.value, scale = 18, success = fun(_){
                    uni_showToast(ShowToastOptions(title = "成功调起地图", icon = "none"))
                }
                , fail = fun(err){
                    uni_showToast(ShowToastOptions(title = "调起地图失败", icon = "none"))
                    console.error("调起地图失败:", err, " at pages/index/index.uvue:942")
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
                uni_openCustomerServiceChat(OpenCustomerServiceChatOptions(extInfo = _uO("url" to "https://work.weixin.qq.com/kfid/kfc030824eb947a0c9a"), corpId = "ww686122ec6a4db85a", success = fun(res) {
                    console.log(res, " at pages/index/index.uvue:961")
                }
                ))
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
                console.log(iccid, " at pages/index/index.uvue:974")
                needRefresh.value = true
                needRefresh.value = false
                uni_showToast(ShowToastOptions(title = "请在微信小程序中完成充值", icon = "none"))
            }
            val gotoLogin = fun(){
                uni_navigateTo(NavigateToOptions(url = "/pages/login/login"))
            }
            val unbindDevice = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!isLogin()) {
                            return@w1
                        }
                        uni_showModal(ShowModalOptions(title = "解绑车辆", content = "确定解绑当前车辆吗？", success = fun(res): UTSPromise<Unit> {
                            return wrapUTSPromise(suspend {
                                    if (res.confirm) {
                                        val res = await(delDevice(currentCarImei.value))
                                        if (res.code == 0) {
                                            uni_showToast(ShowToastOptions(title = "解绑成功", icon = "success"))
                                            clearSavedSelectedDevice()
                                            clearSavedSelectedDeviceIndex()
                                        } else {
                                            uni_showToast(ShowToastOptions(title = "解绑失败", icon = "error"))
                                        }
                                        loadDeviceList()
                                    }
                            })
                        }
                        ))
                })
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
            val checkToken = fun(): Boolean {
                val token = uni_getStorageSync("token")
                return !!isTruthy(token)
            }
            val isLogin = fun(): Boolean {
                if (!checkToken()) {
                    uni_showToast(ShowToastOptions(title = "请先登录", icon = "none"))
                    return false
                }
                return true
            }
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
                return _cE("view", _uM("class" to "container"), _uA(
                    _cE("view", null, _uA(
                        _cE("view", _uM("class" to "top", "style" to _nS(_uM("paddingTop" to (statusBarHeight.value + 50 + "px")))), _uA(
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
                                    _cV(_component_i_icon, _uM("name" to "/static/reload.png", "fontSize" to "20", "onClick" to handleReload)),
                                    _cV(_component_i_icon, _uM("class" to "nav-tool-spacing", "name" to "/static/maps.png", "fontSize" to "20", "onClick" to toDeviceList)),
                                    _cV(_component_i_icon, _uM("class" to "nav-tool-spacing", "name" to "/static/addNew.png", "fontSize" to "20", "onClick" to toAdd))
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
                                        _uM("online" to (safeDeviceDetail.value.connectionStatus === "online"))
                                    ))), _tD(if (safeDeviceDetail.value.connectionStatus === "online") {
                                        "在线"
                                    } else {
                                        "离线"
                                    }
                                    ), 3)
                                )),
                                _cE("view", _uM("class" to "state-item"), _uA(
                                    _cE("text", _uM("class" to "state-label"), "最后定位"),
                                    _cE("text", _uM("class" to "state-value"), _tD(devicePosInfo.value.positionUpdateTime ?: "暂无位置"), 1)
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
                                        _cV(_component_map, _uM("key" to 0, "id" to "myMap", "latitude" to center["latitude"], "longitude" to center["longitude"], "markers" to markers.value, "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "show-location" to true, "enable-traffic" to true, "enable-overlooking" to true, "enable-building" to true, "enable-3D" to false), null, 8, _uA(
                                            "latitude",
                                            "longitude",
                                            "markers",
                                            "scale",
                                            "style"
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
                                        _cE("view", _uM("class" to "ring-bg green")),
                                        _cE("view", _uM("class" to "ring-text"), _uA(
                                            _cE("text", _uM("class" to "unit"), "条"),
                                            _cE("text", _uM("class" to "num"), _tD(totalTrips.value), 1),
                                            _cE("text", _uM("class" to "label"), "今日轨迹")
                                        ))
                                    )),
                                    _cE("view", _uM("class" to "ring-item"), _uA(
                                        _cE("view", _uM("class" to "ring-bg orange")),
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
                                _cE("view", _uM("class" to "service-header"), "服务中心"),
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
                return _uM("container" to _pS(_uM("backgroundImage" to "linear-gradient(90deg, #E6F9E6, #E0F0FF)", "backgroundColor" to "rgba(0,0,0,0)", "paddingTop" to 0, "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx")), "loading-container" to _uM(".container " to _uM("position" to "fixed", "top" to "50%", "left" to "50%", "transform" to "translate(-50%, -50%)", "display" to "flex", "flexDirection" to "column", "alignItems" to "center", "zIndex" to 999)), "loading-text" to _uM(".container .loading-container " to _uM("marginTop" to "20rpx", "fontSize" to "28rpx", "color" to "#666666")), "device-car" to _uM(".container .top " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "current-car" to _uM(".container .top .device-car " to _uM("position" to "relative", "display" to "flex", "flexDirection" to "row", "alignItems" to "flex-end")), "car-id" to _uM(".container .top .device-car .current-car " to _uM("fontSize" to "36rpx", "fontWeight" to "bold", "color" to "#000000", "textAlign" to "center", "position" to "relative", "marginRight" to "10rpx")), "login" to _uM(".container .top .device-car .current-car " to _uM("fontSize" to "36rpx", "fontWeight" to "bold", "color" to "#000000", "textAlign" to "center", "paddingRight" to "30rpx")), "nav-tools" to _uM(".container .top .device-car " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "nav-tool-spacing" to _uM(".container .top .device-car .nav-tools " to _uM("marginLeft" to "30rpx")), "exit" to _uM(".container .top .device-car .nav-tools " to _uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "backgroundColor" to "rgba(0,0,0,0.05)", "transitionProperty" to "all", "transitionDuration" to "0.2s", "transitionTimingFunction" to "ease", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%")), "exit-icon" to _uM(".container .top .device-car .nav-tools .exit " to _uM("width" to "40rpx", "height" to "40rpx")), "device-info" to _uM(".container .top " to _uM("display" to "flex", "flexDirection" to "column", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "width" to "50%")), "info" to _uM(".container .top .device-info .info+" to _uM("marginTop" to "16rpx"), ".container .top .device-info " to _uM("fontSize" to "26rpx", "color" to "#333333")), "banner-image" to _uM(".container .top " to _uM("width" to "100%", "height" to "300rpx")), "car-state" to _uM(".container .top " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0, "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx")), "state-item" to _uM(".container .top .car-state .state-item+" to _uM("marginLeft" to "20rpx"), ".container .top .car-state " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "flexDirection" to "column", "alignItems" to "center", "backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "30rpx", "borderTopRightRadius" to "30rpx", "borderBottomRightRadius" to "30rpx", "borderBottomLeftRadius" to "30rpx")), "state-value" to _uM(".container .top .car-state .state-item " to _uM("marginTop" to "12rpx", "fontSize" to "28rpx", "fontWeight" to "bold", "color" to "#333333"), ".container .top .car-state .state-item .online" to _uM("color" to "#07C160")), "state-label" to _uM(".container .top .car-state .state-item " to _uM("fontSize" to "24rpx", "color" to "#999999")), "map-box" to _uM(".container .content " to _uM("width" to "100%", "height" to "400rpx", "marginTop" to "10rpx", "marginRight" to 0, "marginBottom" to "40rpx", "marginLeft" to 0, "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "display" to "flex", "flexDirection" to "column", "overflow" to "hidden", "boxShadow" to "0 4rpx 20rpx rgba(0, 0, 0, 0.08)")), "map-header" to _uM(".container .content .map-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")), "map-title" to _uM(".container .content .map-box .map-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333")), "map-refresh" to _uM(".container .content .map-box .map-header " to _uM("fontSize" to "26rpx", "color" to "#07C160", "paddingTop" to "8rpx", "paddingRight" to "16rpx", "paddingBottom" to "8rpx", "paddingLeft" to "16rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f9f0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx")), "map-container" to _uM(".container .content .map-box " to _uM("height" to "300rpx")), "mile-record" to _uM(".container .content " to _uM("width" to "100%", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "display" to "flex", "flexDirection" to "column", "overflow" to "hidden", "boxShadow" to "0 4rpx 20rpx rgba(0, 0, 0, 0.08)")), "record-header" to _uM(".container .content .mile-record " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")), "record-title" to _uM(".container .content .mile-record .record-header " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333")), "record-desc" to _uM(".container .content .mile-record .record-header " to _uM("fontSize" to "26rpx", "color" to "#07C160", "paddingTop" to "8rpx", "paddingRight" to "16rpx", "paddingBottom" to "8rpx", "paddingLeft" to "16rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f9f0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx")), "ring-container" to _uM(".container .content .mile-record " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-around", "paddingTop" to "30rpx", "paddingRight" to "20rpx", "paddingBottom" to "30rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#edf7ff", "borderTopLeftRadius" to "24rpx", "borderTopRightRadius" to "24rpx", "borderBottomRightRadius" to "24rpx", "borderBottomLeftRadius" to "24rpx", "marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx")), "ring-item" to _uM(".container .content .mile-record " to _uM("position" to "relative", "width" to "250rpx", "height" to "250rpx", "display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "ring-bg" to _uM(".container .content .mile-record " to _uM("position" to "absolute", "width" to "100%", "height" to "100%", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "zIndex" to 2, "boxSizing" to "border-box", "borderTopWidth" to "16rpx", "borderRightWidth" to "16rpx", "borderBottomWidth" to "16rpx", "borderLeftWidth" to "16rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "rgba(0,0,0,0)", "borderRightColor" to "rgba(0,0,0,0)", "borderBottomColor" to "rgba(0,0,0,0)", "borderLeftColor" to "rgba(0,0,0,0)"), ".container .content .mile-record .green" to _uM("borderTopColor" to "#4cd964", "borderRightColor" to "#4cd964", "borderLeftColor" to "#4cd964", "transform" to "rotate(135deg)"), ".container .content .mile-record .orange" to _uM("borderTopColor" to "#ff9500", "borderRightColor" to "#ff9500", "borderLeftColor" to "#ff9500", "transform" to "rotate(135deg)")), "ring-text" to _uM(".container .content .mile-record " to _uM("position" to "relative", "zIndex" to 10, "textAlign" to "center")), "num" to _uM(".container .content .mile-record " to _uM("fontSize" to "45rpx", "fontWeight" to "bold", "color" to "#333333")), "unit" to _uM(".container .content .mile-record " to _uM("fontSize" to "20rpx", "color" to "#666666", "marginLeft" to "8rpx", "textAlign" to "right")), "label" to _uM(".container .content .mile-record " to _uM("fontSize" to "25rpx", "color" to "#666666", "marginTop" to "12rpx")), "device-list" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "column", "marginTop" to "40rpx", "marginRight" to 0, "marginBottom" to "40rpx", "marginLeft" to 0)), "device-item" to _uM(".container .content .device-list .device-item+" to _uM("marginTop" to "30rpx"), ".container .content .device-list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "item-label" to _uM(".container .content .device-list .device-item " to _uM("fontSize" to "28rpx", "fontWeight" to 500, "display" to "flex", "flexDirection" to "row", "alignItems" to "center")), "icon" to _uM(".container .content .device-list .device-item .item-label " to _uM("width" to "80rpx", "height" to "80rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "paddingTop" to "18rpx", "paddingRight" to "18rpx", "paddingBottom" to "18rpx", "paddingLeft" to "18rpx"), ".container .content .device-list .device-item .item-label .icon-device" to _uM("backgroundColor" to "#f0f9f0"), ".container .content .device-list .device-item .item-label .icon-car" to _uM("backgroundColor" to "#f3f8fb"), ".container .content .device-list .device-item .item-label .icon-fence" to _uM("backgroundColor" to "#f1f7f4")), "icon-image" to _uM(".container .content .device-list .device-item .item-label " to _uM("width" to "45rpx", "height" to "45rpx"), ".container .content .service .service-content .service-item " to _uM("width" to "60rpx", "height" to "60rpx")), "item-info" to _uM(".container .content .device-list .device-item .item-label " to _uM("marginLeft" to "20rpx", "fontWeight" to "normal")), "item-title" to _uM(".container .content .device-list .device-item .item-label .item-info " to _uM("fontSize" to "28rpx", "fontWeight" to "bold", "color" to "#333333"), ".container .content .service .service-content .service-item " to _uM("marginTop" to "10rpx", "fontSize" to "25rpx", "color" to "#222222")), "item-desc" to _uM(".container .content .device-list .device-item .item-label .item-info " to _uM("color" to "#cccccc")), "service" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "column", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "backgroundColor" to "#ffffff", "marginBottom" to "30rpx")), "service-header" to _uM(".container .content .service " to _uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0", "marginBottom" to "30rpx")), "service-content" to _uM(".container .content .service " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx")), "service-item" to _uM(".container .content .service .service-content " to _uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center")), "@TRANSITION" to _uM("exit" to _uM("property" to "all", "duration" to "0.2s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
