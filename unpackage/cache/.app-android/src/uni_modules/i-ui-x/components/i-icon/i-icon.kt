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
open class GenUniModulesIUiXComponentsIIconIIcon : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var name: String by `$props`
    open var fontSize: String by `$props`
    open var fontFamily: String by `$props`
    open var code: String by `$props`
    open var color: String by `$props`
    open var darkColor: String by `$props`
    open var spin: Boolean by `$props`
    open var rotation: Number by `$props`
    open var duration: Number by `$props`
    open var type: String by `$props`
    open var size: String by `$props`
    open var plain: Boolean by `$props`
    open var bgColor: String by `$props`
    open var label: String by `$props`
    open var customStyle: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIIconIIcon) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIIconIIcon
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val spinAngle = ref(0)
            var spinTimer: Number = 0
            fun gen_formatSize_fn(value: String): String {
                if (value.indexOf("px") >= 0 || value.indexOf("rpx") >= 0 || value.indexOf("rem") >= 0 || value.indexOf("%") >= 0) {
                    return value
                }
                return value + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val iconBgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val remixCodeMap = __uts_large_remixCodeMap_build_0()
            val legacyNameMap = Map<String, String>(_uA(
                _uA(
                    "check",
                    "check-line"
                ),
                _uA(
                    "close",
                    "close-line"
                ),
                _uA(
                    "plus",
                    "add-line"
                ),
                _uA(
                    "minus",
                    "subtract-line"
                ),
                _uA(
                    "search",
                    "search-line"
                ),
                _uA(
                    "star",
                    "star-fill"
                ),
                _uA(
                    "map",
                    "map-pin-line"
                ),
                _uA(
                    "warning",
                    "error-warning-line"
                ),
                _uA(
                    "arrow-right",
                    "arrow-right-line"
                ),
                _uA(
                    "arrow-left",
                    "arrow-left-line"
                )
            ))
            val legacyGlyphMap = Map<String, String>(_uA(
                _uA(
                    "check",
                    "✓"
                ),
                _uA(
                    "close",
                    "x"
                ),
                _uA(
                    "plus",
                    "+"
                ),
                _uA(
                    "minus",
                    "-"
                ),
                _uA(
                    "search",
                    "⌕"
                ),
                _uA(
                    "star",
                    "★"
                ),
                _uA(
                    "map",
                    "⌖"
                ),
                _uA(
                    "warning",
                    "!"
                ),
                _uA(
                    "arrow-right",
                    ">"
                ),
                _uA(
                    "arrow-left",
                    "<"
                )
            ))
            val normalizedName = computed(fun(): String {
                val value = props.name
                if (legacyNameMap.has(value)) {
                    return legacyNameMap.get(value) as String
                }
                if (value.indexOf("ri-") == 0) {
                    return value.substring(3)
                }
                return value
            }
            )
            val isImage = computed(fun(): Boolean {
                val value = props.name
                return (value.indexOf("http://") == 0 || value.indexOf("https://") == 0 || value.indexOf("/") == 0 || value.indexOf("./") == 0 || value.indexOf("../") == 0 || value.indexOf("@/") == 0)
            }
            )
            val iconCode = computed(fun(): String {
                if (props.code.length > 0) {
                    return props.code
                }
                val value = normalizedName.value
                if (remixCodeMap.has(value)) {
                    return remixCodeMap.get(value) as String
                }
                return ""
            }
            )
            val iconText = computed(fun(): String {
                val code = iconCode.value
                if (code.length > 0) {
                    return String.fromCharCode(parseInt(code, 16))
                }
                if (legacyGlyphMap.has(props.name)) {
                    return legacyGlyphMap.get(props.name) as String
                }
                return props.name
            }
            )
            val normalizedSize = computed(fun(): String {
                val value = props.size as String
                if (value == "mini" || value == "normal" || value == "large") {
                    return value
                }
                if (value.length > 0) {
                    return "custom"
                }
                return ""
            }
            )
            val hasBadge = computed(fun(): Boolean {
                return props.type.length > 0 || iconBgColor.value.length > 0 || props.plain
            }
            )
            val iconClass = computed(fun(): String {
                val classes = _uA(
                    "i-icon"
                )
                if (hasBadge.value) {
                    classes.push("i-icon--badge")
                    if (props.type.length > 0) {
                        classes.push("i-icon--" + props.type)
                    }
                    if (normalizedSize.value.length > 0) {
                        classes.push("i-icon--" + normalizedSize.value)
                    }
                    if (props.plain) {
                        classes.push("i-icon--plain")
                    }
                }
                return classes.join(" ")
            }
            )
            val textClass = computed(fun(): String {
                val classes = _uA(
                    "i-icon__text"
                )
                if (props.spin) {
                    classes.push("i-icon__text--spin")
                }
                if (hasBadge.value) {
                    classes.push("i-icon__text--badge")
                }
                if (hasBadge.value && props.plain && props.type.length > 0) {
                    classes.push("i-icon__text--" + props.type)
                }
                return classes.join(" ")
            }
            )
            val imageClass = computed(fun(): String {
                val classes = _uA(
                    "i-icon__image"
                )
                if (props.spin) {
                    classes.push("i-icon__image--spin")
                }
                return classes.join(" ")
            }
            )
            val resolvedFontSize = computed(fun(): String {
                val value = props.size as String
                if (value == "mini") {
                    return "14px"
                }
                if (value == "normal") {
                    return "17px"
                }
                if (value == "large") {
                    return "22px"
                }
                if (value.length > 0) {
                    return formatSize(value)
                }
                return formatSize(props.fontSize)
            }
            )
            val badgeSize = computed(fun(): String {
                val value = props.size as String
                if (value == "mini") {
                    return "26px"
                }
                if (value == "normal") {
                    return "34px"
                }
                if (value == "large") {
                    return "44px"
                }
                if (value.length > 0) {
                    return formatSize(value)
                }
                if (props.fontSize.length > 0) {
                    return formatSize(props.fontSize)
                }
                return "16px"
            }
            )
            val wrapStyle = computed(fun(): String {
                var style = props.customStyle
                if (hasBadge.value) {
                    val size = badgeSize.value
                    style = style + "width:" + size + ";height:" + size + ";border-radius:" + size + ";"
                }
                if (iconBgColor.value.length > 0) {
                    style = style + "background-color:" + iconBgColor.value + ";"
                }
                return style
            }
            )
            fun gen_iconTypeColor_fn(): String {
                if (props.type == "primary") {
                    return "#2979ff"
                }
                if (props.type == "success") {
                    return "#19be6b"
                }
                if (props.type == "warning") {
                    return "#ff9900"
                }
                if (props.type == "danger") {
                    return "#fa3534"
                }
                return "#303133"
            }
            val iconTypeColor = ::gen_iconTypeColor_fn
            val activeRotation = computed(fun(): Number {
                var angle = (props.rotation + spinAngle.value) % 360
                if (angle < 0) {
                    angle = angle + 360
                }
                return angle
            }
            )
            val imageStyle = computed(fun(): String {
                val size = resolvedFontSize.value
                var style = "width:" + size + ";height:" + size + ";"
                val angle = activeRotation.value
                if (angle != 0) {
                    style = style + "transform:rotate(" + angle.toString(10) + "deg);"
                }
                return style
            }
            )
            fun gen_startSpin_fn() {
                if (spinTimer > 0) {
                    return
                }
                spinTimer = setInterval(fun(){
                    val duration = Math.max(120, props.duration)
                    val step = Math.max(6, Math.round((18000 as Number) / duration))
                    var angle = (spinAngle.value + step) % 360
                    if (angle < 0) {
                        angle = angle + 360
                    }
                    spinAngle.value = angle
                }
                , 50)
            }
            val startSpin = ::gen_startSpin_fn
            fun gen_stopSpin_fn() {
                if (spinTimer > 0) {
                    clearInterval(spinTimer)
                    spinTimer = 0
                }
                spinAngle.value = 0
            }
            val stopSpin = ::gen_stopSpin_fn
            val textStyle = computed(fun(): String {
                var style = "font-size:" + resolvedFontSize.value + ";"
                if (props.fontFamily.length > 0 && iconCode.value.length > 0) {
                    style = style + "font-family:" + props.fontFamily + ";"
                }
                var color = props.color
                if (hasBadge.value && props.color == "black") {
                    color = if (props.plain) {
                        iconTypeColor()
                    } else {
                        "#ffffff"
                    }
                }
                if (color.length > 0) {
                    style = style + "color:" + color + ";"
                }
                val angle = activeRotation.value
                if (angle != 0) {
                    style = style + "transform:rotate(" + angle.toString(10) + "deg);"
                }
                return style
            }
            )
            onMounted(fun(){
                if (props.spin) {
                    startSpin()
                }
            }
            )
            onUnmounted(fun(){
                stopSpin()
            }
            )
            fun gen_handleClick_fn() {
                emit("click", _uO("name" to props.name, "code" to iconCode.value, "label" to props.label))
            }
            val handleClick = ::gen_handleClick_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to _nC(iconClass.value), "style" to _nS(wrapStyle.value), "onClick" to handleClick), _uA(
                    if (isTrue(isImage.value)) {
                        _cE("image", _uM("key" to 0, "class" to _nC(imageClass.value), "src" to props.name, "style" to _nS(imageStyle.value), "mode" to "aspectFit"), null, 14, _uA(
                            "src"
                        ))
                    } else {
                        _cE("text", _uM("key" to 1, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _tD(iconText.value), 7)
                    }
                ), 6)
            }
        }
        var name = "i-icon"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-icon" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "i-icon--badge" to _pS(_uM("width" to 34, "height" to 34, "borderTopLeftRadius" to 34, "borderTopRightRadius" to 34, "borderBottomRightRadius" to 34, "borderBottomLeftRadius" to 34)), "i-icon--mini" to _pS(_uM("width" to 26, "height" to 26, "borderTopLeftRadius" to 26, "borderTopRightRadius" to 26, "borderBottomRightRadius" to 26, "borderBottomLeftRadius" to 26)), "i-icon--large" to _pS(_uM("width" to 44, "height" to 44, "borderTopLeftRadius" to 44, "borderTopRightRadius" to 44, "borderBottomRightRadius" to 44, "borderBottomLeftRadius" to 44)), "i-icon--primary" to _pS(_uM("backgroundColor" to "#2979ff")), "i-icon--success" to _pS(_uM("backgroundColor" to "#19be6b")), "i-icon--warning" to _pS(_uM("backgroundColor" to "#ff9900")), "i-icon--danger" to _pS(_uM("backgroundColor" to "#fa3534")), "i-icon--plain" to _pS(_uM("backgroundColor" to "#ffffff", "borderTopColor" to "#dcdfe6", "borderRightColor" to "#dcdfe6", "borderBottomColor" to "#dcdfe6", "borderLeftColor" to "#dcdfe6", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1)), "i-icon__text" to _pS(_uM("color" to "#303133", "fontSize" to 16, "lineHeight" to 1)), "i-icon__text--badge" to _pS(_uM("color" to "#ffffff", "fontWeight" to 700)), "i-icon__text--primary" to _pS(_uM("color" to "#2979ff")), "i-icon__text--success" to _pS(_uM("color" to "#19be6b")), "i-icon__text--warning" to _pS(_uM("color" to "#ff9900")), "i-icon__text--danger" to _pS(_uM("color" to "#fa3534")), "i-icon__image" to _pS(_uM("width" to 16, "height" to 16)), "@FONT-FACE" to _uM("0" to _uM("fontFamily" to "remixicon", "src" to "url(\"/uni_modules/i-ui-x/static/remixicon.woff2\") format(\"woff2\"),\n    url(\"https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.ttf\")\n      format(\"truetype\")")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null)
        var props = _nP(_uM("name" to _uM("type" to "String", "default" to "home-3-fill"), "fontSize" to _uM("type" to "String", "default" to "16"), "fontFamily" to _uM("type" to "String", "default" to "remixicon"), "code" to _uM("type" to "String", "default" to ""), "color" to _uM("type" to "String", "default" to "black"), "darkColor" to _uM("type" to "String", "default" to ""), "spin" to _uM("type" to "Boolean", "default" to false), "rotation" to _uM("type" to "Number", "default" to 0), "duration" to _uM("type" to "Number", "default" to 1500), "type" to _uM("type" to "String", "default" to ""), "size" to _uM("type" to "String", "default" to ""), "plain" to _uM("type" to "Boolean", "default" to false), "bgColor" to _uM("type" to "String", "default" to ""), "label" to _uM("type" to "String", "default" to ""), "customStyle" to _uM("type" to "String", "default" to "")))
        var propsNeedCastKeys = _uA(
            "name",
            "fontSize",
            "fontFamily",
            "code",
            "color",
            "darkColor",
            "spin",
            "rotation",
            "duration",
            "type",
            "size",
            "plain",
            "bgColor",
            "label",
            "customStyle"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
