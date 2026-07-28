import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_button from '@/uni_modules/i-ui-x/components/i-button/i-button.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
import { ref, computed } from 'vue'
import { getCmdAction, getCmdByMid, sendCmd } from '@/api/request'


const __sfc__ = defineComponent({
  __name: 'cmd',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const imei = ref('')
const commandTypes = ref<Array<UTSJSONObject>>([])
const selectedTypeId = ref<string | number | null>(null)
const commands = ref<Array<UTSJSONObject>>([])
const selectedCommandId = ref<string | number | null>(null)
const selectedCommand = ref<UTSJSONObject | null>(null)
const paramConfigs = ref<Array<UTSJSONObject>>([])
const paramValues = ref<Array<string>>([])
const paramConfigError = ref('')
const loading = ref(false)
const sending = ref(false)

const isFormValid = computed<boolean>(() => {
	if (selectedCommand.value == null || paramConfigError.value != '') return false
	return paramValues.value.length == paramConfigs.value.length &&
		paramValues.value.every((value: string) : boolean => value != '')
})

const sortByCmdNameLengthAndAlphabet = (data: Array<UTSJSONObject>): Array<UTSJSONObject> => {
	const sortedData = data.slice()
	sortedData.sort((a: UTSJSONObject, b: UTSJSONObject): number => {
		const aName = (a['cmdName'] as string | null) ?? ''
		const bName = (b['cmdName'] as string | null) ?? ''
		if (aName.length != bName.length) return aName.length - bName.length
		if (aName == bName) return 0
		return aName < bName ? -1 : 1
	})
	return sortedData
}

const getParamLabel = (config: UTSJSONObject): string => {
	const label = config['label']
	return label == null ? '参数' : label.toString()
}

const getParamMaxLength = (config: UTSJSONObject): number => {
	const max = config['max']
	return typeof max == 'number' ? max : -1
}

const getRadioItems = (config: UTSJSONObject): Array<UTSJSONObject> => {
	return (config['items'] as Array<UTSJSONObject> | null) ?? []
}

const getRadioValue = (item: UTSJSONObject): string => {
	const value = item['value']
	return value == null ? '' : value.toString()
}

const getRadioDescription = (item: UTSJSONObject): string => {
	const desc = item['desc']
	return desc == null ? '' : desc.toString()
}

const parseParamConfigs = (details: string | null): Array<UTSJSONObject> => {
	paramConfigError.value = ''
	if (details == null || details.trim().length == 0) return []

	try {
		const parsed = JSON.parse(details)
		if (!Array.isArray(parsed)) {
			paramConfigError.value = '指令参数配置格式无效'
			return []
		}

		const configs = parsed as Array<UTSJSONObject>
		for (let index = 0; index < configs.length; index++) {
			const config = configs[index]
			if (config == null) {
				paramConfigError.value = '指令参数配置无效'
				return []
			}
			const type = config['type'] as string | null
			if (type != 'input' && type != 'number' && type != 'radio') {
				paramConfigError.value = '该指令包含暂不支持的参数类型'
				return []
			}
			if (type == 'radio') {
				const items = getRadioItems(config)
				if (items.length == 0 || items.some((item: UTSJSONObject): boolean => getRadioValue(item) == '' || getRadioDescription(item) == '')) {
					paramConfigError.value = '指令单选参数配置无效'
					return []
				}
			}
		}
		return configs
	} catch (error) {
		console.error('解析参数配置失败:', error)
		paramConfigError.value = '指令参数配置无效'
		return []
	}
}

const initializeParamValues = (configs: Array<UTSJSONObject>): Array<string> => {
	const values: Array<string> = []
	for (let index = 0; index < configs.length; index++) {
		const config = configs[index]
		const defaultValue = config['default']
		let value = ''
		if (defaultValue != null) {
			value = defaultValue.toString()
		} else if ((config['type'] as string | null) == 'radio') {
			value = getRadioValue(getRadioItems(config)[0])
		}
		values.push(value)
	}
	return values
}

const getParamValue = (index: number): string => {
	return index >= 0 && index < paramValues.value.length ? paramValues.value[index] : ''
}

const updateParamValueFromEvent = (index: number, value: any): void => {
	if (sending.value || index < 0 || index >= paramValues.value.length) return
	paramValues.value[index] = value == null ? '' : value.toString()
}

const loadCommandTypes = async (): Promise<void> => {
	try {
		loading.value = true
		const response = await getCmdAction()
		if (response.code == 0) {
			commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data)
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '加载指令类型失败', icon: 'none' })
		}
	} catch (error) {
		console.error('加载指令类型出错:', error)
		showAppToast({ title: '网络错误', icon: 'none' })
	} finally {
		loading.value = false
	}
}

