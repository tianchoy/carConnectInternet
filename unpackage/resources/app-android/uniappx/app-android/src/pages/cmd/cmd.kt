@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNI662B0B4
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import kotlin.properties.Delegates
open class GenPagesCmdCmd : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesCmdCmd) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesCmdCmd
            val _cache = __ins.renderCache
            val imei = ref("")
            val deviceId = ref("")
            val activeTab = ref("send")
            val tabItems = _uA(
                _uO("name" to "下发指令", "value" to "send"),
                _uO("name" to "指令记录", "value" to "history")
            ) as UTSArray<UTSJSONObject>
            val availableCommands = ref(_uA<UTSJSONObject>())
            val selectedCommand = ref<UTSJSONObject?>(null)
            val selectedCommandId = ref("")
            val paramConfigs = ref(_uA<UTSJSONObject>())
            val paramValues = ref(_uA<String>())
            val paramErrors = ref(_uA<String>())
            val paramConfigError = ref("")
            val isCommandLoading = ref(false)
            val isSending = ref(false)
            val optionSheetVisible = ref(false)
            val optionSheetTitle = ref("请选择")
            val optionActions = ref(_uA<UTSJSONObject>())
            val activeOptionIndex = ref(-1)
            val historyRecords = ref(_uA<UTSJSONObject>())
            val historyPageNum = ref(1)
            val historyPageSize: Number = 10
            val historyTotal = ref(0)
            val isHistoryLoading = ref(false)
            val hasLoadedHistory = ref(false)
            val hasMoreHistory = ref(true)
            val hasReachedHistoryBottom = ref(false)
            val detailVisible = ref(false)
            val isDetailLoading = ref(false)
            val detailRecord = ref<UTSJSONObject>(_uO())
            val isRetrying = ref(false)
            fun gen_getString_fn(item: UTSJSONObject?, key: String): String {
                return if (item != null) {
                    item.getString(key, "")
                } else {
                    ""
                }
            }
            val getString = ::gen_getString_fn
            fun gen_getBoolean_fn(item: UTSJSONObject?, key: String): Boolean {
                if (item == null) {
                    return false
                }
                return item.getBoolean(key, false) || getString(item, key) == "1"
            }
            val getBoolean = ::gen_getBoolean_fn
            fun gen_getCommandKey_fn(command: UTSJSONObject, index: Number): String {
                val cmdId = getString(command, "cmdId")
                return if (cmdId != "") {
                    cmdId
                } else {
                    "command_" + index.toString(10)
                }
            }
            val getCommandKey = ::gen_getCommandKey_fn
            fun gen_getCommandName_fn(command: UTSJSONObject?): String {
                val name = getString(command, "cmdName")
                return if (name != "") {
                    name
                } else {
                    "未命名指令"
                }
            }
            val getCommandName = ::gen_getCommandName_fn
            fun gen_getCommandCode_fn(command: UTSJSONObject?): String {
                return getString(command, "cmdCode")
            }
            val getCommandCode = ::gen_getCommandCode_fn
            fun gen_getCommandRemark_fn(command: UTSJSONObject?): String {
                return getString(command, "remark")
            }
            val getCommandRemark = ::gen_getCommandRemark_fn
            fun gen_isCommandAllowed_fn(command: UTSJSONObject?): Boolean {
                return getBoolean(command, "appAllowed")
            }
            val isCommandAllowed = ::gen_isCommandAllowed_fn
            fun gen_commandNeedsParams_fn(command: UTSJSONObject?): Boolean {
                return getString(command, "needParam") == "1"
            }
            val commandNeedsParams = ::gen_commandNeedsParams_fn
            fun gen_isSelectedCommand_fn(command: UTSJSONObject): Boolean {
                return getCommandKey(command, 0) == selectedCommandId.value
            }
            val isSelectedCommand = ::gen_isSelectedCommand_fn
            fun gen_getParamKey_fn(param: UTSJSONObject, index: Number): String {
                val key = getString(param, "key")
                return if (key != "") {
                    key
                } else {
                    "param_" + index.toString(10)
                }
            }
            val getParamKey = ::gen_getParamKey_fn
            fun gen_getParamLabel_fn(param: UTSJSONObject): String {
                val label = getString(param, "label")
                return if (label != "") {
                    label
                } else {
                    "参数"
                }
            }
            val getParamLabel = ::gen_getParamLabel_fn
            fun gen_getParamType_fn(param: UTSJSONObject): String {
                return getString(param, "type")
            }
            val getParamType = ::gen_getParamType_fn
            fun gen_isParamRequired_fn(param: UTSJSONObject): Boolean {
                return getBoolean(param, "required")
            }
            val isParamRequired = ::gen_isParamRequired_fn
            fun gen_getParamPlaceholder_fn(param: UTSJSONObject): String {
                val placeholder = getString(param, "placeholder")
                return if (placeholder != "") {
                    placeholder
                } else {
                    "请输入" + getParamLabel(param)
                }
            }
            val getParamPlaceholder = ::gen_getParamPlaceholder_fn
            fun gen_getParamValue_fn(index: Number): String {
                return if (index >= 0 && index < paramValues.value.length) {
                    paramValues.value[index]
                } else {
                    ""
                }
            }
            val getParamValue = ::gen_getParamValue_fn
            fun gen_getParamError_fn(index: Number): String {
                return if (index >= 0 && index < paramErrors.value.length) {
                    paramErrors.value[index]
                } else {
                    ""
                }
            }
            val getParamError = ::gen_getParamError_fn
            fun gen_getParamOptions_fn(param: UTSJSONObject): UTSArray<UTSJSONObject> {
                val options = param.getArray<UTSJSONObject>("options")
                return if (options != null) {
                    options
                } else {
                    _uA()
                }
            }
            val getParamOptions = ::gen_getParamOptions_fn
            fun gen_getOptionValue_fn(option: UTSJSONObject): String {
                return getString(option, "value")
            }
            val getOptionValue = ::gen_getOptionValue_fn
            fun gen_getOptionLabel_fn(option: UTSJSONObject): String {
                val label = getString(option, "label")
                return if (label != "") {
                    label
                } else {
                    getOptionValue(option)
                }
            }
            val getOptionLabel = ::gen_getOptionLabel_fn
            fun gen_parseNumber_fn(value: String): Number {
                val parsed = parseFloat(value)
                return if (isNaN(parsed)) {
                    0
                } else {
                    UTSNumber.from(parsed)
                }
            }
            val parseNumber = ::gen_parseNumber_fn
            fun gen_validateParam_fn(index: Number, updateError: Boolean): String {
                if (index < 0 || index >= paramConfigs.value.length) {
                    return ""
                }
                val param = paramConfigs.value[index]
                val value = getParamValue(index).trim()
                var error = ""
                if (isParamRequired(param) && value == "") {
                    error = "请填写" + getParamLabel(param)
                } else if (value != "" && getParamType(param) == "number") {
                    val numberValue = parseFloat(value)
                    if (isNaN(numberValue)) {
                        error = getParamLabel(param) + "必须为数字"
                    } else {
                        val minText = getString(param, "min")
                        val maxText = getString(param, "max")
                        if (minText != "" && numberValue < parseNumber(minText)) {
                            error = getParamLabel(param) + "不能小于" + minText
                        }
                        if (error == "" && maxText != "" && numberValue > parseNumber(maxText)) {
                            error = getParamLabel(param) + "不能大于" + maxText
                        }
                    }
                }
                if (updateError && index >= 0 && index < paramErrors.value.length) {
                    paramErrors.value[index] = error
                }
                return error
            }
            val validateParam = ::gen_validateParam_fn
            fun gen_getStatusValue_fn(record: UTSJSONObject?): String {
                return getString(record, "sendStatus")
            }
            val getStatusValue = ::gen_getStatusValue_fn
            fun gen_getStatusText_fn(record: UTSJSONObject?): String {
                val status = getStatusValue(record)
                if (status == "1") {
                    return "下发成功"
                }
                if (status == "2") {
                    return "下发失败"
                }
                return "等待下发"
            }
            val getStatusText = ::gen_getStatusText_fn
            fun gen_getStatusClass_fn(record: UTSJSONObject?): String {
                val status = getStatusValue(record)
                if (status == "1") {
                    return "status-success"
                }
                if (status == "2") {
                    return "status-failed"
                }
                return "status-pending"
            }
            val getStatusClass = ::gen_getStatusClass_fn
            val displayDeviceIdentity = computed<String>(fun(): String {
                return if (imei.value != "") {
                    imei.value
                } else {
                    if (deviceId.value != "") {
                        "设备 " + deviceId.value
                    } else {
                        "未识别设备"
                    }
                }
            }
            )
            val isHistoryInitialLoading = computed<Boolean>(fun(): Boolean {
                return isHistoryLoading.value && !hasLoadedHistory.value && historyRecords.value.length == 0
            }
            )
            val isFormValid = computed<Boolean>(fun(): Boolean {
                if (selectedCommand.value == null || !isCommandAllowed(selectedCommand.value) || paramConfigError.value != "") {
                    return false
                }
                if (paramValues.value.length != paramConfigs.value.length) {
                    return false
                }
                run {
                    var index: Number = 0
                    while(index < paramConfigs.value.length){
                        if (validateParam(index, false) != "") {
                            return false
                        }
                        index++
                    }
                }
                return true
            }
            )
            val canRetryDetail = computed<Boolean>(fun(): Boolean {
                val status = getStatusValue(detailRecord.value)
                return !isDetailLoading.value && (status == "0" || status == "2")
            }
            )
            fun gen_parseParamConfigs_fn(schema: String): UTSArray<UTSJSONObject> {
                paramConfigError.value = ""
                if (schema.trim() == "") {
                    return _uA()
                }
                try {
                    val parsed = JSON.parse(schema)
                    if (!UTSArray.isArray(parsed)) {
                        paramConfigError.value = "指令参数配置格式无效"
                        return _uA()
                    }
                    val configs = parsed as UTSArray<UTSJSONObject>
                    run {
                        var index: Number = 0
                        while(index < configs.length){
                            val param = configs[index]
                            if (param == null || getString(param, "key") == "" || getString(param, "label") == "") {
                                paramConfigError.value = "指令参数配置不完整"
                                return _uA()
                            }
                            val type = getParamType(param)
                            if (type != "text" && type != "number" && type != "select") {
                                paramConfigError.value = "该指令包含暂不支持的参数类型"
                                return _uA()
                            }
                            if (type == "select") {
                                val options = getParamOptions(param)
                                if (options.length == 0 || options.some(fun(option: UTSJSONObject): Boolean {
                                    return getOptionValue(option) == "" || getOptionLabel(option) == ""
                                }
                                )) {
                                    paramConfigError.value = "指令下拉参数配置无效"
                                    return _uA()
                                }
                            }
                            index++
                        }
                    }
                    return configs
                }
                 catch (error: Throwable) {
                    console.error("解析指令参数配置失败:", error)
                    paramConfigError.value = "指令参数配置无效"
                    return _uA()
                }
            }
            val parseParamConfigs = ::gen_parseParamConfigs_fn
            fun gen_initializeParamValues_fn(configs: UTSArray<UTSJSONObject>): UTSArray<String> {
                val values: UTSArray<String> = _uA()
                run {
                    var index: Number = 0
                    while(index < configs.length){
                        val defaultValue = configs[index].getString("default", "")
                        values.push(defaultValue)
                        index++
                    }
                }
                return values
            }
            val initializeParamValues = ::gen_initializeParamValues_fn
            fun gen_updateParamValue_fn(index: Number, value: Any): Unit {
                if (isSending.value || index < 0 || index >= paramValues.value.length) {
                    return
                }
                paramValues.value[index] = if (value == null) {
                    ""
                } else {
                    value.toString()
                }
                validateParam(index, true)
            }
            val updateParamValue = ::gen_updateParamValue_fn
            fun gen_getSelectedOptionLabel_fn(index: Number): String {
                if (index < 0 || index >= paramConfigs.value.length) {
                    return ""
                }
                val value = getParamValue(index)
                if (value == "") {
                    return ""
                }
                val option = getParamOptions(paramConfigs.value[index]).find(fun(item: UTSJSONObject): Boolean {
                    return getOptionValue(item) == value
                }
                )
                return if (option == null) {
                    value
                } else {
                    getOptionLabel(option)
                }
            }
            val getSelectedOptionLabel = ::gen_getSelectedOptionLabel_fn
            fun gen_openOptionSheet_fn(index: Number): Unit {
                if (isSending.value || index < 0 || index >= paramConfigs.value.length) {
                    return
                }
                val param = paramConfigs.value[index]
                if (getParamType(param) != "select") {
                    return
                }
                activeOptionIndex.value = index
                optionSheetTitle.value = "请选择" + getParamLabel(param)
                val actions: UTSArray<UTSJSONObject> = _uA()
                getParamOptions(param).forEach(fun(option: UTSJSONObject): Unit {
                    val action = UTSJSONObject()
                    action.set("name", getOptionLabel(option))
                    action.set("value", getOptionValue(option))
                    actions.push(action)
                }
                )
                optionActions.value = actions
                optionSheetVisible.value = true
            }
            val openOptionSheet = ::gen_openOptionSheet_fn
            fun gen_getEventItem_fn(event: Any): UTSJSONObject? {
                if (event == null || UTSAndroid.`typeof`(event) != "object") {
                    return null
                }
                return (event as UTSJSONObject).getJSON("item")
            }
            val getEventItem = ::gen_getEventItem_fn
            fun gen_selectOption_fn(event: Any): Unit {
                val index = activeOptionIndex.value
                if (index < 0 || index >= paramValues.value.length) {
                    return
                }
                val item = getEventItem(event)
                val value = if (item != null) {
                    getString(item, "value")
                } else {
                    ""
                }
                if (value != "") {
                    paramValues.value[index] = value
                    validateParam(index, true)
                }
                activeOptionIndex.value = -1
            }
            val selectOption = ::gen_selectOption_fn
            fun gen_resetSelection_fn(): Unit {
                selectedCommand.value = null
                selectedCommandId.value = ""
                paramConfigs.value = _uA()
                paramValues.value = _uA()
                paramErrors.value = _uA()
                paramConfigError.value = ""
            }
            val resetSelection = ::gen_resetSelection_fn
            fun gen_loadAvailableCommands_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (deviceId.value == "" || isCommandLoading.value) {
                            return@w1
                        }
                        try {
                            isCommandLoading.value = true
                            val response = await(getAppAvailableCommands(deviceId.value))
                            if (response.code == 200) {
                                availableCommands.value = response.data
                                val stillSelected = if (selectedCommandId.value != "") {
                                    response.data.find(fun(command: UTSJSONObject): Boolean {
                                        return getCommandKey(command, 0) == selectedCommandId.value
                                    })
                                } else {
                                    null
                                }
                                if (stillSelected == null) {
                                    resetSelection()
                                }
                            } else {
                                availableCommands.value = _uA()
                                resetSelection()
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "加载可用指令失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载可用指令失败:", error)
                            showAppToast(ShowToastOptions(title = "加载可用指令失败，请检查网络", icon = "none"))
                        }
                         finally {
                            isCommandLoading.value = false
                        }
                })
            }
            val loadAvailableCommands = ::gen_loadAvailableCommands_fn
            fun gen_selectCommand_fn(command: UTSJSONObject): Unit {
                if (isSending.value) {
                    return
                }
                if (!isCommandAllowed(command)) {
                    showAppToast(ShowToastOptions(title = "该指令不允许在 App 端下发", icon = "none"))
                    return
                }
                selectedCommand.value = command
                selectedCommandId.value = getCommandKey(command, 0)
                val configs = parseParamConfigs(getString(command, "paramSchema"))
                paramConfigs.value = configs
                paramValues.value = if (paramConfigError.value == "") {
                    initializeParamValues(configs)
                } else {
                    _uA()
                }
                paramErrors.value = configs.map(fun(_param: UTSJSONObject): String {
                    return ""
                }
                )
            }
            val selectCommand = ::gen_selectCommand_fn
            fun gen_buildCommandParams_fn(): UTSJSONObject {
                val params = UTSJSONObject()
                run {
                    var index: Number = 0
                    while(index < paramConfigs.value.length){
                        val value = getParamValue(index).trim()
                        if (value != "") {
                            params.set(getParamKey(paramConfigs.value[index], index), value)
                        }
                        index++
                    }
                }
                return params
            }
            val buildCommandParams = ::gen_buildCommandParams_fn
            fun gen_loadHistoryPage_fn(reset: Boolean): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (deviceId.value == "" || isHistoryLoading.value || (!reset && !hasMoreHistory.value)) {
                            return@w1
                        }
                        val requestedPage = if (reset) {
                            1
                        } else {
                            historyPageNum.value
                        }
                        try {
                            isHistoryLoading.value = true
                            val query = UTSJSONObject()
                            query.set("deviceId", deviceId.value)
                            query.set("pageNum", requestedPage)
                            query.set("pageSize", historyPageSize)
                            val response = await(getAppCommandHistory(query))
                            if (response.code != 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "加载指令记录失败"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            val rows = response.data.rows
                            if (reset) {
                                historyRecords.value = rows
                            } else {
                                historyRecords.value = historyRecords.value.concat(rows)
                            }
                            historyTotal.value = response.data.total
                            historyPageNum.value = requestedPage + 1
                            hasMoreHistory.value = historyRecords.value.length < historyTotal.value && rows.length > 0
                        }
                         catch (error: Throwable) {
                            console.error("加载指令记录失败:", error)
                            showAppToast(ShowToastOptions(title = "加载指令记录失败，请检查网络", icon = "none"))
                        }
                         finally {
                            hasLoadedHistory.value = true
                            isHistoryLoading.value = false
                        }
                })
            }
            val loadHistoryPage = ::gen_loadHistoryPage_fn
            fun gen_reloadHistory_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        hasReachedHistoryBottom.value = false
                        historyPageNum.value = 1
                        historyRecords.value = _uA()
                        historyTotal.value = 0
                        hasMoreHistory.value = true
                        hasLoadedHistory.value = false
                        await(loadHistoryPage(true))
                })
            }
            val reloadHistory = ::gen_reloadHistory_fn
            fun gen_sendSelectedCommand_fn(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val command = selectedCommand.value
                        if (command == null || deviceId.value == "" || isSending.value) {
                            return@w1
                        }
                        val cmdId = getString(command, "cmdId")
                        if (cmdId == "") {
                            showAppToast(ShowToastOptions(title = "指令模板信息不完整", icon = "none"))
                            return@w1
                        }
                        val requestData = UTSJSONObject()
                        requestData.set("deviceId", deviceId.value)
                        requestData.set("cmdId", cmdId)
                        val cmdCode = getCommandCode(command)
                        if (cmdCode != "") {
                            requestData.set("cmdCode", cmdCode)
                        }
                        requestData.set("params", buildCommandParams())
                        try {
                            isSending.value = true
                            val response = await(sendAppCommand(requestData))
                            if (response.code == 200) {
                                val requestIdText = if (response.data != "") {
                                    "追踪编号：" + response.data
                                } else {
                                    "请在指令记录中查看下发结果"
                                }
                                showAppToast(ShowToastOptions(title = "指令已提交，" + requestIdText, icon = "success", duration = 3500))
                                await(reloadHistory())
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "指令下发失败"
                                }
                                , icon = "none", duration = 3000))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("下发指令失败:", error)
                            showAppToast(ShowToastOptions(title = "指令下发失败，请检查网络", icon = "none"))
                        }
                         finally {
                            isSending.value = false
                        }
                })
            }
            val sendSelectedCommand = ::gen_sendSelectedCommand_fn
            fun gen_confirmSendCommand_fn(): Unit {
                if (selectedCommand.value == null) {
                    showAppToast(ShowToastOptions(title = "请选择要下发的指令", icon = "none"))
                    return
                }
                run {
                    var index: Number = 0
                    while(index < paramConfigs.value.length){
                        validateParam(index, true)
                        index++
                    }
                }
                if (!isFormValid.value) {
                    showAppToast(ShowToastOptions(title = "请检查指令参数", icon = "none"))
                    return
                }
                showAppModal(AppModalOptions(title = "确认下发指令", content = "即将向设备下发“" + getCommandName(selectedCommand.value) + "”。指令下发后可能影响车辆使用，请确认操作。", confirmText = "确认下发", cancelText = "取消", success = fun(result: AppModalSuccess): Unit {
                    if (result.confirm) {
                        sendSelectedCommand()
                    }
                }
                ))
            }
            val confirmSendCommand = ::gen_confirmSendCommand_fn
            fun gen_getRecordKey_fn(record: UTSJSONObject, index: Number): String {
                val id = getString(record, "id")
                return if (id != "") {
                    id
                } else {
                    "record_" + index.toString(10)
                }
            }
            val getRecordKey = ::gen_getRecordKey_fn
            fun gen_getRecordName_fn(record: UTSJSONObject?): String {
                val name = getString(record, "cmdName")
                return if (name != "") {
                    name
                } else {
                    if (getString(record, "commandType") != "") {
                        getString(record, "commandType")
                    } else {
                        "未知指令"
                    }
                }
            }
            val getRecordName = ::gen_getRecordName_fn
            fun gen_getRecordTime_fn(record: UTSJSONObject?): String {
                val time = getString(record, "sendTime")
                return if (time != "") {
                    time
                } else {
                    getString(record, "createTime")
                }
            }
            val getRecordTime = ::gen_getRecordTime_fn
            fun gen_getRecordRetryCount_fn(record: UTSJSONObject?): String {
                val count = getString(record, "retryCount")
                return if (count != "") {
                    count
                } else {
                    "0"
                }
            }
            val getRecordRetryCount = ::gen_getRecordRetryCount_fn
            fun gen_getRecordSummary_fn(record: UTSJSONObject?): String {
                val reason = getString(record, "reason")
                return if (reason != "") {
                    reason
                } else {
                    getString(record, "responseContent")
                }
            }
            val getRecordSummary = ::gen_getRecordSummary_fn
            fun gen_markHistoryScroll_fn(event: UniScrollEvent): Unit {
                if (activeTab.value != "history") {
                    return
                }
            }
            val markHistoryScroll = ::gen_markHistoryScroll_fn
            fun gen_loadMoreHistory_fn(): Unit {
                if (activeTab.value != "history") {
                    return
                }
                loadHistoryPage(false)
            }
            val loadMoreHistory = ::gen_loadMoreHistory_fn
            fun gen_showCommandDetail_fn(record: UTSJSONObject): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        val commandId = getString(record, "id")
                        if (commandId == "") {
                            return@w1
                        }
                        detailRecord.value = record
                        detailVisible.value = true
                        isDetailLoading.value = true
                        try {
                            val response = await(getAppCommandDetail(commandId))
                            if (response.code == 200 && response.data != null) {
                                detailRecord.value = response.data
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "加载指令详情失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载指令详情失败:", error)
                            showAppToast(ShowToastOptions(title = "加载指令详情失败，请检查网络", icon = "none"))
                        }
                         finally {
                            isDetailLoading.value = false
                        }
                })
            }
            val showCommandDetail = ::gen_showCommandDetail_fn
            fun gen_closeDetail_fn(): Unit {
                detailVisible.value = false
            }
            val closeDetail = ::gen_closeDetail_fn
            fun gen_getDetailResponse_fn(): String {
                return getString(detailRecord.value, "responseContent")
            }
            val getDetailResponse = ::gen_getDetailResponse_fn
            fun gen_getDetailReason_fn(): String {
                return getString(detailRecord.value, "reason")
            }
            val getDetailReason = ::gen_getDetailReason_fn
            fun gen_getDetailParams_fn(): String {
                return getString(detailRecord.value, "commandParams")
            }
            val getDetailParams = ::gen_getDetailParams_fn
            fun gen_retryCommand_fn(commandId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (isRetrying.value) {
                            return@w1
                        }
                        try {
                            isRetrying.value = true
                            val response = await(retryAppCommand(commandId))
                            if (response.code == 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "已重新提交指令"
                                }, icon = "success"))
                                detailVisible.value = false
                                await(reloadHistory())
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "重试下发失败"
                                }
                                , icon = "none", duration = 3000))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("重试下发失败:", error)
                            showAppToast(ShowToastOptions(title = "重试下发失败，请检查网络", icon = "none"))
                        }
                         finally {
                            isRetrying.value = false
                        }
                })
            }
            val retryCommand = ::gen_retryCommand_fn
            fun gen_confirmRetryFromDetail_fn(): Unit {
                val commandId = getString(detailRecord.value, "id")
                if (commandId == "" || isRetrying.value) {
                    return
                }
                showAppModal(AppModalOptions(title = "确认重试", content = "将重新下发“" + getRecordName(detailRecord.value) + "”，请确认设备当前状态适合执行此操作。", confirmText = "确认重试", cancelText = "取消", success = fun(result: AppModalSuccess): Unit {
                    if (result.confirm) {
                        retryCommand(commandId)
                    }
                }
                ))
            }
            val confirmRetryFromDetail = ::gen_confirmRetryFromDetail_fn
            fun gen_changeTab_fn(value: String): Unit {
                if (value == "" || value == activeTab.value) {
                    return
                }
                activeTab.value = value
                if (value == "history" && !hasLoadedHistory.value) {
                    reloadHistory()
                }
            }
            val changeTab = ::gen_changeTab_fn
            onLoad(fun(options){
                imei.value = options["imei"] ?: ""
                deviceId.value = options["deviceId"] ?: ""
                if (deviceId.value != "") {
                    loadAvailableCommands()
                }
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_tabs = resolveEasyComponent("i-tabs", GenUniModulesIUiXComponentsITabsITabsClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_i_action_sheet = resolveEasyComponent("i-action-sheet", GenUniModulesIUiXComponentsIActionSheetIActionSheetClass)
                val _component_i_modal = resolveEasyComponent("i-modal", GenUniModulesIUiXComponentsIModalIModalClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "page"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "指令中心", "show-back" to true, "backgroundColor" to "#ffffff", "textColor" to "#1f2937", "showCapsule" to false)),
                        _cE("view", _uM("class" to "content-wrap"), _uA(
                            _cE("view", _uM("class" to "device-card"), _uA(
                                _cE("view", _uM("class" to "device-card-main"), _uA(
                                    _cE("text", _uM("class" to "device-title"), "当前设备"),
                                    _cE("text", _uM("class" to "device-imei"), _tD(displayDeviceIdentity.value), 1)
                                )),
                                _cE("view", _uM("class" to "device-id-wrap"), _uA(
                                    _cE("text", _uM("class" to "device-id-label"), "设备 ID"),
                                    _cE("text", _uM("class" to "device-id-value"), _tD(if (deviceId.value != "") {
                                        deviceId.value
                                    } else {
                                        "--"
                                    }
                                    ), 1)
                                ))
                            )),
                            _cV(_component_i_tabs, _uM("value" to activeTab.value, "list" to tabItems, "activeColor" to "#1677ff", "inactiveColor" to "#667085", "bgColor" to "#ffffff", "onUpdate:value" to changeTab), null, 8, _uA(
                                "value"
                            )),
                            _cE("scroll-view", _uM("class" to "main-scroll", "scroll-y" to "true", "show-scrollbar" to false, "lower-threshold" to 80, "onScroll" to markHistoryScroll, "onScrolltolower" to loadMoreHistory), _uA(
                                if (deviceId.value == "") {
                                    _cE("view", _uM("key" to 0, "class" to "state-card"), _uA(
                                        _cE("text", _uM("class" to "state-title"), "无法加载指令"),
                                        _cE("text", _uM("class" to "state-text"), "未获取到设备 ID，请返回车辆详情后重新进入。")
                                    ))
                                } else {
                                    if (activeTab.value == "send") {
                                        _cE("view", _uM("key" to 1, "class" to "tab-content"), _uA(
                                            _cE("view", _uM("class" to "section-heading"), _uA(
                                                _cE("view", null, _uA(
                                                    _cE("text", _uM("class" to "section-title"), "可用指令"),
                                                    _cE("text", _uM("class" to "section-subtitle"), "请选择要下发到设备的指令")
                                                )),
                                                _cE("text", _uM("class" to "refresh-link", "onClick" to loadAvailableCommands), "刷新")
                                            )),
                                            if (isTrue(isCommandLoading.value)) {
                                                _cE("view", _uM("key" to 0, "class" to "state-card compact-state"), _uA(
                                                    _cE("text", _uM("class" to "state-text"), "正在加载可用指令...")
                                                ))
                                            } else {
                                                if (availableCommands.value.length == 0) {
                                                    _cE("view", _uM("key" to 1, "class" to "state-card compact-state"), _uA(
                                                        _cE("text", _uM("class" to "state-title"), "暂无可用指令"),
                                                        _cE("text", _uM("class" to "state-text"), "请确认设备状态后重试。")
                                                    ))
                                                } else {
                                                    _cE("view", _uM("key" to 2, "class" to "command-list"), _uA(
                                                        _cE(Fragment, null, RenderHelpers.renderList(availableCommands.value, fun(command, index, __index, _cached): Any {
                                                            return _cE("view", _uM("key" to getCommandKey(command, index), "class" to _nC(_uA(
                                                                "command-card",
                                                                _uM("selected" to isSelectedCommand(command), "disabled" to !isCommandAllowed(command))
                                                            )), "onClick" to fun(){
                                                                selectCommand(command)
                                                            }), _uA(
                                                                _cE("view", _uM("class" to "command-card-top"), _uA(
                                                                    _cE("view", _uM("class" to "command-name-wrap"), _uA(
                                                                        _cE("text", _uM("class" to "command-name"), _tD(getCommandName(command)), 1)
                                                                    )),
                                                                    _cE("text", _uM("class" to _nC(_uA(
                                                                        "command-status",
                                                                        _uM("blocked" to !isCommandAllowed(command))
                                                                    ))), _tD(if (isCommandAllowed(command)) {
                                                                        if (commandNeedsParams(command)) {
                                                                            "需填写参数"
                                                                        } else {
                                                                            "无需参数"
                                                                        }
                                                                    } else {
                                                                        "App 端不可下发"
                                                                    }), 3)
                                                                )),
                                                                if (isTrue(getCommandCode(command) != "" || getCommandRemark(command) != "")) {
                                                                    _cE("view", _uM("key" to 0, "class" to "command-card-meta"), _uA(
                                                                        if (getCommandCode(command) != "") {
                                                                            _cE("text", _uM("key" to 0, "class" to "command-code"), _tD(getCommandCode(command)), 1)
                                                                        } else {
                                                                            _cC("v-if", true)
                                                                        },
                                                                        if (getCommandRemark(command) != "") {
                                                                            _cE("text", _uM("key" to 1, "class" to "command-remark"), _tD(getCommandRemark(command)), 1)
                                                                        } else {
                                                                            _cC("v-if", true)
                                                                        }
                                                                    ))
                                                                } else {
                                                                    _cC("v-if", true)
                                                                }
                                                            ), 10, _uA(
                                                                "onClick"
                                                            ))
                                                        }), 128)
                                                    ))
                                                }
                                            },
                                            if (selectedCommand.value != null) {
                                                _cE("view", _uM("key" to 3, "class" to "form-card"), _uA(
                                                    _cE("view", _uM("class" to "form-header"), _uA(
                                                        _cE("view", null, _uA(
                                                            _cE("text", _uM("class" to "section-title"), _tD(getCommandName(selectedCommand.value)), 1),
                                                            _cE("text", _uM("class" to "section-subtitle"), "请确认参数后再下发")
                                                        ))
                                                    )),
                                                    if (paramConfigError.value != "") {
                                                        _cE("text", _uM("key" to 0, "class" to "form-error"), _tD(paramConfigError.value), 1)
                                                    } else {
                                                        _cC("v-if", true)
                                                    },
                                                    _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, fun(param, index, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to getParamKey(param, index), "class" to "param-row"), _uA(
                                                            _cE("view", _uM("class" to "param-label-row"), _uA(
                                                                _cE("text", _uM("class" to "param-label"), _tD(getParamLabel(param)), 1),
                                                                if (isTrue(isParamRequired(param))) {
                                                                    _cE("text", _uM("key" to 0, "class" to "required-mark"), "*")
                                                                } else {
                                                                    _cC("v-if", true)
                                                                }
                                                            )),
                                                            if (isTrue(getParamType(param) == "text" || getParamType(param) == "number")) {
                                                                _cV(_component_i_input, _uM("key" to 0, "class" to "param-input", "model-value" to getParamValue(index), "type" to if (getParamType(param) == "number") {
                                                                    "number"
                                                                } else {
                                                                    "text"
                                                                }, "placeholder" to getParamPlaceholder(param), "placeholder-class" to "input-placeholder", "border" to "none", "onUpdate:modelValue" to fun(`$event`: Any){
                                                                    updateParamValue(index, `$event`)
                                                                }), null, 8, _uA(
                                                                    "model-value",
                                                                    "type",
                                                                    "placeholder",
                                                                    "onUpdate:modelValue"
                                                                ))
                                                            } else {
                                                                if (getParamType(param) == "select") {
                                                                    _cE("view", _uM("key" to 1, "class" to "select-field", "onClick" to fun(){
                                                                        openOptionSheet(index)
                                                                    }), _uA(
                                                                        _cE("text", _uM("class" to _nC(_uM("select-placeholder" to (getSelectedOptionLabel(index) == "")))), _tD(if (getSelectedOptionLabel(index) != "") {
                                                                            getSelectedOptionLabel(index)
                                                                        } else {
                                                                            getParamPlaceholder(param)
                                                                        }), 3),
                                                                        _cE("text", _uM("class" to "select-arrow"), "›")
                                                                    ), 8, _uA(
                                                                        "onClick"
                                                                    ))
                                                                } else {
                                                                    _cC("v-if", true)
                                                                }
                                                            },
                                                            if (getParamError(index) != "") {
                                                                _cE("text", _uM("key" to 2, "class" to "param-error"), _tD(getParamError(index)), 1)
                                                            } else {
                                                                _cC("v-if", true)
                                                            }
                                                        ))
                                                    }), 128),
                                                    if (isTrue(paramConfigs.value.length == 0 && paramConfigError.value == "")) {
                                                        _cE("text", _uM("key" to 1, "class" to "no-param-text"), "该指令无需填写参数")
                                                    } else {
                                                        _cC("v-if", true)
                                                    },
                                                    _cV(_component_i_button, _uM("class" to "send-button", "type" to "primary", "text" to "确认下发指令", "loading" to isSending.value, "disabled" to (isSending.value || isCommandLoading.value || !isFormValid.value), "onClick" to confirmSendCommand), null, 8, _uA(
                                                        "loading",
                                                        "disabled"
                                                    ))
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        ))
                                    } else {
                                        _cE("view", _uM("key" to 2, "class" to "tab-content history-content"), _uA(
                                            _cE("view", _uM("class" to "section-heading"), _uA(
                                                _cE("view", null, _uA(
                                                    _cE("text", _uM("class" to "section-title"), "指令记录"),
                                                    _cE("text", _uM("class" to "section-subtitle"), "可查看下发结果或重新尝试失败指令")
                                                )),
                                                _cE("text", _uM("class" to "refresh-link", "onClick" to reloadHistory), "刷新")
                                            )),
                                            if (isTrue(isHistoryInitialLoading.value)) {
                                                _cE("view", _uM("key" to 0, "class" to "state-card compact-state"), _uA(
                                                    _cE("text", _uM("class" to "state-text"), "正在加载指令记录...")
                                                ))
                                            } else {
                                                if (historyRecords.value.length == 0) {
                                                    _cE("view", _uM("key" to 1, "class" to "state-card compact-state"), _uA(
                                                        _cE("text", _uM("class" to "state-title"), "暂无指令记录"),
                                                        _cE("text", _uM("class" to "state-text"), "成功下发指令后，记录将显示在这里。")
                                                    ))
                                                } else {
                                                    _cE("view", _uM("key" to 2, "class" to "history-list"), _uA(
                                                        _cE(Fragment, null, RenderHelpers.renderList(historyRecords.value, fun(record, index, __index, _cached): Any {
                                                            return _cE("view", _uM("key" to getRecordKey(record, index), "class" to "history-card", "onClick" to fun(){
                                                                showCommandDetail(record)
                                                            }
                                                            ), _uA(
                                                                _cE("view", _uM("class" to "history-card-top"), _uA(
                                                                    _cE("text", _uM("class" to "history-name"), _tD(getRecordName(record)), 1),
                                                                    _cE("text", _uM("class" to _nC(_uA(
                                                                        "history-status",
                                                                        getStatusClass(record)
                                                                    ))), _tD(getStatusText(record)), 3)
                                                                )),
                                                                _cE("text", _uM("class" to "history-time"), _tD(getRecordTime(record)), 1),
                                                                if (getRecordSummary(record) != "") {
                                                                    _cE("text", _uM("key" to 0, "class" to "history-summary"), _tD(getRecordSummary(record)), 1)
                                                                } else {
                                                                    _cC("v-if", true)
                                                                }
                                                                ,
                                                                _cE("view", _uM("class" to "history-bottom"), _uA(
                                                                    _cE("text", _uM("class" to "retry-count"), "已重试 " + _tD(getRecordRetryCount(record)) + " 次", 1),
                                                                    _cE("text", _uM("class" to "detail-link"), "查看详情 ›")
                                                                ))
                                                            ), 8, _uA(
                                                                "onClick"
                                                            ))
                                                        }
                                                        ), 128)
                                                    ))
                                                }
                                            }
                                            ,
                                            if (historyRecords.value.length > 0) {
                                                _cE("view", _uM("key" to 3, "class" to "history-footer"), _uA(
                                                    if (isTrue(isHistoryLoading.value)) {
                                                        _cE("text", _uM("key" to 0, "class" to "loading-text"), "加载中...")
                                                    } else {
                                                        if (isTrue(!hasMoreHistory.value)) {
                                                            _cE("text", _uM("key" to 1, "class" to "no-more-text"), "没有更多记录了")
                                                        } else {
                                                            _cE("text", _uM("key" to 2, "class" to "load-more-text"), "上拉加载更多")
                                                        }
                                                    }
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        ))
                                    }
                                }
                            ), 32)
                        )),
                        _cV(_component_i_action_sheet, _uM("show" to optionSheetVisible.value, "onUpdate:show" to fun(`$event`: Boolean){
                            optionSheetVisible.value = `$event`
                        }
                        , "title" to optionSheetTitle.value, "actions" to optionActions.value, "cancelText" to "取消", "onSelect" to fun(`$event`: Any){
                            selectOption(`$event`)
                        }
                        ), null, 8, _uA(
                            "show",
                            "onUpdate:show",
                            "title",
                            "actions",
                            "onSelect"
                        )),
                        _cV(_component_i_modal, _uM("show" to detailVisible.value, "title" to "指令详情", "confirmText" to "关闭", "showCancelButton" to canRetryDetail.value, "cancelText" to "重试下发", "onConfirm" to closeDetail, "onCancel" to confirmRetryFromDetail), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                            return _uA(
                                if (isTrue(isDetailLoading.value)) {
                                    _cE("view", _uM("key" to 0, "class" to "detail-loading"), _uA(
                                        _cE("text", null, "正在加载详情...")
                                    ))
                                } else {
                                    _cE("view", _uM("key" to 1, "class" to "detail-content"), _uA(
                                        _cE("view", _uM("class" to "detail-row"), _uA(
                                            _cE("text", _uM("class" to "detail-label"), "指令名称"),
                                            _cE("text", _uM("class" to "detail-value"), _tD(getRecordName(detailRecord.value)), 1)
                                        )),
                                        _cE("view", _uM("class" to "detail-row"), _uA(
                                            _cE("text", _uM("class" to "detail-label"), "下发状态"),
                                            _cE("text", _uM("class" to "detail-value"), _tD(getStatusText(detailRecord.value)), 1)
                                        )),
                                        _cE("view", _uM("class" to "detail-row"), _uA(
                                            _cE("text", _uM("class" to "detail-label"), "发送时间"),
                                            _cE("text", _uM("class" to "detail-value"), _tD(getRecordTime(detailRecord.value)), 1)
                                        )),
                                        if (getDetailResponse() != "") {
                                            _cE("view", _uM("key" to 0, "class" to "detail-row detail-long-row"), _uA(
                                                _cE("text", _uM("class" to "detail-label"), "响应信息"),
                                                _cE("text", _uM("class" to "detail-value"), _tD(getDetailResponse()), 1)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                        ,
                                        if (getDetailReason() != "") {
                                            _cE("view", _uM("key" to 1, "class" to "detail-row detail-long-row"), _uA(
                                                _cE("text", _uM("class" to "detail-label"), "结果说明"),
                                                _cE("text", _uM("class" to "detail-value"), _tD(getDetailReason()), 1)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                        ,
                                        if (getDetailParams() != "") {
                                            _cE("view", _uM("key" to 2, "class" to "detail-row detail-long-row"), _uA(
                                                _cE("text", _uM("class" to "detail-label"), "指令参数"),
                                                _cE("text", _uM("class" to "detail-value"), _tD(getDetailParams()), 1)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                }
                            )
                        }
                        ), "_" to 1), 8, _uA(
                            "show",
                            "showCancelButton"
                        ))
                    )),
                    _cV(_component_app_toast)
                ), 64)
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("page" to _pS(_uM("width" to "100%", "height" to "100%", "display" to "flex", "flexDirection" to "column", "backgroundColor" to "#f5f7fb")), "content-wrap" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minHeight" to 0, "display" to "flex", "flexDirection" to "column")), "device-card" to _pS(_uM("display" to "flex", "justifyContent" to "space-between", "marginTop" to "20rpx", "marginRight" to "24rpx", "marginBottom" to "16rpx", "marginLeft" to "24rpx", "paddingTop" to "28rpx", "paddingRight" to "30rpx", "paddingBottom" to "28rpx", "paddingLeft" to "30rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "backgroundImage" to "linear-gradient(to right, #1769e0, #56a0f6)", "boxShadow" to "0 10rpx 28rpx rgba(22, 119, 255, 0.22)")), "device-card-main" to _pS(_uM("display" to "flex", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minWidth" to 0, "flexDirection" to "row", "alignItems" to "center")), "device-id-wrap" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "flex-end")), "section-heading" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "marginBottom" to "20rpx")), "command-card-top" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "command-name-wrap" to _pS(_uM("display" to "flex", "minWidth" to 0, "alignItems" to "center")), "form-header" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "space-between", "marginBottom" to "12rpx")), "param-label-row" to _pS(_uM("display" to "flex", "alignItems" to "center", "marginBottom" to "12rpx")), "history-card-top" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "history-bottom" to _pS(_uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "marginTop" to "18rpx")), "detail-row" to _pS(_uM("display" to "flex", "alignItems" to "flex-start", "justifyContent" to "space-between", "paddingTop" to "9rpx", "paddingRight" to 0, "paddingBottom" to "9rpx", "paddingLeft" to 0)), "device-title" to _pS(_uM("color" to "rgba(255,255,255,0.76)", "fontSize" to "23rpx", "marginRight" to "20rpx")), "device-id-label" to _pS(_uM("color" to "rgba(255,255,255,0.76)", "fontSize" to "23rpx", "marginRight" to "20rpx")), "device-imei" to _pS(_uM("color" to "#ffffff", "fontSize" to "32rpx", "fontWeight" to 600)), "device-id-value" to _pS(_uM("marginTop" to "8rpx", "color" to "#ffffff", "fontSize" to "25rpx")), "main-scroll" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "minHeight" to 0)), "tab-content" to _pS(_uM("paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "44rpx", "paddingLeft" to "24rpx")), "section-title" to _pS(_uM("color" to "#1f2937", "fontSize" to "32rpx", "fontWeight" to 600)), "section-subtitle" to _pS(_uM("marginTop" to "7rpx", "color" to "#98a2b3", "fontSize" to "23rpx")), "refresh-link" to _pS(_uM("color" to "#1677ff", "fontSize" to "25rpx")), "detail-link" to _pS(_uM("color" to "#1677ff", "fontSize" to "25rpx")), "state-card" to _pS(_uM("boxSizing" to "border-box", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "18rpx", "borderTopRightRadius" to "18rpx", "borderBottomRightRadius" to "18rpx", "borderBottomLeftRadius" to "18rpx", "marginTop" to "32rpx", "marginRight" to "24rpx", "marginBottom" to "32rpx", "marginLeft" to "24rpx", "paddingTop" to "58rpx", "paddingRight" to "38rpx", "paddingBottom" to "58rpx", "paddingLeft" to "38rpx", "alignItems" to "center")), "form-card" to _pS(_uM("boxSizing" to "border-box", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "18rpx", "borderTopRightRadius" to "18rpx", "borderBottomRightRadius" to "18rpx", "borderBottomLeftRadius" to "18rpx", "marginTop" to "24rpx", "paddingTop" to "30rpx", "paddingRight" to "30rpx", "paddingBottom" to "30rpx", "paddingLeft" to "30rpx")), "history-card" to _uM("" to _uM("boxSizing" to "border-box", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "18rpx", "borderTopRightRadius" to "18rpx", "borderBottomRightRadius" to "18rpx", "borderBottomLeftRadius" to "18rpx", "paddingTop" to "26rpx", "paddingRight" to "28rpx", "paddingBottom" to "26rpx", "paddingLeft" to "28rpx"), ".history-card+" to _uM("marginTop" to "16rpx")), "compact-state" to _pS(_uM("marginTop" to 0, "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "paddingTop" to "48rpx", "paddingRight" to "32rpx", "paddingBottom" to "48rpx", "paddingLeft" to "32rpx")), "state-title" to _pS(_uM("color" to "#344054", "fontSize" to "30rpx", "fontWeight" to 600, "textAlign" to "center")), "state-text" to _pS(_uM("marginTop" to "12rpx", "color" to "#98a2b3", "fontSize" to "25rpx", "lineHeight" to "38rpx", "textAlign" to "center")), "command-list" to _pS(_uM("display" to "flex", "flexDirection" to "column")), "history-list" to _pS(_uM("display" to "flex", "flexDirection" to "column")), "command-card" to _uM("" to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopWidth" to "2rpx", "borderRightWidth" to "2rpx", "borderBottomWidth" to "2rpx", "borderLeftWidth" to "2rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "rgba(0,0,0,0)", "borderRightColor" to "rgba(0,0,0,0)", "borderBottomColor" to "rgba(0,0,0,0)", "borderLeftColor" to "rgba(0,0,0,0)", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "backgroundColor" to "#ffffff", "flexDirection" to "row"), ".command-card+" to _uM("marginTop" to "16rpx"), ".selected" to _uM("borderTopColor" to "#1677ff", "borderRightColor" to "#1677ff", "borderBottomColor" to "#1677ff", "borderLeftColor" to "#1677ff", "backgroundColor" to "#f0f7ff"), ".disabled" to _uM("opacity" to 0.58, "justifyContent" to "space-between")), "command-name" to _pS(_uM("color" to "#344054", "fontSize" to "29rpx", "fontWeight" to 600)), "history-name" to _pS(_uM("color" to "#344054", "fontSize" to "29rpx", "fontWeight" to 600)), "command-code" to _pS(_uM("marginLeft" to "14rpx", "paddingTop" to "4rpx", "paddingRight" to "10rpx", "paddingBottom" to "4rpx", "paddingLeft" to "10rpx", "borderTopLeftRadius" to "6rpx", "borderTopRightRadius" to "6rpx", "borderBottomRightRadius" to "6rpx", "borderBottomLeftRadius" to "6rpx", "color" to "#667085", "backgroundColor" to "#f2f4f7", "fontSize" to "20rpx")), "command-status" to _uM("" to _uM("marginLeft" to "16rpx", "paddingTop" to "6rpx", "paddingRight" to "12rpx", "paddingBottom" to "6rpx", "paddingLeft" to "12rpx", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "color" to "#1668dc", "backgroundColor" to "#eaf3ff", "fontSize" to "21rpx", "whiteSpace" to "nowrap"), ".blocked" to _uM("color" to "#98a2b3", "backgroundColor" to "#eaecf0")), "history-status" to _uM("" to _uM("marginLeft" to "16rpx", "paddingTop" to "6rpx", "paddingRight" to "12rpx", "paddingBottom" to "6rpx", "paddingLeft" to "12rpx", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "color" to "#1668dc", "backgroundColor" to "#eaf3ff", "fontSize" to "21rpx", "whiteSpace" to "nowrap"), ".status-success" to _uM("color" to "#039855", "backgroundColor" to "#ecfdf3"), ".status-failed" to _uM("color" to "#d92d20", "backgroundColor" to "#fef3f2"), ".status-pending" to _uM("color" to "#b54708", "backgroundColor" to "#fffaeb")), "command-remark" to _pS(_uM("color" to "#98a2b3", "fontSize" to "23rpx", "lineHeight" to "36rpx", "marginTop" to "12rpx")), "history-time" to _pS(_uM("color" to "#98a2b3", "fontSize" to "23rpx", "lineHeight" to "36rpx", "marginTop" to "12rpx")), "history-summary" to _pS(_uM("color" to "#667085", "fontSize" to "23rpx", "lineHeight" to "36rpx", "marginTop" to "8rpx")), "retry-count" to _pS(_uM("color" to "#98a2b3", "fontSize" to "23rpx", "lineHeight" to "36rpx")), "form-error" to _pS(_uM("color" to "#e34935", "fontSize" to "23rpx", "lineHeight" to "34rpx", "marginTop" to "12rpx", "marginRight" to 0, "marginBottom" to "12rpx", "marginLeft" to 0)), "param-error" to _pS(_uM("color" to "#e34935", "fontSize" to "23rpx", "lineHeight" to "34rpx", "marginTop" to "8rpx")), "param-row" to _pS(_uM("marginTop" to "28rpx")), "param-label" to _pS(_uM("color" to "#344054", "fontSize" to "27rpx")), "required-mark" to _pS(_uM("marginLeft" to "6rpx", "color" to "#f04438", "fontSize" to "28rpx")), "param-input" to _pS(_uM("boxSizing" to "border-box", "width" to "100%", "minHeight" to "82rpx", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#d0d5dd", "borderRightColor" to "#d0d5dd", "borderBottomColor" to "#d0d5dd", "borderLeftColor" to "#d0d5dd", "borderTopLeftRadius" to "12rpx", "borderTopRightRadius" to "12rpx", "borderBottomRightRadius" to "12rpx", "borderBottomLeftRadius" to "12rpx", "backgroundColor" to "#ffffff")), "select-field" to _pS(_uM("boxSizing" to "border-box", "width" to "100%", "minHeight" to "82rpx", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#d0d5dd", "borderRightColor" to "#d0d5dd", "borderBottomColor" to "#d0d5dd", "borderLeftColor" to "#d0d5dd", "borderTopLeftRadius" to "12rpx", "borderTopRightRadius" to "12rpx", "borderBottomRightRadius" to "12rpx", "borderBottomLeftRadius" to "12rpx", "backgroundColor" to "#ffffff", "display" to "flex", "alignItems" to "center", "justifyContent" to "space-between", "paddingTop" to 0, "paddingRight" to "24rpx", "paddingBottom" to 0, "paddingLeft" to "24rpx", "color" to "#344054", "fontSize" to "27rpx")), "select-placeholder" to _pS(_uM("color" to "#98a2b3")), "input-placeholder" to _pS(_uM("color" to "#98a2b3")), "select-arrow" to _pS(_uM("color" to "#98a2b3", "fontSize" to "42rpx", "lineHeight" to "42rpx")), "no-param-text" to _pS(_uM("marginTop" to "26rpx", "color" to "#98a2b3", "fontSize" to "25rpx")), "send-button" to _pS(_uM("marginTop" to "36rpx")), "history-footer" to _pS(_uM("paddingTop" to "28rpx", "paddingRight" to 0, "paddingBottom" to "12rpx", "paddingLeft" to 0, "color" to "#98a2b3", "fontSize" to "23rpx", "textAlign" to "center")), "loading-text" to _pS(_uM("color" to "#999999", "fontSize" to "25rpx", "textAlign" to "center")), "no-more-text" to _pS(_uM("color" to "#999999", "fontSize" to "25rpx", "textAlign" to "center")), "load-more-text" to _pS(_uM("color" to "#999999", "fontSize" to "25rpx", "textAlign" to "center")), "detail-loading" to _pS(_uM("display" to "flex", "flexDirection" to "column", "width" to "100%", "alignItems" to "center", "paddingTop" to "28rpx", "paddingRight" to 0, "paddingBottom" to "28rpx", "paddingLeft" to 0, "color" to "#98a2b3", "fontSize" to "25rpx")), "detail-content" to _pS(_uM("display" to "flex", "flexDirection" to "column", "width" to "100%")), "detail-label" to _pS(_uM("width" to "120rpx", "flexShrink" to 0, "color" to "#98a2b3", "fontSize" to "23rpx")), "detail-value" to _uM("" to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#344054", "fontSize" to "23rpx", "lineHeight" to "34rpx", "textAlign" to "right"), ".detail-long-row " to _uM("marginTop" to "5rpx", "textAlign" to "left")), "detail-long-row" to _pS(_uM("flexDirection" to "column")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
