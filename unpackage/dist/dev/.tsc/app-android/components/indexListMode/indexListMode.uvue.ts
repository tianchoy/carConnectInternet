import _easycom_i_tag from '@/uni_modules/i-ui-x/components/i-tag/i-tag.uvue'
import _easycom_i_modal from '@/uni_modules/i-ui-x/components/i-modal/i-modal.uvue'
import { getCustomList } from '../../api/request.uts'
	interface DeviceItem {
		plateNo : string
		imei : string,
		status: number,
		companyId:string,
		deviceName : string,
		deviceId : string,
		iccid:string,
		simMerchant:string,
		connectionStatus:string
	}
	
const __sfc__ = defineComponent({
  __name: 'indexListMode',
  props: {
    lists: { type: Array as PropType<DeviceItem[]>, required: true }
  },
  emits: ["unbindDevice"],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const props = __props
		// 解绑设备
	// 定义emit事件
	function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}
	const modal = ref<boolean>(false)
	const imeis = ref('')
	// 是否需要刷新数据
	const needRefresh = ref(false)
	// 支付
	const pay = (iccid : string,simMerchant : string) => {
		if(simMerchant.toLowerCase() == 'zddx'){
			iccid = iccid.substring(0,iccid.length-1) //电信卡
		}
		
		console.log(iccid, " at components/indexListMode/indexListMode.uvue:59")
		// 设置需要刷新的标志
		needRefresh.value = true
		

























		needRefresh.value = false
		uni.showToast({
			title: '请在微信小程序中完成充值',
			icon: 'none'
		})

	}
	// 解绑设备
	const unbindDevice = (imei : string) => {
		imeis.value = imei
		// 显示确认弹窗
		modal.value = true
	}
	const confirm = () => {
		// 确认解绑设备
		// console.log(imeis.value)
		emit('unbindDevice', imeis.value)
		// 隐藏确认弹窗
		modal.value = false
	}
	const cancel = () => {
		// 取消解绑设备
		// 隐藏确认弹窗
		modal.value = false
	}
	const todetail = (companyId:string,imei:string,deviceId:string) => {
		uni.navigateTo({
			url: '/pages/carInfoDetail/carInfoDetail?deptId='+companyId+ '&imei=' + imei + '&deviceId=' + deviceId
		})
	}

return (): any | null => {

const _component_i_tag = resolveEasyComponent("i-tag",_easycom_i_tag)
const _component_i_modal = resolveEasyComponent("i-modal",_easycom_i_modal)

  return _cE("view", _uM({ class: "list-container" }), [
    props.lists.length != 0
      ? _cE("scroll-view", _uM({
          key: 0,
          class: "content",
          "scroll-y": ""
        }), [
          _cE(Fragment, null, RenderHelpers.renderList(props.lists, (item, index, __index, _cached): any => {
            return _cE("view", _uM({
              class: "list-item",
              key: index,
              onClick: () => {todetail(item.companyId,item.imei,item.deviceId)}
            }), [
              _cE("view", _uM({ class: "title" }), [
                _cE("view", _uM({ class: "car-number" }), [
                  _tD(item.deviceName) + " ",
                  _cV(_component_i_tag, _uM({
                    class: "car-status-spacing",
                    size: "mini",
                    shape: "circle",
                    text: item.connectionStatus == 'online' ? '在线' : '离线',
                    type: item.connectionStatus== 'online' ? 'success' : 'error'
                  }), null, 8 /* PROPS */, ["text", "type"])
                ]),
                _cE("view", _uM({ class: "device-tools" }), [
                  _cV(_component_i_tag, _uM({
                    text: "充值",
                    type: "success",
                    onClick: withModifiers(() => {pay(item.iccid,item.simMerchant)}, ["stop"])
                  }), null, 8 /* PROPS */, ["onClick"]),
                  _cV(_component_i_tag, _uM({
                    class: "device-tool-spacing",
                    text: "解绑",
                    type: "warning",
                    onClick: withModifiers(() => {unbindDevice(item.imei)}, ["stop"])
                  }), null, 8 /* PROPS */, ["onClick"])
                ])
              ]),
              _cE("view", null, [
                _cE("text", _uM({ class: "imei" }), "ID: " + _tD(item.imei), 1 /* TEXT */)
              ])
            ], 8 /* PROPS */, ["onClick"])
          }), 128 /* KEYED_FRAGMENT */),
          _cV(_component_i_modal, _uM({
            show: unref(modal),
            title: "提示",
            content: "是否要解绑设备？",
            buttonReverse: true,
            align: "center",
            confirmText: "确定",
            cancelText: "取消",
            showCancelButton: true,
            onConfirm: confirm,
            onCancel: cancel
          }), null, 8 /* PROPS */, ["show"])
        ])
      : _cE("view", _uM({
          key: 1,
          class: "empty"
        }), " 暂无数据 ")
  ])
}
}

})
export default __sfc__
export type IndexListModeComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenComponentsIndexListModeIndexListModeStyles = [_uM([["list-container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#f5f5f5"], ["paddingTop", 0], ["paddingRight", "20rpx"], ["paddingBottom", 0], ["paddingLeft", "20rpx"]]))], ["list-item", _uM([[".list-container .content ", _uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginBottom", "20rpx"]])]])], ["title", _uM([[".list-container .content .list-item ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginBottom", "20rpx"]])]])], ["car-number", _uM([[".list-container .content .list-item .title ", _uM([["display", "flex"], ["fontSize", "35rpx"], ["fontWeight", "bold"], ["marginRight", "20rpx"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["car-status-spacing", _uM([[".list-container .content .list-item .title ", _uM([["marginLeft", "10rpx"]])]])], ["device-tool-spacing", _uM([[".list-container .content .list-item .title ", _uM([["marginLeft", "10rpx"]])]])], ["device-tools", _uM([[".list-container .content .list-item .title ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-end"], ["alignItems", "center"]])]])], ["imei", _uM([[".list-container .content .list-item ", _uM([["color", "#cccccc"]])]])], ["empty", _uM([[".list-container ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["color", "#cccccc"]])]])]])]
