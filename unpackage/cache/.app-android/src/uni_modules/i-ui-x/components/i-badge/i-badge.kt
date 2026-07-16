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
open class GenUniModulesIUiXComponentsIBadgeIBadge : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var label: String by `$props`
    open var count: Number by `$props`
    open var value: Any by `$props`
    open var type: String by `$props`
    open var dot: Boolean by `$props`
    open var maxCount: Number by `$props`
    open var max: Number by `$props`
    open var position: String by `$props`
    open var offset: UTSArray<Any?>? by `$props`
    open var fontSize: Any by `$props`
    open var showZero: Boolean by `$props`
    open var hidden: Boolean by `$props`
    open var bgColor: String by `$props`
    open var fontColor: String by `$props`
    open var color: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIBadgeIBadge) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIBadgeIBadge
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val showBadge = computed(fun(): Boolean {
                if (props.hidden) {
                    return false
                }
                if (props.label.length > 0) {
                    return true
                }
                if (hasNumberValue()) {
                    if (effectiveCount() == 0 && !props.showZero) {
                        return props.dot
                    }
                    return true
                }
                return props.dot
            }
            )
            val displayValue = computed(fun(): String {
                if (props.label.length > 0) {
                    return props.label
                }
                val value = effectiveCount()
                val max = getMaxCount()
                if (value > max) {
                    return max + "+"
                }
                return String(value)
            }
            )
            val dot = computed(fun(): Boolean {
                if (props.label.length > 0) {
                    return false
                }
                if (hasNumberValue()) {
                    if (effectiveCount() == 0 && !props.showZero) {
                        return props.dot
                    }
                    return false
                }
                return props.dot
            }
            )
            val rootClass = computed(fun(): String {
                val classes = _uA(
                    "i-badge"
                )
                val position = normalizePosition(props.position)
                classes.push("i-badge--" + position)
                if (dot.value) {
                    classes.push("i-badge--dot")
                }
                if (position == "left" || position == "bottomLeft") {
                    classes.push("i-badge--left-space")
                }
                if (dot.value && (position == "left" || position == "bottomLeft")) {
                    classes.push("i-badge--dot-left-space")
                }
                if (dot.value && (position == "bottomLeft" || position == "bottomRight" || position == "bottom")) {
                    classes.push("i-badge--dot-bottom")
                }
                if (dot.value && position == "top") {
                    classes.push("i-badge--dot-top")
                }
                return classes.join(" ")
            }
            )
            val badgeClass = computed(fun(): String {
                val classes = _uA(
                    "i-badge__mark",
                    "i-badge__mark--" + normalizeTheme(effectiveBgColor())
                )
                if (dot.value) {
                    classes.push("i-badge__mark--dot")
                }
                classes.push("i-badge__mark--" + normalizePosition(props.position))
                return classes.join(" ")
            }
            )
            val badgeStyle = computed(fun(): String {
                var style = positionStyle()
                val bgColor = parseColor(effectiveBgColor())
                if (bgColor.length > 0) {
                    style = style + "background-color:" + bgColor + ";"
                }
                return style
            }
            )
            val badgeTextStyle = computed(fun(): String {
                return "color:" + parseColor(effectiveFontColor()) + ";font-size:" + formatSize(props.fontSize) + ";"
            }
            )
            fun gen_handleClick_fn() {
                emit("click", _uO("label" to props.label, "count" to effectiveCount(), "value" to displayValue.value, "dot" to dot.value, "position" to props.position))
            }
            val handleClick = ::gen_handleClick_fn
            fun gen_hasNumberValue_fn(): Boolean {
                return String(props.value).length > 0 || props.count > 0 || props.showZero
            }
            val hasNumberValue = ::gen_hasNumberValue_fn
            fun gen_effectiveCount_fn(): Number {
                if (String(props.value).length > 0) {
                    return Number(props.value)
                }
                return props.count
            }
            val effectiveCount = ::gen_effectiveCount_fn
            fun gen_getMaxCount_fn(): Number {
                if (props.maxCount != 99) {
                    return props.maxCount
                }
                return props.max
            }
            val getMaxCount = ::gen_getMaxCount_fn
            fun gen_effectiveBgColor_fn(): String {
                if (bgColor.value.length > 0) {
                    return bgColor.value
                }
                return props.type
            }
            val effectiveBgColor = ::gen_effectiveBgColor_fn
            fun gen_effectiveFontColor_fn(): String {
                if (props.color.length > 0) {
                    return props.color
                }
                return props.fontColor
            }
            val effectiveFontColor = ::gen_effectiveFontColor_fn
            fun gen_normalizeTheme_fn(value: String): String {
                val text = String(value)
                if (text == "danger") {
                    return "error"
                }
                if (text == "error" || text == "primary" || text == "success" || text == "warning" || text == "info") {
                    return text
                }
                return "custom"
            }
            val normalizeTheme = ::gen_normalizeTheme_fn
            fun gen_parseColor_fn(value: String): String {
                val text = String(value)
                if (text == "white") {
                    return "#ffffff"
                }
                if (text == "black") {
                    return "#000000"
                }
                if (text == "danger" || text == "error") {
                    return "#f56c6c"
                }
                if (text == "primary") {
                    return "#3c9cff"
                }
                if (text == "success") {
                    return "#5ac725"
                }
                if (text == "warning") {
                    return "#f9ae3d"
                }
                if (text == "info") {
                    return "#909399"
                }
                return text
            }
            val parseColor = ::gen_parseColor_fn
            fun gen_normalizePosition_fn(value: String): String {
                val text = String(value)
                if (text == "rightTop") {
                    return "right"
                }
                if (text == "leftTop") {
                    return "left"
                }
                if (text == "rightBottom") {
                    return "bottomRight"
                }
                if (text == "leftBottom") {
                    return "bottomLeft"
                }
                if (text == "left" || text == "right" || text == "bottomLeft" || text == "bottomRight" || text == "top" || text == "bottom") {
                    return text
                }
                return "right"
            }
            val normalizePosition = ::gen_normalizePosition_fn
            fun gen_positionStyle_fn(): String {
                val x = getOffset(0)
                val y = getOffset(1)
                val position = normalizePosition(props.position)
                val edge: Number = 0
                if (position == "left") {
                    return "left:" + (edge + x) + "px;top:" + (edge + y) + "px;"
                }
                if (position == "bottomLeft") {
                    return "left:" + (edge + x) + "px;bottom:" + (edge - y) + "px;"
                }
                if (position == "bottomRight") {
                    return "right:" + (edge - x) + "px;bottom:" + (edge - y) + "px;"
                }
                if (position == "top") {
                    return "left:50%;top:" + (edge + y) + "px;transform:translateX(-50%);margin-left:" + x + "px;"
                }
                if (position == "bottom") {
                    return "left:50%;bottom:" + (edge - y) + "px;transform:translateX(-50%);margin-left:" + x + "px;"
                }
                return "right:" + (edge - x) + "px;top:" + (edge + y) + "px;"
            }
            val positionStyle = ::gen_positionStyle_fn
            fun gen_getOffset_fn(index: Number): Number {
                if (props.offset.length <= index) {
                    return 0
                }
                return Number(props.offset[index])
            }
            val getOffset = ::gen_getOffset_fn
            fun formatSize(value: Any): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            return fun(): Any? {
                return _cE("view", _uM("class" to _nC(rootClass.value)), _uA(
                    renderSlot(_ctx.`$slots`, "default"),
                    if (isTrue(showBadge.value && dot.value)) {
                        _cE("view", _uM("key" to 0, "class" to _nC(badgeClass.value), "style" to _nS(badgeStyle.value), "onClick" to handleClick), null, 6)
                    } else {
                        if (isTrue(showBadge.value)) {
                            _cE("view", _uM("key" to 1, "class" to _nC(badgeClass.value), "style" to _nS(badgeStyle.value), "onClick" to handleClick), _uA(
                                _cE("text", _uM("class" to "i-badge__text", "style" to _nS(badgeTextStyle.value)), _tD(displayValue.value), 5)
                            ), 6)
                        } else {
                            _cC("v-if", true)
                        }
                    }
                ), 2)
            }
        }
        var name = "i-badge"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-badge" to _pS(_uM("position" to "relative", "alignSelf" to "flex-start", "paddingTop" to 10, "paddingRight" to 12, "overflow" to "visible")), "i-badge--left-space" to _pS(_uM("paddingLeft" to 12, "paddingRight" to 0)), "i-badge--dot" to _pS(_uM("paddingTop" to 4, "paddingRight" to 4)), "i-badge--dot-left-space" to _pS(_uM("paddingLeft" to 4, "paddingRight" to 0)), "i-badge--bottomLeft" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 10)), "i-badge--bottomRight" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 10)), "i-badge--bottom" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 10)), "i-badge--dot-bottom" to _pS(_uM("paddingBottom" to 4)), "i-badge--top" to _pS(_uM("paddingRight" to 0)), "i-badge--dot-top" to _pS(_uM("paddingRight" to 0)), "i-badge__mark" to _pS(_uM("position" to "absolute", "zIndex" to 2, "minWidth" to 20, "height" to 20, "paddingTop" to 0, "paddingRight" to 6, "paddingBottom" to 0, "paddingLeft" to 6, "borderTopLeftRadius" to 10, "borderTopRightRadius" to 10, "borderBottomRightRadius" to 10, "borderBottomLeftRadius" to 10, "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "overflow" to "visible")), "i-badge__mark--dot" to _pS(_uM("width" to 8, "minWidth" to 8, "height" to 8, "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0, "borderTopLeftRadius" to 4, "borderTopRightRadius" to 4, "borderBottomRightRadius" to 4, "borderBottomLeftRadius" to 4)), "i-badge__mark--danger" to _pS(_uM("backgroundColor" to "#f56c6c")), "i-badge__mark--error" to _pS(_uM("backgroundColor" to "#f56c6c")), "i-badge__mark--primary" to _pS(_uM("backgroundColor" to "#3c9cff")), "i-badge__mark--success" to _pS(_uM("backgroundColor" to "#5ac725")), "i-badge__mark--warning" to _pS(_uM("backgroundColor" to "#f9ae3d")), "i-badge__mark--info" to _pS(_uM("backgroundColor" to "#909399")), "i-badge__text" to _pS(_uM("color" to "#ffffff", "lineHeight" to "20px", "whiteSpace" to "nowrap")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null)
        var props = _nP(_uM("label" to _uM("type" to "String", "default" to ""), "count" to _uM("type" to "Number", "default" to 0), "value" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "type" to _uM("type" to "String", "default" to "danger"), "dot" to _uM("type" to "Boolean", "default" to true), "maxCount" to _uM("type" to "Number", "default" to 99), "max" to _uM("type" to "Number", "default" to 99), "position" to _uM("type" to "String", "default" to "right"), "offset" to _uM("type" to "Array", "default" to fun(): UTSArray<Number> {
            return _uA(
                0,
                0
            )
        }
        ), "fontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "9"), "showZero" to _uM("type" to "Boolean", "default" to false), "hidden" to _uM("type" to "Boolean", "default" to false), "bgColor" to _uM("type" to "String", "default" to "error"), "fontColor" to _uM("type" to "String", "default" to "white"), "color" to _uM("type" to "String", "default" to "")))
        var propsNeedCastKeys = _uA(
            "label",
            "count",
            "value",
            "type",
            "dot",
            "maxCount",
            "max",
            "position",
            "fontSize",
            "showZero",
            "hidden",
            "bgColor",
            "fontColor",
            "color"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
