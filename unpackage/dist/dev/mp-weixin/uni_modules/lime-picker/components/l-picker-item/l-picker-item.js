"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeShared_clamp_index = require("../../../lime-shared/clamp/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-picker-item",
  props: {
    options: { default: [] },
    value: {},
    column: { default: -1 },
    name: {}
  },
  setup(__props, _a) {
    var __expose = _a.expose;
    const instance = common_vendor.getCurrentInstance();
    const props = __props;
    const picker = common_vendor.inject("limePicker", null);
    const pickerItemInstanceArray = common_vendor.inject("limePickerItems", null);
    const manageChildInList = common_vendor.inject("limePickerManageChildInList", null);
    manageChildInList === null || manageChildInList === void 0 ? null : manageChildInList(instance.proxy, true);
    const onPick = common_vendor.inject("limePickerOnPick", null);
    const updateItems = common_vendor.inject("limePickerUpdateItems", null);
    const curIndex = common_vendor.ref(0);
    const curValue = common_vendor.ref(props.value);
    const column = common_vendor.computed(() => {
      var _a2;
      return props.column != -1 ? props.column : (_a2 = pickerItemInstanceArray === null || pickerItemInstanceArray === void 0 ? null : pickerItemInstanceArray.indexOf(instance.proxy)) !== null && _a2 !== void 0 ? _a2 : props.column;
    });
    const elementPosition = common_vendor.computed(() => {
      var _a2;
      const totalElements = (_a2 = pickerItemInstanceArray === null || pickerItemInstanceArray === void 0 ? null : pickerItemInstanceArray.length) !== null && _a2 !== void 0 ? _a2 : 0;
      return [column.value == 0, column.value == totalElements - 1];
    });
    const innerIndex = common_vendor.computed(() => {
      return [curIndex.value];
    });
    const indicatorStyles = common_vendor.computed(() => {
      var _a2;
      const _b = common_vendor.__read(elementPosition.value, 2), isFirst = _b[0], isLast = _b[1];
      let style = ``;
      if (isFirst) {
        style += "border-top-left-radius:12rpx; border-bottom-left-radius:12rpx;";
      }
      if (isLast) {
        style += "border-top-right-radius:12rpx; border-bottom-right-radius:12rpx;";
      }
      return `
			${style}
			height: ${(_a2 = picker === null || picker === void 0 ? null : picker.itemHeight) !== null && _a2 !== void 0 ? _a2 : "50px"};
			background-color: rgba(0, 0, 0, 0.04); ${picker === null || picker === void 0 ? null : picker.indicatorStyle}`;
    });
    const itemStyles = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      if ((picker === null || picker === void 0 ? null : picker.itemColor) != null) {
        style.set("color", picker.itemColor);
      }
      if ((picker === null || picker === void 0 ? null : picker.itemFontSize) != null) {
        style.set("font-size", picker.itemFontSize);
      }
      if ((picker === null || picker === void 0 ? null : picker.itemHeight) != null) {
        style.set("line-height", picker.itemHeight);
        style.set("height", picker.itemHeight);
      }
      return style;
    });
    const itemActiveStyles = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      if ((picker === null || picker === void 0 ? null : picker.itemActiveColor) != null) {
        style.set("color", picker.itemActiveColor);
      }
      if ((picker === null || picker === void 0 ? null : picker.itemActiveFontWeight) != null) {
        style.set("font-weight", picker.itemActiveFontWeight);
      }
      return style;
    });
    const getIndexByValue = (val = null) => {
      let defaultIndex = 0;
      if (val != null) {
        defaultIndex = props.options.findIndex((item = null) => {
          return item.value == val;
        });
      }
      return defaultIndex < 0 ? 0 : defaultIndex;
    };
    const setIndex = (index) => {
      curIndex.value;
      let _index = uni_modules_limeShared_clamp_index.clamp(index, 0, props.options.length - 1);
      if (props.options.length > _index) {
        curIndex.value = _index;
        curValue.value = props.options[_index].value;
      }
    };
    const setValue = (value = null) => {
      if (value == curValue.value)
        return null;
      curValue.value = value;
      const index = getIndexByValue(value);
      setIndex(index);
    };
    const setUpdateItems = () => {
      const index = uni_modules_limeShared_clamp_index.clamp(curIndex.value, 0, props.options.length - 1);
      const curItem = props.options.length > index ? props.options[index] : null;
      if (curItem == null)
        return null;
      updateItems === null || updateItems === void 0 ? null : updateItems(curItem, index, column.value);
    };
    const handlePick = (e) => {
      if (props.options.length == 0)
        return null;
      const index = uni_modules_limeShared_clamp_index.clamp(e.detail.value[0], 0, props.options.length - 1);
      const curItem = props.options[index];
      if (index == curIndex.value)
        return null;
      setIndex(index);
      onPick === null || onPick === void 0 ? null : onPick(curItem, index, column.value);
    };
    common_vendor.watch(() => {
      return props.value;
    }, (v = null) => {
      setValue(v);
      setUpdateItems();
    }, { immediate: true });
    common_vendor.onBeforeUnmount(() => {
      manageChildInList === null || manageChildInList === void 0 ? null : manageChildInList(instance.proxy, false);
    });
    __expose(new UTSJSONObject({
      setIndex,
      setValue,
      // setOptions,
      // setUpdateItems,
      getIndexByValue
    }));
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.f(_ctx.options, (item = null, i = null, i0 = null) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.s(common_vendor.unref(curIndex) == i ? common_vendor.unref(itemActiveStyles) : {}),
            c: common_vendor.unref(curIndex) == i ? 1 : "",
            d: item.value
          };
        }),
        b: common_vendor.s(common_vendor.unref(itemStyles)),
        c: common_vendor.sei(common_vendor.gei(_ctx, ""), "picker-view"),
        d: _ctx.options.length > 0 ? 1 : 0,
        e: common_vendor.unref(indicatorStyles),
        f: common_vendor.unref(innerIndex),
        g: common_vendor.o(handlePick)
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-picker/components/l-picker-item/l-picker-item.js.map
