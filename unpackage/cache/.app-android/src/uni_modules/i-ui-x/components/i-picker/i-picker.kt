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
open class GenUniModulesIUiXComponentsIPickerIPicker : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any by `$props`
    open var show: Boolean by `$props`
    open var showToolbar: Boolean by `$props`
    open var title: String by `$props`
    open var columns: UTSArray<Any?> by `$props`
    open var loading: Boolean by `$props`
    open var itemHeight: Any by `$props`
    open var cancelText: String by `$props`
    open var confirmText: String by `$props`
    open var cancelColor: String by `$props`
    open var confirmColor: String by `$props`
    open var visibleItemCount: Any by `$props`
    open var closeOnMask: Boolean by `$props`
    open var defaultIndex: Any by `$props`
    open var immediateChange: Boolean by `$props`
    open var round: Any by `$props`
    open var showInput: Boolean by `$props`
    open var showDefaultValue: Boolean by `$props`
    open var options: UTSArray<Any?> by `$props`
    open var value: Any by `$props`
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
    open var clear: () -> Unit
        get() {
            return unref(this.`$exposed`["clear"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "clear", value)
        }
    open var getIndexs: () -> UTSArray<Any?>
        get() {
            return unref(this.`$exposed`["getIndexs"]) as () -> UTSArray<Any?>
        }
        set(value) {
            setRefValue(this.`$exposed`, "getIndexs", value)
        }
    open var getValues: () -> UTSArray<Any?>
        get() {
            return unref(this.`$exposed`["getValues"]) as () -> UTSArray<Any?>
        }
        set(value) {
            setRefValue(this.`$exposed`, "getValues", value)
        }
    open var getColumns: () -> UTSArray<UTSArray<Any?>>
        get() {
            return unref(this.`$exposed`["getColumns"]) as () -> UTSArray<UTSArray<Any?>>
        }
        set(value) {
            setRefValue(this.`$exposed`, "getColumns", value)
        }
    open var getColumnValues: (columnIndex) -> UTSArray<Any?>
        get() {
            return unref(this.`$exposed`["getColumnValues"]) as (columnIndex) -> UTSArray<Any?>
        }
        set(value) {
            setRefValue(this.`$exposed`, "getColumnValues", value)
        }
    open var setColumnValues: (columnIndex, values) -> Unit
        get() {
            return unref(this.`$exposed`["setColumnValues"]) as (columnIndex, values) -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "setColumnValues", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIPickerIPicker, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIPickerIPicker
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val opened = ref(props.show)
            val currentIndexs = ref(_uA())
            val normalizedColumns = computed(fun(): UTSArray<UTSArray<Any?>> {
                val source = if (props.columns.length > 0) {
                    props.columns
                } else {
                    props.options
                }
                if (source.length == 0) {
                    return _uA()
                }
                val first = source[0]
                if (isArray(first)) {
                    val result = _uA()
                    run {
                        var i: Number = 0
                        while(i < source.length){
                            result.push(normalizeColumn(source[i]))
                            i++
                        }
                    }
                    return result
                }
                return _uA(
                    normalizeColumn(source)
                )
            }
            )
            val displayText = computed(fun(): String {
                val items = selectedItems()
                if (items.length == 0) {
                    return "请选择"
                }
                val texts = _uA()
                run {
                    var i: Number = 0
                    while(i < items.length){
                        texts.push(items[i].text)
                        i++
                    }
                }
                return texts.join(" / ")
            }
            )
            val displayTextClass = computed(fun(): String {
                return if (selectedItems().length == 0) {
                    "i-picker__input-text i-picker__input-text--placeholder"
                } else {
                    "i-picker__input-text"
                }
            }
            )
            val columnCount = computed(fun(): Number {
                return normalizedColumns.value.length
            }
            )
            val column0 = computed(fun(): UTSArray<Any?> {
                return columnAt(0)
            }
            )
            val column1 = computed(fun(): UTSArray<Any?> {
                return columnAt(1)
            }
            )
            val column2 = computed(fun(): UTSArray<Any?> {
                return columnAt(2)
            }
            )
            val column3 = computed(fun(): UTSArray<Any?> {
                return columnAt(3)
            }
            )
            val column4 = computed(fun(): UTSArray<Any?> {
                return columnAt(4)
            }
            )
            val column5 = computed(fun(): UTSArray<Any?> {
                return columnAt(5)
            }
            )
            val columnsStyle = computed(fun(): String {
                val height = itemHeightNumber() * visibleCountNumber()
                return "width:100%;height:" + String(height) + "px;"
            }
            )
            val indicatorStyle = computed(fun(): String {
                return ("height:" + formatSize(props.itemHeight) + ";background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;")
            }
            )
            val itemStyle = computed(fun(): String {
                return "height:" + formatSize(props.itemHeight) + ";"
            }
            )
            val panelStyle = computed(fun(): String {
                val radius = formatSize(props.round)
                return "border-radius:" + radius + " " + radius + " 0 0;"
            }
            )
            watch(fun(){
                return props.show
            }
            , fun(nextValue){
                if (opened.value == nextValue) {
                    return
                }
                opened.value = nextValue
                if (nextValue) {
                    syncIndexs()
                    emit("open")
                } else {
                    emit("close")
                }
            }
            )
            watch(fun(){
                return props.modelValue
            }
            , fun(){
                syncIndexs()
            }
            )
            watch(fun(){
                return props.value
            }
            , fun(){
                syncIndexs()
            }
            )
            watch(fun(){
                return props.columns
            }
            , fun(){
                syncIndexs()
            }
            )
            watch(fun(){
                return props.defaultIndex
            }
            , fun(){
                syncIndexs()
            }
            )
            syncIndexs()
            fun gen_openByTrigger_fn() {
                if (props.disabled) {
                    return
                }
                open()
            }
            val openByTrigger = ::gen_openByTrigger_fn
            fun gen_open_fn() {
                if (opened.value) {
                    return
                }
                syncIndexs()
                opened.value = true
                emit("open")
                emit("update:show", true)
            }
            val open = ::gen_open_fn
            fun gen_close_fn() {
                if (!opened.value) {
                    return
                }
                opened.value = false
                emit("close")
                emit("update:show", false)
            }
            val close = ::gen_close_fn
            fun gen_cancel_fn() {
                emit("cancel", buildChangeEvent(0, selectedIndexAt(0)))
                close()
            }
            val cancel = ::gen_cancel_fn
            fun gen_confirm_fn() {
                val event = buildConfirmEvent()
                emit("confirm", event)
                emitSelectedValue()
                close()
            }
            val confirm = ::gen_confirm_fn
            fun gen_clear_fn() {
                currentIndexs.value = _uA()
                emit("clear")
                emit("change", buildChangeEvent(0, -1))
                emit("update:value", "")
                emit("update:modelValue", "")
            }
            val clear = ::gen_clear_fn
            fun gen_handleOverlayClick_fn() {
                if (!props.closeOnMask) {
                    return
                }
                close()
            }
            val handleOverlayClick = ::gen_handleOverlayClick_fn
            fun gen_handlePickerChange_fn(event) {
                if (props.disabled || props.loading) {
                    return
                }
                val values = event.detail.value
                val nextIndexs = _uA()
                var changedColumnIndex: Number = 0
                run {
                    var i: Number = 0
                    while(i < normalizedColumns.value.length){
                        val column = normalizedColumns.value[i]
                        val oldIndex = selectedIndexAt(i)
                        var nextIndex: Number = 0
                        if (values.length > i) {
                            nextIndex = Number(values[i])
                        }
                        if (nextIndex < 0) {
                            nextIndex = 0
                        }
                        if (nextIndex >= column.length) {
                            nextIndex = column.length - 1
                        }
                        if (column.length > 0 && isTruthy(column[nextIndex].disabled)) {
                            nextIndex = oldIndex
                        }
                        if (oldIndex != nextIndex) {
                            changedColumnIndex = i
                        }
                        nextIndexs.push(nextIndex)
                        i++
                    }
                }
                currentIndexs.value = nextIndexs
                val eventValue = buildChangeEvent(changedColumnIndex, selectedIndexAt(changedColumnIndex))
                emit("change", eventValue)
                if (props.immediateChange) {
                    emitSelectedValue()
                }
            }
            val handlePickerChange = ::gen_handlePickerChange_fn
            fun gen_emitSelectedValue_fn() {
                val value = selectedValue()
                emit("update:modelValue", value)
                emit("update:value", if (isArray(value)) {
                    ""
                } else {
                    value
                }
                )
            }
            val emitSelectedValue = ::gen_emitSelectedValue_fn
            fun gen_syncIndexs_fn() {
                val columns = normalizedColumns.value
                val result = _uA()
                val value = activeModelValue()
                run {
                    var i: Number = 0
                    while(i < columns.length){
                        val column = columns[i]
                        val targetValue = columnTargetValue(value, i)
                        var index: Number = -1
                        if (targetValue != null && String(targetValue).length > 0) {
                            index = findValueIndex(column, targetValue)
                        }
                        if (index < 0 && (props.showDefaultValue || !hasModelValue())) {
                            index = defaultIndexAt(i)
                        }
                        if (index < 0) {
                            index = 0
                        }
                        if (index >= column.length) {
                            index = column.length - 1
                        }
                        result.push(index)
                        i++
                    }
                }
                currentIndexs.value = result
            }
            val syncIndexs = ::gen_syncIndexs_fn
            fun gen_activeModelValue_fn(): Any? {
                if (hasModelValue()) {
                    return props.modelValue
                }
                if (String(props.value).length > 0) {
                    return props.value
                }
                return null
            }
            val activeModelValue = ::gen_activeModelValue_fn
            fun gen_hasModelValue_fn(): Boolean {
                if (isArray(props.modelValue)) {
                    return props.modelValue.length > 0
                }
                return String(props.modelValue).length > 0
            }
            val hasModelValue = ::gen_hasModelValue_fn
            fun gen_columnTargetValue_fn(value, columnIndex): Any {
                if (value == null) {
                    return null
                }
                if (isArray(value)) {
                    return if (value.length > columnIndex) {
                        value[columnIndex]
                    } else {
                        null
                    }
                }
                return if (columnIndex == 0) {
                    value
                } else {
                    null
                }
            }
            val columnTargetValue = ::gen_columnTargetValue_fn
            fun gen_defaultIndexAt_fn(columnIndex): Number {
                if (isArray(props.defaultIndex)) {
                    if (props.defaultIndex.length > columnIndex) {
                        return Number(props.defaultIndex[columnIndex])
                    }
                    return 0
                }
                return if (columnIndex == 0) {
                    Number(props.defaultIndex)
                } else {
                    0
                }
            }
            val defaultIndexAt = ::gen_defaultIndexAt_fn
            fun gen_findValueIndex_fn(column, value): Number {
                run {
                    var i: Number = 0
                    while(i < column.length){
                        if (String(column[i].value) == String(value)) {
                            return i
                        }
                        i++
                    }
                }
                return -1
            }
            val findValueIndex = ::gen_findValueIndex_fn
            fun gen_selectedItems_fn(): UTSArray<Any?> {
                val result = _uA()
                val columns = normalizedColumns.value
                run {
                    var i: Number = 0
                    while(i < columns.length){
                        val column = columns[i]
                        val index = selectedIndexAt(i)
                        if (index >= 0 && index < column.length) {
                            result.push(column[index])
                        }
                        i++
                    }
                }
                return result
            }
            val selectedItems = ::gen_selectedItems_fn
            fun gen_selectedValue_fn(): Any {
                val items = selectedItems()
                if (items.length == 0) {
                    return ""
                }
                if (items.length == 1) {
                    return items[0].value
                }
                val values = _uA()
                run {
                    var i: Number = 0
                    while(i < items.length){
                        values.push(items[i].value)
                        i++
                    }
                }
                return values
            }
            val selectedValue = ::gen_selectedValue_fn
            fun gen_selectedIndexAt_fn(columnIndex): Number {
                if (currentIndexs.value.length <= columnIndex) {
                    return 0
                }
                return Number(currentIndexs.value[columnIndex])
            }
            val selectedIndexAt = ::gen_selectedIndexAt_fn
            fun gen_buildChangeEvent_fn(columnIndex, index): UTSJSONObject {
                return _uO("index" to index, "indexs" to currentIndexs.value, "columnIndex" to columnIndex, "value" to pickerValuePayload(), "values" to selectedItems())
            }
            val buildChangeEvent = ::gen_buildChangeEvent_fn
            fun gen_buildConfirmEvent_fn(): UTSJSONObject {
                return _uO("indexs" to currentIndexs.value, "value" to pickerValuePayload(), "values" to selectedItems())
            }
            val buildConfirmEvent = ::gen_buildConfirmEvent_fn
            fun gen_pickerValuePayload_fn(): UTSArray<Any?> {
                val items = selectedItems()
                if (items.length == 1) {
                    return items[0]
                }
                return items
            }
            val pickerValuePayload = ::gen_pickerValuePayload_fn
            fun gen_columnAt_fn(index): UTSArray<Any?> {
                if (index < 0 || index >= normalizedColumns.value.length) {
                    return _uA()
                }
                return normalizedColumns.value[index]
            }
            val columnAt = ::gen_columnAt_fn
            fun gen_normalizeColumn_fn(list): UTSArray<Any?> {
                val result = _uA()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        result.push(normalizeItem(list[i]))
                        i++
                    }
                }
                return result
            }
            val normalizeColumn = ::gen_normalizeColumn_fn
            fun gen_normalizeItem_fn(item): UTSJSONObject {
                if (item != null && UTSAndroid.`typeof`(item) == "object") {
                    val text = if (item.text != null) {
                        String(item.text)
                    } else {
                        String(item.value)
                    }
                    val value = if (item.value != null) {
                        item.value
                    } else {
                        text
                    }
                    return _uO("text" to text, "value" to value, "disabled" to (item.disabled == true))
                }
                return _uO("text" to String(item), "value" to item, "disabled" to false)
            }
            val normalizeItem = ::gen_normalizeItem_fn
            fun gen_itemClass_fn(item, columnIndex, itemIndex): String {
                val classes = _uA(
                    "i-picker__item"
                )
                if (selectedIndexAt(columnIndex) == itemIndex) {
                    classes.push("i-picker__item--active")
                }
                if (isTruthy(item.disabled)) {
                    classes.push("i-picker__item--disabled")
                }
                return classes.join(" ")
            }
            val itemClass = ::gen_itemClass_fn
            fun gen_itemTextClass_fn(item, columnIndex, itemIndex): String {
                return if (selectedIndexAt(columnIndex) == itemIndex) {
                    "i-picker__item-text i-picker__item-text--active"
                } else {
                    "i-picker__item-text"
                }
            }
            val itemTextClass = ::gen_itemTextClass_fn
            fun gen_itemTextStyle_fn(item, columnIndex, itemIndex): String {
                var style = "line-height:" + formatSize(props.itemHeight) + ";color:#606266;"
                if (selectedIndexAt(columnIndex) == itemIndex) {
                    style = style + "color:#111827;"
                }
                return style
            }
            val itemTextStyle = ::gen_itemTextStyle_fn
            fun gen_isArray_fn(value): Boolean {
                return Object.prototype.toString.call(value) == "[object Array]"
            }
            val isArray = ::gen_isArray_fn
            fun gen_visibleCountNumber_fn(): Number {
                val count = Number(props.visibleItemCount)
                if (isNaN(count) || count <= 0) {
                    return 5
                }
                return count
            }
            val visibleCountNumber = ::gen_visibleCountNumber_fn
            fun gen_itemHeightNumber_fn(): Number {
                val height = Number(props.itemHeight)
                if (isNaN(height) || height <= 0) {
                    return 44
                }
                return height
            }
            val itemHeightNumber = ::gen_itemHeightNumber_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            __expose(_uM("open" to open, "close" to close, "clear" to clear, "getIndexs" to fun(): UTSArray<Any?> {
                return currentIndexs.value
            }
            , "getValues" to fun(): UTSArray<Any?> {
                return selectedItems()
            }
            , "getColumns" to fun(): UTSArray<UTSArray<Any?>> {
                return normalizedColumns.value
            }
            , "getColumnValues" to fun(columnIndex): UTSArray<Any?> {
                if (columnIndex < 0 || columnIndex >= normalizedColumns.value.length) {
                    return _uA()
                }
                return normalizedColumns.value[columnIndex]
            }
            , "setColumnValues" to fun(columnIndex, values) {
                emit("change", _uO("index" to selectedIndexAt(columnIndex), "indexs" to currentIndexs.value, "columnIndex" to columnIndex, "value" to values, "values" to values))
            }
            ))
            return fun(): Any? {
                val _component_picker_view_column = resolveComponent("picker-view-column")
                val _component_picker_view = resolveComponent("picker-view")
                return _cE("view", _uM("class" to "i-picker"), _uA(
                    if (isTrue(_ctx.showInput)) {
                        _cE("view", _uM("key" to 0, "class" to "i-picker__trigger", "onClick" to openByTrigger), _uA(
                            renderSlot(_ctx.`$slots`, "trigger", _uO(), fun(): UTSArray<Any> {
                                return _uA(
                                    renderSlot(_ctx.`$slots`, "default", _uO(), fun(): UTSArray<Any> {
                                        return _uA(
                                            _cE("view", _uM("class" to "i-picker__input"), _uA(
                                                _cE("text", _uM("class" to _nC(displayTextClass.value)), _tD(displayText.value), 3),
                                                _cE("text", _uM("class" to "i-picker__arrow"), "›")
                                            ))
                                        )
                                    })
                                )
                            })
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(opened.value)) {
                        _cE("view", _uM("key" to 1, "class" to "i-picker__mask", "onClick" to handleOverlayClick), _uA(
                            _cE("view", _uM("class" to "i-picker__panel", "style" to _nS(panelStyle.value), "onClick" to withModifiers(fun(){}, _uA(
                                "stop"
                            ))), _uA(
                                if (isTrue(_ctx.showToolbar)) {
                                    _cE("view", _uM("key" to 0, "class" to "i-picker__toolbar"), _uA(
                                        _cE("text", _uM("class" to "i-picker__cancel", "style" to _nS("color:" + _ctx.cancelColor + ";"), "onClick" to cancel), _tD(_ctx.cancelText), 5),
                                        _cE("text", _uM("class" to "i-picker__title"), _tD(_ctx.title), 1),
                                        _cE("text", _uM("class" to "i-picker__confirm", "style" to _nS("color:" + _ctx.confirmColor + ";"), "onClick" to confirm), _tD(_ctx.confirmText), 5)
                                    ))
                                } else {
                                    _cC("v-if", true)
                                },
                                if (isTrue(_ctx.loading)) {
                                    _cE("view", _uM("key" to 1, "class" to "i-picker__loading"), _uA(
                                        _cE("text", _uM("class" to "i-picker__loading-text"), "加载中...")
                                    ))
                                } else {
                                    _cC("v-if", true)
                                },
                                _cV(_component_picker_view, _uM("class" to "i-picker__columns", "style" to _nS(columnsStyle.value), "value" to currentIndexs.value, "indicator-style" to indicatorStyle.value, "onChange" to handlePickerChange), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        if (columnCount.value > 0) {
                                            _cV(_component_picker_view_column, _uM("key" to 0, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column0.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 0, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 0, itemIndex)), "style" to _nS(itemTextStyle(item, 0, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (columnCount.value > 1) {
                                            _cV(_component_picker_view_column, _uM("key" to 1, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column1.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 1, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 1, itemIndex)), "style" to _nS(itemTextStyle(item, 1, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (columnCount.value > 2) {
                                            _cV(_component_picker_view_column, _uM("key" to 2, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column2.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 2, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 2, itemIndex)), "style" to _nS(itemTextStyle(item, 2, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (columnCount.value > 3) {
                                            _cV(_component_picker_view_column, _uM("key" to 3, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column3.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 3, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 3, itemIndex)), "style" to _nS(itemTextStyle(item, 3, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (columnCount.value > 4) {
                                            _cV(_component_picker_view_column, _uM("key" to 4, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column4.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 4, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 4, itemIndex)), "style" to _nS(itemTextStyle(item, 4, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
                                                    }), 128)
                                                )
                                            }), "_" to 1))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (columnCount.value > 5) {
                                            _cV(_component_picker_view_column, _uM("key" to 5, "class" to "i-picker__column"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(column5.value, fun(item, itemIndex, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to item.value, "class" to _nC(itemClass(item, 5, itemIndex)), "style" to _nS(itemStyle.value)), _uA(
                                                            _cE("text", _uM("class" to _nC(itemTextClass(item, 5, itemIndex)), "style" to _nS(itemTextStyle(item, 5, itemIndex))), _tD(item.text), 7)
                                                        ), 6)
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
        var name = "i-picker"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-picker" to _pS(_uM("width" to "100%")), "i-picker__trigger" to _pS(_uM("width" to "100%")), "i-picker__input" to _pS(_uM("height" to 44, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#ffffff", "flexDirection" to "row", "alignItems" to "center")), "i-picker__input-text" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#303133", "fontSize" to 14, "lineHeight" to "22px")), "i-picker__input-text--placeholder" to _pS(_uM("color" to "#909193")), "i-picker__arrow" to _pS(_uM("width" to 20, "color" to "#909193", "fontSize" to 20, "lineHeight" to "24px", "textAlign" to "right", "transform" to "rotate(90deg)")), "i-picker__mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "zIndex" to 150, "backgroundColor" to "rgba(0,0,0,0.42)", "justifyContent" to "flex-end")), "i-picker__panel" to _pS(_uM("overflow" to "hidden", "backgroundColor" to "#ffffff")), "i-picker__toolbar" to _pS(_uM("height" to 48, "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eef0f4", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "i-picker__cancel" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px")), "i-picker__confirm" to _pS(_uM("width" to 64, "fontSize" to 14, "lineHeight" to "22px", "textAlign" to "right")), "i-picker__title" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#111827", "fontSize" to 16, "fontWeight" to 700, "lineHeight" to "24px", "textAlign" to "center")), "i-picker__loading" to _pS(_uM("position" to "absolute", "left" to 0, "right" to 0, "top" to 48, "bottom" to 0, "zIndex" to 2, "backgroundColor" to "rgba(255,255,255,0.78)", "alignItems" to "center", "justifyContent" to "center")), "i-picker__loading-text" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px")), "i-picker__columns" to _pS(_uM("width" to "100%")), "i-picker__column" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to "100%")), "i-picker__item" to _pS(_uM("width" to "100%", "paddingTop" to 0, "paddingRight" to 8, "paddingBottom" to 0, "paddingLeft" to 8, "alignItems" to "center", "justifyContent" to "center")), "i-picker__item--active" to _pS(_uM("backgroundColor" to "rgba(0,0,0,0)")), "i-picker__item--disabled" to _pS(_uM("opacity" to 0.42)), "i-picker__item-text" to _pS(_uM("color" to "#303133", "fontSize" to 15, "lineHeight" to "22px", "textAlign" to "center")), "i-picker__item-text--active" to _pS(_uM("color" to "#111827", "fontWeight" to 700)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("open" to null, "close" to null, "cancel" to null, "change" to null, "confirm" to null, "clear" to null, "update:value" to null, "update:modelValue" to null, "update:show" to null)
        var props = _nP(_uM("modelValue" to _uM("type" to _uA(
            "String",
            "Number",
            "Array"
        ), "default" to ""), "show" to _uM("type" to "Boolean", "default" to false), "showToolbar" to _uM("type" to "Boolean", "default" to true), "title" to _uM("type" to "String", "default" to ""), "columns" to _uM("type" to "Array", "default" to fun(): UTSArray<Any?> {
            return _uA()
        }
        ), "loading" to _uM("type" to "Boolean", "default" to false), "itemHeight" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 44), "cancelText" to _uM("type" to "String", "default" to "取消"), "confirmText" to _uM("type" to "String", "default" to "确认"), "cancelColor" to _uM("type" to "String", "default" to "#909193"), "confirmColor" to _uM("type" to "String", "default" to "#3c9cff"), "visibleItemCount" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 5), "closeOnMask" to _uM("type" to "Boolean", "default" to true), "defaultIndex" to _uM("type" to _uA(
            "Number",
            "Array"
        ), "default" to 0), "immediateChange" to _uM("type" to "Boolean", "default" to false), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 16), "showInput" to _uM("type" to "Boolean", "default" to true), "showDefaultValue" to _uM("type" to "Boolean", "default" to true), "options" to _uM("type" to "Array", "default" to fun(): UTSArray<String> {
            return _uA(
                "Apple",
                "Orange",
                "Banana"
            )
        }
        ), "value" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "disabled" to _uM("type" to "Boolean", "default" to false)))
        var propsNeedCastKeys = _uA(
            "modelValue",
            "show",
            "showToolbar",
            "title",
            "columns",
            "loading",
            "itemHeight",
            "cancelText",
            "confirmText",
            "cancelColor",
            "confirmColor",
            "visibleItemCount",
            "closeOnMask",
            "defaultIndex",
            "immediateChange",
            "round",
            "showInput",
            "showDefaultValue",
            "options",
            "value",
            "disabled"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
