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
    open var valid: (keys) -> Boolean
        get() {
            return unref(this.`$exposed`["valid"]) as (keys) -> Boolean
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
            val valid = ref(true)
            val message = ref("")
            val errors = ref(_uA())
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
            fun gen_activeFields_fn(): UTSArray<*> {
                if (props.fields.length > 0) {
                    return props.fields
                }
                return props.rules
            }
            val activeFields = ::gen_activeFields_fn
            fun gen_fieldValue_fn(item): Any {
                if (item.value != null) {
                    return item.value
                }
                val name = String(if (item.name == null) {
                    ""
                } else {
                    item.name
                }
                )
                if (name.length == 0) {
                    return ""
                }
                val values = props.modelValue
                if (values != null && UTSAndroid.`typeof`(values) == "object" && values[name] != null) {
                    return values[name]
                }
                return ""
            }
            val fieldValue = ::gen_fieldValue_fn
            fun gen_fieldLabel_fn(item): String {
                val label = String(if (item.label == null) {
                    item.name
                } else {
                    item.label
                }
                )
                return if (label.length > 0) {
                    label
                } else {
                    "字段"
                }
            }
            val fieldLabel = ::gen_fieldLabel_fn
            fun gen_fieldRequired_fn(item): Boolean {
                return item.required == true
            }
            val fieldRequired = ::gen_fieldRequired_fn
            fun gen_fieldMessage_fn(item): String {
                val customMessage = String(if (item.message == null) {
                    ""
                } else {
                    item.message
                }
                )
                if (customMessage.length > 0) {
                    return customMessage
                }
                return fieldLabel(item) + "不能为空"
            }
            val fieldMessage = ::gen_fieldMessage_fn
            fun gen_checkField_fn(item, selectedKeys): String {
                val name = String(if (item.name == null) {
                    ""
                } else {
                    item.name
                }
                )
                if (selectedKeys.length > 0 && selectedKeys.indexOf(name) < 0) {
                    return ""
                }
                val value = fieldValue(item)
                if (fieldRequired(item) && String(value).length == 0) {
                    return fieldMessage(item)
                }
                return ""
            }
            val checkField = ::gen_checkField_fn
            fun gen_collectValues_fn(): UTSJSONObject {
                val values: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("values", "uni_modules/i-ui-x/components/i-form/i-form.uvue", 184, 9))
                val list = activeFields()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i]
                        val name = String(if (item.name == null) {
                            ""
                        } else {
                            item.name
                        }
                        )
                        if (name.length > 0) {
                            values[name] = fieldValue(item)
                        }
                        i++
                    }
                }
                return values
            }
            val collectValues = ::gen_collectValues_fn
            fun gen_validateFields_fn(selectedKeys, silent): Boolean {
                val list = activeFields()
                val nextErrors = _uA()
                run {
                    var i: Number = 0
                    while(i < list.length){
                        val item = list[i]
                        val errorMessage = checkField(item, selectedKeys)
                        if (errorMessage.length > 0) {
                            nextErrors.push(_uO("field" to String(if (item.name == null) {
                                ""
                            } else {
                                item.name
                            }
                            ), "message" to errorMessage))
                        }
                        i++
                    }
                }
                errors.value = nextErrors
                valid.value = nextErrors.length == 0
                if (!isTruthy(silent)) {
                    message.value = if (valid.value) {
                        "校验通过"
                    } else {
                        String(nextErrors[0].message)
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
                return validateFields(_uA(), false)
            }
            val validate = ::gen_validate_fn
            fun gen_validFields_fn(keys): Boolean {
                return validateFields(keys, false)
            }
            val validFields = ::gen_validFields_fn
            fun gen_checkAsyncVaildStatus_fn(): Boolean {
                return validateFields(_uA(), true)
            }
            val checkAsyncVaildStatus = ::gen_checkAsyncVaildStatus_fn
            fun gen_clearValid_fn() {
                valid.value = true
                message.value = ""
                errors.value = _uA()
                emit("update:modelValid", true)
                emit("update:valid", true)
            }
            val clearValid = ::gen_clearValid_fn
            fun gen_submit_fn() {
                val isValid = validate()
                val result: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("result", "uni_modules/i-ui-x/components/i-form/i-form.uvue", 246, 9), "valid" to isValid, "values" to collectValues(), "errors" to errors.value, "message" to message.value)
                emit("submit", result)
            }
            val submit = ::gen_submit_fn
            fun gen_reset_fn() {
                clearValid()
                emit("reset", _uO("values" to collectValues()))
            }
            val reset = ::gen_reset_fn
            fun gen_scrollToFirstError_fn(nextErrors) {
                if (!props.errorAutoPage || nextErrors.length == 0) {
                    return
                }
                val field = String(if (nextErrors[0].field == null) {
                    ""
                } else {
                    nextErrors[0].field
                }
                )
                if (field.length == 0) {
                    return
                }
                val targetId = scrollTargetId(field)
                val selector = "#" + targetId
                emit("scroll-to-error", _uO("field" to field, "targetId" to targetId, "selector" to selector, "offsetTop" to Number(props.scrollOffsetTop), "duration" to Number(props.scrollDuration)))
                nextTick(fun(){
                    uni_pageScrollTo(PageScrollToOptions(selector = selector, offsetTop = Number(props.scrollOffsetTop), duration = Number(props.scrollDuration)))
                }
                )
            }
            val scrollToFirstError = ::gen_scrollToFirstError_fn
            fun gen_scrollTargetId_fn(name): String {
                return props.scrollIdPrefix + normalizeIdName(name)
            }
            val scrollTargetId = ::gen_scrollTargetId_fn
            fun gen_normalizeIdName_fn(name): String {
                val text = String(name)
                var result = ""
                run {
                    var i: Number = 0
                    while(i < text.length){
                        val code = text.charCodeAt(i)
                        val char = text.charAt(i)
                        val isNumber = code >= 48 && code <= 57
                        val isUpper = code >= 65 && code <= 90
                        val isLower = code >= 97 && code <= 122
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
            watch(fun(){
                return _uA(
                    props.fields,
                    props.rules,
                    props.modelValue,
                    props.watchValidStatus
                )
            }
            , fun(){
                if (props.watchValidStatus) {
                    validateFields(_uA(), true)
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
