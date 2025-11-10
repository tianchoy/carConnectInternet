'use strict';

require('vue');
require('java.math.BigDecimal');

/**
 * 验证电子邮箱格式
 */

/**
 * 验证一个值范围[min, max]
 */
function range(value, param) {
    return value >= param[0] && value <= param[1]
}

function deepClone(obj, cache = /* @__PURE__ */ new WeakMap()) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (cache.has(obj))
    return cache.get(obj);
  let clone;
  if (obj instanceof Date) {
    clone = new Date(obj.getTime());
  } else if (obj instanceof RegExp) {
    clone = new RegExp(obj);
  } else if (obj instanceof Map) {
    clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
  } else if (obj instanceof Set) {
    clone = new Set(Array.from(obj, (value) => deepClone(value, cache)));
  } else if (Array.isArray(obj)) {
    clone = obj.map((value) => deepClone(value, cache));
  } else if (Object.prototype.toString.call(obj) === "[object Object]") {
    clone = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj, clone);
    for (const [key, value] of Object.entries(obj)) {
      clone[key] = deepClone(value, cache);
    }
  } else {
    clone = Object.assign({}, obj);
  }
  cache.set(obj, clone);
  return clone;
}
function deepMerge(target = {}, source = {}) {
  target = deepClone(target);
  if (typeof target !== "object" || target === null || typeof source !== "object" || source === null)
    return target;
  const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    const sourceValue = source[prop];
    const targetValue = merged[prop];
    if (sourceValue instanceof Date) {
      merged[prop] = new Date(sourceValue);
    } else if (sourceValue instanceof RegExp) {
      merged[prop] = new RegExp(sourceValue);
    } else if (sourceValue instanceof Map) {
      merged[prop] = new Map(sourceValue);
    } else if (sourceValue instanceof Set) {
      merged[prop] = new Set(sourceValue);
    } else if (typeof sourceValue === "object" && sourceValue !== null) {
      merged[prop] = deepMerge(targetValue, sourceValue);
    } else {
      merged[prop] = sourceValue;
    }
  }
  return merged;
}
if (!String.prototype.padStart) {
  String.prototype.padStart = function(maxLength, fillString = " ") {
    if (Object.prototype.toString.call(fillString) !== "[object String]") {
      throw new TypeError(
        "fillString must be String"
      );
    }
    const str = this;
    if (str.length >= maxLength)
      return String(str);
    const fillLength = maxLength - str.length;
    let times = Math.ceil(fillLength / fillString.length);
    while (times >>= 1) {
      fillString += fillString;
      if (times === 1) {
        fillString += fillString;
      }
    }
    return fillString.slice(0, fillLength) + str;
  };
}
function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
  const prefix = isPrefix ? "?" : "";
  const _result = [];
  if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
    arrayFormat = "brackets";
  for (const key in data) {
    const value = data[key];
    if (["", void 0, null].indexOf(value) >= 0) {
      continue;
    }
    if (value.constructor === Array) {
      switch (arrayFormat) {
        case "indices":
          for (let i = 0; i < value.length; i++) {
            _result.push(`${key}[${i}]=${value[i]}`);
          }
          break;
        case "brackets":
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
          break;
        case "repeat":
          value.forEach((_value) => {
            _result.push(`${key}=${_value}`);
          });
          break;
        case "comma":
          let commaStr = "";
          value.forEach((_value) => {
            commaStr += (commaStr ? "," : "") + _value;
          });
          _result.push(`${key}=${commaStr}`);
          break;
        default:
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
      }
    } else {
      _result.push(`${key}=${value}`);
    }
  }
  return _result.length ? prefix + _result.join("&") : "";
}
function page() {
  const pages2 = getCurrentPages();
  const route = pages2[pages2.length - 1]?.route;
  return `/${route ? route : ""}`;
}

/**
 * 路由跳转方法，该方法相对于直接使用uni.xxx的好处是使用更加简单快捷
 * 并且带有路由拦截功能
 */
class Router {
	constructor() {
		// 原始属性定义
		this.config = {
			type: 'navigateTo',
			url: '',
			delta: 1, // navigateBack页面后退时,回退的层数
			params: {}, // 传递的参数
			animationType: 'pop-in', // 窗口动画,只在APP有效
			animationDuration: 300, // 窗口动画持续时间,单位毫秒,只在APP有效
			intercept: false ,// 是否需要拦截
			events: {} // 页面间通信接口，用于监听被打开页面发送到当前页面的数据。hbuilderx 2.8.9+ 开始支持。
		};
		// 因为route方法是需要对外赋值给另外的对象使用，同时route内部有使用this，会导致route失去上下文
		// 这里在构造函数中进行this绑定
		this.route = this.route.bind(this);
	}

	// 判断url前面是否有"/"，如果没有则加上，否则无法跳转
	addRootPath(url) {
		return url[0] === '/' ? url : `/${url}`
	}

	// 整合路由参数
	mixinParam(url, params) {
		url = url && this.addRootPath(url);

		// 使用正则匹配，主要依据是判断是否有"/","?","="等，如“/page/index/index?name=mary"
		// 如果有url中有get参数，转换后无需带上"?"
		let query = '';
		if (/.*\/.*\?.*=.*/.test(url)) {
			// object对象转为get类型的参数
			query = queryParams(params, false);
			// 因为已有get参数,所以后面拼接的参数需要带上"&"隔开
			return url += `&${query}`
		}
		// 直接拼接参数，因为此处url中没有后面的query参数，也就没有"?/&"之类的符号
		query = queryParams(params);
		return url += query
	}

