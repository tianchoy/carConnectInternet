
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * checkbox  复选框
	 * @description 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便
	 * @tutorial https://www.uvui.cn/components/checkbox.html
	 * @property {String | Number | Boolean}	name			checkbox组件的标示符
	 * @property {String}						shape			形状，square为方形，circle为圆型
	 * @property {String | Number}				size			整体的大小
	 * @property {Boolean}						checked			是否默认选中
	 * @property {String | Boolean}				disabled		是否禁用
	 * @property {String}						activeColor		选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
	 * @property {String}						inactiveColor	未选中的颜色
	 * @property {String | Number}				iconSize		图标的大小，单位px
	 * @property {String}						iconColor		图标颜色
	 * @property {String | Number}				label			label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
	 * @property {String}						labelColor 		label的颜色
	 * @property {String | Number}				labelSize		label的字体大小，px单位
	 * @property {String | Boolean}				labelDisabled	是否禁止点击提示语选中复选框
	 * @property {Object}						customStyle		定义需要用到的外部样式
	 * 
	 * @event {Function}	change	任一个checkbox状态发生变化时触发，回调为一个对象
	 * @example <uv-checkbox v-model="checked" :disabled="false">天涯</uv-checkbox>
	 */
	const __sfc__ = defineComponent({
		name: "uv-checkbox",
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				isChecked: false,
				// 父组件的默认值，因为头条小程序不支持在computed中使用this.parent.shape的形式
				// 故只能使用如此方法
				parentData: {
					iconSize: 12,
					labelDisabled: null,
					disabled: null,
					shape: 'square',
					activeColor: null,
					inactiveColor: null,
					size: 18,
					value: null,
					modelValue: null,
					iconColor: null,
					placement: 'row',
					borderBottom: false,
					iconPlacement: 'left',
					labelSize: 14,
					labelColor: '#303133'
				}
			}
		},
		computed: {
			// 是否禁用，如果父组件uv-raios-group禁用的话，将会忽略子组件的配置
			elDisabled() {
				return this.disabled !== '' ? this.disabled : this.parentData.disabled !== null ? this.parentData.disabled : false;
			},
			// 是否禁用label点击
			elLabelDisabled() {
				return this.labelDisabled !== '' ? this.labelDisabled : this.parentData.labelDisabled !== null ? this.parentData.labelDisabled :
					false;
			},
			// 组件尺寸，对应size的值，默认值为21px
			elSize() {
				return this.size ? this.size : (this.parentData.size ? this.parentData.size : 21);
			},
			// 组件的勾选图标的尺寸，默认12px
			elIconSize() {
				return this.iconSize ? this.iconSize : (this.parentData.iconSize ? this.parentData.iconSize : 12);
			},
			// 组件选中激活时的颜色
			elActiveColor() {
				return this.activeColor ? this.activeColor : (this.parentData.activeColor ? this.parentData.activeColor : '#2979ff');
			},
			// 组件选未中激活时的颜色
			elInactiveColor() {
				return this.inactiveColor ? this.inactiveColor : (this.parentData.inactiveColor ? this.parentData.inactiveColor :
					'#c8c9cc');
			},
			// label的颜色
			elLabelColor() {
				return this.labelColor ? this.labelColor : (this.parentData.labelColor ? this.parentData.labelColor : '#606266')
			},
			// 组件的形状
			elShape() {
				return this.shape ? this.shape : (this.parentData.shape ? this.parentData.shape : 'circle');
			},
			// label大小
			elLabelSize() {
				return this.$uv.addUnit(this.labelSize ? this.labelSize : (this.parentData.labelSize ? this.parentData.labelSize :
					'15'))
			},
			elIconColor() {
				const iconColor = this.iconColor ? this.iconColor : (this.parentData.iconColor ? this.parentData.iconColor :
					'#ffffff');
				// 图标的颜色
				if (this.elDisabled) {
					// disabled状态下，已勾选的checkbox图标改为elInactiveColor
					return this.isChecked ? this.elInactiveColor : 'transparent'
				} else {
					return this.isChecked ? iconColor : 'transparent'
				}
			},
			iconClasses() {
				let classes = []
				// 组件的形状
				classes.push('uv-checkbox__icon-wrap--' + this.elShape)
				if (this.elDisabled) {
					classes.push('uv-checkbox__icon-wrap--disabled')
				}
				if (this.isChecked && this.elDisabled) {
					classes.push('uv-checkbox__icon-wrap--disabled--checked')
				}
				// 支付宝，头条小程序无法动态绑定一个数组类名，否则解析出来的结果会带有","，而导致失效



				return classes
			},
			iconWrapStyle() {
				// checkbox的整体样式
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.vue", 162, 11),}
				style.backgroundColor = this.isChecked && !this.elDisabled ? this.elActiveColor : '#ffffff'
				style.borderColor = this.isChecked && !this.elDisabled ? this.elActiveColor : this.elInactiveColor
				style.width = this.$uv.addUnit(this.elSize)
				style.height = this.$uv.addUnit(this.elSize)
				// 如果是图标在右边的话，移除它的右边距
				if (this.parentData.iconPlacement === 'right') {
					style.marginRight = 0
				}
				return style
			},
			checkboxStyle() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.vue", 174, 11),}
				if (this.parentData.borderBottom && this.parentData.placement === 'row') {
					this.$uv.error('检测到您将borderBottom设置为true，需要同时将uv-checkbox-group的placement设置为column才有效')
				}
				// 当父组件设置了显示下边框并且排列形式为纵向时，给内容和边框之间加上一定间隔
				if (this.parentData.borderBottom && this.parentData.placement === 'column') {
					style.paddingBottom = '8px'
				}
				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle))
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				// 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环引用
				this.updateParentData()
				if (!this.parent) {
					this.$uv.error('uv-checkbox必须搭配uv-checkbox-group组件使用')
				}
				this.$nextTick(()=>{
					let parentValue = [];
					if(this.parentData.value.length) {
						parentValue = this.parentData.value;
					} else if (this.parentData.modelValue.length){
						parentValue = this.parentData.modelValue;
					}
					// 设置初始化时，是否默认选中的状态，父组件uv-checkbox-group的value可能是array，所以额外判断
					if (this.checked) {
						this.isChecked = true
					} else if (this.$uv.test.array(parentValue)) {
						// 查找数组是是否存在this.name元素值
						this.isChecked = parentValue.some(item => {
							return item === this.name
						})
					}
				})
			},
			updateParentData() {
				this.getParentData('uv-checkbox-group')
			},
			// 横向两端排列时，点击组件即可触发选中事件
			wrapperClickHandler(e) {
				this.parentData.iconPlacement === 'right' && this.iconClickHandler(e)
			},
			// 点击图标
			iconClickHandler(e) {
				this.preventEvent(e)
				// 如果整体被禁用，不允许被点击
				if (!this.elDisabled) {
					this.setRadioCheckedStatus()
				}
			},
			// 点击label
			labelClickHandler(e) {
				this.preventEvent(e)
				// 如果按钮整体被禁用或者label被禁用，则不允许点击文字修改状态
				if (!this.elLabelDisabled && !this.elDisabled) {
					this.setRadioCheckedStatus()
				}
			},
			emitEvent() {
				this.$emit('change', this.isChecked)
				// 尝试调用uv-form的验证方法，进行一定延迟，否则微信小程序更新可能会不及时
				this.$nextTick(() => {
					this.$uv.formValidate(this, 'change')
				})
			},
			// 改变组件选中状态
			// 这里的改变的依据是，更改本组件的checked值为true，同时通过父组件遍历所有uv-checkbox实例
			// 将本组件外的其他uv-checkbox的checked都设置为false(都被取消选中状态)，因而只剩下一个为选中状态
			setRadioCheckedStatus() {
				// 将本组件标记为与原来相反的状态
				this.isChecked = !this.isChecked
				this.emitEvent()
				typeof this.parent.unCheckedOther === 'function' && this.parent.unCheckedOther(this)
			}
		},
		watch:{
			checked(){
				this.isChecked = this.checked
			}
		}
	})

