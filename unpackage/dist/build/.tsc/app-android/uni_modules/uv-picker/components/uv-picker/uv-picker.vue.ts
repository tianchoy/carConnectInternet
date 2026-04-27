
/**
 * uv-picker
 * @description 选择器
 * @property {Boolean}			showToolbar			是否显示顶部的操作栏（默认 true ）
 * @property {String}			title				顶部标题
 * @property {Array}			columns				对象数组，设置每一列的数据
 * @property {Boolean}			loading				是否显示加载中状态（默认 false ）
 * @property {String | Number}	itemHeight			各列中，单个选项的高度（默认 44 ）
 * @property {String}			cancelText			取消按钮的文字（默认 '取消' ）
 * @property {String}			confirmText			确认按钮的文字（默认 '确定' ）
 * @property {String}			cancelColor			取消按钮的颜色（默认 '#909193' ）
 * @property {String}			confirmColor		确认按钮的颜色（默认 '#3c9cff' ）
 * @property {String}			color		文字颜色（默认 '' ）
 * @property {String}			activeColor		选中文字的颜色（默认 '' ）
 * @property {String | Number}	visibleItemCount	每列中可见选项的数量（默认 5 ）
 * @property {String}			keyName				选项对象中，需要展示的属性键名（默认 'text' ）
 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭选择器（默认 false ）
 * @property {Array}			defaultIndex		各列的默认索引
 * @property {Boolean}			immediateChange		是否在手指松开时立即触发change事件（默认 false ）
 * @event {Function} close		关闭选择器时触发
 * @event {Function} cancel		点击取消按钮触发
 * @event {Function} change		当选择值变化时触发
 * @event {Function} confirm	点击确定按钮，返回当前选择的值
 */
