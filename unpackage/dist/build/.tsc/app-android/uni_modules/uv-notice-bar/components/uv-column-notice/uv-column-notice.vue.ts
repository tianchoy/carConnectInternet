
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * ColumnNotice 滚动通知中的垂直滚动 内部组件
	 * @description 该组件用于滚动通告场景，是其中的垂直滚动方式
	 * @tutorial https://www.uvui.cn/components/noticeBar.html
	 * @property {Array}			text 			显示的内容，字符串
	 * @property {String}			icon 			是否显示左侧的音量图标 （ 默认 'volume' ）
	 * @property {String}			mode 			通告模式，link-显示右箭头，closable-显示右侧关闭图标
	 * @property {String}			color 			文字颜色，各图标也会使用文字颜色 （ 默认 '#f9ae3d' ）
	 * @property {String}			bgColor 		背景颜色 （ 默认 '#fdf6ec' ）
	 * @property {String | Number}	fontSize		字体大小，单位px  （ 默认 14 ）
	 * @property {String | Number}	speed			水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度 （ 默认 80 ）
	 * @property {Boolean}			step			direction = row时，是否使用步进形式滚动 （ 默认 false ）
	 * @property {String | Number}	duration		滚动一个周期的时间长，单位ms （ 默认 1500 ）
	 * @property {Boolean}			disableTouch	是否禁止用手滑动切换   目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序 （ 默认 true ）
	 * @example 
	 */
	const __sfc__ = defineComponent({
		emits: ['click','close','change'],
		mixins: [mpMixin, mixin, props],
		watch: {
			text: {
				immediate: true,
				handler(newValue, oldValue) {
					if(!this.$uv.test.array(newValue)) {
						this.$uv.error('noticebar组件direction为column时，要求text参数为数组形式')
					}
				}
			}
		},
		computed: {
			// 文字内容的样式
			textStyle() {
				let style = {}
				style.color = this.color
				style.fontSize = this.$uv.addUnit(this.fontSize)
				return style
			},
			// 垂直或者水平滚动
			vertical() {
				if (this.mode == 'horizontal') return false
				else return true
			},
			// NVUE中的swiper在css中样式不生效
			swiperStyle(){
				const style = {};




				return style;
			}
		},
		data() {
			return {
				index:0
			}
		},
		methods: {
			noticeChange(e){
				this.index = e.detail.current
				this.$emit('change', this.index);
			},
			// 点击通告栏
			clickHandler() {
				this.$emit('click', this.index)
			},
			// 点击关闭按钮
			close() {
				this.$emit('close')
			}
		}
	});

export default __sfc__
function GenUniModulesUvNoticeBarComponentsUvColumnNoticeUvColumnNoticeRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return _cE("view", _uM({
    class: "uv-notice",
    onClick: _ctx.clickHandler
  }), [
    renderSlot(_ctx.$slots, "icon", {}, (): any[] => [
      isTrue(_ctx.icon)
        ? _cE("view", _uM({
            key: 0,
            class: "uv-notice__left-icon"
          }), [
            _cV(_component_uv_icon, _uM({
              name: _ctx.icon,
              color: _ctx.color,
              size: "19"
            }), null, 8 /* PROPS */, ["name", "color"])
          ])
        : _cC("v-if", true)
    ]),
    _cE("swiper", _uM({
      "disable-touch": _ctx.disableTouch,
      vertical: _ctx.step ? false : true,
      circular: "",
      interval: _ctx.duration,
      autoplay: !_ctx.disableScroll,
      class: "uv-notice__swiper",
      style: _nS([_ctx.swiperStyle]),
      onChange: _ctx.noticeChange
    }), [
      _cE(Fragment, null, RenderHelpers.renderList(_ctx.text, (item, index, __index, _cached): any => {
        return _cE("swiper-item", _uM({
          key: index,
          class: "uv-notice__swiper__item"
        }), [
          _cE("text", _uM({
            class: "uv-notice__swiper__item__text uv-line-1",
            style: _nS([_ctx.textStyle])
          }), _tD(item), 5 /* TEXT, STYLE */)
        ])
      }), 128 /* KEYED_FRAGMENT */)
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, ["disable-touch", "vertical", "interval", "autoplay", "onChange"]),
    isTrue(['link', 'closable'].includes(_ctx.mode))
      ? _cE("view", _uM({
          key: 0,
          class: "uv-notice__right-icon"
        }), [
          _ctx.mode === 'link'
            ? _cV(_component_uv_icon, _uM({
                key: 0,
                name: "arrow-right",
                size: 17,
                color: _ctx.color
              }), null, 8 /* PROPS */, ["color"])
            : _cC("v-if", true),
          _ctx.mode === 'closable'
            ? _cV(_component_uv_icon, _uM({
                key: 1,
                name: "close",
                size: 16,
                color: _ctx.color,
                onClick: _ctx.close
              }), null, 8 /* PROPS */, ["color", "onClick"])
            : _cC("v-if", true)
        ])
      : _cC("v-if", true)
  ], 8 /* PROPS */, ["onClick"])
}
export type UvColumnNoticeComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvNoticeBarComponentsUvColumnNoticeUvColumnNoticeStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-notice", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]]))], ["uv-notice__left-icon", _pS(_uM([["alignItems", "center"], ["marginRight", 5]]))], ["uv-notice__right-icon", _pS(_uM([["marginLeft", 5], ["alignItems", "center"]]))], ["uv-notice__swiper", _pS(_uM([["height", 16], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-notice__swiper__item", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["overflow", "hidden"]]))], ["uv-notice__swiper__item__text", _pS(_uM([["fontSize", 14], ["color", "#f9ae3d"]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
