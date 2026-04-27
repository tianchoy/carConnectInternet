
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	import props from './props.js';




	/**
	 * RowNotice 滚动通知中的水平滚动模式
	 * @description 水平滚动
	 * @tutorial https://www.uvui.cn/components/noticeBar.html
	 * @property {String | Number}	text			显示的内容，字符串
	 * @property {String}			icon			是否显示左侧的音量图标 (默认 'volume' )
	 * @property {String}			mode			通告模式，link-显示右箭头，closable-显示右侧关闭图标
	 * @property {String}			color			文字颜色，各图标也会使用文字颜色 (默认 '#f9ae3d' )
	 * @property {String}			bgColor			背景颜色 (默认 ''#fdf6ec' )
	 * @property {String | Number}	fontSize		字体大小，单位px (默认 14 )
	 * @property {String | Number}	speed			水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度  (默认 80 )
	 * 
	 * @event {Function} click 点击通告文字触发
	 * @event {Function} close 点击右侧关闭图标触发
	 * @example 
	 */
	const __sfc__ = defineComponent({
		name: 'uv-row-notice',
		emits: ['click','close'],
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				animationDuration: '0', // 动画执行时间
				animationPlayState: 'paused', // 动画的开始和结束执行
				// nvue下，内容发生变化，导致滚动宽度也变化，需要标志为是否需要重新计算宽度
				// 不能在内容变化时直接重新计算，因为nvue的animation模块上一次的滚动不是刚好结束，会有影响
				nvueInit: true,
				show: true
			};
		},
		watch: {
			text: {
				immediate: true,
				handler(newValue, oldValue) {




					this.vue()

					
					if(!this.$uv.test.string(newValue)) {
						this.$uv.error('noticebar组件direction为row时，要求text参数为字符串形式')
					}
				}
			},
			fontSize() {




				this.vue()

			},
			speed() {




				this.vue()

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
			animationStyle() {
				let style = {}
				style.animationDuration = this.animationDuration
				style.animationPlayState = this.animationPlayState
				return style
			},
			// 内部对用户传入的数据进一步分割，放到多个text标签循环，否则如果用户传入的字符串很长（100个字符以上）
			// 放在一个text标签中进行滚动，在低端安卓机上，动画可能会出现抖动现象，需要分割到多个text中可解决此问题
			innerText() {
				let result = [],
					// 每组text标签的字符长度
					len = 20
				const textArr = this.text? this.text.split(''):[]
				for (let i = 0; i < textArr.length; i += len) {
					// 对拆分的后的text进行slice分割，得到的为数组再进行join拼接为字符串
					result.push(textArr.slice(i, i + len).join(''))
				}
				return result
			}
		},
		mounted() {














			this.init()
		},
		methods: {
			init() {





				this.vue()

				
				if(!this.$uv.test.string(this.text)) {
					this.$uv.error('noticebar组件direction为row时，要求text参数为字符串形式')
				}
			},
			// vue版处理
			async vue() {

				let boxWidth = 0,
					textWidth = 0
				// 进行一定的延时
				await this.$uv.sleep()
				// 查询盒子和文字的宽度
				textWidth = (await this.$uvGetRect('.uv-notice__content__text')).width
				boxWidth = (await this.$uvGetRect('.uv-notice__content')).width
				// 根据t=s/v(时间=路程/速度)，这里为何不需要加上#uv-notice-box的宽度，因为中设置了.uv-notice-content样式中设置了padding-left: 100%
				// 恰巧计算出来的结果中已经包含了#uv-notice-box的宽度
				this.animationDuration = `${textWidth / this.$uv.getPx(this.speed)}s`
				// 这里必须这样开始动画，否则在APP上动画速度不会改变
				this.animationPlayState = 'paused'
				setTimeout(() => {
					this.animationPlayState = 'running'
				}, 10)

			},
			// nvue版处理
			async nvue() {



















			},
			loopAnimation(textWidth, boxWidth) {




























			},
			getNvueRect(el) {








			},
			// 点击通告栏
			clickHandler(index) {
				this.$emit('click')
			},
			// 点击右侧按钮，需要判断点击的是关闭图标还是箭头图标
			close() {
				this.$emit('close')
			}
		},












	});

export default __sfc__
function GenUniModulesUvNoticeBarComponentsUvRowNoticeUvRowNoticeRender(this: InstanceType<typeof __sfc__>): any | null {
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
    _cE("view", _uM({
      class: "uv-notice__content",
      ref: "uv-notice__content"
    }), [
      _cE("view", _uM({
        ref: "uv-notice__content__text",
        class: "uv-notice__content__text",
        style: _nS([_ctx.animationStyle])
      }), [
        _cE(Fragment, null, RenderHelpers.renderList(_ctx.innerText, (item, index, __index, _cached): any => {
          return _cE("text", _uM({
            key: index,
            style: _nS([_ctx.textStyle])
          }), _tD(item), 5 /* TEXT, STYLE */)
        }), 128 /* KEYED_FRAGMENT */)
      ], 4 /* STYLE */)
    ], 512 /* NEED_PATCH */),
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
                onClick: _ctx.close,
                name: "close",
                size: 16,
                color: _ctx.color
              }), null, 8 /* PROPS */, ["onClick", "color"])
            : _cC("v-if", true)
        ])
      : _cC("v-if", true)
  ], 8 /* PROPS */, ["onClick"])
}
export type UvRowNoticeComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvNoticeBarComponentsUvRowNoticeUvRowNoticeStyles = [_uM([["uv-notice", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]]))], ["uv-notice__left-icon", _pS(_uM([["alignItems", "center"], ["marginRight", 5]]))], ["uv-notice__right-icon", _pS(_uM([["marginLeft", 5], ["alignItems", "center"]]))], ["uv-notice__content", _pS(_uM([["textAlign", "right"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "row"], ["flexWrap", "nowrap"], ["overflow", "hidden"]]))], ["uv-notice__content__text", _pS(_uM([["fontSize", 14], ["color", "#f9ae3d"], ["paddingLeft", "100%"], ["wordBreak", "keep-all"], ["whiteSpace", "nowrap"], ["animation", "uv-loop-animation 10s linear infinite both"], ["display", "flex"], ["flexDirection", "row"]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
