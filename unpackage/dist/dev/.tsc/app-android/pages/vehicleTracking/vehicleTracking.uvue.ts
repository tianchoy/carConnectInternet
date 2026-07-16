import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_sub_navBar from '@/components/sub-navBar/sub-navBar.uvue'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
	import { getDevicePos } from '../../api/request.uts'
	import { getDeviceIcon } from '../../utils/cars'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	
const __sfc__ = defineComponent({
  __name: 'vehicleTracking',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const imei = ref<string | null>('')
	const connectionStatus = ref<string | null>('')
	const deviceId = ref<string | null>('')
	const deptId = ref<string | null>('')
	const carType = ref<string | null>('')
	
	// 地图状态
	const center = reactive({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const mapScale = ref(15)

	// 动画相关状态
	const isAnimating = ref(false)
	const animationTimer = ref<number | null>(null)
	const currentPosition = reactive({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const targetPosition = reactive({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const currentRotation = ref(0)
	const targetRotation = ref(0)
	
	// 动画队列管理
	const animationQueue = ref<Array<any>>([])
	const isProcessingQueue = ref(false)

	// 标记点集合
	const markers = ref<Array<any>>([])
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

	onLoad((option) => {
		connectionStatus.value = option.connectionStatus || ''
		imei.value = option.imei || ''
		currentCar.value = option.plateNo || '未知车辆'
		deptId.value = option.deptId || ''
		carType.value = option.carType || ''
		
		loadInitialPosition()
	})

	const loadInitialPosition = async () => {
		try {
			const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 112, 10), 
				deptId: deptId.value, 
				deviceids: imei.value 
			}
			
			const res = await getDevicePos(data)
			
			if (res?.code === 0 && res.data && res.data.length > 0) {
				let foundDevice = false
				res.data.forEach((item : any) => {
					if (item.imei == imei.value) {
						foundDevice = true
						
						if (!item.latitude || !item.longitude) {
							uni.showToast({
								title: '位置信息缺失',
								icon: 'none'
							})
							return
						}
						
						const deviceData = item
						// 转换坐标到腾讯地图坐标系
						const convertedCoord = CoordTransform.wgs84ToTencent(
							Number(deviceData.latitude),
							Number(deviceData.longitude)
						)
						
						// 设置初始位置
						currentPosition.latitude = convertedCoord.lat
						currentPosition.longitude = convertedCoord.lng
						targetPosition.latitude = convertedCoord.lat
						targetPosition.longitude = convertedCoord.lng
						center.latitude = convertedCoord.lat
						center.longitude = convertedCoord.lng

						// 记录初始方向
						lastDirection.value = deviceData.direction || 0
						currentRotation.value = normalizeRotation(calculateMapRotation(lastDirection.value))
						targetRotation.value = currentRotation.value
						
						// 立即更新速度信息
						currentSpeed.value = deviceData.speed || 0
						currentAddress.value = deviceData.positionUpdateTime || '定位时间未知'
						connectionStatus.value = deviceData.connectionStatus || 'unknown'
						
						// 设置初始标记点
						initMarker()
					}
				})
				
				if (!foundDevice) {
					uni.showToast({
						title: '未找到车辆设备',
						icon: 'none'
					})
				}
			} else {
				uni.showToast({
					title: res?.message || '获取位置失败',
					icon: 'none'
				})
			}

		} catch (err) {
			console.error('获取初始位置失败:', err, " at pages/vehicleTracking/vehicleTracking.uvue:177")
			uni.showToast({
				title: '网络请求失败',
				icon: 'none'
			})
		}
	}

	// 初始化标记点
	const initMarker = () => {
		if (markerInitialized.value) {
			return
		}
		
		const iconPath = getDeviceIcon(connectionStatus.value, carType.value)
		lastIconPath = iconPath
		
		const marker = {__$originalPosition: new UTSSourceMapPosition("marker", "pages/vehicleTracking/vehicleTracking.uvue", 194, 9),
			id: 1,
			latitude: currentPosition.latitude,
			longitude: currentPosition.longitude,
			iconPath: iconPath,
			width: 25,
			height: 25,
			rotate: currentRotation.value,
			anchor: { x: 0.5, y: 0.5 },
			alpha: 1,
			fixed: false
		}
		
		markers.value = [marker]
		markerInitialized.value = true
		console.log('初始化标记点完成', " at pages/vehicleTracking/vehicleTracking.uvue:209")
	}

	// 计算地图上的旋转角度
	const calculateMapRotation = (direction : number) : number => {
		let rotation = direction
		if (rotation >= 360) rotation -= 360
		if (rotation < 0) rotation += 360
		return rotation
	}

	// 规范化旋转角度到0-360度
	const normalizeRotation = (rotation : number) : number => {
		let normalized = rotation % 360
		if (normalized < 0) {
			normalized += 360
		}
		return normalized
	}

	// 请求位置数据
	const loadTrackData = async () => {
		try {
			const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/vehicleTracking/vehicleTracking.uvue", 232, 10),
				deptId: deptId.value,  
				deviceids: imei.value 
			}
			
			const res = await getDevicePos(data)
			console.log('222222', " at pages/vehicleTracking/vehicleTracking.uvue:238")
			if (res?.code === 0 && res.data && res.data.length > 0) {
				const deviceData = res.data.find((item : any) => item.imei == imei.value)
				
				if (deviceData) {
					// 转换坐标到腾讯地图坐标系
					const convertedCoord = CoordTransform.wgs84ToTencent(
						Number(deviceData.latitude),
						Number(deviceData.longitude)
					)

					const newPosition = {__$originalPosition: new UTSSourceMapPosition("newPosition", "pages/vehicleTracking/vehicleTracking.uvue", 249, 12),
						latitude: convertedCoord.lat,
						longitude: convertedCoord.lng,
						speed: deviceData.speed || 0,
						address: deviceData.positionUpdateTime || '未知位置',
						connectionStatus: deviceData.connectionStatus || 'unknown',
						direction: deviceData.direction !== undefined && deviceData.direction !== null 
							? deviceData.direction 
							: lastDirection.value
					}

					// 处理方向数据
					let newDirection = newPosition.direction
					if (newPosition.direction === lastDirection.value) {
						newDirection = lastDirection.value
					}

					// 添加到动画队列
					addToAnimationQueue({
						position: {
							latitude: newPosition.latitude,
							longitude: newPosition.longitude
						},
						rotation: normalizeRotation(calculateMapRotation(newDirection)),
						speed: newPosition.speed,
						address: newPosition.address,
						connectionStatus: newPosition.connectionStatus
					})

					// 更新最后方向
					lastDirection.value = newDirection
				}
			}
		} catch (err) {
			console.error('获取跟踪位置失败:', err, " at pages/vehicleTracking/vehicleTracking.uvue:283")
		}
	}

	// 添加到动画队列
	const addToAnimationQueue = (animationData : any) => {
		if (animationQueue.value.length > 2) {
			animationQueue.value = animationQueue.value.slice(-1)
		}
		
		animationQueue.value.push(animationData)
		
		if (!isProcessingQueue.value && !isAnimating.value) {
			processAnimationQueue()
		}
	}

	// 处理动画队列
	const processAnimationQueue = () => {
		if (animationQueue.value.length === 0) {
			isProcessingQueue.value = false
			return
		}
		
		isProcessingQueue.value = true
		
		const nextAnimation = animationQueue.value.shift()
		
		targetPosition.latitude = nextAnimation.position.latitude
		targetPosition.longitude = nextAnimation.position.longitude
		targetRotation.value = nextAnimation.rotation
		
		currentSpeed.value = nextAnimation.speed
		currentAddress.value = nextAnimation.address
		connectionStatus.value = nextAnimation.connectionStatus
		
		// 计算距离和动画时长
		const distance = calculateDistance(
			currentPosition.latitude,
			currentPosition.longitude,
			targetPosition.latitude,
			targetPosition.longitude
		)
		
		// 根据实际速度和距离计算动画时长
		const animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value)
		
		startPositionAnimation(animationDuration, () => {
			isProcessingQueue.value = false
			// 立即处理下一个动画
			if (animationQueue.value.length > 0) {
				setTimeout(() => {
					processAnimationQueue()
				}, 50)
			}
		})
	}

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

	// 开始位置动画
	const startPositionAnimation = (duration : number, onComplete : () => void) => {
		if (isAnimating.value && animationTimer.value) {
			clearInterval(animationTimer.value)
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
		}, interval) as unknown as number
	}

	// 计算最短旋转路径
	const calculateShortestRotation = (from : number, to : number) : number => {
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
		if (markers.value.length === 0) {
			initMarker()
			return
		}
		
		const newIconPath = getDeviceIcon(connectionStatus.value, carType.value)
		const needUpdateIcon = newIconPath !== lastIconPath
		
		// 创建新的标记点对象
		const updatedMarker = {__$originalPosition: new UTSSourceMapPosition("updatedMarker", "pages/vehicleTracking/vehicleTracking.uvue", 461, 9),
			id: 1,
			latitude: currentPosition.latitude,
			longitude: currentPosition.longitude,
			iconPath: needUpdateIcon ? newIconPath : lastIconPath,
			width: 25,
			height: 25,
			rotate: currentRotation.value,
			anchor: { x: 0.5, y: 0.5 },
			alpha: 1,
			fixed: false
		}
		
		markers.value = [updatedMarker]
		
		if (needUpdateIcon) {
			lastIconPath = newIconPath
		}
	}

	// 开始/停止跟踪
	const toggleTracking = () => {
		if (isTracking.value) {
			stopTracking()
		} else {
			startTracking()
		}
	}

	// 开始跟踪
	const startTracking = () => {
		if (!markerInitialized.value) {
			initMarker()
		}
		
		// 清理状态
		animationQueue.value = []
		isProcessingQueue.value = false

		const interval = 10000
		isTracking.value = true
		
		// 清除之前的定时器
		if (trackingInterval.value) {
			clearInterval(trackingInterval.value)
		}
		
		// 立即获取一次位置
		getCurrentPosition()
		
		// 设置定时器
		trackingInterval.value = setInterval(() => {
			getCurrentPosition()
		}, interval) as unknown as number
		
		uni.showToast({
			title: '开始跟踪',
			icon: 'success',
			duration: 1500
		})
	}

	// 停止跟踪
	const stopTracking = () => {
		isTracking.value = false
		
		// 清除定时器
		if (trackingInterval.value) {
			clearInterval(trackingInterval.value)
			trackingInterval.value = null
		}
		
		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false
		
		if (animationTimer.value) {
			clearInterval(animationTimer.value)
			animationTimer.value = null
		}
		isAnimating.value = false

		uni.showToast({
			title: '停止跟踪',
			icon: 'success',
			duration: 1500
		})
	}

	// 获取当前位置
	const getCurrentPosition = () => {
		loadTrackData()
	}

	onHide(() => {
		console.log('页面隐藏时停止自动刷新', " at pages/vehicleTracking/vehicleTracking.uvue:556")
		isTracking.value = false
		
		// 清除定时器
		if (trackingInterval.value) {
			clearInterval(trackingInterval.value)
			trackingInterval.value = null
		}
		
		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false
		
		if (animationTimer.value) {
			clearInterval(animationTimer.value)
			animationTimer.value = null
		}
		isAnimating.value = false
	})

	onUnmounted(() => {
		console.log('页面卸载时停止自动刷新', " at pages/vehicleTracking/vehicleTracking.uvue:577")
		isTracking.value = false
		
		// 清除定时器
		if (trackingInterval.value) {
			clearInterval(trackingInterval.value)
			trackingInterval.value = null
		}
		
		// 清理动画状态
		animationQueue.value = []
		isProcessingQueue.value = false
		
		if (animationTimer.value) {
			clearInterval(animationTimer.value)
			animationTimer.value = null
		}
		isAnimating.value = false
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_sub_navBar = resolveEasyComponent("sub-navBar",_easycom_sub_navBar)
const _component_map = resolveComponent("map")

  return _cE("view", _uM({ class: "container" }), [
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
      }), _uM({
        default: withSlotCtx((): any[] => [
          _cV(_component_sub_navBar, _uM({
            currentTime: currentTime.value,
            currentCar: currentCar.value,
            times: times.value,
            showCar: true,
            "onUpdate:currentTime": (val) => (currentTime.value = val),
            carStatus: connectionStatus.value
          }), null, 8 /* PROPS */, ["currentTime", "currentCar", "times", "onUpdate:currentTime", "carStatus"])
        ]),
        _: 1 /* STABLE */
      }), 8 /* PROPS */, ["latitude", "longitude", "markers", "scale", "style"])
    ]),
    _cE("view", _uM({ class: "tools-panel" }), [
      _cE("view", _uM({ class: "btn" }), [
        _cE("button", _uM({
          onClick: toggleTracking,
          style: _nS(_uM({backgroundColor: isTracking.value ? '#e64340' : '#1296db'}))
        }), _tD(isTracking.value ? '停止跟踪' : '开始跟踪'), 5 /* TEXT, STYLE */)
      ]),
      _cE("view", _uM({ class: "pos-info-box" }), [
        _cE("view", _uM({ class: "speed" }), [
          _cE("text", null, "时速："),
          _cE("text", null, _tD(currentSpeed.value) + "Km/h", 1 /* TEXT */)
        ]),
        _cE("view", _uM({ class: "address" }), [
          _cE("text", null, "定位时间："),
          _cE("text", null, _tD(currentAddress.value), 1 /* TEXT */)
        ])
      ])
    ])
  ])
}
}

})
export default __sfc__
const GenPagesVehicleTrackingVehicleTrackingStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["tools-panel", _uM([[".container ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "40rpx"], ["display", "flex"], ["flexDirection", "column"], ["boxShadow", "0 -2px 10px rgba(0, 0, 0, 0.1)"]])]])], ["btn", _uM([[".container .tools-panel ", _uM([["marginBottom", "20rpx"]])]])], ["pos-info-box", _uM([[".container .tools-panel ", _uM([["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", "10rpx"], ["paddingLeft", 0]])]])], ["speed", _uM([[".container .tools-panel .pos-info-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["paddingTop", "8rpx"], ["paddingRight", 0], ["paddingBottom", "8rpx"], ["paddingLeft", 0], ["fontSize", "28rpx"]])]])], ["address", _uM([[".container .tools-panel .pos-info-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["paddingTop", "8rpx"], ["paddingRight", 0], ["paddingBottom", "8rpx"], ["paddingLeft", 0], ["fontSize", "28rpx"]])]])]])]
