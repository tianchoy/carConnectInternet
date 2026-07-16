"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_car_number_input_1 = common_vendor.resolveComponent("car-number-input");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_icon_1 + _easycom_car_number_input_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_icon = () => "../../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_car_number_input = () => "../../../uni_modules/car-number-input/components/car-number-input/car-number-input.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_icon + _easycom_car_number_input + common_vendor.unref(carIcons))();
}
const carIcons = () => "../../../components/car-icons/car-icons.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carDetail",
  setup(__props) {
    const deviceId = common_vendor.ref("");
    common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const isEditing = common_vendor.ref(false);
    const carInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const editInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const deviceTypeSelect = common_vendor.ref(null);
    const carTitle = common_vendor.computed(() => {
      var _a;
      if (!carInfo.value.carType)
        return "未知";
      const iconInfo = (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.getIconByName(carInfo.value.carType);
      return iconInfo ? iconInfo.title : "未知";
    });
    const selectIcon = (item = null) => {
      var _a;
      editInfo.value.carType = item.name;
      editInfo.value.carTypeValue = item.text;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.close();
    };
    const deviceTypeSelectFun = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
      });
    };
    const handlePlateNumberChange = (e) => {
      common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:86", e.length);
      editInfo.value.plateNo = e;
    };
    const formattedPlateNo = common_vendor.computed(() => {
      if (!editInfo.value.plateNo)
        return "京A";
      return editInfo.value.plateNo.length > 8 ? editInfo.value.plateNo.substring(0, 8) : editInfo.value.plateNo;
    });
    const toggleEdit = () => {
      var _a;
      isEditing.value = !isEditing.value;
      if (isEditing.value) {
        editInfo.value = common_vendor.UTS.JSON.parse(common_vendor.UTS.JSON.stringify(carInfo.value));
        if (editInfo.value.carType && !editInfo.value.carTypeValue) {
          const iconInfo = (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.getIconByName(editInfo.value.carType);
          if (iconInfo) {
            editInfo.value.carTypeValue = iconInfo.title;
          }
        }
      }
    };
    const saveChanges = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const data = new common_vendor.UTSJSONObject({
          deviceId: editInfo.value.deviceId,
          deviceName: editInfo.value.deviceName,
          carType: editInfo.value.carType,
          plateNo: editInfo.value.plateNo,
          carVin: editInfo.value.carVin,
          engineNum: editInfo.value.engineNum
        });
        carInfo.value = common_vendor.UTS.JSON.parse(common_vendor.UTS.JSON.stringify(editInfo.value));
        isEditing.value = false;
        const res = yield api_request.editDeviceInfo(data);
        common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:128", res);
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
      common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:141", "option", option);
      if (option.deviceId != null) {
        deviceId.value = option.deviceId;
        loadCarListData();
      } else {
        common_vendor.index.__f__("error", "at pages/userCenter/carDetail/carDetail.uvue:147", "deviceId is null");
      }
    });
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getDeviceDetail(deviceId.value);
        common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:153", res.data);
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
        a: common_vendor.o(toggleEdit, "1d"),
        b: common_vendor.p({
          title: "车辆详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          Icon: "/static/edit-pen.png",
          class: "data-v-36223569"
        }),
        c: common_vendor.t(common_vendor.unref(carInfo).deviceId),
        d: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        e: common_vendor.t(common_vendor.unref(carInfo).deviceName)
      } : {
        f: common_vendor.o(($event) => {
          return common_vendor.unref(editInfo).deviceName = $event;
        }, "f3"),
        g: common_vendor.p({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).deviceName,
          class: "input data-v-36223569"
        })
      }, {
        h: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        i: common_vendor.t(common_vendor.unref(carTitle))
      } : {
        j: common_vendor.t(common_vendor.unref(editInfo).carTypeValue || "请选择图标"),
        k: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15",
          class: "data-v-36223569"
        }),
        l: common_vendor.o(deviceTypeSelectFun, "a1")
      }, {
        m: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        n: common_vendor.t(common_vendor.unref(carInfo).plateNo)
      } : {
        o: common_vendor.o(handlePlateNumberChange, "76"),
        p: common_vendor.p({
          defaultStr: common_vendor.unref(formattedPlateNo),
          class: "data-v-36223569"
        })
      }, {
        q: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        r: common_vendor.t(common_vendor.unref(carInfo).carVin)
      } : {
        s: common_vendor.o(($event) => {
          return common_vendor.unref(editInfo).carVin = $event;
        }, "58"),
        t: common_vendor.p({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).carVin,
          class: "input data-v-36223569"
        })
      }, {
        v: !common_vendor.unref(isEditing)
      }, !common_vendor.unref(isEditing) ? {
        w: common_vendor.t(common_vendor.unref(carInfo).engineNum)
      } : {
        x: common_vendor.o(($event) => {
          return common_vendor.unref(editInfo).engineNum = $event;
        }, "be"),
        y: common_vendor.p({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).engineNum,
          class: "input data-v-36223569"
        })
      }, {
        z: common_vendor.unref(isEditing)
      }, common_vendor.unref(isEditing) ? {
        A: common_vendor.o(saveChanges, "ec"),
        B: common_vendor.o(cancelEdit, "48")
      } : {}, {
        C: common_vendor.sr(deviceTypeSelect, "36223569-6", {
          "k": "deviceTypeSelect"
        }),
        D: common_vendor.o(selectIcon, "ec"),
        E: common_vendor.p({
          class: "r data-v-36223569"
        }),
        F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        G: `${_ctx.u_s_b_h}px`,
        H: `${_ctx.u_s_a_i_b}px`,
        I: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36223569"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carDetail/carDetail.js.map
