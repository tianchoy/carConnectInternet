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

	import Polyline from 'uts.sdk.modules.DCloudUniMapTencent.Polyline'
	import LocationObject from 'uts.sdk.modules.DCloudUniMapTencent.LocationObject'


	type CoordinatePoint = {
		latitude : number
		longitude : number
	}

	type AnimationQueueItem = {
		position : CoordinatePoint
		rotation : number
		speed : number
		address : string
		connectionStatus : string
		positionTime : string
	}

	type MpPolylineData = {
		points: Array<CoordinatePoint>
		color: string
		width: number
		dottedLine: boolean
		arrowLine: boolean
		borderColor: string
		borderWidth: number
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
	const isMapReady = ref(false)
	const temporaryRenderPoints = ref<Array<CoordinatePoint>>([])
	const TRACKING_POLL_INTERVAL_MS = 1000
	const TRACKING_ANIMATION_DURATION_MS = 900
	const MAX_POSITION_JUMP_DISTANCE = 500

	const polyline = ref<Array<Polyline>>([])





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
	const MARKER_UPDATE_INTERVAL = 30 // 与动画帧同步，兼容 Android 和微信小程序地图的 marker 刷新

	// 跟踪状态
	const isTracking = ref(false)
	const trackingInterval = ref<number | null>(null)
	const lastDirection = ref(0)
	const hasValidPosition = ref(false)
	let trackingSessionId = 0
	let isTrackRequestPending = false
	let lastAcceptedPosition : CoordinatePoint | null = null
	let lastAcceptedPositionTime = ''
	let lastAcceptedReceivedTime = 0
	let pendingJumpPosition : CoordinatePoint | null = null
	let pendingJumpTime = ''

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
		isMapReady.value = false
		try {
			const data = {
				deptId: deptId.value,
				deviceids: imei.value
			}

			const res = await getDevicePos(data)
			const positions = res.data
			if (res?.code != 200 || positions == null || positions.length == 0) {
				showAppToast({
					title: '获取位置失败',
					icon: 'none'
				})
				return
			}
			let foundDevice = false
			positions.forEach((item : UTSJSONObject) => {
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
						const convertedCoord = CoordTransform.wgs84ToTencentPrecise(latitude, longitude)

						// 设置初始位置
						currentPosition.latitude = convertedCoord.lat
						currentPosition.longitude = convertedCoord.lng
					hasValidPosition.value = true
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
						isMapReady.value = true
					}
				})

				if (!foundDevice) {
					showAppToast({
						title: '未找到车辆设备',
						icon: 'none'
					})
				}

		} catch (err) {
			console.error('获取初始位置失败:', err)
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
		console.log('初始化标记点完成')
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
		console.log('option', option)
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
		if (duration > 2800) duration = 2800 // 小于轮询周期，避免过期定位在队列中滞后播放

		// 低速运动
		if (speedKmh < 10 && duration < 2000) {
			duration = 2000
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

		// Android 与微信小程序对数组中 Marker 的原地变更不一定触发地图刷新；
		// 每次提供新的数组和 Marker 实例，确保动画帧都会被地图组件接收。
		markers.value = [updatedMarker]

		if (needUpdateIcon) {
			lastIconPath = newIconPath
		}
	}


	function copyPosition(p : CoordinatePoint) : CoordinatePoint { return { latitude: p.latitude, longitude: p.longitude } }
	function isSamePosition(first : CoordinatePoint, second : CoordinatePoint) : boolean { return first.latitude == second.latitude && first.longitude == second.longitude }
	function parsePositionTime(value : string) : number { const time = Date.parse(value.replace(/-/g, '/')); return isNaN(time) ? 0 : time }
	function updateTrackingPolyline() : void {
		const renderPoints = temporaryRenderPoints.value.map((point : CoordinatePoint) : CoordinatePoint => copyPosition(point))
		if (isAnimating.value && renderPoints.length > 0 && !isSamePosition(renderPoints[renderPoints.length - 1], currentPosition)) renderPoints.push(copyPosition(currentPosition))
		if (renderPoints.length < 2) { polyline.value = []; return }

		const points = renderPoints.map((point : CoordinatePoint) : LocationObject => new LocationObject(point.latitude, point.longitude))
		polyline.value = [new Polyline(points, '#888787', 3, false, false, '', '#888787', 0, [])]




	}
	function appendTemporaryRenderPoint(position : CoordinatePoint) : void {
		const last = temporaryRenderPoints.value.length > 0 ? temporaryRenderPoints.value[temporaryRenderPoints.value.length - 1] : null
		if (last != null && isSamePosition(last, position)) return
		temporaryRenderPoints.value.push(copyPosition(position))
		if (temporaryRenderPoints.value.length > 1000) temporaryRenderPoints.value.splice(0, temporaryRenderPoints.value.length - 1000)
		updateTrackingPolyline()
	}
	function resetTemporaryRenderSegment(position : CoordinatePoint) : void {
		temporaryRenderPoints.value = [copyPosition(position)]
		polyline.value = []
	}
	function clearTemporaryRoute() : void {
		temporaryRenderPoints.value = []
		polyline.value = []
	}

	const startPositionAnimation = (duration : number, sessionId : number, done : () => void) => {
		if (animationTimer.value != null) clearInterval(animationTimer.value as number)
		isAnimating.value = true
		const begin = Date.now(), lat = currentPosition.latitude, lng = currentPosition.longitude, rot = currentRotation.value
		const latDiff = targetPosition.latitude - lat, lngDiff = targetPosition.longitude - lng, rotDiff = calculateShortestRotation(rot, targetRotation.value)
		let lastDraw = begin
				animationTimer.value = setInterval(() => {
			if (!isTracking.value || sessionId != trackingSessionId) return
			const now = Date.now(), progress = Math.min((now - begin) / duration, 1)
			currentPosition.latitude = lat + latDiff * progress; currentPosition.longitude = lng + lngDiff * progress
			currentRotation.value = normalizeRotation(rot + rotDiff * progress); center.latitude = currentPosition.latitude; center.longitude = currentPosition.longitude
			if (now - lastDraw >= MARKER_UPDATE_INTERVAL || progress >= 1) {
				updateMarkerSmooth()
				updateTrackingPolyline()
				lastDraw = now
			}
			if (progress >= 1) { clearInterval(animationTimer.value as number); animationTimer.value = null; isAnimating.value = false; currentPosition.latitude = targetPosition.latitude; currentPosition.longitude = targetPosition.longitude; currentRotation.value = normalizeRotation(targetRotation.value); updateMarkerSmooth(); appendTemporaryRenderPoint(currentPosition); done() }
		}, 30) as number
	}
	function processAnimationQueue(sessionId : number) : void {
		if (!isTracking.value || sessionId != trackingSessionId || animationQueue.value.length == 0) { isProcessingQueue.value = false; return }
		isProcessingQueue.value = true; const next = animationQueue.value.shift() as AnimationQueueItem
		targetPosition.latitude = next.position.latitude; targetPosition.longitude = next.position.longitude; targetRotation.value = next.rotation; currentSpeed.value = next.speed; currentAddress.value = next.address; connectionStatus.value = next.connectionStatus
		startPositionAnimation(TRACKING_ANIMATION_DURATION_MS, sessionId, () => { if (!isTracking.value || sessionId != trackingSessionId) return; isProcessingQueue.value = false; if (animationQueue.value.length > 0) setTimeout(() => processAnimationQueue(sessionId), 50) })
	}
	function acceptLivePosition(item : UTSJSONObject, position : CoordinatePoint, positionTime : string, sessionId : number) : void {
		const direction = item.getNumber('direction', lastDirection.value)
		const animationData : AnimationQueueItem = { position: position, rotation: normalizeRotation(calculateMapRotation(direction)), speed: item.getNumber('speed', 0), address: positionTime == '' ? '未知位置' : positionTime, connectionStatus: item.getString('connectionStatus', 'unknown'), positionTime: positionTime }
		lastAcceptedPosition = copyPosition(position)
		lastAcceptedPositionTime = positionTime
		lastAcceptedReceivedTime = Date.now()
		if (isAnimating.value || animationQueue.value.length > 0) animationQueue.value = []
		animationQueue.value.push(animationData)
		lastDirection.value = direction
		if (!isProcessingQueue.value && !isAnimating.value) processAnimationQueue(sessionId)
	}
	function relocateToConfirmedPosition(item : UTSJSONObject, position : CoordinatePoint, positionTime : string) : void {
		if (animationTimer.value != null) clearInterval(animationTimer.value as number)
		animationTimer.value = null
		isAnimating.value = false
		isProcessingQueue.value = false
		animationQueue.value = []
		currentPosition.latitude = position.latitude; currentPosition.longitude = position.longitude
		targetPosition.latitude = position.latitude; targetPosition.longitude = position.longitude
		const direction = item.getNumber('direction', lastDirection.value)
		currentRotation.value = normalizeRotation(calculateMapRotation(direction)); targetRotation.value = currentRotation.value
		center.latitude = position.latitude; center.longitude = position.longitude
		currentSpeed.value = item.getNumber('speed', 0); currentAddress.value = positionTime; connectionStatus.value = item.getString('connectionStatus', 'unknown')
		lastDirection.value = direction; lastAcceptedPosition = copyPosition(position); lastAcceptedPositionTime = positionTime; lastAcceptedReceivedTime = Date.now()
		resetTemporaryRenderSegment(position)
		updateMarkerSmooth()
	}
	const loadTrackData = async (sessionId : number) => {
		if (!isTracking.value || sessionId != trackingSessionId || isTrackRequestPending) return
		isTrackRequestPending = true
		try {
			const res = await getDevicePos({ deptId: deptId.value, deviceids: imei.value })
			const positions = res.data
			if (!isTracking.value || sessionId != trackingSessionId || res?.code != 200 || positions == null) return
			const item = positions.find((value : UTSJSONObject) => value.getString('imei', '') == imei.value)
			if (item == null) return
			const rawLat = item.getNumber('latitude', 0), rawLng = item.getNumber('longitude', 0)
			if (rawLat == 0 || rawLng == 0 || !isFinite(rawLat) || !isFinite(rawLng)) return
			const converted = CoordTransform.wgs84ToTencentPrecise(rawLat, rawLng)
			if (!isFinite(converted.lat) || !isFinite(converted.lng)) return
			const position : CoordinatePoint = { latitude: converted.lat, longitude: converted.lng }
			const positionTime = item.getString('positionUpdateTime', '')
			const previous = lastAcceptedPosition
			if (positionTime != '' && positionTime == lastAcceptedPositionTime) return
			if (previous == null || isSamePosition(previous, position)) return
			const sourceTime = parsePositionTime(positionTime)
			const previousTime = parsePositionTime(lastAcceptedPositionTime)
			const elapsedSeconds = sourceTime > previousTime && previousTime > 0 ? (sourceTime - previousTime) / 1000 : Math.max((Date.now() - lastAcceptedReceivedTime) / 1000, 1)
			const distance = calculateDistance(previous.latitude, previous.longitude, position.latitude, position.longitude)
			const impliedSpeed = distance / elapsedSeconds * 3.6
			if (distance > MAX_POSITION_JUMP_DISTANCE || impliedSpeed > 210) {
				const pending = pendingJumpPosition
				if (pending != null && calculateDistance(pending.latitude, pending.longitude, position.latitude, position.longitude) <= MAX_POSITION_JUMP_DISTANCE && positionTime != pendingJumpTime) {
					pendingJumpPosition = null; pendingJumpTime = ''
					relocateToConfirmedPosition(item, position, positionTime)
				} else { pendingJumpPosition = copyPosition(position); pendingJumpTime = positionTime }
				return
			}
			pendingJumpPosition = null; pendingJumpTime = ''
			acceptLivePosition(item, position, positionTime, sessionId)
		} catch (error) { console.error('获取跟踪位置失败:', error) } finally { if (sessionId == trackingSessionId) isTrackRequestPending = false }
	}

	function stopTracking(showToast : boolean = true) : void {
		trackingSessionId += 1
		isTracking.value = false
		if (trackingInterval.value != null) { clearInterval(trackingInterval.value as number); trackingInterval.value = null }
		if (animationTimer.value != null) { clearInterval(animationTimer.value as number); animationTimer.value = null }
		if (temporaryRenderPoints.value.length > 0) {
			const lastIndex = temporaryRenderPoints.value.length - 1
			temporaryRenderPoints.value[lastIndex] = copyPosition(currentPosition)
			updateTrackingPolyline()
		}
		animationQueue.value = []
		isAnimating.value = false
		isProcessingQueue.value = false
		isTrackRequestPending = false
		pendingJumpPosition = null
		if (showToast) showAppToast({ title: '停止跟踪', icon: 'success', duration: 1500 })
	}
	function startTracking() : void {
		if (!hasValidPosition.value) { showAppToast({ title: '暂无有效定位信息', icon: 'none' }); return }
		if (!markerInitialized.value) initMarker()
		clearTemporaryRoute()
		resetTemporaryRenderSegment(currentPosition)
		animationQueue.value = []
		isProcessingQueue.value = false
		lastAcceptedPosition = copyPosition(currentPosition)
		lastAcceptedPositionTime = ''
		lastAcceptedReceivedTime = Date.now()
		pendingJumpPosition = null
		trackingSessionId += 1
		const sessionId = trackingSessionId
		isTracking.value = true
		loadTrackData(sessionId)
		trackingInterval.value = setInterval(() => { loadTrackData(sessionId); }, TRACKING_POLL_INTERVAL_MS) as number
		showAppToast({ title: '开始跟踪', icon: 'success', duration: 1500 })
	}

	// 开始/停止跟踪
	const toggleTracking = () => {
		if (isTracking.value) {
			stopTracking()
		} else {
			startTracking()
		}
	}


	onHide(() => { stopTracking(false) })
	onUnload(() => {
		stopTracking(false)
		clearTemporaryRoute()
	})
	onUnmounted(() => { stopTracking(false) })


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
        isTrue(isMapReady.value)
          ? _cV(_component_map, _uM({
              key: 0,
              id: "myMap",
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
              markers: markers.value,
              polyline: polyline.value,
              scale: mapScale.value,
              style: _nS(_uM({"width":"100%","height":"100%"})),
              "show-location": false,
              "enable-traffic": true,
              "enable-overlooking": true,
              "enable-building": true,
              "enable-3D": true
            }), null, 8 /* PROPS */, ["latitude", "longitude", "markers", "polyline", "scale", "style"])
          : _cC("v-if", true),
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
