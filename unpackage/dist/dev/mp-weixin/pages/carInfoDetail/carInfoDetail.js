"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_getAdress = require("../../utils/getAdress.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carInfoDetail",
  setup(__props) {
    const deptId = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const deviceId = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(18);
    const datainfo = common_vendor.ref({});
    const address = common_vendor.ref("");
    const currentTime = common_vendor.ref("10s");
    const times = common_vendor.ref([
      [
        new UTSJSONObject({ label: "5s", value: "5" }),
        new UTSJSONObject({ label: "10s", value: "10" }),
        new UTSJSONObject({ label: "20s", value: "20" }),
        new UTSJSONObject({ label: "30s", value: "30" }),
        new UTSJSONObject({ label: "停止刷新", value: "0" })
      ]
    ]);
    const refreshTimer = common_vendor.ref(null);
    const isRefreshing = common_vendor.ref(false);
    const markers = common_vendor.ref([]);
    common_vendor.ref(false);
    common_vendor.ref(new UTSJSONObject({
      deviceName: "",
      carNumber: "",
      deviceSerial: "",
      locationType: "",
      lngLat: "",
      updateTime: "",
      locationTime: "",
      speed: "",
      totalMileage: "",
      address: ""
    }));
    const currentToolItem = common_vendor.ref(0);
    const currentCarInfo = common_vendor.ref(new UTSJSONObject({}));
    common_vendor.watch(currentTime, (newVal) => {
      setupAutoRefresh(newVal);
    });
    const setupAutoRefresh = (intervalValue) => {
      if (refreshTimer.value !== null) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
        isRefreshing.value = false;
      }
      if (intervalValue == "0") {
        isRefreshing.value = false;
        return null;
      }
      const intervalSeconds = parseInt(intervalValue);
      if (intervalSeconds > 0) {
        isRefreshing.value = true;
        const intervalMs = intervalSeconds * 1e3;
        loadData({
          deptId: deptId.value,
          deviceids: imei.value
        });
        refreshTimer.value = setInterval(() => {
          loadData({
            deptId: deptId.value,
            deviceids: imei.value
          });
        }, intervalMs);
      }
    };
    const baseList = common_vendor.ref([
      new UTSJSONObject({
        name: "/static/gjhf.png",
        title: "轨迹回放"
      }),
      new UTSJSONObject({
        name: "/static/clgz.png",
        title: "车辆跟踪"
      }),
      new UTSJSONObject({
        name: "/static/lcjl.png",
        title: "里程记录"
      }),
      new UTSJSONObject({
        name: "/static/tcjl.png",
        title: "停车记录"
      })
      // {
      // 	name: '/static/dzwl.png',
      // 	title: '电子围栏'
      // }
    ]);
    const click = (name = null) => {
      currentToolItem.value = name;
      if (name == 0) {
        common_vendor.index.navigateTo({
          url: "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.plateNo
        });
      }
      if (name == 1) {
        common_vendor.index.navigateTo({
          url: "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.plateNo
        });
      }
      if (name == 2) {
        common_vendor.index.navigateTo({
          url: "/pages/mileageRecord/mileageRecord?imei=" + imei.value
        });
      }
      if (name == 3) {
        common_vendor.index.navigateTo({
          url: "/pages/stopRecord/stopRecord?imei=" + imei.value
        });
      }
    };
    const carDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId.value
      });
    };
    const navTo = () => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:177", address.value);
      common_vendor.index.openLocation({
        latitude: center.latitude,
        longitude: center.longitude,
        name: address.value,
        scale: 18,
        success: () => {
          common_vendor.index.showToast({
            title: "成功调起地图",
            icon: "none"
          });
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "调起地图失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:195", "调起地图失败:", err);
        }
      });
    };
    const loadData = (data) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getDevicePos(data);
        common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:203", "loadData", res);
        res.data.forEach((item = null) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            if (item.imei == imei.value) {
              datainfo.value = item;
              center.latitude = item.latitude;
              center.longitude = item.longitude;
              common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:210", item);
              const addr = yield utils_getAdress.getAddress(item.latitude, item.longitude);
              address.value = addr.result.formatted_address;
              const deviceMarker = createMarker(
                1,
                item.latitude,
                item.longitude,
                "device",
                item.deviceName
                // 使用设备名称作为标题
              );
              markers.value = [deviceMarker];
            }
          });
        });
      });
    };
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:234", "ssss", option);
      deptId.value = option.deptId;
      imei.value = option.imei;
      deviceId.value = option.deviceId;
      const data = new UTSJSONObject({
        deptId: deptId.value,
        deviceids: imei.value
      });
      loadData(data);
      loadDeviceDetail();
    });
    const loadDeviceDetail = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value !== null) {
          const res = yield api_request.getDeviceDetail(deviceId.value);
          common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:250", res.data);
          currentCarInfo.value = res.data;
        } else {
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:253", "设备id获取失败");
        }
      });
    };
    const createMarker = (id, lat, lng, type, title = null) => {
      const marker = new UTSJSONObject(
        {
          id,
          latitude: lat,
          longitude: lng,
          width: 30,
          height: 30,
          callout: new UTSJSONObject({
            content: title || (type == "device" ? "设备位置" : "我的位置"),
            color: "#ffffff",
            fontSize: 14,
            borderRadius: 10,
            bgColor: type == "device" ? "#07C160" : "#007AFF",
            padding: 5,
            display: "ALWAYS"
          })
        }
        // 设置不同图标
      );
      if (type == "device") {
        marker.iconPath = "/static/car.png";
      } else {
        marker.iconPath = "/static/marker.png";
      }
      return marker;
    };
    common_vendor.onHide(() => {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
      isRefreshing.value = false;
    });
    common_vendor.onUnmounted(() => {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o((val = null) => {
          return currentTime.value = val;
        }),
        c: common_vendor.p({
          currentTime: common_vendor.unref(currentTime),
          showTime: true,
          currentCar: common_vendor.unref(currentCarInfo).plateNo,
          times: common_vendor.unref(times),
          carStatus: common_vendor.unref(datainfo).connectionStatus,
          showCar: true
        }),
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: common_vendor.unref(markers),
        h: common_vendor.unref(mapScale),
        i: common_assets._imports_0$2,
        j: common_vendor.o(navTo),
        k: common_vendor.t(common_vendor.unref(imei)),
        l: common_vendor.p({
          name: "arrow-right",
          bold: true,
          size: 25
        }),
        m: common_vendor.t(common_vendor.unref(datainfo).positionUpdateTime),
        n: common_vendor.o(carDetail),
        o: common_vendor.f(common_vendor.unref(baseList), (item = null, index = null, i0 = null) => {
          return {
            a: "6cb34a81-5-" + i0 + "," + ("6cb34a81-4-" + i0),
            b: common_vendor.p({
              customStyle: {
                paddingTop: "40rpx"
              },
              name: item.name,
              size: 56
            }),
            c: common_vendor.t(item.title),
            d: index,
            e: "6cb34a81-4-" + i0 + ",6cb34a81-3"
          };
        }),
        p: common_vendor.o(click),
        q: common_vendor.p({
          col: 4
        }),
        r: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/carInfoDetail/carInfoDetail.js.map
