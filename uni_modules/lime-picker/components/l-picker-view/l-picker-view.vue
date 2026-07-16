<template>
	<view class="l-picker-view" :style="[styles]">
		<view class="l-picker-view__toolbar" v-if="cancelBtn || title || confirmBtn">
			<text class="l-picker-view__cancel" :style="cancelStyle" v-if="cancelBtn"
				@click="onCancel">{{cancelBtn}}</text>
			<text class="l-picker-view__title" :style="titleStyle" v-if="title">{{title}}</text>
			<text class="l-picker-view__confirm" :style="confirmStyle" v-if="confirmBtn"
				@click="onConfirm">{{confirmBtn}}</text>
		</view>
		<slot name="header"></slot>
		<view class="l-picker-view__main" :style="[groupHeight ? { height:  groupHeight}: {}]">
			<view v-if="isEmpty" class="l-picker-view__empty">
				<slot name="empty"></slot>
			</view>
			<view class="l-picker-view__indicator"></view>
			<picker-view class="l-picker-view__group" :style="{ opacity: columns.length > 0 ? 1 : 0 }"
				:mask-style="platformMaskStyles.common" :indicator-style="indicatorStyles"
				mask-class="l-picker-view__mask" :value="innerIndex" @change="handlePick">
				<picker-view-column class="l-picker-view__wrapper" v-for="(column, columnIndex) in columns"
					:key="columnIndex">
					<text class="l-picker-view__group-item" v-for="(item, itemIndex) in column"
						:class="{'l-picker-view__group-item--active': curIndex[columnIndex] == itemIndex}"
						:key="item.value">{{item.label}}</text>
				</picker-view-column>
			</picker-view>
		</view>
		<slot name="footer" />
		<view class="l-picker__loading" ref="loadingRef" v-if="loading" :style="[loadingMaskColor ? {background: loadingMaskColor}: {}]">
			<l-loading  :size="loadingSize" :color="loadingColor"></l-loading>
		</view>
	</view>
</template>
<script lang="ts">
	// @ts-nocheck
	/**
	 * PickerView 选择器视图组件
	 * @description 整合了 Picker 和 PickerItem 的功能，无需使用子组件即可完成多列选择
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-picker
	 * 
	 * @property {string} cancelBtn 取消按钮文字
	 * @property {string | UTSJSONObject} cancelStyle 取消按钮样式
	 * @property {string} confirmBtn 确定按钮文字
	 * @property {string | UTSJSONObject} confirmStyle 确定按钮样式
	 * @property {string} title 标题文字
	 * @property {string | UTSJSONObject} titleStyle 标题样式
	 * @property {UTSJSONObject} keys 字段别名配置（例：{value: 'id', label: 'name'}）
	 * @property {PickerColumn[]} columns 选择器列数据（必填）
	 * @property {PickerValue[]} modelValue 选中值（支持v-model）
	 * @property {PickerValue[]} defaultValue 默认选中值
	 * @property {PickerValue[]} value 选中值（兼容旧版）
	 * @property {boolean} loading 是否显示加载状态
	 * @property {string} loadingColor 加载图标颜色
	 * @property {string} loadingMaskColor 加载遮罩颜色
	 * @property {string} loadingSize 加载图标尺寸
	 * @property {string} itemHeight 选项行高度
	 * @property {string} itemColor 选项文字颜色
	 * @property {string} itemFontSize 选项字体大小
	 * @property {string} itemActiveColor 选中项颜色
	 * @property {string} indicatorStyle 指示器样式
	 * @property {string[]} maskColors 遮罩颜色
	 * @property {string} bgColor 背景颜色
	 * @property {string} groupHeight 选项组高度
	 * @property {string} radius 圆角半径
	 * @property {boolean} resetIndex 是否重置选中索引
	 * 
	 * @event {Function} confirm 点击确定时触发（事件参数：PickerConfirmEvent）
	 * @event {Function} cancel 点击取消时触发
	 * @event {Function} change 值变化时触发（事件参数：PickerPickEvent）
	 * @event {Function} column-change 列数据变化时触发（事件参数：PickerChangeInfo）
	 */
	import type { PickerProps, PickerColumn, PickerValue, PickerColumnItem, PickerConfirmEvent, PickerPickEvent } from '../l-picker/type';
	import { defineComponent, computed, ref } from '@/uni_modules/lime-shared/vue';
	import pickerProps from './props';
	import { usePickerView } from './usePickerView';
	import { usePickerMask } from '../l-picker-item/usePickerMask';

	export default defineComponent({
		name: 'l-picker-view',
		props: pickerProps,
		emits: ['change', 'cancel', 'pick', 'confirm', 'update:modelValue'],
		setup(props, { emit, expose }) {
			const {
				// 计算属性
				modelValue,
				isEmpty,
				innerIndex,
				curIndex,

				// 方法
				handlePick,
				onCancel,
				onConfirm,
				getSelectedOptions
			} = usePickerView(props);

			// 平台特定样式计算属性
			const isDarkMode = ref(false);
			const { platformMaskStyles } = usePickerMask(
				computed(() => props.bgColor),
				computed(() => isDarkMode.value),
				computed(() => props.maskColors),
				ref(true)
			);

			// 样式计算属性
			const styles = computed(() => {
				const style : Record<string, any> = {};
				if (props.bgColor) {
					style['--l-picker-bg-color'] = props.bgColor!;
				}
				if (props.radius) {
					style['--l-picker-border-radius'] = props.radius!;
				}
				if (props.itemColor) {
					style['--l-picker-item-color'] = props.itemColor!;
				}
				if (props.itemFontSize) {
					style['--l-picker-item-font-size'] = props.itemFontSize!;
				}
				if (props.itemHeight) {
					style['--l-picker-item-height'] = props.itemHeight!;
				}
				if (props.itemActiveColor) {
					style['--l-picker-item-active-color'] = props.itemActiveColor!;
				}
				if (props.itemActiveFontWeight) {
					style['--l-picker-item-active-font-weight'] = props.itemActiveFontWeight!;
				}

				return style;
			});


			const indicatorStyles = computed(() : string => {
				return `
				border-top-color: rgba(0,0,0,0);
				border-bottom-color: rgba(0,0,0,0);` + props.itemHeight ? `height: ${props.itemHeight ?? '50px'};` : ''
			});


			// #ifdef VUE3
			expose({
				confirm: onConfirm,
				getSelectedOptions,
			});
			// #endif

			return {
				// 计算属性
				styles,
				modelValue,
				isEmpty,
				innerIndex,
				platformMaskStyles,
				indicatorStyles,
				curIndex,

				// 方法
				handlePick,
				onCancel,
				onConfirm,

				// #ifdef VUE2
				confirm: onConfirm,
				getSelectedOptions,
				// #endif
			};
		}
	});
</script>
<style lang="scss">
	@import './index.scss';
</style>