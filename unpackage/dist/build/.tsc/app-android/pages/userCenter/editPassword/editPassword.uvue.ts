import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_input from '@/uni_modules/uv-input/components/uv-input/uv-input.vue'
import _easycom_uv_form_item from '@/uni_modules/uv-form/components/uv-form-item/uv-form-item.vue'
import _easycom_uv_form from '@/uni_modules/uv-form/components/uv-form/uv-form.vue'
import _easycom_uv_button from '@/uni_modules/uv-button/components/uv-button/uv-button.vue'
import {changePassWord} from '../../../api/request.uts'
	type UserInfo = {
		id : string,
		mobile : string,
	}
	
const __sfc__ = defineComponent({
  __name: 'editPassword',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const userInfo = ref<UserInfo>({
		id: "",
		mobile: ""
	})// 表单数据
	const formData = ref({
		password: '',
		newPassword: '',
		confirmPassword: ''
	});

	// 表单引用
	const formRef = ref(null);

	// 验证规则
	const validateConfirmPassword = (rule, value, callback) => {
		if (value !== formData.value.newPassword) {
			callback(new Error('两次输入的密码不一致'));
		} else {
			callback();
		}
	};

	const rules = {
		password: [
			{ required: true, message: '请输入原密码', trigger: 'blur' },
			{ min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
		],
		newPassword: [
			{ required: true, message: '请输入新密码', trigger: 'blur' },
			{ min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/,
				message: '密码需包含大小写字母和数字',
				trigger: 'blur'
			}
		],
		confirmPassword: [
			{ required: true, message: '请确认新密码', trigger: 'blur' },
			{ validator: validateConfirmPassword, trigger: 'blur' }
		]
	};

	// 提交表单
	const handleSubmit = async () => {
		try {
			await formRef.value.validate();
			uni.showLoading({ title: '提交中...', mask: true });

			const submitData = {
				password: formData.value.password,
				newPassword: formData.value.newPassword
			}

			const res = await changePassWord(submitData)
			
			if(res.msg == 'success'){
				uni.hideLoading();
				uni.showToast({
					title: '密码修改成功',
					icon: 'success',
					duration: 2000
				});
				
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}else{
				uni.hideLoading();
				uni.showToast({
					title: '密码修改失败',
					icon: 'error',
					duration: 2000
				});
			}

			
		} catch (error) {
			uni.hideLoading();
			if (error) {
				uni.showToast({
					title: error[0].message || '表单验证失败',
					icon: 'none',
					duration: 2000
				});
			}
		}
	};

	onLoad((options) => {
		if (options.userInfo) {
			try {
				const parsedInfo = JSON.parse(decodeURIComponent(options.userInfo)) as UTSJSONObject
				console.log(parsedInfo)
				userInfo.value = {
					id: parsedInfo.getString("userId") || "",
					mobile: parsedInfo.getString("mobile") || ""
				}
				console.log("用户信息:", userInfo.value)
			} catch (e) {
				console.error("解析用户信息失败:", e)
			}
		}
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_uv_input = resolveEasyComponent("uv-input",_easycom_uv_input)
const _component_uv_form_item = resolveEasyComponent("uv-form-item",_easycom_uv_form_item)
const _component_uv_form = resolveEasyComponent("uv-form",_easycom_uv_form)
const _component_uv_button = resolveEasyComponent("uv-button",_easycom_uv_button)

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "修改密码",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false
    })),
    _cE("view", _uM({ class: "content" }), [
      _cV(_component_uv_form, _uM({
        labelPosition: "left",
        model: unref(formData),
        rules: rules,
        ref_key: "formRef",
        ref: formRef
      }), _uM({
        default: withSlotCtx((): any[] => [
          _cV(_component_uv_form_item, _uM({
            label: "原密码",
            labelWidth: "80",
            prop: "password",
            borderBottom: ""
          }), _uM({
            default: withSlotCtx((): any[] => [
              _cV(_component_uv_input, _uM({
                modelValue: unref(formData).password,
                "onUpdate:modelValue": $event => {(unref(formData).password) = $event},
                placeholder: "请输入原密码",
                border: "none",
                type: "password",
                password: "",
                customStyle: "padding:20rpx"
              }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
            ]),
            _: 1 /* STABLE */
          })),
          _cV(_component_uv_form_item, _uM({
            label: "新密码",
            labelWidth: "80",
            prop: "newPassword",
            borderBottom: ""
          }), _uM({
            default: withSlotCtx((): any[] => [
              _cV(_component_uv_input, _uM({
                modelValue: unref(formData).newPassword,
                "onUpdate:modelValue": $event => {(unref(formData).newPassword) = $event},
                placeholder: "请输入新密码",
                border: "none",
                type: "password",
                password: "",
                customStyle: "padding:20rpx"
              }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
            ]),
            _: 1 /* STABLE */
          })),
          _cV(_component_uv_form_item, _uM({
            label: "确认密码",
            labelWidth: "80",
            prop: "confirmPassword"
          }), _uM({
            default: withSlotCtx((): any[] => [
              _cV(_component_uv_input, _uM({
                modelValue: unref(formData).confirmPassword,
                "onUpdate:modelValue": $event => {(unref(formData).confirmPassword) = $event},
                placeholder: "请再次输入新密码",
                border: "none",
                type: "password",
                password: "",
                customStyle: "padding:20rpx"
              }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
            ]),
            _: 1 /* STABLE */
          }))
        ]),
        _: 1 /* STABLE */
      }), 8 /* PROPS */, ["model"])
    ]),
    _cE("view", _uM({ class: "btn" }), [
      _cV(_component_uv_button, _uM({
        type: "primary",
        text: "提交修改",
        onClick: handleSubmit
      }))
    ])
  ])
}
}

})
export default __sfc__
const GenPagesUserCenterEditPasswordEditPasswordStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["backgroundColor", "#f5f5f5"]]))], ["content", _uM([[".container ", _uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"], ["paddingTop", "20rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "40rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["btn", _uM([[".container ", _uM([["marginTop", "50rpx"], ["marginRight", "20rpx"], ["marginBottom", 0], ["marginLeft", "20rpx"]])]])]])]
