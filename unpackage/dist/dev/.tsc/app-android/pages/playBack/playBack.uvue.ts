import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_sub_navBar from '@/components/sub-navBar/sub-navBar.uvue'
import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_i_slider from '@/uni_modules/i-ui-x/components/i-slider/i-slider.uvue'
import _easycom_l_date_time_picker from '@/uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.uvue'
import _easycom_l_popup from '@/uni_modules/lime-popup/components/l-popup/l-popup.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getTrackPos } from '../../api/request.uts'
	import { getDeviceIcon } from '../../utils/cars'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	import Polyline from 'uts.sdk.modules.DCloudUniMapTencent.Polyline'
	import LocationObject from 'uts.sdk.modules.DCloudUniMapTencent.LocationObject'


	type TrackPoint = { __$originalPosition?: UTSSourceMapPosition<"TrackPoint", "pages/playBack/playBack.uvue", 66, 7>;
		latitude : number;
		longitude : number;
		rotation : number;
		deviceTime : string;
		speed : number;
	}

	type TrackBounds = { __$originalPosition?: UTSSourceMapPosition<"TrackBounds", "pages/playBack/playBack.uvue", 74, 7>;
		minLat : number;
		maxLat : number;
		minLng : number;
		maxLng : number;
	}

	type MapPolylinePoint = { __$originalPosition?: UTSSourceMapPosition<"MapPolylinePoint", "pages/playBack/playBack.uvue", 81, 7>;
		latitude: number
		longitude: number
	}

	type MpPolylineData = { __$originalPosition?: UTSSourceMapPosition<"MpPolylineData", "pages/playBack/playBack.uvue", 86, 7>;
		points: Array<MapPolylinePoint>
		color: string
		width: number
		dottedLine: boolean
		arrowLine: boolean
		borderColor: string
		borderWidth: number
	}

	// 地图状态
	type MapMarker = Marker

	
