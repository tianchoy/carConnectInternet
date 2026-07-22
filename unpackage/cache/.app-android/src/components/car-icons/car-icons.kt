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
    override var show: Boolean by `$props`
    override var title: String by `$props`
    override var col: Number by `$props`
    override var iconSize: Number by `$props`
    override var safeAreaInsetBottom: Boolean by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsCarIconsCarIcons) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsCarIconsCarIcons
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val iconList = _uA(
                _uO("name" to "car", "text" to "轿车", "image" to "/static/cars/online/car.png"),
                _uO("name" to "suv", "text" to "越野车", "image" to "/static/cars/online/suv.png"),
                _uO("name" to "bus", "text" to "公交车", "image" to "/static/cars/online/bus.png"),
                _uO("name" to "huoche", "text" to "货车", "image" to "/static/cars/online/huoche.png"),
                _uO("name" to "train", "text" to "火车", "image" to "/static/cars/online/train.png"),
                _uO("name" to "diandong", "text" to "电动车", "image" to "/static/cars/online/diandong.png"),
                _uO("name" to "moto", "text" to "摩托车", "image" to "/static/cars/online/moto.png"),
                _uO("name" to "bike", "text" to "自行车", "image" to "/static/cars/online/bike.png"),
                _uO("name" to "sanlun", "text" to "三轮车", "image" to "/static/cars/online/sanlun.png"),
                _uO("name" to "tuola", "text" to "拖拉机", "image" to "/static/cars/online/tuola.png"),
                _uO("name" to "wajue", "text" to "挖掘机", "image" to "/static/cars/online/wajue.png"),
                _uO("name" to "tuiche", "text" to "手推车", "image" to "/static/cars/online/tuiche.png"),
                _uO("name" to "baby", "text" to "婴儿车", "image" to "/static/cars/online/baby.png"),
                _uO("name" to "muma", "text" to "木马", "image" to "/static/cars/online/muma.png"),
                _uO("name" to "tank", "text" to "坦克", "image" to "/static/cars/online/tank.png"),
                _uO("name" to "zhuangjia", "text" to "装甲车", "image" to "/static/cars/online/zhuangjia.png"),
                _uO("name" to "plan", "text" to "飞机", "image" to "/static/cars/online/plan.png"),
                _uO("name" to "hangmu", "text" to "航母", "image" to "/static/cars/online/hangmu.png"),
                _uO("name" to "junjian", "text" to "军舰", "image" to "/static/cars/online/junjian.png"),
                _uO("name" to "walk", "text" to "步行", "image" to "/static/cars/online/walk.png")
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
                emit("update:show", false)
            }
            val handleSelect = fun(item: Any){
                val selected = item as UTSJSONObject
                console.log("选择的图标:", selected, " at components/car-icons/car-icons.uvue:93")
                emit("select", selected)
                close()
            }
            val handlePopupClick = fun(){
                console.log("Popup clicked", " at components/car-icons/car-icons.uvue:100")
            }
            return fun(): Any? {
                val _component_i_grid = resolveEasyComponent("i-grid", GenUniModulesIUiXComponentsIGridIGridClass)
                val _component_i_popup = resolveEasyComponent("i-popup", GenUniModulesIUiXComponentsIPopupIPopupClass)
                return _cV(_component_i_popup, _uM("show" to props.show, "title" to _ctx.title, "mode" to "bottom", "safeBottom" to _ctx.safeAreaInsetBottom, "showClose" to "", "onClose" to close, "onClick" to handlePopupClick), _uM("default" to withSlotCtx(fun(): UTSArray<Any> {
                    return _uA(
                        _cE("scroll-view", _uM("class" to "icon-selector", "scroll-y" to ""), _uA(
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
                return _uM("icon-selector" to _pS(_uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "40rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#ffffff", "width::-webkit-scrollbar" to 4, "backgroundColor::-webkit-scrollbar-thumb" to "#dddddd", "borderTopLeftRadius::-webkit-scrollbar-thumb" to 4, "borderTopRightRadius::-webkit-scrollbar-thumb" to 4, "borderBottomRightRadius::-webkit-scrollbar-thumb" to 4, "borderBottomLeftRadius::-webkit-scrollbar-thumb" to 4, "backgroundColor::-webkit-scrollbar-track" to "#f5f5f5")), "icon-grid" to _uM(".icon-selector " to _uM("width" to "100%", "display" to "flex", "flexDirection" to "row", "flexWrap" to "wrap")), "grid-item" to _uM(".icon-selector .icon-grid " to _uM("display" to "flex", "flexDirection" to "column", "alignItems" to "center", "justifyContent" to "center", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "width" to "25%", "height" to "100%", "transitionProperty" to "all", "transitionDuration" to "0.3s", "transitionTimingFunction" to "ease")), "@TRANSITION" to _uM("grid-item" to _uM("property" to "all", "duration" to "0.3s", "timingFunction" to "ease")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("select" to null, "update:show" to null)
        var props = _nP(_uM("show" to _uM("type" to "Boolean", "required" to true, "default" to false), "title" to _uM("type" to "String", "required" to true, "default" to "请选择图标"), "col" to _uM("type" to "Number", "required" to true, "default" to 4), "iconSize" to _uM("type" to "Number", "required" to true, "default" to 40), "safeAreaInsetBottom" to _uM("type" to "Boolean", "required" to true, "default" to true)))
        var propsNeedCastKeys = _uA(
            "show",
            "title",
            "col",
            "iconSize",
            "safeAreaInsetBottom"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
