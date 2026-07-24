import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_l_date_time_picker from '@/uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.uvue'
import _easycom_l_popup from '@/uni_modules/lime-popup/components/l-popup/l-popup.uvue'
import _easycom_i_empty from '@/uni_modules/i-ui-x/components/i-empty/i-empty.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
	import { ref, reactive, onMounted, computed } from 'vue'
	import { getTrackPos } from '../../api/request.uts'
	import { getAddress } from '../../utils/getAdress.uts'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	type StopRecord = UTSJSONObject
	
const __sfc__ = defineComponent({
  __name: 'stopRecord',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const carStatus = ref('在线')

	// 日期时间选择器相关
	const showDateTimePicker = ref(false)
	const currentPickerType = ref('start')
	const pickerTitle = ref('选择开始时间')

	const startTime = ref('')
	const endTime = ref('')
	const imei = ref<string | null>('')
	const carStopDetail = ref<Array<StopRecord>>([])
	const getStopNumber = (item: UTSJSONObject, key: string): number => item.getNumber(key, 0)
	const getStopText = (item: UTSJSONObject, key: string): string => item.getString(key, '')

	// 计算属性：按照时间倒序排列的停车记录
	const sortedCarStopDetail = computed((): Array<StopRecord> => {
		const sorted = carStopDetail.value.slice()
		sorted.sort((a: StopRecord, b: StopRecord): number => {
			const timeA = new Date(a.getString('endTime', '')).getTime()
			const timeB = new Date(b.getString('endTime', '')).getTime()
			return timeB - timeA // 倒序排列
		})
		return sorted
	})

	onLoad((option) => {
		imei.value = option.imei
	})

	const initDateTime = () => {
		const now = new Date()
		const formatTime = (date : Date) : string => {
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			const hours = date.getHours().toString().padStart(2, '0')
			const minutes = date.getMinutes().toString().padStart(2, '0')
			const seconds = date.getSeconds().toString().padStart(2, '0')
			return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`
		}

		endTime.value = formatTime(now)
		// 开始时间默认为当前时间前24小时
		const startDate = new Date(now.getTime() - 3600000 * 24)
		startTime.value = formatTime(startDate)
	}

	const loadStopData = async () : Promise<void> => {
		uni.showLoading({
			title: '加载中...'
		})
		const data = { __$originalPosition: new UTSSourceMapPosition("data", "pages/stopRecord/stopRecord.uvue", 110, 9), 
			imei: imei.value,
			startTime: startTime.value,
			endTime: endTime.value,
			minParkTime: 10,
			withStop: true,
			withPos: false,
			withTrip: false
		} as UTSJSONObject
		const res = await getTrackPos(data)
		let stopsWithAddress : Array<StopRecord> = []
		const trackData = res.data
		const stops = trackData?.getArray<UTSJSONObject>('stops') ?? []
		stops.forEach((stop : UTSJSONObject) : void => {
			// 转换坐标到腾讯地图坐标系
			const convertedCoord = CoordTransform.wgs84ToTencent(stop.getNumber('latitude', 0), stop.getNumber('longitude', 0))
			stop.set('latitude', convertedCoord.lat)
			stop.set('longitude', convertedCoord.lng)
			stopsWithAddress.push(stop)
		})

		carStopDetail.value = stopsWithAddress
		uni.hideLoading()
	}

	// 初始化加载
	onMounted(() => {
		initDateTime()
		loadStopData()
	})

	// 显示日期时间选择器
	const showPicker = (type : string) => {
		currentPickerType.value = type
		pickerTitle.value = type === 'start' ? '选择开始时间' : '选择结束时间'
		showDateTimePicker.value = true
	}

	// 确认选择时间
	const onConfirm = (value : string) => {
		if (currentPickerType.value === 'start') {
			startTime.value = value
		} else {
			endTime.value = value
		}
		loadStopData()
		showDateTimePicker.value = false
	}

	const onCancel = () => {
		showDateTimePicker.value = false
	}

	const calculateDuration = (diff:number) : string => {
		const hours = Math.floor(diff / (1000 * 60 * 60))
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((diff % (1000 * 60)) / 1000)

		return `${hours}小时${minutes}分${seconds}秒`
	}

	const showAddress = async (latitude : number, longitude : number) => {
		console.log(latitude, longitude, " at pages/stopRecord/stopRecord.uvue:172")
			uni.openLocation({
			latitude: latitude,
			longitude: longitude,
			name: '当前位置',
			scale: 18,
			success: () => {
				console.log('成功调起地图', " at pages/stopRecord/stopRecord.uvue:179")
			},
			fail: (err) => {
				showAppToast({
					title: '调起地图失败',
					icon: 'none'
				});
				console.error('调起地图失败:', err, " at pages/stopRecord/stopRecord.uvue:186");
			}
		});
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_l_date_time_picker = resolveEasyComponent("l-date-time-picker",_easycom_l_date_time_picker)
const _component_l_popup = resolveEasyComponent("l-popup",_easycom_l_popup)
const _component_i_empty = resolveEasyComponent("i-empty",_easycom_i_empty)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "停车记录",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
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
            _cV(_component_i_icon, _uM({
              name: "/static/xiangxia.png",
              fontSize: "15",
              onClick: () => {showPicker('start')}
            }), null, 8 /* PROPS */, ["onClick"]),
            _cE("text", _uM({
              style: _nS(_uM({"padding":"0 10rpx"}))
            }), "至", 4 /* STYLE */),
            _cE("text", _uM({
              class: "Date",
              onClick: () => {showPicker('end')}
            }), _tD(endTime.value), 9 /* TEXT, PROPS */, ["onClick"]),
            _cV(_component_i_icon, _uM({
              name: "/static/xiangxia.png",
              fontSize: "15",
              onClick: () => {showPicker('end')}
            }), null, 8 /* PROPS */, ["onClick"])
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
      ]),
      _cE("scroll-view", _uM({
        class: "content-box",
        "scroll-y": "true"
      }), [
        sortedCarStopDetail.value.length == 0
          ? _cV(_component_i_empty, _uM({
              key: 0,
              text: "当前时间暂无停车数据",
              showButton: false,
              description: ""
            }))
          : _cE(Fragment, _uM({ key: 1 }), RenderHelpers.renderList(sortedCarStopDetail.value, (item, index, __index, _cached): any => {
              return _cE("view", _uM({
                class: "content",
                key: index
              }), [
                _cE("view", _uM({ class: "item" }), [
                  _cE("image", _uM({
                    class: "icons",
                    mode: "aspectFit",
                    src: "/static/startTime.png"
                  })),
                  _cE("text", null, _tD(item.startTime), 1 /* TEXT */)
                ]),
                _cE("view", _uM({ class: "item" }), [
                  _cE("image", _uM({
                    class: "icons",
                    mode: "aspectFit",
                    src: "/static/endTime.png"
                  })),
                  _cE("text", null, _tD(item.endTime), 1 /* TEXT */)
                ]),
                _cE("view", _uM({ class: "item" }), [
                  _cE("image", _uM({
                    class: "icons",
                    mode: "aspectFit",
                    src: "/static/stopTime.png"
                  })),
                  _cE("text", null, "停留 " + _tD(calculateDuration(item.getNumber('duration', 0))), 1 /* TEXT */)
                ]),
                _cE("view", _uM({ class: "item" }), [
                  _cE("image", _uM({
                    class: "icons",
                    mode: "aspectFit",
                    src: "/static/user_location.png"
                  })),
                  isTrue(item.address)
                    ? _cE("text", _uM({
                        key: 0,
                        class: "address"
                      }), _tD(item.address || '加载中...'), 1 /* TEXT */)
                    : _cE("text", _uM({
                        key: 1,
                        onClick: () => {showAddress(item.getNumber('latitude', 0), item.getNumber('longitude', 0))}
                      }), "点击查看停车位置", 8 /* PROPS */, ["onClick"])
                ])
              ])
            }), 128 /* KEYED_FRAGMENT */)
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesStopRecordStopRecordStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["tools-panel", _uM([[".container ", _uM([["backgroundColor", "#ffffff"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#69c2f1"], ["borderRightColor", "#69c2f1"], ["borderBottomColor", "#69c2f1"], ["borderLeftColor", "#69c2f1"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["Datetime-box", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["date-box", _uM([[".container .tools-panel .Datetime-box ", _uM([["width", "100%"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["Date", _uM([[".container .tools-panel .Datetime-box .date-box ", _uM([["fontSize", "25rpx"], ["borderTopLeftRadius", "5rpx"], ["borderTopRightRadius", "5rpx"], ["borderBottomRightRadius", "5rpx"], ["borderBottomLeftRadius", "5rpx"]])]])], ["mileage_title", _uM([[".container ", _uM([["marginTop", "20rpx"], ["marginRight", "40rpx"], ["marginBottom", 0], ["marginLeft", "40rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["content", _uM([[".container ", _uM([["marginTop", "20rpx"], ["marginRight", "40rpx"], ["marginBottom", "20rpx"], ["marginLeft", "40rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["display", "flex"], ["flexDirection", "column"], ["justifyContent", "flex-start"], ["alignItems", "flex-start"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "15rpx"], ["borderTopRightRadius", "15rpx"], ["borderBottomRightRadius", "15rpx"], ["borderBottomLeftRadius", "15rpx"]])]])], ["content-box", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minHeight", 0], ["marginBottom", "30rpx"]])]])], ["item", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["paddingTop", "15rpx"], ["paddingRight", 0], ["paddingBottom", "15rpx"], ["paddingLeft", 0]])]])], ["icons", _uM([[".container .content .item ", _uM([["width", "40rpx"], ["height", "40rpx"], ["marginRight", "15rpx"]])]])]])]
