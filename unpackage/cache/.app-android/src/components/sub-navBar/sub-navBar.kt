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
open class GenComponentsSubNavBarSubNavBar : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var showTime: Boolean by `$props`
    open var showPickerTime: Boolean by `$props`
    open var showCar: Boolean by `$props`
    open var showPicker: Boolean by `$props`
    open var currentTime: String by `$props`
    open var currentCar: String by `$props`
    open var carStatus: String by `$props`
    open var times: UTSArray<UTSArray<PickerItem__1>> by `$props`
    open var cars: UTSArray<UTSArray<PickerItem__1>> by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsSubNavBarSubNavBar) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsSubNavBarSubNavBar
            val _cache = __ins.renderCache
            val props = __props
            val columns = ref(_uA<UTSArray<PickerItem__1>>())
            val picker = ref(null)
            val currentPickerType = ref("")
            val handleTime = fun(){
                columns.value = props.times
                currentPickerType.value = "time"
            }
            val handleCar = fun(){
                columns.value = props.cars
                currentPickerType.value = "car"
            }
            return fun(): Any? {
                return _cE("cover-view", _uM("class" to "tools-box"), _uA(
                    if (isTrue(_ctx.showTime)) {
                        _cE("cover-view", _uM("key" to 0, "class" to "second", "onClick" to fun(){
                            if (_ctx.showPickerTime) {
                                handleTime
                            } else {
                                null
                            }
                        }), _uA(
                            _cE("cover-view", _uM("class" to "times"), _uA(
                                _cE("cover-view", null, _tD(_ctx.currentTime), 1),
                                if (isTrue(!_ctx.showPickerTime)) {
                                    _cE("cover-view", _uM("key" to 0), "刷新一次位置")
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        ), 8, _uA(
                            "onClick"
                        ))
                    } else {
                        _cE("cover-view", _uM("key" to 1, "class" to "slot"))
                    }
                    ,
                    _cE("cover-view", _uM("class" to "car-box"), _uA(
                        if (isTrue(_ctx.showCar)) {
                            _cE("cover-view", _uM("key" to 0, "class" to "selectCar", "onClick" to fun(){
                                if (_ctx.showPicker) {
                                    handleCar
                                } else {
                                    null
                                }
                            }), _uA(
                                _cE("cover-view", _uM("class" to "plateNo"), _tD(_ctx.currentCar), 1)
                            ), 8, _uA(
                                "onClick"
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                        ,
                        _cE("cover-view", _uM("class" to _nC(_uA(
                            "car-state",
                            if (_ctx.carStatus == "online") {
                                "success"
                            } else {
                                "error"
                            }
                        ))), _uA(
                            _cE("cover-view", _uM("class" to "state"), _tD(if (_ctx.carStatus == "online") {
                                "在线"
                            } else {
                                "离线"
                            }
                            ), 1)
                        ), 2)
                    ))
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
                return _uM("tools-box" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "30rpx", "paddingBottom" to "20rpx", "paddingLeft" to "30rpx")), "second" to _uM(".tools-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "backgroundColor" to "rgba(3,109,246,0.71)", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "color" to "#ffffff")), "car-state" to _uM(".tools-box .car-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "10rpx", "paddingRight" to "15rpx", "paddingBottom" to "10rpx", "paddingLeft" to "15rpx", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "color" to "#ffffff", "fontSize" to "25rpx")), "car-box" to _uM(".tools-box .car-box .car-state " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0), ".tools-box .car-box .selectCar " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0), ".tools-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to 0, "paddingRight" to 0, "paddingBottom" to 0, "paddingLeft" to 0)), "selectCar" to _uM(".tools-box .car-box " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "10rpx", "paddingRight" to "10rpx", "paddingBottom" to "10rpx", "paddingLeft" to "10rpx", "marginRight" to "20rpx", "color" to "#ffffff", "backgroundColor" to "rgba(3,109,246,0.71)", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "slot" to _uM(".tools-box " to _uM("width" to "50rpx", "height" to "20rpx"), ".tools-box .car-box .car-state " to _uM("width" to "50rpx", "height" to "20rpx"), ".tools-box .car-box .selectCar " to _uM("width" to "50rpx", "height" to "20rpx")), "plateNo" to _uM(".tools-box .car-box .selectCar " to _uM("fontSize" to "30rpx")), "state" to _uM(".tools-box .car-box .car-state " to _uM("fontSize" to "25rpx")), "success" to _uM(".tools-box .car-box " to _uM("backgroundColor" to "#5ac725")), "error" to _uM(".tools-box .car-box " to _uM("backgroundColor" to "#f56c6c")), "times" to _uM(".tools-box .second " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-start", "alignItems" to "center", "fontSize" to "30rpx")), "down_icon" to _uM(".tools-box " to _uM("width" to "30rpx", "height" to "30rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("update:currentTime" to null, "update:currentCar" to null)
        var props = _nP(_uM("showTime" to _uM("type" to "Boolean", "default" to true), "showPickerTime" to _uM("type" to "Boolean", "default" to true), "showCar" to _uM("type" to "Boolean", "default" to false), "showPicker" to _uM("type" to "Boolean", "default" to true), "currentTime" to _uM("type" to "String", "default" to ""), "currentCar" to _uM("type" to "String", "default" to ""), "carStatus" to _uM("type" to "String", "default" to "在线"), "times" to _uM("type" to "Array", "default" to fun(): UTSArray<UTSArray<Any?>> {
            return _uA(
                _uA()
            )
        }
        ), "cars" to _uM("type" to "Array", "default" to fun(): UTSArray<UTSArray<Any?>> {
            return _uA(
                _uA()
            )
        }
        )))
        var propsNeedCastKeys = _uA(
            "showTime",
            "showPickerTime",
            "showCar",
            "showPicker",
            "currentTime",
            "currentCar",
            "carStatus",
            "times",
            "cars"
        )
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
