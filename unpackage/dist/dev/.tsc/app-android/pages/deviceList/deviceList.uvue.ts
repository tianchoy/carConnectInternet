import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_indexListMode from '@/components/indexListMode/indexListMode.uvue'
import { ref, computed, watch } from 'vue'
	import { getUserDeviceList,delDevice} from '../../api/request.uts'
	import CoordTransform from '../../utils/coordTransform.uts'
	import { getDeviceIcon } from '../../utils/cars'

	
const __sfc__ = defineComponent({
  __name: 'deviceList',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const mapScale = ref(4)
	const showMap = ref(true)
	const markers = ref<Array<any>>([])
	let mapCtx = undefined
	const iconColor = ref('#1296db')
	const userLocation = ref({
		latitude: 0, 
		longitude: 0
	})

	const pickerStateTitle = ref('全部状态')

	// 切换显示模式
	const showWhat = () => {
		showMap.value = !showMap.value
	}

	// 原始设备列表
	const originalDeviceList = ref<Array<any>>([])

	// 计算属性 筛选逻辑
	const filteredDevices = computed(() => {
		if (!Array.isArray(originalDeviceList.value)) return []

		let result = [...originalDeviceList.value]

		// 状态筛选
		if (pickerStateTitle.value == '在线') {
			result = result.filter(device => device?.connectionStatus == 'online')
		} else if (pickerStateTitle.value === '离线') {
			result = result.filter(device => device?.connectionStatus == 'offline')
		}

		return result
	})

	// 计算设备数量统计
	const totalCount = computed(() => originalDeviceList.value.length)
	const onlineCount = computed(() => originalDeviceList.value.filter(d => d?.connectionStatus == 'online').length)
	const offlineCount = computed(() => totalCount.value - onlineCount.value)

	// 自动更新地图标记
	watch([filteredDevices, showMap], ([devices, isMapVisible]) => {
		if (isMapVisible) {
			updateMarkers(devices)
		}
	})

		// 解绑设备
	const unbindDevice = async (imei : string) => {
		const res = await delDevice(imei)
		if (res.code == 0) {
			uni.showToast({
				title: '解绑成功',
				icon: 'success'
			})
			uni.setStorageSync('needRefreshHome', true)
		} else {
			uni.showToast({
				title: '解绑失败',
				icon: 'error'
			})
		}
		// 解绑成功后刷新设备列表
		await loadUserDeviceList([],true)
	}

	// 获取当前位置
	const getLocation = () => {
		uni.getLocation({
			type: 'wgs84',
			success: (res) => {
				console.log('获取位置成功:', res, " at pages/deviceList/deviceList.uvue:100")
				userLocation.value.latitude = res.latitude
				userLocation.value.longitude = res.longitude
			},
			fail: (err) => {
				console.log('获取位置失败:', err, " at pages/deviceList/deviceList.uvue:105")
			}
		})
	}
	// 订阅消息
	const subMsg = () => {
		console.log('订阅消息', " at pages/deviceList/deviceList.uvue:111")
		uni.requestSubscribeMessage({
			tmplIds: ['VRR0UEO9VJOLs0MHlU0OilqX6MVFDwH3_3gz3Oc0NIc'],
			success: (res) => {
				console.log('订阅成功:', res, " at pages/deviceList/deviceList.uvue:115")
			},
			fail: (err) => {
				console.log('订阅失败:', err, " at pages/deviceList/deviceList.uvue:118")
			}
		})
	}

	// 切换筛选状态
	const changeState= (type : string) => {
		pickerStateTitle.value = type
	}

	// 点击地图标记
	const handleTap = (e) => {
		const markerId = e.detail.markerId
		const selectedDevice = originalDeviceList.value.find(device => device.deviceId == markerId)

		if (selectedDevice) {
			uni.navigateTo({
				url: `/pages/carInfoDetail/carInfoDetail?imei=${selectedDevice.imei}&deptId=${selectedDevice.companyId}&deviceId=${selectedDevice.deviceId}`,
			})
		} else {
			console.warn('未找到对应的设备信息', markerId, " at pages/deviceList/deviceList.uvue:138")
		}
	}

	// 更新地图标记
	const updateMarkers = (devices) => {
		if (!Array.isArray(devices)) {
			devices = []
		}
		markers.value = devices.map((device, index) => {
			if (!device || typeof device !== 'object') {
				return null
			}

			const lat = Number(device.latitude)
			const lng = Number(device.longitude)

			if (isNaN(lat) || isNaN(lng)) {
				return null
			}

			const iconPath = getDeviceIcon(device.connectionStatus, device.carType)

			let markerId : number
			if (device.deviceId && !isNaN(Number(device.deviceId))) {
				markerId = Number(device.deviceId)
			} else {
				markerId = index + 1
			}
			return {
				id: markerId,  // 使用数字类型的 ID
				latitude: lat,
				longitude: lng,
				iconPath: iconPath,
				width: 30,
				height: 30,
				callout: {
					content: device.deviceName || device.plateNo || '设备',
					display: 'ALWAYS',
					padding: 8,
					borderRadius: 8,
					bgColor: '#ffffff'
				},
				joinCluster: true,
				anchor: { x: 0.5, y: 0.5 }
			}
		}).filter(marker => marker !== null)
	}

	// 加载用户设备列表
	const loadUserDeviceList = async (data,from) => {
		try {
			if(from){
				let params = {__$originalPosition: new UTSSourceMapPosition("params", "pages/deviceList/deviceList.uvue", 191, 9),
				pageSize: 1000,
			}

				const res = await getUserDeviceList(params)
				data = res.data.list
			}
			let deviceList = []
			if (data) {
				if (Array.isArray(data)) {
					deviceList = data
				} else if (Array.isArray(data.list)) {
					deviceList = data.list
				} else if (Array.isArray(data.devices)) {
					deviceList = data.devices
				} else if (Array.isArray(data.items)) {
					deviceList = data.items
				} else if (data.totalCount !== undefined) {
					deviceList = []
				}
			}
			// 使用插件转换坐标
			originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, 'tencent')
			updateMarkers(originalDeviceList.value)
		} catch (err) {
			console.error('获取设备列表失败:', err, " at pages/deviceList/deviceList.uvue:216")
			uni.showToast({
				title: '获取设备列表失败',
				icon: 'none'
			})
		}
	}

	onLoad(async (options) => {
        getLocation()
        await loadUserDeviceList(UTSAndroid.consoleDebugError(JSON.parse(options.userDeviceList), " at pages/deviceList/deviceList.uvue:226"),false)
        // 初始化地图上下文
        mapCtx = uni.createMapContext('myMap', this)
        // 启用点聚合
        if (mapCtx && mapCtx.initMarkerCluster) {
            mapCtx.initMarkerCluster({
                enableDefaultStyle: true,
                zoomOnClick: true,
                gridSize: 60,
                complete: () => {
                    console.log('聚合初始化完成', " at pages/deviceList/deviceList.uvue:236")
                }
            })
        }
		
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_indexListMode = resolveEasyComponent("indexListMode",_easycom_indexListMode)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "全部设备",
      "show-back": true,
      backgroundColor: "#f1f1f1",
      textColor: "#333",
      showCapsule: true,
      isIcon: true,
      onCapsuleClick: showWhat,
      Icon: "grid",
      iconColor: iconColor.value
    }), null, 8 /* PROPS */, ["iconColor"]),
    isTrue(showMap.value)
      ? _cE("view", _uM({
          key: 0,
          class: "map-container"
        }), [
          _cV(_component_map, _uM({
            id: "myMap",
            markers: markers.value,
            scale: mapScale.value,
            style: _nS(_uM({"width":"100%","height":"100%"})),
            onMarkertap: handleTap,
            latitude: userLocation.value.latitude,
            longitude: userLocation.value.longitude,
            "enable-traffic": true
          }), null, 8 /* PROPS */, ["markers", "scale", "style", "latitude", "longitude"]),
          isTrue(showMap.value)
            ? _cE("view", _uM({
                key: 0,
                class: "right-bar"
              }), [
                _cE("view", _uM({
                  class: "allCar",
                  onClick: () => {changeState('全部状态')}
                }), "全部 " + _tD(totalCount.value), 9 /* TEXT, PROPS */, ["onClick"]),
                _cE("view", _uM({
                  class: "onlineCar",
                  onClick: () => {changeState('在线')}
                }), "在线 " + _tD(onlineCount.value), 9 /* TEXT, PROPS */, ["onClick"]),
                _cE("view", _uM({
                  class: "offlineCar",
                  onClick: () => {changeState('离线')}
                }), "离线 " + _tD(offlineCount.value), 9 /* TEXT, PROPS */, ["onClick"])
              ])
            : _cC("v-if", true)
        ])
      : _cE("view", _uM({ key: 1 }), [
          _cV(_component_indexListMode, _uM({
            lists: originalDeviceList.value,
            onUnbindDevice: unbindDevice
          }), null, 8 /* PROPS */, ["lists"])
        ])
  ])
}
}

})
export default __sfc__
const GenPagesDeviceListDeviceListStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["tool-nav", _uM([[".container ", _uM([["position", "absolute"], ["top", "200rpx"], ["right", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "35rpx"]])]])], ["btn-map-list", _uM([[".container .tool-nav ", _uM([["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "#1296db"], ["color", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["right-bar", _uM([[".container ", _uM([["position", "absolute"], ["top", "25rpx"], ["left", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["gap", "20rpx"]])]])], ["allCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#1296db"]])]])], ["onlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#0da117"]])]])], ["offlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#d81e06"]])]])]])]
