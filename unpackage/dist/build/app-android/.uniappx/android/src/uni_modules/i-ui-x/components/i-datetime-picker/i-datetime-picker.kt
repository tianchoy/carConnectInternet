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
            fun gen_padNumber_fn(value: Any): String {
                val numberValue = parseFloat(value.toString())
                return if (numberValue < 10) {
                    "0" + numberValue.toString(10)
                } else {
                    numberValue.toString(10)
                }
            }
            val padNumber = ::gen_padNumber_fn
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
            fun gen_validHour_fn(value: Any): Number {
                val numberValue = parseFloat(value.toString())
                if (numberValue < 0) {
                    return 0
                }
                if (numberValue > 23) {
                    return 23
                }
                return numberValue
            }
            val validHour = ::gen_validHour_fn
            fun gen_validMinute_fn(value: Any): Number {
                val numberValue = parseFloat(value.toString())
                if (numberValue < 0) {
                    return 0
                }
                if (numberValue > 59) {
                    return 59
                }
                return numberValue
            }
            val validMinute = ::gen_validMinute_fn
            fun gen_timeToMinutes_fn(value: String): Number {
                return parseFloat(value.substring(0, 2).toString()) * 60 + parseFloat(value.substring(3, 5).toString())
            }
            val timeToMinutes = ::gen_timeToMinutes_fn
            fun gen_normalizeTime_fn(value: String): String {
                if (value.length >= 5) {
                    return value.substring(0, 5)
                }
                return "00:00"
            }
            val normalizeTime = ::gen_normalizeTime_fn
            fun gen_dateTimeToTimestamp_fn(dateText: String, timeText: String): Number {
                val year = parseFloat(dateText.substring(0, 4).toString())
                val month = parseFloat(dateText.substring(5, 7).toString()) - 1
                val day = parseFloat(dateText.substring(8, 10).toString())
                val hour = parseFloat(timeText.substring(0, 2).toString())
                val minute = parseFloat(timeText.substring(3, 5).toString())
                return Date(year, month, day, hour, minute, 0).getTime()
            }
            val dateTimeToTimestamp = ::gen_dateTimeToTimestamp_fn
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
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val opened = ref(props.show)
            val currentDate = ref(props.date)
            val currentTime = ref(props.time)
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
            fun gen_datePart_fn(value: String, index: Number, fallback: Number): Number {
                val parts = value.split(UTSRegExp("[- :]", ""))
                if (parts.length <= index) {
                    return fallback
                }
                val parsed = parseFloat(parts[index])
                return if (isNaN(parsed)) {
                    fallback
                } else {
                    parsed
                }
            }
            val datePart = ::gen_datePart_fn
            fun optionRange(start: Number, end: Number, suffix: String, pad: Boolean = false): UTSArray<IWheelOption> {
                val result: UTSArray<IWheelOption> = _uA()
                run {
                    var value = start
                    while(value <= end){
                        val text = if (pad) {
                            padNumber(value)
                        } else {
                            value.toString(10)
                        }
                        result.push(IWheelOption(value = value, text = text + suffix))
                        value++
                    }
                }
                return result
            }
            fun gen_dateFromParts_fn(year: Number, month: Number, day: Number, hour: Number, minute: Number): String {
                return year.toString(10) + "-" + padNumber(month) + "-" + padNumber(day) + " " + padNumber(hour) + ":" + padNumber(minute)
            }
            val dateFromParts = ::gen_dateFromParts_fn
            fun gen_daysInMonth_fn(year: Number, month: Number): Number {
                return Date(year, month, 0).getDate()
            }
            val daysInMonth = ::gen_daysInMonth_fn
            fun gen_selectedYear_fn(): Number {
                return datePart(currentDate.value, 0, Date().getFullYear())
            }
            val selectedYear = ::gen_selectedYear_fn
            fun gen_selectedMonth_fn(): Number {
                return datePart(currentDate.value, 1, Date().getMonth() + 1)
            }
            val selectedMonth = ::gen_selectedMonth_fn
            fun gen_selectedDay_fn(): Number {
                return datePart(currentDate.value, 2, Date().getDate())
            }
            val selectedDay = ::gen_selectedDay_fn
            fun gen_selectedHour_fn(): Number {
                return datePart(currentTime.value, 0, 0)
            }
            val selectedHour = ::gen_selectedHour_fn
            fun gen_selectedMinute_fn(): Number {
                return datePart(currentTime.value, 1, 0)
            }
            val selectedMinute = ::gen_selectedMinute_fn
            fun gen_minDateParts_fn(): Date {
                return Date(minDateValue())
            }
            val minDateParts = ::gen_minDateParts_fn
            fun gen_maxDateParts_fn(): Date {
                return Date(maxDateValue())
            }
            val maxDateParts = ::gen_maxDateParts_fn
            val showYearColumn = computed(fun(): Boolean {
                return normalizedMode.value != "time"
            }
            )
            val showMonthColumn = computed(fun(): Boolean {
                return normalizedMode.value != "time"
            }
            )
            val showDayColumn = computed(fun(): Boolean {
                return normalizedMode.value == "datetime" || normalizedMode.value == "date"
            }
            )
            val showHourColumn = computed(fun(): Boolean {
                return normalizedMode.value == "datetime" || normalizedMode.value == "time"
            }
            )
            val showMinuteColumn = computed(fun(): Boolean {
                return normalizedMode.value == "datetime" || normalizedMode.value == "time"
            }
            )
            val yearOptions = computed(fun(): UTSArray<IWheelOption> {
                val minYear = minDateParts().getFullYear()
                val maxYear = maxDateParts().getFullYear()
                return optionRange(minYear, maxYear, "年")
            }
            )
            val columnsStyle = computed(fun(): String {
                return "width:100%;height:220px;"
            }
            )
            val indicatorStyle = computed(fun(): String {
                return "height:44px;background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;"
            }
            )
            val itemStyle = computed(fun(): String {
                return "height:44px;"
            }
            )
            val monthOptions = computed(fun(): UTSArray<IWheelOption> {
                var firstMonth: Number = 1
                var lastMonth: Number = 12
                val minDate = minDateParts()
                val maxDate = maxDateParts()
                if (selectedYear() == minDate.getFullYear()) {
                    firstMonth = minDate.getMonth() + 1
                }
                if (selectedYear() == maxDate.getFullYear()) {
                    lastMonth = maxDate.getMonth() + 1
                }
                return optionRange(firstMonth, lastMonth, "月")
            }
            )
            val dayOptions = computed(fun(): UTSArray<IWheelOption> {
                var firstDay: Number = 1
                var lastDay = daysInMonth(selectedYear(), selectedMonth())
                val minDate = minDateParts()
                val maxDate = maxDateParts()
                if (selectedYear() == minDate.getFullYear() && selectedMonth() == minDate.getMonth() + 1) {
                    firstDay = minDate.getDate()
                }
                if (selectedYear() == maxDate.getFullYear() && selectedMonth() == maxDate.getMonth() + 1) {
                    lastDay = maxDate.getDate()
                }
                if (firstDay > lastDay) {
                    firstDay = lastDay
                }
                return optionRange(firstDay, lastDay, "日")
            }
            )
            fun gen_hourRange_fn(): UTSArray<Number> {
                var firstHour: Number = 0
                var lastHour: Number = 23
                if (normalizedMode.value == "time") {
                    firstHour = validHour(props.minHour)
                    lastHour = validHour(props.maxHour)
                } else {
                    val timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value)
                    if (formatDate(timestampDate) == formatDate(minDateValue())) {
                        firstHour = Date(minDateValue()).getHours()
                    }
                    if (formatDate(timestampDate) == formatDate(maxDateValue())) {
                        lastHour = Date(maxDateValue()).getHours()
                    }
                }
                return _uA(
                    firstHour,
                    lastHour
                )
            }
            val hourRange = ::gen_hourRange_fn
            val hourOptions = computed(fun(): UTSArray<IWheelOption> {
                val range = hourRange()
                return optionRange(range[0], range[1], "时", true)
            }
            )
            fun gen_minuteRange_fn(): UTSArray<Number> {
                var firstMinute: Number = 0
                var lastMinute: Number = 59
                val range = hourRange()
                val hour = selectedHour()
                if (normalizedMode.value == "time") {
                    if (hour == range[0]) {
                        firstMinute = validMinute(props.minMinute)
                    }
                    if (hour == range[1]) {
                        lastMinute = validMinute(props.maxMinute)
                    }
                } else {
                    val timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value)
                    if (formatDate(timestampDate) == formatDate(minDateValue()) && hour == Date(minDateValue()).getHours()) {
                        firstMinute = Date(minDateValue()).getMinutes()
                    }
                    if (formatDate(timestampDate) == formatDate(maxDateValue()) && hour == Date(maxDateValue()).getHours()) {
                        lastMinute = Date(maxDateValue()).getMinutes()
                    }
                }
                return _uA(
                    firstMinute,
                    lastMinute
                )
            }
            val minuteRange = ::gen_minuteRange_fn
            val minuteOptions = computed(fun(): UTSArray<IWheelOption> {
                val range = minuteRange()
                return optionRange(range[0], range[1], "分", true)
            }
            )
            val wheelIndexes = ref(_uA<Number>())
            fun gen_indexOfOption_fn(options: UTSArray<IWheelOption>, value: Number): Number {
                run {
                    var index: Number = 0
                    while(index < options.length){
                        if (options[index].value == value) {
                            return index
                        }
                        index++
                    }
                }
                return 0
            }
            val indexOfOption = ::gen_indexOfOption_fn
            fun gen_syncWheelIndexes_fn(): Unit {
                val indexes: UTSArray<Number> = _uA()
                if (showYearColumn.value) {
                    indexes.push(indexOfOption(yearOptions.value, selectedYear()))
                }
                if (showMonthColumn.value) {
                    indexes.push(indexOfOption(monthOptions.value, selectedMonth()))
                }
                if (showDayColumn.value) {
                    indexes.push(indexOfOption(dayOptions.value, selectedDay()))
                }
                if (showHourColumn.value) {
                    indexes.push(indexOfOption(hourOptions.value, selectedHour()))
                }
                if (showMinuteColumn.value) {
                    indexes.push(indexOfOption(minuteOptions.value, selectedMinute()))
                }
                wheelIndexes.value = indexes
            }
            val syncWheelIndexes = ::gen_syncWheelIndexes_fn
            fun gen_selectedOptionValue_fn(options: UTSArray<IWheelOption>, index: Number, fallback: Number): Number {
                if (options.length == 0) {
                    return fallback
                }
                var safeIndex = index
                if (safeIndex < 0) {
                    safeIndex = 0
                }
                if (safeIndex >= options.length) {
                    safeIndex = options.length - 1
                }
                return options[safeIndex].value
            }
            val selectedOptionValue = ::gen_selectedOptionValue_fn
            fun gen_wheelIndexAt_fn(values: UTSArray<Any?>, index: Number): Number {
                if (values.length <= index || values[index] == null) {
                    return 0
                }
                val result = parseFloat(values[index].toString())
                if (isNaN(result) || result < 0) {
                    return 0
                }
                return Math.floor(result)
            }
            val wheelIndexAt = ::gen_wheelIndexAt_fn
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
            fun gen_currentTimestamp_fn(): Number {
                return dateTimeToTimestamp(currentDate.value, currentTime.value)
            }
            val currentTimestamp = ::gen_currentTimestamp_fn
            fun gen_clampTime_fn(value: String): String {
                val text = normalizeTime(value)
                val current = timeToMinutes(text)
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
            fun gen_outputValue_fn(): Any {
                if (normalizedMode.value == "time") {
                    return currentTime.value
                }
                return currentTimestamp()
            }
            val outputValue = ::gen_outputValue_fn
            fun gen_buildEvent_fn(): IDatetimePickerEvent {
                return IDatetimePickerEvent(value = outputValue(), date = currentDate.value, time = currentTime.value, timestamp = currentTimestamp(), mode = normalizedMode.value)
            }
            val buildEvent = ::gen_buildEvent_fn
            fun gen_emitValue_fn(): Unit {
                val event = buildEvent()
                emit("update:modelValue", event.value)
                emit("update:date", currentDate.value)
                emit("update:time", currentTime.value)
            }
            val emitValue = ::gen_emitValue_fn
            fun gen_applyValue_fn(value: Any): Unit {
                if (normalizedMode.value == "time") {
                    currentTime.value = normalizeTime(value.toString())
                    return
                }
                if (UTSAndroid.`typeof`(value) == "number") {
                    if (value as Number > 0) {
                        currentDate.value = formatDate(value as Number)
                        currentTime.value = formatTime(value as Number)
                    }
                    return
                }
                val text = value.toString()
                if (UTSRegExp("^\\d+\$", "").test(text)) {
                    val timestamp = parseFloat(text)
                    if (!isNaN(timestamp) && timestamp > 0) {
                        currentDate.value = formatDate(timestamp)
                        currentTime.value = formatTime(timestamp)
                        return
                    }
                }
                if (text.length >= 10) {
                    currentDate.value = text.substring(0, 10)
                }
                if (text.length >= 16) {
                    currentTime.value = text.substring(11, 16)
                }
            }
            val applyValue = ::gen_applyValue_fn
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
            fun gen_syncFromProps_fn(): Unit {
                val modelText = props.modelValue.toString()
                if (modelText.length > 0) {
                    applyValue(props.modelValue)
                } else {
                    currentDate.value = props.date
                    currentTime.value = props.time
                }
                clampCurrent()
                syncWheelIndexes()
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
                val event = buildEvent()
                emit("confirm", event)
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
            fun gen_handleWheelChange_fn(event: Any): Unit {
                if (props.disabled || props.loading || event == null || UTSAndroid.`typeof`(event) != "object") {
                    return
                }
                val detail = (event as UTSJSONObject)["detail"]
                if (detail == null || UTSAndroid.`typeof`(detail) != "object") {
                    return
                }
                val rawValues = (detail as UTSJSONObject)["value"]
                if (rawValues == null || !UTSArray.isArray(rawValues)) {
                    return
                }
                val values = rawValues as UTSArray<Any?>
                val previousYearOptions = yearOptions.value
                val previousMonthOptions = monthOptions.value
                val previousDayOptions = dayOptions.value
                val previousHourOptions = hourOptions.value
                val previousMinuteOptions = minuteOptions.value
                var valueIndex: Number = 0
                var year = selectedYear()
                var month = selectedMonth()
                var day = selectedDay()
                var hour = selectedHour()
                var minute = selectedMinute()
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
                val minDate = minDateParts()
                val maxDate = maxDateParts()
                val minMonth = if (year == minDate.getFullYear()) {
                    minDate.getMonth() + 1
                } else {
                    1
                }
                val maxMonth = if (year == maxDate.getFullYear()) {
                    maxDate.getMonth() + 1
                } else {
                    12
                }
                if (month < minMonth) {
                    month = minMonth
                }
                if (month > maxMonth) {
                    month = maxMonth
                }
                val maxDay = daysInMonth(year, month)
                if (day < 1) {
                    day = 1
                }
                if (day > maxDay) {
                    day = maxDay
                }
                currentDate.value = dateFromParts(year, month, day, hour, minute).split(" ")[0]
                currentTime.value = padNumber(hour) + ":" + padNumber(minute)
                clampCurrent()
                syncWheelIndexes()
                emit("change", buildEvent())
                if (!props.showToolbar) {
                    emitValue()
                }
            }
            val handleWheelChange = ::gen_handleWheelChange_fn
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
                syncFromProps()
            }
            )
            watch(fun(): String {
                return props.date
            }
            , fun(): Unit {
                syncFromProps()
            }
            )
            watch(fun(): String {
                return props.time
            }
            , fun(): Unit {
                syncFromProps()
            }
            )
            watch(fun(): Number {
                return props.minDate
            }
            , fun(): Unit {
                clampCurrent()
            }
            )
            watch(fun(): Number {
                return props.maxDate
            }
            , fun(): Unit {
                clampCurrent()
            }
            )
            syncFromProps()
            __expose(_uM("open" to open, "close" to close, "setFormatter" to fun() {}))
            return fun(): Any? {
                val _component_picker_view_column = resolveComponent("picker-view-column")
                val _component_picker_view = resolveComponent("picker-view")
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
                                _cV(_component_picker_view, _uM("class" to "i-datetime-picker__columns", "style" to _nS(columnsStyle.value), "value" to wheelIndexes.value, "indicator-style" to indicatorStyle.value, "onChange" to handleWheelChange), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        if (isTrue(showYearColumn.value)) {
                                            _cV(_component_picker_view_column, _uM("key" to 0, "class" to "i-datetime-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(yearOptions.value, fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to "i-datetime-picker__item", "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(item.text), 1)
                                                        ), 4)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(showMonthColumn.value)) {
                                            _cV(_component_picker_view_column, _uM("key" to 1, "class" to "i-datetime-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(monthOptions.value, fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to "i-datetime-picker__item", "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(item.text), 1)
                                                        ), 4)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(showDayColumn.value)) {
                                            _cV(_component_picker_view_column, _uM("key" to 2, "class" to "i-datetime-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(dayOptions.value, fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to "i-datetime-picker__item", "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(item.text), 1)
                                                        ), 4)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(showHourColumn.value)) {
                                            _cV(_component_picker_view_column, _uM("key" to 3, "class" to "i-datetime-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(hourOptions.value, fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to "i-datetime-picker__item", "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(item.text), 1)
                                                        ), 4)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (isTrue(showMinuteColumn.value)) {
                                            _cV(_component_picker_view_column, _uM("key" to 4, "class" to "i-datetime-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(minuteOptions.value, fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to "i-datetime-picker__item", "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to "i-datetime-picker__value"), _tD(item.text), 1)
                                                        ), 4)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    )
                                }), "_" to 1), 8, _uA(
                                    "style",
                                    "value",
                                    "indicator-style"
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
                return _uM("i-datetime-picker" to _pS(_uM("width" to "100%")), "i-datetime-picker__trigger" to _pS(_uM("width" to "100%")), "i-datetime-picker__input" to _pS(_uM("height" to 44, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#ffffff", "flexDirection" to "row", "alignItems" to "center")), "i-datetime-picker__input-text" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#303133", "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__arrow" to _pS(_uM("width" to 20, "color" to "#909193", "fontSize" to 20, "lineHeight" to "24px", "textAlign" to "right", "transform" to "rotate(90deg)")), "i-datetime-picker__mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "zIndex" to 150, "backgroundColor" to "rgba(0,0,0,0.42)", "justifyContent" to "flex-end")), "i-datetime-picker__panel" to _pS(_uM("overflow" to "hidden", "backgroundColor" to "#ffffff")), "i-datetime-picker__toolbar" to _pS(_uM("height" to 48, "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eef0f4", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "i-datetime-picker__cancel" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__confirm" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px", "textAlign" to "right")), "i-datetime-picker__title" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#111827", "fontSize" to 16, "fontWeight" to 700, "lineHeight" to "24px", "textAlign" to "center")), "i-datetime-picker__loading" to _pS(_uM("position" to "absolute", "left" to 0, "right" to 0, "top" to 48, "bottom" to 0, "zIndex" to 2, "backgroundColor" to "rgba(255,255,255,0.78)", "alignItems" to "center", "justifyContent" to "center")), "i-datetime-picker__loading-text" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px")), "i-datetime-picker__columns" to _pS(_uM("width" to "100%", "height" to 220)), "i-datetime-picker__column" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to "100%")), "i-datetime-picker__item" to _pS(_uM("width" to "100%", "alignItems" to "center", "justifyContent" to "center")), "i-datetime-picker__value" to _pS(_uM("color" to "#606266", "fontSize" to 15, "lineHeight" to "44px", "textAlign" to "center")))
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
