import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { ref } from 'vue'
	import { showAppToast } from '../../utils/toast.uts'

	
const __sfc__ = defineComponent({
  __name: 'scancode',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const scanFunctionIsUseable = ref(true)
	const cameraVisible = ref(true)
	const hasFinished = ref(false)
	const pendingBack = ref(false)
	let backTimer : number | null = null

	const clearBackTimer = () => {
		const timer = backTimer
		if (timer != null) {
			clearTimeout(timer)
			backTimer = null
		}
	}

	const releaseCamera = () => {
		cameraVisible.value = false
	}

	const completeBack = () => {
		if (!pendingBack.value) return
		pendingBack.value = false
		clearBackTimer()
		console.log('扫码页已释放相机，返回添加设备页')
		uni.navigateBack({ delta: 1 })
	}

	const requestBack = () => {
		if (pendingBack.value) return
		pendingBack.value = true
		releaseCamera()
		backTimer = setTimeout(() => {
			completeBack()
		}, 1200)
	}

	const handleCameraInitDone = () => {
		console.log('扫码摄像头初始化完成')
	}

	const handleScan = (e : UniCameraScanCodeEvent) => {
		if (hasFinished.value || !scanFunctionIsUseable.value) return
		const scanResult = e.detail.result
		if (scanResult == null) return
		const result = scanResult!!
		if (result.length == 0) return

		hasFinished.value = true
		scanFunctionIsUseable.value = false
		uni.vibrateLong({})
		console.log('扫码结果:', result)
		uni.setStorageSync('scanCodeResult', result)
		showAppToast({
			title: '扫码成功',
			icon: 'success',
			duration: 500
		})
		requestBack()
	}

	const handleCameraStop = () => {
		console.warn('扫码摄像头已停止')
		if (pendingBack.value) {
			console.log('等待相机资源释放完成后返回添加设备页')
			return
		}
		console.warn('摄像头停止但扫码页仍保持打开，等待用户返回或重试')
	}

	const handleCameraError = (e : UniCameraErrorEvent) => {
		if (hasFinished.value) return
		hasFinished.value = true
		console.error('摄像头初始化失败:', e.detail)
		showAppToast({
			title: '摄像头初始化失败，请检查相机权限',
			icon: 'none',
			duration: 500
		})
		requestBack()
	}

	onHide(() => {
		console.log('扫码页隐藏')
		releaseCamera()
	})

	onUnload(() => {
		console.log('扫码页卸载')
		clearBackTimer()
		releaseCamera()
	})

return (): any | null => {

const _component_camera = resolveComponent("camera")
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE("view", _uM({ class: "container" }), [
    _cE("view", _uM({ class: "scancode-box" }), [
      isTrue(cameraVisible.value)
        ? _cV(_component_camera, _uM({
            key: 0,
            "device-position": "back",
            mode: "scanCode",
            flash: "auto",
            class: "scan-code",
            resolution: "high",
            onInitdone: handleCameraInitDone,
            onScancode: handleScan,
            onStop: handleCameraStop,
            onError: handleCameraError
          }))
        : _cC("v-if", true)
    ]),
    _cE("view", _uM({ class: "tip" }), "请将设备二维码或条形码放入框内，自动扫描"),
    _cV(_component_app_toast)
  ])
}
}

})
export default __sfc__
const GenPagesScancodeScancodeStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#000000"]]))], ["scancode-box", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minHeight", 0], ["paddingTop", 0], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0]]))], ["scan-code", _pS(_uM([["width", "100%"], ["height", "100%"]]))], ["tip", _pS(_uM([["position", "fixed"], ["bottom", "100rpx"], ["left", 0], ["right", 0], ["textAlign", "center"], ["color", "#ffffff"], ["fontSize", "28rpx"], ["backgroundColor", "rgba(0,0,0,0.5)"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"]]))]])]
