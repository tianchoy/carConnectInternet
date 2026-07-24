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
import io.dcloud.uniapp.extapi.stopPullDownRefresh as uni_stopPullDownRefresh
open class GenPagesUserCenterPayDeviceListPayDeviceList : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterPayDeviceListPayDeviceList) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterPayDeviceListPayDeviceList
            val _cache = __ins.renderCache
            val deviceList = ref(_uA<UTSJSONObject>())
            val currPage = ref(1)
            val pageSize = ref(10)
            val totalPage = ref(0)
            val loading = ref(false)
            val hasMore = ref(true)
            val needRefresh = ref(false)
            val resetData = fun(){
                deviceList.value = _uA()
                currPage.value = 1
                totalPage.value = 0
                hasMore.value = true
            }
            val loadPayDeviceListData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (loading.value || !hasMore.value) {
                            return@w1
                        }
                        loading.value = true
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/userCenter/payDeviceList/payDeviceList.uvue", 89, 10), "page" to currPage.value, "pageSize" to pageSize.value)
                            val res = await(getUserDeviceList(data))
                            val code = res.code
                            val list = res.data.list
                            val pageCount = res.data.totalPage
                            if (code == 0 && list != null) {
                                totalPage.value = pageCount
                                if (currPage.value == 1) {
                                    deviceList.value = list
                                } else {
                                    deviceList.value = deviceList.value.concat(list)
                                }
                                hasMore.value = currPage.value < totalPage.value
                                if (hasMore.value) {
                                    currPage.value++
                                }
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "加载失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载车辆列表失败:", error, " at pages/userCenter/payDeviceList/payDeviceList.uvue:125")
                            showAppToast(ShowToastOptions(title = "加载失败，请重试", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            onShow(fun(){
                if (needRefresh.value || deviceList.value.length == 0) {
                    resetData()
                    loadPayDeviceListData()
                    needRefresh.value = false
                }
            }
            )
            onReachBottom(fun(){
                loadPayDeviceListData()
            }
            )
            fun gen_pay_fn(reassignedIccid: String, simMerchant: String) {
                var iccid = reassignedIccid
                if (simMerchant.toLowerCase() == "zddx") {
                    iccid = iccid.substring(0, iccid.length - 1)
                }
                console.log(iccid, " at pages/userCenter/payDeviceList/payDeviceList.uvue:156")
                needRefresh.value = true
                needRefresh.value = false
                showAppToast(ShowToastOptions(title = "请在微信小程序中完成充值", icon = "none"))
            }
            val pay = ::gen_pay_fn
            val payDevice = fun(item: UTSJSONObject){
                val iccid = item.getString("iccid", "")
                val simMerchant = item.getString("simMerchant", "")
                pay(iccid, simMerchant)
            }
            onPullDownRefresh(fun(){
                resetData()
                loadPayDeviceListData().`finally`(fun(){
                    uni_stopPullDownRefresh()
                    showAppToast(ShowToastOptions(title = "刷新成功", icon = "success"))
                }
                )
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                return _cE(Fragment, null, _uA(
                    _cV(_component_custom_navBar, _uM("title" to "续费管理", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false, "isIcon" to true, "isShowStyle" to true)),
                    _cE("view", _uM("class" to "container"), _uA(
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE(Fragment, null, RenderHelpers.renderList(unref(deviceList), fun(item, index, __index, _cached): Any {
                                return _cE("view", _uM("class" to "list", "key" to index), _uA(
                                    _cE("view", _uM("class" to "device-info"), _uA(
                                        _cE("view", _uM("class" to "label title"), _tD(item["deviceName"]), 1),
                                        _cE("view", _uM("class" to "value"))
                                    )),
                                    if (isTrue(item["iccid"])) {
                                        _cE("view", _uM("key" to 0, "class" to "device-info"), _uA(
                                            _cE("view", _uM("class" to "label"), "ICCID:"),
                                            _cE("view", _uM("class" to "value"), _tD(item["iccid"]), 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    }
                                    ,
                                    if (isTrue(if (isTruthy(item["imei"])) {
                                        item["imei"] != ""
                                    } else {
                                        item["imei"]
                                    }
                                    )) {
                                        _cE("view", _uM("key" to 1, "class" to "device-info"), _uA(
                                            _cE("view", _uM("class" to "label"), "ID:"),
                                            _cE("view", _uM("class" to "value"), _tD(item["imei"]), 1)
                                        ))
                                    } else {
                                        _cC("v-if", true)
                                    }
                                    ,
                                    _cE("view", _uM("class" to "device-info"), _uA(
                                        _cE("view"),
                                        _cE("text", _uM("class" to "pay-btn", "onClick" to fun(){
                                            payDevice(item)
                                        }
                                        ), "去续费", 8, _uA(
                                            "onClick"
                                        ))
                                    ))
                                ))
                            }
                            ), 128),
                            if (isTrue(unref(loading))) {
                                _cE("view", _uM("key" to 0, "class" to "loading"), _uA(
                                    _cE("text", null, "加载中...")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (isTrue(!unref(hasMore) && !unref(loading) && unref(deviceList).length > 0)) {
                                _cE("view", _uM("key" to 1, "class" to "no-more"), _uA(
                                    _cE("text", null, "没有更多数据了")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                            ,
                            if (isTrue(!unref(loading) && unref(deviceList).length == 0)) {
                                _cE("view", _uM("key" to 2, "class" to "empty"), _uA(
                                    _cE("text", null, "暂无设备数据")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    )),
                    _cV(_component_app_toast)
                ), 64)
            }
        }
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("container" to _pS(_uM("width" to "100%", "backgroundColor" to "#f5f5f5", "marginTop" to "170rpx")), "content" to _uM(".container " to _uM("marginTop" to "30rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx")), "list" to _uM(".container .content " to _uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "marginBottom" to "30rpx")), "device-info" to _uM(".container .content .list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "fontSize" to "28rpx", "paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0)), "label" to _uM(".container .content .list .device-info " to _uM("color" to "#666666")), "title" to _uM(".container .content .list .device-info " to _uM("fontWeight" to "bold", "fontSize" to "32rpx", "color" to "#000000")), "value" to _uM(".container .content .list .device-info " to _uM("color" to "#333333")), "pay-btn" to _uM(".container .content .list .device-info " to _uM("paddingTop" to "10rpx", "paddingRight" to "15rpx", "paddingBottom" to "10rpx", "paddingLeft" to "15rpx", "fontSize" to "25rpx", "color" to "#ffffff", "backgroundColor" to "#5ac725", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx")), "loading" to _uM(".container .content " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "24rpx")), "no-more" to _uM(".container .content " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "24rpx")), "empty" to _uM(".container .content " to _uM("textAlign" to "center", "paddingTop" to "100rpx", "paddingRight" to 0, "paddingBottom" to "100rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "28rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
