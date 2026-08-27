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
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
open class GenPagesLoginRegister : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginRegister) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginRegister
            val _cache = __ins.renderCache
            val form = ref<RegisterForm>(RegisterForm(username = "", password = "", confirmPassword = "", mobile = "", smsCode = ""))
            val agreementAccepted = ref(false)
            val smsCooldown = ref(0)
            val smsSending = ref(false)
            val submitting = ref(false)
            var smsCooldownTimer: Number? = null
            val hasPasswordMismatch = computed<Boolean>(fun(): Boolean {
                return form.value.password != "" && form.value.confirmPassword != "" && form.value.password != form.value.confirmPassword
            }
            )
            val isRegisterReady = computed<Boolean>(fun(): Boolean {
                return form.value.username != "" && form.value.password != "" && form.value.confirmPassword != "" && form.value.mobile != "" && form.value.smsCode != ""
            }
            )
            val rules = _uA<UTSJSONObject>(_uO("name" to "username", "required" to true, "message" to "请输入账号"), _uO("name" to "password", "required" to true, "message" to "请输入密码"), _uO("name" to "confirmPassword", "required" to true, "message" to "请再次输入密码"), _uO("name" to "mobile", "required" to true, "message" to "请输入手机号"), _uO("name" to "smsCode", "required" to true, "message" to "请输入验证码"))
            val toggleAgreement = fun(): Unit {
                agreementAccepted.value = !agreementAccepted.value
            }
            val isValidMobile = fun(): Boolean {
                if (!UTSRegExp("^1[3-9]\\d{9}\$", "").test(form.value.mobile)) {
                    showAppToast(ShowToastOptions(title = "请输入正确的手机号", icon = "none"))
                    return false
                }
                return true
            }
            val isValidSmsCode = fun(): Boolean {
                if (!UTSRegExp("^\\d{4}\$", "").test(form.value.smsCode)) {
                    showAppToast(ShowToastOptions(title = "请输入4位验证码", icon = "none"))
                    return false
                }
                return true
            }
            val stopSmsCooldown = fun(): Unit {
                val timer = smsCooldownTimer
                if (timer != null) {
                    clearInterval(timer)
                    smsCooldownTimer = null
                }
            }
            val startSmsCooldown = fun(): Unit {
                stopSmsCooldown()
                smsCooldown.value = 60
                smsCooldownTimer = setInterval(fun(){
                    smsCooldown.value -= 1
                    if (smsCooldown.value <= 0) {
                        smsCooldown.value = 0
                        stopSmsCooldown()
                    }
                }
                , 1000) as Number
            }
            val requestSmsCode = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (smsCooldown.value > 0 || smsSending.value) {
                            return@w1
                        }
                        if (form.value.mobile.length == 0) {
                            showAppToast(ShowToastOptions(title = "请输入手机号", icon = "none"))
                            return@w1
                        }
                        if (!isValidMobile()) {
                            return@w1
                        }
                        try {
                            smsSending.value = true
                            val response = await(sendSmsRegisterCode(SendSmsCodeRequest(phonenumber = form.value.mobile)))
                            if (response.code != 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "验证码发送失败"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            startSmsCooldown()
                            showAppToast(ShowToastOptions(title = "验证码已发送", icon = "success"))
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "验证码发送失败，请检查网络", icon = "none"))
                        }
                         finally {
                            smsSending.value = false
                        }
                })
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
                if (form.value.confirmPassword.length == 0) {
                    showAppToast(ShowToastOptions(title = "请再次输入密码", icon = "none"))
                    return false
                }
                if (form.value.password != form.value.confirmPassword) {
                    showAppToast(ShowToastOptions(title = "两次输入的密码不一致", icon = "none"))
                    return false
                }
                if (form.value.mobile.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入手机号", icon = "none"))
                    return false
                }
                if (!isValidMobile()) {
                    return false
                }
                if (form.value.smsCode.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入验证码", icon = "none"))
                    return false
                }
                if (!isValidSmsCode()) {
                    return false
                }
                if (!agreementAccepted.value) {
                    showAppToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "none"))
                    return false
                }
                return true
            }
            val submitRegister = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (submitting.value || !validateForm()) {
                            return@w1
                        }
                        try {
                            submitting.value = true
                            val response = await(registerPersonalUser(RegisterRequest(username = form.value.username, password = form.value.password, confirmPassword = form.value.confirmPassword, phonenumber = form.value.mobile, smsCode = form.value.smsCode)))
                            if (response.code != 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "注册失败，请稍后重试"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                response.msg
                            } else {
                                "注册成功，请登录"
                            }
                            , icon = "success"))
                            setTimeout(fun(){
                                uni_navigateBack(NavigateBackOptions(fail = fun(_){
                                    uni_reLaunch(ReLaunchOptions(url = "/pages/login/personal-password-login"))
                                }
                                ))
                            }
                            , 500)
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "注册失败，请检查网络后重试", icon = "none"))
                        }
                         finally {
                            submitting.value = false
                        }
                })
            }
            val backToPersonalLogin = fun(): Unit {
                uni_navigateBack(NavigateBackOptions(fail = fun(_){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/login/personal-password-login"))
                }
                ))
            }
            val gotoAgreement = fun(): Unit {
                showAppModal(AppModalOptions(title = "用户协议", content = userAgreement, showCancel = false))
            }
            val gotoPrivacy = fun(): Unit {
                showAppModal(AppModalOptions(title = "隐私政策", content = privacyPolicy, showCancel = false))
            }
            onUnmounted(fun(){
                stopSmsCooldown()
            }
            )
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
                        _cV(_component_custom_navBar, _uM("title" to "个人用户注册", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
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
                                    _cV(_component_i_form_item, _uM("name" to "confirmPassword", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_input, _uM("modelValue" to form.value.confirmPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                                form.value.confirmPassword = `$event`
                                            }
                                            , "placeholder" to "请再次输入密码", "type" to "password", "password" to true), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue"
                                            )),
                                            if (isTrue(hasPasswordMismatch.value)) {
                                                _cE("text", _uM("key" to 0, "class" to "password-mismatch-tip"), "两次输入的密码不一致")
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        )
                                    }
                                    ), "_" to 1)),
                                    _cV(_component_i_form_item, _uM("name" to "mobile", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_input, _uM("modelValue" to form.value.mobile, "onUpdate:modelValue" to fun(`$event`: String){
                                                form.value.mobile = `$event`
                                            }
                                            , "placeholder" to "请输入手机号", "type" to "number", "maxlength" to 11, "clearable" to ""), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue"
                                            ))
                                        )
                                    }
                                    ), "_" to 1)),
                                    _cV(_component_i_form_item, _uM("name" to "smsCode", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cV(_component_i_input, _uM("class" to "sms-code-input", "modelValue" to form.value.smsCode, "onUpdate:modelValue" to fun(`$event`: String){
                                                form.value.smsCode = `$event`
                                            }
                                            , "placeholder" to "请输入4位验证码", "type" to "number", "maxlength" to 4, "clearable" to ""), _uM("suffix" to withSlotCtx(fun(): UTSArray<Any> {
                                                return _uA(
                                                    _cE("view", _uM("class" to _nC(_uA(
                                                        "sms-send-button",
                                                        _uM("sms-send-button-disabled" to (smsCooldown.value > 0 || smsSending.value))
                                                    )), "onClick" to requestSmsCode), _uA(
                                                        _cE("text", _uM("class" to "sms-send-button-text"), _tD(if (smsCooldown.value > 0) {
                                                            smsCooldown.value + "秒后重试"
                                                        } else {
                                                            "获取验证码"
                                                        }
                                                        ), 1)
                                                    ), 2)
                                                )
                                            }
                                            ), "_" to 1), 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue"
                                            ))
                                        )
                                    }
                                    ), "_" to 1)),
                                    _cV(_component_i_button, _uM("type" to "primary", "onClick" to submitRegister, "loading" to submitting.value, "disabled" to (!isRegisterReady.value || submitting.value)), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            "注册"
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
                        _cE("view", _uM("class" to "login-link-box"), _uA(
                            _cE("text", _uM("class" to "login-link", "onClick" to backToPersonalLogin), "已有账号？去登录")
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#ffffff")), "content" to _pS(_uM("paddingTop" to "50rpx", "paddingRight" to "70rpx", "paddingBottom" to "20rpx", "paddingLeft" to "70rpx")), "sms-code-input" to _pS(_uM("width" to "100%")), "password-mismatch-tip" to _pS(_uM("display" to "flex", "marginTop" to "8rpx", "color" to "#f56c6c", "fontSize" to "24rpx")), "sms-send-button" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "height" to "56rpx", "paddingTop" to 0, "paddingRight" to "20rpx", "paddingBottom" to 0, "paddingLeft" to "20rpx", "borderTopLeftRadius" to "28rpx", "borderTopRightRadius" to "28rpx", "borderBottomRightRadius" to "28rpx", "borderBottomLeftRadius" to "28rpx", "backgroundColor" to "#007AFF")), "sms-send-button-disabled" to _pS(_uM("backgroundColor" to "#B8D7FF")), "sms-send-button-text" to _pS(_uM("color" to "#ffffff", "fontSize" to "24rpx", "lineHeight" to "56rpx", "whiteSpace" to "nowrap")), "documents" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to "40rpx")), "doc-info-box" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "whiteSpace" to "nowrap")), "doc-link" to _pS(_uM("color" to "#007AFF", "fontSize" to "28rpx")), "doc-text" to _pS(_uM("fontSize" to "28rpx")), "login-link-box" to _pS(_uM("display" to "flex", "justifyContent" to "center", "marginTop" to "40rpx")), "login-link" to _pS(_uM("fontSize" to "26rpx", "color" to "#8b8c8d", "textAlign" to "center")), "i-form-item" to _pS(_uM("paddingTop" to 12, "paddingRight" to 0, "paddingBottom" to 12, "paddingLeft" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
