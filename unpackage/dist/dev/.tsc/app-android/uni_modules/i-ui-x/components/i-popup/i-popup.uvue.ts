import { computed, ref, watch } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-popup',
name: 'i-popup',
  props: {
  show: { type: Boolean, default: false },
  overlay: { type: Boolean, default: true },
  mode: { type: String, default: 'bottom' },
  position: { type: String, default: '' },
  title: { type: String, default: '' },
  showTitle: { type: Boolean, default: true },
  showClose: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: true },
  cancelText: { type: String, default: '' },
  confirmText: { type: String, default: '' },
  titleStyle: { type: [String, Object], default: '' },
  duration: { type: [String, Number], default: 300 },
  closeable: { type: Boolean, default: false },
  overlayStyle: { type: [String, Object], default: '' },
  overlayOpacity: { type: [String, Number], default: 0.5 },
  closeOnMask: { type: Boolean, default: true },
  overlayClick: { type: Boolean, default: true },
  overflayBgColor: { type: String, default: '' },
  zIndex: { type: [String, Number], default: 10075 },
  safeBottom: { type: Boolean, default: true },
  safeTop: { type: Boolean, default: false },
  closeIcon: { type: String, default: 'close' },
  closeIconColor: { type: String, default: '#909399' },
  closeIconSize: { type: [String, Number], default: 18 },
  closeIconPos: { type: String, default: 'top-right' },
  margin: { type: [String, Number], default: 0 },
  navbarHeight: { type: Number, default: 0 },
  round: { type: [String, Number], default: 16 },
  zoom: { type: Boolean, default: true },
  bgColor: { type: String, default: '#ffffff' },
  size: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  customStyle: { type: [String, Object], default: '' },
  customWrapStyle: { type: [String, Object], default: '' },
  customFooterStyle: { type: [String, Object], default: '' },
  contentMargin: { type: [String, Number], default: 16 },
  widthCoverCenter: { type: Boolean, default: false },
  offsetTop: { type: [String, Number], default: '0' },
  offsetBottom: { type: [String, Number], default: '0' },
  lazy: { type: Boolean, default: false },
  disabledScroll: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  disabledConfirm: { type: Boolean, default: false },
  btnColor: { type: String, default: '' },
  swipeClose: { type: Boolean, default: false },
  swipeHandle: { type: Boolean, default: true },
  contentDraggable: { type: Boolean, default: true },
  swipeCloseThreshold: { type: [String, Number], default: 50 },
},
  emits: [
  'click',
  'open',
  'close',
  'beforeOpen',
  'beforeClose',
  'cancel',
  'confirm',
  'update:show',
],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：依据 DCloud uni-app x drawer，同时兼容原 i-popup/DCloud uni-app x Popup 用法。
 * - show: 是否展示弹窗，通常由外部通过 update:show 同步控制。
 * - overlay: 是否显示遮罩层。
 * - mode: 弹出方向，可取 left / top / right / bottom / center。
 * - position: drawer 风格打开方向；传入后优先于 mode。
 * - title: 弹窗标题；也可以通过 header 插槽完全自定义。
 * - showTitle: 是否显示标题区域。
 * - showClose: 是否显示 drawer 风格关闭按钮。
 * - showFooter: 是否显示底部操作栏。
 * - showCancel: footer 中是否显示取消按钮。
 * - cancelText: 取消按钮文案。
 * - confirmText: 确认按钮文案。
 * - titleStyle: 标题自定义样式，支持字符串样式。
 * - duration: 动画时长，单位 ms；当前用于过渡时长样式。
 * - closeable: 是否显示关闭图标。
 * - overlayStyle: 遮罩自定义样式，支持字符串样式。
 * - overlayOpacity: 遮罩透明度，取值 0 到 1。
 * - closeOnMask: 点击遮罩是否关闭弹窗。
 * - overlayClick: drawer 风格遮罩点击关闭开关，优先级高于 closeOnMask。
 * - zIndex: 弹窗层级。
 * - safeBottom: 是否预留底部安全区。
 * - safeTop: 是否预留顶部安全区。
 * - closeIcon: 关闭图标名称或文本，内置 close 显示为 ×。
 * - closeIconColor: 关闭图标颜色。
 * - closeIconSize: 关闭图标大小。
 * - closeIconPos: 关闭图标位置，可取 top-right / top-left / bottom-left / bottom-right。
 * - margin: 外边距。
 * - navbarHeight: 顶部弹出时额外避让的导航栏高度。
 * - round: 圆角值，仅对 top / bottom / center 生效。
 * - zoom: center 模式是否开启缩放感。
 * - bgColor: 弹窗背景色，transparent 可去除背景。
 * - size: drawer 风格尺寸。左右时表示宽度，上下时表示高度。
 * - maxHeight: 内容最大高度。
 * - width: 弹窗宽度。
 * - height: 弹窗高度，top / center / bottom 模式有效。
 * - customStyle: 面板自定义样式，支持字符串样式。
 * - customWrapStyle: drawer 风格容器自定义样式。
 * - customFooterStyle: footer 自定义样式。
 * - contentMargin: 内容区域边距。
 * - offsetTop: 顶部偏移量。
 * - offsetBottom: 底部偏移量。
 * - lazy: 是否等打开动画后再展示内容。
 * - disabledScroll: 是否禁用内部 scroll-view。
 * - disabledConfirm: 是否禁用确认按钮。
 * - btnColor: 确认按钮主题色。
 * - swipeClose: 是否开启滑动关闭。
 * - swipeHandle: 是否显示滑动手柄。
 * - contentDraggable: 是否允许内容区域拖动关闭。
 * - swipeCloseThreshold: 滑动关闭阈值，单位 px。
 */
