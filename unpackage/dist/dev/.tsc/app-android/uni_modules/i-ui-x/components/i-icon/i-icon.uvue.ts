import { computed, onMounted, onUnmounted, ref, watch } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-icon',
name: 'i-icon',
  props: {
  name: {
    type: String,
    default: 'home-3-fill',
  },
  fontSize: {
    type: [String, Number],
    default: '16',
  },
  fontFamily: {
    type: String,
    default: 'remixicon',
  },
  code: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'black',
  },
  darkColor: {
    type: String,
    default: '',
  },
  spin: {
    type: Boolean,
    default: false,
  },
  rotation: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 1500,
  },
  type: {
    type: String,
    default: '',
  },
  size: {
    type: [String, Number],
    default: '',
  },
  plain: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  customStyle: {
    type: String,
    default: '',
  },
},
  emits: ['click'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



const props = __props

function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

const spinAngle = ref(0)
let spinTimer = 0

const iconBgColor = computed(() => {
  return props.bgColor
})
const remixCodeMap = new Map<string, string>([
  ['home-3-fill', 'ee1a'],
  ['chat-3-line', 'eb51'],
  ['chat-3-fill', 'eb50'],
  ['contrast-drop-2-fill', 'ebd5'],
  ['circle-line', 'f3c2'],
  ['smartphone-line', 'f15a'],
  ['git-repository-private-fill', 'edc8'],
  ['mouse-fill', 'ef7c'],
  ['arrow-up-line', 'ea76'],
  ['information-line', 'ee59'],
  ['gps-line', 'eddb'],
  ['headphone-line', 'ee05'],
  ['rocket-fill', 'f095'],
  ['mic-2-line', 'ef4e'],
  ['image-circle-line', 'f413'],
  ['plane-line', 'f005'],
  ['loader-line', 'eeca'],
  ['refresh-line', 'f064'],
  ['check-line', 'eb7b'],
  ['close-line', 'eb99'],
  ['add-line', 'ea13'],
  ['subtract-line', 'f1af'],
  ['search-line', 'f0d1'],
  ['star-fill', 'f186'],
  ['map-pin-line', 'ef14'],
  ['error-warning-line', 'eca1'],
  ['arrow-right-line', 'ea6c'],
  ['arrow-left-line', 'ea60'],
])

const legacyNameMap = new Map<string, string>([
  ['check', 'check-line'],
  ['close', 'close-line'],
  ['plus', 'add-line'],
  ['minus', 'subtract-line'],
  ['search', 'search-line'],
  ['star', 'star-fill'],
  ['map', 'map-pin-line'],
  ['warning', 'error-warning-line'],
  ['arrow-right', 'arrow-right-line'],
  ['arrow-left', 'arrow-left-line'],
])

const legacyGlyphMap = new Map<string, string>([
  ['check', '✓'],
  ['close', 'x'],
  ['plus', '+'],
  ['minus', '-'],
  ['search', '⌕'],
  ['star', '★'],
  ['map', '⌖'],
  ['warning', '!'],
  ['arrow-right', '>'],
  ['arrow-left', '<'],
])

const normalizedName = computed(() => {
  const value = props.name
  if (legacyNameMap.has(value)) return legacyNameMap.get(value) as string
  if (value.indexOf('ri-') == 0) return value.substring(3)
  return value
})

const isImage = computed(() => {
  const value = props.name
  return (
    value.indexOf('http://') == 0 ||
    value.indexOf('https://') == 0 ||
    value.indexOf('/') == 0 ||
    value.indexOf('./') == 0 ||
    value.indexOf('../') == 0 ||
    value.indexOf('@/') == 0
  )
})

const iconCode = computed(() => {
  if (props.code.length > 0) return props.code
  const value = normalizedName.value
  if (remixCodeMap.has(value)) return remixCodeMap.get(value) as string
  return ''
})

const iconText = computed(() => {
  const code = iconCode.value
  if (code.length > 0) return String.fromCharCode(parseInt(code, 16))
  if (legacyGlyphMap.has(props.name)) return legacyGlyphMap.get(props.name) as string
  return props.name
})

const normalizedSize = computed(() => {
  const value = String(props.size)
  if (value == 'mini' || value == 'normal' || value == 'large') return value
  if (value.length > 0) return 'custom'
  return ''
})

const hasBadge = computed(() => {
  return props.type.length > 0 || iconBgColor.value.length > 0 || props.plain
})

const iconClass = computed(() => {
  const classes = ['i-icon']
  if (hasBadge.value) {
    classes.push('i-icon--badge')
    if (props.type.length > 0) classes.push('i-icon--' + props.type)
    if (normalizedSize.value.length > 0) classes.push('i-icon--' + normalizedSize.value)
    if (props.plain) classes.push('i-icon--plain')
  }
  return classes.join(' ')
})

const textClass = computed(() => {
  const classes = ['i-icon__text']
  if (props.spin) classes.push('i-icon__text--spin')
  if (hasBadge.value) classes.push('i-icon__text--badge')
  if (hasBadge.value && props.plain && props.type.length > 0) {
    classes.push('i-icon__text--' + props.type)
  }
  return classes.join(' ')
})

const imageClass = computed(() => {
  const classes = ['i-icon__image']
  if (props.spin) classes.push('i-icon__image--spin')
  return classes.join(' ')
})

const resolvedFontSize = computed(() => {
  const value = String(props.size)
  if (value == 'mini') return '14px'
  if (value == 'normal') return '17px'
  if (value == 'large') return '22px'
  if (value.length > 0) return formatSize(value)
  return formatSize(props.fontSize)
})

const badgeSize = computed(() => {
  const value = String(props.size)
  if (value == 'mini') return '26px'
  if (value == 'normal') return '34px'
  if (value == 'large') return '44px'
  if (value.length > 0) return formatSize(value)
  const numberSize = Number(props.fontSize)
  if (isNaN(numberSize)) return formatSize(props.fontSize)
  return formatSize(numberSize + 18)
})

const wrapStyle = computed(() => {
  let style = props.customStyle
  if (hasBadge.value) {
    const size = badgeSize.value
    style = style + 'width:' + size + ';height:' + size + ';border-radius:' + size + ';'
  }
  if (iconBgColor.value.length > 0) {
    style = style + 'background-color:' + iconBgColor.value + ';'
  }
  return style
})

const imageStyle = computed(() => {
  const size = resolvedFontSize.value
  let style = 'width:' + size + ';height:' + size + ';'
  const angle = activeRotation.value
  if (angle != 0) style = style + 'transform:rotate(' + String(angle) + 'deg);'
  return style
})

const textStyle = computed(() => {
  let style = 'font-size:' + resolvedFontSize.value + ';'
  if (props.fontFamily.length > 0 && iconCode.value.length > 0) {
    style = style + 'font-family:' + props.fontFamily + ';'
  }
  let color = props.color
  if (hasBadge.value && props.color == 'black') {
    color = props.plain ? iconTypeColor() : '#ffffff'
  }
  if (color.length > 0) style = style + 'color:' + color + ';'
  const angle = activeRotation.value
  if (angle != 0) style = style + 'transform:rotate(' + String(angle) + 'deg);'
  return style
})

const activeRotation = computed(() => {
  return normalizeAngle(props.rotation + spinAngle.value)
})

watch(
  () => props.spin,
  (nextValue) => {
    if (nextValue) {
      startSpin()
    } else {
      stopSpin()
    }
  },
)

watch(
  () => props.duration,
  () => {
    if (props.spin) {
      stopSpin()
      startSpin()
    }
  },
)

onMounted(() => {
  if (props.spin) startSpin()
})

onUnmounted(() => {
  stopSpin()
})

function startSpin() {
  if (spinTimer > 0) return
  spinTimer = setInterval(() => {
    const duration = Math.max(120, Number(props.duration))
    const step = Math.max(6, Math.round(360 * 50 / duration))
    spinAngle.value = normalizeAngle(spinAngle.value + step)
  }, 50)
}

function stopSpin() {
  if (spinTimer > 0) {
    clearInterval(spinTimer)
    spinTimer = 0
  }
  spinAngle.value = 0
}

function normalizeAngle(value: number): number {
  let angle = value % 360
  if (angle < 0) angle = angle + 360
  return angle
}

function iconTypeColor(): string {
  if (props.type == 'primary') return '#2979ff'
  if (props.type == 'success') return '#19be6b'
  if (props.type == 'warning') return '#ff9900'
  if (props.type == 'danger') return '#fa3534'
  return '#303133'
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

function handleClick() {
  emit('click', {
    name: props.name,
    code: iconCode.value,
    label: props.label,
  })
}

return (): any | null => {

  return _cE("view", _uM({
    class: _nC(iconClass.value),
    style: _nS(wrapStyle.value),
    onClick: handleClick
  }), [
    isTrue(isImage.value)
      ? _cE("image", _uM({
          key: 0,
          class: _nC(imageClass.value),
          src: props.name,
          style: _nS(imageStyle.value),
          mode: "aspectFit"
        }), null, 14 /* CLASS, STYLE, PROPS */, ["src"])
      : _cE("text", _uM({
          key: 1,
          class: _nC(textClass.value),
          style: _nS(textStyle.value)
        }), _tD(iconText.value), 7 /* TEXT, CLASS, STYLE */)
  ], 6 /* CLASS, STYLE */)
}
}

})
export default __sfc__
export type IIconComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIIconIIconStyles = [_uM([["i-icon", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-icon--badge", _pS(_uM([["width", 34], ["height", 34], ["borderTopLeftRadius", 34], ["borderTopRightRadius", 34], ["borderBottomRightRadius", 34], ["borderBottomLeftRadius", 34]]))], ["i-icon--mini", _pS(_uM([["width", 26], ["height", 26], ["borderTopLeftRadius", 26], ["borderTopRightRadius", 26], ["borderBottomRightRadius", 26], ["borderBottomLeftRadius", 26]]))], ["i-icon--large", _pS(_uM([["width", 44], ["height", 44], ["borderTopLeftRadius", 44], ["borderTopRightRadius", 44], ["borderBottomRightRadius", 44], ["borderBottomLeftRadius", 44]]))], ["i-icon--primary", _pS(_uM([["backgroundColor", "#2979ff"]]))], ["i-icon--success", _pS(_uM([["backgroundColor", "#19be6b"]]))], ["i-icon--warning", _pS(_uM([["backgroundColor", "#ff9900"]]))], ["i-icon--danger", _pS(_uM([["backgroundColor", "#fa3534"]]))], ["i-icon--plain", _pS(_uM([["backgroundColor", "#ffffff"], ["borderTopColor", "#dcdfe6"], ["borderRightColor", "#dcdfe6"], ["borderBottomColor", "#dcdfe6"], ["borderLeftColor", "#dcdfe6"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1]]))], ["i-icon__text", _pS(_uM([["color", "#303133"], ["fontSize", 16], ["lineHeight", 1]]))], ["i-icon__text--badge", _pS(_uM([["color", "#ffffff"], ["fontWeight", 700]]))], ["i-icon__text--primary", _pS(_uM([["color", "#2979ff"]]))], ["i-icon__text--success", _pS(_uM([["color", "#19be6b"]]))], ["i-icon__text--warning", _pS(_uM([["color", "#ff9900"]]))], ["i-icon__text--danger", _pS(_uM([["color", "#fa3534"]]))], ["i-icon__image", _pS(_uM([["width", 16], ["height", 16]]))], ["@FONT-FACE", _uM([["0", _uM([["fontFamily", "remixicon"], ["src", "url(\"/uni_modules/i-ui-x/static/remixicon.woff2\") format(\"woff2\"),\n    url(\"https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.ttf\")\n      format(\"truetype\")"]])]])]])]
