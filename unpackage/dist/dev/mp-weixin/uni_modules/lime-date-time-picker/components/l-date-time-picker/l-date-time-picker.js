"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeDateTimePicker_components_lDateTimePicker_utils = require("./utils.js");
const uni_modules_limeDateTimePicker_components_lDateTimePicker_constant = require("./constant.js");
const uni_modules_limeDayuts_common_index = require("../../../lime-dayuts/common/index.js");
require("../../../lime-dayuts/common/use.js");
require("../../../lime-dayuts/utssdk/interface.js");
const uni_modules_limeShared_clamp_index = require("../../../lime-shared/clamp/index.js");
if (!Array) {
  const _easycom_l_picker_1 = common_vendor.resolveComponent("l-picker");
  _easycom_l_picker_1();
}
const _easycom_l_picker = () => "../../../lime-picker/components/l-picker/l-picker.js";
if (!Math) {
  _easycom_l_picker();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-date-time-picker",
  props: {
    cancelBtn: {},
    cancelStyle: {},
    confirmBtn: {},
    confirmStyle: {},
    customLocale: {},
    end: {},
    start: {},
    steps: {},
    title: {},
    titleStyle: {},
    value: {},
    defaultValue: {},
    modelValue: {},
    format: { default: uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.DEFAULT_FORMAT },
    mode: { default: 1 | 2 | 4 },
    customFilter: {},
    renderLabel: {},
    showUnit: { type: Boolean, default: true },
    itemHeight: {},
    itemColor: {},
    itemFontSize: {},
    itemActiveColor: {},
    indicatorStyle: {},
    bgColor: {},
    groupHeight: {},
    radius: {},
    resetIndex: { type: Boolean, default: false },
    minHour: { default: 0 },
    maxHour: { default: 23 },
    minMinute: { default: 0 },
    maxMinute: { default: 59 }
  },
  emits: ["change", "cancel", "confirm", "pick", "update:modelValue", "update:value"],
  setup(__props, _a) {
    var _b, _c, _d;
    var __emit = _a.emit;
    const emit = __emit;
    const props = __props;
    let defaultValue = (_d = (_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.defaultValue) !== null && _c !== void 0 ? _c : props.defaultValue) !== null && _d !== void 0 ? _d : Date.now();
    const innerValue = common_vendor.computed({
      set(value = null) {
        if (defaultValue == value)
          return null;
        defaultValue = value;
        emit("change", value);
        emit("update:modelValue", value);
        emit("update:value", value);
      },
      get() {
        var _a2, _b2;
        const value = (_b2 = (_a2 = props.value) !== null && _a2 !== void 0 ? _a2 : props.modelValue) !== null && _b2 !== void 0 ? _b2 : defaultValue;
        return typeof value == "string" && value.length == 0 ? Date.now() : value;
      }
    });
    const meaningColumn = uni_modules_limeDateTimePicker_components_lDateTimePicker_utils.getMeaningColumn(props.mode);
    const isTimeMode = ["hour", "minute", "second"].includes(meaningColumn[0]);
    const normalize = (val = null, defaultDay) => {
      return val != null && uni_modules_limeDayuts_common_index.dayuts(val).isValid() ? uni_modules_limeDayuts_common_index.dayuts(val) : defaultDay;
    };
    const start = common_vendor.computed(() => {
      return normalize(props.start, uni_modules_limeDayuts_common_index.dayuts().subtract(10, "year"));
    });
    const end = common_vendor.computed(() => {
      return normalize(props.end, uni_modules_limeDayuts_common_index.dayuts().add(10, "year"));
    });
    const rationalize = (val) => {
      if (isTimeMode)
        return val;
      if (val.isBefore(start.value))
        return start.value;
      if (val.isAfter(end.value))
        return end.value;
      return val;
    };
    const calcDate = (currentValue = null) => {
      if (isTimeMode) {
        const dateStr = uni_modules_limeDayuts_common_index.dayuts(start.value).format("YYYY-MM-DD");
        currentValue = `${dateStr} ${currentValue}`;
      }
      return currentValue != null && uni_modules_limeDayuts_common_index.dayuts(currentValue).isValid() ? rationalize(uni_modules_limeDayuts_common_index.dayuts(currentValue)) : start.value;
    };
    const curDate = common_vendor.ref(calcDate(innerValue.value));
    const valueOfPicker = common_vendor.computed(() => {
      return meaningColumn.map((item) => {
        return curDate.value.get(item).toString();
      });
    });
    const columnCache = /* @__PURE__ */ new Map();
    const columns = common_vendor.computed(() => {
      const ret = [];
      const getDate = (date) => {
        return [
          date.year(),
          date.month() + 1,
          date.date(),
          date.hour(),
          date.minute(),
          date.second()
        ];
      };
      const _a2 = common_vendor.__read(getDate(curDate.value), 5), curYear = _a2[0], curMonth = _a2[1], curDay = _a2[2], curHour = _a2[3], curMinute = _a2[4];
      const _b2 = common_vendor.__read(getDate(start.value), 6), minYear = _b2[0], minMonth = _b2[1], minDay = _b2[2], minHour = _b2[3], minMinute = _b2[4], minSecond = _b2[5];
      const _c2 = common_vendor.__read(getDate(end.value), 6), maxYear = _c2[0], maxMonth = _c2[1], maxDay = _c2[2], maxHour = _c2[3], maxMinute = _c2[4], maxSecond = _c2[5];
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
      const generateColumn = (type, lowerBound, upperBound) => {
        const cacheKey = `${type}-${lowerBound}-${upperBound}`;
        if (columnCache.has(cacheKey)) {
          ret.push(UTS.mapGet(columnCache, cacheKey));
          return null;
        }
        const arr = [];
        for (let i = lowerBound; i <= upperBound; i++) {
          const value = i;
          arr.push({
            label: props.renderLabel != null ? props.renderLabel(type, i.toString()) : `${value}${props.showUnit ? UTS.mapGet(uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.UNIT_MAP, type) : ""}`,
            value: type == "month" ? `${value - 1}` : value.toString()
          });
        }
        if (props.customFilter != null) {
          const _arr = props.customFilter(type, arr);
          ret.push(_arr);
          columnCache.set(cacheKey, _arr);
        } else {
          ret.push(arr);
          columnCache.set(cacheKey, arr);
        }
      };
      if (meaningColumn.includes("year")) {
        generateColumn("year", minYear, maxYear);
      }
      if (meaningColumn.includes("month")) {
        const lower = isInMinYear ? minMonth : 1;
        const upper = isInMaxYear ? maxMonth : 12;
        generateColumn("month", lower, upper);
      }
      if (meaningColumn.includes("date")) {
        const lower = isInMinMonth ? minDay : 1;
        const upper = isInMaxMonth ? maxDay : uni_modules_limeDayuts_common_index.dayuts(`${curYear}-${curMonth}`).daysInMonth();
        generateColumn("date", lower, upper);
      }
      if (meaningColumn.includes("hour")) {
        const lower = isInMinDay && !isTimeMode ? minHour : uni_modules_limeShared_clamp_index.clamp(props.minHour, 0, 23);
        const upper = isInMaxDay && !isTimeMode ? maxHour : uni_modules_limeShared_clamp_index.clamp(props.maxHour, lower, 23);
        generateColumn("hour", lower, upper);
      }
      if (meaningColumn.includes("minute")) {
        const lower = isInMinHour && !isTimeMode ? minMinute : uni_modules_limeShared_clamp_index.clamp(props.minMinute, 0, 59);
        const upper = isInMaxHour && !isTimeMode ? maxMinute : uni_modules_limeShared_clamp_index.clamp(props.maxMinute, lower, 59);
        generateColumn("minute", lower, upper);
      }
      if (meaningColumn.includes("second")) {
        const lower = isInMinMinute && !isTimeMode ? minSecond : 0;
        const upper = isInMaxMinute && !isTimeMode ? maxSecond : 59;
        generateColumn("second", lower, upper);
      }
      return ret;
    });
    const innterFormat = common_vendor.computed(() => {
      const first = meaningColumn.length > 0 ? meaningColumn[0] : "year";
      const last = meaningColumn.length > 0 ? meaningColumn[meaningColumn.length - 1] : "date";
      const format = uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.DEFAULT_FORMAT.substring(uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.DEFAULT_FORMAT.indexOf(UTS.mapGet(uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.FORMAT_MAP, first)), uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.DEFAULT_FORMAT.lastIndexOf(UTS.mapGet(uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.FORMAT_MAP, last)) + UTS.mapGet(uni_modules_limeDateTimePicker_components_lDateTimePicker_constant.FORMAT_MAP, last).length);
      return format;
    });
    const onConfirm = (_a2) => {
      var values = _a2.values;
      let cur = curDate.value;
      values.forEach((item = null, index) => {
        const type = meaningColumn[index];
        cur = cur.set(type, parseInt(`${item}`, 10));
      });
      const curValue = cur.format(props.format);
      innerValue.value = cur.format(innterFormat.value);
      emit("confirm", curValue);
    };
    const onCancel = () => {
      emit("cancel");
    };
    const onPick = (_a2) => {
      _a2.values;
      var column = _a2.column, index = _a2.index;
      const type = meaningColumn[column];
      const val = curDate.value.set(type, parseInt(columns.value[column][index].value, 10));
      curDate.value = rationalize(val);
      emit("pick", rationalize(val).format(props.format));
    };
    const onChange = (values) => {
      let cur = curDate.value;
      values.forEach((item = null, index) => {
        const type = meaningColumn[index];
        cur = cur.set(type, parseInt(`${item}`, 10));
      });
      curDate.value = rationalize(cur);
      const curValue = curDate.value.format(innterFormat.value);
      innerValue.value = curValue;
    };
    const stop = common_vendor.watch(innerValue, (val = null) => {
      curDate.value = calcDate(val);
    });
    common_vendor.onBeforeUnmount(() => {
      stop();
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.gei(_ctx, ""),
        b: common_vendor.o(onConfirm),
        c: common_vendor.o(onCancel),
        d: common_vendor.o(onChange),
        e: common_vendor.o(onPick),
        f: common_vendor.p({
          title: _ctx.title,
          titleStyle: _ctx.titleStyle,
          ["confirm-btn"]: _ctx.confirmBtn,
          ["confirm-style"]: _ctx.confirmStyle,
          ["cancel-btn"]: _ctx.cancelBtn,
          ["cancel-style"]: _ctx.cancelStyle,
          itemHeight: _ctx.itemHeight,
          itemColor: _ctx.itemColor,
          itemFontSize: _ctx.itemFontSize,
          itemActiveColor: _ctx.itemActiveColor,
          indicatorStyle: _ctx.indicatorStyle,
          bgColor: _ctx.bgColor,
          groupHeight: _ctx.groupHeight,
          radius: _ctx.radius,
          value: common_vendor.unref(valueOfPicker),
          columns: common_vendor.unref(columns),
          id: common_vendor.gei(_ctx, "")
        })
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js.map