onLoad((options) => {
	imei.value = options.imei ?? ''
	loadCommandTypes()
})

const selectTypeByItem = async (type: UTSJSONObject): Promise<void> => {
	if (sending.value) return
	const typeId = type['cmdmId'] as string | number | null
	if (typeId == null) return
	selectedTypeId.value = typeId
	selectedCommandId.value = null
	selectedCommand.value = null
	paramConfigs.value = []
	paramValues.value = []
	paramConfigError.value = ''
	commands.value = []

	try {
		loading.value = true
		const response = await getCmdByMid({ imei: imei.value, cmdmId: typeId } as UTSJSONObject)
		if (response.code == 0) {
			commands.value = response.data
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '加载指令列表失败', icon: 'none' })
		}
	} catch (error) {
		console.error('加载指令列表出错:', error)
		showAppToast({ title: '网络错误', icon: 'none' })
	} finally {
		loading.value = false
	}
}

const selectCommand = (command: UTSJSONObject): void => {
	if (sending.value) return
	selectedCommandId.value = command['predictCmdId'] as string | number | null
	selectedCommand.value = command
	const configs = parseParamConfigs(command['details'] as string | null)
	paramConfigs.value = configs
	paramValues.value = paramConfigError.value == '' ? initializeParamValues(configs) : []
}

const selectRadio = (index: number, value: string): void => {
	if (sending.value || index < 0 || index >= paramValues.value.length) return
	paramValues.value[index] = value
}

