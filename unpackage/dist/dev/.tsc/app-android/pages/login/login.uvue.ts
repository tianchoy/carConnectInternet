import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_form_item from '@/uni_modules/i-ui-x/components/i-form-item/i-form-item.uvue'
import _easycom_i_checkbox from '@/uni_modules/i-ui-x/components/i-checkbox/i-checkbox.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_i_form from '@/uni_modules/i-ui-x/components/i-form/i-form.uvue'
import { ref, onMounted, nextTick } from 'vue'
	import { login, PostWechatlogin } from '../../api/request.uts'

	type FormData = { __$originalPosition?: UTSSourceMapPosition<"FormData", "pages/login/login.uvue", 94, 7>;
		username: string
		password: string
	}

	
const __sfc__ = defineComponent({
  __name: 'login',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const docState = ref(false)
	const pswLogin = ref(false) // true: 企业用户登录(账号密码), false: 个人用户登录(微信)
	const rememberPassword = ref(false)
	const formValid = ref(false)
	const loading = ref(false)

	// ===== 表单数据 =====
	const form = ref<FormData>({
		username: '',
		password: ''
	})

	// ===== 表单引用 =====
	// 使用 any 类型避免类型冲突
	const formRef = ref<any>(null)
	const deviceModel = ref('')

	// ===== 表单验证规则 =====
	const pswrules = {__$originalPosition: new UTSSourceMapPosition("pswrules", "pages/login/login.uvue", 110, 8),
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

	// ===== 核心功能函数 =====

	// 切换企业/个人登录
	const isPswLogin = () => {
		pswLogin.value = !pswLogin.value
		if (pswLogin.value) {
			// 切换到企业登录时，加载保存的账号
			setTimeout(() => {
				loadSavedAccount()
			}, 100)
		}
	}

	// 记住密码切换
	const toggleRememberPassword = () => {
		rememberPassword.value = !rememberPassword.value
		if (!rememberPassword.value) {
			uni.removeStorageSync('savedEnterpriseAccount')
		}
	}

	// 保存账号密码
	const saveAccountPassword = () => {
		if (rememberPassword.value && form.value.username && form.value.password) {
			const accountInfo = {__$originalPosition: new UTSSourceMapPosition("accountInfo", "pages/login/login.uvue", 151, 10),
				username: form.value.username,
				password: form.value.password,
			}
			uni.setStorageSync('savedEnterpriseAccount', accountInfo)
		} else if (!rememberPassword.value) {
			uni.removeStorageSync('savedEnterpriseAccount')
		}
	}

	// 加载保存的账号密码
	const loadSavedAccount = () => {
		try {
			const savedAccount = uni.getStorageSync('savedEnterpriseAccount')
			if (savedAccount) {
				form.value.username = savedAccount.username || ''
				form.value.password = savedAccount.password || ''
				rememberPassword.value = true
			}
		} catch (error) {
			console.error('加载保存的账号密码失败:', error, " at pages/login/login.uvue:171")
		}
	}

	// 密码过滤（只允许ASCII字符）
	const filterNonLatin = (e: any) => {
		form.value.password = e.replace(/[^\x00-\x7F]/g, '')
	}

	// 用户协议勾选
	const isDocState = () => {
		docState.value = !docState.value
	}

	// 获取系统信息
	const getSystemInfo = () => {
		const res = uni.getSystemInfoSync()
		deviceModel.value = res.deviceModel
		console.log('设备型号:', deviceModel.value, " at pages/login/login.uvue:189")
	}

	// ===== 表单验证 - 直接使用 i-form 的 validate 方法 =====
	const validateForm = (): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			console.log('开始验证表单, formRef.value:', formRef.value, " at pages/login/login.uvue:195")
			
			if (!formRef.value) {
				console.error('表单实例为空', " at pages/login/login.uvue:198")
				reject(new Error('表单实例不存在'))
				return
			}
			
			// 检查是否有 validate 方法
			if (typeof formRef.value.validate !== 'function') {
				console.error('validate 方法不存在，尝试使用其他方法', " at pages/login/login.uvue:205")
				// 有些版本可能使用不同方法名
				if (typeof formRef.value.validateForm === 'function') {
					formRef.value.validateForm((valid: boolean) => {
						console.log('validateForm 验证结果:', valid, " at pages/login/login.uvue:209")
						if (valid) {
							resolve(true)
						} else {
							reject(new Error('表单验证失败'))
						}
					})
					return
				}
				reject(new Error('表单验证方法不存在'))
				return
			}
			
			// 调用 validate 方法
			try {
				const result = formRef.value.validate()
				console.log('validate 同步返回:', result, " at pages/login/login.uvue:225")
				
				// 如果返回的是 Promise
				if (result && typeof result.then === 'function') {
					result.then((valid: boolean) => {
						console.log('validate Promise 结果:', valid, " at pages/login/login.uvue:230")
						if (valid) {
							resolve(true)
						} else {
							reject(new Error('表单验证失败'))
						}
					}).catch((err: any) => {
						console.error('validate Promise 错误:', err, " at pages/login/login.uvue:237")
						reject(err)
					})
					return
				}
				
				// 如果返回的是 boolean
				if (typeof result === 'boolean') {
					if (result) {
						resolve(true)
					} else {
						reject(new Error('表单验证失败'))
					}
					return
				}
				
				// 如果使用回调方式
				formRef.value.validate((valid: boolean, errors?: any[]) => {
					console.log('validate 回调结果:', valid, errors, " at pages/login/login.uvue:255")
					if (valid) {
						resolve(true)
					} else {
						reject(errors || new Error('表单验证失败'))
					}
				})
				
			} catch (error) {
				console.error('验证执行异常:', error, " at pages/login/login.uvue:264")
				reject(error)
			}
		})
	}

	// ===== 登录相关函数 =====

	// 个人用户登录（微信）
	const loginBt = () => {
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}
	}

	// 微信登录处理
	const handleGetPhoneNumber = async (e: any) => {
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}

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

			const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: resolve,
					fail: reject
				})
			})

			const res = await PostWechatlogin({
				code: loginRes.code,
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			})

			if (!res || !res.data) {
				uni.showToast({
					title: res?.msg || '登录失败',
					icon: 'none'
				})
				return
			}

			if (!res.data.token) {
				uni.showToast({
					title: '登录失败: 未获取到token',
					icon: 'none'
				})
				return
			}

			uni.setStorageSync('token', res.data.token)
			uni.showToast({
				title: '登录成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}, 500)

		} catch (error) {
			console.error('微信登录失败:', error, " at pages/login/login.uvue:354")
			uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 提交登录（账号密码）
	const submit = async () => {
		
		if (!docState.value) {
			uni.showToast({
				title: '请先阅读并同意用户协议',
				icon: 'error'
			})
			return
		}
		
		try {
			// 表单验证
			console.log('准备验证表单...', " at pages/login/login.uvue:377")
			await validateForm()
			console.log('✅ 表单验证通过', " at pages/login/login.uvue:379")
			
			// 构建请求参数
			const newFormData = {__$originalPosition: new UTSSourceMapPosition("newFormData", "pages/login/login.uvue", 382, 10),
				username: form.value.username,
				password: form.value.password,
				from: deviceModel.value,
				type: "USER"
			}
			console.log('📤 请求参数:', newFormData, " at pages/login/login.uvue:388")
			
			// 显示加载状态
			loading.value = true
			uni.showLoading({
				title: '登录中...',
				mask: true
			})
			
			// 调用登录接口
			console.log('🚀 开始调用 login 接口...', " at pages/login/login.uvue:398")
			const res = await login(newFormData)
			console.log('✅ 登录接口返回:', res, " at pages/login/login.uvue:400")
			
			// 隐藏加载状态
			loading.value = false
			uni.hideLoading()
			
			// 处理登录成功
			if (res && res.data && res.data.token) {
				saveAccountPassword()
				uni.setStorageSync('token', res.data.token)
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 500)
			} else {
				uni.showToast({
					title: res?.msg || '登录失败，请重试',
					icon: 'error'
				})
			}
			
		} catch (error: any) {
			console.error('❌ 登录失败:', error, " at pages/login/login.uvue:427")
			loading.value = false
			uni.hideLoading()
			
			// 判断是验证错误还是接口错误
			if (error && error.message) {
				uni.showToast({
					icon: 'error',
					title: error.message || '请填写正确的账号密码'
				})
			} else {
				uni.showToast({
					icon: 'error',
					title: '登录失败，请检查网络后重试'
				})
			}
		}
	}

	// 跳转到首页
	const gotoIndex = () => {
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}

	// ===== 协议弹窗 =====
	const gotoAgreement = () => {
		uni.showModal({
			title: '用户协议',
			content: userAgreement,
			showCancel: false,
		})
	}

	const gotoPrivacy = () => {
		uni.showModal({
			title: '隐私政策',
			content: privacyPolicy,
			showCancel: false,
		})
	}

	// ===== 生命周期 =====
	onMounted(() => {
		getSystemInfo()
		loadSavedAccount()
		console.log('pswLogin 初始值:', pswLogin.value, " at pages/login/login.uvue:474")
		console.log('formRef 初始值:', formRef.value, " at pages/login/login.uvue:475")
		
		// 延迟检查 formRef
		setTimeout(() => {
			console.log('延迟检查 formRef.value:', formRef.value, " at pages/login/login.uvue:479")
			if (formRef.value) {
				console.log('formRef 的方法:', Object.keys(formRef.value), " at pages/login/login.uvue:481")
			}
		}, 500)
	})

	// ===== 协议内容 =====
	const userAgreement = `
欢迎使用车联网平台！

一、服务条款的确认和接纳
本协议是您与车联网平台之间关于使用平台服务的协议。您使用平台服务即表示您已阅读并同意本协议的全部条款。

二、服务内容
1. 车联网平台提供车辆管理、远程控制、数据分析等服务。
2. 平台保留随时变更、中断或终止部分或全部网络服务的权利。

三、用户账号
用户应对其账号的全部行为负责，不得将账号转让或出借给他人使用。

四、用户隐私保护
保护用户隐私是平台的一项基本政策，详情请参阅《隐私政策》。

五、免责声明
1. 平台不保证服务一定能满足用户的要求，也不保证服务不会中断。
2. 对于因不可抗力造成的服务中断，平台不承担责任。

六、法律适用
本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。

如有任何疑问，请联系我们。`

	const privacyPolicy = `
车联网平台非常重视您的隐私保护！

一、信息收集
1. 我们可能收集的信息包括：手机号码、车辆信息、位置信息、设备信息等。
2. 我们会在您注册、使用服务时收集必要的信息。

二、信息使用
1. 我们使用收集的信息来提供、维护和改进服务。
2. 我们不会向第三方出售或分享您的个人信息。

三、信息保护
1. 我们采用行业标准的安全措施保护您的信息。
2. 我们会定期评估安全措施的有效性。

四、未成年人保护
我们重视未成年人的隐私保护，如您是未成年人，请在监护人指导下使用服务。

五、政策更新
我们可能会更新隐私政策，更新后的政策将在平台公布。

如有任何隐私问题，请联系我们。`

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_form_item = resolveEasyComponent("i-form-item",_easycom_i_form_item)
const _component_i_checkbox = resolveEasyComponent("i-checkbox",_easycom_i_checkbox)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_i_form = resolveEasyComponent("i-form",_easycom_i_form)

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
        ? _cE("view", _uM({ key: 0 }), [
            _cV(_component_i_form, _uM({
              ref_key: "formRef",
              ref: formRef,
              modelValue: form.value,
              rules: pswrules,
              labelDirection: "horizontal",
              watchValidStatus: "",
              "onUpdate:modelValid": ($event: any) => {formValid.value = $event}
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
                      clearable: "",
                      prefixIcon: "account-fill"
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
                      onInput: filterNonLatin,
                      placeholder: "请输入密码",
                      password: true
                    }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1 /* STABLE */
                })),
                _cE("view", _uM({ class: "remember-password" }), [
                  _cV(_component_i_checkbox, _uM({
                    checked: rememberPassword.value,
                    onChange: toggleRememberPassword,
                    label: "记住密码"
                  }), null, 8 /* PROPS */, ["checked"])
                ]),
                _cV(_component_i_button, _uM({
                  type: "primary",
                  onClick: submit,
                  loading: loading.value
                }), _uM({
                  default: withSlotCtx((): any[] => ["提交"]),
                  _: 1 /* STABLE */
                }), 8 /* PROPS */, ["loading"])
              ]),
              _: 1 /* STABLE */
            }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValid"])
          ])
        : _cE("view", _uM({ key: 1 }), [
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
      _cE("view", _uM({ class: "documents" }), [
        _cV(_component_i_checkbox, _uM({
          checked: docState.value,
          onChange: isDocState
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cE("view", _uM({ class: "doc-info-box" }), [
              " 已阅读并同意",
              _cE("text", _uM({
                class: "doc-link",
                onClick: gotoAgreement
              }), "《用户协议》"),
              "和",
              _cE("text", _uM({
                class: "doc-link",
                onClick: gotoPrivacy
              }), "《隐私政策》")
            ])
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["checked"])
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
      }), _tD(pswLogin.value ? '个人用户登录' : '企业用户登录'), 1 /* TEXT */)
    ])
  ])
}
}

})
export default __sfc__
const GenPagesLoginLoginStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#ffffff"]]))], ["banner", _uM([[".container ", _uM([["backgroundColor", "#ffffff"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["height", "20%"]])]])], ["title", _uM([[".container .banner ", _uM([["fontSize", "40rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["content", _uM([[".container ", _uM([["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "100rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "100rpx"]])]])], ["other-login", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", "30rpx"], ["marginLeft", 0], ["fontSize", "25rpx"]])]])], ["documents", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "25rpx"], ["marginTop", "40rpx"]])]])], ["doc-info-box", _uM([[".container .content .documents ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["marginLeft", 10]])]])], ["doc-link", _uM([[".container .content .documents .doc-info-box ", _uM([["color", "#007AFF"]])]])], ["remember-password", _uM([[".container .content ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", "20rpx"], ["marginLeft", 0], ["fontSize", "25rpx"]])]])], ["i-checkbox", _uM([[".container .content .remember-password ", _uM([["display", "flex"], ["alignItems", "center"]])]])], ["other-way", _uM([[".container ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["fontSize", "25rpx"], ["marginTop", "40rpx"], ["color", "#999999"]])]])], ["noLogin", _uM([[".container .other-way ", _uM([["borderRightWidth", "1rpx"], ["borderRightStyle", "solid"], ["borderRightColor", "#999999"], ["paddingRight", "50rpx"]])]])], ["BLogin", _uM([[".container .other-way ", _uM([["paddingLeft", "50rpx"]])]])], ["wechat-login-btn", _uM([[".container ", _uM([["!color", "#ffffff"]])]])], ["btn-text", _uM([[".container ", _uM([["marginLeft", 10]])]])], ["i-form-item", _uM([[".container ", _uM([["paddingTop", 12], ["paddingRight", 0], ["paddingBottom", 12], ["paddingLeft", 0]])]])]])]
