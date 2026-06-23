
	import { colorGradient } from '@/uni_modules/uv-ui-tools/libs/function/colorGradient.js'
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';



	/**
	 * loading 加载动画
	 * @description 警此组件为一个小动画，目前用在uvui的loadmore加载更多和switch开关等组件的正在加载状态场景。
	 * @tutorial https://www.uvui.cn/components/loading.html
	 * @property {Boolean}			show			是否显示组件  (默认 true)
	 * @property {String}			color			动画活动区域的颜色，只对 mode = flower 模式有效（默认#909193）
	 * @property {String}			textColor		提示文本的颜色（默认#909193）
	 * @property {Boolean}			vertical		文字和图标是否垂直排列 (默认 false )
	 * @property {String}			mode			模式选择，见官网说明（默认 'circle' ）
	 * @property {String | Number}	size			加载图标的大小，单位px （默认 24 ）
	 * @property {String | Number}	textSize		文字大小（默认 15 ）
	 * @property {String | Number}	text			文字内容 
	 * @property {Object}	textStyle 文字样式
	 * @property {String}			timingFunction	动画模式 （默认 'ease-in-out' ）
	 * @property {String | Number}	duration		动画执行周期时间（默认 1200）
	 * @property {String}			inactiveColor	mode=circle时的暗边颜色 
	 * @property {Object}			customStyle		定义需要用到的外部样式
	 * @example <uv-loading mode="circle"></uv-loading>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-loading-icon',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				// Array.form可以通过一个伪数组对象创建指定长度的数组
				// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
				array12: Array.from({
					length: 12
				}),
				// 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
				// 在iOS nvue上，则会一开始默认执行两个周期的动画
				aniAngel: 360, // 动画旋转角度
				webviewHide: false, // 监听webview的状态，如果隐藏了页面，则停止动画，以免性能消耗
				loading: false, // 是否运行中，针对nvue使用
			}
		},
		computed: {
			// 当为circle类型时，给其另外三边设置一个更轻一些的颜色
			// 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
			// 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
			otherBorderColor() {
				const lightColor = colorGradient(this.color, '#ffffff', 100)[80]
				if (this.mode === 'circle') {
					return this.inactiveColor ? this.inactiveColor : lightColor
				} else {
					return 'transparent'
				}
			}
		},
		watch: {
			show(n) {
				// nvue中，show为true，且为非loading状态，就重新执行动画模块







			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				setTimeout(() => {






				}, 20)
			},
			// 监听webview的显示与隐藏
			addEventListenerToWebview() {
				// webview的堆栈
				const pages = getCurrentPages()
				// 当前页面
				const page = pages[pages.length - 1]
				// 当前页面的webview实例
				const currentWebview = page.$getAppWebview()
				// 监听webview的显示与隐藏，从而停止或者开始动画(为了性能)
				currentWebview.addEventListener('hide', () => {
					this.webviewHide = true
				})
				currentWebview.addEventListener('show', () => {
					this.webviewHide = false
				})
			},





























		}
	})

export default __sfc__
function GenUniModulesUvLoadingIconComponentsUvLoadingIconUvLoadingIconRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_block = resolveComponent("block")

  return isTrue(_ctx.show)
    ? _cE("view", _uM({
        key: 0,
        class: _nC(["uv-loading-icon", [_ctx.vertical && 'uv-loading-icon--vertical']]),
        style: _nS([_ctx.$uv.addStyle(_ctx.customStyle)])
      }), [
        isTrue(!_ctx.webviewHide)
          ? _cE("view", _uM({
              key: 0,
              class: _nC(["uv-loading-icon__spinner", [`uv-loading-icon__spinner--${_ctx.mode}`]]),
              ref: "ani",
              style: _nS(_uM({
				color: _ctx.color,
				width: _ctx.$uv.addUnit(_ctx.size),
				height: _ctx.$uv.addUnit(_ctx.size),
				borderTopColor: _ctx.color,
				borderBottomColor: _ctx.otherBorderColor,
				borderLeftColor: _ctx.otherBorderColor,
				borderRightColor: _ctx.otherBorderColor,
				'animation-duration': `${_ctx.duration}ms`,
				'animation-timing-function': _ctx.mode === 'semicircle' || _ctx.mode === 'circle' ? _ctx.timingFunction : ''
			}))
            }), [
              _ctx.mode === 'spinner'
                ? _cV(_component_block, _uM({ key: 0 }), _uM({
                    default: withSlotCtx((): any[] => [
                      _cE(Fragment, null, RenderHelpers.renderList(_ctx.array12, (item, index, __index, _cached): any => {
                        return _cE("view", _uM({
                          key: index,
                          class: "uv-loading-icon__dot"
                        }))
                      }), 128 /* KEYED_FRAGMENT */)
                    ]),
                    _: 1 /* STABLE */
                  }))
                : _cC("v-if", true)
            ], 6 /* CLASS, STYLE */)
          : _cC("v-if", true),
        isTrue(_ctx.text)
          ? _cE("text", _uM({
              key: 1,
              class: "uv-loading-icon__text",
              style: _nS([_uM({
				fontSize: _ctx.$uv.addUnit(_ctx.textSize),
				color: _ctx.textColor,
			}),_ctx.$uv.addStyle(_ctx.textStyle)])
            }), _tD(_ctx.text), 5 /* TEXT, STYLE */)
          : _cC("v-if", true)
      ], 6 /* CLASS, STYLE */)
    : _cC("v-if", true)
}
export type UvLoadingIconComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvLoadingIconComponentsUvLoadingIconUvLoadingIconStyles = [_uM([["uv-loading-icon", _pS(_uM([["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["color", "#c8c9cc"]]))], ["uv-loading-icon__text", _uM([["", _uM([["marginLeft", 4], ["color", "#606266"], ["fontSize", 14], ["lineHeight", "20px"], ["display:empty", "none"]])], [".uv-loading-icon--vertical ", _uM([["marginTop", 6], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["color", "#606266"]])]])], ["uv-loading-icon__spinner", _pS(_uM([["width", 30], ["height", 30], ["position", "relative"], ["boxSizing", "border-box"], ["animation", "uv-rotate 1s linear infinite"]]))], ["uv-loading-icon__spinner--semicircle", _pS(_uM([["borderTopWidth", 2], ["borderRightWidth", 2], ["borderBottomWidth", 2], ["borderLeftWidth", 2], ["borderTopColor", "rgba(0,0,0,0)"], ["borderRightColor", "rgba(0,0,0,0)"], ["borderBottomColor", "rgba(0,0,0,0)"], ["borderLeftColor", "rgba(0,0,0,0)"], ["borderTopRightRadius", 100], ["borderTopLeftRadius", 100], ["borderBottomLeftRadius", 100], ["borderBottomRightRadius", 100], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-loading-icon__spinner--circle", _pS(_uM([["borderTopRightRadius", 100], ["borderTopLeftRadius", 100], ["borderBottomLeftRadius", 100], ["borderBottomRightRadius", 100], ["borderTopWidth", 2], ["borderRightWidth", 2], ["borderBottomWidth", 2], ["borderLeftWidth", 2], ["borderTopColor", "#e5e5e5"], ["borderRightColor", "#e5e5e5"], ["borderBottomColor", "#e5e5e5"], ["borderLeftColor", "#e5e5e5"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"]]))], ["uv-loading-icon--vertical", _pS(_uM([["flexDirection", "column"]]))], ["uv-loading-icon__spinner--spinner", _pS(_uM([["animationTimingFunction", "steps(12)"]]))], ["uv-loading-icon__dot", _pS(_uM([["position", "absolute"], ["top", 0], ["left", 0], ["width", "100%"], ["height", "100%"], ["width:before", 2], ["height:before", "25%"], ["marginTop:before", 0], ["marginRight:before", "auto"], ["marginBottom:before", 0], ["marginLeft:before", "auto"], ["borderTopLeftRadius:before", "40%"], ["borderTopRightRadius:before", "40%"], ["borderBottomRightRadius:before", "40%"], ["borderBottomLeftRadius:before", "40%"], ["content:before", "\" \""]]))]])]
