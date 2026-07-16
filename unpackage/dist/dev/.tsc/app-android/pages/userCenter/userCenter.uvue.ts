import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_i_badge from '@/uni_modules/i-ui-x/components/i-badge/i-badge.uvue'
import { getUserInfo, getUserDeviceList } from '../../api/request';
	
	
const __sfc__ = defineComponent({
  __name: 'userCenter',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const userInfo = ref({
		avatar: '/static/avatar.png',
		nickname: '',
	})
	const carsnumber = ref(0)
	const Login = ref(false)
	const version = ref('')
	
	// 可拖拽相关变量
	const moveX = ref(0)
	const moveY = ref(0)
	const windowWidth = ref(0)
	const windowHeight = ref(0)
	const buttonWidth = 120 
	const buttonHeight = 200
	
	onShow(() => {
		// 获取窗口尺寸
		const systemInfo = uni.getSystemInfoSync()
		windowWidth.value = systemInfo.windowWidth
		windowHeight.value = systemInfo.windowHeight
		
		// 设置初始位置
		moveX.value = windowWidth.value - buttonWidth - 20
		moveY.value = windowHeight.value - buttonHeight - 20
		
		// 如果有 token，加载用户信息
		const token = uni.getStorageSync('token')
		if (token) {
			Login.value = true
			loadData()
		} else {
			Login.value = false
		}
		
		// 获取小程序版本号





	})

	const contactCustomerService = () => {
		uni.openCustomerServiceChat({
			extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc030824eb947a0c9a'},
			corpId: 'ww686122ec6a4db85a',
			success(res) {
				console.log(res, " at pages/userCenter/userCenter.uvue:98")
			}
		})
	}
	
	// 加载数据
	const loadData = async () => {
		let params = {__$originalPosition: new UTSSourceMapPosition("params", "pages/userCenter/userCenter.uvue", 105, 7),}
		const res = await getUserInfo()
		userInfo.value = res.data

		const resCars = await getUserDeviceList(params)
			
		if (resCars?.data?.totalCount) {
			carsnumber.value = resCars.data.totalCount
		}
	}

	const onMoveChange = (e) => {
		const { x, y } = e.detail
		const maxX = windowWidth.value - buttonWidth
		const maxY = windowHeight.value - buttonHeight
		
		// 边界限制，防止拖出屏幕
		if (x < 0 || x > maxX || y < 0 || y > maxY) {
			moveX.value = Math.max(0, Math.min(maxX, x))
			moveY.value = Math.max(0, Math.min(maxY, y))
		}
	}
	
	// 用户信息详情
	const userInfoDetail = () => {
		if (Login.value) {
			uni.navigateTo({
				url: '/pages/userCenter/userInfo/userInfo?userInfo=' + UTSAndroid.consoleDebugError(encodeURIComponent(JSON.stringify(userInfo.value)), " at pages/userCenter/userCenter.uvue:132")
			})
		} else {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	}
	
	// 我的车辆
	const carList = () => {
		if (Login.value) {
			uni.navigateTo({
				url: '/pages/userCenter/carList/carList'
			})
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
			})
		}
	}
	
	// 平台续费
	const platformRenewal = () => {
		if (Login.value) {
			uni.navigateTo({
				url: '/pages/userCenter/payDeviceList/payDeviceList'
			})
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
			})
		}
	}

	// 产品商城
	const productMall = () => {
		if (Login.value) {
			// 跳转到网页容器页面
			uni.navigateTo({
				url: '/pages/webview/webview?url=' + UTSAndroid.consoleDebugError(encodeURIComponent('https://shop.zdiot.cn/'), " at pages/userCenter/userCenter.uvue:174")
			})
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
			})
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_i_badge = resolveEasyComponent("i-badge",_easycom_i_badge)
const _component_movable_view = resolveComponent("movable-view")
const _component_movable_area = resolveComponent("movable-area")

  return _cE("view", _uM({ class: "container" }), [
    _cV(_component_custom_navBar, _uM({
      title: "个人中心",
      "show-back": false,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false
    })),
    _cE("view", _uM({
      class: "user-info-box",
      onClick: userInfoDetail
    }), [
      _cE("view", _uM({ class: "userinfo" }), [
        _cE("view", null, [
          _cV(_component_i_icon, _uM({
            name: "/static/avatar.png",
            fontSize: "40"
          }))
        ]),
        _cE("view", _uM({ class: "user-info" }), [
          isTrue(unref(Login))
            ? _cE("text", _uM({ key: 0 }), _tD(unref(userInfo).mobile), 1 /* TEXT */)
            : _cE("text", _uM({ key: 1 }), "点击登录")
        ])
      ]),
      _cV(_component_i_icon, _uM({
        name: "/static/arrow-right.png",
        fontSize: "15"
      }))
    ]),
    isTrue(unref(Login))
      ? _cE("view", _uM({ key: 0 }), [
          _cE("view", _uM({
            class: "list",
            onClick: carList
          }), [
            _cE("view", _uM({ class: "left" }), [
              _cE("text", null, "我的车辆"),
              _cE("text", _uM({ class: "badge" }), [
                _cV(_component_i_badge, _uM({
                  type: "danger",
                  maxCount: "99",
                  count: unref(carsnumber)
                }), null, 8 /* PROPS */, ["count"])
              ])
            ]),
            _cV(_component_i_icon, _uM({
              name: "/static/arrow-right.png",
              fontSize: "15"
            }))
          ]),
          _cE("view", _uM({
            class: "list",
            onClick: platformRenewal
          }), "平台续费")
        ])
      : _cC("v-if", true),
    isTrue(unref(version))
      ? _cE("view", _uM({
          key: 1,
          class: "version"
        }), "当前版本：" + _tD(unref(version)), 1 /* TEXT */)
      : _cC("v-if", true),
    _cV(_component_movable_area, _uM({ class: "movable-area" }), _uM({
      default: withSlotCtx((): any[] => [
        _cV(_component_movable_view, _uM({
          class: "movable-view",
          direction: "all",
          x: unref(moveX),
          y: unref(moveY),
          onChange: onMoveChange
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cE("view", _uM({
              class: "contact-button-movable",
              onClick: contactCustomerService
            }), [
              _cV(_component_i_icon, _uM({
                name: "/static/server-man.png",
                fontSize: "20"
              })),
              _cE("text", _uM({ class: "contact-text" }), "人工客服"),
              _cE("text", _uM({ class: "contact-text" }), "08:00-24:00")
            ])
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["x", "y"])
      ]),
      _: 1 /* STABLE */
    }))
  ])
}
}

})
export default __sfc__
const GenPagesUserCenterUserCenterStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#ffffff"], ["position", "relative"]]))], ["user-info-box", _uM([[".container ", _uM([["width", "100%"], ["paddingTop", "40rpx"], ["paddingRight", "60rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "60rpx"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["userinfo", _uM([[".container .user-info-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]])]])], ["user-info", _uM([[".container .user-info-box ", _uM([["marginLeft", "20rpx"], ["textAlign", "center"], ["fontSize", "30rpx"], ["color", "#333333"]])]])], ["list", _uM([[".container ", _uM([["backgroundColor", "#f5f5f5"], ["paddingTop", "30rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "30rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["marginTop", "15rpx"], ["marginRight", "15rpx"], ["marginBottom", "15rpx"], ["marginLeft", "15rpx"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["fontSize", "25rpx"]])]])], ["left", _uM([[".container .list ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["badge", _uM([[".container .list .left ", _uM([["marginLeft", "20rpx"]])]])], ["version", _uM([[".container ", _uM([["position", "fixed"], ["bottom", "50rpx"], ["left", "20rpx"], ["right", "20rpx"], ["textAlign", "center"], ["fontSize", "25rpx"], ["color", "#c3c2c2ff"], ["marginTop", "20rpx"], ["marginRight", "40rpx"], ["marginBottom", 0], ["marginLeft", "40rpx"]])]])], ["movable-area", _uM([[".container ", _uM([["position", "fixed"], ["top", 0], ["left", 0], ["right", 0], ["bottom", 0], ["width", "100%"], ["height", "100%"], ["pointerEvents", "none"], ["zIndex", 999]])]])], ["movable-view", _uM([[".container .movable-area ", _uM([["width", 120], ["height", 200], ["pointerEvents", "auto"]])]])], ["contact-button-movable", _uM([[".container .movable-area .movable-view ", _uM([["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["borderTopWidth", 0], ["borderRightWidth", 0], ["borderBottomWidth", 0], ["borderLeftWidth", 0], ["borderTopStyle", "none"], ["borderRightStyle", "none"], ["borderBottomStyle", "none"], ["borderLeftStyle", "none"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"], ["backgroundImage", "none"], ["backgroundColor", "rgba(0,0,0,0)"], ["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"], ["lineHeight", 1], ["transform:active", "scale(0.95)"], ["!borderTopWidth::after", 0], ["!borderRightWidth::after", 0], ["!borderBottomWidth::after", 0], ["!borderLeftWidth::after", 0], ["!borderTopStyle::after", "none"], ["!borderRightStyle::after", "none"], ["!borderBottomStyle::after", "none"], ["!borderLeftStyle::after", "none"], ["!borderTopColor::after", "#000000"], ["!borderRightColor::after", "#000000"], ["!borderBottomColor::after", "#000000"], ["!borderLeftColor::after", "#000000"]])]])], ["contact-text", _uM([[".container .movable-area .movable-view .contact-button-movable ", _uM([["fontSize", "20rpx"], ["color", "#666666"], ["marginTop", "8rpx"], ["fontSize:first-of-type", "24rpx"], ["fontWeight:first-of-type", 500], ["color:first-of-type", "#333333"], ["marginTop:first-of-type", "12rpx"]])]])]])]