const props = __props

/**
 * Emits 说明：严格保留 Popup 文档事件。
 * - click: 点击遮罩时触发。
 * - open: 弹出层打开后触发。
 * - close: 弹出层收起后触发。
 * - beforeOpen: 弹出层打开前触发。
 * - beforeClose: 弹出层关闭前触发。
 * - cancel: 点击取消按钮触发。
 * - confirm: 点击确认按钮触发。
 * - update:show: 同步 show 可见状态。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}






const bgColor = computed(() => {
  return props.bgColor
})
const opened = ref(props.show)
const active = ref(props.show)
const contentReady = ref(!props.lazy || props.show)
const startX = ref(0)
const startY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const touching = ref(false)
let closeTimer = 0
let lazyTimer = 0

const rootStyle = computed(() => {
  return 'z-index:' + String(props.zIndex) + ';'
})

const panelClass = computed(() => {
  const classes = ['i-popup__panel']
  classes.push('i-popup__panel--' + normalizedMode.value)
  if (shouldCoverCenter()) classes.push('i-popup__panel--cover-center')
  return classes.join(' ')
})

const normalizedMode = computed(() => {
  if (
    drawerPosition.value == 'left' ||
    drawerPosition.value == 'right' ||
    drawerPosition.value == 'top' ||
    drawerPosition.value == 'center'
  ) {
    return drawerPosition.value
  }
  return 'bottom'
})

const drawerPosition = computed(() => {
  if (props.position.length > 0) return props.position
  return props.mode
})

const overlayComputedStyle = computed(() => {
  let bgColor = 'rgba(0,0,0,' + String(props.overlayOpacity) + ')'
  if (props.overflayBgColor.length > 0) bgColor = props.overflayBgColor
  let style = 'background-color:' + bgColor + ';'
  style = style + 'opacity:' + (active.value ? '1' : '0') + ';'
  style = style + 'transition-duration:' + formatMs(props.duration) + ';'
  style = style + stringifyStyle(props.overlayStyle)
  return style
})

const titleStyleText = computed(() => {
  return stringifyStyle(props.titleStyle)
})

const panelStyle = computed(() => {
  let style = 'background-color:' + bgColor.value + ';'
  style = style + 'transition-duration:' + formatMs(props.duration) + ';'
  style = style + marginStyle()
  style = style + sizeStyle()
  style = style + roundStyle()
  style = style + safeAreaStyle()
  style = style + transformStyle()
  style = style + stringifyStyle(props.customStyle)
  style = style + stringifyStyle(props.customWrapStyle)
  return style
})

const bodyStyle = computed(() => {
  let style = 'padding:' + formatSize(props.contentMargin) + ';'
  if (String(props.maxHeight).length > 0) style = style + 'max-height:' + formatSize(props.maxHeight) + ';'
  return style
})

const footerStyle = computed(() => {
  return stringifyStyle(props.customFooterStyle)
})

const confirmTextStyle = computed(() => {
  const color = props.btnColor.length > 0 ? props.btnColor : '#1989fa'
  return 'color:' + color + ';'
})

const confirmTextValue = computed(() => {
  return props.confirmText.length > 0 ? props.confirmText : '确定'
})

const cancelTextValue = computed(() => {
  return props.cancelText.length > 0 ? props.cancelText : '取消'
})

const contentVisible = computed(() => {
  return !props.lazy || contentReady.value
})

const closeClass = computed(() => {
  const classes = ['i-popup__close']
  classes.push('i-popup__close--' + normalizeClosePos())
  return classes.join(' ')
})

const closeStyle = computed(() => {
  return 'color:' + props.closeIconColor + ';font-size:' + formatSize(props.closeIconSize) + ';'
})

const closeIconText = computed(() => {
  if (props.closeIcon == 'close') return '×'
  return props.closeIcon
})

watch(
  () => props.show,
  (nextValue) => {
    if (nextValue) {
      openPanel(false)
    } else {
      closePanel(false)
    }
  },
)

function open() {
  openPanel(true)
}

function close() {
  closePanel(true)
}

function openPanel(shouldEmitUpdate: boolean) {
  if (props.disabled) return
  if (opened.value && active.value) return
  clearTimers()
  emit('beforeOpen')
  opened.value = true
  resetOffset()
  if (!props.lazy) contentReady.value = true
  setTimeout(() => {
    active.value = true
    if (props.lazy) {
      lazyTimer = setTimeout(() => {
        contentReady.value = true
        lazyTimer = 0
      }, animationDuration())
    }
    emit('open')
    if (shouldEmitUpdate) emit('update:show', true)
  }, 20)
}

function closePanel(shouldEmitUpdate: boolean) {
  if (!opened.value && !active.value) return
  clearTimers()
  emit('beforeClose')
  active.value = false
  if (props.lazy) contentReady.value = false
  resetOffset()
  closeTimer = setTimeout(() => {
    opened.value = false
    closeTimer = 0
    emit('close')
    if (shouldEmitUpdate) emit('update:show', false)
  }, animationDuration())
}

function clearTimers() {
  if (closeTimer > 0) {
    clearTimeout(closeTimer)
    closeTimer = 0
  }
  if (lazyTimer > 0) {
    clearTimeout(lazyTimer)
    lazyTimer = 0
  }
}

function handleOverlayClick() {
  emit('click')
  if (!props.overlayClick || !props.closeOnMask) return
  close()
}

function cancel() {
  emit('cancel')
  close()
}

function confirm() {
  if (props.disabledConfirm) return
  emit('confirm')
  close()
}

function handleContentTouchStart(event) {
  if (!props.contentDraggable) return
  handleTouchStart(event)
}

function handleHandleTouchStart(event) {
  handleTouchStart(event)
}

function handleTouchStart(event) {
  if (!props.swipeClose) return
  touching.value = true
  startX.value = readTouchX(event)
  startY.value = readTouchY(event)
}

function handleTouchMove(event) {
  if (!props.swipeClose || !touching.value) return
  const currentX = readTouchX(event)
  const currentY = readTouchY(event)
  const deltaX = currentX - startX.value
  const deltaY = currentY - startY.value
  if (normalizedMode.value == 'bottom' && deltaY > 0) offsetY.value = deltaY
  if (normalizedMode.value == 'top' && deltaY < 0) offsetY.value = deltaY
  if (normalizedMode.value == 'left' && deltaX < 0) offsetX.value = deltaX
  if (normalizedMode.value == 'right' && deltaX > 0) offsetX.value = deltaX
  if (normalizedMode.value == 'center' && deltaY > 0) offsetY.value = deltaY
}

function handleTouchEnd() {
  if (!touching.value) return
  touching.value = false
  const threshold = Number(props.swipeCloseThreshold)
  if (Math.abs(offsetX.value) >= threshold || Math.abs(offsetY.value) >= threshold) {
    close()
    return
  }
  resetOffset()
}

function resetOffset() {
  offsetX.value = 0
  offsetY.value = 0
  touching.value = false
}

function transformStyle(): string {
  const x = String(offsetX.value)
  const y = String(offsetY.value)
  if (normalizedMode.value == 'center') {
    const scale = props.zoom ? (active.value ? '1' : '0.88') : '1'
    return (
      'opacity:' +
      (active.value ? '1' : '0') +
      ';transform:translate(-50%,-50%) translate(' +
      x +
      'px,' +
      y +
      'px) scale(' +
      scale +
      ');'
    )
  }
  if (normalizedMode.value == 'bottom') {
    const prefix = shouldCoverCenter() ? 'translateX(-50%) ' : ''
    return 'transform:' + prefix + 'translateY(' + (active.value ? y + 'px' : '100%') + ');'
  }
  if (normalizedMode.value == 'top') {
    const prefix = shouldCoverCenter() ? 'translateX(-50%) ' : ''
    return 'transform:' + prefix + 'translateY(' + (active.value ? y + 'px' : '-100%') + ');'
  }
  if (normalizedMode.value == 'left') {
    return 'transform:translateX(' + (active.value ? x + 'px' : '-100%') + ');'
  }
  if (normalizedMode.value == 'right') {
    return 'transform:translateX(' + (active.value ? x + 'px' : '100%') + ');'
  }
  return ''
}

function marginStyle(): string {
  const margin = formatSize(props.margin)
  if (margin == '0px') return ''
  return 'margin:' + margin + ';'
}

function sizeStyle(): string {
  let style = ''
  const size = String(props.size)
  if (normalizedMode.value == 'left' || normalizedMode.value == 'right') {
    if (String(props.width).length > 0) {
      style = style + 'width:' + formatSize(props.width) + ';'
    } else if (size.length > 0) {
      style = style + 'width:' + formatSize(size) + ';'
    }
  } else if (normalizedMode.value == 'top' || normalizedMode.value == 'bottom') {
    if (String(props.width).length == 0 && !shouldCoverCenter()) {
      style = style + 'width:100%;'
    }
    if (String(props.height).length > 0) {
      style = style + 'height:' + formatSize(props.height) + ';'
    } else if (size.length > 0) {
      style = style + 'height:' + formatSize(size) + ';'
    }
    if (String(props.width).length > 0) style = style + 'width:' + formatSize(props.width) + ';'
  } else {
    if (String(props.width).length > 0) style = style + 'width:' + formatSize(props.width) + ';'
    if (String(props.height).length > 0) style = style + 'height:' + formatSize(props.height) + ';'
  }
  if (normalizedMode.value == 'top') {
    if (props.navbarHeight > 0) style = style + 'top:' + String(props.navbarHeight) + 'px;'
    if (String(props.offsetTop).length > 0) style = style + 'top:' + formatSize(props.offsetTop) + ';'
  }
  if (normalizedMode.value == 'bottom' && String(props.offsetBottom).length > 0) {
    style = style + 'bottom:' + formatSize(props.offsetBottom) + ';'
  }
  return style
}

function roundStyle(): string {
  const round = formatSize(props.round)
  if (normalizedMode.value == 'top') return 'border-radius:0 0 ' + round + ' ' + round + ';'
  if (normalizedMode.value == 'bottom') return 'border-radius:' + round + ' ' + round + ' 0 0;'
  if (normalizedMode.value == 'left') return 'border-radius:0 ' + round + ' ' + round + ' 0;'
  if (normalizedMode.value == 'right') return 'border-radius:' + round + ' 0 0 ' + round + ';'
  if (normalizedMode.value == 'center') return 'border-radius:' + round + ';'
  return ''
}

function safeAreaStyle(): string {
  let style = ''
  if (props.safeTop && normalizedMode.value == 'top') {
    style = style + 'padding-top:env(safe-area-inset-top);'
  }
  if (props.safeBottom && normalizedMode.value == 'bottom') {
    style = style + 'padding-bottom:env(safe-area-inset-bottom);'
  }
  return style
}

function normalizeClosePos(): string {
  if (
    props.closeIconPos == 'top-left' ||
    props.closeIconPos == 'bottom-left' ||
    props.closeIconPos == 'bottom-right'
  ) {
    return props.closeIconPos
  }
  return 'top-right'
}

function stringifyStyle(value): string {
  if (value == null) return ''
  const text = String(value)
  if (text == '[object Object]') return ''
  if (text.length == 0) return ''
  return text.endsWith(';') ? text : text + ';'
}

function formatMs(value): string {
  const text = String(value)
  if (text.indexOf('ms') >= 0 || text.indexOf('s') >= 0) return text
  return text + 'ms'
}

function animationDuration(): number {
  const text = String(props.duration)
  if (text.indexOf('ms') >= 0) return Number(text.replace('ms', ''))
  if (text.indexOf('s') >= 0) return Number(text.replace('s', '')) * 1000
  const duration = Number(text)
  if (isNaN(duration)) return 300
  return duration
}

function isVerticalMode(): boolean {
  return normalizedMode.value == 'top' || normalizedMode.value == 'bottom'
}

function shouldCoverCenter(): boolean {
  return props.widthCoverCenter && isVerticalMode() && String(props.width).length > 0
}

function formatSize(value): string {
  const text = String(value)
  if (text.indexOf('px') >= 0 || text.indexOf('rpx') >= 0 || text.indexOf('%') >= 0) {
    return text
  }
  return text + 'px'
}

function readTouchX(event): number {
  let point = null
  if (event.touches != null && event.touches.length > 0) {
    point = event.touches[0]
  } else if (event.changedTouches != null && event.changedTouches.length > 0) {
    point = event.changedTouches[0]
  }
  if (point == null) return 0
  const clientX = Number(point.clientX)
  if (!isNaN(clientX)) return clientX
  return Number(point.pageX)
}

function readTouchY(event): number {
  let point = null
  if (event.touches != null && event.touches.length > 0) {
    point = event.touches[0]
  } else if (event.changedTouches != null && event.changedTouches.length > 0) {
    point = event.changedTouches[0]
  }
  if (point == null) return 0
  const clientY = Number(point.clientY)
  if (!isNaN(clientY)) return clientY
  return Number(point.pageY)
}

__expose({
  open,
  close,
})

return (): any | null => {

  return _cE("view", null, [
    _cE("view", _uM({
      class: "i-popup__trigger",
      onClick: open
    }), [
      renderSlot(_ctx.$slots, "trigger")
    ]),
    isTrue(opened.value)
      ? _cE("view", _uM({
          key: 0,
          class: "i-popup",
          style: _nS(rootStyle.value)
        }), [
          isTrue(_ctx.overlay)
            ? _cE("view", _uM({
                key: 0,
                class: "i-popup__overlay",
                style: _nS(overlayComputedStyle.value),
                onClick: handleOverlayClick
              }), null, 4 /* STYLE */)
            : _cC("v-if", true),
          _cE("view", _uM({
            class: _nC(panelClass.value),
            style: _nS(panelStyle.value),
            onClick: withModifiers(() => {}, ["stop"])
          }), [
            renderSlot(_ctx.$slots, "bg"),
            isTrue(_ctx.swipeClose && _ctx.swipeHandle)
              ? _cE("view", _uM({
                  key: 0,
                  class: "i-popup__swipe-handle",
                  onTouchstart: withModifiers(handleHandleTouchStart, ["stop"]),
                  onTouchmove: withModifiers(handleTouchMove, ["stop","prevent"]),
                  onTouchend: withModifiers(handleTouchEnd, ["stop"]),
                  onTouchcancel: withModifiers(handleTouchEnd, ["stop"])
                }), [
                  _cE("view", _uM({ class: "i-popup__swipe-bar" }))
                ], 32 /* NEED_HYDRATION */)
              : _cC("v-if", true),
            normalizedMode.value == 'bottom'
              ? renderSlot(_ctx.$slots, "contentTop", _uM({ key: 1 }))
              : _cC("v-if", true),
            renderSlot(_ctx.$slots, "header", {}, (): any[] => [
              isTrue(_ctx.showTitle && _ctx.title.length > 0)
                ? _cE("view", _uM({
                    key: 0,
                    class: "i-popup__header"
                  }), [
                    renderSlot(_ctx.$slots, "title", {}, (): any[] => [
                      _cE("text", _uM({
                        class: "i-popup__title",
                        style: _nS(titleStyleText.value)
                      }), _tD(_ctx.title), 5 /* TEXT, STYLE */)
                    ])
                  ])
                : _cC("v-if", true)
            ]),
            isTrue(_ctx.showClose)
              ? _cE("view", _uM({
                  key: 2,
                  class: _nC(closeClass.value),
                  style: _nS(closeStyle.value),
                  onClick: close
                }), [
                  _cE("text", _uM({ class: "i-popup__close-text" }), _tD(closeIconText.value), 1 /* TEXT */)
                ], 6 /* CLASS, STYLE */)
              : _cC("v-if", true),
            isTrue(_ctx.disabledScroll)
              ? _cE("view", _uM({
                  key: 3,
                  class: "i-popup__body",
                  style: _nS(bodyStyle.value)
                }), [
                  isTrue(contentVisible.value)
                    ? renderSlot(_ctx.$slots, "default", _uM({ key: 0 }))
                    : _cC("v-if", true)
                ], 4 /* STYLE */)
              : _cE("scroll-view", _uM({
                  key: 4,
                  "scroll-y": "",
                  class: "i-popup__body i-popup__body--scroll",
                  style: _nS(bodyStyle.value)
                }), [
                  isTrue(contentVisible.value)
                    ? renderSlot(_ctx.$slots, "default", _uM({ key: 0 }))
                    : _cC("v-if", true)
                ], 4 /* STYLE */),
            renderSlot(_ctx.$slots, "footer", {}, (): any[] => [
              isTrue(_ctx.showFooter)
                ? _cE("view", _uM({
                    key: 0,
                    class: "i-popup__footer",
                    style: _nS(footerStyle.value)
                  }), [
                    isTrue(_ctx.showCancel)
                      ? _cE("view", _uM({
                          key: 0,
                          class: "i-popup__footer-button i-popup__footer-button--cancel",
                          onClick: cancel
                        }), [
                          _cE("text", _uM({ class: "i-popup__footer-cancel" }), _tD(cancelTextValue.value), 1 /* TEXT */)
                        ])
                      : _cC("v-if", true),
                    _cE("view", _uM({
                      class: _nC(
                _ctx.disabledConfirm
                  ? 'i-popup__footer-button i-popup__footer-button--confirm i-popup__footer-button--disabled'
                  : 'i-popup__footer-button i-popup__footer-button--confirm'
              ),
                      onClick: confirm
                    }), [
                      _cE("text", _uM({
                        class: "i-popup__footer-confirm",
                        style: _nS(confirmTextStyle.value)
                      }), _tD(confirmTextValue.value), 5 /* TEXT, STYLE */)
                    ], 2 /* CLASS */)
                  ], 4 /* STYLE */)
                : _cC("v-if", true)
            ]),
            isTrue(_ctx.closeable && !_ctx.showClose)
              ? _cE("view", _uM({
                  key: 5,
                  class: _nC(closeClass.value),
                  style: _nS(closeStyle.value),
                  onClick: close
                }), [
                  _cE("text", _uM({ class: "i-popup__close-text" }), _tD(closeIconText.value), 1 /* TEXT */)
                ], 6 /* CLASS, STYLE */)
              : _cC("v-if", true)
          ], 14 /* CLASS, STYLE, PROPS */, ["onClick"])
        ], 4 /* STYLE */)
      : _cC("v-if", true)
  ])
}
}

})
export default __sfc__
export type IPopupComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIPopupIPopupStyles = [_uM([["i-popup__trigger", _pS(_uM([["flexDirection", "column"]]))], ["i-popup", _pS(_uM([["position", "fixed"], ["left", 0], ["right", 0], ["top", 0], ["bottom", 0]]))], ["i-popup__overlay", _pS(_uM([["position", "absolute"], ["left", 0], ["right", 0], ["top", 0], ["bottom", 0], ["transitionProperty", "opacity"], ["transitionTimingFunction", "ease"]]))], ["i-popup__panel", _pS(_uM([["position", "absolute"], ["overflow", "hidden"], ["flexDirection", "column"], ["boxShadow", "0 12px 34px rgba(15, 23, 42, 0.18)"], ["transitionProperty", "transform,opacity"], ["transitionTimingFunction", "cubic-bezier(0.22,1,0.36,1)"]]))], ["i-popup__panel--bottom", _pS(_uM([["left", 0], ["right", 0], ["bottom", 0], ["minHeight", 160]]))], ["i-popup__panel--top", _pS(_uM([["left", 0], ["right", 0], ["top", 0], ["minHeight", 160]]))], ["i-popup__panel--left", _pS(_uM([["left", 0], ["top", 0], ["bottom", 0], ["width", 280]]))], ["i-popup__panel--right", _pS(_uM([["right", 0], ["top", 0], ["bottom", 0], ["width", 280]]))], ["i-popup__panel--center", _pS(_uM([["left", "50%"], ["top", "50%"], ["width", 300]]))], ["i-popup__panel--cover-center", _pS(_uM([["left", "50%"], ["right", "auto"], ["width", "100%"], ["transformOrigin", "center center"]]))], ["i-popup__swipe-handle", _pS(_uM([["height", 24], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-popup__swipe-bar", _pS(_uM([["width", 38], ["height", 4], ["borderTopLeftRadius", 99], ["borderTopRightRadius", 99], ["borderBottomRightRadius", 99], ["borderBottomLeftRadius", 99], ["backgroundColor", "#d9dee8"]]))], ["i-popup__header", _pS(_uM([["minHeight", 54], ["paddingTop", 0], ["paddingRight", 52], ["paddingBottom", 0], ["paddingLeft", 18], ["borderBottomWidth", 1], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f2f3f5"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-popup__title", _pS(_uM([["color", "#303133"], ["fontSize", 16], ["fontWeight", 600], ["lineHeight", "24px"]]))], ["i-popup__close", _pS(_uM([["position", "absolute"], ["zIndex", 2], ["width", 34], ["height", 34], ["borderTopLeftRadius", 34], ["borderTopRightRadius", 34], ["borderBottomRightRadius", 34], ["borderBottomLeftRadius", 34], ["backgroundColor", "rgba(245,247,250,0.92)"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-popup__close--top-right", _pS(_uM([["right", 12], ["top", 10]]))], ["i-popup__close--top-left", _pS(_uM([["left", 12], ["top", 10]]))], ["i-popup__close--bottom-left", _pS(_uM([["left", 12], ["bottom", 10]]))], ["i-popup__close--bottom-right", _pS(_uM([["right", 12], ["bottom", 10]]))], ["i-popup__close-text", _pS(_uM([["color", "#606266"], ["fontSize", 22], ["lineHeight", "34px"], ["textAlign", "center"]]))], ["i-popup__body", _pS(_uM([["position", "relative"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["i-popup__body--scroll", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["i-popup__footer", _pS(_uM([["minHeight", 58], ["paddingTop", 10], ["paddingRight", 14], ["paddingBottom", 10], ["paddingLeft", 14], ["borderTopWidth", 1], ["borderTopStyle", "solid"], ["borderTopColor", "#f2f3f5"], ["backgroundColor", "#ffffff"], ["flexDirection", "row"]]))], ["i-popup__footer-button", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["height", 40], ["borderTopLeftRadius", 8], ["borderTopRightRadius", 8], ["borderBottomRightRadius", 8], ["borderBottomLeftRadius", 8], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-popup__footer-button--cancel", _pS(_uM([["marginRight", 8], ["backgroundColor", "#f5f7fb"]]))], ["i-popup__footer-button--confirm", _pS(_uM([["backgroundColor", "#eef6ff"]]))], ["i-popup__footer-button--disabled", _pS(_uM([["opacity", 0.45]]))], ["i-popup__footer-cancel", _pS(_uM([["fontSize", 15], ["fontWeight", 600], ["lineHeight", "22px"], ["color", "#606266"]]))], ["i-popup__footer-confirm", _pS(_uM([["fontSize", 15], ["fontWeight", 600], ["lineHeight", "22px"]]))], ["@TRANSITION", _uM([["i-popup__overlay", _uM([["property", "opacity"], ["timingFunction", "ease"]])], ["i-popup__panel", _uM([["property", "transform,opacity"], ["timingFunction", "cubic-bezier(0.22,1,0.36,1)"]])]])]])]
