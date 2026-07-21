import { computed, ref, watch } from 'vue'


const __sfc__ = defineComponent({
  __name: 'i-slider',
name: 'i-slider',
  props: {
  modelValue: {
    type: [Number, String, Array],
    default: 0,
  },
  value: {
    type: [Number, String, Array],
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  range: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  noCross: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '24px',
  },
  railColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.1)',
  },
  railRadius: {
    type: String,
    default: '2px',
  },
  railSize: {
    type: String,
    default: '4px',
  },
  trackColor: {
    type: String,
    default: '#1677ff',
  },
  thumbSize: {
    type: String,
    default: '20px',
  },
  thumbColor: {
    type: String,
    default: '#ffffff',
  },
  thumbBorder: {
    type: String,
    default: '3px solid #1677ff',
  },
  thumbRadius: {
    type: String,
    default: '50%',
  },
  showValue: {
    type: Boolean,
    default: false,
  },
},
  emits: [
  'update:modelValue',
  'update:value',
  'change',
  'changing',
  'dragStart',
  'dragEnd',
],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：依据 DCloud uni-app x 官方规范 Slider，用于单值或区间滑块。
 * - modelValue/value: 当前值，单值为 Number，区间可传 "start,end" 或数组。
 * - min/max/step: 最小值、最大值、步长。
 * - range: 是否启用区间模式。
 * - disabled/readonly: 禁用和只读。
 * - noCross/vertical: 区间选择是否禁止交叉，以及是否使用纵向布局。
 * - size/railRadius/railSize/thumbSize/thumbColor/thumbBorder/thumbRadius: 保留样式 API。
 * - railColor/trackColor: 轨道和选中轨道颜色。
 * - showValue: 是否显示当前值。
 */
const props = __props

