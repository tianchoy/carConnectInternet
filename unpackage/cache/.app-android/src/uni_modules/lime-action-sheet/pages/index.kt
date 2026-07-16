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
import io.dcloud.uniapp.extapi.`$emit` as uni__emit
import io.dcloud.uniapp.extapi.closeDialogPage as uni_closeDialogPage
open class GenUniModulesLimeActionSheetPagesIndex : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenUniModulesLimeActionSheetPagesIndex) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenUniModulesLimeActionSheetPagesIndex
            val _cache = __ins.renderCache
            val instance = getCurrentInstance()!!
            val actionItems = shallowRef(_uA<ActionSheetItem>())
            val description = shallowRef("")
            val title = shallowRef("")
            val cancelText = shallowRef("")
            val align = shallowRef("center")
            val bordered = shallowRef(false)
            val closeable = shallowRef(false)
            val overlay = shallowRef(true)
            val rowCol = ref<UTSArray<Number>?>(null)
            val innerValue = ref(false)
            var selected = ref(-1)
            var parentKey = ref("action-sheet-1")
            onLoad(fun(options: OnLoadOptions){
                val param = UTSAndroid.consoleDebugError(JSON.parseObject("" + (options["param"] ?: "{}")), " at uni_modules/lime-action-sheet/pages/index.uvue:119")!!
                parentKey.value = param.getString("key") ?: "action-sheet-1"
                description.value = param.getString("description") ?: ""
                title.value = param.getString("title") ?: ""
                cancelText.value = param.getString("cancelText") ?: ""
                align.value = param.getString("align") ?: "center"
                bordered.value = param.getBoolean("bordered") ?: false
                closeable.value = param.getBoolean("closeable") ?: true
                rowCol.value = param.getArray<Number>("rowCol")
                val list = param.getArray<UTSJSONObject>("list")
                val isImage = fun(name: String?): Boolean {
                    if (name == null) {
                        return false
                    }
                    return UTSRegExp("\\.(jpe?g|png|gif|bmp|webp|tiff?)\$", "i").test(name) || UTSRegExp("^data:image\\/(jpeg|png|gif|bmp|webp|tiff);base64,", "").test(name)
                }
                actionItems.value = list?.map(fun(it, index): ActionSheetItem {
                    return (ActionSheetItem(label = it.getString("label") ?: "", color = it.getString("color"), icon = it.getString("icon"), iconColor = it.getString("iconColor"), bgColor = it.getString("bgColor"), fontSize = it.getString("fontSize") ?: "32rpx", disabled = it.getBoolean("disabled") ?: false, radius = it.getString("radius"), __index = index, __isImage = isImage(it.getString("icon"))))
                }
                ) ?: _uA()
                nextTick(fun(){
                    innerValue.value = true
                }
                )
            }
            )
            val actionRowCols = computed(fun(): UTSArray<UTSArray<ActionSheetItem>> {
                val result: UTSArray<UTSArray<ActionSheetItem>> = _uA()
                val _rowCol = rowCol.value
                if (_rowCol == null) {
                    return result
                }
                val list = actionItems.value.slice()
                val rows = _rowCol.length
                run {
                    var i: Number = 0
                    while(i < rows){
                        var cols = _rowCol[i]
                        val row: UTSArray<ActionSheetItem> = _uA()
                        while(cols > 0 && list.length > 0){
                            val item = list.shift()
                            cols--
                            row.push(item!!)
                        }
                        if (row.length > 0) {
                            result.push(row)
                        }
                        i++
                    }
                }
                if (list.length > 0) {
                    result.push(list)
                }
                return result
            }
            )
            val handleSelected = fun(item: ActionSheetItem){
                if (item.disabled) {
                    return
                }
                innerValue.value = false
                selected.value = item.__index
            }
            val handleCancel = fun(){
                innerValue.value = false
                selected.value = -1
            }
            val onClose = fun(){
                uni_closeDialogPage(CloseDialogPageOptions(dialogPage = instance.proxy!!.`$page`, fail = fun(err) {
                    console.log("err", err, " at uni_modules/lime-action-sheet/pages/index.uvue:189")
                }
                ))
                uni__emit(parentKey.value, selected.value)
            }
            return fun(): Any? {
                val _component_l_icon = resolveComponent("l-icon")
                val _component_l_popup = resolveEasyComponent("l-popup", GenUniModulesLimePopupComponentsLPopupLPopupClass)
                return _cV(_component_l_popup, _uM("modelValue" to unref(innerValue), "onUpdate:modelValue" to fun(`$event`: Boolean){
                    trySetRefValue(innerValue, `$event`)
                }
                , "position" to "bottom", "onClosed" to onClose), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                    return _uA(
                        _cE("view", _uM("class" to "l-action-sheet"), _uA(
                            if (isTrue(unref(title).length > 0 || _ctx.`$slots`["title"] != null)) {
                                _cE("view", _uM("key" to 0, "class" to "l-action-sheet__title"), _uA(
                                    renderSlot(_ctx.`$slots`, "title"),
                                    if (unref(title).length > 0) {
                                        _cE("text", _uM("key" to 0, "class" to "l-action-sheet__title-text"), _tD(unref(title)), 1)
                                    } else {
                                        _cC("v-if", true)
                                    },
                                    if (isTrue(unref(closeable))) {
                                        _cE("text", _uM("key" to 1, "class" to "l-action-sheet__close-btn", "onClick" to handleCancel), "")
                                    } else {
                                        _cC("v-if", true)
                                    }
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            renderSlot(_ctx.`$slots`, "description", _uO(), fun(): UTSArray<Any> {
                                return _uA(
                                    if (unref(description).length > 0) {
                                        _cE("text", _uM("key" to 0, "class" to _nC(_uA(
                                            "l-action-sheet__description",
                                            _uM("l-action-sheet__description--left" to (unref(align) == "left"))
                                        ))), _tD(unref(description)), 3)
                                    } else {
                                        _cC("v-if", true)
                                    }
                                )
                            }
                            ),
                            _cE("view", _uM("class" to "l-action-sheet__content"), _uA(
                                if (unref(rowCol) == null) {
                                    _cE(Fragment, _uM("key" to 0), RenderHelpers.renderList(unref(actionItems), fun(item, index, __index, _cached): Any {
                                        return _cE("view", _uM("class" to _nC(_uA(
                                            "l-action-sheet__item",
                                            _uM("l-action-sheet__item--left" to (unref(align) == "left"), "l-action-sheet__item--bordered" to (unref(bordered) && index != unref(actionItems).length - 1), "l-action-sheet__item--disabled" to item.disabled)
                                        )), "hover-class" to if (!item.disabled) {
                                            "l-action-sheet__item--hover"
                                        } else {
                                            ""
                                        }, "onClick" to fun(){
                                            handleSelected(item)
                                        }, "key" to index), _uA(
                                            if (item.icon != null) {
                                                _cV(_component_l_icon, _uM("key" to 0, "class" to "l-action-sheet__item-icon", "color" to (item.iconColor ?: item.color), "size" to item.fontSize, "name" to item.icon), null, 8, _uA(
                                                    "color",
                                                    "size",
                                                    "name"
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            },
                                            _cE("text", _uM("class" to "l-action-sheet__item-text", "style" to _nS(_uA(
                                                if (item.color != null) {
                                                    "color:" + item.color!!
                                                } else {
                                                    ""
                                                },
                                                if (item.fontSize != null) {
                                                    "font-size:" + item.fontSize!!
                                                } else {
                                                    ""
                                                }
                                            ))), _tD(item.label), 5)
                                        ), 10, _uA(
                                            "hover-class",
                                            "onClick"
                                        ))
                                    }), 128)
                                } else {
                                    _cE(Fragment, _uM("key" to 1), RenderHelpers.renderList(unref(actionRowCols), fun(row, rowIndex, __index, _cached): Any {
                                        return _cE("scroll-view", _uM("class" to _nC(_uA(
                                            "l-action-sheet__row",
                                            _uM("l-action-sheet__row--border" to (rowIndex > 0 && rowIndex < unref(actionRowCols).length))
                                        )), "scroll-x" to true, "direction" to "horizontal", "show-scrollbar" to false, "scroll-with-animation" to true, "key" to ("row" + rowIndex)), _uA(
                                            _cE(Fragment, null, RenderHelpers.renderList(row, fun(item, colIndex, __index, _cached): Any {
                                                return _cE("view", _uM("class" to _nC(_uA(
                                                    "l-action-sheet__col",
                                                    _uM("l-action-sheet__item--disabled" to item.disabled, "l-action-sheet__col--evenly" to !(row.length > 4))
                                                )), "onClick" to fun(){
                                                    handleSelected(item)
                                                }
                                                , "key" to colIndex), _uA(
                                                    if (isTrue(item.icon != null && item.__isImage)) {
                                                        _cE("image", _uM("key" to 0, "class" to "l-action-sheet__image", "style" to _nS(_uA(
                                                            "background: transparent",
                                                            if (item.radius != null) {
                                                                "border-radius:" + item.radius!!
                                                            } else {
                                                                ""
                                                            }
                                                        )), "src" to item.icon), null, 12, _uA(
                                                            "src"
                                                        ))
                                                    } else {
                                                        if (item.icon != null) {
                                                            _cE("view", _uM("key" to 1, "class" to "l-action-sheet__image l-action-sheet__image--center", "style" to _nS(_uA(
                                                                if (item.bgColor != null) {
                                                                    "background:" + item.bgColor!!
                                                                } else {
                                                                    ""
                                                                },
                                                                if (item.radius != null) {
                                                                    "border-radius:" + item.radius!!
                                                                } else {
                                                                    ""
                                                                }
                                                            ))), _uA(
                                                                _cV(_component_l_icon, _uM("class" to "l-action-sheet__col-icon", "color" to (item.iconColor ?: item.color), "size" to (item.fontSize ?: "48rpx"), "name" to item.icon), null, 8, _uA(
                                                                    "color",
                                                                    "size",
                                                                    "name"
                                                                ))
                                                            ), 4)
                                                        } else {
                                                            _cC("v-if", true)
                                                        }
                                                    }
                                                    ,
                                                    _cE("text", _uM("class" to "l-action-sheet__col-text", "style" to _nS(_uA(
                                                        if (item.color != null) {
                                                            "color:" + item.color!!
                                                        } else {
                                                            ""
                                                        }
                                                        ,
                                                        if (item.fontSize != null) {
                                                            "font-size:" + item.fontSize!!
                                                        } else {
                                                            ""
                                                        }
                                                    ))), _tD(item.label), 5)
                                                ), 10, _uA(
                                                    "onClick"
                                                ))
                                            }
                                            ), 128)
                                        ), 2)
                                    }
                                    ), 128)
                                }
                            )),
                            if (unref(cancelText).length > 0) {
                                _cE("view", _uM("key" to 1, "class" to "l-action-sheet__gap"))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (unref(cancelText).length > 0) {
                                _cE("view", _uM("key" to 2, "class" to "l-action-sheet__cancel", "hover-class" to "l-action-sheet__cancel--hover", "onClick" to handleCancel), _uA(
                                    _cE("text", _uM("class" to "l-action-sheet__cancel-text"), _tD(unref(cancelText)), 1)
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    )
                }
                ), "_" to 3), 8, _uA(
                    "modelValue"
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
                return _uM("l-action-sheet" to _pS(_uM("borderTopLeftRadius" to "var(--l-action-sheet-border-radius, 9px)", "borderTopRightRadius" to "var(--l-action-sheet-border-radius, 9px)")), "l-action-sheet__item" to _pS(_uM("height" to "var(--l-action-sheet-item-height, 56px)", "justifyContent" to "center", "alignItems" to "center", "flexDirection" to "row", "paddingTop" to 0, "paddingRight" to 16, "paddingBottom" to 0, "paddingLeft" to 16)), "l-action-sheet__item-text" to _pS(_uM("color" to "var(--l-action-sheet-color, #000000E0)", "fontSize" to "var(--l-action-sheet-font-size, 16px)", "marginLeft" to 8, "marginRight" to 8)), "l-action-sheet__item-icon" to _pS(_uM("color" to "var(--l-action-sheet-color, #000000E0)", "fontSize" to "var(--l-action-sheet-font-size, 16px)")), "l-action-sheet__item--hover" to _pS(_uM("backgroundColor" to "var(--l-action-sheet-hover-color, #e7e7e7)")), "l-action-sheet__item--left" to _pS(_uM("justifyContent" to "flex-start")), "l-action-sheet__item--disabled" to _pS(_uM("opacity" to 0.5)), "l-action-sheet__item--bordered" to _pS(_uM("borderBottomWidth" to 0.5, "borderBottomStyle" to "solid", "borderBottomColor" to "var(--l-action-sheet-border-color, #e7e7e7)")), "l-action-sheet__gap" to _pS(_uM("height" to "var(--l-action-sheet-gap-height, 8px)", "backgroundColor" to "var(--l-action-sheet-gap-color, #f3f3f3)")), "l-action-sheet__cancel" to _pS(_uM("display" to "flex", "backgroundColor" to "var(--l-action-sheet-cancel-bg-color, #fff)", "height" to "var(--l-action-sheet-cancel-height, 48px)", "justifyContent" to "center", "alignItems" to "center", "boxSizing" to "content-box")), "l-action-sheet__cancel--hover" to _pS(_uM("backgroundColor" to "var(--l-action-sheet-hover-color, #e7e7e7)")), "l-action-sheet__cancel-text" to _pS(_uM("color" to "var(--l-action-sheet-cancel-color, #000000E0)", "fontSize" to "var(--l-action-sheet-font-size, 16px)")), "l-action-sheet__title" to _pS(_uM("display" to "flex", "alignItems" to "center", "justifyContent" to "center", "boxSizing" to "content-box", "paddingTop" to "var(--l-action-sheet-title-padding, 16px)", "paddingRight" to "var(--l-action-sheet-title-padding, 16px)", "paddingBottom" to "var(--l-action-sheet-title-padding, 16px)", "paddingLeft" to "var(--l-action-sheet-title-padding, 16px)", "position" to "relative")), "l-action-sheet__title-text" to _pS(_uM("fontSize" to "var(--l-action-sheet-title-font-size, 18px)", "fontWeight" to "var(--l-action-sheet-title-font-weight, 700)", "color" to "var(--l-action-sheet-title-color, #000000E0)")), "l-action-sheet__close-btn" to _pS(_uM("fontFamily" to "l", "position" to "absolute", "top" to "var(--l-action-sheet-close-btn-spacing, 16px)", "right" to "var(--l-action-sheet-close-btn-spacing, 16px)", "fontSize" to "var(--l-action-sheet-close-btn-font-size, 20px)", "color" to "var(--l-action-sheet-close-btn-color, #000000E0)")), "l-action-sheet__description" to _pS(_uM("color" to "var(--l-action-sheet-description-color, #00000073)", "lineHeight" to "var(--l-action-sheet-description-line-height, 22px)", "fontSize" to "var(--l-action-sheet-description-font-size, 14px)", "textAlign" to "var(--l-action-sheet-text-align, center)", "paddingTop" to "var(--l-action-sheet-description-padding-y, 12px)", "paddingRight" to "var(--l-action-sheet-description-padding-x, 16px)", "paddingBottom" to "var(--l-action-sheet-description-padding-y, 12px)", "paddingLeft" to "var(--l-action-sheet-description-padding-x, 16px)", "borderBottomWidth" to 0.5, "borderBottomStyle" to "solid", "borderBottomColor" to "var(--l-action-sheet-border-color, #e7e7e7)")), "l-action-sheet__description--left" to _pS(_uM("textAlign" to "left")), "l-action-sheet__wrap" to _pS(_uM("display" to "flex", "paddingTop" to 16, "paddingBottom" to 16, "flexDirection" to "row", "flexWrap" to "nowrap")), "l-action-sheet__row" to _pS(_uM("paddingTop" to 16, "paddingBottom" to 16, "flexDirection" to "row")), "l-action-sheet__row--border" to _pS(_uM("borderTopWidth" to 0.8, "borderTopStyle" to "solid", "borderTopColor" to "var(--l-action-sheet-border-color, #e7e7e7)")), "l-action-sheet__col" to _pS(_uM("justifyContent" to "center", "alignItems" to "center")), "l-action-sheet__col--evenly" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "l-action-sheet__col-text" to _pS(_uM("color" to "var(--l-action-sheet-color, #000000E0)", "paddingTop" to "var(--l-action-sheet-col-text-padding, 12px)", "fontSize" to "var(--l-action-sheet-col-font-size, 12px)")), "l-action-sheet__col-icon" to _pS(_uM("fontSize" to "var(--l-action-sheet-icon-size, 24px)", "color" to "var(--l-action-sheet-color, #000000E0)")), "l-action-sheet__image" to _pS(_uM("width" to "var(--l-action-sheet-image-size, 48px)", "height" to "var(--l-action-sheet-image-size, 48px)", "marginTop" to 0, "marginRight" to 16, "marginBottom" to 0, "marginLeft" to 16, "backgroundColor" to "var(--l-action-sheet-image-bg-color, #0000000A)", "borderTopLeftRadius" to 99, "borderTopRightRadius" to 99, "borderBottomRightRadius" to 99, "borderBottomLeftRadius" to 99)), "l-action-sheet__image--center" to _pS(_uM("justifyContent" to "center", "alignItems" to "center")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
