// @ts-nocheck
import { unitConvert } from '@/uni_modules/lime-shared/unitConvert'
import type { PickerColumnItem, PickerValue } from '../l-picker/type';

type PickerCanvasElement = UniElement
type PickerDrawableContext = DrawableContext







export type PickerCanvasConfig = {
	itemHeight : number;
	itemFontSize : number;
	itemActiveFontWeight ?: number;
	itemColor ?: string;
	itemActiveColor ?: string;
	canvasWidth : number;
	canvasHeight : number;
}

export class PickerCanvasRenderer {
	// private canvas : PickerCanvasElement | null = null;
	private ctx : PickerDrawableContext | null = null;
	private dpr : number = 1;
	private isInitialized : boolean = false;
	private canvas : PickerCanvasElement
	private lastWidth : number = 0;
	private lastHeight : number = 0;
	constructor(itemRef : PickerCanvasElement) {
		this.canvas = itemRef
		this.initCanvas();
	}

	private initCanvas() {

		// this.ctx = this.canvas.getDrawableContext();
		this.isInitialized = true;
		return














	}

	private setupCanvas(width : number, height : number) {
		// if (!this.isInitialized) return;

		// this.canvas.style.setProperty('height', `${height}px`);
		// this.ctx?.reset();
		return

		










	}
	clearRect(width : number = 1000, height : number = 100000) {

		this.ctx?.reset();
		return




	}
	render(options : PickerColumnItem[], curIndex : number, config : PickerCanvasConfig, isDarkMode : boolean) {
		// 安卓不能把ctx存在实例中？
		// if(this.ctx == null) return
		
		const ctx = this.canvas.getDrawableContext()!
		const itemHeight = config.itemHeight;
		const fontSize = config.itemFontSize;
		const canvasWidth = config.canvasWidth
		const canvasHeight = config.canvasHeight 
		// this.ctx = ctx
		// 设置容器和Canvas尺寸
		this.setupCanvas(canvasWidth, canvasHeight);
		ctx.reset();
		const x = canvasWidth / 2;
		const itemActiveFontWeight = config?.itemActiveFontWeight ?? 700;

		const color = config?.itemColor ?? (isDarkMode ? `rgba(255,255,255,0.88)` : 'rgba(0,0,0,0.88)');
		const itemActiveColor = config?.itemActiveColor ?? (isDarkMode ? `rgba(255,255,255,0.88)` : 'rgba(0,0,0,0.88)');
		
		
		// 设置绘图上下文

		ctx.font = `${fontSize}px`;




		ctx.textAlign = 'center';
		// ctx.textBaseline = 'middle'; // 使用中间基线实现垂直居中
		ctx.lineWidth = 0.5;

		// 清空画布
		this.clearRect(canvasWidth, canvasHeight);

		// 绘制所有选项
		options.forEach((item, index) => {
			// const y = itemHeight * index + (itemHeight + fontSize) / 2;
			let offset = 0.4



			const y = itemHeight * index + fontSize + (itemHeight - fontSize) * offset;
			// const y = itemHeight * index + itemHeight / 2; // 垂直居中

			const isActive = index == curIndex && itemActiveFontWeight > 600;
			ctx.fillStyle = isActive ? itemActiveColor : color;
			ctx.strokeStyle = isActive ? itemActiveColor : color;

			ctx.fillText(item.label, x, y);

			if (isActive) {








				ctx.strokeText(item.label, x, y);

			}
		});


		ctx.update();

	}

	destroy() {
		// this.canvas = null;
		this.ctx = null;
		this.isInitialized = false;
	}
}

// // 在组件中使用
// const canvasRenderer = ref<PickerCanvasRenderer | null>(null);

// const updateItemStyle = () => {
//     if (!itemRef.value) return;

//     // 初始化渲染器（只初始化一次）
//     if (!canvasRenderer.value) {
//         canvasRenderer.value = new PickerCanvasRenderer(
//             itemRef.value,
//             isDarkMode.value,
//             picker
//         );
//     }

//     // 执行渲染
//     canvasRenderer.value.render(props.options, curIndex.value);
// };

// // 在组件卸载时清理
// onBeforeUnmount(() => {
//     if (canvasRenderer.value) {
//         canvasRenderer.value.destroy();
//         canvasRenderer.value = null;
//     }
// });