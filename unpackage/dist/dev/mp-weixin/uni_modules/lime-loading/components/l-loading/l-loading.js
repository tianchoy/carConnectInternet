"use strict";
const common_vendor = require("../../../../common/vendor.js");
const name = "l-loading";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-loading",
  props: {
    color: {},
    type: { default: "circular" },
    size: {},
    text: {},
    textColor: {},
    textSize: {},
    mode: { default: "raf" },
    vertical: { type: Boolean, default: false },
    animated: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const classes = common_vendor.computed(() => {
      const cls = /* @__PURE__ */ new Map();
      cls.set(name + "--" + props.type, true);
      if (props.vertical) {
        cls.set("is-vertical", props.vertical);
      } else {
        cls.set("is-horizontal", !props.vertical);
      }
      return cls;
    });
    const spinnerStyle = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      style.set("width", props.size);
      style.set("height", props.size);
      style.set("color", props.color);
      style.set("--l-play-state", props.animated ? "running" : "paused");
      return style;
    });
    const textStyle = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      if (props.textColor != null) {
        style.set("color", props.textColor);
      }
      if (props.textSize != null) {
        style.set("font-size", props.textSize);
      }
      return style;
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: _ctx.type == "ball"
      }), _ctx.type == "ball" ? new UTSJSONObject({
        b: common_vendor.s(common_vendor.unref(spinnerStyle))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        c: _ctx.type == "circular"
      }), _ctx.type == "circular" ? new UTSJSONObject({
        d: common_vendor.s(common_vendor.unref(spinnerStyle))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        e: _ctx.type == "spinner"
      }), _ctx.type == "spinner" ? new UTSJSONObject({
        f: common_vendor.f(12, (item = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: item,
            b: item
          });
        }),
        g: common_vendor.s(common_vendor.unref(spinnerStyle))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        h: _ctx.$slots["default"] != null || _ctx.text != null
      }), _ctx.$slots["default"] != null || _ctx.text != null ? new UTSJSONObject({
        i: common_vendor.t(_ctx.text),
        j: common_vendor.s(common_vendor.unref(textStyle))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        l: common_vendor.n(common_vendor.unref(classes))
      }));
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-loading/components/l-loading/l-loading.js.map
