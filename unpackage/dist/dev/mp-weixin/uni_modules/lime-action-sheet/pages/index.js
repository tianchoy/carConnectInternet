"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_l_icon_1 = common_vendor.resolveComponent("l-icon");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  (_easycom_l_icon_1 + _easycom_l_popup_1)();
}
const _easycom_l_icon = () => "../../lime-icon/components/l-icon/l-icon.js";
const _easycom_l_popup = () => "../../lime-popup/components/l-popup/l-popup.js";
if (!Math) {
  (_easycom_l_icon + _easycom_l_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    const actionItems = common_vendor.shallowRef([]);
    const description = common_vendor.shallowRef("");
    const cancelText = common_vendor.shallowRef("");
    const align = common_vendor.shallowRef("center");
    const bordered = common_vendor.shallowRef(false);
    common_vendor.shallowRef(true);
    const rowCol = common_vendor.ref(null);
    const innerValue = common_vendor.ref(false);
    let selected = common_vendor.ref(-1);
    let parentKey = common_vendor.ref(`action-sheet-1`);
    common_vendor.onLoad((options) => {
      var _a, _b, _c, _d, _g, _h, _j;
      const param = common_vendor.UTS.JSON.parseObject(`${(_a = options["param"]) !== null && _a !== void 0 ? _a : "{}"}`);
      parentKey.value = (_b = param.getString("key")) !== null && _b !== void 0 ? _b : `action-sheet-1`;
      description.value = (_c = param.getString("description")) !== null && _c !== void 0 ? _c : "";
      cancelText.value = (_d = param.getString("cancelText")) !== null && _d !== void 0 ? _d : "";
      align.value = (_g = param.getString("align")) !== null && _g !== void 0 ? _g : "center";
      bordered.value = (_h = param.getBoolean("bordered")) !== null && _h !== void 0 ? _h : false;
      rowCol.value = param.getArray("rowCol");
      const list = param.getArray("list");
      const isImage = (name = null) => {
        if (name == null)
          return false;
        return /\.(jpe?g|png|gif|bmp|webp|tiff?)$/i.test(name) || /^data:image\/(jpeg|png|gif|bmp|webp|tiff);base64,/.test(name);
      };
      actionItems.value = (_j = list === null || list === void 0 ? null : list.map((it, index) => {
        var _a2, _b2, _c2;
        return {
          label: (_a2 = it.getString("label")) !== null && _a2 !== void 0 ? _a2 : "",
          color: it.getString("color"),
          icon: it.getString("icon"),
          iconColor: it.getString("iconColor"),
          bgColor: it.getString("bgColor"),
          fontSize: (_b2 = it.getString("fontSize")) !== null && _b2 !== void 0 ? _b2 : "32rpx",
          disabled: (_c2 = it.getBoolean("disabled")) !== null && _c2 !== void 0 ? _c2 : false,
          radius: it.getString("radius"),
          __index: index,
          __isImage: isImage(it.getString("icon"))
        };
      })) !== null && _j !== void 0 ? _j : [];
      common_vendor.nextTick$1(() => {
        innerValue.value = true;
      });
    });
    const actionRowCols = common_vendor.computed(() => {
      const result = [];
      const _rowCol = rowCol.value;
      if (_rowCol == null)
        return result;
      const list = [...actionItems.value];
      const rows = _rowCol.length;
      for (let i = 0; i < rows; i++) {
        let cols = _rowCol[i];
        const row = [];
        while (cols > 0 && list.length > 0) {
          const item = common_vendor.UTS.arrayShift(list);
          cols--;
          row.push(item);
        }
        if (row.length > 0) {
          result.push(row);
        }
      }
      if (list.length > 0) {
        result.push(list);
      }
      return result;
    });
    const handleSelected = (item) => {
      if (item.disabled)
        return null;
      innerValue.value = false;
      selected.value = item.__index;
    };
    const handleCancel = () => {
      innerValue.value = false;
      selected.value = -1;
    };
    const onClose = () => {
      common_vendor.index.closeDialogPage(new common_vendor.UTSJSONObject({
        dialogPage: instance.proxy.$page,
        fail(err) {
          console.log("err", err);
        }
      }));
      common_vendor.index.$emit(parentKey.value, selected.value);
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.unref(description).length > 0
      }, common_vendor.unref(description).length > 0 ? {
        b: common_vendor.t(common_vendor.unref(description)),
        c: common_vendor.unref(align) == "left" ? 1 : ""
      } : {}, {
        d: common_vendor.unref(rowCol) == null
      }, common_vendor.unref(rowCol) == null ? {
        e: common_vendor.f(common_vendor.unref(actionItems), (item, index, i0) => {
          return common_vendor.e({
            a: item.icon != null
          }, item.icon != null ? {
            b: "601a7f4c-1-" + i0 + ",601a7f4c-0",
            c: common_vendor.p({
              color: item.iconColor ?? item.color,
              size: item.fontSize,
              name: item.icon,
              class: "l-action-sheet__item-icon"
            })
          } : {}, {
            d: common_vendor.t(item.label),
            e: common_vendor.s(item.color != null ? "color:" + item.color : ""),
            f: common_vendor.s(item.fontSize != null ? "font-size:" + item.fontSize : ""),
            g: !item.disabled ? "l-action-sheet__item--hover" : "",
            h: common_vendor.unref(bordered) && index != common_vendor.unref(actionItems).length - 1 ? 1 : "",
            i: item.disabled ? 1 : "",
            j: common_vendor.o(($event) => {
              return handleSelected(item);
            }, index),
            k: index
          });
        }),
        f: common_vendor.unref(align) == "left" ? 1 : ""
      } : {
        g: common_vendor.f(common_vendor.unref(actionRowCols), (row, rowIndex, i0) => {
          return {
            a: common_vendor.f(row, (item, colIndex, i1) => {
              return common_vendor.e({
                a: item.icon != null && item.__isImage
              }, item.icon != null && item.__isImage ? {
                b: common_vendor.s(item.radius != null ? "border-radius:" + item.radius : ""),
                c: item.icon
              } : item.icon != null ? {
                e: "601a7f4c-2-" + i0 + "-" + i1 + ",601a7f4c-0",
                f: common_vendor.p({
                  color: item.iconColor ?? item.color,
                  size: item.fontSize ?? "48rpx",
                  name: item.icon,
                  class: "l-action-sheet__col-icon"
                }),
                g: common_vendor.s(item.bgColor != null ? "background:" + item.bgColor : ""),
                h: common_vendor.s(item.radius != null ? "border-radius:" + item.radius : "")
              } : {}, {
                d: item.icon != null,
                i: common_vendor.t(item.label),
                j: common_vendor.s(item.color != null ? "color:" + item.color : ""),
                k: common_vendor.s(item.fontSize != null ? "font-size:" + item.fontSize : ""),
                l: item.disabled ? 1 : "",
                m: common_vendor.o(($event) => {
                  return handleSelected(item);
                }, colIndex),
                n: colIndex
              });
            }),
            b: !(row.length > 4) ? 1 : "",
            c: rowIndex > 0 && rowIndex < common_vendor.unref(actionRowCols).length ? 1 : "",
            d: "row" + rowIndex
          };
        })
      }, {
        h: common_vendor.unref(cancelText).length > 0
      }, common_vendor.unref(cancelText).length > 0 ? {} : {}, {
        i: common_vendor.unref(cancelText).length > 0
      }, common_vendor.unref(cancelText).length > 0 ? {
        j: common_vendor.t(common_vendor.unref(cancelText)),
        k: common_vendor.o(handleCancel, "ad")
      } : {}, {
        l: common_vendor.gei(_ctx, ""),
        m: common_vendor.o(onClose, "5d"),
        n: `${_ctx.u_s_b_h}px`,
        o: common_vendor.o(($event) => {
          return common_vendor.isRef(innerValue) ? innerValue.value = $event : null;
        }, "a2"),
        p: common_vendor.p({
          position: "bottom",
          modelValue: common_vendor.unref(innerValue),
          id: common_vendor.gei(_ctx, ""),
          style: common_vendor.normalizeStyle({
            "--status-bar-height": `${_ctx.u_s_b_h}px`
          })
        }),
        q: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
