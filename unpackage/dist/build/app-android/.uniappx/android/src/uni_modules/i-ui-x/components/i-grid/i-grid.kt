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
open class GenUniModulesIUiXComponentsIGridIGrid : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var items: UTSArray<Any?>? by `$props`
    open var col: Number by `$props`
    open var itemHeight: Any by `$props`
    open var itemBgColor: String by `$props`
    open var bgColor: String by `$props`
    open var width: String by `$props`
    open var iconColor: String by `$props`
    open var textColor: String by `$props`
    open var fontSize: Any by `$props`
    open var iconSize: Any by `$props`
    open var imageSize: Any by `$props`
    open var showBorder: Boolean by `$props`
    open var borderColor: String by `$props`
    open var round: Any by `$props`
    open var isLink: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesIUiXComponentsIGridIGrid) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesIUiXComponentsIGridIGrid
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            fun gen_valueText_fn(value: Any): String {
                if (UTSAndroid.`typeof`(value) == "string") {
                    return value as String
                }
                if (UTSAndroid.`typeof`(value) == "number" || UTSAndroid.`typeof`(value) == "boolean") {
                    return (value as Any).toString()
                }
                return ""
            }
            val valueText = ::gen_valueText_fn
            fun formatSize(value: Any): String {
                val text = value.toString()
                if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0 || text == "auto") {
                    return text
                }
                return text + "px"
            }
            fun gen_itemValue_fn(item: Any, keyName: String): String {
                if (item == null || UTSAndroid.`typeof`(item) != "object") {
                    return ""
                }
                val values = item as UTSJSONObject
                val value = values[keyName]
                if (value == null) {
                    return ""
                }
                return valueText(value as Any)
            }
            val itemValue = ::gen_itemValue_fn
            fun gen_getItemText_fn(item: Any): String {
                val text = itemValue(item, "text")
                if (text.length > 0) {
                    return text
                }
                return valueText(item)
            }
            val getItemText = ::gen_getItemText_fn
            fun gen_getItemIcon_fn(item: Any): String {
                return itemValue(item, "icon")
            }
            val getItemIcon = ::gen_getItemIcon_fn
            fun gen_getItemImage_fn(item: Any): String {
                return itemValue(item, "image")
            }
            val getItemImage = ::gen_getItemImage_fn
            fun gen_getItemName_fn(item: Any): String {
                return itemValue(item, "name")
            }
            val getItemName = ::gen_getItemName_fn
            fun gen_getItemBgColor_fn(item: Any): String {
                val color = itemValue(item, "bgColor")
                if (color.length > 0) {
                    return color
                }
                return props.itemBgColor
            }
            val getItemBgColor = ::gen_getItemBgColor_fn
            fun gen_getItemIconColor_fn(item: Any): String {
                val color = itemValue(item, "iconColor")
                if (color.length > 0) {
                    return color
                }
                return props.iconColor
            }
            val getItemIconColor = ::gen_getItemIconColor_fn
            fun gen_getItemTextColor_fn(item: Any): String {
                val color = itemValue(item, "textColor")
                if (color.length > 0) {
                    return color
                }
                return props.textColor
            }
            val getItemTextColor = ::gen_getItemTextColor_fn
            fun gen_getItemUrl_fn(item: Any): String {
                return itemValue(item, "url")
            }
            val getItemUrl = ::gen_getItemUrl_fn
            val bgColor = computed(fun(): String {
                return props.bgColor
            }
            )
            val gridItems = computed(fun(): UTSArray<Any> {
                val items = props.items
                if (items == null) {
                    return _uA<Any>()
                }
                return items as UTSArray<Any>
            }
            )
            val selected = ref(-1)
            val gridStyle = computed(fun(): String {
                return ("width:" + props.width + ";background-color:" + bgColor.value + ";border-radius:" + formatSize(props.round) + ";")
            }
            )
            fun gen_getColumns_fn(): Number {
                if (props.col <= 1) {
                    return 1
                }
                if (props.col >= 6) {
                    return 6
                }
                return props.col
            }
            val getColumns = ::gen_getColumns_fn
            fun gen_getRows_fn(): Number {
                val columns = getColumns()
                val items = props.items
                if (items == null) {
                    return 0
                }
                return Math.ceil(items.length / columns)
            }
            val getRows = ::gen_getRows_fn
            fun gen_getItemWidth_fn(): String {
                val columns = getColumns()
                if (columns == 1) {
                    return "100%"
                }
                if (columns == 2) {
                    return "50%"
                }
                if (columns == 3) {
                    return "33.3333%"
                }
                if (columns == 4) {
                    return "25%"
                }
                if (columns == 5) {
                    return "20%"
                }
                return "16.6667%"
            }
            val getItemWidth = ::gen_getItemWidth_fn
            fun gen_getItemStyle_fn(index: Number, item: Any): String {
                val columns = getColumns()
                val row = Math.floor(index / columns)
                val colIndex = index % columns
                var style = "width:" + getItemWidth() + ";height:" + formatSize(props.itemHeight) + ";background-color:" + getItemBgColor(item) + ";"
                if (props.showBorder) {
                    if (colIndex < columns - 1) {
                        style = style + "border-right-width:1px;border-right-style:solid;border-right-color:" + props.borderColor + ";"
                    }
                    if (row < getRows() - 1) {
                        style = style + "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";"
                    }
                }
                return style
            }
            val getItemStyle = ::gen_getItemStyle_fn
            fun gen_getIconStyle_fn(item: Any): String {
                return ("color:" + getItemIconColor(item) + ";font-size:" + formatSize(props.iconSize) + ";line-height:" + formatSize(props.iconSize) + ";")
            }
            val getIconStyle = ::gen_getIconStyle_fn
            fun gen_getImageStyle_fn(item: Any): String {
                val size = formatSize(props.imageSize)
                return "width:" + size + ";height:" + size + ";"
            }
            val getImageStyle = ::gen_getImageStyle_fn
            fun gen_getTextStyle_fn(item: Any): String {
                return "color:" + getItemTextColor(item) + ";font-size:" + formatSize(props.fontSize) + ";"
            }
            val getTextStyle = ::gen_getTextStyle_fn
            fun gen_buildPayload_fn(item: Any, index: Number): UTSJSONObject {
                return _uO("index" to index, "name" to getItemName(item), "text" to getItemText(item), "icon" to getItemIcon(item), "image" to getItemImage(item), "url" to getItemUrl(item))
            }
            val buildPayload = ::gen_buildPayload_fn
            fun gen_select_fn(item: Any, index: Number): Unit {
                selected.value = index
                val payload = buildPayload(item, index)
                emit("select", payload)
                emit("change", payload)
                emit("click", payload)
            }
            val select = ::gen_select_fn
            fun gen_loadMore_fn(): Unit {
                emit("loadmore", gridItems.value.length)
            }
            val loadMore = ::gen_loadMore_fn
            return fun(): Any? {
                return _cE("view", _uM("class" to "i-grid", "style" to _nS(gridStyle.value)), _uA(
                    _cE(Fragment, null, RenderHelpers.renderList(gridItems.value, fun(item, index, __index, _cached): Any {
                        return _cE("view", _uM("key" to (index.toString(10) + "-" + getItemText(item)), "class" to _nC(if (selected.value == index) {
                            "i-grid__item i-grid__item--active"
                        } else {
                            "i-grid__item"
                        }
                        ), "style" to _nS(getItemStyle(index, item as Any)), "hover-class" to if (_ctx.isLink) {
                            "i-grid__item--hover"
                        } else {
                            "none"
                        }
                        , "onClick" to fun(){
                            select(item, index)
                        }
                        ), _uA(
                            if (getItemImage(item).length > 0) {
                                _cE("image", _uM("key" to 0, "class" to "i-grid__image", "src" to getItemImage(item), "style" to _nS(getImageStyle(item)), "mode" to "aspectFit"), null, 12, _uA(
                                    "src"
                                ))
                            } else {
                                if (getItemIcon(item).length > 0) {
                                    _cE("text", _uM("key" to 1, "class" to "i-grid__icon", "style" to _nS(getIconStyle(item))), _tD(getItemIcon(item)), 5)
                                } else {
                                    _cC("v-if", true)
                                }
                            }
                            ,
                            _cE("text", _uM("class" to "i-grid__text", "style" to _nS(getTextStyle(item))), _tD(getItemText(item)), 5)
                        ), 14, _uA(
                            "hover-class",
                            "onClick"
                        ))
                    }
                    ), 128)
                ), 4)
            }
        }
        var name = "i-grid"
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("i-grid" to _pS(_uM("flexDirection" to "row", "flexWrap" to "wrap", "overflow" to "hidden")), "i-grid__item" to _pS(_uM("boxSizing" to "border-box", "overflow" to "hidden", "alignItems" to "center", "justifyContent" to "center")), "i-grid__item--hover" to _pS(_uM("backgroundColor" to "#f3f4f6")), "i-grid__item--active" to _pS(_uM("backgroundColor" to "#ecf5ff")), "i-grid__image" to _pS(_uM("marginBottom" to 8)), "i-grid__icon" to _pS(_uM("marginBottom" to 8, "textAlign" to "center", "lines" to 1)), "i-grid__text" to _pS(_uM("lineHeight" to "18px", "textAlign" to "center", "lines" to 1)))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("select" to null, "change" to null, "click" to null, "loadmore" to null)
        var props = _nP(_uM("items" to _uM("type" to "Array", "default" to fun(): UTSArray<String> {
            return _uA(
                "首页",
                "分类",
                "购物车",
                "我的",
                "优惠券",
                "设置"
            )
        }
        ), "col" to _uM("type" to "Number", "default" to 3), "itemHeight" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "70"), "itemBgColor" to _uM("type" to "String", "default" to "#ffffff"), "bgColor" to _uM("type" to "String", "default" to "transparent"), "width" to _uM("type" to "String", "default" to "auto"), "iconColor" to _uM("type" to "String", "default" to "#333333"), "textColor" to _uM("type" to "String", "default" to "#888888"), "fontSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "13"), "iconSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "25"), "imageSize" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "40"), "showBorder" to _uM("type" to "Boolean", "default" to true), "borderColor" to _uM("type" to "String", "default" to "#f5f5f5"), "round" to _uM("type" to _uA(
            "String",
            "Number"
        ), "default" to "0"), "isLink" to _uM("type" to "Boolean", "default" to true)))
        var propsNeedCastKeys = _uA(
            "col",
            "itemHeight",
            "itemBgColor",
            "bgColor",
            "width",
            "iconColor",
            "textColor",
            "fontSize",
            "iconSize",
            "imageSize",
            "showBorder",
            "borderColor",
            "round",
            "isLink"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
