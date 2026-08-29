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
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
open class GenPagesLoginRegister : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginRegister) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginRegister
            val _cache = __ins.renderCache
            val form = ref<RegisterForm>(RegisterForm(password = "", mobile = "", smsCode = ""))
            val agreementAccepted = ref(false)
            val smsCooldown = ref(0)
            val smsSending = ref(false)
            val submitting = ref(false)
            var smsCooldownTimer: Number? = null
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
                if (!UTSRegExp("^\\d{6}\$", "").test(form.value.smsCode)) {
                    showAppToast(ShowToastOptions(title = "请输入6位短信验证码", icon = "none"))
                    return false
                }
                return true
            }
            val isValidPassword = fun(): Boolean {
                val password = form.value.password
                if (password.length < 8 || password.length > 16) {
                    showAppToast(ShowToastOptions(title = "密码长度应为8至16位", icon = "none"))
                    return false
                }
                var categoryCount: Number = 0
                if (UTSRegExp("[0-9]", "").test(password)) {
                    categoryCount += 1
                }
                if (UTSRegExp("[A-Za-z]", "").test(password)) {
                    categoryCount += 1
                }
                if (UTSRegExp("[^A-Za-z0-9]", "").test(password)) {
                    categoryCount += 1
                }
                if (categoryCount < 2) {
                    showAppToast(ShowToastOptions(title = "密码需包含至少两种字符类型", icon = "none"))
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
                if (!isValidMobile()) {
                    return false
                }
                if (!isValidSmsCode()) {
                    return false
                }
                if (form.value.password == "") {
                    showAppToast(ShowToastOptions(title = "请设置登录密码", icon = "none"))
                    return false
                }
                if (!isValidPassword()) {
                    return false
                }
                if (!agreementAccepted.value) {
                    showAppToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "none"))
                    return false
                }
                return true
            }
            val completeLogin = fun(token: String): Unit {
                if (token == "") {
                    showAppToast(ShowToastOptions(title = "注册失败，请重试", icon = "none"))
                    return
                }
                uni_setStorageSync("token", token)
                resetTokenExpiredState()
                showAppToast(ShowToastOptions(title = "注册成功", icon = "success"))
                setTimeout(fun(){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/index/index", success = fun(_){
                        schedulePostLoginInitialization()
                    }
                    ))
                }
                , 500)
            }
            val submitRegister = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (submitting.value || !validateForm()) {
                            return@w1
                        }
                        try {
                            submitting.value = true
                            val response = await(registerPersonalUser(RegisterRequest(password = form.value.password, confirmPassword = form.value.password, phonenumber = form.value.mobile, smsCode = form.value.smsCode)))
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
                                "注册失败，请稍后重试"
                            }
                            , icon = "none"))
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "注册失败，请检查网络后重试", icon = "none"))
                        }
                         finally {
                            submitting.value = false
                        }
                })
            }
            val backToLogin = fun(): Unit {
                uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
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
                val _component_i_checkbox = resolveEasyComponent("i-checkbox", GenUniModulesIUiXComponentsICheckboxICheckboxClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                val _component_app_modal = resolveEasyComponent("app-modal", GenComponentsAppModalAppModalClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "", "show-back" to true, "backgroundColor" to "#fbfcfe", "textColor" to "#333333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE("text", _uM("class" to "page-title"), "注册账号"),
                            _cV(_component_i_input, _uM("modelValue" to form.value.mobile, "onUpdate:modelValue" to fun(`$event`: String){
                                form.value.mobile = `$event`
                            }
                            , "class" to "register-input", "placeholder" to "请输入手机号", "type" to "number", "maxlength" to 11, "round" to "25rpx", "clearable" to "", "height" to "110rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("prefix" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _cE("text", _uM("class" to "country-code"), "+86")
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "modelValue",
                                "onUpdate:modelValue"
                            )),
                            _cV(_component_i_input, _uM("modelValue" to form.value.smsCode, "onUpdate:modelValue" to fun(`$event`: String){
                                form.value.smsCode = `$event`
                            }
                            , "class" to "register-input sms-code-input", "placeholder" to "请输入6位短信验证码", "type" to "number", "maxlength" to 6, "round" to "25rpx", "clearable" to "", "height" to "110rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("suffix" to withSlotCtx(fun(): UTSArray<Any> {
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
                            )),
                            _cV(_component_i_input, _uM("modelValue" to form.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                form.value.password = `$event`
                            }
                            , "class" to "register-input password-input", "placeholder" to "请设置登录密码", "password" to true, "round" to "25rpx", "height" to "110rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                "modelValue",
                                "onUpdate:modelValue"
                            )),
                            _cE("text", _uM("class" to "password-hint"), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
                            _cE("view", _uM("class" to "documents"), _uA(
                                _cV(_component_i_checkbox, _uM("checked" to agreementAccepted.value, "onChange" to toggleAgreement, "size" to "40rpx", "round" to "25rpx", "iconSize" to "28rpx", "activeColor" to "#3485df", "inactiveColor" to "#a9bfd7"), null, 8, _uA(
                                    "checked"
                                )),
                                _cE("view", _uM("class" to "doc-info-box"), _uA(
                                    _cE("text", _uM("class" to "doc-text"), "我已阅读并同意"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoAgreement), "《用户协议》"),
                                    _cE("text", _uM("class" to "doc-text"), "和"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoPrivacy), "《隐私政策》")
                                ))
                            )),
                            _cV(_component_i_button, _uM("class" to "submit-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "loading" to submitting.value, "onClick" to submitRegister), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    " 注册并登录 "
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "loading"
                            )),
                            _cE("view", _uM("class" to "login-link-box", "onClick" to backToLogin), _uA(
                                _cE("text", _uM("class" to "login-link"), "已有账号？去登录")
                            ))
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#fbfcfe")), "content" to _pS(_uM("paddingTop" to "50rpx", "paddingRight" to "32rpx", "paddingBottom" to 0, "paddingLeft" to "32rpx")), "page-title" to _pS(_uM("display" to "flex", "color" to "#1f2d3d", "fontSize" to "54rpx", "fontWeight" to 700, "lineHeight" to "76rpx")), "register-input" to _pS(_uM("width" to "100%", "borderTopLeftRadius" to "25rpx", "borderTopRightRadius" to "25rpx", "borderBottomRightRadius" to "25rpx", "borderBottomLeftRadius" to "25rpx", "marginTop" to "52rpx")), "sms-code-input" to _pS(_uM("marginTop" to "28rpx")), "password-input" to _pS(_uM("marginTop" to "28rpx")), "country-code" to _pS(_uM("color" to "#5d7a9b", "fontSize" to "34rpx", "fontWeight" to 500, "marginRight" to "20rpx")), "sms-send-button" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "height" to "58rpx", "paddingTop" to 0, "paddingRight" to "18rpx", "paddingBottom" to 0, "paddingLeft" to "18rpx", "borderTopLeftRadius" to "29rpx", "borderTopRightRadius" to "29rpx", "borderBottomRightRadius" to "29rpx", "borderBottomLeftRadius" to "29rpx")), "sms-send-button-disabled" to _pS(_uM("opacity" to 0.45)), "sms-send-button-text" to _pS(_uM("color" to "#1878e5", "fontSize" to "30rpx", "fontWeight" to 600, "lineHeight" to "58rpx", "whiteSpace" to "nowrap")), "password-hint" to _pS(_uM("display" to "flex", "marginTop" to "22rpx", "marginRight" to "6rpx", "marginBottom" to 0, "marginLeft" to "6rpx", "color" to "#7f96ae", "fontSize" to "26rpx", "lineHeight" to "40rpx")), "documents" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to "38rpx")), "doc-info-box" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "whiteSpace" to "nowrap")), "doc-text" to _pS(_uM("fontSize" to "30rpx", "lineHeight" to "44rpx", "color" to "#8397ad")), "doc-link" to _pS(_uM("fontSize" to "30rpx", "lineHeight" to "44rpx", "color" to "#1878e5")), "submit-button" to _pS(_uM("marginTop" to "46rpx")), "login-link-box" to _pS(_uM("display" to "flex", "justifyContent" to "center", "marginTop" to "52rpx")), "login-link" to _pS(_uM("color" to "#3485df", "fontSize" to "30rpx", "lineHeight" to "48rpx", "textAlign" to "center")), "i-input" to _pS(_uM("boxSizing" to "border-box")), "i-input__field" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 0)), "i-checkbox" to _pS(_uM("minHeight" to "44rpx")), "i-button__text" to _pS(_uM("fontSize" to "38rpx", "fontWeight" to 600)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
