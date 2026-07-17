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
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.login as uni_login
import io.dcloud.uniapp.extapi.reLaunch as uni_reLaunch
import io.dcloud.uniapp.extapi.removeStorageSync as uni_removeStorageSync
import io.dcloud.uniapp.extapi.setStorageSync as uni_setStorageSync
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showModal as uni_showModal
import io.dcloud.uniapp.extapi.showToast as uni_showToast
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
            val rememberPassword = ref(false)
            val formValid = ref(false)
            val loading = ref(false)
            val form = ref<FormData>(FormData(username = "", password = ""))
            val formRef = ref<Any>(null)
            val deviceModel = ref("")
            val pswrules: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("pswrules", "pages/login/login.uvue", 110, 8), "username" to _uA(
                _uO("required" to true, "message" to "请输入账号", "trigger" to _uA(
                    "blur",
                    "change"
                ))
            ), "password" to _uA(
                _uO("required" to true, "message" to "请输入密码", "trigger" to _uA(
                    "blur",
                    "change"
                ))
            ))
            val isPswLogin = fun(){
                pswLogin.value = !pswLogin.value
                if (pswLogin.value) {
                    setTimeout(fun(){
                        loadSavedAccount()
                    }
                    , 100)
                }
            }
            val toggleRememberPassword = fun(){
                rememberPassword.value = !rememberPassword.value
                if (!rememberPassword.value) {
                    uni_removeStorageSync("savedEnterpriseAccount")
                }
            }
            val saveAccountPassword = fun(){
                if (rememberPassword.value && form.value.username != "" && form.value.password != "") {
                    val accountInfo: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("accountInfo", "pages/login/login.uvue", 151, 10), "username" to form.value.username, "password" to form.value.password)
                    uni_setStorageSync("savedEnterpriseAccount", accountInfo)
                } else if (!rememberPassword.value) {
                    uni_removeStorageSync("savedEnterpriseAccount")
                }
            }
            val loadSavedAccount = fun(){
                try {
                    val savedAccount = uni_getStorageSync("savedEnterpriseAccount")
                    if (isTruthy(savedAccount)) {
                        form.value.username = if (isTruthy(savedAccount.username)) {
                            savedAccount.username
                        } else {
                            ""
                        }
                        form.value.password = if (isTruthy(savedAccount.password)) {
                            savedAccount.password
                        } else {
                            ""
                        }
                        rememberPassword.value = true
                    }
                }
                 catch (error: Throwable) {
                    console.error("加载保存的账号密码失败:", error, " at pages/login/login.uvue:171")
                }
            }
            val filterNonLatin = fun(e: Any){
                form.value.password = e.replace(UTSRegExp("[^\\u0000-\\u007F]", "g"), "")
            }
            val isDocState = fun(){
                docState.value = !docState.value
            }
            val getSystemInfo = fun(){
                val res = uni_getSystemInfoSync()
                deviceModel.value = res.deviceModel
                console.log("设备型号:", deviceModel.value, " at pages/login/login.uvue:189")
            }
            val validateForm = fun(): UTSPromise<Boolean> {
                return UTSPromise(fun(resolve, reject){
                    console.log("开始验证表单, formRef.value:", formRef.value, " at pages/login/login.uvue:195")
                    if (!isTruthy(formRef.value)) {
                        console.error("表单实例为空", " at pages/login/login.uvue:198")
                        reject(UTSError("表单实例不存在"))
                        return
                    }
                    if (UTSAndroid.`typeof`(formRef.value.validate) !== "function") {
                        console.error("validate 方法不存在，尝试使用其他方法", " at pages/login/login.uvue:205")
                        if (UTSAndroid.`typeof`(formRef.value.validateForm) === "function") {
                            formRef.value.validateForm(fun(valid: Boolean){
                                console.log("validateForm 验证结果:", valid, " at pages/login/login.uvue:209")
                                if (valid) {
                                    resolve(true)
                                } else {
                                    reject(UTSError("表单验证失败"))
                                }
                            }
                            )
                            return
                        }
                        reject(UTSError("表单验证方法不存在"))
                        return
                    }
                    try {
                        val result = formRef.value.validate()
                        console.log("validate 同步返回:", result, " at pages/login/login.uvue:225")
                        if (isTruthy(result) && UTSAndroid.`typeof`(result.then) === "function") {
                            result.then(fun(valid: Boolean){
                                console.log("validate Promise 结果:", valid, " at pages/login/login.uvue:230")
                                if (valid) {
                                    resolve(true)
                                } else {
                                    reject(UTSError("表单验证失败"))
                                }
                            }
                            ).`catch`(fun(err: Any){
                                console.error("validate Promise 错误:", err, " at pages/login/login.uvue:237")
                                reject(err)
                            }
                            )
                            return
                        }
                        if (UTSAndroid.`typeof`(result) === "boolean") {
                            if (result as Boolean) {
                                resolve(true)
                            } else {
                                reject(UTSError("表单验证失败"))
                            }
                            return
                        }
                        formRef.value.validate(fun(valid: Boolean, errors: UTSArray<Any>?){
                            console.log("validate 回调结果:", valid, errors, " at pages/login/login.uvue:255")
                            if (valid) {
                                resolve(true)
                            } else {
                                reject(if (isTruthy(errors)) {
                                    errors
                                } else {
                                    UTSError("表单验证失败")
                                }
                                )
                            }
                        }
                        )
                    }
                     catch (error: Throwable) {
                        console.error("验证执行异常:", error, " at pages/login/login.uvue:264")
                        reject(error)
                    }
                }
                )
            }
            val loginBt = fun(){
                if (!docState.value) {
                    uni_showToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "error"))
                    return
                }
            }
            val handleGetPhoneNumber = fun(e: Any): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!docState.value) {
                            uni_showToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "error"))
                            return@w1
                        }
                        if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
                            uni_showToast(ShowToastOptions(title = "您拒绝了授权", icon = "none"))
                            return@w1
                        }
                        if (e.detail.errMsg !== "getPhoneNumber:ok") {
                            uni_showToast(ShowToastOptions(title = "获取手机号失败", icon = "none"))
                            return@w1
                        }
                        try {
                            uni_showLoading(ShowLoadingOptions(title = "登录中..."))
                            val loginRes = await(UTSPromise<UniApp.LoginRes>(fun(resolve, reject){
                                uni_login(LoginOptions(provider = "weixin", success = resolve, fail = reject))
                            }
                            ))
                            val res = await(PostWechatlogin(_uO("code" to loginRes.code, "encryptedData" to e.detail.encryptedData, "iv" to e.detail.iv)))
                            if (!isTruthy(res) || !isTruthy(res.data)) {
                                uni_showToast(ShowToastOptions(title = if (isTruthy(res?.msg)) {
                                    res?.msg
                                } else {
                                    "登录失败"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            if (!isTruthy(res.data.token)) {
                                uni_showToast(ShowToastOptions(title = "登录失败: 未获取到token", icon = "none"))
                                return@w1
                            }
                            uni_setStorageSync("token", res.data.token)
                            uni_showToast(ShowToastOptions(title = "登录成功", icon = "success"))
                            setTimeout(fun(){
                                uni_reLaunch(ReLaunchOptions(url = "/pages/index/index"))
                            }
                            , 500)
                        }
                         catch (error: Throwable) {
                            console.error("微信登录失败:", error, " at pages/login/login.uvue:354")
                            uni_showToast(ShowToastOptions(title = "微信登录失败", icon = "none"))
                        }
                         finally {
                            uni_hideLoading(null)
                        }
                })
            }
            val submit = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!docState.value) {
                            uni_showToast(ShowToastOptions(title = "请先阅读并同意用户协议", icon = "error"))
                            return@w1
                        }
                        try {
                            console.log("准备验证表单...", " at pages/login/login.uvue:377")
                            await(validateForm())
                            console.log("✅ 表单验证通过", " at pages/login/login.uvue:379")
                            val newFormData: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("newFormData", "pages/login/login.uvue", 382, 10), "username" to form.value.username, "password" to form.value.password, "from" to deviceModel.value, "type" to "USER")
                            console.log("📤 请求参数:", newFormData, " at pages/login/login.uvue:388")
                            loading.value = true
                            uni_showLoading(ShowLoadingOptions(title = "登录中...", mask = true))
                            console.log("🚀 开始调用 login 接口...", " at pages/login/login.uvue:398")
                            val res = await(login(newFormData))
                            console.log("✅ 登录接口返回:", res, " at pages/login/login.uvue:400")
                            loading.value = false
                            uni_hideLoading(null)
                            if (isTruthy(res) && isTruthy(res.data) && isTruthy(res.data.token)) {
                                saveAccountPassword()
                                uni_setStorageSync("token", res.data.token)
                                uni_showToast(ShowToastOptions(title = "登录成功", icon = "success"))
                                setTimeout(fun(){
                                    uni_reLaunch(ReLaunchOptions(url = "/pages/index/index"))
                                }, 500)
                            } else {
                                uni_showToast(ShowToastOptions(title = if (isTruthy(res?.msg)) {
                                    res?.msg
                                } else {
                                    "登录失败，请重试"
                                }
                                , icon = "error"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("❌ 登录失败:", error, " at pages/login/login.uvue:427")
                            loading.value = false
                            uni_hideLoading(null)
                            if (isTruthy(error) && isTruthy(error.message)) {
                                uni_showToast(ShowToastOptions(icon = "error", title = if (isTruthy(error.message)) {
                                    error.message
                                } else {
                                    "请填写正确的账号密码"
                                }))
                            } else {
                                uni_showToast(ShowToastOptions(icon = "error", title = "登录失败，请检查网络后重试"))
                            }
                        }
                })
            }
            val gotoIndex = fun(){
                uni_reLaunch(ReLaunchOptions(url = "/pages/index/index"))
            }
            val gotoAgreement = fun(){
                uni_showModal(ShowModalOptions(title = "用户协议", content = userAgreement, showCancel = false))
            }
            val gotoPrivacy = fun(){
                uni_showModal(ShowModalOptions(title = "隐私政策", content = privacyPolicy, showCancel = false))
            }
            onMounted(fun(){
                getSystemInfo()
                loadSavedAccount()
                console.log("pswLogin 初始值:", pswLogin.value, " at pages/login/login.uvue:474")
                console.log("formRef 初始值:", formRef.value, " at pages/login/login.uvue:475")
                setTimeout(fun(){
                    console.log("延迟检查 formRef.value:", formRef.value, " at pages/login/login.uvue:479")
                    if (isTruthy(formRef.value)) {
                        console.log("formRef 的方法:", Object.keys(formRef.value), " at pages/login/login.uvue:481")
                    }
                }
                , 500)
            }
            )
            val userAgreement = "\n欢迎使用车联网平台！\n\n一、服务条款的确认和接纳\n本协议是您与车联网平台之间关于使用平台服务的协议。您使用平台服务即表示您已阅读并同意本协议的全部条款。\n\n二、服务内容\n1. 车联网平台提供车辆管理、远程控制、数据分析等服务。\n2. 平台保留随时变更、中断或终止部分或全部网络服务的权利。\n\n三、用户账号\n用户应对其账号的全部行为负责，不得将账号转让或出借给他人使用。\n\n四、用户隐私保护\n保护用户隐私是平台的一项基本政策，详情请参阅《隐私政策》。\n\n五、免责声明\n1. 平台不保证服务一定能满足用户的要求，也不保证服务不会中断。\n2. 对于因不可抗力造成的服务中断，平台不承担责任。\n\n六、法律适用\n本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。\n\n如有任何疑问，请联系我们。"
            val privacyPolicy = "\n车联网平台非常重视您的隐私保护！\n\n一、信息收集\n1. 我们可能收集的信息包括：手机号码、车辆信息、位置信息、设备信息等。\n2. 我们会在您注册、使用服务时收集必要的信息。\n\n二、信息使用\n1. 我们使用收集的信息来提供、维护和改进服务。\n2. 我们不会向第三方出售或分享您的个人信息。\n\n三、信息保护\n1. 我们采用行业标准的安全措施保护您的信息。\n2. 我们会定期评估安全措施的有效性。\n\n四、未成年人保护\n我们重视未成年人的隐私保护，如您是未成年人，请在监护人指导下使用服务。\n\n五、政策更新\n我们可能会更新隐私政策，更新后的政策将在平台公布。\n\n如有任何隐私问题，请联系我们。"
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_form_item = resolveEasyComponent("i-form-item", GenUniModulesIUiXComponentsIFormItemIFormItemClass)
                val _component_i_checkbox = resolveEasyComponent("i-checkbox", GenUniModulesIUiXComponentsICheckboxICheckboxClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_form = resolveEasyComponent("i-form", GenUniModulesIUiXComponentsIFormIFormClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "登陆", "show-back" to false, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "banner"), _uA(
                        _cE("image", _uM("src" to "/static/car_location.png", "mode" to "aspectFill")),
                        _cE("text", _uM("class" to "title"), "车联网")
                    )),
                    _cE("view", _uM("class" to "content"), _uA(
                        if (isTrue(pswLogin.value)) {
                            _cE("view", _uM("key" to 0), _uA(
                                _cV(_component_i_form, _uM("ref_key" to "formRef", "ref" to formRef, "modelValue" to form.value, "rules" to pswrules, "labelDirection" to "horizontal", "watchValidStatus" to "", "onUpdate:modelValid" to fun(`$event`: Any){
                                    formValid.value = `$event`
                                }), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_form_item, _uM("name" to "username", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                _cV(_component_i_input, _uM("modelValue" to form.value.username, "onUpdate:modelValue" to fun(`$event`: String){
                                                    form.value.username = `$event`
                                                }, "placeholder" to "请输入账号", "clearable" to "", "prefixIcon" to "account-fill"), null, 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                ))
                                            )
                                        }), "_" to 1)),
                                        _cV(_component_i_form_item, _uM("name" to "password", "label" to "", "required" to "", "labelDirection" to "horizontal", "labelWidth" to "0"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                _cV(_component_i_input, _uM("modelValue" to form.value.password, "onUpdate:modelValue" to fun(`$event`: String){
                                                    form.value.password = `$event`
                                                }, "onInput" to filterNonLatin, "placeholder" to "请输入密码", "password" to true), null, 8, _uA(
                                                    "modelValue",
                                                    "onUpdate:modelValue"
                                                ))
                                            )
                                        }), "_" to 1)),
                                        _cE("view", _uM("class" to "remember-password"), _uA(
                                            _cV(_component_i_checkbox, _uM("checked" to rememberPassword.value, "onChange" to toggleRememberPassword, "label" to "记住密码"), null, 8, _uA(
                                                "checked"
                                            ))
                                        )),
                                        _cV(_component_i_button, _uM("type" to "primary", "onClick" to submit, "loading" to loading.value), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                            return _uA(
                                                "提交"
                                            )
                                        }), "_" to 1), 8, _uA(
                                            "loading"
                                        ))
                                    )
                                }), "_" to 1), 8, _uA(
                                    "modelValue",
                                    "onUpdate:modelValid"
                                ))
                            ))
                        } else {
                            _cE("view", _uM("key" to 1), _uA(
                                if (isTrue(!docState.value)) {
                                    _cE("button", _uM("key" to 0, "type" to "primary", "plain" to "true", "onClick" to loginBt), " 个人用户登录 ")
                                } else {
                                    _cC("v-if", true)
                                }
                                ,
                                if (isTrue(docState.value)) {
                                    _cE("button", _uM("key" to 1, "open-type" to "getPhoneNumber", "type" to "primary", "plain" to "true", "onGetphonenumber" to handleGetPhoneNumber), " 个人用户登录 ", 32)
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        }
                        ,
                        _cE("view", _uM("class" to "documents"), _uA(
                            _cV(_component_i_checkbox, _uM("checked" to docState.value, "onChange" to isDocState), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _cE("view", _uM("class" to "doc-info-box"), _uA(
                                        " 已阅读并同意",
                                        _cE("text", _uM("class" to "doc-link", "onClick" to gotoAgreement), "《用户协议》"),
                                        "和",
                                        _cE("text", _uM("class" to "doc-link", "onClick" to gotoPrivacy), "《隐私政策》")
                                    ))
                                )
                            }
                            ), "_" to 1), 8, _uA(
                                "checked"
                            ))
                        ))
                    )),
                    _cE("view", _uM("class" to "other-way"), _uA(
                        _cE("view", _uM("class" to "noLogin", "onClick" to gotoIndex), "暂不登录"),
                        _cE("view", _uM("class" to "BLogin", "onClick" to isPswLogin), _tD(if (pswLogin.value) {
                            "个人用户登录"
                        } else {
                            "企业用户登录"
                        }
                        ), 1)
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#ffffff")), "banner" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "height" to "20%")), "title" to _uM(".container .banner " to _uM("fontSize" to "40rpx", "fontWeight" to "bold", "color" to "#333333")), "content" to _uM(".container " to _uM("backgroundColor" to "#ffffff", "paddingTop" to "20rpx", "paddingRight" to "100rpx", "paddingBottom" to "20rpx", "paddingLeft" to "100rpx")), "other-login" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to "30rpx", "marginLeft" to 0, "fontSize" to "25rpx")), "documents" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "fontSize" to "25rpx", "marginTop" to "40rpx")), "doc-info-box" to _uM(".container .content .documents " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "marginLeft" to 10)), "doc-link" to _uM(".container .content .documents .doc-info-box " to _uM("color" to "#007AFF")), "remember-password" to _uM(".container .content " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "marginTop" to "20rpx", "marginRight" to 0, "marginBottom" to "20rpx", "marginLeft" to 0, "fontSize" to "25rpx")), "i-checkbox" to _uM(".container .content .remember-password " to _uM("display" to "flex", "alignItems" to "center")), "other-way" to _uM(".container " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "fontSize" to "25rpx", "marginTop" to "40rpx", "color" to "#999999")), "noLogin" to _uM(".container .other-way " to _uM("borderRightWidth" to "1rpx", "borderRightStyle" to "solid", "borderRightColor" to "#999999", "paddingRight" to "50rpx")), "BLogin" to _uM(".container .other-way " to _uM("paddingLeft" to "50rpx")), "wechat-login-btn" to _uM(".container " to _uM("!color" to "#ffffff")), "i-form-item" to _uM(".container " to _uM("paddingTop" to 12, "paddingRight" to 0, "paddingBottom" to 12, "paddingLeft" to 0)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
