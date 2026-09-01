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
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
open class GenPagesLoginPersonalPasswordLogin : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginPersonalPasswordLogin) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginPersonalPasswordLogin
            val _cache = __ins.renderCache
            val form = ref<PersonalLoginForm__1>(PersonalLoginForm__1(username = "", password = ""))
            val agreementAccepted = ref(false)
            val submitting = ref(false)
            val isLoginReady = computed<Boolean>(fun(): Boolean {
                return form.value.username != "" && form.value.password != ""
            }
            )
            val rules = _uA<UTSJSONObject>(_uO("name" to "username", "required" to true, "message" to "请输入账号"), _uO("name" to "password", "required" to true, "message" to "请输入密码"))
            val toggleAgreement = fun(): Unit {
                agreementAccepted.value = !agreementAccepted.value
            }
            val validateForm = fun(): Boolean {
                if (form.value.username.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入账号", icon = "none"))
                    return false
                }
                if (form.value.password.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入密码", icon = "none"))
                    return false
                }
                if (!agreementAccepted.value) {
                    showAppToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "none"))
                    return false
                }
                return true
            }
            val completeLogin = fun(token: String): Unit {
                uni_setStorageSync("token", token)
                resetTokenExpiredState()
                showAppToast(ShowToastOptions(title = "登录成功", icon = "success"))
                setTimeout(fun(){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/index/index", success = fun(_){
                        schedulePostLoginInitialization()
                    }
                    ))
                }
                , 500)
            }
            val submitLogin = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (submitting.value || !validateForm()) {
                            return@w1
                        }
                        try {
                            submitting.value = true
                            val response = await(personalPasswordLogin(PersonalPasswordLoginRequest(username = form.value.username, password = form.value.password)))
                            val token = if (response.data != null) {
                                response.data.getString("access_token", "")
                            } else {
                                ""
                            }
                            if (response.code == 200 && token != "") {
                                completeLogin(token)
                                return@w1
                            }
                            showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                response.msg
                            } else {
                                "登录失败，请检查账号和密码"
                            }
                            , icon = "none"))
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "登录失败，请检查网络后重试", icon = "none"))
                        }
                         finally {
                            submitting.value = false
                        }
                })
            }
            val goRegister = fun(): Unit {
                uni_navigateTo(NavigateToOptions(url = "/pages/login/register"))
            }
            val backToLogin = fun(): Unit {
                uni_navigateBack(NavigateBackOptions(fail = fun(_){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
                }
                ))
            }
            val gotoAgreement = fun(): Unit {
                showAppModal(AppModalOptions(title = "用户协议", content = userAgreement, showCancel = false))
            }
            val gotoPrivacy = fun(): Unit {
                showAppModal(AppModalOptions(title = "隐私政策", content = privacyPolicy, showCancel = false))
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_form_item = resolveEasyComponent("i-form-item", GenUniModulesIUiXComponentsIFormItemIFormItemClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_form = resolveEasyComponent("i-form", GenUniModulesIUiXComponentsIFormIFormClass)
                val _component_i_checkbox = resolveEasyComponent("i-checkbox", GenUniModulesIUiXComponentsICheckboxICheckboxClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                val _component_app_modal = resolveEasyComponent("app-modal", GenComponentsAppModalAppModalClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "个人账号登录", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "banner"), _uA(
                            _cE("image", _uM("src" to "/static/car_location.png", "class" to "banner-image", "mode" to "aspectFill")),
                            _cE("text", _uM("class" to "title"), "车联网")
                        )),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cV(_component_i_form, _uM("modelValue" to form.value, "rules" to rules, "labelDirection" to "horizontal", "watchValidStatus" to ""), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _cV(_component_i_form_item, _uM("name" to "username", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_input, _uM("modelValue" to form.value.username, "onUpdate:modelValue" to fun(`$event`: String){
                                                form.value.username = `$event`
                                            }
                                            , "placeholder" to "请输入账号", "clearable" to ""), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue"
                                            ))
                                        )
                                    }
                                    ), "_" to 1)),
                                    _cV(_component_i_form_item, _uM("name" to "password", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_input, _uM("modelValue" to form.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                                form.value.password = `$event`
                                            }
                                            , "placeholder" to "请输入密码", "type" to "password", "password" to true), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue"
                                            ))
                                        )
                                    }
                                    ), "_" to 1)),
                                    _cV(_component_i_button, _uM("type" to "primary", "onClick" to submitLogin, "loading" to submitting.value, "disabled" to (!isLoginReady.value || submitting.value)), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            "登录"
                                        )
                                    }
                                    ), "_" to 1), 8, _uA(
                                        "loading",
                                        "disabled"
                                    ))
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "modelValue"
                            )),
                            _cE("view", _uM("class" to "documents"), _uA(
                                _cV(_component_i_checkbox, _uM("checked" to agreementAccepted.value, "onChange" to toggleAgreement), null, 8, _uA(
                                    "checked"
                                )),
                                _cE("view", _uM("class" to "doc-info-box"), _uA(
                                    _cE("text", _uM("class" to "doc-text"), "已阅读并同意"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoAgreement), "《用户协议》"),
                                    _cE("text", _uM("class" to "doc-text"), "和"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoPrivacy), "《隐私政策》")
                                ))
                            ))
                        )),
                        _cE("view", _uM("class" to "page-actions"), _uA(
                            _cE("text", _uM("class" to "action-link", "onClick" to goRegister), "立即注册"),
                            _cE("text", _uM("class" to "action-divider"), "|"),
                            _cE("text", _uM("class" to "action-link", "onClick" to backToLogin), "返回其他登录方式")
                        ))
                    )),
                    _cV(_component_app_toast),
                    _cV(_component_app_modal)
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#ffffff")), "banner" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "height" to "260rpx", "backgroundColor" to "#ffffff")), "banner-image" to _pS(_uM("width" to "180rpx", "height" to "180rpx")), "title" to _pS(_uM("fontSize" to "40rpx", "fontWeight" to "bold", "color" to "#333333")), "content" to _pS(_uM("paddingTop" to "20rpx", "paddingRight" to "70rpx", "paddingBottom" to "20rpx", "paddingLeft" to "70rpx")), "documents" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to "40rpx")), "doc-info-box" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "whiteSpace" to "nowrap")), "doc-link" to _pS(_uM("color" to "#007AFF", "fontSize" to "28rpx")), "doc-text" to _pS(_uM("fontSize" to "28rpx")), "page-actions" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "marginTop" to "40rpx")), "action-link" to _pS(_uM("fontSize" to "26rpx", "color" to "#8b8c8d")), "action-divider" to _pS(_uM("marginTop" to 0, "marginRight" to "28rpx", "marginBottom" to 0, "marginLeft" to "28rpx", "color" to "#d9d9d9")), "i-form-item" to _pS(_uM("paddingTop" to 12, "paddingRight" to 0, "paddingBottom" to 12, "paddingLeft" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
