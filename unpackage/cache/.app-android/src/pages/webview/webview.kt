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
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.setNavigationBarTitle as uni_setNavigationBarTitle
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesWebviewWebview : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesWebviewWebview) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesWebviewWebview
            val _cache = __ins.renderCache
            val webviewUrl = ref("")
            val emptyImage = "/static/empty.png"
            fun gen_extractTitleFromUrl_fn(url: String): String {
                var hostname = url
                val protocolIndex = hostname.indexOf("://")
                if (protocolIndex >= 0) {
                    hostname = hostname.substring(protocolIndex + 3)
                }
                val pathIndex = hostname.indexOf("/")
                if (pathIndex >= 0) {
                    hostname = hostname.substring(0, pathIndex)
                }
                if (hostname.startsWith("www.")) {
                    hostname = hostname.substring(4)
                }
                return hostname
            }
            val extractTitleFromUrl = ::gen_extractTitleFromUrl_fn
            onLoad(fun(options){
                console.log("接收到的参数:", options, " at pages/webview/webview.uvue:42")
                val optionData = options as UTSJSONObject
                val url: String = optionData.getString("url", "") ?: ""
                val pageTitle: String = optionData.getString("title", "") ?: ""
                if (url != "") {
                    var decodedUrl: String = UTSAndroid.consoleDebugError(decodeURIComponent(url), " at pages/webview/webview.uvue:49") ?: ""
                    if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
                        decodedUrl = "https://" + decodedUrl
                    }
                    webviewUrl.value = decodedUrl
                    if (pageTitle != "") {
                        uni_setNavigationBarTitle(SetNavigationBarTitleOptions(title = UTSAndroid.consoleDebugError(decodeURIComponent(pageTitle), " at pages/webview/webview.uvue:61") ?: ""))
                    } else {
                        val extractedTitle = extractTitleFromUrl(decodedUrl)
                        uni_setNavigationBarTitle(SetNavigationBarTitleOptions(title = if (extractedTitle != "") {
                            extractedTitle
                        } else {
                            "网页加载中..."
                        }))
                    }
                } else {
                    uni_showToast(ShowToastOptions(title = "链接地址无效", icon = "none"))
                }
            }
            )
            val handleLoad = fun(e: Any): Unit {
                console.log("网页加载成功", e, " at pages/webview/webview.uvue:79")
                uni_hideLoading(null)
            }
            val handleError = fun(e: Any): Unit {
                console.error("网页加载失败", e, " at pages/webview/webview.uvue:85")
                uni_showToast(ShowToastOptions(title = "页面加载失败", icon = "none"))
            }
            val handleMessage = fun(e: UTSJSONObject): Unit {
                val detail = e.getJSON("detail")
                console.log("接收网页消息:", detail, " at pages/webview/webview.uvue:95")
            }
            val goBack = fun(){
                uni_navigateBack(NavigateBackOptions(delta = 1))
            }
            return fun(): Any? {
                val _component_web_view = resolveComponent("web-view")
                val _component_i_empty = resolveEasyComponent("i-empty", GenUniModulesIUiXComponentsIEmptyIEmptyClass)
                return _cE("view", _uM("class" to "webview-container"), _uA(
                    if (isTrue(webviewUrl.value)) {
                        _cV(_component_web_view, _uM("key" to 0, "src" to webviewUrl.value, "onMessage" to handleMessage, "onLoad" to handleLoad, "onError" to handleError), null, 8, _uA(
                            "src"
                        ))
                    } else {
                        _cE("view", _uM("key" to 1, "class" to "error-page"), _uA(
                            _cV(_component_i_empty, _uM("text" to "页面加载失败", "showButton" to false, "description" to "", "image" to emptyImage)),
                            _cE("button", _uM("class" to "back-btn", "onClick" to goBack), "返回上一页")
                        ))
                    }
                ))
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("webview-container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#f5f5f5")), "error-page" to _uM(".webview-container " to _uM("display" to "flex", "flexDirection" to "column", "justifyContent" to "center", "alignItems" to "center", "height" to "100%", "paddingTop" to "40rpx", "paddingRight" to "40rpx", "paddingBottom" to "40rpx", "paddingLeft" to "40rpx")), "back-btn" to _uM(".webview-container .error-page " to _uM("marginTop" to "60rpx", "width" to "400rpx", "backgroundColor" to "#007aff", "color" to "#ffffff", "borderTopLeftRadius" to "44rpx", "borderTopRightRadius" to "44rpx", "borderBottomRightRadius" to "44rpx", "borderBottomLeftRadius" to "44rpx", "fontSize" to "28rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
