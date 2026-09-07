"use strict";
const common_vendor = require("../common/vendor.js");
class AddressResult extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          formatted_address: { type: String, optional: false }
        };
      },
      name: "AddressResult"
    };
  }
  constructor(options, metadata = AddressResult.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.formatted_address = this.__props__.formatted_address;
    delete this.__props__;
  }
}
class AddressResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          result: { type: AddressResult, optional: false }
        };
      },
      name: "AddressResponse"
    };
  }
  constructor(options, metadata = AddressResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.result = this.__props__.result;
    delete this.__props__;
  }
}
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getAdress.js.map
