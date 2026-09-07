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
open class GenUniModulesIUiXComponentsILineProgressILineProgress : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var percent: Number by `$props`
    open var title: String by `$props`
    open var activeColor: String by `$props`
    open var inactiveColor: String by `$props`
    open var height: Number by `$props`
    open var showText: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsILineProgressILineProgress) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsILineProgressILineProgress
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val current = ref(props.percent)
            val normalized = computed(fun(): Number {
                if (current.value < 0) {
                    return 0
                }
                if (current.value > 100) {
                    return 100
                }
                return Math.round(current.value)
            }
            )
            fun gen_step_fn(delta: Number) {
                current.value = Math.min(100, Math.max(0, current.value + delta))
                emit("change", current.value)
                emit("update:percent", current.value)
            }
            val step = ::gen_step_fn
            fun gen_emitClick_fn() {
                emit("click", current.value)
            }
            val emitClick = ::gen_emitClick_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to "i-card", "onClick" to emitClick), _uA(
                    _cE("view", _uM("class" to "i-track", "style" to _nS("height:" + _ctx.height + "px;background-color:" + _ctx.inactiveColor)), _uA(
                        _cE("view", _uM("class" to "i-fill", "style" to _nS("width:" + normalized.value + "%;background-color:" + _ctx.activeColor)), null, 4)
                    ), 4),
                    _cE("view", _uM("class" to "i-row i-head"), _uA(
                        _cE("text", _uM("class" to "i-title"), _tD(_ctx.title), 1),
                        if (isTrue(_ctx.showText)) {
                            _cE("text", _uM("key" to 0, "class" to "i-muted"), _tD(normalized.value) + "%", 1)
                        } else {
                            _cC("v-if", true)
                        }
                    ))
                ))
            }
        }
        var name = "i-line-progress"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-card" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "i-title" to _pS(_uM("color" to "#303133", "fontSize" to 15, "fontWeight" to 600, "lineHeight" to "22px")), "i-muted" to _pS(_uM("color" to "#909399", "fontSize" to 12, "lineHeight" to "18px")), "i-row" to _pS(_uM("flexDirection" to "row", "alignItems" to "center", "flexWrap" to "wrap")), "i-btn" to _pS(_uM("minHeight" to 34, "marginTop" to 10, "marginRight" to 8, "paddingTop" to 0, "paddingRight" to 12, "paddingBottom" to 0, "paddingLeft" to 12, "borderTopLeftRadius" to 6, "borderTopRightRadius" to 6, "borderBottomRightRadius" to 6, "borderBottomLeftRadius" to 6, "backgroundColor" to "#ecf5ff", "alignItems" to "center", "justifyContent" to "center")), "i-btn--plain" to _pS(_uM("backgroundColor" to "#f5f7fa")), "i-btn--danger" to _pS(_uM("backgroundColor" to "#fef0f0")), "i-btn-text" to _pS(_uM("color" to "#2979ff", "fontSize" to 13, "lineHeight" to "18px")), "i-danger" to _pS(_uM("color" to "#f56c6c")), "i-head" to _pS(_uM("justifyContent" to "space-between")), "i-track" to _pS(_uM("borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999, "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "marginRight" to 5, "overflow" to "hidden")), "i-fill" to _pS(_uM("height" to "100%", "borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "change" to null, "update:percent" to null)
        var props = _nP(_uM("percent" to _uM("type" to "Number", "default" to 45), "title" to _uM("type" to "String", "default" to ""), "activeColor" to _uM("type" to "String", "default" to "#19be6b"), "inactiveColor" to _uM("type" to "String", "default" to "#ebeef5"), "height" to _uM("type" to "Number", "default" to 8), "showText" to _uM("type" to "Boolean", "default" to true)))
        var propsNeedCastKeys = _uA(
            "percent",
            "title",
            "activeColor",
            "inactiveColor",
            "height",
            "showText"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
