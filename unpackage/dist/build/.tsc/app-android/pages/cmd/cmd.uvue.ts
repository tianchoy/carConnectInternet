import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_tabs from '@/uni_modules/i-ui-x/components/i-tabs/i-tabs.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_i_action_sheet from '@/uni_modules/i-ui-x/components/i-action-sheet/i-action-sheet.uvue'
import _easycom_i_modal from '@/uni_modules/i-ui-x/components/i-modal/i-modal.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { computed, ref } from 'vue'
import { getAppAvailableCommands, getAppCommandDetail, getAppCommandHistory, retryAppCommand, sendAppCommand } from '../../api/request.uts'
import { showAppModal, type AppModalSuccess } from '../../utils/modal.uts'
import { showAppToast } from '../../utils/toast.uts'

type TabItem = { name: string, value: string }


const __sfc__ = defineComponent({
  __name: 'cmd',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const imei = ref('')
const deviceId = ref('')
const activeTab = ref('send')
const tabItems: Array<TabItem> = [
	{ name: '下发指令', value: 'send' },
	{ name: '指令记录', value: 'history' }
]

const availableCommands = ref<Array<UTSJSONObject>>([])
const selectedCommand = ref<UTSJSONObject | null>(null)
const selectedCommandId = ref('')
const paramConfigs = ref<Array<UTSJSONObject>>([])
const paramValues = ref<Array<string>>([])
const paramErrors = ref<Array<string>>([])
const paramConfigError = ref('')
const isCommandLoading = ref(false)
const isSending = ref(false)

const optionSheetVisible = ref(false)
const optionSheetTitle = ref('请选择')
const optionActions = ref<Array<UTSJSONObject>>([])
const activeOptionIndex = ref(-1)

const historyRecords = ref<Array<UTSJSONObject>>([])
const historyPageNum = ref(1)
const historyPageSize = 10
const historyTotal = ref(0)
const isHistoryLoading = ref(false)
const hasLoadedHistory = ref(false)
const hasMoreHistory = ref(true)
const refreshing = ref(false)
const hasReachedHistoryBottom = ref(false)

const detailVisible = ref(false)
const isDetailLoading = ref(false)
const detailRecord = ref<UTSJSONObject>({} as UTSJSONObject)
const isRetrying = ref(false)

function getString(item: UTSJSONObject | null, key: string): string {
	return item != null ? item.getString(key, '') : ''
}

function getBoolean(item: UTSJSONObject | null, key: string): boolean {
	if (item == null) return false
	return item.getBoolean(key, false) || getString(item, key) == '1'
}

function getCommandKey(command: UTSJSONObject, index: number): string {
	const cmdId = getString(command, 'cmdId')
	return cmdId != '' ? cmdId : 'command_' + index.toString()
}

function getCommandName(command: UTSJSONObject | null): string {
	const name = getString(command, 'cmdName')
	return name != '' ? name : '未命名指令'
}

function getCommandCode(command: UTSJSONObject | null): string { return getString(command, 'cmdCode') }
function getCommandRemark(command: UTSJSONObject | null): string { return getString(command, 'remark') }
function isCommandAllowed(command: UTSJSONObject | null): boolean { return getBoolean(command, 'appAllowed') }
function commandNeedsParams(command: UTSJSONObject | null): boolean { return getString(command, 'needParam') == '1' }
function isSelectedCommand(command: UTSJSONObject): boolean { return getCommandKey(command, 0) == selectedCommandId.value }

function getParamKey(param: UTSJSONObject, index: number): string {
	const key = getString(param, 'key')
	return key != '' ? key : 'param_' + index.toString()
}
function getParamLabel(param: UTSJSONObject): string {
	const label = getString(param, 'label')
	return label != '' ? label : '参数'
}
function getParamType(param: UTSJSONObject): string { return getString(param, 'type') }
function isParamRequired(param: UTSJSONObject): boolean { return getBoolean(param, 'required') }
function getParamPlaceholder(param: UTSJSONObject): string {
	const placeholder = getString(param, 'placeholder')
	return placeholder != '' ? placeholder : '请输入' + getParamLabel(param)
}
function getParamValue(index: number): string { return index >= 0 && index < paramValues.value.length ? paramValues.value[index] : '' }
function getParamError(index: number): string { return index >= 0 && index < paramErrors.value.length ? paramErrors.value[index] : '' }
function getParamOptions(param: UTSJSONObject): Array<UTSJSONObject> {
	const options = param.getArray<UTSJSONObject>('options')
	return options != null ? options : []
}
function getOptionValue(option: UTSJSONObject): string { return getString(option, 'value') }
function getOptionLabel(option: UTSJSONObject): string {
	const label = getString(option, 'label')
	return label != '' ? label : getOptionValue(option)
}

function parseNumber(value: string): number {
	const parsed = parseFloat(value)
	return isNaN(parsed) ? 0 : Number.from(parsed)
}

function validateParam(index: number, updateError: boolean): string {
	if (index < 0 || index >= paramConfigs.value.length) return ''
	const param = paramConfigs.value[index]
	const value = getParamValue(index).trim()
	let error = ''
	if (isParamRequired(param) && value == '') {
		error = '请填写' + getParamLabel(param)
	} else if (value != '' && getParamType(param) == 'number') {
		const numberValue = parseFloat(value)
		if (isNaN(numberValue)) {
			error = getParamLabel(param) + '必须为数字'
		} else {
			const minText = getString(param, 'min')
			const maxText = getString(param, 'max')
			if (minText != '' && numberValue < parseNumber(minText)) error = getParamLabel(param) + '不能小于' + minText
			if (error == '' && maxText != '' && numberValue > parseNumber(maxText)) error = getParamLabel(param) + '不能大于' + maxText
		}
	}
	if (updateError && index >= 0 && index < paramErrors.value.length) paramErrors.value[index] = error
	return error
}

function getStatusValue(record: UTSJSONObject | null): string { return getString(record, 'sendStatus') }
function getStatusText(record: UTSJSONObject | null): string {
	const status = getStatusValue(record)
	if (status == '1') return '下发成功'
	if (status == '2') return '下发失败'
	return '等待下发'
}
function getStatusClass(record: UTSJSONObject | null): string {
	const status = getStatusValue(record)
	if (status == '1') return 'status-success'
	if (status == '2') return 'status-failed'
	return 'status-pending'
}

const displayDeviceIdentity = computed<string>(() : string => {
	return imei.value != '' ? imei.value : (deviceId.value != '' ? '设备 ' + deviceId.value : '未识别设备')
})

const isHistoryInitialLoading = computed<boolean>(() : boolean => {
	return isHistoryLoading.value && !hasLoadedHistory.value && historyRecords.value.length == 0
})

const isFormValid = computed<boolean>(() : boolean => {
	if (selectedCommand.value == null || !isCommandAllowed(selectedCommand.value) || paramConfigError.value != '') return false
	if (paramValues.value.length != paramConfigs.value.length) return false
	for (let index = 0; index < paramConfigs.value.length; index++) {
		if (validateParam(index, false) != '') return false
	}
	return true
})

const canRetryDetail = computed<boolean>(() : boolean => {
	const status = getStatusValue(detailRecord.value)
	return !isDetailLoading.value && (status == '0' || status == '2')
})

function parseParamConfigs(schema: string): Array<UTSJSONObject> {
	paramConfigError.value = ''
	if (schema.trim() == '') return []
	try {
		const parsed = JSON.parse(schema)
		if (!Array.isArray(parsed)) {
			paramConfigError.value = '指令参数配置格式无效'
			return []
		}
		const configs = parsed as Array<UTSJSONObject>
		for (let index = 0; index < configs.length; index++) {
			const param = configs[index]
			if (param == null || getString(param, 'key') == '' || getString(param, 'label') == '') {
				paramConfigError.value = '指令参数配置不完整'
				return []
			}
			const type = getParamType(param)
			if (type != 'text' && type != 'number' && type != 'select') {
				paramConfigError.value = '该指令包含暂不支持的参数类型'
				return []
			}
			if (type == 'select') {
				const options = getParamOptions(param)
				if (options.length == 0 || options.some((option: UTSJSONObject): boolean => getOptionValue(option) == '' || getOptionLabel(option) == '')) {
					paramConfigError.value = '指令下拉参数配置无效'
					return []
				}
			}
		}
		return configs
	} catch (error) {
		console.error('解析指令参数配置失败:', error)
		paramConfigError.value = '指令参数配置无效'
		return []
	}
}

function initializeParamValues(configs: Array<UTSJSONObject>): Array<string> {
	const values: Array<string> = []
	for (let index = 0; index < configs.length; index++) {
		const defaultValue = configs[index].getString('default', '')
		values.push(defaultValue)
	}
	return values
}

function updateParamValue(index: number, value: any): void {
	if (isSending.value || index < 0 || index >= paramValues.value.length) return
	paramValues.value[index] = value == null ? '' : value.toString()
	validateParam(index, true)
}

function getSelectedOptionLabel(index: number): string {
	if (index < 0 || index >= paramConfigs.value.length) return ''
	const value = getParamValue(index)
	if (value == '') return ''
	const option = getParamOptions(paramConfigs.value[index]).find((item: UTSJSONObject): boolean => getOptionValue(item) == value)
	return option == null ? value : getOptionLabel(option)
}

function openOptionSheet(index: number): void {
	if (isSending.value || index < 0 || index >= paramConfigs.value.length) return
	const param = paramConfigs.value[index]
	if (getParamType(param) != 'select') return
	activeOptionIndex.value = index
	optionSheetTitle.value = '请选择' + getParamLabel(param)
	const actions: Array<UTSJSONObject> = []
	getParamOptions(param).forEach((option: UTSJSONObject): void => {
		const action = new UTSJSONObject()
		action.set('name', getOptionLabel(option))
		action.set('value', getOptionValue(option))
		actions.push(action)
	})
	optionActions.value = actions
	optionSheetVisible.value = true
}

function getEventItem(event: any): UTSJSONObject | null {
	if (event == null || typeof event != 'object') return null

	return (event as UTSJSONObject).getJSON('item')





}

function selectOption(event: any): void {
	const index = activeOptionIndex.value
	if (index < 0 || index >= paramValues.value.length) return
	const item = getEventItem(event)
	const value = item != null ? getString(item, 'value') : ''
	if (value != '') {
		paramValues.value[index] = value
		validateParam(index, true)
	}
	activeOptionIndex.value = -1
}

function resetSelection(): void {
	selectedCommand.value = null
	selectedCommandId.value = ''
	paramConfigs.value = []
	paramValues.value = []
	paramErrors.value = []
	paramConfigError.value = ''
}

async function loadAvailableCommands(): Promise<void> {
	if (deviceId.value == '' || isCommandLoading.value) return
	try {
		isCommandLoading.value = true
		const response = await getAppAvailableCommands(deviceId.value)
		if (response.code == 200) {
			availableCommands.value = response.data
			const stillSelected = selectedCommandId.value != '' ? response.data.find((command: UTSJSONObject): boolean => getCommandKey(command, 0) == selectedCommandId.value) : null
			if (stillSelected == null) resetSelection()
		} else {
			availableCommands.value = []
			resetSelection()
			showAppToast({ title: response.msg != '' ? response.msg : '加载可用指令失败', icon: 'none' })
		}
	} catch (error) {
		console.error('加载可用指令失败:', error)
		showAppToast({ title: '加载可用指令失败，请检查网络', icon: 'none' })
	} finally {
		isCommandLoading.value = false
	}
}

function selectCommand(command: UTSJSONObject): void {
	if (isSending.value) return
	if (!isCommandAllowed(command)) {
		showAppToast({ title: '该指令不允许在 App 端下发', icon: 'none' })
		return
	}
	selectedCommand.value = command
	selectedCommandId.value = getCommandKey(command, 0)
	const configs = parseParamConfigs(getString(command, 'paramSchema'))
	paramConfigs.value = configs
	paramValues.value = paramConfigError.value == '' ? initializeParamValues(configs) : []
	paramErrors.value = configs.map((_param: UTSJSONObject): string => '')
}

function buildCommandParams(): UTSJSONObject {
	const params = new UTSJSONObject()
	for (let index = 0; index < paramConfigs.value.length; index++) {
		const value = getParamValue(index).trim()
		if (value != '') params.set(getParamKey(paramConfigs.value[index], index), value)
	}
	return params
}

async function loadHistoryPage(reset: boolean): Promise<void> {
	if (deviceId.value == '' || isHistoryLoading.value || (!reset && !hasMoreHistory.value)) return
	const requestedPage = reset ? 1 : historyPageNum.value
	try {
		isHistoryLoading.value = true
		const query = new UTSJSONObject()
		query.set('deviceId', deviceId.value)
		query.set('pageNum', requestedPage)
		query.set('pageSize', historyPageSize)
		const response = await getAppCommandHistory(query)
		if (response.code != 200) {
			showAppToast({ title: response.msg != '' ? response.msg : '加载指令记录失败', icon: 'none' })
			return
		}
		const rows = response.data.rows
		if (reset) historyRecords.value = rows
		else historyRecords.value = [...historyRecords.value, ...rows]
		historyTotal.value = response.data.total
		historyPageNum.value = requestedPage + 1
		hasMoreHistory.value = historyRecords.value.length < historyTotal.value && rows.length > 0
	} catch (error) {
		console.error('加载指令记录失败:', error)
		showAppToast({ title: '加载指令记录失败，请检查网络', icon: 'none' })
	} finally {
		hasLoadedHistory.value = true
		isHistoryLoading.value = false
	}
}

async function reloadHistory(): Promise<void> {
	hasReachedHistoryBottom.value = false
	historyPageNum.value = 1
	historyRecords.value = []
	historyTotal.value = 0
	hasMoreHistory.value = true
	hasLoadedHistory.value = false
	await loadHistoryPage(true)
}

async function sendSelectedCommand(): Promise<void> {
	const command = selectedCommand.value
	if (command == null || deviceId.value == '' || isSending.value) return
	const cmdId = getString(command, 'cmdId')
	if (cmdId == '') {
		showAppToast({ title: '指令模板信息不完整', icon: 'none' })
		return
	}
	const requestData = new UTSJSONObject()
	requestData.set('deviceId', deviceId.value)
	requestData.set('cmdId', cmdId)
	const cmdCode = getCommandCode(command)
	if (cmdCode != '') requestData.set('cmdCode', cmdCode)
	requestData.set('params', buildCommandParams())
	try {
		isSending.value = true
		const response = await sendAppCommand(requestData)
		if (response.code == 200) {
			const requestIdText = response.data != '' ? '追踪编号：' + response.data : '请在指令记录中查看下发结果'
			showAppToast({ title: '指令已提交，' + requestIdText, icon: 'success', duration: 3500 })
			await reloadHistory()
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '指令下发失败', icon: 'none', duration: 3000 })
		}
	} catch (error) {
		console.error('下发指令失败:', error)
		showAppToast({ title: '指令下发失败，请检查网络', icon: 'none' })
	} finally {
		isSending.value = false
	}
}

