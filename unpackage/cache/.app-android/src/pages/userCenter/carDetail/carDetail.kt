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
open class GenPagesUserCenterCarDetailCarDetail : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterCarDetailCarDetail) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterCarDetailCarDetail
            val _cache = __ins.renderCache
            val deviceId = ref<String>("")
            val carInfo = ref(_uO())
            val carTitle = computed(fun(): String {
                return carInfo.value.getString("carType", "未知")
            }
            )
            val formattedPlateNo = computed(fun(): String {
                return carInfo.value.getString("plateNo", "京A")
            }
            )
            val toggleEdit = fun(){}
            val loadCarListData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        val res = await(getDeviceDetail(deviceId.value))
                        val data = res.data
                        if (data != null) {
                            carInfo.value = data
                        }
                })
            }
            onLoad(fun(option){
                val id = option["deviceId"]
                if (id != null) {
                    deviceId.value = id
                    loadCarListData()
                }
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                return _cE("view", _uM("class" to "container"), _uA(
                    _cV(_component_custom_navBar, _uM("title" to "车辆详情", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false, "isIcon" to true, "onCapsuleClick" to toggleEdit, "Icon" to "/static/edit-pen.png")),
                    _cE("view", _uM("class" to "content"), _uA(
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "设备ID"),
                            _cE("text", _uM("class" to "info"), _tD(carInfo.value.getString("deviceId", "")), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "设备名称"),
                            _cE("text", _uM("class" to "info"), _tD(carInfo.value.getString("deviceName", "")), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车标"),
                            _cE("text", _uM("class" to "info"), _tD(carTitle.value), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车牌号"),
                            _cE("text", _uM("class" to "info"), _tD(formattedPlateNo.value), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "车架号"),
                            _cE("text", _uM("class" to "info"), _tD(carInfo.value.getString("carVin", "")), 1)
                        )),
                        _cE("view", _uM("class" to "list"), _uA(
                            _cE("text", _uM("class" to "title"), "发动机号"),
                            _cE("text", _uM("class" to "info"), _tD(carInfo.value.getString("engineNum", "")), 1)
                        ))
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
                return _uM("container" to _pS(_uM("height" to "100%", "backgroundColor" to "#f5f5f5")), "content" to _pS(_uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx", "backgroundColor" to "#ffffff", "paddingTop" to "40rpx", "paddingRight" to "40rpx", "paddingBottom" to "40rpx", "paddingLeft" to "40rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx")), "list" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx", "paddingRight" to "10rpx", "paddingBottom" to "20rpx", "paddingLeft" to "10rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "title" to _pS(_uM("width" to "30%", "color" to "#999999")), "info" to _pS(_uM("color" to "#333333", "textAlign" to "right", "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
