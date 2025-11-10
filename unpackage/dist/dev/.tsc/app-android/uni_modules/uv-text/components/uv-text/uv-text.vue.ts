
	import value from './value.js'
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import button from '@/uni_modules/uv-ui-tools/libs/mixin/button.js'
	import openType from '@/uni_modules/uv-ui-tools/libs/mixin/openType.js'
	import props from './props.js'
	/**
	 * Text 文本
	 * @description 此组件集成了文本类在项目中的常用功能，包括状态，拨打电话，格式化日期，*替换，超链接...等功能。 您大可不必在使用特殊文本时自己定义，text组件几乎涵盖您能使用的大部分场景。
	 * @tutorial https://www.uvui.cn/components/loading.html
	 * @property {String} 					type		主题颜色
	 * @property {Boolean} 					show		是否显示（默认 true ）
	 * @property {String | Number}			text		显示的值
	 * @property {String}					prefixIcon	前置图标
	 * @property {String} 					suffixIcon	后置图标
	 * @property {String} 					mode		文本处理的匹配模式 text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
	 * @property {String} 					href		mode=link下，配置的链接
	 * @property {String | Function} 		format		格式化规则
	 * @property {Boolean} 					call		mode=phone时，点击文本是否拨打电话（默认 false ）
	 * @property {String} 					openType	小程序的打开方式
	 * @property {Boolean} 					bold		是否粗体，默认normal（默认 false ）
	 * @property {Boolean} 					block		是否块状（默认 false ）
	 * @property {String | Number} 			lines		文本显示的行数，如果设置，超出此行数，将会显示省略号
	 * @property {String} 					color		文本颜色（默认 '#303133' ）
	 * @property {String | Number} 			size		字体大小（默认 15 ）
	 * @property {Object | String} 			iconStyle	图标的样式 （默认 {fontSize: '15px'} ）
	 * @property {String} 					decoration	文字装饰，下划线，中划线等，可选值 none|underline|line-through（默认 'none' ）
	 * @property {Object | String | Number}	margin		外边距，对象、字符串，数值形式均可（默认 0 ）
	 * @property {String | Number} 			lineHeight	文本行高
	 * @property {String} 					align		文本对齐方式，可选值left|center|right（默认 'left' ）
	 * @property {String} 					wordWrap	文字换行，可选值break-word|normal|anywhere（默认 'normal' ）
	 * @event {Function} click  点击触发事件
	 * @example <uv-text text="我用十年青春,赴你最后之约"></uv-text>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-text',
		emits: ['click'],




		mixins: [mpMixin, mixin, value, props],

		computed: {
			valueStyle() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-text/components/uv-text/uv-text.vue", 116, 11),
					textDecoration: this.decoration,
					fontWeight: this.bold ? 'bold' : 'normal',
					wordWrap: this.wordWrap,
					fontSize: this.$uv.addUnit(this.size)
				};
				!this.type && (style.color = this.color);
				this.isNvue && this.lines && (style.lines = this.lines);
				if(this.isNvue && this.mode != 'price' && !this.prefixIcon && !this.suffixIcon) {
					 style.flex = 1;
					 style.textAlign = this.align === 'left' ? 'flex-start' : this.align === 'center' ? 'center' : 'right';
				}
				this.lineHeight && (style.lineHeight = this.$uv.addUnit(this.lineHeight));
				!this.isNvue && this.block && (style.display = 'block');
				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
			},
			isNvue() {
				let nvue = false



				return nvue
			},
			isMp() {
				let mp = false



				return mp
			}
		},
		data() {
			return {}
		},
		methods: {
			clickHandler() {
				// 如果为手机号模式，拨打电话
				if (this.call && this.mode === 'phone') {
					uni.makePhoneCall({
						phoneNumber: this.text
					})
				}
				this.$emit('click')
			}
		}
	})

export default __sfc__
function GenUniModulesUvTextComponentsUvTextUvTextRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_link = resolveEasyComponent("uv-link",_easycom_uv_link)

  return isTrue(_ctx.show)
    ? _cE("view", _uM({
        key: 0,
        class: _nC(["uv-text", []]),
        style: _nS(_uM({
        margin: _ctx.margin,
				justifyContent: _ctx.align === 'left' ? 'flex-start' : _ctx.align === 'center' ? 'center' : 'flex-end'
      })),
        onClick: _ctx.clickHandler
      }), [
        _ctx.mode === 'price'
          ? _cE("text", _uM({
              key: 0,
              class: _nC(['uv-text__price', _ctx.type && `uv-text__value--${_ctx.type}`]),
              style: _nS([_ctx.valueStyle])
            }), "￥", 6 /* CLASS, STYLE */)
          : _cC("v-if", true),
        isTrue(_ctx.prefixIcon)
          ? _cE("view", _uM({
              key: 1,
              class: "uv-text__prefix-icon"
            }), [
              _cV(_component_uv_icon, _uM({
                name: _ctx.prefixIcon,
                customStyle: _ctx.$uv.addStyle(_ctx.iconStyle)
              }), null, 8 /* PROPS */, ["name", "customStyle"])
            ])
          : _cC("v-if", true),
        _ctx.mode === 'link'
          ? _cV(_component_uv_link, _uM({
              key: 2,
              text: _ctx.value,
              href: _ctx.href,
              underLine: ""
            }), null, 8 /* PROPS */, ["text", "href"])
          : isTrue(_ctx.openType && _ctx.isMp)
            ? _cE("button", _uM({
                key: 3,
                class: "uv-reset-button uv-text__value",
                style: _nS([_ctx.valueStyle]),
                openType: _ctx.openType,
                onGetuserinfo: _ctx.onGetUserInfo,
                onContact: _ctx.onContact,
                onGetphonenumber: _ctx.onGetPhoneNumber,
                onError: _ctx.onError,
                onLaunchapp: _ctx.onLaunchApp,
                onOpensetting: _ctx.onOpenSetting,
                lang: _ctx.lang,
                "session-from": _ctx.sessionFrom,
                "send-message-title": _ctx.sendMessageTitle,
                "send-message-path": _ctx.sendMessagePath,
                "send-message-img": _ctx.sendMessageImg,
                "show-message-card": _ctx.showMessageCard,
                "app-parameter": _ctx.appParameter
              }), _tD(_ctx.value), 45 /* TEXT, STYLE, PROPS, NEED_HYDRATION */, ["openType", "onGetuserinfo", "onContact", "onGetphonenumber", "onError", "onLaunchapp", "onOpensetting", "lang", "session-from", "send-message-title", "send-message-path", "send-message-img", "show-message-card", "app-parameter"])
            : _cE("text", _uM({
                key: 4,
                class: _nC(["uv-text__value", [
          _ctx.type && `uv-text__value--${_ctx.type}`,
          _ctx.lines && `uv-line-${_ctx.lines}`
        ]]),
                style: _nS([_ctx.valueStyle])
              }), _tD(_ctx.value), 7 /* TEXT, CLASS, STYLE */),
        isTrue(_ctx.suffixIcon)
          ? _cE("view", _uM({
              key: 5,
              class: "uv-text__suffix-icon"
            }), [
              _cV(_component_uv_icon, _uM({
                name: _ctx.suffixIcon,
                customStyle: _ctx.$uv.addStyle(_ctx.iconStyle)
              }), null, 8 /* PROPS */, ["name", "customStyle"])
            ])
          : _cC("v-if", true)
      ], 12 /* STYLE, PROPS */, ["onClick"])
    : _cC("v-if", true)
}
export type UvTextComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvTextComponentsUvTextUvTextStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-reset-button", _pS(_uM([["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["backgroundColor", "rgba(0,0,0,0)"], ["borderTopWidth::after", "medium"], ["borderRightWidth::after", "medium"], ["borderBottomWidth::after", "medium"], ["borderLeftWidth::after", "medium"], ["borderTopStyle::after", "none"], ["borderRightStyle::after", "none"], ["borderBottomStyle::after", "none"], ["borderLeftStyle::after", "none"], ["borderTopColor::after", "#000000"], ["borderRightColor::after", "#000000"], ["borderBottomColor::after", "#000000"], ["borderLeftColor::after", "#000000"]]))], ["uv-text", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["flexWrap", "nowrap"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"]]))], ["uv-text__price", _pS(_uM([["fontSize", 14], ["color", "#606266"]]))], ["uv-text__value", _pS(_uM([["fontSize", 14], ["display", "flex"], ["flexDirection", "row"], ["color", "#606266"], ["flexWrap", "wrap"], ["textOverflow", "ellipsis"], ["alignItems", "center"]]))], ["uv-text__value--primary", _pS(_uM([["color", "#3c9cff"]]))], ["uv-text__value--warning", _pS(_uM([["color", "#f9ae3d"]]))], ["uv-text__value--success", _pS(_uM([["color", "#5ac725"]]))], ["uv-text__value--info", _pS(_uM([["color", "#909399"]]))], ["uv-text__value--error", _pS(_uM([["color", "#f56c6c"]]))], ["uv-text__value--main", _pS(_uM([["color", "#303133"]]))], ["uv-text__value--content", _pS(_uM([["color", "#606266"]]))], ["uv-text__value--tips", _pS(_uM([["color", "#909193"]]))], ["uv-text__value--light", _pS(_uM([["color", "#c0c4cc"]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_link from '@/uni_modules/uv-link/components/uv-link/uv-link.vue'
