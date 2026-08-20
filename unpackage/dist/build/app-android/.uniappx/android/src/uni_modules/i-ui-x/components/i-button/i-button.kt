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
open class GenUniModulesIUiXComponentsIButtonIButton : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var hairline: Boolean by `$props`
    open var type: String by `$props`
    open var size: String by `$props`
    open var block: Boolean by `$props`
    open var shape: String by `$props`
    open var plain: Boolean by `$props`
    open var disabled: Boolean by `$props`
    open var round: Any by `$props`
    open var loading: Boolean by `$props`
    open var loadingMode: String by `$props`
    open var loadingSize: Any by `$props`
    open var openType: String by `$props`
    open var formType: String by `$props`
    open var appParameter: String by `$props`
    open var hoverStopPropagation: Boolean by `$props`
    open var lang: String by `$props`
    open var sessionFrom: String by `$props`
    open var sendMessageTitle: String by `$props`
    open var sendMessagePath: String by `$props`
    open var sendMessageImg: String by `$props`
    open var showMessageCard: Boolean by `$props`
    open var dataName: String by `$props`
    open var throttleTime: Any by `$props`
    open var hoverStartTime: Any by `$props`
    open var hoverStayTime: Any by `$props`
    open var hoverClass: String by `$props`
    open var text: Any by `$props`
    open var icon: String by `$props`
    open var iconColor: String by `$props`
    open var iconPosition: String by `$props`
    open var color: String by `$props`
    open var customStyle: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIButtonIButton) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIButtonIButton
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val lastClickTime = ref(0)
            val loadingAngle = ref(0)
            var loadingTimer: Number = 0
            fun formatSize(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val normalizedType = computed(fun(): String {
                if (props.type == "danger") {
                    return "error"
                }
                return props.type
            }
            )
            val contentText = computed(fun(): String {
                if (props.text == null) {
                    return ""
                }
                return props.text.toString()
            }
            )
            val computedHoverClass = computed(fun(): String {
                if (props.disabled || props.loading) {
                    return "none"
                }
                return props.hoverClass
            }
            )
            fun normalizeNumber(value: Any): Number {
                if (UTSAndroid.`typeof`(value) == "number") {
                    return value as Number
                }
                return UTSNumber.from(parseFloat(value as String))
            }
            val hoverStartTimeValue = computed(fun(): Number {
                return normalizeNumber(props.hoverStartTime)
            }
            )
            val hoverStayTimeValue = computed(fun(): Number {
                return normalizeNumber(props.hoverStayTime)
            }
            )
            val useNativeButton = computed(fun(): Boolean {
                return props.openType.length > 0 || props.formType.length > 0
            }
            )
            val buttonClass = computed(fun(): String {
                val classes = _uA(
                    "i-button",
                    "i-button--" + normalizedType.value,
                    "i-button--" + props.size
                )
                if (props.block) {
                    classes.push("i-button--block")
                }
                if (props.plain) {
                    classes.push("i-button--plain")
                }
                if (props.plain) {
                    classes.push("i-button--plain-" + normalizedType.value)
                }
                if (props.hairline && props.plain) {
                    classes.push("i-button--hairline")
                }
                if (props.shape == "circle") {
                    classes.push("i-button--circle")
                }
                if (props.disabled) {
                    classes.push("i-button--disabled")
                }
                if (props.loading) {
                    classes.push("i-button--loading")
                }
                return classes.join(" ")
            }
            )
            val textClass = computed(fun(): String {
                val classes = _uA(
                    "i-button__text"
                )
                if (props.size == "small" || props.size == "mini") {
                    classes.push("i-button__text--small")
                }
                if (normalizedType.value == "default") {
                    classes.push("i-button__text--default")
                }
                if (props.plain) {
                    classes.push("i-button__text--plain-" + normalizedType.value)
                }
                if (props.color.length > 0 && props.plain) {
                    classes.push("i-button__text--custom")
                }
                if (props.disabled) {
                    classes.push("i-button__text--disabled")
                }
                if (props.loading) {
                    classes.push("i-button__text--loading")
                }
                return classes.join(" ")
            }
            )
            val iconClass = computed(fun(): String {
                val classes = _uA(
                    "i-button__icon"
                )
                if (props.iconPosition == "right") {
                    classes.push("i-button__icon--right")
                }
                return classes.join(" ")
            }
            )
            val loadingClass = computed(fun(): String {
                val classes = _uA(
                    "i-button__loading"
                )
                if (props.loadingMode == "circle") {
                    classes.push("i-button__loading--circle")
                }
                if (normalizedType.value == "default" || props.plain) {
                    classes.push("i-button__loading--muted")
                }
                if (props.plain) {
                    classes.push("i-button__loading--plain-" + normalizedType.value)
                }
                return classes.join(" ")
            }
            )
            val buttonStyle = computed(fun(): String {
                var style = ""
                if (props.shape != "circle") {
                    style = style + "border-radius:" + formatSize(props.round) + ";"
                }
                if (props.color.length > 0) {
                    if (props.plain) {
                        style = style + "background-color:transparent;border-color:" + props.color + ";"
                    } else {
                        style = style + "background:" + props.color + ";border-color:transparent;"
                    }
                }
                if (props.customStyle.length > 0) {
                    style = style + props.customStyle
                }
                return style
            }
            )
            val textStyle = computed(fun(): String {
                if (props.color.length > 0 && props.plain) {
                    return "color:" + props.color + ";"
                }
                return ""
            }
            )
            val iconStyle = computed(fun(): String {
                if (props.iconColor.length > 0) {
                    return "color:" + props.iconColor + ";"
                }
                if (props.color.length > 0 && props.plain) {
                    return "color:" + props.color + ";"
                }
                return ""
            }
            )
            val loadingStyle = computed(fun(): String {
                val size = formatSize(props.loadingSize)
                return ("width:" + size + ";height:" + size + ";transform:rotate(" + loadingAngle.value.toString(10) + "deg);")
            }
            )
            fun gen_startLoading_fn(): Unit {
                if (loadingTimer > 0) {
                    return
                }
                loadingTimer = setInterval(fun(){
                    var angle = (loadingAngle.value + 24) % 360
                    if (angle < 0) {
                        angle = angle + 360
                    }
                    loadingAngle.value = angle
                }
                , 50)
            }
            val startLoading = ::gen_startLoading_fn
            fun gen_stopLoading_fn(): Unit {
                if (loadingTimer > 0) {
                    clearInterval(loadingTimer)
                    loadingTimer = 0
                }
                loadingAngle.value = 0
            }
            val stopLoading = ::gen_stopLoading_fn
            watch(fun(): Boolean {
                return props.loading
            }
            , fun(nextValue: Boolean): Unit {
                if (nextValue) {
                    startLoading()
                } else {
                    stopLoading()
                }
            }
            )
            onMounted(fun(){
                if (props.loading) {
                    startLoading()
                }
            }
            )
            onUnmounted(fun(){
                stopLoading()
            }
            )
            fun gen_canClick_fn(): Boolean {
                if (props.disabled || props.loading) {
                    return false
                }
                val wait = normalizeNumber(props.throttleTime)
                if (wait <= 0 || isNaN(wait)) {
                    return true
                }
                val now = Date.now()
                if (now - lastClickTime.value < wait) {
                    return false
                }
                lastClickTime.value = now
                return true
            }
            val canClick = ::gen_canClick_fn
            fun gen_handleClick_fn(event: Any): Unit {
                if (!canClick()) {
                    return
                }
                emit("click", event)
            }
            val handleClick = ::gen_handleClick_fn
            fun gen_handleGetPhoneNumber_fn(event: Any): Unit {
                emit("getphonenumber", event)
            }
            val handleGetPhoneNumber = ::gen_handleGetPhoneNumber_fn
            fun gen_handleGetUserInfo_fn(event: Any): Unit {
                emit("getuserinfo", event)
            }
            val handleGetUserInfo = ::gen_handleGetUserInfo_fn
            fun gen_handleError_fn(event: Any): Unit {
                emit("error", event)
            }
            val handleError = ::gen_handleError_fn
            fun gen_handleOpenSetting_fn(event: Any): Unit {
                emit("opensetting", event)
            }
            val handleOpenSetting = ::gen_handleOpenSetting_fn
            fun gen_handleLaunchApp_fn(event: Any): Unit {
                emit("launchapp", event)
            }
            val handleLaunchApp = ::gen_handleLaunchApp_fn
            fun gen_handleAgreePrivacyAuthorization_fn(event: Any): Unit {
                emit("agreeprivacyauthorization", event)
            }
            val handleAgreePrivacyAuthorization = ::gen_handleAgreePrivacyAuthorization_fn
            return fun(): Any? {
                return if (isTrue(useNativeButton.value)) {
                    _cE("button", _uM("key" to 0, "class" to _nC(buttonClass.value), "style" to _nS(buttonStyle.value), "disabled" to (_ctx.disabled || _ctx.loading), "form-type" to _ctx.formType, "open-type" to _ctx.openType, "app-parameter" to _ctx.appParameter, "hover-class" to computedHoverClass.value, "hover-stop-propagation" to _ctx.hoverStopPropagation, "hover-start-time" to hoverStartTimeValue.value, "hover-stay-time" to hoverStayTimeValue.value, "lang" to _ctx.lang, "session-from" to _ctx.sessionFrom, "send-message-title" to _ctx.sendMessageTitle, "send-message-path" to _ctx.sendMessagePath, "send-message-img" to _ctx.sendMessageImg, "show-message-card" to _ctx.showMessageCard, "data-name" to _ctx.dataName, "onClick" to handleClick, "onGetphonenumber" to handleGetPhoneNumber, "onGetuserinfo" to handleGetUserInfo, "onError" to handleError, "onOpensetting" to handleOpenSetting, "onLaunchapp" to handleLaunchApp, "onAgreeprivacyauthorization" to handleAgreePrivacyAuthorization), _uA(
                        _cE("view", _uM("class" to "i-button__inner"), _uA(
                            if (isTrue(_ctx.loading)) {
                                _cE("text", _uM("key" to 0, "class" to _nC(loadingClass.value), "style" to _nS(loadingStyle.value)), null, 6)
                            } else {
                                _cC("v-if", true)
                            },
                            if (isTrue(_ctx.icon.length > 0 && _ctx.iconPosition == "left" && !_ctx.loading)) {
                                _cE("text", _uM("key" to 1, "class" to _nC(iconClass.value), "style" to _nS(iconStyle.value)), _tD(_ctx.icon), 7)
                            } else {
                                _cC("v-if", true)
                            },
                            if (contentText.value.length > 0) {
                                _cE("text", _uM("key" to 2, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _tD(contentText.value), 7)
                            } else {
                                _cE("text", _uM("key" to 3, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _uA(
                                    renderSlot(_ctx.`$slots`, "default")
                                ), 6)
                            },
                            if (isTrue(_ctx.icon.length > 0 && _ctx.iconPosition == "right" && !_ctx.loading)) {
                                _cE("text", _uM("key" to 4, "class" to _nC(iconClass.value), "style" to _nS(iconStyle.value)), _tD(_ctx.icon), 7)
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    ), 46, _uA(
                        "disabled",
                        "form-type",
                        "open-type",
                        "app-parameter",
                        "hover-class",
                        "hover-stop-propagation",
                        "hover-start-time",
                        "hover-stay-time",
                        "lang",
                        "session-from",
                        "send-message-title",
                        "send-message-path",
                        "send-message-img",
                        "show-message-card",
                        "data-name"
                    ))
                } else {
                    _cE("view", _uM("key" to 1, "class" to _nC(buttonClass.value), "style" to _nS(buttonStyle.value), "hover-class" to computedHoverClass.value, "hover-stop-propagation" to _ctx.hoverStopPropagation, "hover-start-time" to hoverStartTimeValue.value, "hover-stay-time" to hoverStayTimeValue.value, "data-name" to _ctx.dataName, "onClick" to handleClick), _uA(
                        _cE("view", _uM("class" to "i-button__inner"), _uA(
                            if (isTrue(_ctx.loading)) {
                                _cE("text", _uM("key" to 0, "class" to _nC(loadingClass.value), "style" to _nS(loadingStyle.value)), null, 6)
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (isTrue(_ctx.icon.length > 0 && _ctx.iconPosition == "left" && !_ctx.loading)) {
                                _cE("text", _uM("key" to 1, "class" to _nC(iconClass.value), "style" to _nS(iconStyle.value)), _tD(_ctx.icon), 7)
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (contentText.value.length > 0) {
                                _cE("text", _uM("key" to 2, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _tD(contentText.value), 7)
                            } else {
                                _cE("text", _uM("key" to 3, "class" to _nC(textClass.value), "style" to _nS(textStyle.value)), _uA(
                                    renderSlot(_ctx.`$slots`, "default")
                                ), 6)
                            }
                            ,
                            if (isTrue(_ctx.icon.length > 0 && _ctx.iconPosition == "right" && !_ctx.loading)) {
                                _cE("text", _uM("key" to 4, "class" to _nC(iconClass.value), "style" to _nS(iconStyle.value)), _tD(_ctx.icon), 7)
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    ), 14, _uA(
                        "hover-class",
                        "hover-stop-propagation",
                        "hover-start-time",
                        "hover-stay-time",
                        "data-name"
                    ))
                }
            }
        }
        var name = "i-button"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-button" to _pS(_uM("display" to "flex", "height" to 44, "minWidth" to 86, "paddingTop" to 0, "paddingRight" to 18, "paddingBottom" to 0, "paddingLeft" to 18, "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "rgba(0,0,0,0)", "borderRightColor" to "rgba(0,0,0,0)", "borderBottomColor" to "rgba(0,0,0,0)", "borderLeftColor" to "rgba(0,0,0,0)", "backgroundColor" to "#f4f4f5", "alignItems" to "center", "justifyContent" to "center", "flexDirection" to "row", "marginTop" to 0, "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "overflow" to "hidden")), "i-button__inner" to _pS(_uM("flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center")), "i-button--block" to _pS(_uM("width" to "100%")), "i-button--large" to _pS(_uM("height" to 50, "minWidth" to 108, "paddingTop" to 0, "paddingRight" to 22, "paddingBottom" to 0, "paddingLeft" to 22)), "i-button--normal" to _pS(_uM("height" to 44)), "i-button--small" to _pS(_uM("height" to 36, "minWidth" to 72, "paddingTop" to 0, "paddingRight" to 14, "paddingBottom" to 0, "paddingLeft" to 14)), "i-button--mini" to _pS(_uM("height" to 30, "minWidth" to 58, "paddingTop" to 0, "paddingRight" to 10, "paddingBottom" to 0, "paddingLeft" to 10)), "i-button--circle" to _pS(_uM("borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999)), "i-button--primary" to _pS(_uM("backgroundColor" to "#3c9cff")), "i-button--success" to _pS(_uM("backgroundColor" to "#5ac725")), "i-button--warning" to _pS(_uM("backgroundColor" to "#f9ae3d")), "i-button--error" to _pS(_uM("backgroundColor" to "#f56c6c")), "i-button--info" to _pS(_uM("backgroundColor" to "#909399")), "i-button--default" to _pS(_uM("backgroundColor" to "#f4f4f5", "borderTopColor" to "#dadbde", "borderRightColor" to "#dadbde", "borderBottomColor" to "#dadbde", "borderLeftColor" to "#dadbde")), "i-button--plain" to _pS(_uM("backgroundColor" to "#ffffff", "borderTopColor" to "#dadbde", "borderRightColor" to "#dadbde", "borderBottomColor" to "#dadbde", "borderLeftColor" to "#dadbde")), "i-button--plain-primary" to _pS(_uM("borderTopColor" to "#3c9cff", "borderRightColor" to "#3c9cff", "borderBottomColor" to "#3c9cff", "borderLeftColor" to "#3c9cff", "backgroundColor" to "#ffffff")), "i-button--plain-success" to _pS(_uM("borderTopColor" to "#5ac725", "borderRightColor" to "#5ac725", "borderBottomColor" to "#5ac725", "borderLeftColor" to "#5ac725", "backgroundColor" to "#ffffff")), "i-button--plain-warning" to _pS(_uM("borderTopColor" to "#f9ae3d", "borderRightColor" to "#f9ae3d", "borderBottomColor" to "#f9ae3d", "borderLeftColor" to "#f9ae3d", "backgroundColor" to "#ffffff")), "i-button--plain-error" to _pS(_uM("borderTopColor" to "#f56c6c", "borderRightColor" to "#f56c6c", "borderBottomColor" to "#f56c6c", "borderLeftColor" to "#f56c6c", "backgroundColor" to "#ffffff")), "i-button--plain-info" to _pS(_uM("borderTopColor" to "#909399", "borderRightColor" to "#909399", "borderBottomColor" to "#909399", "borderLeftColor" to "#909399", "backgroundColor" to "#ffffff")), "i-button--hairline" to _pS(_uM("borderTopWidth" to 0.5, "borderRightWidth" to 0.5, "borderBottomWidth" to 0.5, "borderLeftWidth" to 0.5)), "i-button--disabled" to _pS(_uM("opacity" to 0.6)), "i-button--loading" to _pS(_uM("opacity" to 0.9)), "i-button--hover" to _pS(_uM("opacity" to 0.86)), "i-button__text" to _pS(_uM("color" to "#ffffff", "fontSize" to 15, "fontWeight" to 500, "lineHeight" to "22px")), "i-button__text--small" to _pS(_uM("fontSize" to 13, "lineHeight" to "20px")), "i-button__text--default" to _pS(_uM("color" to "#303133")), "i-button__text--plain-primary" to _pS(_uM("color" to "#3c9cff")), "i-button__text--plain-success" to _pS(_uM("color" to "#5ac725")), "i-button__text--plain-warning" to _pS(_uM("color" to "#f9ae3d")), "i-button__text--plain-error" to _pS(_uM("color" to "#f56c6c")), "i-button__text--plain-info" to _pS(_uM("color" to "#909399")), "i-button__text--plain-default" to _pS(_uM("color" to "#303133")), "i-button__text--disabled" to _pS(_uM("opacity" to 0.9)), "i-button__icon" to _pS(_uM("marginRight" to 6, "color" to "#ffffff", "fontSize" to 15, "lineHeight" to "22px")), "i-button__icon--right" to _pS(_uM("marginRight" to 0, "marginLeft" to 6)), "i-button__loading" to _pS(_uM("marginRight" to 6, "borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999, "borderTopWidth" to 2, "borderRightWidth" to 2, "borderBottomWidth" to 2, "borderLeftWidth" to 2, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#ffffff", "borderRightColor" to "rgba(255,255,255,0.45)", "borderBottomColor" to "rgba(255,255,255,0.45)", "borderLeftColor" to "rgba(255,255,255,0.45)", "boxSizing" to "border-box")), "i-button__loading--circle" to _pS(_uM("borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999)), "i-button__text--loading" to _pS(_uM("opacity" to 0.96)), "i-button__loading--muted" to _pS(_uM("borderTopColor" to "#606266", "borderRightColor" to "rgba(48,49,51,0.18)", "borderBottomColor" to "rgba(48,49,51,0.18)", "borderLeftColor" to "rgba(48,49,51,0.18)")), "i-button__loading--plain-primary" to _pS(_uM("borderTopColor" to "#3c9cff")), "i-button__loading--plain-success" to _pS(_uM("borderTopColor" to "#5ac725")), "i-button__loading--plain-warning" to _pS(_uM("borderTopColor" to "#f9ae3d")), "i-button__loading--plain-error" to _pS(_uM("borderTopColor" to "#f56c6c")), "i-button__loading--plain-info" to _pS(_uM("borderTopColor" to "#909399")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "getphonenumber" to null, "getuserinfo" to null, "error" to null, "opensetting" to null, "launchapp" to null, "agreeprivacyauthorization" to null)
        var props = _nP(_uM("hairline" to _uM("type" to "Boolean", "default" to true), "type" to _uM("type" to "String", "default" to "default"), "size" to _uM("type" to "String", "default" to "normal"), "block" to _uM("type" to "Boolean", "default" to false), "shape" to _uM("type" to "String", "default" to "square"), "plain" to _uM("type" to "Boolean", "default" to false), "disabled" to _uM("type" to "Boolean", "default" to false), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "4px"), "loading" to _uM("type" to "Boolean", "default" to false), "loadingMode" to _uM("type" to "String", "default" to "spinner"), "loadingSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 15), "openType" to _uM("type" to "String", "default" to ""), "formType" to _uM("type" to "String", "default" to ""), "appParameter" to _uM("type" to "String", "default" to ""), "hoverStopPropagation" to _uM("type" to "Boolean", "default" to true), "lang" to _uM("type" to "String", "default" to "en"), "sessionFrom" to _uM("type" to "String", "default" to ""), "sendMessageTitle" to _uM("type" to "String", "default" to ""), "sendMessagePath" to _uM("type" to "String", "default" to ""), "sendMessageImg" to _uM("type" to "String", "default" to ""), "showMessageCard" to _uM("type" to "Boolean", "default" to false), "dataName" to _uM("type" to "String", "default" to ""), "throttleTime" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0), "hoverStartTime" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0), "hoverStayTime" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 200), "hoverClass" to _uM("type" to "String", "default" to "i-button--hover"), "text" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "icon" to _uM("type" to "String", "default" to ""), "iconColor" to _uM("type" to "String", "default" to ""), "iconPosition" to _uM("type" to "String", "default" to "left"), "color" to _uM("type" to "String", "default" to ""), "customStyle" to _uM("type" to "String", "default" to "")))
        var propsNeedCastKeys = _uA(
            "hairline",
            "type",
            "size",
            "block",
            "shape",
            "plain",
            "disabled",
            "round",
            "loading",
            "loadingMode",
            "loadingSize",
            "openType",
            "formType",
            "appParameter",
            "hoverStopPropagation",
            "lang",
            "sessionFrom",
            "sendMessageTitle",
            "sendMessagePath",
            "sendMessageImg",
            "showMessageCard",
            "dataName",
            "throttleTime",
            "hoverStartTime",
            "hoverStayTime",
            "hoverClass",
            "text",
            "icon",
            "iconColor",
            "iconPosition",
            "color",
            "customStyle"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