	// 对外的方法名称
	async route(options = {}, params = {}) {
		// 合并用户的配置和内部的默认配置
		let mergeConfig = {};

		if (typeof options === 'string') {
			// 如果options为字符串，则为route(url, params)的形式
			mergeConfig.url = this.mixinParam(options, params);
			mergeConfig.type = 'navigateTo';
		} else {
			mergeConfig = deepMerge(this.config, options);
			// 否则正常使用mergeConfig中的url和params进行拼接
			mergeConfig.url = this.mixinParam(options.url, options.params);
		}
		// 如果本次跳转的路径和本页面路径一致，不执行跳转，防止用户快速点击跳转按钮，造成多次跳转同一个页面的问题
		if (mergeConfig.url === page()) return

		if (params.intercept) {
			mergeConfig.intercept = params.intercept;
		}
		// params参数也带给拦截器
		mergeConfig.params = params;
		// 合并内外部参数
		mergeConfig = deepMerge(this.config, mergeConfig);
		// 判断用户是否定义了拦截器
		if (typeof mergeConfig.intercept === 'function') {
			// 定一个promise，根据用户执行resolve(true)或者resolve(false)来决定是否进行路由跳转
			const isNext = await new Promise((resolve, reject) => {
				mergeConfig.intercept(mergeConfig, resolve);
			});
			// 如果isNext为true，则执行路由跳转
			isNext && this.openPage(mergeConfig);
		} else {
			this.openPage(mergeConfig);
		}
	}

	// 执行路由跳转
	openPage(config) {
		// 解构参数
		const {
			url,
			type,
			delta,
			animationType,
			animationDuration,
			events
		} = config;
		if (config.type == 'navigateTo' || config.type == 'to') {
			uni.navigateTo({
				url,
				animationType,
				animationDuration,
				events
			});
		}
		if (config.type == 'redirectTo' || config.type == 'redirect') {
			uni.redirectTo({
				url
			});
		}
		if (config.type == 'switchTab' || config.type == 'tab') {
			uni.switchTab({
				url
			});
		}
		if (config.type == 'reLaunch' || config.type == 'launch') {
			uni.reLaunch({
				url
			});
		}
		if (config.type == 'navigateBack' || config.type == 'back') {
			uni.navigateBack({
				delta
			});
		}
	}
}

(new Router()).route;

({
	props: {
		// 图标类名
		name: {
			type: String,
			default: ''
		},
		// 图标颜色，可接受主题色
		color: {
			type: String,
			default: '#606266'
		},
		// 字体大小，单位px
		size: {
			type: [String, Number],
			default: '16px'
		},
		// 是否显示粗体
		bold: {
			type: Boolean,
			default: false
		},
		// 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
		index: {
			type: [String, Number],
			default: null
		},
		// 触摸图标时的类名
		hoverClass: {
			type: String,
			default: ''
		},
		// 自定义扩展前缀，方便用户扩展自己的图标库
		customPrefix: {
			type: String,
			default: 'uvicon'
		},
		// 图标右边或者下面的文字
		label: {
			type: [String, Number],
			default: ''
		},
		// label的位置，只能右边或者下边
		labelPos: {
			type: String,
			default: 'right'
		},
		// label的大小
		labelSize: {
			type: [String, Number],
			default: '15px'
		},
		// label的颜色
		labelColor: {
			type: String,
			default: '#606266'
		},
		// label与图标的距离
		space: {
			type: [String, Number],
			default: '3px'
		},
		// 图片的mode
		imgMode: {
			type: String,
			default: 'aspectFit'
		},
		// 用于显示图片小图标时，图片的宽度
		width: {
			type: [String, Number],
			default: ''
		},
		// 用于显示图片小图标时，图片的高度
		height: {
			type: [String, Number],
			default: ''
		},
		// 用于解决某些情况下，让图标垂直居中的用途
		top: {
			type: [String, Number],
			default: 0
		},
		// 是否阻止事件传播
		stop: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.icon
	}
});

// const defaultOption = {
// 	duration: 300,
// 	timingFunction: 'linear',
// 	delay: 0,
// 	transformOrigin: '50% 50% 0'
// }
// #ifdef APP-NVUE
uni.requireNativePlugin('animation');

({
	props: {
		// 标签类型info、primary、success、warning、error
		type: {
			type: String,
			default: 'primary'
		},
		// 不可用
		disabled: {
			type: [Boolean, String],
			default: false
		},
		// 标签的大小，large，medium，mini
		size: {
			type: String,
			default: 'medium'
		},
		// tag的形状，circle（两边半圆形）, square（方形，带圆角）
		shape: {
			type: String,
			default: 'square'
		},
		// 标签文字
		text: {
			type: [String, Number],
			default: ''
		},
		// 背景颜色，默认为空字符串，即不处理
		bgColor: {
			type: String,
			default: ''
		},
		// 标签字体颜色，默认为空字符串，即不处理
		color: {
			type: String,
			default: ''
		},
		// 标签的边框颜色
		borderColor: {
			type: String,
			default: ''
		},
		// 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
		name: {
			type: [String, Number],
			default: ''
		},
		// 镂空时是否填充背景色
		plainFill: {
			type: Boolean,
			default: false
		},
		// 是否镂空
		plain: {
			type: Boolean,
			default: false
		},
		// 是否可关闭
		closable: {
			type: Boolean,
			default: false
		},
		// 关闭按钮图标的颜色
		closeColor: {
			type: String,
			default: '#C6C7CB'
		},
		// 关闭按钮图标的位置 right（右边）right-top（右上） 默认right-top
		closePlace: {
			type: String,
			default: 'right-top'
		},
		// 是否显示
		show: {
			type: Boolean,
			default: true
		},
		// 内置图标，或绝对路径的图片
		icon: {
			type: String,
			default: ''
		},
		// 图标颜色
		iconColor: {
			type: String,
			default: ''
		},
		// nvue模式下 是否直接显示，在uv-list等cell下面使用就需要设置
		cellChild: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.tags
	}
});

({
	props: {
		color: {
			type: String,
			default: '#d6d7d9'
		},
		// 长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带px单位的值等
		length: {
			type: [String, Number],
			default: '100%'
		},
		// 线条方向，col-竖向，row-横向
		direction: {
			type: String,
			default: 'row'
		},
		// 是否显示细边框
		hairline: {
			type: Boolean,
			default: true
		},
		// 线条与上下左右元素的间距，字符串形式，如"30px"、"20px 30px"
		margin: {
			type: [String, Number],
			default: 0
		},
		// 是否虚线，true-虚线，false-实线
		dashed: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.line
	}
});

