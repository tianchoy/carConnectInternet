
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * numberBox 步进器
	 * @description 该组件一般用于商城购物选择物品数量的场景。
	 * @tutorial https://www.uvui.cn/components/numberBox.html
	 * @property {String | Number}	value / v-model			用于双向绑定的值，初始化时设置设为默认min值(最小值)  （默认 0 ）
	 * @property {String | Number}	name			步进器标识符，在change回调返回
	 * @property {String | Number}	min				最小值 （默认 1 ）
	 * @property {String | Number}	max				最大值 （默认 Number.MAX_SAFE_INTEGER ）
	 * @property {String | Number}	step			加减的步长，可为小数 （默认 1 ）
	 * @property {Boolean}			integer			是否只允许输入整数 （默认 false ）
	 * @property {Boolean}			disabled		是否禁用，包括输入框，加减按钮 （默认 false ）
	 * @property {Boolean}			disabledInput	是否禁用输入框 （默认 false ）
	 * @property {Boolean}			asyncChange		是否开启异步变更，开启后需要手动控制输入值 （默认 false ）
	 * @property {String | Number}	inputWidth		输入框宽度，单位为px （默认 35 ）
	 * @property {Boolean}			showMinus		是否显示减少按钮 （默认 true ）
	 * @property {Boolean}			showPlus		是否显示增加按钮 （默认 true ）
	 * @property {String | Number}	decimalLength	显示的小数位数
	 * @property {Boolean}			longPress		是否开启长按加减手势 （默认 true ）
	 * @property {String}			color			输入框文字和加减按钮图标的颜色 （默认 '#323233' ）
	 * @property {String | Number}	buttonSize		按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致 （默认 30 ）
	 * @property {String}			bgColor			输入框和按钮的背景颜色 （默认 '#EBECEE' ）
	 * @property {String | Number}	cursorSpacing	指定光标于键盘的距离，避免键盘遮挡输入框，单位px （默认 100 ）
	 * @property {Boolean}			disablePlus		是否禁用增加按钮 （默认 false ）
	 * @property {Boolean}			disableMinus	是否禁用减少按钮 （默认 false ）
	 * @property {Object ｜ String}	iconStyle		加减按钮图标的样式
	 * @event {Function}	onFocus	输入框活动焦点
	 * @event {Function}	onBlur	输入框失去焦点
	 * @event {Function}	onInput	输入框值发生变化
	 * @event {Function}	onChange
	 * @example <uv-number-box v-model="value" @change="valChange"></uv-number-box>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-number-box',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				// 输入框实际操作的值
				currentValue: '',
				// 定时器
				longPressTimer: null
			}
		},
		watch: {
			// 多个值之间，只要一个值发生变化，都要重新检查check()函数
			watchChange(n) {
				this.check()
			},
			value(newVal) {
				if (newVal !== this.currentValue) {
					this.currentValue = this.format(this.value)
				}
			},
			modelValue(newVal) {
				if (newVal !== this.currentValue) {
					this.currentValue = this.format(this.modelValue)
				}
			}
		},
		computed: {
			getCursorSpacing() {
				// 判断传入的单位，如果为px单位，需要转成px
				return this.$uv.getPx(this.cursorSpacing)
			},
			// 按钮的样式
			buttonStyle() {
				return (type) => {
					const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-number-box/components/uv-number-box/uv-number-box.vue", 145, 12),
						backgroundColor: this.bgColor,
						height: this.$uv.addUnit(this.buttonSize),
						color: this.color
					}
					if (this.isDisabled(type)) {
						style.backgroundColor = '#f7f8fa'
					}
					return style
				}
			},
			// 输入框的样式
			inputStyle() {
				const disabled = this.disabled || this.disabledInput
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-number-box/components/uv-number-box/uv-number-box.vue", 159, 11),
					color: this.color,
					backgroundColor: this.bgColor,
					height: this.$uv.addUnit(this.buttonSize),
					width: this.$uv.addUnit(this.inputWidth)
				}
				return style
			},
			// 用于监听多个值发生变化
			watchChange() {
				return [this.integer, this.decimalLength, this.min, this.max]
			},
			isDisabled() {
				return (type) => {
					if (type === 'plus') {
						// 在点击增加按钮情况下，判断整体的disabled，是否单独禁用增加按钮，以及当前值是否大于最大的允许值
						return (
							this.disabled ||
							this.disablePlus ||
							this.currentValue >= this.max
						)
					}
					// 点击减少按钮同理
					return (
						this.disabled ||
						this.disableMinus ||
						this.currentValue <= this.min
					)
				}
			},
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				const value = this.value || this.modelValue;
				this.currentValue = this.format(value)
			},
			// 格式化整理数据，限制范围
			format(value) {
				value = this.filter(value)
				// 如果为空字符串，那么设置为0，同时将值转为Number类型
				value = value === '' ? 0 : +value
				// 对比最大最小值，取在min和max之间的值
				value = Math.max(Math.min(this.max, value), this.min)
				// 如果设定了最大的小数位数，使用toFixed去进行格式化
				if (this.decimalLength !== null) {
					value = value.toFixed(this.decimalLength)
				}
				return value
			},
			// 过滤非法的字符
			filter(value) {
				// 只允许0-9之间的数字，"."为小数点，"-"为负数时候使用
				value = String(value).replace(/[^0-9.-]/g, '')
				// 如果只允许输入整数，则过滤掉小数点后的部分
				if (this.integer && value.indexOf('.') !== -1) {
					value = value.split('.')[0]
				}
				return value;
			},
			check() {
				// 格式化了之后，如果前后的值不相等，那么设置为格式化后的值
				const val = this.format(this.currentValue);
				if (val !== this.currentValue) {
					this.currentValue = val
				}
			},
			// 输入框活动焦点
			onFocus(event) {
				this.$emit('focus', {
					...event.detail,
					name: this.name,
				})
			},
			// 输入框失去焦点
			onBlur(event) {
				// 对输入值进行格式化
				const value = this.format(event.detail.value)
				// 发出blur事件
				this.$emit(
					'blur', {
						...event.detail,
						name: this.name,
					}
				)
			},
			// 输入框值发生变化
			onInput(e) {
				const {
					value = ''
				} = e.detail || {}
				// 为空返回
				if (value === '') return
				let formatted = this.filter(value)
				// 最大允许的小数长度
				if (this.decimalLength !== null && formatted.indexOf('.') !== -1) {
					const pair = formatted.split('.');
					formatted = `${pair[0]}.${pair[1].slice(0, this.decimalLength)}`
				}
				formatted = this.format(formatted)
				this.emitChange(formatted);
			},
			// 发出change事件
			emitChange(value) {
				// 如果开启了异步变更值，则不修改内部的值，需要用户手动在外部通过v-model变更
				if (!this.asyncChange) {
					this.$nextTick(() => {
						this.$emit('input', value)
						this.$emit('update:modelValue', value)
						this.currentValue = value
						this.$forceUpdate()
					})
				}
				this.$emit('change', {
					value,
					name: this.name,
				});
			},
			onChange() {
				const {
					type
				} = this
				if (this.isDisabled(type)) {
					return this.$emit('overlimit', type)
				}
				const diff = type === 'minus' ? -this.step : +this.step
				const value = this.format(this.add(+this.currentValue, diff))
				this.emitChange(value)
				this.$emit(type)
			},
			// 对值扩大后进行四舍五入，再除以扩大因子，避免出现浮点数操作的精度问题
			add(num1, num2) {
				const cardinal = Math.pow(10, 10);
				return Math.round((num1 + num2) * cardinal) / cardinal
			},
			// 点击加减按钮
			clickHandler(type) {
				this.type = type
				this.onChange()
			},
			longPressStep() {
				// 每隔一段时间，重新调用longPressStep方法，实现长按加减
				this.clearTimeout()
				this.longPressTimer = setTimeout(() => {
					this.onChange()
					this.longPressStep()
				}, 250);
			},
			onTouchStart(type) {
				if (!this.longPress) return
				this.clearTimeout()
				this.type = type
				// 一定时间后，默认达到长按状态
				this.longPressTimer = setTimeout(() => {
					this.onChange()
					this.longPressStep()
				}, 600)
			},
			// 触摸结束，清除定时器，停止长按加减
			onTouchEnd() {
				if (!this.longPress) return
				this.clearTimeout()
			},
			// 清除定时器
			clearTimeout() {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			}
		}
	})

