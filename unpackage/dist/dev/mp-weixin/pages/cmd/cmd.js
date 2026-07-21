"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "cmd",
  setup(__props) {
    const imei = common_vendor.ref("");
    const commandTypes = common_vendor.ref([]);
    const selectedTypeId = common_vendor.ref(null);
    const commands = common_vendor.ref([]);
    const selectedCommandId = common_vendor.ref(null);
    const selectedCommand = common_vendor.ref(null);
    const paramValues = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const commandRecords = common_vendor.ref(null);
    const commandRecordReason = common_vendor.computed(() => {
      var _a;
      if (commandRecords.value == null)
        return "暂无指令返回记录";
      return (_a = commandRecords.value["reason"]) !== null && _a !== void 0 ? _a : "暂无指令返回记录";
    });
    const selectedCommandDetails = common_vendor.computed(() => {
      if (selectedCommand.value == null)
        return null;
      return selectedCommand.value["details"];
    });
    const paramConfigs = common_vendor.computed(() => {
      const details = selectedCommandDetails.value;
      if (details == null || details.length == 0)
        return [];
      try {
        return common_vendor.UTS.JSON.parse(details);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:101", "解析参数配置失败:", e);
        return [];
      }
    });
    const isFormValid = common_vendor.computed(() => {
      return paramValues.value.length > 0 && paramValues.value.every((val) => {
        return val != "";
      });
    });
    const sortByCmdNameLengthAndAlphabet = (data) => {
      const sortedData = data.slice();
      sortedData.sort((a, b) => {
        var _a, _b;
        const aName = (_a = a["cmdName"]) !== null && _a !== void 0 ? _a : "";
        const bName = (_b = b["cmdName"]) !== null && _b !== void 0 ? _b : "";
        if (aName.length != bName.length) {
          return aName.length - bName.length;
        }
        if (aName == bName)
          return 0;
        return aName < bName ? -1 : 1;
      });
      return sortedData;
    };
    const loadCommandTypes = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          loading.value = true;
          const response = yield api_request.getCmdAction();
          common_vendor.index.__f__("log", "at pages/cmd/cmd.uvue:133", "加载指令类型响应:", response);
          if (response.code == 0) {
            commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data);
          } else {
            common_vendor.index.showToast({
              title: "加载指令类型失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:144", "加载指令类型出错:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    common_vendor.onLoad((options) => {
      var _a;
      imei.value = (_a = options.imei) !== null && _a !== void 0 ? _a : "";
      loadCommandTypes();
    });
    const selectTypeByItem = (type) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const typeId = type["cmdmId"];
        if (typeId == null)
          return Promise.resolve(null);
        selectedTypeId.value = typeId;
        selectedCommandId.value = null;
        selectedCommand.value = null;
        paramValues.value = [];
        commandRecords.value = null;
        try {
          loading.value = true;
          const response = yield api_request.getCmdByMid(new common_vendor.UTSJSONObject({
            imei: imei.value,
            cmdmId: typeId
          }));
          if (response.code == 0) {
            commands.value = response.data;
          } else {
            common_vendor.index.showToast({ title: "加载指令列表失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:179", "加载指令列表出错:", error);
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const selectCommand = (command) => {
      var _a;
      selectedCommandId.value = command["predictCmdId"];
      selectedCommand.value = command;
      paramValues.value = [];
      const details = command["details"];
      if (details == null || details.length == 0)
        return null;
      try {
        const configs = common_vendor.UTS.JSON.parse(details);
        const values = [];
        for (let index = 0; index < configs.length; index++) {
          const config = configs[index];
          const defaultValue = config["default"];
          if (defaultValue != null) {
            values[index] = defaultValue.toString();
            continue;
          }
          const configType = config["type"];
          const items = config["items"];
          if (configType == "radio" && items != null && items.length > 0) {
            values[index] = (_a = items[0]["value"]) !== null && _a !== void 0 ? _a : "";
          } else {
            values[index] = "";
          }
        }
        paramValues.value = values;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:214", "初始化参数值失败:", e);
        paramValues.value = [];
      }
    };
    const getRadioItems = (config) => {
      var _a;
      return (_a = config["items"]) !== null && _a !== void 0 ? _a : [];
    };
    const getRadioValue = (item) => {
      var _a;
      return (_a = item["value"]) !== null && _a !== void 0 ? _a : "";
    };
    const getRadioDescription = (item) => {
      var _a;
      return (_a = item["desc"]) !== null && _a !== void 0 ? _a : "";
    };
    const selectRadio = (index, value) => {
      while (paramValues.value.length <= index) {
        paramValues.value.push("");
      }
      paramValues.value[index] = value;
    };
    const sendCommand = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!isFormValid.value || selectedCommand.value == null) {
          common_vendor.index.showToast({ title: "请填写所有参数", icon: "none" });
          return Promise.resolve(null);
        }
        const command = selectedCommand.value;
        let cmdData = (_a = command["params"]) !== null && _a !== void 0 ? _a : "";
        for (let index = 0; index < paramConfigs.value.length; index++) {
          const config = paramConfigs.value[index];
          const value = paramValues.value[index];
          const configuredPlaceholder = config["placeholder"];
          const placeholder = configuredPlaceholder != null && configuredPlaceholder.length > 0 ? configuredPlaceholder : "${param" + (index + 1).toString() + "}";
          cmdData = cmdData.replace(placeholder, value);
        }
        try {
          loading.value = true;
          const response = yield api_request.sendCmd(new common_vendor.UTSJSONObject({
            imei: imei.value,
            type: (_b = command["cmdCode"]) !== null && _b !== void 0 ? _b : "",
            password: null,
            cmdData: encodeURIComponent(cmdData),
            predictCmdId: command["predictCmdId"]
          }));
          if (response.code == 0) {
            common_vendor.index.showToast({ title: "指令发送成功", icon: "success" });
          } else {
            common_vendor.index.showToast({ title: "指令发送失败", icon: "none", duration: 3e3 });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:271", "发送指令出错:", error);
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "指令",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-c4271740"
        }),
        b: common_vendor.t(imei.value),
        c: common_vendor.f(commandTypes.value, (type, index, i0) => {
          return {
            a: common_vendor.t(type.cmdName),
            b: type.cmdmId,
            c: selectedTypeId.value == type.cmdmId ? 1 : "",
            d: common_vendor.o(($event) => {
              return selectTypeByItem(type);
            }, type.cmdmId)
          };
        }),
        d: commands.value.length
      }, commands.value.length ? {
        e: common_vendor.f(commands.value, (cmd, index, i0) => {
          return {
            a: common_vendor.t(cmd.cmdName),
            b: common_vendor.t(cmd.remarks),
            c: cmd.predictCmdId,
            d: selectedCommandId.value == cmd.predictCmdId ? 1 : "",
            e: common_vendor.o(($event) => {
              return selectCommand(cmd);
            }, cmd.predictCmdId)
          };
        })
      } : {}, {
        f: selectedCommandDetails.value
      }, selectedCommandDetails.value ? {
        g: common_vendor.f(paramConfigs.value, (param, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(param.label),
            b: param.type == "input"
          }, param.type == "input" ? {
            c: "c4271740-1-" + i0,
            d: common_vendor.o(($event) => {
              return paramValues.value[index] = $event;
            }, "param_" + index),
            e: common_vendor.p({
              placeholder: "请输入" + param.label,
              ["placeholder-class"]: "placeholder",
              modelValue: paramValues.value[index],
              class: "param-input data-v-c4271740"
            })
          } : {}, {
            f: param.type == "number"
          }, param.type == "number" ? {
            g: "c4271740-2-" + i0,
            h: common_vendor.o(($event) => {
              return paramValues.value[index] = $event;
            }, "param_" + index),
            i: common_vendor.p({
              type: "number",
              placeholder: "请输入" + param.label,
              ["placeholder-class"]: "placeholder",
              maxlength: param.max,
              modelValue: paramValues.value[index],
              class: "param-input data-v-c4271740"
            })
          } : {}, {
            j: param.type == "radio"
          }, param.type == "radio" ? {
            k: common_vendor.f(getRadioItems(param), (item, k1, i1) => {
              return {
                a: paramValues.value[index] == getRadioValue(item) ? 1 : "",
                b: common_vendor.t(getRadioDescription(item)),
                c: "radio_" + item.value,
                d: common_vendor.o(($event) => {
                  return selectRadio(index, getRadioValue(item));
                }, "radio_" + item.value)
              };
            })
          } : {}, {
            l: "param_" + index
          });
        }),
        h: common_vendor.o(sendCommand, "46"),
        i: common_vendor.p({
          type: "primary",
          text: "发送指令",
          disabled: !isFormValid.value,
          class: "submit-btn data-v-c4271740"
        })
      } : {}, {
        j: commandRecords.value
      }, commandRecords.value ? {
        k: common_vendor.t(commandRecordReason.value)
      } : {}, {
        l: !selectedTypeId.value
      }, !selectedTypeId.value ? {} : {}, {
        m: loading.value
      }, loading.value ? {} : commands.value.length == 0 && selectedTypeId.value != null ? {} : {}, {
        n: commands.value.length == 0 && selectedTypeId.value != null,
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        p: `${_ctx.u_s_b_h}px`,
        q: `${_ctx.u_s_a_i_b}px`,
        r: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c4271740"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cmd/cmd.js.map
