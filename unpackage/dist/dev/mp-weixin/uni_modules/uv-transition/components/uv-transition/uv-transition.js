"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvTransition_components_uvTransition_createAnimation = require("./createAnimation.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-transition",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin],
  emits: ["click", "change"],
  props: {
    // 是否展示组件
    show: {
      type: Boolean,
      default: false
    },
    // 使用的动画模式
    mode: {
      type: [Array, String, null],
      default() {
        return "fade";
      }
    },
    // 动画的执行时间，单位ms
    duration: {
      type: [String, Number],
      default: 300
    },
    // 使用的动画过渡函数
    timingFunction: {
      type: String,
      default: "ease-out"
    },
    customClass: {
      type: String,
      default: ""
    },
    // nvue模式下 是否直接显示，在uv-list等cell下面使用就需要设置
    cellChild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      transform: "",
      opacity: 1,
      animationData: new UTSJSONObject({}),
      durationTime: 300,
      config: new UTSJSONObject({})
    };
  },
  watch: {
    show: new UTSJSONObject({
      handler(newVal = null) {
        if (newVal) {
          this.open();
        } else {
          if (this.isShow) {
            this.close();
          }
        }
      },
      immediate: true
    })
  },
  computed: {
    // 初始化动画条件
    transformStyles() {
      const style = new UTSJSONObject(Object.assign(Object.assign({ transform: this.transform, opacity: this.opacity }, this.$uv.addStyle(this.customStyle)), { "transition-duration": `${this.duration / 1e3}s` }));
      return this.$uv.addStyle(style, "string");
    }
  },
  created() {
    this.config = {
      duration: this.duration,
      timingFunction: this.timingFunction,
      transformOrigin: "50% 50%",
      delay: 0
    };
    this.durationTime = this.duration;
  },
  methods: {
    /**
     *  ref 触发 初始化动画
     */
    init(obj = new UTSJSONObject({})) {
      if (obj.duration) {
        this.durationTime = obj.duration;
      }
      this.animation = uni_modules_uvTransition_components_uvTransition_createAnimation.createAnimation(Object.assign(this.config, obj), this);
    },
    /**
     * 点击组件触发回调
     */
    onClick() {
      this.$emit("click", new UTSJSONObject({
        detail: this.isShow
      }));
    },
    /**
     * ref 触发 动画分组
     * @param {Object} obj
     */
    step(obj = null, config = new UTSJSONObject({})) {
      if (!this.animation)
        return null;
      for (let i in obj) {
        try {
          if (typeof obj[i] === "object") {
            this.animation[i](...obj[i]);
          } else {
            this.animation[i](obj[i]);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at uni_modules/uv-transition/components/uv-transition/uv-transition.vue:166", `方法 ${i} 不存在`);
        }
      }
      this.animation.step(config);
      return this;
    },
    /**
     *  ref 触发 执行动画
     */
    run(fn = null) {
      if (!this.animation)
        return null;
      this.animation.run(fn);
    },
    // 开始过度动画
    open() {
      clearTimeout(this.timer);
      this.transform = "";
      this.isShow = true;
      let _a = this.styleInit(false), opacity = _a.opacity, transform = _a.transform;
      if (typeof opacity !== "undefined") {
        this.opacity = opacity;
      }
      this.transform = transform;
      this.$nextTick(() => {
        this.timer = setTimeout(() => {
          this.animation = uni_modules_uvTransition_components_uvTransition_createAnimation.createAnimation(this.config, this);
          this.tranfromInit(false).step();
          this.animation.run();
          this.$emit("change", new UTSJSONObject({
            detail: this.isShow
          }));
        }, 20);
      });
    },
    // 关闭过渡动画
    close(type = null) {
      if (!this.animation)
        return null;
      this.tranfromInit(true).step().run(() => {
        this.isShow = false;
        this.animationData = null;
        this.animation = null;
        let _a = this.styleInit(false), opacity = _a.opacity, transform = _a.transform;
        this.opacity = opacity || 1;
        this.transform = transform;
        this.$emit("change", new UTSJSONObject({
          detail: this.isShow
        }));
      });
    },
    // 处理动画开始前的默认样式
    styleInit(type = null) {
      let styles = new UTSJSONObject({
        transform: ""
      });
      let buildStyle = (type2 = null, mode = null) => {
        if (mode === "fade") {
          styles.opacity = this.animationType(type2)[mode];
        } else {
          styles.transform += this.animationType(type2)[mode] + " ";
        }
      };
      if (typeof this.mode === "string") {
        buildStyle(type, this.mode);
      } else {
        this.mode.forEach((mode = null) => {
          buildStyle(type, mode);
        });
      }
      return styles;
    },
    // 处理内置组合动画
    tranfromInit(type = null) {
      let buildTranfrom = (type2 = null, mode = null) => {
        let aniNum = null;
        if (mode === "fade") {
          aniNum = type2 ? 0 : 1;
        } else {
          aniNum = type2 ? "-100%" : "0";
          if (mode === "zoom-in") {
            aniNum = type2 ? 0.8 : 1;
          }
          if (mode === "zoom-out") {
            aniNum = type2 ? 1.2 : 1;
          }
          if (mode === "slide-right") {
            aniNum = type2 ? "100%" : "0";
          }
          if (mode === "slide-bottom") {
            aniNum = type2 ? "100%" : "0";
          }
        }
        this.animation[this.animationMode()[mode]](aniNum);
      };
      if (typeof this.mode === "string") {
        buildTranfrom(type, this.mode);
      } else {
        this.mode.forEach((mode = null) => {
          buildTranfrom(type, mode);
        });
      }
      return this.animation;
    },
    animationType(type = null) {
      return new UTSJSONObject({
        fade: type ? 1 : 0,
        "slide-top": `translateY(${type ? "0" : "-100%"})`,
        "slide-right": `translateX(${type ? "0" : "100%"})`,
        "slide-bottom": `translateY(${type ? "0" : "100%"})`,
        "slide-left": `translateX(${type ? "0" : "-100%"})`,
        "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
        "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
      });
    },
    // 内置动画类型与实际动画对应字典
    animationMode() {
      return new UTSJSONObject({
        fade: "opacity",
        "slide-top": "translateY",
        "slide-right": "translateX",
        "slide-bottom": "translateY",
        "slide-left": "translateX",
        "zoom-in": "scale",
        "zoom-out": "scale"
      });
    },
    // 驼峰转中横线
    toLine(name = null) {
      return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isShow
  }, $data.isShow ? {
    b: common_vendor.sei(common_vendor.gei(_ctx, "", "r0-42493d05"), "view", "ani"),
    c: $data.animationData,
    d: common_vendor.n($props.customClass),
    e: common_vendor.s($options.transformStyles),
    f: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-transition/components/uv-transition/uv-transition.js.map
