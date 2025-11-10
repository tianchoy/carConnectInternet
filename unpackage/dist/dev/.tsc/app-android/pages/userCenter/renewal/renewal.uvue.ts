import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_number_box from '@/uni_modules/uv-number-box/components/uv-number-box/uv-number-box.vue'
import _easycom_uv_button from '@/uni_modules/uv-button/components/uv-button/uv-button.vue'
import { ref } from 'vue'
	// import { getDeviceDetail } from '../../api/request'
	
const __sfc__ = defineComponent({
  __name: 'renewal',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const iccid = ref('')
	const deviceInfo = ref({})
	const price = ref('5')
	const year = ref(1)

	const valChange = (val) => {
		console.log(val.value, " at pages/userCenter/renewal/renewal.uvue:66")
		year.value = val.value
	}

	onLoad((option) => {
		console.log(option, " at pages/userCenter/renewal/renewal.uvue:71")
		iccid.value = option.iccid
		// loadData()
	})

	const pay = () => {
		//拉起另一个小程序去支付
		uni.navigateToMiniProgram({
			appId: 'wx1234567890', 
			path: 'pages/index/index?iccid=' + iccid.value + '&year=' + year.value, 
			envVersion: 'release', 
			success(res) {
				// 打开成功
				console.log(res, " at pages/userCenter/renewal/renewal.uvue:84")
			},
			fail(res) {
				// 打开失败
				console.log(res, " at pages/userCenter/renewal/renewal.uvue:88")
			}
		})
	}

	// 加载数据
	const loadData = async () => {
		let params = {__$originalPosition: new UTSSourceMapPosition("params", "pages/userCenter/renewal/renewal.uvue", 95, 7),
			iccid: iccid.value
		}
		// const res = await getDeviceDetail(params)
		// deviceInfo.value = res.data
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_number_box = resolveEasyComponent("uv-number-box",_easycom_uv_number_box)
const _component_uv_button = resolveEasyComponent("uv-button",_easycom_uv_button)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "支付",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false,
      isIcon: true,
      isShowStyle: true
    })),
    _cE("view", _uM({ class: "content" }), [
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "ICCID"),
        _cE("view", _uM({ class: "value" }), _tD(iccid.value), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "设备名称"),
        _cE("view", _uM({ class: "value" }), _tD(deviceInfo.value.deviceName), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "设备状态"),
        _cE("view", _uM({ class: "value" }), _tD(deviceInfo.value.deviceStatus), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "续费价格"),
        _cE("view", _uM({ class: "value" }), _tD(price.value) + "元/年", 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "购买年数"),
        _cE("view", _uM({ class: "value" }), [
          _cV(_component_uv_number_box, _uM({
            modelValue: year.value,
            "onUpdate:modelValue": $event => {(year).value = $event},
            min: 1,
            max: 10,
            integer: "",
            disabledInput: true,
            onChange: valChange
          }), _uM({
            minus: withSlotCtx((): any[] => [
              _cE("view", _uM({ class: "minus" }), [
                _cV(_component_uv_icon, _uM({
                  name: "minus",
                  size: "12"
                }))
              ])
            ]),
            input: withSlotCtx((): any[] => [
              _cE("text", _uM({
                style: _nS(_uM({"width":"50rpx","text-align":"center"})),
                class: "input"
              }), _tD(year.value), 5 /* TEXT, STYLE */)
            ]),
            plus: withSlotCtx((): any[] => [
              _cE("view", _uM({ class: "plus" }), [
                _cV(_component_uv_icon, _uM({
                  name: "plus",
                  color: "#FFFFFF",
                  size: "12"
                }))
              ])
            ]),
            _: 1 /* STABLE */
          }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
        ])
      ]),
      _cE("view", _uM({ class: "item" }), [
        _cE("view", _uM({ class: "label" }), "总金额: " + _tD(price.value.value * year.value.value) + "元", 1 /* TEXT */),
        _cE("view", _uM({ class: "value" }), [
          _cV(_component_uv_button, _uM({
            type: "primary",
            text: "去支付",
            onClick: pay
          }))
        ])
      ])
    ])
  ])
}
}

})
export default __sfc__
const GenPagesUserCenterRenewalRenewalStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["backgroundColor", "#f5f5f5"], ["marginTop", "170rpx"]]))], ["content", _uM([[".container ", _uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"], ["paddingTop", "20rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "40rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["item", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["fontSize", "25rpx"], ["marginBottom", "20rpx"]])]])], ["minus", _uM([[".container ", _uM([["width", "35rpx"], ["height", "35rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopColor", "#E6E6E6"], ["borderRightColor", "#E6E6E6"], ["borderBottomColor", "#E6E6E6"], ["borderLeftColor", "#E6E6E6"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["display", "flex"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["input", _uM([[".container ", _uM([["fontSize", "30rpx"]])]])], ["plus", _uM([[".container ", _uM([["width", "35rpx"], ["height", "35rpx"], ["backgroundColor", "#1296db"], ["display", "flex"], ["justifyContent", "center"], ["alignItems", "center"]])]])]])]
