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
  __name: "payDeviceList",
  setup(__props) {
    const deviceList = common_vendor.ref([]);
    const currPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalPage = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const needRefresh = common_vendor.ref(false);
    common_vendor.onShow(() => {
      if (needRefresh.value || deviceList.value.length === 0) {
        resetData();
        loadPayDeviceListData();
        needRefresh.value = false;
      }
    });
    const resetData = () => {
      deviceList.value = [];
      currPage.value = 1;
      totalPage.value = 0;
      hasMore.value = true;
    };
    const loadPayDeviceListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
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
              deviceList.value = res.data.list;
            } else {
              deviceList.value = [...deviceList.value, ...res.data.list];
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
          console.error("加载车辆列表失败:", error);
          common_vendor.index.showToast({
            title: "加载失败，请重试",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    common_vendor.onReachBottom(() => {
      loadPayDeviceListData();
    });
    const pay = (iccid, simMerchant) => {
      if (simMerchant.toLowerCase() == "zddx") {
        iccid = iccid.substring(0, iccid.length - 1);
      }
      console.log(iccid);
      needRefresh.value = true;
      common_vendor.wx$1.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          console.log("打开小程序成功", res);
        },
        fail(res = null) {
          console.log("打开小程序失败", res);
          needRefresh.value = false;
          common_vendor.index.showToast({
            title: "打开支付页面失败",
            icon: "none"
          });
        }
      }));
    };
    common_vendor.onPullDownRefresh(() => {
      resetData();
      loadPayDeviceListData().finally(() => {
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success"
        });
      });
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: `${_ctx.u_s_b_h}px`,
        b: common_vendor.p({
          title: "续费管理",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          isShowStyle: true,
          class: "data-v-21a71356",
          style: common_vendor.normalizeStyle({
            "--status-bar-height": `${_ctx.u_s_b_h}px`
          })
        }),
        c: common_vendor.f(common_vendor.unref(deviceList), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.deviceName),
            b: item.iccid
          }, item.iccid ? {
            c: common_vendor.t(item.iccid)
          } : {}, {
            d: item.imei && item.imei != ""
          }, item.imei && item.imei != "" ? {
            e: common_vendor.t(item.imei)
          } : {}, {
            f: common_vendor.o(($event) => {
              return pay(item.iccid, item.simMerchant);
            }, index),
            g: index
          });
        }),
        d: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        e: !common_vendor.unref(hasMore) && !common_vendor.unref(loading) && common_vendor.unref(deviceList).length > 0
      }, !common_vendor.unref(hasMore) && !common_vendor.unref(loading) && common_vendor.unref(deviceList).length > 0 ? {} : {}, {
        f: !common_vendor.unref(loading) && common_vendor.unref(deviceList).length === 0
      }, !common_vendor.unref(loading) && common_vendor.unref(deviceList).length === 0 ? {} : {}, {
        g: `${_ctx.u_s_b_h}px`
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-21a71356"]]);
wx.createPage(MiniProgramPage);
