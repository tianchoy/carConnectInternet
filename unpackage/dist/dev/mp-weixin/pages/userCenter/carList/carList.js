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
    const carList = common_vendor.ref([]);
    const currPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalPage = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    const resetData = () => {
      carList.value = [];
      currPage.value = 1;
      totalPage.value = 0;
      hasMore.value = true;
    };
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/userCenter/carList/carList.uvue:58", currPage.value, totalPage.value);
        if (loading.value || !hasMore.value)
          return Promise.resolve(null);
        loading.value = true;
        try {
          const data = new common_vendor.UTSJSONObject({
            page: currPage.value,
            pageSize: pageSize.value
          });
          const res = yield api_request.getUserDeviceList(data);
          if (res.code == 0) {
            totalPage.value = res.data.totalPage;
            if (currPage.value == 1) {
              carList.value = res.data.list;
            } else {
              carList.value = [...carList.value, ...res.data.list];
            }
            hasMore.value = currPage.value < totalPage.value;
            if (hasMore.value) {
              currPage.value++;
            }
          } else {
            common_vendor.index.showToast({
              title: res.msg || "加载失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/userCenter/carList/carList.uvue:94", "加载车辆列表失败:", error);
          common_vendor.index.showToast({
            title: "加载失败，请重试",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    common_vendor.onShow(() => {
      resetData();
      loadCarListData();
    });
    common_vendor.onReachBottom(() => {
      loadCarListData();
    });
    const carDetail = (deviceId) => {
      common_vendor.index.navigateTo({
        url: `/pages/userCenter/carDetail/carDetail?deviceId=${deviceId}`
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.o(addCar, "a5"),
        b: common_vendor.p({
          title: "车辆管理",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          isShowStyle: true,
          class: "data-v-4d1d23ef"
        }),
        c: common_vendor.f(common_vendor.unref(carList), (item, index, i0) => {
          return {
            a: common_vendor.t(item.getString("deviceName", "")),
            b: common_vendor.t(item.getString("plateNo", "")),
            c: common_vendor.t(item.getString("imei", "")),
            d: index,
            e: common_vendor.o(($event) => {
              return carDetail(item.getString("deviceId", ""));
            }, index)
          };
        }),
        d: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        e: !common_vendor.unref(hasMore) && !common_vendor.unref(loading)
      }, !common_vendor.unref(hasMore) && !common_vendor.unref(loading) ? {} : {}, {
        f: `${_ctx.u_s_b_h}px`,
        g: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4d1d23ef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carList/carList.js.map
