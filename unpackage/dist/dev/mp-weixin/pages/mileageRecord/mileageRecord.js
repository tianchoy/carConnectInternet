"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_formateTime = require("../../utils/formateTime.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_datetime_picker_1 = common_vendor.resolveComponent("i-datetime-picker");
  const _easycom_i_empty_1 = common_vendor.resolveComponent("i-empty");
  const _easycom_i_tag_1 = common_vendor.resolveComponent("i-tag");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_icon_1 + _easycom_i_datetime_picker_1 + _easycom_i_empty_1 + _easycom_i_tag_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_datetime_picker = () => "../../uni_modules/i-ui-x/components/i-datetime-picker/i-datetime-picker.js";
const _easycom_i_empty = () => "../../uni_modules/i-ui-x/components/i-empty/i-empty.js";
const _easycom_i_tag = () => "../../uni_modules/i-ui-x/components/i-tag/i-tag.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_icon + _easycom_i_datetime_picker + _easycom_i_empty + _easycom_i_tag + _easycom_app_toast)();
}
class GroupType extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          date: { type: String, optional: false },
          trips: { type: "Unknown", optional: false },
          totalDistance: { type: Number, optional: false }
        };
      },
      name: "GroupType"
    };
  }
  constructor(options, metadata = GroupType.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.date = this.__props__.date;
    this.trips = this.__props__.trips;
    this.totalDistance = this.__props__.totalDistance;
    delete this.__props__;
  }
}
class DateTripGroup extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          date: { type: String, optional: false },
          trips: { type: "Unknown", optional: false }
        };
      },
      name: "DateTripGroup"
    };
  }
  constructor(options, metadata = DateTripGroup.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.date = this.__props__.date;
    this.trips = this.__props__.trips;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "mileageRecord",
  setup(__props) {
    const carStatus = common_vendor.ref("在线");
    const plateNo = common_vendor.ref("");
    const carType = common_vendor.ref("");
    const totalMileage = common_vendor.ref(0);
    const averageSpeed = common_vendor.ref(0);
    const tripData = common_vendor.ref([]);
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const currentPickerValue = common_vendor.computed(() => {
      return currentPickerType.value === "start" ? startTime.value : endTime.value;
    });
    const imei = common_vendor.ref("");
    const groupedTrips = common_vendor.computed(() => {
      const dateGroups = [];
      tripData.value.forEach((trip) => {
        const startTimeStr = trip.getString("startTime", "");
        const endTimeStr = trip.getString("endTime", "");
        const startParts = startTimeStr.split(" ");
        const endParts = endTimeStr.split(" ");
        const date = startParts.length > 0 && startParts[0] != "" ? startParts[0] : "未知日期";
        trip.set("startHour", startParts.length > 1 ? startParts[1] : "");
        trip.set("endHour", endParts.length > 1 ? endParts[1] : "");
        let group = common_vendor.UTS.arrayFind(dateGroups, (item) => {
          return item.date == date;
        });
        if (group == null) {
          group = { date, trips: [] };
          dateGroups.push(group);
        }
        group.trips.push(trip);
      });
      const groups = [];
      dateGroups.forEach((dateGroup) => {
        dateGroup.trips.sort((a, b) => {
          const timeA = utils_formateTime.parseLocalDateTime(a.getString("startTime", ""));
          const timeB = utils_formateTime.parseLocalDateTime(b.getString("startTime", ""));
          if (timeA == null)
            return timeB == null ? 0 : 1;
          if (timeB == null)
            return -1;
          return timeB - timeA;
        });
        let totalDistance = 0;
        dateGroup.trips.forEach((trip) => {
          totalDistance += trip.getNumber("distance", 0);
        });
        groups.push(new GroupType({ date: dateGroup.date, trips: dateGroup.trips, totalDistance }));
      });
      return groups.sort((a, b) => {
        const timeA = utils_formateTime.parseLocalDateTime(a.date);
        const timeB = utils_formateTime.parseLocalDateTime(b.date);
        if (timeA == null)
          return timeB == null ? 0 : 1;
        if (timeB == null)
          return -1;
        return timeB - timeA;
      });
    });
    const getTripStartTime = (trip) => {
      return trip.getString("startTime", "");
    };
    const getTripEndTime = (trip) => {
      return trip.getString("endTime", "");
    };
    const getTripHourRange = (trip) => {
      return trip.getString("startHour", "") + "-" + trip.getString("endHour", "");
    };
    const getTripDistanceText = (trip) => {
      return (trip.getNumber("distance", 0) / 1e3).toFixed(2);
    };
    const getTripDuration = (trip) => {
      return trip.getNumber("duration", 0);
    };
    const totalTrips = common_vendor.computed(() => {
      return tripData.value.length;
    });
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      endTime.value = utils_formateTime.formatTimesToMinute(now.getTime());
      startTime.value = utils_formateTime.formatTimesToMinute(now.getTime() - 36e5 * 24);
    };
    const processTripData = (data) => {
      const trips = data.getArray("trips");
      if (trips != null && trips.length > 0) {
        tripData.value = trips;
        let totalDistance = 0;
        let totalAvgSpeed = 0;
        trips.forEach((trip) => {
          totalDistance += trip.getNumber("distance", 0);
          totalAvgSpeed += trip.getNumber("averageSpeed", 0);
        });
        totalMileage.value = totalDistance;
        averageSpeed.value = totalAvgSpeed / trips.length;
      } else {
        tripData.value = [];
        totalMileage.value = 0;
        averageSpeed.value = 0;
      }
    };
    const loadMileageData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "加载中..."
        }));
        if (!imei.value)
          return Promise.resolve(null);
        try {
          const data = new common_vendor.UTSJSONObject({
            imei: imei.value,
            startTime: startTime.value,
            endTime: endTime.value,
            minParkTime: 120,
            withStop: false,
            withPos: false,
            withTrip: true
          });
          const res = yield api_request.getTrackPos(data);
          if (res.code != 200) {
            utils_toast.showAppToast({ title: res.msg || "数据加载失败", icon: "none" });
            return Promise.resolve(null);
          }
          common_vendor.index.__f__("log", "at pages/mileageRecord/mileageRecord.uvue:209", "获取里程数据成功:", res);
          const trackData = res.data;
          if (trackData != null) {
            processTripData(trackData);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mileageRecord/mileageRecord.uvue:215", "获取里程数据失败:", e);
          utils_toast.showAppToast({
            title: "数据加载失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    common_vendor.onMounted(() => {
      initDateTime();
      loadMileageData();
    });
    common_vendor.onLoad((option) => {
      var _a, _b, _c, _d;
      imei.value = (_a = option.imei) !== null && _a !== void 0 ? _a : null;
      carStatus.value = (_b = option.connectionStatus) !== null && _b !== void 0 ? _b : "在线";
      plateNo.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "";
      carType.value = (_d = option.carType) !== null && _d !== void 0 ? _d : "";
    });
    const gotoTripDetail = (startTime2, endTime2) => {
      common_vendor.index.navigateTo({
        url: "/pages/playBack/playBack?startTime=" + startTime2 + "&endTime=" + endTime2 + "&imei=" + imei.value + "&connectionStatus=" + carStatus.value + "&plateNo=" + plateNo.value + "&carType=" + carType.value
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
      showDateTimePicker.value = false;
      loadMileageData();
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    const onPickerShowChange = (value) => {
      showDateTimePicker.value = value;
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
          name: "/static/rili.png",
          fontSize: "15"
        }),
        c: common_vendor.t(formatDisplayTime(startTime.value)),
        d: common_vendor.o(($event) => {
          return showPicker("start");
        }, "43"),
        e: common_vendor.o(($event) => {
          return showPicker("start");
        }, "85"),
        f: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        g: common_vendor.t(formatDisplayTime(endTime.value)),
        h: common_vendor.o(($event) => {
          return showPicker("end");
        }, "a0"),
        i: common_vendor.o(($event) => {
          return showPicker("end");
        }, "6c"),
        j: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15"
        }),
        k: common_vendor.o(onConfirm, "e0"),
        l: common_vendor.o(onCancel, "20"),
        m: common_vendor.o(onPickerShowChange, "7c"),
        n: common_vendor.p({
          show: showDateTimePicker.value,
          ["model-value"]: currentPickerValue.value,
          mode: "datetime",
          title: pickerTitle.value,
          ["cancel-text"]: "取消",
          ["confirm-text"]: "确认"
        }),
        o: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        p: common_vendor.t(totalTrips.value),
        q: common_vendor.t(averageSpeed.value.toFixed(1)),
        r: groupedTrips.value.length == 0
      }, groupedTrips.value.length == 0 ? {
        s: common_vendor.p({
          text: "当前时间点暂无行程数据",
          showButton: false,
          description: ""
        })
      } : {
        t: common_vendor.f(groupedTrips.value, (group, groupIndex, i0) => {
          return {
            a: common_vendor.t(group.date),
            b: "5f5c5231-6-" + i0,
            c: common_vendor.p({
              text: group.trips.length + "段",
              type: "success",
              size: "small"
            }),
            d: common_vendor.t((group.totalDistance / 1e3).toFixed(2)),
            e: common_vendor.f(group.trips, (item, index, i1) => {
              return {
                a: common_vendor.t(index + 1),
                b: common_vendor.t(getTripHourRange(item)),
                c: common_vendor.t(getTripDistanceText(item)),
                d: common_vendor.t(formatDuration(getTripDuration(item))),
                e: index,
                f: common_vendor.o(($event) => {
                  return gotoTripDetail(getTripStartTime(item), getTripEndTime(item));
                }, index)
              };
            }),
            f: groupIndex
          };
        })
      }, {
        v: `${_ctx.u_s_b_h}px`,
        w: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mileageRecord/mileageRecord.js.map
