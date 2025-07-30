"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvBadge_components_uvBadge_props = require("../../../uv-badge/components/uv-badge/props.js");
const uni_modules_uvTabs_components_uvTabs_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-tabs",
  emits: ["click", "change"],
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvTabs_components_uvTabs_props.props],
  data() {
    return {
      firstTime: true,
      scrollLeft: 0,
      scrollViewWidth: 0,
      lineOffsetLeft: 0,
      tabsRect: new UTSJSONObject({
        left: 0
      }),
      innerCurrent: 0,
      moving: false
    };
  },
  watch: {
    current: {
      immediate: true,
      handler(newValue = null, oldValue = null) {
        if (newValue !== this.innerCurrent) {
          this.innerCurrent = newValue;
          this.$nextTick(() => {
            this.resize();
          });
        }
      }
    },
    // list变化时，重新渲染list各项信息
    list() {
      this.$nextTick(() => {
        this.resize();
      });
    }
  },
  computed: {
    textStyle() {
      return (index = null) => {
        const style = new UTSJSONObject(
          {}
          // 取当期是否激活的样式
        );
        const customeStyle = index == this.innerCurrent ? this.$uv.addStyle(this.activeStyle) : this.$uv.addStyle(this.inactiveStyle);
        if (this.list[index].disabled) {
          style.color = "#c8c9cc";
        }
        return this.$uv.deepMerge(customeStyle, style);
      };
    },
    propsBadge() {
      return uni_modules_uvBadge_components_uvBadge_props.uvBadgeProps;
    }
  },
  mounted() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      this.init();
    });
  },
  methods: {
    setLineLeft() {
      const tabItem = this.list[this.innerCurrent];
      if (!tabItem) {
        return null;
      }
      let lineOffsetLeft = this.list.slice(0, this.innerCurrent).reduce((total = null, curr = null) => {
        return total + curr.rect.width;
      }, 0);
      let lineWidth = this.$uv.getPx(this.lineWidth);
      if (this.$uv.test.number(this.lineWidth) && this.$uv.unit) {
        lineWidth = this.$uv.getPx(`${this.lineWidth}${this.$uv.unit}`);
      }
      this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - lineWidth) / 2;
      if (this.firstTime) {
        setTimeout(() => {
          this.firstTime = false;
        }, 20);
      }
    },
    // nvue下设置滑块的位置
    animation(x = null, duration = 0) {
    },
    // 点击某一个标签
    clickHandler(item = null, index = null) {
      this.$emit("click", new UTSJSONObject(Object.assign(Object.assign({}, item), { index })));
      if (item.disabled)
        return null;
      if (this.innerCurrent != index) {
        this.$emit("change", new UTSJSONObject(Object.assign(Object.assign({}, item), { index })));
      }
      this.innerCurrent = index;
      this.$nextTick(() => {
        this.resize();
      });
    },
    init() {
      this.$uv.sleep().then(() => {
        this.resize();
      });
    },
    setScrollLeft() {
      const tabRect = this.list[this.innerCurrent];
      const offsetLeft = this.list.slice(0, this.innerCurrent).reduce((total = null, curr = null) => {
        return total + curr.rect.width;
      }, 0);
      const windowWidth = this.$uv.sys().windowWidth;
      let scrollLeft = offsetLeft - (this.tabsRect.width - tabRect.rect.width) / 2 - (windowWidth - this.tabsRect.right) / 2 + this.tabsRect.left / 2;
      scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - this.tabsRect.width);
      this.scrollLeft = Math.max(0, scrollLeft);
    },
    // 获取所有标签的尺寸
    resize() {
      if (this.list.length === 0) {
        return null;
      }
      Promise.all([this.getTabsRect(), this.getAllItemRect()]).then((_a) => {
        var _b = common_vendor.__read(_a, 2), tabsRect = _b[0], _c = _b[1], itemRect = _c == void 0 ? [] : _c;
        this.tabsRect = tabsRect;
        this.scrollViewWidth = 0;
        itemRect.map((item = null, index = null) => {
          this.scrollViewWidth += item.width;
          this.list[index].rect = item;
        });
        this.setLineLeft();
        this.setScrollLeft();
      });
    },
    // 获取导航菜单的尺寸
    getTabsRect() {
      return new Promise((resolve) => {
        this.queryRect("uv-tabs__wrapper__scroll-view").then((size = null) => {
          return resolve(size);
        });
      });
    },
    // 获取所有标签的尺寸
    getAllItemRect() {
      return new Promise((resolve) => {
        const promiseAllArr = this.list.map((item = null, index = null) => {
          return this.queryRect(`uv-tabs__wrapper__nav__item-${index}`, true);
        });
        Promise.all(promiseAllArr).then((sizes = null) => {
          return resolve(sizes);
        });
      });
    },
    // 获取各个标签的尺寸
    queryRect(el = null, item = null) {
      return new Promise((resolve) => {
        this.$uvGetRect(`.${el}`).then((size = null) => {
          resolve(size);
        });
      });
    }
  }
});
if (!Array) {
  const _easycom_uv_badge2 = common_vendor.resolveComponent("uv-badge");
  _easycom_uv_badge2();
}
const _easycom_uv_badge = () => "../../../uv-badge/components/uv-badge/uv-badge.js";
if (!Math) {
  _easycom_uv_badge();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.list, (item, index, i0) => {
      return {
        a: common_vendor.t(item[_ctx.keyName]),
        b: common_vendor.n(item.disabled && "uv-tabs__wrapper__nav__item__text--disabled"),
        c: common_vendor.s($options.textStyle(index)),
        d: "fd5fcf14-0-" + i0,
        e: common_vendor.p({
          show: !!(item.badge && (item.badge.show || item.badge.isDot || item.badge.value)),
          isDot: item.badge && item.badge.isDot || $options.propsBadge.isDot,
          value: item.badge && item.badge.value || $options.propsBadge.value,
          max: item.badge && item.badge.max || $options.propsBadge.max,
          type: item.badge && item.badge.type || $options.propsBadge.type,
          showZero: item.badge && item.badge.showZero || $options.propsBadge.showZero,
          bgColor: item.badge && item.badge.bgColor || $options.propsBadge.bgColor,
          color: item.badge && item.badge.color || $options.propsBadge.color,
          shape: item.badge && item.badge.shape || $options.propsBadge.shape,
          numberType: item.badge && item.badge.numberType || $options.propsBadge.numberType,
          inverted: item.badge && item.badge.inverted || $options.propsBadge.inverted,
          customStyle: "margin-left: 4px;"
        }),
        f: common_vendor.sei("r0-fd5fcf14-" + index, "view", `uv-tabs__wrapper__nav__item-${index}`, {
          "f": 1
        }),
        g: index,
        h: common_vendor.o(($event) => $options.clickHandler(item, index), index),
        i: `uv-tabs__wrapper__nav__item-${index}`,
        j: common_vendor.n(`uv-tabs__wrapper__nav__item-${index}`),
        k: common_vendor.n(item.disabled && "uv-tabs__wrapper__nav__item--disabled")
      };
    }),
    b: common_vendor.s({
      flex: _ctx.scrollable ? "" : 1
    }),
    c: common_vendor.s(_ctx.$uv.addStyle(_ctx.itemStyle)),
    d: common_vendor.sei("r1-fd5fcf14", "view", "uv-tabs__wrapper__nav__line"),
    e: common_vendor.s({
      width: _ctx.$uv.addUnit(_ctx.lineWidth),
      transform: `translate(${$data.lineOffsetLeft}px)`,
      transitionDuration: `${$data.firstTime ? 0 : _ctx.duration}ms`,
      height: $data.firstTime ? 0 : _ctx.$uv.addUnit(_ctx.lineHeight),
      background: _ctx.lineColor,
      backgroundSize: _ctx.lineBgSize
    }),
    f: common_vendor.sei("r2-fd5fcf14", "view", "uv-tabs__wrapper__nav"),
    g: _ctx.scrollable ? "" : 1,
    h: common_vendor.sei("r3-fd5fcf14", "scroll-view", "uv-tabs__wrapper__scroll-view"),
    i: _ctx.scrollable,
    j: $data.scrollLeft,
    k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    l: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fd5fcf14"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js.map
