"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_uv_notice_bar_1 = common_vendor.resolveComponent("uv-notice-bar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_custom_navBar_1 + _easycom_indexListMode_1 + _easycom_uv_notice_bar_1 + _easycom_uv_icon_1 + _easycom_uv_picker_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_uv_notice_bar = () => "../../uni_modules/uv-notice-bar/components/uv-notice-bar/uv-notice-bar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_indexListMode + _easycom_uv_notice_bar + _easycom_uv_icon + _easycom_uv_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const Login = common_vendor.ref(false);
    const mapScale = common_vendor.ref(4);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
    const currentPickerType = common_vendor.ref("");
    const picker = common_vendor.ref(null);
    const iconColor = common_vendor.ref("#e6813e");
    const noticeText = common_vendor.ref(["本页面仅供展示车辆", "如使用车辆实时位置功能", "请转至车辆详情页面"]);
    const userLocation = common_vendor.ref(new UTSJSONObject({
      latitude: 0,
      longitude: 0
    }));
    const carState = common_vendor.ref([
      [new UTSJSONObject({
        name: "全部状态",
        value: "0"
      }), new UTSJSONObject({
        name: "在线",
        value: "1"
      }), new UTSJSONObject({
        name: "离线",
        value: "2"
      })]
    ]);
    const carGroup = common_vendor.ref([]);
    const columns = common_vendor.ref([[]]);
    const pickerStateTitle = common_vendor.ref("全部状态");
    const pickerGroupTitle = common_vendor.ref("全部分组");
    const originalDeviceList = common_vendor.ref([]);
    const currentGroupId = common_vendor.ref("");
    const filteredDevices = common_vendor.computed(() => {
      if (!Array.isArray(originalDeviceList.value))
        return [];
      let result = [...originalDeviceList.value];
      if (pickerStateTitle.value == "在线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.connectionStatus) == "online";
        });
      } else if (pickerStateTitle.value === "离线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.connectionStatus) == "offline";
        });
      }
      return result;
    });
    const totalCount = common_vendor.computed(() => {
      return originalDeviceList.value.length;
    });
    const onlineCount = common_vendor.computed(() => {
      return originalDeviceList.value.filter((d = null) => {
        return (d === null || d === void 0 ? null : d.connectionStatus) == "online";
      }).length;
    });
    const offlineCount = common_vendor.computed(() => {
      return totalCount.value - onlineCount.value;
    });
    common_vendor.watch([filteredDevices, showMap], (_a) => {
      var _b = common_vendor.__read(_a, 2), devices = _b[0], isMapVisible = _b[1];
      if (isMapVisible) {
        updateMarkers(devices);
      }
    });
    const getLocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        type: "wgs84",
        success: (res) => {
          console.log("获取位置成功:", res);
          userLocation.value.latitude = res.latitude;
          userLocation.value.longitude = res.longitude;
        },
        fail: (err) => {
          console.log("获取位置失败:", err);
        }
      }));
    };
    const mapPlus = () => {
      if (mapScale.value < 20) {
        mapScale.value += 1;
      }
    };
    const mapMin = () => {
      if (mapScale.value > 3) {
        mapScale.value -= 1;
      }
    };
    const subMsg = () => {
      console.log("订阅消息");
      common_vendor.index.requestSubscribeMessage(new UTSJSONObject({
        tmplIds: ["VRR0UEO9VJOLs0MHlU0OilqX6MVFDwH3_3gz3Oc0NIc"],
        success: (res = null) => {
          console.log("订阅成功:", res);
        },
        fail: (err = null) => {
          console.log("订阅失败:", err);
        }
      }));
    };
    const goToList = (status) => {
      showMap.value = false;
      switch (status) {
        case "all":
          pickerStateTitle.value = "全部状态";
          break;
        case "online":
          pickerStateTitle.value = "在线";
          break;
        case "offline":
          pickerStateTitle.value = "离线";
          break;
      }
    };
    const unbindDevice = (imei) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.delDevice(imei);
        if (res.code == 0) {
          common_vendor.index.showToast({
            title: "解绑成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "解绑失败",
            icon: "error"
          });
        }
        yield loadUserDeviceList(currentGroupId.value);
      });
    };
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
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const selected = e.value[0];
        if (currentPickerType.value == "state") {
          pickerStateTitle.value = selected.name;
        } else if (currentPickerType.value == "group") {
          pickerGroupTitle.value = selected.name;
          currentGroupId.value = selected.id;
          yield loadUserDeviceList(selected.id);
        }
        currentPickerType.value = "";
      });
    };
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const handleTap = (e = null) => {
      const markerId = e.detail.markerId;
      const selectedDevice = UTS.arrayFind(originalDeviceList.value, (device = null) => {
        return device.deviceId == markerId;
      });
      if (selectedDevice) {
        common_vendor.index.navigateTo({
          url: `/pages/carInfoDetail/carInfoDetail?imei=${selectedDevice.imei}&deptId=${selectedDevice.companyId}&deviceId=${selectedDevice.deviceId}`
        });
      } else {
        console.warn("未找到对应的设备信息", markerId);
      }
    };
    const updateMarkers = (devices = null) => {
      if (!Array.isArray(devices)) {
        devices = [];
      }
      markers.value = devices.map((device = null, index = null) => {
        if (!device || typeof device !== "object") {
          return null;
        }
        const lat = Number(device.latitude);
        const lng = Number(device.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }
        const iconPath = utils_cars.getDeviceIcon(device.connectionStatus, device.carType);
        let markerId;
        if (device.deviceId && !isNaN(Number(device.deviceId))) {
          markerId = Number(device.deviceId);
        } else {
          markerId = index + 1;
        }
        return new UTSJSONObject({
          id: markerId,
          latitude: lat,
          longitude: lng,
          iconPath,
          width: 30,
          height: 30,
          callout: new UTSJSONObject({
            content: device.deviceName || device.plateNo || "设备",
            display: "ALWAYS",
            padding: 8,
            borderRadius: 8,
            bgColor: "#ffffff"
          }),
          joinCluster: true,
          anchor: new UTSJSONObject({ x: 0.5, y: 0.5 })
        });
      }).filter((marker = null) => {
        return marker !== null;
      });
    };
    const loadGroupData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const groupRes = yield api_request.getUserGroupList();
          if ((groupRes === null || groupRes === void 0 ? null : groupRes.code) !== 0 || !Array.isArray(groupRes.data)) {
            throw new Error("获取分组数据失败");
          }
          const allGroupOption = new UTSJSONObject({
            name: "全部分组",
            value: "all",
            id: "all"
          });
          const formattedData = groupRes.data.map((item = null) => {
            return new UTSJSONObject({
              name: item.name || "未命名分组",
              value: item.id || "",
              id: item.id || ""
            });
          });
          formattedData.unshift(allGroupOption);
          carGroup.value = [formattedData];
          pickerGroupTitle.value = "全部分组";
          currentGroupId.value = "all";
        } catch (err) {
          console.error("加载分组数据失败:", err);
          common_vendor.index.showToast({
            title: "加载分组失败",
            icon: "none"
          });
        }
      });
    };
    const refresh = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield loadUserDeviceList();
      });
    };
    const loadUserDeviceList = (groupId = "") => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          let params = new UTSJSONObject(
            {
              pageSize: 1e3
            }
            // 如果不是全部分组，添加分组ID参数
          );
          if (groupId && groupId !== "all") {
            params = new UTSJSONObject({ groupId });
          }
          const res = yield api_request.getUserDeviceList(params);
          let deviceList = [];
          if (res === null || res === void 0 ? null : res.data) {
            if (Array.isArray(res.data)) {
              deviceList = res.data;
            } else if (Array.isArray(res.data.list)) {
              deviceList = res.data.list;
            } else if (Array.isArray(res.data.devices)) {
              deviceList = res.data.devices;
            } else if (Array.isArray(res.data.items)) {
              deviceList = res.data.items;
            } else if (res.data.totalCount !== void 0) {
              deviceList = [];
            }
          }
          originalDeviceList.value = utils_coordTransform.CoordTransform.batchConvertCoordinates(deviceList, "tencent");
        } catch (err) {
          console.error("获取设备列表失败:", err);
          common_vendor.index.showToast({
            title: "获取设备列表失败",
            icon: "none"
          });
        }
      });
    };
    const refreshDeviceList = () => {
      console.log("收到刷新事件，重新加载设备列表");
      loadUserDeviceList();
    };
    const getUserIn = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUserInfo();
          if ((res === null || res === void 0 ? null : res.code) === 0) {
            common_vendor.index.setStorageSync("userType", res.data.type);
          }
        } catch (err) {
          console.error("获取用户信息失败:", err);
        }
      });
    };
    common_vendor.onShow(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const token = common_vendor.index.getStorageSync("token");
        if (token) {
          common_vendor.index.$on("refreshDeviceList", refreshDeviceList);
          const needRefresh = common_vendor.index.getStorageSync("needRefreshHome");
          if (needRefresh) {
            yield loadUserDeviceList(currentGroupId.value);
            common_vendor.index.removeStorageSync("needRefreshHome");
          }
        }
      });
    });
    common_vendor.onHide(() => {
      common_vendor.index.$off("refreshDeviceList", refreshDeviceList);
    });
    common_vendor.onLoad(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          Login.value = false;
        } else {
          Login.value = true;
          getLocation();
          yield loadGroupData();
          yield loadUserDeviceList();
          yield getUserIn();
          mapCtx = common_vendor.index.createMapContext("myMap", this);
          if (mapCtx && mapCtx.initMarkerCluster) {
            mapCtx.initMarkerCluster(new UTSJSONObject({
              enableDefaultStyle: true,
              zoomOnClick: true,
              gridSize: 60,
              complete: () => {
                console.log("聚合初始化完成");
              }
            }));
          }
        }
      });
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("refreshDeviceList", refreshDeviceList);
    });
    const gotoLogin = () => {
      common_vendor.index.redirectTo({ url: "/pages/login/login" });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.o(subMsg),
        b: common_vendor.p({
          title: "首页",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          Icon: "bell",
          iconColor: iconColor.value
        }),
        c: showMap.value
      }, showMap.value ? {
        d: common_vendor.sei("myMap", "map"),
        e: markers.value,
        f: mapScale.value,
        g: common_vendor.o(handleTap),
        h: userLocation.value.latitude,
        i: userLocation.value.longitude
      } : {
        j: common_vendor.o(unbindDevice),
        k: common_vendor.p({
          lists: filteredDevices.value
        })
      }, {
        l: Login.value
      }, Login.value ? {
        m: common_vendor.p({
          text: noticeText.value,
          direction: "column",
          fontSize: "40rpx",
          mode: "closable"
        })
      } : {}, {
        n: showMap.value
      }, showMap.value ? {
        o: common_vendor.p({
          name: "plus",
          size: "19"
        }),
        p: common_vendor.o(mapPlus),
        q: common_vendor.p({
          name: "minus",
          size: "19"
        }),
        r: common_vendor.o(mapMin)
      } : {}, {
        s: !Login.value
      }, !Login.value ? {
        t: common_vendor.o(gotoLogin)
      } : {}, {
        v: Login.value
      }, Login.value ? {
        w: common_vendor.o(refresh)
      } : {}, {
        x: Login.value
      }, Login.value ? {
        y: common_vendor.o(addCar)
      } : {}, {
        z: common_vendor.t(showMap.value ? "查看车辆" : "返回总览"),
        A: common_vendor.o(toggleMapMode),
        B: showMap.value
      }, showMap.value ? {
        C: common_vendor.t(totalCount.value),
        D: common_vendor.o(($event) => {
          return goToList("all");
        }),
        E: common_vendor.t(onlineCount.value),
        F: common_vendor.o(($event) => {
          return goToList("online");
        }),
        G: common_vendor.t(offlineCount.value),
        H: common_vendor.o(($event) => {
          return goToList("offline");
        })
      } : {}, {
        I: common_vendor.t(pickerStateTitle.value),
        J: common_vendor.p({
          name: "arrow-down",
          color: "#fff"
        }),
        K: common_vendor.o(handStatePicker),
        L: Login.value && !showMap.value
      }, Login.value && !showMap.value ? {
        M: common_vendor.t(pickerGroupTitle.value),
        N: common_vendor.p({
          name: "arrow-down",
          color: "#fff"
        }),
        O: common_vendor.o(handGroupPicker)
      } : {}, {
        P: common_vendor.sr(picker, "a4fca7fa-7", {
          "k": "picker"
        }),
        Q: common_vendor.o(confirm),
        R: common_vendor.p({
          columns: columns.value,
          keyName: "name"
        }),
        S: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