({
	props: {
		// 是否显示组件
		show: {
			type: Boolean,
			default: true
		},
		// 颜色
		color: {
			type: String,
			default: '#909193'
		},
		// 提示文字颜色
		textColor: {
			type: String,
			default: '#909193'
		},
		// 文字和图标是否垂直排列
		vertical: {
			type: Boolean,
			default: false
		},
		// 模式选择，circle-圆形，spinner-花朵形，semicircle-半圆形
		mode: {
			type: String,
			default: 'spinner'
		},
		// 图标大小，单位默认px
		size: {
			type: [String, Number],
			default: 24
		},
		// 文字大小
		textSize: {
			type: [String, Number],
			default: 15
		},
		// 文字样式
		textStyle: {
			type: Object,
			default () {
				return {}
			}
		},
		// 文字内容
		text: {
			type: [String, Number],
			default: ''
		},
		// 动画模式 https://www.runoob.com/cssref/css3-pr-animation-timing-function.html
		timingFunction: {
			type: String,
			default: 'linear'
		},
		// 动画执行周期时间
		duration: {
			type: [String, Number],
			default: 1200
		},
		// mode=circle时的暗边颜色
		inactiveColor: {
			type: String,
			default: ''
		},
		...uni.$uv?.props?.loadingIcon
	}
});

({
	props: {
		// 是否显示遮罩
		show: {
			type: Boolean,
			default: false
		},
		// 层级z-index
		zIndex: {
			type: [String, Number],
			default: 10070
		},
		// 遮罩的过渡时间，单位为ms
		duration: {
			type: [String, Number],
			default: 300
		},
		// 不透明度值，当做rgba的第四个参数
		opacity: {
			type: [String, Number],
			default: 0.5
		},
		...uni.$uv?.props?.overlay
	}
});

({
	props: {
		// 标题
		title: {
			type: [String],
			default: ''
		},
		// 弹窗内容
		content: {
			type: String,
			default: ''
		},
		// 确认文案
		confirmText: {
			type: String,
			default: '确认'
		},
		// 取消文案
		cancelText: {
			type: String,
			default: '取消'
		},
		// 是否显示确认按钮
		showConfirmButton: {
			type: Boolean,
			default: true
		},
		// 是否显示取消按钮
		showCancelButton: {
			type: Boolean,
			default: false
		},
		// 确认按钮颜色
		confirmColor: {
			type: String,
			default: '#2979ff'
		},
		// 取消文字颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		// 对调确认和取消的位置
		buttonReverse: {
			type: Boolean,
			default: false
		},
		// 是否开启缩放效果
		zoom: {
			type: Boolean,
			default: true
		},
		// 层级
		zIndex: {
			type: [String, Number],
			default: 10075
		},
		// 是否异步关闭，只对确定按钮有效
		asyncClose: {
			type: Boolean,
			default: false
		},
		// 是否允许点击遮罩关闭modal
		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},
		// 给一个负的margin-top，往上偏移，避免和键盘重合的情况
		negativeTop: {
			type: [String, Number],
			default: 0
		},
		// modal宽度，不支持百分比，可以数值，px，rpx单位
		width: {
			type: [String, Number],
			default: '650rpx'
		},
		// 文本对齐方式，默认left
		align: {
			type: String,
			default: 'left'
		},
		// 文本自定义样式
		textStyle: {
			type: [Object, String],
			default: ''
		},
		...uni.$uv?.props?.modal
	}
});

({
	props: {
		// 显示的内容，字符串
		text: {
			type: [Array],
			default: ''
		},
		// 是否显示左侧的音量图标
		icon: {
			type: [String, Boolean, null],
			default: 'volume'
		},
		// 通告模式，link-显示右箭头，closable-显示右侧关闭图标
		mode: {
			type: String,
			default: ''
		},
		// 文字颜色，各图标也会使用文字颜色
		color: {
			type: String,
			default: '#f9ae3d'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#fdf6ec'
		},
		// 字体大小，单位px
		fontSize: {
			type: [String, Number],
			default: 14
		},
		// 水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度
		speed: {
			type: [String, Number],
			default: 80
		},
		// direction = row时，是否使用步进形式滚动
		step: {
			type: Boolean,
			default: false
		},
		// 滚动一个周期的时间长，单位ms
		duration: {
			type: [String, Number],
			default: 1500
		},
		// 是否禁止用手滑动切换，仅`direction="column"生效`
		// 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序
		disableTouch: {
			type: Boolean,
			default: true
		},
		// 是否禁止滚动，仅`direction="column"生效`
		disableScroll: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.columnNotice
	}
});

({
	props: {
		// 显示的内容，字符串
		text: {
			type: String,
			default: ''
		},
		// 是否显示左侧的音量图标
		icon: {
			type: [String, Boolean, null],
			default: 'volume'
		},
		// 通告模式，link-显示右箭头，closable-显示右侧关闭图标
		mode: {
			type: String,
			default: ''
		},
		// 文字颜色，各图标也会使用文字颜色
		color: {
			type: String,
			default: '#f9ae3d'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#fdf6ec'
		},
		// 字体大小，单位px
		fontSize: {
			type: [String, Number],
			default: 14
		},
		// 水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度
		speed: {
			type: [String, Number],
			default: 80
		},
		...uni.$uv?.props?.rowNotice
	}
});

({
	props: {
		// 显示的内容，数组
		text: {
			type: [Array, String],
			default: () => []
		},
		// 通告滚动模式，row-横向滚动，column-竖向滚动
		direction: {
			type: String,
			default: 'row'
		},
		// direction = row时，是否使用步进形式滚动
		step: {
			type: Boolean,
			default: false
		},
		// 是否显示左侧的音量图标
		icon: {
			type: [String, Boolean, null],
			default: 'volume'
		},
		// 通告模式，link-显示右箭头，closable-显示右侧关闭图标
		mode: {
			type: String,
			default: ''
		},
		// 文字颜色，各图标也会使用文字颜色
		color: {
			type: String,
			default: '#f9ae3d'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#fdf6ec'
		},
		// 水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度
		speed: {
			type: [String, Number],
			default: 80
		},
		// 字体大小
		fontSize: {
			type: [String, Number],
			default: 14
		},
		// 滚动一个周期的时间长，单位ms
		duration: {
			type: [String, Number],
			default: 2000
		},
		// 跳转的页面路径
		url: {
			type: String,
			default: ''
		},
		// 页面跳转的类型
		linkType: {
			type: String,
			default: 'navigateTo'
		},
		// 是否禁止用手滑动切换
		// 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序
		disableTouch: {
			type: Boolean,
			default: true
		},
		// 是否禁止滚动，仅`direction="column"生效`
		disableScroll: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.noticeBar
	}
});

