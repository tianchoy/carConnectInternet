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
open class GenUniModulesIUiXComponentsIEmptyIEmpty : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var icon: String by `$props`
    open var image: String by `$props`
    open var text: String by `$props`
    open var description: String by `$props`
    open var buttonText: String by `$props`
    open var showButton: Boolean by `$props`
    open var iconSize: Any by `$props`
    open var iconColor: String by `$props`
    open var textColor: String by `$props`
    open var descriptionColor: String by `$props`
    open var buttonColor: String by `$props`
    open var buttonTextColor: String by `$props`
    open var padding: Any by `$props`
    open var bgColor: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIEmptyIEmpty) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIEmptyIEmpty
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val wrapStyle = computed(fun(): String {
                return "padding:" + formatBoxSize(props.padding) + ";background-color:" + bgColor.value + ";"
            }
            )
            val iconStyle = computed(fun(): String {
                return "font-size:" + formatSize(props.iconSize) + ";color:" + props.iconColor + ";"
            }
            )
            val textStyle = computed(fun(): String {
                return "color:" + props.textColor + ";"
            }
            )
            val descStyle = computed(fun(): String {
                return "color:" + props.descriptionColor + ";"
            }
            )
            val buttonStyle = computed(fun(): String {
                return "background-color:" + props.buttonColor + ";"
            }
            )
            val buttonTextStyle = computed(fun(): String {
                return "color:" + props.buttonTextColor + ";"
            }
            )
            fun gen_formatBoxSize_fn(value): String {
                val text = String(value)
                if (text.indexOf(" ") >= 0) {
                    return text
                }
                return formatSize(value)
            }
            val formatBoxSize = ::gen_formatBoxSize_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to "i-empty", "style" to _nS(wrapStyle.value), "onClick" to fun(){
                    emit("click")
                }
                ), _uA(
                    renderSlot(_ctx.`$slots`, "image", _uO(), fun(): UTSArray<Any> {
                        return _uA(
                            if (_ctx.image.length > 0) {
                                _cE("image", _uM("key" to 0, "class" to "i-empty__image", "src" to _ctx.image, "mode" to "aspectFit"), null, 8, _uA(
                                    "src"
                                ))
                            } else {
                                _cE("text", _uM("key" to 1, "class" to "i-empty__icon", "style" to _nS(iconStyle.value)), _tD(_ctx.icon), 5)
                            }
                        )
                    }
                    ),
                    _cE("text", _uM("class" to "i-empty__text", "style" to _nS(textStyle.value)), _tD(_ctx.text), 5),
                    if (_ctx.description.length > 0) {
                        _cE("text", _uM("key" to 0, "class" to "i-empty__desc", "style" to _nS(descStyle.value)), _tD(_ctx.description), 5)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    renderSlot(_ctx.`$slots`, "default", _uO(), fun(): UTSArray<Any> {
                        return _uA(
                            if (isTrue(_ctx.showButton)) {
                                _cE("view", _uM("key" to 0, "class" to "i-empty__button", "style" to _nS(buttonStyle.value), "onClick" to withModifiers(fun(){
                                    emit("retry")
                                }, _uA(
                                    "stop"
                                ))), _uA(
                                    _cE("text", _uM("class" to "i-empty__button-text", "style" to _nS(buttonTextStyle.value)), _tD(_ctx.buttonText), 5)
                                ), 12, _uA(
                                    "onClick"
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        )
                    }
                    )
                ), 12, _uA(
                    "onClick"
                ))
            }
        }
        var name = "i-empty"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-empty" to _pS(_uM("borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "alignItems" to "center")), "i-empty__image" to _pS(_uM("width" to 110, "height" to 110)), "i-empty__icon" to _pS(_uM("lineHeight" to "52px")), "i-empty__text" to _pS(_uM("marginTop" to 8, "fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")), "i-empty__desc" to _pS(_uM("marginTop" to 4, "fontSize" to 12, "lineHeight" to "18px", "textAlign" to "center")), "i-empty__button" to _pS(_uM("minWidth" to 96, "height" to 36, "marginTop" to 14, "paddingTop" to 0, "paddingRight" to 14, "paddingBottom" to 0, "paddingLeft" to 14, "borderTopLeftRadius" to 18, "borderTopRightRadius" to 18, "borderBottomRightRadius" to 18, "borderBottomLeftRadius" to 18, "alignItems" to "center", "justifyContent" to "center")), "i-empty__button-text" to _pS(_uM("fontSize" to 13, "lineHeight" to "18px")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "retry" to null)
        var props = _nP(_uM("icon" to _uM("type" to "String", "default" to "∅"), "image" to _uM("type" to "String", "default" to ""), "text" to _uM("type" to "String", "default" to "暂无数据"), "description" to _uM("type" to "String", "default" to "可以点击按钮重新加载。"), "buttonText" to _uM("type" to "String", "default" to "重新加载"), "showButton" to _uM("type" to "Boolean", "default" to true), "iconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 42), "iconColor" to _uM("type" to "String", "default" to "#c0c4cc"), "textColor" to _uM("type" to "String", "default" to "#303133"), "descriptionColor" to _uM("type" to "String", "default" to "#909399"), "buttonColor" to _uM("type" to "String", "default" to "#2979ff"), "buttonTextColor" to _uM("type" to "String", "default" to "#ffffff"), "padding" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "28px 16px"), "bgColor" to _uM("type" to "String", "default" to "#ffffff")))
        var propsNeedCastKeys = _uA(
            "icon",
            "image",
            "text",
            "description",
            "buttonText",
            "showButton",
            "iconSize",
            "iconColor",
            "textColor",
            "descriptionColor",
            "buttonColor",
            "buttonTextColor",
            "padding",
            "bgColor"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
