import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_sub_navBar from '@/components/sub-navBar/sub-navBar.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
	import { ref, reactive, onMounted, onUnmounted } from 'vue'
	import { getDevicePos } from '../../api/request.uts'
	import { getDeviceIcon } from '../../utils/cars'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	type CoordinatePoint = { __$originalPosition?: UTSSourceMapPosition<"CoordinatePoint", "pages/vehicleTracking/vehicleTracking.uvue", 43, 7>;
		latitude : number
		longitude : number
	}

	type AnimationQueueItem = { __$originalPosition?: UTSSourceMapPosition<"AnimationQueueItem", "pages/vehicleTracking/vehicleTracking.uvue", 48, 7>;
		position : CoordinatePoint
		rotation : number
		speed : number
		address : string
		connectionStatus : string
	}

	
const __sfc__ = defineComponent({
  __name: 'vehicleTracking',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const imei = ref<string>('')
	const connectionStatus = ref<string>('')
	const deviceId = ref<string>('')
	const deptId = ref<string>('')
	const carType = ref<string>('')

	// 地图状态
	const center = reactive({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const mapScale = ref(15)

	// 动画相关状态
	const isAnimating = ref(false)
	const animationTimer = ref<number | null>(null)
	const currentPosition = reactive<CoordinatePoint>({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const targetPosition = reactive<CoordinatePoint>({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const currentRotation = ref(0)
	const targetRotation = ref(0)

	// 动画队列管理
	const animationQueue = ref<Array<AnimationQueueItem>>([])
	const isProcessingQueue = ref(false)

	// 标记点集合
	const markers = ref<Array<Marker>>([])
	const markerInitialized = ref(false)
	let lastIconPath = ''
	let lastMarkerUpdateTime = 0
	const MARKER_UPDATE_INTERVAL = 100 // 降低标记点更新间隔，提高流畅度

	// 跟踪状态
	const isTracking = ref(false)
	const trackingInterval = ref<number | null>(null)
	const lastDirection = ref(0)

	// 当前车辆信息
	const currentSpeed = ref(0)
	const currentAddress = ref('获取中...')
	const currentTime = ref('1s')
	const currentCar = ref<string | null>('京A12345')

	const times = ref([
		[
			{ label: '1s', value: '1' },
			{ label: '5s', value: '5' },
			{ label: '10s', value: '10' },
			{ label: '20s', value: '20' },
		]
	])

	function handleCurrentTimeUpdate(value : string) : void {
		currentTime.value = value
	}

	function createVehicleMarker(iconPath : string) : Marker {
		return {
			id: 1,
			latitude: currentPosition.latitude,
			longitude: currentPosition.longitude,
			iconPath: iconPath,
			width: 25,
			height: 25,
			rotate: currentRotation.value,
			anchor: { x: 0.5, y: 0.5 },
			alpha: 1
		} as Marker
	}

	async function loadInitialPosition() {
		try {
			const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 134, 10),
				deptId: deptId.value,
				deviceids: imei.value
			}

			const res = await getDevicePos(data)
			if (res?.code == 0 && res.data && res.data.length > 0) {
				let foundDevice = false
				res.data.forEach((item : UTSJSONObject) => {
					const itemImei = item.getString('imei', '')
					if (itemImei == imei.value) {
						foundDevice = true

						const latitude = item.getNumber('latitude', 0)
						const longitude = item.getNumber('longitude', 0)
						if (latitude == 0 || longitude == 0) {
							showAppToast({
								title: '位置信息缺失',
								icon: 'none'
							})
							return
						}

						const direction = item.getNumber('direction', 0)
						const speed = item.getNumber('speed', 0)
						const positionUpdateTime = item.getString('positionUpdateTime', '定位时间未知')
						const status = item.getString('connectionStatus', 'unknown')
						// 转换坐标到腾讯地图坐标系
						const convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude)

						// 设置初始位置
						currentPosition.latitude = convertedCoord.lat
						currentPosition.longitude = convertedCoord.lng
						targetPosition.latitude = convertedCoord.lat
						targetPosition.longitude = convertedCoord.lng
						center.latitude = convertedCoord.lat
						center.longitude = convertedCoord.lng

						// 记录初始方向
						lastDirection.value = direction
						let initialRotation = lastDirection.value % 360
						if (initialRotation < 0) {
							initialRotation += 360
						}
						currentRotation.value = initialRotation
						targetRotation.value = currentRotation.value

						// 立即更新速度信息
						currentSpeed.value = speed
						currentAddress.value = positionUpdateTime
						connectionStatus.value = status

						// 设置初始标记点
						if (!markerInitialized.value) {
							const iconPath = getDeviceIcon(connectionStatus.value, carType.value)
							lastIconPath = iconPath
							markers.value = [createVehicleMarker(iconPath)]
							markerInitialized.value = true
						}
					}
				})

				if (!foundDevice) {
					showAppToast({
						title: '未找到车辆设备',
						icon: 'none'
					})
				}
			} else {
				showAppToast({
					title: '获取位置失败',
					icon: 'none'
				})
			}

		} catch (err) {
			console.error('获取初始位置失败:', err, " at pages/vehicleTracking/vehicleTracking.uvue:210")
			showAppToast({
				title: '网络请求失败',
				icon: 'none'
			})
		}
	}

	// 初始化标记点
	function initMarker() {
		if (markerInitialized.value) {
			return
		}

		const iconPath = getDeviceIcon(connectionStatus.value, carType.value)
		lastIconPath = iconPath

		const marker = createVehicleMarker(iconPath)

		markers.value = [marker]
		markerInitialized.value = true
		console.log('初始化标记点完成', " at pages/vehicleTracking/vehicleTracking.uvue:231")
	}

	// 计算地图上的旋转角度
	function calculateMapRotation(direction : number) : number {
		let rotation = direction
		if (rotation >= 360) rotation -= 360
		if (rotation < 0) rotation += 360
		return rotation
	}

	// 规范化旋转角度到0-360度
	function normalizeRotation(rotation : number) : number {
		let normalized = rotation % 360
		if (normalized < 0) {
			normalized += 360
		}
		return normalized
	}

	onLoad((option) => {
		console.log('option', option, " at pages/vehicleTracking/vehicleTracking.uvue:252")
		connectionStatus.value = option.connectionStatus ?? ''
		imei.value = option.imei ?? ''
		currentCar.value = option.plateNo ?? '未知车辆'
		deptId.value = option.deptId ?? ''
		carType.value = option.carType ?? ''
		loadInitialPosition()
	})

	// 计算两点间距离（米）
	const calculateDistance = (lat1 : number, lng1 : number, lat2 : number, lng2 : number) : number => {
		const R = 6371000
		const dLat = (lat2 - lat1) * Math.PI / 180
		const dLng = (lng2 - lng1) * Math.PI / 180
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLng/2) * Math.sin(dLng/2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
		return R * c
	}

	// 根据实际速度和距离计算动画时长
	const calculateRealisticAnimationDuration = (distance : number, speedKmh : number) : number => {
		if (speedKmh <= 0 || distance <= 0) {
			return 2000 // 静止状态使用固定时长
		}

		// 将速度从 km/h 转换为 m/s
		const speedMs = speedKmh / 3.6

		// 计算真实需要的时间
		const realTimeSeconds = distance / speedMs

		// 转换为毫秒，并限制在合理范围内
		let duration = realTimeSeconds * 1000

		// 限制最小和最大动画时长
		if (duration < 1000) duration = 1000 // 最小1秒
		if (duration > 15000) duration = 15000 // 最大15秒

		// 低速运动
		if (speedKmh < 10 && duration < 3000) {
			duration = 3000
		}

		return duration
	}

	// 计算最短旋转路径
	function calculateShortestRotation(from : number, to : number) : number {
		let diff = to - from
		if (diff > 180) {
			diff -= 360
		} else if (diff < -180) {
			diff += 360
		}
		return diff
	}

	// 更新标记点
	const updateMarkerSmooth = () => {
		if (markers.value.length == 0) {
			initMarker()
			return
		}

		const newIconPath = getDeviceIcon(connectionStatus.value, carType.value)
		const needUpdateIcon = newIconPath != lastIconPath

		// 创建新的标记点对象
		const updatedMarker = createVehicleMarker(needUpdateIcon ? newIconPath : lastIconPath)

		markers.value = [updatedMarker]

		if (needUpdateIcon) {
			lastIconPath = newIconPath
		}
	}


	// 开始位置动画
	const startPositionAnimation = (duration : number, onComplete : () => void) => {
		if (isAnimating.value && animationTimer.value != null) {
			clearInterval(animationTimer.value as number)
		}

		isAnimating.value = true
		const startTime = Date.now()
		const startLat = currentPosition.latitude
		const startLng = currentPosition.longitude
		const startRot = currentRotation.value

		const latDiff = targetPosition.latitude - startLat
		const lngDiff = targetPosition.longitude - startLng
		const rotDiff = calculateShortestRotation(startRot, targetRotation.value)

		// 使用更短的时间间隔
		const interval = 30
		let lastMarkerUpdate = startTime

		animationTimer.value = setInterval(() => {
			const now = Date.now()
			const elapsed = now - startTime
			const progress = Math.min(elapsed / duration, 1)

			// 使用线性运动，保持匀速
			const linearProgress = progress

			// 更新当前位置
			currentPosition.latitude = startLat + latDiff * linearProgress
			currentPosition.longitude = startLng + lngDiff * linearProgress
			currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress)

			// 更新地图中心点
			center.latitude = currentPosition.latitude
			center.longitude = currentPosition.longitude

			// 提高流畅度
			if (now - lastMarkerUpdate >= MARKER_UPDATE_INTERVAL || progress >= 1) {
				updateMarkerSmooth()
				lastMarkerUpdate = now
			}

			if (progress >= 1) {
				// 动画完成
				clearInterval(animationTimer.value as number)
				animationTimer.value = null
				isAnimating.value = false

				// 确保最终位置准确
				currentPosition.latitude = targetPosition.latitude
				currentPosition.longitude = targetPosition.longitude
				currentRotation.value = normalizeRotation(targetRotation.value)
				updateMarkerSmooth()
				onComplete()
			}
		}, interval) as number
	}


	// 处理动画队列
	function processAnimationQueue() : void {
		if (animationQueue.value.length == 0) {
			isProcessingQueue.value = false
			return
		}

		isProcessingQueue.value = true
		const nextAnimation = animationQueue.value[0]
		animationQueue.value.splice(0, 1)

		targetPosition.latitude = nextAnimation.position.latitude
		targetPosition.longitude = nextAnimation.position.longitude
		targetRotation.value = nextAnimation.rotation
		currentSpeed.value = nextAnimation.speed
		currentAddress.value = nextAnimation.address
		connectionStatus.value = nextAnimation.connectionStatus

		const distance = calculateDistance(
			currentPosition.latitude,
			currentPosition.longitude,
			targetPosition.latitude,
			targetPosition.longitude
		)
		const animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value)

		startPositionAnimation(animationDuration, () => {
			isProcessingQueue.value = false
			if (animationQueue.value.length > 0) {
				setTimeout(() => {
					processAnimationQueue()
				}, 50)
			}
		})
	}

	// 添加到动画队列
	const addToAnimationQueue = (animationData : AnimationQueueItem) : void => {
		if (animationQueue.value.length > 2) {
			animationQueue.value = animationQueue.value.slice(-1)
		}
		animationQueue.value.push(animationData)
		if (!isProcessingQueue.value && !isAnimating.value) {
			processAnimationQueue()
		}
	}

	// 请求位置数据
	const loadTrackData = async () => {
		try {
			const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 442, 10),
				deptId: deptId.value,
				deviceids: imei.value
			}

			const res = await getDevicePos(data)
			console.log('222222', " at pages/vehicleTracking/vehicleTracking.uvue:448")
			if (res?.code == 0 && res.data && res.data.length > 0) {
				const deviceData = res.data.find((item : UTSJSONObject) => item.getString('imei', '') == imei.value)
				if (deviceData != null) {
					const latitude = deviceData.getNumber('latitude', 0)
					const longitude = deviceData.getNumber('longitude', 0)
					const speed = deviceData.getNumber('speed', 0)
					const address = deviceData.getString('positionUpdateTime', '未知位置')
					const status = deviceData.getString('connectionStatus', 'unknown')
					const direction = deviceData.getNumber('direction', lastDirection.value)
					const convertedCoord = CoordTransform.wgs84ToTencent(latitude, longitude)

					const newDirection = direction

					const animationData : AnimationQueueItem = {
						position: {
							latitude: convertedCoord.lat,
							longitude: convertedCoord.lng
						},
						rotation: normalizeRotation(calculateMapRotation(newDirection)),
						speed: speed,
						address: address,
						connectionStatus: status
					}
					addToAnimationQueue(animationData)
					lastDirection.value = newDirection
				}
			}
		} catch (err) {
			console.error('获取跟踪位置失败:', err, " at pages/vehicleTracking/vehicleTracking.uvue:477")
		}
	}

	// 停止跟踪
	function stopTracking() : void {
		isTracking.value = false

		// 清除定时器
		if (trackingInterval.value != null) {
			clearInterval(trackingInterval.value as number)
			trackingInterval.value = null
		}

		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false

		if (animationTimer.value != null) {
			clearInterval(animationTimer.value as number)
			animationTimer.value = null
		}
		isAnimating.value = false

		showAppToast({
			title: '停止跟踪',
			icon: 'success',
			duration: 1500
		})
	}

	// 开始跟踪
	function startTracking() : void {
		if (!markerInitialized.value) {
			initMarker()
		}

		// 清理状态
		animationQueue.value = []
		isProcessingQueue.value = false

		const interval = 3000
		isTracking.value = true

		// 清除之前的定时器
		if (trackingInterval.value != null) {
			clearInterval(trackingInterval.value as number)
		}

		// 立即获取一次位置
		loadTrackData()

		// 设置定时器
		trackingInterval.value = setInterval(() => {
			loadTrackData()
		}, interval) as number

		showAppToast({
			title: '开始跟踪',
			icon: 'success',
			duration: 1500
		})
	}

	// 开始/停止跟踪
	const toggleTracking = () => {
		if (isTracking.value) {
			stopTracking()
		} else {
			startTracking()
		}
	}


	onHide(() => {
		console.log('页面隐藏时停止自动刷新', " at pages/vehicleTracking/vehicleTracking.uvue:552")
		isTracking.value = false

		// 清除定时器
		if (trackingInterval.value != null) {
			clearInterval(trackingInterval.value as number)
			trackingInterval.value = null
		}

		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false

		if (animationTimer.value != null) {
			clearInterval(animationTimer.value as number)
			animationTimer.value = null
		}
		isAnimating.value = false
	})

	onUnmounted(() => {
		console.log('页面卸载时停止自动刷新', " at pages/vehicleTracking/vehicleTracking.uvue:573")
		isTracking.value = false

		// 清除定时器
		if (trackingInterval.value != null) {
			clearInterval(trackingInterval.value as number)
			trackingInterval.value = null
		}

		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false

		if (animationTimer.value != null) {
			clearInterval(animationTimer.value as number)
			animationTimer.value = null
		}
		isAnimating.value = false
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_sub_navBar = resolveEasyComponent("sub-navBar",_easycom_sub_navBar)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "车辆跟踪",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "map-container" }), [
        _cV(_component_map, _uM({
          id: "myMap",
          latitude: center.latitude,
          longitude: center.longitude,
          markers: markers.value,
          scale: mapScale.value,
          style: _nS(_uM({"width":"100%","height":"100%"})),
          "show-location": false,
          "enable-traffic": true,
          "enable-overlooking": true,
          "enable-building": true,
          "enable-3D": true
        }), null, 8 /* PROPS */, ["latitude", "longitude", "markers", "scale", "style"]),
        _cV(_component_sub_navBar, _uM({
          class: "sub-nav-overlay",
          currentTime: currentTime.value,
          currentCar: currentCar.value,
          times: times.value,
          showCar: true,
          "onUpdate:currentTime": handleCurrentTimeUpdate,
          carStatus: connectionStatus.value
        }), null, 8 /* PROPS */, ["currentTime", "currentCar", "times", "carStatus"])
      ]),
      _cE("view", _uM({ class: "tools-panel" }), [
        _cE("view", _uM({ class: "btn" }), [
          _cV(_component_i_button, _uM({
            type: isTracking.value ? 'danger' : 'primary',
            size: "small",
            onClick: toggleTracking,
            style: _nS(_uM({backgroundColor: isTracking.value ? '#e64340' : '#1296db'})),
            text: isTracking.value ? '停止跟踪' : '开始跟踪'
          }), null, 8 /* PROPS */, ["type", "style", "text"])
        ]),
        _cE("view", _uM({ class: "pos-info-box" }), [
          _cE("view", _uM({ class: "speed" }), [
            _cE("text", _uM({ class: "tracking-info-text" }), "时速："),
            _cE("text", _uM({ class: "tracking-info-text" }), _tD(currentSpeed.value) + "Km/h", 1 /* TEXT */)
          ]),
          _cE("view", _uM({ class: "address" }), [
            _cE("text", _uM({ class: "tracking-info-text" }), "定位时间："),
            _cE("text", _uM({ class: "tracking-info-text" }), _tD(currentAddress.value), 1 /* TEXT */)
          ])
        ])
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesVehicleTrackingVehicleTrackingStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["sub-nav-overlay", _uM([[".container .map-container ", _uM([["position", "absolute"], ["top", 0], ["left", 0], ["right", 0], ["zIndex", 100]])]])], ["tools-panel", _uM([[".container ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "40rpx"], ["display", "flex"], ["flexDirection", "column"], ["boxShadow", "0 -2px 10px rgba(0, 0, 0, 0.1)"]])]])], ["btn", _uM([[".container .tools-panel ", _uM([["marginBottom", "20rpx"]])]])], ["pos-info-box", _uM([[".container .tools-panel ", _uM([["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", "10rpx"], ["paddingLeft", 0]])]])], ["speed", _uM([[".container .tools-panel .pos-info-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["paddingTop", "8rpx"], ["paddingRight", 0], ["paddingBottom", "8rpx"], ["paddingLeft", 0]])]])], ["address", _uM([[".container .tools-panel .pos-info-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["paddingTop", "8rpx"], ["paddingRight", 0], ["paddingBottom", "8rpx"], ["paddingLeft", 0]])]])], ["tracking-info-text", _uM([[".container ", _uM([["fontSize", "28rpx"]])]])]])]
