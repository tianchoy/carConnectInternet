"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_i_grid_1 = common_vendor.resolveComponent("i-grid");
  const _easycom_i_popup_1 = common_vendor.resolveComponent("i-popup");
  (_easycom_i_grid_1 + _easycom_i_popup_1)();
}
const _easycom_i_grid = () => "../../uni_modules/i-ui-x/components/i-grid/i-grid.js";
const _easycom_i_popup = () => "../../uni_modules/i-ui-x/components/i-popup/i-popup.js";
if (!Math) {
  (_easycom_i_grid + _easycom_i_popup)();
}
class CarIconItem extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          name: { type: String, optional: false },
          text: { type: String, optional: false },
          image: { type: String, optional: false }
        };
      },
      name: "CarIconItem"
    };
  }
  constructor(options, metadata = CarIconItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.name = this.__props__.name;
    this.text = this.__props__.text;
    this.image = this.__props__.image;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "car-icons",
  props: {
    title: { default: "请选择图标" },
    col: { default: 4 },
    iconSize: { default: 40 },
    safeAreaInsetBottom: { type: Boolean, default: true }
  },
  emits: ["select"],
  setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const visible = common_vendor.ref(false);
    const iconList = [
      new CarIconItem({ name: "car", text: "轿车", image: "/static/cars/online/car.png" }),
      new CarIconItem({ name: "suv", text: "越野车", image: "/static/cars/online/suv.png" }),
      new CarIconItem({ name: "bus", text: "公交车", image: "/static/cars/online/bus.png" }),
      new CarIconItem({ name: "huoche", text: "货车", image: "/static/cars/online/huoche.png" }),
      new CarIconItem({ name: "train", text: "火车", image: "/static/cars/online/train.png" }),
      new CarIconItem({ name: "diandong", text: "电动车", image: "/static/cars/online/diandong.png" }),
      new CarIconItem({ name: "moto", text: "摩托车", image: "/static/cars/online/moto.png" }),
      new CarIconItem({ name: "bike", text: "自行车", image: "/static/cars/online/bike.png" }),
      new CarIconItem({ name: "sanlun", text: "三轮车", image: "/static/cars/online/sanlun.png" }),
      new CarIconItem({ name: "tuola", text: "拖拉机", image: "/static/cars/online/tuola.png" }),
      new CarIconItem({ name: "wajue", text: "挖掘机", image: "/static/cars/online/wajue.png" }),
      new CarIconItem({ name: "tuiche", text: "手推车", image: "/static/cars/online/tuiche.png" }),
      new CarIconItem({ name: "baby", text: "婴儿车", image: "/static/cars/online/baby.png" }),
      new CarIconItem({ name: "muma", text: "木马", image: "/static/cars/online/muma.png" }),
      new CarIconItem({ name: "tank", text: "坦克", image: "/static/cars/online/tank.png" }),
      new CarIconItem({ name: "zhuangjia", text: "装甲车", image: "/static/cars/online/zhuangjia.png" }),
      new CarIconItem({ name: "plan", text: "飞机", image: "/static/cars/online/plan.png" }),
      new CarIconItem({ name: "hangmu", text: "航母", image: "/static/cars/online/hangmu.png" }),
      new CarIconItem({ name: "junjian", text: "军舰", image: "/static/cars/online/junjian.png" }),
      new CarIconItem({ name: "walk", text: "步行", image: "/static/cars/online/walk.png" })
    ];
    common_vendor.computed(() => {
      const cols = props.col > 0 ? props.col : 4;
      return 100 / cols + "%";
    });
    const close = () => {
      visible.value = false;
    };
    const handleSelect = (item = null) => {
      const selected = item;
      common_vendor.index.__f__("log", "at components/car-icons/car-icons.uvue:97", "选择的图标:", selected);
      emit("select", selected);
      close();
    };
    const handlePopupClick = () => {
      common_vendor.index.__f__("log", "at components/car-icons/car-icons.uvue:104", "Popup clicked");
    };
    const open = () => {
      visible.value = true;
    };
    const getIconByName = (name) => {
      return common_vendor.UTS.arrayFind(iconList, (item) => {
        return item.name === name;
      });
    };
    __expose({
      open,
      close,
      iconList,
      getIconByName
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.o(($event) => {
          return handleSelect($event);
        }, "55"),
        b: common_vendor.p({
          items: iconList,
          col: 4,
          itemHeight: "88",
          round: "8",
          imageSize: 30,
          iconColor: "#3c9cff",
          textColor: "#606266",
          showBorder: true,
          class: "data-v-a1ffb157"
        }),
        c: common_vendor.gei(_ctx, ""),
        d: common_vendor.o(close, "db"),
        e: common_vendor.o(handlePopupClick, "a5"),
        f: common_vendor.p({
          show: visible.value,
          title: _ctx.title,
          mode: "bottom",
          safeBottom: _ctx.safeAreaInsetBottom,
          showClose: true,
          id: common_vendor.gei(_ctx, ""),
          class: "data-v-a1ffb157"
        }),
        g: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a1ffb157"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/car-icons/car-icons.js.map
