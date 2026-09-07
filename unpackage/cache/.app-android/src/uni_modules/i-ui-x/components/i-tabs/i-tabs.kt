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
open class GenUniModulesIUiXComponentsITabsITabs : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var value: Any by `$props`
    open var current: Number by `$props`
    open var list: UTSArray<Any?>? by `$props`
    open var items: UTSArray<Any?>? by `$props`
    open var scrollable: Boolean by `$props`
    open var activeColor: String by `$props`
    open var inactiveColor: String by `$props`
    open var bgColor: String by `$props`
    open var lineWidth: Any by `$props`
    open var lineHeight: Any by `$props`
    open var fontSize: Any by `$props`
    open var itemWidth: Any by `$props`
    open var showBar: Boolean by `$props`
    open var disabled: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsITabsITabs) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsITabsITabs
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            fun gen_formatSize_fn(value: Any): String {
                val text = value.toString()
                if (text == "auto" || text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
                    return text
                }
                return text + "px"
            }
            val formatSize = ::gen_formatSize_fn
            fun gen_numericSize_fn(value: Any): Number {
                val text = value.toString()
                val numberValue = parseFloat(text.replace("px", "").replace("rpx", "").replace("%", "").toString())
                if (isNaN(numberValue)) {
                    return 0
                }
                return numberValue
            }
            val numericSize = ::gen_numericSize_fn
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val list = computed(fun(): UTSArray<Any?> {
                val source = props.list
                if (source != null && source.length > 0) {
                    return source
                }
                val items = props.items
                if (items != null) {
                    return items
                }
                val empty: UTSArray<Any?> = _uA()
                return empty
            }
            )
            fun gen_itemValue_fn(item: Any?, keyName: String): String {
                if (item == null) {
                    return ""
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    val value = (item as UTSJSONObject)[keyName]
                    if (value == null) {
                        return ""
                    }
                    return value.toString()
                }
                if (keyName == "name" || keyName == "text" || keyName == "value") {
                    return item.toString()
                }
                return ""
            }
            val itemValue = ::gen_itemValue_fn
            fun gen_getItemName_fn(item: Any?): String {
                val name = itemValue(item, "name")
                if (name.length > 0) {
                    return name
                }
                return itemValue(item, "text")
            }
            val getItemName = ::gen_getItemName_fn
            fun gen_getItemValue_fn(item: Any?): String {
                val value = itemValue(item, "value")
                if (value.length > 0) {
                    return value
                }
                return getItemName(item)
            }
            val getItemValue = ::gen_getItemValue_fn
            fun gen_resolveIndex_fn(): Number {
                if (props.current >= 0) {
                    return props.current
                }
                val expected = props.value.toString()
                run {
                    var i: Number = 0
                    while(i < list.value.length){
                        val item = list.value[i]
                        if (getItemValue(item) == expected || getItemName(item) == expected) {
                            return i
                        }
                        i++
                    }
                }
                return 0
            }
            val resolveIndex = ::gen_resolveIndex_fn
            val currentIndex = ref(resolveIndex())
            val scrollIntoView = ref("i-tabs-item-" + currentIndex.value.toString(10))
            fun gen_resolveScrollableItemWidth_fn(): Number {
                val size = numericSize(props.itemWidth)
                if (size > 0) {
                    return size
                }
                return 92
            }
            val resolveScrollableItemWidth = ::gen_resolveScrollableItemWidth_fn
            val navStyle = computed(fun(): String {
                if (!props.scrollable) {
                    return ""
                }
                return "width:" + (resolveScrollableItemWidth() * list.value.length).toString(10) + "px;"
            }
            )
            fun gen_getItemStyle_fn(index: Number): String {
                if (props.scrollable) {
                    return "width:" + resolveScrollableItemWidth().toString(10) + "px;"
                }
                val width = formatSize(props.itemWidth)
                if (width == "auto") {
                    return ""
                }
                return "width:" + width + ";"
            }
            val getItemStyle = ::gen_getItemStyle_fn
            val barStyle = computed(fun(): String {
                return ("width:" + formatSize(props.lineWidth) + ";height:" + formatSize(props.lineHeight) + ";background-color:" + props.activeColor + ";")
            }
            )
            watch(fun(): Any {
                return props.value
            }
            , fun(): Unit {
                currentIndex.value = resolveIndex()
                scrollIntoView.value = "i-tabs-item-" + currentIndex.value.toString(10)
            }
            )
            watch(fun(): Number {
                return props.current
            }
            , fun(): Unit {
                currentIndex.value = resolveIndex()
                scrollIntoView.value = "i-tabs-item-" + currentIndex.value.toString(10)
            }
            )
            fun gen_isItemDisabled_fn(item: Any?): Boolean {
                if (item == null) {
                    return false
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    return (item as UTSJSONObject)["disabled"] == true
                }
                return false
            }
            val isItemDisabled = ::gen_isItemDisabled_fn
            fun gen_isItemDot_fn(item: Any?): Boolean {
                if (item == null) {
                    return false
                }
                if (UTSAndroid.`typeof`(item) == "object") {
                    return (item as UTSJSONObject)["dot"] == true
                }
                return false
            }
            val isItemDot = ::gen_isItemDot_fn
            fun gen_getItemBadge_fn(item: Any?): String {
                return itemValue(item, "badge")
            }
            val getItemBadge = ::gen_getItemBadge_fn
            fun gen_buildPayload_fn(item: Any?, index: Number): UTSJSONObject {
                return _uO("index" to index, "name" to getItemName(item), "value" to getItemValue(item), "item" to item)
            }
            val buildPayload = ::gen_buildPayload_fn
            fun gen_getItemClass_fn(item: Any?, index: Number): String {
                var className = if (currentIndex.value == index) {
                    "i-tabs__item i-tabs__item--active"
                } else {
                    "i-tabs__item"
                }
                if (isItemDisabled(item)) {
                    className += " i-tabs__item--disabled"
                }
                return className
            }
            val getItemClass = ::gen_getItemClass_fn
            fun gen_getTextStyle_fn(item: Any?, index: Number): String {
                val color = if (currentIndex.value == index) {
                    props.activeColor
                } else {
                    props.inactiveColor
                }
                val realColor = if (isItemDisabled(item)) {
                    "#c8c9cc"
                } else {
                    color
                }
                return "font-size:" + formatSize(props.fontSize) + ";color:" + realColor + ";"
            }
            val getTextStyle = ::gen_getTextStyle_fn
            fun gen_select_fn(item: Any?, index: Number): Unit {
                if (props.disabled || isItemDisabled(item)) {
                    return
                }
                val payload = buildPayload(item, index)
                emit("click", payload)
                if (currentIndex.value == index) {
                    return
                }
                currentIndex.value = index
                scrollIntoView.value = "i-tabs-item-" + index.toString(10)
                emit("select", payload)
                emit("change", payload)
                emit("update:value", payload["value"])
                emit("update:current", index)
            }
            val select = ::gen_select_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to "i-tabs", "style" to _nS("background-color:" + bgColor.value)), _uA(
                    _cE("scroll-view", _uM("scroll-x" to _ctx.scrollable, "class" to "i-tabs__scroll", "scroll-into-view" to scrollIntoView.value, "scroll-with-animation" to true, "show-scrollbar" to false), _uA(
                        _cE("view", _uM("class" to "i-tabs__nav", "style" to _nS(navStyle.value)), _uA(
                            _cE(Fragment, null, RenderHelpers.renderList(list.value, fun(item, index, __index, _cached): Any {
                                return _cE("view", _uM("id" to ("i-tabs-item-" + index.toString(10)), "key" to (index.toString(10) + "-" + getItemName(item)), "class" to _nC(getItemClass(item, index)), "style" to _nS(getItemStyle(index)), "onClick" to fun(){
                                    select(item, index)
                                }
                                ), _uA(
                                    _cE("view", _uM("class" to "i-tabs__text-wrap"), _uA(
                                        _cE("text", _uM("class" to _nC(if (currentIndex.value == index) {
                                            "i-tabs__text i-tabs__text--active"
                                        } else {
                                            "i-tabs__text"
                                        }
                                        ), "style" to _nS(getTextStyle(item, index))), _tD(getItemName(item)), 7),
                                        if (getItemBadge(item).length > 0) {
                                            _cE("view", _uM("key" to 0, "class" to "i-tabs__badge"), _uA(
                                                _cE("text", _uM("class" to "i-tabs__badge-text"), _tD(getItemBadge(item)), 1)
                                            ))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                        ,
                                        if (isTrue(isItemDot(item))) {
                                            _cE("view", _uM("key" to 1, "class" to "i-tabs__dot"))
                                        } else {
                                            _cC("v-if", true)
                                        }
                                    )),
                                    if (isTrue(_ctx.showBar && currentIndex.value == index)) {
                                        _cE("view", _uM("key" to 0, "class" to "i-tabs__bar", "style" to _nS(barStyle.value)), null, 4)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ), 14, _uA(
                                    "id",
                                    "onClick"
                                ))
                            }
                            ), 128)
                        ), 4)
                    ), 8, _uA(
                        "scroll-x",
                        "scroll-into-view"
                    )),
                    renderSlot(_ctx.`$slots`, "default")
                ), 4)
            }
        }
        var name = "i-tabs"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-tabs" to _pS(_uM("borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "overflow" to "hidden")), "i-tabs__scroll" to _pS(_uM("width" to "100%")), "i-tabs__nav" to _pS(_uM("minHeight" to 44, "flexDirection" to "row", "alignItems" to "center")), "i-tabs__item" to _pS(_uM("minWidth" to 72, "minHeight" to 44, "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16, "alignItems" to "center", "justifyContent" to "center", "boxSizing" to "border-box", "overflow" to "visible")), "i-tabs__item--active" to _pS(_uM("backgroundColor" to "#ffffff")), "i-tabs__item--disabled" to _pS(_uM("opacity" to 0.55)), "i-tabs__text-wrap" to _pS(_uM("position" to "relative", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "center", "overflow" to "visible")), "i-tabs__text" to _pS(_uM("color" to "#606266", "lineHeight" to "20px")), "i-tabs__text--active" to _pS(_uM("color" to "#2979ff", "fontWeight" to 600)), "i-tabs__bar" to _pS(_uM("marginTop" to 5, "borderTopLeftRadius" to 999, "borderTopRightRadius" to 999, "borderBottomRightRadius" to 999, "borderBottomLeftRadius" to 999)), "i-tabs__badge" to _pS(_uM("position" to "absolute", "right" to -20, "top" to -9, "minWidth" to 16, "height" to 16, "paddingTop" to 0, "paddingRight" to 4, "paddingBottom" to 0, "paddingLeft" to 4, "borderTopLeftRadius" to 8, "borderTopRightRadius" to 8, "borderBottomRightRadius" to 8, "borderBottomLeftRadius" to 8, "backgroundColor" to "#f56c6c", "alignItems" to "center", "justifyContent" to "center", "boxSizing" to "border-box")), "i-tabs__badge-text" to _pS(_uM("color" to "#ffffff", "fontSize" to 10, "lineHeight" to "14px")), "i-tabs__dot" to _pS(_uM("position" to "absolute", "right" to -9, "top" to -5, "width" to 7, "height" to 7, "borderTopLeftRadius" to 4, "borderTopRightRadius" to 4, "borderBottomRightRadius" to 4, "borderBottomLeftRadius" to 4, "backgroundColor" to "#f56c6c")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("click" to null, "change" to null, "select" to null, "update:value" to null, "update:current" to null)
        var props = _nP(_uM("value" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to ""), "current" to _uM("type" to "Number", "default" to -1), "list" to _uM("type" to "Array", "default" to fun(): UTSArray<Any?> {
            return _uA()
        }
        ), "items" to _uM("type" to "Array", "default" to fun(): UTSArray<String> {
            return _uA(
                "关注",
                "推荐",
                "热榜",
                "本地"
            )
        }
        ), "scrollable" to _uM("type" to "Boolean", "default" to false), "activeColor" to _uM("type" to "String", "default" to "#2979ff"), "inactiveColor" to _uM("type" to "String", "default" to "#606266"), "bgColor" to _uM("type" to "String", "default" to "#ffffff"), "lineWidth" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "24"), "lineHeight" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "3"), "fontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "14"), "itemWidth" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "auto"), "showBar" to _uM("type" to "Boolean", "default" to true), "disabled" to _uM("type" to "Boolean", "default" to false)))
        var propsNeedCastKeys = _uA(
            "value",
            "current",
            "scrollable",
            "activeColor",
            "inactiveColor",
            "bgColor",
            "lineWidth",
            "lineHeight",
            "fontSize",
            "itemWidth",
            "showBar",
            "disabled"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
