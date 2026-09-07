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
open class GenUniModulesIUiXComponentsIActionSheetIActionSheet : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var show: Boolean by `$props`
    open var title: String by `$props`
    open var titleStyle: Any by `$props`
    open var closeable: Boolean by `$props`
    open var description: String by `$props`
    open var actions: UTSArray<Any?>? by `$props`
    open var cancelText: String by `$props`
    open var closeOnClickAction: Boolean by `$props`
    open var safeBottom: Boolean by `$props`
    open var openType: String by `$props`
    open var closeOnMask: Boolean by `$props`
    open var height: Any by `$props`
    open var round: Any by `$props`
    open var lang: String by `$props`
    open var sessionFrom: String by `$props`
    open var sendMessageTitle: String by `$props`
    open var sendMessagePath: String by `$props`
    open var sendMessageImg: String by `$props`
    open var showMessageCard: Boolean by `$props`
    open var appParameter: String by `$props`
    open var customStyle: Any by `$props`
    open var open: () -> Unit
        get() {
            return unref(this.`$exposed`["open"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "open", value)
        }
    open var close: () -> Unit
        get() {
            return unref(this.`$exposed`["close"]) as () -> Unit
        }
        set(value) {
            setRefValue(this.`$exposed`, "close", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIActionSheetIActionSheet, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIActionSheetIActionSheet
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val innerShow = ref(props.show)
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text.length == 0) {
                    return "0px"
                }
                if (text.indexOf("vh") > -1 || text.indexOf("vw") > -1) {
                    val numberValue = parseFloat(text.replace("vh", "").replace("vw", ""))
                    return (if (isNaN(numberValue)) {
                        0
                    } else {
                        numberValue
                    }
                    ) + "px"
                }
                if (text.indexOf("px") > -1 || text.indexOf("rpx") > -1 || text.indexOf("%") > -1) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            val titleStyleText = computed(fun(): String {
                if (UTSAndroid.`typeof`(props.titleStyle) == "string") {
                    return props.titleStyle as String
                }
                return ""
            }
            )
            val panelStyle = computed(fun(): String {
                var style = ""
                style += "border-top-left-radius:" + formatSize(props.round) + ";"
                style += "border-top-right-radius:" + formatSize(props.round) + ";"
                if (props.height.toString().length > 0) {
                    style += "height:" + formatSize(props.height) + ";"
                }
                if (UTSAndroid.`typeof`(props.customStyle) == "string") {
                    style += props.customStyle as String
                }
                return style
            }
            )
            watch(fun(): Boolean {
                return props.show
            }
            , fun(value: Boolean): Unit {
                innerShow.value = value
            }
            )
            fun gen_itemValue_fn(item: Any?, keyName: String): String {
                if (item == null) {
                    return ""
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    val kObject = item as UTSJSONObject
                    val value = kObject[keyName]
                    if (value == null) {
                        return ""
                    }
                    return value.toString()
                }
                if (keyName == "name" || keyName == "value") {
                    return item.toString()
                }
                return ""
            }
            val itemValue = ::gen_itemValue_fn
            fun gen_getActionText_fn(item: Any?): String {
                return itemValue(item, "name")
            }
            val getActionText = ::gen_getActionText_fn
            fun gen_getActionValue_fn(item: Any?): String {
                val value = itemValue(item, "value")
                if (value.length > 0) {
                    return value
                }
                return getActionText(item)
            }
            val getActionValue = ::gen_getActionValue_fn
            fun gen_getSubname_fn(item: Any?): String {
                return itemValue(item, "subname")
            }
            val getSubname = ::gen_getSubname_fn
            fun gen_getActionIcon_fn(item: Any?): String {
                return itemValue(item, "icon")
            }
            val getActionIcon = ::gen_getActionIcon_fn
            fun gen_getActionColor_fn(item: Any?): String {
                val color = itemValue(item, "color")
                if (color.length > 0) {
                    return color
                }
                return "#303133"
            }
            val getActionColor = ::gen_getActionColor_fn
            fun gen_isDisabled_fn(item: Any?): Boolean {
                if (item == null) {
                    return false
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    val kObject = item as UTSJSONObject
                    return kObject["disabled"] == true
                }
                return false
            }
            val isDisabled = ::gen_isDisabled_fn
            fun gen_isLoading_fn(item: Any?): Boolean {
                if (item == null) {
                    return false
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    val kObject = item as UTSJSONObject
                    return kObject["loading"] == true
                }
                return false
            }
            val isLoading = ::gen_isLoading_fn
            fun gen_getItemColor_fn(item: Any?): String {
                if (isDisabled(item)) {
                    return "#b8b8b8"
                }
                return getActionColor(item)
            }
            val getItemColor = ::gen_getItemColor_fn
            fun gen_getActionOpenType_fn(item: Any?): String {
                val itemOpenType = itemValue(item, "openType")
                if (itemOpenType.length > 0) {
                    return itemOpenType
                }
                return props.openType
            }
            val getActionOpenType = ::gen_getActionOpenType_fn
            fun gen_getItemClass_fn(item: Any?): String {
                if (isDisabled(item)) {
                    return "i-action-sheet__item i-action-sheet__item--disabled"
                }
                if (isLoading(item)) {
                    return "i-action-sheet__item i-action-sheet__item--loading"
                }
                return "i-action-sheet__item"
            }
            val getItemClass = ::gen_getItemClass_fn
            fun gen_open_fn() {
                if (innerShow.value) {
                    return
                }
                innerShow.value = true
                emit("update:show", true)
            }
            val open = ::gen_open_fn
            fun gen_closeSilently_fn() {
                if (!innerShow.value) {
                    return
                }
                innerShow.value = false
                emit("update:show", false)
            }
            val closeSilently = ::gen_closeSilently_fn
            fun gen_closeByUser_fn() {
                if (!innerShow.value) {
                    return
                }
                innerShow.value = false
                emit("close")
                emit("update:show", false)
            }
            val closeByUser = ::gen_closeByUser_fn
            fun gen_handleOverlayClick_fn() {
                if (!props.closeOnMask) {
                    return
                }
                closeByUser()
            }
            val handleOverlayClick = ::gen_handleOverlayClick_fn
            fun gen_buildPayload_fn(item: Any?, index: Number): UTSJSONObject {
                return _uO("index" to index, "item" to item, "name" to getActionText(item), "value" to getActionValue(item))
            }
            val buildPayload = ::gen_buildPayload_fn
            fun gen_handleSelect_fn(item: Any?, index: Number) {
                if (isDisabled(item) || isLoading(item)) {
                    return
                }
                emit("select", buildPayload(item, index))
                if (props.closeOnClickAction) {
                    closeSilently()
                }
            }
            val handleSelect = ::gen_handleSelect_fn
            fun gen_handleOpenEvent_fn(name: String, event: Any) {
                emit(name, event)
            }
            val handleOpenEvent = ::gen_handleOpenEvent_fn
            __expose(_uM("open" to open, "close" to closeByUser))
            return fun(): Any? {
                val _component_i_icon = resolveEasyComponent("i-icon", GenUniModulesIUiXComponentsIIconIIconClass)
                return _cE("view", null, _uA(
                    _cE("view", _uM("class" to "i-action-sheet__trigger", "onClick" to open), _uA(
                        renderSlot(_ctx.`$slots`, "trigger", _uO(), fun(): UTSArray<Any> {
                            return _uA(
                                renderSlot(_ctx.`$slots`, "default")
                            )
                        }
                        )
                    )),
                    if (isTrue(innerShow.value)) {
                        _cE("view", _uM("key" to 0, "class" to "i-action-sheet__mask", "onClick" to handleOverlayClick))
                    } else {
                        _cC("v-if", true)
                    }
                    ,
                    if (isTrue(innerShow.value)) {
                        _cE("view", _uM("key" to 1, "class" to "i-action-sheet__panel", "style" to _nS(panelStyle.value)), _uA(
                            if (isTrue(_ctx.closeable)) {
                                _cE("view", _uM("key" to 0, "class" to "i-action-sheet__close", "onClick" to closeByUser), _uA(
                                    _cE("text", _uM("class" to "i-action-sheet__close-text"), "×")
                                ))
                            } else {
                                _cC("v-if", true)
                            },
                            if (isTrue(_ctx.title.length > 0 || _ctx.description.length > 0)) {
                                _cE("view", _uM("key" to 1, "class" to "i-action-sheet__header"), _uA(
                                    if (_ctx.title.length > 0) {
                                        _cE("text", _uM("key" to 0, "class" to "i-action-sheet__title", "style" to _nS(titleStyleText.value)), _tD(_ctx.title), 5)
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (_ctx.description.length > 0) {
                                        _cE("text", _uM("key" to 1, "class" to "i-action-sheet__desc"), _tD(_ctx.description), 1)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            } else {
                                _cC("v-if", true)
                            },
                            _cE("scroll-view", _uM("scroll-y" to "true", "class" to "i-action-sheet__scroll"), _uA(
                                _cE(Fragment, null, RenderHelpers.renderList(_ctx.actions, fun(item, index, __index, _cached): Any {
                                    return _cE("button", _uM("key" to (index.toString() + "-" + getActionText(item)), "class" to _nC(getItemClass(item)), "disabled" to (isDisabled(item) || isLoading(item)), "open-type" to getActionOpenType(item), "app-parameter" to _ctx.appParameter, "lang" to _ctx.lang, "session-from" to _ctx.sessionFrom, "send-message-title" to _ctx.sendMessageTitle, "send-message-path" to _ctx.sendMessagePath, "send-message-img" to _ctx.sendMessageImg, "show-message-card" to _ctx.showMessageCard, "onClick" to fun(){
                                        handleSelect(item, index)
                                    }, "onGetuserinfo" to fun(`$event`: Any){
                                        handleOpenEvent("getuserinfo", `$event`)
                                    }, "onContact" to fun(`$event`: Any){
                                        handleOpenEvent("contact", `$event`)
                                    }, "onGetphonenumber" to fun(`$event`: Any){
                                        handleOpenEvent("getphonenumber", `$event`)
                                    }, "onChooseavatar" to fun(`$event`: Any){
                                        handleOpenEvent("chooseavatar", `$event`)
                                    }, "onError" to fun(`$event`: Any){
                                        handleOpenEvent("error", `$event`)
                                    }, "onLaunchapp" to fun(`$event`: Any){
                                        handleOpenEvent("launchapp", `$event`)
                                    }, "onOpensetting" to fun(`$event`: Any){
                                        handleOpenEvent("opensetting", `$event`)
                                    }), _uA(
                                        _cE("view", _uM("class" to "i-action-sheet__item-inner"), _uA(
                                            _cE("view", _uM("class" to "i-action-sheet__main"), _uA(
                                                if (getActionIcon(item).length > 0) {
                                                    _cV(_component_i_icon, _uM("key" to 0, "class" to "i-action-sheet__icon", "name" to getActionIcon(item), "fontSize" to "17", "color" to getItemColor(item)), null, 8, _uA(
                                                        "name",
                                                        "color"
                                                    ))
                                                } else {
                                                    _cC("v-if", true)
                                                },
                                                _cE("text", _uM("class" to "i-action-sheet__item-text", "style" to _nS("color:" + getItemColor(item))), _tD(getActionText(item)), 5)
                                            )),
                                            if (getSubname(item).length > 0) {
                                                _cE("text", _uM("key" to 0, "class" to "i-action-sheet__subname"), _tD(getSubname(item)), 1)
                                            } else {
                                                _cC("v-if", true)
                                            },
                                            if (isTrue(isLoading(item))) {
                                                _cE("text", _uM("key" to 1, "class" to "i-action-sheet__loading"), " 加载中 ")
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        ))
                                    ), 42, _uA(
                                        "disabled",
                                        "open-type",
                                        "app-parameter",
                                        "lang",
                                        "session-from",
                                        "send-message-title",
                                        "send-message-path",
                                        "send-message-img",
                                        "show-message-card",
                                        "onClick",
                                        "onGetuserinfo",
                                        "onContact",
                                        "onGetphonenumber",
                                        "onChooseavatar",
                                        "onError",
                                        "onLaunchapp",
                                        "onOpensetting"
                                    ))
                                }), 128)
                            )),
                            if (_ctx.cancelText.length > 0) {
                                _cE("view", _uM("key" to 2, "class" to "i-action-sheet__cancel", "onClick" to closeByUser), _uA(
                                    _cE("text", _uM("class" to "i-action-sheet__cancel-text"), _tD(_ctx.cancelText), 1)
                                ))
                            } else {
                                _cC("v-if", true)
                            },
                            if (isTrue(props.safeBottom)) {
                                _cE("view", _uM("key" to 3, "class" to "i-action-sheet__safe-bottom"))
                            } else {
                                _cC("v-if", true)
                            }
                        ), 4)
                    } else {
                        _cC("v-if", true)
                    }
                ))
            }
        }
        var name = "i-action-sheet"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-action-sheet__trigger" to _pS(_uM("flexDirection" to "column")), "i-action-sheet__mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "zIndex" to 99, "backgroundColor" to "rgba(0,0,0,0.45)")), "i-action-sheet__panel" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "bottom" to 0, "zIndex" to 100, "backgroundColor" to "#f7f7f7", "overflow" to "hidden")), "i-action-sheet__close" to _pS(_uM("position" to "absolute", "top" to 10, "right" to 12, "zIndex" to 2, "width" to 32, "height" to 32, "borderTopLeftRadius" to 16, "borderTopRightRadius" to 16, "borderBottomRightRadius" to 16, "borderBottomLeftRadius" to 16, "alignItems" to "center", "justifyContent" to "center")), "i-action-sheet__close-text" to _pS(_uM("color" to "#909193", "fontSize" to 24, "lineHeight" to "28px")), "i-action-sheet__header" to _pS(_uM("minHeight" to 38, "paddingTop" to 8, "paddingRight" to 48, "paddingBottom" to 8, "paddingLeft" to 48, "borderBottomWidth" to 1, "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee", "backgroundColor" to "#ffffff", "alignItems" to "center", "justifyContent" to "center")), "i-action-sheet__title" to _pS(_uM("color" to "#909193", "fontSize" to 14, "fontWeight" to 400, "lineHeight" to "20px", "textAlign" to "center")), "i-action-sheet__desc" to _pS(_uM("marginTop" to 4, "color" to "#909193", "fontSize" to 13, "lineHeight" to "20px", "textAlign" to "center")), "i-action-sheet__scroll" to _pS(_uM("maxHeight" to 320, "backgroundColor" to "#ffffff")), "i-action-sheet__item" to _pS(_uM("minHeight" to 51, "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0, "marginTop" to 0, "marginRight" to 0, "marginBottom" to 0, "marginLeft" to 0, "borderTopLeftRadius" to 0, "borderTopRightRadius" to 0, "borderBottomRightRadius" to 0, "borderBottomLeftRadius" to 0, "backgroundColor" to "#ffffff", "borderTopWidth" to 1, "borderTopStyle" to "solid", "borderTopColor" to "#f2f3f5")), "i-action-sheet__item--disabled" to _pS(_uM("backgroundColor" to "#fafafa", "opacity" to 1)), "i-action-sheet__item--loading" to _pS(_uM("opacity" to 0.72)), "i-action-sheet__item-inner" to _pS(_uM("minHeight" to 51, "paddingTop" to 8, "paddingRight" to 16, "paddingBottom" to 8, "paddingLeft" to 16, "alignItems" to "center", "justifyContent" to "center")), "i-action-sheet__main" to _pS(_uM("flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center")), "i-action-sheet__icon" to _pS(_uM("marginRight" to 6)), "i-action-sheet__item-text" to _pS(_uM("fontSize" to 15, "lineHeight" to "22px", "textAlign" to "center")), "i-action-sheet__subname" to _pS(_uM("marginTop" to 2, "color" to "#909193", "fontSize" to 12, "lineHeight" to "18px", "textAlign" to "center")), "i-action-sheet__loading" to _pS(_uM("marginTop" to 2, "color" to "#909193", "fontSize" to 12, "lineHeight" to "18px")), "i-action-sheet__cancel" to _pS(_uM("minHeight" to 52, "marginTop" to 8, "backgroundColor" to "#ffffff", "alignItems" to "center", "justifyContent" to "center")), "i-action-sheet__cancel-text" to _pS(_uM("color" to "#303133", "fontSize" to 16, "lineHeight" to "22px")), "i-action-sheet__safe-bottom" to _pS(_uM("height" to 12, "backgroundColor" to "#ffffff")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("select" to null, "close" to null, "getuserinfo" to null, "contact" to null, "getphonenumber" to null, "chooseavatar" to null, "error" to null, "launchapp" to null, "opensetting" to null, "update:show" to null)
        var props = _nP(_uM("show" to _uM("type" to "Boolean", "default" to false), "title" to _uM("type" to "String", "default" to ""), "titleStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to ""), "closeable" to _uM("type" to "Boolean", "default" to false), "description" to _uM("type" to "String", "default" to ""), "actions" to _uM("type" to "Array", "default" to fun(): UTSArray<Any?> {
            return _uA()
        }
        ), "cancelText" to _uM("type" to "String", "default" to ""), "closeOnClickAction" to _uM("type" to "Boolean", "default" to true), "safeBottom" to _uM("type" to "Boolean", "default" to true), "openType" to _uM("type" to "String", "default" to ""), "closeOnMask" to _uM("type" to "Boolean", "default" to true), "height" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to 10), "lang" to _uM("type" to "String", "default" to "en"), "sessionFrom" to _uM("type" to "String", "default" to ""), "sendMessageTitle" to _uM("type" to "String", "default" to ""), "sendMessagePath" to _uM("type" to "String", "default" to ""), "sendMessageImg" to _uM("type" to "String", "default" to ""), "showMessageCard" to _uM("type" to "Boolean", "default" to false), "appParameter" to _uM("type" to "String", "default" to ""), "customStyle" to _uM("type" to _uA(
            "String",
            "Object"
        ), "default" to "")))
        var propsNeedCastKeys = _uA(
            "show",
            "title",
            "titleStyle",
            "closeable",
            "description",
            "cancelText",
            "closeOnClickAction",
            "safeBottom",
            "openType",
            "closeOnMask",
            "height",
            "round",
            "lang",
            "sessionFrom",
            "sendMessageTitle",
            "sendMessagePath",
            "sendMessageImg",
            "showMessageCard",
            "appParameter",
            "customStyle"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
