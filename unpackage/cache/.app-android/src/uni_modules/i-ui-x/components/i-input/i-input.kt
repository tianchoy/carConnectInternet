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
open class GenUniModulesIUiXComponentsIInputIInput : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any by `$props`
    open var value: Any by `$props`
    open var type: String by `$props`
    open var height: Any by `$props`
    open var disabled: Boolean by `$props`
    open var disabledColor: String by `$props`
    open var clearable: Boolean by `$props`
    open var password: Boolean by `$props`
    open var showPasswordToggle: Boolean by `$props`
    open var maxlength: Any by `$props`
    open var placeholder: String by `$props`
    open var placeholderClass: String by `$props`
    open var placeholderStyle: String by `$props`
    open var showWordLimit: Boolean by `$props`
    open var confirmType: String by `$props`
    open var confirmHold: Boolean by `$props`
    open var focus: Boolean by `$props`
    open var cursor: Any by `$props`
    open var cursorSpacing: Any by `$props`
    open var selectionStart: Any by `$props`
    open var selectionEnd: Any by `$props`
    open var adjustPosition: Boolean by `$props`
    open var inputAlign: String by `$props`
    open var fontSize: Any by `$props`
    open var color: String by `$props`
    open var prefiicon: String by `$props`
    open var prefiiconStyle: String by `$props`
    open var suffiicon: String by `$props`
    open var suffiiconStyle: String by `$props`
    open var border: String by `$props`
    open var readonly: Boolean by `$props`
    open var shape: String by `$props`
    open var customStyle: String by `$props`
    open var round: String by `$props`
    open var borderColor: String by `$props`
    open var bgColor: String by `$props`
    open var inputmode: String by `$props`
    open var prefix: String by `$props`
    open var setFormatter: () -> Unit
        get() {
            return unref(this.`$exposed`["setFormatter"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "setFormatter", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIInputIInput, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIInputIInput
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val inputBgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val current = ref(initialValue())
            val focused = ref(false)
            val passwordVisible = ref(props.password)
            val wrapClass = computed(fun(): String {
                val classes = _uA(
                    "i-input"
                )
                if (props.disabled) {
                    classes.push("i-input--disabled")
                }
                if (focused.value && !props.disabled) {
                    classes.push("i-input--focus")
                }
                if (props.shape == "circle") {
                    classes.push("i-input--circle")
                }
                return classes.join(" ")
            }
            )
            val wrapStyle = computed(fun(): String {
                var style = "min-height:" + formatSize(props.height) + ";background-color:" + (if (props.disabled) {
                    props.disabledColor
                } else {
                    inputBgColor.value
                }
                ) + ";border-radius:" + (if (props.shape == "circle") {
                    formatSize(props.height)
                } else {
                    props.round
                }
                ) + ";"
                if (props.border == "surround") {
                    style += "border-width:1px;border-style:solid;border-color:" + props.borderColor + ";"
                }
                if (props.border == "bottom") {
                    style += "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";"
                }
                return style + props.customStyle
            }
            )
            val fieldStyle = computed(fun(): String {
                return ("height:" + formatSize(props.height) + ";color:" + props.color + ";font-size:" + formatSize(props.fontSize) + ";text-align:" + props.inputAlign + ";")
            }
            )
            val placeholderStyleText = computed(fun(): String {
                if (props.placeholderStyle.length > 0) {
                    return props.placeholderStyle
                }
                return "color:#c0c4cc;"
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
            fun gen_initialValue_fn(): String {
                if (String(props.modelValue).length > 0) {
                    return String(props.modelValue)
                }
                return String(props.value)
            }
            val initialValue = ::gen_initialValue_fn
            fun gen_handleInput_fn(event) {
                val nextValue = String(event.detail.value)
                if (props.readonly) {
                    current.value = initialValue()
                    return
                }
                current.value = nextValue
                emitValue(nextValue)
            }
            val handleInput = ::gen_handleInput_fn
            fun gen_emitValue_fn(value) {
                emit("update:modelValue", value)
                emit("update:value", value)
                emit("input", value)
                emit("change", value)
            }
            val emitValue = ::gen_emitValue_fn
            fun gen_handleFocus_fn(event) {
                focused.value = true
                emit("focus", event)
            }
            val handleFocus = ::gen_handleFocus_fn
            fun gen_handleBlur_fn(event) {
                focused.value = false
                emit("blur", event)
            }
            val handleBlur = ::gen_handleBlur_fn
            fun gen_handleConfirm_fn(event) {
                emit("confirm", event.detail.value)
            }
            val handleConfirm = ::gen_handleConfirm_fn
            fun gen_handleKeyboardHeightChange_fn(event) {
                emit("keyboardheightchange", event)
            }
            val handleKeyboardHeightChange = ::gen_handleKeyboardHeightChange_fn
            fun gen_clear_fn() {
                current.value = ""
                emitValue("")
                emit("clear")
            }
            val clear = ::gen_clear_fn
            fun gen_togglePassword_fn() {
                passwordVisible.value = !passwordVisible.value
            }
            val togglePassword = ::gen_togglePassword_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            __expose(_uM("setFormatter" to fun() {}))
            return fun(): Any? {
                return _cE("view", _uM("class" to _nC(wrapClass.value), "style" to _nS(wrapStyle.value)), _uA(
                    renderSlot(_ctx.`$slots`, "prefix", _uO(), fun(): UTSArray<Any> {
                        return _uA(
                            if (isTrue(_ctx.prefiicon.length > 0 || _ctx.prefix.length > 0)) {
                                _cE("text", _uM("key" to 0, "class" to "i-input__prefix", "style" to _nS(_ctx.prefiiconStyle)), _tD(if (_ctx.prefix.length > 0) {
                                    _ctx.prefix
                                } else {
                                    _ctx.prefiicon
                                }), 5)
                            } else {
                                _cC("v-if", true)
                            }
                        )
                    }
                    ),
                    _cE("input", _uM("class" to "i-input__field", "style" to _nS(fieldStyle.value), "type" to _ctx.type, "value" to current.value, "placeholder" to _ctx.placeholder, "placeholder-class" to _ctx.placeholderClass, "placeholder-style" to placeholderStyleText.value, "password" to passwordVisible.value, "disabled" to _ctx.disabled, "maxlength" to Number(_ctx.maxlength), "confirm-type" to _ctx.confirmType, "confirm-hold" to _ctx.confirmHold, "inputmode" to _ctx.inputmode, "focus" to _ctx.focus, "cursor" to Number(_ctx.cursor), "cursor-spacing" to Number(_ctx.cursorSpacing), "selection-start" to Number(_ctx.selectionStart), "selection-end" to Number(_ctx.selectionEnd), "adjust-position" to _ctx.adjustPosition, "onInput" to handleInput, "onFocus" to handleFocus, "onBlur" to handleBlur, "onConfirm" to handleConfirm, "onKeyboardheightchange" to handleKeyboardHeightChange), null, 44, _uA(
                        "type",
                        "value",
                        "placeholder",
                        "placeholder-class",
                        "placeholder-style",
                        "password",
                        "disabled",
                        "maxlength",
                        "confirm-type",
                        "confirm-hold",
                        "inputmode",
                        "focus",
                        "cursor",
                        "cursor-spacing",
                        "selection-start",
                        "selection-end",
                        "adjust-position"
                    )),
                    if (isTrue(_ctx.showWordLimit)) {
                        _cE("text", _uM("key" to 0, "class" to "i-input__count"), _tD(current.value.length) + "/" + _tD(_ctx.maxlength), 1)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue((if (isTruthy(_ctx.clearable)) {
                        current.value.length > 0
                    } else {
                        _ctx.clearable
                    }
                    ) && !isTruthy(_ctx.disabled) && !isTruthy(_ctx.readonly))) {
                        _cE("text", _uM("key" to 1, "class" to "i-input__clear", "onClick" to clear), " × ")
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(if (isTruthy(_ctx.password)) {
                        _ctx.showPasswordToggle
                    } else {
                        _ctx.password
                    }
                    )) {
                        _cE("text", _uM("key" to 2, "class" to "i-input__eye", "onClick" to togglePassword), _tD(if (passwordVisible.value) {
                            "show"
                        } else {
                            "hide"
                        }), 1)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    renderSlot(_ctx.`$slots`, "suffix", _uO(), fun(): UTSArray<Any> {
                        return _uA(
                            if (_ctx.suffiicon.length > 0) {
                                _cE("text", _uM("key" to 0, "class" to "i-input__suffix", "style" to _nS(_ctx.suffiiconStyle)), _tD(_ctx.suffiicon), 5)
                            } else {
                                _cC("v-if", true)
                            }
                        )
                    }
                    )
                ), 6)
            }
        }
        var name = "i-input"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-input" to _pS(_uM("paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "flexDirection" to "row", "alignItems" to "center")), "i-input--disabled" to _pS(_uM("opacity" to 0.76)), "i-input--focus" to _pS(_uM("borderTopColor" to "#3c9cff", "borderRightColor" to "#3c9cff", "borderBottomColor" to "#3c9cff", "borderLeftColor" to "#3c9cff")), "i-input__prefix" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px", "marginRight" to 8)), "i-input__suffix" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px", "marginLeft" to 8)), "i-input__clear" to _pS(_uM("marginLeft" to 8, "color" to "#c0c4cc", "fontSize" to 16, "lineHeight" to "22px")), "i-input__eye" to _pS(_uM("marginLeft" to 8, "color" to "#c0c4cc", "fontSize" to 16, "lineHeight" to "22px")), "i-input__count" to _pS(_uM("marginLeft" to 8, "color" to "#c0c4cc", "fontSize" to 12, "lineHeight" to "18px")), "i-input__field" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minWidth" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("update:modelValue" to null, "update:value" to null, "input" to null, "change" to null, "focus" to null, "blur" to null, "confirm" to null, "keyboardheightchange" to null, "clear" to null)
        var props = _nP(_uM("modelValue" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "value" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "type" to _uM("type" to "String", "default" to "text"), "height" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "40px"), "disabled" to _uM("type" to "Boolean", "default" to false), "disabledColor" to _uM("type" to "String", "default" to "#f5f7fa"), "clearable" to _uM("type" to "Boolean", "default" to false), "password" to _uM("type" to "Boolean", "default" to false), "showPasswordToggle" to _uM("type" to "Boolean", "default" to true), "maxlength" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to -1), "placeholder" to _uM("type" to "String", "default" to ""), "placeholderClass" to _uM("type" to "String", "default" to "input-placeholder"), "placeholderStyle" to _uM("type" to "String", "default" to ""), "showWordLimit" to _uM("type" to "Boolean", "default" to false), "confirmType" to _uM("type" to "String", "default" to "done"), "confirmHold" to _uM("type" to "Boolean", "default" to false), "focus" to _uM("type" to "Boolean", "default" to false), "cursor" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to -1), "cursorSpacing" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 30), "selectionStart" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to -1), "selectionEnd" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to -1), "adjustPosition" to _uM("type" to "Boolean", "default" to true), "inputAlign" to _uM("type" to "String", "default" to "left"), "fontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "15px"), "color" to _uM("type" to "String", "default" to "#303133"), "prefiicon" to _uM("type" to "String", "default" to ""), "prefiiconStyle" to _uM("type" to "String", "default" to ""), "suffiicon" to _uM("type" to "String", "default" to ""), "suffiiconStyle" to _uM("type" to "String", "default" to ""), "border" to _uM("type" to "String", "default" to "surround"), "readonly" to _uM("type" to "Boolean", "default" to false), "shape" to _uM("type" to "String", "default" to "square"), "customStyle" to _uM("type" to "String", "default" to ""), "round" to _uM("type" to "String", "default" to "4px"), "borderColor" to _uM("type" to "String", "default" to "#e5e5e5"), "bgColor" to _uM("type" to "String", "default" to "#ffffff"), "inputmode" to _uM("type" to "String", "default" to "text"), "prefix" to _uM("type" to "String", "default" to "")))
        var propsNeedCastKeys = _uA(
            "modelValue",
            "value",
            "type",
            "height",
            "disabled",
            "disabledColor",
            "clearable",
            "password",
            "showPasswordToggle",
            "maxlength",
            "placeholder",
            "placeholderClass",
            "placeholderStyle",
            "showWordLimit",
            "confirmType",
            "confirmHold",
            "focus",
            "cursor",
            "cursorSpacing",
            "selectionStart",
            "selectionEnd",
            "adjustPosition",
            "inputAlign",
            "fontSize",
            "color",
            "prefiicon",
            "prefiiconStyle",
            "suffiicon",
            "suffiiconStyle",
            "border",
            "readonly",
            "shape",
            "customStyle",
            "round",
            "borderColor",
            "bgColor",
            "inputmode",
            "prefix"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
