
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'










	// 引入图标名称，已经对应的unicode
	import icons from './icons';
	import props from './props.js';
	/**
	 * icon 图标
	 * @description 基于字体的图标集，包含了大多数常见场景的图标。
	 * @tutorial https://www.uvui.cn/components/icon.html
	 * @property {String}			name			图标名称，见示例图标集
	 * @property {String}			color			图标颜色,可接受主题色 （默认 color['uv-content-color'] ）
	 * @property {String | Number}	size			图标字体大小，单位px （默认 '16px' ）
	 * @property {Boolean}			bold			是否显示粗体 （默认 false ）
	 * @property {String | Number}	index			点击图标的时候传递事件出去的index（用于区分点击了哪一个）
	 * @property {String}			hoverClass		图标按下去的样式类，用法同uni的view组件的hoverClass参数，详情见官网
	 * @property {String}			customPrefix	自定义扩展前缀，方便用户扩展自己的图标库 （默认 'uicon' ）
	 * @property {String | Number}	label			图标右侧的label文字
	 * @property {String}			labelPos		label相对于图标的位置，只能right或bottom （默认 'right' ）
	 * @property {String | Number}	labelSize		label字体大小，单位px （默认 '15px' ）
	 * @property {String}			labelColor		图标右侧的label文字颜色 （ 默认 color['uv-content-color'] ）
	 * @property {String | Number}	space			label与图标的距离，单位px （默认 '3px' ）
	 * @property {String}			imgMode			图片的mode
	 * @property {String | Number}	width			显示图片小图标时的宽度
	 * @property {String | Number}	height			显示图片小图标时的高度
	 * @property {String | Number}	top				图标在垂直方向上的定位 用于解决某些情况下，让图标垂直居中的用途  （默认 0 ）
	 * @property {Boolean}			stop			是否阻止事件传播 （默认 false ）
	 * @property {Object}			customStyle		icon的样式，对象形式
	 * @event {Function} click 点击图标时触发
	 * @event {Function} touchstart 事件触摸时触发
	 * @example <uv-icon name="photo" color="#2979ff" size="28"></uv-icon>
	 */
	const __sfc__ = defineComponent({
		name: 'uv-icon',
		emits: ['click'],
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				colorType: [
					'primary',
					'success',
					'info',
					'error',
					'warning'
				]
			}
		},
		computed: {
			uClasses() {
				let classes = []
				classes.push(this.customPrefix)
				classes.push(this.customPrefix + '-' + this.name)
				// 主题色，通过类配置
				if (this.color && this.colorType.includes(this.color)) classes.push('uv-icon__icon--' + this.color)
				// 阿里，头条，百度小程序通过数组绑定类名时，无法直接使用[a, b, c]的形式，否则无法识别
				// 故需将其拆成一个字符串的形式，通过空格隔开各个类名



				return classes
			},
			iconStyle() {
				let style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-icon/components/uv-icon/uv-icon.vue", 109, 9),}
				style = {
					fontSize: this.$uv.addUnit(this.size),
					lineHeight: this.$uv.addUnit(this.size),
					fontWeight: this.bold ? 'bold' : 'normal',
					// 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
					top: this.$uv.addUnit(this.top)
				}
				// 非主题色值时，才当作颜色值
				if (this.color && !this.colorType.includes(this.color)) style.color = this.color
				return style
			},
			// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
			isImg() {
				const isBase64 = this.name.indexOf('data:') > -1 && this.name.indexOf('base64') > -1;
				return this.name.indexOf('/') !== -1 || isBase64;
			},
			imgStyle() {
				let style = {__$originalPosition: new UTSSourceMapPosition("style", "uni_modules/uv-icon/components/uv-icon/uv-icon.vue", 127, 9),}
				// 如果设置width和height属性，则优先使用，否则使用size属性
				style.width = this.width ? this.$uv.addUnit(this.width) : this.$uv.addUnit(this.size)
				style.height = this.height ? this.$uv.addUnit(this.height) : this.$uv.addUnit(this.size)
				return style
			},
			// 通过图标名，查找对应的图标
			icon() {
				// 如果内置的图标中找不到对应的图标，就直接返回name值，因为用户可能传入的是unicode代码
				const code = icons['uvicon-' + this.name];





				return code ? unescape(`%u${code}`) : ['uvicon'].indexOf(this.customPrefix) > -1 ? this.name : '';
			}
		},
		methods: {
			clickHandler(e) {
				this.$emit('click', this.index)
				// 是否阻止事件冒泡
				this.stop && this.preventEvent(e)
			}
		}
	})