({
	props: {
		// 是否展示工具条
		show: {
			type: Boolean,
			default: true
		},
		// 是否显示下边框
		showBorder: {
			type: Boolean,
			default: false
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		},
		// 取消按钮的颜色
		cancelColor: {
			type: String,
			default: '#909193'
		},
		// 确认按钮的颜色
		confirmColor: {
			type: String,
			default: '#3c9cff'
		},
		// 标题文字
		title: {
			type: String,
			default: ''
		},
		...uni.$uv?.props?.toolbar
	}
});

({
	props: {
		// 是否展示顶部的操作栏
		showToolbar: {
			type: Boolean,
			default: true
		},
		// 顶部标题
		title: {
			type: String,
			default: ''
		},
		// 弹窗圆角
		round: {
			type: [String, Number],
			default: 0
		},
		// 对象数组，设置每一列的数据
		columns: {
			type: Array,
			default: () => []
		},
		// 是否显示加载中状态
		loading: {
			type: Boolean,
			default: false
		},
		// 各列中，单个选项的高度
		itemHeight: {
			type: [String, Number],
			default: 44
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确定'
		},
		// 取消按钮的颜色
		cancelColor: {
			type: String,
			default: '#909193'
		},
		// 确认按钮的颜色
		confirmColor: {
			type: String,
			default: '#3c9cff'
		},
		// 文字颜色
		color: {
			type: String,
			default: ''
		},
		// 选中文字的颜色
		activeColor: {
			type: String,
			default: ''
		},
		// 每列中可见选项的数量
		visibleItemCount: {
			type: [String, Number],
			default: 5
		},
		// 选项对象中，需要展示的属性键名
		keyName: {
			type: String,
			default: 'text'
		},
		// 是否允许点击遮罩关闭选择器
		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},
		// 是否允许点击确认关闭选择器
		closeOnClickConfirm: {
			type: Boolean,
			default: true
		},
		// 各列的默认索引
		defaultIndex: {
			type: Array,
			default: () => [],
		},
		// 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，只在微信2.21.1及以上有效
		immediateChange: {
			type: Boolean,
			default: true
		},
		...uni.$uv?.props?.picker
	}
});

({
	props: {
		// 是否显示圆点
		isDot: {
			type: Boolean,
			default: false
		},
		// 显示的内容
		value: {
			type: [Number, String],
			default: ''
		},
		// 是否显示
		show: {
			type: Boolean,
			default: true
		},
		// 最大值，超过最大值会显示 '{max}+'
		max: {
			type: [Number, String],
			default: 999
		},
		// 主题类型，error|warning|success|primary
		type: {
			type: [String,undefined,null],
			default: 'error'
		},
		// 当数值为 0 时，是否展示 Badge
		showZero: {
			type: Boolean,
			default: false
		},
		// 背景颜色，优先级比type高，如设置，type参数会失效
		bgColor: {
			type: [String, null],
			default: null
		},
		// 字体颜色
		color: {
			type: [String, null],
			default: null
		},
		// 徽标形状，circle-四角均为圆角，horn-左下角为直角
		shape: {
			type: [String,undefined,null],
			default: 'circle'
		},
		// 设置数字的显示方式，overflow|ellipsis|limit
		// overflow会根据max字段判断，超出显示`${max}+`
		// ellipsis会根据max判断，超出显示`${max}...`
		// limit会依据1000作为判断条件，超出1000，显示`${value/1000}K`，比如2.2k、3.34w，最多保留2位小数
		numberType: {
			type: [String,undefined,null],
			default: 'overflow'
		},
		// 设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
		offset: {
			type: Array,
			default: () => []
		},
		// 是否反转背景和字体颜色
		inverted: {
			type: Boolean,
			default: false
		},
		// 是否绝对定位
		absolute: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.badge
	}
});

({
	props: {
		value: {
			type: [Boolean, String, Number],
			default: false
		},
		modelValue: {
			type: [Boolean, String, Number],
			default: false
		},
		// 是否为加载中状态
		loading: {
			type: Boolean,
			default: false
		},
		// 是否为禁用装填
		disabled: {
			type: Boolean,
			default: false
		},
		// 开关尺寸，单位px
		size: {
			type: [String, Number],
			default: 25
		},
		// 打开时的背景颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 关闭时的背景颜色
		inactiveColor: {
			type: String,
			default: '#fff'
		},
		// switch打开时的值
		activeValue: {
			type: [String, Number, Boolean],
			default: true
		},
		// switch关闭时的值
		inactiveValue: {
			type: [String, Number, Boolean],
			default: false
		},
		// 是否开启异步变更，开启后需要手动控制输入值
		asyncChange: {
			type: Boolean,
			default: false
		},
		// 圆点与外边框的距离
		space: {
			type: [String, Number],
			default: 0
		},
		...uni.$uv?.props?.switch
	}
});

({
	props: {
		// 组件状态，loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
		status: {
			type: String,
			default: 'loadmore'
		},
		// 组件背景色
		bgColor: {
			type: String,
			default: 'transparent'
		},
		// 是否显示加载中的图标
		icon: {
			type: Boolean,
			default: true
		},
		// 字体大小
		fontSize: {
			type: [String, Number],
			default: 14
		},
		// 图标大小
		iconSize: {
			type: [String, Number],
			default: 16
		},
		// 字体颜色
		color: {
			type: String,
			default: '#606266'
		},
		// 加载中状态的图标，spinner-花朵状图标，circle-圆圈状，semicircle-半圆
		loadingIcon: {
			type: String,
			default: 'spinner'
		},
		// 加载前的提示语
		loadmoreText: {
			type: String,
			default: '加载更多'
		},
		// 加载中提示语
		loadingText: {
			type: String,
			default: '正在加载...'
		},
		// 没有更多的提示语
		nomoreText: {
			type: String,
			default: '没有更多了'
		},
		// 在“没有更多”状态下，是否显示粗点
		isDot: {
			type: Boolean,
			default: false
		},
		// 加载中图标的颜色
		iconColor: {
			type: String,
			default: '#b7b7b7'
		},
		// 上边距
		marginTop: {
			type: [String, Number],
			default: 10
		},
		// 下边距
		marginBottom: {
			type: [String, Number],
			default: 10
		},
		// 高度，单位px
		height: {
			type: [String, Number],
			default: 'auto'
		},
		// 是否显示左边分割线
		line: {
			type: Boolean,
			default: false
		},
		// 线条颜色
		lineColor: {
			type: String,
			default: '#E6E8EB'
		},
		// 是否虚线，true-虚线，false-实线
		dashed: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.loadmore
	}
});