function confirmSendCommand(): void {
	if (selectedCommand.value == null) {
		showAppToast({ title: '请选择要下发的指令', icon: 'none' })
		return
	}
	for (let index = 0; index < paramConfigs.value.length; index++) validateParam(index, true)
	if (!isFormValid.value) {
		showAppToast({ title: '请检查指令参数', icon: 'none' })
		return
	}
	showAppModal({
		title: '确认下发指令',
		content: '即将向设备下发“' + getCommandName(selectedCommand.value) + '”。指令下发后可能影响车辆使用，请确认操作。',
		confirmText: '确认下发',
		cancelText: '取消',
		success: (result: AppModalSuccess): void => {
			if (result.confirm) void sendSelectedCommand()
		}
	})
}

function getRecordKey(record: UTSJSONObject, index: number): string {
	const id = getString(record, 'id')
	return id != '' ? id : 'record_' + index.toString()
}
function getRecordName(record: UTSJSONObject | null): string {
	const name = getString(record, 'cmdName')
	return name != '' ? name : (getString(record, 'commandType') != '' ? getString(record, 'commandType') : '未知指令')
}
function getRecordTime(record: UTSJSONObject | null): string {
	const time = getString(record, 'sendTime')
	return time != '' ? time : getString(record, 'createTime')
}
function getRecordRetryCount(record: UTSJSONObject | null): string {
	const count = getString(record, 'retryCount')
	return count != '' ? count : '0'
}
function getRecordSummary(record: UTSJSONObject | null): string {
	const reason = getString(record, 'reason')
	return reason != '' ? reason : getString(record, 'responseContent')
}


