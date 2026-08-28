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
open class GenPagesLoginSetPassword : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesLoginSetPassword) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesLoginSetPassword
            val _cache = __ins.renderCache
            val form = ref<PasswordForm>(PasswordForm(password = "", confirmPassword = ""))
            val submitting = ref(false)
            var registerContext: SmsRegisterContext? = null
            val returnToLogin = fun(): Unit {
                clearSmsRegisterContext()
                uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
            }
            val completeLogin = fun(token: String): Unit {
                if (token == "") {
                    showAppToast(ShowToastOptions(title = "注册失败，请重试", icon = "none"))
                    return
                }
                uni_setStorageSync("token", token)
                resetTokenExpiredState()
                clearSmsRegisterContext()
                showAppToast(ShowToastOptions(title = "注册成功", icon = "success"))
                setTimeout(fun(){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/index/index", success = fun(_){
                        schedulePostLoginInitialization()
                    }
                    ))
                }
                , 500)
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
            val validateForm = fun(): Boolean {
                if (form.value.password == "") {
                    showAppToast(ShowToastOptions(title = "请设置登录密码", icon = "none"))
                    return false
                }
                if (!isValidPassword()) {
                    return false
                }
                if (form.value.confirmPassword == "") {
                    showAppToast(ShowToastOptions(title = "请再次输入登录密码", icon = "none"))
                    return false
                }
                if (form.value.password != form.value.confirmPassword) {
                    showAppToast(ShowToastOptions(title = "两次输入的密码不一致", icon = "none"))
                    return false
                }
                return true
            }
            val submitRegister = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val context = registerContext
                        if (submitting.value || !validateForm()) {
                            return@w1
                        }
                        if (context == null) {
                            showAppToast(ShowToastOptions(title = "注册信息已失效，请重新获取验证码", icon = "none"))
                            returnToLogin()
                            return@w1
                        }
                        try {
                            submitting.value = true
                            val response = await(registerPersonalUser(RegisterRequest(password = form.value.password, confirmPassword = form.value.confirmPassword, phonenumber = context.phonenumber, smsCode = context.smsCode)))
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
            onMounted(fun(){
                registerContext = getSmsRegisterContext()
                if (registerContext == null) {
                    showAppToast(ShowToastOptions(title = "注册信息已失效，请重新获取验证码", icon = "none"))
                    setTimeout(fun(){
                        returnToLogin()
                    }
                    , 300)
                }
            }
            )
            onUnmounted(fun(){
                if (!submitting.value && registerContext != null) {
                    clearSmsRegisterContext()
                }
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "", "show-back" to true, "backgroundColor" to "#fbfcfe", "textColor" to "#333333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE("text", _uM("class" to "page-title"), "设置登录密码"),
                            _cE("text", _uM("class" to "page-subtitle"), "注册成功。请完成密码设置后继续。"),
                            _cV(_component_i_input, _uM("modelValue" to form.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                form.value.password = `$event`
                            }
                            , "class" to "password-input", "placeholder" to "请设置登录密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:34rpx;", "fontSize" to "34rpx", "color" to "#333333"), null, 8, _uA(
                                "modelValue",
                                "onUpdate:modelValue"
                            )),
                            _cE("text", _uM("class" to "password-hint"), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
                            _cV(_component_i_input, _uM("modelValue" to form.value.confirmPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                form.value.confirmPassword = `$event`
                            }
                            , "class" to "password-input confirm-password-input", "placeholder" to "请再次输入登录密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:34rpx;", "fontSize" to "34rpx", "color" to "#333333"), null, 8, _uA(
                                "modelValue",
                                "onUpdate:modelValue"
                            )),
                            _cV(_component_i_button, _uM("class" to "submit-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "loading" to submitting.value, "onClick" to submitRegister), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    " 完成设置 "
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "loading"
                            ))
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#fbfcfe")), "content" to _pS(_uM("paddingTop" to "54rpx", "paddingRight" to "40rpx", "paddingBottom" to 0, "paddingLeft" to "40rpx")), "page-title" to _pS(_uM("display" to "flex", "color" to "#1f2d3d", "fontSize" to "54rpx", "fontWeight" to 700, "lineHeight" to "76rpx")), "page-subtitle" to _pS(_uM("display" to "flex", "marginTop" to "28rpx", "color" to "#7f96ae", "fontSize" to "30rpx", "lineHeight" to "44rpx")), "password-input" to _pS(_uM("width" to "100%", "marginTop" to "62rpx")), "confirm-password-input" to _pS(_uM("marginTop" to "30rpx")), "password-hint" to _pS(_uM("display" to "flex", "marginTop" to "22rpx", "marginRight" to "6rpx", "marginBottom" to 0, "marginLeft" to "6rpx", "color" to "#7f96ae", "fontSize" to "26rpx", "lineHeight" to "40rpx")), "submit-button" to _pS(_uM("marginTop" to "70rpx")), "i-input" to _pS(_uM("boxSizing" to "border-box")), "i-input__field" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 0)), "i-button__text" to _pS(_uM("fontSize" to "38rpx", "fontWeight" to 600)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
