<template>
	<l-picker :title="title" :titleStyle="titleStyle" :confirm-btn="confirmBtn" :confirm-style="confirmStyle"
		:cancel-btn="cancelBtn" :cancel-style="cancelStyle" :itemHeight="itemHeight" :itemColor="itemColor"
		:itemFontSize="itemFontSize" :itemActiveColor="itemActiveColor" :indicatorStyle="indicatorStyle"
		:bgColor="bgColor" :groupHeight="groupHeight" :radius="radius" :value="valueOfPicker" :columns="columns"
		:maskColors="maskColors" @confirm="onConfirm" @cancel="onCancel" @change="onChange" @pick="onPick">
	</l-picker>
</template>
<script lang="ts">
// @ts-nocheck
/**
 * DateTimePicker 日期时间选择器
 * @description 日期时间选择器组件，支持多种时间模式选择和自定义配置
 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-data-picker
 * 
 * @property {string} cancelBtn 取消按钮文字
 * @property {string | object} cancelStyle 取消按钮样式
 * @property {string} confirmBtn 确定按钮文字
 * @property {string | object} confirmStyle 确定按钮样式
 * @property {'zh' | 'tc' | 'en' | 'ja' | 'ko' | 'ru'} customLocale 组件国际化语言
 * @property {string|number} end 最大可选时间（默认当前时间+10年）
 * @property {string|number} start 最小可选时间（默认当前时间-10年）
 * @property {object} steps 时间间隔步数（例：{ minute: 5 }）
 * @property {string} title 标题文字
 * @property {string | object} titleStyle 标题样式
 * @property {string|number} value 选中值（支持v-model）
 * @property {string|number} defaultValue 默认选中值
 * @property {string|number} modelValue 模型值（支持v-model）
 * @property {string} format 时间格式（使用day.js格式）
 * @property {number} mode 时间选择模式（位运算组合）
 * @value 1 年模式
 * @value 2 月模式
 * @value 4 日模式
 * @value 8 时模式
 * @value 16 分模式
 * @value 32 秒模式
 * @example 1 | 2 组合年月选择
 * @property {(type: TimeModeValues, columns: DateTimePickerColumn) => DateTimePickerColumn} customFilter 自定义过滤函数
 * @property {(type: string, value: string) => string} renderLabel 自定义标签渲染
 * @property {boolean} showUnit 是否显示时间单位
 * @property {string} itemHeight 选项高度
 * @property {string} itemColor 选项文字颜色
 * @property {string} itemFontSize 选项字体大小
 * @property {string} itemActiveColor 选中项颜色
 * @property {string} indicatorStyle 指示器样式
 * @property {string[]} maskColors 遮罩颜色
 * @property {string} bgColor 背景颜色
 * @property {string} groupHeight 选项组高度
 * @property {string} radius 圆角半径
 * @property {boolean} resetIndex 是否重置选项索引
 * @property {number} minHour 最小小时数
 * @property {number} maxHour 最大小时数
 * @property {number} minMinute 最小分钟数
 * @property {number} maxMinute 最大分钟数
 * 
 * @event {Function} confirm 点击确定时触发
 * @event {Function} cancel 点击取消时触发
 * @event {Function} change 值变化时触发
 */
