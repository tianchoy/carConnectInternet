import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../../utils/toast.uts'
	import {logout} from '../../../api/request.uts'
	type UserInfo = { __$originalPosition?: UTSSourceMapPosition<"UserInfo", "pages/userCenter/userInfo/userInfo.uvue", 55, 7>;
		id : string,
		mobile : string,
		type: number,
		createTime:string,
	}
	
const __sfc__ = defineComponent({
  __name: 'userInfo',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const userInfo = ref<UserInfo>({
		id: "",
		mobile: "",
		type: 0,
		createTime:""
	})

	onLoad((options) => {
		if (options.userInfo != null) {
			try {
				const parsedInfo = UTSAndroid.consoleDebugError(JSON.parse(UTSAndroid.consoleDebugError(decodeURIComponent(options.userInfo as string), " at pages/userCenter/userInfo/userInfo.uvue:71") as string), " at pages/userCenter/userInfo/userInfo.uvue:71") as UTSJSONObject
				const userId = parsedInfo.getString("userId")
				const mobile = parsedInfo.getString("mobile")
				const type = parsedInfo.getNumber("type")
				const createTime = parsedInfo.getString("createTime")
				userInfo.value = {
					id: userId != null ? userId : "",
					mobile: mobile != null ? mobile : "",
					type: type != null ? type : 0,
					createTime: createTime != null ? createTime : ""
				}
				console.log("用户信息:", userInfo.value, " at pages/userCenter/userInfo/userInfo.uvue:82")
			} catch (e) {
				console.error("解析用户信息失败:", e, " at pages/userCenter/userInfo/userInfo.uvue:84")
			}
		}
	})

	const editPassword = () => {
		uni.navigateTo({
			url:'/pages/userCenter/editPassword/editPassword'
		})
	}

	// 退出登录方法
	const logoutBtn = async () => {
		const res = await logout()
		if(res.code == 0){
			uni.removeStorageSync('token')
			uni.reLaunch({
				url:'/pages/login/login'
			})
		}else{
			showAppToast({
				title:'退出账户失败'
			})
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "个人信息",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "content" }), [
        _cE("view", _uM({ class: "title" }), " 基本信息 "),
        _cE("view", _uM({ class: "list" }), [
          _cE("view", _uM({ class: "item" }), [
            _cE("text", null, "账号"),
            _cE("view", _uM({ class: "right" }), [
              _cE("text", _uM({ class: "info" }), _tD(unref(userInfo).id), 1 /* TEXT */)
            ])
          ]),
          _cE("view", _uM({ class: "item" }), [
            _cE("text", null, "手机号"),
            _cE("view", _uM({ class: "right" }), [
              _cE("text", _uM({ class: "info" }), _tD(unref(userInfo).mobile), 1 /* TEXT */)
            ])
          ]),
          _cE("view", _uM({ class: "item" }), [
            _cE("text", null, "类型"),
            _cE("view", _uM({ class: "right" }), [
              _cE("text", _uM({ class: "info" }), _tD(unref(userInfo).type == 1 ? '公司用户' : '个人用户'), 1 /* TEXT */)
            ])
          ]),
          _cE("view", _uM({ class: "item" }), [
            _cE("text", null, "创建时间"),
            _cE("view", _uM({ class: "right" }), [
              _cE("text", _uM({ class: "info" }), _tD(unref(userInfo).createTime), 1 /* TEXT */)
            ])
          ])
        ]),
        unref(userInfo).type == 1
          ? _cE("view", _uM({
              key: 0,
              class: "title"
            }), " 安全信息 ")
          : _cC("v-if", true),
        unref(userInfo).type == 1
          ? _cE("view", _uM({
              key: 1,
              class: "list",
              onClick: editPassword
            }), [
              _cE("view", _uM({ class: "item" }), [
                _cE("text", null, "修改密码"),
                _cV(_component_i_icon, _uM({
                  name: "/static/arrow-right.png",
                  fontSize: "15"
                }))
              ])
            ])
          : _cC("v-if", true),
        _cE("view", _uM({ class: "footer" }), [
          _cE("view", _uM({
            class: "logout",
            onClick: logoutBtn
          }), "退出登录")
        ])
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesUserCenterUserInfoUserInfoStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#f5f5f5"], ["position", "relative"]]))], ["content", _uM([[".container ", _uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "120rpx"], ["paddingLeft", "20rpx"]])]])], ["title", _uM([[".container .content ", _uM([["color", "#666666"], ["fontSize", "26rpx"], ["marginTop", "30rpx"], ["marginRight", 0], ["marginBottom", "20rpx"], ["marginLeft", 0]])]])], ["list", _uM([[".container .content ", _uM([["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"]])]])], ["item", _uM([[".container .content .list ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "10rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#e5e5e5"]])]])], ["right", _uM([[".container .content .list .item ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["info", _uM([[".container .content .list .item .right ", _uM([["marginRight", "10rpx"]])]])], ["footer", _uM([[".container .content ", _uM([["position", "fixed"], ["bottom", "100rpx"], ["left", "20rpx"], ["right", "20rpx"]])]])], ["logout", _uM([[".container .content .footer ", _uM([["width", "100%"], ["height", "90rpx"], ["lineHeight", "90rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#f56c6c"], ["borderRightColor", "#f56c6c"], ["borderBottomColor", "#f56c6c"], ["borderLeftColor", "#f56c6c"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["color", "#f56c6c"], ["textAlign", "center"], ["backgroundColor", "#ffffff"], ["fontSize", "32rpx"]])]])]])]
