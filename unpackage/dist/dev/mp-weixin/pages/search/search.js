"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  setup() {
    const keyword = common_vendor.ref("");
    const searchResults = common_vendor.ref([]);
    const hotTags = common_vendor.ref(["餐厅", "酒店", "超市", "医院", "银行", "学校", "加油站", "停车场"]);
    const searchHistory = common_vendor.ref([]);
    const lat = common_vendor.ref(0);
    const lng = common_vendor.ref(0);
    const debounceTimer = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options;
      lat.value = parseFloat(options.lat) || 39.9042;
      lng.value = parseFloat(options.lng) || 116.4074;
      loadSearchHistory();
    });
    const loadSearchHistory = () => {
      const history = common_vendor.index.getStorageSync("mapSearchHistory") || [];
      searchHistory.value = history;
    };
    const onInput = () => {
      clearTimeout(debounceTimer.value);
      debounceTimer.value = setTimeout(() => {
        if (keyword.value.trim()) {
          searchPOI(keyword.value);
        } else {
          searchResults.value = [];
        }
      }, 300);
    };
    const searchPOI = (keyword2 = null) => {
      searchResults.value = [
        new UTSJSONObject({
          id: "1",
          name: `${keyword2}测试地点1`,
          address: "北京市海淀区测试地址1",
          latitude: lat.value + (Math.random() * 0.01 - 5e-3),
          longitude: lng.value + (Math.random() * 0.01 - 5e-3)
        }),
        new UTSJSONObject({
          id: "2",
          name: `${keyword2}测试地点2`,
          address: "北京市海淀区测试地址2",
          latitude: lat.value + (Math.random() * 0.01 - 5e-3),
          longitude: lng.value + (Math.random() * 0.01 - 5e-3)
        })
      ];
    };
    const searchTag = (tag = null) => {
      keyword.value = tag;
      searchPOI(tag);
    };
    const selectLocation = (item = null) => {
      const history = common_vendor.index.getStorageSync("mapSearchHistory") || [];
      const index = history.findIndex((h = null) => {
        return h.id === item.id;
      });
      if (index >= 0) {
        history.splice(index, 1);
      }
      history.unshift(item);
      if (history.length > 10) {
        history.pop();
      }
      common_vendor.index.setStorageSync("mapSearchHistory", history);
      common_vendor.index.navigateBack(new UTSJSONObject({
        delta: 1,
        success: () => {
          const eventChannel = getOpenerEventChannel();
          eventChannel.emit("selectLocation", item);
        }
      }));
    };
    const clearKeyword = () => {
      keyword.value = "";
      searchResults.value = [];
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return new UTSJSONObject({
      keyword,
      searchResults,
      hotTags,
      searchHistory,
      onInput,
      searchTag,
      selectLocation,
      clearKeyword,
      goBack
    });
  }
});
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($setup.goBack),
    b: common_vendor.p({
      type: "arrowleft",
      size: "20"
    }),
    c: common_vendor.o([($event) => $setup.keyword = $event.detail.value, (...args) => $setup.onInput && $setup.onInput(...args)]),
    d: $setup.keyword,
    e: $setup.keyword
  }, $setup.keyword ? {
    f: common_vendor.p({
      type: "clear",
      size: "20"
    }),
    g: common_vendor.o((...args) => $setup.clearKeyword && $setup.clearKeyword(...args))
  } : {}, {
    h: common_vendor.f($setup.searchResults, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.address),
        c: index,
        d: common_vendor.o(($event) => $setup.selectLocation(item), index)
      };
    }),
    i: $setup.keyword && $setup.searchResults.length === 0
  }, $setup.keyword && $setup.searchResults.length === 0 ? {} : {}, {
    j: !$setup.keyword
  }, !$setup.keyword ? {
    k: common_vendor.f($setup.hotTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: "tag" + index,
        c: common_vendor.o(($event) => $setup.searchTag(tag), "tag" + index)
      };
    }),
    l: common_vendor.f($setup.searchHistory, (item, index, i0) => {
      return {
        a: "3acfd12e-2-" + i0,
        b: common_vendor.t(item.name),
        c: "his" + index,
        d: common_vendor.o(($event) => $setup.selectLocation(item), "his" + index)
      };
    }),
    m: common_vendor.p({
      type: "time",
      size: "16",
      color: "#999"
    })
  } : {}, {
    n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
