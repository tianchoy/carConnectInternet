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
open class GenUniModulesLimePickerComponentsLPickerLPicker : VueComponent, PickerProps {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    override var cancelBtn: String? by `$props`
    override var cancelStyle: Any? by `$props`
    override var confirmBtn: String? by `$props`
    override var confirmStyle: Any? by `$props`
    override var title: String? by `$props`
    override var titleStyle: Any? by `$props`
    override var keys: UTSJSONObject? by `$props`
    override var columns: UTSArray<PickerColumn> by `$props`
    override var modelValue: UTSArray<PickerValue>? by `$props`
    override var defaultValue: UTSArray<PickerValue>? by `$props`
    override var value: UTSArray<PickerValue>? by `$props`
    override var loading: Boolean by `$props`
    override var loadingColor: String? by `$props`
    override var loadingMaskColor: String? by `$props`
    override var loadingSize: String by `$props`
    override var itemHeight: String? by `$props`
    override var itemColor: String? by `$props`
    override var itemFontSize: String? by `$props`
    override var itemActiveColor: String? by `$props`
    override var itemActiveFontWeight: Number? by `$props`
    override var indicatorStyle: String? by `$props`
    override var maskColors: UTSArray<String>? by `$props`
    override var bgColor: String? by `$props`
    override var groupHeight: String? by `$props`
    override var radius: String? by `$props`
    override var resetIndex: Boolean by `$props`
    open var confirm: () -> Unit
        get() {
            return unref(this.`$exposed`["confirm"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "confirm", value)
        }
    open var getSelectedOptions: () -> PickerConfirmEvent__1
        get() {
            return unref(this.`$exposed`["getSelectedOptions"]) as () -> PickerConfirmEvent__1
        }
        set(value) {
            setRefValue(this.`$exposed`, "getSelectedOptions", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesLimePickerComponentsLPickerLPicker, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesLimePickerComponentsLPickerLPicker
            val _cache = __ins.renderCache
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val props = __props
            val pickerItemInstanceArray = reactive(_uA<LPickerItemComponentPublicInstance>())
            val modelValue = ref<UTSArray<PickerValue>>(props.value ?: props.modelValue ?: props.defaultValue ?: _uA())
            val pickerValue = computed(WritableComputedOptions(set = fun(value: UTSArray<PickerValue>) {
                if (arrayEqual(value, modelValue.value)) {
                    return
                }
                modelValue.value = value
                emit("update:modelValue", value)
                emit("change", value)
            }
            , get = fun(): UTSArray<PickerValue> {
                return props.value ?: props.modelValue ?: modelValue.value
            }
            ))
            val isEmpty = computed(fun(): Boolean {
                return props.columns.length == 0 && pickerItemInstanceArray.every(fun(child, _index, _array): Boolean {
                    return child.options.length == 0
                }
                )
            }
            )
            val styles = computed(fun(): Map<String, Any> {
                val style = Map<String, Any>()
                if (props.bgColor != null) {
                    style.set("background", props.bgColor!!)
                }
                if (props.radius != null) {
                    style.set("border-top-left-radius", props.radius!!)
                    style.set("border-top-right-radius", props.radius!!)
                }
                return style
            }
            )
            val curIndexArray = ref(_uA<Number>())
            val curValueArray = ref(pickerValue.value.slice())
            val curItemArray: UTSArray<PickerColumnItem> = _uA()
            val realColumns = computed(fun(): UTSArray<PickerColumn> {
                val pickerColumns = pickerItemInstanceArray.map(fun(child, _index, _array): PickerColumn {
                    return child.options
                }
                )
                if (pickerColumns.length > 0) {
                    return pickerColumns
                }
                return props.columns
            }
            )
            val manageChildInList = fun(child: LPickerItemComponentPublicInstance, shouldAdd: Boolean){
                val index = pickerItemInstanceArray.indexOf(child)
                if (shouldAdd) {
                    if (index != -1) {
                        return
                    }
                    pickerItemInstanceArray.push(child)
                } else {
                    if (index == -1) {
                        return
                    }
                    pickerItemInstanceArray.splice(index, 1)
                }
            }
            val updateItems = fun(item: PickerColumnItem, index: Number, column: Number){
                assignAtIndex(curIndexArray.value, column, index)
                assignAtIndex(curValueArray.value, column, item.value)
                assignAtIndex(curItemArray, column, item)
            }
            val updatePickerItems = fun(){
                val _indexs: UTSArray<Number> = _uA()
                val _values: UTSArray<Any> = _uA()
                pickerItemInstanceArray.forEach(fun(child, column, _array){
                    if (child.options.length == 0) {
                        return
                    }
                    val value = if (curValueArray.value.length > column) {
                        curValueArray.value[column]
                    } else {
                        null
                    }
                    val index: Number = if (value == null) {
                        0
                    } else {
                        child.`$callMethod`("getIndexByValue", value)
                    }
                     as Number
                    child.`$callMethod`("setIndex", index)
                    val item = child.options[index]
                    _indexs.push(index)
                    _values.push(item.value)
                    assignAtIndex(curItemArray, column, item)
                }
                )
                if (arrayEqual(curValueArray.value, _values) && arrayEqual(curIndexArray.value, _indexs)) {
                    return
                }
                curIndexArray.value = _indexs
                curValueArray.value = _values
                pickerValue.value = curValueArray.value.slice()
            }
            val onPick = fun(item: PickerColumnItem, index: Number, column: Number){
                if (curIndexArray.value[column] == index) {
                    return
                }
                assignAtIndex(curIndexArray.value, column, index)
                assignAtIndex(curValueArray.value, column, item.value)
                assignAtIndex(curItemArray, column, item)
                val obj = PickerPickEvent(values = curValueArray.value, column = column, index = index)
                pickerValue.value = curValueArray.value.slice()
                emit("pick", obj)
            }
            val onCancel = fun(e: UniPointerEvent){
                updatePickerItems()
                emit("cancel", e)
            }
            val onConfirm = fun(){
                val values = curValueArray.value.slice()
                val indexs = curIndexArray.value.slice()
                val items = curItemArray.map(fun(item): PickerColumnItem {
                    return toRaw(item)
                }
                )
                if (!arrayEqual(pickerValue.value, values)) {
                    pickerValue.value = values
                }
                val obj = PickerConfirmEvent__1(values = values, indexs = indexs, items = items)
                emit("confirm", obj)
            }
            val stopPickerValue = watch(pickerValue, fun(){
                if (arrayEqual(pickerValue.value, curValueArray.value)) {
                    return
                }
                curValueArray.value = pickerValue.value.map(fun(item: PickerValue): Any {
                    return item
                }
                )
                updatePickerItems()
            }
            )
            val stopColumns = watch(realColumns, fun(){
                updatePickerItems()
            }
            )
            onMounted(fun(){
                nextTick(fun(){
                    if (!arrayEqual(pickerValue.value, curValueArray.value) && pickerValue.value.length > 0) {
                        curValueArray.value = pickerValue.value.slice()
                        updatePickerItems()
                    }
                }
                )
            }
            )
            val loadingRef = ref<UniElement?>(null)
            val loadingAni = useLoading(loadingRef)
            loadingAni.type = "circular"
            loadingAni.color = props.loadingColor ?: "#3283ff"
            loadingAni.ratio = unitConvert(props.loadingSize)
            watchEffect(fun(){
                if (props.loading) {
                    loadingAni.play()
                } else {
                    loadingAni.clear()
                }
            }
            )
            onBeforeUnmount(fun(){
                stopPickerValue()
                stopColumns()
            }
            )
            __expose(_uM("confirm" to onConfirm, "getSelectedOptions" to fun(): PickerConfirmEvent__1 {
                val values = curValueArray.value.slice()
                val indexs = curIndexArray.value.slice()
                val items = curItemArray.map(fun(item): PickerColumnItem {
                    return toRaw(item)
                }
                )
                if (!arrayEqual(pickerValue.value, values)) {
                    pickerValue.value = values
                }
                val obj = PickerConfirmEvent__1(values = values, indexs = indexs, items = items)
                return obj
            }
            ))
            provide("limePicker", props)
            provide("limePickerOnPick", onPick)
            provide("limePickerUpdateItems", updateItems)
            provide("limePickerItems", pickerItemInstanceArray)
            provide("limePickerManageChildInList", manageChildInList)
            return fun(): Any? {
                val _component_l_picker_item = resolveEasyComponent("l-picker-item", GenUniModulesLimePickerComponentsLPickerItemLPickerItemClass)
                return _cE("view", _uM("class" to "l-picker", "style" to _nS(_uA(
                    unref(styles)
                )), "ref" to "pickerRef"), _uA(
                    if (isTrue(_ctx.cancelBtn != null || _ctx.title != null || _ctx.confirmBtn != null)) {
                        _cE("view", _uM("key" to 0, "class" to "l-picker__toolbar"), _uA(
                            if (_ctx.cancelBtn != null) {
                                _cE("text", _uM("key" to 0, "class" to "l-picker__cancel", "style" to _nS(_uA(
                                    _ctx.cancelStyle ?: _uM<String, Any?>()
                                )), "onClick" to onCancel), _tD(_ctx.cancelBtn), 5)
                            } else {
                                _cC("v-if", true)
                            },
                            _cE("text", _uM("class" to "l-picker__title", "style" to _nS(_uA(
                                _ctx.titleStyle ?: _uM<String, Any?>()
                            ))), _tD(_ctx.title), 5),
                            if (_ctx.confirmBtn != null) {
                                _cE("text", _uM("key" to 1, "class" to "l-picker__confirm", "style" to _nS(_uA(
                                    _ctx.confirmStyle ?: _uM<String, Any?>()
                                )), "onClick" to onConfirm), _tD(_ctx.confirmBtn), 5)
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    renderSlot(_ctx.`$slots`, "header"),
                    _cE("view", _uM("class" to "l-picker__main", "style" to _nS(_uA(
                        if (_ctx.groupHeight != null) {
                            _uM("height" to _ctx.groupHeight)
                        } else {
                            _uM<String, Any?>()
                        }
                    ))), _uA(
                        renderSlot(_ctx.`$slots`, "default", _uO(), fun(): UTSArray<Any> {
                            return _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(props.columns, fun(options, i, __index, _cached): Any {
                                    return _cV(_component_l_picker_item, _uM("options" to options, "key" to i, "column" to i, "value" to if (unref(pickerValue).length > i) {
                                        unref(pickerValue)[i]
                                    } else {
                                        null
                                    }
                                    ), null, 8, _uA(
                                        "options",
                                        "column",
                                        "value"
                                    ))
                                }
                                ), 128)
                            )
                        }
                        ),
                        if (isTrue(unref(isEmpty))) {
                            _cE("view", _uM("key" to 0, "class" to "l-picker__empty"), _uA(
                                renderSlot(_ctx.`$slots`, "empty")
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        if (isTrue(!unref(isEmpty))) {
                            _cE("view", _uM("key" to 1, "class" to "l-picker__indicator", "style" to _nS(_ctx.indicatorStyle ?: "")), null, 4)
                        } else {
                            _cC("v-if", true)
                        }
                    ), 4),
                    renderSlot(_ctx.`$slots`, "footer"),
                    if (isTrue(_ctx.loading)) {
                        _cE("view", _uM("key" to 1, "class" to "l-picker__loading", "ref_key" to "loadingRef", "ref" to loadingRef, "style" to _nS(_uA(
                            if (_ctx.loadingMaskColor != null) {
                                _uM("background" to _ctx.loadingMaskColor)
                            } else {
                                _uM<String, Any?>()
                            }
                        ))), null, 4)
                    } else {
                        _cC("v-if", true)
                    }
                ), 4)
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("l-picker" to _pS(_uM("position" to "relative", "backgroundColor" to "var(--l-picker-bg-color, #fff)", "borderTopLeftRadius" to "var(--l-picker-border-radius, 12px)", "borderTopRightRadius" to "var(--l-picker-border-radius, 12px)")), "l-picker__toolbar" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "space-between", "height" to "var(--l-picker-toolbar-height, 58px)", "flexDirection" to "row", "position" to "relative")), "l-picker__title" to _pS(_uM("position" to "absolute", "left" to "50%", "top" to "50%", "transform" to "translateX(-50%) translateY(-50%)", "textAlign" to "center", "overflow" to "hidden", "whiteSpace" to "nowrap", "textOverflow" to "ellipsis", "color" to "var(--l-picker-title-color, #000000E0)", "lineHeight" to "var(--l-picker-title-line-height, 26px)", "fontWeight" to "var(--l-picker-title-font-weight, 700)", "fontSize" to "var(--l-picker-title-font-size, 18px)")), "l-picker__cancel" to _pS(_uM("whiteSpace" to "nowrap", "fontSize" to "var(--l-picker-button-font-size, 16px)", "lineHeight" to "var(--l-picker-toolbar-height, 58px)", "height" to "100%", "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "marginRight" to "auto", "color" to "var(--l-picker-cancel-color, #000000A6)")), "l-picker__confirm" to _pS(_uM("whiteSpace" to "nowrap", "fontSize" to "var(--l-picker-button-font-size, 16px)", "lineHeight" to "var(--l-picker-toolbar-height, 58px)", "height" to "100%", "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "marginLeft" to "auto", "color" to "var(--l-picker-confirm-color, #3283ff)")), "l-picker__main" to _pS(_uM("position" to "relative", "display" to "flex", "height" to "var(--l-picker-group-height, 200px)", "flexDirection" to "row", "zIndex" to 2, "paddingTop" to 0, "paddingRight" to 8, "paddingBottom" to 0, "paddingLeft" to 8)), "l-picker__empty" to _pS(_uM("pointerEvents" to "none", "justifyContent" to "center", "alignItems" to "center", "display" to "flex", "position" to "absolute", "top" to 0, "bottom" to 0, "left" to 0, "right" to 0, "zIndex" to 3)), "l-picker__loading" to _pS(_uM("zIndex" to 3, "backgroundColor" to "var(--l-picker-loading-mask-color, rgba(255, 255, 255, 0.9))", "justifyContent" to "center", "alignItems" to "center", "display" to "flex", "position" to "absolute", "top" to 0, "bottom" to 0, "left" to 0, "right" to 0)), "l-picker__indicator" to _pS(_uM("position" to "absolute", "backgroundColor" to "var(--l-picker-indicator-bg-color, #0000000A)", "top" to "50%", "left" to "var(--l-picker-indicator-margin, 10px)", "right" to "var(--l-picker-indicator-margin, 10px)", "height" to "var(--l-picker-item-height, 50px)", "transform" to "translateY(-50%)", "zIndex" to -1, "borderTopLeftRadius" to "var(--l-picker-indicator-border-radius, 6px)", "borderTopRightRadius" to "var(--l-picker-indicator-border-radius, 6px)", "borderBottomRightRadius" to "var(--l-picker-indicator-border-radius, 6px)", "borderBottomLeftRadius" to "var(--l-picker-indicator-border-radius, 6px)")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("change" to null, "cancel" to null, "pick" to null, "confirm" to null, "update:modelValue" to null)
        var props = _nP(_uM("cancelBtn" to _uM("type" to "String", "required" to false), "cancelStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "confirmBtn" to _uM("type" to "String", "required" to false), "confirmStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "title" to _uM("type" to "String", "required" to false), "titleStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "keys" to _uM("type" to "UTSJSONObject", "required" to false), "columns" to _uM("type" to "Array", "required" to true, "default" to _uA<PickerColumn>()), "modelValue" to _uM("type" to "Array", "required" to false), "defaultValue" to _uM("type" to "Array", "required" to false), "value" to _uM("type" to "Array", "required" to false), "loading" to _uM("type" to "Boolean", "required" to true, "default" to false), "loadingColor" to _uM("type" to "String", "required" to false), "loadingMaskColor" to _uM("type" to "String", "required" to false), "loadingSize" to _uM("type" to "String", "required" to true, "default" to "32px"), "itemHeight" to _uM("type" to "String", "required" to false), "itemColor" to _uM("type" to "String", "required" to false), "itemFontSize" to _uM("type" to "String", "required" to false), "itemActiveColor" to _uM("type" to "String", "required" to false), "itemActiveFontWeight" to _uM("type" to "Number", "required" to false), "indicatorStyle" to _uM("type" to "String", "required" to false), "maskColors" to _uM("type" to "Array", "required" to false), "bgColor" to _uM("type" to "String", "required" to false), "groupHeight" to _uM("type" to "String", "required" to false), "radius" to _uM("type" to "String", "required" to false), "resetIndex" to _uM("type" to "Boolean", "required" to true, "default" to false)))
        var propsNeedCastKeys = _uA(
            "columns",
            "loading",
            "loadingSize",
            "resetIndex"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
