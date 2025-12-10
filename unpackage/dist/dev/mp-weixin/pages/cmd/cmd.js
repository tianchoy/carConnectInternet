"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_button)();
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
    const paramConfigs = common_vendor.computed(() => {
      if (!selectedCommand.value || !selectedCommand.value.details)
        return [];
      try {
        return UTS.JSON.parse(selectedCommand.value.details);
      } catch (e) {
        console.error("解析参数配置失败:", e);
        return [];
      }
    });
    const isFormValid = common_vendor.computed(() => {
      return paramValues.value.length > 0 && paramValues.value.every((val) => {
        return val !== null && val !== void 0 && val !== "";
      });
    });
    common_vendor.onLoad((options) => {
      imei.value = options.imei || "";
      loadCommandTypes();
    });
    const sortByCmdNameLengthAndAlphabet = (data = null) => {
      if (!Array.isArray(data)) {
        console.error("参数必须是一个数组");
        return [];
      }
      const sortedData = [...data];
      sortedData.sort((a = null, b = null) => {
        const aName = a.cmdName ? a.cmdName.toString() : "";
        const bName = b.cmdName ? b.cmdName.toString() : "";
        if (aName.length !== bName.length) {
          return aName.length - bName.length;
        }
        return aName.localeCompare(bName, "zh-CN");
      });
      return sortedData;
    };
    const loadCommandTypes = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          loading.value = true;
          const response = yield api_request.getCmdAction();
          console.log("加载指令类型响应:", response);
          if (response.code == 0) {
            commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data);
          } else {
            common_vendor.index.showToast({
              title: "加载指令类型失败",
              icon: "none"
            });
          }
        } catch (error) {
          console.error("加载指令类型出错:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    const selectType = (typeId = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        selectedTypeId.value = typeId;
        selectedCommandId.value = null;
        selectedCommand.value = null;
        paramValues.value = [];
        commandRecords.value = null;
        console.log("选择指令类型:", typeId, typeof commandRecords.value);
        try {
          loading.value = true;
          const response = yield api_request.getCmdByMid({
            imei: imei.value,
            cmdmId: typeId
          });
          if (response.code == 0) {
            commands.value = response.data;
          } else {
            common_vendor.index.showToast({
              title: "加载指令列表失败",
              icon: "none"
            });
          }
        } catch (error) {
          console.error("加载指令列表出错:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      });
    };
    const selectCommand = (command = null) => {
      selectedCommandId.value = command.predictCmdId;
      selectedCommand.value = command;
      paramValues.value = [];
      if (command.details) {
        try {
          const configs = UTS.JSON.parse(command.details);
          paramValues.value = configs.map((config = null) => {
            if (config.default !== void 0) {
              return config.default.toString();
            }
            if (config.type == "radio" && config.items && config.items.length > 0) {
              return config.items[0].value;
            }
            return "";
          });
        } catch (e) {
          console.error("初始化参数值失败:", e);
          paramValues.value = [];
        }
      }
    };
    const selectRadio = (index = null, value = null) => {
      if (paramValues.value.length <= index) {
        const newLength = index + 1;
        const newArray = new Array(newLength);
        for (let i = 0; i < newLength; i++) {
          newArray[i] = paramValues.value[i] || "";
        }
        paramValues.value = newArray;
      }
      paramValues.value[index] = value;
    };
    const sendCommand = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isFormValid.value) {
          common_vendor.index.showToast({
            title: "请填写所有参数",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          loading.value = true;
          let cmdData = selectedCommand.value.params;
          paramConfigs.value.forEach((config = null, index = null) => {
            const value = paramValues.value[index];
            if (config.placeholder) {
              cmdData = cmdData.replace(config.placeholder, value);
            } else {
              const placeholder = `\${param${index + 1}}`;
              cmdData = cmdData.replace(placeholder, value);
            }
          });
          const response = yield api_request.sendCmd({
            imei: imei.value,
            type: selectedCommand.value.cmdCode,
            password: null,
            cmdData: encodeURIComponent(cmdData),
            predictCmdId: selectedCommand.value.predictCmdId
          });
          if (response.code == 0) {
            common_vendor.index.showToast({
              title: "指令发送成功",
              icon: "success"
            });
            setTimeout(() => {
              api_request.getCmdRecordById(response.data).then((recordResponse = null) => {
                console.log("获取指令记录详情响应:", recordResponse);
                if (recordResponse.code == 0) {
                  commandRecords.value = recordResponse.data;
                } else {
                  common_vendor.index.showToast({
                    title: "获取指令记录详情失败",
                    icon: "none"
                  });
                }
              });
            }, 2e3);
          } else {
            common_vendor.index.showToast({
              title: "指令发送失败: " + (response.msg || "未知错误"),
              icon: "none",
              duration: 3e3
            });
          }
        } catch (error) {
          console.error("发送指令出错:", error);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
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
          showCapsule: false
        }),
        b: common_vendor.t(imei.value),
        c: common_vendor.f(commandTypes.value, (type, index, i0) => {
          return {
            a: common_vendor.t(type.cmdName),
            b: type.cmdmId,
            c: selectedTypeId.value == type.cmdmId ? 1 : "",
            d: common_vendor.o(($event) => {
              return selectType(type.cmdmId);
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
        f: selectedCommand.value && selectedCommand.value.details
      }, selectedCommand.value && selectedCommand.value.details ? {
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
              modelValue: paramValues.value[index]
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
              modelValue: paramValues.value[index]
            })
          } : {}, {
            j: param.type == "radio"
          }, param.type == "radio" ? {
            k: common_vendor.f(param.items, (item, k1, i1) => {
              return {
                a: paramValues.value[index] == item.value ? 1 : "",
                b: common_vendor.t(item.desc),
                c: "radio_" + item.value,
                d: common_vendor.o(($event) => {
                  return selectRadio(index, item.value);
                }, "radio_" + item.value)
              };
            })
          } : {}, {
            l: "param_" + index
          });
        }),
        h: common_vendor.o(sendCommand),
        i: common_vendor.p({
          type: "primary",
          disabled: !isFormValid.value
        })
      } : {}, {
        j: commandRecords.value
      }, commandRecords.value ? {
        k: common_vendor.t(commandRecords.value.reason || "暂无指令返回记录")
      } : {}, {
        l: !selectedTypeId.value
      }, !selectedTypeId.value ? {} : {}, {
        m: loading.value
      }, loading.value ? {} : !commands.value.length && selectedTypeId.value ? {} : {}, {
        n: !commands.value.length && selectedTypeId.value,
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c4271740"]]);
wx.createPage(MiniProgramPage);