import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
import props from './props.js';
const __sfc__ = defineComponent({
	name: 'uv-picker',
	emits: ['confirm','cancel','close','change'],
	mixins: [mpMixin, mixin, props],
	computed: {
		// 为了解决支付宝不生效
		textStyle(){
			return (index,index1) => {
				const style = {};

				style.display = 'block';

				if(this.color) {
					style.color = this.color;
				}
				if(this.activeColor && index1 === this.innerIndex[index]) {
					style.color = this.activeColor;
				}
				return style;
			}
		}
	},
	data() {
		return {
			// 上一次选择的列索引
			lastIndex: [],
			// 索引值 ，对应picker-view的value
			innerIndex: [],
			// 各列的值
			innerColumns: [],
			// 上一次的变化列索引
			columnIndex: 0,
		}
	},
	watch: {
		// 监听默认索引的变化，重新设置对应的值
		defaultIndex: {
			immediate: true,
			handler(n) {
				this.setIndexs(n, true)
			}
		},
		// 监听columns参数的变化
		columns: {
			deep: true,
			immediate: true,
			handler(n) {
				this.setColumns(n)
			}
		},
	},
	methods: {
		open() {
			this.$refs.pickerPopup.open();
		},
		close() {
			this.$refs.pickerPopup.close();
		},
		popupChange(e) {
			if(!e.show) this.$emit('close');
		},
		// 获取item需要显示的文字，判别为对象还是文本
		getItemText(item) {
			if (this.$uv.test.object(item)) {
				return item[this.keyName]
			} else {
				return item
			}
		},
		// 点击工具栏的取消按钮
		cancel() {
			this.$emit('cancel');
			this.close();
		},
		// 点击工具栏的确定按钮
		confirm() {
			// 在这里使用deepClone拷贝后，vue3会自动转换成原始对象，这样处理是因为cli项目可能出现不返回值的情况
			this.$emit('confirm', this.$uv.deepClone({
				indexs: this.innerIndex,
				value: this.innerColumns.map((item, index) => item[this.innerIndex[index]]),
				values: this.innerColumns
			}));
			if(this.closeOnClickConfirm) {
				this.close();
			}
		},
		// 选择器某一列的数据发生变化时触发
		changeHandler(e) {
			const {
				value
			} = e.detail
			let index = 0,
				columnIndex = 0
			// 通过对比前后两次的列索引，得出当前变化的是哪一列
			for (let i = 0; i < value.length; i++) {
				let item = value[i]
				if (item !== (this.lastIndex[i] || 0)) { // 把undefined转为合法假值0
					// 设置columnIndex为当前变化列的索引
					columnIndex = i
					// index则为变化列中的变化项的索引
					index = item
					break // 终止循环，即使少一次循环，也是性能的提升
				}
			}
			this.columnIndex = columnIndex
			const values = this.innerColumns
			// 将当前的各项变化索引，设置为"上一次"的索引变化值
			this.setLastIndex(value)
			this.setIndexs(value)

			this.$emit('change', {
				value: this.innerColumns.map((item, index) => item[value[index]]),
				index,
				indexs: value,
				// values为当前变化列的数组内容
				values,
				columnIndex
			})
		},
		// 设置index索引，此方法可被外部调用设置
		setIndexs(index, setLastIndex) {
			this.innerIndex = this.$uv.deepClone(index)
			if (setLastIndex) {
				this.setLastIndex(index)
			}
		},
		// 记录上一次的各列索引位置
		setLastIndex(index) {
			// 当能进入此方法，意味着当前设置的各列默认索引，即为“上一次”的选中值，需要记录，是因为changeHandler中
			// 需要拿前后的变化值进行对比，得出当前发生改变的是哪一列
			this.lastIndex = this.$uv.deepClone(index)
		},
		// 设置对应列选项的所有值
		setColumnValues(columnIndex, values) {
			// 替换innerColumns数组中columnIndex索引的值为values，使用的是数组的splice方法
			this.innerColumns.splice(columnIndex, 1, values)
			// 拷贝一份原有的innerIndex做临时变量，将大于当前变化列的所有的列的默认索引设置为0
			let tmpIndex = this.$uv.deepClone(this.innerIndex)
			for (let i = 0; i < this.innerColumns.length; i++) {
				if (i > this.columnIndex) {
					tmpIndex[i] = 0
				}
			}
			// 一次性赋值，不能单个修改，否则无效
			this.setIndexs(tmpIndex)
		},
		// 获取对应列的所有选项
		getColumnValues(columnIndex) {
			// 进行同步阻塞，因为外部得到change事件之后，可能需要执行setColumnValues更新列的值
			// 索引如果在外部change的回调中调用getColumnValues的话，可能无法得到变更后的列值，这里进行一定延时，保证值的准确性
			(async () => {
				await this.$uv.sleep()
			})()
			return this.innerColumns[columnIndex]
		},
		// 设置整体各列的columns的值
		setColumns(columns) {
			this.innerColumns = this.$uv.deepClone(columns)
			// 如果在设置各列数据时，没有被设置默认的各列索引defaultIndex，那么用0去填充它，数组长度为列的数量
			if (this.innerIndex.length === 0) {
				this.innerIndex = new Array(columns.length).fill(0)
			}
		},
		// 获取各列选中值对应的索引
		getIndexs() {
			return this.innerIndex
		},
		// 获取各列选中的值
		getValues() {
			// 进行同步阻塞，因为外部得到change事件之后，可能需要执行setColumnValues更新列的值
			// 索引如果在外部change的回调中调用getValues的话，可能无法得到变更后的列值，这里进行一定延时，保证值的准确性
			(async () => {
				await this.$uv.sleep()
			})()
			return this.innerColumns.map((item, index) => item[this.innerIndex[index]])
		}
	},
})

