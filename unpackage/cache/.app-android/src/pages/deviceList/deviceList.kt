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
import io.dcloud.uniapp.extapi.getLocation as uni_getLocation
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showToast as uni_showToast
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
            val markers = ref(_uA<UTSJSONObject>())
            val iconColor = ref("#1296db")
            val userLocation = ref(_uO("latitude" to 0, "longitude" to 0))
            val pickerStateTitle = ref("全部状态")
            val showWhat = fun(){
                showMap.value = !showMap.value
            }
            val originalDeviceList = ref(_uA<UTSJSONObject>())
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
            val updateMarkers = fun(devices: UTSArray<UTSJSONObject>): Unit {
                val nextMarkers: UTSArray<UTSJSONObject> = _uA()
                run {
                    var index: Number = 0
                    while(index < devices.length){
                        val device = devices[index]
                        val latitude = device["latitude"] as Any?
                        val longitude = device["longitude"] as Any?
                        if (latitude == null || longitude == null) {
                            index++
                            continue
                        }
                        val lat = parseFloat(latitude.toString())
                        val lng = parseFloat(longitude.toString())
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
                        nextMarkers.push(_uO("id" to markerId, "latitude" to lat, "longitude" to lng, "iconPath" to getDeviceIcon(connectionStatus, carType), "width" to 30, "height" to 30, "callout" to _uO("content" to deviceName, "display" to "ALWAYS", "padding" to 8, "borderRadius" to 8, "bgColor" to "#ffffff"), "joinCluster" to true, "anchor" to _uO("x" to 0.5, "y" to 0.5)))
                        index++
                    }
                }
                markers.value = nextMarkers
            }
            watchEffect(fun(){
                if (showMap.value) {
                    updateMarkers(filteredDevices.value)
                }
            }
            )
            val loadUserDeviceList = fun(data: UTSArray<UTSJSONObject>, from: Boolean): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            var deviceList: UTSArray<UTSJSONObject> = data
                            if (from) {
                                val params: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("params", "pages/deviceList/deviceList.uvue", 118, 11), "pageSize" to 1000)
                                val res = await(getUserDeviceList(params))
                                val list = res.data.list
                                deviceList = if (list != null) {
                                    list
                                } else {
                                    _uA()
                                }
                            }
                            originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, "tencent")
                            updateMarkers(originalDeviceList.value)
                        }
                         catch (err: Throwable) {
                            console.error("获取设备列表失败:", err, " at pages/deviceList/deviceList.uvue:126")
                            uni_showToast(ShowToastOptions(title = "获取设备列表失败", icon = "none"))
                        }
                })
            }
            val unbindDevice = fun(imei: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val res = await(delDevice(imei))
                        if (res.code == 0) {
                            uni_showToast(ShowToastOptions(title = "解绑成功", icon = "success"))
                            uni_setStorageSync("needRefreshHome", true)
                        } else {
                            uni_showToast(ShowToastOptions(title = "解绑失败", icon = "error"))
                        }
                        await(loadUserDeviceList(_uA(), true))
                })
            }
            val getLocation = fun(){
                uni_getLocation(GetLocationOptions(type = "wgs84", success = fun(res){
                    console.log("获取位置成功:", res, " at pages/deviceList/deviceList.uvue:153")
                    userLocation.value["latitude"] = res.latitude
                    userLocation.value["longitude"] = res.longitude
                }
                , fail = fun(err){
                    console.log("获取位置失败:", err, " at pages/deviceList/deviceList.uvue:158")
                }
                ))
            }
            val changeState = fun(type: String){
                pickerStateTitle.value = type
            }
            val handleTap = fun(event: Any){
                val detail = event as UTSJSONObject
                val markerId = if (detail != null) {
                    detail["markerId"]
                } else {
                    null
                }
                val selectedDevice = originalDeviceList.value.find(fun(device: UTSJSONObject): Boolean {
                    return device["deviceId"] == markerId
                }
                )
                if (selectedDevice == null) {
                    console.warn("未找到对应的设备信息", markerId, " at pages/deviceList/deviceList.uvue:187")
                    return
                }
                val imeiValue = (selectedDevice["imei"] as String?) ?: ""
                val companyId = (selectedDevice["companyId"] as Any?) ?: ""
                val deviceId = (selectedDevice["deviceId"] as Any?) ?: ""
                uni_navigateTo(NavigateToOptions(url = "/pages/carInfoDetail/carInfoDetail?imei=" + imeiValue + "&deptId=" + companyId.toString() + "&deviceId=" + deviceId.toString()))
            }
            onLoad(fun(options){
                getLocation()
                loadUserDeviceList(_uA(), true)
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_map = resolveComponent("map")
                val _component_i_tag = resolveEasyComponent("i-tag", GenUniModulesIUiXComponentsITagITagClass)
                val _component_indexListMode = resolveEasyComponent("indexListMode", GenComponentsIndexListModeIndexListModeClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "全部设备", "show-back" to true, "backgroundColor" to "#f1f1f1", "textColor" to "#333", "showCapsule" to true, "isIcon" to true, "onCapsuleClick" to showWhat, "Icon" to "/static/maps.png", "iconColor" to iconColor.value), null, 8, _uA(
                        "iconColor"
                    )),
                    if (isTrue(showMap.value)) {
                        _cE("view", _uM("key" to 0, "class" to "map-container"), _uA(
                            _cV(_component_map, _uM("id" to "myMap", "scale" to mapScale.value, "style" to _nS(_uM("width" to "100%", "height" to "100%")), "onMarkertap" to handleTap, "latitude" to userLocation.value["latitude"], "longitude" to userLocation.value["longitude"], "enable-traffic" to true), null, 8, _uA(
                                "scale",
                                "style",
                                "latitude",
                                "longitude"
                            )),
                            if (isTrue(showMap.value)) {
                                _cE("view", _uM("key" to 0, "class" to "right-bar"), _uA(
                                    _cV(_component_i_tag, _uM("type" to "primary", "onClick" to fun(){
                                        changeState("在线")
                                    }, "text" to ("在线 " + onlineCount.value)), null, 8, _uA(
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
                            _cV(_component_indexListMode, _uM("lists" to originalDeviceList.value, "onUnbindDevice" to unbindDevice), null, 8, _uA(
                                "lists"
                            ))
                        ))
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
                return _uM("container" to _pS(_uM("position" to "relative", "width" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fa")), "map-container" to _uM(".container " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%", "position" to "relative")), "tool-nav" to _uM(".container " to _uM("position" to "absolute", "top" to "200rpx", "right" to "20rpx", "zIndex" to 100, "display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "fontSize" to "35rpx")), "btn-map-list" to _uM(".container .tool-nav " to _uM("paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "backgroundColor" to "#1296db", "color" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "right-bar" to _uM(".container " to _uM("position" to "absolute", "top" to "25rpx", "left" to "20rpx", "zIndex" to 100, "display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "status-spacing" to _uM(".container .right-bar " to _uM("marginLeft" to "20rpx")), "allCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#1296db")), "onlineCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#0da117")), "offlineCar" to _uM(".container .right-bar " to _uM("backgroundColor" to "#d81e06")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
