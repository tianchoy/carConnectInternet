import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_sub_navBar from '@/components/sub-navBar/sub-navBar.uvue'
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_slider from '@/uni_modules/uv-slider/components/uv-slider/uv-slider.vue'
import _easycom_l_date_time_picker from '@/uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.uvue'
import _easycom_l_popup from '@/uni_modules/lime-popup/components/l-popup/l-popup.uvue'
import { ref, reactive, onMounted, watch } from 'vue'
	import { getTrackPos } from '../../api/request.uts'
	import { getDeviceIcon } from '../../utils/cars'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	type polyData = { __$originalPosition?: UTSSourceMapPosition<"polyData", "pages/playBack/playBack.uvue", 67, 7>;
		points : Array<{ latitude : number; longitude : number }>;
		color : string;
		width : number;
		arrowLine : boolean;
		borderColor : string;
		borderWidth : number;
	}
	// 地图状态
	
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
	const trackPoints = ref<Array<any>>([])
	const polyline = ref<Array<any>>([])
	const isPlaying = ref(false)
	const playbackSpeed = ref(5)
	const totalDistance = ref(0)
	const currentSpeed = ref(0)
	const currentTime = ref('')
	const currentIndex = ref(0)
	const carMarker = ref<any>(null)
	let playbackTimer : number | null = 0
	let lastTimestamp = 0

	const startTime = ref('')
	const endTime = ref('')
	const lat = ref<string | null>('')
	const lng = ref<string | null>('')
	const sTime = ref('')
	const eTime = ref('')

	// 标记点集合
	const markers = ref<Array<any>>([])

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

	// 格式化日期显示
	function formatDateForDisplay(dateStr : string) : string {
		if (!dateStr) return ''
		return dateStr.replace(/\//g, '-')
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
	function calculateTrackBounds() {
		if (trackPoints.value.length == 0) return null

		let minLat = trackPoints.value[0].latitude
		let maxLat = trackPoints.value[0].latitude
		let minLng = trackPoints.value[0].longitude
		let maxLng = trackPoints.value[0].longitude

		trackPoints.value.forEach(point => {
			minLat = Math.min(minLat, point.latitude)
			maxLat = Math.max(maxLat, point.latitude)
			minLng = Math.min(minLng, point.longitude)
			maxLng = Math.max(maxLng, point.longitude)
		})

		return { minLat, maxLat, minLng, maxLng }
	}

	// 调整地图以适应轨迹
	function adjustMapToFitTrack() {
		const bounds = calculateTrackBounds()
		if (!bounds) return

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
			return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
		}

		endTime.value = formatTime(now)
		const startDate = new Date(now.getTime() - 3600000 * 24)
		startTime.value = formatTime(startDate)
	}

	// 初始化小车标记
	function initCarMarker() {
		if (trackPoints.value.length > 0) {
			carMarker.value = {
				id: 999,
				latitude: trackPoints.value[0].latitude,
				longitude: trackPoints.value[0].longitude,
				iconPath: getDeviceIcon(carStatus.value, carType.value),	
				width: 25,
				height: 25,
				rotate: trackPoints.value[0].rotation || 0,
				// anchor: { x: 0.5, y: 0.5 },
				// callout: {
				// 	content: plateNo,
				// 	borderRadius: 5,
				// 	padding: 5,
				// 	display: 'ALWAYS'
				// }
			}

			// 添加起点和终点标记
			const startMarker = {__$originalPosition: new UTSSourceMapPosition("startMarker", "pages/playBack/playBack.uvue", 247, 10),
				id: 1000,
				latitude: trackPoints.value[0].latitude,
				longitude: trackPoints.value[0].longitude,
				iconPath: '/static/start.png',
				width: 24,
				height: 24,
				// anchor: { x: 0.5, y: 0.5 },
				callout: {
					content: '起点',
					borderRadius: 5,
					padding: 5,
					display: 'BYCLICK'
				}
			}

			const endMarker = {__$originalPosition: new UTSSourceMapPosition("endMarker", "pages/playBack/playBack.uvue", 263, 10),
				id: 1001,
				latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
				longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
				iconPath: '/static/end.png',
				width: 24,
				height: 24,
				// anchor: { x: 0.5, y: 0.5 },
				callout: {
					content: '终点',
					borderRadius: 5,
					padding: 5,
					display: 'BYCLICK'
				}
			}

			markers.value = [carMarker.value, startMarker, endMarker]
		}
	}

	// 更新轨迹线
	function updatePolyline() {
		if (!trackPoints.value || trackPoints.value.length < 2) {
			polyline.value = []
			return
		}

		const newPolyline : polyData = []

		// 已播放的轨迹部分（实线）
		if (currentIndex.value > 0) {
			const playedPoints = trackPoints.value.slice(0, currentIndex.value + 1)
			if (playedPoints.length >= 2) {
				newPolyline.push({
					points: playedPoints.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
					color: '#1890FF',
					width: 6,
					arrowLine: true,
					borderColor: '#FFF',
					borderWidth: 1
				})
			}
		}

		// 未播放的轨迹部分（虚线）
		if (currentIndex.value < trackPoints.value.length - 1) {
			const unplayedPoints = trackPoints.value.slice(currentIndex.value)
			if (unplayedPoints.length >= 2) {
				newPolyline.push({
					points: unplayedPoints.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
					color: '#999',
					width: 3,
					borderColor: '#FFF',
					borderWidth: 1,
					dottedLine: true
				})
			}
		}

		polyline.value = newPolyline
	}

	// 更新小车位置
	function updateCarPosition() {
		if (carMarker.value && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
			const point = trackPoints.value[currentIndex.value]

			carMarker.value.latitude = point.latitude
			carMarker.value.longitude = point.longitude
			carMarker.value.rotate = point.rotation || 0

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

	// 确认选择时间
	function onConfirm(value : string) {
		let formattedValue = value
		if (formattedValue.includes('-')) {
			formattedValue = formattedValue.replace(/-/g, '/')
		}

		if (currentPickerType.value == 'start') {
			startTime.value = formattedValue
		} else {
			endTime.value = formattedValue
		}
		resetPlayback()
		loadTrackPos()
		showDateTimePicker.value = false
	}
	// 取消选择时间
	function onCancel() {
		showDateTimePicker.value = false
	}

	// 播放控制
	function togglePlayback() {
		if (isPlaying.value) {
			pausePlayback()
		} else {
			startPlayback()
		}
	}
	// 开始回放
	function startPlayback() {
		if (trackPoints.value.length == 0) {
			uni.showToast({ title: '没有轨迹数据', icon: 'none' })
			return
		}

		if (currentIndex.value >= trackPoints.value.length - 1) {
			resetPlayback()
		}

		isPlaying.value = true
		lastTimestamp = Date.now()
		playbackStep()
	}
	// 回放步骤
	function playbackStep() {
		if (!isPlaying.value) return

		const now = Date.now()
		const elapsed = now - lastTimestamp
		const interval = 1000 / playbackSpeed.value

		if (elapsed >= interval) {
			playNextPoint()
			lastTimestamp = now - (elapsed % interval)
		}

		if (isPlaying.value) {
			playbackTimer = setTimeout(playbackStep, 16) // 约60fps
		}
	}
	// 播放下一个点
	function playNextPoint() {
		if (currentIndex.value >= trackPoints.value.length - 1) {
			pausePlayback()
			updatePolyline()
			uni.showToast({
				title: '轨迹回放完成',
				icon: 'none',
				duration: 1500
			})
			return
		}

		currentIndex.value++
		updateCarPosition()
		updatePolyline()

		const point = trackPoints.value[currentIndex.value]
		currentSpeed.value = point.speed || 0
		currentTime.value = point.deviceTime || ''
	}
	// 暂停回放
	function pausePlayback() {
		isPlaying.value = false
		if (playbackTimer) {
			clearTimeout(playbackTimer)
			playbackTimer = null
		}
	}
	// 重置回放
	function resetPlayback() {
		pausePlayback()
		currentIndex.value = 0
		currentSpeed.value = 0
		if (trackPoints.value.length > 0) {
			currentTime.value = trackPoints.value[0].deviceTime || ''
		}
		updateCarPosition()
		updatePolyline()
	}

	// 设置回放速度
	function setPlaybackSpeed(e : any) {
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
		imei.value = option.imei
		carStatus.value = option.connectionStatus
		plateNo.value = option.plateNo
		carType.value = option.carType
		lat.value = option.lat
		lng.value = option.lng
		sTime.value = option.startTime
		eTime.value = option.endTime
		console.log(sTime.value, eTime.value, " at pages/playBack/playBack.uvue:476")
		if(sTime.value && eTime.value) {
			startTime.value = sTime.value
			endTime.value = eTime.value
			loadTrackPos()
		}else{
			initDateTime()
			loadTrackPos()
		}
		
	})

	onUnload(() => {
		pausePlayback()
	})

	const loadTrackPos = async () => {
		uni.showLoading({ title: '加载中...' })
		const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/playBack/playBack.uvue", 494, 9),
			imei: imei.value,
			startTime: startTime.value.replace(/\//g, '-'),
			endTime: endTime.value.replace(/\//g, '-'),
			minParkTime: 2,
			withStop: false,
			withPos: true,
			withTrip: false,
		}

		const res = await getTrackPos(data)
		//当轨迹数据不为空时，处理轨迹数据
		if (res.data.positions && res.data.positions.length > 0) {
			processTrackData(res.data.positions)
			uni.hideLoading()
		}
		else {
			// 当轨迹数据为空时，使用传过来的经纬度 来标记当前位置
			showCurrentPosition()
			uni.hideLoading()
		}
	}

	// 显示当前位置
	function showCurrentPosition() {
		uni.showToast({
			title: '这段时间没有数据',
			icon: 'none',
			duration: 2000
		})
		// 转换坐标到腾讯地图坐标系
		const originalLat = parseFloat(lat.value)
		const originalLng = parseFloat(lng.value)
		const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)

		// 设置地图中心点
		center.latitude = convertedCoord.lat
		center.longitude = convertedCoord.lng
		mapScale.value = 15

		// 创建当前位置标记
		const currentPoint = {__$originalPosition: new UTSSourceMapPosition("currentPoint", "pages/playBack/playBack.uvue", 535, 9),
			latitude: convertedCoord.lat,
			longitude: convertedCoord.lng,
			speed: 0,
			deviceTime: new Date().toLocaleString(),
			timestamp: Date.now(),
			rotation: 0,
			originalLatitude: originalLat,
			originalLongitude: originalLng
		}

		// 初始化小车标记
		carMarker.value = {
			id: 999,
			latitude: currentPoint.latitude,
			longitude: currentPoint.longitude,
			iconPath: getDeviceIcon(carStatus.value, carType.value),
			width: 25,
			height: 25,
			rotate: 0,
			// anchor: { x: 0.5, y: 0.5 },
			// callout: {
			// 	content: plateNo.value,
			// 	borderRadius: 5,
			// 	padding: 5,
			// 	display: 'ALWAYS'
			// }
		}

		// 设置标记点
		markers.value = [carMarker.value]
	}

	// 处理轨迹数据
	function processTrackData(positions : Array<any>) {
		const processedPoints = []

		for (let i = 0; i < positions.length; i++) {
			const point = positions[i]
			const deviceTimeStr = point.getString('deviceTime', '')

			// 获取原始坐标
			const originalLat = point.getNumber('latitude', 0)
			const originalLng = point.getNumber('longitude', 0)

			// 转换坐标到腾讯地图坐标系
			const convertedCoord = CoordTransform.wgs84ToTencent(originalLat, originalLng)

			const processedPoint = {__$originalPosition: new UTSSourceMapPosition("processedPoint", "pages/playBack/playBack.uvue", 583, 10),
				latitude: convertedCoord.lat,
				longitude: convertedCoord.lng,
				speed: point.getNumber('speed', 0),
				deviceTime: formatDateForDisplay(deviceTimeStr),
				timestamp: safeParseDate(deviceTimeStr),
				// 保留原始坐标信息
				originalLatitude: originalLat,
				originalLongitude: originalLng
			}

			if (i > 0) {
				const prevPoint = processedPoints[i - 1]
				processedPoint.rotation = calculateBearing(
					prevPoint.latitude, prevPoint.longitude,
					processedPoint.latitude, processedPoint.longitude
				)
			} else {
				processedPoint.rotation = 0
			}

			processedPoints.push(processedPoint)
		}

		if (processedPoints.length > 1) {
			processedPoints[processedPoints.length - 1].rotation =
				processedPoints[processedPoints.length - 2].rotation
		}

		trackPoints.value = processedPoints
		calculateTrackDistance()
		initCarMarker()
		updatePolyline()
		adjustMapToFitTrack()

		if (trackPoints.value.length > 0) {
			currentTime.value = trackPoints.value[0].deviceTime
		}

	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_marker = resolveComponent("marker")
const _component_sub_navBar = resolveEasyComponent("sub-navBar",_easycom_sub_navBar)
const _component_map = resolveComponent("map")
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_slider = resolveEasyComponent("uv-slider",_easycom_uv_slider)
const _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker",_easycom_l_date_time_picker)
const _component_l_popup = resolveEasyComponent("l-popup",_easycom_l_popup)

  return _cE("view", _uM({ class: "container" }), [
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
      }), _uM({
        default: withSlotCtx((): any[] => [
          isTrue(carMarker.value)
            ? _cV(_component_marker, _uM({
                key: 0,
                id: carMarker.value.id,
                latitude: carMarker.value.latitude,
                longitude: carMarker.value.longitude,
                iconPath: carMarker.value.iconPath,
                width: carMarker.value.width,
                height: carMarker.value.height,
                rotate: carMarker.value.rotate,
                anchor: carMarker.value.anchor,
                callout: carMarker.value.callout,
                animation: carMarker.value.animation
              }), null, 8 /* PROPS */, ["id", "latitude", "longitude", "iconPath", "width", "height", "rotate", "anchor", "callout", "animation"])
            : _cC("v-if", true),
          _cV(_component_sub_navBar, _uM({
            showTime: false,
            currentCar: plateNo.value,
            showCar: true,
            carStatus: carStatus.value
          }), null, 8 /* PROPS */, ["currentCar", "carStatus"])
        ]),
        _: 1 /* STABLE */
      }), 8 /* PROPS */, ["latitude", "longitude", "markers", "polyline", "scale", "style"])
    ]),
    _cE("view", _uM({ class: "tools-panel" }), [
      _cE("view", _uM({ class: "Datetime-box" }), [
        _cE("view", _uM({ class: "date-box" }), [
          _cV(_component_uv_icon, _uM({
            name: "calendar",
            size: "25"
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
        _cE("view", _uM({
          class: "play-btn",
          onClick: togglePlayback
        }), _tD(isPlaying.value ? '暂停':'播放'), 1 /* TEXT */),
        _cE("view", _uM({ class: "slider" }), [
          _cV(_component_uv_slider, _uM({
            modelValue: playbackSpeed.value,
            "onUpdate:modelValue": $event => {(playbackSpeed).value = $event},
            backgroundColor: "#f5f5f5",
            activeColor: "#1890FF",
            min: "1",
            max: "10",
            onChange: setPlaybackSpeed,
            "block-color": "#1890FF"
          }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
        ]),
        _cE("text", _uM({ class: "speed-label" }), _tD(playbackSpeed.value) + "x", 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "play-back-info" }), [
        _cE("view", _uM({ class: "item-info" }), [
          _cE("text", null, _tD(currentTime.value), 1 /* TEXT */),
          _cE("text", _uM({ class: "info-label" }), "时间")
        ]),
        _cE("view", _uM({ class: "item-info" }), [
          _cE("text", null, _tD(currentSpeed.value) + "Km/h", 1 /* TEXT */),
          _cE("text", _uM({ class: "info-label" }), "速度")
        ]),
        _cE("view", _uM({ class: "item-info" }), [
          _cE("text", null, _tD((totalDistance.value/1000).toFixed(1)) + "Km", 1 /* TEXT */),
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
  ])
}
}

})
export default __sfc__
const GenPagesPlayBackPlayBackStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["tools-panel", _uM([[".container ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["paddingTop", "50rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "50rpx"], ["paddingLeft", "20rpx"], ["boxShadow", "0 -10rpx 20rpx rgba(0, 0, 0, 0.1)"]])]])], ["Datetime-box", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginBottom", "30rpx"]])]])], ["date-box", _uM([[".container .tools-panel .Datetime-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["Date", _uM([[".container .tools-panel .Datetime-box .date-box ", _uM([["fontSize", "25rpx"], ["borderTopLeftRadius", "5rpx"], ["borderTopRightRadius", "5rpx"], ["borderBottomRightRadius", "5rpx"], ["borderBottomLeftRadius", "5rpx"], ["backgroundColor", "#f5f5f5"], ["paddingTop", 0], ["paddingRight", "10rpx"], ["paddingBottom", 0], ["paddingLeft", "10rpx"]])]])], ["playbackdetail", _uM([[".container .tools-panel .Datetime-box ", _uM([["fontSize", "25rpx"], ["color", "#1890FF"]])]])], ["tool-tag-item", _uM([[".container .tools-panel ", _uM([["paddingTop", "40rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "20rpx"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["speed-label", _uM([[".container .tools-panel .tool-tag-item ", _uM([["borderTopWidth", "2rpx"], ["borderRightWidth", "2rpx"], ["borderBottomWidth", "2rpx"], ["borderLeftWidth", "2rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#1890FF"], ["borderRightColor", "#1890FF"], ["borderBottomColor", "#1890FF"], ["borderLeftColor", "#1890FF"], ["fontSize", "25rpx"], ["color", "#1890FF"], ["paddingTop", "5rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "5rpx"], ["paddingLeft", "15rpx"], ["borderTopLeftRadius", "30rpx"], ["borderTopRightRadius", "30rpx"], ["borderBottomRightRadius", "30rpx"], ["borderBottomLeftRadius", "30rpx"], ["marginLeft", "20rpx"]])]])], ["slider", _uM([[".container .tools-panel .tool-tag-item ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["paddingTop", 0], ["paddingRight", "20rpx"], ["paddingBottom", 0], ["paddingLeft", "30rpx"]])]])], ["play-btn", _uM([[".container .tools-panel .tool-tag-item ", _uM([["fontSize", "25rpx"], ["color", "#ffffff"], ["paddingTop", "10rpx"], ["paddingRight", "25rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "25rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginLeft", "20rpx"], ["backgroundColor", "#1890FF"]])]])], ["play-back-info", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginTop", "20rpx"], ["backgroundColor", "#f9f9f9"], ["borderTopLeftRadius", "15rpx"], ["borderTopRightRadius", "15rpx"], ["borderBottomRightRadius", "15rpx"], ["borderBottomLeftRadius", "15rpx"]])]])], ["item-info", _uM([[".container .tools-panel .play-back-info ", _uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["info-label", _uM([[".container .tools-panel .play-back-info ", _uM([["fontSize", "25rpx"], ["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", "10rpx"], ["paddingLeft", 0], ["color", "#999999"]])]])]])]
