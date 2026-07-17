import _easycom_i_empty from '@/uni_modules/i-ui-x/components/i-empty/i-empty.uvue'
import { ref } from 'vue'
	
	
const __sfc__ = defineComponent({
  __name: 'webview',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const webviewUrl = ref('')
	const emptyImage = '/static/empty.png'
	
	// 页面加载
	onLoad((options) => {
		console.log('接收到的参数:', options, " at pages/webview/webview.uvue:25")
		
		if (options.url) {
			// 解码 URL
			let decodedUrl = UTSAndroid.consoleDebugError(decodeURIComponent(options.url), " at pages/webview/webview.uvue:29")
			
			// 添加协议前缀（如果没有的话）
			if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
				decodedUrl = 'https://' + decodedUrl
			}
			
			webviewUrl.value = decodedUrl
			
			// 设置导航栏标题
			if (options.title) {
				uni.setNavigationBarTitle({
					title: UTSAndroid.consoleDebugError(decodeURIComponent(options.title), " at pages/webview/webview.uvue:41")
				})
			} else {
				// 从 URL 中提取标题
				const title = extractTitleFromUrl(decodedUrl)
				uni.setNavigationBarTitle({
					title: title || '网页加载中...'
				})
			}
		} else {
			uni.showToast({
				title: '链接地址无效',
				icon: 'none'
			})
		}
	})
	
	// 从 URL 中提取标题
	const extractTitleFromUrl = (url) => {
		try {
			const urlObj = new URL(url)
			const hostname = urlObj.hostname
			// 移除 www. 前缀
			return hostname.replace(/^www\./, '')
		} catch (e) {
			return ''
		}
	}
	
	// webview 加载成功
	const handleLoad = (e) => {
		console.log('网页加载成功', e, " at pages/webview/webview.uvue:72")
		uni.hideLoading()
	}
	
	// webview 加载错误
	const handleError = (e) => {
		console.error('网页加载失败', e, " at pages/webview/webview.uvue:78")
		uni.showToast({
			title: '页面加载失败',
			icon: 'none'
		})
	}
	
	// 接收网页传递的消息（如果网页调用了 postMessage）
	const handleMessage = (e) => {
		console.log('接收网页消息:', e.detail, " at pages/webview/webview.uvue:87")
		const data = e.detail.data
		if (data && data.length > 0) {
			// 处理网页传来的消息
			const lastMessage = data[data.length - 1]
			console.log('最后一条消息:', lastMessage, " at pages/webview/webview.uvue:92")
		}
	}
	
	// 返回上一页
	const goBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	// 页面分享配置（可选）
	onShareAppMessage(() => {
		return {
			title: '产品商城',
			path: `/pages/webview/webview?url=${UTSAndroid.consoleDebugError(encodeURIComponent(webviewUrl.value), " at pages/webview/webview.uvue:107")}`
		}
	})

return (): any | null => {

const _component_web_view = resolveComponent("web-view")
const _component_i_empty = resolveEasyComponent("i-empty",_easycom_i_empty)

  return _cE("view", _uM({ class: "webview-container" }), [
    isTrue(webviewUrl.value)
      ? _cV(_component_web_view, _uM({
          key: 0,
          src: webviewUrl.value,
          onMessage: handleMessage,
          onLoad: handleLoad,
          onError: handleError
        }), null, 8 /* PROPS */, ["src"])
      : _cE("view", _uM({
          key: 1,
          class: "error-page"
        }), [
          _cV(_component_i_empty, _uM({
            text: "页面加载失败",
            showButton: false,
            description: "",
            image: emptyImage
          })),
          _cE("button", _uM({
            class: "back-btn",
            onClick: goBack
          }), "返回上一页")
        ])
  ])
}
}

})
export default __sfc__
const GenPagesWebviewWebviewStyles = [_uM([["webview-container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#f5f5f5"]]))], ["error-page", _uM([[".webview-container ", _uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"], ["height", "100%"], ["paddingTop", "40rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "40rpx"]])]])], ["back-btn", _uM([[".webview-container .error-page ", _uM([["marginTop", "60rpx"], ["width", "400rpx"], ["backgroundColor", "#007aff"], ["color", "#ffffff"], ["borderTopLeftRadius", "44rpx"], ["borderTopRightRadius", "44rpx"], ["borderBottomRightRadius", "44rpx"], ["borderBottomLeftRadius", "44rpx"], ["fontSize", "28rpx"]])]])]])]
