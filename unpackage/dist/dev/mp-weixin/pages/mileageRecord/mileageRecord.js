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
  const _easycom_uv_loading_icon_1 = common_vendor.resolveComponent("uv-loading-icon");
  const _easycom_uv_empty_1 = common_vendor.resolveComponent("uv-empty");
  const _easycom_uv_tags_1 = common_vendor.resolveComponent("uv-tags");
  const _easycom_uv_steps_item_1 = common_vendor.resolveComponent("uv-steps-item");
  const _easycom_uv_steps_1 = common_vendor.resolveComponent("uv-steps");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1 + _easycom_uv_loading_icon_1 + _easycom_uv_empty_1 + _easycom_uv_tags_1 + _easycom_uv_steps_item_1 + _easycom_uv_steps_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
const _easycom_uv_loading_icon = () => "../../uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js";
const _easycom_uv_empty = () => "../../uni_modules/uv-empty/components/uv-empty/uv-empty.js";
const _easycom_uv_tags = () => "../../uni_modules/uv-tags/components/uv-tags/uv-tags.js";
const _easycom_uv_steps_item = () => "../../uni_modules/uv-steps/components/uv-steps-item/uv-steps-item.js";
const _easycom_uv_steps = () => "../../uni_modules/uv-steps/components/uv-steps/uv-steps.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_l_date_time_picker + _easycom_l_popup + _easycom_uv_loading_icon + _easycom_uv_empty + _easycom_uv_tags + _easycom_uv_steps_item + _easycom_uv_steps)();
}
class GroupType extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          date: { type: String, optional: false },
          trips: { type: "Any", optional: false },
          totalDistance: { type: Number, optional: false }
        };
      },
      name: "GroupType"
    };
  }
  constructor(options, metadata = GroupType.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.date = this.__props__.date;
    this.trips = this.__props__.trips;
    this.totalDistance = this.__props__.totalDistance;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "mileageRecord",
  setup(__props) {
    common_vendor.ref("在线");
    const loading = common_vendor.ref(false);
    const totalMileage = common_vendor.ref(0);
    const averageSpeed = common_vendor.ref(0);
    const tripData = common_vendor.ref([]);
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const groupedTrips = common_vendor.computed(() => {
      const groups = [];
      const tripsByDate = new UTSJSONObject(
        {}
        // 按日期分组
      );
      tripData.value.forEach((trip = null) => {
        const date = trip.startTime ? trip.startTime.split(" ")[0] : "未知日期";
        if (!tripsByDate[date]) {
          tripsByDate[date] = [];
        }
        tripsByDate[date].push(trip);
      });
      for (const date in tripsByDate) {
        const trips = tripsByDate[date];
        let totalDistance = 0;
        trips.forEach((trip = null) => {
          totalDistance += trip.distance || 0;
        });
        groups.push(new GroupType({
          date,
          trips,
          totalDistance
        }));
      }
      return groups.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    });
    const totalTrips = common_vendor.computed(() => {
      return tripData.value.length;
    });
    common_vendor.onMounted(() => {
      initDateTime();
      loadMileageData();
    });
    common_vendor.onLoad((option) => {
      imei.value = option.imei;
    });
    const loadMileageData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!imei.value)
          return Promise.resolve(null);
        loading.value = true;
        try {
          const data = new UTSJSONObject({
            imei: imei.value,
            startTime: startTime.value,
            endTime: endTime.value,
            minParkTime: 120,
            withStop: true,
            withPos: true,
            withTrip: true
          });
          const res = yield api_request.getTrackPos(data);
          if (res && res.data) {
            yield processTripData(res.data);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mileageRecord/mileageRecord.uvue:176", "获取里程数据失败:", e);
          common_vendor.index.showToast({
            title: "数据加载失败",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    const processTripData = (data = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (data.trips && data.trips.length > 0) {
          const processedTrips = yield Promise.all(data.trips.map((trip = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              var _a, _b;
              const startAddress = yield utils_getAdress.getAddress(trip.startLat, trip.startLon);
              const endAddress = yield utils_getAdress.getAddress(trip.endLat, trip.endLon);
              return new UTSJSONObject(Object.assign(Object.assign({}, trip), { startAddress: ((_a = startAddress === null || startAddress === void 0 ? null : startAddress.result) === null || _a === void 0 ? null : _a.formatted_address) || "未知地点", endAddress: ((_b = endAddress === null || endAddress === void 0 ? null : endAddress.result) === null || _b === void 0 ? null : _b.formatted_address) || "未知地点" }));
            });
          }));
          tripData.value = processedTrips;
          let totalDistance = 0;
          let totalDuration = 0;
          let totalAvgSpeed = 0;
          processedTrips.forEach((trip = null) => {
            totalDistance += trip.distance || 0;
            totalDuration += trip.duration || 0;
            totalAvgSpeed += trip.averageSpeed || 0;
          });
          totalMileage.value = totalDistance;
          averageSpeed.value = processedTrips.length > 0 ? totalAvgSpeed / processedTrips.length : 0;
        } else {
          tripData.value = [];
          totalMileage.value = 0;
          averageSpeed.value = 0;
        }
      });
    };
    const formatDisplayTime = (timeString) => {
      if (!timeString)
        return "选择时间";
      return timeString;
    };
    const formatDuration = (milliseconds) => {
      const seconds = Math.floor(milliseconds / 1e3);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      if (hours > 0) {
        return `${hours}小时${minutes}分`;
      } else if (minutes > 0) {
        return `${minutes}分钟`;
      } else {
        return `${seconds % 60}秒`;
      }
    };
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5 * 24);
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
      loadMileageData();
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    const showTripDetail = (trip = null) => {
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "里程记录",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          name: "calendar",
          size: "25"
        }),
        c: common_vendor.t(formatDisplayTime(startTime.value)),
        d: common_vendor.o(($event) => {
          return showPicker("start");
        }),
        e: common_vendor.o(($event) => {
          return showPicker("start");
        }),
        f: common_vendor.p({
          name: "arrow-down",
          size: "13"
        }),
        g: common_vendor.t(formatDisplayTime(endTime.value)),
        h: common_vendor.o(($event) => {
          return showPicker("end");
        }),
        i: common_vendor.o(($event) => {
          return showPicker("end");
        }),
        j: common_vendor.p({
          name: "arrow-down",
          size: "13"
        }),
        k: common_vendor.o(onConfirm),
        l: common_vendor.o(onCancel),
        m: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        n: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }),
        o: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        p: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        q: common_vendor.t(totalTrips.value),
        r: common_vendor.t(averageSpeed.value.toFixed(1)),
        s: loading.value
      }, loading.value ? {
        t: common_vendor.p({
          mode: "circle",
          size: "40"
        })
      } : {}, {
        v: !loading.value && groupedTrips.value.length == 0
      }, !loading.value && groupedTrips.value.length == 0 ? {
        w: common_vendor.p({
          mode: "data",
          text: "当前时间点暂无行程数据"
        })
      } : {
        x: common_vendor.f(groupedTrips.value, (group, groupIndex, i0) => {
          return {
            a: common_vendor.t(group.date),
            b: "5f5c5231-8-" + i0,
            c: common_vendor.p({
              text: group.trips.length + "段",
              type: "success",
              size: "mini"
            }),
            d: common_vendor.t((group.totalDistance / 1e3).toFixed(2)),
            e: common_vendor.f(group.trips, (item, index, i1) => {
              return {
                a: common_vendor.t(index + 1),
                b: common_vendor.t((item.distance / 1e3).toFixed(2)),
                c: common_vendor.t(formatDuration(item.duration)),
                d: "5f5c5231-10-" + i0 + "-" + i1 + "," + ("5f5c5231-9-" + i0 + "-" + i1),
                e: common_vendor.p({
                  title: item.startAddress || "未知地点",
                  desc: item.startTime
                }),
                f: "5f5c5231-11-" + i0 + "-" + i1 + "," + ("5f5c5231-9-" + i0 + "-" + i1),
                g: common_vendor.p({
                  title: item.endAddress || "未知地点",
                  desc: item.endTime
                }),
                h: "5f5c5231-9-" + i0 + "-" + i1,
                i: index,
                j: common_vendor.o(($event) => {
                  return showTripDetail(item);
                }, index)
              };
            }),
            f: groupIndex
          };
        }),
        y: common_assets._imports_0$2,
        z: common_assets._imports_1$1,
        A: common_vendor.p({
          current: "1",
          direction: "column",
          ["active-color"]: "#3c9cff",
          ["inactive-color"]: "#999"
        })
      }, {
        B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mileageRecord/mileageRecord.js.map
