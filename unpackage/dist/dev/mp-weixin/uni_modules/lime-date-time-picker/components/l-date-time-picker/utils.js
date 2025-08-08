"use strict";
const uni_modules_limeDateTimePicker_components_lDateTimePicker_constant = require("./constant.js");
function getMeaningColumn(mode) {
  const res = [];
  let _mode = 0;
  if (typeof mode == "string") {
    uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_MAP.forEach((value, key) => {
      if (mode.includes(key)) {
        _mode = _mode | value;
      }
    });
  } else if (typeof mode == "number") {
    _mode = mode;
  }
  if (_mode <= 0) {
    return res;
  }
  const modeBitmasks = [uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_YEAR, uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_MONTH, uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_DATE, uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_HOUR, uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_MINUTE, uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_SECOND];
  const activeBitmasks = modeBitmasks.filter((bitmask) => {
    return (_mode & bitmask) != 0;
  });
  if (activeBitmasks.length == 0) {
    return [];
  }
  let longestSequence = [];
  let currentSequence = [];
  activeBitmasks.forEach((bitmask) => {
    if (currentSequence.length == 0 || bitmask == currentSequence[currentSequence.length - 1] * 2) {
      currentSequence.push(bitmask);
    } else {
      if (currentSequence.length > longestSequence.length) {
        longestSequence = currentSequence;
      }
      currentSequence = [bitmask];
    }
  });
  if (currentSequence.length > longestSequence.length) {
    longestSequence = currentSequence;
  }
  return longestSequence.map((bitmask) => {
    return uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.MODE_NAMES[modeBitmasks.indexOf(bitmask)];
  });
}
exports.getMeaningColumn = getMeaningColumn;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-date-time-picker/components/l-date-time-picker/utils.js.map
