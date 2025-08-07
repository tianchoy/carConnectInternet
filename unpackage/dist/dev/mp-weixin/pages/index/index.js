"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_amapWx_130 = require("../../utils/amap-wx.130.js");
require("../../api/http.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_custom_navBar_1 + _easycom_indexListMode_1 + _easycom_uv_icon_1 + _easycom_uv_picker_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_indexListMode + _easycom_uv_icon + _easycom_uv_picker)();
}
const gdKey = "e3e773ad74f7ba25f38775c9c8db6474";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const Login = common_vendor.ref(false);
    const address = common_vendor.ref("");
    const myAmapFun = common_vendor.ref(new UTSJSONObject({}));
    const handleCapsule = (type) => {
      if (type == "close") {
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
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
    const currentPickerType = common_vendor.ref("");
    const picker = common_vendor.ref(null);
    const carState = common_vendor.ref([
      [new UTSJSONObject({
        label: "全部状态",
        value: "1"
      }), new UTSJSONObject({
        label: "在线",
        value: "2"
      }), new UTSJSONObject({
        label: "离线",
        value: "3"
      })]
    ]);
    const carGroup = common_vendor.ref([
      [
        new UTSJSONObject({
          label: "全部分组",
          value: "1"
        }),
        new UTSJSONObject({
          label: "分组1",
          value: "2"
        }),
        new UTSJSONObject({
          label: "分组2",
          value: "3"
        })
      ]
    ]);
    const columns = common_vendor.ref([[]]);
    const pickerStateTitle = common_vendor.ref("全部状态");
    const pickerGroupTitle = common_vendor.ref("全部分组");
    const handStatePicker = () => {
      var _a;
      columns.value = carState.value;
      currentPickerType.value = "state";
      (_a = picker.value) === null || _a === void 0 ? null : _a.open();
    };
    const handGroupPicker = () => {
      var _a;
      columns.value = carGroup.value;
      currentPickerType.value = "group";
      (_a = picker.value) === null || _a === void 0 ? null : _a.open();
    };
    const confirm = (e) => {
      const selected = e.value[0];
      if (currentPickerType.value === "state") {
        pickerStateTitle.value = selected.label;
        common_vendor.index.__f__("log", "at pages/index/index.uvue:124", "选择了状态:", selected.value);
      } else if (currentPickerType.value === "group") {
        pickerGroupTitle.value = selected.label;
        common_vendor.index.__f__("log", "at pages/index/index.uvue:127", "选择了分组:", selected.value);
      }
      currentPickerType.value = "";
    };
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar",
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    };
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        myAmapFun.value = new utils_amapWx_130.amapFile.AMapWX(new UTSJSONObject({ key: gdKey }));
        mapCtx = common_vendor.index.createMapContext("myMap", this);
        if (Login.value) {
          getlocation();
          mapCtx.initMarkerCluster(new UTSJSONObject({
            enableDefaultStyle: true,
            zoomOnClick: true,
            gridSize: 10,
            maxZoom: 17,
            minClusterSize: 2,
            complete(res = null) {
              common_vendor.index.__f__("log", "at pages/index/index.uvue:155", "initMarkerCluster", res);
            }
          }));
          mapCtx.on("markerClusterCreate", (e = null) => {
            common_vendor.index.__f__("log", "at pages/index/index.uvue:160", "markerClusterCreate", e);
          });
          addMarkers();
        }
      });
    });
    const getlocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        success: (res) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            center.latitude = res.latitude;
            center.longitude = res.longitude;
            address.value = yield getRegeo(res.latitude, res.longitude);
          });
        }
      }));
    };
    const getRegeo = (latitude, longitude) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
          const res = yield myAmapFun.value.getRegeo(new UTSJSONObject({
            location: `${longitude},${latitude}`
          }));
          return ((_b = (_a = res[0]) === null || _a === void 0 ? null : _a.regeocodeData) === null || _b === void 0 ? null : _b.formatted_address) || "未知位置";
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:186", "逆地理编码失败:", err);
          return "获取位置失败";
        }
      });
    };
    const handleTap = (e = null) => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:192", "e", e);
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail",
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const handleRegionChange = (e = null) => {
      if (e.type == "end")
        ;
    };
    const addMarkers = () => {
      const positions = [
        new UTSJSONObject({
          id: 1,
          latitude: 35.297468099059046,
          longitude: 115.40080913614395,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 4,
          latitude: 35.26338122455396,
          longitude: 115.3737993948281,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 5,
          latitude: 35.24911026114625,
          longitude: 115.37670948421612,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 7,
          latitude: 35.265920623714884,
          longitude: 115.47432047397626,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 8,
          latitude: 35.280857632699494,
          longitude: 115.48226198671648,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 9,
          latitude: 35.2892924000666,
          longitude: 115.47252411687543,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        }),
        new UTSJSONObject({
          id: 11,
          latitude: 35.27709737493474,
          longitude: 115.42029729381204,
          iconPath: "/static/marker.png",
          joinCluster: true,
          width: 40,
          height: 40
        })
      ];
      positions.forEach((p, i) => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          markers.value.push(Object.assign(new UTSJSONObject({}), new UTSJSONObject({
            id: i + 1,
            iconPath: "/static/marker.png",
            width: 50,
            height: 50,
            joinCluster: true,
            callout: new UTSJSONObject({
              padding: 5,
              borderWidth: 1,
              borderRadius: 10,
              bgColor: "#ffffff",
              content: yield getRegeo(p.latitude, p.longitude),
              display: "ALWAYS"
            })
          }), p));
        });
      });
      mapCtx.addMarkers(new UTSJSONObject({
        markers: markers.value,
        clear: false,
        complete(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:353", "addMarkers", res);
        }
      }));
    };
    common_vendor.onLoad(() => {
    });
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
        c: showMap.value
      }), showMap.value ? new UTSJSONObject({
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: markers.value,
        h: mapScale.value,
        i: common_vendor.o(handleRegionChange),
        j: common_vendor.o(handleTap)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        k: common_assets._imports_0,
        l: common_vendor.o(addCar),
        m: showMap.value ? "/static/list.png" : "/static/map.png",
        n: common_vendor.o(toggleMapMode),
        o: showMap.value
      }), showMap.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        p: common_vendor.t(pickerStateTitle.value),
        q: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        r: common_vendor.o(handStatePicker),
        s: !showMap.value
      }), !showMap.value ? new UTSJSONObject({
        t: common_vendor.t(pickerGroupTitle.value),
        v: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        w: common_vendor.o(handGroupPicker)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        x: common_vendor.sr(picker, "a4fca7fa-4", new UTSJSONObject({
          "k": "picker"
        })),
        y: common_vendor.o(confirm),
        z: common_vendor.p(new UTSJSONObject({
          columns: columns.value,
          keyName: "label"
        })),
        A: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
