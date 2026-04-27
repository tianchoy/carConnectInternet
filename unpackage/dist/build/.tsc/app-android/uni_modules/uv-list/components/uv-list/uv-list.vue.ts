
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	/**
	 * List 列表
	 * @description 列表组件
	 * @tutorial https://www.uvui.cn/components/list.html
	 * @property {Boolean} border = [true|false] 是否显示边框
	 * @property {String} borderColor 边框颜色
	 * @property {String} direction 排版方向，默认row，列表里面使用其他组件  最好设置成column
	 */
	const __sfc__ = defineComponent({
		name: 'uv-list',
		mixins: [mpMixin, mixin],
		'mp-weixin': {
			options: {
				multipleSlots: false
			}
		},
		props: {
			border: {
				type: Boolean,
				default: false
			},
			borderColor: {
				type: String,
				default: '#dadbde'
			},
			// 排版方向，默认row，列表里面使用其他组件  最好设置成column
			direction: {
				type: String,
				default: 'row'
			},
			// 内边距
			padding: {
				type: [String,Number],
				default: '20rpx 30rpx'
			}
		},
		created() {
			this.firstChildAppend = false;
		},
		computed: {
			parentData() {
				return [this.direction,this.padding];
			}
		},
		methods: {
			loadMore(e) {
				this.$emit('scrolltolower');
			},
			scroll(e) {
				this.$emit('scroll', e);
			}
		}
	});

export default __sfc__
function GenUniModulesUvListComponentsUvListUvListRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({
    class: "uv-list",
    style: _nS([_ctx.$uv.addStyle(_ctx.customStyle)])
  }), [
    isTrue(_ctx.border)
      ? _cE("view", _uM({
          key: 0,
          class: "uv-list--border-top",
          style: _nS([_uM({ 'background-color': _ctx.borderColor })])
        }), null, 4 /* STYLE */)
      : _cC("v-if", true),
    renderSlot(_ctx.$slots, "default"),
    isTrue(_ctx.border)
      ? _cE("view", _uM({
          key: 1,
          class: "uv-list--border-bottom",
          style: _nS([_uM({ 'background-color': _ctx.borderColor })])
        }), null, 4 /* STYLE */)
      : _cC("v-if", true)
  ], 4 /* STYLE */)
}
export type UvListComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvListComponentsUvListUvListStyles = [_uM([["uv-list", _pS(_uM([["position", "relative"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#ffffff"]]))], ["uv-list--border", _pS(_uM([["position", "relative"], ["zIndex", -1]]))], ["uv-list--border-top", _pS(_uM([["position", "absolute"], ["top", 0], ["right", 0], ["left", 0], ["height", 1], ["WebkitTransform", "scaleY(0.5)"], ["transform", "scaleY(0.5)"], ["backgroundColor", "#dadbde"], ["zIndex", 1]]))], ["uv-list--border-bottom", _pS(_uM([["position", "absolute"], ["bottom", 0], ["right", 0], ["left", 0], ["height", 1], ["WebkitTransform", "scaleY(0.5)"], ["transform", "scaleY(0.5)"], ["backgroundColor", "#dadbde"]]))]])]
