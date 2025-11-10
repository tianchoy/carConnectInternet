
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	/**
	 * SafeBottom 底部安全区
	 * @description 这个适配，主要是针对IPhone X等一些底部带指示条的机型，指示条的操作区域与页面底部存在重合，容易导致用户误操作，因此我们需要针对这些机型进行底部安全区适配。
	 * @tutorial https://www.uvui.cn/components/safeAreaInset.html
	 * @property {type}		prop_name
	 * @property {Object}	customStyle	定义需要用到的外部样式
	 *
	 * @event {Function()}
	 * @example <uv-status-bar></uv-status-bar>
	 */
	const __sfc__ = defineComponent({
		name: "uv-safe-bottom",
		mixins: [mpMixin, mixin],
		data() {
			return {
				safeAreaBottomHeight: 0,
				isNvue: false,
			};
		},
		computed: {
			style() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-safe-bottom/components/uv-safe-bottom/uv-safe-bottom.vue", 34, 11),};




				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
			},
		},
		mounted() {




		},
	});

export default __sfc__
function GenUniModulesUvSafeBottomComponentsUvSafeBottomUvSafeBottomRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({
    class: _nC(["uv-safe-bottom", [!_ctx.isNvue && 'uv-safe-area-inset-bottom']]),
    style: _nS([_ctx.style])
  }), null, 6 /* CLASS, STYLE */)
}
export type UvSafeBottomComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvSafeBottomComponentsUvSafeBottomUvSafeBottomStyles = [_uM([["uv-safe-bottom", _pS(_uM([["width", "100%"]]))], ["uv-safe-area-inset-top", _pS(_uM([["paddingTop", "env(safe-area-inset-top)"]]))], ["uv-safe-area-inset-right", _pS(_uM([["paddingRight", "env(safe-area-inset-right)"]]))], ["uv-safe-area-inset-bottom", _pS(_uM([["paddingBottom", "env(safe-area-inset-bottom)"]]))], ["uv-safe-area-inset-left", _pS(_uM([["paddingLeft", "env(safe-area-inset-left)"]]))]])]
