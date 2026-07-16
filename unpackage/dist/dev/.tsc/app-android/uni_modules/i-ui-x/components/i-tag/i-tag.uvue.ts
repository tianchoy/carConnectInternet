import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import { computed, ref } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-tag',
name: 'i-tag',
  props: {
  type: {
    type: String,
    default: 'primary',
  },
  plain: {
    type: Boolean,
    default: false,
  },
  skin: {
    type: String,
    default: 'normal',
  },
  round: {
    type: [Boolean, String, Number],
    default: false,
  },
  text: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String,
    default: 'normal',
  },
  width: {
    type: [String, Number],
    default: '',
  },
  height: {
    type: [String, Number],
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  iconSize: {
    type: [String, Number],
    default: '',
  },
  fontSize: {
    type: [String, Number],
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  fontColor: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: '',
  },
  borderColor: {
    type: String,
    default: '',
  },
  borderWidth: {
    type: [String, Number],
    default: 1,
  },
  linear: {
    type: Array,
    default: () => [] as string[],
  },
  shadow: {
    type: [String, Number, Array],
    default: '',
  },
  closeIcon: {
    type: String,
    default: 'x',
  },
  customStyle: {
    type: String,
    default: '',
  },
},
  emits: ['click', 'close'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：外部传入的配置，用于控制组件展示、状态和行为。
 * - type: 组件类型，用于切换视觉风格或语义状态。
 * - plain: 是否使用朴素样式。
 * - skin: 样式风格，可选 normal / thin / outlined / text / dashed。
 * - round: 是否使用圆形样式。
 * - text: 主要展示文本。
 * - size: 组件尺寸，通常影响宽高或字号。
 * - width: 标签宽度。
 * - height: 标签高度；传入后优先于 size。
 * - closable: closable 配置项，用于控制组件展示或交互行为。
 * - disabled: 是否禁用交互；为 true 时阻止点击、选择或输入。
 * - icon: 左侧图标名称，复用 i-icon。
 * - iconSize: 图标尺寸。
 * - fontSize: 文本字号。
 * - color: 文字、图标或线条颜色。
 * - fontColor: 文本颜色。
 * - bgColor: 背景颜色。
 * - borderColor: 边框颜色。
 * - borderWidth: 边框宽度。
 * - linear: 背景渐变数组，如 ['to right', '#FFEB3A', '#4DEF8E']。
 * - shadow: 阴影，传 none 关闭，传数组可自定义。
 * - customStyle: 自定义外层样式。
 */
const props = __props

/**
 * Emits 说明：组件向外派发的事件，用于页面监听交互结果或同步受控值。
 * - click: 点击组件时触发，用于响应用户主动操作。
 * - close: 组件关闭或收起时触发。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

const bgColor = computed(() => {
  return props.bgColor
})
const closeClicking = ref(false)

const contentText = computed(() => {
  return String(props.text)
})

const normalizedType = computed(() => {
  if (props.type == 'danger') return 'error'
  if (props.type == 'warn') return 'warning'
  return props.type
})

const normalizedSkin = computed(() => {
  if (props.plain) return 'outlined'
  if (props.skin == 'outline') return 'outlined'
  if (props.skin == 'light') return 'thin'
  if (props.skin == 'plain') return 'outlined'
  return props.skin
})

const themeColor = computed(() => {
  if (props.color.length > 0) return props.color
  if (normalizedType.value == 'primary') return '#3c9cff'
  if (normalizedType.value == 'success') return '#5ac725'
  if (normalizedType.value == 'warning') return '#f9ae3d'
  if (normalizedType.value == 'error') return '#f56c6c'
  if (normalizedType.value == 'info') return '#909399'
  return '#303133'
})

const computedTextColor = computed(() => {
  if (props.fontColor.length > 0) return props.fontColor
  if (props.color.length > 0 && normalizedSkin.value == 'normal') return '#ffffff'
  if (normalizedSkin.value == 'normal' && bgColor.value.length == 0 && props.linear.length == 0) {
    return '#ffffff'
  }
  return themeColor.value
})

const computedIconSize = computed(() => {
  if (String(props.iconSize).length > 0) return props.iconSize
  if (String(props.fontSize).length > 0) return props.fontSize
  if (props.size == 'xs' || props.size == 'mini') return 11
  if (props.size == 's' || props.size == 'small') return 12
  if (props.size == 'g' || props.size == 'large') return 15
  return 13
})

const closeText = computed(() => {
  if (props.closeIcon == 'close' || props.closeIcon == 'close-line') return 'x'
  return props.closeIcon
})

const tagClass = computed(() => {
  const classes = [
    'i-tag',
    'i-tag--' + normalizedType.value,
    'i-tag--' + normalizedSize.value,
    'i-tag--' + normalizedSkin.value,
  ]
  classes.push('i-tag--' + normalizedSkin.value + '-' + normalizedType.value)
  if (isRound.value) classes.push('i-tag--round')
  if (props.disabled) classes.push('i-tag--disabled')
  return classes.join(' ')
})

const textClass = computed(() => {
  const classes = ['i-tag__text']
  if (normalizedSize.value == 'xs') classes.push('i-tag__text--xs')
  if (normalizedSize.value == 'large') classes.push('i-tag__text--large')
  return classes.join(' ')
})

const closeClass = computed(() => {
  const classes = ['i-tag__close']
  if (normalizedSize.value == 'xs') classes.push('i-tag__close--xs')
  return classes.join(' ')
})

const tagStyle = computed(() => {
  let style = ''
  if (String(props.width).length > 0) style = style + 'width:' + formatSize(props.width) + ';'
  if (String(props.height).length > 0) style = style + 'height:' + formatSize(props.height) + ';'
  if (props.borderWidth != 1) style = style + 'border-width:' + formatSize(props.borderWidth) + ';'
  if (isCustomRound.value) style = style + 'border-radius:' + formatSize(props.round) + ';'
  if (props.linear.length >= 3) {
    style =
      style +
      'background:linear-gradient(' +
      String(props.linear[0]) +
      ',' +
      String(props.linear[1]) +
      ',' +
      String(props.linear[2]) +
      ');border-color:transparent;'
  } else if (bgColor.value.length > 0) {
    style = style + 'background-color:' + bgColor.value + ';'
    if (normalizedSkin.value == 'normal' && props.borderColor.length == 0) {
      style = style + 'border-color:' + bgColor.value + ';'
    }
  }
  if (props.borderColor.length > 0) style = style + 'border-color:' + props.borderColor + ';'
  if (shadowStyle.value.length > 0) style = style + shadowStyle.value
  if (props.customStyle.length > 0) style = style + props.customStyle
  return style
})

const textStyle = computed(() => {
  let style = 'color:' + computedTextColor.value + ';'
  if (String(props.fontSize).length > 0) {
    style = style + 'font-size:' + formatSize(props.fontSize) + ';'
  }
  return style
})

const closeStyle = computed(() => {
  return 'color:' + computedTextColor.value + ';'
})

const normalizedSize = computed(() => {
  if (props.size == 'xs' || props.size == 'mini') return 'xs'
  if (props.size == 's' || props.size == 'small') return 'small'
  if (props.size == 'm' || props.size == 'normal' || props.size == 'n') return 'normal'
  if (props.size == 'g' || props.size == 'large') return 'large'
  return props.size
})

const isCustomRound = computed(() => {
  if (typeof props.round == 'boolean') return false
  return String(props.round).length > 0
})

const isRound = computed(() => {
  if (typeof props.round == 'boolean') return props.round
  return String(props.round).length > 0
})

const shadowStyle = computed(() => {
  const value = props.shadow
  const text = String(value)
  if (text.length == 0 || text == 'none') return ''
  if (Array.isArray(value) && value.length >= 4) {
    return (
      'box-shadow:' +
      formatSize(value[0]) +
      ' ' +
      formatSize(value[1]) +
      ' ' +
      formatSize(value[2]) +
      ' ' +
      String(value[3]) +
      ';'
    )
  }
  return 'box-shadow:0 ' + formatSize(value) + ' ' + formatSize(Number(value) * 2) + ' rgba(0,0,0,0.12);'
})

function handleClick() {
  if (closeClicking.value) {
    closeClicking.value = false
    return
  }
  if (props.disabled) return
  emit('click', contentText.value)
}

function handleClose() {
  if (props.disabled) return
  closeClicking.value = true
  emit('close', contentText.value)
  setTimeout(() => {
    closeClicking.value = false
  }, 0)
}

function formatSize(value): string {
  const text = String(value)
  if (
    text.indexOf('px') >= 0 ||
    text.indexOf('rpx') >= 0 ||
    text.indexOf('rem') >= 0 ||
    text.indexOf('%') >= 0
  ) {
    return text
  }
  return text + 'px'
}

return (): any | null => {

const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)

  return _cE("view", _uM({
    class: _nC(tagClass.value),
    style: _nS(tagStyle.value),
    onClick: withModifiers(handleClick, ["stop"])
  }), [
    _ctx.icon.length > 0
      ? _cV(_component_i_icon, _uM({
          key: 0,
          class: "i-tag__icon",
          name: _ctx.icon,
          fontSize: computedIconSize.value,
          color: computedTextColor.value
        }), null, 8 /* PROPS */, ["name", "fontSize", "color"])
      : _cC("v-if", true),
    contentText.value.length > 0
      ? _cE("text", _uM({
          key: 1,
          class: _nC(textClass.value),
          style: _nS(textStyle.value)
        }), _tD(contentText.value), 7 /* TEXT, CLASS, STYLE */)
      : _cE("text", _uM({
          key: 2,
          class: _nC(textClass.value),
          style: _nS(textStyle.value)
        }), [
          renderSlot(_ctx.$slots, "default")
        ], 6 /* CLASS, STYLE */),
    isTrue(_ctx.closable)
      ? _cE("text", _uM({
          key: 3,
          class: _nC(closeClass.value),
          style: _nS(closeStyle.value),
          onClick: handleClose
        }), _tD(closeText.value), 7 /* TEXT, CLASS, STYLE */)
      : _cC("v-if", true)
  ], 6 /* CLASS, STYLE */)
}
}

})
export default __sfc__
export type ITagComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsITagITagStyles = [_uM([["i-tag", _pS(_uM([["height", 28], ["paddingTop", 0], ["paddingRight", 10], ["paddingBottom", 0], ["paddingLeft", 10], ["borderTopLeftRadius", 4], ["borderTopRightRadius", 4], ["borderBottomRightRadius", 4], ["borderBottomLeftRadius", 4], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "rgba(0,0,0,0)"], ["borderRightColor", "rgba(0,0,0,0)"], ["borderBottomColor", "rgba(0,0,0,0)"], ["borderLeftColor", "rgba(0,0,0,0)"], ["alignItems", "center"], ["justifyContent", "center"], ["flexDirection", "row"], ["backgroundColor", "#3c9cff"], ["overflow", "hidden"]]))], ["i-tag--round", _pS(_uM([["borderTopLeftRadius", 999], ["borderTopRightRadius", 999], ["borderBottomRightRadius", 999], ["borderBottomLeftRadius", 999]]))], ["i-tag--xs", _pS(_uM([["height", 20], ["paddingTop", 0], ["paddingRight", 7], ["paddingBottom", 0], ["paddingLeft", 7]]))], ["i-tag--small", _pS(_uM([["height", 22], ["paddingTop", 0], ["paddingRight", 8], ["paddingBottom", 0], ["paddingLeft", 8]]))], ["i-tag--large", _pS(_uM([["height", 34], ["paddingTop", 0], ["paddingRight", 12], ["paddingBottom", 0], ["paddingLeft", 12]]))], ["i-tag--disabled", _pS(_uM([["opacity", 0.5]]))], ["i-tag--primary", _pS(_uM([["backgroundColor", "#3c9cff"], ["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["i-tag--success", _pS(_uM([["backgroundColor", "#5ac725"], ["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"]]))], ["i-tag--warning", _pS(_uM([["backgroundColor", "#f9ae3d"], ["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"]]))], ["i-tag--error", _pS(_uM([["backgroundColor", "#f56c6c"], ["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"]]))], ["i-tag--info", _pS(_uM([["backgroundColor", "#909399"], ["borderTopColor", "#909399"], ["borderRightColor", "#909399"], ["borderBottomColor", "#909399"], ["borderLeftColor", "#909399"]]))], ["i-tag--thin", _pS(_uM([["backgroundColor", "#ecf5ff"], ["borderTopColor", "#ecf5ff"], ["borderRightColor", "#ecf5ff"], ["borderBottomColor", "#ecf5ff"], ["borderLeftColor", "#ecf5ff"]]))], ["i-tag--thin-success", _pS(_uM([["backgroundColor", "#f0f9eb"], ["borderTopColor", "#f0f9eb"], ["borderRightColor", "#f0f9eb"], ["borderBottomColor", "#f0f9eb"], ["borderLeftColor", "#f0f9eb"]]))], ["i-tag--thin-warning", _pS(_uM([["backgroundColor", "#fdf6ec"], ["borderTopColor", "#fdf6ec"], ["borderRightColor", "#fdf6ec"], ["borderBottomColor", "#fdf6ec"], ["borderLeftColor", "#fdf6ec"]]))], ["i-tag--thin-error", _pS(_uM([["backgroundColor", "#fef0f0"], ["borderTopColor", "#fef0f0"], ["borderRightColor", "#fef0f0"], ["borderBottomColor", "#fef0f0"], ["borderLeftColor", "#fef0f0"]]))], ["i-tag--thin-info", _pS(_uM([["backgroundColor", "#f4f4f5"], ["borderTopColor", "#f4f4f5"], ["borderRightColor", "#f4f4f5"], ["borderBottomColor", "#f4f4f5"], ["borderLeftColor", "#f4f4f5"]]))], ["i-tag--outlined", _pS(_uM([["backgroundColor", "#ffffff"]]))], ["i-tag--dashed", _pS(_uM([["backgroundColor", "#ffffff"], ["borderTopStyle", "dashed"], ["borderRightStyle", "dashed"], ["borderBottomStyle", "dashed"], ["borderLeftStyle", "dashed"]]))], ["i-tag--text", _pS(_uM([["backgroundColor", "#ffffff"], ["borderTopColor", "rgba(0,0,0,0)"], ["borderRightColor", "rgba(0,0,0,0)"], ["borderBottomColor", "rgba(0,0,0,0)"], ["borderLeftColor", "rgba(0,0,0,0)"]]))], ["i-tag--outlined-primary", _pS(_uM([["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["i-tag--dashed-primary", _pS(_uM([["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["i-tag--outlined-success", _pS(_uM([["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"]]))], ["i-tag--dashed-success", _pS(_uM([["borderTopColor", "#5ac725"], ["borderRightColor", "#5ac725"], ["borderBottomColor", "#5ac725"], ["borderLeftColor", "#5ac725"]]))], ["i-tag--outlined-warning", _pS(_uM([["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"]]))], ["i-tag--dashed-warning", _pS(_uM([["borderTopColor", "#f9ae3d"], ["borderRightColor", "#f9ae3d"], ["borderBottomColor", "#f9ae3d"], ["borderLeftColor", "#f9ae3d"]]))], ["i-tag--outlined-error", _pS(_uM([["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"]]))], ["i-tag--dashed-error", _pS(_uM([["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"]]))], ["i-tag--outlined-info", _pS(_uM([["borderTopColor", "#909399"], ["borderRightColor", "#909399"], ["borderBottomColor", "#909399"], ["borderLeftColor", "#909399"]]))], ["i-tag--dashed-info", _pS(_uM([["borderTopColor", "#909399"], ["borderRightColor", "#909399"], ["borderBottomColor", "#909399"], ["borderLeftColor", "#909399"]]))], ["i-tag__text", _pS(_uM([["color", "#ffffff"], ["fontSize", 12], ["lineHeight", "18px"]]))], ["i-tag__text--xs", _pS(_uM([["fontSize", 11], ["lineHeight", "16px"]]))], ["i-tag__text--large", _pS(_uM([["fontSize", 14], ["lineHeight", "20px"]]))], ["i-tag__icon", _pS(_uM([["marginRight", 4]]))], ["i-tag__close", _pS(_uM([["marginLeft", 5], ["color", "#ffffff"], ["fontSize", 14], ["lineHeight", "18px"]]))], ["i-tag__close--xs", _pS(_uM([["fontSize", 12], ["lineHeight", "16px"]]))]])]
