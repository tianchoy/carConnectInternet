import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_checkbox from '@/uni_modules/i-ui-x/components/i-checkbox/i-checkbox.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import _easycom_app_modal from '@/components/app-modal/app-modal.uvue'
import { ref, computed, onUnmounted } from 'vue'
	import { showAppToast } from '../../utils/toast.uts'
	import { showAppModal } from '../../utils/modal.uts'
	import { sendSmsRegisterCode, registerPersonalUser } from '../../api/request.uts'
	import { resetTokenExpiredState } from '../../api/http.uts'
	import { schedulePostLoginInitialization } from '../../services/app-startup.uts'
	import { userAgreement, privacyPolicy } from '../../utils/legal.uts'

	type RegisterForm = { __$originalPosition?: UTSSourceMapPosition<"RegisterForm", "pages/login/register.uvue", 117, 7>;
		password: string
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
		password: '',
		mobile: '',
		smsCode: ''
	})
	const agreementAccepted = ref(false)
	const smsCooldown = ref(0)
	const smsSending = ref(false)
	const submitting = ref(false)
	let smsCooldownTimer: number | null = null

	const isRegisterSubmitReady = computed<boolean>(() => {
		const password = form.value.password
		let categoryCount = 0
		if (/[0-9]/.test(password)) categoryCount += 1
		if (/[A-Za-z]/.test(password)) categoryCount += 1
		if (/[^A-Za-z0-9]/.test(password)) categoryCount += 1

		return /^1[3-9]\d{9}$/.test(form.value.mobile)
			&& /^\d{6}$/.test(form.value.smsCode)
			&& password.length >= 8
			&& password.length <= 16
			&& categoryCount >= 2
			&& agreementAccepted.value
			&& !submitting.value
	})

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
		if (!/^\d{6}$/.test(form.value.smsCode)) {
			showAppToast({ title: '请输入6位短信验证码', icon: 'none' })
			return false
		}
		return true
	}

	const isValidPassword = (): boolean => {
		const password = form.value.password
		if (password.length < 8 || password.length > 16) {
			showAppToast({ title: '密码长度应为8至16位', icon: 'none' })
			return false
		}
		let categoryCount = 0
		if (/[0-9]/.test(password)) categoryCount += 1
		if (/[A-Za-z]/.test(password)) categoryCount += 1
		if (/[^A-Za-z0-9]/.test(password)) categoryCount += 1
		if (categoryCount < 2) {
			showAppToast({ title: '密码需包含至少两种字符类型', icon: 'none' })
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
		if (!isValidMobile()) return false
		if (!isValidSmsCode()) return false
		if (form.value.password == '') {
			showAppToast({ title: '请设置登录密码', icon: 'none' })
			return false
		}
		if (!isValidPassword()) return false
		if (!agreementAccepted.value) {
			showAppToast({ title: '请先阅读并同意用户协议', icon: 'none' })
			return false
		}
		return true
	}

	const completeLogin = (token: string): void => {
		if (token == '') {
			showAppToast({ title: '注册失败，请重试', icon: 'none' })
			return
		}
		uni.setStorageSync('token', token)
		resetTokenExpiredState()
		showAppToast({ title: '注册成功', icon: 'success' })
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/index/index',
				success: () => {
					schedulePostLoginInitialization()
				}
			})
		}, 500)
	}

	const submitRegister = async (): Promise<void> => {
		if (submitting.value || !validateForm()) return
		try {
			submitting.value = true
			const response = await registerPersonalUser({
				password: form.value.password,
				confirmPassword: form.value.password,
				phonenumber: form.value.mobile,
				smsCode: form.value.smsCode
			})
			const token = response.data != null ? response.data.getString('access_token', '') : ''
			if (response.code == 200 && token != '') {
				completeLogin(token)
				return
			}
			showAppToast({ title: response.msg || '注册失败，请稍后重试', icon: 'none' })
		} catch (error) {
			showAppToast({ title: '注册失败，请检查网络后重试', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}

	const backToLogin = (): void => {
		uni.reLaunch({ url: '/pages/login/login' })
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
const _component_i_checkbox = resolveEasyComponent("i-checkbox",_easycom_i_checkbox)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)
const _component_app_modal = resolveEasyComponent("app-modal",_easycom_app_modal)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "",
        "show-back": true,
        backgroundColor: "#fbfcfe",
        textColor: "#333333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "content" }), [
        _cE("text", _uM({ class: "page-title" }), "注册账号"),
        _cV(_component_i_input, _uM({
          modelValue: form.value.mobile,
          "onUpdate:modelValue": $event => {(form.value.mobile) = $event},
          class: "register-input",
          placeholder: "请输入手机号",
          type: "number",
          maxlength: 11,
          round: "25rpx",
          clearable: "",
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333"
        }), _uM({
          prefix: withSlotCtx((): any[] => [
            _cE("text", _uM({ class: "country-code" }), "+86")
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
        _cV(_component_i_input, _uM({
          modelValue: form.value.smsCode,
          "onUpdate:modelValue": $event => {(form.value.smsCode) = $event},
          class: "register-input sms-code-input",
          placeholder: "请输入6位短信验证码",
          type: "number",
          maxlength: 6,
          round: "25rpx",
          clearable: "",
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333"
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
        }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
        _cV(_component_i_input, _uM({
          modelValue: form.value.password,
          "onUpdate:modelValue": $event => {(form.value.password) = $event},
          class: "register-input password-input",
          placeholder: "请设置登录密码",
          password: true,
          round: "25rpx",
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333"
        }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
        _cE("text", _uM({ class: "password-hint" }), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
        _cE("view", _uM({ class: "documents" }), [
          _cV(_component_i_checkbox, _uM({
            checked: agreementAccepted.value,
            onChange: toggleAgreement,
            size: "40rpx",
            round: "25rpx",
            iconSize: "28rpx",
            activeColor: "#3485df",
            inactiveColor: "#a9bfd7"
          }), null, 8 /* PROPS */, ["checked"]),
          _cE("view", _uM({ class: "doc-info-box" }), [
            _cE("text", _uM({ class: "doc-text" }), "我已阅读并同意"),
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
        ]),
        _cV(_component_i_button, _uM({
          class: "submit-button",
          type: "primary",
          block: "",
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: submitting.value,
          disabled: !isRegisterSubmitReady.value,
          onClick: submitRegister
        }), _uM({
          default: withSlotCtx((): any[] => [" 注册并登录 "]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["loading", "disabled"]),
        _cE("view", _uM({
          class: "login-link-box",
          onClick: backToLogin
        }), [
          _cE("text", _uM({ class: "login-link" }), "已有账号？去登录")
        ])
      ])
    ]),
    _cV(_component_app_toast),
    _cV(_component_app_modal)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesLoginRegisterStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["backgroundColor", "#fbfcfe"]]))], ["content", _pS(_uM([["paddingTop", "50rpx"], ["paddingRight", "32rpx"], ["paddingBottom", 0], ["paddingLeft", "32rpx"]]))], ["page-title", _pS(_uM([["display", "flex"], ["color", "#1f2d3d"], ["fontSize", "54rpx"], ["fontWeight", 700], ["lineHeight", "76rpx"]]))], ["register-input", _pS(_uM([["width", "100%"], ["borderTopLeftRadius", "25rpx"], ["borderTopRightRadius", "25rpx"], ["borderBottomRightRadius", "25rpx"], ["borderBottomLeftRadius", "25rpx"], ["marginTop", "52rpx"]]))], ["sms-code-input", _pS(_uM([["marginTop", "28rpx"]]))], ["password-input", _pS(_uM([["marginTop", "28rpx"]]))], ["country-code", _pS(_uM([["color", "#5d7a9b"], ["fontSize", "34rpx"], ["fontWeight", 500], ["marginRight", "20rpx"]]))], ["sms-send-button", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"], ["height", "58rpx"], ["paddingTop", 0], ["paddingRight", "18rpx"], ["paddingBottom", 0], ["paddingLeft", "18rpx"], ["borderTopLeftRadius", "29rpx"], ["borderTopRightRadius", "29rpx"], ["borderBottomRightRadius", "29rpx"], ["borderBottomLeftRadius", "29rpx"]]))], ["sms-send-button-disabled", _pS(_uM([["opacity", 0.45]]))], ["sms-send-button-text", _pS(_uM([["color", "#1878e5"], ["fontSize", "30rpx"], ["fontWeight", 600], ["lineHeight", "58rpx"], ["whiteSpace", "nowrap"]]))], ["password-hint", _pS(_uM([["display", "flex"], ["marginTop", "22rpx"], ["marginRight", "6rpx"], ["marginBottom", 0], ["marginLeft", "6rpx"], ["color", "#7f96ae"], ["fontSize", "26rpx"], ["lineHeight", "40rpx"]]))], ["documents", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["marginTop", "38rpx"]]))], ["doc-info-box", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["whiteSpace", "nowrap"]]))], ["doc-text", _pS(_uM([["fontSize", "30rpx"], ["lineHeight", "44rpx"], ["color", "#8397ad"]]))], ["doc-link", _pS(_uM([["fontSize", "30rpx"], ["lineHeight", "44rpx"], ["color", "#1878e5"]]))], ["submit-button", _pS(_uM([["marginTop", "46rpx"]]))], ["login-link-box", _pS(_uM([["display", "flex"], ["justifyContent", "center"], ["marginTop", "52rpx"]]))], ["login-link", _pS(_uM([["color", "#3485df"], ["fontSize", "30rpx"], ["lineHeight", "48rpx"], ["textAlign", "center"]]))], ["i-input", _pS(_uM([["boxSizing", "border-box"]]))], ["i-input__field", _pS(_uM([["paddingTop", 0], ["paddingBottom", 0]]))], ["i-checkbox", _pS(_uM([["minHeight", "44rpx"]]))], ["i-button__text", _pS(_uM([["fontSize", "38rpx"], ["fontWeight", 600]]))]])]
