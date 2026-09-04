@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import kotlin.properties.Delegates
open class GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any by `$props`
    open var show: Boolean by `$props`
    open var showToolbar: Boolean by `$props`
    open var title: String by `$props`
    open var mode: String by `$props`
    open var minDate: Number by `$props`
    open var maxDate: Number by `$props`
    open var minHour: Number by `$props`
    open var maxHour: Number by `$props`
    open var minMinute: Number by `$props`
    open var maxMinute: Number by `$props`
    open var loading: Boolean by `$props`
    open var cancelText: String by `$props`
    open var confirmText: String by `$props`
    open var cancelColor: String by `$props`
    open var confirmColor: String by `$props`
    open var closeOnMask: Boolean by `$props`
    open var round: Any by `$props`
    open var date: String by `$props`
    open var time: String by `$props`
    open var dateLabel: String by `$props`
    open var timeLabel: String by `$props`
    open var disabled: Boolean by `$props`
    open var open: () -> Unit
        get() {
            return unref(this.`$exposed`["open"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "open", value)
        }
    open var close: () -> Unit
        get() {
            return unref(this.`$exposed`["close"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "close", value)
        }
    open var setFormatter: () -> Unit
        get() {
            return unref(this.`$exposed`["setFormatter"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "setFormatter", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIDatetimePickerIDatetimePicker
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val opened = ref(props.show)
            val currentDate = ref(props.date)
            val currentTime = ref(props.time)
            val normalizedMode = computed(fun(): String {
                if (props.mode == "date") {
                    return "date"
                }
                if (props.mode == "time") {
                    return "time"
                }
                if (props.mode == "year-month") {
                    return "year-month"
                }
                return "datetime"
            }
            )
            fun gen_parseNumber_fn(value: String): Number {
                val parsed = parseInt(value, 10)
                return if (isNaN(parsed)) {
                    0
                } else {
                    parsed
                }
            }
            val parseNumber = ::gen_parseNumber_fn
            fun gen_normalizeTime_fn(value: String): String {
                if (value.length >= 5) {
                    return value.substring(0, 5)
                }
                return "00:00"
            }
            val normalizeTime = ::gen_normalizeTime_fn
            fun gen_timeToMinutes_fn(value: String): Number {
                return parseNumber(value.substring(0, 2)) * 60 + parseNumber(value.substring(3, 5))
            }
            val timeToMinutes = ::gen_timeToMinutes_fn
            fun gen_padNumber_fn(value: Number): String {
                return if (value < 10) {
                    "0" + value.toString(10)
                } else {
                    value.toString(10)
                }
            }
            val padNumber = ::gen_padNumber_fn
            fun gen_validHour_fn(value: Number): Number {
                if (value < 0) {
                    return 0
                }
                if (value > 23) {
                    return 23
                }
                return value
            }
            val validHour = ::gen_validHour_fn
            fun gen_validMinute_fn(value: Number): Number {
                if (value < 0) {
                    return 0
                }
                if (value > 59) {
                    return 59
                }
                return value
            }
            val validMinute = ::gen_validMinute_fn
            fun gen_dateTimeToTimestamp_fn(dateText: String, timeText: String): Number {
                val year = parseNumber(dateText.substring(0, 4))
                val month = parseNumber(dateText.substring(5, 7)) - 1
                val day = parseNumber(dateText.substring(8, 10))
                val hour = parseNumber(timeText.substring(0, 2))
                val minute = parseNumber(timeText.substring(3, 5))
                return Date(year, month, day, hour, minute, 0).getTime()
            }
            val dateTimeToTimestamp = ::gen_dateTimeToTimestamp_fn
            fun gen_formatDate_fn(timestamp: Number): String {
                val date = Date(timestamp)
                return (date.getFullYear().toString(10) + "-" + padNumber(date.getMonth() + 1) + "-" + padNumber(date.getDate()))
            }
            val formatDate = ::gen_formatDate_fn
            fun gen_formatTime_fn(timestamp: Number): String {
                val date = Date(timestamp)
                return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes())
            }
            val formatTime = ::gen_formatTime_fn
            fun gen_minDateValue_fn(): Number {
                if (props.minDate > 0) {
                    return props.minDate
                }
                val now = Date()
                return Date(now.getFullYear() - 10, now.getMonth(), now.getDate(), 0, 0, 0).getTime()
            }
            val minDateValue = ::gen_minDateValue_fn
            fun gen_maxDateValue_fn(): Number {
                if (props.maxDate > 0) {
                    return props.maxDate
                }
                val now = Date()
                return Date(now.getFullYear() + 10, now.getMonth(), now.getDate(), 23, 59, 59).getTime()
            }
            val maxDateValue = ::gen_maxDateValue_fn
            fun gen_currentTimestamp_fn(): Number {
                return dateTimeToTimestamp(currentDate.value, currentTime.value)
            }
            val currentTimestamp = ::gen_currentTimestamp_fn
            fun gen_clampTime_fn(value: String): String {
                val current = timeToMinutes(normalizeTime(value))
                val minValue = validHour(props.minHour) * 60 + validMinute(props.minMinute)
                val maxValue = validHour(props.maxHour) * 60 + validMinute(props.maxMinute)
                var nextValue = current
                if (nextValue < minValue) {
                    nextValue = minValue
                }
                if (nextValue > maxValue) {
                    nextValue = maxValue
                }
                return padNumber(Math.floor(nextValue / 60)) + ":" + padNumber(nextValue % 60)
            }
            val clampTime = ::gen_clampTime_fn
            fun gen_clampCurrent_fn(): Unit {
                if (normalizedMode.value == "time") {
                    currentTime.value = clampTime(currentTime.value)
                    return
                }
                var timestamp = currentTimestamp()
                val minValue = minDateValue()
                val maxValue = maxDateValue()
                if (timestamp < minValue) {
                    timestamp = minValue
                }
                if (timestamp > maxValue) {
                    timestamp = maxValue
                }
                currentDate.value = formatDate(timestamp)
                currentTime.value = formatTime(timestamp)
            }
            val clampCurrent = ::gen_clampCurrent_fn
            fun gen_boundaryStartTime_fn(): String {
                if (currentDate.value == formatDate(minDateValue())) {
                    return formatTime(minDateValue())
                }
                return "00:00"
            }
            val boundaryStartTime = ::gen_boundaryStartTime_fn
            fun gen_boundaryEndTime_fn(): String {
                if (currentDate.value == formatDate(maxDateValue())) {
                    return formatTime(maxDateValue())
                }
                return "23:59"
            }
            val boundaryEndTime = ::gen_boundaryEndTime_fn
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val showDateColumn = computed(fun(): Boolean {
                return normalizedMode.value != "time"
            }
            )
            val showTimeColumn = computed(fun(): Boolean {
                return normalizedMode.value == "datetime" || normalizedMode.value == "time"
            }
            )
            val dateFields = computed(fun(): String {
                if (normalizedMode.value == "year-month") {
                    return "month"
                }
                return "day"
            }
            )
            val datePickerValue = computed(fun(): String {
                if (normalizedMode.value == "year-month") {
                    return currentDate.value.substring(0, 7)
                }
                return currentDate.value
            }
            )
            val startDate = computed(fun(): String {
                return formatDate(minDateValue())
            }
            )
            val endDate = computed(fun(): String {
                return formatDate(maxDateValue())
            }
            )
            val startTime = computed(fun(): String {
                if (normalizedMode.value != "time") {
                    return boundaryStartTime()
                }
                return padNumber(validHour(props.minHour)) + ":" + padNumber(validMinute(props.minMinute))
            }
            )
            val endTime = computed(fun(): String {
                if (normalizedMode.value != "time") {
                    return boundaryEndTime()
                }
                return padNumber(validHour(props.maxHour)) + ":" + padNumber(validMinute(props.maxMinute))
            }
            )
            val displayValue = computed(fun(): String {
                if (normalizedMode.value == "time") {
                    return currentTime.value
                }
                if (normalizedMode.value == "date") {
                    return currentDate.value
                }
                if (normalizedMode.value == "year-month") {
                    return currentDate.value.substring(0, 7)
                }
                return currentDate.value + " " + currentTime.value
            }
            )
            val panelStyle = computed(fun(): String {
                val radius = formatSize(props.round)
                return "border-radius:" + radius + " " + radius + " 0 0;"
            }
            )
            fun gen_outputValue_fn(): Any {
                if (normalizedMode.value == "time") {
                    return currentTime.value
                }
                return currentTimestamp()
            }
            val outputValue = ::gen_outputValue_fn
            fun gen_buildEvent_fn(): UTSJSONObject {
                return _uO("value" to outputValue(), "date" to currentDate.value, "time" to currentTime.value, "timestamp" to currentTimestamp(), "mode" to normalizedMode.value)
            }
            val buildEvent = ::gen_buildEvent_fn
            fun gen_emitValue_fn(): Unit {
                emit("update:modelValue", outputValue())
                emit("update:date", currentDate.value)
                emit("update:time", currentTime.value)
            }
            val emitValue = ::gen_emitValue_fn
            fun gen_applyValue_fn(value: Any): Unit {
                if (normalizedMode.value == "time") {
                    currentTime.value = normalizeTime(value.toString())
                    return
                }
                if (UTSAndroid.`typeof`(value) == "number" && value as Number > 0) {
                    currentDate.value = formatDate(value as Number)
                    currentTime.value = formatTime(value as Number)
                    return
                }
                val text = value.toString()
                val timestamp = parseNumber(text)
                if (text.indexOf("-") < 0 && timestamp > 0) {
                    currentDate.value = formatDate(timestamp)
                    currentTime.value = formatTime(timestamp)
                    return
                }
                if (text.length >= 10) {
                    currentDate.value = text.substring(0, 10)
                }
                if (text.length >= 16) {
                    currentTime.value = text.substring(11, 16)
                }
            }
            val applyValue = ::gen_applyValue_fn
            fun gen_syncFromProps_fn(): Unit {
                if (props.modelValue != null && props.modelValue.toString().length > 0) {
                    applyValue(props.modelValue)
                } else {
                    currentDate.value = props.date
                    currentTime.value = props.time
                }
                clampCurrent()
            }
            val syncFromProps = ::gen_syncFromProps_fn
            fun gen_open_fn(): Unit {
                if (opened.value) {
                    return
                }
                syncFromProps()
                opened.value = true
                emit("open")
                emit("update:show", true)
            }
            val open = ::gen_open_fn
            fun gen_openByTrigger_fn(): Unit {
                if (props.disabled) {
                    return
                }
                open()
            }
            val openByTrigger = ::gen_openByTrigger_fn
            fun gen_close_fn(): Unit {
                if (!opened.value) {
                    return
                }
                opened.value = false
                emit("close")
                emit("update:show", false)
            }
            val close = ::gen_close_fn
            fun gen_cancel_fn(): Unit {
                emit("cancel", buildEvent())
                close()
            }
            val cancel = ::gen_cancel_fn
            fun gen_confirm_fn(): Unit {
                emit("confirm", buildEvent())
                emitValue()
                close()
            }
            val confirm = ::gen_confirm_fn
            fun gen_handleOverlayClick_fn(): Unit {
                if (!props.closeOnMask) {
                    return
                }
                close()
            }
            val handleOverlayClick = ::gen_handleOverlayClick_fn
            fun gen_handleDateChange_fn(event: UniPickerChangeEvent): Unit {
                val value = event.detail.value.toString()
                if (normalizedMode.value == "year-month") {
                    currentDate.value = value + "-01"
                } else {
                    currentDate.value = value
                }
                clampCurrent()
                emit("update:date", currentDate.value)
                emit("change", buildEvent())
                if (!props.showToolbar) {
                    emitValue()
                }
            }
            val handleDateChange = ::gen_handleDateChange_fn
            fun gen_handleTimeChange_fn(event: UniPickerChangeEvent): Unit {
                currentTime.value = event.detail.value.toString()
                clampCurrent()
                emit("update:time", currentTime.value)
                emit("change", buildEvent())
                if (!props.showToolbar) {
                    emitValue()
                }
            }
            val handleTimeChange = ::gen_handleTimeChange_fn
            watch(fun(): Boolean {
                return props.show
            }
            , fun(nextValue: Boolean): Unit {
                if (opened.value == nextValue) {
                    return
                }
                opened.value = nextValue
                if (nextValue) {
                    syncFromProps()
                    emit("open")
                } else {
                    emit("close")
                }
            }
            )
            watch(fun(): Any {
                return props.modelValue
            }
            , fun(): Unit {
                return syncFromProps()
            }
            )
            watch(fun(): String {
                return props.date
            }
            , fun(): Unit {
                return syncFromProps()
            }
            )
            watch(fun(): String {
                return props.time
            }
            , fun(): Unit {
                return syncFromProps()
            }
            )
            watch(fun(): Number {
                return props.minDate
            }
            , fun(): Unit {
                return clampCurrent()
            }
            )
            watch(fun(): Number {
                return props.maxDate
            }
            , fun(): Unit {
                return clampCurrent()
            }
            )
            syncFromProps()
            __expose(_uM("open" to open, "close" to close, "setFormatter" to fun() {}))
            return fun(): Any? {
                val _component_picker = resolveComponent("picker")
                return _cE("view", _uM("class" to "i-datetime-picker"), _uA(
                    _cE("view", _uM("class" to "i-datetime-picker__trigger", "onClick" to openByTrigger), _uA(
                        renderSlot(_ctx.`$slots`, "trigger", _uO(), fun(): UTSArray<Any> {
                            return _uA(
                                renderSlot(_ctx.`$slots`, "default", _uO(), fun(): UTSArray<Any> {
                                    return _uA(
                                        _cE("view", _uM("class" to "i-datetime-picker__input"), _uA(
                                            _cE("text", _uM("class" to "i-datetime-picker__input-text"), _tD(displayValue.value), 1),
                                            _cE("text", _uM("class" to "i-datetime-picker__arrow"), "›")
                                        ))
                                    )
                                }
                                )
                            )
                        }
                        )
                    )),
                    if (isTrue(opened.value)) {
                        _cE("view", _uM("key" to 0, "class" to "i-datetime-picker__mask", "onClick" to handleOverlayClick), _uA(
                            _cE("view", _uM("class" to "i-datetime-picker__panel", "style" to _nS(panelStyle.value), "onClick" to withModifiers(fun(){}, _uA(
                                "stop"
                            ))), _uA(
                                if (isTrue(_ctx.showToolbar)) {
                                    _cE("view", _uM("key" to 0, "class" to "i-datetime-picker__toolbar"), _uA(
                                        _cE("text", _uM("class" to "i-datetime-picker__cancel", "style" to _nS("color:" + _ctx.cancelColor + ";"), "onClick" to cancel), _tD(_ctx.cancelText), 5),
                                        _cE("text", _uM("class" to "i-datetime-picker__title"), _tD(_ctx.title), 1),
                                        _cE("text", _uM("class" to "i-datetime-picker__confirm", "style" to _nS("color:" + _ctx.confirmColor + ";"), "onClick" to confirm), _tD(_ctx.confirmText), 5)
                                    ))
                                } else {
                                    _cC("v-if", true)
                                },
                                if (isTrue(_ctx.loading)) {
                                    _cE("view", _uM("key" to 1, "class" to "i-datetime-picker__loading"), _uA(
                                        _cE("text", _uM("class" to "i-datetime-picker__loading-text"), "加载中...")
                                    ))
                                } else {
                                    _cC("v-if", true)
                                },
                                _cE("view", _uM("class" to "i-datetime-picker__body"), _uA(
                                    if (isTrue(showDateColumn.value)) {
                                        _cE("view", _uM("key" to 0, "class" to "i-datetime-picker__item-wrap"), _uA(
                                            _cE("text", _uM("class" to "i-datetime-picker__label"), _tD(_ctx.dateLabel), 1),
                                            _cV(_component_picker, _uM("mode" to "date", "value" to datePickerValue.value, "start" to startDate.value, "end" to endDate.value, "fields" to dateFields.value, "disabled" to if (isTruthy(_ctx.disabled)) {
                                                _ctx.disabled
                                            } else {
                                                _ctx.loading
                                            }, "onChange" to handleDateChange), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE("view", _uM("class" to "i-datetime-picker__item"), _uA(
                                                        _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(datePickerValue.value), 1)
                                                    ))
                                                )
                                            }), "_" to 1), 8, _uA(
                                                "value",
                                                "start",
                                                "end",
                                                "fields",
                                                "disabled"
                                            ))
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(showTimeColumn.value)) {
                                        _cE("view", _uM("key" to 1, "class" to "i-datetime-picker__item-wrap"), _uA(
                                            _cE("text", _uM("class" to "i-datetime-picker__label"), _tD(_ctx.timeLabel), 1),
                                            _cV(_component_picker, _uM("mode" to "time", "value" to currentTime.value, "start" to startTime.value, "end" to endTime.value, "disabled" to if (isTruthy(_ctx.disabled)) {
                                                _ctx.disabled
                                            } else {
                                                _ctx.loading
                                            }, "onChange" to handleTimeChange), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE("view", _uM("class" to "i-datetime-picker__item"), _uA(
                                                        _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(currentTime.value), 1)
                                                    ))
                                                )
                                            }), "_" to 1), 8, _uA(
                                                "value",
                                                "start",
                                                "end",
                                                "disabled"
                                            ))
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            ), 12, _uA(
                                "onClick"
                            ))
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                ))
            }
        }
        var name = "i-datetime-picker"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-datetime-picker" to _pS(_uM("width" to "100%")), "i-datetime-picker__trigger" to _pS(_uM("width" to "100%")), "i-datetime-picker__input" to _pS(_uM("height" to 44, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#ffffff", "flexDirection" to "row", "alignItems" to "center")), "i-datetime-picker__input-text" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#303133", "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__arrow" to _pS(_uM("width" to 20, "color" to "#909193", "fontSize" to 20, "lineHeight" to "24px", "textAlign" to "right", "transform" to "rotate(90deg)")), "i-datetime-picker__mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "zIndex" to 150, "backgroundColor" to "rgba(0,0,0,0.42)", "justifyContent" to "flex-end")), "i-datetime-picker__panel" to _pS(_uM("overflow" to "hidden", "backgroundColor" to "#ffffff")), "i-datetime-picker__toolbar" to _pS(_uM("height" to 48, "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eef0f4", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "i-datetime-picker__cancel" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__confirm" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px", "textAlign" to "right")), "i-datetime-picker__title" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#111827", "fontSize" to 16, "fontWeight" to 700, "lineHeight" to "24px", "textAlign" to "center")), "i-datetime-picker__loading" to _pS(_uM("position" to "absolute", "left" to 0, "right" to 0, "top" to 48, "bottom" to 0, "zIndex" to 2, "backgroundColor" to "rgba(255,255,255,0.78)", "alignItems" to "center", "justifyContent" to "center")), "i-datetime-picker__loading-text" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__body" to _pS(_uM("paddingTop" to 16, "paddingRight" to 16, "paddingBottom" to 16, "paddingLeft" to 16)), "i-datetime-picker__item-wrap" to _pS(_uM("marginBottom" to 12)), "i-datetime-picker__label" to _pS(_uM("marginBottom" to 8, "color" to "#909399", "fontSize" to 13, "lineHeight" to "20px")), "i-datetime-picker__item" to _pS(_uM("height" to 44, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#f5f7fa", "justifyContent" to "center")), "i-datetime-picker__value" to _pS(_uM("color" to "#303133", "fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("open" to null, "close" to null, "cancel" to null, "change" to null, "confirm" to null, "update:modelValue" to null, "update:show" to null, "update:date" to null, "update:time" to null)
        var props = _nP(_uM("modelValue" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "show" to _uM("type" to "Boolean", "default" to false), "showToolbar" to _uM("type" to "Boolean", "default" to true), "title" to _uM("type" to "String", "default" to "请选择"), "mode" to _uM("type" to "String", "default" to "datetime"), "minDate" to _uM("type" to "Number", "default" to 0), "maxDate" to _uM("type" to "Number", "default" to 0), "minHour" to _uM("type" to "Number", "default" to 0), "maxHour" to _uM("type" to "Number", "default" to 23), "minMinute" to _uM("type" to "Number", "default" to 0), "maxMinute" to _uM("type" to "Number", "default" to 59), "loading" to _uM("type" to "Boolean", "default" to false), "cancelText" to _uM("type" to "String", "default" to "取消"), "confirmText" to _uM("type" to "String", "default" to "确认"), "cancelColor" to _uM("type" to "String", "default" to "#909193"), "confirmColor" to _uM("type" to "String", "default" to "#3c9cff"), "closeOnMask" to _uM("type" to "Boolean", "default" to true), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 16), "date" to _uM("type" to "String", "default" to "2026-05-22"), "time" to _uM("type" to "String", "default" to "16:30"), "dateLabel" to _uM("type" to "String", "default" to "日期"), "timeLabel" to _uM("type" to "String", "default" to "时间"), "disabled" to _uM("type" to "Boolean", "default" to false)))
        var propsNeedCastKeys = _uA(
            "modelValue",
            "show",
            "showToolbar",
            "title",
            "mode",
            "minDate",
            "maxDate",
            "minHour",
            "maxHour",
            "minMinute",
            "maxMinute",
            "loading",
            "cancelText",
            "confirmText",
            "cancelColor",
            "confirmColor",
            "closeOnMask",
            "round",
            "date",
            "time",
            "dateLabel",
            "timeLabel",
            "disabled"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