({
	props: {
		// 文字颜色
		color: {
			type: String,
			default: ''
		},
		// 字体大小，单位px
		fontSize: {
			type: [String, Number],
			default: 14
		},
		// 是否显示下划线
		underLine: {
			type: Boolean,
			default: false
		},
		// 要跳转的链接
		href: {
			type: String,
			default: ''
		},
		// 小程序中复制到粘贴板的提示语
		mpTips: {
			type: String,
			default: '链接已复制，请在浏览器打开'
		},
		// 下划线颜色
		lineColor: {
			type: String,
			default: ''
		},
		// 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
		text: {
			type: String,
			default: ''
		},
		...uni.$uv?.props?.link
	}
});

({
	props: {
		// 主题颜色
		type: {
			type: String,
			default: ''
		},
		// 是否显示
		show: {
			type: Boolean,
			default: true
		},
		// 显示的值
		text: {
			type: [String, Number],
			default: ''
		},
		// 前置图标
		prefixIcon: {
			type: String,
			default: ''
		},
		// 后置图标
		suffixIcon: {
			type: String,
			default: ''
		},
		// 文本处理的匹配模式
		// text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
		mode: {
			type: String,
			default: ''
		},
		// mode=link下，配置的链接
		href: {
			type: String,
			default: ''
		},
		// 格式化规则
		format: {
			type: [String, Function],
			default: ''
		},
		// mode=phone时，点击文本是否拨打电话
		call: {
			type: Boolean,
			default: true
		},
		// 小程序的打开方式
		openType: {
			type: String,
			default: ''
		},
		// 是否粗体，默认normal
		bold: {
			type: Boolean,
			default: false
		},
		// 是否块状
		block: {
			type: Boolean,
			default: false
		},
		// 文本显示的行数，如果设置，超出此行数，将会显示省略号
		lines: {
			type: [String, Number],
			default: ''
		},
		// 文本颜色
		color: {
			type: String,
			default: '#303133'
		},
		// 字体大小
		size: {
			type: [String, Number],
			default: 15
		},
		// 图标的样式
		iconStyle: {
			type: [Object, String],
			default: () => ({
				fontSize: '15px'
			})
		},
		// 文字装饰，下划线，中划线等，可选值 none|underline|line-through
		decoration: {
			type: String,
			default: 'none'
		},
		// 外边距，对象、字符串，数值形式均可
		margin: {
			type: [Object, String, Number],
			default: 0
		},
		// 文本行高
		lineHeight: {
			type: [String, Number],
			default: ''
		},
		// 文本对齐方式，可选值left|center|right
		align: {
			type: String,
			default: 'left'
		},
		// 文字换行，可选值break-word|normal|anywhere
		wordWrap: {
			type: String,
			default: 'normal'
		},
		...uni.$uv?.props?.text
	}
});

({
	props: {
		// 头像图片路径(不能为相对路径)
		src: {
			type: String,
			default: ''
		},
		// 头像形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: 'circle'
		},
		// 头像尺寸
		size: {
			type: [String, Number],
			default: 40
		},
		// 裁剪模式
		mode: {
			type: String,
			default: 'scaleToFill'
		},
		// 显示的文字
		text: {
			type: String,
			default: ''
		},
		// 背景色
		bgColor: {
			type: String,
			default: '#c0c4cc'
		},
		// 文字颜色
		color: {
			type: String,
			default: '#fff'
		},
		// 文字大小
		fontSize: {
			type: [String, Number],
			default: 18
		},
		// 显示的图标
		icon: {
			type: String,
			default: ''
		},
		// 显示小程序头像，只对百度，微信，QQ小程序有效
		mpAvatar: {
			type: Boolean,
			default: false
		},
		// 是否使用随机背景色
		randomBgColor: {
			type: Boolean,
			default: false
		},
		// 加载失败的默认头像(组件有内置默认图片)
		defaultUrl: {
			type: String,
			default: ''
		},
		// 如果配置了randomBgColor为true，且配置了此值，则从默认的背景色数组中取出对应索引的颜色值，取值0-19之间
		colorIndex: {
			type: [String, Number],
			// 校验参数规则，索引在0-19之间
			validator(n) {
				return range(n, [0, 19]) || n === ''
			},
			default: ''
		},
		// 组件标识符
		name: {
			type: String,
			default: ''
		},
		...uni.$uv?.props?.avatar
	}
});

