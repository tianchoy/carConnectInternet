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
import io.dcloud.uniapp.extapi.getStorageSync as uni_getStorageSync
import io.dcloud.uniapp.extapi.getSystemInfoSync as uni_getSystemInfoSync
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
open class GenPagesUserCenterUserCenter : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterUserCenter) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterUserCenter
            val _cache = __ins.renderCache
            val userInfo = ref(_uO("avatar" to "/static/avatar.png", "nickname" to ""))
            val carsnumber = ref(0)
            val Login = ref(false)
            val version = ref("")
            val moveX = ref(0)
            val moveY = ref(0)
            val windowWidth = ref(0)
            val windowHeight = ref(0)
            val buttonWidth: Number = 120
            val buttonHeight: Number = 200
            val loadData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val params: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("params", "pages/userCenter/userCenter.uvue", 70, 9))
                        val res = await(getUserInfo())
                        userInfo.value = _uO("avatar" to res.data.getString("avatar", "/static/avatar.png"), "nickname" to res.data.getString("nickname", ""))
                        val resCars = await(getUserDeviceList(params))
                        carsnumber.value = resCars.data.totalCount
                })
            }
            onShow(fun(){
                val systemInfo = uni_getSystemInfoSync()
                windowWidth.value = systemInfo.windowWidth
                windowHeight.value = systemInfo.windowHeight
                moveX.value = windowWidth.value - buttonWidth - 20
                moveY.value = windowHeight.value - buttonHeight - 20
                val token = uni_getStorageSync("token")
                if (isTruthy(token)) {
                    Login.value = true
                    loadData()
                } else {
                    Login.value = false
                }
            }
            )
            val contactCustomerService = fun(){
                showAppToast(ShowToastOptions(title = "请在微信小程序中联系人工客服", icon = "none"))
            }
            val onMoveChange = fun(e: UTSJSONObject){
                val detail = e.getJSON("detail")
                val x = if (detail != null) {
                    detail.getNumber("x", 0)
                } else {
                    0
                }
                val y = if (detail != null) {
                    detail.getNumber("y", 0)
                } else {
                    0
                }
                val maxX = windowWidth.value - buttonWidth
                val maxY = windowHeight.value - buttonHeight
                if (x < 0 || x > maxX || y < 0 || y > maxY) {
                    moveX.value = Math.max(0, Math.min(maxX, x))
                    moveY.value = Math.max(0, Math.min(maxY, y))
                }
            }
            val userInfoDetail = fun(){
                if (Login.value) {
                    uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/userInfo/userInfo?userInfo=" + UTSAndroid.consoleDebugError(encodeURIComponent(JSON.stringify(userInfo.value)), " at pages/userCenter/userCenter.uvue:146")))
                } else {
                    uni_navigateTo(NavigateToOptions(url = "/pages/login/login"))
                }
            }
            val carList = fun(){
                if (Login.value) {
                    uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/carList/carList"))
                } else {
                    showAppToast(ShowToastOptions(title = "请先登录", icon = "none"))
                }
            }
            val platformRenewal = fun(){
                if (Login.value) {
                    uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/payDeviceList/payDeviceList"))
                } else {
                    showAppToast(ShowToastOptions(title = "请先登录", icon = "none"))
                }
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                val _component_i_badge = resolveEasyComponent("i-badge", GenUniModulesIUiXComponentsIBadgeIBadgeClass)
                val _component_movable_view = resolveComponent("movable-view")
                val _component_movable_area = resolveComponent("movable-area")
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "个人中心", "show-back" to false, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "user-info-box", "onClick" to userInfoDetail), _uA(
                            _cE("view", _uM("class" to "userinfo"), _uA(
                                _cE("view", null, _uA(
                                    _cV(_component_i_icon, _uM("name" to "/static/avatar.png", "fontSize" to "40"))
                                )),
                                _cE("view", _uM("class" to "user-info"), _uA(
                                    if (isTrue(unref(Login))) {
                                        _cE("text", _uM("key" to 0), _tD(unref(userInfo)["mobile"]), 1)
                                    } else {
                                        _cE("text", _uM("key" to 1), "点击登录")
                                    }
                                ))
                            )),
                            _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                        )),
                        if (isTrue(unref(Login))) {
                            _cE("view", _uM("key" to 0), _uA(
                                _cE("view", _uM("class" to "list", "onClick" to carList), _uA(
                                    _cE("view", _uM("class" to "left"), _uA(
                                        _cE("text", null, "我的车辆"),
                                        _cE("text", _uM("class" to "badge"), _uA(
                                            _cV(_component_i_badge, _uM("type" to "danger", "maxCount" to "99", "count" to unref(carsnumber)), null, 8, _uA(
                                                "count"
                                            ))
                                        ))
                                    )),
                                    _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                )),
                                _cE("view", _uM("class" to "list", "onClick" to platformRenewal), "平台续费")
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        if (isTrue(unref(version))) {
                            _cE("view", _uM("key" to 1, "class" to "version"), "当前版本：" + _tD(unref(version)), 1)
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        _cV(_component_movable_area, _uM("class" to "movable-area"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_movable_view, _uM("class" to "movable-view", "direction" to "all", "x" to unref(moveX), "y" to unref(moveY), "onChange" to onMoveChange), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cE("view", _uM("class" to "contact-button-movable", "onClick" to contactCustomerService), _uA(
                                            _cV(_component_i_icon, _uM("name" to "/static/server-man.png", "fontSize" to "20")),
                                            _cE("text", _uM("class" to "contact-text"), "人工客服"),
                                            _cE("text", _uM("class" to "contact-text"), "08:00-24:00")
                                        ))
                                    )
                                }
                                ), "_" to 1), 8, _uA(
                                    "x",
                                    "y"
                                ))
                            )
                        }
                        ), "_" to 1))
                    )),
                    _cV(_component_app_toast)
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
                return _uM("container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#ffffff", "position" to "relative")), "user-info-box" to _uM(".container " to _uM("width" to "100%", "paddingTop" to "40rpx", "paddingRight" to "60rpx", "paddingBottom" to "40rpx", "paddingLeft" to "60rpx", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "userinfo" to _uM(".container .user-info-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "user-info" to _uM(".container .user-info-box " to _uM("marginLeft" to "20rpx", "textAlign" to "center", "fontSize" to "30rpx", "color" to "#333333")), "list" to _uM(".container " to _uM("backgroundColor" to "#f5f5f5", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "marginTop" to "15rpx", "marginRight" to "15rpx", "marginBottom" to "15rpx", "marginLeft" to "15rpx", "display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "fontSize" to "25rpx")), "left" to _uM(".container .list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "badge" to _uM(".container .list .left " to _uM("marginLeft" to "20rpx")), "version" to _uM(".container " to _uM("position" to "fixed", "bottom" to "50rpx", "left" to "20rpx", "right" to "20rpx", "textAlign" to "center", "fontSize" to "25rpx", "color" to "#c3c2c2ff", "marginTop" to "20rpx", "marginRight" to "40rpx", "marginBottom" to 0, "marginLeft" to "40rpx")), "movable-area" to _uM(".container " to _uM("position" to "fixed", "top" to 0, "left" to 0, "right" to 0, "bottom" to 0, "width" to "100%", "height" to "100%", "pointerEvents" to "none", "zIndex" to 999)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