export default __sfc__
function GenUniModulesUvPickerComponentsUvPickerUvPickerRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
const _component_uv_toolbar = resolveEasyComponent("uv-toolbar",_easycom_uv_toolbar)
const _component_picker_view_column = resolveComponent("picker-view-column")
const _component_picker_view = resolveComponent("picker-view")
const _component_uv_loading_icon = resolveEasyComponent("uv-loading-icon",_easycom_uv_loading_icon)
const _component_uv_popup = resolveEasyComponent("uv-popup",_easycom_uv_popup)

  return _cV(_component_uv_popup, _uM({
    ref: "pickerPopup",
    mode: "bottom",
    round: _ctx.round,
    "close-on-click-overlay": _ctx.closeOnClickOverlay,
    onChange: _ctx.popupChange
  }), _uM({
    default: withSlotCtx((): any[] => [
      _cE("view", _uM({ class: "uv-picker" }), [
        isTrue(_ctx.showToolbar)
          ? _cV(_component_uv_toolbar, _uM({
              key: 0,
              cancelColor: _ctx.cancelColor,
              confirmColor: _ctx.confirmColor,
              cancelText: _ctx.cancelText,
              confirmText: _ctx.confirmText,
              title: _ctx.title,
              onCancel: _ctx.cancel,
              onConfirm: _ctx.confirm
            }), null, 8 /* PROPS */, ["cancelColor", "confirmColor", "cancelText", "confirmText", "title", "onCancel", "onConfirm"])
          : _cC("v-if", true),
        _cV(_component_picker_view, _uM({
          class: "uv-picker__view",
          indicatorStyle: `height: ${_ctx.$uv.addUnit(_ctx.itemHeight)}`,
          value: _ctx.innerIndex,
          immediateChange: _ctx.immediateChange,
          style: _nS(_uM({
					height: `${_ctx.$uv.addUnit(_ctx.visibleItemCount * _ctx.itemHeight)}`
				})),
          onChange: _ctx.changeHandler
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cE(Fragment, null, RenderHelpers.renderList(_ctx.innerColumns, (item, index, __index, _cached): any => {
              return _cV(_component_picker_view_column, _uM({
                key: index,
                class: "uv-picker__view__column"
              }), _uM({
                default: withSlotCtx((): any[] => [
                  isTrue(_ctx.$uv.test.array(item))
                    ? _cE(Fragment, _uM({ key: 0 }), RenderHelpers.renderList(item, (item1, index1, __index, _cached): any => {
                        return _cE("text", _uM({
                          class: "uv-picker__view__column__item uv-line-1",
                          key: index1,
                          style: _nS([_uM({
								height: _ctx.$uv.addUnit(_ctx.itemHeight),
								lineHeight: _ctx.$uv.addUnit(_ctx.itemHeight),
								fontWeight: index1 === _ctx.innerIndex[index] ? 'bold' : 'normal'
							}),_ctx.textStyle(index,index1)])
                        }), _tD(_ctx.getItemText(item1)), 5 /* TEXT, STYLE */)
                      }), 128 /* KEYED_FRAGMENT */)
                    : _cC("v-if", true)
                ]),
                _: 2 /* DYNAMIC */
              }), 1024 /* DYNAMIC_SLOTS */)
            }), 128 /* KEYED_FRAGMENT */)
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["indicatorStyle", "value", "immediateChange", "style", "onChange"]),
        isTrue(_ctx.loading)
          ? _cE("view", _uM({
              key: 1,
              class: "uv-picker--loading"
            }), [
              _cV(_component_uv_loading_icon, _uM({ mode: "circle" }))
            ])
          : _cC("v-if", true)
      ])
    ]),
    _: 1 /* STABLE */
  }), 8 /* PROPS */, ["round", "close-on-click-overlay", "onChange"])
}
export type UvPickerComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesUvPickerComponentsUvPickerUvPickerStyles = [_uM([["uv-line-1", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 1], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-2", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 2], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-3", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 3], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-4", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 4], ["!WebkitBoxOrient", "vertical"]]))], ["uv-line-5", _pS(_uM([["overflow", "hidden"], ["textOverflow", "ellipsis"], ["wordBreak", "break-all"], ["WebkitLineClamp", 5], ["!WebkitBoxOrient", "vertical"]]))], ["uv-picker", _pS(_uM([["position", "relative"]]))], ["uv-picker__view__column", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["justifyContent", "center"]]))], ["uv-picker__view__column__item", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", 16], ["textAlign", "center"], ["color", "#303133"]]))], ["uv-picker__view__column__item--disabled", _pS(_uM([["cursor", "not-allowed"], ["opacity", 0.35]]))], ["uv-picker--loading", _pS(_uM([["position", "absolute"], ["top", 0], ["right", 0], ["left", 0], ["bottom", 0], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["backgroundColor", "rgba(255,255,255,0.87)"], ["zIndex", 1000]]))]])]

import _easycom_uv_toolbar from '@/uni_modules/uv-toolbar/components/uv-toolbar/uv-toolbar.vue'
import _easycom_uv_loading_icon from '@/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.vue'
import _easycom_uv_popup from '@/uni_modules/uv-popup/components/uv-popup/uv-popup.vue'
