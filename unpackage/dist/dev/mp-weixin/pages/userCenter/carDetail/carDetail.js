"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_car_number_input_1 = common_vendor.resolveComponent("car-number-input");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_popup_1 = common_vendor.resolveComponent("uv-popup");
  (_easycom_custom_navBar_1 + _easycom_car_number_input_1 + _easycom_uv_input_1 + _easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1 + _easycom_uv_popup_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_car_number_input = () => "../../../uni_modules/car-number-input/components/car-number-input/car-number-input.js";
const _easycom_uv_input = () => "../../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_icon = () => "../../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_popup = () => "../../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_car_number_input + _easycom_uv_input + _easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid + _easycom_uv_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carDetail",
  setup(__props) {
    const deviceId = common_vendor.ref("");
    common_vendor.ref(new UTSJSONObject({}));
    const isEditing = common_vendor.ref(false);
    const carInfo = common_vendor.ref(new UTSJSONObject({}));
    const editInfo = common_vendor.ref(new UTSJSONObject({}));
    const deviceTypeSelect = common_vendor.ref(null);
    const carTitle = common_vendor.computed(() => {
      const item = UTS.arrayFind(IconList, (item2) => {
        return item2.name === carInfo.value.carType;
      });
      return item ? item.title : "未知";
    });
    const IconList = [
      new UTSJSONObject({
        name: "car",
        title: "轿车",
        img: "/static/cars/online/car.png"
      }),
      new UTSJSONObject({
        name: "bus",
        title: "公交车",
        img: "/static/cars/online/bus.png"
      }),
      new UTSJSONObject({
        name: "bike",
        title: "自行车",
        img: "/static/cars/online/bike.png"
      }),
      new UTSJSONObject({
        name: "moto",
        title: "摩托车",
        img: "/static/cars/online/moto.png"
      }),
      new UTSJSONObject({
        name: "diandong",
        title: "电动车",
        img: "/static/cars/online/diandong.png"
      }),
      new UTSJSONObject({
        name: "huoche",
        title: "货车",
        img: "/static/cars/online/huoche.png"
      }),
      new UTSJSONObject({
        name: "sanlun",
        title: "三轮车",
        img: "/static/cars/online/sanlun.png"
      }),
      new UTSJSONObject({
        name: "tuola",
        title: "拖拉机",
        img: "/static/cars/online/tuola.png"
      })
    ];
    const selectIcon = (item = null) => {
      var _a;
      editInfo.value.carType = item.name;
      editInfo.value.carTypeValue = item.title;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.close();
    };
    const deviceTypeSelectFun = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
      });
    };
    const handlePlateNumberChange = (e) => {
      common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:119", e.length);
      editInfo.value.plateNo = e;
    };
    const formattedPlateNo = common_vendor.computed(() => {
      if (!editInfo.value.plateNo)
        return "京A";
      return editInfo.value.plateNo.length > 8 ? editInfo.value.plateNo.substring(0, 8) : editInfo.value.plateNo;
    });
    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
      if (isEditing.value) {
        editInfo.value = UTS.JSON.parse(UTS.JSON.stringify(carInfo.value));
      }
    };
    const saveChanges = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const data = new UTSJSONObject({
          deviceId: editInfo.value.deviceId,
          carType: editInfo.value.carType,
          plateNo: editInfo.value.plateNo,
          carVin: editInfo.value.carVin,
          engineNum: editInfo.value.engineNum
        });
        carInfo.value = UTS.JSON.parse(UTS.JSON.stringify(editInfo.value));
        isEditing.value = false;
        const res = yield api_request.editDeviceInfo(data);
        common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:152", res);
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
      });
    };
    const cancelEdit = () => {
      isEditing.value = false;
    };
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:165", "option", option);
      if (option.deviceId != null) {
        deviceId.value = option.deviceId;
        loadCarListData();
      } else {
        common_vendor.index.__f__("error", "at pages/userCenter/carDetail/carDetail.uvue:171", "deviceId is null");
      }
    });
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getDeviceDetail(deviceId.value);
        if (res.msg == "success") {
          carInfo.value = res.data;
        } else {
          common_vendor.index.showToast({
            title: "获取车辆详情失败"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.o(toggleEdit),
        b: common_vendor.p({
          title: "车辆详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          Icon: "edit-pen"
        }),
        c: common_vendor.t(common_vendor.unref(carInfo).deviceId),
        d: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        e: common_vendor.t(common_vendor.unref(carTitle))
      } : {
        f: common_vendor.t(common_vendor.unref(editInfo).carTypeValue || "请选择图标"),
        g: common_vendor.o(deviceTypeSelectFun)
      }, {
        h: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        i: common_vendor.t(common_vendor.unref(carInfo).plateNo)
      } : {
        j: common_vendor.o(handlePlateNumberChange),
        k: common_vendor.p({
          defaultStr: common_vendor.unref(formattedPlateNo)
        })
      }, {
        l: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        m: common_vendor.t(common_vendor.unref(carInfo).carVin)
      } : {
        n: common_vendor.o(($event) => {
          return common_vendor.unref(editInfo).carVin = $event;
        }),
        o: common_vendor.p({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).carVin
        })
      }, {
        p: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        q: common_vendor.t(common_vendor.unref(carInfo).engineNum)
      } : {
        r: common_vendor.o(($event) => {
          return common_vendor.unref(editInfo).engineNum = $event;
        }),
        s: common_vendor.p({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).engineNum
        })
      }, {
        t: common_vendor.unref(isEditing)
      }, common_vendor.unref(isEditing) ? {
        v: common_vendor.o(saveChanges),
        w: common_vendor.o(cancelEdit)
      } : {}, {
        x: common_vendor.f(IconList, (item, index, i0) => {
          return {
            a: "36223569-7-" + i0 + "," + ("36223569-6-" + i0),
            b: common_vendor.p({
              customStyle: {
                paddingTop: "20rpx"
              },
              name: item.img,
              size: 50
            }),
            c: common_vendor.t(item.title),
            d: index,
            e: common_vendor.o(($event) => {
              return selectIcon(item);
            }, index),
            f: "36223569-6-" + i0 + ",36223569-5"
          };
        }),
        y: common_vendor.p({
          col: 4
        }),
        z: common_vendor.sr(deviceTypeSelect, "36223569-4", {
          "k": "deviceTypeSelect"
        }),
        A: common_vendor.p({
          title: "请选择图标",
          mode: "bottom"
        }),
        B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36223569"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carDetail/carDetail.js.map
