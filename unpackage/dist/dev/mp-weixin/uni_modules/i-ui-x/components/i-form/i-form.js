"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  _easycom_i_button_1();
}
const _easycom_i_button = () => "../i-button/i-button.js";
if (!Math) {
  _easycom_i_button();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-form" }, { __name: "i-form", props: {
  modelValue: {
    type: Object,
    default() {
      return new common_vendor.UTSJSONObject({});
    }
  },
  fields: {
    type: Array,
    default() {
      return [];
    }
  },
  rules: {
    type: Array,
    default() {
      return [];
    }
  },
  showActions: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: "提交"
  },
  resetText: {
    type: String,
    default: "重置"
  },
  labelDirection: {
    type: String,
    default: "horizontal"
  },
  errorAlign: {
    type: String,
    default: "left"
  },
  errorAutoPage: {
    type: Boolean,
    default: true
  },
  scrollOffsetTop: {
    type: [String, Number],
    default: 12
  },
  scrollDuration: {
    type: [String, Number],
    default: 300
  },
  scrollIdPrefix: {
    type: String,
    default: "i-form-item-"
  },
  watchValidStatus: {
    type: Boolean,
    default: false
  },
  modelValid: {
    type: Boolean,
    default: false
  }
}, emits: [
  "submit",
  "reset",
  "validate",
  "scroll-to-error",
  "update:modelValid",
  "update:valid"
], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const valid = common_vendor.ref(true);
  const message = common_vendor.ref("");
  const errors = common_vendor.ref([]);
  const formClass = common_vendor.computed(() => {
    const classes = ["i-form"];
    if (props.labelDirection == "vertical")
      classes.push("i-form--vertical");
    return classes.join(" ");
  });
  const messageClass = common_vendor.computed(() => {
    return valid.value ? "i-form__message i-form__message--success" : "i-form__message i-form__message--error";
  });
  const messageStyle = common_vendor.computed(() => {
    return "text-align:" + props.errorAlign + ";";
  });
  function activeFields() {
    if (props.fields.length > 0)
      return props.fields;
    return props.rules;
  }
  function fieldValue(item = null) {
    if (item.value != null)
      return item.value;
    const name = String(item.name == null ? "" : item.name);
    if (name.length == 0)
      return "";
    const values = props.modelValue;
    if (values != null && typeof values == "object" && values[name] != null) {
      return values[name];
    }
    return "";
  }
  function fieldLabel(item = null) {
    const label = String(item.label == null ? item.name : item.label);
    return label.length > 0 ? label : "字段";
  }
  function fieldRequired(item = null) {
    return item.required == true;
  }
  function fieldMessage(item = null) {
    const customMessage = String(item.message == null ? "" : item.message);
    if (customMessage.length > 0)
      return customMessage;
    return fieldLabel(item) + "不能为空";
  }
  function checkField(item = null, selectedKeys = null) {
    const name = String(item.name == null ? "" : item.name);
    if (selectedKeys.length > 0 && selectedKeys.indexOf(name) < 0)
      return "";
    const value = fieldValue(item);
    if (fieldRequired(item) && String(value).length == 0) {
      return fieldMessage(item);
    }
    return "";
  }
  function collectValues() {
    const values = new common_vendor.UTSJSONObject({});
    const list = activeFields();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const name = String(item.name == null ? "" : item.name);
      if (name.length > 0)
        values[name] = fieldValue(item);
    }
    return values;
  }
  function validateFields(selectedKeys = null, silent = null) {
    const list = activeFields();
    const nextErrors = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const errorMessage = checkField(item, selectedKeys);
      if (errorMessage.length > 0) {
        nextErrors.push({
          field: String(item.name == null ? "" : item.name),
          message: errorMessage
        });
      }
    }
    errors.value = nextErrors;
    valid.value = nextErrors.length == 0;
    if (!silent) {
      message.value = valid.value ? "校验通过" : String(nextErrors[0].message);
      emit("validate", new common_vendor.UTSJSONObject({
        valid: valid.value,
        message: message.value,
        errors: nextErrors,
        values: collectValues()
      }));
      if (!valid.value)
        scrollToFirstError(nextErrors);
    }
    emit("update:modelValid", valid.value);
    emit("update:valid", valid.value);
    return valid.value;
  }
  function validate() {
    return validateFields([], false);
  }
  function validFields(keys = null) {
    return validateFields(keys, false);
  }
  function checkAsyncVaildStatus() {
    return validateFields([], true);
  }
  function clearValid() {
    valid.value = true;
    message.value = "";
    errors.value = [];
    emit("update:modelValid", true);
    emit("update:valid", true);
  }
  function submit() {
    const isValid = validate();
    const result = new common_vendor.UTSJSONObject({
      valid: isValid,
      values: collectValues(),
      errors: errors.value,
      message: message.value
    });
    emit("submit", result);
  }
  function reset() {
    clearValid();
    emit("reset", new common_vendor.UTSJSONObject({
      values: collectValues()
    }));
  }
  function scrollToFirstError(nextErrors = null) {
    if (!props.errorAutoPage || nextErrors.length == 0)
      return null;
    const field = String(nextErrors[0].field == null ? "" : nextErrors[0].field);
    if (field.length == 0)
      return null;
    const targetId = scrollTargetId(field);
    const selector = "#" + targetId;
    emit("scroll-to-error", new common_vendor.UTSJSONObject({
      field,
      targetId,
      selector,
      offsetTop: Number(props.scrollOffsetTop),
      duration: Number(props.scrollDuration)
    }));
    common_vendor.nextTick$1(() => {
      common_vendor.index.pageScrollTo(new common_vendor.UTSJSONObject({
        selector,
        offsetTop: Number(props.scrollOffsetTop),
        duration: Number(props.scrollDuration)
      }));
    });
  }
  function scrollTargetId(name = null) {
    return props.scrollIdPrefix + normalizeIdName(name);
  }
  function normalizeIdName(name = null) {
    const text = String(name);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const char = text.charAt(i);
      const isNumber = code >= 48 && code <= 57;
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;
      if (isNumber || isUpper || isLower || char == "-" || char == "_") {
        result = result + char;
      } else {
        result = result + "-";
      }
    }
    return result;
  }
  common_vendor.watch(() => {
    return [props.fields, props.rules, props.modelValue, props.watchValidStatus];
  }, () => {
    if (props.watchValidStatus)
      validateFields([], true);
  }, { deep: true });
  __expose({
    valid: validFields,
    validate,
    clearValid,
    checkAsyncVaildStatus,
    submit,
    reset
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: message.value.length > 0
    }, message.value.length > 0 ? {
      b: common_vendor.t(message.value),
      c: common_vendor.n(messageClass.value),
      d: common_vendor.s(messageStyle.value)
    } : {}, {
      e: __props.showActions
    }, __props.showActions ? {
      f: common_vendor.t(__props.resetText),
      g: common_vendor.o(reset, "e2"),
      h: common_vendor.p({
        size: "small",
        plain: true
      }),
      i: common_vendor.t(__props.submitText),
      j: common_vendor.o(submit, "fb"),
      k: common_vendor.p({
        size: "small",
        type: "primary"
      })
    } : {}, {
      l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      m: common_vendor.n(formClass.value),
      n: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      o: `${_ctx.u_s_b_h}px`,
      p: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
