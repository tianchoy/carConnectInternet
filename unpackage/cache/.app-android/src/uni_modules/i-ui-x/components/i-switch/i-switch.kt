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
open class GenUniModulesIUiXComponentsISwitchISwitch : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any by `$props`
    open var value: Any by `$props`
    open var loading: Boolean by `$props`
    open var disabled: Boolean by `$props`
    open var shape: String by `$props`
    open var size: Any by `$props`
    open var width: Any by `$props`
    open var activeColor: String by `$props`
    open var inactiveColor: String by `$props`
    open var activeValue: Any by `$props`
    open var inactiveValue: Any by `$props`
    open var asyncChange: Boolean by `$props`
    open var space: Any by `$props`
    open var textSpace: Any by `$props`
    open var activeText: String by `$props`
    open var inactiveText: String by `$props`
    open var loadingMode: String by `$props`
    open var loadingSize: Any by `$props`
    open var loadingIcon: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsISwitchISwitch) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsISwitchISwitch
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val current = ref(initialValue())
            val checked = computed(fun(): Boolean {
                return String(current.value) == String(props.activeValue)
            }
            )
            val switchClass = computed(fun(): String {
                val classes = _uA(
                    "i-switch"
                )
                if (checked.value) {
                    classes.push("i-switch--checked")
                }
                if (props.disabled || props.loading) {
                    classes.push("i-switch--disabled")
                }
                if (props.shape == "square") {
                    classes.push("i-switch--square")
                }
                return classes.join(" ")
            }
            )
            val switchStyle = computed(fun(): String {
                val height = numericSize(props.size, 26)
                val width = if (numericSize(props.width, 0) > 0) {
                    numericSize(props.width, 0)
                } else {
                    height * 2
                }
                return ("width:" + formatSize(width) + ";height:" + formatSize(height) + ";padding:" + formatSize(props.space) + ";border-radius:" + (if (props.shape == "square") {
                    "4px"
                } else {
                    formatSize(height)
                }
                ) + ";background-color:" + (if (checked.value) {
                    props.activeColor
                } else {
                    props.inactiveColor
                }
                ) + ";margin-left:" + formatSize(props.textSpace) + ";margin-right:" + formatSize(props.textSpace) + ";")
            }
            )
            val thumbStyle = computed(fun(): String {
                val height = numericSize(props.size, 26)
                val space = numericSize(props.space, 2)
                val thumb = height - space * 2
                val width = if (numericSize(props.width, 0) > 0) {
                    numericSize(props.width, 0)
                } else {
                    height * 2
                }
                val offset = if (checked.value) {
                    width - thumb - space * 2
                } else {
                    0
                }
                return ("width:" + formatSize(thumb) + ";height:" + formatSize(thumb) + ";border-radius:" + (if (props.shape == "square") {
                    "3px"
                } else {
                    formatSize(thumb)
                }
                ) + ";margin-left:" + formatSize(offset) + ";")
            }
            )
            val loadingStyle = computed(fun(): String {
                return "font-size:" + formatSize(props.loadingSize) + ";"
            }
            )
            watch(fun(){
                return props.modelValue
            }
            , fun(){
                current.value = initialValue()
            }
            )
            watch(fun(){
                return props.value
            }
            , fun(){
                current.value = initialValue()
            }
            )
            fun gen_initialValue_fn(): Any {
                if (String(props.modelValue).length > 0) {
                    return props.modelValue
                }
                return props.value
            }
            val initialValue = ::gen_initialValue_fn
            fun gen_toggle_fn() {
                if (props.disabled || props.loading) {
                    return
                }
                val nextValue = if (checked.value) {
                    props.inactiveValue
                } else {
                    props.activeValue
                }
                if (!props.asyncChange) {
                    current.value = nextValue
                }
                emit("change", nextValue)
                emit("update:modelValue", nextValue)
                emit("update:value", nextValue)
            }
            val toggle = ::gen_toggle_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_numericSize_fn(value, fallback): Any {
                val text = String(value).replace("px", "").replace("rpx", "").replace("%", "")
                val numberValue = Number(text)
                if (isNaN(numberValue)) {
                    return fallback
                }
                return numberValue
            }
            val numericSize = ::gen_numericSize_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to "i-switch-wrap"), _uA(
                    if (_ctx.inactiveText.length > 0) {
                        _cE("text", _uM("key" to 0, "class" to "i-switch__side-text"), _tD(_ctx.inactiveText), 1)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    _cE("view", _uM("class" to _nC(switchClass.value), "style" to _nS(switchStyle.value), "onClick" to toggle), _uA(
                        if (isTrue(_ctx.loading)) {
                            _cE("text", _uM("key" to 0, "class" to "i-switch__loading", "style" to _nS(loadingStyle.value)), _tD(if (_ctx.loadingMode == "spinner") {
                                "..."
                            } else {
                                _ctx.loadingIcon
                            }), 5)
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        _cE("view", _uM("class" to "i-switch__thumb", "style" to _nS(thumbStyle.value)), null, 4)
                    ), 6),
                    if (_ctx.activeText.length > 0) {
                        _cE("text", _uM("key" to 1, "class" to "i-switch__side-text"), _tD(_ctx.activeText), 1)
                    } else {
                        _cC("v-if", true)
                    }
                ))
            }
        }
        var name = "i-switch"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-switch-wrap" to _pS(_uM("flexDirection" to "row", "alignItems" to "center")), "i-switch" to _pS(_uM("position" to "relative", "flexDirection" to "row", "alignItems" to "center", "backgroundColor" to "#ffffff", "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "rgba(0,0,0,0.08)", "borderRightColor" to "rgba(0,0,0,0.08)", "borderBottomColor" to "rgba(0,0,0,0.08)", "borderLeftColor" to "rgba(0,0,0,0.08)")), "i-switch--disabled" to _pS(_uM("opacity" to 0.55)), "i-switch__thumb" to _pS(_uM("backgroundColor" to "#ffffff", "boxShadow" to "0 1px 4px rgba(0, 0, 0, 0.18)")), "i-switch__loading" to _pS(_uM("position" to "absolute", "left" to "50%", "top" to "50%", "transform" to "translate(-50%, -50%)", "color" to "#909399", "lineHeight" to "18px")), "i-switch__side-text" to _pS(_uM("color" to "#606266", "fontSize" to 13, "lineHeight" to "20px")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("update:modelValue" to null, "update:value" to null, "change" to null)
        var props = _nP(_uM("modelValue" to _uM("type" to _uA(
            "Boolean",
            "String",
            "Number"
        ), "default" to ""), "value" to _uM("type" to _uA(
            "Boolean",
            "String",
            "Number"
        ), "default" to false), "loading" to _uM("type" to "Boolean", "default" to false), "disabled" to _uM("type" to "Boolean", "default" to false), "shape" to _uM("type" to "String", "default" to "round"), "size" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "26px"), "width" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0), "activeColor" to _uM("type" to "String", "default" to "#2979ff"), "inactiveColor" to _uM("type" to "String", "default" to "#dcdfe6"), "activeValue" to _uM("type" to _uA(
            "Boolean",
            "String",
            "Number"
        ), "default" to true), "inactiveValue" to _uM("type" to _uA(
            "Boolean",
            "String",
            "Number"
        ), "default" to false), "asyncChange" to _uM("type" to "Boolean", "default" to false), "space" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "2px"), "textSpace" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 8), "activeText" to _uM("type" to "String", "default" to ""), "inactiveText" to _uM("type" to "String", "default" to ""), "loadingMode" to _uM("type" to "String", "default" to "spinner"), "loadingSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 15), "loadingIcon" to _uM("type" to "String", "default" to "loading")))
        var propsNeedCastKeys = _uA(
            "modelValue",
            "value",
            "loading",
            "disabled",
            "shape",
            "size",
            "width",
            "activeColor",
            "inactiveColor",
            "activeValue",
            "inactiveValue",
            "asyncChange",
            "space",
            "textSpace",
            "activeText",
            "inactiveText",
            "loadingMode",
            "loadingSize",
            "loadingIcon"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