const sendCommand = async (): Promise<void> => {
	if (sending.value) return
	if (selectedCommand.value == null) {
		showAppToast({ title: '请选择指令', icon: 'none' })
		return
	}
	if (paramConfigError.value != '') {
		showAppToast({ title: paramConfigError.value, icon: 'none' })
		return
	}
	if (!isFormValid.value) {
		showAppToast({ title: '请填写所有参数', icon: 'none' })
		return
	}

	const command = selectedCommand.value
	let cmdData = (command['params'] as string | null) ?? ''
	for (let index = 0; index < paramConfigs.value.length; index++) {
		const config = paramConfigs.value[index]
		const configuredPlaceholder = config['placeholder'] as string | null
		const placeholder = configuredPlaceholder != null && configuredPlaceholder.length > 0
			? configuredPlaceholder
			: '${param' + (index + 1).toString() + '}'
		cmdData = cmdData.split(placeholder).join(paramValues.value[index])
	}

	try {
		sending.value = true
		const response = await sendCmd({
			imei: imei.value,
			type: (command['cmdCode'] as string | null) ?? '',
			password: null,
			cmdData: encodeURIComponent(cmdData),
			predictCmdId: command['predictCmdId']
		} as UTSJSONObject)
		if (response.code == 0) {
			showAppToast({ title: response.msg != '' ? response.msg : '指令发送成功', icon: 'success' })
		} else {
			showAppToast({ title: response.msg != '' ? response.msg : '指令发送失败', icon: 'none', duration: 3000 })
		}
	} catch (error) {
		console.error('发送指令出错:', error)
		showAppToast({ title: '网络错误', icon: 'none' })
	} finally {
		sending.value = false
	}
}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_button = resolveEasyComponent("i-button",_easycom_i_button)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "指令",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "device-info" }), [
        _cE("text", _uM({ class: "device-label" }), "设备ID: " + _tD(imei.value), 1 /* TEXT */)
      ]),
      _cE("view", _uM({ class: "section" }), [
        _cE("text", _uM({ class: "section-title" }), "指令类型"),
        _cE("view", _uM({ class: "type-container" }), [
          _cE("view", _uM({ class: "type-list" }), [
            _cE(Fragment, null, RenderHelpers.renderList(commandTypes.value, (type, index, __index, _cached): any => {
              return _cE("view", _uM({
                key: type.cmdmId,
                class: _nC(["type-item", _uM({ active: selectedTypeId.value == type.cmdmId })]),
                onClick: () => {selectTypeByItem(type)}
              }), [
                _cE("text", _uM({
                  class: "type-name",
                  style: _nS(_uM({ color: selectedTypeId.value == type.cmdmId ? '#ffffff' : '#666666' }))
                }), _tD(type.cmdName), 5 /* TEXT, STYLE */)
              ], 10 /* CLASS, PROPS */, ["onClick"])
            }), 128 /* KEYED_FRAGMENT */)
          ])
        ])
      ]),
      isTrue(commands.value.length)
        ? _cE("view", _uM({
            key: 0,
            class: "section"
          }), [
            _cE("text", _uM({ class: "section-title" }), "指令列表"),
            _cE("view", _uM({ class: "command-list" }), [
              _cE(Fragment, null, RenderHelpers.renderList(commands.value, (cmd, index, __index, _cached): any => {
                return _cE("view", _uM({
                  key: cmd.predictCmdId,
                  class: _nC(["command-item", _uM({ active: selectedCommandId.value == cmd.predictCmdId })]),
                  onClick: () => {selectCommand(cmd)}
                }), [
                  _cE("text", _uM({ class: "command-name" }), _tD(cmd.cmdName), 1 /* TEXT */),
                  _cE("text", _uM({ class: "command-descr" }), _tD(cmd.remarks), 1 /* TEXT */)
                ], 10 /* CLASS, PROPS */, ["onClick"])
              }), 128 /* KEYED_FRAGMENT */)
            ])
          ])
        : _cC("v-if", true),
      selectedCommand.value != null
        ? _cE("view", _uM({
            key: 1,
            class: "section"
          }), [
            _cE("view", _uM({ class: "param-form" }), [
              paramConfigError.value != ''
                ? _cE("text", _uM({
                    key: 0,
                    class: "param-error"
                  }), _tD(paramConfigError.value), 1 /* TEXT */)
                : _cC("v-if", true),
              _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, (param, index, __index, _cached): any => {
                return _cE("view", _uM({
                  key: 'param_' + index,
                  class: "param-item"
                }), [
                  _cE("text", _uM({ class: "param-label" }), _tD(getParamLabel(param)), 1 /* TEXT */),
                  param.type == 'input'
                    ? _cV(_component_i_input, _uM({
                        key: 0,
                        class: "param-input",
                        "model-value": getParamValue(index),
                        "onUpdate:modelValue": ($event: any) => {updateParamValueFromEvent(index, $event)},
                        placeholder: '请输入' + getParamLabel(param),
                        "placeholder-class": "placeholder",
                        border: "none",
                        height: "44px",
                        "font-size": "15px"
                      }), null, 8 /* PROPS */, ["model-value", "onUpdate:modelValue", "placeholder"])
                    : _cC("v-if", true),
                  param.type == 'number'
                    ? _cV(_component_i_input, _uM({
                        key: 1,
                        class: "param-input",
                        type: "number",
                        "model-value": getParamValue(index),
                        "onUpdate:modelValue": ($event: any) => {updateParamValueFromEvent(index, $event)},
                        placeholder: '请输入' + getParamLabel(param),
                        "placeholder-class": "placeholder",
                        maxlength: getParamMaxLength(param),
                        border: "none",
                        height: "44px",
                        "font-size": "15px"
                      }), null, 8 /* PROPS */, ["model-value", "onUpdate:modelValue", "placeholder", "maxlength"])
                    : _cC("v-if", true),
                  param.type == 'radio'
                    ? _cE("view", _uM({
                        key: 2,
                        class: "radio-group"
                      }), [
                        _cE(Fragment, null, RenderHelpers.renderList(getRadioItems(param), (item, __key, __index, _cached): any => {
                          return _cE("view", _uM({
                            key: 'radio_' + item.value,
                            class: "radio-item",
                            onClick: () => {selectRadio(index, getRadioValue(item))}
                          }), [
                            _cE("view", _uM({ class: "radio-icon" }), [
                              _cE("view", _uM({
                                class: _nC(["radio-inner", _uM({ checked: getParamValue(index) == getRadioValue(item) })])
                              }), null, 2 /* CLASS */)
                            ]),
                            _cE("text", _uM({ class: "radio-label" }), _tD(getRadioDescription(item)), 1 /* TEXT */)
                          ], 8 /* PROPS */, ["onClick"])
                        }), 128 /* KEYED_FRAGMENT */)
                      ])
                    : _cC("v-if", true)
                ])
              }), 128 /* KEYED_FRAGMENT */),
              isTrue(paramConfigs.value.length == 0 && paramConfigError.value == '')
                ? _cE("text", _uM({
                    key: 1,
                    class: "no-param-tip"
                  }), "该指令无需填写参数")
                : _cC("v-if", true),
              _cV(_component_i_button, _uM({
                type: "primary",
                text: "发送指令",
                class: "submit-btn",
                loading: sending.value,
                disabled: sending.value || loading.value || !isFormValid.value,
                onClick: sendCommand
              }), null, 8 /* PROPS */, ["loading", "disabled"])
            ])
          ])
        : _cC("v-if", true),
      isTrue(!selectedTypeId.value)
        ? _cE("view", _uM({
            key: 2,
            class: "empty-state"
          }), [
            _cE("text", _uM({ class: "empty-text" }), "请先选择指令类型")
          ])
        : _cC("v-if", true),
      isTrue(loading.value)
        ? _cE("view", _uM({
            key: 3,
            class: "loading"
          }), [
            _cE("text", _uM({ class: "loading-text" }), "加载中...")
          ])
        : isTrue(commands.value.length == 0 && selectedTypeId.value != null)
          ? _cE("view", _uM({
              key: 4,
              class: "empty-state"
            }), [
              _cE("text", _uM({ class: "empty-text" }), "暂无指令")
            ])
          : _cC("v-if", true)
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesCmdCmdStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#f5f5f5"], ["display", "flex"], ["flexDirection", "column"], ["paddingBottom", "30rpx"]]))], ["device-info", _pS(_uM([["backgroundImage", "none"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginTop", 0], ["marginRight", "20rpx"], ["marginBottom", "30rpx"], ["marginLeft", "20rpx"], ["display", "flex"], ["alignItems", "center"]]))], ["section", _pS(_uM([["backgroundImage", "none"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginTop", 0], ["marginRight", "20rpx"], ["marginBottom", "30rpx"], ["marginLeft", "20rpx"]]))], ["device-label", _pS(_uM([["fontSize", "28rpx"], ["color", "#666666"], ["whiteSpace", "nowrap"]]))], ["section-title", _pS(_uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["marginBottom", "20rpx"]]))], ["type-list", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["flexWrap", "wrap"], ["alignItems", "center"]]))], ["type-item", _uM([["", _uM([["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["paddingTop", "15rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "15rpx"], ["paddingLeft", "30rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f0f0"], ["borderTopLeftRadius", "50rpx"], ["borderTopRightRadius", "50rpx"], ["borderBottomRightRadius", "50rpx"], ["borderBottomLeftRadius", "50rpx"]])], [".active", _uM([["backgroundImage", "none"], ["backgroundColor", "#007AFF"]])]])], ["type-name", _uM([[".type-item.active ", _uM([["color", "#ffffff"]])], ["", _uM([["fontSize", "26rpx"], ["color", "#666666"], ["whiteSpace", "nowrap"]])]])], ["command-list", _pS(_uM([["display", "flex"], ["flexDirection", "column"]]))], ["command-item", _uM([["", _uM([["width", "100%"], ["boxSizing", "border-box"], ["paddingTop", "25rpx"], ["paddingRight", "25rpx"], ["paddingBottom", "25rpx"], ["paddingLeft", "25rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#e0e0e0"], ["borderRightColor", "#e0e0e0"], ["borderBottomColor", "#e0e0e0"], ["borderLeftColor", "#e0e0e0"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])], [".command-item+", _uM([["marginTop", "20rpx"]])], [".active", _uM([["borderTopColor", "#007AFF"], ["borderRightColor", "#007AFF"], ["borderBottomColor", "#007AFF"], ["borderLeftColor", "#007AFF"], ["backgroundColor", "#f0f8ff"]])]])], ["command-name", _pS(_uM([["fontSize", "30rpx"], ["color", "#333333"], ["marginBottom", "10rpx"]]))], ["command-descr", _pS(_uM([["fontSize", "24rpx"], ["color", "#999999"], ["lineHeight", "36rpx"]]))], ["param-form", _pS(_uM([["display", "flex"], ["flexDirection", "column"]]))], ["param-item", _uM([["", _uM([["display", "flex"], ["flexDirection", "column"]])], [".param-item+", _uM([["marginTop", "30rpx"]])]])], ["radio-group", _pS(_uM([["display", "flex"], ["flexDirection", "column"]]))], ["param-label", _pS(_uM([["marginBottom", "15rpx"], ["fontSize", "28rpx"], ["color", "#333333"]]))], ["param-input", _pS(_uM([["width", "100%"], ["boxSizing", "border-box"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#e0e0e0"], ["borderRightColor", "#e0e0e0"], ["borderBottomColor", "#e0e0e0"], ["borderLeftColor", "#e0e0e0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"], ["backgroundImage", "none"], ["backgroundColor", "#ffffff"]]))], ["param-error", _pS(_uM([["color", "#e43d33"], ["fontSize", "26rpx"], ["marginBottom", "20rpx"]]))], ["no-param-tip", _pS(_uM([["color", "#999999"], ["fontSize", "26rpx"], ["marginBottom", "20rpx"]]))], ["radio-item", _uM([["", _uM([["display", "flex"], ["alignItems", "center"]])], [".radio-item+", _uM([["marginTop", "20rpx"]])]])], ["radio-icon", _pS(_uM([["marginRight", "20rpx"], ["width", "36rpx"], ["height", "36rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#cccccc"], ["borderRightColor", "#cccccc"], ["borderBottomColor", "#cccccc"], ["borderLeftColor", "#cccccc"], ["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["radio-inner", _uM([["", _uM([["width", "25rpx"], ["height", "25rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["backgroundImage", "none"], ["backgroundColor", "rgba(0,0,0,0)"]])], [".checked", _uM([["backgroundImage", "none"], ["backgroundColor", "#007AFF"]])]])], ["radio-label", _pS(_uM([["fontSize", "26rpx"], ["color", "#333333"]]))], ["submit-btn", _pS(_uM([["marginTop", "30rpx"]]))], ["empty-state", _pS(_uM([["textAlign", "center"], ["paddingTop", "50rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "50rpx"], ["paddingLeft", "20rpx"], ["backgroundImage", "none"], ["backgroundColor", "#ffffff"], ["marginTop", 0], ["marginRight", "20rpx"], ["marginBottom", "30rpx"], ["marginLeft", "20rpx"]]))], ["loading", _pS(_uM([["textAlign", "center"], ["paddingTop", "50rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "50rpx"], ["paddingLeft", "20rpx"], ["backgroundImage", "none"], ["backgroundColor", "#ffffff"], ["marginTop", 0], ["marginRight", "20rpx"], ["marginBottom", "30rpx"], ["marginLeft", "20rpx"]]))], ["placeholder", _pS(_uM([["color", "#cccccc"]]))]])]
