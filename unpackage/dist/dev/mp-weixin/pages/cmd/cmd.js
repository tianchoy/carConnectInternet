"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_modal = require("../../utils/modal.js");
const utils_toast = require("../../utils/toast.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_tabs_1 = common_vendor.resolveComponent("i-tabs");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_i_action_sheet_1 = common_vendor.resolveComponent("i-action-sheet");
  const _easycom_i_modal_1 = common_vendor.resolveComponent("i-modal");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_tabs_1 + _easycom_i_input_1 + _easycom_i_button_1 + _easycom_i_action_sheet_1 + _easycom_i_modal_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_tabs = () => "../../uni_modules/i-ui-x/components/i-tabs/i-tabs.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_action_sheet = () => "../../uni_modules/i-ui-x/components/i-action-sheet/i-action-sheet.js";
const _easycom_i_modal = () => "../../uni_modules/i-ui-x/components/i-modal/i-modal.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_tabs + _easycom_i_input + _easycom_i_button + _easycom_i_action_sheet + _easycom_i_modal + _easycom_app_toast)();
}
const historyPageSize = 10;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "cmd",
  setup(__props) {
    const imei = common_vendor.ref("");
    const deviceId = common_vendor.ref("");
    const activeTab = common_vendor.ref("send");
    const tabItems = [
      new common_vendor.UTSJSONObject({ name: "下发指令", value: "send" }),
      new common_vendor.UTSJSONObject({ name: "指令记录", value: "history" })
    ];
    const availableCommands = common_vendor.ref([]);
    const selectedCommand = common_vendor.ref(null);
    const selectedCommandId = common_vendor.ref("");
    const paramConfigs = common_vendor.ref([]);
    const paramValues = common_vendor.ref([]);
    const paramErrors = common_vendor.ref([]);
    const paramConfigError = common_vendor.ref("");
    const isCommandLoading = common_vendor.ref(false);
    const isSending = common_vendor.ref(false);
    const optionSheetVisible = common_vendor.ref(false);
    const optionSheetTitle = common_vendor.ref("请选择");
    const optionActions = common_vendor.ref([]);
    const activeOptionIndex = common_vendor.ref(-1);
    const historyRecords = common_vendor.ref([]);
    const historyPageNum = common_vendor.ref(1);
    const historyTotal = common_vendor.ref(0);
    const isHistoryLoading = common_vendor.ref(false);
    const hasLoadedHistory = common_vendor.ref(false);
    const hasMoreHistory = common_vendor.ref(true);
    const hasReachedHistoryBottom = common_vendor.ref(false);
    const detailVisible = common_vendor.ref(false);
    const isDetailLoading = common_vendor.ref(false);
    const detailRecord = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const isRetrying = common_vendor.ref(false);
    function getString(item = null, key) {
      return item != null ? item.getString(key, "") : "";
    }
    function getBoolean(item = null, key) {
      if (item == null)
        return false;
      return item.getBoolean(key, false) || getString(item, key) == "1";
    }
    function getCommandKey(command, index) {
      const cmdId = getString(command, "cmdId");
      return cmdId != "" ? cmdId : "command_" + index.toString();
    }
    function getCommandName(command = null) {
      const name = getString(command, "cmdName");
      return name != "" ? name : "未命名指令";
    }
    function getCommandCode(command = null) {
      return getString(command, "cmdCode");
    }
    function getCommandRemark(command = null) {
      return getString(command, "remark");
    }
    function isCommandAllowed(command = null) {
      return getBoolean(command, "appAllowed");
    }
    function commandNeedsParams(command = null) {
      return getString(command, "needParam") == "1";
    }
    function isSelectedCommand(command) {
      return getCommandKey(command, 0) == selectedCommandId.value;
    }
    function getParamKey(param, index) {
      const key = getString(param, "key");
      return key != "" ? key : "param_" + index.toString();
    }
    function getParamLabel(param) {
      const label = getString(param, "label");
      return label != "" ? label : "参数";
    }
    function getParamType(param) {
      return getString(param, "type");
    }
    function isParamRequired(param) {
      return getBoolean(param, "required");
    }
    function getParamPlaceholder(param) {
      const placeholder = getString(param, "placeholder");
      return placeholder != "" ? placeholder : "请输入" + getParamLabel(param);
    }
    function getParamValue(index) {
      return index >= 0 && index < paramValues.value.length ? paramValues.value[index] : "";
    }
    function getParamError(index) {
      return index >= 0 && index < paramErrors.value.length ? paramErrors.value[index] : "";
    }
    function getParamOptions(param) {
      const options = param.getArray("options");
      return options != null ? options : [];
    }
    function getOptionValue(option) {
      return getString(option, "value");
    }
    function getOptionLabel(option) {
      const label = getString(option, "label");
      return label != "" ? label : getOptionValue(option);
    }
    function parseNumber(value) {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : Number.from(parsed);
    }
    function validateParam(index, updateError) {
      if (index < 0 || index >= paramConfigs.value.length)
        return "";
      const param = paramConfigs.value[index];
      const value = getParamValue(index).trim();
      let error = "";
      if (isParamRequired(param) && value == "") {
        error = "请填写" + getParamLabel(param);
      } else if (value != "" && getParamType(param) == "number") {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
          error = getParamLabel(param) + "必须为数字";
        } else {
          const minText = getString(param, "min");
          const maxText = getString(param, "max");
          if (minText != "" && numberValue < parseNumber(minText))
            error = getParamLabel(param) + "不能小于" + minText;
          if (error == "" && maxText != "" && numberValue > parseNumber(maxText))
            error = getParamLabel(param) + "不能大于" + maxText;
        }
      }
      if (updateError && index >= 0 && index < paramErrors.value.length)
        paramErrors.value[index] = error;
      return error;
    }
    function getStatusValue(record = null) {
      return getString(record, "sendStatus");
    }
    function getStatusText(record = null) {
      const status = getStatusValue(record);
      if (status == "1")
        return "下发成功";
      if (status == "2")
        return "下发失败";
      return "等待下发";
    }
    function getStatusClass(record = null) {
      const status = getStatusValue(record);
      if (status == "1")
        return "status-success";
      if (status == "2")
        return "status-failed";
      return "status-pending";
    }
    const displayDeviceIdentity = common_vendor.computed(() => {
      return imei.value != "" ? imei.value : deviceId.value != "" ? "设备 " + deviceId.value : "未识别设备";
    });
    const isHistoryInitialLoading = common_vendor.computed(() => {
      return isHistoryLoading.value && !hasLoadedHistory.value && historyRecords.value.length == 0;
    });
    const isFormValid = common_vendor.computed(() => {
      if (selectedCommand.value == null || !isCommandAllowed(selectedCommand.value) || paramConfigError.value != "")
        return false;
      if (paramValues.value.length != paramConfigs.value.length)
        return false;
      for (let index = 0; index < paramConfigs.value.length; index++) {
        if (validateParam(index, false) != "")
          return false;
      }
      return true;
    });
    const canRetryDetail = common_vendor.computed(() => {
      const status = getStatusValue(detailRecord.value);
      return !isDetailLoading.value && (status == "0" || status == "2");
    });
    function parseParamConfigs(schema) {
      paramConfigError.value = "";
      if (schema.trim() == "")
        return [];
      try {
        const parsed = common_vendor.UTS.JSON.parse(schema);
        if (!Array.isArray(parsed)) {
          paramConfigError.value = "指令参数配置格式无效";
          return [];
        }
        const configs = parsed;
        for (let index = 0; index < configs.length; index++) {
          const param = configs[index];
          if (param == null || getString(param, "key") == "" || getString(param, "label") == "") {
            paramConfigError.value = "指令参数配置不完整";
            return [];
          }
          const type = getParamType(param);
          if (type != "text" && type != "number" && type != "select") {
            paramConfigError.value = "该指令包含暂不支持的参数类型";
            return [];
          }
          if (type == "select") {
            const options = getParamOptions(param);
            if (options.length == 0 || options.some((option) => {
              return getOptionValue(option) == "" || getOptionLabel(option) == "";
            })) {
              paramConfigError.value = "指令下拉参数配置无效";
              return [];
            }
          }
        }
        return configs;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:380", "解析指令参数配置失败:", error);
        paramConfigError.value = "指令参数配置无效";
        return [];
      }
    }
    function initializeParamValues(configs) {
      const values = [];
      for (let index = 0; index < configs.length; index++) {
        const defaultValue = configs[index].getString("default", "");
        values.push(defaultValue);
      }
      return values;
    }
    function updateParamValue(index, value = null) {
      if (isSending.value || index < 0 || index >= paramValues.value.length)
        return null;
      paramValues.value[index] = value == null ? "" : value.toString();
      validateParam(index, true);
    }
    function getSelectedOptionLabel(index) {
      if (index < 0 || index >= paramConfigs.value.length)
        return "";
      const value = getParamValue(index);
      if (value == "")
        return "";
      const option = common_vendor.UTS.arrayFind(getParamOptions(paramConfigs.value[index]), (item) => {
        return getOptionValue(item) == value;
      });
      return option == null ? value : getOptionLabel(option);
    }
    function openOptionSheet(index) {
      if (isSending.value || index < 0 || index >= paramConfigs.value.length)
        return null;
      const param = paramConfigs.value[index];
      if (getParamType(param) != "select")
        return null;
      activeOptionIndex.value = index;
      optionSheetTitle.value = "请选择" + getParamLabel(param);
      const actions = [];
      getParamOptions(param).forEach((option) => {
        const action = new common_vendor.UTSJSONObject();
        action.set("name", getOptionLabel(option));
        action.set("value", getOptionValue(option));
        actions.push(action);
      });
      optionActions.value = actions;
      optionSheetVisible.value = true;
    }
    function getEventItem(event = null) {
      if (event == null || typeof event != "object")
        return null;
      const item = event["item"];
      return item == null ? null : item;
    }
    function selectOption(event = null) {
      const index = activeOptionIndex.value;
      if (index < 0 || index >= paramValues.value.length)
        return null;
      const item = getEventItem(event);
      const value = item != null ? getString(item, "value") : "";
      if (value != "") {
        paramValues.value[index] = value;
        validateParam(index, true);
      }
      activeOptionIndex.value = -1;
    }
    function resetSelection() {
      selectedCommand.value = null;
      selectedCommandId.value = "";
      paramConfigs.value = [];
      paramValues.value = [];
      paramErrors.value = [];
      paramConfigError.value = "";
    }
    function loadAvailableCommands() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value == "" || isCommandLoading.value)
          return Promise.resolve(null);
        try {
          isCommandLoading.value = true;
          const response = yield api_request.getAppAvailableCommands(deviceId.value);
          if (response.code == 200) {
            availableCommands.value = response.data;
            const stillSelected = selectedCommandId.value != "" ? common_vendor.UTS.arrayFind(response.data, (command) => {
              return getCommandKey(command, 0) == selectedCommandId.value;
            }) : null;
            if (stillSelected == null)
              resetSelection();
          } else {
            availableCommands.value = [];
            resetSelection();
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "加载可用指令失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:473", "加载可用指令失败:", error);
          utils_toast.showAppToast({ title: "加载可用指令失败，请检查网络", icon: "none" });
        } finally {
          isCommandLoading.value = false;
        }
      });
    }
    function selectCommand(command) {
      if (isSending.value)
        return null;
      if (!isCommandAllowed(command)) {
        utils_toast.showAppToast({ title: "该指令不允许在 App 端下发", icon: "none" });
        return null;
      }
      selectedCommand.value = command;
      selectedCommandId.value = getCommandKey(command, 0);
      const configs = parseParamConfigs(getString(command, "paramSchema"));
      paramConfigs.value = configs;
      paramValues.value = paramConfigError.value == "" ? initializeParamValues(configs) : [];
      paramErrors.value = configs.map((_param) => {
        return "";
      });
    }
    function buildCommandParams() {
      const params = new common_vendor.UTSJSONObject();
      for (let index = 0; index < paramConfigs.value.length; index++) {
        const value = getParamValue(index).trim();
        if (value != "")
          params.set(getParamKey(paramConfigs.value[index], index), value);
      }
      return params;
    }
    function loadHistoryPage(reset) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value == "" || isHistoryLoading.value || !reset && !hasMoreHistory.value)
          return Promise.resolve(null);
        const requestedPage = reset ? 1 : historyPageNum.value;
        try {
          isHistoryLoading.value = true;
          const query = new common_vendor.UTSJSONObject();
          query.set("deviceId", deviceId.value);
          query.set("pageNum", requestedPage);
          query.set("pageSize", historyPageSize);
          const response = yield api_request.getAppCommandHistory(query);
          if (response.code != 200) {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "加载指令记录失败", icon: "none" });
            return Promise.resolve(null);
          }
          const rows = response.data.rows;
          if (reset)
            historyRecords.value = rows;
          else
            historyRecords.value = [...historyRecords.value, ...rows];
          historyTotal.value = response.data.total;
          historyPageNum.value = requestedPage + 1;
          hasMoreHistory.value = historyRecords.value.length < historyTotal.value && rows.length > 0;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:524", "加载指令记录失败:", error);
          utils_toast.showAppToast({ title: "加载指令记录失败，请检查网络", icon: "none" });
        } finally {
          hasLoadedHistory.value = true;
          isHistoryLoading.value = false;
        }
      });
    }
    function reloadHistory() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        hasReachedHistoryBottom.value = false;
        historyPageNum.value = 1;
        historyRecords.value = [];
        historyTotal.value = 0;
        hasMoreHistory.value = true;
        hasLoadedHistory.value = false;
        yield loadHistoryPage(true);
      });
    }
    function sendSelectedCommand() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const command = selectedCommand.value;
        if (command == null || deviceId.value == "" || isSending.value)
          return Promise.resolve(null);
        const cmdId = getString(command, "cmdId");
        if (cmdId == "") {
          utils_toast.showAppToast({ title: "指令模板信息不完整", icon: "none" });
          return Promise.resolve(null);
        }
        const requestData = new common_vendor.UTSJSONObject();
        requestData.set("deviceId", deviceId.value);
        requestData.set("cmdId", cmdId);
        const cmdCode = getCommandCode(command);
        if (cmdCode != "")
          requestData.set("cmdCode", cmdCode);
        requestData.set("params", buildCommandParams());
        try {
          isSending.value = true;
          const response = yield api_request.sendAppCommand(requestData);
          if (response.code == 200) {
            const requestIdText = response.data != "" ? "追踪编号：" + response.data : "请在指令记录中查看下发结果";
            utils_toast.showAppToast({ title: "指令已提交，" + requestIdText, icon: "success", duration: 3500 });
            yield reloadHistory();
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "指令下发失败", icon: "none", duration: 3e3 });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:567", "下发指令失败:", error);
          utils_toast.showAppToast({ title: "指令下发失败，请检查网络", icon: "none" });
        } finally {
          isSending.value = false;
        }
      });
    }
    function confirmSendCommand() {
      if (selectedCommand.value == null) {
        utils_toast.showAppToast({ title: "请选择要下发的指令", icon: "none" });
        return null;
      }
      for (let index = 0; index < paramConfigs.value.length; index++)
        validateParam(index, true);
      if (!isFormValid.value) {
        utils_toast.showAppToast({ title: "请检查指令参数", icon: "none" });
        return null;
      }
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({
        title: "确认下发指令",
        content: "即将向设备下发“" + getCommandName(selectedCommand.value) + "”。指令下发后可能影响车辆使用，请确认操作。",
        confirmText: "确认下发",
        cancelText: "取消",
        success: (result) => {
          if (result.confirm)
            void sendSelectedCommand();
        }
      }));
    }
    function getRecordKey(record, index) {
      const id = getString(record, "id");
      return id != "" ? id : "record_" + index.toString();
    }
    function getRecordName(record = null) {
      const name = getString(record, "cmdName");
      return name != "" ? name : getString(record, "commandType") != "" ? getString(record, "commandType") : "未知指令";
    }
    function getRecordTime(record = null) {
      const time = getString(record, "sendTime");
      return time != "" ? time : getString(record, "createTime");
    }
    function getRecordRetryCount(record = null) {
      const count = getString(record, "retryCount");
      return count != "" ? count : "0";
    }
    function getRecordSummary(record = null) {
      const reason = getString(record, "reason");
      return reason != "" ? reason : getString(record, "responseContent");
    }
    function markHistoryScroll(event) {
      if (activeTab.value != "history")
        return null;
    }
    function loadMoreHistory() {
      if (activeTab.value != "history")
        return null;
      void loadHistoryPage(false);
    }
    function showCommandDetail(record) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const commandId = getString(record, "id");
        if (commandId == "")
          return Promise.resolve(null);
        detailRecord.value = record;
        detailVisible.value = true;
        isDetailLoading.value = true;
        try {
          const response = yield api_request.getAppCommandDetail(commandId);
          if (response.code == 200 && response.data != null) {
            detailRecord.value = response.data;
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "加载指令详情失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:647", "加载指令详情失败:", error);
          utils_toast.showAppToast({ title: "加载指令详情失败，请检查网络", icon: "none" });
        } finally {
          isDetailLoading.value = false;
        }
      });
    }
    function closeDetail() {
      detailVisible.value = false;
    }
    function getDetailResponse() {
      return getString(detailRecord.value, "responseContent");
    }
    function getDetailReason() {
      return getString(detailRecord.value, "reason");
    }
    function getDetailParams() {
      return getString(detailRecord.value, "commandParams");
    }
    function retryCommand(commandId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isRetrying.value)
          return Promise.resolve(null);
        try {
          isRetrying.value = true;
          const response = yield api_request.retryAppCommand(commandId);
          if (response.code == 200) {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "已重新提交指令", icon: "success" });
            detailVisible.value = false;
            yield reloadHistory();
          } else {
            utils_toast.showAppToast({ title: response.msg != "" ? response.msg : "重试下发失败", icon: "none", duration: 3e3 });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/cmd/cmd.uvue:674", "重试下发失败:", error);
          utils_toast.showAppToast({ title: "重试下发失败，请检查网络", icon: "none" });
        } finally {
          isRetrying.value = false;
        }
      });
    }
    function confirmRetryFromDetail() {
      const commandId = getString(detailRecord.value, "id");
      if (commandId == "" || isRetrying.value)
        return null;
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({
        title: "确认重试",
        content: "将重新下发“" + getRecordName(detailRecord.value) + "”，请确认设备当前状态适合执行此操作。",
        confirmText: "确认重试",
        cancelText: "取消",
        success: (result) => {
          if (result.confirm)
            void retryCommand(commandId);
        }
      }));
    }
    function changeTab(value) {
      if (value == "" || value == activeTab.value)
        return null;
      activeTab.value = value;
      if (value == "history" && !hasLoadedHistory.value)
        void reloadHistory();
    }
    common_vendor.onLoad((options) => {
      var _a, _b;
      imei.value = (_a = options.imei) !== null && _a !== void 0 ? _a : "";
      deviceId.value = (_b = options.deviceId) !== null && _b !== void 0 ? _b : "";
      if (deviceId.value != "")
        void loadAvailableCommands();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "指令中心",
          ["show-back"]: true,
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          showCapsule: false,
          class: "data-v-c4271740"
        }),
        b: common_vendor.t(displayDeviceIdentity.value),
        c: common_vendor.t(deviceId.value != "" ? deviceId.value : "--"),
        d: common_vendor.o(changeTab, "1e"),
        e: common_vendor.p({
          value: activeTab.value,
          list: tabItems,
          activeColor: "#1677ff",
          inactiveColor: "#667085",
          bgColor: "#ffffff",
          class: "data-v-c4271740"
        }),
        f: deviceId.value == ""
      }, deviceId.value == "" ? {} : activeTab.value == "send" ? common_vendor.e({
        h: common_vendor.o(loadAvailableCommands, "52"),
        i: isCommandLoading.value
      }, isCommandLoading.value ? {} : availableCommands.value.length == 0 ? {} : {
        k: common_vendor.f(availableCommands.value, (command, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getCommandName(command)),
            b: common_vendor.t(isCommandAllowed(command) ? commandNeedsParams(command) ? "需填写参数" : "无需参数" : "App 端不可下发"),
            c: !isCommandAllowed(command) ? 1 : "",
            d: getCommandCode(command) != "" || getCommandRemark(command) != ""
          }, getCommandCode(command) != "" || getCommandRemark(command) != "" ? common_vendor.e({
            e: getCommandCode(command) != ""
          }, getCommandCode(command) != "" ? {
            f: common_vendor.t(getCommandCode(command))
          } : {}, {
            g: getCommandRemark(command) != ""
          }, getCommandRemark(command) != "" ? {
            h: common_vendor.t(getCommandRemark(command))
          } : {}) : {}, {
            i: getCommandKey(command, index),
            j: isSelectedCommand(command) ? 1 : "",
            k: !isCommandAllowed(command) ? 1 : "",
            l: common_vendor.o(($event) => {
              return selectCommand(command);
            }, getCommandKey(command, index))
          });
        })
      }, {
        j: availableCommands.value.length == 0,
        l: selectedCommand.value != null
      }, selectedCommand.value != null ? common_vendor.e({
        m: common_vendor.t(getCommandName(selectedCommand.value)),
        n: paramConfigError.value != ""
      }, paramConfigError.value != "" ? {
        o: common_vendor.t(paramConfigError.value)
      } : {}, {
        p: common_vendor.f(paramConfigs.value, (param, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getParamLabel(param)),
            b: isParamRequired(param)
          }, isParamRequired(param) ? {} : {}, {
            c: getParamType(param) == "text" || getParamType(param) == "number"
          }, getParamType(param) == "text" || getParamType(param) == "number" ? {
            d: common_vendor.o(($event) => {
              return updateParamValue(index, $event);
            }, getParamKey(param, index)),
            e: "c4271740-2-" + i0,
            f: common_vendor.p({
              ["model-value"]: getParamValue(index),
              type: getParamType(param) == "number" ? "number" : "text",
              placeholder: getParamPlaceholder(param),
              ["placeholder-class"]: "input-placeholder",
              border: "none",
              class: "param-input data-v-c4271740"
            })
          } : getParamType(param) == "select" ? {
            h: common_vendor.t(getSelectedOptionLabel(index) != "" ? getSelectedOptionLabel(index) : getParamPlaceholder(param)),
            i: getSelectedOptionLabel(index) == "" ? 1 : "",
            j: common_vendor.o(($event) => {
              return openOptionSheet(index);
            }, getParamKey(param, index))
          } : {}, {
            g: getParamType(param) == "select",
            k: getParamError(index) != ""
          }, getParamError(index) != "" ? {
            l: common_vendor.t(getParamError(index))
          } : {}, {
            m: getParamKey(param, index)
          });
        }),
        q: paramConfigs.value.length == 0 && paramConfigError.value == ""
      }, paramConfigs.value.length == 0 && paramConfigError.value == "" ? {} : {}, {
        r: common_vendor.o(confirmSendCommand, "bc"),
        s: common_vendor.p({
          type: "primary",
          text: "确认下发指令",
          loading: isSending.value,
          disabled: isSending.value || isCommandLoading.value || !isFormValid.value,
          class: "send-button data-v-c4271740"
        })
      }) : {}) : common_vendor.e({
        t: common_vendor.o(reloadHistory, "b3"),
        v: isHistoryInitialLoading.value
      }, isHistoryInitialLoading.value ? {} : historyRecords.value.length == 0 ? {} : {
        x: common_vendor.f(historyRecords.value, (record, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getRecordName(record)),
            b: common_vendor.t(getStatusText(record)),
            c: common_vendor.n(getStatusClass(record)),
            d: common_vendor.t(getRecordTime(record)),
            e: getRecordSummary(record) != ""
          }, getRecordSummary(record) != "" ? {
            f: common_vendor.t(getRecordSummary(record))
          } : {}, {
            g: common_vendor.t(getRecordRetryCount(record)),
            h: getRecordKey(record, index),
            i: common_vendor.o(($event) => {
              return showCommandDetail(record);
            }, getRecordKey(record, index))
          });
        })
      }, {
        w: historyRecords.value.length == 0,
        y: historyRecords.value.length > 0
      }, historyRecords.value.length > 0 ? common_vendor.e({
        z: isHistoryLoading.value
      }, isHistoryLoading.value ? {} : !hasMoreHistory.value ? {} : {}, {
        A: !hasMoreHistory.value
      }) : {}), {
        g: activeTab.value == "send",
        B: common_vendor.o(markHistoryScroll, "5d"),
        C: common_vendor.o(loadMoreHistory, "97"),
        D: common_vendor.o(($event) => {
          return selectOption($event);
        }, "c9"),
        E: common_vendor.o(($event) => {
          return optionSheetVisible.value = $event;
        }, "7d"),
        F: common_vendor.p({
          title: optionSheetTitle.value,
          actions: optionActions.value,
          cancelText: "取消",
          show: optionSheetVisible.value,
          class: "data-v-c4271740"
        }),
        G: isDetailLoading.value
      }, isDetailLoading.value ? {} : common_vendor.e({
        H: common_vendor.t(getRecordName(detailRecord.value)),
        I: common_vendor.t(getStatusText(detailRecord.value)),
        J: common_vendor.t(getRecordTime(detailRecord.value)),
        K: getDetailResponse() != ""
      }, getDetailResponse() != "" ? {
        L: common_vendor.t(getDetailResponse())
      } : {}, {
        M: getDetailReason() != ""
      }, getDetailReason() != "" ? {
        N: common_vendor.t(getDetailReason())
      } : {}, {
        O: getDetailParams() != ""
      }, getDetailParams() != "" ? {
        P: common_vendor.t(getDetailParams())
      } : {}), {
        Q: common_vendor.o(closeDetail, "cb"),
        R: common_vendor.o(confirmRetryFromDetail, "5f"),
        S: common_vendor.p({
          show: detailVisible.value,
          title: "指令详情",
          confirmText: "关闭",
          showCancelButton: canRetryDetail.value,
          cancelText: "重试下发",
          class: "data-v-c4271740"
        }),
        T: `${_ctx.u_s_b_h}px`,
        U: `${_ctx.u_s_a_i_b}px`,
        V: common_vendor.p({
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
