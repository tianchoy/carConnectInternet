// @ts-nocheck
import type { PickerProps, PickerValue, PickerColumnItem, PickerColumn, PickerConfirmEvent, PickerPickEvent } from '../l-picker/type';
import { arrayEqual } from '@/uni_modules/lime-shared/arrayEqual';
import { clamp } from '@/uni_modules/lime-shared/clamp';
import { assignAtIndex } from '@/uni_modules/lime-shared/assignAtIndex'
// #ifndef UNI-APP-X
import { computed, ref, watch, onMounted, nextTick, onBeforeUnmount, toRaw, WritableComputedOptions, Ref, ComputedRef } from '@/uni_modules/lime-shared/vue';
// #endif
// #ifdef UNI-APP-X
import type { ComputedRef } from 'vue'
// #endif

// 定义 usePickerView 钩子的返回类型接口
export type UsePickerViewReturn = {
	// 状态
	defaultValue : Ref<PickerValue[]>;
	curIndex : Ref<number[]>;
	curValue : Ref<PickerValue[]>;
	curItem : Ref<PickerColumnItem[]>;

	// 计算属性
	modelValue : ComputedRef<PickerValue[]>;
	isEmpty : ComputedRef<boolean>;
	innerIndex : ComputedRef<number[]>;

	// 方法
	getIndexByValue : (val : PickerValue | null, columnIndex : number) => number;
	setIndex : (indexes : number[]) => void;
	setValue : (values : PickerValue[]) => void;
	updatePickerItems : () => void;
	handlePick : (e : UniPickerViewChangeEvent) => void;
	onCancel : (e : UniPointerEvent) => void;
	onConfirm : () => void;
	getSelectedOptions : () => PickerConfirmEvent;
}


/**
 * 检测变化的列索引
 * @param newIndexes 新的索引数组
 * @param oldIndexes 旧的索引数组
 * @returns 变化的列索引，如果没有变化返回-1
 */
const findChangedColumnIndex = (
	newIndexes : number[],
	oldIndexes : number[]
) : number => {
	// 比较两个数组的长度，取较长的进行遍历
	const maxLength = Math.max(newIndexes.length, oldIndexes.length);

	for (let i = 0; i < maxLength; i++) {
		const newIndex = i < newIndexes.length ? newIndexes[i] : null;
		const oldIndex = i < oldIndexes.length ? oldIndexes[i] : null;

		// 如果索引不相等，说明该列发生了变化
		if (newIndex != oldIndex) {
			return i;
		}
	}

	return -1; // 没有变化
};


