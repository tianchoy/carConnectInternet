"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_getAdress = require("../../utils/getAdress.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  const _easycom_uv_empty_1 = common_vendor.resolveComponent("uv-empty");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1 + _easycom_uv_empty_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
const _easycom_uv_empty = () => "../../uni_modules/uv-empty/components/uv-empty/uv-empty.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_l_date_time_picker + _easycom_l_popup + _easycom_uv_empty)();
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
    const carStopDetail = common_vendor.ref(new UTSJSONObject({}));
    common_vendor.onMounted(() => {
      initDateTime();
      loadStopData();
    });
    common_vendor.onLoad((option) => {
      imei.value = option.imei;
    });
    const loadStopData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const data = new UTSJSONObject({
          imei: imei.value,
          startTime: startTime.value,
          endTime: endTime.value,
          minParkTime: 10,
          withStop: true,
          withPos: false,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        const stopsWithAddress = yield Promise.all(res.data.stops.map((stop = null) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            const address = yield utils_getAdress.getAddress(stop.latitude, stop.longitude);
            return new UTSJSONObject(Object.assign(Object.assign({}, stop), { address: address.result.formatted_address }));
          });
        }));
        carStopDetail.value = stopsWithAddress;
      });
    };
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 72e5);
      startTime.value = formatTime(startDate);
    };
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
    const calculateDuration = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours}小时${minutes}分${seconds}秒`;
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "停车记录",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        })),
        b: common_vendor.p(new UTSJSONObject({
          name: "calendar",
          size: "25"
        })),
        c: common_vendor.t(startTime.value),
        d: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        e: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        f: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          size: "13"
        })),
        g: common_vendor.t(endTime.value),
        h: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        i: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        j: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          size: "13"
        })),
        k: common_vendor.o(onConfirm),
        l: common_vendor.o(onCancel),
        m: common_vendor.p(new UTSJSONObject({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        })),
        n: common_vendor.o(($event = null) => {
          return showDateTimePicker.value = $event;
        }),
        o: common_vendor.p(new UTSJSONObject({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        })),
        p: carStopDetail.value.length == 0
      }), carStopDetail.value.length == 0 ? new UTSJSONObject({
        q: common_vendor.p(new UTSJSONObject({
          mode: "data",
          text: "当前时间暂无停车数据"
        }))
      }) : new UTSJSONObject({
        r: common_vendor.f(carStopDetail.value, (item = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(item.startTime),
            b: common_vendor.t(item.endTime),
            c: common_vendor.t(calculateDuration(item.startTime, item.endTime)),
            d: common_vendor.t(item.address || "加载中..."),
            e: index
          });
        }),
        s: common_assets._imports_0$4,
        t: common_assets._imports_1$1,
        v: common_assets._imports_2,
        w: common_assets._imports_3
      }), new UTSJSONObject({
        x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stopRecord/stopRecord.js.map