({
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		modelValue: {
			type: [String, Number],
			default: ''
		},
		// 输入框类型
		// number-数字输入键盘，app-vue下可以输入浮点数，app-nvue和小程序平台下只能输入整数
		// idcard-身份证输入键盘，微信、支付宝、百度、QQ小程序
		// digit-带小数点的数字键盘，App的nvue页面、微信、支付宝、百度、头条、QQ小程序
		// text-文本输入键盘
		type: {
			type: String,
			default: 'text'
		},
		// 是否禁用输入框
		disabled: {
			type: Boolean,
			default: false
		},
		// 禁用状态时的背景色
		disabledColor: {
			type: String,
			default: '#f5f7fa'
		},
		// 是否显示清除控件
		clearable: {
			type: Boolean,
			default: false
		},
		// 是否密码类型
		password: {
			type: Boolean,
			default: false
		},
		// 最大输入长度，设置为 -1 的时候不限制最大长度
		maxlength: {
			type: [String, Number],
			default: -1
		},
		// 	输入框为空时的占位符
		placeholder: {
			type: String,
			default: null
		},
		// 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
		placeholderClass: {
			type: String,
			default: 'input-placeholder'
		},
		// 指定placeholder的样式
		placeholderStyle: {
			type: [String, Object],
			default: 'color: #c0c4cc'
		},
		// 设置右下角按钮的文字，有效值：send|search|next|go|done，兼容性详见uni-app文档
		// https://uniapp.dcloud.io/component/input
		// https://uniapp.dcloud.io/component/textarea
		confirmType: {
			type: String,
			default: 'done'
		},
		// 点击键盘右下角按钮时是否保持键盘不收起，H5无效
		confirmHold: {
			type: Boolean,
			default: false
		},
		// focus时，点击页面的时候不收起键盘，微信小程序有效
		holdKeyboard: {
			type: Boolean,
			default: false
		},
		// 自动获取焦点
		// 在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点
		focus: {
			type: Boolean,
			default: false
		},
		// 键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效
		autoBlur: {
			type: Boolean,
			default: false
		},
		// 指定focus时光标的位置
		cursor: {
			type: [String, Number],
			default: -1
		},
		// 输入框聚焦时底部与键盘的距离
		cursorSpacing: {
			type: [String, Number],
			default: 30
		},
		// 光标起始位置，自动聚集时有效，需与selection-end搭配使用
		selectionStart: {
			type: [String, Number],
			default: -1
		},
		// 光标结束位置，自动聚集时有效，需与selection-start搭配使用
		selectionEnd: {
			type: [String, Number],
			default: -1
		},
		// 键盘弹起时，是否自动上推页面
		adjustPosition: {
			type: Boolean,
			default: true
		},
		// 输入框内容对齐方式，可选值为：left|center|right
		inputAlign: {
			type: String,
			default: 'left'
		},
		// 输入框字体的大小
		fontSize: {
			type: [String, Number],
			default: '14px'
		},
		// 输入框字体颜色
		color: {
			type: String,
			default: '#303133'
		},
		// 输入框前置图标
		prefixIcon: {
			type: String,
			default: ''
		},
		// 前置图标样式，对象或字符串
		prefixIconStyle: {
			type: [String, Object],
			default: ''
		},
		// 输入框后置图标
		suffixIcon: {
			type: String,
			default: ''
		},
		// 后置图标样式，对象或字符串
		suffixIconStyle: {
			type: [String, Object],
			default: ''
		},
		// 边框类型，surround-四周边框，bottom-底部边框，none-无边框
		border: {
			type: String,
			default: 'surround'
		},
		// 是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会
		readonly: {
			type: Boolean,
			default: false
		},
		// 输入框形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: 'square'
		},
		// 用于处理或者过滤输入框内容的方法
		formatter: {
			type: [Function, null],
			default: null
		},
		// 是否忽略组件内对文本合成系统事件的处理
		ignoreCompositionEvent: {
			type: Boolean,
			default: true
		},
		...uni.$uv?.props?.input
	}
});

({
	props: {
		// input的label提示语
		label: {
			type: String,
			default: ''
		},
		// 绑定的值
		prop: {
			type: String,
			default: ''
		},
		// 是否显示表单域的下划线边框
		borderBottom: {
			type: [Boolean],
			default: false
		},
		// label的位置，left-左边，top-上边
		labelPosition: {
			type: String,
			default: ''
		},
		// label的宽度，单位px
		labelWidth: {
			type: [String, Number],
			default: ''
		},
		// 右侧图标
		rightIcon: {
			type: String,
			default: ''
		},
		// 左侧图标
		leftIcon: {
			type: String,
			default: ''
		},
		// 是否显示左边的必填星号，只作显示用，具体校验必填的逻辑，请在rules中配置
		required: {
			type: Boolean,
			default: false
		},
		leftIconStyle: {
			type: [String, Object],
			default: ''
		},
		...uni.$uv?.props?.formItem
	}
});

({
	props: {
		// checkbox的名称
		name: {
			type: [String, Number, Boolean],
			default: ''
		},
		// 形状，square为方形，circle为圆型
		shape: {
			type: String,
			default: ''
		},
		// 整体的大小
		size: {
			type: [String, Number],
			default: ''
		},
		// 是否默认选中
		checked: {
			type: Boolean,
			default: false
		},
		// 是否禁用
		disabled: {
			type: [String, Boolean],
			default: ''
		},
		// 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
		activeColor: {
			type: String,
			default: ''
		},
		// 未选中的颜色
		inactiveColor: {
			type: String,
			default: ''
		},
		// 图标的大小，单位px
		iconSize: {
			type: [String, Number],
			default: ''
		},
		// 图标颜色
		iconColor: {
			type: String,
			default: ''
		},
		// label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
		label: {
			type: [String, Number, Boolean],
			default: ''
		},
		// label的字体大小，px单位
		labelSize: {
			type: [String, Number],
			default: ''
		},
		// label的颜色
		labelColor: {
			type: String,
			default: ''
		},
		// 是否禁止点击提示语选中复选框
		labelDisabled: {
			type: [String, Boolean],
			default: ''
		},
		...uni.$uv?.props?.checkbox
	}
});

({
	props: {
		// 绑定的值
		value: {
			type: Array,
			default: () => []
		},
		modelValue: {
			type: Array,
			default: () => []
		},
		// 标识符
		name: {
			type: String,
			default: ''
		},
		// 形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: 'square'
		},
		// 是否禁用全部checkbox
		disabled: {
			type: Boolean,
			default: false
		},
		// 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 未选中的颜色
		inactiveColor: {
			type: String,
			default: '#c8c9cc'
		},
		// 整个组件的尺寸，默认px
		size: {
			type: [String, Number],
			default: 18
		},
		// 布局方式，row-横向，column-纵向
		placement: {
			type: String,
			default: 'row'
		},
		// label的字体大小，px单位
		labelSize: {
			type: [String, Number],
			default: 14
		},
		// label的字体颜色
		labelColor: {
			type: [String],
			default: '#303133'
		},
		// 是否禁止点击文本操作
		labelDisabled: {
			type: Boolean,
			default: false
		},
		// 图标颜色
		iconColor: {
			type: String,
			default: '#fff'
		},
		// 图标的大小，单位px
		iconSize: {
			type: [String, Number],
			default: 12
		},
		// 勾选图标的对齐方式，left-左边，right-右边
		iconPlacement: {
			type: String,
			default: 'left'
		},
		// 竖向配列时，是否显示下划线
		borderBottom: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.checkboxGroup
	}
});

