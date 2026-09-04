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
            fun gen_objectText_fn(kObject: UTSJSONObject, keyName: String): String {
                val value = kObject[keyName]
                return if (value == null) {
                    ""
                } else {
                    value.toString()
                }
            }
            val objectText = ::gen_objectText_fn
            fun gen_normalizeField_fn(raw: Any?): IFormField? {
                if (raw == null || UTSAndroid.`typeof`(raw) != "object") {
                    return null
                }
                val kObject = raw as UTSJSONObject
                val value = kObject["value"]
                return IFormField(name = objectText(kObject, "name"), label = objectText(kObject, "label"), value = value, hasValue = value != null, required = kObject["required"] == true, message = objectText(kObject, "message"))
            }
            val normalizeField = ::gen_normalizeField_fn
            fun gen_normalizeFields_fn(value: UTSArray<Any?>?): UTSArray<IFormField> {
                val result: UTSArray<IFormField> = _uA()
                if (value == null) {
                    return result
                }
                run {
                    var i: Number = 0
                    while(i < value.length){
                        val field = normalizeField(value[i])
                        if (field != null) {
                            result.push(field)
                        }
                        i++
                    }
                }
                return result
            }
            val normalizeFields = ::gen_normalizeFields_fn
            fun gen_activeFields_fn(): UTSArray<IFormField> {
                val fields = normalizeFields(props.fields)
                if (fields.length > 0) {
                    return fields
                }
                return normalizeFields(props.rules)
            }
            val activeFields = ::gen_activeFields_fn
            fun gen_modelFieldValue_fn(name: String): Any? {
                val model = props.modelValue
                if (model == null || UTSAndroid.`typeof`(model) != "object") {
                    return null
                }
                return (model as UTSJSONObject)[name]
            }
            val modelFieldValue = ::gen_modelFieldValue_fn
            fun gen_fieldValue_fn(item: IFormField): Any {
                val configuredValue = item.value
                if (item.hasValue && configuredValue != null) {
                    return configuredValue
                }
                if (item.name.length == 0) {
                    return ""
                }
                val value = modelFieldValue(item.name)
                return if (value == null) {
                    ""
                } else {
                    value
                }
            }
            val fieldValue = ::gen_fieldValue_fn
            fun gen_fieldLabel_fn(item: IFormField): String {
                val label = if (item.label.length > 0) {
                    item.label
                } else {
                    item.name
                }
                return if (label.length > 0) {
                    label
                } else {
                    "字段"
                }
            }
            val fieldLabel = ::gen_fieldLabel_fn
            fun gen_fieldMessage_fn(item: IFormField): String {
                if (item.message.length > 0) {
                    return item.message
                }
                return fieldLabel(item) + "不能为空"
            }
            val fieldMessage = ::gen_fieldMessage_fn
            fun gen_checkField_fn(item: IFormField, selectedKeys: UTSArray<String>): String {
                if (selectedKeys.length > 0 && selectedKeys.indexOf(item.name) < 0) {
                    return ""
                }
                val value = fieldValue(item)
                if (item.required && value.toString().length == 0) {
                    return fieldMessage(item)
                }
                return ""
            }
            val checkField = ::gen_checkField_fn
            fun gen_collectValues_fn(): UTSJSONObject {
                val values: UTSJSONObject = _uO()
                val list = activeFields()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i]
                        if (item.name.length > 0) {
                            values[item.name] = fieldValue(item)
                        }
                        i++
                    }
                }
                return values
            }
            val collectValues = ::gen_collectValues_fn
            fun gen_normalizeIdName_fn(name: String): String {
                val allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
                var result = ""
                run {
                    var i: Number = 0
                    while(i < name.length){
                        val char = name.charAt(i)
                        result += if (allowed.indexOf(char) >= 0) {
                            char
                        } else {
                            "-"
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
            val valid = ref(true)
            val message = ref("")
            val errors = ref(_uA<IFormError>())
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
            fun gen_scrollToFirstError_fn(nextErrors: UTSArray<IFormError>): Unit {
                if (!props.errorAutoPage || nextErrors.length == 0) {
                    return
                }
                val field = nextErrors[0].field
                if (field.length == 0) {
                    return
                }
                val targetId = scrollTargetId(field)
                val selector = "#" + targetId
                val offsetTop = parseFloat(props.scrollOffsetTop.toString())
                val duration = parseFloat(props.scrollDuration.toString())
                val payload = IFormScrollPayload(field = field, targetId = targetId, selector = selector, offsetTop = offsetTop, duration = duration)
                emit("scroll-to-error", payload)
                nextTick(fun(): Unit {
                    uni_pageScrollTo(PageScrollToOptions(selector = selector, offsetTop = offsetTop, duration = duration))
                }
                )
            }
            val scrollToFirstError = ::gen_scrollToFirstError_fn
            fun gen_validateFields_fn(selectedKeys: UTSArray<String>, silent: Boolean): Boolean {
                val list = activeFields()
                val nextErrors: UTSArray<IFormError> = _uA()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i]
                        val errorMessage = checkField(item, selectedKeys)
                        if (errorMessage.length > 0) {
                            val error = IFormError(field = item.name, message = errorMessage)
                            nextErrors.push(error)
                        }
                        i++
                    }
                }
                errors.value = nextErrors
                valid.value = nextErrors.length == 0
                if (!silent) {
                    message.value = if (valid.value) {
                        "校验通过"
                    } else {
                        nextErrors[0].message.toString()
                    }
                    val payload = IFormValidatePayload(valid = valid.value, message = message.value, errors = nextErrors, values = collectValues())
                    emit("validate", payload)
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
                return validateFields(_uA(), false)
            }
            val validate = ::gen_validate_fn
            fun gen_validFields_fn(keys: UTSArray<String>): Boolean {
                return validateFields(keys, false)
            }
            val validFields = ::gen_validFields_fn
            fun gen_checkAsyncVaildStatus_fn(): Boolean {
                return validateFields(_uA(), true)
            }
            val checkAsyncVaildStatus = ::gen_checkAsyncVaildStatus_fn
            fun gen_clearValid_fn(): Unit {
                valid.value = true
                message.value = ""
                errors.value = _uA()
                emit("update:modelValid", true)
                emit("update:valid", true)
            }
            val clearValid = ::gen_clearValid_fn
            fun gen_submit_fn(): Unit {
                val isValid = validate()
                val result = IFormSubmitPayload(valid = isValid, values = collectValues(), errors = errors.value, message = message.value)
                emit("submit", result)
            }
            val submit = ::gen_submit_fn
            fun gen_reset_fn(): Unit {
                clearValid()
                val payload = IFormResetPayload(values = collectValues())
                emit("reset", payload)
            }
            val reset = ::gen_reset_fn
            watch(fun(): UTSArray<Any?>? {
                return props.fields
            }
            , fun(): Unit {
                if (props.watchValidStatus) {
                    validateFields(_uA(), true)
                }
            }
            , WatchOptions(deep = true))
            watch(fun(): UTSArray<Any?>? {
                return props.rules
            }
            , fun(): Unit {
                if (props.watchValidStatus) {
                    validateFields(_uA(), true)
                }
            }
            , WatchOptions(deep = true))
            watch(fun(): Any? {
                return props.modelValue
            }
            , fun(): Unit {
                if (props.watchValidStatus) {
                    validateFields(_uA(), true)
                }
            }
            , WatchOptions(deep = true))
            watch(fun(): Boolean {
                return props.watchValidStatus
            }
            , fun(value: Boolean): Unit {
                if (value) {
                    validateFields(_uA(), true)
                }
            }
            )
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
