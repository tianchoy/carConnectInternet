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
open class GenComponentsAppModalAppModal : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsAppModalAppModal) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsAppModalAppModal
            val _cache = __ins.renderCache
            val visible = ref(false)
            val contentNeedsScroll = ref(false)
            val scrollTop = ref(0)
            val options = reactive<AppModalOptions>(AppModalOptions(title = "", content = "", showCancel = true, confirmText = "确定", cancelText = "取消"))
            val show = fun(value: AppModalOptions): Unit {
                options.title = value.title ?: ""
                options.content = value.content ?: ""
                options.showCancel = value.showCancel ?: true
                options.confirmText = value.confirmText ?: "确定"
                options.cancelText = value.cancelText ?: "取消"
                options.success = value.success
                contentNeedsScroll.value = options.content!!.length > 260
                scrollTop.value = 0
                visible.value = true
            }
            val close = fun(confirm: Boolean): Unit {
                val success = options.success
                visible.value = false
                options.success = null
                if (success != null) {
                    val result = AppModalSuccess()
                    result.confirm = confirm
                    result.cancel = !confirm
                    success(result)
                }
            }
            registerAppModalHandler(show)
            onUnmounted(fun(){
                unregisterAppModalHandler(show)
            }
            )
            return fun(): Any? {
                return if (isTrue(visible.value)) {
                    _cE("view", _uM("key" to 0, "class" to "app-modal-mask"), _uA(
                        _cE("view", _uM("class" to "app-modal", "onClick" to withModifiers(fun(){}, _uA(
                            "stop"
                        ))), _uA(
                            if (isTrue(options.title)) {
                                _cE("text", _uM("key" to 0, "class" to "app-modal-title"), _tD(options.title), 1)
                            } else {
                                _cC("v-if", true)
                            },
                            if (isTrue(contentNeedsScroll.value)) {
                                _cE("scroll-view", _uM("key" to 1, "class" to "app-modal-content-scroll", "scroll-y" to "true", "scroll-top" to scrollTop.value, "show-scrollbar" to false), _uA(
                                    _cE("view", _uM("class" to "app-modal-content"), _uA(
                                        _cE("text", _uM("class" to "app-modal-content-text"), _tD(options.content), 1)
                                    ))
                                ), 8, _uA(
                                    "scroll-top"
                                ))
                            } else {
                                _cE("view", _uM("key" to 2, "class" to "app-modal-content"), _uA(
                                    _cE("text", _uM("class" to "app-modal-content-text"), _tD(options.content), 1)
                                ))
                            },
                            _cE("view", _uM("class" to "app-modal-footer"), _uA(
                                if (isTrue(options.showCancel)) {
                                    _cE("view", _uM("key" to 0, "class" to "app-modal-button app-modal-cancel", "onClick" to fun(){
                                        close(false)
                                    }), _uA(
                                        _cE("text", _uM("class" to "app-modal-cancel-text"), _tD(options.cancelText), 1)
                                    ), 8, _uA(
                                        "onClick"
                                    ))
                                } else {
                                    _cC("v-if", true)
                                },
                                _cE("view", _uM("class" to "app-modal-button", "onClick" to fun(){
                                    close(true)
                                }), _uA(
                                    _cE("text", _uM("class" to "app-modal-confirm-text"), _tD(options.confirmText), 1)
                                ), 8, _uA(
                                    "onClick"
                                ))
                            ))
                        ), 8, _uA(
                            "onClick"
                        ))
                    ))
                } else {
                    _cC("v-if", true)
                }
            }
        }
        var name = "app-modal"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("app-modal-mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "display" to "flex", "justifyContent" to "center", "alignItems" to "center", "backgroundColor" to "rgba(0,0,0,0.5)", "zIndex" to 10075)), "app-modal" to _pS(_uM("width" to "640rpx", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "12rpx", "borderTopRightRadius" to "12rpx", "borderBottomRightRadius" to "12rpx", "borderBottomLeftRadius" to "12rpx", "overflow" to "hidden")), "app-modal-title" to _pS(_uM("paddingTop" to "36rpx", "paddingRight" to "44rpx", "paddingBottom" to "16rpx", "paddingLeft" to "44rpx", "color" to "#303133", "fontSize" to "34rpx", "fontWeight" to 600, "lineHeight" to "48rpx", "textAlign" to "center")), "app-modal-content-scroll" to _pS(_uM("height" to "600rpx", "maxHeight" to "600rpx", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minHeight" to 0)), "app-modal-content" to _pS(_uM("paddingTop" to "16rpx", "paddingRight" to "44rpx", "paddingBottom" to "36rpx", "paddingLeft" to "44rpx")), "app-modal-content-text" to _pS(_uM("color" to "#606266", "fontSize" to "28rpx", "lineHeight" to "44rpx", "textAlign" to "left")), "app-modal-footer" to _pS(_uM("display" to "flex", "flexDirection" to "row", "minHeight" to "96rpx", "borderTopWidth" to "1rpx", "borderTopStyle" to "solid", "borderTopColor" to "#f3f4f6")), "app-modal-button" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "justifyContent" to "center", "alignItems" to "center")), "app-modal-cancel" to _pS(_uM("borderRightWidth" to "1rpx", "borderRightStyle" to "solid", "borderRightColor" to "#f3f4f6")), "app-modal-confirm-text" to _pS(_uM("fontSize" to "30rpx", "fontWeight" to 600, "color" to "#2979ff")), "app-modal-cancel-text" to _pS(_uM("fontSize" to "30rpx", "fontWeight" to 600, "color" to "#606266")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