const __sfc__ = defineComponent({
  __name: 'playBack',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const center = reactive({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const mapScale = ref(15)
	const imei = ref<string | null>('')
	const carStatus = ref<string | null>('')
	const plateNo = ref<string | null>('')
	const carType = ref<string | null>('')

	// 日期时间选择器相关
	const showDateTimePicker = ref(false)
	const currentPickerType = ref('start') // 'start' or 'end'
	const pickerTitle = ref('选择开始时间')

	// 轨迹回放相关
	const trackPoints = ref<Array<TrackPoint>>([])

	const polyline = ref<Array<Polyline>>([])
	let unplayedPolyline : Polyline | null = null
	let playedPolyline : Polyline | null = null




	const isPlaying = ref(false)
	const isTrackPlayable = ref(false)
	const playbackSpeed = ref(5)
	const totalDistance = ref(0)
	const currentSpeed = ref(0)
	const currentTime = ref('')
	const currentIndex = ref(0)
	const carMarker = ref<MapMarker | null>(null)
	let playbackTimer : number | null = null
	let lastTimestamp = 0
	let replaySessionId = 0

	const startTime = ref('')
	const endTime = ref('')
	const lat = ref<string | null>('')
	const lng = ref<string | null>('')
	const sTime = ref('')
	const eTime = ref('')

	// 标记点集合
	const markers = ref<Array<MapMarker>>([])

	// 日期函数
	function safeParseDate(dateStr : string) : number {
		if (!dateStr) return 0
		const iosCompatibleStr = dateStr.replace(/-/g, '/')
		const date = new Date(iosCompatibleStr)
		if (isNaN(date.getTime())) {
			const isoStr = dateStr.replace(' ', 'T')
			const isoDate = new Date(isoStr)
			if (!isNaN(isoDate.getTime())) {
				return isoDate.getTime()
			}
			return 0
		}
		return date.getTime()
	}

	// 规范化日期时间，确保展示和接口查询均精确到秒
	function normalizeDateTime(dateStr : string) : string {
		if (!dateStr) return ''
		let normalized = dateStr.replace(/-/g, '/')
		const parts = normalized.split(' ')
		if (parts.length < 2) return normalized
		const timeParts = parts[1].split(':')
		if (timeParts.length == 2) normalized += ':00'
		return normalized
	}

	// 格式化日期显示
	function formatDateForDisplay(dateStr : string) : string {
		return normalizeDateTime(dateStr).replace(/\//g, '-')
	}

	// 计算两点之间的方向角
	function calculateBearing(lat1 : number, lng1 : number, lat2 : number, lng2 : number) : number {
		const degToRad = (d : number) => d * Math.PI / 180
		const radToDeg = (r : number) => r * 180 / Math.PI

		const φ1 = degToRad(lat1)
		const φ2 = degToRad(lat2)
		const Δλ = degToRad(lng2 - lng1)

		const y = Math.sin(Δλ) * Math.cos(φ2)
		const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
		const θ = Math.atan2(y, x)

		return (radToDeg(θ) + 360) % 360
	}

	// 计算两点间距离（米）
	function getDistance(lat1 : number, lng1 : number, lat2 : number, lng2 : number) {
		const rad = (d : number) => d * Math.PI / 180.0
		const radLat1 = rad(lat1)
		const radLat2 = rad(lat2)
		const a = radLat1 - radLat2
		const b = rad(lng1) - rad(lng2)
		const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
		return s * 6378.137 * 1000
	}

	// 计算轨迹边界
	function calculateTrackBounds() : TrackBounds | null {
		if (trackPoints.value.length == 0) return null

		let minLat = trackPoints.value[0].latitude
		let maxLat = trackPoints.value[0].latitude
		let minLng = trackPoints.value[0].longitude
		let maxLng = trackPoints.value[0].longitude

		trackPoints.value.forEach((point : TrackPoint) : void => {
			minLat = Math.min(minLat, point.latitude)
			maxLat = Math.max(maxLat, point.latitude)
			minLng = Math.min(minLng, point.longitude)
			maxLng = Math.max(maxLng, point.longitude)
		})

		return {
			minLat: minLat,
			maxLat: maxLat,
			minLng: minLng,
			maxLng: maxLng
		}
	}

	// 调整地图以适应轨迹
	function adjustMapToFitTrack() {
		const nullableBounds = calculateTrackBounds()
		if (nullableBounds == null) return
		const bounds = nullableBounds

		center.latitude = (bounds.minLat + bounds.maxLat) / 2
		center.longitude = (bounds.minLng + bounds.maxLng) / 2

		const latDiff = bounds.maxLat - bounds.minLat
		const lngDiff = bounds.maxLng - bounds.minLng
		const maxDiff = Math.max(latDiff, lngDiff)

		if (maxDiff > 0.1) mapScale.value = 10
		else if (maxDiff > 0.05) mapScale.value = 12
		else if (maxDiff > 0.02) mapScale.value = 15
		else mapScale.value = 16
	}

	// 计算轨迹总距离
	function calculateTrackDistance() {
		totalDistance.value = 0
		for (let i = 1; i < trackPoints.value.length; i++) {
			totalDistance.value += getDistance(
				trackPoints.value[i - 1].latitude,
				trackPoints.value[i - 1].longitude,
				trackPoints.value[i].latitude,
				trackPoints.value[i].longitude
			)
		}
	}

	// 初始化时间
	function initDateTime() {
		const now = new Date()
		const formatTime = (date : Date) : string => {
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			const hours = date.getHours().toString().padStart(2, '0')
			const minutes = date.getMinutes().toString().padStart(2, '0')
			const seconds = date.getSeconds().toString().padStart(2, '0')
			return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`
		}

		endTime.value = formatTime(now)
		const startDate = new Date(now.getTime() - 3600000 * 24)
		startTime.value = formatTime(startDate)
	}

	// 初始化小车标记
	function initCarMarker() {
		if (trackPoints.value.length == 0) return

		const firstPoint = trackPoints.value[0]
		const marker : MapMarker = {
			id: 999,
			latitude: firstPoint.latitude,
			longitude: firstPoint.longitude,
			iconPath: getDeviceIcon(carStatus.value ?? '', carType.value ?? ''),
			width: 25,
			height: 25,
			rotate: firstPoint.rotation,
			anchor: { x: 0.5, y: 0.5 }
		}
		carMarker.value = marker

		const startMarker : MapMarker = {
			id: 1000,
			latitude: firstPoint.latitude,
			longitude: firstPoint.longitude,
			iconPath: '/static/start.png',
			width: 24,
			height: 24,
			anchor: { x: 0.5, y: 0.5 },
			callout: { content: '起点', borderRadius: 5, padding: 5, display: 'BYCLICK' }
		}
		const lastPoint = trackPoints.value[trackPoints.value.length - 1]
		const endMarker : MapMarker = {
			id: 1001,
			latitude: lastPoint.latitude,
			longitude: lastPoint.longitude,
			iconPath: '/static/end.png',
			width: 24,
			height: 24,
			anchor: { x: 0.5, y: 0.5 },
			callout: { content: '终点', borderRadius: 5, padding: 5, display: 'BYCLICK' }
		}
		markers.value = [marker, startMarker, endMarker]
	}


	function toNativePoints(points : Array<TrackPoint>) : Array<LocationObject> {
		return points.map((point : TrackPoint) : LocationObject => {
			return new LocationObject(point.latitude, point.longitude)
		})
	}

	function initPolyline() {
		if (trackPoints.value.length < 2) {
			unplayedPolyline = null
			playedPolyline = null
			polyline.value = []
			return
		}

		const initialUnplayedPolyline = new Polyline(
			toNativePoints(trackPoints.value), '#888787', 3, true, false, '', '#888787', 0, []
		)
		initialUnplayedPolyline.color = '#888787'
		initialUnplayedPolyline.width = 3
		initialUnplayedPolyline.dottedLine = true
		initialUnplayedPolyline.arrowLine = false
		initialUnplayedPolyline.borderColor = '#888787'
		initialUnplayedPolyline.borderWidth = 0

		const initialPlayedPolyline = new Polyline(
			toNativePoints(trackPoints.value.slice(0, 1)), '#3c5cff', 5, false, true, '', '#FFFFFF', 1, []
		)
		initialPlayedPolyline.color = '#3c5cff'
		initialPlayedPolyline.width = 5
		initialPlayedPolyline.dottedLine = false
		initialPlayedPolyline.arrowLine = true
		initialPlayedPolyline.borderColor = '#FFFFFF'
		initialPlayedPolyline.borderWidth = 1
		unplayedPolyline = initialUnplayedPolyline
		playedPolyline = initialPlayedPolyline
		polyline.value = [initialUnplayedPolyline, initialPlayedPolyline]
	}

	function updatePolyline() {
		const currentUnplayedPolyline = unplayedPolyline
		const currentPlayedPolyline = playedPolyline
		if (trackPoints.value.length == 0 || currentUnplayedPolyline == null || currentPlayedPolyline == null) return

		currentUnplayedPolyline.points = toNativePoints(trackPoints.value.slice(currentIndex.value))
		currentPlayedPolyline.points = toNativePoints(trackPoints.value.slice(0, currentIndex.value + 1))
		polyline.value = [currentUnplayedPolyline, currentPlayedPolyline]
	}
















































	// 更新小车位置
	function updateCarPosition() {
		const marker = carMarker.value
		if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
			const point = trackPoints.value[currentIndex.value]

			const updatedMarker : MapMarker = {
				id: marker.id,
				latitude: point.latitude,
				longitude: point.longitude,
				iconPath: marker.iconPath,
				width: marker.width,
				height: marker.height,
				rotate: point.rotation,
				anchor: marker.anchor,
				callout: marker.callout,
				label: marker.label
			}
			carMarker.value = updatedMarker
			markers.value = [updatedMarker, ...markers.value.slice(1)]

			// 每5个点更新一次中心点
			if (currentIndex.value % 5 == 0 ||
				currentIndex.value == 0 ||
				currentIndex.value == trackPoints.value.length - 1) {
				center.latitude = point.latitude
				center.longitude = point.longitude
			}
		}
	}

	// 显示日期时间选择器
	function showPicker(type : string) {
		currentPickerType.value = type
		pickerTitle.value = type == 'start' ? '选择开始时间' : '选择结束时间'
		showDateTimePicker.value = true
	}

	// 显示当前位置
	function showCurrentPosition() {
		isTrackPlayable.value = false
		const originalLatText = lat.value ?? ''
		const originalLngText = lng.value ?? ''
		const originalLat = parseFloat(originalLatText)
		const originalLng = parseFloat(originalLngText)
		if (isNaN(originalLat) || isNaN(originalLng) || originalLat == 0 || originalLng == 0) {
			showAppToast({
				title: '这段时间没有数据',
				icon: 'none',
				duration: 2000
			})
			return
		}

		showAppToast({
			title: '这段时间没有数据',
			icon: 'none',
			duration: 2000
		})
		// 转换坐标到腾讯地图坐标系
		const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)

		// 设置地图中心点
		center.latitude = convertedCoord.lat
		center.longitude = convertedCoord.lng
		mapScale.value = 15

		// 创建当前位置标记
		const currentPoint : TrackPoint = {
			latitude: convertedCoord.lat,
			longitude: convertedCoord.lng,
			rotation: 0,
			deviceTime: new Date().toLocaleString(),
			speed: 0
		}

		// 初始化小车标记
		const marker : MapMarker = {
			id: 999,
			latitude: currentPoint.latitude,
			longitude: currentPoint.longitude,
			iconPath: getDeviceIcon(carStatus.value ?? '', carType.value ?? ''),
			width: 25,
			height: 25,
			rotate: 0,
			anchor: { x: 0.5, y: 0.5 }
		}
		carMarker.value = marker

		// 设置标记点
		markers.value = [marker]
	}


	function clearTrackDisplay() : void {
		trackPoints.value = []
		isTrackPlayable.value = false
		currentIndex.value = 0
		currentSpeed.value = 0
		currentTime.value = ''
		totalDistance.value = 0
		carMarker.value = null
		markers.value = []

		unplayedPolyline = null
		playedPolyline = null
		polyline.value = []




	}

	function pausePlayback() {
		isPlaying.value = false
		const timer = playbackTimer
		if (timer != null) {
			clearTimeout(timer)
			playbackTimer = null
		}
	}

	function renderPlaybackIndex() : void {
		if (trackPoints.value.length == 0) return
		updateCarPosition()
		updatePolyline()
		const point = trackPoints.value[currentIndex.value]
		currentSpeed.value = point.speed
		currentTime.value = point.deviceTime
	}


	// 处理轨迹数据
	function processTrackData(positions : Array<UTSJSONObject>) : void {
		const processedPoints : Array<TrackPoint> = []

		for (let i = 0; i < positions.length; i++) {
			const point = positions[i]
			const deviceTimeStr = point.getString('deviceTime', '')
			const originalLat = point.getNumber('latitude', 0)
			const originalLng = point.getNumber('longitude', 0)

			if (originalLat == 0 || originalLng == 0 ||
				!isFinite(originalLat) || !isFinite(originalLng) ||
				deviceTimeStr == '' || safeParseDate(deviceTimeStr) == 0) {
				continue
			}

			const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)
			if (!isFinite(convertedCoord.lat) || !isFinite(convertedCoord.lng)) {
				continue
			}

			processedPoints.push({
				latitude: convertedCoord.lat,
				longitude: convertedCoord.lng,
				rotation: 0,
				deviceTime: formatDateForDisplay(deviceTimeStr),
				speed: point.getNumber('speed', 0)
			})
		}

		for (let i = 1; i < processedPoints.length; i++) {
			const previousPoint = processedPoints[i - 1]
			const currentPoint = processedPoints[i]
			currentPoint.rotation = calculateBearing(
				previousPoint.latitude, previousPoint.longitude,
				currentPoint.latitude, currentPoint.longitude
			)
		}

		if (processedPoints.length > 1) {
			processedPoints[processedPoints.length - 1].rotation =
				processedPoints[processedPoints.length - 2].rotation
		}

		trackPoints.value = processedPoints
		isTrackPlayable.value = processedPoints.length > 1
		currentIndex.value = 0
		calculateTrackDistance()
		initCarMarker()
		initPolyline()
		adjustMapToFitTrack()
		renderPlaybackIndex()
	}
	const loadTrackPos = async () => {
		pausePlayback()
		const requestId = ++replaySessionId
		clearTrackDisplay()
		uni.showLoading({ title: '加载中...' })
		const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/playBack/playBack.uvue", 606, 9),
			imei: imei.value,
			startTime: startTime.value.replace(/\//g, '-'),
			endTime: endTime.value.replace(/\//g, '-'),
			minParkTime: 2,
			withStop: false,
			withPos: true,
			withTrip: false,
		}

		try {
			const res = await getTrackPos(data)
			if (requestId != replaySessionId) return

			const positions = res.data?.getArray<UTSJSONObject>('positions')
			if (positions != null && positions.length > 0) {
				processTrackData(positions)
				if (trackPoints.value.length == 0) {
					showCurrentPosition()
				}
			} else {
				showCurrentPosition()
			}
		} catch (error) {
			if (requestId != replaySessionId) return
			console.error('加载轨迹失败:', error, " at pages/playBack/playBack.uvue:631")
			showAppToast({ title: '轨迹加载失败', icon: 'none' })
			if (!isNaN(parseFloat(lat.value ?? '')) && !isNaN(parseFloat(lng.value ?? ''))) {
				showCurrentPosition()
			}
		} finally {
			if (requestId == replaySessionId) {
				uni.hideLoading()
			}
		}
	}

	function resetPlayback() {
		pausePlayback()
		currentIndex.value = 0
		renderPlaybackIndex()
	}

	function playNextPoint() : boolean {
		if (currentIndex.value >= trackPoints.value.length - 1) {
			pausePlayback()
			showAppToast({
				title: '轨迹回放完成',
				icon: 'none',
				duration: 1500
			})
			return false
		}

		currentIndex.value++
		renderPlaybackIndex()
		return true
	}

	function playbackStep(sessionId : number) {
		if (!isPlaying.value || sessionId != replaySessionId) return

		const now = Date.now()
		const elapsed = now - lastTimestamp
		const interval = 1000 / playbackSpeed.value

		if (elapsed >= interval) {
			playNextPoint()
			lastTimestamp = now - (elapsed % interval)
		}

		if (isPlaying.value && sessionId == replaySessionId) {
			playbackTimer = setTimeout(() => { playbackStep(sessionId) }, 16)
		}
	}

	function startPlayback() {
		if (!isTrackPlayable.value) {
			showAppToast({ title: '没有轨迹数据', icon: 'none' })
			return
		}

		if (currentIndex.value >= trackPoints.value.length - 1) {
			resetPlayback()
		}

		isPlaying.value = true
		const sessionId = ++replaySessionId
		if (!playNextPoint()) return
		lastTimestamp = Date.now()
		playbackStep(sessionId)
	}
	// 播放控制
	function togglePlayback() {
		if (isPlaying.value) {
			pausePlayback()
		} else {
			startPlayback()
		}
	}

	// 确认选择时间
	function onConfirm(value : string) {
		const formattedValue = normalizeDateTime(value)

		if (currentPickerType.value == 'start') {
			startTime.value = formattedValue
		} else {
			endTime.value = formattedValue
		}
		resetPlayback()
		void loadTrackPos()
		showDateTimePicker.value = false
	}
	// 取消选择时间
	function onCancel() {
		showDateTimePicker.value = false
	}

	// 重置回放

	// 设置回放速度
	function setPlaybackSpeed(e : number) : void {
		const wasPlaying = isPlaying.value
		if (wasPlaying) {
			pausePlayback()
		}

		playbackSpeed.value = e

		if (wasPlaying) {
			startPlayback()
		}
	}

	onLoad((option) => {
		imei.value = option.imei ?? null
		carStatus.value = option.connectionStatus ?? ''
		plateNo.value = option.plateNo ?? ''
		carType.value = option.carType ?? ''
		lat.value = option.lat ?? null
		lng.value = option.lng ?? null
		sTime.value = option.startTime ?? ''
		eTime.value = option.endTime ?? ''
		console.log(sTime.value, eTime.value, " at pages/playBack/playBack.uvue:750")
		if(sTime.value != '' && eTime.value != '') {
			startTime.value = normalizeDateTime(sTime.value)
			endTime.value = normalizeDateTime(eTime.value)
			loadTrackPos()
		}else{
			initDateTime()
			loadTrackPos()
		}

	})

	onHide(() => {
		pausePlayback()
		++replaySessionId
	})

	onUnload(() => {
		pausePlayback()
		++replaySessionId
	})




return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_sub_navBar = resolveEasyComponent("sub-navBar",_easycom_sub_navBar)
const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_i_slider = resolveEasyComponent("i-slider",_easycom_i_slider)
const _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker",_easycom_l_date_time_picker)
const _component_l_popup = resolveEasyComponent("l-popup",_easycom_l_popup)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "轨迹回放",
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
          polyline: polyline.value,
          scale: mapScale.value,
          style: _nS(_uM({"width":"100%","height":"100%"})),
          "show-location": true,
          "enable-traffic": true,
          "enable-overlooking": true,
          "enable-building": true,
          "enable-3D": true
        }), null, 8 /* PROPS */, ["latitude", "longitude", "markers", "polyline", "scale", "style"]),
        _cV(_component_sub_navBar, _uM({
          class: "sub-nav-overlay",
          showTime: false,
          currentCar: plateNo.value,
          showCar: true,
          carStatus: carStatus.value
        }), null, 8 /* PROPS */, ["currentCar", "carStatus"])
      ]),
      _cE("view", _uM({ class: "tools-panel" }), [
        _cE("view", _uM({ class: "Datetime-box" }), [
          _cE("view", _uM({ class: "date-box" }), [
            _cV(_component_i_icon, _uM({
              name: "/static/rili.png",
              fontSize: "15"
            })),
            _cE("text", _uM({
              class: "Date",
              onClick: () => {showPicker('start')}
            }), _tD(startTime.value), 9 /* TEXT, PROPS */, ["onClick"]),
            _cE("text", null, "至"),
            _cE("text", _uM({
              class: "Date",
              onClick: () => {showPicker('end')}
            }), _tD(endTime.value), 9 /* TEXT, PROPS */, ["onClick"])
          ])
        ]),
        _cE("view", _uM({ class: "tool-tag-item" }), [
          _cV(_component_i_button, _uM({
            type: "primary",
            onClick: togglePlayback,
            size: "small",
            text: isPlaying.value ? '暂停':'播放'
          }), null, 8 /* PROPS */, ["text"]),
          _cE("view", _uM({ class: "slider" }), [
            _cV(_component_i_slider, _uM({
              modelValue: playbackSpeed.value,
              "onUpdate:modelValue": $event => {(playbackSpeed).value = $event},
              min: 1,
              max: 50,
              step: 5,
              onChange: setPlaybackSpeed
            }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
          ]),
          _cE("text", _uM({ class: "speed-label" }), _tD(playbackSpeed.value) + "x", 1 /* TEXT */)
        ]),
        _cE("view", _uM({ class: "play-back-info" }), [
          _cE("view", _uM({ class: "item-info" }), [
            _cE("text", _uM({ class: "info-label" }), _tD(currentTime.value), 1 /* TEXT */),
            _cE("text", _uM({ class: "info-label" }), "时间")
          ]),
          _cE("view", _uM({ class: "item-info" }), [
            _cE("text", _uM({ class: "info-label" }), _tD(currentSpeed.value) + "Km/h", 1 /* TEXT */),
            _cE("text", _uM({ class: "info-label" }), "速度")
          ]),
          _cE("view", _uM({ class: "item-info" }), [
            _cE("text", _uM({ class: "info-label" }), _tD((totalDistance.value/1000).toFixed(1)) + "Km", 1 /* TEXT */),
            _cE("text", _uM({ class: "info-label" }), "里程")
          ])
        ]),
        _cV(_component_l_popup, _uM({
          modelValue: showDateTimePicker.value,
          "onUpdate:modelValue": $event => {(showDateTimePicker).value = $event},
          position: "bottom",
          closeable: false
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cV(_component_l_date_time_picker, _uM({
              "confirm-btn": "确认",
              "cancel-btn": "取消",
              title: pickerTitle.value,
              mode: 1|2|4|8|16|32,
              onConfirm: onConfirm,
              onCancel: onCancel
            }), null, 8 /* PROPS */, ["title"])
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesPlayBackPlayBackStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["sub-nav-overlay", _uM([[".container .map-container ", _uM([["position", "absolute"], ["top", 0], ["left", 0], ["right", 0], ["zIndex", 100]])]])], ["tools-panel", _uM([[".container ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["paddingTop", "50rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "50rpx"], ["paddingLeft", "20rpx"], ["boxShadow", "0 -10rpx 20rpx rgba(0, 0, 0, 0.1)"]])]])], ["Datetime-box", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginBottom", "30rpx"]])]])], ["date-box", _uM([[".container .tools-panel .Datetime-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["Date", _uM([[".container .tools-panel .Datetime-box .date-box ", _uM([["fontSize", "30rpx"], ["borderTopLeftRadius", "5rpx"], ["borderTopRightRadius", "5rpx"], ["borderBottomRightRadius", "5rpx"], ["borderBottomLeftRadius", "5rpx"], ["backgroundColor", "#f5f5f5"], ["paddingTop", 0], ["paddingRight", "10rpx"], ["paddingBottom", 0], ["paddingLeft", "10rpx"]])]])], ["playbackdetail", _uM([[".container .tools-panel .Datetime-box ", _uM([["fontSize", "25rpx"], ["color", "#1890FF"]])]])], ["tool-tag-item", _uM([[".container .tools-panel ", _uM([["paddingTop", "40rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "20rpx"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["speed-label", _uM([[".container .tools-panel .tool-tag-item ", _uM([["borderTopWidth", "2rpx"], ["borderRightWidth", "2rpx"], ["borderBottomWidth", "2rpx"], ["borderLeftWidth", "2rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#1890FF"], ["borderRightColor", "#1890FF"], ["borderBottomColor", "#1890FF"], ["borderLeftColor", "#1890FF"], ["fontSize", "25rpx"], ["color", "#1890FF"], ["paddingTop", "5rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "5rpx"], ["paddingLeft", "15rpx"], ["borderTopLeftRadius", "30rpx"], ["borderTopRightRadius", "30rpx"], ["borderBottomRightRadius", "30rpx"], ["borderBottomLeftRadius", "30rpx"], ["marginLeft", "20rpx"]])]])], ["slider", _uM([[".container .tools-panel .tool-tag-item ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["paddingTop", 0], ["paddingRight", "20rpx"], ["paddingBottom", 0], ["paddingLeft", "30rpx"], ["overflow", "visible"]])]])], ["play-btn", _uM([[".container .tools-panel .tool-tag-item ", _uM([["fontSize", "25rpx"], ["color", "#ffffff"], ["paddingTop", "10rpx"], ["paddingRight", "25rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "25rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginLeft", "20rpx"], ["backgroundColor", "#1890FF"]])]])], ["play-back-info", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginTop", "20rpx"], ["backgroundColor", "#f9f9f9"], ["borderTopLeftRadius", "15rpx"], ["borderTopRightRadius", "15rpx"], ["borderBottomRightRadius", "15rpx"], ["borderBottomLeftRadius", "15rpx"]])]])], ["item-info", _uM([[".container .tools-panel .play-back-info ", _uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["info-label", _uM([[".container .tools-panel .play-back-info ", _uM([["fontSize", "24rpx"], ["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", "10rpx"], ["paddingLeft", 0], ["color", "#999999"]])]])]])]
