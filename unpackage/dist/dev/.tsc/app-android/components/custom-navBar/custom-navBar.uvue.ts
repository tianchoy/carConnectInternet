import _easycom_uv_icon from '@/uni_modules/uv-icon/components/uv-icon/uv-icon.vue'

const __sfc__ = defineComponent({
  __name: 'custom-navBar',
  props: {
		title: String,
		showBack: { type: Boolean, default: true },
		backText: { type: String, default: '' },
		showCapsule: { type: Boolean, default: true },
		backgroundColor: { type: String, default: '#ffffff' },
		textColor: { type: String, default: '#000000' },
		isIcon: { type: Boolean, default: true },
		Icon: { type: String, default: 'plus-circle' },
		rightText: { type: String, default: '' },
		isShowStyle: { type: Boolean, default: false },
		iconColor: { type: String, default: '#606266' }
	},
  emits: ['back', 'capsuleClick'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const props = __props;

	function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}

	// 动态尺寸数据
	const statusBarHeight = ref(20);
	const navBarHeight = ref(44);
	const menuButtonInfo = ref({
		top: 4,
		right: 10,
		width: 87,
		height: 32
	});

	// 初始化尺寸数据
	const initDimensions = () => {
		const systemInfo = uni.getSystemInfoSync();
		statusBarHeight.value = systemInfo.statusBarHeight || 20;

		try {
			const menuRect = uni.getMenuButtonBoundingClientRect();
			if (menuRect) {
				menuButtonInfo.value = menuRect;
				const gap = menuRect.top - statusBarHeight.value;
				navBarHeight.value = gap * 2 + menuRect.height + 4;
			}
		} catch (e) {
			console.warn('胶囊按钮信息获取失败', e, " at components/custom-navBar/custom-navBar.uvue:75");
		}
	};

	// 返回按钮处理
	const handleBack = () => {
		const pages = getCurrentPages();
		if (pages.length > 1) {
			uni.navigateBack();
		} else {
			uni.switchTab({ url: '/pages/index/index' });
		}
		emit('back');
	};

	onMounted(initDimensions);

return (): any | null => {

const _component_uv_icon = resolveEasyComponent("uv-icon",_easycom_uv_icon)

  return _cE(Fragment, null, [
    _cE("view", _uM({
      style: _nS(_ctx.isShowStyle?_uM({ height: unref(statusBarHeight) + 'px','background-color':'#fff',position:'fixed',width:'100%',letf:0,top:0,'z-index':'100'})
		:
		_uM({ height: unref(statusBarHeight) + 'px','background-color':'#fff',}) )
    }), null, 4 /* STYLE */),
    _cE("view", _uM({
      class: "navbar",
      style: _nS(_ctx.isShowStyle?_uM({
    height: unref(navBarHeight) +'px',
    background: _ctx.backgroundColor,
	position:'fixed',width:'100%',letf:'0',top:unref(statusBarHeight) + 'px','z-index':'100'
  })
  :
  _uM({
    height: unref(navBarHeight) +'px',
    background: _ctx.backgroundColor
  }))
    }), [
      _cE("view", _uM({ class: "back-btn" }), [
        isTrue(_ctx.showBack)
          ? _cE("image", _uM({
              key: 0,
              src: "/static/back.png",
              mode: "aspectFit",
              class: "icon",
              onClick: handleBack
            }))
          : _cC("v-if", true)
      ]),
      _cE("view", _uM({
        class: "title",
        style: _nS(_uM({ color: _ctx.textColor,'line-height':unref(navBarHeight) + 'px'}))
      }), [
        renderSlot(_ctx.$slots, "title", {}, (): any[] => [_tD(_ctx.title)])
      ], 4 /* STYLE */),
      _cE("view", _uM({
        class: "capsule",
        style: _nS(_uM({
      right: 200+'rpx',
    }))
      }), [
        _cE("view", _uM({ class: "capsule-item" }), [
          isTrue(_ctx.showCapsule)
            ? _cE("view", _uM({
                key: 0,
                onClick: () => {emit('capsuleClick', 'menu')}
              }), [
                isTrue(_ctx.isIcon)
                  ? _cV(_component_uv_icon, _uM({
                      key: 0,
                      name: _ctx.Icon,
                      size: "26",
                      color: _ctx.iconColor
                    }), null, 8 /* PROPS */, ["name", "color"])
                  : _cE("text", _uM({ key: 1 }), _tD(_ctx.rightText), 1 /* TEXT */)
              ], 8 /* PROPS */, ["onClick"])
            : _cC("v-if", true)
        ])
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
export type CustomNavBarComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenComponentsCustomNavBarCustomNavBarStyles = [_uM([["navbar", _pS(_uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]]))], ["back-btn", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["width", "70rpx"], ["height", "40rpx"], ["zIndex", 10]]))], ["title", _pS(_uM([["textAlign", "center"], ["fontWeight", "bold"], ["fontSize", "36rpx"]]))], ["capsule", _pS(_uM([["textAlign", "center"]]))], ["capsule-item", _pS(_uM([["width", 40], ["height", "100%"], ["display", "flex"], ["justifyContent", "center"], ["alignItems", "center"]]))], ["icon", _pS(_uM([["width", "40rpx"], ["height", "40rpx"]]))], ["menu-icon", _pS(_uM([["width", "60rpx"], ["height", "60rpx"]]))]])]