export default __sfc__
function GenUniModulesUvCheckboxComponentsUvCheckboxUvCheckboxRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return _cE("view", _uM({
    class: _nC(["uv-checkbox", [`uv-checkbox-label--${_ctx.parentData.iconPlacement}`, _ctx.parentData.borderBottom && _ctx.parentData.placement === 'column' && 'uv-border-bottom']]),
    style: _nS([_ctx.checkboxStyle]),
    onClick: withModifiers(_ctx.wrapperClickHandler, ["stop"])
  }), [
    _cE("view", _uM({
      class: _nC(["uv-checkbox__icon-wrap", _ctx.iconClasses]),
      onClick: withModifiers(_ctx.iconClickHandler, ["stop"]),
      style: _nS([_ctx.iconWrapStyle])
    }), [
      renderSlot(_ctx.$slots, "icon", {}, (): any[] => [
        _cV(_component_uv_icon, _uM({
          class: "uv-checkbox__icon-wrap__icon",
          name: "checkbox-mark",
          size: _ctx.elIconSize,
          color: _ctx.elIconColor
        }), null, 8 /* PROPS */, ["size", "color"])
      ])
    ], 14 /* CLASS, STYLE, PROPS */, ["onClick"]),
    _cE("view", _uM({
      class: "uv-checkbox__label-wrap",
      onClick: withModifiers(_ctx.labelClickHandler, ["stop"])
    }), [
      renderSlot(_ctx.$slots, "default", {}, (): any[] => [
        _cE("text", _uM({
          style: _nS(_uM({
						color: _ctx.elDisabled ? _ctx.elInactiveColor : _ctx.elLabelColor,
						fontSize: _ctx.elLabelSize,
						lineHeight: _ctx.elLabelSize
					}))
        }), _tD(_ctx.label), 5 /* TEXT, STYLE */)
      ])
    ], 8 /* PROPS */, ["onClick"])
  ], 14 /* CLASS, STYLE, PROPS */, ["onClick"])
}
export type UvCheckboxComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvCheckboxComponentsUvCheckboxUvCheckboxStyles = [_uM([["uv-border-bottom", _pS(_uM([["!borderBottomWidth", 0.5], ["!borderTopColor", "#dadbde"], ["!borderRightColor", "#dadbde"], ["!borderBottomColor", "#dadbde"], ["!borderLeftColor", "#dadbde"], ["borderBottomStyle", "solid"]]))], ["uv-checkbox", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["overflow", "hidden"], ["alignItems", "center"]]))], ["uv-checkbox-label--left", _pS(_uM([["flexDirection", "row"]]))], ["uv-checkbox-label--right", _pS(_uM([["flexDirection", "row-reverse"], ["justifyContent", "space-between"]]))], ["uv-checkbox__icon-wrap", _pS(_uM([["boxSizing", "border-box"], ["transitionProperty", "borderColor,backgroundColor,color"], ["transitionDuration", "0.2s"], ["color", "rgba(0,0,0,0)"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["textAlign", "center"], ["fontSize", 6], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#c8c9cc"], ["borderRightColor", "#c8c9cc"], ["borderBottomColor", "#c8c9cc"], ["borderLeftColor", "#c8c9cc"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-checkbox__icon-wrap--circle", _pS(_uM([["borderTopLeftRadius", "100%"], ["borderTopRightRadius", "100%"], ["borderBottomRightRadius", "100%"], ["borderBottomLeftRadius", "100%"]]))], ["uv-checkbox__icon-wrap--square", _pS(_uM([["borderTopLeftRadius", 3], ["borderTopRightRadius", 3], ["borderBottomRightRadius", 3], ["borderBottomLeftRadius", 3]]))], ["uv-checkbox__icon-wrap--checked", _pS(_uM([["color", "#ffffff"], ["backgroundColor", "#FF0000"], ["borderTopColor", "#2979ff"], ["borderRightColor", "#2979ff"], ["borderBottomColor", "#2979ff"], ["borderLeftColor", "#2979ff"]]))], ["uv-checkbox__icon-wrap--disabled", _pS(_uM([["!backgroundColor", "#ebedf0"]]))], ["uv-checkbox__icon-wrap--disabled--checked", _pS(_uM([["!color", "#c8c9cc"]]))], ["uv-checkbox__label", _pS(_uM([["wordWrap", "break-word"], ["marginLeft", 5], ["marginRight", 12], ["color", "#606266"], ["fontSize", 15]]))], ["uv-checkbox__label--disabled", _pS(_uM([["color", "#c8c9cc"]]))], ["uv-checkbox__label-wrap", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["paddingLeft", 6]]))], ["@TRANSITION", _uM([["uv-checkbox__icon-wrap", _uM([["property", "borderColor,backgroundColor,color"], ["duration", "0.2s"]])]])]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
