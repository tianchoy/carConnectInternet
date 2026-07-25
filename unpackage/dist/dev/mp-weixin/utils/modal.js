"use strict";
const common_vendor = require("../common/vendor.js");
class AppModalSuccess {
  constructor() {
    this.confirm = false;
    this.cancel = false;
  }
}
class AppModalOptions extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          title: { type: String, optional: true },
          content: { type: String, optional: true },
          showCancel: { type: Boolean, optional: true },
          confirmText: { type: String, optional: true },
          cancelText: { type: String, optional: true },
          success: { type: "Unknown", optional: true }
        };
      },
      name: "AppModalOptions"
    };
  }
  constructor(options, metadata = AppModalOptions.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.title = this.__props__.title;
    this.content = this.__props__.content;
    this.showCancel = this.__props__.showCancel;
    this.confirmText = this.__props__.confirmText;
    this.cancelText = this.__props__.cancelText;
    this.success = this.__props__.success;
    delete this.__props__;
  }
}
const modalHandlers = [];
function registerAppModalHandler(handler) {
  if (modalHandlers.indexOf(handler) == -1)
    modalHandlers.push(handler);
}
function unregisterAppModalHandler(handler) {
  const index = modalHandlers.indexOf(handler);
  if (index >= 0)
    modalHandlers.splice(index, 1);
}
function showAppModal(options) {
  var _a, _b, _c;
  const handler = modalHandlers.length > 0 ? modalHandlers[modalHandlers.length - 1] : null;
  if (handler != null) {
    handler(options);
    return null;
  }
  common_vendor.index.showModal(new common_vendor.UTSJSONObject({
    title: (_a = options.title) !== null && _a !== void 0 ? _a : "",
    content: (_b = options.content) !== null && _b !== void 0 ? _b : "",
    showCancel: (_c = options.showCancel) !== null && _c !== void 0 ? _c : true,
    confirmText: options.confirmText,
    cancelText: options.cancelText,
    success: (res) => {
      const result = new AppModalSuccess();
      result.confirm = res.confirm;
      result.cancel = res.cancel;
      if (options.success != null)
        options.success(result);
    }
  }));
}
exports.AppModalSuccess = AppModalSuccess;
exports.registerAppModalHandler = registerAppModalHandler;
exports.showAppModal = showAppModal;
exports.unregisterAppModalHandler = unregisterAppModalHandler;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/modal.js.map
