"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
const utils_toast = require("../../../utils/toast.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_icon_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_icon = () => "../../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_button = () => "../../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_icon + _easycom_i_button + common_vendor.unref(carIcons) + _easycom_app_toast)();
}
const carIcons = () => "../../../components/car-icons/car-icons.js";
class VehicleEditInfo extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          deviceName: { type: String, optional: false },
          carType: { type: String, optional: false },
          carTypeValue: { type: String, optional: false },
          plateNo: { type: String, optional: false },
          carVin: { type: String, optional: false },
          engineNum: { type: String, optional: false }
        };
      },
      name: "VehicleEditInfo"
    };
  }
  constructor(options, metadata = VehicleEditInfo.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.deviceName = this.__props__.deviceName;
    this.carType = this.__props__.carType;
    this.carTypeValue = this.__props__.carTypeValue;
    this.plateNo = this.__props__.plateNo;
    this.carVin = this.__props__.carVin;
    this.engineNum = this.__props__.engineNum;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carDetail",
  setup(__props) {
    const deviceId = common_vendor.ref("");
    const carInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const isEditing = common_vendor.ref(false);
    const saving = common_vendor.ref(false);
    const loadingDetail = common_vendor.ref(false);
    const detailLoaded = common_vendor.ref(false);
    const carIconSelectorVisible = common_vendor.ref(false);
    const editInfo = common_vendor.ref(new VehicleEditInfo({
      deviceName: "",
      carType: "",
      carTypeValue: "",
      plateNo: "",
      carVin: "",
      engineNum: ""
    }));
    const carTitle = common_vendor.computed(() => {
      return carInfo.value.getString("carType", "未知");
    });
    const formattedPlateNo = common_vendor.computed(() => {
      return carInfo.value.getString("plateNo", "京A");
    });
    const createEditInfo = () => {
      const carType = carInfo.value.getString("carType", "");
      return new VehicleEditInfo({
        deviceName: carInfo.value.getString("deviceName", ""),
        carType,
        carTypeValue: carType,
        plateNo: carInfo.value.getString("plateNo", ""),
        carVin: carInfo.value.getString("carVin", ""),
        engineNum: carInfo.value.getString("engineNum", "")
      });
    };
    const toggleEdit = () => {
      if (loadingDetail.value || saving.value)
        return null;
      if (!detailLoaded.value || deviceId.value.length == 0) {
        utils_toast.showAppToast({ title: "车辆信息尚未加载完成", icon: "none" });
        return null;
      }
      editInfo.value = createEditInfo();
      isEditing.value = true;
    };
    const updateCarIconSelectorVisible = (visible) => {
      carIconSelectorVisible.value = visible;
    };
    const openCarIconSelector = () => {
      if (!saving.value)
        carIconSelectorVisible.value = true;
    };
    const selectIcon = (item) => {
      editInfo.value.carType = item.getString("name", "");
      editInfo.value.carTypeValue = item.getString("text", "");
      carIconSelectorVisible.value = false;
    };
    const normalizePlateNo = (value) => {
      return value.replace(/\s/g, "");
    };
    const cancelEdit = () => {
      if (saving.value)
        return null;
      carIconSelectorVisible.value = false;
      isEditing.value = false;
    };
    const saveChanges = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (saving.value)
          return Promise.resolve(null);
        if (deviceId.value.length == 0) {
          utils_toast.showAppToast({ title: "设备ID不能为空", icon: "none" });
          return Promise.resolve(null);
        }
        const plateNo = normalizePlateNo(editInfo.value.plateNo);
        const payload = new common_vendor.UTSJSONObject({
          deviceId: deviceId.value,
          deviceName: editInfo.value.deviceName,
          carType: editInfo.value.carType,
          plateNo,
          carVin: editInfo.value.carVin,
          engineNum: editInfo.value.engineNum
        });
        saving.value = true;
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "保存中...", mask: true }));
        try {
          const res = yield api_request.editDeviceInfo(payload);
          if (res.code == 0) {
            carInfo.value = payload;
            editInfo.value.plateNo = plateNo;
            isEditing.value = false;
            carIconSelectorVisible.value = false;
            utils_toast.showAppToast({ title: "保存成功", icon: "success" });
          } else {
            utils_toast.showAppToast({ title: res.msg || "保存失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/userCenter/carDetail/carDetail.uvue:190", "保存车辆信息失败:", error);
          utils_toast.showAppToast({ title: "保存失败，请重试", icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
          saving.value = false;
        }
      });
    };
    const loadCarListData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value.length == 0)
          return Promise.resolve(null);
        loadingDetail.value = true;
        try {
          const res = yield api_request.getDeviceDetail(deviceId.value);
          if (res.code == 0 && res.data != null) {
            carInfo.value = res.data;
            detailLoaded.value = true;
          } else {
            utils_toast.showAppToast({ title: res.msg || "获取车辆详情失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/userCenter/carDetail/carDetail.uvue:210", "获取车辆详情失败:", error);
          utils_toast.showAppToast({ title: "获取车辆详情失败", icon: "none" });
        } finally {
          loadingDetail.value = false;
        }
      });
    };
    common_vendor.onLoad((option) => {
      const id = option.deviceId;
      if (id != null) {
        deviceId.value = id;
        loadCarListData();
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.o(toggleEdit, "a9"),
        b: common_vendor.p({
          title: "车辆详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: !isEditing.value && !loadingDetail.value,
          isIcon: true,
          Icon: "/static/edit-pen.png",
          class: "data-v-36223569"
        }),
        c: common_vendor.t(carInfo.value.getString("deviceId", "")),
        d: !isEditing.value
      }, !isEditing.value ? {
        e: common_vendor.t(carInfo.value.getString("deviceName", ""))
      } : {
        f: common_vendor.o(($event) => {
          return editInfo.value.deviceName = $event;
        }, "fd"),
        g: common_vendor.p({
          border: "none",
          inputAlign: "right",
          placeholder: "请输入设备名称",
          modelValue: editInfo.value.deviceName,
          class: "input data-v-36223569"
        })
      }, {
        h: !isEditing.value
      }, !isEditing.value ? {
        i: common_vendor.t(carTitle.value)
      } : {
        j: common_vendor.t(editInfo.value.carTypeValue || "请选择车标"),
        k: editInfo.value.carTypeValue.length == 0 ? 1 : "",
        l: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "18",
          class: "data-v-36223569"
        }),
        m: common_vendor.o(openCarIconSelector, "09")
      }, {
        n: !isEditing.value
      }, !isEditing.value ? {
        o: common_vendor.t(formattedPlateNo.value)
      } : {
        p: common_vendor.o(($event) => {
          return editInfo.value.plateNo = $event;
        }, "03"),
        q: common_vendor.p({
          border: "none",
          inputAlign: "right",
          placeholder: "请输入车牌号",
          modelValue: editInfo.value.plateNo,
          class: "input data-v-36223569"
        })
      }, {
        r: !isEditing.value
      }, !isEditing.value ? {
        s: common_vendor.t(carInfo.value.getString("carVin", ""))
      } : {
        t: common_vendor.o(($event) => {
          return editInfo.value.carVin = $event;
        }, "70"),
        v: common_vendor.p({
          border: "none",
          inputAlign: "right",
          placeholder: "请输入车架号",
          modelValue: editInfo.value.carVin,
          class: "input data-v-36223569"
        })
      }, {
        w: !isEditing.value
      }, !isEditing.value ? {
        x: common_vendor.t(carInfo.value.getString("engineNum", ""))
      } : {
        y: common_vendor.o(($event) => {
          return editInfo.value.engineNum = $event;
        }, "59"),
        z: common_vendor.p({
          border: "none",
          inputAlign: "right",
          placeholder: "请输入发动机号",
          modelValue: editInfo.value.engineNum,
          class: "input data-v-36223569"
        })
      }, {
        A: isEditing.value
      }, isEditing.value ? {
        B: common_vendor.o(saveChanges, "cf"),
        C: common_vendor.p({
          type: "primary",
          loading: saving.value,
          class: "action-button save-btn data-v-36223569"
        }),
        D: common_vendor.o(cancelEdit, "75"),
        E: common_vendor.p({
          disabled: saving.value,
          class: "action-button cancel-btn data-v-36223569"
        })
      } : {}, {
        F: common_vendor.o(updateCarIconSelectorVisible, "be"),
        G: common_vendor.o(selectIcon, "f4"),
        H: common_vendor.p({
          show: carIconSelectorVisible.value,
          class: "data-v-36223569"
        }),
        I: `${_ctx.u_s_b_h}px`,
        J: `${_ctx.u_s_a_i_b}px`,
        K: common_vendor.p({
          class: "data-v-36223569"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36223569"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/carDetail/carDetail.js.map
