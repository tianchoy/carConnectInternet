"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  _easycom_custom_navBar_1();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
if (!Math) {
  _easycom_custom_navBar();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carDetail",
  setup(__props) {
    const deviceId = common_vendor.ref("");
    const carInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const carTitle = common_vendor.computed(() => {
      return carInfo.value.getString("carType", "未知");
    });
    const formattedPlateNo = common_vendor.computed(() => {
      return carInfo.value.getString("plateNo", "京A");
    });
    const toggleEdit = () => {
    };
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getDeviceDetail(deviceId.value);
        const data = res.getJSON("data");
        if (data != null)
          carInfo.value = data;
      });
    };
    common_vendor.onLoad((option) => {
      const id = option.deviceId;
      if (id != null) {
        deviceId.value = id;
        loadCarListData();
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.o(toggleEdit, "77"),
        b: common_vendor.p({
          title: "车辆详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          Icon: "/static/edit-pen.png",
          class: "data-v-36223569"
        }),
        c: common_vendor.t(carInfo.value.getString("deviceId", "")),
        d: common_vendor.t(carInfo.value.getString("deviceName", "")),
        e: common_vendor.t(carTitle.value),
        f: common_vendor.t(formattedPlateNo.value),
        g: common_vendor.t(carInfo.value.getString("carVin", "")),
        h: common_vendor.t(carInfo.value.getString("engineNum", "")),
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        j: `${_ctx.u_s_b_h}px`,
        k: `${_ctx.u_s_a_i_b}px`,
        l: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36223569"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carDetail/carDetail.js.map
