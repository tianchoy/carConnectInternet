"use strict";
const common_vendor = require("../../../../common/vendor.js");
class PickerItem extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          text: { type: String, optional: false },
          value: { type: "Any", optional: false },
          disabled: { type: Boolean, optional: false }
        };
      },
      name: "PickerItem"
    };
  }
  constructor(options, metadata = PickerItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.text = this.__props__.text;
    this.value = this.__props__.value;
    this.disabled = this.__props__.disabled;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-picker" }, { __name: "i-picker", props: {
  modelValue: {
    type: [String, Number, Array],
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
    default: ""
  },
  columns: {
    type: Array,
    default: () => {
      return [];
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  itemHeight: {
    type: Number,
    default: 44
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
  visibleItemCount: {
    type: Number,
    default: 5
  },
  closeOnMask: { type: Boolean, default: true },
  defaultIndex: {
    type: [Number, Array],
    default: 0
  },
  immediateChange: {
    type: Boolean,
    default: false
  },
  round: {
    type: [String, Number],
    default: 16
  },
  showInput: {
    type: Boolean,
    default: true
  },
  showDefaultValue: {
    type: Boolean,
    default: true
  },
  options: {
    type: Array,
    default: () => {
      return ["Apple", "Orange", "Banana"];
    }
  },
  value: {
    type: [String, Number],
    default: ""
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
  "clear",
  "update:value",
  "update:modelValue",
  "update:show"
], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function isArray(value = null) {
    return Array.isArray(value);
  }
  function normalizeItem(item = null) {
    const data = item;
    if (data != null) {
      const rawValue = data["value"];
      const rawText = data["text"];
      const text = rawText != null ? rawText.toString() : rawValue != null ? rawValue.toString() : "";
      const value = rawValue != null ? rawValue : text;
      return new PickerItem({
        text,
        value,
        disabled: data["disabled"] == true
      });
    }
    return new PickerItem({
      text: item.toString(),
      value: item,
      disabled: false
    });
  }
  function normalizeColumn(list) {
    const result = new Array();
    for (let i = 0; i < list.length; i++)
      result.push(normalizeItem(list[i]));
    return result;
  }
  const opened = common_vendor.ref(props.show);
  const currentIndexs = common_vendor.ref([]);
  const normalizedColumns = common_vendor.computed(() => {
    const source = props.columns.length > 0 ? props.columns : props.options;
    if (source.length == 0)
      return new Array();
    const first = source[0];
    if (isArray(first)) {
      const result = new Array();
      for (let i = 0; i < source.length; i++)
        result.push(normalizeColumn(source[i]));
      return result;
    }
    return [normalizeColumn(source)];
  });
  function selectedIndexAt(columnIndex) {
    if (currentIndexs.value.length <= columnIndex)
      return 0;
    return currentIndexs.value[columnIndex];
  }
  function selectedItems() {
    const result = new Array();
    const columns = normalizedColumns.value;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const index = selectedIndexAt(i);
      if (index >= 0 && index < column.length)
        result.push(column[index]);
    }
    return result;
  }
  function columnAt(index) {
    if (index < 0 || index >= normalizedColumns.value.length)
      return new Array();
    return normalizedColumns.value[index];
  }
  function visibleCountNumber() {
    const count = props.visibleItemCount;
    if (count <= 0)
      return 5;
    return count;
  }
  function itemHeightNumber() {
    const height = props.itemHeight;
    if (height <= 0)
      return 44;
    return height;
  }
  function formatSize(value) {
    return value.toString() + "px";
  }
  const displayText = common_vendor.computed(() => {
    const items = selectedItems();
    if (items.length == 0)
      return "请选择";
    const texts = new Array();
    for (let i = 0; i < items.length; i++)
      texts.push(items[i].text);
    return texts.join(" / ");
  });
  const displayTextClass = common_vendor.computed(() => {
    return selectedItems().length == 0 ? "i-picker__input-text i-picker__input-text--placeholder" : "i-picker__input-text";
  });
  const columnCount = common_vendor.computed(() => {
    return normalizedColumns.value.length;
  });
  const column0 = common_vendor.computed(() => {
    return columnAt(0);
  });
  const column1 = common_vendor.computed(() => {
    return columnAt(1);
  });
  const column2 = common_vendor.computed(() => {
    return columnAt(2);
  });
  const column3 = common_vendor.computed(() => {
    return columnAt(3);
  });
  const column4 = common_vendor.computed(() => {
    return columnAt(4);
  });
  const column5 = common_vendor.computed(() => {
    return columnAt(5);
  });
  const columnsStyle = common_vendor.computed(() => {
    const height = itemHeightNumber() * visibleCountNumber();
    return "width:100%;height:" + height.toString() + "px;";
  });
  const indicatorStyle = common_vendor.computed(() => {
    return "height:" + formatSize(props.itemHeight) + ";background-color:transparent;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4;";
  });
  const itemStyle = common_vendor.computed(() => {
    return "height:" + formatSize(props.itemHeight) + ";";
  });
  const panelStyle = common_vendor.computed(() => {
    const radius = formatSize(props.round);
    return "border-radius:" + radius + " " + radius + " 0 0;";
  });
  function hasModelValue() {
    if (isArray(props.modelValue)) {
      const modelValues = props.modelValue;
      return modelValues.length > 0;
    }
    return props.modelValue.length > 0;
  }
  function activeModelValue() {
    if (hasModelValue())
      return props.modelValue;
    const value = props.value;
    if (value.length > 0)
      return value;
    return null;
  }
  function columnTargetValue(value = null, columnIndex) {
    if (value == null)
      return null;
    if (isArray(value)) {
      const values = value;
      return values.length > columnIndex ? values[columnIndex] : null;
    }
    return columnIndex == 0 ? value : null;
  }
  function defaultIndexAt(columnIndex) {
    if (isArray(props.defaultIndex)) {
      const defaultIndexes = props.defaultIndex;
      if (defaultIndexes.length > columnIndex)
        return defaultIndexes[columnIndex];
      return 0;
    }
    return columnIndex == 0 ? props.defaultIndex : 0;
  }
  function findValueIndex(column, value = null) {
    for (let i = 0; i < column.length; i++) {
      const itemValue = column[i].value;
      if (itemValue == value)
        return i;
    }
    return -1;
  }
  function hasTargetValue(value = null) {
    if (value == null)
      return false;
    if (isArray(value))
      return true;
    return value.length > 0;
  }
  function syncIndexs() {
    const columns = normalizedColumns.value;
    const result = new Array();
    const value = activeModelValue();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const targetValue = columnTargetValue(value, i);
      let index = -1;
      if (hasTargetValue(targetValue)) {
        index = findValueIndex(column, targetValue);
      }
      if (index < 0 && (props.showDefaultValue || !hasModelValue())) {
        index = defaultIndexAt(i);
      }
      if (index < 0)
        index = 0;
      if (index >= column.length)
        index = column.length - 1;
      result.push(index);
    }
    currentIndexs.value = result;
  }
  syncIndexs();
  function selectedValue() {
    const items = selectedItems();
    if (items.length == 0)
      return "";
    if (items.length == 1)
      return items[0].value;
    const values = new Array();
    for (let i = 0; i < items.length; i++)
      values.push(items[i].value);
    return values;
  }
  function pickerValuePayload() {
    const items = selectedItems();
    if (items.length == 1)
      return items[0];
    return items;
  }
  function buildChangeEvent(columnIndex, index) {
    return new common_vendor.UTSJSONObject({
      index,
      indexs: currentIndexs.value,
      columnIndex,
      value: pickerValuePayload(),
      values: selectedItems()
    });
  }
  function buildConfirmEvent() {
    return new common_vendor.UTSJSONObject({
      indexs: currentIndexs.value,
      value: pickerValuePayload(),
      values: selectedItems()
    });
  }
  function emitSelectedValue() {
    const value = selectedValue();
    emit("update:modelValue", value);
    emit("update:value", isArray(value) ? "" : value);
  }
  function open() {
    if (opened.value)
      return null;
    syncIndexs();
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
    emit("cancel", buildChangeEvent(0, selectedIndexAt(0)));
    close();
  }
  function confirm() {
    const event = buildConfirmEvent();
    emit("confirm", event);
    emitSelectedValue();
    close();
  }
  function clear() {
    currentIndexs.value = [];
    emit("clear");
    emit("change", buildChangeEvent(0, -1));
    emit("update:value", "");
    emit("update:modelValue", "");
  }
  function handleOverlayClick() {
    if (!props.closeOnMask)
      return null;
    close();
  }
  function handlePickerChange(event) {
    if (props.disabled || props.loading)
      return null;
    const values = event.detail.value;
    const nextIndexs = new Array();
    let changedColumnIndex = 0;
    for (let i = 0; i < normalizedColumns.value.length; i++) {
      const column = normalizedColumns.value[i];
      const oldIndex = selectedIndexAt(i);
      let nextIndex = 0;
      if (values.length > i)
        nextIndex = values[i];
      if (nextIndex < 0)
        nextIndex = 0;
      if (nextIndex >= column.length)
        nextIndex = column.length - 1;
      if (column.length > 0 && column[nextIndex].disabled)
        nextIndex = oldIndex;
      if (oldIndex != nextIndex)
        changedColumnIndex = i;
      nextIndexs.push(nextIndex);
    }
    currentIndexs.value = nextIndexs;
    const eventValue = buildChangeEvent(changedColumnIndex, selectedIndexAt(changedColumnIndex));
    emit("change", eventValue);
    if (props.immediateChange)
      emitSelectedValue();
  }
  function itemClass(item, columnIndex, itemIndex) {
    const classes = new Array();
    classes.push("i-picker__item");
    if (selectedIndexAt(columnIndex) == itemIndex)
      classes.push("i-picker__item--active");
    if (item.disabled)
      classes.push("i-picker__item--disabled");
    return classes.join(" ");
  }
  function itemTextClass(item, columnIndex, itemIndex) {
    return selectedIndexAt(columnIndex) == itemIndex ? "i-picker__item-text i-picker__item-text--active" : "i-picker__item-text";
  }
  function itemTextStyle(item, columnIndex, itemIndex) {
    let style = "line-height:" + formatSize(props.itemHeight) + ";color:#606266;";
    if (selectedIndexAt(columnIndex) == itemIndex) {
      style = style + "color:#111827;";
    }
    return style;
  }
  __expose({
    open,
    close,
    clear,
    getIndexs() {
      return currentIndexs.value;
    },
    getValues() {
      return selectedItems();
    },
    getColumns() {
      return normalizedColumns.value;
    },
    getColumnValues(columnIndex) {
      if (columnIndex < 0 || columnIndex >= normalizedColumns.value.length)
        return [];
      return normalizedColumns.value[columnIndex];
    },
    setColumnValues(columnIndex, values) {
      emit("change", {
        index: selectedIndexAt(columnIndex),
        indexs: currentIndexs.value,
        columnIndex,
        value: values,
        values
      });
    }
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.showInput
    }, __props.showInput ? {
      b: common_vendor.t(displayText.value),
      c: common_vendor.n(displayTextClass.value),
      d: common_vendor.o(openByTrigger, "45")
    } : {}, {
      e: opened.value
    }, opened.value ? common_vendor.e({
      f: __props.showToolbar
    }, __props.showToolbar ? {
      g: common_vendor.t(__props.cancelText),
      h: common_vendor.s("color:" + __props.cancelColor + ";"),
      i: common_vendor.o(cancel, "31"),
      j: common_vendor.t(__props.title),
      k: common_vendor.t(__props.confirmText),
      l: common_vendor.s("color:" + __props.confirmColor + ";"),
      m: common_vendor.o(confirm, "dd")
    } : {}, {
      n: __props.loading
    }, __props.loading ? {} : {}, {
      o: columnCount.value > 0
    }, columnCount.value > 0 ? {
      p: common_vendor.f(column0.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 0, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 0, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 0, itemIndex))
        };
      }),
      q: common_vendor.s(itemStyle.value)
    } : {}, {
      r: columnCount.value > 1
    }, columnCount.value > 1 ? {
      s: common_vendor.f(column1.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 1, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 1, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 1, itemIndex))
        };
      }),
      t: common_vendor.s(itemStyle.value)
    } : {}, {
      v: columnCount.value > 2
    }, columnCount.value > 2 ? {
      w: common_vendor.f(column2.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 2, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 2, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 2, itemIndex))
        };
      }),
      x: common_vendor.s(itemStyle.value)
    } : {}, {
      y: columnCount.value > 3
    }, columnCount.value > 3 ? {
      z: common_vendor.f(column3.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 3, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 3, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 3, itemIndex))
        };
      }),
      A: common_vendor.s(itemStyle.value)
    } : {}, {
      B: columnCount.value > 4
    }, columnCount.value > 4 ? {
      C: common_vendor.f(column4.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 4, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 4, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 4, itemIndex))
        };
      }),
      D: common_vendor.s(itemStyle.value)
    } : {}, {
      E: columnCount.value > 5
    }, columnCount.value > 5 ? {
      F: common_vendor.f(column5.value, (item, itemIndex, i0) => {
        return {
          a: common_vendor.t(item.text),
          b: common_vendor.n(itemTextClass(item, 5, itemIndex)),
          c: common_vendor.s(itemTextStyle(item, 5, itemIndex)),
          d: item.value,
          e: common_vendor.n(itemClass(item, 5, itemIndex))
        };
      }),
      G: common_vendor.s(itemStyle.value)
    } : {}, {
      H: common_vendor.s(columnsStyle.value),
      I: currentIndexs.value,
      J: indicatorStyle.value,
      K: common_vendor.o(handlePickerChange, "b2"),
      L: common_vendor.s(panelStyle.value),
      M: common_vendor.o(() => {
      }, "60"),
      N: common_vendor.o(handleOverlayClick, "a7")
    }) : {}, {
      O: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      P: `${_ctx.u_s_b_h}px`,
      Q: `${_ctx.u_s_a_i_b}px`,
      R: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-picker/i-picker.js.map
