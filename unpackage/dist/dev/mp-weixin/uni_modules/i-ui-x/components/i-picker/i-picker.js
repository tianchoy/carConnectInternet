"use strict";
const common_vendor = require("../../../../common/vendor.js");
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
    type: [String, Number],
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
    type: [String, Number],
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
  const opened = common_vendor.ref(props.show);
  const currentIndexs = common_vendor.ref([]);
  const normalizedColumns = common_vendor.computed(() => {
    const source = props.columns.length > 0 ? props.columns : props.options;
    if (source.length == 0)
      return [];
    const first = source[0];
    if (isArray(first)) {
      const result = [];
      for (let i = 0; i < source.length; i++)
        result.push(normalizeColumn(source[i]));
      return result;
    }
    return [normalizeColumn(source)];
  });
  const displayText = common_vendor.computed(() => {
    const items = selectedItems();
    if (items.length == 0)
      return "请选择";
    const texts = [];
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
    return "width:100%;height:" + String(height) + "px;";
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
  common_vendor.watch(() => {
    return props.show;
  }, (nextValue) => {
    if (opened.value == nextValue)
      return null;
    opened.value = nextValue;
    if (nextValue) {
      syncIndexs();
      emit("open");
    } else {
      emit("close");
    }
  });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    syncIndexs();
  });
  common_vendor.watch(() => {
    return props.value;
  }, () => {
    syncIndexs();
  });
  common_vendor.watch(() => {
    return props.columns;
  }, () => {
    syncIndexs();
  });
  common_vendor.watch(() => {
    return props.defaultIndex;
  }, () => {
    syncIndexs();
  });
  syncIndexs();
  function openByTrigger() {
    if (props.disabled)
      return null;
    open();
  }
  function open() {
    if (opened.value)
      return null;
    syncIndexs();
    opened.value = true;
    emit("open");
    emit("update:show", true);
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
  function handlePickerChange(event = null) {
    if (props.disabled || props.loading)
      return null;
    const values = event.detail.value;
    const nextIndexs = [];
    let changedColumnIndex = 0;
    for (let i = 0; i < normalizedColumns.value.length; i++) {
      const column = normalizedColumns.value[i];
      const oldIndex = selectedIndexAt(i);
      let nextIndex = 0;
      if (values.length > i)
        nextIndex = Number(values[i]);
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
  function emitSelectedValue() {
    const value = selectedValue();
    emit("update:modelValue", value);
    emit("update:value", isArray(value) ? "" : value);
  }
  function syncIndexs() {
    const columns = normalizedColumns.value;
    const result = [];
    const value = activeModelValue();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const targetValue = columnTargetValue(value, i);
      let index = -1;
      if (targetValue != null && String(targetValue).length > 0) {
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
  function activeModelValue() {
    if (hasModelValue())
      return props.modelValue;
    if (String(props.value).length > 0)
      return props.value;
    return null;
  }
  function hasModelValue() {
    if (isArray(props.modelValue))
      return props.modelValue.length > 0;
    return String(props.modelValue).length > 0;
  }
  function columnTargetValue(value = null, columnIndex = null) {
    if (value == null)
      return null;
    if (isArray(value))
      return value.length > columnIndex ? value[columnIndex] : null;
    return columnIndex == 0 ? value : null;
  }
  function defaultIndexAt(columnIndex = null) {
    if (isArray(props.defaultIndex)) {
      if (props.defaultIndex.length > columnIndex)
        return Number(props.defaultIndex[columnIndex]);
      return 0;
    }
    return columnIndex == 0 ? Number(props.defaultIndex) : 0;
  }
  function findValueIndex(column = null, value = null) {
    for (let i = 0; i < column.length; i++) {
      if (String(column[i].value) == String(value))
        return i;
    }
    return -1;
  }
  function selectedItems() {
    const result = [];
    const columns = normalizedColumns.value;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const index = selectedIndexAt(i);
      if (index >= 0 && index < column.length)
        result.push(column[index]);
    }
    return result;
  }
  function selectedValue() {
    const items = selectedItems();
    if (items.length == 0)
      return "";
    if (items.length == 1)
      return items[0].value;
    const values = [];
    for (let i = 0; i < items.length; i++)
      values.push(items[i].value);
    return values;
  }
  function selectedIndexAt(columnIndex = null) {
    if (currentIndexs.value.length <= columnIndex)
      return 0;
    return Number(currentIndexs.value[columnIndex]);
  }
  function buildChangeEvent(columnIndex = null, index = null) {
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
  function pickerValuePayload() {
    const items = selectedItems();
    if (items.length == 1)
      return items[0];
    return items;
  }
  function columnAt(index = null) {
    if (index < 0 || index >= normalizedColumns.value.length)
      return [];
    return normalizedColumns.value[index];
  }
  function normalizeColumn(list = null) {
    const result = [];
    for (let i = 0; i < list.length; i++)
      result.push(normalizeItem(list[i]));
    return result;
  }
  function normalizeItem(item = null) {
    if (item != null && typeof item == "object") {
      const text = item.text != null ? String(item.text) : String(item.value);
      const value = item.value != null ? item.value : text;
      return new common_vendor.UTSJSONObject({
        text,
        value,
        disabled: item.disabled == true
      });
    }
    return new common_vendor.UTSJSONObject({
      text: String(item),
      value: item,
      disabled: false
    });
  }
  function itemClass(item = null, columnIndex = null, itemIndex = null) {
    const classes = ["i-picker__item"];
    if (selectedIndexAt(columnIndex) == itemIndex)
      classes.push("i-picker__item--active");
    if (item.disabled)
      classes.push("i-picker__item--disabled");
    return classes.join(" ");
  }
  function itemTextClass(item = null, columnIndex = null, itemIndex = null) {
    return selectedIndexAt(columnIndex) == itemIndex ? "i-picker__item-text i-picker__item-text--active" : "i-picker__item-text";
  }
  function itemTextStyle(item = null, columnIndex = null, itemIndex = null) {
    let style = "line-height:" + formatSize(props.itemHeight) + ";color:#606266;";
    if (selectedIndexAt(columnIndex) == itemIndex) {
      style = style + "color:#111827;";
    }
    return style;
  }
  function isArray(value = null) {
    return Object.prototype.toString.call(value) == "[object Array]";
  }
  function visibleCountNumber() {
    const count = Number(props.visibleItemCount);
    if (isNaN(count) || count <= 0)
      return 5;
    return count;
  }
  function itemHeightNumber() {
    const height = Number(props.itemHeight);
    if (isNaN(height) || height <= 0)
      return 44;
    return height;
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
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
    getColumnValues(columnIndex = null) {
      if (columnIndex < 0 || columnIndex >= normalizedColumns.value.length)
        return [];
      return normalizedColumns.value[columnIndex];
    },
    setColumnValues(columnIndex = null, values = null) {
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
