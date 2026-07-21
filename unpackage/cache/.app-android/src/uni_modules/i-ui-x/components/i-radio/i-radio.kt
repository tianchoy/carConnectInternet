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
open class GenUniModulesIUiXComponentsIRadioIRadio : VueComponent {
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
    open var labelColor: String by `$props`
    open var labelSize: Any by `$props`
    open var labelDisabled: Boolean by `$props`
    open var iconColor: String by `$props`
    open var iconSize: Any by `$props`
    open var borderBottom: Boolean by `$props`
    open var iconPlacement: String by `$props`
    open var activeLabelColor: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIRadioIRadio) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIRadioIRadio
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val checked = computed(fun(): Boolean {
                if (props.checked) {
                    return true
                }
                val modelValueText = props.modelValue.toString()
                val value = if (modelValueText.length > 0) {
                    props.modelValue
                } else {
                    props.value
                }
                return value.toString() == props.name.toString()
            }
            )
            val wrapClass = computed(fun(): String {
                val classes = _uA(
                    "i-radio"
                )
                if (props.placement == "column") {
                    classes.push("i-radio--column")
                }
                if (props.iconPlacement == "right") {
                    classes.push("i-radio--right")
                }
                if (props.shape == "button") {
                    classes.push("i-radio--button")
                }
                if (checked.value) {
                    classes.push("i-radio--checked")
                }
                if (props.shape == "button" && checked.value) {
                    classes.push("i-radio--button-checked")
                }
                if (props.disabled) {
                    classes.push("i-radio--disabled")
                }
                if (props.borderBottom) {
                    classes.push("i-radio--border")
                }
                return classes.join(" ")
            }
            )
            val labelClass = computed(fun(): String {
                val classes = _uA(
                    "i-radio__label"
                )
                if (props.placement == "column") {
                    classes.push("i-radio__label--column")
                }
                if (props.shape == "button") {
                    classes.push("i-radio__label--button")
                }
                return classes.join(" ")
            }
            )
            val boxStyle = computed(fun(): String {
                val circle = props.shape == "circle" || props.shape == "dot"
                return ("width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (if (circle) {
                    formatSize(props.size)
                } else {
                    "4px"
                }
                ) + ";border-color:" + (if (checked.value) {
                    props.activeColor
                } else {
                    props.inactiveColor
                }
                ) + ";background-color:" + (if (checked.value && props.shape == "check") {
                    props.activeColor
                } else {
                    "transparent"
                }
                ) + ";")
            }
            )
            val dotStyle = computed(fun(): String {
                val fontSize = if (props.shape == "check") {
                    formatSize(parseFloat(props.iconSize.toString()) + 2)
                } else {
                    formatSize(props.iconSize)
                }
                return ("background-color:" + props.activeColor + ";color:" + props.iconColor + ";font-size:" + fontSize + ";")
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
            fun gen_select_fn() {
                if (props.disabled) {
                    return
                }
                emit("change", props.name)
                emit("update:modelValue", props.name)
                emit("update:value", props.name)
                emit("update:checked", true)
            }
            val select = ::gen_select_fn
            fun gen_selectByLabel_fn() {
                if (props.labelDisabled) {
                    return
                }
                select()
            }
            val selectByLabel = ::gen_selectByLabel_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to _nC(wrapClass.value), "onClick" to select), _uA(
                    renderSlot(_ctx.`$slots`, "icon", _uM("checked" to checked.value), fun(): UTSArray<Any> {
                        return _uA(
                            if (_ctx.shape != "button") {
                                _cE("view", _uM("key" to 0, "class" to "i-radio__box", "style" to _nS(boxStyle.value)), _uA(
                                    if (isTrue(checked.value && _ctx.shape != "check")) {
                                        _cE("view", _uM("key" to 0, "class" to "i-radio__dot", "style" to _nS(dotStyle.value)), null, 4)
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(checked.value && _ctx.shape == "check")) {
                                        _cE("text", _uM("key" to 1, "class" to "i-radio__check", "style" to _nS(dotStyle.value)), "✓", 4)
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
                            _cE("text", _uM("class" to _nC(labelClass.value), "style" to _nS(labelStyle.value), "onClick" to withModifiers(selectByLabel, _uA(
                                "stop"
                            ))), _tD(_ctx.label), 7)
                        )
                    }
                    )
                ), 2)
            }
        }
        var name = "i-radio"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-radio" to _pS(_uM("minHeight" to 32, "flexDirection" to "row", "alignItems" to "center")), "i-radio--right" to _pS(_uM("flexDirection" to "row-reverse", "justifyContent" to "space-between")), "i-radio--column" to _pS(_uM("flexDirection" to "column", "alignItems" to "flex-start")), "i-radio__label--column" to _pS(_uM("marginLeft" to 0, "marginTop" to 6)), "i-radio--button" to _pS(_uM("minWidth" to 64, "minHeight" to 34, "paddingTop" to 7, "paddingRight" to 12, "paddingBottom" to 7, "paddingLeft" to 12, "borderTopLeftRadius" to 6, "borderTopRightRadius" to 6, "borderBottomRightRadius" to 6, "borderBottomLeftRadius" to 6, "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#dcdfe6", "borderRightColor" to "#dcdfe6", "borderBottomColor" to "#dcdfe6", "borderLeftColor" to "#dcdfe6", "alignItems" to "center", "justifyContent" to "center")), "i-radio--button-checked" to _pS(_uM("borderTopColor" to "#2979ff", "borderRightColor" to "#2979ff", "borderBottomColor" to "#2979ff", "borderLeftColor" to "#2979ff", "backgroundColor" to "#ecf5ff")), "i-radio--disabled" to _pS(_uM("opacity" to 0.5)), "i-radio--border" to _pS(_uM("borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eef0f4")), "i-radio__box" to _pS(_uM("borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "alignItems" to "center", "justifyContent" to "center")), "i-radio__dot" to _pS(_uM("width" to 10, "height" to 10, "borderTopLeftRadius" to 5, "borderTopRightRadius" to 5, "borderBottomRightRadius" to 5, "borderBottomLeftRadius" to 5)), "i-radio__check" to _pS(_uM("lineHeight" to "20px", "fontWeight" to 700)), "i-radio__label" to _pS(_uM("marginLeft" to 8, "lineHeight" to "22px")), "i-radio__label--button" to _pS(_uM("marginLeft" to 0, "textAlign" to "center")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("change" to null, "update:modelValue" to null, "update:value" to null, "update:checked" to null)
        var props = _nP(_uM("name" to _uM("type" to _uA(
            "String",
            "Number",
            "Boolean"
        ), "default" to ""), "modelValue" to _uM("type" to _uA(
            "String",
            "Number",
            "Boolean"
        ), "default" to ""), "value" to _uM("type" to _uA(
            "String",
            "Number",
            "Boolean"
        ), "default" to ""), "checked" to _uM("type" to "Boolean", "default" to false), "shape" to _uM("type" to "String", "default" to "circle"), "disabled" to _uM("type" to "Boolean", "default" to false), "activeColor" to _uM("type" to "String", "default" to "#2979ff"), "inactiveColor" to _uM("type" to "String", "default" to "#dcdfe6"), "size" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 20), "placement" to _uM("type" to "String", "default" to "row"), "label" to _uM("type" to "String", "default" to ""), "labelColor" to _uM("type" to "String", "default" to "#303133"), "labelSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 14), "labelDisabled" to _uM("type" to "Boolean", "default" to false), "iconColor" to _uM("type" to "String", "default" to "#ffffff"), "iconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 14), "borderBottom" to _uM("type" to "Boolean", "default" to false), "iconPlacement" to _uM("type" to "String", "default" to "left"), "activeLabelColor" to _uM("type" to "String", "default" to "")))
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
            "labelColor",
            "labelSize",
            "labelDisabled",
            "iconColor",
            "iconSize",
            "borderBottom",
            "iconPlacement",
            "activeLabelColor"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