/**
 * Emits 说明：滑块拖动和变更。
 * - update:modelValue/update:value: 同步当前滑块值。
 * - change: 值稳定后触发。
 * - changing: 拖动过程中触发，兼容旧版。
 * - dragStart/dragEnd: 开始和结束拖动时触发。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function initialValue() {
  if (props.modelValue.toString().length > 0) return props.modelValue
  return props.value
}

function normalizeSingle(value: any): number {
  let nextValue = parseFloat(value.toString())
  if (isNaN(nextValue)) nextValue = props.min
  if (nextValue < props.min) nextValue = props.min
  if (nextValue > props.max) nextValue = props.max
  return nextValue
}

function normalizeRange(value: any): Array<number> {
  let start = props.min
  let end = props.max
  if (Array.isArray(value) && value.length > 1) {
    start = parseFloat(value[0].toString())
    end = parseFloat(value[1].toString())
  } else {
    const text = value.toString()
    if (text.indexOf(',') >= 0) {
      start = parseFloat(text.split(',')[0])
      end = parseFloat(text.split(',')[1])
    }
  }
  start = normalizeSingle(start)
  end = normalizeSingle(end)
  if (props.noCross && start > end) start = end
  return [start, end]
}

function valuePercent(value: number): number {
  const distance = props.max - props.min
  if (distance <= 0) return 0
  const percent = ((value - props.min) / distance) * 100
  if (percent < 0) return 0
  if (percent > 100) return 100
  return percent
}

function formatSize(value: any): string {
  const text = value.toString()
  if (text.indexOf('px') >= 0 || text.indexOf('rpx') >= 0 || text.indexOf('%') >= 0) {
    return text
  }
  return text + 'px'
}

function thumbStyle(value: number): string {
  const size = parseFloat(props.thumbSize.toString())
  const halfSize = isNaN(size) ? 10 : size / 2
  return (
    'left:' +
    valuePercent(value).toString() +
    '%;width:' +
    formatSize(props.thumbSize) +
    ';height:' +
    formatSize(props.thumbSize) +
    ';margin-left:' +
    formatSize(0 - halfSize) +
    ';border:' +
    props.thumbBorder +
    ';border-radius:' +
    props.thumbRadius +
    ';background-color:' +
    props.thumbColor +
    ';'
  )
}

const singleValue = ref(normalizeSingle(initialValue()))
const rangeStart = ref(normalizeRange(initialValue())[0])
const rangeEnd = ref(normalizeRange(initialValue())[1])
const dragging = ref(false)
const rangeId = 'i-slider-range-' + Math.floor(Math.random() * 1000000).toString()
const rangeRectLeft = ref(0)
const rangeRectWidth = ref(0)
const activeRangeThumb = ref('')

const wrapClass = computed(() => {
  const classes = ['i-slider']
  if (props.vertical) classes.push('i-slider--vertical')
  if (props.disabled) classes.push('i-slider--disabled')
  return classes.join(' ')
})

const displayValue = computed(() => {
  if (props.range) return rangeStart.value.toString() + ' - ' + rangeEnd.value.toString()
  return singleValue.value.toString()
})

const rangeRailStyle = computed(() => {
  return (
    'height:' +
    formatSize(props.railSize) +
    ';border-radius:' +
    formatSize(props.railRadius) +
    ';background-color:' +
    props.railColor +
    ';'
  )
})

const rangeTrackStyle = computed(() => {
  const startPercent = valuePercent(rangeStart.value)
  const endPercent = valuePercent(rangeEnd.value)
  return (
    'left:' +
    startPercent.toString() +
    '%;width:' +
    (endPercent - startPercent).toString() +
    '%;height:' +
    formatSize(props.railSize) +
    ';border-radius:' +
    formatSize(props.railRadius) +
    ';background-color:' +
    props.trackColor +
    ';'
  )
})

const startThumbStyle = computed(() => {
  return thumbStyle(rangeStart.value)
})

const endThumbStyle = computed(() => {
  return thumbStyle(rangeEnd.value)
})

const syncFromProps = (): void => {
  singleValue.value = normalizeSingle(initialValue())
  const values = normalizeRange(initialValue())
  rangeStart.value = values[0]
  rangeEnd.value = values[1]
}

watch(
  (): any => props.modelValue,
  (): void => {
    syncFromProps()
  },
)

watch(
  (): any => props.value,
  (): void => {
    syncFromProps()
  },
)

function normalizeStart(value: number): number {
  let nextValue = normalizeSingle(value)
  if (props.noCross && nextValue > rangeEnd.value) nextValue = rangeEnd.value
  return nextValue
}

function normalizeEnd(value: number): number {
  let nextValue = normalizeSingle(value)
  if (props.noCross && nextValue < rangeStart.value) nextValue = rangeStart.value
  return nextValue
}

const startDrag = (): void => {
  if (dragging.value) return
  dragging.value = true
  emit('dragStart')
}

const endDrag = (): void => {
  dragging.value = false
  emit('dragEnd')
}

const emitValue = (value: any): void => {
  emit('update:modelValue', value)
  emit('update:value', value)
  emit('change', value)
}

function handleSingleChanging(event: UniSliderChangeEvent) {
  startDrag()
  singleValue.value = normalizeSingle(event.detail.value)
  emit('changing', singleValue.value)
}

function handleSingleChange(event: UniSliderChangeEvent) {
  singleValue.value = normalizeSingle(event.detail.value)
  emitValue(singleValue.value)
  endDrag()
}

function handleStartChanging(event: UniSliderChangeEvent) {
  startDrag()
  rangeStart.value = normalizeStart(event.detail.value)
  emit('changing', [rangeStart.value, rangeEnd.value])
}

function handleStartChange(event: UniSliderChangeEvent) {
  rangeStart.value = normalizeStart(event.detail.value)
  emitValue([rangeStart.value, rangeEnd.value])
  endDrag()
}

function handleEndChanging(event: UniSliderChangeEvent) {
  startDrag()
  rangeEnd.value = normalizeEnd(event.detail.value)
  emit('changing', [rangeStart.value, rangeEnd.value])
}

function handleEndChange(event: UniSliderChangeEvent) {
  rangeEnd.value = normalizeEnd(event.detail.value)
  emitValue([rangeStart.value, rangeEnd.value])
  endDrag()
}

function normalizeRectPoint(first: any, fallback: any): number {
  const firstValue = parseFloat(first.toString())
  if (!isNaN(firstValue)) return firstValue
  const fallbackValue = parseFloat(fallback.toString())
  if (!isNaN(fallbackValue)) return fallbackValue
  return 0
}

function normalizeStep(value: number): number {
  const stepValue = props.step <= 0 ? 1 : props.step
  const nextValue = props.min + Math.round((value - props.min) / stepValue) * stepValue
  return normalizeSingle(parseFloat(nextValue.toFixed(6)))
}

function valueFromPoint(x: number): number {
  let percent = (x - rangeRectLeft.value) / rangeRectWidth.value
  if (percent < 0) percent = 0
  if (percent > 1) percent = 1
  const rawValue = props.min + (props.max - props.min) * percent
  return normalizeStep(rawValue)
}

function pickRangeThumb(value: number): void {
  const startDistance = Math.abs(value - rangeStart.value)
  const endDistance = Math.abs(value - rangeEnd.value)
  activeRangeThumb.value = startDistance <= endDistance ? 'start' : 'end'
}

function readTouchX(event: UniTouchEvent): number {
  let point: UniTouch | null = null
  if (event.touches.length > 0) point = event.touches[0]
  else if (event.changedTouches.length > 0) point = event.changedTouches[0]
  if (point == null) return NaN
  return point.clientX
}

function updateRangeByTouch(event: UniTouchEvent, shouldPickThumb: boolean): void {
  const x = readTouchX(event)
  if (isNaN(x) || rangeRectWidth.value <= 0) return
  const nextValue = valueFromPoint(x)
  if (shouldPickThumb) pickRangeThumb(nextValue)
  if (activeRangeThumb.value == 'start') rangeStart.value = normalizeStart(nextValue)
  else rangeEnd.value = normalizeEnd(nextValue)
  emit('changing', [rangeStart.value, rangeEnd.value])
}

function setRangeRect(rect: any): void {
  const rects = rect as Array<NodeInfo>
  if (rects.length == 0) return
  const nodeInfo = rects[0]
  rangeRectLeft.value = nodeInfo.left != null ? nodeInfo.left : 0
  rangeRectWidth.value = nodeInfo.width != null ? nodeInfo.width : 0
}

function refreshRangeRect(event: UniTouchEvent, shouldPickThumb: boolean, shouldUpdate: boolean): void {
  uni
    .createSelectorQuery()
    .select('#' + rangeId)
    .boundingClientRect((rect: any) => {
      setRangeRect(rect)
      if (shouldUpdate) updateRangeByTouch(event, shouldPickThumb)
    })
    .exec()
}

function handleRangeTouchStart(event: UniTouchEvent) {
  if (props.disabled || props.readonly) return
  startDrag()
  refreshRangeRect(event, true, true)
}

function handleRangeTouchMove(event: UniTouchEvent) {
  if (props.disabled || props.readonly || activeRangeThumb.value.length == 0) return
  updateRangeByTouch(event, false)
}

function handleRangeTouchEnd() {
  if (activeRangeThumb.value.length == 0) return
  emitValue([rangeStart.value, rangeEnd.value])
  activeRangeThumb.value = ''
  endDrag()
}


return (): any | null => {

const _component_slider = resolveComponent("slider")

  return _cE("view", _uM({
    class: _nC(wrapClass.value)
  }), [
    isTrue(!_ctx.range)
      ? _cE("view", _uM({
          key: 0,
          class: "i-slider__line"
        }), [
          _cV(_component_slider, _uM({
            class: "i-slider__native",
            value: singleValue.value,
            min: _ctx.min,
            max: _ctx.max,
            step: _ctx.step,
            disabled: _ctx.disabled || _ctx.readonly,
            activeColor: _ctx.trackColor,
            backgroundColor: _ctx.railColor,
            onChanging: handleSingleChanging,
            onChange: handleSingleChange
          }), null, 8 /* PROPS */, ["value", "min", "max", "step", "disabled", "activeColor", "backgroundColor"]),
          renderSlot(_ctx.$slots, "startThumb")
        ])
      : _cE("view", _uM({
          key: 1,
          id: rangeId,
          class: "i-slider__range",
          onTouchstart: withModifiers(handleRangeTouchStart, ["stop","prevent"]),
          onTouchmove: withModifiers(handleRangeTouchMove, ["stop","prevent"]),
          onTouchend: withModifiers(handleRangeTouchEnd, ["stop","prevent"]),
          onTouchcancel: withModifiers(handleRangeTouchEnd, ["stop","prevent"])
        }), [
          _cE("view", _uM({
            class: "i-slider__range-rail",
            style: _nS(rangeRailStyle.value)
          }), null, 4 /* STYLE */),
          _cE("view", _uM({
            class: "i-slider__range-track",
            style: _nS(rangeTrackStyle.value)
          }), null, 4 /* STYLE */),
          _cE("view", _uM({
            class: "i-slider__thumb",
            style: _nS(startThumbStyle.value)
          }), [
            renderSlot(_ctx.$slots, "startThumb")
          ], 4 /* STYLE */),
          _cE("view", _uM({
            class: "i-slider__thumb",
            style: _nS(endThumbStyle.value)
          }), [
            renderSlot(_ctx.$slots, "endThumb")
          ], 4 /* STYLE */)
        ], 32 /* NEED_HYDRATION */),
    isTrue(_ctx.showValue)
      ? _cE("text", _uM({
          key: 2,
          class: "i-slider__value"
        }), _tD(displayValue.value), 1 /* TEXT */)
      : _cC("v-if", true)
  ], 2 /* CLASS */)
}
}

})
export default __sfc__
export type ISliderComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsISliderISliderStyles = [_uM([["i-slider", _pS(_uM([["flexDirection", "row"], ["alignItems", "center"]]))], ["i-slider--vertical", _pS(_uM([["flexDirection", "column"], ["alignItems", "stretch"]]))], ["i-slider--disabled", _pS(_uM([["opacity", 0.55]]))], ["i-slider__line", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["i-slider__native", _pS(_uM([["width", "100%"]]))], ["i-slider__range", _pS(_uM([["position", "relative"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["height", 64]]))], ["i-slider__range-rail", _pS(_uM([["position", "absolute"], ["top", 20], ["left", 0], ["right", 0]]))], ["i-slider__range-track", _pS(_uM([["position", "absolute"], ["top", 20], ["left", 0]]))], ["i-slider__thumb", _pS(_uM([["position", "absolute"], ["top", 10], ["zIndex", 3], ["alignItems", "center"], ["justifyContent", "center"], ["boxShadow", "0 2px 8px rgba(31, 45, 61, 0.16)"]]))], ["i-slider__value", _pS(_uM([["minWidth", 58], ["marginLeft", 8], ["color", "#606266"], ["fontSize", 14], ["lineHeight", "22px"], ["textAlign", "right"]]))]])]
