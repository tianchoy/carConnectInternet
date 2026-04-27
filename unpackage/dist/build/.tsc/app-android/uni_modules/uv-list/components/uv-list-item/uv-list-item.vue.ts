
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	/**
	 * ListItem 列表子组件
	 * @description 列表子组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=24
	 * @property {String} 	title 							标题
	 * @property {String} 	note 							描述
	 * @property {String} 	thumb 							左侧缩略图，若thumb有值，则不会显示扩展图标
	 * @property {String}  	thumbSize = [lg|base|sm]		略缩图大小
	 * 	@value 	 lg			大图
	 * 	@value 	 base		一般
	 * 	@value 	 sm			小图
	 * @property {String} 	rightText 						右侧文字内容
	 * @property {Boolean} 	disabled = [true|false]			是否禁用
	 * @property {Boolean} 	clickable = [true|false] 		是否开启点击反馈
	 * @property {String} 	link = [navigateTo|redirectTo|reLaunch|switchTab] 是否展示右侧箭头并开启点击反馈
	 *  @value 	navigateTo 	同 uni.navigateTo()
	 * 	@value redirectTo 	同 uni.redirectTo()
	 * 	@value reLaunch   	同 uni.reLaunch()
	 * 	@value switchTab  	同 uni.switchTab()
	 * @property {String | PageURIString} 	to  			跳转目标页面
	 * @property {Boolean} 	showBadge = [true|false] 		是否显示数字角标
	 * @property {Object} 	badge  扩展数字角标的参数，格式为 :badge="{value: 122}"
	 * @property {Boolean} 	showSwitch = [true|false] 		是否显示Switch
	 * @property {Boolean} 	switchChecked = [true|false] 	Switch是否被选中
	 * @property {Boolean} 	showExtraIcon = [true|false] 	左侧是否显示扩展图标
	 * @property {Object} 	extraIcon 						扩展图标参数，格式为 :extraIcon="{icon: 'photo',size: '30px'}"
	 * @property {String} 	direction = [row|column]		排版方向
	 * @value row 			水平排列
	 * @value column 		垂直排列
	 * @event {Function} 	click 							点击 uniListItem 触发事件
	 * @event {Function} 	switchChange 					点击切换 Switch 时触发
	 */
	const __sfc__ = defineComponent({
		name: 'uv-list-item',
		mixins: [mpMixin, mixin],
		emits: ['click', 'switchChange'],
		props: {
			direction: {
				type: String,
				default: 'row'
			},
			title: {
				type: String,
				default: ''
			},
			note: {
				type: String,
				default: ''
			},
			ellipsis: {
				type: [Number, String],
				default: 0
			},
			disabled: {
				type: [Boolean, String],
				default: false
			},
			clickable: {
				type: Boolean,
				default: false
			},
			showArrow: {
				type: [Boolean, String],
				default: false
			},
			link: {
				type: [Boolean, String],
				default: false
			},
			to: {
				type: String,
				default: ''
			},
			showSwitch: {
				type: [Boolean, String],
				default: false
			},
			switchChecked: {
				type: [Boolean, String],
				default: false
			},
			showBadge: {
				type: [Boolean, String],
				default: false
			},
			badge: {
				type: Object,
				default () {
					return {}
				}
			},
			rightText: {
				type: String,
				default: ''
			},
			thumb: {
				type: String,
				default: ''
			},
			thumbSize: {
				type: String,
				default: 'base'
			},
			showExtraIcon: {
				type: [Boolean, String],
				default: false
			},
			extraIcon: {
				type: Object,
				default () {
					return {
						name: '',
						color: '#000000',
						size: 20,
						customPrefix: ''
					};
				}
			},
			border: {
				type: Boolean,
				default: false
			},
			customStyle: {
				type: Object,
				default () {
					return {
						padding: '',
						backgroundColor: '#FFFFFF'
					}
				}
			},
			keepScrollPosition: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			directionData(){
				return this.direction ? this.direction : (this.parentData.direction ? this.parentData.direction : 'row');
			}
		},
		watch: {
			'customStyle.padding': {
				handler(padding) {
					if(padding) this.setPadding(padding);
				},
				immediate: true
			}
		},
		data() {
			return {
				isFirstChild: false,
				padding: {
					top: "",
					right: "",
					bottom: "",
					left: ""
				},
				parentData: {
					direction: 'row',
					padding: 0
				}
			};
		},
		created() {
			this.updateParentData();
		},
		mounted() {
			this.init();
			this.list = this.getForm()
			// 判断是否存在 uv-list 组件
			if (this.list) {
				if (!this.list.firstChildAppend) {
					this.list.firstChildAppend = true;
					this.isFirstChild = true;
				}
			}
		},
		methods: {
			init(){
				if (!this.parent) {
					this.$uv.error('uv-list-item必须搭配uv-list组件使用');
				}
				this.$nextTick(()=>{
					if(!(this.padding.top || this.padding.right|| this.padding.bottom|| this.padding.left)){
						this.setPadding(this.parentData.padding);
					}
				})
			},
			updateParentData() {
				this.getParentData('uv-list');
			},
			setPadding(padding){
				if(typeof padding == 'number'){
					padding += ''
				}
				let paddingArr = padding.split(' ')
				if (paddingArr.length === 1) {
					const allPadding = paddingArr[0]
					this.padding = {
						"top": allPadding,
						"right": allPadding,
						"bottom": allPadding,
						"left": allPadding
					}
				} else if (paddingArr.length === 2) {
					const [verticalPadding, horizontalPadding] = paddingArr;
					this.padding = {
						"top": verticalPadding,
						"right": horizontalPadding,
						"bottom": verticalPadding,
						"left": horizontalPadding
					}
				} else if (paddingArr.length === 4) {
						const [topPadding, rightPadding, bottomPadding, leftPadding] = paddingArr;
						this.padding = {
							"top": topPadding,
							"right": rightPadding,
							"bottom": bottomPadding,
							"left": leftPadding
						}
				}
			},
			/**
			 * 获取父元素实例
			 */
			getForm(name = 'uniList') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false
					parentName = parent.$options.name;
				}
				return parent;
			},
			onClick() {
				if (this.to !== '') {
					this.openPage();
					return;
				}
				if (this.clickable || this.link) {
					this.$emit('click', {
						data: {}
					});
				}
			},
			onSwitchChange(e) {
				this.$emit('switchChange', e);
			},
			openPage() {
				if (['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].indexOf(this.link) !== -1) {
					this.pageApi(this.link);
				} else {
					this.pageApi('navigateTo');
				}
			},
			pageApi(api) {
				let callback = {
					url: this.to,
					success: res => {
						this.$emit('click', {
							data: res
						});
					},
					fail: err => {
						this.$emit('click', {
							data: err
						});
					}
				}
				switch (api) {
					case 'navigateTo':
						uni.navigateTo(callback)
						break
					case 'redirectTo':
						uni.redirectTo(callback)
						break
					case 'reLaunch':
						uni.reLaunch(callback)
						break
					case 'switchTab':
						uni.switchTab(callback)
						break
					default:
						uni.navigateTo(callback)
				}
			}
		}
	});

