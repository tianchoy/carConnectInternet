import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_input from '@/uni_modules/uv-input/components/uv-input/uv-input.vue'
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_car_number_input from '@/uni_modules/car-number-input/components/car-number-input/car-number-input.vue'
import { getDeviceDetail, editDeviceInfo } from '../../../api/request.uts'
	import carIcons from '../../../components/car-icons/car-icons.uvue'

	
const __sfc__ = defineComponent({
  __name: 'carDetail',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const deviceId = ref<string>('')
	const carList = ref<UTSJSONObject>({})
	const isEditing = ref(false)
	const carInfo = ref<UTSJSONObject>({})
	const editInfo = ref<UTSJSONObject>({})
	const deviceTypeSelect = ref(null)
	
	// 计算图标标题 - 从组件获取图标信息
	const carTitle = computed(() => {
		if (!carInfo.value.carType) return '未知'
		
		// 使用组件的方法获取图标标题
		const iconInfo = deviceTypeSelect.value?.getIconByName(carInfo.value.carType)
		return iconInfo ? iconInfo.title : '未知'
	})
	
	// 选择图标
	const selectIcon = (item) => {
		editInfo.value.carType = item.name
		editInfo.value.carTypeValue = item.title
		deviceTypeSelect.value?.close()
	}
	
	// 打开图标选择弹窗
	const deviceTypeSelectFun = async () => {
		deviceTypeSelect.value?.open()
	}
	
	// 处理车牌号输入结果
	const handlePlateNumberChange = (e : string) => {
		console.log(e.length, " at pages/userCenter/carDetail/carDetail.uvue:86")
		editInfo.value.plateNo = e
	}
	
	const formattedPlateNo = computed(() => {
	  if (!editInfo.value.plateNo) return '京A'
	  return editInfo.value.plateNo.length > 8 
	    ? editInfo.value.plateNo.substring(0, 8) 
	    : editInfo.value.plateNo
	})

	// 切换编辑状态
	const toggleEdit = () => {
		isEditing.value = !isEditing.value
		if (isEditing.value) {
			// 进入编辑模式时，复制原始数据到编辑对象
			editInfo.value = UTSAndroid.consoleDebugError(JSON.parse(JSON.stringify(carInfo.value)), " at pages/userCenter/carDetail/carDetail.uvue:102")
			
			// 如果已有图标类型，设置对应的标题
			if (editInfo.value.carType && !editInfo.value.carTypeValue) {
				const iconInfo = deviceTypeSelect.value?.getIconByName(editInfo.value.carType)
				if (iconInfo) {
					editInfo.value.carTypeValue = iconInfo.title
				}
			}
		}
	}

	// 保存修改
	const saveChanges = async () => {
		const data = {__$originalPosition: new UTSSourceMapPosition("data", "pages/userCenter/carDetail/carDetail.uvue", 116, 9),
			deviceId: editInfo.value.deviceId,
			deviceName: editInfo.value.deviceName,
			carType: editInfo.value.carType,
			plateNo: editInfo.value.plateNo,
			carVin: editInfo.value.carVin,
			engineNum: editInfo.value.engineNum,
		}
		carInfo.value = UTSAndroid.consoleDebugError(JSON.parse(JSON.stringify(editInfo.value)), " at pages/userCenter/carDetail/carDetail.uvue:124")
		isEditing.value = false

		const res = await editDeviceInfo(data)
		console.log(res, " at pages/userCenter/carDetail/carDetail.uvue:128")
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})
	}

	// 取消编辑
	const cancelEdit = () => {
		isEditing.value = false
	}

	onLoad((option) => {
		console.log('option',option, " at pages/userCenter/carDetail/carDetail.uvue:141")
	    if (option.deviceId != null) {
	        deviceId.value = option.deviceId
	        loadCarListData()
	    } else {
	        // 处理 deviceId 为 null 的情况
	        console.error('deviceId is null', " at pages/userCenter/carDetail/carDetail.uvue:147")
	    }
	})

	const loadCarListData = async () => {
		const res = await getDeviceDetail(deviceId.value)
		console.log(res.data, " at pages/userCenter/carDetail/carDetail.uvue:153")
		if(res.msg=='success'){
			carInfo.value = res.data
		}else{
			uni.showToast({
				title:'获取车辆详情失败'
			})
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_uv_input = resolveEasyComponent("uv-input",_easycom_uv_input)
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_car_number_input = resolveEasyComponent("car-number-input",_easycom_car_number_input)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "车辆详情",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: true,
      isIcon: true,
      onCapsuleClick: toggleEdit,
      Icon: "edit-pen"
    })),
    _cE("view", _uM({ class: "content" }), [
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "设备ID"),
        _cE("text", _uM({ class: "info" }), _tD(unref(carInfo).deviceId), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "设备名称"),
        isTrue(!unref(isEditing))
          ? _cE("text", _uM({
              key: 0,
              class: "info"
            }), _tD(unref(carInfo).deviceName), 1 /* TEXT */)
          : _cV(_component_uv_input, _uM({
              key: 1,
              modelValue: unref(editInfo).deviceName,
              "onUpdate:modelValue": $event => {(unref(editInfo).deviceName) = $event},
              border: "surround",
              inputAlign: "right",
              class: "input"
            }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车标"),
        isTrue(!unref(isEditing))
          ? _cE("text", _uM({
              key: 0,
              class: "info"
            }), _tD(unref(carTitle)), 1 /* TEXT */)
          : _cE("view", _uM({
              key: 1,
              class: "custom-icon",
              onClick: deviceTypeSelectFun
            }), [
              _cE("text", null, _tD(unref(editInfo).carTypeValue || '请选择图标'), 1 /* TEXT */),
              _cV(_component_uv_icon, _uM({
                name: "arrow-down",
                size: "18"
              }))
            ])
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车牌号"),
        isTrue(!unref(isEditing))
          ? _cE("text", _uM({
              key: 0,
              class: "info"
            }), _tD(unref(carInfo).plateNo), 1 /* TEXT */)
          : _cE("view", _uM({
              key: 1,
              class: "info"
            }), [
              _cV(_component_car_number_input, _uM({
                onNumberInputResult: handlePlateNumberChange,
                defaultStr: unref(formattedPlateNo)
              }), null, 8 /* PROPS */, ["defaultStr"])
            ])
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "车架号"),
        isTrue(!unref(isEditing))
          ? _cE("text", _uM({
              key: 0,
              class: "info"
            }), _tD(unref(carInfo).carVin), 1 /* TEXT */)
          : _cV(_component_uv_input, _uM({
              key: 1,
              modelValue: unref(editInfo).carVin,
              "onUpdate:modelValue": $event => {(unref(editInfo).carVin) = $event},
              border: "surround",
              inputAlign: "right",
              class: "input"
            }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
      ]),
      _cE("view", _uM({ class: "list" }), [
        _cE("text", _uM({ class: "title" }), "发动机号"),
        isTrue(!unref(isEditing))
          ? _cE("text", _uM({
              key: 0,
              class: "info"
            }), _tD(unref(carInfo).engineNum), 1 /* TEXT */)
          : _cV(_component_uv_input, _uM({
              key: 1,
              modelValue: unref(editInfo).engineNum,
              "onUpdate:modelValue": $event => {(unref(editInfo).engineNum) = $event},
              border: "surround",
              inputAlign: "right",
              class: "input"
            }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
      ])
    ]),
    isTrue(unref(isEditing))
      ? _cE("view", _uM({
          key: 0,
          class: "button-group"
        }), [
          _cE("button", _uM({
            onClick: saveChanges,
            class: "save-btn"
          }), "保存"),
          _cE("button", _uM({
            onClick: cancelEdit,
            class: "cancel-btn"
          }), "取消")
        ])
      : _cC("v-if", true),
    _cV(unref(carIcons), _uM({
      ref_key: "deviceTypeSelect",
      ref: deviceTypeSelect,
      onSelect: selectIcon
    }), null, 512 /* NEED_PATCH */)
  ])
}
}

})
export default __sfc__
const GenPagesUserCenterCarDetailCarDetailStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#f5f5f5"]]))], ["content", _uM([[".container ", _uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"], ["backgroundColor", "#ffffff"], ["paddingTop", "40rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "40rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["list", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "10rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#eeeeee"]])]])], ["title", _uM([[".container .content .list ", _uM([["color", "#999999"]])]])], ["input", _uM([[".container .content .list ", _uM([["textAlign", "right"], ["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"], ["width", "60%"]])]])], ["info", _uM([[".container .content .list ", _uM([["color", "#333333"], ["textAlign", "right"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["content:empty::after", "\"（无）\""], ["color:empty::after", "#999999"]])]])], ["custom-icon", _uM([[".container .content .list ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]])]])], ["car-input-container", _uM([[".container .content .list ", _uM([["display", "flex"], ["flexDirection", "row"], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0]])]])], ["car-number-input", _uM([[".container .content .list ", _uM([["width", "60%"], ["textAlign", "right"]])]])], ["plate-close", _uM([[".container .content .list .car-number-container ", _uM([["height", 40], ["display", "flex"], ["textAlign", "right"], ["backgroundColor", "#FFFFFF"], ["flexDirection", "row"], ["justifyContent", "flex-end"], ["alignItems", "center"]])]])], ["car-input-item", _uM([[".container .content .list .car-input-container .car-input-box ", _uM([["position", "relative"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#E2E2E2"], ["borderRightColor", "#E2E2E2"], ["borderBottomColor", "#E2E2E2"], ["borderLeftColor", "#E2E2E2"], ["height", 40], ["lineHeight", "40px"], ["textAlign", "center"], ["fontSize", 17], ["width", "auto"], ["marginLeft", "5%"]])]])], ["new-item-img", _uM([[".container .content .list .car-input-container .car-input-box .car-input-item ", _uM([["position", "absolute"], ["top", -2], ["left", "50%"], ["marginLeft", -15], ["height", 13], ["width", 30], ["zIndex", 9]])]])], ["car-input-box", _uM([[".container .content .list .car-input-container ", _uM([["verticalAlign", "middle"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]])]])], ["button-group", _uM([[".container ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginTop", "40rpx"], ["marginRight", "40rpx"], ["marginBottom", 0], ["marginLeft", "40rpx"]])]])], ["grid-text", _uM([[".container ", _uM([["marginTop", "10rpx"], ["fontSize", "20rpx"]])]])]])]