export function usePickerView(props : PickerProps) : UsePickerViewReturn {
	// 内部状态管理
	const defaultValue = ref<PickerValue[]>(props.value ?? props.modelValue ?? props.defaultValue ?? []);
	const curIndex = ref<number[]>([]);
	const curValue = ref<PickerValue[]>([]);
	const curItem = ref<PickerColumnItem[]>([]);
	// 添加初始化标志
	let isInitialized = false;
	let isInternalChange = false;

	const instance = getCurrentInstance()?.proxy
	// 计算属性
	const modelValue = computed({
		set(value : PickerValue[]) {
			if (arrayEqual(value, defaultValue.value)) return;
			defaultValue.value = value;
			instance?.$emit('update:modelValue', value);
			instance?.$emit('change', value);
		},
		get() : PickerValue[] {
			return props.value ?? props.modelValue ?? defaultValue.value;
		}
	} as WritableComputedOptions<PickerValue[]>);

	const isEmpty = computed(() : boolean => {
		return props.columns.length == 0 || props.columns.every(column => column.length == 0);
	});

	const innerIndex = computed(() : number[] => {
		return curIndex.value;
	});

	// 辅助方法
	const getIndexByValue = (val : PickerValue | null, columnIndex : number) : number => {
		let defaultIndex = 0;
		if (val != null && props.columns.length > columnIndex) {
			defaultIndex = props.columns[columnIndex].findIndex((item) => item.value == val);

		}

		return defaultIndex < 0 ? 0 : defaultIndex;
	};

	const setIndex = (indexes : number[]) => {
		const oldIndex = [...curIndex.value]
		indexes.forEach((index, columnIndex) => {
			if (props.columns.length < columnIndex + 1) return;
			// let lastIndex = curIndex.value[columnIndex] || 0;
			let _index = clamp(index, 0, props.columns[columnIndex].length - 1);
			if (props.columns[columnIndex].length > _index) {
				assignAtIndex(curIndex.value, columnIndex, _index)
				assignAtIndex(curValue.value, columnIndex, props.columns[columnIndex][_index].value)
				assignAtIndex(curItem.value, columnIndex, props.columns[columnIndex][_index])
			}
		});
		// 只有创建新的数组 watch才能监听到
		curIndex.value = [...curIndex.value]
		curValue.value = [...curValue.value]
		curItem.value = [...curItem.value]
	};

	const setValue = (values : PickerValue[]) => {
		if (arrayEqual(values, curValue.value)) return;

		const indexes : number[] = [];
		values.forEach((value, columnIndex) => {
			const index = getIndexByValue(value, columnIndex);
			indexes.push(index);
		});
		// _changedColumn = -1
		setIndex(indexes);
	};

	const updatePickerItems = () => {
		const _indexs : number[] = [];
		const _values : PickerValue[] = [];
		const _oldIndexs = curIndex.value
		props.columns.forEach((column, columnIndex) => {
			if (column.length == 0) return;
			const value = curValue.value.length > columnIndex ? curValue.value[columnIndex] : null;
			const index = value == null ? 0 : getIndexByValue(value, columnIndex);
			const item = column[index];

			_indexs.push(index);
			_values.push(item.value);
			assignAtIndex(curItem.value, columnIndex, item)

		});

		if (arrayEqual(curValue.value, _values) && arrayEqual(curIndex.value, _indexs)) return;
		curIndex.value = _indexs;
		curValue.value = _values;
		modelValue.value = [...curValue.value];

		// #ifdef APP-IOS

		if (_oldIndexs.length != _indexs.length) return
		// uniappx ios可能无法滚动到指定项
		// 所以先找到变化的列 让列里的项先前滚动再滚回
		// 找出变化的列
		const changedColumn = findChangedColumnIndex(_indexs, _oldIndexs)
		isInternalChange = true
		requestAnimationFrame(() => {
			const value = curIndex.value[changedColumn]
			curIndex.value[changedColumn] = value - 1
			requestAnimationFrame(() => {
				curIndex.value[changedColumn] = value
				requestAnimationFrame(() => {
					isInternalChange = false
				})
			})
		})
		// #endif


	};

	// 事件处理
	const handlePick = (e : UniPickerViewChangeEvent) => {
		// 如果是初始化阶段，不处理
		if (!isInitialized || isInternalChange) return;
		const indexes = [...e.detail.value];
		if (arrayEqual(indexes, curIndex.value)) return;
		// 处理索引越界问题
		indexes.forEach((v, i) => {
			if (i < props.columns.length) {
				const n = props.columns[i].length;

				if (v >= n) {
					indexes[i] = n - 1;
				}
			}
		});
		// 找出变化的列
		const changedColumn = findChangedColumnIndex(indexes, curIndex.value)
		// let changedColumn = -1;
		// for (let i = 0; i < indexes.length; i++) {

		// 	if (i < curIndex.value.length) {
		// 		if (indexes[i] != curIndex.value[i]) {
		// 			changedColumn = i;
		// 			break;
		// 		}
		// 	} else {
		// 		// 如果当前索引不存在，说明是新增的列
		// 		changedColumn = i;
		// 		break;
		// 	}
		// }
		setIndex(indexes);
		if (changedColumn != -1) {
			const column = props.columns[changedColumn];
			const index = indexes[changedColumn];
			const item = column[index];

			const obj : PickerPickEvent = {
				values: curValue.value,
				column: changedColumn,
				index
			};

			modelValue.value = [...curValue.value];
			instance?.$emit('pick', obj);
		}
	};

	const onCancel = (e : UniPointerEvent) => {
		updatePickerItems();
		instance?.$emit('cancel', e);
	};

	const onConfirm = () => {
		const values = [...curValue.value];
		const indexs = [...curIndex.value];
		const items = curItem.value.map((item) : PickerColumnItem => toRaw(item));

		if (!arrayEqual(modelValue.value, values)) {
			modelValue.value = values;
		}

		const obj : PickerConfirmEvent = {
			values,
			indexs,
			items
		};

		instance?.$emit('confirm', obj);
	};

	const getSelectedOptions = () : PickerConfirmEvent => {
		const values = [...curValue.value];
		const indexs = [...curIndex.value];
		const items = curItem.value.map((item) : PickerColumnItem => toRaw(item));

		if (!arrayEqual(modelValue.value, values)) {
			modelValue.value = values;
		}

		const obj : PickerConfirmEvent = {
			values,
			indexs,
			items
		};

		return obj;
	};

	// 生命周期管理
	const stopModelValue = watch(modelValue, () => {
		// 如果是初始化阶段，不处理
		if (!isInitialized) return;
		if (arrayEqual(modelValue.value, curValue.value)) return;
		curValue.value = modelValue.value.map((item : PickerValue) => item);
		updatePickerItems();
	});

	// const stopColumns = watch(() : PickerColumn[] => props.columns, () => {
	// 	updatePickerItems();
	// }, { deep: true });

	const stopColumns = watchEffect(() => {
		const currentColumns = props.columns;
		if (!isInitialized) return
		nextTick(() => {
			// 可能会跟change发生冲突
			updatePickerItems();
		})
	})

	onMounted(() => {
		if (
			!arrayEqual(modelValue.value, curValue.value) &&
			modelValue.value.length > 0) {
			isInternalChange = true; // 标记为内部变化
			curValue.value = [...modelValue.value];
		}
		updatePickerItems();
		// 延迟设置初始化完成标志
		nextTick(() => {
			setTimeout(() => {
				isInitialized = true;
				isInternalChange = false;
			}, 300)
		});
	});

	onBeforeUnmount(() => {
		stopModelValue();
		stopColumns();
	});

	// 返回所有需要在模板中使用的状态和方法
	return {
		// 状态
		defaultValue,
		curIndex,
		curValue,
		curItem,

		// 计算属性
		modelValue,
		isEmpty,
		innerIndex,

		// 方法
		getIndexByValue,
		setIndex,
		setValue,
		updatePickerItems,
		handlePick,
		onCancel,
		onConfirm,
		getSelectedOptions
	} as UsePickerViewReturn;
}