export default __sfc__
function GenUniModulesUvIconComponentsUvIconUvIconRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({
    class: _nC(["uv-icon", ['uv-icon--' + _ctx.labelPos]]),
    onClick: _ctx.clickHandler
  }), [
    isTrue(_ctx.isImg)
      ? _cE("image", _uM({
          key: 0,
          class: "uv-icon__img",
          src: _ctx.name,
          mode: _ctx.imgMode,
          style: _nS([_ctx.imgStyle, _ctx.$uv.addStyle(_ctx.customStyle)])
        }), null, 12 /* STYLE, PROPS */, ["src", "mode"])
      : _cE("text", _uM({
          key: 1,
          class: _nC(["uv-icon__icon", _ctx.uClasses]),
          style: _nS([_ctx.iconStyle, _ctx.$uv.addStyle(_ctx.customStyle)]),
          "hover-class": _ctx.hoverClass
        }), _tD(_ctx.icon), 15 /* TEXT, CLASS, STYLE, PROPS */, ["hover-class"]),
    _ctx.label !== ''
      ? _cE("text", _uM({
          key: 2,
          class: "uv-icon__label",
          style: _nS(_uM({
			color: _ctx.labelColor,
			fontSize: _ctx.$uv.addUnit(_ctx.labelSize),
			marginLeft: _ctx.labelPos == 'right' ? _ctx.$uv.addUnit(_ctx.space) : 0,
			marginTop: _ctx.labelPos == 'bottom' ? _ctx.$uv.addUnit(_ctx.space) : 0,
			marginRight: _ctx.labelPos == 'left' ? _ctx.$uv.addUnit(_ctx.space) : 0,
			marginBottom: _ctx.labelPos == 'top' ? _ctx.$uv.addUnit(_ctx.space) : 0
		}))
        }), _tD(_ctx.label), 5 /* TEXT, STYLE */)
      : _cC("v-if", true)
  ], 10 /* CLASS, PROPS */, ["onClick"])
}
export type UvIconComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvIconComponentsUvIconUvIconStyles = [_uM([["uv-icon", _pS(_uM([["display", "flex"], ["alignItems", "center"]]))], ["uv-icon--left", _pS(_uM([["flexDirection", "row-reverse"], ["alignItems", "center"]]))], ["uv-icon--right", _pS(_uM([["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-icon--top", _pS(_uM([["flexDirection", "column-reverse"], ["justifyContent", "center"]]))], ["uv-icon--bottom", _pS(_uM([["flexDirection", "column"], ["justifyContent", "center"]]))], ["uv-icon__icon", _pS(_uM([["fontFamily", "uvicon-iconfont"], ["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["uv-icon__icon--primary", _pS(_uM([["color", "#3c9cff"]]))], ["uv-icon__icon--success", _pS(_uM([["color", "#5ac725"]]))], ["uv-icon__icon--error", _pS(_uM([["color", "#f56c6c"]]))], ["uv-icon__icon--warning", _pS(_uM([["color", "#f9ae3d"]]))], ["uv-icon__icon--info", _pS(_uM([["color", "#909399"]]))], ["uv-icon__img", _pS(_uM([["height", "auto"], ["willChange", "transform"]]))], ["uv-icon__label", _pS(_uM([["lineHeight", 1]]))], ["@FONT-FACE", _uM([["0", _uM([["fontFamily", "uvicon-iconfont"], ["src", "url(\"/assets/uvicons.04d281cc.ttf\") format(\"truetype\")"]])]])]])]
