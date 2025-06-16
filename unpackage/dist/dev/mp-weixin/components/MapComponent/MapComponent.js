"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MapComponent",
  props: {
    center: new UTSJSONObject({
      type: Object,
      default: () => {
        return new UTSJSONObject({ latitude: 39.90469, longitude: 116.40717 });
      }
    }),
    mapScale: new UTSJSONObject({
      type: Number,
      default: 13
    }),
    polygons: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    }),
    markers: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    }),
    polyline: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    }),
    isDrawing: new UTSJSONObject({
      type: Boolean,
      default: false
    }),
    currentMode: new UTSJSONObject({
      type: String,
      default: "draw"
    })
  },
  emits: ["map-tap"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const handleMapTap = (e = null) => {
      if (props.isDrawing && props.currentMode === "draw") {
        emit("map-tap", new UTSJSONObject({
          latitude: e.detail.latitude,
          longitude: e.detail.longitude
        }));
      }
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sei("fenceMap", "map"),
        b: __props.center.latitude,
        c: __props.center.longitude,
        d: __props.polygons,
        e: __props.markers,
        f: __props.polyline,
        g: __props.mapScale,
        h: common_vendor.o(handleMapTap),
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/MapComponent/MapComponent.js.map
