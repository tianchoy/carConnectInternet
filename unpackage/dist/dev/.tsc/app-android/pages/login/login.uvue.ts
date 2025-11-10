import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_input from '@/uni_modules/uv-input/components/uv-input/uv-input.vue'
import _easycom_uv_form_item from '@/uni_modules/uv-form/components/uv-form-item/uv-form-item.vue'
import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import _easycom_uv_checkbox from '@/uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.vue'
import _easycom_uv_checkbox_group from '@/uni_modules/uv-checkbox/components/uv-checkbox-group/uv-checkbox-group.vue'
import _easycom_uv_form from '@/uni_modules/uv-form/components/uv-form/uv-form.vue'
import _easycom_uv_button from '@/uni_modules/uv-button/components/uv-button/uv-button.vue'
import { ref, onMounted } from 'vue'
	import { login, PostWechatlogin } from '../../api/request.uts'

	type FormData = { __$originalPosition?: UTSSourceMapPosition<"FormData", "pages/login/login.uvue", 74, 7>;
		username : string
		password : string
	}
	type smsFormData = { __$originalPosition?: UTSSourceMapPosition<"smsFormData", "pages/login/login.uvue", 78, 7>;
		phone : string,
		code : string
	}

	type UvFormInstance = { __$originalPosition?: UTSSourceMapPosition<"UvFormInstance", "pages/login/login.uvue", 83, 7>;
		setRules : (rules : Record<string, any>) => void
		validate : () => Promise<boolean>
	}

	