import { defineComponent, computed, ref, watch, onBeforeUnmount } from '@/uni_modules/lime-shared/vue';
import type { DateTimePickerProps, DateValue, DateTimePickerColumn, TimeModeValues, DateTimePickerColumnItem } from './type';
import type { PickerColumn, PickerColumnItem, PickerConfirmEvent, PickerPickEvent } from '@/uni_modules/lime-picker';
import { getMeaningColumn, coalesce } from './utils';
import { DEFAULT_FORMAT, MODE_NAMES, FORMAT_MAP, UNIT_MAP } from './constant';
import { dayuts, type Dayuts, type DayutsUnit } from '@/uni_modules/lime-dayuts'
import { clamp } from '@/uni_modules/lime-shared/clamp'
import dataTimePickerProps from './props';
export default defineComponent({
	name: 'l-date-time-picker',
	props: dataTimePickerProps,
	emits: ['change', 'cancel', 'confirm', 'pick', 'update:modelValue', 'update:value', 'input'],
	setup(props, { emit }) {
		// 默认值
		let defaultValue: DateValue = coalesce(props.value, props.modelValue, props.defaultValue) || Date.now()
		// let defaultValue : DateValue = props.value || props.modelValue || props.defaultValue || Date.now()
		const innerValue = computed({
			set(value: DateValue) {
				if (defaultValue == value) return
				defaultValue = value;
				emit('change', value)
				emit('update:modelValue', value)
				emit('update:value', value)
				// #ifdef VUE2
				emit('input', value)
				// #endif
			},
			get(): DateValue {
				return coalesce(props.value, props.modelValue) || defaultValue
				// const value = props.value || props.modelValue || defaultValue
				// return typeof value == 'string' && value.length == 0 ? Date.now() : value
				// return props.value ?? props.modelValue ?? defaultValue
			}
		} as WritableComputedOptions<DateValue>)

		const meaningColumn = getMeaningColumn(props.mode);
		const isTimeMode = ['hour', 'minute', 'second'].includes(meaningColumn[0]);
		const normalize = (val: DateValue | null, defaultDay: Dayuts): Dayuts => val && dayuts(val).isValid() ? dayuts(val) : defaultDay;
		const start = computed((): Dayuts => normalize(props.start as DateValue | null, dayuts().subtract(1, 'year')));
		const end = computed((): Dayuts => normalize(props.end as DateValue | null, dayuts().add(1, 'year')));
		const rationalize = (val: Dayuts): Dayuts => {
			if (isTimeMode) return val;
			if (val.isBefore(start.value)) return start.value;
			if (val.isAfter(end.value)) return end.value;
			return val;
		};
		const calcDate = (currentValue: DateValue | null): Dayuts => {
			if (meaningColumn.length == 1 && meaningColumn[0] == 'year') {
				if (currentValue) {
					if (typeof currentValue == 'string') {
						// 尝试解析纯年份字符串
						const yearNum = parseInt(currentValue);
						if (!isNaN(yearNum) && yearNum > 1000) {
							return rationalize(dayuts().year(yearNum).startOf('year'));
						}
					}
				}
			}
			if (isTimeMode && (typeof currentValue == 'string')) {
				let format = 'YYYY-MM-DD'
				let space = ' '
				const hasHour = meaningColumn.includes("hour")
				const hasMinute = meaningColumn.includes("minute")
				const hasSecond = meaningColumn.includes("second")

				if (!hasHour && hasMinute) {
					format += ' HH'
					space = ':'
				}
				else if (!hasHour && !hasMinute && hasSecond) {
					format += ' HH:mm'
					space = ':'
				}

				const dateStr = dayuts(start.value).format(format);
				currentValue = `${dateStr}${space}${currentValue}`;
			}
			return currentValue != null && dayuts(currentValue).isValid() ? rationalize(dayuts(currentValue)) : start.value;
		};

		const curDate = ref(calcDate(innerValue.value));
		const valueOfPicker = computed((): string[] => meaningColumn.map((item): string => curDate.value.get(item).toString()));
		const columnCache = new Map<string, DateTimePickerColumnItem[]>();
		const columns = computed((): DateTimePickerColumn[] => {
			const ret: DateTimePickerColumn[] = [];

			const getDate = (date: Dayuts): number[] => [
				date.year(),
				date.month() + 1,
				date.date(),
				date.hour(),
				date.minute(),
				date.second(),
			];
			const [curYear, curMonth, curDay, curHour, curMinute] = getDate(curDate.value);
			const [minYear, minMonth, minDay, minHour, minMinute, minSecond] = getDate(start.value);
			const [maxYear, maxMonth, maxDay, maxHour, maxMinute, maxSecond] = getDate(end.value);

			const isInMinYear = curYear == minYear;
			const isInMaxYear = curYear == maxYear;
			const isInMinMonth = isInMinYear && curMonth == minMonth;
			const isInMaxMonth = isInMaxYear && curMonth === maxMonth;
			const isInMinDay = isInMinMonth && curDay == minDay;
			const isInMaxDay = isInMaxMonth && curDay == maxDay;
			const isInMinHour = isInMinDay && curHour == minHour;
			const isInMaxHour = isInMaxDay && curHour == maxHour;
			const isInMinMinute = isInMinHour && curMinute == minMinute;
			const isInMaxMinute = isInMaxHour && curMinute == maxMinute;

			const generateColumn = (type: string, lowerBound: number, upperBound: number) => {
				const cacheKey = `${type}-${lowerBound}-${upperBound}`;
				if (columnCache.has(cacheKey)) {
					ret.push(columnCache.get(cacheKey)!)
					return
				}

				const arr: DateTimePickerColumnItem[] = [];
				for (let i = lowerBound; i <= upperBound; i++) {
					const value = i;
					arr.push({
						label: props.renderLabel ? props.renderLabel!(type, i) : `${value}${props.showUnit ? UNIT_MAP.get(type) : ''}`,
						value: type == 'month' ? `${value - 1}` : value.toString(),
					} as DateTimePickerColumnItem);
				}

				if (props.customFilter) {
					const _arr = props.customFilter!(type, arr)
					ret.push(_arr)
					columnCache.set(cacheKey, _arr);
				} else {
					ret.push(arr)
					columnCache.set(cacheKey, arr);
				}

			};

			if (meaningColumn.includes('year')) {
				generateColumn('year', minYear, maxYear);
			}
			if (meaningColumn.includes('month')) {
				const lower = isInMinYear ? minMonth : 1;
				const upper = isInMaxYear ? maxMonth : 12;
				generateColumn('month', lower, upper);
			}
			if (meaningColumn.includes('date')) {
				const lower = isInMinMonth ? minDay : 1;
				const upper = isInMaxMonth ? maxDay : dayuts(`${curYear}-${curMonth}`).daysInMonth();
				generateColumn('date', lower, upper);
			}
			if (meaningColumn.includes('hour')) {
				const lower = isInMinDay && !isTimeMode ? minHour : clamp(props.minHour, 0, 23);// 0;
				const upper = isInMaxDay && !isTimeMode ? maxHour : clamp(props.maxHour, lower, 23);//23;
				generateColumn('hour', lower, upper);
			}
			if (meaningColumn.includes('minute')) {
				const lower = isInMinHour && !isTimeMode ? minMinute : clamp(props.minMinute, 0, 59);//0;
				const upper = isInMaxHour && !isTimeMode ? maxMinute : clamp(props.maxMinute, lower, 59);//59;
				generateColumn('minute', lower, upper);
			}
			if (meaningColumn.includes('second')) {
				const lower = isInMinMinute && !isTimeMode ? minSecond : 0;
				const upper = isInMaxMinute && !isTimeMode ? maxSecond : 59;
				generateColumn('second', lower, upper);
			}
			return ret;
		})

		const innterFormat = computed((): string => {
			const first = meaningColumn.length > 0 ? meaningColumn[0] : 'year';
			const last = meaningColumn.length > 0 ? meaningColumn[meaningColumn.length - 1] : 'date';

			const format = DEFAULT_FORMAT.substring(
				DEFAULT_FORMAT.indexOf(FORMAT_MAP.get(first)!),
				DEFAULT_FORMAT.lastIndexOf(FORMAT_MAP.get(last)!) + FORMAT_MAP.get(last)!.length
			)
			return format
		})
		const onConfirm = ({ values }: PickerConfirmEvent) => {

			// const first = meaningColumn.length > 0 ? meaningColumn[0]: 'year';
			// const last =  meaningColumn.length > 0 ? meaningColumn[meaningColumn.length - 1]: 'date';

			// const format = DEFAULT_FORMAT.substring(
			// 	DEFAULT_FORMAT.indexOf(FORMAT_MAP.get(first)!),
			// 	DEFAULT_FORMAT.lastIndexOf(FORMAT_MAP.get(last)!) + FORMAT_MAP.get(last)!.length
			// )

			let cur = curDate.value
			// MODE_NAMES
			values.forEach((item, index) => {
				const type = meaningColumn[index]
				cur = cur.set(type, parseInt(`${item}`, 10))
			})
			const curValue = cur.format(props.format)

			innerValue.value = cur.format(innterFormat.value);
			emit('confirm', curValue);
		}
		const onCancel = () => {
			emit('cancel')
		}
		const onPick = ({ values, column, index }: PickerPickEvent) => {
			const type = meaningColumn[column];
			const val = curDate.value.set(type as DayutsUnit, parseInt(columns.value[column][index].value, 10));

			curDate.value = rationalize(val);
			emit('pick', rationalize(val).format(props.format))
		}
		const onChange = (values: PickerValue[]) => {
			let cur = curDate.value
			values.forEach((item, index) => {
				const type = meaningColumn[index]
				cur = cur.set(type, parseInt(`${item}`, 10))
			})
			curDate.value = rationalize(cur as Dayuts)
			const curValue = curDate.value.format(innterFormat.value)
			innerValue.value = curValue

		}
		const stop = watch(innerValue, (val: DateValue) => {
			// 时间模式下，不重新计算日期，因为时间变化已由 onPick/onChange 处理
			// if(isTimeMode) return
			curDate.value = calcDate(val);
		});

		onBeforeUnmount(() => {
			stop()
			columnCache.clear()
		})


		return {
			valueOfPicker,
			columns,
			onConfirm,
			onCancel,
			onChange,
			onPick
		}
	}
})

</script>
<style></style>
