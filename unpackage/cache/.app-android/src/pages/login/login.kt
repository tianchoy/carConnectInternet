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
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
open class GenPagesLoginLogin : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginLogin) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginLogin
            val _cache = __ins.renderCache
            val docState = ref(false)
            val pswLogin = ref(false)
            val enterpriseForm = ref<EnterpriseLoginForm>(EnterpriseLoginForm(username = "", password = ""))
            val rememberPassword = ref(false)
            val enterpriseSubmitting = ref(false)
            val smsLoginMode = ref(false)
            val personalForm = ref<PersonalLoginForm>(PersonalLoginForm(username = "", password = ""))
            val personalSubmitting = ref(false)
            val smsMobile = ref("")
            val smsCode = ref("")
            val smsCooldown = ref(0)
            val smsSending = ref(false)
            val smsSubmitting = ref(false)
            var smsCooldownTimer: Number? = null
            val nativeLoginLoading = ref(false)
            val isPersonalPasswordLoginReady = computed<Boolean>(fun(): Boolean {
                return personalForm.value.username != "" && personalForm.value.password != ""
            }
            )
            val isSmsLoginReady = computed<Boolean>(fun(): Boolean {
                return UTSRegExp("^1[3-9]\\d{9}\$", "").test(smsMobile.value) && UTSRegExp("^\\d{6}\$", "").test(smsCode.value)
            }
            )
            val isLoginSubmitReady = computed<Boolean>(fun(): Boolean {
                val isFormReady = if (smsLoginMode.value) {
                    isSmsLoginReady.value
                } else {
                    isPersonalPasswordLoginReady.value
                }
                val isSubmitting = if (smsLoginMode.value) {
                    smsSubmitting.value
                } else {
                    personalSubmitting.value
                }
                return isFormReady && docState.value && !isSubmitting
            }
            )
            val isDocState = fun(): Unit {
                docState.value = !docState.value
            }
            val completeLogin = fun(token: String): Unit {
                if (token == "") {
                    showAppToast(ShowToastOptions(title = "登录失败，请重试", icon = "none"))
                    return
                }
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
            val ensureAgreementAccepted = fun(): Boolean {
                if (docState.value) {
                    return true
                }
                showAppToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "error"))
                return false
            }
            val validatePersonalPasswordLogin = fun(): Boolean {
                if (personalForm.value.username.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入账号或手机号", icon = "none"))
                    return false
                }
                if (personalForm.value.password.length == 0) {
                    showAppToast(ShowToastOptions(title = "请输入登录密码", icon = "none"))
                    return false
                }
                return ensureAgreementAccepted()
            }
            val submitPersonalPasswordLogin = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (personalSubmitting.value || !validatePersonalPasswordLogin()) {
                            return@w1
                        }
                        try {
                            personalSubmitting.value = true
                            val response = await(personalPasswordLogin(PersonalPasswordLoginRequest(username = personalForm.value.username, password = personalForm.value.password)))
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
                            personalSubmitting.value = false
                        }
                })
            }
            fun gen_stopSmsCooldown_fn(): Unit {
                val timer = smsCooldownTimer
                if (timer != null) {
                    clearInterval(timer)
                    smsCooldownTimer = null
                }
            }
            val stopSmsCooldown = ::gen_stopSmsCooldown_fn
            val goRegister = fun(): Unit {
                uni_navigateTo(NavigateToOptions(url = "/pages/login/register"))
            }
            val goForgotPassword = fun(): Unit {
                uni_navigateTo(NavigateToOptions(url = "/pages/login/forgot-password"))
            }
            val isValidMobile = fun(): Boolean {
                if (!UTSRegExp("^1[3-9]\\d{9}\$", "").test(smsMobile.value)) {
                    showAppToast(ShowToastOptions(title = "请输入正确的手机号", icon = "none"))
                    return false
                }
                return true
            }
            val isValidSmsCode = fun(): Boolean {
                if (!UTSRegExp("^\\d{6}\$", "").test(smsCode.value)) {
                    showAppToast(ShowToastOptions(title = "请输入6位短信验证码", icon = "none"))
                    return false
                }
                return true
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
            val sendSmsCode = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (smsCooldown.value > 0 || smsSending.value) {
                            return@w1
                        }
                        if (!ensureAgreementAccepted() || !isValidMobile()) {
                            return@w1
                        }
                        try {
                            smsSending.value = true
                            val response = await(sendSmsLoginCode(SendSmsCodeRequest(phonenumber = smsMobile.value)))
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
            fun gen_submitSmsLogin_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (smsSubmitting.value) {
                            return@w1
                        }
                        if (!ensureAgreementAccepted() || !isValidMobile() || !isValidSmsCode()) {
                            return@w1
                        }
                        try {
                            smsSubmitting.value = true
                            val response = await(smsLogin(SmsLoginRequest(phonenumber = smsMobile.value, smsCode = smsCode.value)))
                            val token = if (response.data != null) {
                                response.data.getString("access_token", "")
                            } else {
                                ""
                            }
                            if (response.code == 200 && token != "") {
                                smsCode.value = ""
                                completeLogin(token)
                                return@w1
                            }
                            if (response.msg.indexOf("NEED_REGISTER:") == 0 || response.msg.indexOf("NEED_SET_PASSWORD:") == 0) {
                                saveSmsRegisterContext(smsMobile.value, smsCode.value)
                                uni_navigateTo(NavigateToOptions(url = "/pages/login/set-password"))
                                return@w1
                            }
                            showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                response.msg
                            } else {
                                "验证码登录失败"
                            }
                            , icon = "none"))
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "验证码登录失败，请检查网络", icon = "none"))
                        }
                         finally {
                            smsSubmitting.value = false
                        }
                })
            }
            val submitSmsLogin = ::gen_submitSmsLogin_fn
            val submitLogin = fun(): Unit {
                if (smsLoginMode.value) {
                    submitSmsLogin()
                    return
                }
                submitPersonalPasswordLogin()
            }
            val toggleLoginMode = fun(): Unit {
                smsLoginMode.value = !smsLoginMode.value
                if (!smsLoginMode.value) {
                    smsCode.value = ""
                    stopSmsCooldown()
                    smsCooldown.value = 0
                }
            }
            val gotoAgreement = fun(): Unit {
                showAppModal(AppModalOptions(title = "用户协议", content = userAgreement, showCancel = false))
            }
            val gotoPrivacy = fun(): Unit {
                showAppModal(AppModalOptions(title = "隐私政策", content = privacyPolicy, showCancel = false))
            }
            onMounted(fun(){
                prefetchUniVerify()
            }
            )
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
                        _cV(_component_custom_navBar, _uM("title" to "", "show-back" to false, "backgroundColor" to "#ffffff", "textColor" to "#333333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "banner"), _uA(
                            _cE("image", _uM("src" to "/static/car_location.png", "class" to "banner-image", "mode" to "aspectFill")),
                            _cE("text", _uM("class" to "title"), "中导物联")
                        )),
                        _cE("view", _uM("class" to "content"), _uA(
                            if (isTrue(!smsLoginMode.value)) {
                                _cE("view", _uM("key" to 0, "class" to "login-form"), _uA(
                                    _cV(_component_i_input, _uM("modelValue" to personalForm.value.username, "onUpdate:modelValue" to fun(`$event`: String){
                                        personalForm.value.username = `$event`
                                    }, "class" to "login-input", "placeholder" to "请输入账号或手机号", "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d9e5f2", "placeholderStyle" to "color:#a7b8cb;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    )),
                                    _cV(_component_i_input, _uM("modelValue" to personalForm.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                        personalForm.value.password = `$event`
                                    }, "class" to "login-input password-input", "placeholder" to "请输入登录密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d9e5f2", "placeholderStyle" to "color:#a7b8cb;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    ))
                                ))
                            } else {
                                _cE("view", _uM("key" to 1, "class" to "login-form"), _uA(
                                    _cV(_component_i_input, _uM("modelValue" to smsMobile.value, "onUpdate:modelValue" to fun(`$event`: String){
                                        smsMobile.value = `$event`
                                    }
                                    , "class" to "login-input", "placeholder" to "请输入手机号", "type" to "number", "maxlength" to 11, "clearable" to "", "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d9e5f2", "placeholderStyle" to "color:#a7b8cb;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("prefix" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cE("text", _uM("class" to "sms-country-code"), "+86")
                                        )
                                    }
                                    ), "_" to 1), 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    )),
                                    _cV(_component_i_input, _uM("modelValue" to smsCode.value, "onUpdate:modelValue" to fun(`$event`: String){
                                        smsCode.value = `$event`
                                    }
                                    , "class" to "login-input sms-code-input", "placeholder" to "请输入6位短信验证码", "type" to "number", "maxlength" to 6, "clearable" to "", "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d9e5f2", "placeholderStyle" to "color:#a7b8cb;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("suffix" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cE("view", _uM("class" to _nC(_uA(
                                                "sms-send-button",
                                                _uM("sms-send-button-disabled" to (smsCooldown.value > 0 || smsSending.value))
                                            )), "onClick" to sendSmsCode), _uA(
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
                                ))
                            }
                            ,
                            _cE("view", _uM("class" to "documents"), _uA(
                                _cV(_component_i_checkbox, _uM("checked" to docState.value, "onChange" to isDocState, "size" to "40rpx", "iconSize" to "28rpx", "activeColor" to "#3485df", "inactiveColor" to "#a9bfd7"), null, 8, _uA(
                                    "checked"
                                )),
                                _cE("view", _uM("class" to "doc-info-box"), _uA(
                                    _cE("text", _uM("class" to "doc-text"), "我已阅读并同意"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoAgreement), "《用户协议》"),
                                    _cE("text", _uM("class" to "doc-text"), "和"),
                                    _cE("text", _uM("class" to "doc-link", "onClick" to gotoPrivacy), "《隐私政策》")
                                ))
                            )),
                            _cV(_component_i_button, _uM("class" to "login-submit", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "onClick" to submitLogin, "loading" to if (smsLoginMode.value) {
                                smsSubmitting.value
                            } else {
                                personalSubmitting.value
                            }
                            , "disabled" to !isLoginSubmitReady.value), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    " 登录 "
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "loading",
                                "disabled"
                            ))
                        )),
                        _cE("view", _uM("class" to "page-actions"), _uA(
                            _cE("view", _uM("class" to "action-item", "onClick" to toggleLoginMode), _uA(
                                _cE("text", _uM("class" to "action-link"), _tD(if (smsLoginMode.value) {
                                    "密码登录"
                                } else {
                                    "验证码登录"
                                }
                                ), 1),
                                _cE("text", _uM("class" to "action-arrow"), "›")
                            )),
                            if (isTrue(!smsLoginMode.value)) {
                                _cE("view", _uM("key" to 0, "class" to "action-item", "onClick" to goRegister), _uA(
                                    _cE("text", _uM("class" to "action-link"), "注册账号"),
                                    _cE("text", _uM("class" to "action-arrow"), "›")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (isTrue(!smsLoginMode.value)) {
                                _cE("view", _uM("key" to 1, "class" to "action-item", "onClick" to goForgotPassword), _uA(
                                    _cE("text", _uM("class" to "action-link"), "忘记密码"),
                                    _cE("text", _uM("class" to "action-arrow"), "›")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#fbfcfe")), "banner" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "height" to "230rpx", "backgroundColor" to "#fbfcfe")), "banner-image" to _pS(_uM("width" to "160rpx", "height" to "160rpx")), "title" to _pS(_uM("marginLeft" to "12rpx", "color" to "#333333", "fontSize" to "42rpx", "fontWeight" to "bold")), "content" to _pS(_uM("paddingTop" to "40rpx", "paddingRight" to "38rpx", "paddingBottom" to 0, "paddingLeft" to "38rpx")), "mini-program-content" to _pS(_uM("paddingTop" to "40rpx", "paddingRight" to "38rpx", "paddingBottom" to 0, "paddingLeft" to "38rpx")), "wechat-login" to _uM(".mini-program-content " to _uM("marginBottom" to "20rpx", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0), "" to _uM("marginTop" to "42rpx", "paddingTop" to 0, "paddingRight" to "38rpx", "paddingBottom" to 0, "paddingLeft" to "38rpx")), "enterprise-login-form" to _pS(_uM("width" to "100%")), "remember-password" to _pS(_uM("display" to "flex", "marginBottom" to "25rpx")), "mini-program-actions" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "marginTop" to "48rpx", "color" to "#5b92cc", "fontSize" to "30rpx")), "mini-program-action" to _pS(_uM("paddingTop" to 0, "paddingRight" to "44rpx", "paddingBottom" to 0, "paddingLeft" to "44rpx")), "no-login" to _pS(_uM("borderRightWidth" to "1rpx", "borderRightStyle" to "solid", "borderRightColor" to "#a9bfd7")), "login-form" to _pS(_uM("width" to "100%")), "login-input" to _pS(_uM("width" to "100%", "borderTopLeftRadius" to "25rpx", "borderTopRightRadius" to "25rpx", "borderBottomRightRadius" to "25rpx", "borderBottomLeftRadius" to "25rpx", "marginBottom" to "26rpx")), "password-input" to _pS(_uM("marginBottom" to "34rpx")), "documents" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to "25rpx")), "doc-info-box" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "whiteSpace" to "nowrap")), "doc-text" to _pS(_uM("fontSize" to "30rpx", "lineHeight" to "44rpx", "color" to "#8195ac")), "doc-link" to _pS(_uM("fontSize" to "30rpx", "lineHeight" to "44rpx", "color" to "#2e83df")), "wechat-login-button" to _pS(_uM("width" to "100%", "borderTopColor" to "#2f83df", "borderRightColor" to "#2f83df", "borderBottomColor" to "#2f83df", "borderLeftColor" to "#2f83df", "borderTopLeftRadius" to "52rpx", "borderTopRightRadius" to "52rpx", "borderBottomRightRadius" to "52rpx", "borderBottomLeftRadius" to "52rpx", "color" to "#2f83df", "fontSize" to "32rpx")), "page-actions" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "marginTop" to "54rpx")), "action-item" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to 0, "marginRight" to "17rpx", "marginBottom" to 0, "marginLeft" to "17rpx")), "action-link" to _pS(_uM("color" to "#5b92cc", "fontSize" to "29rpx", "fontWeight" to 500, "lineHeight" to "42rpx")), "action-arrow" to _pS(_uM("color" to "#5b92cc", "fontSize" to "34rpx", "fontWeight" to 500, "lineHeight" to "42rpx", "marginLeft" to "5rpx")), "sms-country-code" to _pS(_uM("color" to "#5d7a9b", "fontSize" to "32rpx", "fontWeight" to 500, "marginRight" to "20rpx")), "sms-send-button" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "height" to "56rpx", "paddingTop" to 0, "paddingRight" to "18rpx", "paddingBottom" to 0, "paddingLeft" to "18rpx", "borderTopLeftRadius" to "28rpx", "borderTopRightRadius" to "28rpx", "borderBottomRightRadius" to "28rpx", "borderBottomLeftRadius" to "28rpx", "backgroundColor" to "#3485df")), "sms-send-button-disabled" to _pS(_uM("backgroundColor" to "#b8d7ff")), "sms-send-button-text" to _pS(_uM("color" to "#ffffff", "fontSize" to "24rpx", "lineHeight" to "56rpx", "whiteSpace" to "nowrap")), "i-input" to _pS(_uM("boxSizing" to "border-box", "paddingTop" to 0, "paddingRight" to "34rpx", "paddingBottom" to 0, "paddingLeft" to "34rpx", "!borderTopWidth" to "2rpx", "!borderRightWidth" to "2rpx", "!borderBottomWidth" to "2rpx", "!borderLeftWidth" to "2rpx")), "i-input__field" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 0)), "i-checkbox" to _pS(_uM("minHeight" to "44rpx")), "i-button__text" to _pS(_uM("fontSize" to "38rpx", "fontWeight" to 600, "letterSpacing" to "2rpx")), "login-submit" to _pS(_uM("marginTop" to "42rpx")), "i-input--focus" to _pS(_uM("!borderTopColor" to "#3485df", "!borderRightColor" to "#3485df", "!borderBottomColor" to "#3485df", "!borderLeftColor" to "#3485df", "backgroundColor" to "#ffffff")), "i-input__eye" to _pS(_uM("marginLeft" to "14rpx", "opacity" to 0.78)), "i-checkbox__box" to _pS(_uM("borderTopWidth" to "2rpx", "borderRightWidth" to "2rpx", "borderBottomWidth" to "2rpx", "borderLeftWidth" to "2rpx", "borderTopLeftRadius" to "12rpx", "borderTopRightRadius" to "12rpx", "borderBottomRightRadius" to "12rpx", "borderBottomLeftRadius" to "12rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
