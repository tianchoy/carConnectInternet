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
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenPagesCmdCmd : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesCmdCmd) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesCmdCmd
            val _cache = __ins.renderCache
            val imei = ref("")
            val commandTypes = ref(_uA())
            val selectedTypeId = ref(null)
            val commands = ref(_uA())
            val selectedCommandId = ref(null)
            val selectedCommand = ref(null)
            val paramValues = ref(_uA())
            val loading = ref(false)
            val commandRecords = ref(null)
            val paramConfigs = computed(fun(): Any {
                if (!selectedCommand.value || !isTruthy(selectedCommand.value!!.details)) {
                    return _uA()
                }
                try {
                    return UTSAndroid.consoleDebugError(JSON.parse(selectedCommand.value!!.details), " at pages/cmd/cmd.uvue:89")
                }
                 catch (e: Throwable) {
                    console.error("解析参数配置失败:", e, " at pages/cmd/cmd.uvue:91")
                    return _uA()
                }
            }
            )
            val isFormValid = computed(fun(): Boolean {
                return paramValues.value.length > 0 && paramValues.value.every(fun(kVal): Boolean {
                    return kVal != null && kVal !== undefined && kVal !== ""
                }
                )
            }
            )
            onLoad(fun(options){
                imei.value = if (isTruthy(options["imei"])) {
                    options["imei"]
                } else {
                    ""
                }
                loadCommandTypes()
            }
            )
            val sortByCmdNameLengthAndAlphabet = fun(data): UTSArray<Any> {
                if (!UTSArray.isArray(data)) {
                    console.error("参数必须是一个数组", " at pages/cmd/cmd.uvue:108")
                    return _uA()
                }
                val sortedData = (data as UTSArray<Any>).slice()
                sortedData.sort(fun(a, b): Number {
                    val aName = if (isTruthy(a.cmdName)) {
                        a.cmdName.toString()
                    } else {
                        ""
                    }
                    val bName = if (isTruthy(b.cmdName)) {
                        b.cmdName.toString()
                    } else {
                        ""
                    }
                    if (aName.length !== bName.length) {
                        return aName.length - bName.length
                    }
                    return aName.localeCompare(bName, "zh-CN")
                }
                )
                return sortedData
            }
            val loadCommandTypes = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            loading.value = true
                            val response = await(getCmdAction())
                            console.log("加载指令类型响应:", response, " at pages/cmd/cmd.uvue:136")
                            if (response.code == 0) {
                                commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data)
                            } else {
                                uni_showToast(ShowToastOptions(title = "加载指令类型失败", icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载指令类型出错:", error, " at pages/cmd/cmd.uvue:147")
                            uni_showToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            val selectType = fun(typeId: Any): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        selectedTypeId.value = typeId
                        selectedCommandId.value = null
                        selectedCommand.value = null
                        paramValues.value = _uA()
                        commandRecords.value = null
                        console.log("选择指令类型:", typeId, UTSAndroid.`typeof`(commandRecords.value), " at pages/cmd/cmd.uvue:163")
                        try {
                            loading.value = true
                            val response = await(getCmdByMid(_uO("imei" to imei.value, "cmdmId" to typeId)))
                            if (response.code == 0) {
                                commands.value = response.data
                            } else {
                                uni_showToast(ShowToastOptions(title = "加载指令列表失败", icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载指令列表出错:", error, " at pages/cmd/cmd.uvue:181")
                            uni_showToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            val selectCommand = fun(command){
                selectedCommandId.value = command.predictCmdId
                selectedCommand.value = command
                paramValues.value = _uA()
                if (isTruthy(command.details)) {
                    try {
                        val configs = UTSAndroid.consoleDebugError(JSON.parse(command.details), " at pages/cmd/cmd.uvue:199")
                        paramValues.value = configs.map(fun(config): Any {
                            if (config.`default` !== undefined) {
                                return config.`default`.toString()
                            }
                            if (config.type == "radio" && isTruthy(config.items) && config.items.length > 0) {
                                return config.items[0].value
                            }
                            return ""
                        }
                        )
                    }
                     catch (e: Throwable) {
                        console.error("初始化参数值失败:", e, " at pages/cmd/cmd.uvue:211")
                        paramValues.value = _uA()
                    }
                }
            }
            val selectRadio = fun(index, value){
                if (paramValues.value.length <= index) {
                    val newLength = index + 1
                    val newArray = UTSArray(newLength)
                    run {
                        var i: Number = 0
                        while(i < newLength){
                            newArray[i] = if (i < paramValues.value.length) {
                                paramValues.value[i]
                            } else {
                                ""
                            }
                            i++
                        }
                    }
                    paramValues.value = newArray
                }
                paramValues.value[index] = value
            }
            val sendCommand = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!isFormValid.value) {
                            uni_showToast(ShowToastOptions(title = "请填写所有参数", icon = "none"))
                            return@w1
                        }
                        try {
                            loading.value = true
                            var cmdData = selectedCommand.value.params
                            paramConfigs.value.forEach(fun(config, index){
                                val value = paramValues.value[index]
                                if (isTruthy(config.placeholder)) {
                                    cmdData = cmdData.replace(config.placeholder, value)
                                } else {
                                    val placeholder = "\${param" + (index + 1) + "}"
                                    cmdData = cmdData.replace(placeholder, value)
                                }
                            }
                            )
                            val response = await(sendCmd(_uO("imei" to imei.value, "type" to selectedCommand.value.cmdCode, "password" to null, "cmdData" to UTSAndroid.consoleDebugError(encodeURIComponent(cmdData), " at pages/cmd/cmd.uvue:263"), "predictCmdId" to selectedCommand.value.predictCmdId)))
                            if (response.code == 0) {
                                uni_showToast(ShowToastOptions(title = "指令发送成功", icon = "success"))
                                setTimeout(fun(){
                                    getCmdRecordById(response.data).then(fun(recordResponse){
                                        console.log("获取指令记录详情响应:", recordResponse, " at pages/cmd/cmd.uvue:275")
                                        if (recordResponse.code == 0) {
                                            commandRecords.value = recordResponse.data
                                        } else {
                                            uni_showToast(ShowToastOptions(title = "获取指令记录详情失败", icon = "none"))
                                        }
                                    })
                                }, 2000)
                            } else {
                                uni_showToast(ShowToastOptions(title = "指令发送失败: " + (if (isTruthy(response.msg)) {
                                    response.msg
                                } else {
                                    "未知错误"
                                }
                                ), icon = "none", duration = 3000))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("发送指令出错:", error, " at pages/cmd/cmd.uvue:295")
                            uni_showToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "指令", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                    _cE("view", _uM("class" to "device-info"), _uA(
                        _cE("text", _uM("class" to "device-label"), "设备ID: " + _tD(imei.value), 1)
                    )),
                    _cE("view", _uM("class" to "section"), _uA(
                        _cE("text", _uM("class" to "section-title"), "指令类型"),
                        _cE("view", _uM("class" to "type-container"), _uA(
                            _cE("view", _uM("class" to "type-list"), _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(commandTypes.value, fun(type, index, __index, _cached): Any {
                                    return _cE("view", _uM("key" to type.cmdmId, "class" to _nC(_uA(
                                        "type-item",
                                        _uM("active" to (selectedTypeId.value == type.cmdmId))
                                    )), "onClick" to fun(){
                                        selectType(type.cmdmId)
                                    }
                                    ), _uA(
                                        _cE("text", _uM("class" to "type-name"), _tD(type.cmdName), 1)
                                    ), 10, _uA(
                                        "onClick"
                                    ))
                                }
                                ), 128)
                            ))
                        ))
                    )),
                    if (isTrue(commands.value.length)) {
                        _cE("view", _uM("key" to 0, "class" to "section"), _uA(
                            _cE("text", _uM("class" to "section-title"), "指令列表"),
                            _cE("view", _uM("class" to "command-list"), _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(commands.value, fun(cmd, index, __index, _cached): Any {
                                    return _cE("view", _uM("key" to cmd.predictCmdId, "class" to _nC(_uA(
                                        "command-item",
                                        _uM("active" to (selectedCommandId.value == cmd.predictCmdId))
                                    )), "onClick" to fun(){
                                        selectCommand(cmd)
                                    }), _uA(
                                        _cE("text", _uM("class" to "command-name"), _tD(cmd.cmdName), 1),
                                        _cE("text", _uM("class" to "command-descr"), _tD(cmd.remarks), 1)
                                    ), 10, _uA(
                                        "onClick"
                                    ))
                                }), 128)
                            ))
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(selectedCommand.value && selectedCommand.value!!.details)) {
                        _cE("view", _uM("key" to 1, "class" to "section"), _uA(
                            _cE("view", _uM("class" to "param-form"), _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, fun(param, index, __index, _cached): Any {
                                    return _cE("view", _uM("key" to ("param_" + index), "class" to "param-item"), _uA(
                                        _cE("text", _uM("class" to "section-title"), _tD(param.label), 1),
                                        if (param.type == "input") {
                                            _cV(_component_i_input, _uM("key" to 0, "class" to "param-input", "modelValue" to paramValues.value[index], "onUpdate:modelValue" to fun(`$event`: Any){
                                                paramValues.value[index] = `$event`
                                            }, "placeholder" to ("请输入" + param.label), "placeholder-class" to "placeholder"), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "placeholder"
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (param.type == "number") {
                                            _cV(_component_i_input, _uM("key" to 1, "class" to "param-input", "type" to "number", "modelValue" to paramValues.value[index], "onUpdate:modelValue" to fun(`$event`: Any){
                                                paramValues.value[index] = `$event`
                                            }, "placeholder" to ("请输入" + param.label), "placeholder-class" to "placeholder", "maxlength" to param.max), null, 8, _uA(
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "placeholder",
                                                "maxlength"
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        },
                                        if (param.type == "radio") {
                                            _cE("view", _uM("key" to 2, "class" to "radio-group"), _uA(
                                                _cE(Fragment, null, RenderHelpers.renderList(param.items, fun(item, __key, __index, _cached): Any {
                                                    return _cE("view", _uM("key" to ("radio_" + item.value), "class" to "radio-item", "onClick" to fun(){
                                                        selectRadio(index, item.value)
                                                    }), _uA(
                                                        _cE("view", _uM("class" to "radio-icon"), _uA(
                                                            _cE("view", _uM("class" to _nC(_uA(
                                                                "radio-inner",
                                                                _uM("checked" to (paramValues.value[index] == item.value))
                                                            ))), null, 2)
                                                        )),
                                                        _cE("text", _uM("class" to "radio-label"), _tD(item.desc), 1)
                                                    ), 8, _uA(
                                                        "onClick"
                                                    ))
                                                }), 128)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    ))
                                }), 128),
                                _cV(_component_i_button, _uM("type" to "primary", "text" to "发送指令", "class" to "submit-btn", "disabled" to !isFormValid.value, "onClick" to sendCommand), null, 8, _uA(
                                    "disabled"
                                ))
                            ))
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(commandRecords.value)) {
                        _cE("view", _uM("key" to 2, "class" to "section"), _uA(
                            _cE("text", _uM("class" to "section-title"), "指令记录"),
                            _cE("view", _uM("class" to "record-list"), _tD(if (isTruthy(commandRecords.value.reason)) {
                                commandRecords.value.reason
                            } else {
                                "暂无指令返回记录"
                            }), 1)
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(!selectedTypeId.value)) {
                        _cE("view", _uM("key" to 3, "class" to "empty-state"), _uA(
                            _cE("text", _uM("class" to "empty-text"), "请先选择指令类型")
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(loading.value)) {
                        _cE("view", _uM("key" to 4, "class" to "loading"), _uA(
                            _cE("text", _uM("class" to "loading-text"), "加载中...")
                        ))
                    } else {
                        if (isTrue(!(commands.value.length != 0) && selectedTypeId.value)) {
                            _cE("view", _uM("key" to 5, "class" to "empty-state"), _uA(
                                _cE("text", _uM("class" to "empty-text"), "暂无指令")
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                    }
                ))
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("container" to _pS(_uM("backgroundColor" to "#f5f5f5", "display" to "flex", "flexDirection" to "column")), "device-info" to _pS(_uM("display" to "flex", "alignItems" to "center", "backgroundImage" to "none", "backgroundColor" to "#FFFFFF", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "marginTop" to "30rpx", "marginRight" to 0, "marginBottom" to "30rpx", "marginLeft" to 0)), "device-label" to _pS(_uM("fontSize" to "28rpx", "color" to "#666666", "whiteSpace" to "nowrap")), "device-input" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "fontSize" to "28rpx", "color" to "#333333")), "section" to _pS(_uM("backgroundImage" to "none", "backgroundColor" to "#FFFFFF", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginBottom" to "30rpx")), "section-title" to _pS(_uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333", "marginBottom" to "20rpx")), "record-list" to _pS(_uM("fontSize" to "26rpx", "color" to "#666666")), "type-container" to _pS(_uM("width" to "100%")), "type-list" to _pS(_uM("display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap", "justifyContent" to "flex-start", "alignItems" to "center", "gap" to "20rpx")), "type-item" to _uM("" to _uM("paddingTop" to "15rpx", "paddingRight" to "30rpx", "paddingBottom" to "15rpx", "paddingLeft" to "30rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f0f0", "borderTopLeftRadius" to "50rpx", "borderTopRightRadius" to "50rpx", "borderBottomRightRadius" to "50rpx", "borderBottomLeftRadius" to "50rpx"), ".active" to _uM("backgroundImage" to "none", "backgroundColor" to "#007AFF")), "type-name" to _uM(".type-item.active " to _uM("color" to "#FFFFFF"), "" to _uM("fontSize" to "26rpx", "color" to "#666666", "whiteSpace" to "nowrap", "overflow" to "hidden", "textOverflow" to "ellipsis")), "command-list" to _pS(_uM("display" to "flex", "flexDirection" to "row", "gap" to "20rpx")), "command-item" to _uM("" to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "paddingTop" to "25rpx", "paddingRight" to "25rpx", "paddingBottom" to "25rpx", "paddingLeft" to "25rpx", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#e0e0e0", "borderRightColor" to "#e0e0e0", "borderBottomColor" to "#e0e0e0", "borderLeftColor" to "#e0e0e0", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx"), ".active" to _uM("borderTopColor" to "#007AFF", "borderRightColor" to "#007AFF", "borderBottomColor" to "#007AFF", "borderLeftColor" to "#007AFF", "backgroundColor" to "#f0f8ff")), "command-name" to _pS(_uM("fontSize" to "30rpx", "color" to "#333333", "marginBottom" to "10rpx")), "command-descr" to _pS(_uM("fontSize" to "24rpx", "color" to "#999999")), "param-form" to _pS(_uM("display" to "flex", "flexDirection" to "column", "gap" to "30rpx")), "param-item" to _pS(_uM("display" to "flex", "flexDirection" to "column", "gap" to "15rpx")), "param-label" to _pS(_uM("fontSize" to "28rpx", "color" to "#333333")), "param-input" to _pS(_uM("borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#e0e0e0", "borderRightColor" to "#e0e0e0", "borderBottomColor" to "#e0e0e0", "borderLeftColor" to "#e0e0e0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "fontSize" to "26rpx")), "radio-group" to _pS(_uM("display" to "flex", "flexDirection" to "column", "gap" to "20rpx")), "radio-item" to _pS(_uM("display" to "flex", "alignItems" to "center", "gap" to "20rpx")), "radio-icon" to _pS(_uM("width" to "36rpx", "height" to "36rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#cccccc", "borderRightColor" to "#cccccc", "borderBottomColor" to "#cccccc", "borderLeftColor" to "#cccccc", "display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "radio-inner" to _uM("" to _uM("width" to "25rpx", "height" to "25rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "backgroundImage" to "none", "backgroundColor" to "rgba(0,0,0,0)"), ".checked" to _uM("backgroundImage" to "none", "backgroundColor" to "#007AFF")), "radio-label" to _pS(_uM("fontSize" to "26rpx", "color" to "#333333")), "submit-btn" to _pS(_uM("color" to "#FFFFFF", "borderTopWidth" to "medium", "borderRightWidth" to "medium", "borderBottomWidth" to "medium", "borderLeftWidth" to "medium", "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "paddingTop" to "25rpx", "paddingRight" to "25rpx", "paddingBottom" to "25rpx", "paddingLeft" to "25rpx", "fontSize" to "30rpx", "marginTop" to "20rpx", "backgroundImage:disabled" to "none", "backgroundColor:disabled" to "#cccccc", "color:disabled" to "#999999")), "empty-state" to _pS(_uM("textAlign" to "center", "paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0)), "empty-text" to _pS(_uM("fontSize" to "28rpx", "color" to "#999999")), "loading" to _pS(_uM("textAlign" to "center", "paddingTop" to "50rpx", "paddingRight" to 0, "paddingBottom" to "50rpx", "paddingLeft" to 0)), "loading-text" to _pS(_uM("fontSize" to "28rpx", "color" to "#999999")), "placeholder" to _pS(_uM("color" to "#cccccc")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