({
	props: {
		// 当前form的需要验证字段的集合
		model: {
			type: Object,
			default: () => ({})
		},
		// 验证规则
		rules: {
			type: [Object, Function, Array],
			default: () => ({})
		},
		// 有错误时的提示方式，message-提示信息，toast-进行toast提示
		// border-bottom-下边框呈现红色，none-无提示
		errorType: {
			type: String,
			default: 'message'
		},
		// 是否显示表单域的下划线边框
		borderBottom: {
			type: Boolean,
			default: true
		},
		// label的位置，left-左边，top-上边
		labelPosition: {
			type: String,
			default: 'left'
		},
		// label的宽度，单位px
		labelWidth: {
			type: [String, Number],
			default: 45
		},
		// lable字体的对齐方式
		labelAlign: {
			type: String,
			default: 'left'
		},
		// lable的样式，对象形式
		labelStyle: {
			type: Object,
			default: () => ({})
		},
		...uni.$uv?.props?.form
	}
});

if (typeof process !== "undefined" && process.env && true && typeof window !== "undefined" && typeof document !== "undefined") ;

({
	props: {
		// 是否细边框
		hairline: {
			type: Boolean,
			default: true
		},
		// 按钮的预置样式，info，primary，error，warning，success
		type: {
			type: String,
			default: 'info'
		},
		// 按钮尺寸，large，normal，small，mini
		size: {
			type: String,
			default: 'normal'
		},
		// 按钮形状，circle（两边为半圆），square（带圆角）
		shape: {
			type: String,
			default: 'square'
		},
		// 按钮是否镂空
		plain: {
			type: Boolean,
			default: false
		},
		// 是否禁止状态
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否加载中
		loading: {
			type: Boolean,
			default: false
		},
		// 加载中提示文字
		loadingText: {
			type: [String, Number],
			default: ''
		},
		// 加载状态图标类型
		loadingMode: {
			type: String,
			default: 'spinner'
		},
		// 加载图标大小
		loadingSize: {
			type: [String, Number],
			default: 14
		},
		// 开放能力，具体请看uniapp稳定关于button组件部分说明
		// https://uniapp.dcloud.io/component/button
		openType: {
			type: String,
			default: ''
		},
		// 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
		// 取值为submit（提交表单），reset（重置表单）
		formType: {
			type: String,
			default: ''
		},
		// 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
		// 只微信小程序、QQ小程序有效
		appParameter: {
			type: String,
			default: ''
		},
		// 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
		hoverStopPropagation: {
			type: Boolean,
			default: true
		},
		// 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
		lang: {
			type: String,
			default: 'en'
		},
		// 会话来源，open-type="contact"时有效。只微信小程序有效
		sessionFrom: {
			type: String,
			default: ''
		},
		// 会话内消息卡片标题，open-type="contact"时有效
		// 默认当前标题，只微信小程序有效
		sendMessageTitle: {
			type: String,
			default: ''
		},
		// 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
		// 默认当前分享路径，只微信小程序有效
		sendMessagePath: {
			type: String,
			default: ''
		},
		// 会话内消息卡片图片，open-type="contact"时有效
		// 默认当前页面截图，只微信小程序有效
		sendMessageImg: {
			type: String,
			default: ''
		},
		// 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
		// 用户点击后可以快速发送小程序消息，open-type="contact"时有效
		showMessageCard: {
			type: Boolean,
			default: true
		},
		// 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
		dataName: {
			type: String,
			default: ''
		},
		// 节流，一定时间内只能触发一次
		throttleTime: {
			type: [String, Number],
			default: 0
		},
		// 按住后多久出现点击态，单位毫秒
		hoverStartTime: {
			type: [String, Number],
			default: 0
		},
		// 手指松开后点击态保留时间，单位毫秒
		hoverStayTime: {
			type: [String, Number],
			default: 200
		},
		// 按钮文字，之所以通过props传入，是因为slot传入的话
		// nvue中无法控制文字的样式
		text: {
			type: [String, Number],
			default: ''
		},
		// 按钮图标
		icon: {
			type: String,
			default: ''
		},
		// 按钮图标大小
		iconSize: {
			type: [String, Number],
			default: ''
		},
		// 按钮图标颜色
		iconColor: {
			type: String,
			default: '#000000'
		},
		// 按钮颜色，支持传入linear-gradient渐变色
		color: {
			type: String,
			default: ''
		},
		// 自定义按钮文本样式
		customTextStyle: {
			type: [Object,String],
			default: ''
		},
		...uni.$uv?.props?.button
	}
});

({
	props: {
		// 宫格的name
		name: {
			type: [String, Number, null],
			default: null
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: 'transparent'
		},
		...uni.$uv?.props?.gridItem
	}
});

({
	props: {
		// 分成几列
		col: {
			type: [String, Number],
			default: 3
		},
		// 是否显示边框
		border: {
			type: Boolean,
			default: false
		},
		// 宫格对齐方式，表现为数量少的时候，靠左，居中，还是靠右
		align: {
			type: String,
			default: 'left'
		},
		...uni.$uv?.props?.grid
	}
});

({
	props: {
		value: {
			type: [Number, String],
			default: 0
		},
		modelValue: {
			type: [Number, String],
			default: 0
		},
		// 最小可选值
		min: {
			type: [Number, String],
			default: 0
		},
		// 最大可选值
		max: {
			type: [Number, String],
			default: 100
		},
		// 步长，取值必须大于 0，并且可被(max - min)整除
		step: {
			type: [Number, String],
			default: 1
		},
		// 滑块右侧已选择部分的背景色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 滑块左侧未选择部分的背景色
		backgroundColor: {
			type: String,
			default: '#c0c4cc'
		},
		// 滑块的大小，取值范围为 12 - 28
		blockSize: {
			type: [Number, String],
			default: 18
		},
		// 滑块的颜色
		blockColor: {
			type: String,
			default: '#ffffff'
		},
		// 禁用状态
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否显示当前的选择值
		showValue: {
			type: Boolean,
			default: false
		},
		...uni.$uv?.props?.slider
	}
});

