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
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.switchTab as uni_switchTab
open class GenComponentsCustomNavBarCustomNavBar : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var title: String? by `$props`
    open var showBack: Boolean by `$props`
    open var backText: String by `$props`
    open var showCapsule: Boolean by `$props`
    open var backgroundColor: String by `$props`
    open var textColor: String by `$props`
    open var isIcon: Boolean by `$props`
    open var Icon: String by `$props`
    open var rightText: String by `$props`
    open var isShowStyle: Boolean by `$props`
    open var iconColor: String by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsCustomNavBarCustomNavBar) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsCustomNavBarCustomNavBar
            val _cache = __ins.renderCache
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val statusBarHeight = ref(20)
            val navBarHeight = ref(44)
            val menuButtonInfo = ref(_uO("top" to 4, "right" to 10, "width" to 87, "height" to 32))
            val initDimensions = fun(){
                val systemInfo = uni_getSystemInfoSync()
                statusBarHeight.value = if (systemInfo.statusBarHeight != null) {
                    systemInfo.statusBarHeight
                } else {
                    20
                }
            }
            val handleCapsuleClick = fun(){
                emit("capsuleClick", "menu")
            }
            val handleBack = fun(){
                val pages = getCurrentPages()
                if (pages.length > 1) {
                    uni_navigateBack(null)
                } else {
                    uni_switchTab(SwitchTabOptions(url = "/pages/index/index"))
                }
                emit("back")
            }
            onMounted(initDimensions)
            return fun(): Any? {
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("style" to _nS(if (_ctx.isShowStyle) {
                        _uM("height" to (unref(statusBarHeight) + "px"), "background-color" to "#f1f1f1", "position" to "fixed", "width" to "100%", "letf" to 0, "top" to 0, "z-index" to "100")
                    } else {
                        _uM("height" to (unref(statusBarHeight) + "px"), "background-color" to "#f1f1f1")
                    }
                    )), null, 4),
                    _cE("view", _uM("class" to "navbar", "style" to _nS(if (_ctx.isShowStyle) {
                        _uM("height" to (unref(navBarHeight) + "px"), "background" to _ctx.backgroundColor, "position" to "fixed", "width" to "100%", "letf" to "0", "top" to (unref(statusBarHeight) + "px"), "z-index" to "100")
                    } else {
                        _uM("height" to (unref(navBarHeight) + "px"), "background" to _ctx.backgroundColor)
                    }
                    )), _uA(
                        _cE("view", _uM("class" to "back-btn"), _uA(
                            if (isTrue(_ctx.showBack)) {
                                _cE("image", _uM("key" to 0, "src" to "/static/back.png", "mode" to "aspectFit", "class" to "icon", "onClick" to handleBack))
                            } else {
                                _cC("v-if", true)
                            }
                        )),
                        _cE("text", _uM("class" to "title", "style" to _nS(_uM("color" to _ctx.textColor, "line-height" to (unref(navBarHeight) + "px")))), _uA(
                            renderSlot(_ctx.`$slots`, "title", _uO(), fun(): UTSArray<Any> {
                                return _uA(
                                    _tD(_ctx.title)
                                )
                            }
                            )
                        ), 4),
                        _cE("view", _uM("class" to "capsule", "style" to _nS(_uM("right" to "10rpx"))), _uA(
                            _cE("view", _uM("class" to "capsule-item"), _uA(
                                if (isTrue(_ctx.showCapsule)) {
                                    _cE("view", _uM("key" to 0, "onClick" to handleCapsuleClick), _uA(
                                        if (isTrue(_ctx.isIcon)) {
                                            _cV(_component_i_icon, _uM("key" to 0, "name" to _ctx.Icon, "fontSize" to "20"), null, 8, _uA(
                                                "name"
                                            ))
                                        } else {
                                            _cE("text", _uM("key" to 1), _tD(_ctx.rightText), 1)
                                        }
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        ), 4)
                    ), 4)
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
                return _uM("navbar" to _pS(_uM("position" to "relative", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "back-btn" to _pS(_uM("display" to "flex", "alignItems" to "center", "width" to "70rpx", "height" to "40rpx", "zIndex" to 10, "justifyContent" to "center")), "title" to _pS(_uM("textAlign" to "center", "fontWeight" to "bold", "fontSize" to "36rpx")), "capsule-item" to _pS(_uM("width" to 40, "height" to "100%", "display" to "flex", "justifyContent" to "center", "alignItems" to "center")), "icon" to _pS(_uM("width" to "40rpx", "height" to "40rpx")), "menu-icon" to _pS(_uM("width" to "60rpx", "height" to "60rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("back" to null, "capsuleClick" to null)
        var props = _nP(_uM("title" to _uM("type" to "String"), "showBack" to _uM("type" to "Boolean", "default" to true), "backText" to _uM("type" to "String", "default" to ""), "showCapsule" to _uM("type" to "Boolean", "default" to true), "backgroundColor" to _uM("type" to "String", "default" to "#f1f1f1"), "textColor" to _uM("type" to "String", "default" to "#000000"), "isIcon" to _uM("type" to "Boolean", "default" to true), "Icon" to _uM("type" to "String", "default" to "plus-circle"), "rightText" to _uM("type" to "String", "default" to ""), "isShowStyle" to _uM("type" to "Boolean", "default" to false), "iconColor" to _uM("type" to "String", "default" to "#606266")))
        var propsNeedCastKeys = _uA(
            "showBack",
            "backText",
            "showCapsule",
            "backgroundColor",
            "textColor",
            "isIcon",
            "Icon",
            "rightText",
            "isShowStyle",
            "iconColor"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
