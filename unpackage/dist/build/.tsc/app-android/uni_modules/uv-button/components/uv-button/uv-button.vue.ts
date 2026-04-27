
import throttle from '@/uni_modules/uv-ui-tools/libs/function/throttle.js';
import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
import button from '@/uni_modules/uv-ui-tools/libs/mixin/button.js'
import openType from '@/uni_modules/uv-ui-tools/libs/mixin/openType.js'
import props from "./props.js";
/**
 * button 按钮
 * @description Button 按钮
 * @tutorial https://www.uvui.cn/components/button.html
 * @property {Boolean}			hairline				是否显示按钮的细边框 (默认 true )
 * @property {String}			type					按钮的预置样式，info，primary，error，warning，success (默认 'info' )
 * @property {String}			size					按钮尺寸，large，normal，mini （默认 normal）
 * @property {String}			shape					按钮形状，circle（两边为半圆），square（带圆角） （默认 'square' ）
 * @property {Boolean}			plain					按钮是否镂空，背景色透明 （默认 false）
 * @property {Boolean}			disabled				是否禁用 （默认 false）
 * @property {Boolean}			loading					按钮名称前是否带 loading 图标(App-nvue 平台，在 ios 上为雪花，Android上为圆圈) （默认 false）
 * @property {String | Number}	loadingText				加载中提示文字
 * @property {String}			loadingMode				加载状态图标类型 （默认 'spinner' ）
 * @property {String | Number}	loadingSize				加载图标大小 （默认 15 ）
 * @property {String}			openType				开放能力，具体请看uniapp稳定关于button组件部分说明
 * @property {String}			formType				用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
 * @property {String}			appParameter			打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效 （注：只微信小程序、QQ小程序有效）
 * @property {Boolean}			hoverStopPropagation	指定是否阻止本节点的祖先节点出现点击态，微信小程序有效（默认 true ）
 * @property {String}			lang					指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文（默认 en ）
 * @property {String}			sessionFrom				会话来源，openType="contact"时有效
 * @property {String}			sendMessageTitle		会话内消息卡片标题，openType="contact"时有效
 * @property {String}			sendMessagePath			会话内消息卡片点击跳转小程序路径，openType="contact"时有效
 * @property {String}			sendMessageImg			会话内消息卡片图片，openType="contact"时有效
 * @property {Boolean}			showMessageCard			是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，openType="contact"时有效（默认false）
 * @property {String}			dataName				额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
 * @property {String | Number}	throttleTime			节流，一定时间内只能触发一次 （默认 0 )
 * @property {String | Number}	hoverStartTime			按住后多久出现点击态，单位毫秒 （默认 0 )
 * @property {String | Number}	hoverStayTime			手指松开后点击态保留时间，单位毫秒 （默认 200 )
 * @property {String | Number}	text					按钮文字，之所以通过props传入，是因为slot传入的话（注：nvue中无法控制文字的样式）
 * @property {String}			icon					按钮图标
 * @property {String}			iconColor				按钮图标颜色
 * @property {String}			color					按钮颜色，支持传入linear-gradient渐变色
 * @property {Object}			customStyle				定义需要用到的外部样式
 * @event {Function}	click			非禁止并且非加载中，才能点击
 * @event {Function}	getphonenumber	open-type="getPhoneNumber"时有效
 * @event {Function}	getuserinfo		用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo
 * @event {Function}	error			当使用开放能力时，发生错误的回调
 * @event {Function}	opensetting		在打开授权设置页并关闭后回调
 * @event {Function}	launchapp		打开 APP 成功的回调
 * @example <uv-button>月落</uv-button>
 */
