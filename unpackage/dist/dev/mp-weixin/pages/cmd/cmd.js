"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_button + _easycom_app_toast)();
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
    const paramConfigs = common_vendor.ref([]);
    const paramValues = common_vendor.ref([]);
    const paramConfigError = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const sending = common_vendor.ref(false);
    const isFormValid = common_vendor.computed(() => {
      if (selectedCommand.value == null || paramConfigError.value != "")
        return false;
      return paramValues.value.length == paramConfigs.value.length && paramValues.value.every((value) => {
        return value != "";
      });
    });
    const sortByCmdNameLengthAndAlphabet = (data) => {
      const sortedData = data.slice();
      sortedData.sort((a, b) => {
        var _a, _b;
        const aName = (_a = a["cmdName"]) !== null && _a !== void 0 ? _a : "";
        const bName = (_b = b["cmdName"]) !== null && _b !== void 0 ? _b : "";
        if (aName.length != bName.length)
          return aName.length - bName.length;
        if (aName == bName)
          return 0;
        return aName < bName ? -1 : 1;
      });
      return sortedData;
    };
    const getParamLabel = (config) => {
      const label = config["label"];
      return label == null ? "参数" : label.toString();
    };
    const getParamMaxLength = (config) => {
      const max = config["max"];
      return typeof max == "number" ? max : -1;
    };
    const getRadioItems = (config) => {
      var _a;
      return (_a = config["items"]) !== null && _a !== void 0 ? _a : [];
    };
    const getRadioValue = (item) => {
      const value = item["value"];
      return value == null ? "" : value.toString();
    };
    const getRadioDescription = (item) => {
      const desc = item["desc"];
      return desc == null ? "" : desc.toString();
    };
    const parseParamConfigs = (details = null) => {
      paramConfigError.value = "";
      if (details == null || details.trim().length == 0)
        return [];
      try {
        const parsed = common_vendor.UTS.JSON.parse(details);
        if (!Array.isArray(parsed)) {
          paramConfigError.value = "指令参数配置格式无效";
          return [];
        }
        const configs = parsed;
        for (let index = 0; index < configs.length; index++) {
          const config = configs[index];
          if (config == null) {
            paramConfigError.value = "指令参数配置无效";
            return [];
          }
          const type = config["type"];
          if (type != "input" && type != "number" && type != "radio") {
            paramConfigError.value = "该指令包含暂不支持的参数类型";
            return [];
          }
          if (type == "radio") {
            const items = getRadioItems(config);
            if (items.length == 0 || items.some((item) => {
              return getRadioValue(item) == "" || getRadioDescription(item) == "";
            })) {
              paramConfigError.value = "指令单选参数配置无效";
              return [];
            }
          }
        }
        return configs;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:158", "解析参数配置失败:", error);
        paramConfigError.value = "指令参数配置无效";
        return [];
      }
    };
    const initializeParamValues = (configs) => {
      const values = [];
      for (let index = 0; index < configs.length; index++) {
        const config = configs[index];
        const defaultValue = config["default"];
        let value = "";
        if (defaultValue != null) {
          value = defaultValue.toString();
        } else if (config["type"] == "radio") {
          value = getRadioValue(getRadioItems(config)[0]);
        }
        values.push(value);
      }
      return values;
    };
    const getParamValue = (index) => {
      return index >= 0 && index < paramValues.value.length ? paramValues.value[index] : "";
    };
    const updateParamValueFromEvent = (index, value = null) => {
      if (sending.value || index < 0 || index >= paramValues.value.length)
        return null;
      paramValues.value[index] = value == null ? "" : value.toString();
    };
    const loadCommandTypes = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          loading.value = true;
          const response = yield api_request.getCmdAction();
          if (response.code == 0) {
            commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data);
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "加载指令类型失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:199", "加载指令类型出错:", error);
          utils_toast.showAppToast({ title: "网络错误", icon: "none" });
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
        if (sending.value)
          return Promise.resolve(null);
        const typeId = type["cmdmId"];
        if (typeId == null)
          return Promise.resolve(null);
        selectedTypeId.value = typeId;
        selectedCommandId.value = null;
        selectedCommand.value = null;
        paramConfigs.value = [];
        paramValues.value = [];
        paramConfigError.value = "";
        commands.value = [];
        try {
          loading.value = true;
          const response = yield api_request.getCmdByMid(new common_vendor.UTSJSONObject({ imei: imei.value, cmdmId: typeId }));
          if (response.code == 0) {
            commands.value = response.data;
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "加载指令列表失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:232", "加载指令列表出错:", error);
          utils_toast.showAppToast({ title: "网络错误", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const selectCommand = (command) => {
      if (sending.value)
        return null;
      selectedCommandId.value = command["predictCmdId"];
      selectedCommand.value = command;
      const configs = parseParamConfigs(command["details"]);
      paramConfigs.value = configs;
      paramValues.value = paramConfigError.value == "" ? initializeParamValues(configs) : [];
    };
    const selectRadio = (index, value) => {
      if (sending.value || index < 0 || index >= paramValues.value.length)
        return null;
      paramValues.value[index] = value;
    };
    const sendCommand = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (sending.value)
          return Promise.resolve(null);
        if (selectedCommand.value == null) {
          utils_toast.showAppToast({ title: "请选择指令", icon: "none" });
          return Promise.resolve(null);
        }
        if (paramConfigError.value != "") {
          utils_toast.showAppToast({ title: paramConfigError.value, icon: "none" });
          return Promise.resolve(null);
        }
        if (!isFormValid.value) {
          utils_toast.showAppToast({ title: "请填写所有参数", icon: "none" });
          return Promise.resolve(null);
        }
        const command = selectedCommand.value;
        let cmdData = (_a = command["params"]) !== null && _a !== void 0 ? _a : "";
        for (let index = 0; index < paramConfigs.value.length; index++) {
          const config = paramConfigs.value[index];
          const configuredPlaceholder = config["placeholder"];
          const placeholder = configuredPlaceholder != null && configuredPlaceholder.length > 0 ? configuredPlaceholder : "${param" + (index + 1).toString() + "}";
          cmdData = cmdData.split(placeholder).join(paramValues.value[index]);
        }
        try {
          sending.value = true;
          const response = yield api_request.sendCmd(new common_vendor.UTSJSONObject({
            imei: imei.value,
            type: (_b = command["cmdCode"]) !== null && _b !== void 0 ? _b : "",
            password: null,
            cmdData: encodeURIComponent(cmdData),
            predictCmdId: command["predictCmdId"]
          }));
          if (response.code == 0) {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "指令发送成功", icon: "success" });
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "指令发送失败", icon: "none", duration: 3e3 });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:294", "发送指令出错:", error);
          utils_toast.showAppToast({ title: "网络错误", icon: "none" });
        } finally {
          sending.value = false;
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
            b: selectedTypeId.value == type.cmdmId ? "#ffffff" : "#666666",
            c: type.cmdmId,
            d: selectedTypeId.value == type.cmdmId ? 1 : "",
            e: common_vendor.o(($event) => {
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
        f: selectedCommand.value != null
      }, selectedCommand.value != null ? common_vendor.e({
        g: paramConfigError.value != ""
      }, paramConfigError.value != "" ? {
        h: common_vendor.t(paramConfigError.value)
      } : {}, {
        i: common_vendor.f(paramConfigs.value, (param, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getParamLabel(param)),
            b: param.type == "input"
          }, param.type == "input" ? {
            c: common_vendor.o(($event) => {
              return updateParamValueFromEvent(index, $event);
            }, "param_" + index),
            d: "c4271740-1-" + i0,
            e: common_vendor.p({
              ["model-value"]: getParamValue(index),
              placeholder: "请输入" + getParamLabel(param),
              ["placeholder-class"]: "placeholder",
              border: "none",
              height: "44px",
              ["font-size"]: "15px",
              class: "param-input data-v-c4271740"
            })
          } : {}, {
            f: param.type == "number"
          }, param.type == "number" ? {
            g: common_vendor.o(($event) => {
              return updateParamValueFromEvent(index, $event);
            }, "param_" + index),
            h: "c4271740-2-" + i0,
            i: common_vendor.p({
              type: "number",
              ["model-value"]: getParamValue(index),
              placeholder: "请输入" + getParamLabel(param),
              ["placeholder-class"]: "placeholder",
              maxlength: getParamMaxLength(param),
              border: "none",
              height: "44px",
              ["font-size"]: "15px",
              class: "param-input data-v-c4271740"
            })
          } : {}, {
            j: param.type == "radio"
          }, param.type == "radio" ? {
            k: common_vendor.f(getRadioItems(param), (item, k1, i1) => {
              return {
                a: getParamValue(index) == getRadioValue(item) ? 1 : "",
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
        j: paramConfigs.value.length == 0 && paramConfigError.value == ""
      }, paramConfigs.value.length == 0 && paramConfigError.value == "" ? {} : {}, {
        k: common_vendor.o(sendCommand, "c2"),
        l: common_vendor.p({
          type: "primary",
          text: "发送指令",
          loading: sending.value,
          disabled: sending.value || loading.value || !isFormValid.value,
          class: "submit-btn data-v-c4271740"
        })
      }) : {}, {
        m: !selectedTypeId.value
      }, !selectedTypeId.value ? {} : {}, {
        n: loading.value
      }, loading.value ? {} : commands.value.length == 0 && selectedTypeId.value != null ? {} : {}, {
        o: commands.value.length == 0 && selectedTypeId.value != null,
        p: `${_ctx.u_s_b_h}px`,
        q: `${_ctx.u_s_a_i_b}px`,
        r: common_vendor.p({
          class: "data-v-c4271740"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c4271740"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cmd/cmd.js.map
