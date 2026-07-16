export default {
	/**
	 * 显示与隐藏
	 */
	visible : {
		type: Boolean,
		default: false,
	},
	modelValue: Boolean,
	value: Boolean,
	/**
	 * 展示类型，列表和表格形式展示
	 */
	// type : 'list' | 'grid';
	/**
	 * 菜单项
	 */
	list : {
		type: Array,
		default: () => []
	},
	/**
	* 动作面板描述文字
	*/
	description : {
		type: String,
		default: ''
	},
	/**
	 * 设置取消按钮的文本
	 */
	cancelText: {
		type: String,
		default: ''
	},
	/**
	 * 设置每页展示菜单的数量，仅当 type=grid 时有效
	 */
	// count: number;
	/**
	 * 水平对齐方式
	 */
	align: {
		type: String,
		default: 'center' //'center' | 'left'
	},
	/**
	 * 是否显示遮罩层
	 */
	overlay: {
		type: Boolean,
		default: true,
	},
	rowCol: {
		type: Array,
		default: null
	},
	safeAreaInsetBottom: {
		type: Boolean,
		default: true,
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '' 
	},
	closeable: {
		type: Boolean,
		default: true,
	},
}