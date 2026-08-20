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
import io.dcloud.uniapp.extapi.getWindowInfo as uni_getWindowInfo
open class GenUniModulesLimePopupComponentsLPopupLPopup : VueComponent, PopupProps {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    override var closeable: Boolean by `$props`
    override var closeOnClickOverlay: Boolean by `$props`
    override var destroyOnClose: Boolean by `$props`
    override var overlayStyle: Any? by `$props`
    override var position: String by `$props`
    override var preventScrollThrough: Boolean by `$props`
    override var overlay: Boolean by `$props`
    override var transitionName: String? by `$props`
    override var visible: Boolean? by `$props`
    override var zIndex: Number by `$props`
    override var duration: Number by `$props`
    override var bgColor: String? by `$props`
    override var closeIcon: String by `$props`
    override var iconColor: String? by `$props`
    override var lStyle: Any? by `$props`
    override var safeAreaInsetBottom: Boolean by `$props`
    override var safeAreaInsetTop: Boolean by `$props`
    override var radius: Any? by `$props`
    open var modelValue: Boolean? by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesLimePopupComponentsLPopupLPopup) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesLimePopupComponentsLPopupLPopup
            val _cache = __ins.renderCache
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val props = __props
            val modelValue = useModel<Boolean>(__ins.props, "modelValue")
            val innerValue = computed(WritableComputedOptions(set = fun(value: Boolean) {
                modelValue.value = value
                emit("change", value)
            }
            , get = fun(): Boolean {
                return (props.visible ?: false) || modelValue.value
            }
            ))
            val status = ref<TransitionEmitStatus>("before-enter")
            val _useTransition = useTransition(UseTransitionOptions(defaultName = props.transitionName ?: "popup-fade", appear = innerValue.value, emits = fun(name: TransitionEmitStatus){
                status.value = name
                if (name == "before-enter") {
                    emit("open")
                } else if (name == "after-enter") {
                    emit("opened")
                } else if (name == "before-leave") {
                    emit("close")
                } else if (name == "after-leave") {
                    emit("closed")
                }
                emit(name)
            }
            , visible = fun(): Boolean {
                return innerValue.value
            }
            , duration = props.duration))
            val inited = _useTransition.inited
            val display = _useTransition.display
            val classes = _useTransition.classes
            val finished = _useTransition.finished
            val overlayZIndex = computed(fun(): Number {
                return if (props.zIndex > 0) {
                    props.zIndex - 1
                } else {
                    998
                }
            }
            )
            val rootClass = computed(fun(): String {
                val safe = if (isTruthy(props.safeAreaInsetTop) && props.position == "top") {
                    "l-popup--safe-top"
                } else {
                    if (isTruthy(props.safeAreaInsetBottom) && props.position == "bottom") {
                        "l-popup--safe-bottom"
                    } else {
                        ""
                    }
                }
                return "l-popup--" + props.position + " " + safe + " " + classes.value
            }
            )
            val safeAreaInsets = uni_getWindowInfo().safeAreaInsets
            val styles = computed<Map<String, Any>>(fun(): Map<String, Any> {
                val style = Map<String, Any>()
                style.set("transition-duration", (if (_uA(
                    "after-leave",
                    "before-enter"
                ).includes(status.value)) {
                    0
                } else {
                    props.duration
                }
                ) + "ms")
                if (props.bgColor != null) {
                    style.set("background", props.bgColor!!)
                }
                if (props.zIndex > 0) {
                    style.set("z-index", props.zIndex)
                }
                if (props.radius != null) {
                    val values = convertRadius(props.radius!!)
                    style.set("border-top-left-radius", values[0])
                    style.set("border-top-right-radius", values[1])
                    style.set("border-bottom-right-radius", values[2])
                    style.set("border-bottom-left-radius", values[3])
                }
                return style
            }
            )
            val handleOverlayClick = fun(){
                if (isTruthy(props.closeOnClickOverlay)) {
                    innerValue.value = false
                    emit("click-overlay")
                }
            }
            val handleClose = fun(){
                innerValue.value = false
                emit("click-close")
            }
            val popupRef = ref<UniElement?>(null)
            watchEffect(fun(){
                if (!display.value) {
                    popupRef.value?.style?.setProperty("pointer-events", "none")
                    popupRef.value?.style?.setProperty("z-index", -10000)
                } else {
                    popupRef.value?.style?.setProperty("pointer-events", "auto")
                    popupRef.value?.style?.setProperty("z-index", props.zIndex)
                }
            }
            )
            return fun(): Any? {
                val _component_l_overlay = resolveEasyComponent("l-overlay", GenUniModulesLimeOverlayComponentsLOverlayLOverlayClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                return _cE(Fragment, null, _uA(
                    if (isTrue(if (isTruthy(_ctx.destroyOnClose)) {
                        if (unref(display)) {
                            _ctx.overlay
                        } else {
                            unref(display)
                        }
                    } else {
                        _ctx.overlay
                    }
                    )) {
                        _cV(_component_l_overlay, _uM("key" to 0, "visible" to unref(innerValue), "zIndex" to unref(overlayZIndex), "appear" to true, "preventScrollThrough" to _ctx.preventScrollThrough, "l-style" to _ctx.overlayStyle, "onClick" to handleOverlayClick), null, 8, _uA(
                            "visible",
                            "zIndex",
                            "preventScrollThrough",
                            "l-style"
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(if (isTruthy(_ctx.destroyOnClose)) {
                        unref(display)
                    } else {
                        unref(inited)
                    }
                    )) {
                        _cE("view", _uM("key" to 1, "class" to _nC(_uA(
                            "l-popup",
                            unref(rootClass)
                        )), "ref_key" to "popupRef", "ref" to popupRef, "style" to _nS(_uA(
                            unref(styles),
                            _ctx.lStyle
                        )), "onTransitionend" to unref(finished)), _uA(
                            renderSlot(_ctx.`$slots`, "default"),
                            if (isTrue(_ctx.closeable)) {
                                _cE("view", _uM("key" to 0, "class" to "l-popup__close", "onClick" to handleClose), _uA(
                                    renderSlot(_ctx.`$slots`, "close-btn", _uO(), fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_icon, _uM("name" to "close", "fontSize" to "20", "size" to "27px", "color" to _ctx.iconColor), null, 8, _uA(
                                                "color"
                                            ))
                                        )
                                    })
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        ), 46, _uA(
                            "onTransitionend"
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                ), 64)
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("l-popup" to _uM("" to _uM("position" to "fixed", "transitionDuration" to "300ms", "transitionProperty" to "transform,opacity", "transitionTimingFunction" to "ease", "backgroundColor" to "var(--l-popup-bg-color, #fff)", "overflow" to "visible", "opacity" to 1), ".l-popup-fade-enter" to _uM("opacity" to 0), ".l-popup-fade-leave-to" to _uM("opacity" to 0), ".l-popup-fade-enter.l-popup--top" to _uM("transform" to "scale(1) translate(0, -100%)"), ".l-popup-fade-leave-to.l-popup--top" to _uM("transform" to "scale(1) translate(0, -100%)"), ".l-popup-fade-enter.l-popup--bottom" to _uM("transform" to "scale(1) translate(0, 100%)"), ".l-popup-fade-leave-to.l-popup--bottom" to _uM("transform" to "scale(1) translate(0, 100%)"), ".l-popup-fade-enter.l-popup--left" to _uM("transform" to "scale(1) translate(-100%, 0)"), ".l-popup-fade-leave-to.l-popup--left" to _uM("transform" to "scale(1) translate(-100%, 0)"), ".l-popup-fade-enter.l-popup--right" to _uM("transform" to "scale(1) translate(100%, 0)"), ".l-popup-fade-leave-to.l-popup--right" to _uM("transform" to "scale(1) translate(100%, 0)"), ".l-popup-fade-enter.l-popup--center" to _uM("transform" to "translate(-50%, -50%) scale(0.6)", "opacity" to 0), ".l-popup-fade-leave-to.l-popup--center" to _uM("transform" to "translate(-50%, -50%) scale(0.6)", "opacity" to 0), ".l-dialog-enter.l-popup--center" to _uM("transform" to "scale(0.6) translate(-50%, -50%)", "opacity" to 0), ".l-dialog-leave-to.l-popup--center" to _uM("transform" to "scale(0.6) translate(-50%, -50%)", "opacity" to 0)), "l-popup__close" to _pS(_uM("position" to "absolute", "top" to 0, "right" to 0, "paddingTop" to 10, "paddingRight" to 10, "paddingBottom" to 10, "paddingLeft" to 10)), "l-popup__close-icon" to _pS(_uM("color" to "var(--l-popup-close-icon-color, #000000A6)")), "l-popup--top" to _pS(_uM("top" to 0, "left" to 0, "right" to 0, "borderBottomLeftRadius" to "var(--l-popup-border-radius, 9px)", "borderBottomRightRadius" to "var(--l-popup-border-radius, 9px)", "transform" to "scale(1) translate(0, 0)")), "l-popup--bottom" to _pS(_uM("bottom" to 0, "left" to 0, "right" to 0, "borderTopLeftRadius" to "var(--l-popup-border-radius, 9px)", "borderTopRightRadius" to "var(--l-popup-border-radius, 9px)", "transform" to "scale(1) translate(0, 0)")), "l-popup--safe-top" to _pS(_uM("paddingTop" to "var(--uni-safe-area-inset-top)")), "l-popup--safe-bottom" to _pS(_uM("paddingBottom" to "var(--uni-safe-area-inset-bottom)")), "l-popup--left" to _pS(_uM("top" to 0, "left" to 0, "bottom" to 0, "transform" to "scale(1) translate(0, 0)")), "l-popup--right" to _pS(_uM("top" to 0, "right" to 0, "bottom" to 0, "transform" to "scale(1) translate(0, 0)")), "l-popup--center" to _pS(_uM("top" to "50%", "left" to "50%", "transform" to "translate(-50%, -50%) scale(1)", "transformOrigin" to "50% 50%", "borderTopLeftRadius" to "var(--l-popup-border-radius, 9px)", "borderTopRightRadius" to "var(--l-popup-border-radius, 9px)", "borderBottomRightRadius" to "var(--l-popup-border-radius, 9px)", "borderBottomLeftRadius" to "var(--l-popup-border-radius, 9px)")), "@TRANSITION" to _uM("l-popup" to _uM("duration" to "300ms", "property" to "transform,opacity", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("change" to null, "click-overlay" to null, "click-close" to null, "open" to null, "opened" to null, "close" to null, "closed" to null, "before-enter" to null, "enter" to null, "after-enter" to null, "before-leave" to null, "leave" to null, "after-leave" to null, "update:modelValue" to null)
        var props = _nP(_uM("closeable" to _uM("type" to "Boolean", "required" to true, "default" to false), "closeOnClickOverlay" to _uM("type" to "Boolean", "required" to true, "default" to true), "destroyOnClose" to _uM("type" to "Boolean", "required" to true, "default" to false), "overlayStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "position" to _uM("type" to "String", "required" to true, "default" to "center"), "preventScrollThrough" to _uM("type" to "Boolean", "required" to true, "default" to true), "overlay" to _uM("type" to "Boolean", "required" to true, "default" to true), "transitionName" to _uM("type" to "String", "required" to false), "visible" to _uM("type" to "Boolean", "required" to false), "zIndex" to _uM("type" to "Number", "required" to true, "default" to 999), "duration" to _uM("type" to "Number", "required" to true, "default" to 300), "bgColor" to _uM("type" to "String", "required" to false), "closeIcon" to _uM("type" to "String", "required" to true, "default" to "close"), "iconColor" to _uM("type" to "String", "required" to false), "lStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "safeAreaInsetBottom" to _uM("type" to "Boolean", "required" to true, "default" to true), "safeAreaInsetTop" to _uM("type" to "Boolean", "required" to true, "default" to false), "radius" to _uM("type" to _uA(
            "String",
            "Number"
        ), "required" to false), "modelValue" to _uM("type" to "Boolean")))
        var propsNeedCastKeys = _uA(
            "closeable",
            "closeOnClickOverlay",
            "destroyOnClose",
            "position",
            "preventScrollThrough",
            "overlay",
            "visible",
            "zIndex",
            "duration",
            "closeIcon",
            "safeAreaInsetBottom",
            "safeAreaInsetTop",
            "modelValue"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
