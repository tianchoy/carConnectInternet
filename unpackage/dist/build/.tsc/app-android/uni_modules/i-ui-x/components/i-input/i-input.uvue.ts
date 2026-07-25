import { computed, ref } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-input',
name: 'i-input',
  props: {
  modelValue: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  height: {
    type: String,
    default: '40px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledColor: {
    type: String,
    default: '#f5f7fa',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  password: {
    type: Boolean,
    default: false,
  },
  showPasswordToggle: {
    type: Boolean,
    default: true,
  },
  maxlength: {
    type: Number,
    default: -1,
  },
  placeholder: {
    type: String,
    default: '',
  },
  placeholderClass: {
    type: String,
    default: 'input-placeholder',
  },
  placeholderStyle: {
    type: String,
    default: '',
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  confirmType: {
    type: String,
    default: 'done',
  },
  confirmHold: {
    type: Boolean,
    default: false,
  },
  focus: {
    type: Boolean,
    default: false,
  },
  cursor: {
    type: Number,
    default: -1,
  },
  cursorSpacing: {
    type: Number,
    default: 30,
  },
  selectionStart: {
    type: Number,
    default: -1,
  },
  selectionEnd: {
    type: Number,
    default: -1,
  },
  adjustPosition: {
    type: Boolean,
    default: true,
  },
  inputAlign: {
    type: String,
    default: 'left',
  },
  fontSize: {
    type: String,
    default: '15px',
  },
  color: {
    type: String,
    default: '#303133',
  },
  prefiicon: {
    type: String,
    default: '',
  },
  prefiiconStyle: {
    type: String,
    default: '',
  },
  suffiicon: {
    type: String,
    default: '',
  },
  suffiiconStyle: {
    type: String,
    default: '',
  },
  border: {
    type: String,
    default: 'surround',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  shape: {
    type: String,
    default: 'square',
  },
  customStyle: {
    type: String,
    default: '',
  },
  round: {
    type: String,
    default: '4px',
  },
  borderColor: {
    type: String,
    default: '#e5e5e5',
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
  inputmode: {
    type: String,
    default: 'text',
  },
  prefix: {
    type: String,
    default: '',
  },
},
  emits: [
  'update:modelValue',
  'update:value',
  'input',
  'change',
  'focus',
  'blur',
  'confirm',
  'keyboardheightchange',
  'clear',
],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：依据 DCloud uni-app x 官方规范 Input，封装 UniAppX 原生 input。
 * - modelValue/value: 输入值，支持 v-model 和旧版 value。
 * - type/inputmode: 输入类型。
 * - height: 输入框高度。
 * - disabled/readonly: 禁用和只读；只读不会置灰，但会阻止同步修改。
 * - disabledColor: 禁用背景色。
 * - clearable: 是否显示清除控件。
 * - password/showPasswordToggle: 密码模式和密码显隐切换。
 * - maxlength: 最大输入长度，-1 为不限制。
 * - placeholder/placeholderClass/placeholderStyle: 占位内容和样式。
 * - showWordLimit: 是否显示字数统计。
 * - confirmType/confirmHold/focus/cursor/cursorSpacing/selectionStart/selectionEnd/adjustPosition: 原生 input 行为透传。
 * - inputAlign/fontSize/color: 输入文本样式。
 * - prefiicon/suffiicon: 前后图标文本，也可用 prefix/suffix slot 自定义。
 * - border/shape/round/borderColor/bgColor/customStyle: 外观样式。
 * - formatter: UniAppX 小程序端不传函数，保留 setFormatter 方法入口。
 */
const props = __props

/**
 * Emits 说明：输入框状态和内容变化。
 * - update:modelValue/update:value: 同步输入值。
 * - input/change: 内容变化时触发。
 * - focus/blur/confirm/keyboardheightchange: 原生事件透传。
 * - clear: 点击清空控件时触发。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function initialValue(): string {
  const modelValue = props.modelValue as string
  if (modelValue.length > 0) return modelValue
  return props.value as string
}

function formatSize(value: string): string {
  if (value.indexOf('px') >= 0 || value.indexOf('rpx') >= 0 || value.indexOf('%') >= 0) {
    return value
  }
  return value + 'px'
}

const inputBgColor = computed(() => {
  return props.bgColor
})
const current = ref(initialValue())
const focused = ref(false)
const passwordVisible = ref(props.password)

const wrapClass = computed(() => {
  const classes = ['i-input']
  if (props.disabled) classes.push('i-input--disabled')
  if (focused.value && !props.disabled) classes.push('i-input--focus')
  if (props.shape == 'circle') classes.push('i-input--circle')
  return classes.join(' ')
})

const wrapStyle = computed(() => {
  let style =
    'min-height:' +
    formatSize(props.height) +
    ';background-color:' +
    (props.disabled ? props.disabledColor : inputBgColor.value) +
    ';border-radius:' +
    (props.shape == 'circle' ? formatSize(props.height) : props.round) +
    ';'
  if (props.border == 'surround') {
    style +=
      'border-width:1px;border-style:solid;border-color:' +
      props.borderColor +
      ';'
  }
  if (props.border == 'bottom') {
    style +=
      'border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:' +
      props.borderColor +
      ';'
  }
  return style + props.customStyle
})

const fieldStyle = computed(() => {
  return (
    'height:' +
    formatSize(props.height) +
    ';color:' +
    props.color +
    ';font-size:' +
    formatSize(props.fontSize) +
    ';text-align:' +
    props.inputAlign +
    ';'
  )
})

const placeholderStyleText = computed(() => {
  if (props.placeholderStyle.length > 0) return props.placeholderStyle
  return 'color:#c0c4cc;'
})

function emitValue(value: string) {
  emit('update:modelValue', value)
  emit('update:value', value)
  emit('input', value)
  emit('change', value)
}

function handleInput(event: UniInputEvent) {
  const nextValue = event.detail.value
  if (props.readonly) {
    current.value = initialValue()
    return
  }
  current.value = nextValue
  emitValue(nextValue)
}

function handleFocus(event: UniInputFocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: UniInputBlurEvent) {
  focused.value = false
  emit('blur', event)
}

function handleConfirm(event: UniInputConfirmEvent) {
  emit('confirm', event.detail.value)
}

function handleKeyboardHeightChange(event: UniInputKeyboardHeightChangeEvent) {
  emit('keyboardheightchange', event)
}

function clear() {
  current.value = ''
  emitValue('')
  emit('clear')
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
}

__expose({
  setFormatter() {
    // 小程序端不支持函数 props，保留方法名用于兼容 组件 API。
  },
})

return (): any | null => {

  return _cE("view", _uM({
    class: _nC(wrapClass.value),
    style: _nS(wrapStyle.value)
  }), [
    renderSlot(_ctx.$slots, "prefix", {}, (): any[] => [
      isTrue(_ctx.prefiicon.length > 0 || _ctx.prefix.length > 0)
        ? _cE("text", _uM({
            key: 0,
            class: "i-input__prefix",
            style: _nS(_ctx.prefiiconStyle)
          }), _tD(_ctx.prefix.length > 0 ? _ctx.prefix : _ctx.prefiicon), 5 /* TEXT, STYLE */)
        : _cC("v-if", true)
    ]),
    _cE("input", _uM({
      class: "i-input__field",
      style: _nS(fieldStyle.value),
      type: _ctx.type,
      value: current.value,
      placeholder: _ctx.placeholder,
      "placeholder-class": _ctx.placeholderClass,
      "placeholder-style": placeholderStyleText.value,
      password: passwordVisible.value,
      disabled: _ctx.disabled,
      maxlength: _ctx.maxlength,
      "confirm-type": _ctx.confirmType,
      "confirm-hold": _ctx.confirmHold,
      inputmode: _ctx.inputmode,
      focus: _ctx.focus,
      cursor: _ctx.cursor,
      "cursor-spacing": _ctx.cursorSpacing,
      "selection-start": _ctx.selectionStart,
      "selection-end": _ctx.selectionEnd,
      "adjust-position": _ctx.adjustPosition,
      onInput: handleInput,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onConfirm: handleConfirm,
      onKeyboardheightchange: handleKeyboardHeightChange
    }), null, 44 /* STYLE, PROPS, NEED_HYDRATION */, ["type", "value", "placeholder", "placeholder-class", "placeholder-style", "password", "disabled", "maxlength", "confirm-type", "confirm-hold", "inputmode", "focus", "cursor", "cursor-spacing", "selection-start", "selection-end", "adjust-position"]),
    isTrue(_ctx.showWordLimit)
      ? _cE("text", _uM({
          key: 0,
          class: "i-input__count"
        }), _tD(current.value.length) + "/" + _tD(_ctx.maxlength), 1 /* TEXT */)
      : _cC("v-if", true),
    isTrue(_ctx.clearable && current.value.length > 0 && !_ctx.disabled && !_ctx.readonly)
      ? _cE("text", _uM({
          key: 1,
          class: "i-input__clear",
          onClick: clear
        }), " × ")
      : _cC("v-if", true),
    isTrue(_ctx.password && _ctx.showPasswordToggle)
      ? _cE("text", _uM({
          key: 2,
          class: "i-input__eye",
          onClick: togglePassword
        }), _tD(passwordVisible.value ? "show" : "hide"), 1 /* TEXT */)
      : _cC("v-if", true),
    renderSlot(_ctx.$slots, "suffix", {}, (): any[] => [
      _ctx.suffiicon.length > 0
        ? _cE("text", _uM({
            key: 0,
            class: "i-input__suffix",
            style: _nS(_ctx.suffiiconStyle)
          }), _tD(_ctx.suffiicon), 5 /* TEXT, STYLE */)
        : _cC("v-if", true)
    ])
  ], 6 /* CLASS, STYLE */)
}
}

})
export default __sfc__
export type IInputComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIInputIInputStyles = [_uM([["i-input", _pS(_uM([["paddingTop", 0], ["paddingRight", 12], ["paddingBottom", 0], ["paddingLeft", 12], ["flexDirection", "row"], ["alignItems", "center"]]))], ["i-input--disabled", _pS(_uM([["opacity", 0.76]]))], ["i-input--focus", _pS(_uM([["borderTopColor", "#3c9cff"], ["borderRightColor", "#3c9cff"], ["borderBottomColor", "#3c9cff"], ["borderLeftColor", "#3c9cff"]]))], ["i-input__prefix", _pS(_uM([["color", "#606266"], ["fontSize", 14], ["lineHeight", "22px"], ["marginRight", 8]]))], ["i-input__suffix", _pS(_uM([["color", "#606266"], ["fontSize", 14], ["lineHeight", "22px"], ["marginLeft", 8]]))], ["i-input__clear", _pS(_uM([["marginLeft", 8], ["color", "#c0c4cc"], ["fontSize", 16], ["lineHeight", "22px"]]))], ["i-input__eye", _pS(_uM([["marginLeft", 8], ["color", "#c0c4cc"], ["fontSize", 16], ["lineHeight", "22px"]]))], ["i-input__count", _pS(_uM([["marginLeft", 8], ["color", "#c0c4cc"], ["fontSize", 12], ["lineHeight", "18px"]]))], ["i-input__field", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minWidth", 0]]))]])]
