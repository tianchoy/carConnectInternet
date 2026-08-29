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
open class GenPagesUserCenterEditPasswordEditPassword : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterEditPasswordEditPassword) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterEditPasswordEditPassword
            val _cache = __ins.renderCache
            val form = ref<PasswordForm__1>(PasswordForm__1(oldPassword = "", newPassword = "", confirmPassword = ""))
            val submitting = ref(false)
            val sessionEnding = ref(false)
            val isValidPassword = fun(password: String): Boolean {
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
                if (form.value.oldPassword == "") {
                    showAppToast(ShowToastOptions(title = "请输入当前密码", icon = "none"))
                    return false
                }
                if (form.value.newPassword == "") {
                    showAppToast(ShowToastOptions(title = "请输入新密码", icon = "none"))
                    return false
                }
                if (!isValidPassword(form.value.newPassword)) {
                    return false
                }
                if (form.value.oldPassword == form.value.newPassword) {
                    showAppToast(ShowToastOptions(title = "新密码不能与当前密码相同", icon = "none"))
                    return false
                }
                if (form.value.confirmPassword == "") {
                    showAppToast(ShowToastOptions(title = "请再次输入新密码", icon = "none"))
                    return false
                }
                if (form.value.newPassword != form.value.confirmPassword) {
                    showAppToast(ShowToastOptions(title = "两次输入的密码不一致", icon = "none"))
                    return false
                }
                return true
            }
            val returnToLogin = fun(): Unit {
                sessionEnding.value = true
                uni_removeStorageSync("token")
                clearPushSessionState()
                form.value = PasswordForm__1(oldPassword = "", newPassword = "", confirmPassword = "")
                setTimeout(fun(){
                    uni_reLaunch(ReLaunchOptions(url = "/pages/login/login"))
                }
                , 1500)
            }
            val goForgotPassword = fun(): Unit {
                uni_navigateTo(NavigateToOptions(url = "/pages/login/forgot-password"))
            }
            val submitPasswordUpdate = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (submitting.value || !validateForm()) {
                            return@w1
                        }
                        try {
                            submitting.value = true
                            val response = await(updatePassword(ChangePasswordRequest(oldPassword = form.value.oldPassword, newPassword = form.value.newPassword, confirmPassword = form.value.confirmPassword)))
                            if (response.code != 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "密码修改失败，请稍后重试"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            showAppToast(ShowToastOptions(title = "密码修改成功，请重新登录", icon = "success"))
                            returnToLogin()
                        }
                         catch (error: Throwable) {
                            if (!sessionEnding.value) {
                                showAppToast(ShowToastOptions(title = "密码修改失败，请检查网络后重试", icon = "none"))
                            }
                        }
                         finally {
                            if (!sessionEnding.value) {
                                submitting.value = false
                            }
                        }
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "", "show-back" to true, "backgroundColor" to "#fbfcfe", "textColor" to "#333333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE("text", _uM("class" to "page-title"), "修改密码"),
                            _cE("text", _uM("class" to "page-subtitle"), "修改后，当前及其他设备均需重新登录。"),
                            _cE("view", _uM("class" to "form-section"), _uA(
                                _cV(_component_i_input, _uM("modelValue" to form.value.oldPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                    form.value.oldPassword = `$event`
                                }
                                , "class" to "password-input", "placeholder" to "请输入当前密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                )),
                                _cV(_component_i_input, _uM("modelValue" to form.value.newPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                    form.value.newPassword = `$event`
                                }
                                , "class" to "password-input new-password-input", "placeholder" to "请输入新密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                )),
                                _cE("text", _uM("class" to "password-hint"), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
                                _cV(_component_i_input, _uM("modelValue" to form.value.confirmPassword, "onUpdate:modelValue" to fun(`$event`: String){
                                    form.value.confirmPassword = `$event`
                                }
                                , "class" to "password-input confirm-password-input", "placeholder" to "请再次输入新密码", "password" to true, "height" to "110rpx", "round" to "25rpx", "borderColor" to "#d7e3ef", "placeholderStyle" to "color:#a8b8ca;font-size:28rpx;", "fontSize" to "28rpx", "color" to "#333333"), null, 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValue"
                                ))
                            )),
                            _cV(_component_i_button, _uM("class" to "submit-button", "type" to "primary", "block" to "", "round" to "25rpx", "color" to "#3485df", "customStyle" to "height:104rpx;", "loading" to submitting.value, "onClick" to submitPasswordUpdate), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    " 确认修改 "
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "loading"
                            )),
                            _cE("text", _uM("class" to "forgot-password-link", "onClick" to goForgotPassword), "忘记当前密码？")
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#fbfcfe")), "content" to _pS(_uM("paddingTop" to "58rpx", "paddingRight" to "34rpx", "paddingBottom" to "80rpx", "paddingLeft" to "34rpx")), "page-title" to _pS(_uM("display" to "flex", "color" to "#1f2d3d", "fontSize" to "54rpx", "fontWeight" to 700, "lineHeight" to "76rpx")), "page-subtitle" to _pS(_uM("display" to "flex", "marginTop" to "26rpx", "color" to "#7f96ae", "fontSize" to "30rpx", "lineHeight" to "44rpx")), "form-section" to _pS(_uM("marginTop" to "84rpx")), "password-input" to _pS(_uM("width" to "100%", "borderTopLeftRadius" to "25rpx", "borderTopRightRadius" to "25rpx", "borderBottomRightRadius" to "25rpx", "borderBottomLeftRadius" to "25rpx")), "new-password-input" to _pS(_uM("marginTop" to "28rpx")), "confirm-password-input" to _pS(_uM("marginTop" to "30rpx")), "password-hint" to _pS(_uM("display" to "flex", "marginTop" to "22rpx", "marginRight" to "6rpx", "marginBottom" to 0, "marginLeft" to "6rpx", "color" to "#7f96ae", "fontSize" to "26rpx", "lineHeight" to "40rpx")), "submit-button" to _pS(_uM("marginTop" to "72rpx")), "forgot-password-link" to _pS(_uM("display" to "flex", "justifyContent" to "center", "marginTop" to "48rpx", "color" to "#3485df", "fontSize" to "30rpx", "lineHeight" to "44rpx")), "i-input" to _pS(_uM("boxSizing" to "border-box", "paddingTop" to 0, "paddingRight" to "34rpx", "paddingBottom" to 0, "paddingLeft" to "34rpx", "!borderTopWidth" to "2rpx", "!borderRightWidth" to "2rpx", "!borderBottomWidth" to "2rpx", "!borderLeftWidth" to "2rpx")), "i-input__field" to _pS(_uM("paddingTop" to 0, "paddingBottom" to 0)), "i-input--focus" to _pS(_uM("!borderTopColor" to "#3485df", "!borderRightColor" to "#3485df", "!borderBottomColor" to "#3485df", "!borderLeftColor" to "#3485df", "backgroundColor" to "#ffffff")), "i-input__eye" to _pS(_uM("marginLeft" to "14rpx", "opacity" to 0.78)), "i-button__text" to _pS(_uM("fontSize" to "38rpx", "fontWeight" to 600, "letterSpacing" to "2rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
