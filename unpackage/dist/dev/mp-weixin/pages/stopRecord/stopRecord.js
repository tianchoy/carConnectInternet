"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_l_date_time_picker + _easycom_l_popup)();
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
          minParkTime: 60,
          withStop: true,
          withPos: false,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        common_vendor.index.__f__("log", "at pages/stopRecord/stopRecord.uvue:71", res);
      });
    };
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5);
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
      showDateTimePicker.value = false;
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "停车记录",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          name: "calendar",
          size: "25"
        }),
        c: common_vendor.t(startTime.value),
        d: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        e: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        f: common_vendor.p({
          name: "arrow-down",
          size: "16"
        }),
        g: common_vendor.t(endTime.value),
        h: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        i: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        j: common_vendor.p({
          name: "arrow-down",
          size: "16"
        }),
        k: common_vendor.o(onConfirm),
        l: common_vendor.o(onCancel),
        m: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        n: common_vendor.o(($event = null) => {
          return showDateTimePicker.value = $event;
        }),
        o: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        p: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stopRecord/stopRecord.js.map
