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
import io.dcloud.uniapp.extapi.navigateTo as uni_navigateTo
import io.dcloud.uniapp.extapi.showToast as uni_showToast
open class GenComponentsIndexListModeIndexListMode : VueComponent {
    constructor(__ins: ComponentInternalInstance) : super(__ins) {}
    open var lists: UTSArray<DeviceItem> by `$props`
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenComponentsIndexListModeIndexListMode) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenComponentsIndexListModeIndexListMode
            val _cache = __ins.renderCache
            val props = __props
            fun emit(event: String, vararg do_not_transform_spread: Any?) {
                __ins.emit(event, *do_not_transform_spread)
            }
            val modal = ref<Boolean>(false)
            val imeis = ref("")
            val needRefresh = ref(false)
            val pay = fun(reassignedIccid: String, simMerchant: String){
                var iccid = reassignedIccid
                if (simMerchant.toLowerCase() == "zddx") {
                    iccid = iccid.substring(0, iccid.length - 1)
                }
                console.log(iccid, " at components/indexListMode/indexListMode.uvue:59")
                needRefresh.value = true
                needRefresh.value = false
                uni_showToast(ShowToastOptions(title = "请在微信小程序中完成充值", icon = "none"))
            }
            val unbindDevice = fun(imei: String){
                imeis.value = imei
                modal.value = true
            }
            val confirm = fun(){
                emit("unbindDevice", imeis.value)
                modal.value = false
            }
            val cancel = fun(){
                modal.value = false
            }
            val todetail = fun(companyId: String, imei: String, deviceId: String){
                uni_navigateTo(NavigateToOptions(url = "/pages/carInfoDetail/carInfoDetail?deptId=" + companyId + "&imei=" + imei + "&deviceId=" + deviceId))
            }
            return fun(): Any? {
                val _component_i_tag = resolveEasyComponent("i-tag", GenUniModulesIUiXComponentsITagITagClass)
                val _component_i_modal = resolveEasyComponent("i-modal", GenUniModulesIUiXComponentsIModalIModalClass)
                return _cE("view", _uM("class" to "list-container"), _uA(
                    if (props.lists.length != 0) {
                        _cE("scroll-view", _uM("key" to 0, "class" to "content", "scroll-y" to ""), _uA(
                            _cE(Fragment, null, RenderHelpers.renderList(props.lists, fun(item, index, __index, _cached): Any {
                                return _cE("view", _uM("class" to "list-item", "key" to index, "onClick" to fun(){
                                    todetail(item.companyId, item.imei, item.deviceId)
                                }), _uA(
                                    _cE("view", _uM("class" to "title"), _uA(
                                        _cE("view", _uM("class" to "car-number"), _uA(
                                            _tD(item.deviceName) + " ",
                                            _cV(_component_i_tag, _uM("class" to "car-status-spacing", "size" to "mini", "shape" to "circle", "text" to if (item.connectionStatus == "online") {
                                                "在线"
                                            } else {
                                                "离线"
                                            }, "type" to if (item.connectionStatus == "online") {
                                                "success"
                                            } else {
                                                "error"
                                            }), null, 8, _uA(
                                                "text",
                                                "type"
                                            ))
                                        )),
                                        _cE("view", _uM("class" to "device-tools"), _uA(
                                            _cV(_component_i_tag, _uM("text" to "充值", "type" to "success", "onClick" to withModifiers(fun(){
                                                pay(item.iccid, item.simMerchant)
                                            }, _uA(
                                                "stop"
                                            ))), null, 8, _uA(
                                                "onClick"
                                            )),
                                            _cV(_component_i_tag, _uM("class" to "device-tool-spacing", "text" to "解绑", "type" to "warning", "onClick" to withModifiers(fun(){
                                                unbindDevice(item.imei)
                                            }, _uA(
                                                "stop"
                                            ))), null, 8, _uA(
                                                "onClick"
                                            ))
                                        ))
                                    )),
                                    _cE("view", null, _uA(
                                        _cE("text", _uM("class" to "imei"), "ID: " + _tD(item.imei), 1)
                                    ))
                                ), 8, _uA(
                                    "onClick"
                                ))
                            }), 128),
                            _cV(_component_i_modal, _uM("show" to unref(modal), "title" to "提示", "content" to "是否要解绑设备？", "buttonReverse" to true, "align" to "center", "confirmText" to "确定", "cancelText" to "取消", "showCancelButton" to true, "onConfirm" to confirm, "onCancel" to cancel), null, 8, _uA(
                                "show"
                            ))
                        ))
                    } else {
                        _cE("view", _uM("key" to 1, "class" to "empty"), " 暂无数据 ")
                    }
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
                return _uM("list-container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#f5f5f5", "paddingTop" to 0, "paddingRight" to "20rpx", "paddingBottom" to 0, "paddingLeft" to "20rpx")), "list-item" to _uM(".list-container .content " to _uM("paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "marginBottom" to "20rpx")), "title" to _uM(".list-container .content .list-item " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "marginBottom" to "20rpx")), "car-number" to _uM(".list-container .content .list-item .title " to _uM("display" to "flex", "fontSize" to "35rpx", "fontWeight" to "bold", "marginRight" to "20rpx", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "car-status-spacing" to _uM(".list-container .content .list-item .title " to _uM("marginLeft" to "10rpx")), "device-tool-spacing" to _uM(".list-container .content .list-item .title " to _uM("marginLeft" to "10rpx")), "device-tools" to _uM(".list-container .content .list-item .title " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-end", "alignItems" to "center")), "imei" to _uM(".list-container .content .list-item " to _uM("color" to "#cccccc")), "empty" to _uM(".list-container " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center", "color" to "#cccccc")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM("unbindDevice" to null)
        var props = _nP(_uM("lists" to _uM("type" to "Array", "required" to true)))
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
