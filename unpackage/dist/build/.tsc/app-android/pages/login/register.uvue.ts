import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_form_item from '@/uni_modules/i-ui-x/components/i-form-item/i-form-item.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_i_form from '@/uni_modules/i-ui-x/components/i-form/i-form.uvue'
import _easycom_i_checkbox from '@/uni_modules/i-ui-x/components/i-checkbox/i-checkbox.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import _easycom_app_modal from '@/components/app-modal/app-modal.uvue'
import { ref, computed, onUnmounted } from 'vue'
	import { showAppToast } from '../../utils/toast.uts'
	import { showAppModal } from '../../utils/modal.uts'
	import { sendSmsRegisterCode, registerPersonalUser } from '../../api/request.uts'
	import { userAgreement, privacyPolicy } from '../../utils/legal.uts'

	type RegisterForm = {
		username: string
		password: string
		confirmPassword: string
		mobile: string
		smsCode: string
	}

	
const __sfc__ = defineComponent({
  __name: 'register',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const form = ref<RegisterForm>({
		username: '',
		password: '',
		confirmPassword: '',
		mobile: '',
		smsCode: ''
	})
	const agreementAccepted = ref(false)
	const smsCooldown = ref(0)
	const smsSending = ref(false)
	const submitting = ref(false)
	let smsCooldownTimer: number | null = null


	const hasPasswordMismatch = computed<boolean>(() => {
		return form.value.password != '' && form.value.confirmPassword != '' && form.value.password != form.value.confirmPassword
	})

	const isRegisterReady = computed<boolean>(() => {
		return form.value.username != '' && form.value.password != '' && form.value.confirmPassword != '' &&
			form.value.mobile != '' && form.value.smsCode != ''
	})



	const rules = [
		{ name: 'username', required: true, message: '请输入账号' } as UTSJSONObject,
		{ name: 'password', required: true, message: '请输入密码' } as UTSJSONObject,
		{ name: 'confirmPassword', required: true, message: '请再次输入密码' } as UTSJSONObject,
		{ name: 'mobile', required: true, message: '请输入手机号' } as UTSJSONObject,
		{ name: 'smsCode', required: true, message: '请输入验证码' } as UTSJSONObject
	] as Array<UTSJSONObject>

	const toggleAgreement = (): void => {
		agreementAccepted.value = !agreementAccepted.value
	}

	const isValidMobile = (): boolean => {
		if (!/^1[3-9]\d{9}$/.test(form.value.mobile)) {
			showAppToast({ title: '请输入正确的手机号', icon: 'none' })
			return false
		}
		return true
	}

	const isValidSmsCode = (): boolean => {
		if (!/^\d{4}$/.test(form.value.smsCode)) {
			showAppToast({ title: '请输入4位验证码', icon: 'none' })
			return false
		}
		return true
	}

	const stopSmsCooldown = (): void => {
		const timer = smsCooldownTimer
		if (timer != null) {
			clearInterval(timer)
			smsCooldownTimer = null
		}
	}

	const startSmsCooldown = (): void => {
		stopSmsCooldown()
		smsCooldown.value = 60
		smsCooldownTimer = setInterval(() => {
			smsCooldown.value -= 1
			if (smsCooldown.value <= 0) {
				smsCooldown.value = 0
				stopSmsCooldown()
			}
		}, 1000) as number
	}

	const requestSmsCode = async (): Promise<void> => {
		if (smsCooldown.value > 0 || smsSending.value) return
		if (form.value.mobile.length == 0) {
			showAppToast({ title: '请输入手机号', icon: 'none' })
			return
		}
		if (!isValidMobile()) return
		try {
			smsSending.value = true
			const response = await sendSmsRegisterCode({ phonenumber: form.value.mobile })
			if (response.code != 200) {
				showAppToast({ title: response.msg || '验证码发送失败', icon: 'none' })
				return
			}
			startSmsCooldown()
			showAppToast({ title: '验证码已发送', icon: 'success' })
		} catch (error) {
			showAppToast({ title: '验证码发送失败，请检查网络', icon: 'none' })
		} finally {
			smsSending.value = false
		}
	}

	const validateForm = (): boolean => {
		if (form.value.username.length == 0) {
			showAppToast({ title: '请输入账号', icon: 'none' })
			return false
		}
		if (form.value.password.length == 0) {
			showAppToast({ title: '请输入密码', icon: 'none' })
			return false
		}
		if (form.value.confirmPassword.length == 0) {
			showAppToast({ title: '请再次输入密码', icon: 'none' })
			return false
		}
		if (form.value.password != form.value.confirmPassword) {
			showAppToast({ title: '两次输入的密码不一致', icon: 'none' })
			return false
		}
		if (form.value.mobile.length == 0) {
			showAppToast({ title: '请输入手机号', icon: 'none' })
			return false
		}
		if (!isValidMobile()) return false
		if (form.value.smsCode.length == 0) {
			showAppToast({ title: '请输入验证码', icon: 'none' })
			return false
		}
		if (!isValidSmsCode()) return false
		if (!agreementAccepted.value) {
			showAppToast({ title: '请先阅读并同意用户协议', icon: 'none' })
			return false
		}
		return true
	}

	const submitRegister = async (): Promise<void> => {
		if (submitting.value || !validateForm()) return
		try {
			submitting.value = true
			const response = await registerPersonalUser({
				username: form.value.username,
				password: form.value.password,
				confirmPassword: form.value.confirmPassword,
				phonenumber: form.value.mobile,
				smsCode: form.value.smsCode
			})
			if (response.code != 200) {
				showAppToast({ title: response.msg || '注册失败，请稍后重试', icon: 'none' })
				return
			}
			showAppToast({ title: response.msg || '注册成功，请登录', icon: 'success' })
			setTimeout(() => {
				uni.navigateBack({
					fail: () => {
						uni.reLaunch({ url: '/pages/login/personal-password-login' })
					}
				})
			}, 500)
		} catch (error) {
			showAppToast({ title: '注册失败，请检查网络后重试', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}

	const backToPersonalLogin = (): void => {
		uni.navigateBack({
			fail: () => {
				uni.reLaunch({ url: '/pages/login/personal-password-login' })
			}
		})
	}

	const gotoAgreement = (): void => {
		showAppModal({ title: '用户协议', content: userAgreement, showCancel: false })
	}

	const gotoPrivacy = (): void => {
		showAppModal({ title: '隐私政策', content: privacyPolicy, showCancel: false })
	}

	onUnmounted(() => {
		stopSmsCooldown()
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_form_item = resolveEasyComponent("i-form-item",_easycom_i_form_item)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_i_form = resolveEasyComponent("i-form",_easycom_i_form)
const _component_i_checkbox = resolveEasyComponent("i-checkbox",_easycom_i_checkbox)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)
const _component_app_modal = resolveEasyComponent("app-modal",_easycom_app_modal)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "个人用户注册",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "content" }), [
        _cV(_component_i_form, _uM({
          modelValue: form.value,
          rules: rules,
          labelDirection: "horizontal",
          watchValidStatus: ""
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cV(_component_i_form_item, _uM({
              name: "username",
              label: "",
              required: "",
              labelDirection: "horizontal",
              labelWidth: "0"
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_i_input, _uM({
                  modelValue: form.value.username,
                  "onUpdate:modelValue": $event => {(form.value.username) = $event},
                  placeholder: "请输入账号",
                  clearable: ""
                }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
              ]),
              _: 1 /* STABLE */
            })),
            _cV(_component_i_form_item, _uM({
              name: "password",
              label: "",
              required: "",
              labelDirection: "horizontal",
              labelWidth: "0"
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_i_input, _uM({
                  modelValue: form.value.password,
                  "onUpdate:modelValue": $event => {(form.value.password) = $event},
                  placeholder: "请输入密码",
                  type: "password",
                  password: true
                }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
              ]),
              _: 1 /* STABLE */
            })),
            _cV(_component_i_form_item, _uM({
              name: "confirmPassword",
              label: "",
              required: "",
              labelDirection: "horizontal",
              labelWidth: "0"
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_i_input, _uM({
                  modelValue: form.value.confirmPassword,
                  "onUpdate:modelValue": $event => {(form.value.confirmPassword) = $event},
                  placeholder: "请再次输入密码",
                  type: "password",
                  password: true
                }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                isTrue(hasPasswordMismatch.value)
                  ? _cE("text", _uM({
                      key: 0,
                      class: "password-mismatch-tip"
                    }), "两次输入的密码不一致")
                  : _cC("v-if", true)
              ]),
              _: 1 /* STABLE */
            })),
            _cV(_component_i_form_item, _uM({
              name: "mobile",
              label: "",
              required: "",
              labelDirection: "horizontal",
              labelWidth: "0"
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_i_input, _uM({
                  modelValue: form.value.mobile,
                  "onUpdate:modelValue": $event => {(form.value.mobile) = $event},
                  placeholder: "请输入手机号",
                  type: "number",
                  maxlength: 11,
                  clearable: ""
                }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
              ]),
              _: 1 /* STABLE */
            })),
            _cV(_component_i_form_item, _uM({
              name: "smsCode",
              label: "",
              required: "",
              labelDirection: "horizontal",
              labelWidth: "0"
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_i_input, _uM({
                  class: "sms-code-input",
                  modelValue: form.value.smsCode,
                  "onUpdate:modelValue": $event => {(form.value.smsCode) = $event},
                  placeholder: "请输入4位验证码",
                  type: "number",
                  maxlength: 4,
                  clearable: ""
                }), _uM({
                  suffix: withSlotCtx((): any[] => [
                    _cE("view", _uM({
                      class: _nC(["sms-send-button", _uM({ 'sms-send-button-disabled': smsCooldown.value > 0 || smsSending.value })]),
                      onClick: requestSmsCode
                    }), [
                      _cE("text", _uM({ class: "sms-send-button-text" }), _tD(smsCooldown.value > 0 ? smsCooldown.value + '秒后重试' : '获取验证码'), 1 /* TEXT */)
                    ], 2 /* CLASS */)
                  ]),
                  _: 1 /* STABLE */
                }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
              ]),
              _: 1 /* STABLE */
            })),
            _cV(_component_i_button, _uM({
              type: "primary",
              onClick: submitRegister,
              loading: submitting.value,
              disabled: !isRegisterReady.value || submitting.value
            }), _uM({
              default: withSlotCtx((): any[] => ["注册"]),
              _: 1 /* STABLE */
            }), 8 /* PROPS */, ["loading", "disabled"])
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["modelValue"]),
        _cE("view", _uM({ class: "documents" }), [
          _cV(_component_i_checkbox, _uM({
            checked: agreementAccepted.value,
            onChange: toggleAgreement
          }), null, 8 /* PROPS */, ["checked"]),
          _cE("view", _uM({ class: "doc-info-box" }), [
            _cE("text", _uM({ class: "doc-text" }), "已阅读并同意"),
            _cE("text", _uM({
              class: "doc-link",
              onClick: gotoAgreement
            }), "《用户协议》"),
            _cE("text", _uM({ class: "doc-text" }), "和"),
            _cE("text", _uM({
              class: "doc-link",
              onClick: gotoPrivacy
            }), "《隐私政策》")
          ])
        ])
      ]),
      _cE("view", _uM({ class: "login-link-box" }), [
        _cE("text", _uM({
          class: "login-link",
          onClick: backToPersonalLogin
        }), "已有账号？去登录")
      ])
    ]),
    _cV(_component_app_toast),
    _cV(_component_app_modal)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesLoginRegisterStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#ffffff"]]))], ["content", _pS(_uM([["paddingTop", "50rpx"], ["paddingRight", "70rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "70rpx"]]))], ["sms-code-input", _pS(_uM([["width", "100%"]]))], ["password-mismatch-tip", _pS(_uM([["display", "flex"], ["marginTop", "8rpx"], ["color", "#f56c6c"], ["fontSize", "24rpx"]]))], ["sms-send-button", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"], ["height", "56rpx"], ["paddingTop", 0], ["paddingRight", "20rpx"], ["paddingBottom", 0], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "28rpx"], ["borderTopRightRadius", "28rpx"], ["borderBottomRightRadius", "28rpx"], ["borderBottomLeftRadius", "28rpx"], ["backgroundColor", "#007AFF"]]))], ["sms-send-button-disabled", _pS(_uM([["backgroundColor", "#B8D7FF"]]))], ["sms-send-button-text", _pS(_uM([["color", "#ffffff"], ["fontSize", "24rpx"], ["lineHeight", "56rpx"], ["whiteSpace", "nowrap"]]))], ["documents", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["marginTop", "40rpx"]]))], ["doc-info-box", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["whiteSpace", "nowrap"]]))], ["doc-link", _pS(_uM([["color", "#007AFF"], ["fontSize", "28rpx"]]))], ["doc-text", _pS(_uM([["fontSize", "28rpx"]]))], ["login-link-box", _pS(_uM([["display", "flex"], ["justifyContent", "center"], ["marginTop", "40rpx"]]))], ["login-link", _pS(_uM([["fontSize", "26rpx"], ["color", "#8b8c8d"], ["textAlign", "center"]]))], ["i-form-item", _pS(_uM([["paddingTop", 12], ["paddingRight", 0], ["paddingBottom", 12], ["paddingLeft", 0]]))]])]
