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
open class GenUniModulesIUiXComponentsIModalIModal : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var show: Boolean by `$props`
    open var title: String by `$props`
    open var content: String by `$props`
    open var confirmText: String by `$props`
    open var cancelText: String by `$props`
    open var showConfirmButton: Boolean by `$props`
    open var showCancelButton: Boolean by `$props`
    open var confirmColor: String by `$props`
    open var cancelColor: String by `$props`
    open var duration: Any by `$props`
    open var buttonReverse: Boolean by `$props`
    open var zoom: Boolean by `$props`
    open var zIndex: Any by `$props`
    open var asyncClose: Boolean by `$props`
    open var closeable: Boolean by `$props`
    open var closeOnMask: Boolean by `$props`
    open var negativeTop: Any by `$props`
    open var width: Any by `$props`
    open var confirmButtonShape: String by `$props`
    open var round: Any by `$props`
    open var buttonModel: String by `$props`
    open var buttonRadius: String by `$props`
    open var confirmBgColor: String by `$props`
    open var cancelBgColor: String by `$props`
    open var customStyle: Any by `$props`
    open var open: () -> Unit
        get() {
            return unref(this.`$exposed`["open"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "open", value)
        }
    open var close: () -> Unit
        get() {
            return unref(this.`$exposed`["close"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "close", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIModalIModal, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIModalIModal
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val opened = ref(props.show)
            val active = ref(props.show)
            val loading = ref(false)
            var closeTimer: Number = 0
            val maskStyle = computed(fun(): String {
                return ("z-index:" + String(props.zIndex) + ";opacity:" + (if (active.value) {
                    "1"
                } else {
                    "0"
                }
                ) + ";transition-duration:" + formatMs(props.duration) + ";")
            }
            )
            val modalClass = computed(fun(): String {
                val classes = _uA(
                    "i-modal"
                )
                return classes.join(" ")
            }
            )
            val modalStyle = computed(fun(): String {
                var style = "width:" + formatSize(props.width) + ";"
                style = style + "border-radius:" + formatSize(props.round) + ";"
                style = style + "transition-duration:" + formatMs(props.duration) + ";"
                val top = formatSize(props.negativeTop)
                val scaleValue = if (props.zoom) {
                    if (active.value) {
                        "1"
                    } else {
                        "0.86"
                    }
                } else {
                    "1"
                }
                val translateValue = if (top != "0px") {
                    "-" + top
                } else {
                    "0px"
                }
                style = style + "opacity:" + (if (active.value) {
                    "1"
                } else {
                    "0"
                }
                ) + ";"
                style = style + "transform:translateY(" + translateValue + ") scale(" + scaleValue + ");"
                style = style + stringifyStyle(props.customStyle)
                return style
            }
            )
            val confirmButtonClass = computed(fun(): String {
                val classes = _uA(
                    "i-modal__button",
                    "i-modal__button--confirm"
                )
                if (props.buttonModel == "button") {
                    classes.push("i-modal__button--model-button")
                }
                if (props.confirmButtonShape == "square") {
                    classes.push("i-modal__button--square")
                }
                return classes.join(" ")
            }
            )
            val cancelButtonClass = computed(fun(): String {
                val classes = _uA(
                    "i-modal__button",
                    "i-modal__button--cancel"
                )
                if (props.buttonModel == "button") {
                    classes.push("i-modal__button--model-button")
                }
                return classes.join(" ")
            }
            )
            val confirmTextStyle = computed(fun(): String {
                return "color:" + props.confirmColor + ";"
            }
            )
            val cancelTextStyle = computed(fun(): String {
                return "color:" + props.cancelColor + ";"
            }
            )
            val confirmButtonStyle = computed(fun(): String {
                if (props.buttonModel != "button") {
                    return ""
                }
                var style = "border-radius:" + formatSize(props.buttonRadius) + ";"
                if (props.confirmBgColor.length > 0) {
                    style = style + "background-color:" + props.confirmBgColor + ";"
                }
                return style
            }
            )
            val cancelButtonStyle = computed(fun(): String {
                if (props.buttonModel != "button") {
                    return ""
                }
                var style = "border-radius:" + formatSize(props.buttonRadius) + ";"
                if (props.cancelBgColor.length > 0) {
                    style = style + "background-color:" + props.cancelBgColor + ";"
                }
                return style
            }
            )
            watch(fun(){
                return props.show
            }
            , fun(nextValue){
                if (nextValue) {
                    openPanel()
                } else {
                    closePanel(false)
                }
            }
            )
            fun gen_open_fn() {
                openPanel()
                emit("update:show", true)
            }
            val open = ::gen_open_fn
            fun gen_close_fn() {
                closePanel(true)
            }
            val close = ::gen_close_fn
            fun gen_openPanel_fn() {
                clearCloseTimer()
                opened.value = true
                setTimeout(fun(){
                    active.value = true
                }
                , 20)
            }
            val openPanel = ::gen_openPanel_fn
            fun gen_closePanel_fn(shouldEmitUpdate: Boolean) {
                clearCloseTimer()
                active.value = false
                loading.value = false
                closeTimer = setTimeout(fun(){
                    opened.value = false
                    closeTimer = 0
                    if (shouldEmitUpdate) {
                        emit("update:show", false)
                    }
                }
                , animationDuration())
            }
            val closePanel = ::gen_closePanel_fn
            fun gen_clearCloseTimer_fn() {
                if (closeTimer > 0) {
                    clearTimeout(closeTimer)
                    closeTimer = 0
                }
            }
            val clearCloseTimer = ::gen_clearCloseTimer_fn
            fun gen_animationDuration_fn(): Number {
                val text = String(props.duration)
                if (text.indexOf("ms") >= 0) {
                    return Number(text.replace("ms", ""))
                }
                if (text.indexOf("s") >= 0) {
                    return Number(text.replace("s", "")) * 1000
                }
                val duration = Number(text)
                if (isNaN(duration)) {
                    return 200
                }
                return duration
            }
            val animationDuration = ::gen_animationDuration_fn
            fun gen_confirm_fn() {
                if (loading.value) {
                    return
                }
                emit("confirm")
                if (props.asyncClose) {
                    loading.value = true
                    return
                }
                close()
            }
            val confirm = ::gen_confirm_fn
            fun gen_cancel_fn() {
                emit("cancel")
                closePanel(true)
            }
            val cancel = ::gen_cancel_fn
            fun gen_closeByIcon_fn() {
                emit("close")
                closePanel(true)
            }
            val closeByIcon = ::gen_closeByIcon_fn
            fun gen_handleOverlayClick_fn() {
                if (!props.closeOnMask) {
                    return
                }
                emit("close")
                closePanel(true)
            }
            val handleOverlayClick = ::gen_handleOverlayClick_fn
            fun gen_formatMs_fn(value): String {
                val text = String(value)
                if (text.indexOf("ms") >= 0 || text.indexOf("s") >= 0) {
                    return text
                }
                return text + "ms"
            }
            val formatMs = ::gen_formatMs_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_stringifyStyle_fn(value): String {
                if (value == null) {
                    return ""
                }
                val text = String(value)
                if (text == "[object Object]" || text.length == 0) {
                    return ""
                }
                return if (text.endsWith(";")) {
                    text
                } else {
                    text + ";"
                }
            }
            val stringifyStyle = ::gen_stringifyStyle_fn
            __expose(_uM("open" to open, "close" to close))
            return fun(): Any? {
                return if (isTrue(opened.value)) {
                    _cE("view", _uM("key" to 0, "class" to "i-modal__mask", "style" to _nS(maskStyle.value), "onClick" to handleOverlayClick), _uA(
                        _cE("view", _uM("class" to _nC(modalClass.value), "style" to _nS(modalStyle.value), "onClick" to withModifiers(fun(){}, _uA(
                            "stop"
                        ))), _uA(
                            if (isTrue(_ctx.closeable)) {
                                _cE("view", _uM("key" to 0, "class" to "i-modal__close", "onClick" to closeByIcon), _uA(
                                    _cE("text", _uM("class" to "i-modal__close-text"), "×")
                                ))
                            } else {
                                _cC("v-if", true)
                            },
                            if (_ctx.title.length > 0) {
                                _cE("text", _uM("key" to 1, "class" to "i-modal__title"), _tD(_ctx.title), 1)
                            } else {
                                _cC("v-if", true)
                            },
                            _cE("view", _uM("class" to "i-modal__content-wrap"), _uA(
                                renderSlot(_ctx.`$slots`, "default", _uO(), fun(): UTSArray<Any> {
                                    return _uA(
                                        _cE("text", _uM("class" to "i-modal__content"), _tD(_ctx.content), 1)
                                    )
                                })
                            )),
                            _cE("view", _uM("class" to _nC(_uA(
                                "i-modal__footer",
                                if (_ctx.buttonModel == "button") {
                                    "i-modal__footer--button"
                                } else {
                                    ""
                                }
                            ))), _uA(
                                if (isTrue(_ctx.buttonReverse)) {
                                    _cE("view", _uM("key" to 0, "class" to "i-modal__footer-inner"), _uA(
                                        renderSlot(_ctx.`$slots`, "confirmButton", _uO(), fun(): UTSArray<Any> {
                                            return _uA(
                                                if (isTrue(_ctx.showConfirmButton)) {
                                                    _cE("view", _uM("key" to 0, "class" to _nC(confirmButtonClass.value), "style" to _nS(confirmButtonStyle.value), "onClick" to confirm), _uA(
                                                        _cE("text", _uM("class" to "i-modal__confirm-text", "style" to _nS(confirmTextStyle.value)), _tD(if (loading.value) {
                                                            "..."
                                                        } else {
                                                            _ctx.confirmText
                                                        }), 5)
                                                    ), 6)
                                                } else {
                                                    _cC("v-if", true)
                                                }
                                            )
                                        }),
                                        if (isTrue(_ctx.showCancelButton)) {
                                            _cE("view", _uM("key" to 0, "class" to _nC(cancelButtonClass.value), "style" to _nS(cancelButtonStyle.value), "onClick" to cancel), _uA(
                                                _cE("text", _uM("class" to "i-modal__cancel-text", "style" to _nS(cancelTextStyle.value)), _tD(_ctx.cancelText), 5)
                                            ), 6)
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                } else {
                                    _cE("view", _uM("key" to 1, "class" to "i-modal__footer-inner"), _uA(
                                        if (isTrue(_ctx.showCancelButton)) {
                                            _cE("view", _uM("key" to 0, "class" to _nC(cancelButtonClass.value), "style" to _nS(cancelButtonStyle.value), "onClick" to cancel), _uA(
                                                _cE("text", _uM("class" to "i-modal__cancel-text", "style" to _nS(cancelTextStyle.value)), _tD(_ctx.cancelText), 5)
                                            ), 6)
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        renderSlot(_ctx.`$slots`, "confirmButton", _uO(), fun(): UTSArray<Any> {
                                            return _uA(
                                                if (isTrue(_ctx.showConfirmButton)) {
                                                    _cE("view", _uM("key" to 0, "class" to _nC(confirmButtonClass.value), "style" to _nS(confirmButtonStyle.value), "onClick" to confirm), _uA(
                                                        _cE("text", _uM("class" to "i-modal__confirm-text", "style" to _nS(confirmTextStyle.value)), _tD(if (loading.value) {
                                                            "..."
                                                        } else {
                                                            _ctx.confirmText
                                                        }), 5)
                                                    ), 6)
                                                } else {
                                                    _cC("v-if", true)
                                                }
                                            )
                                        })
                                    ))
                                }
                            ), 2)
                        ), 14, _uA(
                            "onClick"
                        ))
                    ), 4)
                } else {
                    _cC("v-if", true)
                }
            }
        }
        var name = "i-modal"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-modal__mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "backgroundColor" to "rgba(0,0,0,0.5)", "alignItems" to "center", "justifyContent" to "center", "transitionProperty" to "opacity", "transitionTimingFunction" to "ease")), "i-modal" to _pS(_uM("position" to "relative", "overflow" to "hidden", "backgroundColor" to "#ffffff", "transitionProperty" to "transform,opacity", "transitionTimingFunction" to "cubic-bezier(0.22,1,0.36,1)")), "i-modal__close" to _pS(_uM("position" to "absolute", "right" to 8, "top" to 8, "zIndex" to 2, "width" to 34, "height" to 34, "alignItems" to "center", "justifyContent" to "center")), "i-modal__close-text" to _pS(_uM("color" to "#909399", "fontSize" to 22, "lineHeight" to "30px")), "i-modal__title" to _pS(_uM("paddingTop" to 22, "paddingRight" to 22, "paddingBottom" to 8, "paddingLeft" to 22, "color" to "#303133", "fontSize" to 17, "fontWeight" to 600, "lineHeight" to "24px", "textAlign" to "center")), "i-modal__content-wrap" to _pS(_uM("minHeight" to 52, "paddingTop" to 8, "paddingRight" to 22, "paddingBottom" to 22, "paddingLeft" to 22, "alignItems" to "center", "justifyContent" to "center")), "i-modal__content" to _pS(_uM("color" to "#606266", "fontSize" to 14, "lineHeight" to "22px", "textAlign" to "center")), "i-modal__footer" to _pS(_uM("minHeight" to 48, "borderTopWidth" to 1, "borderTopStyle" to "solid", "borderTopColor" to "#f3f4f6")), "i-modal__footer--button" to _pS(_uM("paddingTop" to 10, "paddingRight" to 14, "paddingBottom" to 14, "paddingLeft" to 14, "borderTopWidth" to 0)), "i-modal__footer-inner" to _pS(_uM("flexDirection" to "row")), "i-modal__button" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to 48, "alignItems" to "center", "justifyContent" to "center")), "i-modal__button--cancel" to _pS(_uM("borderRightWidth" to 1, "borderRightStyle" to "solid", "borderRightColor" to "#f3f4f6")), "i-modal__button--model-button" to _pS(_uM("height" to 40, "marginTop" to 0, "marginRight" to 5, "marginBottom" to 0, "marginLeft" to 5, "borderRightWidth" to 0, "backgroundColor" to "#f5f7fb")), "i-modal__button--square" to _pS(_uM("borderTopLeftRadius" to 4, "borderTopRightRadius" to 4, "borderBottomRightRadius" to 4, "borderBottomLeftRadius" to 4)), "i-modal__confirm-text" to _pS(_uM("fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")), "i-modal__cancel-text" to _pS(_uM("fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")), "@TRANSITION" to _uM("i-modal__mask" to _uM("property" to "opacity", "timingFunction" to "ease"), "i-modal" to _uM("property" to "transform,opacity", "timingFunction" to "cubic-bezier(0.22,1,0.36,1)")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("confirm" to null, "cancel" to null, "close" to null, "update:show" to null)
        var props = _nP(_uM("show" to _uM("type" to "Boolean", "default" to false), "title" to _uM("type" to "String", "default" to ""), "content" to _uM("type" to "String", "default" to ""), "confirmText" to _uM("type" to "String", "default" to "确认"), "cancelText" to _uM("type" to "String", "default" to "取消"), "showConfirmButton" to _uM("type" to "Boolean", "default" to true), "showCancelButton" to _uM("type" to "Boolean", "default" to false), "confirmColor" to _uM("type" to "String", "default" to "#2979ff"), "cancelColor" to _uM("type" to "String", "default" to "#606266"), "duration" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 200), "buttonReverse" to _uM("type" to "Boolean", "default" to false), "zoom" to _uM("type" to "Boolean", "default" to true), "zIndex" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 10075), "asyncClose" to _uM("type" to "Boolean", "default" to false), "closeable" to _uM("type" to "Boolean", "default" to false), "closeOnMask" to _uM("type" to "Boolean", "default" to false), "negativeTop" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0), "width" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "320px"), "confirmButtonShape" to _uM("type" to "String", "default" to "100px"), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "6px"), "buttonModel" to _uM("type" to "String", "default" to "text"), "buttonRadius" to _uM("type" to "String", "default" to "100px"), "confirmBgColor" to _uM("type" to "String", "default" to ""), "cancelBgColor" to _uM("type" to "String", "default" to ""), "customStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to "")))
        var propsNeedCastKeys = _uA(
            "show",
            "title",
            "content",
            "confirmText",
            "cancelText",
            "showConfirmButton",
            "showCancelButton",
            "confirmColor",
            "cancelColor",
            "duration",
            "buttonReverse",
            "zoom",
            "zIndex",
            "asyncClose",
            "closeable",
            "closeOnMask",
            "negativeTop",
            "width",
            "confirmButtonShape",
            "round",
            "buttonModel",
            "buttonRadius",
            "confirmBgColor",
            "cancelBgColor",
            "customStyle"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
