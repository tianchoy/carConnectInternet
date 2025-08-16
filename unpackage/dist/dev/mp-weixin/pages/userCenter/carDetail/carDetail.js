"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_car_number_input_1 = common_vendor.resolveComponent("car-number-input");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_car_number_input_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_car_number_input = () => "../../../uni_modules/car-number-input/components/car-number-input/car-number-input.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_car_number_input)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carDetail",
  setup(__props) {
    const deviceId = common_vendor.ref("");
    common_vendor.ref(new UTSJSONObject({}));
    const isEditing = common_vendor.ref(false);
    const carInfo = common_vendor.ref(new UTSJSONObject({}));
    const editInfo = common_vendor.ref(new UTSJSONObject({}));
    const handlePlateNumberChange = (e) => {
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
        common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:85", res);
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
      common_vendor.index.__f__("log", "at pages/userCenter/carDetail/carDetail.uvue:98", "option", option);
      if (option.deviceId != null) {
        deviceId.value = option.deviceId;
        loadCarListData();
      } else {
        common_vendor.index.__f__("error", "at pages/userCenter/carDetail/carDetail.uvue:104", "deviceId is null");
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
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.o(toggleEdit),
        b: common_vendor.p(new UTSJSONObject({
          title: "车辆详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          Icon: "edit-pen"
        })),
        c: common_vendor.t(common_vendor.unref(carInfo).deviceId),
        d: !common_vendor.unref(isEditing)
      }), !common_vendor.unref(isEditing) ? new UTSJSONObject({
        e: common_vendor.t(common_vendor.unref(carInfo).carType)
      }) : new UTSJSONObject({
        f: common_vendor.o(($event = null) => {
          return common_vendor.unref(editInfo).carType = $event;
        }),
        g: common_vendor.p(new UTSJSONObject({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).carType
        }))
      }), new UTSJSONObject({
        h: !common_vendor.unref(isEditing)
      }), !common_vendor.unref(isEditing) ? new UTSJSONObject({
        i: common_vendor.t(common_vendor.unref(carInfo).plateNo)
      }) : new UTSJSONObject({
        j: common_vendor.o(handlePlateNumberChange),
        k: common_vendor.p(new UTSJSONObject({
          defaultStr: common_vendor.unref(formattedPlateNo)
        }))
      }), new UTSJSONObject({
        l: !common_vendor.unref(isEditing)
      }), !common_vendor.unref(isEditing) ? new UTSJSONObject({
        m: common_vendor.t(common_vendor.unref(carInfo).carVin)
      }) : new UTSJSONObject({
        n: common_vendor.o(($event = null) => {
          return common_vendor.unref(editInfo).carVin = $event;
        }),
        o: common_vendor.p(new UTSJSONObject({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).carVin
        }))
      }), new UTSJSONObject({
        p: !common_vendor.unref(isEditing)
      }), !common_vendor.unref(isEditing) ? new UTSJSONObject({
        q: common_vendor.t(common_vendor.unref(carInfo).engineNum)
      }) : new UTSJSONObject({
        r: common_vendor.o(($event = null) => {
          return common_vendor.unref(editInfo).engineNum = $event;
        }),
        s: common_vendor.p(new UTSJSONObject({
          border: "surround",
          inputAlign: "right",
          modelValue: common_vendor.unref(editInfo).engineNum
        }))
      }), new UTSJSONObject({
        t: common_vendor.unref(isEditing)
      }), common_vendor.unref(isEditing) ? new UTSJSONObject({
        v: common_vendor.o(saveChanges),
        w: common_vendor.o(cancelEdit)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36223569"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carDetail/carDetail.js.map
