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
open class GenUniModulesIUiXComponentsICheckboxICheckbox : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var name: Any by `$props`
    open var modelValue: Any by `$props`
    open var value: Any by `$props`
    open var checked: Boolean by `$props`
    open var shape: String by `$props`
    open var disabled: Boolean by `$props`
    open var activeColor: String by `$props`
    open var inactiveColor: String by `$props`
    open var size: Any by `$props`
    open var placement: String by `$props`
    open var label: String by `$props`
    open var labelSize: Any by `$props`
    open var labelColor: String by `$props`
    open var labelDisabled: Boolean by `$props`
    open var iconColor: String by `$props`
    open var iconSize: Any by `$props`
    open var iconPlacement: String by `$props`
    open var borderBottom: Boolean by `$props`
    open var activeLabelColor: String by `$props`
    open var plain: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsICheckboxICheckbox) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsICheckboxICheckbox
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val internalChecked = ref(isChecked())
            val checked = computed(fun(): Boolean {
                return internalChecked.value
            }
            )
            val wrapClass = computed(fun(): String {
                val classes = _uA(
                    "i-checkbox"
                )
                if (props.placement == "column") {
                    classes.push("i-checkbox--column")
                }
                if (props.iconPlacement == "right") {
                    classes.push("i-checkbox--right")
                }
                if (props.shape == "button") {
                    classes.push("i-checkbox--button")
                }
                if (props.plain && props.shape == "button") {
                    classes.push("i-checkbox--plain")
                }
                if (checked.value) {
                    classes.push("i-checkbox--checked")
                }
                if (props.shape == "button" && checked.value) {
                    classes.push("i-checkbox--button-checked")
                }
                if (props.shape == "button" && props.plain && checked.value) {
                    classes.push("i-checkbox--button-plain-checked")
                }
                if (props.disabled) {
                    classes.push("i-checkbox--disabled")
                }
                if (props.borderBottom) {
                    classes.push("i-checkbox--border")
                }
                return classes.join(" ")
            }
            )
            val labelClass = computed(fun(): String {
                val classes = _uA(
                    "i-checkbox__label"
                )
                if (props.shape == "button") {
                    classes.push("i-checkbox__label--button")
                }
                return classes.join(" ")
            }
            )
            val boxStyle = computed(fun(): String {
                return ("width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (if (props.shape == "circle") {
                    formatSize(props.size)
                } else {
                    "4px"
                }
                ) + ";border-color:" + (if (checked.value) {
                    props.activeColor
                } else {
                    props.inactiveColor
                }
                ) + ";background-color:" + (if (checked.value && props.shape != "check") {
                    props.activeColor
                } else {
                    "transparent"
                }
                ) + ";")
            }
            )
            val markStyle = computed(fun(): String {
                return "color:" + props.iconColor + ";font-size:" + formatSize(props.iconSize) + ";"
            }
            )
            val labelStyle = computed(fun(): String {
                var color = props.labelColor
                if (checked.value && props.activeLabelColor.length > 0) {
                    color = props.activeLabelColor
                }
                return "color:" + color + ";font-size:" + formatSize(props.labelSize) + ";"
            }
            )
            watch(fun(){
                return props.modelValue
            }
            , fun(){
                internalChecked.value = isChecked()
            }
            )
            watch(fun(){
                return props.value
            }
            , fun(){
                internalChecked.value = isChecked()
            }
            )
            watch(fun(){
                return props.checked
            }
            , fun(){
                internalChecked.value = isChecked()
            }
            )
            fun gen_toggle_fn() {
                if (props.disabled) {
                    return
                }
                updateChecked(!checked.value)
            }
            val toggle = ::gen_toggle_fn
            fun gen_toggleByLabel_fn() {
                if (props.labelDisabled) {
                    return
                }
                toggle()
            }
            val toggleByLabel = ::gen_toggleByLabel_fn
            fun gen_updateChecked_fn(nextChecked) {
                val previousChecked = checked.value
                internalChecked.value = nextChecked
                val nextValue = buildValue(nextChecked, previousChecked)
                emit("update:checked", nextChecked)
                emit("update:modelValue", nextValue)
                emit("update:value", nextValue)
                emit("change", nextValue)
            }
            val updateChecked = ::gen_updateChecked_fn
            fun gen_isChecked_fn(): Boolean {
                if (props.checked) {
                    return true
                }
                val value = if (String(props.modelValue).length > 0) {
                    props.modelValue
                } else {
                    props.value
                }
                if (UTSArray.isArray(value)) {
                    run {
                        var i: Number = 0
                        while(i < (value as UTSArray<*>).length){
                            if (String((value as UTSArray<*>)[i]) == String(props.name)) {
                                return true
                            }
                            i++
                        }
                    }
                    return false
                }
                if (UTSAndroid.`typeof`(value) == "boolean") {
                    return value as Boolean
                }
                return String(value) == String(props.name)
            }
            val isChecked = ::gen_isChecked_fn
            fun gen_buildValue_fn(nextChecked, previousChecked): Any {
                val value = if (String(props.modelValue).length > 0) {
                    props.modelValue
                } else {
                    props.value
                }
                if (UTSArray.isArray(value)) {
                    val list = (value as UTSArray<*>).slice(0)
                    val exists = previousChecked
                    if (isTruthy(nextChecked) && !isTruthy(exists)) {
                        list.push(props.name)
                    }
                    if (!isTruthy(nextChecked) && isTruthy(exists)) {
                        val nextList = _uA()
                        run {
                            var i: Number = 0
                            while(i < list.length){
                                if (String(list[i]) != String(props.name)) {
                                    nextList.push(list[i])
                                }
                                i++
                            }
                        }
                        return nextList
                    }
                    return list
                }
                return nextChecked
            }
            val buildValue = ::gen_buildValue_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to _nC(wrapClass.value), "onClick" to toggle), _uA(
                    renderSlot(_ctx.`$slots`, "icon", _uM("checked" to checked.value), fun(): UTSArray<Any> {
                        return _uA(
                            if (_ctx.shape != "button") {
                                _cE("view", _uM("key" to 0, "class" to "i-checkbox__box", "style" to _nS(boxStyle.value)), _uA(
                                    if (isTrue(checked.value)) {
                                        _cE("text", _uM("key" to 0, "class" to "i-checkbox__mark", "style" to _nS(markStyle.value)), "✓", 4)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ), 4)
                            } else {
                                _cC("v-if", true)
                            }
                        )
                    }
                    ),
                    renderSlot(_ctx.`$slots`, "default", _uM("checked" to checked.value), fun(): UTSArray<Any> {
                        return _uA(
                            _cE("text", _uM("class" to _nC(labelClass.value), "style" to _nS(labelStyle.value), "onClick" to withModifiers(toggleByLabel, _uA(
                                "stop"
                            ))), _tD(_ctx.label), 7)
                        )
                    }
                    )
                ), 2)
            }
        }
        var name = "i-checkbox"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-checkbox" to _pS(_uM("minHeight" to 32, "flexDirection" to "row", "alignItems" to "center")), "i-checkbox--right" to _pS(_uM("flexDirection" to "row-reverse", "justifyContent" to "space-between")), "i-checkbox--button" to _pS(_uM("minWidth" to 64, "minHeight" to 34, "paddingTop" to 7, "paddingRight" to 12, "paddingBottom" to 7, "paddingLeft" to 12, "borderTopLeftRadius" to 6, "borderTopRightRadius" to 6, "borderBottomRightRadius" to 6, "borderBottomLeftRadius" to 6, "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#dcdfe6", "borderRightColor" to "#dcdfe6", "borderBottomColor" to "#dcdfe6", "borderLeftColor" to "#dcdfe6", "alignItems" to "center", "justifyContent" to "center")), "i-checkbox--button-checked" to _pS(_uM("borderTopColor" to "#2979ff", "borderRightColor" to "#2979ff", "borderBottomColor" to "#2979ff", "borderLeftColor" to "#2979ff", "backgroundColor" to "#ecf5ff")), "i-checkbox--button-plain-checked" to _pS(_uM("backgroundColor" to "#ffffff")), "i-checkbox--disabled" to _pS(_uM("opacity" to 0.5)), "i-checkbox--border" to _pS(_uM("borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eef0f4")), "i-checkbox__box" to _pS(_uM("borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "alignItems" to "center", "justifyContent" to "center")), "i-checkbox__mark" to _pS(_uM("lineHeight" to "18px")), "i-checkbox__label" to _pS(_uM("marginLeft" to 8, "lineHeight" to "22px")), "i-checkbox__label--button" to _pS(_uM("marginLeft" to 0, "textAlign" to "center")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("change" to null, "update:modelValue" to null, "update:value" to null, "update:checked" to null)
        var props = _nP(_uM("name" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "modelValue" to _uM("type" to _uA(
            "Array",
            "Boolean",
            "String",
            "Number"
        ), "default" to false), "value" to _uM("type" to _uA(
            "Array",
            "Boolean",
            "String",
            "Number"
        ), "default" to false), "checked" to _uM("type" to "Boolean", "default" to false), "shape" to _uM("type" to "String", "default" to "square"), "disabled" to _uM("type" to "Boolean", "default" to false), "activeColor" to _uM("type" to "String", "default" to "#2979ff"), "inactiveColor" to _uM("type" to "String", "default" to "#dcdfe6"), "size" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 20), "placement" to _uM("type" to "String", "default" to "row"), "label" to _uM("type" to "String", "default" to ""), "labelSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 14), "labelColor" to _uM("type" to "String", "default" to "#303133"), "labelDisabled" to _uM("type" to "Boolean", "default" to false), "iconColor" to _uM("type" to "String", "default" to "#ffffff"), "iconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 14), "iconPlacement" to _uM("type" to "String", "default" to "left"), "borderBottom" to _uM("type" to "Boolean", "default" to false), "activeLabelColor" to _uM("type" to "String", "default" to ""), "plain" to _uM("type" to "Boolean", "default" to true)))
        var propsNeedCastKeys = _uA(
            "name",
            "modelValue",
            "value",
            "checked",
            "shape",
            "disabled",
            "activeColor",
            "inactiveColor",
            "size",
            "placement",
            "label",
            "labelSize",
            "labelColor",
            "labelDisabled",
            "iconColor",
            "iconSize",
            "iconPlacement",
            "borderBottom",
            "activeLabelColor",
            "plain"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
