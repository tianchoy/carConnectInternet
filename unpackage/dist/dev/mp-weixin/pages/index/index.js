"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_amapWx_130 = require("../../utils/amap-wx.130.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_deviceInfoComponent_1 = common_vendor.resolveComponent("deviceInfoComponent");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  (_easycom_custom_navBar_1 + _easycom_deviceInfoComponent_1 + _easycom_indexListMode_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_deviceInfoComponent = () => "../../components/deviceInfoComponent/deviceInfoComponent.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_deviceInfoComponent + _easycom_indexListMode)();
}
const gdKey = "e3e773ad74f7ba25f38775c9c8db6474";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "index",
  setup(__props) {
    common_vendor.ref(88);
    const handleCapsule = (type = null) => {
      if (type === "close") {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.showToast({ title: "菜单点击", icon: "none" });
      }
    };
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(12);
    const showMap = common_vendor.ref(true);
    const address = common_vendor.ref("");
    const myAmapFun = common_vendor.ref();
    const markers = common_vendor.ref([]);
    const showDevicePopup = common_vendor.ref(false);
    const currentDeviceInfo = common_vendor.ref(new UTSJSONObject({
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
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        myAmapFun.value = new utils_amapWx_130.amapFile.AMapWX(new UTSJSONObject({ key: gdKey }));
        yield getlocation();
      });
    });
    const getlocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:80", "当前坐标点：", res);
          center.latitude = res.latitude;
          center.longitude = res.longitude;
          getRegeo(res.latitude, res.longitude);
        }
      }));
    };
    const getRegeo = (latitude = null, longitude = null) => {
      myAmapFun.value.getRegeo(new UTSJSONObject({
        location: `${longitude},${latitude}`,
        success: (data = null) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:92", "获取地址信息:", data);
          if (data.length > 0) {
            address.value = data[0].regeocodeData.formatted_address;
            common_vendor.index.__f__("log", "at pages/index/index.uvue:95", "地址信息:", address.value);
            markers.value = [
              new UTSJSONObject({
                id: 1,
                latitude,
                longitude,
                iconPath: "/static/marker.png",
                width: 40,
                height: 40,
                callout: new UTSJSONObject({
                  content: address.value,
                  borderRadius: 5,
                  padding: 5,
                  display: "ALWAYS"
                })
              })
            ];
          } else {
            common_vendor.index.showToast({ title: "获取地址失败", icon: "none" });
          }
        },
        fail: (err = null) => {
          common_vendor.index.showToast({
            title: err.errMsg,
            icon: "none"
          });
        }
      }));
    };
    const closeDevicePopup = () => {
      showDevicePopup.value = false;
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.o(handleCapsule),
        b: common_vendor.p(new UTSJSONObject({
          title: "首页",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true
        })),
        c: common_vendor.unref(showMap)
      }), common_vendor.unref(showMap) ? new UTSJSONObject({
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: common_vendor.unref(markers),
        h: common_vendor.unref(mapScale),
        i: common_vendor.o(closeDevicePopup),
        j: common_vendor.p(new UTSJSONObject({
          ["show-popup"]: common_vendor.unref(showDevicePopup),
          ["device-info"]: common_vendor.unref(currentDeviceInfo)
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        k: common_vendor.unref(showMap) ? "/static/list.png" : "/static/map.png",
        l: common_vendor.o(toggleMapMode),
        m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
