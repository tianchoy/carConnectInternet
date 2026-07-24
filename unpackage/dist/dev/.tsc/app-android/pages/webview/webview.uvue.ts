import _easycom_i_empty from '@/uni_modules/i-ui-x/components/i-empty/i-empty.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
	import { ref } from 'vue'

	
const __sfc__ = defineComponent({
  __name: 'webview',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const webviewUrl = ref('')
	const emptyImage = '/static/empty.png'

	// 从 URL 中提取标题
	function extractTitleFromUrl(url : string) : string {
		let hostname = url
		const protocolIndex = hostname.indexOf('://')
		if (protocolIndex >= 0) {
			hostname = hostname.substring(protocolIndex + 3)
		}
		const pathIndex = hostname.indexOf('/')
		if (pathIndex >= 0) {
			hostname = hostname.substring(0, pathIndex)
		}
		if (hostname.startsWith('www.')) {
			hostname = hostname.substring(4)
		}
		return hostname
	}

	// 页面加载
	onLoad((options) => {
		console.log('接收到的参数:', options, " at pages/webview/webview.uvue:44")

		const optionData = options as UTSJSONObject
		const url : string = optionData.getString('url', '') ?? ''
		const pageTitle : string = optionData.getString('title', '') ?? ''
		if (url != '') {
			// decodeURIComponent 在 UTS 中返回可空字符串，使用空字符串作为回退值。
			let decodedUrl : string = UTSAndroid.consoleDebugError(decodeURIComponent(url), " at pages/webview/webview.uvue:51") ?? ''

			// 添加协议前缀（如果没有的话）
			if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
				decodedUrl = 'https://' + decodedUrl
			}

			webviewUrl.value = decodedUrl

			// 设置导航栏标题
			if (pageTitle != '') {
				uni.setNavigationBarTitle({
					title: UTSAndroid.consoleDebugError(decodeURIComponent(pageTitle), " at pages/webview/webview.uvue:63") ?? ''
				})
			} else {
				const extractedTitle = extractTitleFromUrl(decodedUrl)
				uni.setNavigationBarTitle({
					title: extractedTitle != '' ? extractedTitle : '网页加载中...'
				})
			}
		} else {
			showAppToast({
				title: '链接地址无效',
				icon: 'none'
			})
		}
	})

	// webview 加载成功
	const handleLoad = (e : any) : void => {
		console.log('网页加载成功', e, " at pages/webview/webview.uvue:81")
		uni.hideLoading()
	}

	// webview 加载错误
	const handleError = (e : any) : void => {
		console.error('网页加载失败', e, " at pages/webview/webview.uvue:87")
		showAppToast({
			title: '页面加载失败',
			icon: 'none'
		})
	}

	// 接收网页传递的消息（如果网页调用了 postMessage）
	const handleMessage = (e : UTSJSONObject) : void => {
		const detail = e.getJSON('detail')
		console.log('接收网页消息:', detail, " at pages/webview/webview.uvue:97")
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}


return (): any | null => {

const _component_web_view = resolveComponent("web-view")
const _component_i_empty = resolveEasyComponent("i-empty",_easycom_i_empty)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "webview-container" }), [
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
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesWebviewWebviewStyles = [_uM([["webview-container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#f5f5f5"]]))], ["error-page", _uM([[".webview-container ", _uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"], ["height", "100%"], ["paddingTop", "40rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "40rpx"]])]])], ["back-btn", _uM([[".webview-container .error-page ", _uM([["marginTop", "60rpx"], ["width", "400rpx"], ["backgroundColor", "#007aff"], ["color", "#ffffff"], ["borderTopLeftRadius", "44rpx"], ["borderTopRightRadius", "44rpx"], ["borderBottomRightRadius", "44rpx"], ["borderBottomLeftRadius", "44rpx"], ["fontSize", "28rpx"]])]])]])]