export default __sfc__
function GenUniModulesUvListComponentsUvListItemUvListItemRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_badge = resolveEasyComponent("uv-badge",_easycom_uv_badge)
const _component_uv_switch = resolveEasyComponent("uv-switch",_easycom_uv_switch)

  return _cE("view", _uM({
    class: _nC([_uM({ 'uv-list-item--disabled': _ctx.disabled }), "uv-list-item"]),
    style: _nS([_ctx.$uv.addStyle(_ctx.customStyle),_uM({'background-color':_ctx.customStyle.backgroundColor?_ctx.customStyle.backgroundColor:'#fff'})]),
    "hover-class": (!_ctx.clickable && !_ctx.link) || _ctx.disabled || _ctx.showSwitch ? '' : 'uv-list-item--hover',
    onClick: _ctx.onClick
  }), [
    isTrue(!_ctx.isFirstChild)
      ? _cE("view", _uM({
          key: 0,
          class: _nC(["border--left", _uM({ 'uv-list--border': _ctx.border })])
        }), null, 2 /* CLASS */)
      : _cC("v-if", true),
    _cE("view", _uM({ class: "uv-list-item__wrapper" }), [
      renderSlot(_ctx.$slots, "default", {}, (): any[] => [
        _cE("view", _uM({
          class: _nC(["uv-list-item__container", _uM({ 'container--right': _ctx.showArrow || _ctx.link, 'flex--direction': _ctx.directionData === 'column'})]),
          style: _nS(_uM({paddingTop:_ctx.padding.top,paddingLeft:_ctx.padding.left,paddingRight:_ctx.padding.right,paddingBottom:_ctx.padding.bottom}))
        }), [
          renderSlot(_ctx.$slots, "header", {}, (): any[] => [
            _cE("view", _uM({ class: "uv-list-item__header" }), [
              isTrue(_ctx.thumb)
                ? _cE("view", _uM({
                    key: 0,
                    class: "uv-list-item__icon"
                  }), [
                    _cE("image", _uM({
                      src: _ctx.thumb,
                      class: _nC(["uv-list-item__icon-img", ['uv-list--' + _ctx.thumbSize]])
                    }), null, 10 /* CLASS, PROPS */, ["src"])
                  ])
                : isTrue(_ctx.showExtraIcon)
                  ? _cE("view", _uM({
                      key: 1,
                      class: "uv-list-item__icon"
                    }), [
                      _cV(_component_uv_icon, _uM({
                        name: _ctx.extraIcon.icon,
                        customPrefix: _ctx.extraIcon.customPrefix,
                        color: _ctx.extraIcon.color,
                        size: _ctx.extraIcon.size
                      }), null, 8 /* PROPS */, ["name", "customPrefix", "color", "size"])
                    ])
                  : _cC("v-if", true)
            ])
          ]),
          renderSlot(_ctx.$slots, "body", {}, (): any[] => [
            _cE("view", _uM({
              class: _nC(["uv-list-item__content", _uM({ 'uv-list-item__content--center': _ctx.thumb || _ctx.showExtraIcon || _ctx.showBadge || _ctx.showSwitch })])
            }), [
              isTrue(_ctx.title)
                ? _cE("text", _uM({
                    key: 0,
                    class: _nC(["uv-list-item__content-title", [_ctx.ellipsis && `uv-line-${_ctx.ellipsis}`]])
                  }), _tD(_ctx.title), 3 /* TEXT, CLASS */)
                : _cC("v-if", true),
              isTrue(_ctx.note)
                ? _cE("text", _uM({
                    key: 1,
                    class: "uv-list-item__content-note"
                  }), _tD(_ctx.note), 1 /* TEXT */)
                : _cC("v-if", true)
            ], 2 /* CLASS */)
          ]),
          renderSlot(_ctx.$slots, "footer", {}, (): any[] => [
            isTrue(_ctx.rightText || _ctx.showBadge || _ctx.showSwitch)
              ? _cE("view", _uM({
                  key: 0,
                  class: _nC(["uv-list-item__extra", _uM({ 'flex--justify': _ctx.directionData === 'column' })])
                }), [
                  isTrue(_ctx.rightText)
                    ? _cE("text", _uM({
                        key: 0,
                        class: "uv-list-item__extra-text"
                      }), _tD(_ctx.rightText), 1 /* TEXT */)
                    : _cC("v-if", true),
                  isTrue(_ctx.showBadge)
                    ? _cV(_component_uv_badge, _uM({
                        key: 1,
                        show: !!(_ctx.badge.show || _ctx.badge.isDot || _ctx.badge.value),
                        isDot: _ctx.badge.isDot,
                        value: _ctx.badge.value,
                        max: _ctx.badge.max,
                        type: _ctx.badge.type,
                        showZero: _ctx.badge.showZero,
                        bgColor: _ctx.badge.bgColor,
                        color: _ctx.badge.color,
                        shape: _ctx.badge.shape,
                        numberType: _ctx.badge.numberType,
                        inverted: _ctx.badge.inverted,
                        customStyle: "margin-left: 4px;"
                      }), null, 8 /* PROPS */, ["show", "isDot", "value", "max", "type", "showZero", "bgColor", "color", "shape", "numberType", "inverted"])
                    : _cC("v-if", true),
                  isTrue(_ctx.showSwitch)
                    ? _cV(_component_uv_switch, _uM({
                        key: 2,
                        value: _ctx.switchChecked,
                        disabled: _ctx.disabled,
                        onChange: _ctx.onSwitchChange
                      }), null, 8 /* PROPS */, ["value", "disabled", "onChange"])
                    : _cC("v-if", true)
                ], 2 /* CLASS */)
              : _cC("v-if", true)
          ])
        ], 6 /* CLASS, STYLE */)
      ])
    ]),
    isTrue(_ctx.showArrow || _ctx.link)
      ? _cV(_component_uv_icon, _uM({
          key: 1,
          size: "34rpx",
          class: "uv-icon-wrapper",
          color: "#bbb",
          name: "arrow-right"
        }))
      : _cC("v-if", true)
  ], 14 /* CLASS, STYLE, PROPS */, ["hover-class", "onClick"])
}
export type UvListItemComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvListComponentsUvListItemUvListItemStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-list-item", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["fontSize", 16], ["position", "relative"], ["justifyContent", "space-between"], ["alignItems", "center"], ["backgroundColor", "#ffffff"]]))], ["uv-list-item--disabled", _pS(_uM([["opacity", 0.3]]))], ["uv-list-item--hover", _pS(_uM([["!backgroundColor", "#f1f1f1"]]))], ["uv-list-item__wrapper", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["uv-list-item__container", _pS(_uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["paddingTop", 12], ["paddingRight", 15], ["paddingBottom", 12], ["paddingLeft", 15], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["overflow", "hidden"]]))], ["container--right", _pS(_uM([["paddingRight", 0]]))], ["uv-list--border", _pS(_uM([["position", "absolute"], ["top", 0], ["right", 0], ["left", 0], ["position:after", "absolute"], ["top:after", 0], ["right:after", 0], ["left:after", 0], ["height:after", 1], ["content:after", "\"\""], ["WebkitTransform:after", "scaleY(0.5)"], ["transform:after", "scaleY(0.5)"], ["backgroundColor:after", "#e5e5e5"]]))], ["uv-list-item__content", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["paddingRight", 8], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["color", "#3b4144"], ["justifyContent", "space-between"], ["overflow", "hidden"]]))], ["uv-list-item__content--center", _pS(_uM([["justifyContent", "center"]]))], ["uv-list-item__content-title", _pS(_uM([["fontSize", 14], ["color", "#3b4144"], ["overflow", "hidden"]]))], ["uv-list-item__content-note", _pS(_uM([["marginTop", "6rpx"], ["color", "#999999"], ["fontSize", 12], ["overflow", "hidden"]]))], ["uv-list-item__extra", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-end"], ["alignItems", "center"]]))], ["uv-list-item__header", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-list-item__icon", _pS(_uM([["marginRight", "18rpx"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"]]))], ["uv-list-item__icon-img", _pS(_uM([["height", 26], ["width", 26], ["marginRight", 10]]))], ["uv-icon-wrapper", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["paddingTop", 0], ["paddingRight", 10], ["paddingBottom", 0], ["paddingLeft", 10]]))], ["flex--direction", _pS(_uM([["flexDirection", "column"]]))], ["uv-list--lg", _pS(_uM([["height", 40], ["width", 40]]))], ["uv-list--base", _pS(_uM([["height", 26], ["width", 26]]))], ["uv-list--sm", _pS(_uM([["height", 20], ["width", 20]]))], ["uv-list-item__extra-text", _pS(_uM([["color", "#999999"], ["fontSize", 12]]))]])]

import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_badge from '@/uni_modules/uv-badge/components/uv-badge/uv-badge.vue'
import _easycom_uv_switch from '@/uni_modules/uv-switch/components/uv-switch/uv-switch.vue'
