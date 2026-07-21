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
import io.dcloud.uniapp.extapi.pageScrollTo as uni_pageScrollTo
open class GenUniModulesIUiXComponentsIFormIForm : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var modelValue: Any? by `$props`
    open var fields: UTSArray<Any?>? by `$props`
    open var rules: UTSArray<Any?>? by `$props`
    open var showActions: Boolean by `$props`
    open var submitText: String by `$props`
    open var resetText: String by `$props`
    open var labelDirection: String by `$props`
    open var errorAlign: String by `$props`
    open var errorAutoPage: Boolean by `$props`
    open var scrollOffsetTop: Any by `$props`
    open var scrollDuration: Any by `$props`
    open var scrollIdPrefix: String by `$props`
    open var watchValidStatus: Boolean by `$props`
    open var modelValid: Boolean by `$props`
    open var valid: (keys: UTSArray<String>) -> Boolean
        get() {
            return unref(this.`$exposed`["valid"]) as (keys: UTSArray<String>) -> Boolean
        }
        set(value) {
            setRefValue(this.`$exposed`, "valid", value)
        }
    open var validate: () -> Boolean
        get() {
            return unref(this.`$exposed`["validate"]) as () -> Boolean
        }
        set(value) {
            setRefValue(this.`$exposed`, "validate", value)
        }
    open var clearValid: () -> Unit
        get() {
            return unref(this.`$exposed`["clearValid"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "clearValid", value)
        }
    open var checkAsyncVaildStatus: () -> Boolean
        get() {
            return unref(this.`$exposed`["checkAsyncVaildStatus"]) as () -> Boolean
        }
        set(value) {
            setRefValue(this.`$exposed`, "checkAsyncVaildStatus", value)
        }
    open var submit: () -> Unit
        get() {
            return unref(this.`$exposed`["submit"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "submit", value)
        }
    open var reset: () -> Unit
        get() {
            return unref(this.`$exposed`["reset"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "reset", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIFormIForm, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIFormIForm
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val valid = ref<Boolean>(true)
            val message = ref<String>("")
            val errors = ref(_uA<UTSJSONObject>())
            val formClass = computed(fun(): String {
                val classes = _uA(
                    "i-form"
                )
                if (props.labelDirection == "vertical") {
                    classes.push("i-form--vertical")
                }
                return classes.join(" ")
            }
            )
            val messageClass = computed(fun(): String {
                return if (valid.value) {
                    "i-form__message i-form__message--success"
                } else {
                    "i-form__message i-form__message--error"
                }
            }
            )
            val messageStyle = computed(fun(): String {
                return "text-align:" + props.errorAlign + ";"
            }
            )
            fun gen_valueText_fn(value: Any): String {
                if (UTSAndroid.`typeof`(value) == "string") {
                    return value as String
                }
                if (UTSAndroid.`typeof`(value) == "number" || UTSAndroid.`typeof`(value) == "boolean") {
                    return (value as Any).toString()
                }
                if (UTSArray.isArray(value)) {
                    val list = value as UTSArray<Any>
                    return list.join(",")
                }
                if (value != null && UTSAndroid.`typeof`(value) == "object") {
                    return "[object Object]"
                }
                return ""
            }
            val valueText = ::gen_valueText_fn
            fun gen_activeFields_fn(): UTSArray<UTSJSONObject> {
                val fields = props.fields
                if (fields != null && fields.length > 0) {
                    return fields as UTSArray<UTSJSONObject>
                }
                val rules = props.rules
                if (rules != null) {
                    return rules as UTSArray<UTSJSONObject>
                }
                return _uA<UTSJSONObject>()
            }
            val activeFields = ::gen_activeFields_fn
            fun gen_fieldValue_fn(item: UTSJSONObject): Any {
                val configuredValue = item["value"]
                if (configuredValue != null) {
                    return configuredValue
                }
                val name = item.getString("name", "")
                if (name.length == 0) {
                    return ""
                }
                val values = props.modelValue as UTSJSONObject?
                if (values != null) {
                    val modelValue = values[name]
                    if (modelValue != null) {
                        return modelValue as Any
                    }
                }
                return ""
            }
            val fieldValue = ::gen_fieldValue_fn
            fun gen_fieldLabel_fn(item: UTSJSONObject): String {
                val label = item.getString("label", item.getString("name", ""))
                return if (label.length > 0) {
                    label
                } else {
                    "字段"
                }
            }
            val fieldLabel = ::gen_fieldLabel_fn
            fun gen_fieldRequired_fn(item: UTSJSONObject): Boolean {
                return item.getBoolean("required", false)
            }
            val fieldRequired = ::gen_fieldRequired_fn
            fun gen_fieldMessage_fn(item: UTSJSONObject): String {
                val customMessage = item.getString("message", "")
                if (customMessage.length > 0) {
                    return customMessage
                }
                return fieldLabel(item) + "不能为空"
            }
            val fieldMessage = ::gen_fieldMessage_fn
            fun gen_checkField_fn(item: UTSJSONObject, selectedKeys: UTSArray<String>): String {
                val name = item.getString("name", "")
                if (selectedKeys.length > 0 && selectedKeys.indexOf(name) < 0) {
                    return ""
                }
                val value = fieldValue(item)
                if (fieldRequired(item) && valueText(value).length == 0) {
                    return fieldMessage(item)
                }
                return ""
            }
            val checkField = ::gen_checkField_fn
            fun gen_collectValues_fn(): UTSJSONObject {
                val values: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("values", "uni_modules/i-ui-x/components/i-form/i-form.uvue", 200, 9))
                val list = activeFields()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i] as UTSJSONObject
                        val name = item.getString("name", "")
                        if (name.length > 0) {
                            values[name] = fieldValue(item)
                        }
                        i++
                    }
                }
                return values
            }
            val collectValues = ::gen_collectValues_fn
            fun numberValue(value: Any): Number {
                if (UTSAndroid.`typeof`(value) == "number") {
                    return value as Number
                }
                return UTSNumber.from(parseFloat(value as String))
            }
            fun gen_normalizeIdName_fn(name: String): String {
                var result = ""
                run {
                    var i: Number = 0
                    while(i < name.length){
                        val char = name.charAt(i)
                        val isNumber = char >= "0" && char <= "9"
                        val isUpper = char >= "A" && char <= "Z"
                        val isLower = char >= "a" && char <= "z"
                        if (isNumber || isUpper || isLower || char == "-" || char == "_") {
                            result = result + char
                        } else {
                            result = result + "-"
                        }
                        i++
                    }
                }
                return result
            }
            val normalizeIdName = ::gen_normalizeIdName_fn
            fun gen_scrollTargetId_fn(name: String): String {
                return props.scrollIdPrefix + normalizeIdName(name)
            }
            val scrollTargetId = ::gen_scrollTargetId_fn
            fun gen_scrollToFirstError_fn(nextErrors: UTSArray<UTSJSONObject>): Unit {
                if (!props.errorAutoPage || nextErrors.length == 0) {
                    return
                }
                val field = nextErrors[0].getString("field", "")
                if (field.length == 0) {
                    return
                }
                val targetId = scrollTargetId(field)
                val selector = "#" + targetId
                val offsetTop = numberValue(props.scrollOffsetTop)
                val duration = numberValue(props.scrollDuration)
                emit("scroll-to-error", _uO("field" to field, "targetId" to targetId, "selector" to selector, "offsetTop" to offsetTop, "duration" to duration))
                nextTick(fun(){
                    uni_pageScrollTo(PageScrollToOptions(selector = selector, offsetTop = offsetTop, duration = duration))
                }
                )
            }
            val scrollToFirstError = ::gen_scrollToFirstError_fn
            fun gen_validateFields_fn(selectedKeys: UTSArray<String>, silent: Boolean): Boolean {
                val list = activeFields()
                val nextErrors = _uA<UTSJSONObject>()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i]
                        val errorMessage = checkField(item, selectedKeys)
                        if (errorMessage.length > 0) {
                            nextErrors.push(_uO("field" to item.getString("name", ""), "message" to errorMessage))
                        }
                        i++
                    }
                }
                errors.value = nextErrors
                valid.value = nextErrors.length == 0
                if (!silent) {
                    if (valid.value) {
                        message.value = "校验通过"
                    } else {
                        val firstError = nextErrors[0]
                        message.value = firstError.getString("message", "")
                    }
                    emit("validate", _uO("valid" to valid.value, "message" to message.value, "errors" to nextErrors, "values" to collectValues()))
                    if (!valid.value) {
                        scrollToFirstError(nextErrors)
                    }
                }
                emit("update:modelValid", valid.value)
                emit("update:valid", valid.value)
                return valid.value
            }
            val validateFields = ::gen_validateFields_fn
            fun gen_validate_fn(): Boolean {
                return validateFields(_uA<String>(), false)
            }
            val validate = ::gen_validate_fn
            fun gen_validFields_fn(keys: UTSArray<String>): Boolean {
                return validateFields(keys, false)
            }
            val validFields = ::gen_validFields_fn
            fun gen_checkAsyncVaildStatus_fn(): Boolean {
                return validateFields(_uA<String>(), true)
            }
            val checkAsyncVaildStatus = ::gen_checkAsyncVaildStatus_fn
            fun gen_clearValid_fn(): Unit {
                valid.value = true
                message.value = ""
                errors.value = _uA<UTSJSONObject>()
                emit("update:modelValid", true)
                emit("update:valid", true)
            }
            val clearValid = ::gen_clearValid_fn
            fun gen_submit_fn(): Unit {
                val isValid = validate()
                val result: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("result", "uni_modules/i-ui-x/components/i-form/i-form.uvue", 316, 9), "valid" to isValid, "values" to collectValues(), "errors" to errors.value, "message" to message.value)
                emit("submit", result)
            }
            val submit = ::gen_submit_fn
            fun gen_reset_fn(): Unit {
                clearValid()
                emit("reset", _uO("values" to collectValues()))
            }
            val reset = ::gen_reset_fn
            watch(fun(): Any {
                return _uA(
                    props.fields,
                    props.rules,
                    props.modelValue,
                    props.watchValidStatus
                )
            }
            , fun(): Unit {
                if (props.watchValidStatus) {
                    validateFields(_uA<String>(), true)
                }
            }
            , WatchOptions(deep = true))
            __expose(_uM("valid" to validFields, "validate" to validate, "clearValid" to clearValid, "checkAsyncVaildStatus" to checkAsyncVaildStatus, "submit" to submit, "reset" to reset))
            return fun(): Any? {
                val _component_i_button = resolveEasyComponent("i-button", GenUniModulesIUiXComponentsIButtonIButtonClass)
                return _cE("view", _uM("class" to _nC(formClass.value)), _uA(
                    renderSlot(_ctx.`$slots`, "default"),
                    if (message.value.length > 0) {
                        _cE("text", _uM("key" to 0, "class" to _nC(messageClass.value), "style" to _nS(messageStyle.value)), _tD(message.value), 7)
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(_ctx.showActions)) {
                        _cE("view", _uM("key" to 1, "class" to "i-form__actions"), _uA(
                            _cV(_component_i_button, _uM("size" to "small", "plain" to "", "onClick" to reset), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _tD(_ctx.resetText)
                                )
                            }), "_" to 1)),
                            _cV(_component_i_button, _uM("size" to "small", "type" to "primary", "onClick" to submit), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                                return _uA(
                                    _tD(_ctx.submitText)
                                )
                            }), "_" to 1))
                        ))
                    } else {
                        _cC("v-if", true)
                    }
                ), 2)
            }
        }
        var name = "i-form"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-form" to _pS(_uM("paddingTop" to 4, "paddingRight" to 0, "paddingBottom" to 4, "paddingLeft" to 0)), "i-form__message" to _pS(_uM("marginTop" to 10, "fontSize" to 13, "lineHeight" to "20px")), "i-form__message--success" to _pS(_uM("color" to "#19be6b")), "i-form__message--error" to _pS(_uM("color" to "#fa3534")), "i-form__actions" to _pS(_uM("marginTop" to 12, "flexDirection" to "row", "justifyContent" to "flex-end")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("submit" to null, "reset" to null, "validate" to null, "scroll-to-error" to null, "update:modelValid" to null, "update:valid" to null)
        var props = _nP(_uM("modelValue" to _uM("default" to fun(): UTSJSONObject {
            return _uO()
        }
        ), "fields" to _uM("type" to "Array", "default" to fun(): UTSArray<Any?> {
            return _uA()
        }
        ), "rules" to _uM("type" to "Array", "default" to fun(): UTSArray<Any?> {
            return _uA()
        }
        ), "showActions" to _uM("type" to "Boolean", "default" to false), "submitText" to _uM("type" to "String", "default" to "提交"), "resetText" to _uM("type" to "String", "default" to "重置"), "labelDirection" to _uM("type" to "String", "default" to "horizontal"), "errorAlign" to _uM("type" to "String", "default" to "left"), "errorAutoPage" to _uM("type" to "Boolean", "default" to true), "scrollOffsetTop" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 12), "scrollDuration" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 300), "scrollIdPrefix" to _uM("type" to "String", "default" to "i-form-item-"), "watchValidStatus" to _uM("type" to "Boolean", "default" to false), "modelValid" to _uM("type" to "Boolean", "default" to false)))
        var propsNeedCastKeys = _uA(
            "showActions",
            "submitText",
            "resetText",
            "labelDirection",
            "errorAlign",
            "errorAutoPage",
            "scrollOffsetTop",
            "scrollDuration",
            "scrollIdPrefix",
            "watchValidStatus",
            "modelValid"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
