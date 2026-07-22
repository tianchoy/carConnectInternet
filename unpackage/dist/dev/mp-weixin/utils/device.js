"use strict";
const common_vendor = require("../common/vendor.js");
class DeviceItem extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          plateNo: { type: String, optional: false },
          imei: { type: String, optional: false },
          status: { type: Number, optional: false },
          companyId: { type: String, optional: false },
          deviceName: { type: String, optional: false },
          deviceId: { type: String, optional: false },
          iccid: { type: String, optional: false },
          simMerchant: { type: String, optional: false },
          connectionStatus: { type: String, optional: false }
        };
      },
      name: "DeviceItem"
    };
  }
  constructor(options, metadata = DeviceItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.plateNo = this.__props__.plateNo;
    this.imei = this.__props__.imei;
    this.status = this.__props__.status;
    this.companyId = this.__props__.companyId;
    this.deviceName = this.__props__.deviceName;
    this.deviceId = this.__props__.deviceId;
    this.iccid = this.__props__.iccid;
    this.simMerchant = this.__props__.simMerchant;
    this.connectionStatus = this.__props__.connectionStatus;
    delete this.__props__;
  }
}
exports.DeviceItem = DeviceItem;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/device.js.map
