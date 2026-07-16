<template>
	<l-popup v-model="innerValue" position="bottom" :safeAreaInsetBottom="safeAreaInsetBottom">
		<view class="l-action-sheet">
			<view class="l-action-sheet__title" v-if="title || $slots['title']">
				<slot name="title"></slot>
				<text class="l-action-sheet__title-text" v-if="title">{{title}}</text>
				<view class="l-action-sheet__close-btn" v-if="closeable" @click="handleClose">
					<l-icon name="close" size="24px" aria-role="button" aria-label="关闭"></l-icon>
				</view>
			</view>
			<slot name="description">
				<text class="l-action-sheet__description" 
				:class="{'l-action-sheet__description--left': align == 'left'}"
				v-if="description.length > 0">{{description}}</text>
			</slot>
			<view class="l-action-sheet__content" >
				<template v-if="rowCol == null">
					<view class="l-action-sheet__item"
						:hover-class="!item.disabled ? 'l-action-sheet__item--hover': ''"
						:class="{
							'l-action-sheet__item--left': align == 'left',
							'l-action-sheet__item--bordered': bordered && index != actionItems.length - 1,
							'l-action-sheet__item--disabled': item.disabled,
						}"
						v-for="(item, index) in actionItems" 
						@click="handleSelected(item)"
						:key="index">
						<view class="l-action-sheet__item-icon">
							<l-icon 
								v-if="item.icon" 
								:color="item.iconColor || item.color"
								:size="item.fontSize"
								:name="item.icon" />
						</view>
						<text class="l-action-sheet__item-text" 
							:style="[
								item.color ? 'color:' + item.color: '',
								item.fontSize ? 'font-size:' + item.fontSize : '',
							]">{{item.label}}</text>
					</view>
				</template>
				<template v-else>
					<scroll-view 
						class="l-action-sheet__row" 
						enable-flex
						direction="horizontal"
						:show-scrollbar="false"
						:scroll-with-animation="true" 
						:scroll-x="true"
						:key="rowIndex"
						:class="{
							'l-action-sheet__row--border': rowIndex > 0 && rowIndex < actionRowCols.length,
						}"
						v-for="(row, rowIndex) in actionRowCols">
						<view class="l-action-sheet__wrap">
							<view
								class="l-action-sheet__col"
								:class="{
									'l-action-sheet__item--disabled': item.disabled,
									'l-action-sheet__col--evenly': !(row.length > 4),
								}"
								v-for="(item, colIndex) in row" @click="handleSelected(item)" :key="colIndex">
								<image class="l-action-sheet__image"
								:style="[
									'background: transparent',
									'border-radius:' + item.radius,
								]"
								v-if="item.icon && item.__isImage" :src="item.icon"></image>
								<view class="l-action-sheet__image l-action-sheet__image--center"
								:style="[
									'background:' + item.bgColor,
									'border-radius:' + item.radius,
								]"
								v-else-if="item.icon">
									<l-icon class="l-action-sheet__col-icon"
										:color="item.iconColor || item.color"
										:size="item.fontSize"
										:name="item.icon" />
								</view>
								<text class="l-action-sheet__col-text"
									:style="[
										'color:' + item.color ,
										'font-size:' + item.fontSize,
									]">{{item.label}}</text>
							</view>
						</view>
					</scroll-view>
				</template>
			</view>
			<view class="l-action-sheet__gap" v-if="cancelText.length > 0"></view>
			<view class="l-action-sheet__cancel" hover-class="l-action-sheet__cancel--hover" @click="handleCancel" v-if="cancelText.length > 0">
				<text class="l-action-sheet__cancel-text">{{cancelText}}</text>
			</view>
		</view>
	</l-popup>
</template>
<script lang="ts">
	// @ts-nocheck
	/**
	 * ActionSheet 动作面板组件
	 * @description 用于底部弹起的模态面板，提供多个选项供用户选择
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-action-sheet
	 * 
	 * @property {boolean} visible 控制面板显示/隐藏（必填）
	 * @property {object[]} list 菜单项数据集合（必填）
	 * @property {string} description 面板描述文字
	 * @property {string} cancelText 取消按钮文本（必填）
	 * @property {'center' | 'left'} align 菜单项对齐方式
	 * @value center	居中
	 * @value left	    居左
	 * @property {boolean} overlay 是否显示遮罩层
	 * @property {boolean} safeAreaInsetBottom 是否启用底部安全区域适配
	 * @property {number[]} rowCol 骨架屏行/列配置（用于加载状态）
	 * @property {boolean} bordered 是否显示菜单项分割线
	 * @event {Function} select 选中触发
	 * @event {Function} cancel 取消
	 
	 */
	import {ref, defineComponent, computed } from '@/uni_modules/lime-shared/vue';
	import actionSheetProps from './props';
	
	export default defineComponent({
		name: 'l-action-sheet',
		props: actionSheetProps,
		emits: ['select','update:modelValue', 'input', 'cancel'],
		setup(props, {emit}) {
			
			const modelValue = ref(false)
			const innerValue = computed({
				set(value: boolean) {
					modelValue.value = value;
					emit('update:modelValue', value)
					// #ifdef VUE2
					emit('input', value)
					// #endif
				},
				get():boolean {
					return props.visible || props.value || props.modelValue || modelValue.value
				}
			} as WritableComputedOptions<boolean>) 
			
			const isImage = (name: string|null):boolean => {
				if(name == null) return false;
				return /\.(jpe?g|png|gif|bmp|webp|tiff?)$/i.test(name) || /^data:image\/(jpeg|png|gif|bmp|webp|tiff);base64,/.test(name)
			}
			const actionItems = computed(():ActionSheetItem[] =>{
				return props.list.map((it, index) => Object.assign({}, it, {__index: index, __isImage: isImage(it['icon'])}))
			})
			
			const actionRowCols = computed(():ActionSheetItem[][]=>{
				const result: ActionSheetItem[][] = [];
				const _rowCol = props.rowCol
				if(_rowCol == null) return result
				const list = [...actionItems.value] //toRaw(actionItems.value) as ActionSheetItem[]
				const rows = _rowCol.length;
				
				for (let i = 0; i < rows; i++) {
					let cols = _rowCol[i]
					const row: ActionSheetItem[] = [];
					
					while(cols > 0 && list.length > 0) {
						const item = list.shift()
						cols--
						row.push(item!)
					}
					if(row.length > 0) {
						result.push(row)
					}
				}
				if(list.length > 0) {
					result.push(list)
				}
				return result
			})
			const handleSelected = (item:ActionSheetItem) => {
				if(item.disabled) return;
				emit('select', item.__index, props.list[item.__index]);
				innerValue.value = false
			}
			const handleCancel = () =>{
				innerValue.value = false
				emit('cancel')
			}
			
			
			return {
				innerValue,
				actionItems,
				actionRowCols,
				handleSelected,
				handleCancel
			}
		}
	})
	
</script>
<style lang="scss">
	@import './index';
</style>
