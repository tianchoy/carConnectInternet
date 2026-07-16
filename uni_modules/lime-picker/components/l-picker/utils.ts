// @ts-nocheck
/**
 * 在数组的指定位置插入或更新值。
 * 如果指定的索引小于数组的长度，则更新该位置的值。
 * 如果指定的索引大于或等于数组的长度，则将值添加到数组的末尾。
 *
 * @param {number[]} arr - 要操作的数字数组。
 * @param {number} index - 要插入或更新值的索引位置。
 * @param {number} value - 要插入或更新的值。
 */
export function pushAt<T>(arr : T[], index : number, value : T) {
	// #ifdef APP-ANDROID
	if (index < arr.length) {
		arr[index] = value;
	} else {
		arr.push(value);
	}
	// #endif
	// #ifndef APP-ANDROID
	arr[index] = value;
	// #endif
};


/**
 * 精确比较两个数组是否相等（浅比较）
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 是否相等
 */
export function arraysEqual<T>(arr1 : T[], arr2 : T[]) : boolean {
	return (
		arr1.length == arr2.length &&
		arr1.every((val, i):boolean => val == arr2[i])
	)
}