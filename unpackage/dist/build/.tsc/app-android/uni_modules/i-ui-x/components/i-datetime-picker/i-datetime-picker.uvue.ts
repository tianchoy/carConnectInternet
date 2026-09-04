import { computed, ref, watch } from 'vue'

type IDatetimePickerEvent = {
  value : any,
  date : string,
  time : string,
  timestamp : number,
  mode : string,
}

type IWheelOption = {
  value : number,
  text : string,
}


const __sfc__ = defineComponent({
  __name: 'i-datetime-picker',
name: 'i-datetime-picker',
  props: {
  modelValue: {
    type: [String, Number],
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '请选择',
  },
  mode: {
    type: String,
    default: 'datetime',
  },
  minDate: {
    type: Number,
    default: 0,
  },
  maxDate: {
    type: Number,
    default: 0,
  },
  minHour: {
    type: Number,
    default: 0,
  },
  maxHour: {
    type: Number,
    default: 23,
  },
  minMinute: {
    type: Number,
    default: 0,
  },
  maxMinute: {
    type: Number,
    default: 59,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelColor: {
    type: String,
    default: '#909193',
  },
  confirmColor: {
    type: String,
    default: '#3c9cff',
  },
  closeOnMask: { type: Boolean, default: true },
  round: {
    type: [String, Number],
    default: 16,
  },
  date: {
    type: String,
    default: '2026-05-22',
  },
  time: {
    type: String,
    default: '16:30',
  },
  dateLabel: {
    type: String,
    default: '日期',
  },
  timeLabel: {
    type: String,
    default: '时间',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
},
  emits: [
  'open',
  'close',
  'cancel',
  'change',
  'confirm',
  'update:modelValue',
  'update:show',
  'update:date',
  'update:time',
],
  setup(__props, __setupCtx: SetupContext) {
const __expose = __setupCtx.expose
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;



/**
 * Props 说明：依据 DCloud uni-app x 官方规范 DatetimePicker，并保留旧版 date/time 写法。
 * - modelValue: 当前绑定值；date/datetime/year-month 通常为时间戳，time 为 HH:mm。
 * - show: 是否展示底部弹层。
 * - showToolbar: 是否显示顶部取消/标题/确认操作栏。
 * - title: 顶部标题。
 * - mode: 选择模式；datetime 为日期+时间，date 为年月日，time 为时分，year-month 为年月。
 * - minDate: 可选的最小日期时间，时间戳毫秒，默认当前时间前 10 年。
 * - maxDate: 可选的最大日期时间，时间戳毫秒，默认当前时间后 10 年。
 * - minHour/maxHour: time 模式可选小时范围。
 * - minMinute/maxMinute: time 模式可选分钟范围。
 * - loading: 是否显示加载中状态。
 * - cancelText/confirmText: 取消和确认按钮文字。
 * - cancelColor/confirmColor: 取消和确认按钮颜色。
 * - closeOnMask: 点击遮罩是否关闭弹层。
 * - round: 弹层顶部圆角。
 * - date/time: 旧版日期和时间值兼容。
 * - dateLabel/timeLabel: 日期和时间列的标签。
 * - disabled: 是否禁用触发和选择。
 */
const props = __props

/**
 * Emits 说明：组件向外派发弹层状态、选择变化和确认结果。
 * - open/close: 弹层打开和关闭时触发。
 * - cancel: 点击取消时触发，参数为当前事件对象。
 * - change: 日期或时间变化时触发，参数包含 value、date、time、timestamp、mode。
 * - confirm: 点击确认时触发，参数包含 value、date、time、timestamp、mode。
 * - update:modelValue: 同步 v-model 值。
 * - update:show: 同步 show 弹层状态。
 * - update:date/update:time: 兼容旧版 date/time 双字段同步。
 */
function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

function padNumber(value : any) : string {
  const numberValue = parseFloat((value).toString())
  return numberValue < 10 ? '0' + (numberValue).toString() : (numberValue).toString()
}

function formatDate(timestamp : number) : string {
  const date = new Date(timestamp)
  return (
    (date.getFullYear()).toString() +
    '-' +
    padNumber(date.getMonth() + 1) +
    '-' +
    padNumber(date.getDate())
  )
}

function formatTime(timestamp : number) : string {
  const date = new Date(timestamp)
  return padNumber(date.getHours()) + ':' + padNumber(date.getMinutes())
}

function validHour(value : any) : number {
  const numberValue = parseFloat((value).toString())
  if (numberValue < 0) return 0
  if (numberValue > 23) return 23
  return numberValue
}

function validMinute(value : any) : number {
  const numberValue = parseFloat((value).toString())
  if (numberValue < 0) return 0
  if (numberValue > 59) return 59
  return numberValue
}

function timeToMinutes(value : string) : number {
  return parseFloat((value.substring(0, 2)).toString()) * 60 + parseFloat((value.substring(3, 5)).toString())
}

function normalizeTime(value : string) : string {
  if (value.length >= 5) return value.substring(0, 5)
  return '00:00'
}

function dateTimeToTimestamp(dateText : string, timeText : string) : number {
  const year = parseFloat((dateText.substring(0, 4)).toString())
  const month = parseFloat((dateText.substring(5, 7)).toString()) - 1
  const day = parseFloat((dateText.substring(8, 10)).toString())
  const hour = parseFloat((timeText.substring(0, 2)).toString())
  const minute = parseFloat((timeText.substring(3, 5)).toString())
  return new Date(year, month, day, hour, minute, 0).getTime()
}

function minDateValue() : number {
  if (props.minDate > 0) return props.minDate
  const now = new Date()
  return new Date(now.getFullYear() - 10, now.getMonth(), now.getDate(), 0, 0, 0).getTime()
}

function maxDateValue() : number {
  if (props.maxDate > 0) return props.maxDate
  const now = new Date()
  return new Date(now.getFullYear() + 10, now.getMonth(), now.getDate(), 23, 59, 59).getTime()
}

function formatSize(value : any) : string {
  const text = (value).toString()
  if (text.indexOf('px') >= 0 || text.indexOf('rpx') >= 0 || text.indexOf('%') >= 0) {
    return text
  }
  return text + 'px'
}


const opened = ref(props.show)
const currentDate = ref(props.date)
const currentTime = ref(props.time)

function boundaryStartTime() : string {
  if (currentDate.value == formatDate(minDateValue())) return formatTime(minDateValue())
  return '00:00'
}

function boundaryEndTime() : string {
  if (currentDate.value == formatDate(maxDateValue())) return formatTime(maxDateValue())
  return '23:59'
}

const normalizedMode = computed(() : string => {
  if (props.mode == 'date') return 'date'
  if (props.mode == 'time') return 'time'
  if (props.mode == 'year-month') return 'year-month'
  return 'datetime'
})

function datePart(value : string, index : number, fallback : number) : number {
  const parts = value.split(/[- :]/)
  if (parts.length <= index) return fallback
  const parsed = parseFloat(parts[index])
  return isNaN(parsed) ? fallback : parsed
}

function optionRange(start : number, end : number, suffix : string, pad : boolean = false) : Array<IWheelOption> {
  const result : Array<IWheelOption> = []
  for (let value = start; value <= end; value++) {
    const text = pad ? padNumber(value) : value.toString()
    result.push({ value, text: text + suffix })
  }
  return result
}

function dateFromParts(year : number, month : number, day : number, hour : number, minute : number) : string {
  return year.toString() + '-' + padNumber(month) + '-' + padNumber(day) + ' ' + padNumber(hour) + ':' + padNumber(minute)
}

function daysInMonth(year : number, month : number) : number {
  return new Date(year, month, 0).getDate()
}

function selectedYear() : number {
  return datePart(currentDate.value, 0, new Date().getFullYear())
}

function selectedMonth() : number {
  return datePart(currentDate.value, 1, new Date().getMonth() + 1)
}

function selectedDay() : number {
  return datePart(currentDate.value, 2, new Date().getDate())
}

function selectedHour() : number {
  return datePart(currentTime.value, 0, 0)
}

function selectedMinute() : number {
  return datePart(currentTime.value, 1, 0)
}

function minDateParts() : Date {
  return new Date(minDateValue())
}

function maxDateParts() : Date {
  return new Date(maxDateValue())
}

const showYearColumn = computed(() : boolean => normalizedMode.value != 'time')
const showMonthColumn = computed(() : boolean => normalizedMode.value != 'time')
const showDayColumn = computed(() : boolean => normalizedMode.value == 'datetime' || normalizedMode.value == 'date')
const showHourColumn = computed(() : boolean => normalizedMode.value == 'datetime' || normalizedMode.value == 'time')
const showMinuteColumn = computed(() : boolean => normalizedMode.value == 'datetime' || normalizedMode.value == 'time')

const yearOptions = computed(() : Array<IWheelOption> => {
  const minYear = minDateParts().getFullYear()
  const maxYear = maxDateParts().getFullYear()
  return optionRange(minYear, maxYear, '年')
})

const columnsStyle = computed(() : string => {
  return 'width:100%;height:220px;'
})

const indicatorStyle = computed(() : string => {
  return 'height:44px;background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;'
})

const itemStyle = computed(() : string => {
  return 'height:44px;'
})

const monthOptions = computed(() : Array<IWheelOption> => {
  let firstMonth = 1
  let lastMonth = 12
  const minDate = minDateParts()
  const maxDate = maxDateParts()
  if (selectedYear() == minDate.getFullYear()) firstMonth = minDate.getMonth() + 1
  if (selectedYear() == maxDate.getFullYear()) lastMonth = maxDate.getMonth() + 1
  return optionRange(firstMonth, lastMonth, '月')
})

const dayOptions = computed(() : Array<IWheelOption> => {
  let firstDay = 1
  let lastDay = daysInMonth(selectedYear(), selectedMonth())
  const minDate = minDateParts()
  const maxDate = maxDateParts()
  if (selectedYear() == minDate.getFullYear() && selectedMonth() == minDate.getMonth() + 1) firstDay = minDate.getDate()
  if (selectedYear() == maxDate.getFullYear() && selectedMonth() == maxDate.getMonth() + 1) lastDay = maxDate.getDate()
  if (firstDay > lastDay) firstDay = lastDay
  return optionRange(firstDay, lastDay, '日')
})

function hourRange() : Array<number> {
  let firstHour = 0
  let lastHour = 23
  if (normalizedMode.value == 'time') {
    firstHour = validHour(props.minHour)
    lastHour = validHour(props.maxHour)
  } else {
    const timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value)
    if (formatDate(timestampDate) == formatDate(minDateValue())) firstHour = new Date(minDateValue()).getHours()
    if (formatDate(timestampDate) == formatDate(maxDateValue())) lastHour = new Date(maxDateValue()).getHours()
  }
  return [firstHour, lastHour]
}

const hourOptions = computed(() : Array<IWheelOption> => {
  const range = hourRange()
  return optionRange(range[0], range[1], '时', true)
})

function minuteRange() : Array<number> {
  let firstMinute = 0
  let lastMinute = 59
  const range = hourRange()
  const hour = selectedHour()
  if (normalizedMode.value == 'time') {
    if (hour == range[0]) firstMinute = validMinute(props.minMinute)
    if (hour == range[1]) lastMinute = validMinute(props.maxMinute)
  } else {
    const timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value)
    if (formatDate(timestampDate) == formatDate(minDateValue()) && hour == new Date(minDateValue()).getHours()) {
      firstMinute = new Date(minDateValue()).getMinutes()
    }
    if (formatDate(timestampDate) == formatDate(maxDateValue()) && hour == new Date(maxDateValue()).getHours()) {
      lastMinute = new Date(maxDateValue()).getMinutes()
    }
  }
  return [firstMinute, lastMinute]
}

const minuteOptions = computed(() : Array<IWheelOption> => {
  const range = minuteRange()
  return optionRange(range[0], range[1], '分', true)
})

const wheelIndexes = ref<Array<number>>([])

function indexOfOption(options : Array<IWheelOption>, value : number) : number {
  for (let index = 0; index < options.length; index++) {
    if (options[index].value == value) return index
  }
  return 0
}

function syncWheelIndexes() : void {
  const indexes : Array<number> = []
  if (showYearColumn.value) indexes.push(indexOfOption(yearOptions.value, selectedYear()))
  if (showMonthColumn.value) indexes.push(indexOfOption(monthOptions.value, selectedMonth()))
  if (showDayColumn.value) indexes.push(indexOfOption(dayOptions.value, selectedDay()))
  if (showHourColumn.value) indexes.push(indexOfOption(hourOptions.value, selectedHour()))
  if (showMinuteColumn.value) indexes.push(indexOfOption(minuteOptions.value, selectedMinute()))
  wheelIndexes.value = indexes
}

function selectedOptionValue(options : Array<IWheelOption>, index : number, fallback : number) : number {
  if (options.length == 0) return fallback
  let safeIndex = index
  if (safeIndex < 0) safeIndex = 0
  if (safeIndex >= options.length) safeIndex = options.length - 1
  return options[safeIndex].value
}

function wheelIndexAt(values : Array<any | null>, index : number) : number {
  if (values.length <= index || values[index] == null) return 0
  const result = parseFloat(values[index].toString())
  if (isNaN(result) || result < 0) return 0
  return Math.floor(result)
}

const displayValue = computed(() : string => {
  if (normalizedMode.value == 'time') return currentTime.value
  if (normalizedMode.value == 'date') return currentDate.value
  if (normalizedMode.value == 'year-month') return currentDate.value.substring(0, 7)
  return currentDate.value + ' ' + currentTime.value
})

const panelStyle = computed(() : string => {
  const radius = formatSize(props.round)
  return 'border-radius:' + radius + ' ' + radius + ' 0 0;'
})

function currentTimestamp() : number {
  return dateTimeToTimestamp(currentDate.value, currentTime.value)
}

function clampTime(value : string) : string {
  const text = normalizeTime(value)
  const current = timeToMinutes(text)
  const minValue = validHour(props.minHour) * 60 + validMinute(props.minMinute)
  const maxValue = validHour(props.maxHour) * 60 + validMinute(props.maxMinute)
  let nextValue = current
  if (nextValue < minValue) nextValue = minValue
  if (nextValue > maxValue) nextValue = maxValue
  return padNumber(Math.floor(nextValue / 60)) + ':' + padNumber(nextValue % 60)
}

function outputValue() : any {
  if (normalizedMode.value == 'time') return currentTime.value
  return currentTimestamp()
}

function buildEvent() : IDatetimePickerEvent {
  return {
    value: outputValue(),
    date: currentDate.value,
    time: currentTime.value,
    timestamp: currentTimestamp(),
    mode: normalizedMode.value,
  }
}

function emitValue() : void {
  const event = buildEvent()
  emit('update:modelValue', event.value)
  emit('update:date', currentDate.value)
  emit('update:time', currentTime.value)
}

function applyValue(value : any) : void {
  if (normalizedMode.value == 'time') {
    currentTime.value = normalizeTime((value).toString())
    return
  }

  if (typeof value == 'number') {
    if (value > 0) {
      currentDate.value = formatDate(value)
      currentTime.value = formatTime(value)
    }
    return
  }

  const text = (value).toString()
  if (/^\d+$/.test(text)) {
    const timestamp = parseFloat(text)
    if (!isNaN(timestamp) && timestamp > 0) {
      currentDate.value = formatDate(timestamp)
      currentTime.value = formatTime(timestamp)
      return
    }
  }
  if (text.length >= 10) currentDate.value = text.substring(0, 10)
  if (text.length >= 16) currentTime.value = text.substring(11, 16)
}

function clampCurrent() : void {
  if (normalizedMode.value == 'time') {
    currentTime.value = clampTime(currentTime.value)
    return
  }

  let timestamp = currentTimestamp()
  const minValue = minDateValue()
  const maxValue = maxDateValue()
  if (timestamp < minValue) timestamp = minValue
  if (timestamp > maxValue) timestamp = maxValue
  currentDate.value = formatDate(timestamp)
  currentTime.value = formatTime(timestamp)
}

function syncFromProps() : void {
  const modelText = (props.modelValue).toString()
  if (modelText.length > 0) {
    applyValue(props.modelValue)
  } else {
    currentDate.value = props.date
    currentTime.value = props.time
  }
  clampCurrent()
  syncWheelIndexes()
}

function open() : void {
  if (opened.value) return
  syncFromProps()
  opened.value = true
  emit('open')
  emit('update:show', true)
}

function openByTrigger() : void {
  if (props.disabled) return
  open()
}

function close() : void {
  if (!opened.value) return
  opened.value = false
  emit('close')
  emit('update:show', false)
}

function cancel() : void {
  emit('cancel', buildEvent())
  close()
}

function confirm() : void {
  const event = buildEvent()
  emit('confirm', event)
  emitValue()
  close()
}

function handleOverlayClick() : void {
  if (!props.closeOnMask) return
  close()
}

function handleWheelChange(event : any) : void {
  if (props.disabled || props.loading || event == null || typeof event != 'object') return
  const detail = (event as UTSJSONObject)['detail']
  if (detail == null || typeof detail != 'object') return
  const rawValues = (detail as UTSJSONObject)['value']
  if (rawValues == null || !Array.isArray(rawValues)) return
  const values = rawValues as Array<any | null>

  // Keep the option lists from before the change. Year/month changes alter the
  // dependent columns, so the received indexes must be mapped before updating state.
  const previousYearOptions = yearOptions.value
  const previousMonthOptions = monthOptions.value
  const previousDayOptions = dayOptions.value
  const previousHourOptions = hourOptions.value
  const previousMinuteOptions = minuteOptions.value
  let valueIndex = 0
  let year = selectedYear()
  let month = selectedMonth()
  let day = selectedDay()
  let hour = selectedHour()
  let minute = selectedMinute()

  if (showYearColumn.value) {
    year = selectedOptionValue(previousYearOptions, wheelIndexAt(values, valueIndex), year)
    valueIndex++
  }
  if (showMonthColumn.value) {
    month = selectedOptionValue(previousMonthOptions, wheelIndexAt(values, valueIndex), month)
    valueIndex++
  }
  if (showDayColumn.value) {
    day = selectedOptionValue(previousDayOptions, wheelIndexAt(values, valueIndex), day)
    valueIndex++
  }
  if (showHourColumn.value) {
    hour = selectedOptionValue(previousHourOptions, wheelIndexAt(values, valueIndex), hour)
    valueIndex++
  }
  if (showMinuteColumn.value) {
    minute = selectedOptionValue(previousMinuteOptions, wheelIndexAt(values, valueIndex), minute)
    valueIndex++
  }

  const minDate = minDateParts()
  const maxDate = maxDateParts()
  const minMonth = year == minDate.getFullYear() ? minDate.getMonth() + 1 : 1
  const maxMonth = year == maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12
  if (month < minMonth) month = minMonth
  if (month > maxMonth) month = maxMonth
  const maxDay = daysInMonth(year, month)
  if (day < 1) day = 1
  if (day > maxDay) day = maxDay

  currentDate.value = dateFromParts(year, month, day, hour, minute).split(' ')[0]
  currentTime.value = padNumber(hour) + ':' + padNumber(minute)
  clampCurrent()
  syncWheelIndexes()
  emit('change', buildEvent())
  if (!props.showToolbar) emitValue()
}

watch(
  () : boolean => props.show,
  (nextValue : boolean) : void => {
    if (opened.value == nextValue) return
    opened.value = nextValue
    if (nextValue) {
      syncFromProps()
      emit('open')
    } else {
      emit('close')
    }
  },
)

watch(
  () : any => props.modelValue,
  () : void => {
    syncFromProps()
  },
)

watch(
  () : string => props.date,
  () : void => {
    syncFromProps()
  },
)

watch(
  () : string => props.time,
  () : void => {
    syncFromProps()
  },
)

watch(
  () : number => props.minDate,
  () : void => {
    clampCurrent()
  },
)

watch(
  () : number => props.maxDate,
  () : void => {
    clampCurrent()
  },
)

syncFromProps()

__expose({
  open,
  close,
  setFormatter() {
    // 微信小程序不支持通过 props 传函数，这里保留 DCloud uni-app x 兼容入口。
  },
})

return (): any | null => {

const _component_picker_view_column = resolveComponent("picker-view-column")
const _component_picker_view = resolveComponent("picker-view")

  return _cE("view", _uM({ class: "i-datetime-picker" }), [
    _cE("view", _uM({
      class: "i-datetime-picker__trigger",
      onClick: openByTrigger
    }), [
      renderSlot(_ctx.$slots, "trigger", {}, (): any[] => [
        renderSlot(_ctx.$slots, "default", {}, (): any[] => [
          _cE("view", _uM({ class: "i-datetime-picker__input" }), [
            _cE("text", _uM({ class: "i-datetime-picker__input-text" }), _tD(displayValue.value), 1 /* TEXT */),
            _cE("text", _uM({ class: "i-datetime-picker__arrow" }), "›")
          ])
        ])
      ])
    ]),
    isTrue(opened.value)
      ? _cE("view", _uM({
          key: 0,
          class: "i-datetime-picker__mask",
          onClick: handleOverlayClick
        }), [
          _cE("view", _uM({
            class: "i-datetime-picker__panel",
            style: _nS(panelStyle.value),
            onClick: withModifiers(() => {}, ["stop"])
          }), [
            isTrue(_ctx.showToolbar)
              ? _cE("view", _uM({
                  key: 0,
                  class: "i-datetime-picker__toolbar"
                }), [
                  _cE("text", _uM({
                    class: "i-datetime-picker__cancel",
                    style: _nS('color:' + _ctx.cancelColor + ';'),
                    onClick: cancel
                  }), _tD(_ctx.cancelText), 5 /* TEXT, STYLE */),
                  _cE("text", _uM({ class: "i-datetime-picker__title" }), _tD(_ctx.title), 1 /* TEXT */),
                  _cE("text", _uM({
                    class: "i-datetime-picker__confirm",
                    style: _nS('color:' + _ctx.confirmColor + ';'),
                    onClick: confirm
                  }), _tD(_ctx.confirmText), 5 /* TEXT, STYLE */)
                ])
              : _cC("v-if", true),
            isTrue(_ctx.loading)
              ? _cE("view", _uM({
                  key: 1,
                  class: "i-datetime-picker__loading"
                }), [
                  _cE("text", _uM({ class: "i-datetime-picker__loading-text" }), "加载中...")
                ])
              : _cC("v-if", true),
            _cV(_component_picker_view, _uM({
              class: "i-datetime-picker__columns",
              style: _nS(columnsStyle.value),
              value: wheelIndexes.value,
              "indicator-style": indicatorStyle.value,
              onChange: handleWheelChange
            }), _uM({
              default: withSlotCtx((): any[] => [
                isTrue(showYearColumn.value)
                  ? _cV(_component_picker_view_column, _uM({
                      key: 0,
                      class: "i-datetime-picker__column"
                    }), _uM({
                      default: withSlotCtx((): any[] => [
                        _cE(Fragment, null, RenderHelpers.renderList(yearOptions.value, (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: item.value,
                            class: "i-datetime-picker__item",
                            style: _nS(itemStyle.value)
                          }), [
                            _cE("text", _uM({ class: "i-datetime-picker__value" }), _tD(item.text), 1 /* TEXT */)
                          ], 4 /* STYLE */)
                        }), 128 /* KEYED_FRAGMENT */)
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _cC("v-if", true),
                isTrue(showMonthColumn.value)
                  ? _cV(_component_picker_view_column, _uM({
                      key: 1,
                      class: "i-datetime-picker__column"
                    }), _uM({
                      default: withSlotCtx((): any[] => [
                        _cE(Fragment, null, RenderHelpers.renderList(monthOptions.value, (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: item.value,
                            class: "i-datetime-picker__item",
                            style: _nS(itemStyle.value)
                          }), [
                            _cE("text", _uM({ class: "i-datetime-picker__value" }), _tD(item.text), 1 /* TEXT */)
                          ], 4 /* STYLE */)
                        }), 128 /* KEYED_FRAGMENT */)
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _cC("v-if", true),
                isTrue(showDayColumn.value)
                  ? _cV(_component_picker_view_column, _uM({
                      key: 2,
                      class: "i-datetime-picker__column"
                    }), _uM({
                      default: withSlotCtx((): any[] => [
                        _cE(Fragment, null, RenderHelpers.renderList(dayOptions.value, (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: item.value,
                            class: "i-datetime-picker__item",
                            style: _nS(itemStyle.value)
                          }), [
                            _cE("text", _uM({ class: "i-datetime-picker__value" }), _tD(item.text), 1 /* TEXT */)
                          ], 4 /* STYLE */)
                        }), 128 /* KEYED_FRAGMENT */)
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _cC("v-if", true),
                isTrue(showHourColumn.value)
                  ? _cV(_component_picker_view_column, _uM({
                      key: 3,
                      class: "i-datetime-picker__column"
                    }), _uM({
                      default: withSlotCtx((): any[] => [
                        _cE(Fragment, null, RenderHelpers.renderList(hourOptions.value, (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: item.value,
                            class: "i-datetime-picker__item",
                            style: _nS(itemStyle.value)
                          }), [
                            _cE("text", _uM({ class: "i-datetime-picker__value" }), _tD(item.text), 1 /* TEXT */)
                          ], 4 /* STYLE */)
                        }), 128 /* KEYED_FRAGMENT */)
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _cC("v-if", true),
                isTrue(showMinuteColumn.value)
                  ? _cV(_component_picker_view_column, _uM({
                      key: 4,
                      class: "i-datetime-picker__column"
                    }), _uM({
                      default: withSlotCtx((): any[] => [
                        _cE(Fragment, null, RenderHelpers.renderList(minuteOptions.value, (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: item.value,
                            class: "i-datetime-picker__item",
                            style: _nS(itemStyle.value)
                          }), [
                            _cE("text", _uM({ class: "i-datetime-picker__value" }), _tD(item.text), 1 /* TEXT */)
                          ], 4 /* STYLE */)
                        }), 128 /* KEYED_FRAGMENT */)
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _cC("v-if", true)
              ]),
              _: 1 /* STABLE */
            }), 8 /* PROPS */, ["style", "value", "indicator-style"])
          ], 12 /* STYLE, PROPS */, ["onClick"])
        ])
      : _cC("v-if", true)
  ])
}
}

})
export default __sfc__
export type IDatetimePickerComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesIUiXComponentsIDatetimePickerIDatetimePickerStyles = [_uM([["i-datetime-picker", _pS(_uM([["width", "100%"]]))], ["i-datetime-picker__trigger", _pS(_uM([["width", "100%"]]))], ["i-datetime-picker__input", _pS(_uM([["height", 44], ["paddingTop", 0], ["paddingRight", 12], ["paddingBottom", 0], ["paddingLeft", 12], ["borderTopLeftRadius", 8], ["borderTopRightRadius", 8], ["borderBottomRightRadius", 8], ["borderBottomLeftRadius", 8], ["backgroundColor", "#ffffff"], ["flexDirection", "row"], ["alignItems", "center"]]))], ["i-datetime-picker__input-text", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["color", "#303133"], ["fontSize", 14], ["lineHeight", "22px"]]))], ["i-datetime-picker__arrow", _pS(_uM([["width", 20], ["color", "#909193"], ["fontSize", 20], ["lineHeight", "24px"], ["textAlign", "right"], ["transform", "rotate(90deg)"]]))], ["i-datetime-picker__mask", _pS(_uM([["position", "fixed"], ["left", 0], ["right", 0], ["top", 0], ["bottom", 0], ["zIndex", 150], ["backgroundColor", "rgba(0,0,0,0.42)"], ["justifyContent", "flex-end"]]))], ["i-datetime-picker__panel", _pS(_uM([["overflow", "hidden"], ["backgroundColor", "#ffffff"]]))], ["i-datetime-picker__toolbar", _pS(_uM([["height", 48], ["paddingTop", 0], ["paddingRight", 16], ["paddingBottom", 0], ["paddingLeft", 16], ["borderBottomWidth", 1], ["borderBottomStyle", "solid"], ["borderBottomColor", "#eef0f4"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]]))], ["i-datetime-picker__cancel", _pS(_uM([["width", 64], ["fontSize", 14], ["lineHeight", "22px"]]))], ["i-datetime-picker__confirm", _pS(_uM([["width", 64], ["fontSize", 14], ["lineHeight", "22px"], ["textAlign", "right"]]))], ["i-datetime-picker__title", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["color", "#111827"], ["fontSize", 16], ["fontWeight", 700], ["lineHeight", "24px"], ["textAlign", "center"]]))], ["i-datetime-picker__loading", _pS(_uM([["position", "absolute"], ["left", 0], ["right", 0], ["top", 48], ["bottom", 0], ["zIndex", 2], ["backgroundColor", "rgba(255,255,255,0.78)"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-datetime-picker__loading-text", _pS(_uM([["color", "#606266"], ["fontSize", 14], ["lineHeight", "22px"]]))], ["i-datetime-picker__columns", _pS(_uM([["width", "100%"], ["height", 220]]))], ["i-datetime-picker__column", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["height", "100%"]]))], ["i-datetime-picker__item", _pS(_uM([["width", "100%"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["i-datetime-picker__value", _pS(_uM([["color", "#606266"], ["fontSize", 15], ["lineHeight", "44px"], ["textAlign", "center"]]))]])]
