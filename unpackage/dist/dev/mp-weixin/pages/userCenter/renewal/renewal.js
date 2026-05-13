"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_number_box_1 = common_vendor.resolveComponent("uv-number-box");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_number_box_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_number_box = () => "../../../uni_modules/uv-number-box/components/uv-number-box/uv-number-box.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_uv_number_box + _easycom_uv_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "renewal",
  setup(__props) {
    const iccid = common_vendor.ref("");
    const deviceInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const price = common_vendor.ref("5");
    const year = common_vendor.ref(1);
    const valChange = (val = null) => {
      console.log(val.value);
      year.value = val.value;
    };
    common_vendor.onLoad((option) => {
      console.log(option);
      iccid.value = option.iccid;
    });
    const pay = () => {
      common_vendor.index.navigateToMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1234567890",
        path: "pages/index/index?iccid=" + iccid.value + "&year=" + year.value,
        envVersion: "release",
        success(res = null) {
          console.log(res);
        },
        fail(res = null) {
          console.log(res);
        }
      }));
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "支付",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          isShowStyle: true,
          class: "data-v-90dc4ee7"
        }),
        b: common_vendor.t(iccid.value),
        c: common_vendor.t(deviceInfo.value.deviceName),
        d: common_vendor.t(deviceInfo.value.deviceStatus),
        e: common_vendor.t(price.value),
        f: common_vendor.p({
          name: "minus",
          size: "12",
          class: "data-v-90dc4ee7"
        }),
        g: common_vendor.t(year.value),
        h: common_vendor.p({
          name: "plus",
          color: "#FFFFFF",
          size: "12",
          class: "data-v-90dc4ee7"
        }),
        i: common_vendor.o(valChange, "1a"),
        j: common_vendor.o(($event) => {
          return year.value = $event;
        }, "ea"),
        k: common_vendor.p({
          min: 1,
          max: 10,
          integer: true,
          disabledInput: true,
          modelValue: year.value,
          class: "data-v-90dc4ee7"
        }),
        l: common_vendor.t(price.value.value * year.value.value),
        m: common_vendor.o(pay, "da"),
        n: common_vendor.p({
          type: "primary",
          text: "去支付",
          class: "data-v-90dc4ee7"
        }),
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        p: `${_ctx.u_s_b_h}px`,
        q: `${_ctx.u_s_a_i_b}px`,
        r: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-90dc4ee7"]]);
wx.createPage(MiniProgramPage);
