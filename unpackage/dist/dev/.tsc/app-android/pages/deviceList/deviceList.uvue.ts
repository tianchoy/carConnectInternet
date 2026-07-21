import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_tag from '@/uni_modules/i-ui-x/components/i-tag/i-tag.uvue'
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
	const markers = ref<Array<UTSJSONObject>>([])
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
	const originalDeviceList = ref<Array<UTSJSONObject>>([])

	// 计算属性 筛选逻辑
	const filteredDevices = computed(() => {
		if (!Array.isArray(originalDeviceList.value)) return []

		let result = [...originalDeviceList.value]

		// 状态筛选
		if (pickerStateTitle.value == '在线') {
			result = result.filter((device: UTSJSONObject) => device['connectionStatus'] == 'online')
		} else if (pickerStateTitle.value === '离线') {
			result = result.filter((device: UTSJSONObject) => device['connectionStatus'] == 'offline')
		}

		return result
	})

	// 计算设备数量统计
	const totalCount = computed(() => originalDeviceList.value.length)
	const onlineCount = computed(() => originalDeviceList.value.filter((d: UTSJSONObject) => d['connectionStatus'] == 'online').length)
	const offlineCount = computed(() => totalCount.value - onlineCount.value)





	const updateMarkers = (devices: Array<UTSJSONObject>): void => {
		const nextMarkers: Array<UTSJSONObject> = []
		for (let index = 0; index < devices.length; index++) {
			const device = devices[index]
			const latitude = device['latitude'] as string | number | null
			const longitude = device['longitude'] as string | number | null
			if (latitude == null || longitude == null) continue
			const lat = parseFloat(latitude.toString())
			const lng = parseFloat(longitude.toString())
			if (isNaN(lat) || isNaN(lng)) continue
			const connectionStatus = (device['connectionStatus'] as string | null) ?? ''
			const carType = (device['carType'] as string | null) ?? ''
			const idValue = device['deviceId'] as string | number | null
			const parsedId = idValue != null ? parseInt(idValue.toString()) : NaN
			const markerId = isNaN(parsedId) ? index + 1 : parsedId
			const deviceName = (device['deviceName'] as string | null) ?? (device['plateNo'] as string | null) ?? '设备'
			nextMarkers.push({
				id: markerId,
				latitude: lat,
				longitude: lng,
				iconPath: getDeviceIcon(connectionStatus, carType),
				width: 30,
				height: 30,
				callout: {
					content: deviceName,
					display: 'ALWAYS',
					padding: 8,
					borderRadius: 8,
					bgColor: '#ffffff'
				},
				joinCluster: true,
				anchor: { x: 0.5, y: 0.5 }
			} as UTSJSONObject)
		}
		markers.value = nextMarkers
	}
	watchEffect(() => {
		if (showMap.value) {
			updateMarkers(filteredDevices.value)
		}
	})

	const loadUserDeviceList = async (data: Array<UTSJSONObject>, from: boolean): Promise<void> => {
		try {
			let deviceList: Array<UTSJSONObject> = data
			if (from) {
				const params: UTSJSONObject = { __$originalPosition: new UTSSourceMapPosition("params", "pages/deviceList/deviceList.uvue", 118, 11),  pageSize: 1000 } as UTSJSONObject
				const res = await getUserDeviceList(params)
				deviceList = res.data.list
			}
			originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, 'tencent')
			updateMarkers(originalDeviceList.value)
		} catch (err) {
			console.error('获取设备列表失败:', err, " at pages/deviceList/deviceList.uvue:125")
			uni.showToast({ title: '获取设备列表失败', icon: 'none' })
		}
	}
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
				console.log('获取位置成功:', res, " at pages/deviceList/deviceList.uvue:152")
				userLocation.value.latitude = res.latitude
				userLocation.value.longitude = res.longitude
			},
			fail: (err) => {
				console.log('获取位置失败:', err, " at pages/deviceList/deviceList.uvue:157")
			}
		})
	}
	// 订阅消息
	const subMsg = () => {
		console.log('订阅消息', " at pages/deviceList/deviceList.uvue:163")
		uni.requestSubscribeMessage({
			tmplIds: ['VRR0UEO9VJOLs0MHlU0OilqX6MVFDwH3_3gz3Oc0NIc'],
			success: (res) => {
				console.log('订阅成功:', res, " at pages/deviceList/deviceList.uvue:167")
			},
			fail: (err) => {
				console.log('订阅失败:', err, " at pages/deviceList/deviceList.uvue:170")
			}
		})
	}

	// 切换筛选状态
	const changeState= (type : string) => {
		pickerStateTitle.value = type
	}

	// 点击地图标记
	const handleTap = (event: any) => {
		const detail = event as UTSJSONObject
		const markerId = detail != null ? detail['markerId'] : null
		const selectedDevice = originalDeviceList.value.find((device: UTSJSONObject) => device['deviceId'] == markerId)
		if (selectedDevice == null) {
			console.warn('未找到对应的设备信息', markerId, " at pages/deviceList/deviceList.uvue:186")
			return
		}
		const imeiValue = (selectedDevice['imei'] as string | null) ?? ''
		const companyId = (selectedDevice['companyId'] as string | number | null) ?? ''
		const deviceId = (selectedDevice['deviceId'] as string | number | null) ?? ''
		uni.navigateTo({
			url: '/pages/carInfoDetail/carInfoDetail?imei=' + imeiValue + '&deptId=' + companyId.toString() + '&deviceId=' + deviceId.toString()
		})
	}



	// 加载用户设备列表


	onLoad((options) => {
		getLocation()
		loadUserDeviceList([], true)
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_i_tag = resolveEasyComponent("i-tag",_easycom_i_tag)
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
      Icon: "/static/maps.png",
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
                _cV(_component_i_tag, _uM({
                  type: "primary",
                  onClick: () => {changeState('在线')},
                  text: `在线 ${onlineCount.value}`
                }), null, 8 /* PROPS */, ["onClick", "text"]),
                _cV(_component_i_tag, _uM({
                  type: "success",
                  onClick: () => {changeState('在线')},
                  text: `在线 ${onlineCount.value}`
                }), null, 8 /* PROPS */, ["onClick", "text"]),
                _cV(_component_i_tag, _uM({
                  type: "danger",
                  onClick: () => {changeState('离线')},
                  text: `离线 ${offlineCount.value}`
                }), null, 8 /* PROPS */, ["onClick", "text"])
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
const GenPagesDeviceListDeviceListStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["tool-nav", _uM([[".container ", _uM([["position", "absolute"], ["top", "200rpx"], ["right", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "35rpx"]])]])], ["btn-map-list", _uM([[".container .tool-nav ", _uM([["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "#1296db"], ["color", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["right-bar", _uM([[".container ", _uM([["position", "absolute"], ["top", "25rpx"], ["left", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["status-spacing", _uM([[".container .right-bar ", _uM([["marginLeft", "20rpx"]])]])], ["allCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#1296db"]])]])], ["onlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#0da117"]])]])], ["offlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#d81e06"]])]])]])]
