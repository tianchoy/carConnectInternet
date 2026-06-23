import { LSvpProps } from './type'




	import { pathToDataUrl, svgToDataUrl } from './utils'


	import { NativeImage } from "@/uni_modules/lime-svg";
	
const __sfc__ = defineComponent({
  __name: 'l-svg',
  __props: LSvpProps,
  props: {
    src: { type: String, required: true, default: '' },
    color: { type: String, required: true, default: '' },
    web: { type: Boolean, required: true, default: false },
    inherit: { type: Boolean, required: true, default: false }
  },
  emits: ['load', 'error'],
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	/**
	 * Svg SVG组件
	 * @description 用于渲染SVG路径元素，支持动态颜色和继承属性
	 * <br>插件类型：LSvpComponentPublicInstance 
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-svg
	 * 
	 * @property {string} src SVG路径
	 * @property {string} color 路径颜色（默认："currentColor"）
	 * @property {boolean} web 是否启用Web优化模式（默认：false）
	 * @property {boolean} inherit 是否继承父级SVG属性（默认：true）
	 * @event {Function} load SVG路径加载完成时触发
	 * @event {Function} error SVG路径加载失败时触发
	 */
	
	let nativeImage : NativeImage | null = null



	const props = __props
	
	function emit(event: string, ...do_not_transform_spread: Array<any | null>) {
__ins.emit(event, ...do_not_transform_spread)
}
	const path = ref(props.src)
	const svgRef = ref<UniElement | null>(null)





	
	
	const imageURL = ref('')
	const formatUrl = (url : string, action : string) : string => {
		if (url.indexOf(`'`) > 0) return `${action}("${url}")`
		return `${action}('${url}')`
	}
	const styles = computed(() : Map<string, string> => {
		const style = new Map<string, string>()












		if (props.color != '') {
			style.set('color', props.color)
		}
		return style
	})

	




	const errorDetaill = new UniImageErrorEventDetail('加载失败')
	const errorEvent = new UniImageErrorEvent('error', errorDetaill)











	const onError = () => {
		emit('error', errorEvent)
	}
	const onLoad = (e : UniNativeViewEvent) => {





		const detail = new ImageLoadEventDetail(512, 512)
		const loadEvent = new UniImageLoadEvent('load', detail)











		emit('load', loadEvent)
	}
	// app

	const webRef = ref<UniWebViewElement | null>(null)
	const setSvgSrc = () => {
		if (path.value != '') {
			webRef.value?.evalJS(formatUrl(path.value, 'setSrc'));
		}
	}
	const setSvgColor = () => {
		if (props.color != '' && path.value != '') {
			webRef.value?.evalJS(`setStyle({"--color": "${props.color}"})`);
		}
	}
	const error = (_ : UniWebViewErrorEvent) => {
		emit('error', errorEvent)
	}
	const loaded = (_ : UniWebViewLoadEvent) => {
		watchEffect(() => {
			if (props.src == '' || !props.web) return
			if (props.src.startsWith('<svg')) {
				path.value = svgToDataUrl(props.src)
				setSvgSrc()
				setSvgColor()
			} else if (props.src.startsWith('/static')) {
				pathToDataUrl(props.src).then(res => {
					path.value = res;
					setSvgSrc()
					setSvgColor()
				}).catch(err => {
					emit('error', errorEvent)
					console.warn("[lime-svg]" + props.src + JSON.stringify(err), " at uni_modules/lime-svg/components/l-svg/l-svg.uvue:167")
				})
			} else {
				path.value = props.src
				setSvgSrc()
				setSvgColor()
			}
		})
	}
	const message = (event : UniWebViewMessageEvent) => {
		const data = UTSJSONObject.assign({}, event.detail.data[0] as UTSJSONObject);  //event.detail.data[0] as UTSJSONObject
		const type = data.getString('event')

		const detail = data.getJSON('data')?.getJSON('detail')




		if (type == 'click') {
			emit('click')
		} else if (type == 'load') {
			const width = detail?.getNumber('width') ?? 512
			const height = detail?.getNumber('height') ?? 512

			const loadDetail = new ImageLoadEventDetail(width, height)
			const loadEvent = new UniImageLoadEvent('load', loadDetail)











			emit(type, loadEvent)
		} else if (type == 'error') {
			emit(type, errorEvent)
		}
	}




	function onviewinit(e : UniNativeViewInitEvent) {
		nativeImage = new NativeImage(e.detail.element);
		nativeImage?.updateSrc(path.value)
		nativeImage?.updateColor(props.color)
	}
	const map = new Map<string, string>()
	watchEffect(() => {

		// ios uts组件使用uni.request会报错，故在这里使用
		if (!props.web && props.src.startsWith('http')) {
			if(map.has(props.src)) {
				nativeImage?.updateSrc(map.get(props.src)!)
				return
			}
			uni.downloadFile({
				url: props.src,
				success(res) {
					path.value = res.tempFilePath
					map.set(props.src, res.tempFilePath)
					nativeImage?.updateSrc(res.tempFilePath)
				}
			})
		} else {
			// const a = UTSAndroid.convert2AbsFullPath(props.src)
			path.value = props.src;
			nativeImage?.updateSrc(props.src)
		}





	})
	watchEffect(() => {
		nativeImage?.updateColor(props.color)
	})


	

	// 小程序


















return (): any | null => {

const _component_web_view = resolveComponent("web-view")

  return isTrue(_ctx.web)
    ? _cV(_component_web_view, _uM({
        key: 0,
        class: "l-svg",
        ref_key: "webRef",
        ref: webRef,
        onError: error,
        onLoad: loaded,
        onMessage: message,
        src: "/uni_modules/lime-svg/hybrid/html/index.html?v=21"
      }), null, 512 /* NEED_PATCH */)
    : _cE("native-view", mergeProps(_uM({
        key: 1,
        class: "l-svg"
      }), _ctx.$attrs, _uM({
        onInit: onviewinit,
        onError: onError,
        onLoad: onLoad
      })), null, 16 /* FULL_PROPS */)
}
}

})
export default __sfc__
export type LSvgComponentPublicInstance = InstanceType<typeof __sfc__>;
const GenUniModulesLimeSvgComponentsLSvgLSvgStyles = [_uM([["l-svg", _pS(_uM([["width", 24], ["height", 24]]))]])]