uni;

({
	props: {
		// 内置图标名称，或图片路径，建议绝对路径
		icon: {
			type: String,
			default: ''
		},
		// 提示文字
		text: {
			type: String,
			default: ''
		},
		// 文字颜色
		textColor: {
			type: String,
			default: '#c0c4cc'
		},
		// 文字大小
		textSize: {
			type: [String, Number],
			default: 14
		},
		// 图标的颜色
		iconColor: {
			type: String,
			default: '#c0c4cc'
		},
		// 图标的大小
		iconSize: {
			type: [String, Number],
			default: 90
		},
		// 选择预置的图标类型
		mode: {
			type: String,
			default: 'data'
		},
		//  图标宽度，单位px
		width: {
			type: [String, Number],
			default: 160
		},
		// 图标高度，单位px
		height: {
			type: [String, Number],
			default: 160
		},
		// 是否显示组件
		show: {
			type: Boolean,
			default: true
		},
		// 组件距离上一个元素之间的距离，默认px单位
		marginTop: {
			type: [String, Number],
			default: 0
		},
		...uni.$uv?.props?.empty
	}
});

({
	props: {
		// radio的名称
		name: {
			type: [String, Number, Boolean],
			default: ''
		},
		// 形状，square为方形，circle为圆型
		shape: {
			type: String,
			default: ''
		},
		// 是否禁用
		disabled: {
			type: [String, Boolean],
			default: ''
		},
		// 是否禁止点击提示语选中单选框
		labelDisabled: {
			type: [String, Boolean],
			default: ''
		},
		// 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
		activeColor: {
			type: String,
			default: ''
		},
		// 未选中的颜色
		inactiveColor: {
			type: String,
			default: ''
		},
		// 图标的大小，单位px
		iconSize: {
			type: [String, Number],
			default: ''
		},
		// label的字体大小，px单位
		labelSize: {
			type: [String, Number],
			default: ''
		},
		// label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
		label: {
			type: [String, Number, Boolean],
			default: ''
		},
		// 整体的大小
		size: {
			type: [String, Number],
			default: ''
		},
		// 图标颜色
		iconColor: {
			type: String,
			default: ''
		},
		// label的颜色
		labelColor: {
			type: String,
			default: ''
		},
		...uni.$uv?.props?.radio
	}
});

({
	props: {
		// 绑定的值
		value: {
			type: [String, Number, Boolean],
			default: ''
		},
		modelValue: {
			type: [String, Number, Boolean],
			default: ''
		},
		// 是否禁用全部radio
		disabled: {
			type: Boolean,
			default: false
		},
		// 形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: 'circle'
		},
		// 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 未选中的颜色
		inactiveColor: {
			type: String,
			default: '#c8c9cc'
		},
		// 标识符
		name: {
			type: String,
			default: ''
		},
		// 整个组件的尺寸，默认px
		size: {
			type: [String, Number],
			default: 18
		},
		// 布局方式，row-横向，column-纵向
		placement: {
			type: String,
			default: 'row'
		},
		// label的文本
		label: {
			type: [String],
			default: ''
		},
		// label的颜色 （默认 '#303133' ）
		labelColor: {
			type: [String],
			default: '#303133'
		},
		// label的字体大小，px单位
		labelSize: {
			type: [String, Number],
			default: 14
		},
		// 是否禁止点击文本操作checkbox(默认 false )
		labelDisabled: {
			type: Boolean,
			default: false
		},
		// 图标颜色
		iconColor: {
			type: String,
			default: '#fff'
		},
		// 图标的大小，单位px
		iconSize: {
			type: [String, Number],
			default: 12
		},
		// 竖向配列时，是否显示下划线
		borderBottom: {
			type: Boolean,
			default: false
		},
		// 图标与文字的对齐方式
		iconPlacement: {
			type: String,
			default: 'left'
		},
		...uni.$uv?.props?.radioGroup
	}
});

({
	props: {
		value: {
			type: [String, Number],
			default: 0
		},
		modelValue: {
			type: [String, Number],
			default: 0
		},
		// 步进器标识符，在change回调返回
		name: {
			type: [String, Number],
			default: ''
		},
		// 最小值
		min: {
			type: [String, Number],
			default: 1
		},
		// 最大值
		max: {
			type: [String, Number],
			default: Number.MAX_SAFE_INTEGER
		},
		// 加减的步长，可为小数
		step: {
			type: [String, Number],
			default: 1
		},
		// 是否只允许输入整数
		integer: {
			type: Boolean,
			default: false
		},
		// 是否禁用，包括输入框，加减按钮
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否禁用输入框
		disabledInput: {
			type: Boolean,
			default: false
		},
		// 是否开启异步变更，开启后需要手动控制输入值
		asyncChange: {
			type: Boolean,
			default: false
		},
		// 输入框宽度，单位为px
		inputWidth: {
			type: [String, Number],
			default: 35
		},
		// 是否显示减少按钮
		showMinus: {
			type: Boolean,
			default: true
		},
		// 是否显示增加按钮
		showPlus: {
			type: Boolean,
			default: true
		},
		// 显示的小数位数
		decimalLength: {
			type: [String, Number, null],
			default: null
		},
		// 是否开启长按加减手势
		longPress: {
			type: Boolean,
			default: true
		},
		// 输入框文字和加减按钮图标的颜色
		color: {
			type: String,
			default: '#323233'
		},
		// 按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致
		buttonSize: {
			type: [String, Number],
			default: 30
		},
		// 输入框和按钮的背景颜色
		bgColor: {
			type: String,
			default: '#EBECEE'
		},
		// 指定光标于键盘的距离，避免键盘遮挡输入框，单位px
		cursorSpacing: {
			type: [String, Number],
			default: 100
		},
		// 是否禁用增加按钮
		disablePlus: {
			type: Boolean,
			default: false
		},
		// 是否禁用减少按钮
		disableMinus: {
			type: Boolean,
			default: false
		},
		// 加减按钮图标的样式
		iconStyle: {
			type: [Object, String],
			default: ''
		},
		...uni.$uv?.props?.numberBox
	}
});
