"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_popup_1 = common_vendor.resolveComponent("uv-popup");
  (_easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1 + _easycom_uv_popup_1)();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid + _easycom_uv_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "car-icons",
  props: {
    title: { default: "请选择图标" },
    col: { default: 5 },
    iconSize: { default: 50 },
    safeAreaInsetBottom: { type: Boolean, default: true }
  },
  emits: ["select"],
  setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const emit = __emit;
    const iconList = [
      new common_vendor.UTSJSONObject({ name: "car", title: "轿车", img: "/static/cars/online/car.png" }),
      new common_vendor.UTSJSONObject({ name: "bus", title: "公交车", img: "/static/cars/online/bus.png" }),
      new common_vendor.UTSJSONObject({ name: "bike", title: "自行车", img: "/static/cars/online/bike.png" }),
      new common_vendor.UTSJSONObject({ name: "moto", title: "摩托车", img: "/static/cars/online/moto.png" }),
      new common_vendor.UTSJSONObject({ name: "diandong", title: "电动车", img: "/static/cars/online/diandong.png" }),
      new common_vendor.UTSJSONObject({ name: "huoche", title: "货车", img: "/static/cars/online/huoche.png" }),
      new common_vendor.UTSJSONObject({ name: "sanlun", title: "三轮车", img: "/static/cars/online/sanlun.png" }),
      new common_vendor.UTSJSONObject({ name: "tuola", title: "拖拉机", img: "/static/cars/online/tuola.png" }),
      new common_vendor.UTSJSONObject({ name: "suv", title: "越野车", img: "/static/cars/online/suv.png" }),
      new common_vendor.UTSJSONObject({ name: "baby", title: "婴儿车", img: "/static/cars/online/baby.png" }),
      new common_vendor.UTSJSONObject({ name: "tank", title: "坦克", img: "/static/cars/online/tank.png" }),
      new common_vendor.UTSJSONObject({ name: "zhuangjia", title: "装甲车", img: "/static/cars/online/zhuangjia.png" }),
      new common_vendor.UTSJSONObject({ name: "wajue", title: "挖掘机", img: "/static/cars/online/wajue.png" }),
      new common_vendor.UTSJSONObject({ name: "plan", title: "飞机", img: "/static/cars/online/plan.png" }),
      new common_vendor.UTSJSONObject({ name: "walk", title: "步行", img: "/static/cars/online/walk.png" }),
      new common_vendor.UTSJSONObject({ name: "muma", title: "木马", img: "/static/cars/online/muma.png" }),
      new common_vendor.UTSJSONObject({ name: "hangmu", title: "航母", img: "/static/cars/online/hangmu.png" }),
      new common_vendor.UTSJSONObject({ name: "junjian", title: "军舰", img: "/static/cars/online/junjian.png" }),
      new common_vendor.UTSJSONObject({ name: "tuiche", title: "手推车", img: "/static/cars/online/tuiche.png" }),
      new common_vendor.UTSJSONObject({ name: "train", title: "火车", img: "/static/cars/online/train.png" })
    ];
    const popupRef = common_vendor.ref(null);
    const handleSelect = (item = null) => {
      emit("select", item);
      close();
    };
    const open = () => {
      var _a2;
      (_a2 = popupRef.value) === null || _a2 === void 0 ? null : _a2.open();
    };
    const close = () => {
      var _a2;
      (_a2 = popupRef.value) === null || _a2 === void 0 ? null : _a2.close();
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
        a: common_vendor.f(iconList, (item, index, i0) => {
          return {
            a: "a1ffb157-3-" + i0 + "," + ("a1ffb157-2-" + i0),
            b: common_vendor.p({
              customStyle: {
                paddingTop: "20rpx"
              },
              name: item.img,
              size: _ctx.iconSize,
              class: "data-v-a1ffb157"
            }),
            c: common_vendor.t(item.title),
            d: index,
            e: common_vendor.o(($event) => {
              return handleSelect(item);
            }, index),
            f: "a1ffb157-2-" + i0 + ",a1ffb157-1"
          };
        }),
        b: common_vendor.p({
          class: "data-v-a1ffb157"
        }),
        c: common_vendor.p({
          col: _ctx.col,
          class: "data-v-a1ffb157"
        }),
        d: common_vendor.sr(popupRef, "a1ffb157-0", {
          "k": "popupRef"
        }),
        e: common_vendor.gei(_ctx, ""),
        f: `${_ctx.u_s_b_h}px`,
        g: common_vendor.p({
          title: _ctx.title,
          mode: "bottom",
          safeAreaInsetBottom: _ctx.safeAreaInsetBottom,
          id: common_vendor.gei(_ctx, ""),
          class: "r data-v-a1ffb157",
          style: common_vendor.normalizeStyle({
            "--status-bar-height": `${_ctx.u_s_b_h}px`
          })
        }),
        h: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a1ffb157"]]);
wx.createComponent(Component);