function markHistoryScroll(event: UniScrollEvent): void {
	if (activeTab.value != 'history') return



}

function loadMoreHistory(): void {
	if (activeTab.value != 'history' || refreshing.value) return




	void loadHistoryPage(false)
}

async function showCommandDetail(record: UTSJSONObject): Promise<void> {
	const commandId = getString(record, 'id')
	if (commandId == '') return
	detailRecord.value = record
	detailVisible.value = true
	isDetailLoading.value = true
	try {
		const response = await getAppCommandDetail(commandId)
		if (response.code == 200 && response.data != null) {
			detailRecord.value = response.data
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '加载指令详情失败', icon: 'none' })
		}
	} catch (error) {
		console.error('加载指令详情失败:', error)
		showAppToast({ title: '加载指令详情失败，请检查网络', icon: 'none' })
	} finally {
		isDetailLoading.value = false
	}
}

function closeDetail(): void {
	detailVisible.value = false
}
function getDetailResponse(): string { return getString(detailRecord.value, 'responseContent') }
function getDetailReason(): string { return getString(detailRecord.value, 'reason') }
function getDetailParams(): string { return getString(detailRecord.value, 'commandParams') }

async function retryCommand(commandId: string): Promise<void> {
	if (isRetrying.value) return
	try {
		isRetrying.value = true
		const response = await retryAppCommand(commandId)
		if (response.code == 200) {
			showAppToast({ title: response.msg != '' ? response.msg : '已重新提交指令', icon: 'success' })
			detailVisible.value = false
			await reloadHistory()
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '重试下发失败', icon: 'none', duration: 3000 })
		}
	} catch (error) {
		console.error('重试下发失败:', error)
		showAppToast({ title: '重试下发失败，请检查网络', icon: 'none' })
	} finally {
		isRetrying.value = false
	}
}

