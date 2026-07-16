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
open class GenUniModulesIUiXComponentsIPopupIPopup : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var show: Boolean by `$props`
    open var overlay: Boolean by `$props`
    open var mode: String by `$props`
    open var position: String by `$props`
    open var title: String by `$props`
    open var showTitle: Boolean by `$props`
    open var showClose: Boolean by `$props`
    open var showFooter: Boolean by `$props`
    open var showCancel: Boolean by `$props`
    open var cancelText: String by `$props`
    open var confirmText: String by `$props`
    open var titleStyle: Any by `$props`
    open var duration: Any by `$props`
    open var closeable: Boolean by `$props`
    open var overlayStyle: Any by `$props`
    open var overlayOpacity: Any by `$props`
    open var closeOnMask: Boolean by `$props`
    open var overlayClick: Boolean by `$props`
    open var overflayBgColor: String by `$props`
    open var zIndex: Any by `$props`
    open var safeBottom: Boolean by `$props`
    open var safeTop: Boolean by `$props`
    open var closeIcon: String by `$props`
    open var closeIconColor: String by `$props`
    open var closeIconSize: Any by `$props`
    open var closeIconPos: String by `$props`
    open var margin: Any by `$props`
    open var navbarHeight: Number by `$props`
    open var round: Any by `$props`
    open var zoom: Boolean by `$props`
    open var bgColor: String by `$props`
    open var size: Any by `$props`
    open var maxHeight: Any by `$props`
    open var width: Any by `$props`
    open var height: Any by `$props`
    open var customStyle: Any by `$props`
    open var customWrapStyle: Any by `$props`
    open var customFooterStyle: Any by `$props`
    open var contentMargin: Any by `$props`
    open var widthCoverCenter: Boolean by `$props`
    open var offsetTop: Any by `$props`
    open var offsetBottom: Any by `$props`
    open var lazy: Boolean by `$props`
    open var disabledScroll: Boolean by `$props`
    open var disabled: Boolean by `$props`
    open var disabledConfirm: Boolean by `$props`
    open var btnColor: String by `$props`
    open var swipeClose: Boolean by `$props`
    open var swipeHandle: Boolean by `$props`
    open var contentDraggable: Boolean by `$props`
    open var swipeCloseThreshold: Any by `$props`
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
        var setup: (__props: GenUniModulesIUiXComponentsIPopupIPopup, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIPopupIPopup
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val opened = ref(props.show)
            val active = ref(props.show)
            val contentReady = ref(!props.lazy || props.show)
            val startX = ref(0)
            val startY = ref(0)
            val offsetX = ref(0)
            val offsetY = ref(0)
            val touching = ref(false)
            var closeTimer: Number = 0
            var lazyTimer: Number = 0
            val rootStyle = computed(fun(): String {
                return "z-index:" + String(props.zIndex) + ";"
            }
            )
            val panelClass = computed(fun(): String {
                val classes = _uA(
                    "i-popup__panel"
                )
                classes.push("i-popup__panel--" + normalizedMode.value)
                if (shouldCoverCenter()) {
                    classes.push("i-popup__panel--cover-center")
                }
                return classes.join(" ")
            }
            )
            val normalizedMode = computed(fun(): String {
                if (drawerPosition.value == "left" || drawerPosition.value == "right" || drawerPosition.value == "top" || drawerPosition.value == "center") {
                    return drawerPosition.value
                }
                return "bottom"
            }
            )
            val drawerPosition = computed(fun(): String {
                if (props.position.length > 0) {
                    return props.position
                }
                return props.mode
            }
            )
            val overlayComputedStyle = computed(fun(): String {
                var bgColor = "rgba(0,0,0," + String(props.overlayOpacity) + ")"
                if (props.overflayBgColor.length > 0) {
                    bgColor = props.overflayBgColor
                }
                var style = "background-color:" + bgColor + ";"
                style = style + "opacity:" + (if (active.value) {
                    "1"
                } else {
                    "0"
                }
                ) + ";"
                style = style + "transition-duration:" + formatMs(props.duration) + ";"
                style = style + stringifyStyle(props.overlayStyle)
                return style
            }
            )
            val titleStyleText = computed(fun(): String {
                return stringifyStyle(props.titleStyle)
            }
            )
            val panelStyle = computed(fun(): String {
                var style = "background-color:" + bgColor.value + ";"
                style = style + "transition-duration:" + formatMs(props.duration) + ";"
                style = style + marginStyle()
                style = style + sizeStyle()
                style = style + roundStyle()
                style = style + safeAreaStyle()
                style = style + transformStyle()
                style = style + stringifyStyle(props.customStyle)
                style = style + stringifyStyle(props.customWrapStyle)
                return style
            }
            )
            val bodyStyle = computed(fun(): String {
                var style = "padding:" + formatSize(props.contentMargin) + ";"
                if (String(props.maxHeight).length > 0) {
                    style = style + "max-height:" + formatSize(props.maxHeight) + ";"
                }
                return style
            }
            )
            val footerStyle = computed(fun(): String {
                return stringifyStyle(props.customFooterStyle)
            }
            )
            val confirmTextStyle = computed(fun(): String {
                val color = if (props.btnColor.length > 0) {
                    props.btnColor
                } else {
                    "#1989fa"
                }
                return "color:" + color + ";"
            }
            )
            val confirmTextValue = computed(fun(): String {
                return if (props.confirmText.length > 0) {
                    props.confirmText
                } else {
                    "确定"
                }
            }
            )
            val cancelTextValue = computed(fun(): String {
                return if (props.cancelText.length > 0) {
                    props.cancelText
                } else {
                    "取消"
                }
            }
            )
            val contentVisible = computed(fun(): Boolean {
                return !props.lazy || contentReady.value
            }
            )
            val closeClass = computed(fun(): String {
                val classes = _uA(
                    "i-popup__close"
                )
                classes.push("i-popup__close--" + normalizeClosePos())
                return classes.join(" ")
            }
            )
            val closeStyle = computed(fun(): String {
                return "color:" + props.closeIconColor + ";font-size:" + formatSize(props.closeIconSize) + ";"
            }
            )
            val closeIconText = computed(fun(): String {
                if (props.closeIcon == "close") {
                    return "×"
                }
                return props.closeIcon
            }
            )
            watch(fun(){
                return props.show
            }
            , fun(nextValue){
                if (nextValue) {
                    openPanel(false)
                } else {
                    closePanel(false)
                }
            }
            )
            fun gen_open_fn() {
                openPanel(true)
            }
            val open = ::gen_open_fn
            fun gen_close_fn() {
                closePanel(true)
            }
            val close = ::gen_close_fn
            fun gen_openPanel_fn(shouldEmitUpdate: Boolean) {
                if (props.disabled) {
                    return
                }
                if (opened.value && active.value) {
                    return
                }
                clearTimers()
                emit("beforeOpen")
                opened.value = true
                resetOffset()
                if (!props.lazy) {
                    contentReady.value = true
                }
                setTimeout(fun(){
                    active.value = true
                    if (props.lazy) {
                        lazyTimer = setTimeout(fun(){
                            contentReady.value = true
                            lazyTimer = 0
                        }
                        , animationDuration())
                    }
                    emit("open")
                    if (shouldEmitUpdate) {
                        emit("update:show", true)
                    }
                }
                , 20)
            }
            val openPanel = ::gen_openPanel_fn
            fun gen_closePanel_fn(shouldEmitUpdate: Boolean) {
                if (!opened.value && !active.value) {
                    return
                }
                clearTimers()
                emit("beforeClose")
                active.value = false
                if (props.lazy) {
                    contentReady.value = false
                }
                resetOffset()
                closeTimer = setTimeout(fun(){
                    opened.value = false
                    closeTimer = 0
                    emit("close")
                    if (shouldEmitUpdate) {
                        emit("update:show", false)
                    }
                }
                , animationDuration())
            }
            val closePanel = ::gen_closePanel_fn
            fun gen_clearTimers_fn() {
                if (closeTimer > 0) {
                    clearTimeout(closeTimer)
                    closeTimer = 0
                }
                if (lazyTimer > 0) {
                    clearTimeout(lazyTimer)
                    lazyTimer = 0
                }
            }
            val clearTimers = ::gen_clearTimers_fn
            fun gen_handleOverlayClick_fn() {
                emit("click")
                if (!props.overlayClick || !props.closeOnMask) {
                    return
                }
                close()
            }
            val handleOverlayClick = ::gen_handleOverlayClick_fn
            fun gen_cancel_fn() {
                emit("cancel")
                close()
            }
            val cancel = ::gen_cancel_fn
            fun gen_confirm_fn() {
                if (props.disabledConfirm) {
                    return
                }
                emit("confirm")
                close()
            }
            val confirm = ::gen_confirm_fn
            fun gen_handleContentTouchStart_fn(event) {
                if (!props.contentDraggable) {
                    return
                }
                handleTouchStart(event)
            }
            val handleContentTouchStart = ::gen_handleContentTouchStart_fn
            fun gen_handleHandleTouchStart_fn(event) {
                handleTouchStart(event)
            }
            val handleHandleTouchStart = ::gen_handleHandleTouchStart_fn
            fun gen_handleTouchStart_fn(event) {
                if (!props.swipeClose) {
                    return
                }
                touching.value = true
                startX.value = readTouchX(event)
                startY.value = readTouchY(event)
            }
            val handleTouchStart = ::gen_handleTouchStart_fn
            fun gen_handleTouchMove_fn(event) {
                if (!props.swipeClose || !touching.value) {
                    return
                }
                val currentX = readTouchX(event)
                val currentY = readTouchY(event)
                val deltaX = currentX - startX.value
                val deltaY = currentY - startY.value
                if (normalizedMode.value == "bottom" && deltaY > 0) {
                    offsetY.value = deltaY
                }
                if (normalizedMode.value == "top" && deltaY < 0) {
                    offsetY.value = deltaY
                }
                if (normalizedMode.value == "left" && deltaX < 0) {
                    offsetX.value = deltaX
                }
                if (normalizedMode.value == "right" && deltaX > 0) {
                    offsetX.value = deltaX
                }
                if (normalizedMode.value == "center" && deltaY > 0) {
                    offsetY.value = deltaY
                }
            }
            val handleTouchMove = ::gen_handleTouchMove_fn
            fun gen_handleTouchEnd_fn() {
                if (!touching.value) {
                    return
                }
                touching.value = false
                val threshold = Number(props.swipeCloseThreshold)
                if (Math.abs(offsetX.value) >= threshold || Math.abs(offsetY.value) >= threshold) {
                    close()
                    return
                }
                resetOffset()
            }
            val handleTouchEnd = ::gen_handleTouchEnd_fn
            fun gen_resetOffset_fn() {
                offsetX.value = 0
                offsetY.value = 0
                touching.value = false
            }
            val resetOffset = ::gen_resetOffset_fn
            fun gen_transformStyle_fn(): String {
                val x = String(offsetX.value)
                val y = String(offsetY.value)
                if (normalizedMode.value == "center") {
                    val scale = if (props.zoom) {
                        if (active.value) {
                            "1"
                        } else {
                            "0.88"
                        }
                    } else {
                        "1"
                    }
                    return ("opacity:" + (if (active.value) {
                        "1"
                    } else {
                        "0"
                    }
                    ) + ";transform:translate(-50%,-50%) translate(" + x + "px," + y + "px) scale(" + scale + ");")
                }
                if (normalizedMode.value == "bottom") {
                    val prefix = if (shouldCoverCenter()) {
                        "translateX(-50%) "
                    } else {
                        ""
                    }
                    return "transform:" + prefix + "translateY(" + (if (active.value) {
                        y + "px"
                    } else {
                        "100%"
                    }
                    ) + ");"
                }
                if (normalizedMode.value == "top") {
                    val prefix = if (shouldCoverCenter()) {
                        "translateX(-50%) "
                    } else {
                        ""
                    }
                    return "transform:" + prefix + "translateY(" + (if (active.value) {
                        y + "px"
                    } else {
                        "-100%"
                    }
                    ) + ");"
                }
                if (normalizedMode.value == "left") {
                    return "transform:translateX(" + (if (active.value) {
                        x + "px"
                    } else {
                        "-100%"
                    }
                    ) + ");"
                }
                if (normalizedMode.value == "right") {
                    return "transform:translateX(" + (if (active.value) {
                        x + "px"
                    } else {
                        "100%"
                    }
                    ) + ");"
                }
                return ""
            }
            val transformStyle = ::gen_transformStyle_fn
            fun gen_marginStyle_fn(): String {
                val margin = formatSize(props.margin)
                if (margin == "0px") {
                    return ""
                }
                return "margin:" + margin + ";"
            }
            val marginStyle = ::gen_marginStyle_fn
            fun gen_sizeStyle_fn(): String {
                var style = ""
                val size = String(props.size)
                if (normalizedMode.value == "left" || normalizedMode.value == "right") {
                    if (String(props.width).length > 0) {
                        style = style + "width:" + formatSize(props.width) + ";"
                    } else if (size.length > 0) {
                        style = style + "width:" + formatSize(size) + ";"
                    }
                } else if (normalizedMode.value == "top" || normalizedMode.value == "bottom") {
                    if (String(props.width).length == 0 && !shouldCoverCenter()) {
                        style = style + "width:100%;"
                    }
                    if (String(props.height).length > 0) {
                        style = style + "height:" + formatSize(props.height) + ";"
                    } else if (size.length > 0) {
                        style = style + "height:" + formatSize(size) + ";"
                    }
                    if (String(props.width).length > 0) {
                        style = style + "width:" + formatSize(props.width) + ";"
                    }
                } else {
                    if (String(props.width).length > 0) {
                        style = style + "width:" + formatSize(props.width) + ";"
                    }
                    if (String(props.height).length > 0) {
                        style = style + "height:" + formatSize(props.height) + ";"
                    }
                }
                if (normalizedMode.value == "top") {
                    if (props.navbarHeight > 0) {
                        style = style + "top:" + String(props.navbarHeight) + "px;"
                    }
                    if (String(props.offsetTop).length > 0) {
                        style = style + "top:" + formatSize(props.offsetTop) + ";"
                    }
                }
                if (normalizedMode.value == "bottom" && String(props.offsetBottom).length > 0) {
                    style = style + "bottom:" + formatSize(props.offsetBottom) + ";"
                }
                return style
            }
            val sizeStyle = ::gen_sizeStyle_fn
            fun gen_roundStyle_fn(): String {
                val round = formatSize(props.round)
                if (normalizedMode.value == "top") {
                    return "border-radius:0 0 " + round + " " + round + ";"
                }
                if (normalizedMode.value == "bottom") {
                    return "border-radius:" + round + " " + round + " 0 0;"
                }
                if (normalizedMode.value == "left") {
                    return "border-radius:0 " + round + " " + round + " 0;"
                }
                if (normalizedMode.value == "right") {
                    return "border-radius:" + round + " 0 0 " + round + ";"
                }
                if (normalizedMode.value == "center") {
                    return "border-radius:" + round + ";"
                }
                return ""
            }
            val roundStyle = ::gen_roundStyle_fn
            fun gen_safeAreaStyle_fn(): String {
                var style = ""
                if (props.safeTop && normalizedMode.value == "top") {
                    style = style + "padding-top:env(safe-area-inset-top);"
                }
                if (props.safeBottom && normalizedMode.value == "bottom") {
                    style = style + "padding-bottom:env(safe-area-inset-bottom);"
                }
                return style
            }
            val safeAreaStyle = ::gen_safeAreaStyle_fn
            fun gen_normalizeClosePos_fn(): String {
                if (props.closeIconPos == "top-left" || props.closeIconPos == "bottom-left" || props.closeIconPos == "bottom-right") {
                    return props.closeIconPos
                }
                return "top-right"
            }
            val normalizeClosePos = ::gen_normalizeClosePos_fn
            fun gen_stringifyStyle_fn(value): String {
                if (value == null) {
                    return ""
                }
                val text = String(value)
                if (text == "[object Object]") {
                    return ""
                }
                if (text.length == 0) {
                    return ""
                }
                return if (text.endsWith(";")) {
                    text
                } else {
                    text + ";"
                }
            }
            val stringifyStyle = ::gen_stringifyStyle_fn
            fun gen_formatMs_fn(value): String {
                val text = String(value)
                if (text.indexOf("ms") >= 0 || text.indexOf("s") >= 0) {
                    return text
                }
                return text + "ms"
            }
            val formatMs = ::gen_formatMs_fn
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
                    return 300
                }
                return duration
            }
            val animationDuration = ::gen_animationDuration_fn
            fun gen_isVerticalMode_fn(): Boolean {
                return normalizedMode.value == "top" || normalizedMode.value == "bottom"
            }
            val isVerticalMode = ::gen_isVerticalMode_fn
            fun gen_shouldCoverCenter_fn(): Boolean {
                return props.widthCoverCenter && isVerticalMode() && String(props.width).length > 0
            }
            val shouldCoverCenter = ::gen_shouldCoverCenter_fn
            fun gen_formatSize_fn(value): String {
                val text = String(value)
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_readTouchX_fn(event): Number {
                var point = null
                if (event.touches != null && event.touches.length > 0) {
                    point = event.touches[0]
                } else if (event.changedTouches != null && event.changedTouches.length > 0) {
                    point = event.changedTouches[0]
                }
                if (point == null) {
                    return 0
                }
                val clientX = Number(point.clientX)
                if (!isNaN(clientX)) {
                    return clientX
                }
                return Number(point.pageX)
            }
            val readTouchX = ::gen_readTouchX_fn
            fun gen_readTouchY_fn(event): Number {
                var point = null
                if (event.touches != null && event.touches.length > 0) {
                    point = event.touches[0]
                } else if (event.changedTouches != null && event.changedTouches.length > 0) {
                    point = event.changedTouches[0]
                }
                if (point == null) {
                    return 0
                }
                val clientY = Number(point.clientY)
                if (!isNaN(clientY)) {
                    return clientY
                }
                return Number(point.pageY)
            }
            val readTouchY = ::gen_readTouchY_fn
            __expose(_uM("open" to open, "close" to close))
            return fun(): Any? {
                return _cE("view", null, _uA(
                    _cE("view", _uM("class" to "i-popup__trigger", "onClick" to open), _uA(
                        renderSlot(_ctx.`$slots`, "trigger")
                    )),
                    if (isTrue(opened.value)) {
                        _cE("view", _uM("key" to 0, "class" to "i-popup", "style" to _nS(rootStyle.value)), _uA(
                            if (isTrue(_ctx.overlay)) {
                                _cE("view", _uM("key" to 0, "class" to "i-popup__overlay", "style" to _nS(overlayComputedStyle.value), "onClick" to handleOverlayClick), null, 4)
                            } else {
                                _cC("v-if", true)
                            },
                            _cE("view", _uM("class" to _nC(panelClass.value), "style" to _nS(panelStyle.value), "onClick" to withModifiers(fun(){}, _uA(
                                "stop"
                            ))), _uA(
                                renderSlot(_ctx.`$slots`, "bg"),
                                if (isTrue(if (isTruthy(_ctx.swipeClose)) {
                                    _ctx.swipeHandle
                                } else {
                                    _ctx.swipeClose
                                })) {
                                    _cE("view", _uM("key" to 0, "class" to "i-popup__swipe-handle", "onTouchstart" to withModifiers(handleHandleTouchStart, _uA(
                                        "stop"
                                    )), "onTouchmove" to withModifiers(handleTouchMove, _uA(
                                        "stop",
                                        "prevent"
                                    )), "onTouchend" to withModifiers(handleTouchEnd, _uA(
                                        "stop"
                                    )), "onTouchcancel" to withModifiers(handleTouchEnd, _uA(
                                        "stop"
                                    ))), _uA(
                                        _cE("view", _uM("class" to "i-popup__swipe-bar"))
                                    ), 32)
                                } else {
                                    _cC("v-if", true)
                                },
                                if (normalizedMode.value == "bottom") {
                                    renderSlot(_ctx.`$slots`, "contentTop", _uM("key" to 1))
                                } else {
                                    _cC("v-if", true)
                                },
                                renderSlot(_ctx.`$slots`, "header", _uO(), fun(): UTSArray<Any> {
                                    return _uA(
                                        if (isTrue(if (isTruthy(_ctx.showTitle)) {
                                            _ctx.title.length > 0
                                        } else {
                                            _ctx.showTitle
                                        })) {
                                            _cE("view", _uM("key" to 0, "class" to "i-popup__header"), _uA(
                                                renderSlot(_ctx.`$slots`, "title", _uO(), fun(): UTSArray<Any> {
                                                    return _uA(
                                                        _cE("text", _uM("class" to "i-popup__title", "style" to _nS(titleStyleText.value)), _tD(_ctx.title), 5)
                                                    )
                                                })
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    )
                                }),
                                if (isTrue(_ctx.showClose)) {
                                    _cE("view", _uM("key" to 2, "class" to _nC(closeClass.value), "style" to _nS(closeStyle.value), "onClick" to close), _uA(
                                        _cE("text", _uM("class" to "i-popup__close-text"), _tD(closeIconText.value), 1)
                                    ), 6)
                                } else {
                                    _cC("v-if", true)
                                },
                                if (isTrue(_ctx.disabledScroll)) {
                                    _cE("view", _uM("key" to 3, "class" to "i-popup__body", "style" to _nS(bodyStyle.value)), _uA(
                                        if (isTrue(contentVisible.value)) {
                                            renderSlot(_ctx.`$slots`, "default", _uM("key" to 0))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ), 4)
                                } else {
                                    _cE("scroll-view", _uM("key" to 4, "scroll-y" to "", "class" to "i-popup__body i-popup__body--scroll", "style" to _nS(bodyStyle.value)), _uA(
                                        if (isTrue(contentVisible.value)) {
                                            renderSlot(_ctx.`$slots`, "default", _uM("key" to 0))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ), 4)
                                },
                                renderSlot(_ctx.`$slots`, "footer", _uO(), fun(): UTSArray<Any> {
                                    return _uA(
                                        if (isTrue(_ctx.showFooter)) {
                                            _cE("view", _uM("key" to 0, "class" to "i-popup__footer", "style" to _nS(footerStyle.value)), _uA(
                                                if (isTrue(_ctx.showCancel)) {
                                                    _cE("view", _uM("key" to 0, "class" to "i-popup__footer-button i-popup__footer-button--cancel", "onClick" to cancel), _uA(
                                                        _cE("text", _uM("class" to "i-popup__footer-cancel"), _tD(cancelTextValue.value), 1)
                                                    ))
                                                } else {
                                                    _cC("v-if", true)
                                                },
                                                _cE("view", _uM("class" to _nC(if (isTruthy(_ctx.disabledConfirm)) {
                                                    "i-popup__footer-button i-popup__footer-button--confirm i-popup__footer-button--disabled"
                                                } else {
                                                    "i-popup__footer-button i-popup__footer-button--confirm"
                                                }), "onClick" to confirm), _uA(
                                                    _cE("text", _uM("class" to "i-popup__footer-confirm", "style" to _nS(confirmTextStyle.value)), _tD(confirmTextValue.value), 5)
                                                ), 2)
                                            ), 4)
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    )
                                }),
                                if (isTrue(if (isTruthy(_ctx.closeable)) {
                                    !isTruthy(_ctx.showClose)
                                } else {
                                    _ctx.closeable
                                })) {
                                    _cE("view", _uM("key" to 5, "class" to _nC(closeClass.value), "style" to _nS(closeStyle.value), "onClick" to close), _uA(
                                        _cE("text", _uM("class" to "i-popup__close-text"), _tD(closeIconText.value), 1)
                                    ), 6)
                                } else {
                                    _cC("v-if", true)
                                }
                            ), 14, _uA(
                                "onClick"
                            ))
                        ), 4)
                    } else {
                        _cC("v-if", true)
                    }
                ))
            }
        }
        var name = "i-popup"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-popup__trigger" to _pS(_uM("flexDirection" to "column")), "i-popup" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0)), "i-popup__overlay" to _pS(_uM("position" to "absolute", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "transitionProperty" to "opacity", "transitionTimingFunction" to "ease")), "i-popup__panel" to _pS(_uM("position" to "absolute", "overflow" to "hidden", "flexDirection" to "column", "boxShadow" to "0 12px 34px rgba(15, 23, 42, 0.18)", "transitionProperty" to "transform,opacity", "transitionTimingFunction" to "cubic-bezier(0.22,1,0.36,1)")), "i-popup__panel--bottom" to _pS(_uM("left" to 0, "right" to 0, "bottom" to 0, "minHeight" to 160)), "i-popup__panel--top" to _pS(_uM("left" to 0, "right" to 0, "top" to 0, "minHeight" to 160)), "i-popup__panel--left" to _pS(_uM("left" to 0, "top" to 0, "bottom" to 0, "width" to 280)), "i-popup__panel--right" to _pS(_uM("right" to 0, "top" to 0, "bottom" to 0, "width" to 280)), "i-popup__panel--center" to _pS(_uM("left" to "50%", "top" to "50%", "width" to 300)), "i-popup__panel--cover-center" to _pS(_uM("left" to "50%", "right" to "auto", "width" to "100%", "transformOrigin" to "center center")), "i-popup__swipe-handle" to _pS(_uM("height" to 24, "alignItems" to "center", "justifyContent" to "center")), "i-popup__swipe-bar" to _pS(_uM("width" to 38, "height" to 4, "borderTopLeftRadius" to 99, "borderTopRightRadius" to 99, "borderBottomRightRadius" to 99, "borderBottomLeftRadius" to 99, "backgroundColor" to "#d9dee8")), "i-popup__header" to _pS(_uM("minHeight" to 54, "paddingTop" to 0, "paddingRight" to 52, "paddingBottom" to 0, "paddingLeft" to 18, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#f2f3f5", "alignItems" to "center", "justifyContent" to "center")), "i-popup__title" to _pS(_uM("color" to "#303133", "fontSize" to 16, "fontWeight" to 600, "lineHeight" to "24px")), "i-popup__close" to _pS(_uM("position" to "absolute", "zIndex" to 2, "width" to 34, "height" to 34, "borderTopLeftRadius" to 34, "borderTopRightRadius" to 34, "borderBottomRightRadius" to 34, "borderBottomLeftRadius" to 34, "backgroundColor" to "rgba(245,247,250,0.92)", "alignItems" to "center", "justifyContent" to "center")), "i-popup__close--top-right" to _pS(_uM("right" to 12, "top" to 10)), "i-popup__close--top-left" to _pS(_uM("left" to 12, "top" to 10)), "i-popup__close--bottom-left" to _pS(_uM("left" to 12, "bottom" to 10)), "i-popup__close--bottom-right" to _pS(_uM("right" to 12, "bottom" to 10)), "i-popup__close-text" to _pS(_uM("color" to "#606266", "fontSize" to 22, "lineHeight" to "34px", "textAlign" to "center")), "i-popup__body" to _pS(_uM("position" to "relative", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "i-popup__body--scroll" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "i-popup__footer" to _pS(_uM("minHeight" to 58, "paddingTop" to 10, "paddingRight" to 14, "paddingBottom" to 10, "paddingLeft" to 14, "borderTopWidth" to 1, "borderTopStyle" to "solid", "borderTopColor" to "#f2f3f5", "backgroundColor" to "#ffffff", "flexDirection" to "row")), "i-popup__footer-button" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to 40, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "alignItems" to "center", "justifyContent" to "center")), "i-popup__footer-button--cancel" to _pS(_uM("marginRight" to 8, "backgroundColor" to "#f5f7fb")), "i-popup__footer-button--confirm" to _pS(_uM("backgroundColor" to "#eef6ff")), "i-popup__footer-button--disabled" to _pS(_uM("opacity" to 0.45)), "i-popup__footer-cancel" to _pS(_uM("fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px", "color" to "#606266")), "i-popup__footer-confirm" to _pS(_uM("fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")), "@TRANSITION" to _uM("i-popup__overlay" to _uM("property" to "opacity", "timingFunction" to "ease"), "i-popup__panel" to _uM("property" to "transform,opacity", "timingFunction" to "cubic-bezier(0.22,1,0.36,1)")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "open" to null, "close" to null, "beforeOpen" to null, "beforeClose" to null, "cancel" to null, "confirm" to null, "update:show" to null)
        var props = _nP(_uM("show" to _uM("type" to "Boolean", "default" to false), "overlay" to _uM("type" to "Boolean", "default" to true), "mode" to _uM("type" to "String", "default" to "bottom"), "position" to _uM("type" to "String", "default" to ""), "title" to _uM("type" to "String", "default" to ""), "showTitle" to _uM("type" to "Boolean", "default" to true), "showClose" to _uM("type" to "Boolean", "default" to false), "showFooter" to _uM("type" to "Boolean", "default" to false), "showCancel" to _uM("type" to "Boolean", "default" to true), "cancelText" to _uM("type" to "String", "default" to ""), "confirmText" to _uM("type" to "String", "default" to ""), "titleStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "duration" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 300), "closeable" to _uM("type" to "Boolean", "default" to false), "overlayStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "overlayOpacity" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0.5), "closeOnMask" to _uM("type" to "Boolean", "default" to true), "overlayClick" to _uM("type" to "Boolean", "default" to true), "overflayBgColor" to _uM("type" to "String", "default" to ""), "zIndex" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 10075), "safeBottom" to _uM("type" to "Boolean", "default" to true), "safeTop" to _uM("type" to "Boolean", "default" to false), "closeIcon" to _uM("type" to "String", "default" to "close"), "closeIconColor" to _uM("type" to "String", "default" to "#909399"), "closeIconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 18), "closeIconPos" to _uM("type" to "String", "default" to "top-right"), "margin" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 0), "navbarHeight" to _uM("type" to "Number", "default" to 0), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 16), "zoom" to _uM("type" to "Boolean", "default" to true), "bgColor" to _uM("type" to "String", "default" to "#ffffff"), "size" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "maxHeight" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "width" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "height" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "customStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "customWrapStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "customFooterStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "contentMargin" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 16), "widthCoverCenter" to _uM("type" to "Boolean", "default" to false), "offsetTop" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "0"), "offsetBottom" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "0"), "lazy" to _uM("type" to "Boolean", "default" to false), "disabledScroll" to _uM("type" to "Boolean", "default" to false), "disabled" to _uM("type" to "Boolean", "default" to false), "disabledConfirm" to _uM("type" to "Boolean", "default" to false), "btnColor" to _uM("type" to "String", "default" to ""), "swipeClose" to _uM("type" to "Boolean", "default" to false), "swipeHandle" to _uM("type" to "Boolean", "default" to true), "contentDraggable" to _uM("type" to "Boolean", "default" to true), "swipeCloseThreshold" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 50)))
        var propsNeedCastKeys = _uA(
            "show",
            "overlay",
            "mode",
            "position",
            "title",
            "showTitle",
            "showClose",
            "showFooter",
            "showCancel",
            "cancelText",
            "confirmText",
            "titleStyle",
            "duration",
            "closeable",
            "overlayStyle",
            "overlayOpacity",
            "closeOnMask",
            "overlayClick",
            "overflayBgColor",
            "zIndex",
            "safeBottom",
            "safeTop",
            "closeIcon",
            "closeIconColor",
            "closeIconSize",
            "closeIconPos",
            "margin",
            "navbarHeight",
            "round",
            "zoom",
            "bgColor",
            "size",
            "maxHeight",
            "width",
            "height",
            "customStyle",
            "customWrapStyle",
            "customFooterStyle",
            "contentMargin",
            "widthCoverCenter",
            "offsetTop",
            "offsetBottom",
            "lazy",
            "disabledScroll",
            "disabled",
            "disabledConfirm",
            "btnColor",
            "swipeClose",
            "swipeHandle",
            "contentDraggable",
            "swipeCloseThreshold"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
