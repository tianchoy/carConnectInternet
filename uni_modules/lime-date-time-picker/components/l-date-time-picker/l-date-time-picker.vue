<template>
	<l-picker
		:title="title" 
		:titleStyle="titleStyle" 
		:confirm-btn="confirmBtn" 
		:confirm-style="confirmStyle" 
		:cancel-btn="cancelBtn" 
		:cancel-style="cancelStyle" 
		:itemHeight="itemHeight" 
		:itemColor="itemColor" 
		:itemFontSize="itemFontSize" 
		:itemActiveColor="itemActiveColor" 
		:indicatorStyle="indicatorStyle" 
		:bgColor="bgColor" 
		:groupHeight="groupHeight" 
		:radius="radius" 
		:value="valueOfPicker" 
		:columns="columns"
		@confirm="onConfirm" 
		@cancel="onCancel" 
		@change="onChange" 
		@pick="onPick">
	</l-picker>
</template>
<script lang="ts">
	// @ts-nocheck
	import { defineComponent, computed, ref, watch, onBeforeUnmount} from '@/uni_modules/lime-shared/vue';
	import { DateTimePickerProps, DateValue, DateTimePickerColumn, TimeModeValues, DateTimePickerColumnItem } from './type';
	import { PickerColumn, PickerColumnItem, PickerConfirmEvent, PickerPickEvent } from '@/uni_modules/lime-picker';
	import { getMeaningColumn } from './utils';
	import { DEFAULT_FORMAT, MODE_NAMES, FORMAT_MAP, UNIT_MAP } from './constant';
	import { dayuts, Dayuts, DayutsUnit} from '@/uni_modules/lime-dayuts'
	import { clamp } from '@/uni_modules/lime-shared/clamp'
	import dataTimePickerProps from './props';
	export default defineComponent({
		name: 'l-date-time-picker',
		props: dataTimePickerProps,
		emits: ['change', 'cancel', 'confirm', 'pick', 'update:modelValue', 'update:value','input'],
		setup(props, {emit}) {
			// 默认值
			let defaultValue : DateValue = props.value ?? props.defaultValue ?? props.defaultValue ?? Date.now()
			const innerValue = computed({
				set(value : DateValue) {
					if(defaultValue == value) return
					defaultValue = value;
					emit('change', value)
					emit('update:modelValue', value)
					emit('update:value', value)
					// #ifdef VUE2
					emit('input', value)
					// #endif
				},
				get() : DateValue {
					const value = props.value ?? props.modelValue ?? defaultValue
					return typeof value == 'string' && value.length == 0 ? Date.now() : value
					// return props.value ?? props.modelValue ?? defaultValue
				}
			} as WritableComputedOptions<DateValue>)
			
			const meaningColumn = getMeaningColumn(props.mode);
			const isTimeMode = ['hour', 'minute', 'second'].includes(meaningColumn[0]);
			const normalize = (val : DateValue | null, defaultDay : Dayuts) : Dayuts => val != null && dayuts(val).isValid() ? dayuts(val) : defaultDay;
			const start = computed(() : Dayuts => normalize(props.start as DateValue | null, dayuts().subtract(10, 'year')));
			const end = computed(() : Dayuts => normalize(props.end as DateValue | null, dayuts().add(10, 'year')));
			const rationalize = (val : Dayuts) : Dayuts => {
				if (isTimeMode) return val;
				if (val.isBefore(start.value)) return start.value;
				if (val.isAfter(end.value)) return end.value;
				return val;
			};
			const calcDate = (currentValue : DateValue | null) : Dayuts => {
				if (isTimeMode) {
					const dateStr = dayuts(start.value).format('YYYY-MM-DD');
					currentValue = `${dateStr} ${currentValue}`;
				}
				return currentValue != null && dayuts(currentValue).isValid() ? rationalize(dayuts(currentValue)) : start.value;
			};
			
			const curDate = ref(calcDate(innerValue.value));
			const valueOfPicker = computed(() : string[] => meaningColumn.map((item) : string => curDate.value.get(item).toString()));
			const columnCache = new Map<string, DateTimePickerColumnItem[]>();
			const columns = computed(() : DateTimePickerColumn[] => {
				const ret : DateTimePickerColumn[] = [];
				
				const getDate = (date : Dayuts) : number[] => [
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
				        label: props.renderLabel !=null ? props.renderLabel!(type, i) : `${value}${props.showUnit ? UNIT_MAP.get(type) : ''}`,
				        value: type == 'month' ? `${value - 1}` : value.toString(),
				      } as DateTimePickerColumnItem);
				    }
				    
					if(props.customFilter != null) {
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
			
			const innterFormat = computed(() : string => {
				const first = meaningColumn.length > 0 ? meaningColumn[0] : 'year';
				const last = meaningColumn.length > 0 ? meaningColumn[meaningColumn.length - 1] : 'date';
			
				const format = DEFAULT_FORMAT.substring(
					DEFAULT_FORMAT.indexOf(FORMAT_MAP.get(first)!),
					DEFAULT_FORMAT.lastIndexOf(FORMAT_MAP.get(last)!) + FORMAT_MAP.get(last)!.length
				)
				return format
			})
			const onConfirm = ({ values } : PickerConfirmEvent) => {
				
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
			const onPick = ({ values, column, index } : PickerPickEvent) => {
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
			const stop = watch(innerValue, (val : DateValue) => {
				curDate.value = calcDate(val);
			});
			
			onBeforeUnmount(()=>{
				stop()
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
<style>
</style>
