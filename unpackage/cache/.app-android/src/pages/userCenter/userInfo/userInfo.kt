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
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesUserCenterUserInfoUserInfo : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterUserInfoUserInfo) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterUserInfoUserInfo
            val _cache = __ins.renderCache
            val userInfo = ref<UserInfo>(UserInfo(id = "", mobile = "", type = 0, createTime = ""))
            onLoad(fun(options){
                if (isTruthy(options["userInfo"])) {
                    try {
                        val parsedInfo = UTSAndroid.consoleDebugError(JSON.parse(UTSAndroid.consoleDebugError(decodeURIComponent(options["userInfo"]), " at pages/userCenter/userInfo/userInfo.uvue:70")), " at pages/userCenter/userInfo/userInfo.uvue:70") as UTSJSONObject
                        val userId = parsedInfo.getString("userId")
                        val mobile = parsedInfo.getString("mobile")
                        val type = parsedInfo.getNumber("type")
                        val createTime = parsedInfo.getString("createTime")
                        userInfo.value = UserInfo(id = if (userId != null) {
                            userId
                        } else {
                            ""
                        }
                        , mobile = if (mobile != null) {
                            mobile
                        } else {
                            ""
                        }
                        , type = if (type != null) {
                            type
                        } else {
                            0
                        }
                        , createTime = if (createTime != null) {
                            createTime
                        } else {
                            ""
                        }
                        )
                        console.log("用户信息:", userInfo.value, " at pages/userCenter/userInfo/userInfo.uvue:81")
                    }
                     catch (e: Throwable) {
                        console.error("解析用户信息失败:", e, " at pages/userCenter/userInfo/userInfo.uvue:83")
                    }
                }
            }
            )
            val editPassword = fun(){
                uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/editPassword/editPassword"))
            }
            val logoutBtn = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val res = await(logout())
                        if (res.code == 0) {
                            uni_removeStorageSync("token")
                            uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
                        } else {
                            uni_showToast(ShowToastOptions(title = "退出账户失败"))
                        }
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "个人信息", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "content"), _uA(
                        _cE("view", _uM("class" to "title"), " 基本信息 "),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("view", _uM("class" to "item"), _uA(
                                _cE("text", null, "账号"),
                                _cE("view", _uM("class" to "right"), _uA(
                                    _cE("text", _uM("class" to "info"), _tD(unref(userInfo).id), 1)
                                ))
                            )),
                            _cE("view", _uM("class" to "item"), _uA(
                                _cE("text", null, "手机号"),
                                _cE("view", _uM("class" to "right"), _uA(
                                    _cE("text", _uM("class" to "info"), _tD(unref(userInfo).mobile), 1)
                                ))
                            )),
                            _cE("view", _uM("class" to "item"), _uA(
                                _cE("text", null, "类型"),
                                _cE("view", _uM("class" to "right"), _uA(
                                    _cE("text", _uM("class" to "info"), _tD(if (unref(userInfo).type == 1) {
                                        "公司用户"
                                    } else {
                                        "个人用户"
                                    }
                                    ), 1)
                                ))
                            )),
                            _cE("view", _uM("class" to "item"), _uA(
                                _cE("text", null, "创建时间"),
                                _cE("view", _uM("class" to "right"), _uA(
                                    _cE("text", _uM("class" to "info"), _tD(unref(userInfo).createTime), 1)
                                ))
                            ))
                        )),
                        if (unref(userInfo).type == 1) {
                            _cE("view", _uM("key" to 0, "class" to "title"), " 安全信息 ")
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        if (unref(userInfo).type == 1) {
                            _cE("view", _uM("key" to 1, "class" to "list", "onClick" to editPassword), _uA(
                                _cE("view", _uM("class" to "item"), _uA(
                                    _cE("text", null, "修改密码"),
                                    _cV(_component_i_icon, _uM("name" to "/static/arrow-right.png", "fontSize" to "15"))
                                ))
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        _cE("view", _uM("class" to "footer"), _uA(
                            _cE("view", _uM("class" to "logout", "onClick" to logoutBtn), "退出登录")
                        ))
                    ))
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
                return _uM("container" to _pS(_uM("width" to "100%", "backgroundColor" to "#f5f5f5", "position" to "relative")), "content" to _uM(".container " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "120rpx", "paddingLeft" to "20rpx")), "title" to _uM(".container .content " to _uM("color" to "#666666", "fontSize" to "26rpx", "marginTop" to "30rpx", "marginRight" to 0, "marginBottom" to "20rpx", "marginLeft" to 0)), "list" to _uM(".container .content " to _uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx")), "item" to _uM(".container .content .list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#e5e5e5", "borderTopWidth:last-child" to "medium", "borderRightWidth:last-child" to "medium", "borderBottomWidth:last-child" to "medium", "borderLeftWidth:last-child" to "medium", "borderTopStyle:last-child" to "none", "borderRightStyle:last-child" to "none", "borderBottomStyle:last-child" to "none", "borderLeftStyle:last-child" to "none", "borderTopColor:last-child" to "#000000", "borderRightColor:last-child" to "#000000", "borderBottomColor:last-child" to "#000000", "borderLeftColor:last-child" to "#000000")), "right" to _uM(".container .content .list .item " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center")), "info" to _uM(".container .content .list .item .right " to _uM("marginRight" to "10rpx")), "footer" to _uM(".container .content " to _uM("position" to "fixed", "bottom" to "100rpx", "left" to "20rpx", "right" to "20rpx")), "logout" to _uM(".container .content .footer " to _uM("width" to "100%", "height" to "90rpx", "lineHeight" to "90rpx", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#f56c6c", "borderRightColor" to "#f56c6c", "borderBottomColor" to "#f56c6c", "borderLeftColor" to "#f56c6c", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "color" to "#f56c6c", "textAlign" to "center", "backgroundColor" to "#ffffff", "fontSize" to "32rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
