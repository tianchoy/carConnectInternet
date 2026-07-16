// @ts-nocheck
import type { TimeModeValues } from './type';
import { MODE_NAMES, MODE_MAP, MODE_YEAR, MODE_MONTH, MODE_DATE, MODE_HOUR, MODE_MINUTE, MODE_SECOND } from './constant'

export function coalesce<T>(...values:(T|null)[]) : T | null {
	for (let value of values) {
		if(value == null) continue;
		if(typeof value == 'string' && value == '') continue;
		return value
	}
	return null
}
/**
 * 根据给定的模式返回具有意义的时间列数组。
 * @param {number} mode - 表示时间模式的位掩码。
 * @returns {TimeModeValues[]} - 返回具有意义的时间列名称数组。
 */
export function getMeaningColumn(mode : any) : TimeModeValues[] {
	// 初始化结果数组
	const res : TimeModeValues[] = [];

	let _mode : number = 0;
	if (typeof mode == 'string') {
		// 处理字符串形式的位掩码
		if (mode.includes('|') && /\d/.test(mode)) {
			// 如果是 "1|2|3" 这种格式，按位或运算
			const bits = mode.split('|').map((bit):number => parseInt(bit.trim()));
			_mode = bits.reduce((result, bit) => result | bit, 0);
		} else {
			// 如果是模式名称字符串，如 "year-month-date"
			MODE_MAP.forEach((value, key) => {
				if ((mode as string).includes(key)) {
					_mode = _mode | value;
				}
			});
		}
		// MODE_MAP.forEach((value, key) => {
		// 	__f__('log','at uni_modules/lime-date-time-picker/components/l-date-time-picker/utils.ts:38','key', key)
		// 	if ((mode as string).includes(key)) {
		// 		_mode = _mode | value;
		// 	}
		// })
	} else if (typeof mode == 'number') {
		_mode = mode as number
	}

	if (_mode <= 0) {
		return res
	}


	// 定义对应的位掩码数组
	const modeBitmasks = [MODE_YEAR, MODE_MONTH, MODE_DATE, MODE_HOUR, MODE_MINUTE, MODE_SECOND];

	// 查找被设置的位掩码
	const activeBitmasks = modeBitmasks.filter(bitmask => (_mode & bitmask) != 0);

	// 如果没有位掩码被设置，返回空数组
	if (activeBitmasks.length == 0) {
		return [];
	}

	// 初始化最长连续子序列和当前连续子序列
	let longestSequence : number[] = [];
	let currentSequence : number[] = [];

	// 遍历所有被设置的位掩码
	activeBitmasks.forEach(bitmask => {
		// 如果当前序列为空或当前位掩码是前一个位掩码的两倍，则将其加入当前序列
		if (currentSequence.length == 0 || bitmask == currentSequence[currentSequence.length - 1] * 2) {
			currentSequence.push(bitmask);
		} else {
			// 如果当前序列长度大于最长序列长度，则更新最长序列
			if (currentSequence.length > longestSequence.length) {
				longestSequence = currentSequence;
			}
			// 开始新的序列
			currentSequence = [bitmask];
		}
	});

	// 检查最后一个序列是否是最长的
	if (currentSequence.length > longestSequence.length) {
		longestSequence = currentSequence;
	}

	// 将最长连续子序列的位掩码转换为对应的模式名并返回
	return longestSequence.map(bitmask => MODE_NAMES[modeBitmasks.indexOf(bitmask)]);
}