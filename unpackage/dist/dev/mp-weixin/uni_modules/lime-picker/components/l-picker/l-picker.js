"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limePicker_components_lPicker_utils = require("./utils.js");
if (!Array) {
  const _easycom_l_picker_item_1 = common_vendor.resolveComponent("l-picker-item");
  const _easycom_l_loading_1 = common_vendor.resolveComponent("l-loading");
  (_easycom_l_picker_item_1 + _easycom_l_loading_1)();
}
const _easycom_l_picker_item = () => "../l-picker-item/l-picker-item.js";
const _easycom_l_loading = () => "../../../lime-loading/components/l-loading/l-loading.js";
if (!Math) {
  (_easycom_l_picker_item + _easycom_l_loading)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-picker",
  props: {
    cancelBtn: {},
    cancelStyle: {},
    confirmBtn: {},
    confirmStyle: {},
    title: {},
    titleStyle: {},
    keys: {},
    columns: { default: [] },
    modelValue: {},
    defaultValue: {},
    value: {},
    loading: { type: Boolean, default: false },
    loadingColor: {},
    loadingMaskColor: {},
    loadingSize: { default: "64rpx" },
    itemHeight: {},
    itemColor: {},
    itemFontSize: {},
    itemActiveColor: {},
    itemActiveFontWeight: {},
    indicatorStyle: {},
    bgColor: {},
    groupHeight: {},
    radius: {},
    resetIndex: { type: Boolean, default: false }
  },
  emits: ["change", "cancel", "pick", "confirm", "update:modelValue", "update:value"],
  setup(__props, _a) {
    var _b, _c, _d;
    var __emit = _a.emit;
    const emit = __emit;
    const props = __props;
    const pickerItemInstanceArray = common_vendor.reactive([]);
    const ohosShow = common_vendor.ref(0);
    const modelValue = common_vendor.ref((_d = (_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.modelValue) !== null && _c !== void 0 ? _c : props.defaultValue) !== null && _d !== void 0 ? _d : []);
    const pickerValue = common_vendor.computed({
      set(value) {
        if (value.join("") == modelValue.value.join(""))
          return null;
        modelValue.value = value;
        emit("update:modelValue", value);
        emit("change", value);
      },
      get() {
        var _a2, _b2;
        return (_b2 = (_a2 = props.value) !== null && _a2 !== void 0 ? _a2 : props.modelValue) !== null && _b2 !== void 0 ? _b2 : modelValue.value;
      }
    });
    const isEmpty = common_vendor.computed(() => {
      return props.columns.length == 0 && pickerItemInstanceArray.every((child = null) => {
        return child.options.length == 0;
      });
    });
    const styles = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      if (props.bgColor != null) {
        style.set("background", props.bgColor);
      }
      if (props.radius != null) {
        style.set("border-top-left-radius", props.radius);
        style.set("border-top-right-radius", props.radius);
      }
      return style;
    });
    const curIndexArray = common_vendor.ref([]);
    const curValueArray = common_vendor.ref([...pickerValue.value]);
    const curItemArray = [];
    const realColumns = common_vendor.computed(() => {
      const pickerColumns = pickerItemInstanceArray.map((child = null) => {
        return child.options;
      });
      if (pickerColumns.length > 0) {
        return pickerColumns;
      }
      return props.columns;
    });
    const manageChildInList = (child = null, shouldAdd) => {
      const index = pickerItemInstanceArray.indexOf(child);
      if (shouldAdd) {
        if (index != -1)
          return null;
        pickerItemInstanceArray.push(child);
      } else {
        if (index == -1)
          return null;
        pickerItemInstanceArray.splice(index, 1);
      }
    };
    const updateItems = (item, index, column) => {
      uni_modules_limePicker_components_lPicker_utils.pushAt(curIndexArray.value, column, index);
      uni_modules_limePicker_components_lPicker_utils.pushAt(curValueArray.value, column, item.value);
      uni_modules_limePicker_components_lPicker_utils.pushAt(curItemArray, column, item);
    };
    const updatePickerItems = () => {
      const _indexs = [];
      const _values = [];
      pickerItemInstanceArray.forEach((child = null, column) => {
        if (child.options.length == 0)
          return null;
        const value = curValueArray.value.length > column ? curValueArray.value[column] : null;
        const index = value == null ? 0 : child._.exposed.getIndexByValue(value);
        child._.exposed.setIndex(index);
        const item = child.options[index];
        _indexs.push(index);
        _values.push(item.value);
        uni_modules_limePicker_components_lPicker_utils.pushAt(curItemArray, column, item);
      });
      if (curIndexArray.value.join("") == _indexs.join(""))
        return null;
      curIndexArray.value = _indexs;
      curValueArray.value = _values;
      pickerValue.value = [...curValueArray.value];
    };
    const onPick = (item, index, column) => {
      if (curIndexArray.value[column] == index)
        return null;
      uni_modules_limePicker_components_lPicker_utils.pushAt(curIndexArray.value, column, index);
      uni_modules_limePicker_components_lPicker_utils.pushAt(curValueArray.value, column, item.value);
      uni_modules_limePicker_components_lPicker_utils.pushAt(curItemArray, column, item);
      const obj = {
        values: curValueArray.value,
        column,
        index
      };
      pickerValue.value = [...curValueArray.value];
      emit("pick", obj);
    };
    const onCancel = (e) => {
      updatePickerItems();
      emit("cancel", e);
    };
    const onConfirm = (e) => {
      const values = [...curValueArray.value];
      const indexs = [...curIndexArray.value];
      const items = curItemArray.map((item) => {
        return common_vendor.toRaw(item);
      });
      if (pickerValue.value.join("") != values.join("")) {
        pickerValue.value = values;
      }
      const obj = {
        values,
        indexs,
        items
      };
      emit("confirm", obj);
    };
    const stopPickerValue = common_vendor.watch(pickerValue, () => {
      if (pickerValue.value.join("") == curValueArray.value.join(""))
        return null;
      curValueArray.value = pickerValue.value.map((item = null) => {
        return item;
      });
      updatePickerItems();
    });
    const stopColumns = common_vendor.watch(realColumns, () => {
      updatePickerItems();
    });
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        if (pickerValue.value.join("") != curValueArray.value.join("") && pickerValue.value.length > 0) {
          curValueArray.value = [...pickerValue.value];
          updatePickerItems();
        }
      });
    });
    common_vendor.onBeforeUnmount(() => {
      stopPickerValue();
      stopColumns();
    });
    common_vendor.provide("limePicker", props);
    common_vendor.provide("limePickerOnPick", onPick);
    common_vendor.provide("limePickerUpdateItems", updateItems);
    common_vendor.provide("limePickerItems", pickerItemInstanceArray);
    common_vendor.provide("limePickerManageChildInList", manageChildInList);
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: _ctx.cancelBtn != null || _ctx.title != null || _ctx.confirmBtn != null
      }, _ctx.cancelBtn != null || _ctx.title != null || _ctx.confirmBtn != null ? common_vendor.e({
        b: _ctx.cancelBtn != null
      }, _ctx.cancelBtn != null ? {
        c: common_vendor.t(_ctx.cancelBtn),
        d: common_vendor.unref(ohosShow),
        e: common_vendor.s(_ctx.cancelStyle ?? ""),
        f: common_vendor.o(onCancel)
      } : {}, {
        g: common_vendor.t(_ctx.title),
        h: common_vendor.unref(ohosShow),
        i: common_vendor.s(_ctx.titleStyle ?? ""),
        j: _ctx.confirmBtn != null
      }, _ctx.confirmBtn != null ? {
        k: common_vendor.t(_ctx.confirmBtn),
        l: common_vendor.unref(ohosShow),
        m: common_vendor.s(_ctx.confirmStyle ?? ""),
        n: common_vendor.o(onConfirm)
      } : {}, {
        o: common_vendor.unref(ohosShow)
      }) : {}, {
        p: common_vendor.f(props.columns, (options, i, i0) => {
          return {
            a: i,
            b: "070619bb-0-" + i0,
            c: common_vendor.p({
              options,
              column: i,
              value: common_vendor.unref(pickerValue).length > i ? common_vendor.unref(pickerValue)[i] : null
            })
          };
        }),
        q: common_vendor.unref(isEmpty)
      }, common_vendor.unref(isEmpty) ? {} : {}, {
        r: common_vendor.s(_ctx.groupHeight != null ? {
          height: _ctx.groupHeight
        } : {}),
        s: _ctx.loading
      }, _ctx.loading ? {
        t: common_vendor.p({
          size: _ctx.loadingSize,
          color: _ctx.loadingColor
        }),
        v: common_vendor.sei("r0-070619bb", "view", "loadingRef"),
        w: common_vendor.s(_ctx.loadingMaskColor != null ? {
          background: _ctx.loadingMaskColor
        } : {})
      } : {}, {
        x: common_vendor.sei(common_vendor.gei(_ctx, "", "r1-070619bb"), "view", "pickerRef"),
        y: common_vendor.s(common_vendor.unref(styles))
      });
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
