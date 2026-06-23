import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_input from '@/uni_modules/uv-input/components/uv-input/uv-input.vue'
import _easycom_uv_button from '@/uni_modules/uv-button/components/uv-button/uv-button.vue'
import { ref, reactive, computed, onMounted } from 'vue'
	import { getCmdAction, getCmdByMid, sendCmd, getCmdRecordById } from '@/api/request'
	
const __sfc__ = defineComponent({
  __name: 'cmd',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const imei = ref('')
	const commandTypes = ref([])
	const selectedTypeId = ref(null)
	const commands = ref([])
	const selectedCommandId = ref(null)
	const selectedCommand = ref(null)
	const paramValues = ref([])
	const loading = ref(false)
	const commandRecords = ref(null)

	const paramConfigs = computed(() => {
		if (!selectedCommand.value || !selectedCommand.value.details) return []

		try {
			return UTSAndroid.consoleDebugError(JSON.parse(selectedCommand.value.details), " at pages/cmd/cmd.uvue:89")
		} catch (e) {
			console.error('解析参数配置失败:', e, " at pages/cmd/cmd.uvue:91")
			return []
		}
	})

	const isFormValid = computed(() => {
		return paramValues.value.length > 0 &&
			paramValues.value.every(val => val !== null && val !== undefined && val !== '')
	})

	onLoad((options) => {
		imei.value = options.imei || ''
		loadCommandTypes()
	})

	const sortByCmdNameLengthAndAlphabet = (data) => {
		if (!Array.isArray(data)) {
			console.error('参数必须是一个数组', " at pages/cmd/cmd.uvue:108");
			return [];
		}

		const sortedData = [...data];

		sortedData.sort((a, b) => {
			const aName = a.cmdName ? a.cmdName.toString() : '';
			const bName = b.cmdName ? b.cmdName.toString() : '';

			// 首先按长度排序
			if (aName.length !== bName.length) {
				return aName.length - bName.length;
			}

			// 再次，长度相同则按字母顺序排序
			return aName.localeCompare(bName, 'zh-CN');
		});

		return sortedData;
	}

	// 加载指令类型
	const loadCommandTypes = async () => {
		try {
			loading.value = true
			const response = await getCmdAction()

			console.log('加载指令类型响应:', response, " at pages/cmd/cmd.uvue:136")

			if (response.code == 0) {
				commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data)
			} else {
				uni.showToast({
					title: '加载指令类型失败',
					icon: 'none'
				})
			}
		} catch (error) {
			console.error('加载指令类型出错:', error, " at pages/cmd/cmd.uvue:147")
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}
	const selectType = async (typeId : any) => {
		selectedTypeId.value = typeId
		selectedCommandId.value = null
		selectedCommand.value = null
		paramValues.value = []
		commandRecords.value = null

		console.log('选择指令类型:', typeId, typeof commandRecords.value, " at pages/cmd/cmd.uvue:163")

		try {
			loading.value = true
			const response = await getCmdByMid({
				imei: imei.value,
				cmdmId: typeId
			})

			if (response.code == 0) {
				commands.value = response.data
			} else {
				uni.showToast({
					title: '加载指令列表失败',
					icon: 'none'
				})
			}
		} catch (error) {
			console.error('加载指令列表出错:', error, " at pages/cmd/cmd.uvue:181")
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	const selectCommand = (command) => {
		selectedCommandId.value = command.predictCmdId
		selectedCommand.value = command
		paramValues.value = []

		// 初始化参数值
		if (command.details) {
			try {
				const configs = UTSAndroid.consoleDebugError(JSON.parse(command.details), " at pages/cmd/cmd.uvue:199")
				paramValues.value = configs.map(config => {
					// 处理不同类型的默认值
					if (config.default !== undefined) {
						return config.default.toString()
					}
					if (config.type == 'radio' && config.items && config.items.length > 0) {
						return config.items[0].value
					}
					return ''
				})
			} catch (e) {
				console.error('初始化参数值失败:', e, " at pages/cmd/cmd.uvue:211")
				paramValues.value = []
			}
		}
	}

	const selectRadio = (index, value) => {
		// 确保数组长度足够
		if (paramValues.value.length <= index) {
			// 扩展数组到指定长度
			const newLength = index + 1
			const newArray = new Array(newLength)
			for (let i = 0; i < newLength; i++) {
				newArray[i] = paramValues.value[i] || ''
			}
			paramValues.value = newArray
		}
		paramValues.value[index] = value
	}

	const sendCommand = async () => {
		if (!isFormValid.value) {
			uni.showToast({
				title: '请填写所有参数',
				icon: 'none'
			})
			return
		}

		try {
			loading.value = true

			// 改进参数替换逻辑
			let cmdData = selectedCommand.value.params

			// 根据参数配置进行智能替换
			paramConfigs.value.forEach((config, index) => {
				const value = paramValues.value[index]
				if (config.placeholder) {
					// 使用配置中的占位符
					cmdData = cmdData.replace(config.placeholder, value)
				} else {
					const placeholder = `\${param${index + 1}}` 
					cmdData = cmdData.replace(placeholder, value)
				}
			})

			// 发送请求
			const response = await sendCmd({
				imei: imei.value,
				type: selectedCommand.value.cmdCode,
				password: null,
				cmdData: UTSAndroid.consoleDebugError(encodeURIComponent(cmdData), " at pages/cmd/cmd.uvue:263"),
				predictCmdId: selectedCommand.value.predictCmdId
			})

			if (response.code == 0) {
				uni.showToast({
					title: '指令发送成功',
					icon: 'success'
				})
				//等待两秒之后再请求
				setTimeout(() => {
					getCmdRecordById(response.data).then(recordResponse => {
						console.log('获取指令记录详情响应:', recordResponse, " at pages/cmd/cmd.uvue:275")
						if (recordResponse.code == 0) {
							// 处理指令记录详情
							commandRecords.value = recordResponse.data
						} else {
							uni.showToast({
								title: '获取指令记录详情失败',
								icon: 'none'
							})
						}
					})
				}, 2000)
			} else {
				uni.showToast({
					title: '指令发送失败: ' + (response.msg || '未知错误'),
					icon: 'none',
					duration: 3000
				})
			}
		} catch (error) {
			console.error('发送指令出错:', error, " at pages/cmd/cmd.uvue:295")
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_uv_input = resolveEasyComponent("uv-input",_easycom_uv_input)
const _component_uv_button = resolveEasyComponent("uv-button",_easycom_uv_button)

  return _cE("view", _uM({ class: "container" }), [
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
              onClick: () => {selectType(type.cmdmId)}
            }), [
              _cE("text", _uM({ class: "type-name" }), _tD(type.cmdName), 1 /* TEXT */)
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
    isTrue(selectedCommand.value && selectedCommand.value.details)
      ? _cE("view", _uM({
          key: 1,
          class: "section"
        }), [
          _cE("view", _uM({ class: "param-form" }), [
            _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, (param, index, __index, _cached): any => {
              return _cE("view", _uM({
                key: 'param_' + index,
                class: "param-item"
              }), [
                _cE("text", _uM({ class: "section-title" }), _tD(param.label), 1 /* TEXT */),
                param.type == 'input'
                  ? _cV(_component_uv_input, _uM({
                      key: 0,
                      class: "param-input",
                      modelValue: paramValues.value[index],
                      "onUpdate:modelValue": $event => {(paramValues.value[index]) = $event},
                      placeholder: '请输入' + param.label,
                      "placeholder-class": "placeholder"
                    }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "placeholder"])
                  : _cC("v-if", true),
                param.type == 'number'
                  ? _cV(_component_uv_input, _uM({
                      key: 1,
                      class: "param-input",
                      type: "number",
                      modelValue: paramValues.value[index],
                      "onUpdate:modelValue": $event => {(paramValues.value[index]) = $event},
                      placeholder: '请输入' + param.label,
                      "placeholder-class": "placeholder",
                      maxlength: param.max
                    }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "placeholder", "maxlength"])
                  : _cC("v-if", true),
                param.type == 'radio'
                  ? _cE("view", _uM({
                      key: 2,
                      class: "radio-group"
                    }), [
                      _cE(Fragment, null, RenderHelpers.renderList(param.items, (item, __key, __index, _cached): any => {
                        return _cE("view", _uM({
                          key: 'radio_' + item.value,
                          class: "radio-item",
                          onClick: () => {selectRadio(index, item.value)}
                        }), [
                          _cE("view", _uM({ class: "radio-icon" }), [
                            _cE("view", _uM({
                              class: _nC(["radio-inner", _uM({ checked: paramValues.value[index] == item.value })])
                            }), null, 2 /* CLASS */)
                          ]),
                          _cE("text", _uM({ class: "radio-label" }), _tD(item.desc), 1 /* TEXT */)
                        ], 8 /* PROPS */, ["onClick"])
                      }), 128 /* KEYED_FRAGMENT */)
                    ])
                  : _cC("v-if", true)
              ])
            }), 128 /* KEYED_FRAGMENT */),
            _cV(_component_uv_button, _uM({
              type: "primary",
              class: "submit-btn",
              disabled: !isFormValid.value,
              onClick: sendCommand
            }), _uM({
              default: withSlotCtx((): any[] => [" 发送指令 "]),
              _: 1 /* STABLE */
            }), 8 /* PROPS */, ["disabled"])
          ])
        ])
      : _cC("v-if", true),
    isTrue(commandRecords.value)
      ? _cE("view", _uM({
          key: 2,
          class: "section"
        }), [
          _cE("text", _uM({ class: "section-title" }), "指令记录"),
          _cE("view", _uM({ class: "record-list" }), _tD(commandRecords.value.reason || '暂无指令返回记录'), 1 /* TEXT */)
        ])
      : _cC("v-if", true),
    isTrue(!selectedTypeId.value)
      ? _cE("view", _uM({
          key: 3,
          class: "empty-state"
        }), [
          _cE("text", _uM({ class: "empty-text" }), "请先选择指令类型")
        ])
      : _cC("v-if", true),
    isTrue(loading.value)
      ? _cE("view", _uM({
          key: 4,
          class: "loading"
        }), [
          _cE("text", _uM({ class: "loading-text" }), "加载中...")
        ])
      : isTrue(!commands.value.length && selectedTypeId.value)
        ? _cE("view", _uM({
            key: 5,
            class: "empty-state"
          }), [
            _cE("text", _uM({ class: "empty-text" }), "暂无指令")
          ])
        : _cC("v-if", true)
  ])
}
}

})
export default __sfc__
const GenPagesCmdCmdStyles = [_uM([["container", _pS(_uM([["backgroundColor", "#f5f5f5"], ["display", "flex"], ["flexDirection", "column"]]))], ["device-info", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["backgroundImage", "none"], ["backgroundColor", "#FFFFFF"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginTop", "30rpx"], ["marginRight", 0], ["marginBottom", "30rpx"], ["marginLeft", 0]]))], ["device-label", _pS(_uM([["fontSize", "28rpx"], ["color", "#666666"], ["whiteSpace", "nowrap"]]))], ["device-input", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["fontSize", "28rpx"], ["color", "#333333"]]))], ["section", _pS(_uM([["backgroundImage", "none"], ["backgroundColor", "#FFFFFF"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginBottom", "30rpx"]]))], ["section-title", _pS(_uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["marginBottom", "20rpx"]]))], ["record-list", _pS(_uM([["fontSize", "26rpx"], ["color", "#666666"]]))], ["type-container", _pS(_uM([["width", "100%"]]))], ["type-list", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["flexWrap", "wrap"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["gap", "20rpx"]]))], ["type-item", _uM([["", _uM([["paddingTop", "15rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "15rpx"], ["paddingLeft", "30rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f0f0"], ["borderTopLeftRadius", "50rpx"], ["borderTopRightRadius", "50rpx"], ["borderBottomRightRadius", "50rpx"], ["borderBottomLeftRadius", "50rpx"]])], [".active", _uM([["backgroundImage", "none"], ["backgroundColor", "#007AFF"]])]])], ["type-name", _uM([[".type-item.active ", _uM([["color", "#FFFFFF"]])], ["", _uM([["fontSize", "26rpx"], ["color", "#666666"], ["whiteSpace", "nowrap"], ["overflow", "hidden"], ["textOverflow", "ellipsis"]])]])], ["command-list", _pS(_uM([["display", "flex"], ["flexDirection", "row"], ["gap", "20rpx"]]))], ["command-item", _uM([["", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["paddingTop", "25rpx"], ["paddingRight", "25rpx"], ["paddingBottom", "25rpx"], ["paddingLeft", "25rpx"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#e0e0e0"], ["borderRightColor", "#e0e0e0"], ["borderBottomColor", "#e0e0e0"], ["borderLeftColor", "#e0e0e0"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])], [".active", _uM([["borderTopColor", "#007AFF"], ["borderRightColor", "#007AFF"], ["borderBottomColor", "#007AFF"], ["borderLeftColor", "#007AFF"], ["backgroundColor", "#f0f8ff"]])]])], ["command-name", _pS(_uM([["fontSize", "30rpx"], ["color", "#333333"], ["marginBottom", "10rpx"]]))], ["command-descr", _pS(_uM([["fontSize", "24rpx"], ["color", "#999999"]]))], ["param-form", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["gap", "30rpx"]]))], ["param-item", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["gap", "15rpx"]]))], ["param-label", _pS(_uM([["fontSize", "28rpx"], ["color", "#333333"]]))], ["param-input", _pS(_uM([["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#e0e0e0"], ["borderRightColor", "#e0e0e0"], ["borderBottomColor", "#e0e0e0"], ["borderLeftColor", "#e0e0e0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["fontSize", "26rpx"]]))], ["radio-group", _pS(_uM([["display", "flex"], ["flexDirection", "column"], ["gap", "20rpx"]]))], ["radio-item", _pS(_uM([["display", "flex"], ["alignItems", "center"], ["gap", "20rpx"]]))], ["radio-icon", _pS(_uM([["width", "36rpx"], ["height", "36rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["borderTopWidth", "1rpx"], ["borderRightWidth", "1rpx"], ["borderBottomWidth", "1rpx"], ["borderLeftWidth", "1rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#cccccc"], ["borderRightColor", "#cccccc"], ["borderBottomColor", "#cccccc"], ["borderLeftColor", "#cccccc"], ["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["radio-inner", _uM([["", _uM([["width", "25rpx"], ["height", "25rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["backgroundImage", "none"], ["backgroundColor", "rgba(0,0,0,0)"]])], [".checked", _uM([["backgroundImage", "none"], ["backgroundColor", "#007AFF"]])]])], ["radio-label", _pS(_uM([["fontSize", "26rpx"], ["color", "#333333"]]))], ["submit-btn", _pS(_uM([["color", "#FFFFFF"], ["borderTopWidth", "medium"], ["borderRightWidth", "medium"], ["borderBottomWidth", "medium"], ["borderLeftWidth", "medium"], ["borderTopStyle", "none"], ["borderRightStyle", "none"], ["borderBottomStyle", "none"], ["borderLeftStyle", "none"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["paddingTop", "25rpx"], ["paddingRight", "25rpx"], ["paddingBottom", "25rpx"], ["paddingLeft", "25rpx"], ["fontSize", "30rpx"], ["marginTop", "20rpx"], ["backgroundImage:disabled", "none"], ["backgroundColor:disabled", "#cccccc"], ["color:disabled", "#999999"]]))], ["empty-state", _pS(_uM([["textAlign", "center"], ["paddingTop", "100rpx"], ["paddingRight", 0], ["paddingBottom", "100rpx"], ["paddingLeft", 0]]))], ["empty-text", _pS(_uM([["fontSize", "28rpx"], ["color", "#999999"]]))], ["loading", _pS(_uM([["textAlign", "center"], ["paddingTop", "50rpx"], ["paddingRight", 0], ["paddingBottom", "50rpx"], ["paddingLeft", 0]]))], ["loading-text", _pS(_uM([["fontSize", "28rpx"], ["color", "#999999"]]))], ["placeholder", _pS(_uM([["color", "#cccccc"]]))]])]
