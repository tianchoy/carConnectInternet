"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_getAdress = require("../../utils/getAdress.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_grid_1 = common_vendor.resolveComponent("i-grid");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_modal_1 = common_vendor.resolveComponent("i-modal");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_grid_1 + _easycom_i_input_1 + _easycom_i_modal_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_grid = () => "../../uni_modules/i-ui-x/components/i-grid/i-grid.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_modal = () => "../../uni_modules/i-ui-x/components/i-modal/i-modal.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_grid + _easycom_i_input + _easycom_i_modal + _easycom_app_toast)();
}
class MapCenter extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "MapCenter"
    };
  }
  constructor(options, metadata = MapCenter.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
class SignalDetail extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          experience: { type: String, optional: false },
          quality: { type: String, optional: false },
          color: { type: String, optional: false },
          level: { type: Number, optional: false }
        };
      },
      name: "SignalDetail"
    };
  }
  constructor(options, metadata = SignalDetail.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.experience = this.__props__.experience;
    this.quality = this.__props__.quality;
    this.color = this.__props__.color;
    this.level = this.__props__.level;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carInfoDetail",
  setup(__props) {
    const deptId = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const deviceId = common_vendor.ref("");
    const center = common_vendor.reactive(new MapCenter({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const datainfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const address = common_vendor.ref("");
    const currentTime = common_vendor.ref("5s");
    const onCurrentTimeChange = (value) => {
      currentTime.value = value;
    };
    const times = common_vendor.ref([
      [
        new common_vendor.UTSJSONObject({ label: "5s", value: "5" }),
        new common_vendor.UTSJSONObject({ label: "10s", value: "10" }),
        new common_vendor.UTSJSONObject({ label: "20s", value: "20" }),
        new common_vendor.UTSJSONObject({ label: "30s", value: "30" }),
        new common_vendor.UTSJSONObject({ label: "停止刷新", value: "0" })
      ]
    ]);
    const refreshTimer = common_vendor.ref(null);
    const isRefreshing = common_vendor.ref(false);
    const popupRef = common_vendor.ref(false);
    const psw = common_vendor.ref("");
    const currentOperation = common_vendor.ref(0);
    const modalTitle = common_vendor.ref("验证密码");
    const userType = common_vendor.ref("");
    const filterNonLatin = (value) => {
      psw.value = value.replace(/[^\x00-\x7F]/g, "");
    };
    const markers = common_vendor.ref([]);
    common_vendor.ref(false);
    common_vendor.ref(new common_vendor.UTSJSONObject({
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
    const currentCarInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const signalRssi = common_vendor.ref(null);
    const signalSat = common_vendor.ref(null);
    const carVoltage = common_vendor.computed(() => {
      return currentCarInfo.value["voltage"];
    });
    const batteryPercent = common_vendor.computed(() => {
      return datainfo.value["batteryPercent"];
    });
    const getBatteryColor = (batteryPercent2 = null) => {
      if (batteryPercent2 == null || batteryPercent2 == "")
        return "#c9c9c9";
      const batteryValue = parseFloat(batteryPercent2.toString());
      if (batteryValue >= 70) {
        return "#07C160";
      } else if (batteryValue >= 30) {
        return "#FF9C19";
      } else if (batteryValue >= 10) {
        return "#FF6B00";
      } else {
        return "#FF0000";
      }
    };
    function getSignalDetail(rssi = null) {
      if (rssi == null || rssi == "") {
        return new SignalDetail({
          experience: "无信号",
          quality: "无服务",
          color: "#999",
          level: 0
        });
      }
      const signalValue = parseFloat(rssi.toString());
      if (isNaN(signalValue)) {
        return new SignalDetail({
          experience: "信号数据无效",
          quality: "无服务",
          color: "#999",
          level: 0
        });
      }
      if (signalValue >= 26) {
        return new SignalDetail({
          experience: "极好",
          quality: "极强",
          color: "#07C160",
          level: 5
        });
      } else if (signalValue >= 20) {
        return new SignalDetail({
          experience: "良好",
          quality: "强",
          color: "#52c41a",
          level: 4
        });
      } else if (signalValue >= 15) {
        return new SignalDetail({
          experience: "一般",
          quality: "一般",
          color: "#faad14",
          level: 3
        });
      } else if (signalValue >= 10) {
        return new SignalDetail({
          experience: "差",
          quality: "较弱",
          color: "#fa8c16",
          level: 2
        });
      } else if (signalValue >= 1) {
        return new SignalDetail({
          experience: "非常差",
          quality: "微弱",
          color: "#f5222d",
          level: 1
        });
      } else {
        return new SignalDetail({
          experience: "无信号",
          quality: "无服务",
          color: "#999",
          level: 0
        });
      }
    }
    const getMobileSignalBarClass = (barIndex, rssi = null) => {
      if (rssi == null || rssi == "") {
        return "bar-off";
      }
      const signalValue = parseFloat(rssi.toString());
      if (isNaN(signalValue))
        return "bar-off";
      const signalDetail = getSignalDetail(signalValue);
      const level = signalDetail.level;
      return barIndex < level ? "bar-active" : "bar-off";
    };
    const createMarker = (id, lat, lng, type, title = null) => {
      const connectionStatus = datainfo.value["connectionStatus"];
      const carType = currentCarInfo.value["carType"];
      const marker = {
        id,
        latitude: lat,
        longitude: lng,
        width: 25,
        height: 25,
        iconPath: utils_cars.getDeviceIcon(connectionStatus !== null && connectionStatus !== void 0 ? connectionStatus : "", carType !== null && carType !== void 0 ? carType : ""),
        callout: new common_vendor.UTSJSONObject({
          content: title || "爱车位置",
          color: connectionStatus == "online" ? "#fff" : "#666",
          borderRadius: 10,
          bgColor: connectionStatus == "online" ? "#07C160" : "#ccc",
          padding: 5,
          display: "ALWAYS"
        })
      };
      return marker;
    };
    const delay = (ms) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };
    const loadData = (data, retryCount) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        signalRssi.value = null;
        signalSat.value = null;
        let retry = retryCount;
        const tryLoad = (attempt) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            try {
              const res = yield api_request.getDevicePos(data);
              if (!res || !res.data || res.data.length == 0) {
                throw new Error("返回数据为空");
              }
              let foundDevice = false;
              try {
                for (var _b = common_vendor.__values(res.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var item = _c.value;
                  const itemImei = item.getString("imei", "");
                  if (itemImei != null && itemImei == imei.value) {
                    foundDevice = true;
                    datainfo.value = item;
                    const attribute = item["attribute"];
                    signalRssi.value = attribute != null ? attribute["rssi"] : null;
                    signalSat.value = attribute != null ? attribute["sat"] : null;
                    const latitude = item.getNumber("latitude", 0);
                    const longitude = item.getNumber("longitude", 0);
                    if (latitude == null || longitude == null || latitude.toString().length == 0 || longitude.toString().length == 0) {
                      common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:357", "位置信息缺失", item);
                      utils_toast.showAppToast({
                        title: "位置信息缺失",
                        icon: "none"
                      });
                      return false;
                    }
                    const lat = parseFloat(latitude.toString());
                    const lng = parseFloat(longitude.toString());
                    if (isNaN(lat) || isNaN(lng)) {
                      common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:370", "经纬度格式错误", latitude, longitude);
                      return false;
                    }
                    let convertedLat = lat;
                    let convertedLng = lng;
                    try {
                      const coord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
                      convertedLat = coord.lat;
                      convertedLng = coord.lng;
                    } catch (transformError) {
                      common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:382", "坐标转换失败:", transformError);
                    }
                    center.latitude = convertedLat;
                    center.longitude = convertedLng;
                    yield delay(50);
                    const deviceMarker = createMarker(1, convertedLat, convertedLng, "device", currentCarInfo.value["deviceName"]);
                    markers.value = [];
                    yield delay(50);
                    markers.value = [deviceMarker];
                    const connectionStatus = item["connectionStatus"];
                    if (connectionStatus != "online" && refreshTimer.value !== null) {
                      const timer = refreshTimer.value;
                      if (timer !== null) {
                        clearInterval(timer);
                      }
                      refreshTimer.value = null;
                      isRefreshing.value = false;
                      utils_toast.showAppToast({
                        title: "设备已离线，停止自动刷新",
                        icon: "none"
                      });
                    }
                    if (signalRssi.value != null) {
                      const signalExp = getSignalDetail(signalRssi.value).experience;
                      if (signalExp === "差" || signalExp === "非常差" || signalExp === "无信号") {
                        common_vendor.index.__f__("warn", "at pages/carInfoDetail/carInfoDetail.uvue:424", `设备 ${imei.value} 信号较弱: ${signalRssi.value}dBm`);
                      }
                    }
                  }
                }
              } catch (e_1_1) {
                e_1 = { error: e_1_1 };
              } finally {
                try {
                  if (_c && !_c.done && (_a = _b.return))
                    _a.call(_b);
                } finally {
                  if (e_1)
                    throw e_1.error;
                }
              }
              if (!foundDevice) {
                throw new Error("未找到对应的设备数据");
              }
              return true;
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:438", `第${attempt}次加载设备数据失败:`, error);
              if (attempt < retry) {
                const delayMs = Math.pow(2, attempt) * 1e3;
                common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:444", `等待${delayMs / 1e3}秒后重试...`);
                yield delay(delayMs);
                return false;
              } else {
                utils_toast.showAppToast({
                  title: "数据加载失败，请稍后重试",
                  icon: "none",
                  duration: 2e3
                });
                if (datainfo.value.connectionStatus == "online" && refreshTimer.value !== null) {
                  const timer = refreshTimer.value;
                  if (timer !== null) {
                    clearInterval(timer);
                  }
                  refreshTimer.value = null;
                  isRefreshing.value = false;
                  utils_toast.showAppToast({
                    title: "数据加载失败，停止自动刷新",
                    icon: "none"
                  });
                }
                return false;
              }
            }
          });
        };
        return tryLoad(1);
      });
    };
    const setupAutoRefresh = (intervalValue) => {
      if (refreshTimer.value !== null) {
        const timer = refreshTimer.value;
        if (timer !== null) {
          clearInterval(timer);
        }
        refreshTimer.value = null;
        isRefreshing.value = false;
      }
      if (intervalValue == "0") {
        isRefreshing.value = false;
        return null;
      }
      if (datainfo.value.connectionStatus != "online") {
        isRefreshing.value = false;
        return null;
      }
      const intervalSeconds = parseInt(intervalValue);
      if (intervalSeconds > 0) {
        isRefreshing.value = true;
        const intervalMs = intervalSeconds * 1e3;
        loadData(new common_vendor.UTSJSONObject({
          deptId: deptId.value,
          deviceids: imei.value
        }), 3);
        refreshTimer.value = setInterval(() => {
          loadData(new common_vendor.UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          }), 3);
        }, intervalMs);
      }
    };
    common_vendor.watch(currentTime, (newVal) => {
      setupAutoRefresh(newVal);
    });
    const stopAutoRefresh = () => {
      if (refreshTimer.value !== null) {
        const timer = refreshTimer.value;
        if (timer !== null) {
          clearInterval(timer);
        }
        refreshTimer.value = null;
        isRefreshing.value = false;
      }
    };
    const baseList = common_vendor.computed(() => {
      const list = [new common_vendor.UTSJSONObject({
        image: "/static/gjhf.png",
        text: "轨迹回放"
      }), new common_vendor.UTSJSONObject({
        image: "/static/clgz.png",
        text: "车辆跟踪"
      }), new common_vendor.UTSJSONObject({
        image: "/static/lcjl.png",
        text: "里程记录"
      }), new common_vendor.UTSJSONObject({
        image: "/static/tcjl.png",
        text: "停车记录"
      }), new common_vendor.UTSJSONObject({
        image: "/static/dzwl.png",
        text: "电子围栏"
      }), new common_vendor.UTSJSONObject({
        image: "/static/navto.png",
        text: "一键寻车"
      }), new common_vendor.UTSJSONObject({
        image: "/static/power.png",
        text: "恢复油电"
      }), new common_vendor.UTSJSONObject({
        image: "/static/offpower.png",
        text: "断开油电"
      })];
      const productId = currentCarInfo.value.productId;
      if (productId === "product-1141811865601576960" || productId === "product-1183161303028600832") {
        list.push(new common_vendor.UTSJSONObject({
          image: "/static/cmd.png",
          text: "发送指令"
        }));
      }
      return list;
    });
    function executeOperation(operationType) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        let predictCmdId = 0;
        let type = 0;
        if (operationType == 1) {
          predictCmdId = 2;
          type = 2;
        } else if (operationType == 2) {
          predictCmdId = 1;
          type = 1;
        } else {
          utils_toast.showAppToast({
            title: "操作类型错误",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
            title: "执行中...",
            mask: true
          }));
          const res = yield api_request.sendCommand(new common_vendor.UTSJSONObject({
            imei: imei.value,
            password: userType.value == "1" ? psw.value : "",
            params: ["1111"],
            predictCmdId,
            type
          }));
          common_vendor.index.hideLoading();
          if (res.code == 0) {
            utils_toast.showAppToast({
              title: operationType == 1 ? "恢复油电成功" : "断开油电成功",
              icon: "success"
            });
            psw.value = "";
          } else {
            utils_toast.showAppToast({
              title: res.msg.length > 0 ? res.msg : "操作失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:684", "操作失败:", error);
          utils_toast.showAppToast({
            title: "操作失败，请重试",
            icon: "none"
          });
        }
      });
    }
    const confirm = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (userType.value == "1" && psw.value == "") {
          utils_toast.showAppToast({
            title: "请输入密码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        executeOperation(currentOperation.value);
      });
    };
    const carDetail = () => {
      stopAutoRefresh();
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId.value
      });
    };
    const refreshAdress = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const addr = yield utils_getAdress.getAddress(center.latitude, center.longitude);
          address.value = addr.result.formatted_address;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:720", "获取地址信息失败:", error);
        }
      });
    };
    function navTo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!address.value) {
          yield refreshAdress();
        }
        common_vendor.index.openLocation({
          latitude: center.latitude,
          longitude: center.longitude,
          name: address.value || "当前位置",
          scale: 18,
          success: () => {
            utils_toast.showAppToast({
              title: "成功调起地图",
              icon: "none"
            });
          },
          fail: (err) => {
            utils_toast.showAppToast({
              title: "调起地图失败",
              icon: "none"
            });
            common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:745", "调起地图失败:", err);
          }
        });
      });
    }
    const handleGridClick = (event = null) => {
      const name = event;
      const itemTo = name.text;
      if (itemTo == "轨迹回放") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType + "&lat=" + datainfo.value.latitude + "&lng=" + datainfo.value.longitude
        });
      }
      if (itemTo == "车辆跟踪") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&deptId=" + deptId.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType
        });
      }
      if (itemTo == "里程记录") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/mileageRecord/mileageRecord?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType
        });
      }
      if (itemTo == "停车记录") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/stopRecord/stopRecord?imei=" + imei.value + "&deptId=" + deptId.value
        });
      }
      if (itemTo == "恢复油电") {
        if (userType.value == "1") {
          psw.value = "";
          currentOperation.value = 1;
          modalTitle.value = "验证密码";
          popupRef.value = true;
        } else {
          executeOperation(1);
        }
      }
      if (itemTo == "断开油电") {
        if (userType.value == "1") {
          psw.value = "";
          currentOperation.value = 2;
          modalTitle.value = "验证密码";
          popupRef.value = true;
        } else {
          executeOperation(2);
        }
      }
      if (itemTo == "电子围栏") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/geofencing/geofencing?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.deviceName + "&carType=" + currentCarInfo.value.carType + "&deptId=" + deptId.value + "&deviceName=" + currentCarInfo.value.deviceName
        });
      }
      if (itemTo == "一键寻车") {
        navTo();
      }
      if (itemTo == "发送指令") {
        stopAutoRefresh();
        common_vendor.index.navigateTo({
          url: "/pages/cmd/cmd?imei=" + imei.value
        });
      }
    };
    const loadDeviceDetail = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value !== null) {
          const res = yield api_request.getDeviceDetail(deviceId.value);
          currentCarInfo.value = res.data;
        } else {
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:828", "设备id获取失败");
        }
      });
    };
    common_vendor.onLoad((option) => {
      deptId.value = option.deptId;
      imei.value = option.imei;
      deviceId.value = option.deviceId;
      const storedUserType = common_vendor.index.getStorageSync("userType");
      userType.value = storedUserType !== null && storedUserType !== void 0 ? storedUserType : "";
      loadDeviceDetail().then(() => {
        const data = new common_vendor.UTSJSONObject({
          deptId: deptId.value,
          deviceids: imei.value
        });
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "加载中..." }));
        loadData(data, 3).then((success) => {
          common_vendor.index.hideLoading();
          if (success && datainfo.value.connectionStatus == "online") {
            setupAutoRefresh(currentTime.value);
          }
        });
      });
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:862", "页面显示，检查自动刷新状态");
      if (datainfo.value.connectionStatus == "online" && !isRefreshing.value) {
        setupAutoRefresh(currentTime.value);
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:871", "页面隐藏时停止自动刷新");
      stopAutoRefresh();
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:876", "页面卸载时停止自动刷新");
      stopAutoRefresh();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(onCurrentTimeChange, "9c"),
        c: common_vendor.p({
          currentTime: common_vendor.unref(currentTime),
          showTime: true,
          showPickerTime: false,
          currentCar: common_vendor.unref(currentCarInfo).plateNo,
          times: common_vendor.unref(times),
          carStatus: common_vendor.unref(datainfo).connectionStatus,
          showPicker: false,
          showCar: true
        }),
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: common_vendor.unref(markers),
        h: common_vendor.unref(mapScale),
        i: common_vendor.t(common_vendor.unref(imei)),
        j: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "16"
        }),
        k: common_vendor.o(carDetail, "b2"),
        l: common_vendor.t(common_vendor.unref(datainfo).positionUpdateTime),
        m: common_vendor.t(common_vendor.unref(datainfo).signalUpdateTime),
        n: common_vendor.unref(address)
      }, common_vendor.unref(address) ? {
        o: common_vendor.t(common_vendor.unref(address))
      } : {
        p: common_vendor.t(common_vendor.unref(center).latitude),
        q: common_vendor.t(common_vendor.unref(center).longitude)
      }, {
        r: !common_vendor.unref(address)
      }, !common_vendor.unref(address) ? {
        s: common_vendor.o(refreshAdress, "42")
      } : {}, {
        t: common_vendor.unref(signalRssi) != null
      }, common_vendor.unref(signalRssi) != null ? {
        v: getMobileSignalBarClass(0, common_vendor.unref(signalRssi)) == "bar-active" ? getSignalDetail(common_vendor.unref(signalRssi)).color : "#e8e8e8",
        w: getMobileSignalBarClass(1, common_vendor.unref(signalRssi)) == "bar-active" ? getSignalDetail(common_vendor.unref(signalRssi)).color : "#e8e8e8",
        x: getMobileSignalBarClass(2, common_vendor.unref(signalRssi)) == "bar-active" ? getSignalDetail(common_vendor.unref(signalRssi)).color : "#e8e8e8",
        y: getMobileSignalBarClass(3, common_vendor.unref(signalRssi)) == "bar-active" ? getSignalDetail(common_vendor.unref(signalRssi)).color : "#e8e8e8",
        z: getMobileSignalBarClass(4, common_vendor.unref(signalRssi)) == "bar-active" ? getSignalDetail(common_vendor.unref(signalRssi)).color : "#e8e8e8",
        A: common_vendor.t(getSignalDetail(common_vendor.unref(signalRssi)).experience),
        B: getSignalDetail(common_vendor.unref(signalRssi)).color,
        C: common_vendor.t(common_vendor.unref(signalRssi)),
        D: getSignalDetail(common_vendor.unref(signalRssi)).color
      } : {}, {
        E: common_vendor.unref(signalSat) != null
      }, common_vendor.unref(signalSat) != null ? {
        F: common_assets._imports_0$1,
        G: common_vendor.t(common_vendor.unref(signalSat))
      } : {}, {
        H: common_vendor.unref(carVoltage)
      }, common_vendor.unref(carVoltage) ? {
        I: common_assets._imports_1$1,
        J: common_vendor.t(common_vendor.unref(carVoltage))
      } : {}, {
        K: common_vendor.unref(batteryPercent)
      }, common_vendor.unref(batteryPercent) ? {
        L: common_assets._imports_2$1,
        M: common_vendor.t(common_vendor.unref(batteryPercent)),
        N: getBatteryColor(common_vendor.unref(batteryPercent))
      } : {}, {
        O: common_vendor.o(($event) => {
          return handleGridClick($event);
        }, "36"),
        P: common_vendor.p({
          items: common_vendor.unref(baseList),
          col: 5,
          itemHeight: "88",
          round: "8",
          imageSize: 30,
          iconColor: "#3c9cff",
          textColor: "#606266",
          showBorder: true
        }),
        Q: common_vendor.o(filterNonLatin, "52"),
        R: common_vendor.o(($event) => {
          return common_vendor.isRef(psw) ? psw.value = $event : null;
        }, "84"),
        S: common_vendor.p({
          placeholder: "请输入密码",
          clearable: true,
          password: true,
          modelValue: common_vendor.unref(psw)
        }),
        T: common_vendor.o(confirm, "84"),
        U: common_vendor.p({
          show: common_vendor.unref(popupRef),
          title: common_vendor.unref(modalTitle)
        }),
        V: `${_ctx.u_s_b_h}px`,
        W: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/carInfoDetail/carInfoDetail.js.map