const __sfc__ = defineComponent({
		name: "uv-button",




		mixins: [mpMixin, mixin, props],

		emits: ['click'],
		data() {
			return {};
		},
		computed: {
			// 生成bem风格的类名
			bemClass() {
				// this.bem为一个computed变量，在mixin中
				if (!this.color) {
					return this.bem("button",
						["type", "shape", "size"],
						["disabled", "plain", "hairline"]);
				} else {
					// 由于nvue的原因，在有color参数时，不需要传入type，否则会生成type相关的类型，影响最终的样式
					return this.bem("button",
						["shape", "size"],
						["disabled", "plain", "hairline"]);
				}
			},
			loadingColor() {
				if (this.plain) {
					// 如果有设置color值，则用color值，否则使用type主题颜色
					return this.color ? this.color : '#3c9cff';
				}
				if (this.type === "info") {
					return "#c9c9c9";
				}
				return "rgb(200, 200, 200)";
			},
			iconColorCom() {
				// 如果是镂空状态，设置了color就用color值，否则使用主题颜色，
				// uv-icon的color能接受一个主题颜色的值
				if (this.iconColor) return this.iconColor;
				if (this.plain) {
					return this.color ? this.color : this.type;
				} else {
					return this.type === "info" ? "#000000" : "#ffffff";
				}
			},
			baseColor() {
				let style = {};
				if (this.color) {
					// 针对自定义了color颜色的情况，镂空状态下，就是用自定义的颜色
					style.color = this.plain ? this.color : "white";
					if (!this.plain) {
						// 非镂空，背景色使用自定义的颜色
						style["background-color"] = this.color;
					}
					if (this.color.indexOf("gradient") !== -1) {
						// 如果自定义的颜色为渐变色，不显示边框，以及通过backgroundImage设置渐变色
						// weex文档说明可以写borderWidth的形式，为什么这里需要分开写？
						// 因为weex是阿里巴巴为了部门业绩考核而做的你懂的东西，所以需要这么写才有效
						style.borderTopWidth = 0;
						style.borderRightWidth = 0;
						style.borderBottomWidth = 0;
						style.borderLeftWidth = 0;
						if (!this.plain) {
							style.backgroundImage = this.color;
						}
					} else {
						// 非渐变色，则设置边框相关的属性
						style.borderColor = this.color;
						style.borderWidth = "1px";
						style.borderStyle = "solid";
					}
				}
				return style;
			},
			// nvue版本按钮的字体不会继承父组件的颜色，需要对每一个text组件进行单独的设置
			nvueTextStyle() {
				let style = {};
				// 针对自定义了color颜色的情况，镂空状态下，就是用自定义的颜色
				if (this.type === "info") {
					style.color = "#323233";
				}
				if (this.color) {
					style.color = this.plain ? this.color : "white";
				}
				style.fontSize = this.textSize + "px";
				return style;
			},
			// 字体大小
			textSize() {
				let fontSize = 14,
					{ size } = this;
				if (size === "large") fontSize = 16;
				if (size === "normal") fontSize = 14;
				if (size === "small") fontSize = 12;
				if (size === "mini") fontSize = 10;
				return fontSize;
			},
			// 设置图标大小
			getIconSize() {
				const size = this.iconSize ? this.iconSize : this.textSize * 1.35;
				return this.$uv.addUnit(size);
			},
			// 设置外层盒子的宽度，其他样式不需要
			btnWrapperStyle() {
				const style = {};
				const customStyle = this.$uv.addStyle(this.customStyle);
				if(customStyle.width) style.width = customStyle.width;
				return style;
			}
		},
		methods: {
			clickHandler() {
				// 非禁止并且非加载中，才能点击
				if (!this.disabled && !this.loading) {
					// 进行节流控制，每this.throttle毫秒内，只在开始处执行
					throttle(() => {
						this.$emit("click");
					}, this.throttleTime);
				}
			}
		}
	})

