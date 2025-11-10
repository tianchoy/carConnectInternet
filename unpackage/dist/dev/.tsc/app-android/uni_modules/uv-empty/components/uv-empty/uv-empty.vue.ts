
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';
	/**
	 * empty 内容为空
	 * @description 该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个"没有内容"的场景， 我们精心挑选了十几个场景的图标，方便您使用。
	 * @tutorial https://www.uvui.cn/components/empty.html
	 * @property {String}			icon		内置图标名称，或图片路径，建议绝对路径
	 * @property {String}			text		提示文字
	 * @property {String}			textColor	文字颜色 (默认 '#c0c4cc' )
	 * @property {String | Number}	textSize	文字大小 （默认 14 ）
	 * @property {String}			iconColor	图标的颜色 （默认 '#c0c4cc' ）
	 * @property {String | Number}	iconSize	图标的大小 （默认 90 ）
	 * @property {String}			mode		选择预置的图标类型 （默认 'data' ）
	 * @property {String | Number}	width		图标宽度，单位px （默认 160 ）
	 * @property {String | Number}	height		图标高度，单位px （默认 160 ）
	 * @property {Boolean}			show		是否显示组件 （默认 true ）
	 * @property {String | Number}	marginTop	组件距离上一个元素之间的距离，默认px单位 （默认 0 ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * 
	 * @event {Function} click 点击组件时触发
	 * @event {Function} close 点击关闭按钮时触发
	 * @example <uv-empty text="所谓伊人，在水一方" mode="list"></uv-empty>
	 */
	const __sfc__ = defineComponent({
		name: "uv-empty",
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				icons: {
					car: '购物车为空',
					page: '页面不存在',
					search: '没有搜索结果',
					address: '没有收货地址',
					'wifi-off': '没有WiFi',
					order: '订单为空',
					coupon: '没有优惠券',
					favor: '暂无收藏',
					permission: '无权限',
					history: '无历史记录',
					news: '无新闻列表',
					message: '消息列表为空',
					list: '列表为空',
					data: '数据为空',
					comment: '暂无评论',
				}
			}
		},
		computed: {
			// 组件样式
			emptyStyle() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-empty/components/uv-empty/uv-empty.vue", 84, 11),}
				style.marginTop = this.$uv.addUnit(this.marginTop)
				// 合并customStyle样式，此参数通过mixin中的props传递
				return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle))
			},
			// 文本样式
			textStyle() {
				const style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-empty/components/uv-empty/uv-empty.vue", 91, 11),}
				style.color = this.textColor
				style.fontSize = this.$uv.addUnit(this.textSize)
				return style
			},
			// 判断icon是否图片路径
			isImg() {
				const isBase64 = this.icon.indexOf('data:') > -1 && this.icon.indexOf('base64') > -1;
				return this.icon.indexOf('/') !== -1 || isBase64;
			}
		}
	})

export default __sfc__
function GenUniModulesUvEmptyComponentsUvEmptyUvEmptyRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return isTrue(_ctx.show)
    ? _cE("view", _uM({
        key: 0,
        class: "uv-empty",
        style: _nS([_ctx.emptyStyle])
      }), [
        isTrue(!_ctx.isImg)
          ? _cV(_component_uv_icon, _uM({
              key: 0,
              name: _ctx.mode === 'message' ? 'chat' : `empty-${_ctx.mode}`,
              size: _ctx.iconSize,
              color: _ctx.iconColor,
              "margin-top": "14"
            }), null, 8 /* PROPS */, ["name", "size", "color"])
          : _cE("image", _uM({
              key: 1,
              style: _nS(_uM({
				width: _ctx.$uv.addUnit(_ctx.width),
				height: _ctx.$uv.addUnit(_ctx.height)
			})),
              src: _ctx.icon,
              mode: "widthFix"
            }), null, 12 /* STYLE, PROPS */, ["src"]),
        _cE("text", _uM({
          class: "uv-empty__text",
          style: _nS([_ctx.textStyle])
        }), _tD(_ctx.text ? _ctx.text : _ctx.icons[_ctx.mode]), 5 /* TEXT, STYLE */),
        _cE("view", _uM({ class: "uv-empty__wrap" }), [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 4 /* STYLE */)
    : _cC("v-if", true)
}
export type UvEmptyComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvEmptyComponentsUvEmptyUvEmptyStyles = [_uM([["uv-empty", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"]]))], ["uv-empty__text", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["marginTop", "20rpx"]]))], ["uv-slot-wrap", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["marginTop", "20rpx"]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
