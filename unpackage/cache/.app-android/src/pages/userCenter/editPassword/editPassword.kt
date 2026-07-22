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
import io.dcloud.uniapp.extapi.hideLoading as uni_hideLoading
import io.dcloud.uniapp.extapi.navigateBack as uni_navigateBack
import io.dcloud.uniapp.extapi.showLoading as uni_showLoading
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesUserCenterEditPasswordEditPassword : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterEditPasswordEditPassword) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterEditPasswordEditPassword
            val _cache = __ins.renderCache
            val userInfo = ref<UserInfo__1>(UserInfo__1(id = "", mobile = ""))
            val formData = ref(_uO("password" to "", "newPassword" to "", "confirmPassword" to ""))
            val formRef = ref<FormInstance?>(null)
            val rules = _uA<UTSJSONObject>(_uO("name" to "password", "required" to true, "message" to "请输入原密码"), _uO("name" to "newPassword", "required" to true, "message" to "请输入新密码"), _uO("name" to "confirmPassword", "required" to true, "message" to "请确认新密码"))
            val handleSubmit = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val form = formRef.value
                            if (form == null || !form.validate()) {
                                throw UTSError("表单验证失败")
                            }
                            uni_showLoading(ShowLoadingOptions(title = "提交中...", mask = true))
                            val submitData: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("submitData", "pages/userCenter/editPassword/editPassword.uvue", 76, 10), "password" to formData.value["password"], "newPassword" to formData.value["newPassword"])
                            val res = await(changePassWord(submitData))
                            if (res.msg == "success") {
                                uni_hideLoading(null)
                                uni_showToast(ShowToastOptions(title = "密码修改成功", icon = "success", duration = 2000))
                                setTimeout(fun(){
                                    uni_navigateBack(null)
                                }, 1500)
                            } else {
                                uni_hideLoading(null)
                                uni_showToast(ShowToastOptions(title = "密码修改失败", icon = "error", duration = 2000))
                            }
                        }
                         catch (error: Throwable) {
                            uni_hideLoading(null)
                            uni_showToast(ShowToastOptions(title = "表单验证失败", icon = "none", duration = 2000))
                        }
                })
            }
            onLoad(fun(options){
                if (options["userInfo"] != null) {
                    try {
                        val parsedInfo = UTSAndroid.consoleDebugError(JSON.parse(UTSAndroid.consoleDebugError(decodeURIComponent(options["userInfo"] as String), " at pages/userCenter/editPassword/editPassword.uvue:117") as String), " at pages/userCenter/editPassword/editPassword.uvue:117") as UTSJSONObject
                        console.log(parsedInfo, " at pages/userCenter/editPassword/editPassword.uvue:118")
                        val userId = parsedInfo.getString("userId")
                        val mobile = parsedInfo.getString("mobile")
                        userInfo.value = UserInfo__1(id = if (userId != null) {
                            userId
                        } else {
                            ""
                        }
                        , mobile = if (mobile != null) {
                            mobile
                        } else {
                            ""
                        }
                        )
                        console.log("用户信息:", userInfo.value, " at pages/userCenter/editPassword/editPassword.uvue:125")
                    }
                     catch (e: Throwable) {
                        console.error("解析用户信息失败:", e, " at pages/userCenter/editPassword/editPassword.uvue:127")
                    }
                }
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_form_item = resolveEasyComponent("i-form-item", GenUniModulesIUiXComponentsIFormItemIFormItemClass)
                val _component_i_form = resolveEasyComponent("i-form", GenUniModulesIUiXComponentsIFormIFormClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "修改密码", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "content"), _uA(
                        _cV(_component_i_form, _uM("modelValue" to unref(formData), "rules" to rules, "ref_key" to "formRef", "ref" to formRef), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                _cV(_component_i_form_item, _uM("label" to "原密码", "labelDirection" to "horizontal", "labelWidth" to "80", "name" to "password", "borderBottom" to ""), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_input, _uM("modelValue" to unref(formData)["password"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                            unref(formData)["password"] = `$event`
                                        }
                                        , "placeholder" to "请输入原密码", "border" to "none", "type" to "password", "password" to "", "customStyle" to "padding:20rpx"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        ))
                                    )
                                }
                                ), "_" to 1)),
                                _cV(_component_i_form_item, _uM("label" to "新密码", "labelDirection" to "horizontal", "labelWidth" to "80", "name" to "newPassword", "borderBottom" to ""), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_input, _uM("modelValue" to unref(formData)["newPassword"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                            unref(formData)["newPassword"] = `$event`
                                        }
                                        , "placeholder" to "请输入新密码", "border" to "none", "type" to "password", "password" to "", "customStyle" to "padding:20rpx"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        ))
                                    )
                                }
                                ), "_" to 1)),
                                _cV(_component_i_form_item, _uM("label" to "确认密码", "labelDirection" to "horizontal", "labelWidth" to "80", "name" to "confirmPassword"), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                    return _uA(
                                        _cV(_component_i_input, _uM("modelValue" to unref(formData)["confirmPassword"], "onUpdate:modelValue" to fun(`$event`: Any?){
                                            unref(formData)["confirmPassword"] = `$event`
                                        }
                                        , "placeholder" to "请再次输入新密码", "border" to "none", "type" to "password", "password" to "", "customStyle" to "padding:20rpx"), null, 8, _uA(
                                            "modelValue",
                                            "onUpdate:modelValue"
                                        ))
                                    )
                                }
                                ), "_" to 1))
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "modelValue"
                        ))
                    )),
                    _cE("view", _uM("class" to "btn"), _uA(
                        _cV(_component_i_button, _uM("type" to "primary", "text" to "提交修改", "onClick" to handleSubmit))
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
                return _uM("container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#f5f5f5")), "content" to _uM(".container " to _uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "paddingTop" to "20rpx", "paddingRight" to "40rpx", "paddingBottom" to "20rpx", "paddingLeft" to "40rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "btn" to _uM(".container " to _uM("marginTop" to "50rpx", "marginRight" to "20rpx", "marginBottom" to 0, "marginLeft" to "20rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
