import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_tag from '@/uni_modules/i-ui-x/components/i-tag/i-tag.uvue'
import _easycom_indexListMode from '@/components/indexListMode/indexListMode.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { isBusinessSuccessCode } from '../../api/response.uts'
import { showAppToast } from '../../utils/toast.uts'
	import { ref, computed, watchEffect, getCurrentInstance } from 'vue'
	import { getUserDeviceList,delDevice} from '../../api/request.uts'
	import CoordTransform from '../../utils/coordTransform.uts'
	import { getDeviceIcon } from '../../utils/cars'
	import { DeviceItem } from '../../utils/device.uts'

	type OverlapAnalysis = {
		groupOfIndex : Array<number>   // 每个设备所属的重合组编号，-1 表示不与他人重合
		orderOfIndex : Array<number>   // 设备在组内的序号，决定展开角度
		groups : Array<Array<number>>  // 每个重合组的成员在 devices 中的下标
	}

	// 把间距过近的设备聚成一组（链式聚合：A 近 B、B 近 C 时三者同组）
	
const __sfc__ = defineComponent({
  __name: 'deviceList',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const mapScale = ref(4)
	const showMap = ref(true)
	const markers = ref<Array<Marker>>([])
	const iconColor = ref('#1296db')
	const userLocation = ref({
		latitude: 0,
		longitude: 0
	})

	// ===== 重合设备展开显示 =====
	// 多台设备经纬度重合或仅差几米时，即使把缩放放到最大，车标也会完全叠在一起，
	// 表现为"只能看到一台、另一台点不到"。处理办法是把间距过小的设备成组后按环形做微小偏移：
	// 偏移量按参考缩放级别折算 —— 放大到该级别时刚好完全分开，缩小后偏移不足 1 像素、视觉无影响，
	// 因此不会让正常点位的显示位置失真。
	const OVERLAP_THRESHOLD_METERS = 12.0     // 间距小于该值（米）即视为重合，需要展开
	const SPREAD_REFERENCE_ZOOM = 19.0        // 偏移量折算所依据的缩放级别
	const SPREAD_RADIUS_PX = 26.0             // 环形展开半径（像素，@SPREAD_REFERENCE_ZOOM）
	const DEGREE_PER_METER_LAT = 1.0 / 111320.0  // 1 米对应的纬度度数，用于分组前的快速粗筛

	// 重合设备选择弹层
	const showOverlapPicker = ref(false)
	const overlapDevices = ref<Array<UTSJSONObject>>([])
	// 弹层最大高度（px）：uvue 的 max-height 不支持百分比，只能按屏幕高度换算成像素
	const overlapPanelMaxHeight = ref(600)

	const updateOverlapPanelMaxHeight = () => {
		const systemInfo = uni.getSystemInfoSync()
		const windowHeight = systemInfo.windowHeight != null ? systemInfo.windowHeight : 600
		// 弹层最多占屏幕高度的 60%，保证上方遮罩仍可点击关闭
		overlapPanelMaxHeight.value = Math.floor(windowHeight * 0.6)
	}

	// ===== 车标点聚合 =====
	// 仅微信小程序端提供原生点聚合（MapContext.initMarkerCluster）
	// 注意：参与聚合的车标必须通过 MapContext.addMarkers 添加，组件的 markers 属性不会进入聚合器
	// App 端 uni-app x 的 map 组件未暴露聚合能力，保持普通标记点渲染




































































































	// 小程序端车标由 MapContext.addMarkers 交给聚合器管理，组件的 markers 属性置空
	// 用固定引用，避免数据更新时触发 markers 属性 setData 把聚合器里的车标清掉
	const EMPTY_MARKERS : Array<Marker> = []
	const mapMarkers = computed<Array<Marker>>(() => {
		let result : Array<Marker> = markers.value



		return result
	})

	const pickerStateTitle = ref('全部状态')

	// 切换显示模式
	const showWhat = () => {
		showMap.value = !showMap.value










	}

	// 原始设备列表
	const originalDeviceList = ref<Array<UTSJSONObject>>([])

	const deviceListItems = computed((): Array<DeviceItem> => {
		return originalDeviceList.value.map((item: UTSJSONObject): DeviceItem => {
			const deviceNo = item.getString('deviceNo', '')
			const rawDeviceName = item.getString('deviceName', '')
			return {
				plateNo: item.getString('plateNo', ''),
				deviceNo: deviceNo,
				status: item.getNumber('status', 0),
				companyId: item.getString('companyId', ''),
				deviceName: rawDeviceName != '' ? rawDeviceName : deviceNo,
				deviceId: item.getString('deviceId', ''),
				iccid: item.getString('iccid', ''),
				simMerchant: item.getString('simMerchant', ''),
				connectionStatus: item.getString('connectionStatus', '')
			}
		})
	})

	// 计算属性 筛选逻辑
	const filteredDevices = computed((): Array<UTSJSONObject> => {
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





	// 坐标统一转成数字，非法值返回 NaN
	const parseCoordinate = (value : string | number | null) : number => {
		if (value == null) return NaN
		return parseFloat(value.toString())
	}

	// 两点间球面距离（米）
	const distanceMeters = (lat1 : number, lng1 : number, lat2 : number, lng2 : number) : number => {
		const earthRadius = 6371000.0
		const radLat1 = lat1 * Math.PI / 180.0
		const radLat2 = lat2 * Math.PI / 180.0
		const deltaLat = (lat2 - lat1) * Math.PI / 180.0
		const deltaLng = (lng2 - lng1) * Math.PI / 180.0
		const sinLat = Math.sin(deltaLat / 2.0)
		const sinLng = Math.sin(deltaLng / 2.0)
		const a = sinLat * sinLat + Math.cos(radLat1) * Math.cos(radLat2) * sinLng * sinLng
		const clamped = a > 1.0 ? 1.0 : a
		return 2.0 * earthRadius * Math.atan2(Math.sqrt(clamped), Math.sqrt(1.0 - clamped))
	}

	const analyzeOverlap = (devices : Array<UTSJSONObject>) : OverlapAnalysis => {
		const count = devices.length
		const lats : Array<number> = []
		const lngs : Array<number> = []
		const valid : Array<boolean> = []
		const groupOfIndex : Array<number> = []
		const orderOfIndex : Array<number> = []
		const visited : Array<boolean> = []
		for (let i = 0; i < count; i++) {
			const lat = parseCoordinate(devices[i]['latitude'] as string | number | null)
			const lng = parseCoordinate(devices[i]['longitude'] as string | number | null)
			lats.push(lat)
			lngs.push(lng)
			valid.push(!isNaN(lat) && !isNaN(lng))
			groupOfIndex.push(-1)
			orderOfIndex.push(0)
			visited.push(false)
		}

		const groups : Array<Array<number>> = []
		const latLimit = OVERLAP_THRESHOLD_METERS * DEGREE_PER_METER_LAT

		for (let i = 0; i < count; i++) {
			if (visited[i] || !valid[i]) continue
			visited[i] = true
			const members : Array<number> = [i]
			let head = 0
			while (head < members.length) {
				const current = members[head]
				head++
				for (let j = 0; j < count; j++) {
					if (visited[j] || !valid[j]) continue
					// 先用纬度差粗筛，避免对大量设备逐一做三角函数运算
					if (Math.abs(lats[j] - lats[current]) > latLimit) continue
					if (distanceMeters(lats[current], lngs[current], lats[j], lngs[j]) < OVERLAP_THRESHOLD_METERS) {
						visited[j] = true
						members.push(j)
					}
				}
			}
			if (members.length > 1) {
				const groupId = groups.length
				for (let k = 0; k < members.length; k++) {
					groupOfIndex[members[k]] = groupId
					orderOfIndex[members[k]] = k
				}
				groups.push(members)
			}
		}

		return {
			groupOfIndex: groupOfIndex,
			orderOfIndex: orderOfIndex,
			groups: groups
		} as OverlapAnalysis
	}

	const updateMarkers = (devices: Array<UTSJSONObject>): void => {
		const analysis = analyzeOverlap(devices)
		// 展开偏移量：不同缩放级别下 1 像素对应的经纬度范围不同，
		// 这里按参考缩放级别折算，保证放大到 SPREAD_REFERENCE_ZOOM 时组内设备恰好完全分开
		const degreePerPixel = 360.0 / (256.0 * Math.pow(2.0, SPREAD_REFERENCE_ZOOM))
		const nextMarkers: Array<Marker> = []
		for (let index = 0; index < devices.length; index++) {
			const device = devices[index]
			const lat = parseCoordinate(device['latitude'] as string | number | null)
			const lng = parseCoordinate(device['longitude'] as string | number | null)
			if (isNaN(lat) || isNaN(lng)) continue
			const connectionStatus = (device['connectionStatus'] as string | null) ?? ''
			const carType = (device['carType'] as string | null) ?? ''
			const idValue = device['deviceId'] as string | number | null
			const parsedId = idValue != null ? parseInt(idValue.toString()) : NaN
			const markerId = isNaN(parsedId) ? index + 1 : parsedId
			const deviceName = (device['deviceName'] as string | null) ?? (device['plateNo'] as string | null) ?? '设备'

			// 重合组内的设备按环形做微小偏移，使其在最大缩放下可以分别看到与点击
			let displayLat = lat
			let displayLng = lng
			const groupId = analysis.groupOfIndex[index]
			if (groupId >= 0) {
				const members = analysis.groups[groupId]
				let sumLat = 0.0
				let sumLng = 0.0
				for (let k = 0; k < members.length; k++) {
					sumLat += parseCoordinate(devices[members[k]]['latitude'] as string | number | null)
					sumLng += parseCoordinate(devices[members[k]]['longitude'] as string | number | null)
				}
				const centerLat = sumLat / members.length
				const centerLng = sumLng / members.length
				// 组内成员越多，环半径越大，避免相邻车标仍然紧贴；但设上限，
				// 避免大量设备重合时偏移过大、显示位置严重偏离真实位置（这种情况改用弹层列表选择）
				const radiusRatio = Math.min(4.0, Math.max(1.0, members.length * 1.0 / 2.0))
				const radiusPixel = SPREAD_RADIUS_PX * radiusRatio
				const deltaLng = radiusPixel * degreePerPixel
				const deltaLat = deltaLng * Math.cos(centerLat * Math.PI / 180.0)
				// 从正右方起逆时针均分角度：两台设备时水平左右展开，气泡不会上下互相遮挡
				const angle = 2.0 * Math.PI * analysis.orderOfIndex[index] / members.length
				displayLat = centerLat + deltaLat * Math.cos(angle)
				displayLng = centerLng + deltaLng * Math.sin(angle)
			}

			nextMarkers.push({
				id: markerId,
				latitude: displayLat,
				longitude: displayLng,
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
				anchor: { x: 0.5, y: 0.5 }
			} as Marker)
		}
		markers.value = nextMarkers





		if (nextMarkers.length > 0 && userLocation.value.latitude == 0 && userLocation.value.longitude == 0) {
			const firstMarker = nextMarkers[0]
			userLocation.value.latitude = firstMarker.latitude
			userLocation.value.longitude = firstMarker.longitude
		}
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
				const params: UTSJSONObject = { pageSize: 1000 } as UTSJSONObject
				const res = await getUserDeviceList(params)
				const list = (isBusinessSuccessCode(res.code) && res.data != null ? res.data.list : null) as Array<UTSJSONObject> | null
				if (list == null || !Array.isArray(list)) {
					console.warn('获取设备列表返回异常:', res)
					originalDeviceList.value = []
					markers.value = []
					return
				}
				deviceList = list ?? []
			}
			if (!Array.isArray(deviceList)) deviceList = []
			originalDeviceList.value = CoordTransform.batchConvertCoordinates(deviceList, 'tencent')
			updateMarkers(originalDeviceList.value)
		} catch (err) {
			console.error('获取设备列表失败:', err)
			originalDeviceList.value = []
			markers.value = []
			showAppToast({ title: '获取设备列表失败', icon: 'none' })
		}
	}
		// 解绑设备
	const unbindDevice = async (deviceId : string) => {
		const res = await delDevice(deviceId)
		if (isBusinessSuccessCode(res.code)) {
			showAppToast({
				title: res.msg || '解绑成功',
				icon: 'success'
			})
			uni.setStorageSync('needRefreshHome', true)
		} else {
			showAppToast({
				title: res.msg || '解绑失败',
				icon: 'error'
			})
		}
		// 解绑成功后刷新设备列表
		await loadUserDeviceList([],true)
	}

	// 设备告警订阅已由硬件设备长期订阅能力承接，入口在首页「车辆告警通知」行
	// 实现见 utils/deviceSubscribe.uts（wx.requestSubscribeDeviceMessage，按设备 sn 授权）

	// 切换筛选状态
	const changeState= (type : string) => {
		pickerStateTitle.value = type
	}

	// 设备展示名称：优先车牌号，其次设备名，最后回退到设备号
	const deviceDisplayName = (device : UTSJSONObject) : string => {
		const plateNo = (device['plateNo'] as string | null) ?? ''
		if (plateNo != '') return plateNo
		const deviceName = (device['deviceName'] as string | null) ?? ''
		if (deviceName != '') return deviceName
		const deviceNo = (device['deviceNo'] as string | null) ?? ''
		return deviceNo != '' ? deviceNo : '设备'
	}

	const isDeviceOnline = (device : UTSJSONObject) : boolean => {
		return (device['connectionStatus'] as string | null) == 'online'
	}

	// 跳转设备详情
	const openDeviceDetail = (device : UTSJSONObject) => {
		const deviceNoValue = (device['deviceNo'] as string | null) ?? ''
		const companyId = (device['companyId'] as string | number | null) ?? ''
		const deviceId = (device['deviceId'] as string | number | null) ?? ''
		uni.navigateTo({
			url: '/pages/carInfoDetail/carInfoDetail?deviceNo=' + deviceNoValue + '&deptId=' + companyId.toString() + '&deviceId=' + deviceId.toString()
		})
	}

	// 点击弹层本体（而非遮罩）时不关闭弹层
	const keepOverlapPicker = () => {
	}

	const closeOverlapPicker = () => {
		showOverlapPicker.value = false
		overlapDevices.value = []
	}

	const selectOverlapDevice = (device : UTSJSONObject) => {
		closeOverlapPicker()
		openDeviceDetail(device)
	}

	// 点击地图标记
	const handleTap = (event: any) => {
		const detail = event as UTSJSONObject
		const markerId = detail != null ? detail['markerId'] : null
		if (markerId == null) return

		// 地图渲染的是筛选后的集合，这里必须用同一集合分析，否则弹层会混入未在地图上显示的设备
		const list = filteredDevices.value
		let selectedIndex = -1
		for (let i = 0; i < list.length; i++) {
			const idValue = list[i]['deviceId'] as string | number | null
			if (idValue != null && idValue.toString() == markerId.toString()) {
				selectedIndex = i
				break
			}
		}
		if (selectedIndex < 0) {
			console.warn('未找到对应的设备信息', markerId)
			return
		}

		// 该位置若有多台重合设备，先让用户选择查看哪一台 —— 车标被遮挡时也能点开压在下面的那台
		const analysis = analyzeOverlap(list)
		const groupId = analysis.groupOfIndex[selectedIndex]
		if (groupId >= 0) {
			const members = analysis.groups[groupId]
			if (members.length > 1) {
				const candidates : Array<UTSJSONObject> = []
				for (let k = 0; k < members.length; k++) {
					candidates.push(list[members[k]])
				}
				overlapDevices.value = candidates
				updateOverlapPanelMaxHeight()
				showOverlapPicker.value = true
				return
			}
		}

		openDeviceDetail(list[selectedIndex])
	}

	onReady(() => {




	})

	onLoad((options) => {
		loadUserDeviceList([], true)
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_i_tag = resolveEasyComponent("i-tag",_easycom_i_tag)
const _component_indexListMode = resolveEasyComponent("indexListMode",_easycom_indexListMode)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "全部设备",
        "show-back": true,
        backgroundColor: "#f1f1f1",
        textColor: "#333",
        showCapsule: true,
        isIcon: true,
        onCapsuleClick: showWhat,
        Icon: "/static/allDevice.png",
        iconColor: iconColor.value
      }), null, 8 /* PROPS */, ["iconColor"]),
      isTrue(showMap.value)
        ? _cE("view", _uM({
            key: 0,
            class: "map-container"
          }), [
            _cV(_component_map, _uM({
              id: "myMap",
              scale: mapScale.value,
              style: _nS(_uM({"width":"100%","height":"100%"})),
              onMarkertap: handleTap,
              latitude: userLocation.value.latitude,
              longitude: userLocation.value.longitude,
              markers: mapMarkers.value,
              "enable-traffic": true
            }), null, 8 /* PROPS */, ["scale", "style", "latitude", "longitude", "markers"]),
            isTrue(showMap.value)
              ? _cE("view", _uM({
                  key: 0,
                  class: "right-bar"
                }), [
                  _cV(_component_i_tag, _uM({
                    type: "primary",
                    onClick: () => {changeState('全部')},
                    text: `全部 ${totalCount.value}`
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
              lists: deviceListItems.value,
              onUnbindDevice: unbindDevice
            }), null, 8 /* PROPS */, ["lists"])
          ]),
      isTrue(showOverlapPicker.value)
        ? _cE("view", _uM({
            key: 2,
            class: "overlap-mask",
            onClick: closeOverlapPicker
          }), [
            _cE("view", _uM({
              class: "overlap-panel",
              style: _nS(_uM({ maxHeight: overlapPanelMaxHeight.value + 'px' })),
              onClick: withModifiers(keepOverlapPicker, ["stop"])
            }), [
              _cE("view", _uM({ class: "overlap-title" }), "此处有 " + _tD(overlapDevices.value.length) + " 台设备", 1 /* TEXT */),
              _cE("scroll-view", _uM({
                class: "overlap-list",
                "scroll-y": "true"
              }), [
                _cE(Fragment, null, RenderHelpers.renderList(overlapDevices.value, (device, index, __index, _cached): any => {
                  return _cE("view", _uM({
                    key: index,
                    class: "overlap-item",
                    onClick: () => {selectOverlapDevice(device)}
                  }), [
                    _cE("text", _uM({ class: "overlap-item-name" }), _tD(deviceDisplayName(device)), 1 /* TEXT */),
                    _cE("text", _uM({
                      class: _nC(["overlap-item-status", isDeviceOnline(device) ? 'status-online' : 'status-offline'])
                    }), _tD(isDeviceOnline(device) ? '在线' : '离线'), 3 /* TEXT, CLASS */)
                  ], 8 /* PROPS */, ["onClick"])
                }), 128 /* KEYED_FRAGMENT */)
              ])
            ], 4 /* STYLE */)
          ])
        : _cC("v-if", true)
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesDeviceListDeviceListStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["tool-nav", _uM([[".container ", _uM([["position", "absolute"], ["top", "200rpx"], ["right", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "35rpx"]])]])], ["btn-map-list", _uM([[".container .tool-nav ", _uM([["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "#1296db"], ["color", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["right-bar", _uM([[".container ", _uM([["position", "absolute"], ["top", "25rpx"], ["left", "20rpx"], ["zIndex", 100], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["status-spacing", _uM([[".container .right-bar ", _uM([["marginLeft", "20rpx"]])]])], ["allCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#1296db"]])]])], ["onlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#0da117"]])]])], ["offlineCar", _uM([[".container .right-bar ", _uM([["backgroundColor", "#d81e06"]])]])], ["overlap-mask", _uM([[".container ", _uM([["position", "fixed"], ["top", 0], ["left", 0], ["right", 0], ["bottom", 0], ["zIndex", 999], ["backgroundColor", "rgba(0,0,0,0.45)"], ["display", "flex"], ["flexDirection", "column"], ["justifyContent", "flex-end"]])]])], ["overlap-panel", _uM([[".container ", _uM([["width", "100%"], ["maxHeight", "900rpx"], ["paddingTop", "24rpx"], ["paddingRight", 0], ["paddingBottom", "40rpx"], ["paddingLeft", 0], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["display", "flex"], ["flexDirection", "column"]])]])], ["overlap-title", _uM([[".container ", _uM([["paddingTop", "12rpx"], ["paddingRight", 0], ["paddingBottom", "20rpx"], ["paddingLeft", 0], ["fontSize", "30rpx"], ["fontWeight", 600], ["color", "#333333"], ["textAlign", "center"]])]])], ["overlap-list", _uM([[".container ", _uM([["maxHeight", "700rpx"]])]])], ["overlap-item", _uM([[".container ", _uM([["paddingTop", "28rpx"], ["paddingRight", "32rpx"], ["paddingBottom", "28rpx"], ["paddingLeft", "32rpx"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["borderTopWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderTopColor", "#f0f0f0"]])]])], ["overlap-item-name", _uM([[".container ", _uM([["fontSize", "30rpx"], ["color", "#333333"]])]])], ["overlap-item-status", _uM([[".container ", _uM([["fontSize", "26rpx"]])]])], ["status-online", _uM([[".container ", _uM([["color", "#0da117"]])]])], ["status-offline", _uM([[".container ", _uM([["color", "#999999"]])]])]])]
