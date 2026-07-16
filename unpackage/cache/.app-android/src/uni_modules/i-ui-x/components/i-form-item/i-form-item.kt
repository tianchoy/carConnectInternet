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
open class GenUniModulesIUiXComponentsIFormItemIFormItem : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var name: String by `$props`
    open var label: String by `$props`
    open var hint: String by `$props`
    open var error: String by `$props`
    open var required: Boolean by `$props`
    open var scrollId: String by `$props`
    open var scrollIdPrefix: String by `$props`
    open var labelWidth: Any by `$props`
    open var labelDirection: String by `$props`
    open var labelFontColor: String by `$props`
    open var labelFontSize: Any by `$props`
    open var showLabel: Boolean by `$props`
    open var errorAlign: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIFormItemIFormItem) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIFormItemIFormItem
            val _cache = __ins.renderCache
            val props = __props
            val itemId = computed(fun(): String {
                if (props.scrollId.length > 0) {
                    return props.scrollId
                }
                if (props.name.length == 0) {
                    return ""
                }
                return props.scrollIdPrefix + normalizeIdName(props.name)
            }
            )
            val itemClass = computed(fun(): String {
                val classes = _uA(
                    "i-form-item"
                )
                if (props.labelDirection == "horizontal") {
                    classes.push("i-form-item--horizontal")
                }
                return classes.join(" ")
            }
            )
            val headerClass = computed(fun(): String {
                val classes = _uA(
                    "i-form-item__header"
                )
                if (props.labelDirection == "horizontal") {
                    classes.push("i-form-item__header--horizontal")
                }
                return classes.join(" ")
            }
            )
            val contentClass = computed(fun(): String {
                val classes = _uA(
                    "i-form-item__content"
                )
                if (props.labelDirection == "horizontal") {
                    classes.push("i-form-item__content--horizontal")
                }
                return classes.join(" ")
            }
            )
            val headerStyle = computed(fun(): String {
                if (props.labelDirection != "horizontal") {
                    return ""
                }
                return "width:" + formatSize(props.labelWidth) + ";"
            }
            )
            val labelStyle = computed(fun(): String {
                return ("color:" + props.labelFontColor + ";font-size:" + formatSize(props.labelFontSize) + ";")
            }
            )
            val footerStyle = computed(fun(): String {
                return "text-align:" + props.errorAlign + ";"
            }
            )
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_normalizeIdName_fn(name): String {
                val text = String(name)
                var result = ""
                run {
                    var i: Number = 0
                    while(i < text.length){
                        val code = text.charCodeAt(i)
                        val char = text.charAt(i)
                        val isNumber = code >= 48 && code <= 57
                        val isUpper = code >= 65 && code <= 90
                        val isLower = code >= 97 && code <= 122
                        if (isNumber || isUpper || isLower || char == "-" || char == "_") {
                            result = result + char
                        } else {
                            result = result + "-"
                        }
                        i++
                    }
                }
                return result
            }
            val normalizeIdName = ::gen_normalizeIdName_fn
            return fun(): Any? {
                return _cE("view", _uM("id" to itemId.value, "class" to _nC(itemClass.value)), _uA(
                    if (isTrue(_ctx.showLabel)) {
                        _cE("view", _uM("key" to 0, "class" to _nC(headerClass.value), "style" to _nS(headerStyle.value)), _uA(
                            if (isTrue(_ctx.required)) {
                                _cE("text", _uM("key" to 0, "class" to "i-form-item__required"), "*")
                            } else {
                                _cC("v-if", true)
                            },
                            _cE("text", _uM("class" to "i-form-item__label", "style" to _nS(labelStyle.value)), _tD(_ctx.label), 5)
                        ), 6)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    _cE("view", _uM("class" to "i-form-item__body"), _uA(
                        _cE("view", _uM("class" to _nC(contentClass.value)), _uA(
                            renderSlot(_ctx.`$slots`, "default")
                        ), 2),
                        if (_ctx.error.length > 0) {
                            _cE("text", _uM("key" to 0, "class" to "i-form-item__error", "style" to _nS(footerStyle.value)), _tD(_ctx.error), 5)
                        } else {
                            if (_ctx.hint.length > 0) {
                                _cE("text", _uM("key" to 1, "class" to "i-form-item__hint", "style" to _nS(footerStyle.value)), _tD(_ctx.hint), 5)
                            } else {
                                _cC("v-if", true)
                            }
                        }
                    ))
                ), 10, _uA(
                    "id"
                ))
            }
        }
        var name = "i-form-item"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-form-item" to _pS(_uM("paddingTop" to 12, "paddingRight" to 14, "paddingBottom" to 12, "paddingLeft" to 14, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#ffffff")), "i-form-item--horizontal" to _pS(_uM("flexDirection" to "row", "alignItems" to "flex-start")), "i-form-item__header" to _pS(_uM("flexDirection" to "row", "alignItems" to "center")), "i-form-item__header--horizontal" to _pS(_uM("minHeight" to 40)), "i-form-item__required" to _pS(_uM("marginRight" to 4, "color" to "#fa3534", "fontSize" to 14, "lineHeight" to "22px")), "i-form-item__label" to _pS(_uM("color" to "#303133", "fontSize" to 14, "fontWeight" to 600, "lineHeight" to "22px")), "i-form-item__content" to _pS(_uM("marginTop" to 8)), "i-form-item__content--horizontal" to _pS(_uM("marginTop" to 0)), "i-form-item__body" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "i-form-item__hint" to _pS(_uM("marginTop" to 6, "color" to "#909399", "fontSize" to 12, "lineHeight" to "18px")), "i-form-item__error" to _pS(_uM("marginTop" to 6, "color" to "#fa3534", "fontSize" to 12, "lineHeight" to "18px")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM("name" to _uM("type" to "String", "default" to ""), "label" to _uM("type" to "String", "default" to ""), "hint" to _uM("type" to "String", "default" to ""), "error" to _uM("type" to "String", "default" to ""), "required" to _uM("type" to "Boolean", "default" to false), "scrollId" to _uM("type" to "String", "default" to ""), "scrollIdPrefix" to _uM("type" to "String", "default" to "i-form-item-"), "labelWidth" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "100px"), "labelDirection" to _uM("type" to "String", "default" to "vertical"), "labelFontColor" to _uM("type" to "String", "default" to "#303133"), "labelFontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "14px"), "showLabel" to _uM("type" to "Boolean", "default" to true), "errorAlign" to _uM("type" to "String", "default" to "left")))
        var propsNeedCastKeys = _uA(
            "name",
            "label",
            "hint",
            "error",
            "required",
            "scrollId",
            "scrollIdPrefix",
            "labelWidth",
            "labelDirection",
            "labelFontColor",
            "labelFontSize",
            "showLabel",
            "errorAlign"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
