"use strict";
const common_vendor = require("../../../../common/vendor.js");
class IDatetimePickerEvent extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          value: { type: "Any", optional: false },
          date: { type: String, optional: false },
          time: { type: String, optional: false },
          timestamp: { type: Number, optional: false },
          mode: { type: String, optional: false }
        };
      },
      name: "IDatetimePickerEvent"
    };
  }
  constructor(options, metadata = IDatetimePickerEvent.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.value = this.__props__.value;
    this.date = this.__props__.date;
    this.time = this.__props__.time;
    this.timestamp = this.__props__.timestamp;
    this.mode = this.__props__.mode;
    delete this.__props__;
  }
}
class IWheelOption extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          value: { type: Number, optional: false },
          text: { type: String, optional: false }
        };
      },
      name: "IWheelOption"
    };
  }
  constructor(options, metadata = IWheelOption.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.value = this.__props__.value;
    this.text = this.__props__.text;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-datetime-picker" }, { __name: "i-datetime-picker", props: {
  modelValue: {
    type: [String, Number],
    default: ""
  },
  show: {
    type: Boolean,
    default: false
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: "请选择"
  },
  mode: {
    type: String,
    default: "datetime"
  },
  minDate: {
    type: Number,
    default: 0
  },
  maxDate: {
    type: Number,
    default: 0
  },
  minHour: {
    type: Number,
    default: 0
  },
  maxHour: {
    type: Number,
    default: 23
  },
  minMinute: {
    type: Number,
    default: 0
  },
  maxMinute: {
    type: Number,
    default: 59
  },
  loading: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: "取消"
  },
  confirmText: {
    type: String,
    default: "确认"
  },
  cancelColor: {
    type: String,
    default: "#909193"
  },
  confirmColor: {
    type: String,
    default: "#3c9cff"
  },
  closeOnMask: { type: Boolean, default: true },
  round: {
    type: [String, Number],
    default: 16
  },
  date: {
    type: String,
    default: "2026-05-22"
  },
  time: {
    type: String,
    default: "16:30"
  },
  dateLabel: {
    type: String,
    default: "日期"
  },
  timeLabel: {
    type: String,
    default: "时间"
  },
  disabled: {
    type: Boolean,
    default: false
  }
}, emits: [
  "open",
  "close",
  "cancel",
  "change",
  "confirm",
  "update:modelValue",
  "update:show",
  "update:date",
  "update:time"
], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function padNumber(value = null) {
    const numberValue = parseFloat(value.toString());
    return numberValue < 10 ? "0" + numberValue.toString() : numberValue.toString();
  }
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.getFullYear().toString() + "-" + padNumber(date.getMonth() + 1) + "-" + padNumber(date.getDate());
  }
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());
  }
  function validHour(value = null) {
    const numberValue = parseFloat(value.toString());
    if (numberValue < 0)
      return 0;
    if (numberValue > 23)
      return 23;
    return numberValue;
  }
  function validMinute(value = null) {
    const numberValue = parseFloat(value.toString());
    if (numberValue < 0)
      return 0;
    if (numberValue > 59)
      return 59;
    return numberValue;
  }
  function timeToMinutes(value) {
    return parseFloat(value.substring(0, 2).toString()) * 60 + parseFloat(value.substring(3, 5).toString());
  }
  function normalizeTime(value) {
    if (value.length >= 5)
      return value.substring(0, 5);
    return "00:00";
  }
  function dateTimeToTimestamp(dateText, timeText) {
    const year = parseFloat(dateText.substring(0, 4).toString());
    const month = parseFloat(dateText.substring(5, 7).toString()) - 1;
    const day = parseFloat(dateText.substring(8, 10).toString());
    const hour = parseFloat(timeText.substring(0, 2).toString());
    const minute = parseFloat(timeText.substring(3, 5).toString());
    return new Date(year, month, day, hour, minute, 0).getTime();
  }
  function minDateValue() {
    if (props.minDate > 0)
      return props.minDate;
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getFullYear() - 10, now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  }
  function maxDateValue() {
    if (props.maxDate > 0)
      return props.maxDate;
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getFullYear() + 10, now.getMonth(), now.getDate(), 23, 59, 59).getTime();
  }
  function formatSize(value = null) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  const opened = common_vendor.ref(props.show);
  const currentDate = common_vendor.ref(props.date);
  const currentTime = common_vendor.ref(props.time);
  const normalizedMode = common_vendor.computed(() => {
    if (props.mode == "date")
      return "date";
    if (props.mode == "time")
      return "time";
    if (props.mode == "year-month")
      return "year-month";
    return "datetime";
  });
  function datePart(value, index, fallback) {
    const parts = value.split(/[- :]/);
    if (parts.length <= index)
      return fallback;
    const parsed = parseFloat(parts[index]);
    return isNaN(parsed) ? fallback : parsed;
  }
  function optionRange(start, end, suffix, pad = false) {
    const result = [];
    for (let value = start; value <= end; value++) {
      const text = pad ? padNumber(value) : value.toString();
      result.push(new IWheelOption({ value, text: text + suffix }));
    }
    return result;
  }
  function dateFromParts(year, month, day, hour, minute) {
    return year.toString() + "-" + padNumber(month) + "-" + padNumber(day) + " " + padNumber(hour) + ":" + padNumber(minute);
  }
  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  function selectedYear() {
    return datePart(currentDate.value, 0, (/* @__PURE__ */ new Date()).getFullYear());
  }
  function selectedMonth() {
    return datePart(currentDate.value, 1, (/* @__PURE__ */ new Date()).getMonth() + 1);
  }
  function selectedDay() {
    return datePart(currentDate.value, 2, (/* @__PURE__ */ new Date()).getDate());
  }
  function selectedHour() {
    return datePart(currentTime.value, 0, 0);
  }
  function selectedMinute() {
    return datePart(currentTime.value, 1, 0);
  }
  function minDateParts() {
    return new Date(minDateValue());
  }
  function maxDateParts() {
    return new Date(maxDateValue());
  }
  const showYearColumn = common_vendor.computed(() => {
    return normalizedMode.value != "time";
  });
  const showMonthColumn = common_vendor.computed(() => {
    return normalizedMode.value != "time";
  });
  const showDayColumn = common_vendor.computed(() => {
    return normalizedMode.value == "datetime" || normalizedMode.value == "date";
  });
  const showHourColumn = common_vendor.computed(() => {
    return normalizedMode.value == "datetime" || normalizedMode.value == "time";
  });
  const showMinuteColumn = common_vendor.computed(() => {
    return normalizedMode.value == "datetime" || normalizedMode.value == "time";
  });
  const yearOptions = common_vendor.computed(() => {
    const minYear = minDateParts().getFullYear();
    const maxYear = maxDateParts().getFullYear();
    return optionRange(minYear, maxYear, "年");
  });
  const columnsStyle = common_vendor.computed(() => {
    return "width:100%;height:220px;";
  });
  const indicatorStyle = common_vendor.computed(() => {
    return "height:44px;background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;";
  });
  const itemStyle = common_vendor.computed(() => {
    return "height:44px;";
  });
  const monthOptions = common_vendor.computed(() => {
    let firstMonth = 1;
    let lastMonth = 12;
    const minDate = minDateParts();
    const maxDate = maxDateParts();
    if (selectedYear() == minDate.getFullYear())
      firstMonth = minDate.getMonth() + 1;
    if (selectedYear() == maxDate.getFullYear())
      lastMonth = maxDate.getMonth() + 1;
    return optionRange(firstMonth, lastMonth, "月");
  });
  const dayOptions = common_vendor.computed(() => {
    let firstDay = 1;
    let lastDay = daysInMonth(selectedYear(), selectedMonth());
    const minDate = minDateParts();
    const maxDate = maxDateParts();
    if (selectedYear() == minDate.getFullYear() && selectedMonth() == minDate.getMonth() + 1)
      firstDay = minDate.getDate();
    if (selectedYear() == maxDate.getFullYear() && selectedMonth() == maxDate.getMonth() + 1)
      lastDay = maxDate.getDate();
    if (firstDay > lastDay)
      firstDay = lastDay;
    return optionRange(firstDay, lastDay, "日");
  });
  function hourRange() {
    let firstHour = 0;
    let lastHour = 23;
    if (normalizedMode.value == "time") {
      firstHour = validHour(props.minHour);
      lastHour = validHour(props.maxHour);
    } else {
      const timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value);
      if (formatDate(timestampDate) == formatDate(minDateValue()))
        firstHour = new Date(minDateValue()).getHours();
      if (formatDate(timestampDate) == formatDate(maxDateValue()))
        lastHour = new Date(maxDateValue()).getHours();
    }
    return [firstHour, lastHour];
  }
  const hourOptions = common_vendor.computed(() => {
    const range = hourRange();
    return optionRange(range[0], range[1], "时", true);
  });
  function minuteRange() {
    let firstMinute = 0;
    let lastMinute = 59;
    const range = hourRange();
    const hour = selectedHour();
    if (normalizedMode.value == "time") {
      if (hour == range[0])
        firstMinute = validMinute(props.minMinute);
      if (hour == range[1])
        lastMinute = validMinute(props.maxMinute);
    } else {
      const timestampDate = dateTimeToTimestamp(currentDate.value, currentTime.value);
      if (formatDate(timestampDate) == formatDate(minDateValue()) && hour == new Date(minDateValue()).getHours()) {
        firstMinute = new Date(minDateValue()).getMinutes();
      }
      if (formatDate(timestampDate) == formatDate(maxDateValue()) && hour == new Date(maxDateValue()).getHours()) {
        lastMinute = new Date(maxDateValue()).getMinutes();
      }
    }
    return [firstMinute, lastMinute];
  }
  const minuteOptions = common_vendor.computed(() => {
    const range = minuteRange();
    return optionRange(range[0], range[1], "分", true);
  });
  const wheelIndexes = common_vendor.ref([]);
  function indexOfOption(options, value) {
    for (let index = 0; index < options.length; index++) {
      if (options[index].value == value)
        return index;
    }
    return 0;
  }
  function syncWheelIndexes() {
    const indexes = [];
    if (showYearColumn.value)
      indexes.push(indexOfOption(yearOptions.value, selectedYear()));
    if (showMonthColumn.value)
      indexes.push(indexOfOption(monthOptions.value, selectedMonth()));
    if (showDayColumn.value)
      indexes.push(indexOfOption(dayOptions.value, selectedDay()));
    if (showHourColumn.value)
      indexes.push(indexOfOption(hourOptions.value, selectedHour()));
    if (showMinuteColumn.value)
      indexes.push(indexOfOption(minuteOptions.value, selectedMinute()));
    wheelIndexes.value = indexes;
  }
  function selectedOptionValue(options, index, fallback) {
    if (options.length == 0)
      return fallback;
    let safeIndex = index;
    if (safeIndex < 0)
      safeIndex = 0;
    if (safeIndex >= options.length)
      safeIndex = options.length - 1;
    return options[safeIndex].value;
  }
  function wheelIndexAt(values, index) {
    if (values.length <= index || values[index] == null)
      return 0;
    const result = parseFloat(values[index].toString());
    if (isNaN(result) || result < 0)
      return 0;
    return Math.floor(result);
  }
  const displayValue = common_vendor.computed(() => {
    if (normalizedMode.value == "time")
      return currentTime.value;
    if (normalizedMode.value == "date")
      return currentDate.value;
    if (normalizedMode.value == "year-month")
      return currentDate.value.substring(0, 7);
    return currentDate.value + " " + currentTime.value;
  });
  const panelStyle = common_vendor.computed(() => {
    const radius = formatSize(props.round);
    return "border-radius:" + radius + " " + radius + " 0 0;";
  });
  function currentTimestamp() {
    return dateTimeToTimestamp(currentDate.value, currentTime.value);
  }
  function clampTime(value) {
    const text = normalizeTime(value);
    const current = timeToMinutes(text);
    const minValue = validHour(props.minHour) * 60 + validMinute(props.minMinute);
    const maxValue = validHour(props.maxHour) * 60 + validMinute(props.maxMinute);
    let nextValue = current;
    if (nextValue < minValue)
      nextValue = minValue;
    if (nextValue > maxValue)
      nextValue = maxValue;
    return padNumber(Math.floor(nextValue / 60)) + ":" + padNumber(nextValue % 60);
  }
  function outputValue() {
    if (normalizedMode.value == "time")
      return currentTime.value;
    return currentTimestamp();
  }
  function buildEvent() {
    return new IDatetimePickerEvent({
      value: outputValue(),
      date: currentDate.value,
      time: currentTime.value,
      timestamp: currentTimestamp(),
      mode: normalizedMode.value
    });
  }
  function emitValue() {
    const event = buildEvent();
    emit("update:modelValue", event.value);
    emit("update:date", currentDate.value);
    emit("update:time", currentTime.value);
  }
  function applyValue(value = null) {
    if (normalizedMode.value == "time") {
      currentTime.value = normalizeTime(value.toString());
      return null;
    }
    if (typeof value == "number") {
      if (value > 0) {
        currentDate.value = formatDate(value);
        currentTime.value = formatTime(value);
      }
      return null;
    }
    const text = value.toString();
    if (/^\d+$/.test(text)) {
      const timestamp = parseFloat(text);
      if (!isNaN(timestamp) && timestamp > 0) {
        currentDate.value = formatDate(timestamp);
        currentTime.value = formatTime(timestamp);
        return null;
      }
    }
    if (text.length >= 10)
      currentDate.value = text.substring(0, 10);
    if (text.length >= 16)
      currentTime.value = text.substring(11, 16);
  }
  function clampCurrent() {
    if (normalizedMode.value == "time") {
      currentTime.value = clampTime(currentTime.value);
      return null;
    }
    let timestamp = currentTimestamp();
    const minValue = minDateValue();
    const maxValue = maxDateValue();
    if (timestamp < minValue)
      timestamp = minValue;
    if (timestamp > maxValue)
      timestamp = maxValue;
    currentDate.value = formatDate(timestamp);
    currentTime.value = formatTime(timestamp);
  }
  function syncFromProps() {
    const modelText = props.modelValue.toString();
    if (modelText.length > 0) {
      applyValue(props.modelValue);
    } else {
      currentDate.value = props.date;
      currentTime.value = props.time;
    }
    clampCurrent();
    syncWheelIndexes();
  }
  function open() {
    if (opened.value)
      return null;
    syncFromProps();
    opened.value = true;
    emit("open");
    emit("update:show", true);
  }
  function openByTrigger() {
    if (props.disabled)
      return null;
    open();
  }
  function close() {
    if (!opened.value)
      return null;
    opened.value = false;
    emit("close");
    emit("update:show", false);
  }
  function cancel() {
    emit("cancel", buildEvent());
    close();
  }
  function confirm() {
    const event = buildEvent();
    emit("confirm", event);
    emitValue();
    close();
  }
  function handleOverlayClick() {
    if (!props.closeOnMask)
      return null;
    close();
  }
  function handleWheelChange(event = null) {
    if (props.disabled || props.loading || event == null || typeof event != "object")
      return null;
    const detail = event["detail"];
    if (detail == null || typeof detail != "object")
      return null;
    const rawValues = detail["value"];
    if (rawValues == null || !Array.isArray(rawValues))
      return null;
    const values = rawValues;
    const previousYearOptions = yearOptions.value;
    const previousMonthOptions = monthOptions.value;
    const previousDayOptions = dayOptions.value;
    const previousHourOptions = hourOptions.value;
    const previousMinuteOptions = minuteOptions.value;
    let valueIndex = 0;
    let year = selectedYear();
    let month = selectedMonth();
    let day = selectedDay();
    let hour = selectedHour();
    let minute = selectedMinute();
    if (showYearColumn.value) {
      year = selectedOptionValue(previousYearOptions, wheelIndexAt(values, valueIndex), year);
      valueIndex++;
    }
    if (showMonthColumn.value) {
      month = selectedOptionValue(previousMonthOptions, wheelIndexAt(values, valueIndex), month);
      valueIndex++;
    }
    if (showDayColumn.value) {
      day = selectedOptionValue(previousDayOptions, wheelIndexAt(values, valueIndex), day);
      valueIndex++;
    }
    if (showHourColumn.value) {
      hour = selectedOptionValue(previousHourOptions, wheelIndexAt(values, valueIndex), hour);
      valueIndex++;
    }
    if (showMinuteColumn.value) {
      minute = selectedOptionValue(previousMinuteOptions, wheelIndexAt(values, valueIndex), minute);
      valueIndex++;
    }
    const minDate = minDateParts();
    const maxDate = maxDateParts();
    const minMonth = year == minDate.getFullYear() ? minDate.getMonth() + 1 : 1;
    const maxMonth = year == maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12;
    if (month < minMonth)
      month = minMonth;
    if (month > maxMonth)
      month = maxMonth;
    const maxDay = daysInMonth(year, month);
    if (day < 1)
      day = 1;
    if (day > maxDay)
      day = maxDay;
    currentDate.value = dateFromParts(year, month, day, hour, minute).split(" ")[0];
    currentTime.value = padNumber(hour) + ":" + padNumber(minute);
    clampCurrent();
    syncWheelIndexes();
    emit("change", buildEvent());
    if (!props.showToolbar)
      emitValue();
  }
  common_vendor.watch(() => {
    return props.show;
  }, (nextValue) => {
    if (opened.value == nextValue)
      return null;
    opened.value = nextValue;
    if (nextValue) {
      syncFromProps();
      emit("open");
    } else {
      emit("close");
    }
  });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    syncFromProps();
  });
  common_vendor.watch(() => {
    return props.date;
  }, () => {
    syncFromProps();
  });
  common_vendor.watch(() => {
    return props.time;
  }, () => {
    syncFromProps();
  });
  common_vendor.watch(() => {
    return props.minDate;
  }, () => {
    clampCurrent();
  });
  common_vendor.watch(() => {
    return props.maxDate;
  }, () => {
    clampCurrent();
  });
  syncFromProps();
  __expose({
    open,
    close,
    setFormatter() {
    }
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.t(displayValue.value),
      b: common_vendor.o(openByTrigger, "2c"),
      c: opened.value
    }, opened.value ? common_vendor.e({
      d: __props.showToolbar
    }, __props.showToolbar ? {
      e: common_vendor.t(__props.cancelText),
      f: common_vendor.s("color:" + __props.cancelColor + ";"),
      g: common_vendor.o(cancel, "2f"),
      h: common_vendor.t(__props.title),
      i: common_vendor.t(__props.confirmText),
      j: common_vendor.s("color:" + __props.confirmColor + ";"),
      k: common_vendor.o(confirm, "a7")
    } : {}, {
      l: __props.loading
    }, __props.loading ? {} : {}, {
      m: showYearColumn.value
    }, showYearColumn.value ? {
      n: common_vendor.f(yearOptions.value, (item, k0, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: item.value
        };
      }),
      o: common_vendor.s(itemStyle.value)
    } : {}, {
      p: showMonthColumn.value
    }, showMonthColumn.value ? {
      q: common_vendor.f(monthOptions.value, (item, k0, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: item.value
        };
      }),
      r: common_vendor.s(itemStyle.value)
    } : {}, {
      s: showDayColumn.value
    }, showDayColumn.value ? {
      t: common_vendor.f(dayOptions.value, (item, k0, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: item.value
        };
      }),
      v: common_vendor.s(itemStyle.value)
    } : {}, {
      w: showHourColumn.value
    }, showHourColumn.value ? {
      x: common_vendor.f(hourOptions.value, (item, k0, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: item.value
        };
      }),
      y: common_vendor.s(itemStyle.value)
    } : {}, {
      z: showMinuteColumn.value
    }, showMinuteColumn.value ? {
      A: common_vendor.f(minuteOptions.value, (item, k0, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: item.value
        };
      }),
      B: common_vendor.s(itemStyle.value)
    } : {}, {
      C: common_vendor.s(columnsStyle.value),
      D: wheelIndexes.value,
      E: indicatorStyle.value,
      F: common_vendor.o(handleWheelChange, "ac"),
      G: common_vendor.s(panelStyle.value),
      H: common_vendor.o(() => {
      }, "d5"),
      I: common_vendor.o(handleOverlayClick, "d3")
    }) : {}, {
      J: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      K: `${_ctx.u_s_b_h}px`,
      L: `${_ctx.u_s_a_i_b}px`,
      M: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-datetime-picker/i-datetime-picker.js.map
