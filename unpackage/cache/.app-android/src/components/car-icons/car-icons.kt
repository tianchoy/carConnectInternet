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
open class GenComponentsCarIconsCarIcons : VueComponent, Props {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    override var title: String by `$props`
    override var col: Number by `$props`
    override var iconSize: Number by `$props`
    override var safeAreaInsetBottom: Boolean by `$props`
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
    open var iconList: UTSArray<CarIconItem>
        get() {
            return unref(this.`$exposed`["iconList"]) as UTSArray<CarIconItem>
        }
        set(value) {
            setRefValue(this.`$exposed`, "iconList", value)
        }
    open var getIconByName: (name: String) -> CarIconItem?
        get() {
            return unref(this.`$exposed`["getIconByName"]) as (name: String) -> CarIconItem?
        }
        set(value) {
            setRefValue(this.`$exposed`, "getIconByName", value)
        }
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsCarIconsCarIcons, __setupCtx: SetupContext) -> Any? = fun(__props, __setupCtx): Any? {
            val __expose = __setupCtx.expose
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsCarIconsCarIcons
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val visible = ref(false)
            val iconList = _uA(
                CarIconItem(name = "car", text = "轿车", image = "/static/cars/online/car.png"),
                CarIconItem(name = "suv", text = "越野车", image = "/static/cars/online/suv.png"),
                CarIconItem(name = "bus", text = "公交车", image = "/static/cars/online/bus.png"),
                CarIconItem(name = "huoche", text = "货车", image = "/static/cars/online/huoche.png"),
                CarIconItem(name = "train", text = "火车", image = "/static/cars/online/train.png"),
                CarIconItem(name = "diandong", text = "电动车", image = "/static/cars/online/diandong.png"),
                CarIconItem(name = "moto", text = "摩托车", image = "/static/cars/online/moto.png"),
                CarIconItem(name = "bike", text = "自行车", image = "/static/cars/online/bike.png"),
                CarIconItem(name = "sanlun", text = "三轮车", image = "/static/cars/online/sanlun.png"),
                CarIconItem(name = "tuola", text = "拖拉机", image = "/static/cars/online/tuola.png"),
                CarIconItem(name = "wajue", text = "挖掘机", image = "/static/cars/online/wajue.png"),
                CarIconItem(name = "tuiche", text = "手推车", image = "/static/cars/online/tuiche.png"),
                CarIconItem(name = "baby", text = "婴儿车", image = "/static/cars/online/baby.png"),
                CarIconItem(name = "muma", text = "木马", image = "/static/cars/online/muma.png"),
                CarIconItem(name = "tank", text = "坦克", image = "/static/cars/online/tank.png"),
                CarIconItem(name = "zhuangjia", text = "装甲车", image = "/static/cars/online/zhuangjia.png"),
                CarIconItem(name = "plan", text = "飞机", image = "/static/cars/online/plan.png"),
                CarIconItem(name = "hangmu", text = "航母", image = "/static/cars/online/hangmu.png"),
                CarIconItem(name = "junjian", text = "军舰", image = "/static/cars/online/junjian.png"),
                CarIconItem(name = "walk", text = "步行", image = "/static/cars/online/walk.png")
            ) as UTSArray<CarIconItem>
            val itemWidth = computed(fun(): String {
                val cols = if (props.col > 0) {
                    props.col
                } else {
                    4
                }
                return ((100 as Number) / cols) + "%"
            }
            )
            val close = fun(){
                visible.value = false
            }
            val handleSelect = fun(item: Any){
                val selected = item as CarIconItem
                console.log("选择的图标:", selected, " at components/car-icons/car-icons.uvue:97")
                emit("select", selected)
                close()
            }
            val handlePopupClick = fun(){
                console.log("Popup clicked", " at components/car-icons/car-icons.uvue:104")
            }
            val open = fun(){
                visible.value = true
            }
            val getIconByName = fun(name: String): CarIconItem? {
                return iconList.find(fun(item): Boolean {
                    return item.name === name
                }
                )
            }
            __expose(_uM("open" to open, "close" to close, "iconList" to iconList, "getIconByName" to getIconByName))
            return fun(): Any? {
                val _component_i_grid = resolveEasyComponent("i-grid", GenUniModulesIUiXComponentsIGridIGridClass)
                val _component_i_popup = resolveEasyComponent("i-popup", GenUniModulesIUiXComponentsIPopupIPopupClass)
                return _cV(_component_i_popup, _uM("show" to visible.value, "title" to _ctx.title, "mode" to "bottom", "safeBottom" to _ctx.safeAreaInsetBottom, "showClose" to "", "onClose" to close, "onClick" to handlePopupClick), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                    return _uA(
                        _cE("view", _uM("class" to "icon-selector"), _uA(
                            _cV(_component_i_grid, _uM("items" to iconList, "col" to 4, "itemHeight" to "88", "round" to "8", "imageSize" to 30, "iconColor" to "#3c9cff", "textColor" to "#606266", "showBorder" to true, "onClick" to fun(`$event`: Any){
                                handleSelect(`$event`)
                            }
                            ), null, 8, _uA(
                                "onClick"
                            ))
                        ))
                    )
                }
                ), "_" to 1), 8, _uA(
                    "show",
                    "title",
                    "safeBottom"
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
                return _uM("icon-selector" to _pS(_uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "40rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#ffffff", "overflowY" to "auto", "width::-webkit-scrollbar" to 4, "backgroundColor::-webkit-scrollbar-thumb" to "#dddddd", "borderTopLeftRadius::-webkit-scrollbar-thumb" to 4, "borderTopRightRadius::-webkit-scrollbar-thumb" to 4, "borderBottomRightRadius::-webkit-scrollbar-thumb" to 4, "borderBottomLeftRadius::-webkit-scrollbar-thumb" to 4, "backgroundColor::-webkit-scrollbar-track" to "#f5f5f5")), "icon-grid" to _uM(".icon-selector " to _uM("width" to "100%", "display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap")), "grid-item" to _uM(".icon-selector .icon-grid " to _uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "width" to "25%", "height" to "100%", "transitionProperty" to "all", "transitionDuration" to "0.3s", "transitionTimingFunction" to "ease", "transform:active" to "scale(0.95)", "backgroundColor:active" to "#f5f5f5")), "icon-image" to _uM(".icon-selector .icon-grid .grid-item " to _uM("width" to "80rpx", "height" to "80rpx", "marginBottom" to "10rpx")), "grid-text" to _uM(".icon-selector .icon-grid .grid-item " to _uM("fontSize" to "22rpx", "color" to "#333333", "textAlign" to "center", "lineHeight" to 1.2, "marginTop" to "8rpx", "fontWeight" to 400)), "@TRANSITION" to _uM("grid-item" to _uM("property" to "all", "duration" to "0.3s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("select" to null)
        var props = _nP(_uM("title" to _uM("type" to "String", "required" to true, "default" to "请选择图标"), "col" to _uM("type" to "Number", "required" to true, "default" to 4), "iconSize" to _uM("type" to "Number", "required" to true, "default" to 40), "safeAreaInsetBottom" to _uM("type" to "Boolean", "required" to true, "default" to true)))
        var propsNeedCastKeys = _uA(
            "title",
            "col",
            "iconSize",
            "safeAreaInsetBottom"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
