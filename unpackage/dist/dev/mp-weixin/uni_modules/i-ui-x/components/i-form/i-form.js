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
class IFormField extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          name: { type: String, optional: false },
          label: { type: String, optional: false },
          value: { type: "Any", optional: true },
          hasValue: { type: Boolean, optional: false },
          required: { type: Boolean, optional: false },
          message: { type: String, optional: false }
        };
      },
      name: "IFormField"
    };
  }
  constructor(options, metadata = IFormField.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.name = this.__props__.name;
    this.label = this.__props__.label;
    this.value = this.__props__.value;
    this.hasValue = this.__props__.hasValue;
    this.required = this.__props__.required;
    this.message = this.__props__.message;
    delete this.__props__;
  }
}
class IFormError extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          field: { type: String, optional: false },
          message: { type: String, optional: false }
        };
      },
      name: "IFormError"
    };
  }
  constructor(options, metadata = IFormError.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.field = this.__props__.field;
    this.message = this.__props__.message;
    delete this.__props__;
  }
}
class IFormValidatePayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          valid: { type: Boolean, optional: false },
          message: { type: String, optional: false },
          errors: { type: "Unknown", optional: false },
          values: { type: "Unknown", optional: false }
        };
      },
      name: "IFormValidatePayload"
    };
  }
  constructor(options, metadata = IFormValidatePayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.valid = this.__props__.valid;
    this.message = this.__props__.message;
    this.errors = this.__props__.errors;
    this.values = this.__props__.values;
    delete this.__props__;
  }
}
class IFormSubmitPayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          valid: { type: Boolean, optional: false },
          values: { type: "Unknown", optional: false },
          errors: { type: "Unknown", optional: false },
          message: { type: String, optional: false }
        };
      },
      name: "IFormSubmitPayload"
    };
  }
  constructor(options, metadata = IFormSubmitPayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.valid = this.__props__.valid;
    this.values = this.__props__.values;
    this.errors = this.__props__.errors;
    this.message = this.__props__.message;
    delete this.__props__;
  }
}
class IFormResetPayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          values: { type: "Unknown", optional: false }
        };
      },
      name: "IFormResetPayload"
    };
  }
  constructor(options, metadata = IFormResetPayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.values = this.__props__.values;
    delete this.__props__;
  }
}
class IFormScrollPayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          field: { type: String, optional: false },
          targetId: { type: String, optional: false },
          selector: { type: String, optional: false },
          offsetTop: { type: Number, optional: false },
          duration: { type: Number, optional: false }
        };
      },
      name: "IFormScrollPayload"
    };
  }
  constructor(options, metadata = IFormScrollPayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.field = this.__props__.field;
    this.targetId = this.__props__.targetId;
    this.selector = this.__props__.selector;
    this.offsetTop = this.__props__.offsetTop;
    this.duration = this.__props__.duration;
    delete this.__props__;
  }
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
}, emits: ["submit", "reset", "validate", "scroll-to-error", "update:modelValid", "update:valid"], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function objectText(object, keyName) {
    const value = object[keyName];
    return value == null ? "" : value.toString();
  }
  function normalizeField(raw = null) {
    if (raw == null || typeof raw != "object")
      return null;
    const object = raw;
    const value = object["value"];
    return {
      name: objectText(object, "name"),
      label: objectText(object, "label"),
      value,
      hasValue: value != null,
      required: object["required"] == true,
      message: objectText(object, "message")
    };
  }
  function normalizeFields(value = null) {
    const result = [];
    if (value == null)
      return result;
    for (let i = 0; i < value.length; i++) {
      const field = normalizeField(value[i]);
      if (field != null)
        result.push(field);
    }
    return result;
  }
  function activeFields() {
    const fields = normalizeFields(props.fields);
    if (fields.length > 0)
      return fields;
    return normalizeFields(props.rules);
  }
  function modelFieldValue(name) {
    const model = props.modelValue;
    if (model == null || typeof model != "object")
      return null;
    return model[name];
  }
  function fieldValue(item) {
    const configuredValue = item.value;
    if (item.hasValue && configuredValue != null)
      return configuredValue;
    if (item.name.length == 0)
      return "";
    const value = modelFieldValue(item.name);
    return value == null ? "" : value;
  }
  function fieldLabel(item) {
    const label = item.label.length > 0 ? item.label : item.name;
    return label.length > 0 ? label : "字段";
  }
  function fieldMessage(item) {
    if (item.message.length > 0)
      return item.message;
    return fieldLabel(item) + "不能为空";
  }
  function checkField(item, selectedKeys) {
    if (selectedKeys.length > 0 && selectedKeys.indexOf(item.name) < 0)
      return "";
    const value = fieldValue(item);
    if (item.required && value.toString().length == 0)
      return fieldMessage(item);
    return "";
  }
  function collectValues() {
    const values = new common_vendor.UTSJSONObject({});
    const list = activeFields();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.name.length > 0)
        values[item.name] = fieldValue(item);
    }
    return values;
  }
  function normalizeIdName(name) {
    const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    let result = "";
    for (let i = 0; i < name.length; i++) {
      const char = name.charAt(i);
      result += allowed.indexOf(char) >= 0 ? char : "-";
    }
    return result;
  }
  function scrollTargetId(name) {
    return props.scrollIdPrefix + normalizeIdName(name);
  }
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
  function scrollToFirstError(nextErrors) {
    if (!props.errorAutoPage || nextErrors.length == 0)
      return null;
    const field = nextErrors[0].field;
    if (field.length == 0)
      return null;
    const targetId = scrollTargetId(field);
    const selector = "#" + targetId;
    const offsetTop = parseFloat(props.scrollOffsetTop.toString());
    const duration = parseFloat(props.scrollDuration.toString());
    const payload = new IFormScrollPayload({
      field,
      targetId,
      selector,
      offsetTop,
      duration
    });
    emit("scroll-to-error", payload);
    common_vendor.nextTick$1(() => {
      common_vendor.index.pageScrollTo(new common_vendor.UTSJSONObject({ selector, offsetTop, duration }));
    });
  }
  function validateFields(selectedKeys, silent) {
    const list = activeFields();
    const nextErrors = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const errorMessage = checkField(item, selectedKeys);
      if (errorMessage.length > 0) {
        const error = new IFormError({ field: item.name, message: errorMessage });
        nextErrors.push(error);
      }
    }
    errors.value = nextErrors;
    valid.value = nextErrors.length == 0;
    if (!silent) {
      message.value = valid.value ? "校验通过" : nextErrors[0].message.toString();
      const payload = new IFormValidatePayload({
        valid: valid.value,
        message: message.value,
        errors: nextErrors,
        values: collectValues()
      });
      emit("validate", payload);
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
  function validFields(keys) {
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
    const result = new IFormSubmitPayload({
      valid: isValid,
      values: collectValues(),
      errors: errors.value,
      message: message.value
    });
    emit("submit", result);
  }
  function reset() {
    clearValid();
    const payload = new IFormResetPayload({ values: collectValues() });
    emit("reset", payload);
  }
  common_vendor.watch(() => {
    return props.fields;
  }, () => {
    if (props.watchValidStatus)
      validateFields([], true);
  }, { deep: true });
  common_vendor.watch(() => {
    return props.rules;
  }, () => {
    if (props.watchValidStatus)
      validateFields([], true);
  }, { deep: true });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    if (props.watchValidStatus)
      validateFields([], true);
  }, { deep: true });
  common_vendor.watch(() => {
    return props.watchValidStatus;
  }, (value) => {
    if (value)
      validateFields([], true);
  });
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
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-form/i-form.js.map
