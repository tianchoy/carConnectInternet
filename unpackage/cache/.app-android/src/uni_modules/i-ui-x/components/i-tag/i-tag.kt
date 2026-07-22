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
open class GenUniModulesIUiXComponentsITagITag : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var type: String by `$props`
    open var plain: Boolean by `$props`
    open var skin: String by `$props`
    open var round: Any by `$props`
    open var text: Any by `$props`
    open var size: String by `$props`
    open var width: Any by `$props`
    open var height: Any by `$props`
    open var closable: Boolean by `$props`
    open var disabled: Boolean by `$props`
    open var icon: String by `$props`
    open var iconSize: Any by `$props`
    open var fontSize: Any by `$props`
    open var color: String by `$props`
    open var fontColor: String by `$props`
    open var bgColor: String by `$props`
    open var borderColor: String by `$props`
    open var borderWidth: Any by `$props`
    open var linear: UTSArray<Any?> by `$props`
    open var shadow: Any by `$props`
    open var closeIcon: String by `$props`
    open var customStyle: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsITagITag) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsITagITag
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val closeClicking = ref(false)
            val contentText = computed(fun(): String {
                return props.text.toString()
            }
            )
            val normalizedType = computed(fun(): String {
                if (props.type == "danger") {
                    return "error"
                }
                if (props.type == "warn") {
                    return "warning"
                }
                return props.type
            }
            )
            val normalizedSkin = computed(fun(): String {
                if (props.plain) {
                    return "outlined"
                }
                if (props.skin == "outline") {
                    return "outlined"
                }
                if (props.skin == "light") {
                    return "thin"
                }
                if (props.skin == "plain") {
                    return "outlined"
                }
                return props.skin
            }
            )
            val themeColor = computed(fun(): String {
                if (props.color.length > 0) {
                    return props.color
                }
                if (normalizedType.value == "primary") {
                    return "#3c9cff"
                }
                if (normalizedType.value == "success") {
                    return "#5ac725"
                }
                if (normalizedType.value == "warning") {
                    return "#f9ae3d"
                }
                if (normalizedType.value == "error") {
                    return "#f56c6c"
                }
                if (normalizedType.value == "info") {
                    return "#909399"
                }
                return "#303133"
            }
            )
            val computedTextColor = computed(fun(): String {
                if (props.fontColor.length > 0) {
                    return props.fontColor
                }
                if (props.color.length > 0 && normalizedSkin.value == "normal") {
                    return "#ffffff"
                }
                if (normalizedSkin.value == "normal" && bgColor.value.length == 0 && props.linear.length == 0) {
                    return "#ffffff"
                }
                return themeColor.value
            }
            )
            val computedIconSize = computed(fun(): Any {
                if (props.iconSize.toString().length > 0) {
                    return props.iconSize
                }
                if (props.fontSize.toString().length > 0) {
                    return props.fontSize
                }
                if (props.size == "xs" || props.size == "mini") {
                    return 11
                }
                if (props.size == "s" || props.size == "small") {
                    return 12
                }
                if (props.size == "g" || props.size == "large") {
                    return 15
                }
                return 13
            }
            )
            val closeText = computed(fun(): String {
                if (props.closeIcon == "close" || props.closeIcon == "close-line") {
                    return "x"
                }
                return props.closeIcon
            }
            )
            val normalizedSize = computed(fun(): String {
                if (props.size == "xs" || props.size == "mini") {
                    return "xs"
                }
                if (props.size == "s" || props.size == "small") {
                    return "small"
                }
                if (props.size == "m" || props.size == "normal" || props.size == "n") {
                    return "normal"
                }
                if (props.size == "g" || props.size == "large") {
                    return "large"
                }
                return props.size
            }
            )
            val isCustomRound = computed(fun(): Boolean {
                if (UTSAndroid.`typeof`(props.round) == "boolean") {
                    return false
                }
                return (props.round as Any).toString().length > 0
            }
            )
            val isRound = computed(fun(): Boolean {
                if (UTSAndroid.`typeof`(props.round) == "boolean") {
                    return props.round as Boolean
                }
                return (props.round as Any).toString().length > 0
            }
            )
            val tagClass = computed(fun(): String {
                val classes = _uA(
                    "i-tag",
                    "i-tag--" + normalizedType.value,
                    "i-tag--" + normalizedSize.value,
                    "i-tag--" + normalizedSkin.value
                )
                classes.push("i-tag--" + normalizedSkin.value + "-" + normalizedType.value)
                if (isRound.value) {
                    classes.push("i-tag--round")
                }
                if (props.disabled) {
                    classes.push("i-tag--disabled")
                }
                return classes.join(" ")
            }
            )
            val textClass = computed(fun(): String {
                val classes = _uA(
                    "i-tag__text"
                )
                if (normalizedSize.value == "xs") {
                    classes.push("i-tag__text--xs")
                }
                if (normalizedSize.value == "large") {
                    classes.push("i-tag__text--large")
                }
                return classes.join(" ")
            }
            )
            val closeClass = computed(fun(): String {
                val classes = _uA(
                    "i-tag__close"
                )
                if (normalizedSize.value == "xs") {
                    classes.push("i-tag__close--xs")
                }
                return classes.join(" ")
            }
            )
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("rem") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val shadowStyle = computed(fun(): String {
                val value = props.shadow
                val text = value.toString()
                if (text.length == 0 || text == "none") {
                    return ""
                }
                if (UTSArray.isArray(value) && (value as UTSArray<*>).length >= 4) {
                    val shadowValues = value as UTSArray<Any>
                    return ("box-shadow:" + formatSize(shadowValues[0]) + " " + formatSize(shadowValues[1]) + " " + formatSize(shadowValues[2]) + " " + shadowValues[3].toString() + ";")
                }
                return "box-shadow:0 " + formatSize(value) + " " + formatSize(parseFloat(value.toString()) * 2) + " rgba(0,0,0,0.12);"
            }
            )
            val tagStyle = computed(fun(): String {
                var style = ""
                if (props.width.toString().length > 0) {
                    style = style + "width:" + formatSize(props.width) + ";"
                }
                if (props.height.toString().length > 0) {
                    style = style + "height:" + formatSize(props.height) + ";"
                }
                if (props.borderWidth != 1) {
                    style = style + "border-width:" + formatSize(props.borderWidth) + ";"
                }
                if (isCustomRound.value) {
                    style = style + "border-radius:" + formatSize(props.round) + ";"
                }
                if (props.linear.length >= 3) {
                    style = style + "background:linear-gradient(" + props.linear[0].toString() + "," + props.linear[1].toString() + "," + props.linear[2].toString() + ");border-color:transparent;"
                } else if (bgColor.value.length > 0) {
                    style = style + "background-color:" + bgColor.value + ";"
                    if (normalizedSkin.value == "normal" && props.borderColor.length == 0) {
                        style = style + "border-color:" + bgColor.value + ";"
                    }
                }
                if (props.borderColor.length > 0) {
                    style = style + "border-color:" + props.borderColor + ";"
                }
                if (shadowStyle.value.length > 0) {
                    style = style + shadowStyle.value
                }
                if (props.customStyle.length > 0) {
                    style = style + props.customStyle
                }
                return style
            }
            )
            val textStyle = computed(fun(): String {
                var style = "color:" + computedTextColor.value + ";"
                if (props.fontSize.toString().length > 0) {
                    style = style + "font-size:" + formatSize(props.fontSize) + ";"
                }
                return style
            }
            )
            val closeStyle = computed(fun(): String {
                return "color:" + computedTextColor.value + ";"
            }
            )
            fun gen_handleClick_fn(event: Any): Unit {
                if (closeClicking.value) {
                    closeClicking.value = false
                    return
                }
                if (props.disabled) {
                    return
                }
                emit("click", event)
            }
            val handleClick = ::gen_handleClick_fn
            fun gen_handleClose_fn() {
                if (props.disabled) {
                    return
                }
                closeClicking.value = true
                emit("close", contentText.value)
                setTimeout(fun(){
                    closeClicking.value = false
                }
                , 0)
            }
            val handleClose = ::gen_handleClose_fn
            return fun(): Any? {
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                return _cE("view", _uM("class" to _nC(tagClass.value), "style" to _nS(tagStyle.value), "onClick" to withModifiers(handleClick, _uA(
                    "stop"
                ))), _uA(
                    if (_ctx.icon.length > 0) {
                        _cV(_component_i_icon, _uM("key" to 0, "class" to "i-tag__icon", "name" to _ctx.icon, "fontSize" to computedIconSize.value, "color" to computedTextColor.value), null, 8, _uA(
                            "name",
                            "fontSize",
                            "color"
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (contentText.value.length > 0) {
                        _cE("text", _uM("key" to 1, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _tD(contentText.value), 7)
                    } else {
                        _cE("text", _uM("key" to 2, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _uA(
                            renderSlot(_ctx.`$slots`, "default")
                        ), 6)
                    }
                    ,
                    if (isTrue(_ctx.closable)) {
                        _cE("text", _uM("key" to 3, "class" to _nC(closeClass.value), "style" to _nS(closeStyle.value), "onClick" to handleClose), _tD(closeText.value), 7)
                    } else {
                        _cC("v-if", true)
                    }
                ), 6)
            }
        }
        var name = "i-tag"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-tag" to _pS(_uM("height" to 28, "paddingTop" to 0, "paddingRight" to 10, "paddingBottom" to 0, "paddingLeft" to 10, "borderTopLeftRadius" to 4, "borderTopRightRadius" to 4, "borderBottomRightRadius" to 4, "borderBottomLeftRadius" to 4, "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "rgba(0,0,0,0)", "borderRightColor" to "rgba(0,0,0,0)", "borderBottomColor" to "rgba(0,0,0,0)", "borderLeftColor" to "rgba(0,0,0,0)", "alignItems" to "center", "justifyContent" to "center", "flexDirection" to "row", "backgroundColor" to "#3c9cff", "overflow" to "hidden")), "i-tag--round" to _pS(_uM("borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999)), "i-tag--xs" to _pS(_uM("height" to 20, "paddingTop" to 0, "paddingRight" to 7, "paddingBottom" to 0, "paddingLeft" to 7)), "i-tag--small" to _pS(_uM("height" to 22, "paddingTop" to 0, "paddingRight" to 8, "paddingBottom" to 0, "paddingLeft" to 8)), "i-tag--large" to _pS(_uM("height" to 34, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12)), "i-tag--disabled" to _pS(_uM("opacity" to 0.5)), "i-tag--primary" to _pS(_uM("backgroundColor" to "#3c9cff", "borderTopColor" to "#3c9cff", "borderRightColor" to "#3c9cff", "borderBottomColor" to "#3c9cff", "borderLeftColor" to "#3c9cff")), "i-tag--success" to _pS(_uM("backgroundColor" to "#5ac725", "borderTopColor" to "#5ac725", "borderRightColor" to "#5ac725", "borderBottomColor" to "#5ac725", "borderLeftColor" to "#5ac725")), "i-tag--warning" to _pS(_uM("backgroundColor" to "#f9ae3d", "borderTopColor" to "#f9ae3d", "borderRightColor" to "#f9ae3d", "borderBottomColor" to "#f9ae3d", "borderLeftColor" to "#f9ae3d")), "i-tag--error" to _pS(_uM("backgroundColor" to "#f56c6c", "borderTopColor" to "#f56c6c", "borderRightColor" to "#f56c6c", "borderBottomColor" to "#f56c6c", "borderLeftColor" to "#f56c6c")), "i-tag--info" to _pS(_uM("backgroundColor" to "#909399", "borderTopColor" to "#909399", "borderRightColor" to "#909399", "borderBottomColor" to "#909399", "borderLeftColor" to "#909399")), "i-tag--thin" to _pS(_uM("backgroundColor" to "#ecf5ff", "borderTopColor" to "#ecf5ff", "borderRightColor" to "#ecf5ff", "borderBottomColor" to "#ecf5ff", "borderLeftColor" to "#ecf5ff")), "i-tag--thin-success" to _pS(_uM("backgroundColor" to "#f0f9eb", "borderTopColor" to "#f0f9eb", "borderRightColor" to "#f0f9eb", "borderBottomColor" to "#f0f9eb", "borderLeftColor" to "#f0f9eb")), "i-tag--thin-warning" to _pS(_uM("backgroundColor" to "#fdf6ec", "borderTopColor" to "#fdf6ec", "borderRightColor" to "#fdf6ec", "borderBottomColor" to "#fdf6ec", "borderLeftColor" to "#fdf6ec")), "i-tag--thin-error" to _pS(_uM("backgroundColor" to "#fef0f0", "borderTopColor" to "#fef0f0", "borderRightColor" to "#fef0f0", "borderBottomColor" to "#fef0f0", "borderLeftColor" to "#fef0f0")), "i-tag--thin-info" to _pS(_uM("backgroundColor" to "#f4f4f5", "borderTopColor" to "#f4f4f5", "borderRightColor" to "#f4f4f5", "borderBottomColor" to "#f4f4f5", "borderLeftColor" to "#f4f4f5")), "i-tag--outlined" to _pS(_uM("backgroundColor" to "#ffffff")), "i-tag--dashed" to _pS(_uM("backgroundColor" to "#ffffff", "borderTopStyle" to "dashed", "borderRightStyle" to "dashed", "borderBottomStyle" to "dashed", "borderLeftStyle" to "dashed")), "i-tag--text" to _pS(_uM("backgroundColor" to "#ffffff", "borderTopColor" to "rgba(0,0,0,0)", "borderRightColor" to "rgba(0,0,0,0)", "borderBottomColor" to "rgba(0,0,0,0)", "borderLeftColor" to "rgba(0,0,0,0)")), "i-tag--outlined-primary" to _pS(_uM("borderTopColor" to "#3c9cff", "borderRightColor" to "#3c9cff", "borderBottomColor" to "#3c9cff", "borderLeftColor" to "#3c9cff")), "i-tag--dashed-primary" to _pS(_uM("borderTopColor" to "#3c9cff", "borderRightColor" to "#3c9cff", "borderBottomColor" to "#3c9cff", "borderLeftColor" to "#3c9cff")), "i-tag--outlined-success" to _pS(_uM("borderTopColor" to "#5ac725", "borderRightColor" to "#5ac725", "borderBottomColor" to "#5ac725", "borderLeftColor" to "#5ac725")), "i-tag--dashed-success" to _pS(_uM("borderTopColor" to "#5ac725", "borderRightColor" to "#5ac725", "borderBottomColor" to "#5ac725", "borderLeftColor" to "#5ac725")), "i-tag--outlined-warning" to _pS(_uM("borderTopColor" to "#f9ae3d", "borderRightColor" to "#f9ae3d", "borderBottomColor" to "#f9ae3d", "borderLeftColor" to "#f9ae3d")), "i-tag--dashed-warning" to _pS(_uM("borderTopColor" to "#f9ae3d", "borderRightColor" to "#f9ae3d", "borderBottomColor" to "#f9ae3d", "borderLeftColor" to "#f9ae3d")), "i-tag--outlined-error" to _pS(_uM("borderTopColor" to "#f56c6c", "borderRightColor" to "#f56c6c", "borderBottomColor" to "#f56c6c", "borderLeftColor" to "#f56c6c")), "i-tag--dashed-error" to _pS(_uM("borderTopColor" to "#f56c6c", "borderRightColor" to "#f56c6c", "borderBottomColor" to "#f56c6c", "borderLeftColor" to "#f56c6c")), "i-tag--outlined-info" to _pS(_uM("borderTopColor" to "#909399", "borderRightColor" to "#909399", "borderBottomColor" to "#909399", "borderLeftColor" to "#909399")), "i-tag--dashed-info" to _pS(_uM("borderTopColor" to "#909399", "borderRightColor" to "#909399", "borderBottomColor" to "#909399", "borderLeftColor" to "#909399")), "i-tag__text" to _pS(_uM("color" to "#ffffff", "fontSize" to 12, "lineHeight" to "18px")), "i-tag__text--xs" to _pS(_uM("fontSize" to 11, "lineHeight" to "16px")), "i-tag__text--large" to _pS(_uM("fontSize" to 14, "lineHeight" to "20px")), "i-tag__icon" to _pS(_uM("marginRight" to 4)), "i-tag__close" to _pS(_uM("marginLeft" to 5, "color" to "#ffffff", "fontSize" to 14, "lineHeight" to "18px")), "i-tag__close--xs" to _pS(_uM("fontSize" to 12, "lineHeight" to "16px")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "close" to null)
        var props = _nP(_uM("type" to _uM("type" to "String", "default" to "primary"), "plain" to _uM("type" to "Boolean", "default" to false), "skin" to _uM("type" to "String", "default" to "normal"), "round" to _uM("type" to _uA(
            "Boolean",
            "String",
            "Number"
        ), "default" to false), "text" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "size" to _uM("type" to "String", "default" to "normal"), "width" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "height" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "closable" to _uM("type" to "Boolean", "default" to false), "disabled" to _uM("type" to "Boolean", "default" to false), "icon" to _uM("type" to "String", "default" to ""), "iconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "fontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "color" to _uM("type" to "String", "default" to ""), "fontColor" to _uM("type" to "String", "default" to ""), "bgColor" to _uM("type" to "String", "default" to ""), "borderColor" to _uM("type" to "String", "default" to ""), "borderWidth" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 1), "linear" to _uM("type" to "Array", "default" to fun(): UTSArray<String> {
            return _uA<String>()
        }
        ), "shadow" to _uM("type" to _uA(
            "String",
            "Number",
            "Array"
        ), "default" to ""), "closeIcon" to _uM("type" to "String", "default" to "x"), "customStyle" to _uM("type" to "String", "default" to "")))
        var propsNeedCastKeys = _uA(
            "type",
            "plain",
            "skin",
            "round",
            "text",
            "size",
            "width",
            "height",
            "closable",
            "disabled",
            "icon",
            "iconSize",
            "fontSize",
            "color",
            "fontColor",
            "bgColor",
            "borderColor",
            "borderWidth",
            "linear",
            "shadow",
            "closeIcon",
            "customStyle"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
