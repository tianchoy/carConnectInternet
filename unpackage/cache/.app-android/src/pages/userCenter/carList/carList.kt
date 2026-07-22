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
open class GenPagesUserCenterCarListCarList : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesUserCenterCarListCarList) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesUserCenterCarListCarList
            val _cache = __ins.renderCache
            val carList = ref(_uA<UTSJSONObject>())
            val currPage = ref(1)
            val pageSize = ref(10)
            val totalPage = ref(0)
            val loading = ref(false)
            val hasMore = ref(true)
            val addCar = fun(){
                uni_navigateTo(NavigateToOptions(url = "/pages/addCar/addCar"))
            }
            val resetData = fun(){
                carList.value = _uA()
                currPage.value = 1
                totalPage.value = 0
                hasMore.value = true
            }
            val loadCarListData = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        console.log(currPage.value, totalPage.value, " at pages/userCenter/carList/carList.uvue:58")
                        if (loading.value || !hasMore.value) {
                            return@w1
                        }
                        loading.value = true
                        try {
                            val data: UTSJSONObject = _uO("__\$originalPosition" to UTSSourceMapPosition("data", "pages/userCenter/carList/carList.uvue", 63, 10), "page" to currPage.value, "pageSize" to pageSize.value)
                            val res = await(getUserDeviceList(data))
                            val code = res.code
                            val list = res.data.list
                            val pageCount = res.data.totalPage
                            if (code == 0 && list != null) {
                                totalPage.value = pageCount
                                if (currPage.value == 1) {
                                    carList.value = list
                                } else {
                                    carList.value = carList.value.concat(list)
                                }
                                hasMore.value = currPage.value < totalPage.value
                                if (hasMore.value) {
                                    currPage.value++
                                }
                            } else {
                                uni_showToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "加载失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("加载车辆列表失败:", error, " at pages/userCenter/carList/carList.uvue:98")
                            uni_showToast(ShowToastOptions(title = "加载失败，请重试", icon = "none"))
                        }
                         finally {
                            loading.value = false
                        }
                })
            }
            onShow(fun(){
                resetData()
                loadCarListData()
            }
            )
            onReachBottom(fun(){
                loadCarListData()
            }
            )
            val carDetail = fun(deviceId: String){
                uni_navigateTo(NavigateToOptions(url = "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId))
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                return _cE(Fragment, null, _uA(
                    _cV(_component_custom_navBar, _uM("title" to "车辆管理", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to true, "isIcon" to true, "onCapsuleClick" to addCar, "isShowStyle" to true)),
                    _cE("view", _uM("class" to "container"), _uA(
                        _cE("view", _uM("class" to "content"), _uA(
                            _cE(Fragment, null, RenderHelpers.renderList(unref(carList), fun(item, index, __index, _cached): Any {
                                return _cE("view", _uM("class" to "list", "key" to index, "onClick" to fun(){
                                    carDetail(item.getString("deviceId", ""))
                                }
                                ), _uA(
                                    _cE("text", _uM("class" to "title"), _tD(item.getString("deviceName", "")), 1),
                                    _cE("view", _uM("class" to "device-info"), _uA(
                                        _cE("text", null, _tD(item.getString("plateNo", "")), 1),
                                        _cE("text", _uM("class" to "tel"), _tD(item.getString("imei", "")), 1)
                                    ))
                                ), 8, _uA(
                                    "onClick"
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
                            if (isTrue(!unref(hasMore) && !unref(loading))) {
                                _cE("view", _uM("key" to 1, "class" to "no-more"), _uA(
                                    _cE("text", null, "没有更多数据了")
                                ))
                            } else {
                                _cC("v-if", true)
                            }
                        ))
                    ))
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
                return _uM("container" to _pS(_uM("width" to "100%", "backgroundColor" to "#f5f5f5", "marginTop" to "170rpx")), "content" to _uM(".container " to _uM("marginTop" to "30rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx")), "list" to _uM(".container .content " to _uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "paddingTop" to "30rpx", "paddingRight" to "40rpx", "paddingBottom" to "30rpx", "paddingLeft" to "40rpx", "marginBottom" to "30rpx", "fontSize" to "25rpx")), "title" to _uM(".container .content .list " to _uM("fontWeight" to "bold", "fontSize" to "32rpx")), "device-info" to _uM(".container .content .list " to _uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "20rpx")), "tel" to _uM(".container .content .list .device-info " to _uM("color" to "#999999", "fontSize" to "22rpx")), "loading" to _uM(".container .content " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "24rpx")), "no-more" to _uM(".container .content " to _uM("textAlign" to "center", "paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "24rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
