
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';



	/**
	 * lineProgress 线型进度条
	 * @description 展示操作或任务的当前进度，比如上传文件，是一个线形的进度条。
	 * @tutorial https://www.uvui.cn/components/lineProgress.html
	 * @property {String}			activeColor		激活部分的颜色 ( 默认 '#19be6b' )
	 * @property {String}			inactiveColor	背景色 ( 默认 '#ececec' )
	 * @property {String | Number}	percentage		进度百分比，数值 ( 默认 0 )
	 * @property {Boolean}			showText		是否在进度条内部显示百分比的值 ( 默认 true )
	 * @property {String | Number}	height			进度条的高度，单位px ( 默认 12 )
	 * 
	 * @example <uv-line-progress :percent="70" :show-percent="true"></uv-line-progress>
	 */
	const __sfc__ = defineComponent({
		name: "uv-line-progress",
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				lineWidth: 0,
			}
		},
		watch: {
			percentage(n) {
				this.resizeProgressWidth()
			}
		},
		computed: {
			progressStyle() { 
				let style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-line-progress/components/uv-line-progress/uv-line-progress.vue", 60, 9),}
				style.width = this.lineWidth
				style.backgroundColor = this.activeColor
				style.height = this.$uv.addUnit(this.$uv.getPx(this.height))
				return style
			},
			innserPercentage() {
				// 控制范围在0-100之间
				return this.$uv.range(0, 100, this.percentage)
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.$uv.sleep(20).then(() => {
					this.resizeProgressWidth()
				})
			},
			getProgressWidth() {

				return this.$uvGetRect('.uv-line-progress__background')










			},
			resizeProgressWidth() {
				this.getProgressWidth().then(size => {
					const {
						width
					} = size
					// 通过设置的percentage值，计算其所占总长度的百分比
					this.lineWidth = width * this.innserPercentage / 100 + 'px'
				})
			}
		}
	})

export default __sfc__
function GenUniModulesUvLineProgressComponentsUvLineProgressUvLineProgressRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({
    class: "uv-line-progress",
    style: _nS([_ctx.$uv.addStyle(_ctx.customStyle)])
  }), [
    _cE("view", _uM({
      class: "uv-line-progress__background",
      ref: "uv-line-progress__background",
      style: _nS([_uM({
				backgroundColor: _ctx.inactiveColor,
				height: _ctx.$uv.addUnit(_ctx.$uv.getPx(_ctx.height))
			})])
    }), null, 4 /* STYLE */),
    _cE("view", _uM({
      class: "uv-line-progress__line",
      style: _nS([_ctx.progressStyle])
    }), [
      renderSlot(_ctx.$slots, "default", {}, (): any[] => [
        isTrue(_ctx.showText && _ctx.percentage >= 10)
          ? _cE("text", _uM({
              key: 0,
              class: "uv-line-progress__text"
            }), _tD(_ctx.innserPercentage + '%'), 1 /* TEXT */)
          : _cC("v-if", true)
      ])
    ], 4 /* STYLE */)
  ], 4 /* STYLE */)
}
export type UvLineProgressComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvLineProgressComponentsUvLineProgressUvLineProgressStyles = [_uM([["uv-line-progress", _pS(_uM([["alignItems", "stretch"], ["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["overflow", "hidden"], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100]]))], ["uv-line-progress__background", _pS(_uM([["backgroundColor", "#ececec"], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-line-progress__line", _pS(_uM([["position", "absolute"], ["top", 0], ["left", 0], ["bottom", 0], ["alignItems", "center"], ["display", "flex"], ["flexDirection", "row"], ["color", "#ffffff"], ["borderTopLeftRadius", 100], ["borderTopRightRadius", 100], ["borderBottomRightRadius", 100], ["borderBottomLeftRadius", 100], ["transitionProperty", "width"], ["transitionDuration", "0.5s"], ["transitionTimingFunction", "ease"], ["justifyContent", "flex-end"]]))], ["uv-line-progress__text", _pS(_uM([["fontSize", 10], ["alignItems", "center"], ["textAlign", "right"], ["color", "#FFFFFF"], ["marginRight", 5], ["transform", "scale(0.9)"]]))], ["@TRANSITION", _uM([["uv-line-progress__line", _uM([["property", "width"], ["duration", "0.5s"], ["timingFunction", "ease"]])]])]])]
