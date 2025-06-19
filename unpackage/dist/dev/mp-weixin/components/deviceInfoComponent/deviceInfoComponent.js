"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceInfoComponent",
  props: {
    showPopup: Boolean,
    deviceInfo: new UTSJSONObject({
      type: Object,
      default: () => {
        return new UTSJSONObject({});
      }
    })
  },
  emits: ["close"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const emit = __emit;
    const onClose = () => {
      emit("close");
    };
    const onMaskClick = (e = null) => {
      var _a2;
      if (((_a2 = e.target) === null || _a2 === void 0 ? null : _a2.className) !== "popup-mask")
        return null;
      onClose();
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: __props.showPopup
      }), __props.showPopup ? new UTSJSONObject({
        b: common_vendor.t(__props.deviceInfo.deviceName),
        c: common_vendor.t(__props.deviceInfo.carNumber),
        d: common_vendor.t(__props.deviceInfo.deviceSerial),
        e: common_vendor.t(__props.deviceInfo.locationType),
        f: common_vendor.t(__props.deviceInfo.lngLat),
        g: common_vendor.t(__props.deviceInfo.updateTime),
        h: common_vendor.t(__props.deviceInfo.locationTime),
        i: common_vendor.t(__props.deviceInfo.speed),
        j: common_vendor.t(__props.deviceInfo.totalMileage),
        k: common_vendor.t(__props.deviceInfo.address),
        l: common_vendor.o(onClose),
        m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        n: common_vendor.o(onMaskClick)
      }) : new UTSJSONObject({}));
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/deviceInfoComponent/deviceInfoComponent.js.map
