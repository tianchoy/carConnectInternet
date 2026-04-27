import _easycom_l_picker_item from '@/uni_modules/lime-picker/components/l-picker-item/l-picker-item.uvue'
import { PickerProps, PickerColumn, PickerValue, PickerColumnItem, PickerConfirmEvent, PickerPickEvent } from './type';
	import { pushAt } from './utils';
	import { unitConvert } from '@/uni_modules/lime-shared/unitConvert'

	import { useLoading } from '@/uni_modules/lime-loading'

	
const __sfc__ = defineComponent({
  __name: 'l-picker',
  __props: PickerProps,
  props: {
    cancelBtn: { type: String, required: false },
    cancelStyle: { type: [String, UTSJSONObject], required: false },
    confirmBtn: { type: String, required: false },
    confirmStyle: { type: [String, UTSJSONObject], required: false },
    title: { type: String, required: false },
    titleStyle: { type: [String, UTSJSONObject], required: false },
    keys: { type: UTSJSONObject, required: false },
    columns: { type: Array as PropType<PickerColumn[]>, required: true, default: [] as PickerColumn[] },
    modelValue: { type: Array as PropType<PickerValue[]>, required: false },
    defaultValue: { type: Array as PropType<PickerValue[]>, required: false },
    value: { type: Array as PropType<PickerValue[]>, required: false },
    loading: { type: Boolean, required: true, default: false },
    loadingColor: { type: String, required: false },
    loadingMaskColor: { type: String, required: false },
    loadingSize: { type: String, required: true, default: '64rpx' },
    itemHeight: { type: String, required: false },
    itemColor: { type: String, required: false },
    itemFontSize: { type: String, required: false },
    itemActiveColor: { type: String, required: false },
    itemActiveFontWeight: { type: Number, required: false },
    indicatorStyle: { type: String, required: false },
    bgColor: { type: String, required: false },
    groupHeight: { type: String, required: false },
    radius: { type: String, required: false },
    resetIndex: { type: Boolean, required: true, default: false }
  },
  emits: ['change', 'cancel', 'pick', 'confirm', 'update:modelValue', 'update:value'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	/**
	 * Picker 选择器组件
	 * @description 多列数据选择器，支持级联数据展示和自定义样式配置
	 * <br>插件类型：LPickerComponentPublicInstance 
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-picker
	 * 
	 * @property {string} cancelBtn 取消按钮文字
	 * @property {string | UTSJSONObject} cancelStyle 取消按钮样式
	 * @property {string} confirmBtn 确定按钮文字
	 * @property {string | UTSJSONObject} confirmStyle 确定按钮样式
	 * @property {string} title 标题文字
	 * @property {string | UTSJSONObject} titleStyle 标题样式
	 * @property {UTSJSONObject} keys 字段别名配置（例：{value: 'id', label: 'name'}）
	 * @property {PickerColumn[]} columns 选择器列数据（必填）
	 * @property {PickerValue[]} modelValue 选中值（支持v-model）
	 * @property {PickerValue[]} defaultValue 默认选中值
	 * @property {PickerValue[]} value 选中值（兼容旧版）
	 * @property {boolean} loading 是否显示加载状态
	 * @property {string} loadingColor 加载图标颜色
	 * @property {string} loadingMaskColor 加载遮罩颜色
	 * @property {string} loadingSize 加载图标尺寸
	 * @property {string} itemHeight 选项行高度
	 * @property {string} itemColor 选项文字颜色
	 * @property {string} itemFontSize 选项字体大小
	 * @property {string} itemActiveColor 选中项颜色
	 * @property {string} indicatorStyle 指示器样式
	 * @property {string} bgColor 背景颜色
	 * @property {string} groupHeight 选项组高度
	 * @property {string} radius 圆角半径
	 * @property {boolean} resetIndex 是否重置选中索引
	 * 
	 * @event {Function} confirm 点击确定时触发（事件参数：PickerConfirmEvent）
	 * @event {Function} cancel 点击取消时触发
	 * @event {Function} change 值变化时触发（事件参数：PickerPickEvent）
	 * @event {Function} column-change 列数据变化时触发（事件参数：PickerChangeInfo）
	 */
	function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}
	const props = __props
	const pickerItemInstanceArray = reactive<LPickerItemComponentPublicInstance[]>([]);
	const ohosShow = ref(0)
	const modelValue = ref<PickerValue[]>(props.value ?? props.modelValue ?? props.defaultValue ?? [])
	const pickerValue = computed({
		set(value : PickerValue[]) {
			if (value.join('') == modelValue.value.join('')) return
			modelValue.value = value;
			emit('update:modelValue', value)
			emit('change', value)
		},
		get() : PickerValue[] {
			return props.value ?? props.modelValue ?? modelValue.value
		}
	} as WritableComputedOptions<PickerValue[]>)

	const isEmpty = computed(() : boolean => {
		return props.columns.length == 0 && pickerItemInstanceArray.every(child => child.options.length == 0)
	})
	const styles = computed(() : Map<string, any> => {
		const style = new Map<string, any>()
		if (props.bgColor != null) {
			style.set('background', props.bgColor!)
		}
		if (props.radius != null) {
			style.set('border-top-left-radius', props.radius!)
			style.set('border-top-right-radius', props.radius!)
		}
		return style
	})

	const curIndexArray = ref<number[]>([]);
	const curValueArray = ref([...pickerValue.value]);
	const curItemArray : PickerColumnItem[] = []
	const realColumns = computed(() : PickerColumn[] => {
		const pickerColumns = pickerItemInstanceArray.map((child) : PickerColumn => child.options)
		if (pickerColumns.length > 0) {
			return pickerColumns
		}
		return props.columns
	})

	const manageChildInList = (child : LPickerItemComponentPublicInstance, shouldAdd : boolean) => {
		const index = pickerItemInstanceArray.indexOf(child);
		if (shouldAdd) {
			if (index != -1) return
			pickerItemInstanceArray.push(child)
		} else {
			if (index == -1) return
			pickerItemInstanceArray.splice(index, 1);
		}
	}

	const updateItems = (item : PickerColumnItem, index : number, column : number) => {
		pushAt(curIndexArray.value, column, index)
		pushAt(curValueArray.value, column, item.value)
		pushAt(curItemArray, column, item)
	};
	
	const updatePickerItems = () => {
		const _indexs : number[] = []
		const _values : any[] = []
		pickerItemInstanceArray.forEach((child, column) => {
			if (child.options.length == 0) return
			const value = curValueArray.value.length > column ? curValueArray.value[column] : null;





			// const index = value == null ? 0 : child.getIndexByValue(value)
			// child.setIndex(index)
			const index : number = (value == null ? 0 : child.$callMethod('getIndexByValue', value)) as number
			child.$callMethod('setIndex', index)

			const item = child.options[index]
			_indexs.push(index)
			_values.push(item.value)

			pushAt(curItemArray, column, item)
			// pushAt(curIndexArray.value, column, index)
			// pushAt(curValueArray.value, column, item.value)
			// // 不能改变单向数据流, 只有值不存在时候才处理
			// if(pickerValue.value.length == 0) {
			// 	pickerValue.value = [...curValueArray.value]
			// }
			// if(pickerValue.value.join('') == curValueArray.value.join('')) return
			// pickerValue.value = [...curValueArray.value]
		})
		if (curIndexArray.value.join('') == _indexs.join('')) return
		curIndexArray.value = _indexs
		curValueArray.value = _values
		// if(pickerValue.value.length == 0) {
		pickerValue.value = [...curValueArray.value]
		// }
	}

	const onPick = (item : PickerColumnItem, index : number, column : number) => {
		if (curIndexArray.value[column] == index) return
		pushAt(curIndexArray.value, column, index)
		pushAt(curValueArray.value, column, item.value)
		pushAt(curItemArray, column, item)
		const obj : PickerPickEvent = {
			values: curValueArray.value,
			column,
			index
		}
		pickerValue.value = [...curValueArray.value]
		emit('pick', obj)
	};

	const onCancel = (e : UniPointerEvent) => {
		updatePickerItems()
		emit('cancel', e)
	}
	const onConfirm = (e : UniPointerEvent) => {
		const values = [...curValueArray.value];
		const indexs = [...curIndexArray.value];
		const items = curItemArray.map((item) : PickerColumnItem => toRaw(item))
		if (pickerValue.value.join('') != values.join('')) {
			pickerValue.value = values;
		}
		const obj : PickerConfirmEvent = {
			values,
			indexs,
			items
		}
		emit('confirm', obj)
	}
	const stopPickerValue = watch(pickerValue, () => {
		if (pickerValue.value.join('') == curValueArray.value.join('')) return
		curValueArray.value = pickerValue.value.map((item : PickerValue) => item);
		updatePickerItems()
	})

	const stopColumns = watch(realColumns, () => {
		updatePickerItems()
		// nextTick(() => {
		// 	setTimeout(()=>{
		// 		updatePickerItems()
		// 	},2000)
			
		// })
	})
	
	





























	
	onMounted(() => {
		nextTick(() => {
			
			if (pickerValue.value.join('') != curValueArray.value.join('') && pickerValue.value.length > 0) {
				curValueArray.value = [...pickerValue.value]
				updatePickerItems()
			}
		})
	})

	const loadingRef = ref<UniElement | null>(null);
	// const {play, clear, failed} = useLoading(loadingRef, 'circular', props.loadingColor?? '#3283ff', unitConvert(props.loadingSize))
	const loadingAni = useLoading(loadingRef)
	loadingAni.type = 'circular'
	loadingAni.color = props.loadingColor ?? '#3283ff'
	loadingAni.ratio = unitConvert(props.loadingSize)
	watchEffect(() => {
		if (props.loading) {
			loadingAni.play()
		} else {
			loadingAni.clear()
		}
	})


	onBeforeUnmount(() => {
		stopPickerValue()
		stopColumns()
	})

	provide('limePicker', props)
	provide('limePickerOnPick', onPick)
	provide('limePickerUpdateItems', updateItems)
	provide('limePickerItems', pickerItemInstanceArray)
	provide('limePickerManageChildInList', manageChildInList)

return (): any | null => {

const _component_l_picker_item = resolveEasyComponent("l-picker-item",_easycom_l_picker_item)

  return _cE("view", _uM({
    class: "l-picker",
    style: _nS([unref(styles)]),
    ref: "pickerRef"
  }), [
    isTrue(_ctx.cancelBtn != null || _ctx.title != null || _ctx.confirmBtn != null)
      ? _cE("view", _uM({
          class: "l-picker__toolbar",
          key: unref(ohosShow)
        }), [
          _ctx.cancelBtn != null
            ? _cE("text", _uM({
                class: "l-picker__cancel",
                key: unref(ohosShow),
                style: _nS(_ctx.cancelStyle??''),
                onClick: onCancel
              }), _tD(_ctx.cancelBtn), 5 /* TEXT, STYLE */)
            : _cC("v-if", true),
          _cE("text", _uM({
            class: "l-picker__title",
            key: unref(ohosShow),
            style: _nS(_ctx.titleStyle??'')
          }), _tD(_ctx.title), 5 /* TEXT, STYLE */),
          _ctx.confirmBtn != null
            ? _cE("text", _uM({
                class: "l-picker__confirm",
                key: unref(ohosShow),
                style: _nS(_ctx.confirmStyle??''),
                onClick: onConfirm
              }), _tD(_ctx.confirmBtn), 5 /* TEXT, STYLE */)
            : _cC("v-if", true)
        ])
      : _cC("v-if", true),
    renderSlot(_ctx.$slots, "header"),
    _cE("view", _uM({
      class: "l-picker__main",
      style: _nS([_ctx.groupHeight != null ? _uM({ height:  _ctx.groupHeight}): _uM<string, any | null>({})])
    }), [
      renderSlot(_ctx.$slots, "default", {}, (): any[] => [
        _cE(Fragment, null, RenderHelpers.renderList(props.columns, (options, i, __index, _cached): any => {
          return _cV(_component_l_picker_item, _uM({
            options: options,
            key: i,
            column: i,
            value: unref(pickerValue).length > i ? unref(pickerValue)[i]: null
          }), null, 8 /* PROPS */, ["options", "column", "value"])
        }), 128 /* KEYED_FRAGMENT */)
      ]),
      isTrue(unref(isEmpty))
        ? _cE("view", _uM({
            key: 0,
            class: "l-picker__empty"
          }), [
            renderSlot(_ctx.$slots, "empty")
          ])
        : _cC("v-if", true)
    ], 4 /* STYLE */),
    renderSlot(_ctx.$slots, "footer"),
    isTrue(_ctx.loading)
      ? _cE("view", _uM({
          key: 1,
          class: "l-picker__loading",
          ref_key: "loadingRef",
          ref: loadingRef,
          style: _nS([_ctx.loadingMaskColor != null ? _uM({background: _ctx.loadingMaskColor}): _uM<string, any | null>({})])
        }), null, 4 /* STYLE */)
      : _cC("v-if", true)
  ], 4 /* STYLE */)
}
}

})
export default __sfc__
export type LPickerComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesLimePickerComponentsLPickerLPickerStyles = [_uM([["l-picker", _pS(_uM([["position", "relative"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"]]))], ["l-picker__toolbar", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "space-between"], ["overflow", "hidden"], ["height", "116rpx"], ["flexDirection", "row"], ["position", "relative"]]))], ["l-picker__title", _pS(_uM([["position", "absolute"], ["left", "50%"], ["top", "50%"], ["transform", "translateX(-50%) translateY(-50%)"], ["textAlign", "center"], ["overflow", "hidden"], ["whiteSpace", "nowrap"], ["textOverflow", "ellipsis"], ["color", "rgba(0,0,0,0.88)"], ["lineHeight", "52rpx"], ["fontWeight", "700"], ["fontSize", 18]]))], ["l-picker__cancel", _pS(_uM([["fontSize", 16], ["lineHeight", "116rpx"], ["height", "100%"], ["paddingTop", 0], ["paddingRight", "32rpx"], ["paddingBottom", 0], ["paddingLeft", "32rpx"], ["color", "rgba(0,0,0,0.65)"]]))], ["l-picker__confirm", _pS(_uM([["fontSize", 16], ["lineHeight", "116rpx"], ["height", "100%"], ["paddingTop", 0], ["paddingRight", "32rpx"], ["paddingBottom", 0], ["paddingLeft", "32rpx"], ["color", "#3283ff"]]))], ["l-picker__main", _pS(_uM([["display", "flex"], ["height", "400rpx"], ["flexDirection", "row"], ["paddingTop", 0], ["paddingRight", "16rpx"], ["paddingBottom", 0], ["paddingLeft", "16rpx"]]))], ["l-picker__empty", _pS(_uM([["pointerEvents", "none"], ["justifyContent", "center"], ["alignItems", "center"], ["display", "flex"], ["position", "absolute"], ["top", 0], ["bottom", 0], ["left", 0], ["right", 0], ["zIndex", 3]]))], ["l-picker__loading", _pS(_uM([["zIndex", 3], ["backgroundImage", "none"], ["backgroundColor", "rgba(255,255,255,0.9)"], ["justifyContent", "center"], ["alignItems", "center"], ["display", "flex"], ["position", "absolute"], ["top", 0], ["bottom", 0], ["left", 0], ["right", 0]]))]])]

import { LPickerItemComponentPublicInstance  } from "@/uni_modules/lime-picker/components/l-picker-item/l-picker-item.uvue"