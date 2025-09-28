"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeSvg_components_lSvg_utils = require("./utils.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-svg",
  props: {
    src: { default: "" },
    color: { default: "" },
    web: { type: Boolean, default: false },
    inherit: { type: Boolean, default: false }
  },
  emits: ["load", "error"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const path = common_vendor.ref(props.src);
    common_vendor.ref(null);
    const isInherit = common_vendor.computed(() => {
      return props.color != "";
    });
    common_vendor.ref("");
    const formatUrl = (url, action) => {
      if (url.indexOf(`'`) > 0)
        return `${action}("${url}")`;
      return `${action}('${url}')`;
    };
    const styles = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      if (path.value != "") {
        style.set("--svg", formatUrl(path.value, "url"));
      }
      if (props.color != "") {
        style.set("color", props.color);
      }
      return style;
    });
    const errorDetaill = new UTSJSONObject({
      errMsg: "加载失败"
    });
    const errorEvent = new UTSJSONObject({
      type: "error",
      detaill: errorDetaill
    });
    const onError = () => {
      emit("error", errorEvent);
    };
    const onLoad = (e) => {
      const detail = new UTSJSONObject({
        width: 512,
        height: 512
      });
      const loadEvent = new UTSJSONObject({
        type: "load",
        detail
      });
      emit("load", loadEvent);
    };
    common_vendor.watchEffect(() => {
      if (props.src == "")
        return null;
      if (props.src.startsWith("<svg")) {
        path.value = uni_modules_limeSvg_components_lSvg_utils.svgToDataUrl(props.src);
      } else if (props.src.startsWith("/static")) {
        uni_modules_limeSvg_components_lSvg_utils.pathToDataUrl(props.src).then((res = null) => {
          path.value = res;
        }).catch((err = null) => {
          emit("error", errorEvent);
          common_vendor.index.__f__("warn", "at uni_modules/lime-svg/components/l-svg/l-svg.uvue:264", "[lime-svg]" + props.src + UTS.JSON.stringify(err));
        });
      } else {
        path.value = props.src;
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.unref(path),
        b: common_vendor.o(onError),
        c: common_vendor.o(onLoad),
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        e: common_vendor.unref(isInherit) ? 1 : "",
        f: common_vendor.s(common_vendor.unref(styles))
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-svg/components/l-svg/l-svg.js.map