export default __sfc__
function GenUniModulesUvButtonComponentsUvButtonUvButtonRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_loading_icon = resolveEasyComponent("uv-loading-icon",_easycom_uv_loading_icon)
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return _cE("view", _uM({
    class: "uv-button-wrapper",
    style: _nS([_ctx.btnWrapperStyle])
  }), [
    _cE("button", _uM({
      "hover-start-time": Number(_ctx.hoverStartTime),
      "hover-stay-time": Number(_ctx.hoverStayTime),
      "form-type": _ctx.formType,
      "open-type": _ctx.openType,
      "app-parameter": _ctx.appParameter,
      "hover-stop-propagation": _ctx.hoverStopPropagation,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      lang: _ctx.lang,
      "data-name": _ctx.dataName,
      "session-from": _ctx.sessionFrom,
      "send-message-img": _ctx.sendMessageImg,
      "show-message-card": _ctx.showMessageCard,
      "hover-class": !_ctx.disabled && !_ctx.loading ? 'uv-button--active' : '',
      class: _nC(["uv-button uv-reset-button", _ctx.bemClass]),
      style: _nS([_ctx.baseColor, _ctx.$uv.addStyle(_ctx.customStyle)]),
      onClick: _ctx.clickHandler
    }), [
      isTrue(_ctx.loading)
        ? _cE(Fragment, _uM({ key: 0 }), [
            _cV(_component_uv_loading_icon, _uM({
              mode: _ctx.loadingMode,
              size: _ctx.loadingSize * 1.15,
              color: _ctx.loadingColor
            }), null, 8 /* PROPS */, ["mode", "size", "color"]),
            _cE("text", _uM({
              class: "uv-button__loading-text",
              style: _nS([
							_uM({ fontSize: _ctx.textSize + 'px' }),
							_ctx.$uv.addStyle(_ctx.customTextStyle)
						])
            }), _tD(_ctx.loadingText || _ctx.text), 5 /* TEXT, STYLE */)
          ], 64 /* STABLE_FRAGMENT */)
        : _cE(Fragment, _uM({ key: 1 }), [
            isTrue(_ctx.icon)
              ? _cV(_component_uv_icon, _uM({
                  key: 0,
                  name: _ctx.icon,
                  color: _ctx.iconColorCom,
                  size: _ctx.getIconSize,
                  customStyle: { marginRight: '2px' }
                }), null, 8 /* PROPS */, ["name", "color", "size"])
              : _cC("v-if", true),
            renderSlot(_ctx.$slots, "default", {}, (): any[] => [
              _cE("text", _uM({
                class: "uv-button__text",
                style: _nS([
							_uM({ fontSize: _ctx.textSize + 'px' }),
							_ctx.$uv.addStyle(_ctx.customTextStyle)
						])
              }), _tD(_ctx.text), 5 /* TEXT, STYLE */)
            ]),
            renderSlot(_ctx.$slots, "suffix")
          ], 64 /* STABLE_FRAGMENT */)
    ], 14 /* CLASS, STYLE, PROPS */, ["hover-start-time", "hover-stay-time", "form-type", "open-type", "app-parameter", "hover-stop-propagation", "send-message-title", "send-message-path", "lang", "data-name", "session-from", "send-message-img", "show-message-card", "hover-class", "onClick"])
  ], 4 /* STYLE */)
}
export type UvButtonComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvButtonComponentsUvButtonUvButtonStyles = [_uM([["uv-reset-button", _pS(_uM([["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["backgroundColor", "rgba(0,0,0,0)"], ["borderTopWidth::after", "medium"], ["borderRightWidth::after", "medium"], ["borderBottomWidth::after", "medium"], ["borderLeftWidth::after", "medium"], ["borderTopStyle::after", "none"], ["borderRightStyle::after", "none"], ["borderBottomStyle::after", "none"], ["borderLeftStyle::after", "none"], ["borderTopColor::after", "#000000"], ["borderRightColor::after", "#000000"], ["borderBottomColor::after", "#000000"], ["borderLeftColor::after", "#000000"]]))], ["uv-button-wrapper", _pS(_uM([["position", "relative"]]))], ["uv-button-wrapper--dis", _pS(_uM([["position", "absolute"], ["left", 0], ["top", 0], ["right", 0], ["bottom", 0], ["zIndex", 9]]))], ["uv-button", _pS(_uM([["width", "100%"], ["position:before", "absolute"], ["top:before", "50%"], ["left:before", "50%"], ["width:before", "100%"], ["height:before", "100%"], ["borderTopWidth:before", "medium"], ["borderRightWidth:before", "medium"], ["borderBottomWidth:before", "medium"], ["borderLeftWidth:before", "medium"], ["borderTopStyle:before", "none"], ["borderRightStyle:before", "none"], ["borderBottomStyle:before", "none"], ["borderLeftStyle:before", "none"], ["transform:before", "translate(-50%, -50%)"], ["opacity:before", 0], ["content:before", "\" \""], ["backgroundColor:before", "#000000"], ["borderTopColor:before", "#000000"], ["borderRightColor:before", "#000000"], ["borderBottomColor:before", "#000000"], ["borderLeftColor:before", "#000000"], ["height", 40], ["position", "relative"], ["alignItems", "center"], ["justifyContent", "center"], ["display", "flex"], ["flexDirection", "row"], ["boxSizing", "border-box"]]))], ["uv-button__text", _pS(_uM([["whiteSpace", "nowrap"], ["lineHeight", 1], ["fontSize", 15]]))], ["uv-button--active", _pS(_uM([["opacity:before", 0.15]]))], ["uv-button__loading-text", _pS(_uM([["marginLeft", 4], ["fontSize", 15]]))], ["uv-button--plain", _uM([[".uv-button--primary", _uM([["color", "#3c9cff"]])], [".uv-button--info", _uM([["color", "#909399"]])], [".uv-button--success", _uM([["color", "#5ac725"]])], [".uv-button--error", _uM([["color", "#f56c6c"]])], [".uv-button--warning", _uM([["color", "#f9ae3d"]])], ["", _uM([["backgroundColor", "#ffffff"]])]])], ["uv-button--large", _pS(_uM([["width", "100%"], ["height", 50], ["paddingTop", 0], ["paddingRight", 15], ["paddingBottom", 0], ["paddingLeft", 15]]))], ["uv-button--normal", _pS(_uM([["paddingTop", 0], ["paddingRight", 12], ["paddingBottom", 0], ["paddingLeft", 12], ["fontSize", 14]]))], ["uv-button--small", _pS(_uM([["minWidth", 60], ["height", 30], ["paddingTop", 0], ["paddingRight", 8], ["paddingBottom", 0], ["paddingLeft", 8], ["fontSize", 12]]))], ["uv-button--mini", _pS(_uM([["height", 22], ["fontSize", 10], ["minWidth", 50], ["paddingTop", 0], ["paddingRight", 8], ["paddingBottom", 0], ["paddingLeft", 8]]))], ["uv-button--disabled", _pS(_uM([["opacity", 0.5]]))], ["uv-button--info", _pS(_uM([["color", "#323233"], ["backgroundColor", "#ffffff"], ["borderTopColor", "#ebedf0"], ["borderRightColor", "#ebedf0"], ["borderBottomColor", "#ebedf0"], ["borderLeftColor", "#ebedf0"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-button--success", _pS(_uM([["color", "#ffffff"], ["backgroundColor", "#5ac725"], ["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-button--primary", _pS(_uM([["color", "#ffffff"], ["backgroundColor", "#3c9cff"], ["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-button--error", _pS(_uM([["color", "#ffffff"], ["backgroundColor", "#f56c6c"], ["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-button--warning", _pS(_uM([["color", "#ffffff"], ["backgroundColor", "#f9ae3d"], ["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-button--block", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["width", "100%"]]))], ["uv-button--circle", _pS(_uM([["borderTopRightRadius", 100], ["borderTopLeftRadius", 100], ["borderBottomLeftRadius", 100], ["borderBottomRightRadius", 100]]))], ["uv-button--square", _pS(_uM([["borderBottomLeftRadius", 3], ["borderBottomRightRadius", 3], ["borderTopLeftRadius", 3], ["borderTopRightRadius", 3]]))], ["uv-button__icon", _pS(_uM([["verticalAlign", "top"]]))], ["uv-button--hairline", _pS(_uM([["!borderTopWidth", 0.5], ["!borderRightWidth", 0.5], ["!borderBottomWidth", 0.5], ["!borderLeftWidth", 0.5]]))]])]

import _easycom_uv_loading_icon from '@/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.vue'
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
