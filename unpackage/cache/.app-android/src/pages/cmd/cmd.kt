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
            val commandTypes = ref(_uA<UTSJSONObject>())
            val selectedTypeId = ref<Any?>(null)
            val commands = ref(_uA<UTSJSONObject>())
            val selectedCommandId = ref<Any?>(null)
            val selectedCommand = ref<UTSJSONObject?>(null)
            val paramConfigs = ref(_uA<UTSJSONObject>())
            val paramValues = ref(_uA<String>())
            val paramConfigError = ref("")
            val loading = ref(false)
            val sending = ref(false)
            val isFormValid = computed<Boolean>(fun(): Boolean {
                if (selectedCommand.value == null || paramConfigError.value != "") {
                    return false
                }
                return paramValues.value.length == paramConfigs.value.length && paramValues.value.every(fun(value: String): Boolean {
                    return value != ""
                }
                )
            }
            )
            val sortByCmdNameLengthAndAlphabet = fun(data: UTSArray<UTSJSONObject>): UTSArray<UTSJSONObject> {
                val sortedData = data.slice()
                sortedData.sort(fun(a: UTSJSONObject, b: UTSJSONObject): Number {
                    val aName = (a["cmdName"] as String?) ?: ""
                    val bName = (b["cmdName"] as String?) ?: ""
                    if (aName.length != bName.length) {
                        return aName.length - bName.length
                    }
                    if (aName == bName) {
                        return 0
                    }
                    return if (aName < bName) {
                        -1
                    } else {
                        1
                    }
                }
                )
                return sortedData
            }
            val getParamLabel = fun(config: UTSJSONObject): String {
                val label = config["label"]
                return if (label == null) {
                    "参数"
                } else {
                    label.toString()
                }
            }
            val getParamMaxLength = fun(config: UTSJSONObject): Number {
                val max = config["max"]
                return if (UTSAndroid.`typeof`(max) == "number") {
                    max as Number
                } else {
                    -1
                }
            }
            val getRadioItems = fun(config: UTSJSONObject): UTSArray<UTSJSONObject> {
                return (config["items"] as UTSArray<UTSJSONObject>?) ?: _uA()
            }
            val getRadioValue = fun(item: UTSJSONObject): String {
                val value = item["value"]
                return if (value == null) {
                    ""
                } else {
                    value.toString()
                }
            }
            val getRadioDescription = fun(item: UTSJSONObject): String {
                val desc = item["desc"]
                return if (desc == null) {
                    ""
                } else {
                    desc.toString()
                }
            }
            val parseParamConfigs = fun(details: String?): UTSArray<UTSJSONObject> {
                paramConfigError.value = ""
                if (details == null || details.trim().length == 0) {
                    return _uA()
                }
                try {
                    val parsed = UTSAndroid.consoleDebugError(JSON.parse(details), " at pages/cmd/cmd.uvue:130")
                    if (!UTSArray.isArray(parsed)) {
                        paramConfigError.value = "指令参数配置格式无效"
                        return _uA()
                    }
                    val configs = parsed as UTSArray<UTSJSONObject>
                    run {
                        var index: Number = 0
                        while(index < configs.length){
                            val config = configs[index]
                            if (config == null) {
                                paramConfigError.value = "指令参数配置无效"
                                return _uA()
                            }
                            val type = config["type"] as String?
                            if (type != "input" && type != "number" && type != "radio") {
                                paramConfigError.value = "该指令包含暂不支持的参数类型"
                                return _uA()
                            }
                            if (type == "radio") {
                                val items = getRadioItems(config)
                                if (items.length == 0 || items.some(fun(item: UTSJSONObject): Boolean {
                                    return getRadioValue(item) == "" || getRadioDescription(item) == ""
                                }
                                )) {
                                    paramConfigError.value = "指令单选参数配置无效"
                                    return _uA()
                                }
                            }
                            index++
                        }
                    }
                    return configs
                }
                 catch (error: Throwable) {
                    console.error("解析参数配置失败:", error, " at pages/cmd/cmd.uvue:158")
                    paramConfigError.value = "指令参数配置无效"
                    return _uA()
                }
            }
            val initializeParamValues = fun(configs: UTSArray<UTSJSONObject>): UTSArray<String> {
                val values: UTSArray<String> = _uA()
                run {
                    var index: Number = 0
                    while(index < configs.length){
                        val config = configs[index]
                        val defaultValue = config["default"]
                        var value = ""
                        if (defaultValue != null) {
                            value = defaultValue.toString()
                        } else if ((config["type"] as String?) == "radio") {
                            value = getRadioValue(getRadioItems(config)[0])
                        }
                        values.push(value)
                        index++
                    }
                }
                return values
            }
            val getParamValue = fun(index: Number): String {
                return if (index >= 0 && index < paramValues.value.length) {
                    paramValues.value[index]
                } else {
                    ""
                }
            }
            val updateParamValueFromEvent = fun(index: Number, value: Any): Unit {
                if (sending.value || index < 0 || index >= paramValues.value.length) {
                    return
                }
                paramValues.value[index] = if (value == null) {
                    ""
                } else {
                    value.toString()
                }
            }
            val loadCommandTypes = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            loading.value = true
                            val response = await(getCmdAction())
                            if (response.code == 200 && response.data != null) {
                                commandTypes.value = sortByCmdNameLengthAndAlphabet(response.data!!)
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "加载指令类型失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载指令类型出错:", error, " at pages/cmd/cmd.uvue:199")
                            showAppToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            onLoad(fun(options){
                imei.value = options["imei"] ?: ""
                loadCommandTypes()
            }
            )
            val selectTypeByItem = fun(type: UTSJSONObject): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (sending.value) {
                            return@w1
                        }
                        val typeId = type["cmdmId"] as Any?
                        if (typeId == null) {
                            return@w1
                        }
                        selectedTypeId.value = typeId
                        selectedCommandId.value = null
                        selectedCommand.value = null
                        paramConfigs.value = _uA()
                        paramValues.value = _uA()
                        paramConfigError.value = ""
                        commands.value = _uA()
                        try {
                            loading.value = true
                            val response = await(getCmdByMid(_uO("imei" to imei.value, "cmdmId" to typeId)))
                            if (response.code == 200 && response.data != null) {
                                commands.value = response.data!!
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "加载指令列表失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载指令列表出错:", error, " at pages/cmd/cmd.uvue:232")
                            showAppToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            val selectCommand = fun(command: UTSJSONObject): Unit {
                if (sending.value) {
                    return
                }
                selectedCommandId.value = command["predictCmdId"] as Any?
                selectedCommand.value = command
                val configs = parseParamConfigs(command["details"] as String?)
                paramConfigs.value = configs
                paramValues.value = if (paramConfigError.value == "") {
                    initializeParamValues(configs)
                } else {
                    _uA()
                }
            }
            val selectRadio = fun(index: Number, value: String): Unit {
                if (sending.value || index < 0 || index >= paramValues.value.length) {
                    return
                }
                paramValues.value[index] = value
            }
            val sendCommand = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (sending.value) {
                            return@w1
                        }
                        if (selectedCommand.value == null) {
                            showAppToast(ShowToastOptions(title = "请选择指令", icon = "none"))
                            return@w1
                        }
                        if (paramConfigError.value != "") {
                            showAppToast(ShowToastOptions(title = paramConfigError.value, icon = "none"))
                            return@w1
                        }
                        if (!isFormValid.value) {
                            showAppToast(ShowToastOptions(title = "请填写所有参数", icon = "none"))
                            return@w1
                        }
                        val command = selectedCommand.value!!
                        var cmdData = (command["params"] as String?) ?: ""
                        run {
                            var index: Number = 0
                            while(index < paramConfigs.value.length){
                                val config = paramConfigs.value[index]
                                val configuredPlaceholder = config["placeholder"] as String?
                                val placeholder = if (configuredPlaceholder != null && configuredPlaceholder.length > 0) {
                                    configuredPlaceholder
                                } else {
                                    "\${param" + (index + 1).toString(10) + "}"
                                }
                                cmdData = cmdData.split(placeholder).join(paramValues.value[index])
                                index++
                            }
                        }
                        try {
                            sending.value = true
                            val response = await(sendCmd(_uO("imei" to imei.value, "type" to ((command["cmdCode"] as String?) ?: ""), "password" to null, "cmdData" to UTSAndroid.consoleDebugError(encodeURIComponent(cmdData), " at pages/cmd/cmd.uvue:285"), "predictCmdId" to command["predictCmdId"])))
                            if (response.code == 200) {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "指令发送成功"
                                }, icon = "success"))
                            } else {
                                showAppToast(ShowToastOptions(title = if (response.msg != "") {
                                    response.msg
                                } else {
                                    "指令发送失败"
                                }
                                , icon = "none", duration = 3000))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("发送指令出错:", error, " at pages/cmd/cmd.uvue:294")
                            showAppToast(ShowToastOptions(title = "网络错误", icon = "none"))
                        }
                         finally {
                            sending.value = false
                        }
                })
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_input = resolveEasyComponent("i-input", GenUniModulesIUiXComponentsIInputIInputClass)
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "container"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "指令", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("view", _uM("class" to "device-info"), _uA(
                            _cE("text", _uM("class" to "device-label"), "设备ID: " + _tD(imei.value), 1)
                        )),
                        _cE("view", _uM("class" to "section"), _uA(
                            _cE("text", _uM("class" to "section-title"), "指令类型"),
                            _cE("view", _uM("class" to "type-container"), _uA(
                                _cE("view", _uM("class" to "type-list"), _uA(
                                    _cE(Fragment, null, RenderHelpers.renderList(commandTypes.value, fun(type, index, __index, _cached): Any {
                                        return _cE("view", _uM("key" to type["cmdmId"], "class" to _nC(_uA(
                                            "type-item",
                                            _uM("active" to (selectedTypeId.value == type["cmdmId"]))
                                        )), "onClick" to fun(){
                                            selectTypeByItem(type)
                                        }
                                        ), _uA(
                                            _cE("text", _uM("class" to "type-name", "style" to _nS(_uM("color" to if (selectedTypeId.value == type["cmdmId"]) {
                                                "#ffffff"
                                            } else {
                                                "#666666"
                                            }
                                            ))), _tD(type["cmdName"]), 5)
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
                                        return _cE("view", _uM("key" to cmd["predictCmdId"], "class" to _nC(_uA(
                                            "command-item",
                                            _uM("active" to (selectedCommandId.value == cmd["predictCmdId"]))
                                        )), "onClick" to fun(){
                                            selectCommand(cmd)
                                        }), _uA(
                                            _cE("text", _uM("class" to "command-name"), _tD(cmd["cmdName"]), 1),
                                            _cE("text", _uM("class" to "command-descr"), _tD(cmd["remarks"]), 1)
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
                        if (selectedCommand.value != null) {
                            _cE("view", _uM("key" to 1, "class" to "section"), _uA(
                                _cE("view", _uM("class" to "param-form"), _uA(
                                    if (paramConfigError.value != "") {
                                        _cE("text", _uM("key" to 0, "class" to "param-error"), _tD(paramConfigError.value), 1)
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    _cE(Fragment, null, RenderHelpers.renderList(paramConfigs.value, fun(param, index, __index, _cached): Any {
                                        return _cE("view", _uM("key" to ("param_" + index), "class" to "param-item"), _uA(
                                            _cE("text", _uM("class" to "param-label"), _tD(getParamLabel(param)), 1),
                                            if (param["type"] == "input") {
                                                _cV(_component_i_input, _uM("key" to 0, "class" to "param-input", "model-value" to getParamValue(index), "onUpdate:modelValue" to fun(`$event`: Any){
                                                    updateParamValueFromEvent(index, `$event`)
                                                }, "placeholder" to ("请输入" + getParamLabel(param)), "placeholder-class" to "placeholder", "border" to "none", "height" to "44px", "font-size" to "15px"), null, 8, _uA(
                                                    "model-value",
                                                    "onUpdate:modelValue",
                                                    "placeholder"
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            },
                                            if (param["type"] == "number") {
                                                _cV(_component_i_input, _uM("key" to 1, "class" to "param-input", "type" to "number", "model-value" to getParamValue(index), "onUpdate:modelValue" to fun(`$event`: Any){
                                                    updateParamValueFromEvent(index, `$event`)
                                                }, "placeholder" to ("请输入" + getParamLabel(param)), "placeholder-class" to "placeholder", "maxlength" to getParamMaxLength(param), "border" to "none", "height" to "44px", "font-size" to "15px"), null, 8, _uA(
                                                    "model-value",
                                                    "onUpdate:modelValue",
                                                    "placeholder",
                                                    "maxlength"
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            },
                                            if (param["type"] == "radio") {
                                                _cE("view", _uM("key" to 2, "class" to "radio-group"), _uA(
                                                    _cE(Fragment, null, RenderHelpers.renderList(getRadioItems(param), fun(item, __key, __index, _cached): Any {
                                                        return _cE("view", _uM("key" to ("radio_" + item["value"]), "class" to "radio-item", "onClick" to fun(){
                                                            selectRadio(index, getRadioValue(item))
                                                        }), _uA(
                                                            _cE("view", _uM("class" to "radio-icon"), _uA(
                                                                _cE("view", _uM("class" to _nC(_uA(
                                                                    "radio-inner",
                                                                    _uM("checked" to (getParamValue(index) == getRadioValue(item)))
                                                                ))), null, 2)
                                                            )),
                                                            _cE("text", _uM("class" to "radio-label"), _tD(getRadioDescription(item)), 1)
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
                                    if (isTrue(paramConfigs.value.length == 0 && paramConfigError.value == "")) {
                                        _cE("text", _uM("key" to 1, "class" to "no-param-tip"), "该指令无需填写参数")
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    _cV(_component_i_button, _uM("type" to "primary", "text" to "发送指令", "class" to "submit-btn", "loading" to sending.value, "disabled" to (sending.value || loading.value || !isFormValid.value), "onClick" to sendCommand), null, 8, _uA(
                                        "loading",
                                        "disabled"
                                    ))
                                ))
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        if (isTrue(!isTruthy(selectedTypeId.value))) {
                            _cE("view", _uM("key" to 2, "class" to "empty-state"), _uA(
                                _cE("text", _uM("class" to "empty-text"), "请先选择指令类型")
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        if (isTrue(loading.value)) {
                            _cE("view", _uM("key" to 3, "class" to "loading"), _uA(
                                _cE("text", _uM("class" to "loading-text"), "加载中...")
                            ))
                        } else {
                            if (isTrue(commands.value.length == 0 && selectedTypeId.value != null)) {
                                _cE("view", _uM("key" to 4, "class" to "empty-state"), _uA(
                                    _cE("text", _uM("class" to "empty-text"), "暂无指令")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        }
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
                return _uM("container" to _pS(_uM("backgroundColor" to "#f5f5f5", "display" to "flex", "flexDirection" to "column", "paddingBottom" to "30rpx")), "device-info" to _pS(_uM("backgroundImage" to "none", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to "30rpx", "marginLeft" to "20rpx", "display" to "flex", "alignItems" to "center")), "section" to _pS(_uM("backgroundImage" to "none", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to "30rpx", "marginLeft" to "20rpx")), "device-label" to _pS(_uM("fontSize" to "28rpx", "color" to "#666666", "whiteSpace" to "nowrap")), "section-title" to _pS(_uM("fontSize" to "32rpx", "fontWeight" to "bold", "color" to "#333333", "marginBottom" to "20rpx")), "type-list" to _pS(_uM("display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap", "alignItems" to "center")), "type-item" to _uM("" to _uM("marginRight" to "20rpx", "marginBottom" to "20rpx", "paddingTop" to "15rpx", "paddingRight" to "30rpx", "paddingBottom" to "15rpx", "paddingLeft" to "30rpx", "backgroundImage" to "none", "backgroundColor" to "#f0f0f0", "borderTopLeftRadius" to "50rpx", "borderTopRightRadius" to "50rpx", "borderBottomRightRadius" to "50rpx", "borderBottomLeftRadius" to "50rpx"), ".active" to _uM("backgroundImage" to "none", "backgroundColor" to "#007AFF")), "type-name" to _uM(".type-item.active " to _uM("color" to "#ffffff"), "" to _uM("fontSize" to "26rpx", "color" to "#666666", "whiteSpace" to "nowrap")), "command-list" to _pS(_uM("display" to "flex", "flexDirection" to "column")), "command-item" to _uM("" to _uM("width" to "100%", "boxSizing" to "border-box", "paddingTop" to "25rpx", "paddingRight" to "25rpx", "paddingBottom" to "25rpx", "paddingLeft" to "25rpx", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#e0e0e0", "borderRightColor" to "#e0e0e0", "borderBottomColor" to "#e0e0e0", "borderLeftColor" to "#e0e0e0", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx"), ".command-item+" to _uM("marginTop" to "20rpx"), ".active" to _uM("borderTopColor" to "#007AFF", "borderRightColor" to "#007AFF", "borderBottomColor" to "#007AFF", "borderLeftColor" to "#007AFF", "backgroundColor" to "#f0f8ff")), "command-name" to _pS(_uM("fontSize" to "30rpx", "color" to "#333333", "marginBottom" to "10rpx")), "command-descr" to _pS(_uM("fontSize" to "24rpx", "color" to "#999999", "lineHeight" to "36rpx")), "param-form" to _pS(_uM("display" to "flex", "flexDirection" to "column")), "param-item" to _uM("" to _uM("display" to "flex", "flexDirection" to "column"), ".param-item+" to _uM("marginTop" to "30rpx")), "radio-group" to _pS(_uM("display" to "flex", "flexDirection" to "column")), "param-label" to _pS(_uM("marginBottom" to "15rpx", "fontSize" to "28rpx", "color" to "#333333")), "param-input" to _pS(_uM("width" to "100%", "boxSizing" to "border-box", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#e0e0e0", "borderRightColor" to "#e0e0e0", "borderBottomColor" to "#e0e0e0", "borderLeftColor" to "#e0e0e0", "borderTopLeftRadius" to "8rpx", "borderTopRightRadius" to "8rpx", "borderBottomRightRadius" to "8rpx", "borderBottomLeftRadius" to "8rpx", "backgroundImage" to "none", "backgroundColor" to "#ffffff")), "param-error" to _pS(_uM("color" to "#e43d33", "fontSize" to "26rpx", "marginBottom" to "20rpx")), "no-param-tip" to _pS(_uM("color" to "#999999", "fontSize" to "26rpx", "marginBottom" to "20rpx")), "radio-item" to _uM("" to _uM("display" to "flex", "alignItems" to "center"), ".radio-item+" to _uM("marginTop" to "20rpx")), "radio-icon" to _pS(_uM("marginRight" to "20rpx", "width" to "36rpx", "height" to "36rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "borderTopWidth" to "1rpx", "borderRightWidth" to "1rpx", "borderBottomWidth" to "1rpx", "borderLeftWidth" to "1rpx", "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#cccccc", "borderRightColor" to "#cccccc", "borderBottomColor" to "#cccccc", "borderLeftColor" to "#cccccc", "display" to "flex", "alignItems" to "center", "justifyContent" to "center")), "radio-inner" to _uM("" to _uM("width" to "25rpx", "height" to "25rpx", "borderTopLeftRadius" to "50%", "borderTopRightRadius" to "50%", "borderBottomRightRadius" to "50%", "borderBottomLeftRadius" to "50%", "backgroundImage" to "none", "backgroundColor" to "rgba(0,0,0,0)"), ".checked" to _uM("backgroundImage" to "none", "backgroundColor" to "#007AFF")), "radio-label" to _pS(_uM("fontSize" to "26rpx", "color" to "#333333")), "submit-btn" to _pS(_uM("marginTop" to "30rpx")), "empty-state" to _pS(_uM("textAlign" to "center", "paddingTop" to "50rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx", "backgroundImage" to "none", "backgroundColor" to "#ffffff", "marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to "30rpx", "marginLeft" to "20rpx")), "loading" to _pS(_uM("textAlign" to "center", "paddingTop" to "50rpx", "paddingRight" to "20rpx", "paddingBottom" to "50rpx", "paddingLeft" to "20rpx", "backgroundImage" to "none", "backgroundColor" to "#ffffff", "marginTop" to 0, "marginRight" to "20rpx", "marginBottom" to "30rpx", "marginLeft" to "20rpx")), "placeholder" to _pS(_uM("color" to "#cccccc")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
