
	import { image } from '@/uni_modules/uv-ui-tools/libs/function/test.js'
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * Tag 标签
	 * @description tag组件一般用于标记和选择，我们提供了更加丰富的表现形式，能够较全面的涵盖您的使用场景
	 * @tutorial https://www.uvui.cn/components/tag.html
	 * @property {String}			type		标签类型info、primary、success、warning、error （默认 'primary' ）
	 * @property {Boolean | String}	disabled	不可用（默认 false ）
	 * @property {String}			size		标签的大小，large，medium，mini （默认 'medium' ）
	 * @property {String}			shape		tag的形状，circle（两边半圆形）, square（方形，带圆角）（默认 'square' ）
	 * @property {String | Number}	text		标签的文字内容 
	 * @property {String}			bgColor		背景颜色，默认为空字符串，即不处理
	 * @property {String}			color		标签字体颜色，默认为空字符串，即不处理
	 * @property {String}			borderColor	镂空形式标签的边框颜色
	 * @property {String}			closeColor	关闭按钮图标的颜色（默认 #C6C7CB）
	 * @property {String | Number}	name		点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
	 * @property {Boolean}			plainFill	镂空时是否填充背景色（默认 false ）
	 * @property {Boolean}			plain		是否镂空（默认 false ）
	 * @property {Boolean}			closable	是否可关闭，设置为true，文字右边会出现一个关闭图标（默认 false ）
	 * @property {Boolean}			show		标签显示与否（默认 true ）
	 * @property {String}			icon		内置图标，或绝对路径的图片
	 * @event {Function(index)} click 点击标签时触发 index: 传递的index参数值
	 * @event {Function(index)} close closable为true时，点击标签关闭按钮触发 index: 传递的index参数值	
	 * @example <uv-tags text="标签" type="error" plain plainFill></uv-tags>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-tags',
		emits: ['click','close'],
		mixins: [mpMixin, mixin, props],
		computed: {
			style() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-tags/components/uv-tags/uv-tags.vue", 105, 11),}
				if (this.bgColor) {
					style.backgroundColor = this.bgColor
				}
				if (this.color) {
					style.color = this.color
				}
				if(this.borderColor) {
					style.borderColor = this.borderColor
				}
				return style
			},
			// nvue下，文本颜色无法继承父元素
			textColor() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-tags/components/uv-tags/uv-tags.vue", 119, 11),}
				if (this.color) {
					style.color = this.color
				}
				return style
			},
			imgStyle() {
				const width = this.size === 'large' ? '17px' : this.size === 'medium' ? '15px' : '13px'
				return {
					width,
					height: width
				}
			},
			// 文本的样式
			closeSize() {
				const size = this.size === 'large' ? 15 : this.size === 'medium' ? 13 : 12
				return size
			},
			// 图标大小
			iconSize() {
				const size = this.size === 'large' ? 21 : this.size === 'medium' ? 19 : 16
				return size
			},
			// 图标颜色
			elIconColor() {
				return this.iconColor ? this.iconColor : this.plain ? this.type : '#ffffff'
			}
		},
		methods: {
			// 点击关闭按钮
			closeHandler() {
				this.$emit('close', this.name)
			},
			// 点击标签
			clickHandler() {
				this.$emit('click', this.name)
			}
		}
	})