const __sfc__ = defineComponent({
  __name: 'login',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const showpw = ref(true)
	const docState = ref(false)
	const loginType = ref(true)
	const tips = ref('')
	const uCode = ref(null)
	const pswLogin = ref(false)
	const rememberPassword = ref(false) // 新增：记住密码状态

	// 定义表单类型
	const form = ref<FormData>({
		username: '',
		password: ''
	})
	const smsform = ref<smsFormData>({
		phone: '',
		code: ''
	})

	const formRef = ref<UvFormInstance | null>(null)
	const smsformRef = ref<UvFormInstance | null>(null)
	const deviceModel = ref('')

	const saveAccountPassword = () => {
		if (rememberPassword.value && form.value.username && form.value.password) {
			const accountInfo = {__$originalPosition: new UTSSourceMapPosition("accountInfo", "pages/login/login.uvue", 103, 10),
				username: form.value.username,
				password: form.value.password,
			}
			uni.setStorageSync('savedEnterpriseAccount', accountInfo)
		} else if (!rememberPassword.value) {
			uni.removeStorageSync('savedEnterpriseAccount')
		}
	}

	// 从本地存储加载账号密码
	const loadSavedAccount = () => {
		try {
			const savedAccount = uni.getStorageSync('savedEnterpriseAccount')
			if (savedAccount) {

				form.value.username = savedAccount.username || ''
				form.value.password = savedAccount.password || ''
				rememberPassword.value = true

			}
		} catch (error) {
			console.error('加载保存的账号密码失败:', error, " at pages/login/login.uvue:125")
		}
	}

	// 切换记住密码状态
	const toggleRememberPassword = () => {
		rememberPassword.value = !rememberPassword.value
		// 如果取消记住密码，立即清除保存的数据
		if (!rememberPassword.value) {
			uni.removeStorageSync('savedEnterpriseAccount')
		}
	}

	const isPswLogin = () => {
		pswLogin.value = !pswLogin.value
		// 切换到企业用户登录时，尝试加载保存的账号
		if (pswLogin.value) {
			setTimeout(() => {
				loadSavedAccount()
			}, 100)
		}
	}

	const filterNonLatin = (e) => {
		form.value.password = e.replace(/[^\x00-\x7F]/g, '')
	}

	const pswrules = {__$originalPosition: new UTSSourceMapPosition("pswrules", "pages/login/login.uvue", 152, 8),
		username: [
			{
				required: true,
				message: '请输入账号',
				trigger: ['blur', 'change']
			}
		],
		password: [
			{
				required: true,
				message: '请输入密码',
				trigger: ['blur', 'change']
			}
		]
	}

	const smsrules = {__$originalPosition: new UTSSourceMapPosition("smsrules", "pages/login/login.uvue", 169, 8),
		phone: [
			{
				required: true,
				message: '请输入手机号',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					const phoneReg = /^1[3-9]\d{9}$/
					if (!phoneReg.test(value)) {
						callback(new Error('请输入正确的手机号'))
					} else {
						callback()
					}
				},
				trigger: ['blur', 'change']
			}
		],
		code: [
			{
				required: true,
				message: '请输入验证码',
				trigger: ['blur', 'change']
			},
			{
				len: 6,
				message: '验证码长度为6位',
				trigger: ['blur', 'change']
			}
		]
	}

	const codeChange = (text) => {
		tips.value = text
	}

	const getCode = () => {
		// 1. 先检查手机号是否为空
		if (!smsform.value.phone) {
			uni.showToast({
				title: '请先输入手机号',
				icon: 'none'
			})
			return
		}

		// 2. 验证手机号格式是否正确
		const phoneReg = /^1[3-9]\d{9}$/
		if (!phoneReg.test(smsform.value.phone)) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return
		}

		// 3. 检查是否在冷却期内
		if (!uCode.value?.canGetCode) {
			uni.showToast({
				title: '请稍后再试',
				icon: 'none'
			})
			return
		}

		// 所有验证通过，开始获取验证码
		uni.showLoading({
			title: '验证码发送中...'
		})

		// 模拟请求
		setTimeout(() => {
			uni.hideLoading()
			uCode.value.start() // 启动倒计时
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			})
		}, 1000)
	}

	const showpwfun = () => {
		showpw.value = !showpw.value
	}

	const isDocState = () => {
		console.log('docState.value:', docState.value, " at pages/login/login.uvue:256")
		docState.value = !docState.value
	}

	const smsLogin = () => {
		loginType.value = !loginType.value
	}

	//获取系统信息
	const getSystemInfo = () => {
		const res = uni.getSystemInfoSync()
		deviceModel.value = res.deviceModel
	}

	onMounted(() => {
		getSystemInfo()
		if (formRef.value) {
			formRef.value.setRules(pswrules)
		}
		if (smsformRef.value) {
			smsformRef.value.setRules(smsrules)
		}
		// 页面加载时尝试加载保存的企业账号
		loadSavedAccount()
	})

	const loginBt = () => {
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}
	}
	const gotoIndex = () => {
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}

	// 微信登录处理函数
	const handleGetPhoneNumber = async (e) => {
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}

		// 处理授权结果
		if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
			uni.showToast({
				title: '您拒绝了授权',
				icon: 'none'
			})
			return
		}

		if (e.detail.errMsg !== 'getPhoneNumber:ok') {
			uni.showToast({
				title: '获取手机号失败',
				icon: 'none'
			})
			return
		}

		try {
			uni.showLoading({ title: '登录中...' })

			// 1. 获取微信登录code
			const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: resolve,
					fail: reject
				})
			})

			// 2. 发送到后端解密处理
			const res = await PostWechatlogin({
				code: loginRes.code,
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			})

			// 3. 检查返回数据是否有效
			if (!res) {
				throw new Error('接口返回数据为空')
			}

			if (!res.data) {
				throw new Error('接口返回数据: data为null')
			}

			if (!res.data.token) {
				throw new Error('登录失败: 未获取到token')
			}

			// 4. 登录成功处理
			uni.setStorageSync('token', res.data.token)
			uni.reLaunch({
				url: '/pages/index/index'
			})

		} catch (error) {
			console.error('微信登录失败:', error, " at pages/login/login.uvue:363")
			uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	const submit = () => {
		console.log(docState.value, " at pages/login/login.uvue:374")
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}

		if (loginType.value) {
			// 账号密码登录
			formRef.value?.validate().then(res => {
				const newFormData = {__$originalPosition: new UTSSourceMapPosition("newFormData", "pages/login/login.uvue", 386, 11),
					...form.value,
					from: deviceModel.value,
					type: "USER"
				}
				// 请求登陆接口
				login(newFormData).then(res => {
					// 登录成功后保存账号密码（如果勾选了记住密码）
					saveAccountPassword()

					uni.setStorageSync('token', res.data.token)
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}).catch(err => {
					uni.showToast({
						title: err.msg || '登录失败',
						icon: 'error'
					})
				})
			}).catch(errors => {
				uni.showToast({
					icon: 'error',
					title: '请填写正确的账号密码'
				})
			})
		} else {
			// 短信验证码登录
			smsformRef.value?.validate().then(res => {
				const params = {__$originalPosition: new UTSSourceMapPosition("params", "pages/login/login.uvue", 415, 11),
					phone: smsform.value.phone,
					code: smsform.value.code,
					from: deviceModel.value,
					type: "SMS"
				}
				// 请求短信登录接口
				// apiSmsLogin(params).then(res => {
				// 	uni.setStorageSync('token', res.data.token)
				// 	uni.reLaunch({
				// 		url: '/pages/index/index'
				// 	})
				// }).catch(err => {
				// 	uni.showToast({
				// 		title: err.message || '登录失败',
				// 		icon: 'error'
				// 	})
				// })
			}).catch(errors => {
				uni.showToast({
					icon: 'error',
					title: '请填写正确的手机号和验证码'
				})
			})
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_uv_input = resolveEasyComponent("uv-input",_easycom_uv_input)
const _component_uv_form_item = resolveEasyComponent("uv-form-item",_easycom_uv_form_item)
const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)
const _component_uv_checkbox = resolveEasyComponent("uv-checkbox",_easycom_uv_checkbox)
const _component_uv_checkbox_group = resolveEasyComponent("uv-checkbox-group",_easycom_uv_checkbox_group)
const _component_uv_form = resolveEasyComponent("uv-form",_easycom_uv_form)
const _component_uv_button = resolveEasyComponent("uv-button",_easycom_uv_button)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "登陆",
      "show-back": false,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false
    })),
    _cE("view", _uM({ class: "banner" }), [
      _cE("image", _uM({
        src: "/static/car_location.png",
        mode: "aspectFill"
      })),
      _cE("text", _uM({ class: "title" }), "车联网")
    ]),
    _cE("view", _uM({ class: "content" }), [
      isTrue(pswLogin.value)
        ? _cV(_component_uv_form, _uM({
            key: 0,
            model: form.value,
            rules: pswrules,
            ref_key: "formRef",
            ref: formRef
          }), _uM({
            default: withSlotCtx((): any[] => [
              _cV(_component_uv_form_item, _uM({
                label: "",
                prop: "username",
                labelWidth: "0"
              }), _uM({
                default: withSlotCtx((): any[] => [
                  _cV(_component_uv_input, _uM({
                    prefixIcon: "account-fill",
                    modelValue: form.value.username,
                    "onUpdate:modelValue": $event => {(form.value.username) = $event},
                    type: _ctx.text,
                    placeholder: "请输入账号"
                  }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "type"])
                ]),
                _: 1 /* STABLE */
              })),
              _cV(_component_uv_form_item, _uM({
                label: "",
                prop: "password",
                labelWidth: "0"
              }), _uM({
                default: withSlotCtx((): any[] => [
                  _cV(_component_uv_input, _uM({
                    prefixIcon: "lock-fill",
                    modelValue: form.value.password,
                    "onUpdate:modelValue": $event => {(form.value.password) = $event},
                    type: showpw.value?'password':'text',
                    onInput: filterNonLatin,
                    placeholder: "请输入密码",
                    password: showpw.value,
                    customStyle: "border:1rpx solid red;height:80rpx"
                  }), _uM({
                    suffix: withSlotCtx((): any[] => [
                      _cV(_component_uv_icon, _uM({
                        name: showpw.value?'eye-off-outline':'eye',
                        size: "20",
                        onClick: showpwfun
                      }), null, 8 /* PROPS */, ["name"])
                    ]),
                    _: 1 /* STABLE */
                  }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "type", "password"])
                ]),
                _: 1 /* STABLE */
              })),
              isTrue(pswLogin.value)
                ? _cE("view", _uM({
                    key: 0,
                    class: "remember-password"
                  }), [
                    _cV(_component_uv_checkbox_group, null, _uM({
                      default: withSlotCtx((): any[] => [
                        _cV(_component_uv_checkbox, _uM({
                          checked: rememberPassword.value,
                          onChange: toggleRememberPassword
                        }), null, 8 /* PROPS */, ["checked"]),
                        _cE("view", _uM({ class: "remember-text" }), "记住密码")
                      ]),
                      _: 1 /* STABLE */
                    }))
                  ])
                : _cC("v-if", true)
            ]),
            _: 1 /* STABLE */
          }), 8 /* PROPS */, ["model"])
        : _cC("v-if", true),
      isTrue(pswLogin.value)
        ? _cV(_component_uv_button, _uM({
            key: 1,
            type: "primary",
            onClick: submit
          }), _uM({
            default: withSlotCtx((): any[] => ["提交"]),
            _: 1 /* STABLE */
          }))
        : _cE("view", _uM({ key: 2 }), [
            isTrue(!docState.value)
              ? _cE("button", _uM({
                  key: 0,
                  type: "primary",
                  plain: "true",
                  onClick: loginBt
                }), " 个人用户登录 ")
              : _cC("v-if", true),
            isTrue(docState.value)
              ? _cE("button", _uM({
                  key: 1,
                  "open-type": "getPhoneNumber",
                  type: "primary",
                  plain: "true",
                  onGetphonenumber: handleGetPhoneNumber
                }), " 个人用户登录 ", 32 /* NEED_HYDRATION */)
              : _cC("v-if", true)
          ]),
      _cE("view", _uM({
        class: "documents",
        onClick: isDocState
      }), [
        _cV(_component_uv_checkbox_group, null, _uM({
          default: withSlotCtx((): any[] => [
            _cV(_component_uv_checkbox, _uM({
              checked: docState.value,
              onChange: isDocState
            }), null, 8 /* PROPS */, ["checked"]),
            _cE("view", _uM({ class: "doc-info-box" }), " 已阅读并同意《用户协议》《隐私政策》 ")
          ]),
          _: 1 /* STABLE */
        }))
      ])
    ]),
    _cE("view", _uM({ class: "other-way" }), [
      _cE("view", _uM({
        class: "noLogin",
        onClick: gotoIndex
      }), "暂不登录"),
      _cE("view", _uM({
        class: "BLogin",
        onClick: isPswLogin
      }), _tD(pswLogin.value?'个人用户登录':'企业用户登录'), 1 /* TEXT */)
    ])
  ])
}
}

})
export default __sfc__
const GenPagesLoginLoginStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#ffffff"]]))], ["banner", _uM([[".container ", _uM([["backgroundColor", "#ffffff"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["height", "20%"]])]])], ["title", _uM([[".container .banner ", _uM([["fontSize", "40rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["content", _uM([[".container ", _uM([["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "100rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "100rpx"]])]])], ["other-login", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", "30rpx"], ["marginLeft", 0], ["fontSize", "25rpx"]])]])], ["documents", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "25rpx"], ["marginTop", "40rpx"]])]])], ["remember-password", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", "20rpx"], ["marginLeft", 0], ["fontSize", "25rpx"]])]])], ["remember-text", _uM([[".container .content .remember-password ", _uM([["marginLeft", "10rpx"], ["color", "#666666"]])]])], ["other-way", _uM([[".container ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "25rpx"], ["marginTop", "40rpx"], ["color", "#999999"]])]])], ["noLogin", _uM([[".container .other-way ", _uM([["borderRightWidth", "1rpx"], ["borderRightStyle", "solid"], ["borderRightColor", "#999999"], ["paddingRight", "50rpx"]])]])], ["BLogin", _uM([[".container .other-way ", _uM([["paddingLeft", "50rpx"]])]])], ["wechat-login-btn", _uM([[".container ", _uM([["!color", "#ffffff"]])]])], ["btn-text", _uM([[".container ", _uM([["marginLeft", 10]])]])]])]