export default __sfc__
function GenUniModulesUvNumberBoxComponentsUvNumberBoxUvNumberBoxRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return _cE("view", _uM({ class: "uv-number-box" }), [
    isTrue(_ctx.showMinus && _ctx.$slots.minus)
      ? _cE("view", _uM({
          key: 0,
          class: "uv-number-box__slot",
          onClick: withModifiers(() => {_ctx.clickHandler('minus')}, ["stop"]),
          onTouchstart: () => {_ctx.onTouchStart('minus')},
          onTouchend: withModifiers(_ctx.clearTimeout, ["stop"])
        }), [
          renderSlot(_ctx.$slots, "minus")
        ], 40 /* PROPS, NEED_HYDRATION */, ["onClick", "onTouchstart", "onTouchend"])
      : isTrue(_ctx.showMinus)
        ? _cE("view", _uM({
            key: 1,
            class: _nC(["uv-number-box__minus", _uM({ 'uv-number-box__minus--disabled': _ctx.isDisabled('minus') })]),
            onClick: withModifiers(() => {_ctx.clickHandler('minus')}, ["stop"]),
            onTouchstart: () => {_ctx.onTouchStart('minus')},
            onTouchend: withModifiers(_ctx.clearTimeout, ["stop"]),
            "hover-class": "uv-number-box__minus--hover",
            "hover-stay-time": "150",
            style: _nS([_ctx.buttonStyle('minus')])
          }), [
            _cV(_component_uv_icon, _uM({
              name: "minus",
              color: _ctx.isDisabled('minus') ? '#c8c9cc' : '#323233',
              size: "15",
              bold: "",
              customStyle: _ctx.iconStyle
            }), null, 8 /* PROPS */, ["color", "customStyle"])
          ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, ["onClick", "onTouchstart", "onTouchend"])
        : _cC("v-if", true),
    renderSlot(_ctx.$slots, "input", {}, (): any[] => [
      _cE("input", _uM({
        disabled: _ctx.disabledInput || _ctx.disabled,
        "cursor-spacing": _ctx.getCursorSpacing,
        class: _nC([_uM({ 'uv-number-box__input--disabled': _ctx.disabled || _ctx.disabledInput }), "uv-number-box__input"]),
        modelValue: _ctx.currentValue,
        onInput: [($event: UniInputEvent) => {(_ctx.currentValue) = $event.detail.value}, _ctx.onInput] as Array<any | null>,
        onBlur: _ctx.onBlur,
        onFocus: _ctx.onFocus,
        type: "number",
        style: _nS([_ctx.inputStyle])
      }), null, 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, ["disabled", "cursor-spacing", "modelValue", "onInput", "onBlur", "onFocus"])
    ]),
    isTrue(_ctx.showPlus && _ctx.$slots.plus)
      ? _cE("view", _uM({
          key: 2,
          class: "uv-number-box__slot",
          onClick: withModifiers(() => {_ctx.clickHandler('plus')}, ["stop"]),
          onTouchstart: () => {_ctx.onTouchStart('plus')},
          onTouchend: withModifiers(_ctx.clearTimeout, ["stop"])
        }), [
          renderSlot(_ctx.$slots, "plus")
        ], 40 /* PROPS, NEED_HYDRATION */, ["onClick", "onTouchstart", "onTouchend"])
      : isTrue(_ctx.showPlus)
        ? _cE("view", _uM({
            key: 3,
            class: _nC(["uv-number-box__plus", _uM({ 'uv-number-box__minus--disabled': _ctx.isDisabled('plus') })]),
            onClick: withModifiers(() => {_ctx.clickHandler('plus')}, ["stop"]),
            onTouchstart: () => {_ctx.onTouchStart('plus')},
            onTouchend: withModifiers(_ctx.clearTimeout, ["stop"]),
            "hover-class": "uv-number-box__plus--hover",
            "hover-stay-time": "150",
            style: _nS([_ctx.buttonStyle('plus')])
          }), [
            _cV(_component_uv_icon, _uM({
              name: "plus",
              color: _ctx.isDisabled('plus') ? '#c8c9cc' : '#323233',
              size: "15",
              bold: "",
              customStyle: _ctx.iconStyle
            }), null, 8 /* PROPS */, ["color", "customStyle"])
          ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, ["onClick", "onTouchstart", "onTouchend"])
        : _cC("v-if", true)
  ])
}
export type UvNumberBoxComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvNumberBoxComponentsUvNumberBoxUvNumberBoxStyles = [_uM([["uv-number-box", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-number-box__slot", _pS(_uM([["touchAction", "none"]]))], ["uv-number-box__plus", _pS(_uM([["width", 35], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["touchAction", "none"], ["borderTopRightRadius", 4], ["borderBottomRightRadius", 4]]))], ["uv-number-box__minus", _pS(_uM([["width", 35], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["touchAction", "none"], ["borderTopLeftRadius", 4], ["borderBottomLeftRadius", 4]]))], ["uv-number-box__plus--hover", _pS(_uM([["!backgroundColor", "#E6E6E6"]]))], ["uv-number-box__minus--hover", _pS(_uM([["!backgroundColor", "#E6E6E6"]]))], ["uv-number-box__plus--disabled", _pS(_uM([["color", "#c8c9cc"], ["backgroundColor", "#f7f8fa"]]))], ["uv-number-box__minus--disabled", _pS(_uM([["color", "#c8c9cc"], ["backgroundColor", "#f7f8fa"]]))], ["uv-number-box__input", _pS(_uM([["position", "relative"], ["textAlign", "center"], ["fontSize", 15], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["marginTop", 0], ["marginRight", 2], ["marginBottom", 0], ["marginLeft", 2], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["uv-number-box__input--disabled", _pS(_uM([["color", "#c8c9cc"], ["backgroundColor", "#f2f3f5"]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
