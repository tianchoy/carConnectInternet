"use strict";
const common_vendor = require("../../common/vendor.js");
class SmsRegisterContext extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          phonenumber: { type: String, optional: false },
          smsCode: { type: String, optional: false }
        };
      },
      name: "SmsRegisterContext"
    };
  }
  constructor(options, metadata = SmsRegisterContext.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phonenumber = this.__props__.phonenumber;
    this.smsCode = this.__props__.smsCode;
    delete this.__props__;
  }
}
let pendingContext = null;
function getSmsRegisterContext() {
  return pendingContext;
}
function clearSmsRegisterContext() {
  pendingContext = null;
}
exports.clearSmsRegisterContext = clearSmsRegisterContext;
exports.getSmsRegisterContext = getSmsRegisterContext;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/services/auth/sms-register-context.js.map