function confirmRetryFromDetail(): void {
	const commandId = getString(detailRecord.value, 'id')
	if (commandId == '' || isRetrying.value) return
	showAppModal({
		title: '确认重试',
		content: '将重新下发“' + getRecordName(detailRecord.value) + '”，请确认设备当前状态适合执行此操作。',
		confirmText: '确认重试',
		cancelText: '取消',
		success: (result: AppModalSuccess): void => {
			if (result.confirm) void retryCommand(commandId)
		}
	})
}

function getEventString(event: any, key: string): string {
	if (event == null || typeof event != 'object') return ''

	return (event as UTSJSONObject).getString(key, '')





}

function changeTab(event: any): void {
	const value = getEventString(event, 'value')
	if (value == '') return
	activeTab.value = value
	if (value == 'history' && !hasLoadedHistory.value) void reloadHistory()
}

async function refreshCurrentTab(): Promise<void> {
	if (refreshing.value) return
	try {
		refreshing.value = true
		if (activeTab.value == 'history') await reloadHistory()
		else await loadAvailableCommands()
	} finally {
		refreshing.value = false
	}
}

onLoad((options) => {
	imei.value = options.imei ?? ''
	deviceId.value = options.deviceId ?? ''
	if (deviceId.value != '') void loadAvailableCommands()
})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_tabs = resolveEasyComponent("i-tabs",_easycom_i_tabs)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_i_action_sheet = resolveEasyComponent("i-action-sheet",_easycom_i_action_sheet)
const _component_i_modal = resolveEasyComponent("i-modal",_easycom_i_modal)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "page" }), [
      _cV(_component_custom_navBar, _uM({
        title: "指令中心",
        "show-back": true,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "content-wrap" }), [
        _cE("view", _uM({ class: "device-card" }), [
          _cE("view", _uM({ class: "device-card-main" }), [
            _cE("text", _uM({ class: "device-title" }), "当前设备"),
            _cE("text", _uM({ class: "device-imei" }), _tD(displayDeviceIdentity.value), 1 /* TEXT */)
          ]),
          _cE("view", _uM({ class: "device-id-wrap" }), [
            _cE("text", _uM({ class: "device-id-label" }), "设备 ID"),
            _cE("text", _uM({ class: "device-id-value" }), _tD(deviceId.value != '' ? deviceId.value : '--'), 1 /* TEXT */)
          ])
        ]),
        _cV(_component_i_tabs, _uM({
          value: activeTab.value,
          list: tabItems,
          activeColor: "#1677ff",
          inactiveColor: "#667085",
          bgColor: "#ffffff",
          onChange: ($event: any) => {changeTab($event)}
        }), null, 8 /* PROPS */, ["value", "onChange"]),
        _cE("scroll-view", _uM({
          class: "main-scroll",
          "scroll-y": "true",
          "show-scrollbar": false,
          "refresher-enabled": "",
          "refresher-triggered": refreshing.value,
          "lower-threshold": 80,
          onRefresherrefresh: refreshCurrentTab,
          onScroll: markHistoryScroll,
          onScrolltolower: loadMoreHistory
        }), [
          deviceId.value == ''
            ? _cE("view", _uM({
                key: 0,
                class: "state-card"
              }), [
                _cE("text", _uM({ class: "state-title" }), "无法加载指令"),
                _cE("text", _uM({ class: "state-text" }), "未获取到设备 ID，请返回车辆详情后重新进入。")
              ])
            : activeTab.value == 'send'
              ? _cE("view", _uM({
                  key: 1,
                  class: "tab-content"
                }), [
                  _cE("view", _uM({ class: "section-heading" }), [
                    _cE("view", null, [
                      _cE("text", _uM({ class: "section-title" }), "可用指令"),
                      _cE("text", _uM({ class: "section-subtitle" }), "请选择要下发到设备的指令")
                    ]),
                    _cE("text", _uM({
                      class: "refresh-link",
                      onClick: loadAvailableCommands
                    }), "刷新")
                  ]),
                  isTrue(isCommandLoading.value)
                    ? _cE("view", _uM({
                        key: 0,
                        class: "state-card compact-state"
                      }), [
                        _cE("text", _uM({ class: "state-text" }), "正在加载可用指令...")
                      ])
                    : availableCommands.value.length == 0
                      ? _cE("view", _uM({
                          key: 1,
                          class: "state-card compact-state"
                        }), [
                          _cE("text", _uM({ class: "state-title" }), "暂无可用指令"),
                          _cE("text", _uM({ class: "state-text" }), "请确认设备状态后重试。")
                        ])
                      : _cE("view", _uM({
                          key: 2,
                          class: "command-list"
                        }), [
                          _cE(Fragment, null, RenderHelpers.renderList(availableCommands.value, (command, index, __index, _cached): any => {
                            return _cE("view", _uM({
                              key: getCommandKey(command, index),
                              class: _nC(["command-card", _uM({ selected: isSelectedCommand(command), disabled: !isCommandAllowed(command) })]),
                              onClick: () => {selectCommand(command)}
                            }), [
                              _cE("view", _uM({ class: "command-card-top" }), [
                                _cE("view", _uM({ class: "command-name-wrap" }), [
                                  _cE("text", _uM({ class: "command-name" }), _tD(getCommandName(command)), 1 /* TEXT */)
                                ]),
                                _cE("text", _uM({
                                  class: _nC(["command-status", _uM({ blocked: !isCommandAllowed(command) })])
                                }), _tD(isCommandAllowed(command) ? (commandNeedsParams(command) ? '需填写参数' : '无需参数') : 'App 端不可下发'), 3 /* TEXT, CLASS */)
                              ]),
                              isTrue(getCommandCode(command) != '' || getCommandRemark(command) != '')
                                ? _cE("view", _uM({
                                    key: 0,
                                    class: "command-card-meta"
                                  }), [
                                    getCommandCode(command) != ''
                                      ? _cE("text", _uM({
                                          key: 0,
                                          class: "command-code"
                                        }), _tD(getCommandCode(command)), 1 /* TEXT */)
                                      : _cC("v-if", true),
                                    getCommandRemark(command) != ''
                                      ? _cE("text", _uM({
                                          key: 1,
                                          class: "command-remark"
                                        }), _tD(getCommandRemark(command)), 1 /* TEXT */)
                                      : _cC("v-if", true)
                                  ])
                                : _cC("v-if", true)
                            ], 10 /* CLASS, PROPS */, ["onClick"])
                          }), 128 /* KEYED_FRAGMENT */)
                        ]),
                  selectedCommand.value != null
                    ? _cE("view", _uM({
                        key: 3,
                        class: "form-card"
                      }), [
                        _cE("view", _uM({ class: "form-header" }), [
                          _cE("view", null, [
                            _cE("text", _uM({ class: "section-title" }), _tD(getCommandName(selectedCommand.value)), 1 /* TEXT */),
                            _cE("text", _uM({ class: "section-subtitle" }), "请确认参数后再下发")
                          ])
                        ]),
                        paramConfigError.value != ''
                          ? _cE("text", _uM({
                              key: 0,
                              class: "form-error"
                            }), _tD(paramConfigError.value), 1 /* TEXT */)
                          : _cC("v-if", true),
                        _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, (param, index, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: getParamKey(param, index),
                            class: "param-row"
                          }), [
                            _cE("view", _uM({ class: "param-label-row" }), [
                              _cE("text", _uM({ class: "param-label" }), _tD(getParamLabel(param)), 1 /* TEXT */),
                              isTrue(isParamRequired(param))
                                ? _cE("text", _uM({
                                    key: 0,
                                    class: "required-mark"
                                  }), "*")
                                : _cC("v-if", true)
                            ]),
                            isTrue(getParamType(param) == 'text' || getParamType(param) == 'number')
                              ? _cV(_component_i_input, _uM({
                                  key: 0,
                                  class: "param-input",
                                  "model-value": getParamValue(index),
                                  type: getParamType(param) == 'number' ? 'number' : 'text',
                                  placeholder: getParamPlaceholder(param),
                                  "placeholder-class": "input-placeholder",
                                  border: "none",
                                  "onUpdate:modelValue": ($event: any) => {updateParamValue(index, $event)}
                                }), null, 8 /* PROPS */, ["model-value", "type", "placeholder", "onUpdate:modelValue"])
                              : getParamType(param) == 'select'
                                ? _cE("view", _uM({
                                    key: 1,
                                    class: "select-field",
                                    onClick: () => {openOptionSheet(index)}
                                  }), [
                                    _cE("text", _uM({
                                      class: _nC(_uM({ 'select-placeholder': getSelectedOptionLabel(index) == '' }))
                                    }), _tD(getSelectedOptionLabel(index) != '' ? getSelectedOptionLabel(index) : getParamPlaceholder(param)), 3 /* TEXT, CLASS */),
                                    _cE("text", _uM({ class: "select-arrow" }), "›")
                                  ], 8 /* PROPS */, ["onClick"])
                                : _cC("v-if", true),
                            getParamError(index) != ''
                              ? _cE("text", _uM({
                                  key: 2,
                                  class: "param-error"
                                }), _tD(getParamError(index)), 1 /* TEXT */)
                              : _cC("v-if", true)
                          ])
                        }), 128 /* KEYED_FRAGMENT */),
                        isTrue(paramConfigs.value.length == 0 && paramConfigError.value == '')
                          ? _cE("text", _uM({
                              key: 1,
                              class: "no-param-text"
                            }), "该指令无需填写参数")
                          : _cC("v-if", true),
                        _cV(_component_i_button, _uM({
                          class: "send-button",
                          type: "primary",
                          text: "确认下发指令",
                          loading: isSending.value,
                          disabled: isSending.value || isCommandLoading.value || !isFormValid.value,
                          onClick: confirmSendCommand
                        }), null, 8 /* PROPS */, ["loading", "disabled"])
                      ])
                    : _cC("v-if", true)
                ])
              : _cE("view", _uM({
                  key: 2,
                  class: "tab-content history-content"
                }), [
                  _cE("view", _uM({ class: "section-heading" }), [
                    _cE("view", null, [
                      _cE("text", _uM({ class: "section-title" }), "指令记录"),
                      _cE("text", _uM({ class: "section-subtitle" }), "可查看下发结果或重新尝试失败指令")
                    ]),
                    _cE("text", _uM({
                      class: "refresh-link",
                      onClick: reloadHistory
                    }), "刷新")
                  ]),
                  isTrue(isHistoryInitialLoading.value)
                    ? _cE("view", _uM({
                        key: 0,
                        class: "state-card compact-state"
                      }), [
                        _cE("text", _uM({ class: "state-text" }), "正在加载指令记录...")
                      ])
                    : historyRecords.value.length == 0
                      ? _cE("view", _uM({
                          key: 1,
                          class: "state-card compact-state"
                        }), [
                          _cE("text", _uM({ class: "state-title" }), "暂无指令记录"),
                          _cE("text", _uM({ class: "state-text" }), "成功下发指令后，记录将显示在这里。")
                        ])
                      : _cE("view", _uM({
                          key: 2,
                          class: "history-list"
                        }), [
                          _cE(Fragment, null, RenderHelpers.renderList(historyRecords.value, (record, index, __index, _cached): any => {
                            return _cE("view", _uM({
                              key: getRecordKey(record, index),
                              class: "history-card",
                              onClick: () => {showCommandDetail(record)}
                            }), [
                              _cE("view", _uM({ class: "history-card-top" }), [
                                _cE("text", _uM({ class: "history-name" }), _tD(getRecordName(record)), 1 /* TEXT */),
                                _cE("text", _uM({
                                  class: _nC(["history-status", getStatusClass(record)])
                                }), _tD(getStatusText(record)), 3 /* TEXT, CLASS */)
                              ]),
                              _cE("text", _uM({ class: "history-time" }), _tD(getRecordTime(record)), 1 /* TEXT */),
                              getRecordSummary(record) != ''
                                ? _cE("text", _uM({
                                    key: 0,
                                    class: "history-summary"
                                  }), _tD(getRecordSummary(record)), 1 /* TEXT */)
                                : _cC("v-if", true),
                              _cE("view", _uM({ class: "history-bottom" }), [
                                _cE("text", _uM({ class: "retry-count" }), "已重试 " + _tD(getRecordRetryCount(record)) + " 次", 1 /* TEXT */),
                                _cE("text", _uM({ class: "detail-link" }), "查看详情 ›")
                              ])
                            ], 8 /* PROPS */, ["onClick"])
                          }), 128 /* KEYED_FRAGMENT */)
                        ]),
                  historyRecords.value.length > 0
                    ? _cE("view", _uM({
                        key: 3,
                        class: "history-footer"
                      }), [
                        isTrue(isHistoryLoading.value)
                          ? _cE("text", _uM({ key: 0 }), "加载中...")
                          : isTrue(!hasMoreHistory.value)
                            ? _cE("text", _uM({ key: 1 }), "没有更多记录了")
                            : _cE("text", _uM({ key: 2 }), "上拉加载更多")
                      ])
                    : _cC("v-if", true)
                ])
        ], 40 /* PROPS, NEED_HYDRATION */, ["refresher-triggered"])
      ]),
      _cV(_component_i_action_sheet, _uM({
        show: optionSheetVisible.value,
        "onUpdate:show": $event => {(optionSheetVisible).value = $event},
        title: optionSheetTitle.value,
        actions: optionActions.value,
        cancelText: "取消",
        onSelect: ($event: any) => {selectOption($event)}
      }), null, 8 /* PROPS */, ["show", "onUpdate:show", "title", "actions", "onSelect"]),
      _cV(_component_i_modal, _uM({
        show: detailVisible.value,
        title: "指令详情",
        confirmText: "关闭",
        showCancelButton: canRetryDetail.value,
        cancelText: "重试下发",
        onConfirm: closeDetail,
        onCancel: confirmRetryFromDetail
      }), _uM({
        default: withSlotCtx((): any[] => [
          isTrue(isDetailLoading.value)
            ? _cE("view", _uM({
                key: 0,
                class: "detail-loading"
              }), [
                _cE("text", null, "正在加载详情...")
              ])
            : _cE("view", _uM({
                key: 1,
                class: "detail-content"
              }), [
                _cE("view", _uM({ class: "detail-row" }), [
                  _cE("text", _uM({ class: "detail-label" }), "指令名称"),
                  _cE("text", _uM({ class: "detail-value" }), _tD(getRecordName(detailRecord.value)), 1 /* TEXT */)
                ]),
                _cE("view", _uM({ class: "detail-row" }), [
                  _cE("text", _uM({ class: "detail-label" }), "下发状态"),
                  _cE("text", _uM({ class: "detail-value" }), _tD(getStatusText(detailRecord.value)), 1 /* TEXT */)
                ]),
                _cE("view", _uM({ class: "detail-row" }), [
                  _cE("text", _uM({ class: "detail-label" }), "发送时间"),
                  _cE("text", _uM({ class: "detail-value" }), _tD(getRecordTime(detailRecord.value)), 1 /* TEXT */)
                ]),
                getDetailResponse() != ''
                  ? _cE("view", _uM({
                      key: 0,
                      class: "detail-row detail-long-row"
                    }), [
                      _cE("text", _uM({ class: "detail-label" }), "响应信息"),
                      _cE("text", _uM({ class: "detail-value" }), _tD(getDetailResponse()), 1 /* TEXT */)
                    ])
                  : _cC("v-if", true),
                getDetailReason() != ''
                  ? _cE("view", _uM({
                      key: 1,
                      class: "detail-row detail-long-row"
                    }), [
                      _cE("text", _uM({ class: "detail-label" }), "结果说明"),
                      _cE("text", _uM({ class: "detail-value" }), _tD(getDetailReason()), 1 /* TEXT */)
                    ])
                  : _cC("v-if", true),
                getDetailParams() != ''
                  ? _cE("view", _uM({
                      key: 2,
                      class: "detail-row detail-long-row"
                    }), [
                      _cE("text", _uM({ class: "detail-label" }), "指令参数"),
                      _cE("text", _uM({ class: "detail-value" }), _tD(getDetailParams()), 1 /* TEXT */)
                    ])
                  : _cC("v-if", true)
              ])
        ]),
        _: 1 /* STABLE */
      }), 8 /* PROPS */, ["show", "showCancelButton"])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesCmdCmdStyles = [_uM([["page", _pS(_uM([["width", "100%"], ["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fb"]]))], ["content-wrap", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minHeight", 0], ["display", "flex"], ["flexDirection", "column"]]))], ["device-card", _pS(_uM([["display", "flex"], ["justifyContent", "space-between"], ["marginTop", "20rpx"], ["marginRight", "24rpx"], ["marginBottom", "16rpx"], ["marginLeft", "24rpx"], ["paddingTop", "28rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "28rpx"], ["paddingLeft", "30rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundImage", "linear-gradient(to right, #1769e0, #56a0f6)"], ["boxShadow", "0 10rpx 28rpx rgba(22, 119, 255, 0.22)"]]))], ["device-card-main", _pS(_uM([["display", "flex"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minWidth", 0], ["flexDirection", "row"], ["alignItems", "center"]]))], ["device-id-wrap", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "flex-end"]]))], ["section-heading", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["marginBottom", "20rpx"]]))], ["command-card-top", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["command-name-wrap", _pS(_uM([["display", "flex"], ["minWidth", 0], ["alignItems", "center"]]))], ["form-header", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "space-between"], ["marginBottom", "12rpx"]]))], ["param-label-row", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["marginBottom", "12rpx"]]))], ["history-card-top", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["history-bottom", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["marginTop", "18rpx"]]))], ["detail-row", _pS(_uM([["display", "flex"], ["alignItems", "flex-start"], ["justifyContent", "space-between"], ["paddingTop", "9rpx"], ["paddingRight", 0], ["paddingBottom", "9rpx"], ["paddingLeft", 0]]))], ["device-title", _pS(_uM([["color", "rgba(255,255,255,0.76)"], ["fontSize", "23rpx"], ["marginRight", "20rpx"]]))], ["device-id-label", _pS(_uM([["color", "rgba(255,255,255,0.76)"], ["fontSize", "23rpx"], ["marginRight", "20rpx"]]))], ["device-imei", _pS(_uM([["color", "#ffffff"], ["fontSize", "32rpx"], ["fontWeight", 600]]))], ["device-id-value", _pS(_uM([["marginTop", "8rpx"], ["color", "#ffffff"], ["fontSize", "25rpx"]]))], ["main-scroll", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["minHeight", 0]]))], ["tab-content", _pS(_uM([["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "44rpx"], ["paddingLeft", "24rpx"]]))], ["section-title", _pS(_uM([["color", "#1f2937"], ["fontSize", "32rpx"], ["fontWeight", 600]]))], ["section-subtitle", _pS(_uM([["marginTop", "7rpx"], ["color", "#98a2b3"], ["fontSize", "23rpx"]]))], ["refresh-link", _pS(_uM([["color", "#1677ff"], ["fontSize", "25rpx"]]))], ["detail-link", _pS(_uM([["color", "#1677ff"], ["fontSize", "25rpx"]]))], ["state-card", _pS(_uM([["boxSizing", "border-box"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "18rpx"], ["borderTopRightRadius", "18rpx"], ["borderBottomRightRadius", "18rpx"], ["borderBottomLeftRadius", "18rpx"], ["marginTop", "32rpx"], ["marginRight", "24rpx"], ["marginBottom", "32rpx"], ["marginLeft", "24rpx"], ["paddingTop", "58rpx"], ["paddingRight", "38rpx"], ["paddingBottom", "58rpx"], ["paddingLeft", "38rpx"], ["alignItems", "center"]]))], ["form-card", _pS(_uM([["boxSizing", "border-box"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "18rpx"], ["borderTopRightRadius", "18rpx"], ["borderBottomRightRadius", "18rpx"], ["borderBottomLeftRadius", "18rpx"], ["marginTop", "24rpx"], ["paddingTop", "30rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "30rpx"]]))], ["history-card", _uM([["", _uM([["boxSizing", "border-box"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "18rpx"], ["borderTopRightRadius", "18rpx"], ["borderBottomRightRadius", "18rpx"], ["borderBottomLeftRadius", "18rpx"], ["paddingTop", "26rpx"], ["paddingRight", "28rpx"], ["paddingBottom", "26rpx"], ["paddingLeft", "28rpx"]])], [".history-card+", _uM([["marginTop", "16rpx"]])]])], ["compact-state", _pS(_uM([["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["paddingTop", "48rpx"], ["paddingRight", "32rpx"], ["paddingBottom", "48rpx"], ["paddingLeft", "32rpx"]]))], ["state-title", _pS(_uM([["color", "#344054"], ["fontSize", "30rpx"], ["fontWeight", 600], ["textAlign", "center"]]))], ["state-text", _pS(_uM([["marginTop", "12rpx"], ["color", "#98a2b3"], ["fontSize", "25rpx"], ["lineHeight", "38rpx"], ["textAlign", "center"]]))], ["command-list", _pS(_uM([["display", "flex"], ["flexDirection", "column"]]))], ["history-list", _pS(_uM([["display", "flex"], ["flexDirection", "column"]]))], ["command-card", _uM([["", _uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopWidth", "2rpx"], ["borderRightWidth", "2rpx"], ["borderBottomWidth", "2rpx"], ["borderLeftWidth", "2rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "rgba(0,0,0,0)"], ["borderRightColor", "rgba(0,0,0,0)"], ["borderBottomColor", "rgba(0,0,0,0)"], ["borderLeftColor", "rgba(0,0,0,0)"], ["borderTopLeftRadius", "16rpx"], ["borderTopRightRadius", "16rpx"], ["borderBottomRightRadius", "16rpx"], ["borderBottomLeftRadius", "16rpx"], ["backgroundColor", "#ffffff"], ["flexDirection", "row"]])], [".command-card+", _uM([["marginTop", "16rpx"]])], [".selected", _uM([["borderTopColor", "#1677ff"], ["borderRightColor", "#1677ff"], ["borderBottomColor", "#1677ff"], ["borderLeftColor", "#1677ff"], ["backgroundColor", "#f0f7ff"]])], [".disabled", _uM([["opacity", 0.58], ["justifyContent", "space-between"]])]])], ["command-name", _pS(_uM([["color", "#344054"], ["fontSize", "29rpx"], ["fontWeight", 600]]))], ["history-name", _pS(_uM([["color", "#344054"], ["fontSize", "29rpx"], ["fontWeight", 600]]))], ["command-code", _pS(_uM([["marginLeft", "14rpx"], ["paddingTop", "4rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "4rpx"], ["paddingLeft", "10rpx"], ["borderTopLeftRadius", "6rpx"], ["borderTopRightRadius", "6rpx"], ["borderBottomRightRadius", "6rpx"], ["borderBottomLeftRadius", "6rpx"], ["color", "#667085"], ["backgroundColor", "#f2f4f7"], ["fontSize", "20rpx"]]))], ["command-status", _uM([["", _uM([["marginLeft", "16rpx"], ["paddingTop", "6rpx"], ["paddingRight", "12rpx"], ["paddingBottom", "6rpx"], ["paddingLeft", "12rpx"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"], ["color", "#1668dc"], ["backgroundColor", "#eaf3ff"], ["fontSize", "21rpx"], ["whiteSpace", "nowrap"]])], [".blocked", _uM([["color", "#98a2b3"], ["backgroundColor", "#eaecf0"]])]])], ["history-status", _uM([["", _uM([["marginLeft", "16rpx"], ["paddingTop", "6rpx"], ["paddingRight", "12rpx"], ["paddingBottom", "6rpx"], ["paddingLeft", "12rpx"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"], ["color", "#1668dc"], ["backgroundColor", "#eaf3ff"], ["fontSize", "21rpx"], ["whiteSpace", "nowrap"]])], [".status-success", _uM([["color", "#039855"], ["backgroundColor", "#ecfdf3"]])], [".status-failed", _uM([["color", "#d92d20"], ["backgroundColor", "#fef3f2"]])], [".status-pending", _uM([["color", "#b54708"], ["backgroundColor", "#fffaeb"]])]])], ["command-remark", _pS(_uM([["color", "#98a2b3"], ["fontSize", "23rpx"], ["lineHeight", "36rpx"], ["marginTop", "12rpx"]]))], ["history-time", _pS(_uM([["color", "#98a2b3"], ["fontSize", "23rpx"], ["lineHeight", "36rpx"], ["marginTop", "12rpx"]]))], ["history-summary", _pS(_uM([["color", "#667085"], ["fontSize", "23rpx"], ["lineHeight", "36rpx"], ["marginTop", "8rpx"]]))], ["retry-count", _pS(_uM([["color", "#98a2b3"], ["fontSize", "23rpx"], ["lineHeight", "36rpx"]]))], ["form-error", _pS(_uM([["color", "#e34935"], ["fontSize", "23rpx"], ["lineHeight", "34rpx"], ["marginTop", "12rpx"], ["marginRight", 0], ["marginBottom", "12rpx"], ["marginLeft", 0]]))], ["param-error", _pS(_uM([["color", "#e34935"], ["fontSize", "23rpx"], ["lineHeight", "34rpx"], ["marginTop", "8rpx"]]))], ["param-row", _pS(_uM([["marginTop", "28rpx"]]))], ["param-label", _pS(_uM([["color", "#344054"], ["fontSize", "27rpx"]]))], ["required-mark", _pS(_uM([["marginLeft", "6rpx"], ["color", "#f04438"], ["fontSize", "28rpx"]]))], ["param-input", _pS(_uM([["boxSizing", "border-box"], ["width", "100%"], ["minHeight", "82rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#d0d5dd"], ["borderRightColor", "#d0d5dd"], ["borderBottomColor", "#d0d5dd"], ["borderLeftColor", "#d0d5dd"], ["borderTopLeftRadius", "12rpx"], ["borderTopRightRadius", "12rpx"], ["borderBottomRightRadius", "12rpx"], ["borderBottomLeftRadius", "12rpx"], ["backgroundColor", "#ffffff"]]))], ["select-field", _pS(_uM([["boxSizing", "border-box"], ["width", "100%"], ["minHeight", "82rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#d0d5dd"], ["borderRightColor", "#d0d5dd"], ["borderBottomColor", "#d0d5dd"], ["borderLeftColor", "#d0d5dd"], ["borderTopLeftRadius", "12rpx"], ["borderTopRightRadius", "12rpx"], ["borderBottomRightRadius", "12rpx"], ["borderBottomLeftRadius", "12rpx"], ["backgroundColor", "#ffffff"], ["display", "flex"], ["alignItems", "center"], ["justifyContent", "space-between"], ["paddingTop", 0], ["paddingRight", "24rpx"], ["paddingBottom", 0], ["paddingLeft", "24rpx"], ["color", "#344054"], ["fontSize", "27rpx"]]))], ["select-placeholder", _pS(_uM([["color", "#98a2b3"]]))], ["input-placeholder", _pS(_uM([["color", "#98a2b3"]]))], ["select-arrow", _pS(_uM([["color", "#98a2b3"], ["fontSize", "42rpx"], ["lineHeight", "42rpx"]]))], ["no-param-text", _pS(_uM([["marginTop", "26rpx"], ["color", "#98a2b3"], ["fontSize", "25rpx"]]))], ["send-button", _pS(_uM([["marginTop", "36rpx"]]))], ["history-footer", _pS(_uM([["paddingTop", "28rpx"], ["paddingRight", 0], ["paddingBottom", "12rpx"], ["paddingLeft", 0], ["color", "#98a2b3"], ["fontSize", "23rpx"], ["textAlign", "center"]]))], ["detail-loading", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["width", "100%"], ["alignItems", "center"], ["paddingTop", "28rpx"], ["paddingRight", 0], ["paddingBottom", "28rpx"], ["paddingLeft", 0], ["color", "#98a2b3"], ["fontSize", "25rpx"]]))], ["detail-content", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["width", "100%"]]))], ["detail-label", _pS(_uM([["width", "120rpx"], ["flexShrink", 0], ["color", "#98a2b3"], ["fontSize", "23rpx"]]))], ["detail-value", _uM([["", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["color", "#344054"], ["fontSize", "23rpx"], ["lineHeight", "34rpx"], ["textAlign", "right"]])], [".detail-long-row ", _uM([["marginTop", "5rpx"], ["textAlign", "left"]])]])], ["detail-long-row", _pS(_uM([["flexDirection", "column"]]))]])]
