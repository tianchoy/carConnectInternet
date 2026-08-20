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
open class GenUniModulesLimePickerComponentsLPickerItemLPickerItem : VueComponent, PickerItemProps {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    override var options: UTSArray<PickerColumnItem> by `$props`
    override var value: Any? by `$props`
    override var column: Number by `$props`
    override var name: Any? by `$props`
    open var setIndex: (index: Number) -> Unit
        get() {
            return unref(this.`$exposed`["setIndex"]) as (index: Number) -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "setIndex", value)
        }
    open var setValue: (value: PickerValue?) -> Unit
        get() {
            return unref(this.`$exposed`["setValue"]) as (value: PickerValue?) -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "setValue", value)
        }
    open var getIndexByValue: (kVal: PickerValue?) -> Number
        get() {
            return unref(this.`$exposed`["getIndexByValue"]) as (kVal: PickerValue?) -> Number
        }
        set(value) {
            setRefValue(this.`$exposed`, "getIndexByValue", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesLimePickerComponentsLPickerItemLPickerItem, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesLimePickerComponentsLPickerItemLPickerItem
            val _cache = __ins.renderCache
            val themeMode = inject("limeConfigProviderTheme", computed(fun(): String {
                return "light"
            }
            ))
            val instance = getCurrentInstance()!!
            val props = __props
            val picker = inject<LPickerComponentPublicInstance?>("limePicker", null)
            val pickerItemInstanceArray = inject<UTSArray<LPickerItemComponentPublicInstance>?>("limePickerItems", null)
            val manageChildInList = inject<ManageChildInList?>("limePickerManageChildInList", null)
            manageChildInList?.invoke(instance.proxy!! as LPickerItemComponentPublicInstance, true)
            val onPick = inject<OnPick?>("limePickerOnPick", null)
            val updateItems = inject<UpdateItems?>("limePickerUpdateItems", null)
            val curIndex = ref(0)
            val isInitialized = ref(false)
            val curValue = ref<PickerValue?>(props.value)
            val innerIndex = computed(fun(): UTSArray<Number> {
                return _uA(
                    curIndex.value
                )
            }
            )
            val isDarkMode = computed(fun(): Boolean {
                return themeMode.value == "dark"
            }
            )
            val column = computed(fun(): Number {
                return if (props.column != -1) {
                    props.column
                } else {
                    pickerItemInstanceArray?.indexOf(instance.proxy!! as LPickerItemComponentPublicInstance) ?: props.column
                }
            }
            )
            val platformMaskStyles = usePickerMask(computed(fun(): String? {
                return picker?.bgColor
            }
            ), isDarkMode, computed(fun(): UTSArray<String>? {
                return picker?.maskColors
            }
            ), isInitialized).platformMaskStyles
            val indicatorStyles = computed(fun(): String {
                var style = "height: " + (picker?.itemHeight ?: "50px") + ";border-bottom-color: transparent;"
                return style + (if (isInitialized.value) {
                    "border-top-color: rgba(0,0,0,0.001);"
                } else {
                    "border-top-color: transparent;"
                }
                )
            }
            )
            val itemStyles = computed(fun(): Map<String, Any> {
                val style = Map<String, Any>()
                style.set("height", unitConvert(picker?.itemHeight ?: 50) * props.options.length + "px")
                return style
            }
            )
            val itemActiveStyles = computed(fun(): Map<String, Any> {
                val style = Map<String, Any>()
                if (picker?.itemActiveColor != null) {
                    style.set("color", picker.itemActiveColor!!)
                }
                if (picker?.itemActiveFontWeight != null) {
                    style.set("font-weight", picker.itemActiveFontWeight!!)
                }
                return style
            }
            )
            val getIndexByValue = fun(kVal: PickerValue?): Number {
                var defaultIndex: Number = 0
                if (kVal != null) {
                    defaultIndex = props.options.findIndex(fun(item): Boolean {
                        return item.value == kVal
                    }
                    )
                }
                return if (defaultIndex < 0) {
                    0
                } else {
                    defaultIndex
                }
            }
            var lastCount = props.options.length
            val setIndex = fun(index: Number){
                var lastIndex = curIndex.value
                var _index = clamp(index, 0, props.options.length - 1)
                if (props.options.length > _index) {
                    curIndex.value = _index
                    curValue.value = props.options[_index].value
                }
            }
            val setValue = fun(value: PickerValue?){
                if (value == curValue.value) {
                    return
                }
                curValue.value = value
                val index = getIndexByValue(value)
                setIndex(index)
            }
            val setUpdateItems = fun(){
                val index = clamp(curIndex.value, 0, props.options.length - 1)
                val curItem = if (props.options.length > index) {
                    props.options[index]
                } else {
                    null
                }
                if (curItem == null) {
                    return
                }
                updateItems?.invoke(curItem, index, column.value)
            }
            val handlePick = fun(e: UniPickerViewChangeEvent){
                if (props.options.length == 0) {
                    return
                }
                val index = clamp(e.detail.value[0], 0, props.options.length - 1)
                val curItem = props.options[index]
                if (index == curIndex.value) {
                    return
                }
                setIndex(index)
                onPick?.invoke(curItem, index, column.value)
            }
            val stopValue = watch(fun(): PickerValue? {
                return props.value
            }
            , fun(v: PickerValue?){
                setValue(v)
                setUpdateItems()
            }
            , WatchOptions(immediate = true))
            val itemRef = ref<UniElement?>(null)
            var canvasRenderer: PickerCanvasRenderer? = null
            val canvasWidth = ref<Number>(0)
            val canvasHeight = ref<Number>(0)
            val canvasConfig = computed(fun(): PickerCanvasConfig {
                return (PickerCanvasConfig(itemHeight = unitConvert(picker?.itemHeight ?: 50), itemFontSize = unitConvert(picker?.itemFontSize ?: 16), itemActiveFontWeight = picker?.itemActiveFontWeight, itemColor = picker?.itemColor, itemActiveColor = picker?.itemActiveColor, canvasWidth = canvasWidth.value, canvasHeight = canvasHeight.value))
            }
            )
            val updateItemStyle = fun(){
                if (itemRef.value == null) {
                    return
                }
                if (canvasRenderer == null) {
                    canvasRenderer = PickerCanvasRenderer(itemRef.value!!)
                }
                canvasRenderer?.render(props.options, curIndex.value, canvasConfig.value, isDarkMode.value)
            }
            val getBoundingClientRect = fun(){
                requestAnimationFrame(fun(_timestamp){
                    itemRef.value?.getBoundingClientRectAsync()?.then(fun(res){
                        canvasWidth.value = res.width
                        canvasHeight.value = res.height
                    }
                    )
                }
                )
            }
            val resizeObserver = UniResizeObserver(fun(entries: UTSArray<UniResizeObserverEntry>){
                getBoundingClientRect()
            }
            )
            var timerId: Number? = null
            var renderCount: Number = 0
            val stopOptionsWatch = watch(_uA(
                fun(): UTSArray<PickerColumnItem> {
                    return props.options
                }
                ,
                canvasHeight,
                isDarkMode,
                curIndex
            ), fun(){
                if (canvasHeight.value == 0) {
                    return
                }
                updateItemStyle()
                if (renderCount > 2) {
                    return
                }
                if (timerId != null) {
                    clearTimeout(timerId!!)
                }
                timerId = setTimeout(fun(){
                    updateItemStyle()
                    renderCount++
                }
                , 50)
            }
            )
            val stopItemRefWatch = watch(fun(): UniElement? {
                return itemRef.value
            }
            , fun(el: UniElement?){
                if (el == null) {
                    return
                }
                resizeObserver.observe(el)
            }
            )
            onBeforeUnmount(fun(){
                manageChildInList?.invoke(instance.proxy!! as LPickerItemComponentPublicInstance, false)
                stopOptionsWatch()
                stopItemRefWatch()
                resizeObserver.disconnect()
                canvasRenderer = null
            }
            )
            __expose(_uM("setIndex" to setIndex, "setValue" to setValue, "getIndexByValue" to getIndexByValue))
            return fun(): Any? {
                val _component_picker_view_column = resolveComponent("picker-view-column")
                val _component_picker_view = resolveComponent("picker-view")
                return _cV(_component_picker_view, _uM("class" to "l-picker-item__group", "style" to _nS(_uM("opacity" to if (_ctx.options.length > 0) {
                    1
                } else {
                    0
                }
                )), "mask-style" to unref(platformMaskStyles).common, "mask-top-style" to unref(platformMaskStyles).top, "mask-bottom-style" to unref(platformMaskStyles).bottom, "indicator-style" to unref(indicatorStyles), "mask-class" to "l-picker-item__mask", "value" to unref(innerIndex), "onChange" to handlePick, "indicator-class" to "l-picker-item__indicator"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                    return _uA(
                        _cV(_component_picker_view_column, _uM("class" to "l-picker-item__wrapper"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cE("view", _uM("ref_key" to "itemRef", "ref" to itemRef, "style" to _nS(_uA(
                                    unref(itemStyles)
                                ))), null, 4)
                            )
                        }
                        ), "_" to 1))
                    )
                }
                ), "_" to 1), 8, _uA(
                    "style",
                    "mask-style",
                    "mask-top-style",
                    "mask-bottom-style",
                    "indicator-style",
                    "value"
                ))
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("l-picker-item__group" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "l-picker-item__group-item" to _pS(_uM("height" to "var(--l-picker-item-height, 50px)", "lineHeight" to "var(--l-picker-item-height, 50px)", "textAlign" to "center", "transitionDuration" to "100ms", "transitionProperty" to "fontWeight,color", "transitionTimingFunction" to "linear", "fontWeight" to 400, "color" to "var(--l-picker-item-color, #000000E0)", "fontSize" to "var(--l-picker-item-font-size, 16px)", "whiteSpace" to "nowrap")), "l-picker-item__group-item--active" to _pS(_uM("color" to "var(--l-picker-item-active-color, #000000E0)", "fontWeight" to "var(--l-picker-item-active-font-weight, 700)")), "l-picker-item__wrapper" to _pS(_uM("width" to "100%")), "@TRANSITION" to _uM("l-picker-item__group-item" to _uM("duration" to "100ms", "property" to "fontWeight,color", "timingFunction" to "linear")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM("options" to _uM("type" to "Array", "required" to true, "default" to _uA<PickerColumnItem>()), "value" to _uM("type" to _uA(
            "String",
            "Number"
        ), "required" to false), "column" to _uM("type" to "Number", "required" to true, "default" to -1), "name" to _uM("type" to _uA(
            "String",
            "Number"
        ), "required" to false)))
        var propsNeedCastKeys = _uA(
            "options",
            "column"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
