"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_openLocation = require("../../utils/openLocation.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_formateTime = require("../../utils/formateTime.js");
require("../../utils/getAdress.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_datetime_picker_1 = common_vendor.resolveComponent("i-datetime-picker");
  const _easycom_i_empty_1 = common_vendor.resolveComponent("i-empty");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_icon_1 + _easycom_i_datetime_picker_1 + _easycom_i_empty_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_datetime_picker = () => "../../uni_modules/i-ui-x/components/i-datetime-picker/i-datetime-picker.js";
const _easycom_i_empty = () => "../../uni_modules/i-ui-x/components/i-empty/i-empty.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_icon + _easycom_i_datetime_picker + _easycom_i_empty + _easycom_app_toast)();
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
    const currentPickerValue = common_vendor.computed(() => {
      return currentPickerType.value === "start" ? startTime.value : endTime.value;
    });
    const imei = common_vendor.ref("");
    common_vendor.ref("");
    const carStopDetail = common_vendor.ref([]);
    const sortedCarStopDetail = common_vendor.computed(() => {
      const sorted = carStopDetail.value.slice();
      sorted.sort((a, b) => {
        const timeA = utils_formateTime.parseLocalDateTime(a.getString("endTime", ""));
        const timeB = utils_formateTime.parseLocalDateTime(b.getString("endTime", ""));
        if (timeA == null)
          return timeB == null ? 0 : 1;
        if (timeB == null)
          return -1;
        return timeB - timeA;
      });
      return sorted;
    });
    common_vendor.onLoad((option) => {
      imei.value = option.imei;
    });
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      endTime.value = utils_formateTime.formatTimesToMinute(now.getTime());
      startTime.value = utils_formateTime.formatTimesToMinute(now.getTime() - 36e5 * 24);
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
        try {
          const res = yield api_request.getTrackPos(data);
          const trackData = res.data;
          if (res.code != 200 || trackData == null) {
            utils_toast.showAppToast({ title: res.msg || "数据加载失败", icon: "none" });
            carStopDetail.value = [];
            return Promise.resolve(null);
          }
          const stopsWithAddress = [];
          const stops = (_a = trackData.getArray("stops")) !== null && _a !== void 0 ? _a : [];
          stops.forEach((stop) => {
            const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(stop.getNumber("latitude", 0), stop.getNumber("longitude", 0));
            stop.set("latitude", convertedCoord.lat);
            stop.set("longitude", convertedCoord.lng);
            stopsWithAddress.push(stop);
          });
          carStopDetail.value = stopsWithAddress;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/stopRecord/stopRecord.uvue:135", "获取停车数据失败:", error);
          utils_toast.showAppToast({ title: "数据加载失败", icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
        }
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
    const onConfirm = (event = null) => {
      const eventObject = event;
      const timestampValue = eventObject["timestamp"];
      const timestamp = timestampValue == null ? 0 : parseFloat(timestampValue.toString());
      if (!isFinite(timestamp) || timestamp <= 0)
        return null;
      const value = utils_formateTime.formatTimesToMinute(timestamp);
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
    const onPickerShowChange = (value) => {
      showDateTimePicker.value = value;
    };
    const calculateDuration = (diff) => {
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours}小时${minutes}分${seconds}秒`;
    };
    const showAddress = (latitude, longitude) => {
      utils_openLocation.openLocation(new utils_openLocation.OpenLocationParams({
        latitude,
        longitude,
        name: "停车位置"
      }));
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
        }, "33"),
        e: common_vendor.o(($event) => {
          return showPicker("start");
        }, "24"),
        f: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        g: common_vendor.t(endTime.value),
        h: common_vendor.o(($event) => {
          return showPicker("end");
        }, "d2"),
        i: common_vendor.o(($event) => {
          return showPicker("end");
        }, "bd"),
        j: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        k: common_vendor.o(onConfirm, "ca"),
        l: common_vendor.o(onCancel, "1a"),
        m: common_vendor.o(onPickerShowChange, "68"),
        n: common_vendor.p({
          show: showDateTimePicker.value,
          ["model-value"]: currentPickerValue.value,
          mode: "datetime",
          title: pickerTitle.value,
          ["cancel-text"]: "取消",
          ["confirm-text"]: "确认"
        }),
        o: sortedCarStopDetail.value.length == 0
      }, sortedCarStopDetail.value.length == 0 ? {
        p: common_vendor.p({
          text: "当前时间暂无停车数据",
          showButton: false,
          description: ""
        })
      } : {
        q: common_vendor.f(sortedCarStopDetail.value, (item, index, i0) => {
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
        r: common_assets._imports_0$2,
        s: common_assets._imports_1$2,
        t: common_assets._imports_2$2,
        v: common_assets._imports_3$1
      }, {
        w: `${_ctx.u_s_b_h}px`,
        x: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stopRecord/stopRecord.js.map
