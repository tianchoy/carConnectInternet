"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
require("../../utils/getAdress.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  const _easycom_i_empty_1 = common_vendor.resolveComponent("i-empty");
  (_easycom_custom_navBar_1 + _easycom_i_icon_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1 + _easycom_i_empty_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
const _easycom_i_empty = () => "../../uni_modules/i-ui-x/components/i-empty/i-empty.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_icon + _easycom_l_date_time_picker + _easycom_l_popup + _easycom_i_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "stopRecord",
  setup(__props) {
    common_vendor.ref("在线");
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const carStopDetail = common_vendor.ref([]);
    const sortedCarStopDetail = common_vendor.computed(() => {
      const sorted = carStopDetail.value.slice();
      sorted.sort((a, b) => {
        const timeA = new Date(a.getString("endTime", "")).getTime();
        const timeB = new Date(b.getString("endTime", "")).getTime();
        return timeB - timeA;
      });
      return sorted;
    });
    common_vendor.onLoad((option) => {
      imei.value = option.imei;
    });
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5 * 24);
      startTime.value = formatTime(startDate);
    };
    const loadStopData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "加载中..."
        }));
        const data = new common_vendor.UTSJSONObject({
          imei: imei.value,
          startTime: startTime.value,
          endTime: endTime.value,
          minParkTime: 10,
          withStop: true,
          withPos: false,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        let stopsWithAddress = [];
        const trackData = res.getJSON("data");
        const stops = (_a = trackData === null || trackData === void 0 ? null : trackData.getArray("stops")) !== null && _a !== void 0 ? _a : [];
        stops.forEach((stop) => {
          const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(stop.getNumber("latitude", 0), stop.getNumber("longitude", 0));
          stop.set("latitude", convertedCoord.lat);
          stop.set("longitude", convertedCoord.lng);
          stopsWithAddress.push(stop);
        });
        carStopDetail.value = stopsWithAddress;
        common_vendor.index.hideLoading();
      });
    };
    common_vendor.onMounted(() => {
      initDateTime();
      loadStopData();
    });
    const showPicker = (type) => {
      currentPickerType.value = type;
      pickerTitle.value = type === "start" ? "选择开始时间" : "选择结束时间";
      showDateTimePicker.value = true;
    };
    const onConfirm = (value) => {
      if (currentPickerType.value === "start") {
        startTime.value = value;
      } else {
        endTime.value = value;
      }
      loadStopData();
      showDateTimePicker.value = false;
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    const calculateDuration = (diff) => {
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours}小时${minutes}分${seconds}秒`;
    };
    const showAddress = (latitude, longitude) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/stopRecord/stopRecord.uvue:170", latitude, longitude);
        common_vendor.index.openLocation({
          latitude,
          longitude,
          name: "当前位置",
          scale: 18,
          success: () => {
            common_vendor.index.__f__("log", "at pages/stopRecord/stopRecord.uvue:177", "成功调起地图");
          },
          fail: (err) => {
            common_vendor.index.showToast({
              title: "调起地图失败",
              icon: "none"
            });
            common_vendor.index.__f__("error", "at pages/stopRecord/stopRecord.uvue:184", "调起地图失败:", err);
          }
        });
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "停车记录",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          name: "/static/rili.png",
          fontSize: "15"
        }),
        c: common_vendor.t(startTime.value),
        d: common_vendor.o(($event) => {
          return showPicker("start");
        }, "f1"),
        e: common_vendor.o(($event) => {
          return showPicker("start");
        }, "4c"),
        f: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        g: common_vendor.t(endTime.value),
        h: common_vendor.o(($event) => {
          return showPicker("end");
        }, "c6"),
        i: common_vendor.o(($event) => {
          return showPicker("end");
        }, "14"),
        j: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        k: common_vendor.o(onConfirm, "3c"),
        l: common_vendor.o(onCancel, "94"),
        m: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        n: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }, "d5"),
        o: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        p: sortedCarStopDetail.value.length == 0
      }, sortedCarStopDetail.value.length == 0 ? {
        q: common_vendor.p({
          text: "当前时间暂无停车数据",
          showButton: false,
          description: ""
        })
      } : {
        r: common_vendor.f(sortedCarStopDetail.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.startTime),
            b: common_vendor.t(item.endTime),
            c: common_vendor.t(calculateDuration(item.getNumber("duration", 0))),
            d: item.address
          }, item.address ? {
            e: common_vendor.t(item.address || "加载中...")
          } : {
            f: common_vendor.o(($event) => {
              return showAddress(item.getNumber("latitude", 0), item.getNumber("longitude", 0));
            }, index)
          }, {
            g: index
          });
        }),
        s: common_assets._imports_0$2,
        t: common_assets._imports_1$2,
        v: common_assets._imports_2$2,
        w: common_assets._imports_3$1
      }, {
        x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        y: `${_ctx.u_s_b_h}px`,
        z: `${_ctx.u_s_a_i_b}px`,
        A: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stopRecord/stopRecord.js.map
