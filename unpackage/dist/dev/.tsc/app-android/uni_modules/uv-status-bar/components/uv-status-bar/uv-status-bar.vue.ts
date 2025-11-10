
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * StatbusBar 状态栏占位
	 * @description 本组件主要用于状态填充，比如在自定导航栏的时候，它会自动适配一个恰当的状态栏高度。
	 * @tutorial https://www.uvui.cn/components/statusBar.html
	 * @property {String}			bgColor			背景色 (默认 'transparent' )
	 * @property {String | Object}	customStyle		自定义样式 
	 * @example <uv-status-bar></uv-status-bar>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-status-bar',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
			}
		},
		computed: {
			style() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-status-bar/components/uv-status-bar/uv-status-bar.vue", 31, 11),}
				// 状态栏高度，由于某些安卓和微信开发工具无法识别css的顶部状态栏变量，所以使用js获取的方式
				style.height = this.$uv.addUnit(this.$uv.sys().statusBarHeight, 'px')
				if(this.bgColor){
					if (this.bgColor.indexOf("gradient") > -1) {// 渐变色
						style.backgroundImage = this.bgColor;
					}else{
						style.background = this.bgColor;
					}
				}
				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle))
			}
		},
	})

export default __sfc__
function GenUniModulesUvStatusBarComponentsUvStatusBarUvStatusBarRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({
    style: _nS([_ctx.style]),
    class: "uv-status-bar"
  }), [
    renderSlot(_ctx.$slots, "default")
  ], 4 /* STYLE */)
}
export type UvStatusBarComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvStatusBarComponentsUvStatusBarUvStatusBarStyles = [_uM([["uv-status-bar", _pS(_uM([["width", "100%"]]))]])]
