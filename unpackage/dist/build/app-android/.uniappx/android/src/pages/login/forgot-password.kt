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
open class GenPagesLoginForgotPassword : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginForgotPassword) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginForgotPassword
            val _cache = __ins.renderCache
            val currentStep = ref(1)
            val stepItems = _uA(
                "验证身份",
                "设置密码",
                "完成"
            )
            val form = ref<ForgotPasswordForm>(ForgotPasswordForm(mobile = "", smsCode = "", password = "", confirmPassword = ""))
            val smsCooldown = ref(0)
            val smsSending = ref(false)
            val resetSubmitting = ref(false)
            var smsCooldownTimer: Number? = null
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
                        if (smsCooldown.value > 0 || smsSending.value || !isValidMobile()) {
                            return@w1
                        }
                        try {
                            smsSending.value = true
                            val response = await(sendSmsForgotPasswordCode(SendSmsCodeRequest(phonenumber = form.value.mobile)))
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
            val goToPasswordStep = fun(): Unit {
                if (!isValidMobile() || !isValidSmsCode()) {
                    return
                }
                currentStep.value = 2
            }
            val completePasswordReset = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (resetSubmitting.value) {
                            return@w1
                        }
                        if (form.value.password == "") {
                            showAppToast(ShowToastOptions(title = "请输入新密码", icon = "none"))
                            return@w1
                        }
                        if (!isValidPassword()) {
                            return@w1
                        }
                        if (form.value.confirmPassword == "") {
                            showAppToast(ShowToastOptions(title = "请再次输入新密码", icon = "none"))
                            return@w1
                        }
                        if (form.value.password != form.value.confirmPassword) {
                            showAppToast(ShowToastOptions(title = "两次输入的密码不一致", icon = "none"))
                            return@w1
                        }
                        try {
                            resetSubmitting.value = true
                            val response = await(resetForgotPassword(ForgotPasswordResetRequest(phonenumber = form.value.mobile, smsCode = form.value.smsCode, newPassword = form.value.password, confirmPassword = form.value.confirmPassword)))
                            if (response.code != 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "密码重置失败，请稍后重试"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            currentStep.value = 3
                        }
                         catch (error: Throwable) {
                            showAppToast(ShowToastOptions(title = "密码重置失败，请检查网络后重试", icon = "none"))
                        }
                         finally {
                            resetSubmitting.value = false
                        }
                })
            }
            val returnToLogin = fun(): Unit {
                stopSmsCooldown()
                form.value = ForgotPasswordForm(mobile = "", smsCode = "", password = "", confirmPassword = "")
                uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
            }
            onUnmounted(fun(){
                stopSmsCooldown()
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "找回密码", "show-back" to true, "backgroundColor" to "#fbfcfe", "textColor" to "#333333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE("view", _uM("class" to "forgot-password-steps"), _uA(
                                _cE("view", _uM("class" to "forgot-password-steps__indicators"), _uA(
                                    _cE("view", _uM("class" to "forgot-password-steps__dot forgot-password-steps__dot--active"), _uA(
                                        _cE("text", _uM("class" to "forgot-password-steps__index"), "1")
                                    )),
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "forgot-password-steps__line",
                                        _uM("forgot-password-steps__line--active" to (currentStep.value > 1))
                                    ))), null, 2),
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "forgot-password-steps__dot",
                                        _uM("forgot-password-steps__dot--active" to (currentStep.value > 1))
                                    ))), _uA(
                                        _cE("text", _uM("class" to "forgot-password-steps__index"), "2")
                                    ), 2),
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "forgot-password-steps__line",
                                        _uM("forgot-password-steps__line--active" to (currentStep.value > 2))
                                    ))), null, 2),
                                    _cE("view", _uM("class" to _nC(_uA(
                                        "forgot-password-steps__dot",
                                        _uM("forgot-password-steps__dot--active" to (currentStep.value > 2))
                                    ))), _uA(
                                        _cE("text", _uM("class" to "forgot-password-steps__index"), "3")
                                    ), 2)
                                )),
                                _cE("view", _uM("class" to "forgot-password-steps__titles"), _uA(
                                    _cE(Fragment, null, RenderHelpers.renderList(stepItems, fun(item, index, __index, _cached): Any {
                                        return _cE("text", _uM("key" to item, "class" to _nC(_uA(
                                            "forgot-password-steps__title",
                                            _uA(
                                                "forgot-password-steps__title--" + index,
                                                _uM("forgot-password-steps__title--active" to (index < currentStep.value))
                                            )
                                        ))), _tD(item), 3)
                                    }
                                    ), 64)
                                ))
                            )),
                            if (currentStep.value == 1) {
                                _cE("view", _uM("key" to 0, "class" to "form-section verify-section"), _uA(
                                    _cV(_component_i_input, _uM("modelValue" to form.value.mobile, "onUpdate:modelValue" to fun(`$event`: String){
                                        form.value.mobile = `$event`
                                    }, "class" to "form-input", "placeholder" to "请输入绑定的手机号", "type" to "number", "maxlength" to 11, "clearable" to "", "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("prefix" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cE("text", _uM("class" to "country-code"), "+86")
                                        )
                                    }), "_" to 1), 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    )),
                                    _cV(_component_i_input, _uM("modelValue" to form.value.smsCode, "onUpdate:modelValue" to fun(`$event`: String){
                                        form.value.smsCode = `$event`
                                    }, "class" to "form-input sms-code-input", "placeholder" to "请输入6位验证码", "type" to "number", "maxlength" to 6, "clearable" to "", "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), _uM("suffix" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            _cE("view", _uM("class" to _nC(_uA(
                                                "sms-send-button",
                                                _uM("sms-send-button-disabled" to (smsCooldown.value > 0 || smsSending.value))
                                            )), "onClick" to requestSmsCode), _uA(
                                                _cE("text", _uM("class" to "sms-send-button-text"), _tD(if (smsCooldown.value > 0) {
                                                    smsCooldown.value + "秒后重试"
                                                } else {
                                                    "获取验证码"
                                                }), 1)
                                            ), 2)
                                        )
                                    }), "_" to 1), 8, _uA(
                                        "modelValue",
                                        "onUpdate:modelValue"
                                    )),
                                    _cV(_component_i_button, _uM("class" to "submit-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "onClick" to goToPasswordStep), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                        return _uA(
                                            " 下一步 "
                                        )
                                    }), "_" to 1))
                                ))
                            } else {
                                if (currentStep.value == 2) {
                                    _cE("view", _uM("key" to 1, "class" to "form-section password-section"), _uA(
                                        _cV(_component_i_input, _uM("modelValue" to form.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                            form.value.password = `$event`
                                        }, "class" to "form-input", "placeholder" to "请输入新密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        )),
                                        _cE("text", _uM("class" to "password-hint"), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
                                        _cV(_component_i_input, _uM("modelValue" to form.value.confirmPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                            form.value.confirmPassword = `$event`
                                        }, "class" to "form-input confirm-password-input", "placeholder" to "请再次输入新密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        )),
                                        _cV(_component_i_button, _uM("class" to "submit-button password-submit-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "loading" to resetSubmitting.value, "onClick" to completePasswordReset), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                " 确认重置 "
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "loading"
                                        ))
                                    ))
                                } else {
                                    _cE("view", _uM("key" to 2, "class" to "success-section"), _uA(
                                        _cE("view", _uM("class" to "success-icon"), _uA(
                                            _cE("text", _uM("class" to "success-check"), "✓")
                                        )),
                                        _cE("text", _uM("class" to "success-title"), "密码重置成功"),
                                        _cE("text", _uM("class" to "success-description"), "请使用新密码重新登录。为保护账户安全，当前及其他设备的登录状态均已失效。"),
                                        _cV(_component_i_button, _uM("class" to "submit-button success-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "onClick" to returnToLogin), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                " 返回登录 "
                                            )
                                        }
                                        ), "_" to 1))
                                    ))
                                }
                            }
                        ))
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#fbfcfe")), "content" to _pS(_uM("paddingTop" to "48rpx", "paddingRight" to "60rpx", "paddingBottom" to "80rpx", "paddingLeft" to "60rpx")), "forgot-password-steps" to _pS(_uM("width" to "70%", "height" to "130rpx", "marginTop" to 0, "marginRight" to "auto", "marginBottom" to 0, "marginLeft" to "auto", "overflow" to "visible")), "forgot-password-steps__indicators" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "height" to "50rpx")), "forgot-password-steps__line" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to "1rpx", "marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to 0, "marginLeft" to "20rpx", "backgroundColor" to "#dce7f0")), "forgot-password-steps__line--active" to _pS(_uM("backgroundColor" to "#3485df")), "forgot-password-steps__dot" to _pS(_uM("display" to "flex", "flexShrink" to 0, "alignItems" to "center", "justifyContent" to "center", "width" to "50rpx", "height" to "50rpx", "borderTopWidth" to "2rpx", "borderRightWidth" to "2rpx", "borderBottomWidth" to "2rpx", "borderLeftWidth" to "2rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#dce7f0", "borderRightColor" to "#dce7f0", "borderBottomColor" to "#dce7f0", "borderLeftColor" to "#dce7f0", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "backgroundColor" to "#ffffff")), "forgot-password-steps__dot--active" to _pS(_uM("borderTopColor" to "#3485df", "borderRightColor" to "#3485df", "borderBottomColor" to "#3485df", "borderLeftColor" to "#3485df", "backgroundColor" to "#3485df")), "forgot-password-steps__index" to _uM("" to _uM("color" to "#9aafc2", "fontSize" to "30rpx", "fontWeight" to 600, "lineHeight" to "78rpx"), ".forgot-password-steps__dot--active " to _uM("color" to "#ffffff")), "forgot-password-steps__titles" to _pS(_uM("position" to "relative", "height" to "40rpx", "marginTop" to "22rpx", "overflow" to "visible")), "forgot-password-steps__title" to _pS(_uM("color" to "#9aafc2", "fontSize" to "28rpx", "fontWeight" to 500, "lineHeight" to "40rpx", "whiteSpace" to "nowrap")), "forgot-password-steps__title--0" to _pS(_uM("position" to "absolute", "left" to "25rpx", "transform" to "translateX(-50%)")), "forgot-password-steps__title--1" to _pS(_uM("position" to "absolute", "left" to "50%", "transform" to "translateX(-50%)")), "forgot-password-steps__title--2" to _pS(_uM("position" to "absolute", "right" to 0)), "forgot-password-steps__title--active" to _pS(_uM("color" to "#3485df", "fontWeight" to 600)), "form-section" to _pS(_uM("marginTop" to "118rpx")), "form-input" to _pS(_uM("width" to "100%", "borderTopLeftRadius" to "25rpx", "borderTopRightRadius" to "25rpx", "borderBottomRightRadius" to "25rpx", "borderBottomLeftRadius" to "25rpx")), "sms-code-input" to _pS(_uM("marginTop" to "28rpx")), "confirm-password-input" to _pS(_uM("marginTop" to "28rpx")), "country-code" to _pS(_uM("marginRight" to "20rpx", "color" to "#5d7a9b", "fontSize" to "34rpx", "fontWeight" to 500)), "sms-send-button" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "height" to "58rpx", "paddingTop" to 0, "paddingRight" to "18rpx", "paddingBottom" to 0, "paddingLeft" to "18rpx", "borderTopLeftRadius" to "29rpx", "borderTopRightRadius" to "29rpx", "borderBottomRightRadius" to "29rpx", "borderBottomLeftRadius" to "29rpx")), "sms-send-button-disabled" to _pS(_uM("opacity" to 0.45)), "sms-send-button-text" to _pS(_uM("color" to "#1878e5", "fontSize" to "30rpx", "fontWeight" to 600, "lineHeight" to "58rpx", "whiteSpace" to "nowrap")), "password-hint" to _pS(_uM("display" to "flex", "marginTop" to "22rpx", "marginRight" to "6rpx", "marginBottom" to 0, "marginLeft" to "6rpx", "color" to "#7f96ae", "fontSize" to "26rpx", "lineHeight" to "40rpx")), "submit-button" to _pS(_uM("marginTop" to "72rpx")), "password-submit-button" to _pS(_uM("marginTop" to "70rpx")), "success-section" to _pS(_uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center", "marginTop" to "170rpx")), "success-icon" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "width" to "150rpx", "height" to "150rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "backgroundColor" to "#e3f7ef")), "success-check" to _pS(_uM("color" to "#2db37a", "fontSize" to "86rpx", "fontWeight" to 500, "lineHeight" to "150rpx")), "success-title" to _pS(_uM("marginTop" to "56rpx", "color" to "#1f2d3d", "fontSize" to "50rpx", "fontWeight" to 700, "lineHeight" to "72rpx")), "success-description" to _pS(_uM("marginTop" to "42rpx", "color" to "#7f96ae", "fontSize" to "30rpx", "lineHeight" to "52rpx", "textAlign" to "center")), "success-button" to _pS(_uM("alignSelf" to "stretch", "marginTop" to "126rpx")), "i-input" to _pS(_uM("boxSizing" to "border-box", "paddingTop" to 0, "paddingRight" to "34rpx", "paddingBottom" to 0, "paddingLeft" to "34rpx", "!borderTopWidth" to "2rpx", "!borderRightWidth" to "2rpx", "!borderBottomWidth" to "2rpx", "!borderLeftWidth" to "2rpx")), "i-input__field" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 0)), "i-input--focus" to _pS(_uM("!borderTopColor" to "#3485df", "!borderRightColor" to "#3485df", "!borderBottomColor" to "#3485df", "!borderLeftColor" to "#3485df", "backgroundColor" to "#ffffff")), "i-input__eye" to _pS(_uM("marginLeft" to "14rpx", "opacity" to 0.78)), "i-button__text" to _pS(_uM("fontSize" to "38rpx", "fontWeight" to 600, "letterSpacing" to "2rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
