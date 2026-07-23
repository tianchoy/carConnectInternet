type PickerItem = { __$originalPosition?: UTSSourceMapPosition<"PickerItem", "components/sub-navBar/sub-navBar.uvue", 26, 7>;
		label : string;
		value : string;
	};

	type PickerConfirmEvent = { __$originalPosition?: UTSSourceMapPosition<"PickerConfirmEvent", "components/sub-navBar/sub-navBar.uvue", 31, 7>;
		value : Array<PickerItem>;
	};
	
const __sfc__ = defineComponent({
  __name: 'sub-navBar',
  props: {
		showTime: {
			type: Boolean,
			default: true,
		},
		showPickerTime: {
			type: Boolean,
			default: true,
		},
		showCar: {
			type: Boolean,
			default: false,
		},
		showPicker:{
			type:Boolean,
			default:true
		},
		currentTime: {
			type: String,
			default: "",
		},
		currentCar: {
			type: String,
			default: "",
		},
		carStatus: {
			type: String,
			default: "在线",
		},
		times: {
			type: Array as PropType<Array<Array<PickerItem>>>,
			default: () => [[]], // 默认值调整为二维数组
		},
		cars: {
			type: Array as PropType<Array<Array<PickerItem>>>,
			default: () => [[]], // 默认值调整为二维数组
		},
	},
  emits: ["update:currentTime", "update:currentCar"],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const props = __props;

	// 选择器相关
	const columns = ref<Array<Array<PickerItem>>>([]);
	const picker = ref(null);
	const currentPickerType = ref("");

	// 选择器方法
	const handleTime = () => {
		columns.value = props.times; // 直接使用 props.times（已经是二维数组）
		currentPickerType.value = "time";
	};

	const handleCar = () => {
		columns.value = props.cars; // 直接使用 props.cars（已经是二维数组）
		currentPickerType.value = "car";
	};

	const confirm = (e : PickerConfirmEvent) => {
		const selected = e.value[0];

		if (currentPickerType.value === "time") {
			emit("update:currentTime", selected.label); // 通知父组件更新 currentTime
		} else if (currentPickerType.value === "car") {
			emit("update:currentCar", selected.label); // 通知父组件更新 currentCar
		}

		currentPickerType.value = "";
	};

	// 定义 emit 事件
	function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

return (): any | null => {

  return _cE("view", _uM({ class: "tools-box" }), [
    isTrue(_ctx.showTime)
      ? _cE("view", _uM({
          key: 0,
          class: "second",
          onClick: () => {_ctx.showPickerTime ? handleTime : null}
        }), [
          _cE("view", _uM({ class: "times" }), [
            _cE("text", null, _tD(_ctx.currentTime), 1 /* TEXT */),
            isTrue(!_ctx.showPickerTime)
              ? _cE("text", _uM({ key: 0 }), "刷新一次位置")
              : _cC("v-if", true)
          ])
        ], 8 /* PROPS */, ["onClick"])
      : _cE("view", _uM({
          key: 1,
          class: "slot"
        })),
    _cE("view", _uM({ class: "car-box" }), [
      isTrue(_ctx.showCar)
        ? _cE("view", _uM({
            key: 0,
            class: "selectCar",
            onClick: () => {_ctx.showPicker? handleCar : null}
          }), [
            _cE("text", _uM({ class: "plateNo" }), _tD(_ctx.currentCar), 1 /* TEXT */)
          ], 8 /* PROPS */, ["onClick"])
        : _cC("v-if", true),
      _cE("view", _uM({
        class: _nC(["car-state", _ctx.carStatus == 'online' ? 'success' : 'error'])
      }), [
        _cE("text", _uM({ class: "state" }), _tD(_ctx.carStatus == 'online' ? '在线' : '离线'), 1 /* TEXT */)
      ], 2 /* CLASS */)
    ])
  ])
}
}

})
export default __sfc__
export type SubNavBarComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenComponentsSubNavBarSubNavBarStyles = [_uM([["tools-box", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"]]))], ["second", _uM([[".tools-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "rgba(3,109,246,0.71)"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["color", "#ffffff"]])]])], ["car-state", _uM([[".tools-box .car-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "10rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "15rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["color", "#ffffff"], ["fontSize", "25rpx"]])]])], ["car-box", _uM([[".tools-box .car-box .car-state ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0]])], [".tools-box .car-box .selectCar ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0]])], [".tools-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0]])]])], ["selectCar", _uM([[".tools-box .car-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["marginRight", "20rpx"], ["color", "#ffffff"], ["backgroundColor", "rgba(3,109,246,0.71)"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["slot", _uM([[".tools-box ", _uM([["width", "50rpx"], ["height", "20rpx"]])], [".tools-box .car-box .car-state ", _uM([["width", "50rpx"], ["height", "20rpx"]])], [".tools-box .car-box .selectCar ", _uM([["width", "50rpx"], ["height", "20rpx"]])]])], ["plateNo", _uM([[".tools-box .car-box .selectCar ", _uM([["fontSize", "30rpx"]])]])], ["state", _uM([[".tools-box .car-box .car-state ", _uM([["fontSize", "25rpx"]])]])], ["success", _uM([[".tools-box .car-box ", _uM([["backgroundColor", "#5ac725"]])]])], ["error", _uM([[".tools-box .car-box ", _uM([["backgroundColor", "#f56c6c"]])]])], ["times", _uM([[".tools-box .second ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["fontSize", "30rpx"]])]])], ["down_icon", _uM([[".tools-box ", _uM([["width", "30rpx"], ["height", "30rpx"]])]])]])]
