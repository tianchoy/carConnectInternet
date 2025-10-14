"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_popup_1 = common_vendor.resolveComponent("uv-popup");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1 + _easycom_uv_popup_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid + _easycom_uv_popup + _easycom_uv_form + _easycom_uv_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const deviceTypeSelect = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const carInfo = common_vendor.ref({
      deviceName: "",
      imei: "",
      deviceType: "",
      deviceTypeValue: "",
      plateNo: "",
      carType: ""
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
      }),
      new UTSJSONObject({
        name: "suv",
        title: "越野车",
        img: "/static/cars/online/suv.png"
      }),
      new UTSJSONObject({
        name: "baby",
        title: "婴儿车",
        img: "/static/cars/online/baby.png"
      }),
      new UTSJSONObject({
        name: "tank",
        title: "坦克",
        img: "/static/cars/online/tank.png"
      }),
      new UTSJSONObject({
        name: "zhuangjia",
        title: "装甲车",
        img: "/static/cars/online/zhuangjia.png"
      }),
      new UTSJSONObject({
        name: "wajue",
        title: "挖掘机",
        img: "/static/cars/online/wajue.png"
      }),
      new UTSJSONObject({
        name: "plan",
        title: "飞机",
        img: "/static/cars/online/plan.png"
      }),
      new UTSJSONObject({
        name: "walk",
        title: "步行",
        img: "/static/cars/online/walk.png"
      })
    ];
    common_vendor.ref([]);
    const scanCode = () => {
      common_vendor.index.navigateTo({
        url: "/pages/scancode/scancode"
      });
    };
    const handleScanResult = (data) => {
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:171", "接收到扫码结果:", data.result);
      if (data.result.length === 15) {
        carInfo.value.imei = "0" + data.result.slice(4, 15);
      } else if (data.result.length === 11) {
        carInfo.value.imei = "0" + data.result;
      } else {
        common_vendor.index.showToast({
          title: "请输入正确的设备ID",
          icon: "none"
        });
      }
    };
    const rules = new UTSJSONObject({
      imei: [
        new UTSJSONObject({
          required: true,
          message: "请输入设备ID",
          trigger: ["blur", "change"]
        }),
        new UTSJSONObject({
          min: 8,
          max: 18,
          message: "ID长度应在8-18位之间",
          trigger: ["blur", "change"]
        })
      ],
      deviceType: [
        new UTSJSONObject({
          required: true,
          message: "请选择设备图标",
          trigger: ["blur", "change"]
        })
      ]
    });
    const selectIcon = (item = null) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:209", item.name);
      carInfo.value.deviceType = item.name;
      carInfo.value.deviceTypeValue = item.title;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.close();
    };
    const deviceTypeSelectFun = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
      });
    };
    const refreshDeviceList = () => {
      common_vendor.index.$emit("refreshDeviceList");
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:242", "已触发首页设备列表刷新");
    };
    const submit = () => {
      var _a;
      (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then(() => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          loading.value = true;
          try {
            const submitData = new UTSJSONObject({
              deviceName: carInfo.value.deviceName,
              imei: carInfo.value.imei,
              carType: carInfo.value.deviceType
              // plateNo: carInfo.value.plateNo
            });
            common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:256", submitData);
            const res = yield api_request.addDevice(submitData);
            if (res.code == 0) {
              common_vendor.index.showToast({
                title: "添加成功",
                icon: "success"
              });
              common_vendor.index.setStorageSync("needRefreshHome", true);
              refreshDeviceList();
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            } else {
              common_vendor.index.showToast({
                title: res.msg || "添加失败",
                icon: "none",
                duration: 2e3
              });
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:282", "添加设备错误:", error);
            common_vendor.index.showToast({
              title: "请求失败，请稍后重试",
              icon: "none"
            });
          } finally {
            loading.value = false;
          }
        });
      }).catch((errors = null) => {
        common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:291", "验证错误:", errors);
        common_vendor.index.showToast({
          title: "请检查表单",
          icon: "none"
        });
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.$on("scanCodeResult", handleScanResult);
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("scanCodeResult", handleScanResult);
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "添加车辆",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(($event) => {
          return carInfo.value.deviceName = $event;
        }),
        c: common_vendor.p({
          border: "none",
          placeholder: "请输入设备名称",
          modelValue: carInfo.value.deviceName
        }),
        d: common_vendor.p({
          label: "设备名称",
          labelWidth: "150rpx",
          prop: "deviceName",
          borderBottom: true
        }),
        e: common_vendor.o(scanCode),
        f: common_vendor.p({
          name: "scan",
          size: "25"
        }),
        g: common_vendor.o(($event) => {
          return carInfo.value.imei = $event;
        }),
        h: common_vendor.p({
          border: "none",
          placeholder: "请输入设备ID(必填)",
          modelValue: carInfo.value.imei
        }),
        i: common_vendor.p({
          label: "*设备ID",
          labelWidth: "150rpx",
          prop: "imei",
          borderBottom: true
        }),
        j: common_vendor.o(($event) => {
          return carInfo.value.deviceTypeValue = $event;
        }),
        k: common_vendor.p({
          border: "none",
          disabled: true,
          disabledColor: "#fff",
          placeholder: "请选择设备图标(必选)",
          suffixIcon: "arrow-down",
          modelValue: carInfo.value.deviceTypeValue
        }),
        l: common_vendor.o(deviceTypeSelectFun),
        m: common_vendor.p({
          label: "自定义图标",
          labelWidth: "150rpx",
          prop: "deviceType",
          borderBottom: true
        }),
        n: common_vendor.f(IconList, (item, index, i0) => {
          return {
            a: "6409e324-12-" + i0 + "," + ("6409e324-11-" + i0),
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
            f: "6409e324-11-" + i0 + ",6409e324-10"
          };
        }),
        o: common_vendor.p({
          col: 5
        }),
        p: common_vendor.sr(deviceTypeSelect, "6409e324-9,6409e324-1", {
          "k": "deviceTypeSelect"
        }),
        q: common_vendor.p({
          title: "请选择图标",
          mode: "bottom"
        }),
        r: common_vendor.sr(formRef, "6409e324-1", {
          "k": "formRef"
        }),
        s: common_vendor.p({
          labelPosition: "left",
          model: carInfo.value,
          rules
        }),
        t: common_vendor.o(submit),
        v: common_vendor.p({
          type: "primary",
          loading: loading.value
        }),
        w: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6409e324"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addCar/addCar.js.map
