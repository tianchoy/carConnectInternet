import { ref, computed } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-grid',
name: 'i-grid',
  props: {
  items: {
    type: Array,
    default() {
      return ['首页', '分类', '购物车', '我的', '优惠券', '设置']
    },
  },
  col: {
    type: Number,
    default: 3,
  },
  itemHeight: {
    type: [String, Number],
    default: '70',
  },
  itemBgColor: {
    type: String,
    default: '#ffffff',
  },
  bgColor: {
    type: String,
    default: 'transparent',
  },
  width: {
    type: String,
    default: 'auto',
  },
  iconColor: {
    type: String,
    default: '#333333',
  },
  textColor: {
    type: String,
    default: '#888888',
  },
  fontSize: {
    type: [String, Number],
    default: '13',
  },
  iconSize: {
    type: [String, Number],
    default: '25',
  },
  imageSize: {
    type: [String, Number],
    default: '40',
  },
  showBorder: {
    type: Boolean,
    default: true,
  },
  borderColor: {
    type: String,
    default: '#f5f5f5',
  },
  round: {
    type: [String, Number],
    default: '0',
  },
  isLink: {
    type: Boolean,
    default: true,
  },
},
  emits: ['select', 'change', 'click', 'loadmore'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：外部传入的配置，用于控制组件展示、状态和行为。
 * - items: 宫格数据源；支持字符串数组，也支持对象数组，对象可提供 text、icon、image、name、iconColor、textColor、bgColor、url 等字段。
 *   - name: 项目唯一标识，用于事件回调中识别具体项目（可选）
 *   - icon: 字体图标名称（如：''）
 *   - image: 图片图标URL（如：'/static/icon.png'），优先级高于 icon
 * - col: 每行显示几列，依据 DCloud uni-app x 宫格规范的 col；常用 2、3、4、5。
 * - itemHeight: 每个宫格项目高度，数字会自动转为 px。
 * - itemBgColor: 统一设置每个宫格项目背景色；单个 item.bgColor 优先级更高。
 * - bgColor: 整体宫格背景色。
 * - width: 整体宫格宽度，例如 auto、100%、320px。
 * - iconColor: 统一图标颜色；单个 item.iconColor 优先级更高。
 * - textColor: 统一文字颜色；单个 item.textColor 优先级更高。
 * - fontSize: 文字大小，数字会自动转为 px。
 * - iconSize: 图标大小，数字会自动转为 px。
 * - imageSize: 图片图标大小，数字会自动转为 px（宽高一致）。
 * - showBorder: 是否显示宫格分割线。
 * - borderColor: 分割线颜色。
 * - round: 整体圆角，数字会自动转为 px。
 * - isLink: 是否开启点击反馈效果。
 */
const props = __props

/**
 * Emits 说明：组件向外派发的事件，用于页面监听交互结果或同步受控值。
 * - select: 点击某个宫格项目时触发，参数包含 index、text、name、icon、image、url。
 * - change: 选中项变化时触发，参数同 select。
 * - click: 点击某个宫格项目时触发，参数同 select。
 * - loadmore: 保留的加载更多事件，便于列表型场景扩展。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function valueText(value: any): string {
  if (typeof value == 'string') return value
  if (typeof value == 'number' || typeof value == 'boolean') return value.toString()
  return ''
}

function formatSize(value: string | number): string {
  const text = value.toString()
  if (
    text.indexOf('px') >= 0 ||
    text.indexOf('rpx') >= 0 ||
    text.indexOf('%') >= 0 ||
    text == 'auto'
  ) {
    return text
  }
  return text + 'px'
}

function itemValue(item: any, keyName: string): string {
  if (item == null || typeof item != 'object') return ''
  const values = item as UTSJSONObject
  const value = values[keyName]
  if (value == null) return ''
  return valueText(value as any)
}

function getItemText(item: any): string {
  const text = itemValue(item, 'text')
  if (text.length > 0) return text
  return valueText(item)
}

function getItemIcon(item: any): string {
  return itemValue(item, 'icon')
}

function getItemImage(item: any): string {
  return itemValue(item, 'image')
}

function getItemName(item: any): string {
  return itemValue(item, 'name')
}

function getItemBgColor(item: any): string {
  const color = itemValue(item, 'bgColor')
  if (color.length > 0) return color
  return props.itemBgColor
}

function getItemIconColor(item: any): string {
  const color = itemValue(item, 'iconColor')
  if (color.length > 0) return color
  return props.iconColor
}

function getItemTextColor(item: any): string {
  const color = itemValue(item, 'textColor')
  if (color.length > 0) return color
  return props.textColor
}

function getItemUrl(item: any): string {
  return itemValue(item, 'url')
}

const bgColor = computed(() => {
  return props.bgColor
})
const gridItems = computed((): Array<any> => {
  const items = props.items
  if (items == null) return [] as Array<any>
  return items as Array<any>
})
const selected = ref(-1)

const gridStyle = computed(() => {
  return (
    'width:' +
    props.width +
    ';background-color:' +
    bgColor.value +
    ';border-radius:' +
    formatSize(props.round) +
    ';'
  )
})

function getColumns() {
  if (props.col <= 1) return 1
  if (props.col >= 6) return 6
  return props.col
}

function getRows(): number {
  const columns = getColumns()
  const items = props.items
  if (items == null) return 0
  return Math.ceil(items.length / columns)
}

function getItemWidth() {
  const columns = getColumns()
  if (columns == 1) return '100%'
  if (columns == 2) return '50%'
  if (columns == 3) return '33.3333%'
  if (columns == 4) return '25%'
  if (columns == 5) return '20%'
  return '16.6667%'
}

function getItemStyle(index: number, item: any): string {
  const columns = getColumns()
  const row = Math.floor(index / columns)
  const colIndex = index % columns
  let style =
    'width:' +
    getItemWidth() +
    ';height:' +
    formatSize(props.itemHeight) +
    ';background-color:' +
    getItemBgColor(item) +
    ';'
  if (props.showBorder) {
    if (colIndex < columns - 1) {
      style =
        style +
        'border-right-width:1px;border-right-style:solid;border-right-color:' +
        props.borderColor +
        ';'
    }
    if (row < getRows() - 1) {
      style =
        style +
        'border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:' +
        props.borderColor +
        ';'
    }
  }
  return style
}

function getIconStyle(item: any): string {
  return (
    'color:' +
    getItemIconColor(item) +
    ';font-size:' +
    formatSize(props.iconSize) +
    ';line-height:' +
    formatSize(props.iconSize) +
    ';'
  )
}

function getImageStyle(item: any): string {
  const size = formatSize(props.imageSize)
  return 'width:' + size + ';height:' + size + ';'
}

function getTextStyle(item: any): string {
  return 'color:' + getItemTextColor(item) + ';font-size:' + formatSize(props.fontSize) + ';'
}

function buildPayload(item: any, index: number): UTSJSONObject {
  return {
    index,
    name: getItemName(item),
    text: getItemText(item),
    icon: getItemIcon(item),
    image: getItemImage(item),
    url: getItemUrl(item),
  }
}

function select(item: any, index: number): void {
  selected.value = index
  const payload = buildPayload(item, index)
  emit('select', payload)
  emit('change', payload)
  emit('click', payload)
}

function loadMore(): void {
  emit('loadmore', gridItems.value.length)
}

return (): any | null => {

  return _cE("view", _uM({
    class: "i-grid",
    style: _nS(gridStyle.value)
  }), [
    _cE(Fragment, null, RenderHelpers.renderList(gridItems.value, (item, index, __index, _cached): any => {
      return _cE("view", _uM({
        key: index.toString() + '-' + getItemText(item),
        class: _nC(
        selected.value == index
          ? 'i-grid__item i-grid__item--active'
          : 'i-grid__item'
      ),
        style: _nS(getItemStyle(index, item as any)),
        "hover-class": _ctx.isLink ? 'i-grid__item--hover' : 'none',
        onClick: () => {select(item, index)}
      }), [
        getItemImage(item).length > 0
          ? _cE("image", _uM({
              key: 0,
              class: "i-grid__image",
              src: getItemImage(item),
              style: _nS(getImageStyle(item)),
              mode: "aspectFit"
            }), null, 12 /* STYLE, PROPS */, ["src"])
          : getItemIcon(item).length > 0
            ? _cE("text", _uM({
                key: 1,
                class: "i-grid__icon",
                style: _nS(getIconStyle(item))
              }), _tD(getItemIcon(item)), 5 /* TEXT, STYLE */)
            : _cC("v-if", true),
        _cE("text", _uM({
          class: "i-grid__text",
          style: _nS(getTextStyle(item))
        }), _tD(getItemText(item)), 5 /* TEXT, STYLE */)
      ], 14 /* CLASS, STYLE, PROPS */, ["hover-class", "onClick"])
    }), 128 /* KEYED_FRAGMENT */)
  ], 4 /* STYLE */)
}
}

})
export default __sfc__
export type IGridComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIGridIGridStyles = [_uM([["i-grid", _pS(_uM([["flexDirection", "row"], ["flexWrap", "wrap"], ["overflow", "hidden"]]))], ["i-grid__item", _pS(_uM([["boxSizing", "border-box"], ["overflow", "hidden"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-grid__item--hover", _pS(_uM([["backgroundColor", "#f3f4f6"]]))], ["i-grid__item--active", _pS(_uM([["backgroundColor", "#ecf5ff"]]))], ["i-grid__image", _pS(_uM([["marginBottom", 8]]))], ["i-grid__icon", _pS(_uM([["marginBottom", 8], ["textAlign", "center"], ["lines", 1]]))], ["i-grid__text", _pS(_uM([["lineHeight", "18px"], ["textAlign", "center"], ["lines", 1]]))]])]