export default __sfc__
function GenUniModulesUvTagsComponentsUvTagsUvTagsRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_transition = resolveEasyComponent("uv-transition",_easycom_uv_transition)

  return _cV(_component_uv_transition, _uM({
    mode: "fade",
    show: _ctx.show,
    "cell-child": _ctx.cellChild
  }), _uM({
    default: withSlotCtx((): any[] => [
      _cE("view", _uM({ class: "uv-tags-wrapper" }), [
        _cE("view", _uM({
          class: _nC(["uv-tags", [`uv-tags--${_ctx.shape}`, !_ctx.plain && `uv-tags--${_ctx.type}`, _ctx.plain && `uv-tags--${_ctx.type}--plain`, `uv-tags--${_ctx.size}`,`uv-tags--${_ctx.size}--${_ctx.closePlace}`, _ctx.plain && _ctx.plainFill && `uv-tags--${_ctx.type}--plain--fill`]]),
          onClick: withModifiers(_ctx.clickHandler, ["stop"]),
          style: _nS([_uM({
					marginRight: _ctx.closable&& _ctx.closePlace=='right-top' ? '10px' : 0,
					marginTop: _ctx.closable && _ctx.closePlace=='right-top' ? '10px' : 0,
				}), _ctx.style, _ctx.$uv.addStyle(_ctx.customStyle)])
        }), [
          renderSlot(_ctx.$slots, "icon", {}, (): any[] => [
            isTrue(_ctx.icon)
              ? _cE("view", _uM({
                  key: 0,
                  class: "uv-tags__icon"
                }), [
                  isTrue(_ctx.$uv.test.image(_ctx.icon))
                    ? _cE("image", _uM({
                        key: 0,
                        src: _ctx.icon,
                        style: _nS([_ctx.imgStyle])
                      }), null, 12 /* STYLE, PROPS */, ["src"])
                    : _cV(_component_uv_icon, _uM({
                        key: 1,
                        color: _ctx.elIconColor,
                        name: _ctx.icon,
                        size: _ctx.iconSize
                      }), null, 8 /* PROPS */, ["color", "name", "size"])
                ])
              : _cC("v-if", true)
          ]),
          _cE("text", _uM({
            class: _nC(["uv-tags__text", [`uv-tags__text--${_ctx.type}`, _ctx.plain && `uv-tags__text--${_ctx.type}--plain`, `uv-tags__text--${_ctx.size}`]]),
            style: _nS([_ctx.textColor])
          }), _tD(_ctx.text), 7 /* TEXT, CLASS, STYLE */),
          isTrue(_ctx.closable && _ctx.closePlace=='right')
            ? _cE("view", _uM({
                key: 0,
                class: _nC(["uv-tags__close", [`uv-tags__close--${_ctx.size}`,`uv-tags__close--${_ctx.closePlace}`]]),
                onClick: withModifiers(_ctx.closeHandler, ["stop"]),
                style: _nS(_uM({backgroundColor: _ctx.closeColor}))
              }), [
                _cV(_component_uv_icon, _uM({
                  name: "close",
                  size: _ctx.closeSize,
                  color: "#ffffff"
                }), null, 8 /* PROPS */, ["size"])
              ], 14 /* CLASS, STYLE, PROPS */, ["onClick"])
            : _cC("v-if", true)
        ], 14 /* CLASS, STYLE, PROPS */, ["onClick"]),
        isTrue(_ctx.closable && _ctx.closePlace=='right-top')
          ? _cE("view", _uM({
              key: 0,
              class: _nC(["uv-tags__close", [`uv-tags__close--${_ctx.size}`,`uv-tags__close--${_ctx.closePlace}`]]),
              onClick: withModifiers(_ctx.closeHandler, ["stop"]),
              style: _nS(_uM({backgroundColor: _ctx.closeColor}))
            }), [
              _cV(_component_uv_icon, _uM({
                name: "close",
                size: _ctx.closeSize,
                color: "#ffffff"
              }), null, 8 /* PROPS */, ["size"])
            ], 14 /* CLASS, STYLE, PROPS */, ["onClick"])
          : _cC("v-if", true)
      ])
    ]),
    _: 3 /* FORWARDED */
  }), 8 /* PROPS */, ["show", "cell-child"])
}
export type UvTagsComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvTagsComponentsUvTagsUvTagsStyles = [_uM([["uv-tags-wrapper", _pS(_uM([["position", "relative"]]))], ["uv-tags", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-tags--circle", _pS(_uM([["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100]]))], ["uv-tags--square", _pS(_uM([["borderTopLeftRadius", 3], ["borderTopRightRadius", 3], ["borderBottomRightRadius", 3], ["borderBottomLeftRadius", 3]]))], ["uv-tags__icon", _pS(_uM([["marginRight", 4]]))], ["uv-tags__text--mini", _pS(_uM([["fontSize", 12], ["lineHeight", "12px"]]))], ["uv-tags__text--medium", _pS(_uM([["fontSize", 13], ["lineHeight", "13px"]]))], ["uv-tags__text--large", _pS(_uM([["fontSize", 15], ["lineHeight", "15px"]]))], ["uv-tags--mini", _pS(_uM([["height", 22], ["lineHeight", "22px"], ["paddingTop", 0], ["paddingRight", 5], ["paddingBottom", 0], ["paddingLeft", 5]]))], ["uv-tags--mini--right", _pS(_uM([["paddingRight", 2]]))], ["uv-tags--medium", _pS(_uM([["height", 26], ["lineHeight", "22px"], ["paddingTop", 0], ["paddingRight", 10], ["paddingBottom", 0], ["paddingLeft", 10]]))], ["uv-tags--medium--right", _pS(_uM([["paddingTop", 0], ["paddingRight", 4], ["paddingBottom", 0], ["paddingLeft", 8]]))], ["uv-tags--large", _pS(_uM([["height", 32], ["lineHeight", "32px"], ["paddingTop", 0], ["paddingRight", 15], ["paddingBottom", 0], ["paddingLeft", 15]]))], ["uv-tags--large--right", _pS(_uM([["paddingTop", 0], ["paddingRight", 4], ["paddingBottom", 0], ["paddingLeft", 8]]))], ["uv-tags--primary", _pS(_uM([["backgroundColor", "#3c9cff"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["uv-tags--primary--plain", _pS(_uM([["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["uv-tags--primary--plain--fill", _pS(_uM([["backgroundColor", "#ecf5ff"]]))], ["uv-tags__text--primary", _pS(_uM([["color", "#FFFFFF"]]))], ["uv-tags__text--primary--plain", _pS(_uM([["color", "#3c9cff"]]))], ["uv-tags--error", _pS(_uM([["backgroundColor", "#f56c6c"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"]]))], ["uv-tags--error--plain", _pS(_uM([["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"]]))], ["uv-tags--error--plain--fill", _pS(_uM([["backgroundColor", "#fef0f0"]]))], ["uv-tags__text--error", _pS(_uM([["color", "#FFFFFF"]]))], ["uv-tags__text--error--plain", _pS(_uM([["color", "#f56c6c"]]))], ["uv-tags--warning", _pS(_uM([["backgroundColor", "#f9ae3d"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"]]))], ["uv-tags--warning--plain", _pS(_uM([["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"]]))], ["uv-tags--warning--plain--fill", _pS(_uM([["backgroundColor", "#fdf6ec"]]))], ["uv-tags__text--warning", _pS(_uM([["color", "#FFFFFF"]]))], ["uv-tags__text--warning--plain", _pS(_uM([["color", "#f9ae3d"]]))], ["uv-tags--success", _pS(_uM([["backgroundColor", "#5ac725"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"]]))], ["uv-tags--success--plain", _pS(_uM([["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"]]))], ["uv-tags--success--plain--fill", _pS(_uM([["backgroundColor", "#f5fff0"]]))], ["uv-tags__text--success", _pS(_uM([["color", "#FFFFFF"]]))], ["uv-tags__text--success--plain", _pS(_uM([["color", "#5ac725"]]))], ["uv-tags--info", _pS(_uM([["backgroundColor", "#909399"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#909399"], ["borderRightColor", "#909399"], ["borderBottomColor", "#909399"], ["borderLeftColor", "#909399"]]))], ["uv-tags--info--plain", _pS(_uM([["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopColor", "#909399"], ["borderRightColor", "#909399"], ["borderBottomColor", "#909399"], ["borderLeftColor", "#909399"]]))], ["uv-tags--info--plain--fill", _pS(_uM([["backgroundColor", "#f4f4f5"]]))], ["uv-tags__text--info", _pS(_uM([["color", "#FFFFFF"]]))], ["uv-tags__text--info--plain", _pS(_uM([["color", "#909399"]]))], ["uv-tags__close", _pS(_uM([["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["backgroundColor", "#C6C7CB"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["transform", "scale(0.6)"]]))], ["uv-tags__close--right-top", _pS(_uM([["position", "absolute"], ["zIndex", 999], ["top", 10], ["right", 10], ["transform", "scale(0.6) translate(80%, -80%)"]]))], ["uv-tags__close--mini", _pS(_uM([["width", 18], ["height", 18]]))], ["uv-tags__close--medium", _pS(_uM([["width", 22], ["height", 22]]))], ["uv-tags__close--large", _pS(_uM([["width", 25], ["height", 25]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_transition from '@/uni_modules/uv-transition/components/uv-transition/uv-transition.vue'
