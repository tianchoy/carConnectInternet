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
  __name: "carList",
  setup(__props) {
    const carList = common_vendor.ref(new UTSJSONObject({}));
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    common_vendor.onPageShow(() => {
      loadCarListData();
    });
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const data = new UTSJSONObject({});
        const res = yield api_request.getUserDeviceList(data);
        carList.value = res.data.list;
        common_vendor.index.__f__("log", "at pages/userCenter/carList/carList.uvue:36", res.data);
      });
    };
    const carDetail = (deviceId) => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.o(addCar),
        b: common_vendor.p({
          title: "车辆管理",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true
        }),
        c: common_vendor.f(common_vendor.unref(carList), (item = null, index = null, i0 = null) => {
          return {
            a: common_vendor.t(item.plateNo),
            b: common_vendor.t(item.companyId),
            c: common_vendor.t(item.imei),
            d: index,
            e: common_vendor.o(($event = null) => {
              return carDetail(item.deviceId);
            }, index)
          };
        }),
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4d1d23ef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carList/carList.js.map
