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
open class GenUniModulesLimeOverlayComponentsLOverlayLOverlay : VueComponent, OverlayProps {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    override var ariaLabel: String by `$props`
    override var ariaRole: String by `$props`
    override var lClass: String? by `$props`
    override var bgColor: String? by `$props`
    override var lStyle: Any? by `$props`
    override var duration: Number by `$props`
    override var preventScrollThrough: Boolean by `$props`
    override var visible: Boolean by `$props`
    override var zIndex: Number by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesLimeOverlayComponentsLOverlayLOverlay) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesLimeOverlayComponentsLOverlayLOverlay
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val _useTransition = useTransition(UseTransitionOptions(defaultName = "fade", appear = props.visible, emits = fun(name: TransitionEmitStatus){
                emit(name)
            }
            , visible = fun(): Boolean {
                return props.visible
            }
            , duration = props.duration))
            val inited = _useTransition.inited
            val display = _useTransition.display
            val classes = _useTransition.classes
            val finished = _useTransition.finished
            val styles = computed<Map<String, Any>>(fun(): Map<String, Any> {
                val style = Map<String, Any>()
                if (props.bgColor != null) {
                    style.set("background-color", props.bgColor!!)
                }
                if (props.zIndex > 0) {
                    style.set("z-index", props.zIndex)
                }
                return style
            }
            )
            val noop = fun(){}
            val onClick = fun(event: UniPointerEvent){
                emit("click", !props.visible)
            }
            val overlayRef = ref<UniElement?>(null)
            watchEffect(fun(){
                overlayRef.value?.style?.setProperty("transition-duration", "" + props.duration + "ms")
                if (!display.value) {
                    overlayRef.value?.style?.setProperty("display", "none")
                } else {
                    overlayRef.value?.style?.setProperty("display", "flex")
                }
            }
            )
            return fun(): Any? {
                return if (isTrue(unref(inited))) {
                    _cE("view", _uM("key" to 0, "class" to _nC(_uA(
                        "l-overlay",
                        _uA(
                            _ctx.lClass,
                            unref(classes)
                        )
                    )), "ref_key" to "overlayRef", "ref" to overlayRef, "style" to _nS(_uA(
                        unref(styles),
                        _ctx.lStyle
                    )), "onClick" to withModifiers(onClick, _uA(
                        "stop"
                    )), "onTouchmove" to withModifiers(noop, _uA(
                        "stop"
                    )), "onTransitionend" to unref(finished), "aria-role" to _ctx.ariaRole, "aria-label" to _ctx.ariaLabel), _uA(
                        renderSlot(_ctx.`$slots`, "default")
                    ), 46, _uA(
                        "onTransitionend",
                        "aria-role",
                        "aria-label"
                    ))
                } else {
                    _cC("v-if", true)
                }
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("l-overlay" to _pS(_uM("position" to "fixed", "top" to 0, "left" to 0, "width" to "100%", "bottom" to 0, "backgroundColor" to "var(--l-overlay-bg-color, rgba(0, 0, 0, 0.45))", "transitionProperty" to "opacity", "transitionTimingFunction" to "ease", "zIndex" to "var(--l-overlay-z-index, 998)", "opacity" to 1, "transitionDuration" to "300ms")), "l-fade-enter" to _pS(_uM("opacity" to 0)), "l-fade-leave-to" to _pS(_uM("opacity" to 0)), "@TRANSITION" to _uM("l-overlay" to _uM("property" to "opacity", "timingFunction" to "ease", "duration" to "300ms")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "before-enter" to null, "enter" to null, "after-enter" to null, "before-leave" to null, "leave" to null, "after-leave" to null)
        var props = _nP(_uM("ariaLabel" to _uM("type" to "String", "required" to true, "default" to "关闭"), "ariaRole" to _uM("type" to "String", "required" to true, "default" to "button"), "lClass" to _uM("type" to "String", "required" to false), "bgColor" to _uM("type" to "String", "required" to false), "lStyle" to _uM("type" to _uA(
            "String",
            "UTSJSONObject"
        ), "required" to false), "duration" to _uM("type" to "Number", "required" to true, "default" to 300), "preventScrollThrough" to _uM("type" to "Boolean", "required" to true, "default" to true), "visible" to _uM("type" to "Boolean", "required" to true, "default" to false), "zIndex" to _uM("type" to "Number", "required" to true, "default" to 998)))
        var propsNeedCastKeys = _uA(
            "ariaLabel",
            "ariaRole",
            "duration",
            "preventScrollThrough",
            "visible",
            "zIndex"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
