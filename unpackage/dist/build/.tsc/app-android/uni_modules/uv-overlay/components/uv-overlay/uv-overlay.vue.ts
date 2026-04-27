
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';

	/**
	 * overlay 遮罩
	 * @description 创建一个遮罩层，用于强调特定的页面元素，并阻止用户对遮罩下层的内容进行操作，一般用于弹窗场景
	 * @tutorial https://www.uvui.cn/components/overlay.html
	 * @property {Boolean}			show		是否显示遮罩（默认 false ）
	 * @property {String | Number}	zIndex		zIndex 层级（默认 10070 ）
	 * @property {String | Number}	duration	动画时长，单位毫秒（默认 300 ）
	 * @property {String | Number}	opacity		不透明度值，当做rgba的第四个参数 （默认 0.5 ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * @event {Function} click 点击遮罩发送事件
	 * @example <uv-overlay :show="show" @click="show = false"></uv-overlay>
	 */
	const __sfc__ = defineComponent({
		name: "uv-overlay",
		emits: ['click'],
		mixins: [mpMixin, mixin, props],
		watch: {
			show(newVal){







			}
		},
		computed: {
			overlayStyle() {
				const style = {
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: this.zIndex,
					bottom: 0,
					'background-color': `rgba(0, 0, 0, ${this.opacity})`
				}
				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle))
			}
		},
		methods: {
			clickHandler() {
				this.$emit('click')
			},
			clear() {}
		}
	})

export default __sfc__
function GenUniModulesUvOverlayComponentsUvOverlayUvOverlayRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_transition = resolveEasyComponent("uv-transition",_easycom_uv_transition)

  return _cV(_component_uv_transition, _uM({
    show: _ctx.show,
    mode: "fade",
    "custom-class": "uv-overlay",
    duration: _ctx.duration,
    "custom-style": _ctx.overlayStyle,
    onClick: _ctx.clickHandler,
    onTouchmove: withModifiers(_ctx.clear, ["stop","prevent"])
  }), _uM({
    default: withSlotCtx((): any[] => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }), 8 /* PROPS */, ["show", "duration", "custom-style", "onClick", "onTouchmove"])
}
export type UvOverlayComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvOverlayComponentsUvOverlayUvOverlayStyles = [_uM([["uv-overlay", _pS(_uM([["position", "fixed"], ["top", 0], ["left", 0], ["width", "100%"], ["height", "100%"], ["backgroundColor", "rgba(0,0,0,0.7)"]]))]])]

import _easycom_uv_transition from '@/uni_modules/uv-transition/components/uv-transition/uv-transition.vue'
