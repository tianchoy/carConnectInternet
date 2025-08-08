// @ts-nocheck
export default {
	/** 取消按钮文字 */
	cancelBtn: {
		type: String,
		default: null,
	},
	cancelStyle: {
		type: String,
		default: null
	},
	/** 确定按钮文字 */
	confirmBtn: {
		type: String,
		default: null,
	},
	confirmStyle: {
		type: String,
		default: null
	},
	/**  组件国际化语言，目前支持: 简体中文(zh)、(tc)、英文(en)、日语(ja)、韩语(ko)、俄语(ru)等六种语言 */
	customLocale: {
		type: String,
		default: 'zh',
	},
	/** 选择器的最大可选时间，默认为当前时间+10年 */
	end: {
		type: [String, Number],
		default: null,
	},
	/** 列选项过滤函数，支持自定义列内容。(type 值可为: year, month, date, hour, minute, second) */
	customFilter: {
		type: Function,
	},
	/** 用于格式化 pick、change、confirm 事件返回的值，[详细文档](https://day.js.org/docs/en/display/format) */
	format: {
		type: String,
		default: 'YYYY-MM-DD HH:mm:ss',
	},
	/**1 = year = 年；2 = month = 月；4 = date = 日；8 = hour = 时； 16 = minute = 分; 32 = second = 秒 */
	mode: {
		type: [String, Number],
		default: 1|2|4,
	},
	/** 选择器的最小可选时间，默认为当前时间-10年 */
	start: {
		type: [String, Number],
		default: null,
	},
	/** 时间间隔步数，示例：`{ minute: 5 }` */
	steps: {
		type: Object,
	},
	/** 标题 */
	title: {
		type: String,
		default: null,
	},
	titleStyle: {
		type: String,
		default: null
	},
	/** 选中值 */
	value: {
		type: [String, Number],
		default: null,
	},
	/** 选中值，非受控属性 */
	defaultValue: {
		type: [String, Number],
		default: null,
	},
	modelValue: {
		type: [String, Number],
		default: null
	},
	itemHeight: {
		type: String,
		default: null
	},
	itemColor: {
		type: String,
		default: null
	},
	itemFontSize: {
		type: String,
		default: null
	},
	itemActiveColor: {
		type: String,
		default: null
	},
	
	indicatorStyle: {
		type: String,
		default: null
	},
	bgColor:{
		type: String,
		default: null
	},
	groupHeight:{
		type: String,
		default: null
	},
	radius:{
		type: String,
		default: null
	},
	showUnit: {
		type: Boolean,
		default: true
	},
	resetIndex: {
		type: Boolean
	},
	minHour: {
		type: Number,
		default: 0
	},
	maxHour: {
		type: Number,
		default: 23
	},
	minMinute: {
		type: Number,
		default: 0
	},
	maxMinute: {
		type: Number,
		default: 59
	},
}