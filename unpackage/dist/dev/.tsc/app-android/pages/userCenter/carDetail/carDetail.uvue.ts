import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import { ref, computed } from 'vue'
	import { getDeviceDetail } from '../../../api/request.uts'

	
const __sfc__ = defineComponent({
  __name: 'carDetail',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const deviceId = ref<string>('')
	const carInfo = ref<UTSJSONObject>({})
	const carTitle = computed((): string => carInfo.value.getString('carType', '未知'))
	const formattedPlateNo = computed((): string => carInfo.value.getString('plateNo', '京A'))
	const toggleEdit = () => {}

	const loadCarListData = async () : Promise<void> => {
		const res = await getDeviceDetail(deviceId.value) as UTSJSONObject
		const data = res.getJSON('data')
		if (data != null) carInfo.value = data
	}

	onLoad((option) => {
		const id = option.deviceId
		if (id != null) {
			deviceId.value = id
			loadCarListData()
		}
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "车辆详情",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false,
      isIcon: true,
      onCapsuleClick: toggleEdit,
      Icon: "/static/edit-pen.png"
    })),
    _cE("view", _uM({ class: "content" }), [
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "设备ID"),
        _cE("text", _uM({ class: "info" }), _tD(carInfo.value.getString('deviceId', '')), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "设备名称"),
        _cE("text", _uM({ class: "info" }), _tD(carInfo.value.getString('deviceName', '')), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车标"),
        _cE("text", _uM({ class: "info" }), _tD(carTitle.value), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车牌号"),
        _cE("text", _uM({ class: "info" }), _tD(formattedPlateNo.value), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车架号"),
        _cE("text", _uM({ class: "info" }), _tD(carInfo.value.getString('carVin', '')), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "发动机号"),
        _cE("text", _uM({ class: "info" }), _tD(carInfo.value.getString('engineNum', '')), 1 /* TEXT */)
      ])
    ])
  ])
}
}

})
export default __sfc__
const GenPagesUserCenterCarDetailCarDetailStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["backgroundColor", "#f5f5f5"]]))], ["content", _pS(_uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"], ["backgroundColor", "#ffffff"], ["paddingTop", "40rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "40rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]]))], ["list", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "10rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#eeeeee"]]))], ["title", _pS(_uM([["width", "30%"], ["color", "#999999"]]))], ["info", _pS(_uM([["color", "#333333"], ["textAlign", "right"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))]])]
