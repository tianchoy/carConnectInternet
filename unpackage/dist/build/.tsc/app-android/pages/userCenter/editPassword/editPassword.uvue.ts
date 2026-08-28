import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { ref } from 'vue'
	import { updatePassword } from '../../../api/request.uts'
	import { clearPushSessionState } from '../../../services/push.uts'
	import { showAppToast } from '../../../utils/toast.uts'

	type PasswordForm = {
		oldPassword: string
		newPassword: string
		confirmPassword: string
	}

	
const __sfc__ = defineComponent({
  __name: 'editPassword',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const form = ref<PasswordForm>({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	})
	const submitting = ref(false)
	const sessionEnding = ref(false)

	const isValidPassword = (password: string): boolean => {
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

	const validateForm = (): boolean => {
		if (form.value.oldPassword == '') {
			showAppToast({ title: '请输入当前密码', icon: 'none' })
			return false
		}
		if (form.value.newPassword == '') {
			showAppToast({ title: '请输入新密码', icon: 'none' })
			return false
		}
		if (!isValidPassword(form.value.newPassword)) return false
		if (form.value.oldPassword == form.value.newPassword) {
			showAppToast({ title: '新密码不能与当前密码相同', icon: 'none' })
			return false
		}
		if (form.value.confirmPassword == '') {
			showAppToast({ title: '请再次输入新密码', icon: 'none' })
			return false
		}
		if (form.value.newPassword != form.value.confirmPassword) {
			showAppToast({ title: '两次输入的密码不一致', icon: 'none' })
			return false
		}
		return true
	}

	const returnToLogin = (): void => {
		sessionEnding.value = true
		uni.removeStorageSync('token')
		clearPushSessionState()
		form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
		setTimeout(() => {
			uni.reLaunch({ url: '/pages/login/login' })
		}, 1500)
	}

	const goForgotPassword = (): void => {
		uni.navigateTo({ url: '/pages/login/forgot-password' })
	}

	const submitPasswordUpdate = async (): Promise<void> => {
		if (submitting.value || !validateForm()) return
		try {
			submitting.value = true
			const response = await updatePassword({
				oldPassword: form.value.oldPassword,
				newPassword: form.value.newPassword,
				confirmPassword: form.value.confirmPassword
			})
			if (response.code != 200) {
				showAppToast({ title: response.msg || '密码修改失败，请稍后重试', icon: 'none' })
				return
			}
			showAppToast({ title: '密码修改成功，请重新登录', icon: 'success' })
			returnToLogin()
		} catch (error) {
			if (!sessionEnding.value) {
				showAppToast({ title: '密码修改失败，请检查网络后重试', icon: 'none' })
			}
		} finally {
			if (!sessionEnding.value) submitting.value = false
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

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
        _cE("text", _uM({ class: "page-title" }), "修改密码"),
        _cE("text", _uM({ class: "page-subtitle" }), "修改后，当前及其他设备均需重新登录。"),
        _cE("view", _uM({ class: "form-section" }), [
          _cV(_component_i_input, _uM({
            modelValue: form.value.oldPassword,
            "onUpdate:modelValue": $event => {(form.value.oldPassword) = $event},
            class: "password-input",
            placeholder: "请输入当前密码",
            password: true,
            height: "110rpx",
            round: "25rpx",
            borderColor: "#d7e3ef",
            placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
            fontSize: "28rpx",
            color: "#333333"
          }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
          _cV(_component_i_input, _uM({
            modelValue: form.value.newPassword,
            "onUpdate:modelValue": $event => {(form.value.newPassword) = $event},
            class: "password-input new-password-input",
            placeholder: "请输入新密码",
            password: true,
            height: "110rpx",
            round: "25rpx",
            borderColor: "#d7e3ef",
            placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
            fontSize: "28rpx",
            color: "#333333"
          }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
          _cE("text", _uM({ class: "password-hint" }), "8–16 位，且必须包含数字、字母、特殊字符中的至少两种"),
          _cV(_component_i_input, _uM({
            modelValue: form.value.confirmPassword,
            "onUpdate:modelValue": $event => {(form.value.confirmPassword) = $event},
            class: "password-input confirm-password-input",
            placeholder: "请再次输入新密码",
            password: true,
            height: "110rpx",
            round: "25rpx",
            borderColor: "#d7e3ef",
            placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
            fontSize: "28rpx",
            color: "#333333"
          }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
        ]),
        _cV(_component_i_button, _uM({
          class: "submit-button",
          type: "primary",
          block: "",
          shape: "circle",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: submitting.value,
          onClick: submitPasswordUpdate
        }), _uM({
          default: withSlotCtx((): any[] => [" 确认修改 "]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["loading"]),
        _cE("text", _uM({
          class: "forgot-password-link",
          onClick: goForgotPassword
        }), "忘记当前密码？")
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesUserCenterEditPasswordEditPasswordStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["backgroundColor", "#fbfcfe"]]))], ["content", _pS(_uM([["paddingTop", "58rpx"], ["paddingRight", "34rpx"], ["paddingBottom", "80rpx"], ["paddingLeft", "34rpx"]]))], ["page-title", _pS(_uM([["display", "flex"], ["color", "#1f2d3d"], ["fontSize", "54rpx"], ["fontWeight", 700], ["lineHeight", "76rpx"]]))], ["page-subtitle", _pS(_uM([["display", "flex"], ["marginTop", "26rpx"], ["color", "#7f96ae"], ["fontSize", "30rpx"], ["lineHeight", "44rpx"]]))], ["form-section", _pS(_uM([["marginTop", "84rpx"]]))], ["password-input", _pS(_uM([["width", "100%"], ["borderTopLeftRadius", "25rpx"], ["borderTopRightRadius", "25rpx"], ["borderBottomRightRadius", "25rpx"], ["borderBottomLeftRadius", "25rpx"]]))], ["new-password-input", _pS(_uM([["marginTop", "28rpx"]]))], ["confirm-password-input", _pS(_uM([["marginTop", "30rpx"]]))], ["password-hint", _pS(_uM([["display", "flex"], ["marginTop", "22rpx"], ["marginRight", "6rpx"], ["marginBottom", 0], ["marginLeft", "6rpx"], ["color", "#7f96ae"], ["fontSize", "26rpx"], ["lineHeight", "40rpx"]]))], ["submit-button", _pS(_uM([["marginTop", "72rpx"]]))], ["forgot-password-link", _pS(_uM([["display", "flex"], ["justifyContent", "center"], ["marginTop", "48rpx"], ["color", "#3485df"], ["fontSize", "30rpx"], ["lineHeight", "44rpx"]]))], ["i-input", _pS(_uM([["boxSizing", "border-box"], ["paddingTop", 0], ["paddingRight", "34rpx"], ["paddingBottom", 0], ["paddingLeft", "34rpx"], ["!borderTopWidth", "2rpx"], ["!borderRightWidth", "2rpx"], ["!borderBottomWidth", "2rpx"], ["!borderLeftWidth", "2rpx"]]))], ["i-input__field", _pS(_uM([["paddingTop", 0], ["paddingBottom", 0]]))], ["i-input--focus", _pS(_uM([["!borderTopColor", "#3485df"], ["!borderRightColor", "#3485df"], ["!borderBottomColor", "#3485df"], ["!borderLeftColor", "#3485df"], ["backgroundColor", "#ffffff"]]))], ["i-input__eye", _pS(_uM([["marginLeft", "14rpx"], ["opacity", 0.78]]))], ["i-button__text", _pS(_uM([["fontSize", "38rpx"], ["fontWeight", 600], ["letterSpacing", "2rpx"]]))]])]
