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
open class GenPagesDeviceShareDeviceShare : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesDeviceShareDeviceShare) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesDeviceShareDeviceShare
            val _cache = __ins.renderCache
            val enabled = ref(false)
            val loadingEnabled = ref(true)
            val deviceId = ref("")
            val deviceName = ref("")
            val targetPhone = ref("")
            val expireDate = ref("")
            val submitting = ref(false)
            val sentShares = ref(_uA<UTSJSONObject>())
            val sentTotalCount = ref(0)
            val sentPage = ref(1)
            val sentHasMore = ref(false)
            val sentLoading = ref(false)
            val sharees = ref(_uA<UTSJSONObject>())
            val shareesVisible = ref(false)
            val shareesLoading = ref(false)
            val canSubmit = computed(fun(): Boolean {
                return targetPhone.value.trim() != ""
            }
            )
            val minExpireDate = computed(fun(): String {
                val now = Date()
                val month = (now.getMonth() + 1).toString(10).padStart(2, "0")
                val day = now.getDate().toString(10).padStart(2, "0")
                return "" + now.getFullYear() + "-" + month + "-" + day
            }
            )
            val requestPageSize: Number = 1000
            val permanentExpireDate = "2099-12-31"
            val displayDevice = fun(item: UTSJSONObject): String {
                val name = item.getString("deviceName", "")
                if (name != "") {
                    return name
                }
                val plate = item.getString("plateNo", "")
                if (plate != "") {
                    return plate
                }
                return item.getString("deviceId", "设备")
            }
            val getSharePerson = fun(item: UTSJSONObject, nameKey: String, phoneKey: String): String {
                val name = item.getString(nameKey, "")
                if (name != "") {
                    return name
                }
                if (phoneKey != "") {
                    val phone = item.getString(phoneKey, "")
                    if (phone != "") {
                        return phone
                    }
                }
                return "--"
            }
            val statusText = fun(status: String): String {
                if (status == "active") {
                    return "生效中"
                }
                if (status == "exited") {
                    return "已退出"
                }
                if (status == "revoked") {
                    return "已撤销"
                }
                if (status == "expired") {
                    return "已过期"
                }
                return if (status != "") {
                    status
                } else {
                    "未知状态"
                }
            }
            val statusClass = fun(status: String): String {
                return if (status == "active") {
                    "status-active"
                } else {
                    "status-inactive"
                }
            }
            val formatTimestamp = fun(timestamp: Number): String {
                if (timestamp <= 0) {
                    return "--"
                }
                val date = Date(timestamp * 1000)
                return "" + date.getFullYear() + "-" + (date.getMonth() + 1).toString(10).padStart(2, "0") + "-" + date.getDate().toString(10).padStart(2, "0") + " " + date.getHours().toString(10).padStart(2, "0") + ":" + date.getMinutes().toString(10).padStart(2, "0")
            }
            val formatExpireTime = fun(item: UTSJSONObject): String {
                val value = item["expireTime"] as Number?
                return if (value == null || value <= 0) {
                    "永久"
                } else {
                    formatTimestamp(value)
                }
            }
            val loadSent = fun(reset: Boolean): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (sentLoading.value) {
                            return@w1
                        }
                        if (reset) {
                            sentPage.value = 1
                            sentHasMore.value = false
                            sentShares.value = _uA()
                            sentTotalCount.value = 0
                        }
                        sentLoading.value = true
                        try {
                            val res = await(getSentDeviceShares(_uO("pageNum" to sentPage.value, "pageSize" to requestPageSize)))
                            if (res.code != 200) {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "获取分享列表失败"
                                }
                                , icon = "none"))
                                return@w1
                            }
                            val data = res.data
                            sentTotalCount.value = data.totalCount
                            sentShares.value = if (reset) {
                                data.list
                            } else {
                                sentShares.value.concat(data.list)
                            }
                            val currentPage = if (data.currPage > 0) {
                                data.currPage
                            } else {
                                sentPage.value
                            }
                            val totalPage = if (data.totalPage > 0) {
                                data.totalPage
                            } else {
                                1
                            }
                            sentHasMore.value = currentPage < totalPage
                            if (sentHasMore.value) {
                                sentPage.value = currentPage + 1
                            }
                        }
                         catch (error: Throwable) {
                            console.error("获取发起分享列表失败:", error)
                            showAppToast(ShowToastOptions(title = "获取分享列表失败，请重试", icon = "none"))
                        }
                         finally {
                            sentLoading.value = false
                        }
                })
            }
            val submitShare = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (submitting.value) {
                            return@w1
                        }
                        if (deviceId.value == "") {
                            showAppToast(ShowToastOptions(title = "设备ID不能为空", icon = "none"))
                            return@w1
                        }
                        val phone = targetPhone.value.trim()
                        if (phone == "") {
                            showAppToast(ShowToastOptions(title = "请填写手机号", icon = "none"))
                            return@w1
                        }
                        if (!UTSRegExp("^1[3-9]\\d{9}\$", "").test(phone)) {
                            showAppToast(ShowToastOptions(title = "请输入正确的手机号", icon = "none"))
                            return@w1
                        }
                        val dateValue = if (expireDate.value == "") {
                            permanentExpireDate
                        } else {
                            expireDate.value
                        }
                        val expireTime = Math.floor(Date("" + dateValue + "T23:59:59").getTime() / 1000)
                        if (expireTime <= Math.floor(Date().getTime() / 1000)) {
                            showAppToast(ShowToastOptions(title = "到期时间必须晚于当前时间", icon = "none"))
                            return@w1
                        }
                        submitting.value = true
                        try {
                            val res = await(createDeviceShare(DeviceShareCreateRequest(deviceId = deviceId.value, targetPhone = phone, expireTime = expireTime)))
                            if (res.code == 200) {
                                showAppToast(ShowToastOptions(title = "分享成功", icon = "success"))
                                targetPhone.value = ""
                                expireDate.value = ""
                                await(loadSent(true))
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "分享失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("发起设备分享失败:", error)
                            showAppToast(ShowToastOptions(title = "分享失败，请重试", icon = "none"))
                        }
                         finally {
                            submitting.value = false
                        }
                })
            }
            val revokeShare = fun(shareId: String): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (shareId == "") {
                            return@w1
                        }
                        try {
                            val res = await(revokeDeviceShare(shareId))
                            if (res.code == 200) {
                                showAppToast(ShowToastOptions(title = "撤销成功", icon = "success"))
                                await(loadSent(true))
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "撤销失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("撤销设备分享失败:", error)
                            showAppToast(ShowToastOptions(title = "撤销失败，请重试", icon = "none"))
                        }
                })
            }
            val confirmRevoke = fun(item: UTSJSONObject): Unit {
                showAppModal(AppModalOptions(title = "撤销分享", content = "确定撤销“" + displayDevice(item) + "”的分享吗？", showCancel = true, success = fun(result){
                    if (result.confirm) {
                        revokeShare(item.getString("shareId", ""))
                    }
                }
                ))
            }
            val showSharees = fun(item: UTSJSONObject): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        sharees.value = _uA()
                        shareesVisible.value = true
                        shareesLoading.value = true
                        try {
                            val res = await(getDeviceSharees(item.getString("deviceId", ""), _uO("pageNum" to 1, "pageSize" to requestPageSize)))
                            if (res.code == 200) {
                                sharees.value = res.data.list
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "获取被分享者失败"
                                }
                                , icon = "none"))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("获取被分享者失败:", error)
                            showAppToast(ShowToastOptions(title = "获取被分享者失败，请重试", icon = "none"))
                        }
                         finally {
                            shareesLoading.value = false
                        }
                })
            }
            val loadMore = fun(): Unit {
                if (sentHasMore.value) {
                    loadSent(false)
                }
            }
            val initializeDeviceShare = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        try {
                            val res = await(getDeviceShareEnabled())
                            if (res.code == 200) {
                                enabled.value = res.data.getBoolean("enabled", false)
                            } else {
                                showAppToast(ShowToastOptions(title = if (res.msg != "") {
                                    res.msg
                                } else {
                                    "获取分享开关失败"
                                }
                                , icon = "none"))
                            }
                            if (enabled.value) {
                                await(loadSent(true))
                            }
                        }
                         catch (error: Throwable) {
                            console.error("初始化设备分享失败:", error)
                            showAppToast(ShowToastOptions(title = "加载分享功能失败，请重试", icon = "none"))
                        }
                         finally {
                            loadingEnabled.value = false
                        }
                })
            }
            onLoad(fun(options){
                deviceId.value = options["deviceId"] as String ?: ""
                deviceName.value = options["deviceName"] as String ?: ""
                initializeDeviceShare()
            }
            )
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_app_toast = resolveEasyComponent("app-toast", GenComponentsAppToastAppToastClass)
                val _component_app_modal = resolveEasyComponent("app-modal", GenComponentsAppModalAppModalClass)
                return _cE(Fragment, null, _uA(
                    _cE("view", _uM("class" to "page"), _uA(
                        _cV(_component_custom_navBar, _uM("title" to "设备分享", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false)),
                        _cE("scroll-view", _uM("class" to "content", "scroll-y" to "true", "onScrolltolower" to loadMore), _uA(
                            if (isTrue(loadingEnabled.value)) {
                                _cE("view", _uM("key" to 0, "class" to "state-card"), _uA(
                                    _cE("text", null, "加载中...")
                                ))
                            } else {
                                if (isTrue(!enabled.value)) {
                                    _cE("view", _uM("key" to 1, "class" to "state-card"), _uA(
                                        _cE("text", _uM("class" to "state-title"), "分享功能暂未开放"),
                                        _cE("text", _uM("class" to "state-desc"), "请稍后再试")
                                    ))
                                } else {
                                    _cE("view", _uM("key" to 2), _uA(
                                        _cE("view", _uM("class" to "share-form card"), _uA(
                                            _cE("view", _uM("class" to "form-row"), _uA(
                                                _cE("text", _uM("class" to "form-label"), "分享设备"),
                                                _cE("text", _uM("class" to "form-value"), _tD(deviceName.value), 1)
                                            )),
                                            _cE("view", _uM("class" to "form-row input-row"), _uA(
                                                _cE("text", _uM("class" to "form-label"), "手机号"),
                                                _cE("input", _uM("class" to "form-input", "modelValue" to targetPhone.value, "onInput" to fun(`$event`: UniInputEvent){
                                                    targetPhone.value = `$event`.detail.value
                                                }
                                                , "type" to "number", "maxlength" to "20", "placeholder" to "请输入被分享者手机号", "placeholder-style" to "font-size: 24rpx; color: #c0c4cc;"), null, 40, _uA(
                                                    "modelValue",
                                                    "onInput"
                                                ))
                                            )),
                                            _cE("view", _uM("class" to "form-row"), _uA(
                                                _cE("text", _uM("class" to "form-label"), "有效期"),
                                                _cE("view", _uM("class" to "expire-actions"), _uA(
                                                    if (expireDate.value == "") {
                                                        _cE("text", _uM("key" to 0, "class" to "form-value"), "永久")
                                                    } else {
                                                        _cC("v-if", true)
                                                    }
                                                ))
                                            )),
                                            _cE("view", _uM("style" to _nS(_uM("margin-top" to "20rpx"))), _uA(
                                                _cE("button", _uM("class" to _nC(_uA(
                                                    "primary-button",
                                                    _uM("button-disabled" to (submitting.value || !canSubmit.value))
                                                )), "disabled" to (submitting.value || !canSubmit.value), "onClick" to submitShare), _tD(if (submitting.value) {
                                                    "提交中..."
                                                } else {
                                                    "确认分享"
                                                }
                                                ), 11, _uA(
                                                    "disabled"
                                                ))
                                            ), 4)
                                        )),
                                        _cE("view", _uM("class" to "tabs card"), _uA(
                                            _cE("text", _uM("class" to "tab tab-active"), "我发起的 " + _tD(sentTotalCount.value), 1)
                                        )),
                                        _cE("view", _uM("class" to "list-section"), _uA(
                                            if (isTrue(sentLoading.value && sentShares.value.length == 0)) {
                                                _cE("view", _uM("key" to 0, "class" to "state-card"), _uA(
                                                    _cE("text", null, "加载中...")
                                                ))
                                            } else {
                                                if (sentShares.value.length == 0) {
                                                    _cE("view", _uM("key" to 1, "class" to "state-card"), _uA(
                                                        _cE("text", _uM("style" to _nS(_uM("color" to "#999"))), "暂无发起的分享", 4)
                                                    ))
                                                } else {
                                                    _cC("v-if", true)
                                                }
                                            }
                                            ,
                                            _cE(Fragment, null, RenderHelpers.renderList(sentShares.value, fun(item, __key, __index, _cached): Any {
                                                return _cE("view", _uM("key" to item.getString("shareId", ""), "class" to "share-card card"), _uA(
                                                    _cE("view", _uM("class" to "share-card-header"), _uA(
                                                        _cE("view", _uM("class" to "device-meta"), _uA(
                                                            _cE("text", _uM("class" to "device-title"), _tD(displayDevice(item)), 1),
                                                            _cE("text", _uM("class" to "plate"), _tD(item.getString("plateNo", "")), 1)
                                                        )),
                                                        _cE("text", _uM("class" to _nC(_uA(
                                                            "status",
                                                            statusClass(item.getString("status", ""))
                                                        ))), _tD(statusText(item.getString("status", ""))), 3)
                                                    )),
                                                    _cE("view", _uM("class" to "detail-line"), _uA(
                                                        _cE("text", null, "分享给"),
                                                        _cE("text", _uM("class" to "detail-value"), _tD(getSharePerson(item, "targetNickName", "targetPhoneMasked")), 1)
                                                    )),
                                                    _cE("view", _uM("class" to "detail-line"), _uA(
                                                        _cE("text", null, "角色"),
                                                        _cE("text", _uM("class" to "detail-value"), _tD(item.getString("role", "view")), 1)
                                                    )),
                                                    _cE("view", _uM("class" to "detail-line"), _uA(
                                                        _cE("text", null, "分享时间"),
                                                        _cE("text", _uM("class" to "detail-value"), _tD(formatTimestamp(item.getNumber("shareTime", 0))), 1)
                                                    )),
                                                    _cE("view", _uM("class" to "detail-line"), _uA(
                                                        _cE("text", null, "到期时间"),
                                                        _cE("text", _uM("class" to "detail-value"), _tD(formatExpireTime(item)), 1)
                                                    )),
                                                    _cE("view", _uM("class" to "card-actions"), _uA(
                                                        _cE("button", _uM("class" to "plain-button", "onClick" to fun(){
                                                            showSharees(item)
                                                        }
                                                        ), "查看被分享者", 8, _uA(
                                                            "onClick"
                                                        )),
                                                        if (item.getString("status", "") == "active") {
                                                            _cE("button", _uM("key" to 0, "class" to "danger-button", "onClick" to fun(){
                                                                confirmRevoke(item)
                                                            }), "撤销分享", 8, _uA(
                                                                "onClick"
                                                            ))
                                                        } else {
                                                            _cC("v-if", true)
                                                        }
                                                    ))
                                                ))
                                            }
                                            ), 128),
                                            if (isTrue(sentHasMore.value)) {
                                                _cE("button", _uM("key" to 2, "class" to "more-button", "disabled" to sentLoading.value, "onClick" to loadMore), _tD(if (sentLoading.value) {
                                                    "加载中..."
                                                } else {
                                                    "加载更多"
                                                }), 9, _uA(
                                                    "disabled"
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        ))
                                    ))
                                }
                            }
                        ), 32),
                        if (isTrue(shareesVisible.value)) {
                            _cE("view", _uM("key" to 0, "class" to "modal-mask", "onClick" to fun(){
                                shareesVisible.value = false
                            }), _uA(
                                _cE("view", _uM("class" to "sharees-modal", "onClick" to withModifiers(fun(){}, _uA(
                                    "stop"
                                ))), _uA(
                                    _cE("view", _uM("class" to "modal-header"), _uA(
                                        _cE("text", _uM("class" to "section-title"), "被分享者"),
                                        _cE("text", _uM("class" to "modal-close", "onClick" to fun(){
                                            shareesVisible.value = false
                                        }), "×", 8, _uA(
                                            "onClick"
                                        ))
                                    )),
                                    _cE("scroll-view", _uM("class" to "sharees-list", "scroll-y" to "true"), _uA(
                                        if (isTrue(shareesLoading.value)) {
                                            _cE("view", _uM("key" to 0, "class" to "state-card"), _uA(
                                                _cE("text", null, "加载中...")
                                            ))
                                        } else {
                                            if (sharees.value.length == 0) {
                                                _cE("view", _uM("key" to 1, "class" to "state-card"), _uA(
                                                    _cE("text", null, "暂无被分享者")
                                                ))
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        },
                                        _cE(Fragment, null, RenderHelpers.renderList(sharees.value, fun(item, __key, __index, _cached): Any {
                                            return _cE("view", _uM("key" to item.getString("shareId", ""), "class" to "sharee-row"), _uA(
                                                _cE("view", null, _uA(
                                                    _cE("text", _uM("class" to "device-title"), _tD(getSharePerson(item, "targetNickName", "")), 1),
                                                    _cE("text", _uM("class" to "masked-phone"), _tD(item.getString("targetPhoneMasked", "")), 1)
                                                )),
                                                _cE("text", _uM("class" to _nC(_uA(
                                                    "status",
                                                    statusClass(item.getString("status", ""))
                                                ))), _tD(statusText(item.getString("status", ""))), 3)
                                            ))
                                        }), 128)
                                    ))
                                ), 8, _uA(
                                    "onClick"
                                ))
                            ), 8, _uA(
                                "onClick"
                            ))
                        } else {
                            _cC("v-if", true)
                        }
                    )),
                    _cV(_component_app_toast),
                    _cV(_component_app_modal)
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
                return _uM("page" to _pS(_uM("height" to "100%", "backgroundColor" to "#f5f7fa", "display" to "flex", "flexDirection" to "column")), "content" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "boxSizing" to "border-box")), "card" to _pS(_uM("backgroundColor" to "#ffffff", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "marginBottom" to "20rpx")), "share-form" to _pS(_uM("paddingTop" to "28rpx", "paddingRight" to "28rpx", "paddingBottom" to "28rpx", "paddingLeft" to "28rpx")), "section-title" to _pS(_uM("color" to "#303133", "fontSize" to "32rpx", "fontWeight" to 600)), "form-row" to _pS(_uM("minHeight" to "82rpx", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")), "form-label" to _pS(_uM("width" to "160rpx", "color" to "#606266", "fontSize" to "28rpx")), "form-value" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "color" to "#303133", "fontSize" to "28rpx", "textAlign" to "right")), "input-row" to _pS(_uM("alignItems" to "center")), "form-input" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "height" to "76rpx", "color" to "#303133", "fontSize" to "28rpx", "textAlign" to "right")), "expire-actions" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "flex-end")), "date-button" to _pS(_uM("color" to "#2979ff", "fontSize" to "26rpx", "marginLeft" to "18rpx")), "clear-date" to _pS(_uM("color" to "#999999", "fontSize" to "26rpx", "marginLeft" to "18rpx")), "form-tip" to _pS(_uM("color" to "#999999", "fontSize" to "24rpx", "paddingTop" to "20rpx", "paddingRight" to 0, "paddingBottom" to "20rpx", "paddingLeft" to 0)), "primary-button" to _pS(_uM("borderTopWidth" to 0, "borderRightWidth" to 0, "borderBottomWidth" to 0, "borderLeftWidth" to 0, "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "fontSize" to "27rpx", "lineHeight" to "76rpx", "height" to "76rpx", "backgroundColor" to "#2979ff", "color" to "#ffffff", "width" to "100%")), "plain-button" to _pS(_uM("borderTopWidth" to 0, "borderRightWidth" to 0, "borderBottomWidth" to 0, "borderLeftWidth" to 0, "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "fontSize" to "27rpx", "lineHeight" to "76rpx", "height" to "76rpx", "color" to "#2979ff", "backgroundColor" to "#eef5ff", "marginRight" to "16rpx", "paddingTop" to 0, "paddingRight" to "20rpx", "paddingBottom" to 0, "paddingLeft" to "20rpx")), "danger-button" to _pS(_uM("borderTopWidth" to 0, "borderRightWidth" to 0, "borderBottomWidth" to 0, "borderLeftWidth" to 0, "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "fontSize" to "27rpx", "lineHeight" to "76rpx", "height" to "76rpx", "color" to "#e45656", "backgroundColor" to "#fff0f0", "paddingTop" to 0, "paddingRight" to "20rpx", "paddingBottom" to 0, "paddingLeft" to "20rpx")), "more-button" to _pS(_uM("borderTopWidth" to 0, "borderRightWidth" to 0, "borderBottomWidth" to 0, "borderLeftWidth" to 0, "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "fontSize" to "27rpx", "lineHeight" to "76rpx", "height" to "76rpx", "width" to "100%", "color" to "#2979ff", "backgroundColor" to "#ffffff", "marginBottom" to "24rpx")), "button-disabled" to _pS(_uM("opacity" to 0.6)), "tabs" to _pS(_uM("height" to "84rpx", "display" to "flex", "flexDirection" to "row")), "tab" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "textAlign" to "center", "lineHeight" to "84rpx", "color" to "#909399", "fontSize" to "29rpx")), "tab-active" to _pS(_uM("color" to "#2979ff", "fontWeight" to 600)), "share-card" to _pS(_uM("paddingTop" to "26rpx", "paddingRight" to "26rpx", "paddingBottom" to "26rpx", "paddingLeft" to "26rpx")), "share-card-header" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "flex-start", "marginBottom" to "18rpx")), "device-meta" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%")), "device-title" to _pS(_uM("color" to "#303133", "fontSize" to "30rpx", "fontWeight" to 600)), "plate" to _pS(_uM("color" to "#909399", "fontSize" to "24rpx", "marginTop" to "8rpx", "display" to "flex")), "masked-phone" to _pS(_uM("color" to "#909399", "fontSize" to "24rpx", "marginTop" to "8rpx", "display" to "flex")), "status" to _pS(_uM("paddingTop" to "6rpx", "paddingRight" to "14rpx", "paddingBottom" to "6rpx", "paddingLeft" to "14rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "fontSize" to "23rpx")), "status-active" to _pS(_uM("color" to "#19a15f", "backgroundColor" to "#e8f8ef")), "status-inactive" to _pS(_uM("color" to "#909399", "backgroundColor" to "#f0f1f3")), "detail-line" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "paddingTop" to "10rpx", "paddingRight" to 0, "paddingBottom" to "10rpx", "paddingLeft" to 0, "color" to "#909399", "fontSize" to "25rpx")), "detail-value" to _pS(_uM("color" to "#606266")), "card-actions" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "flex-end", "marginTop" to "16rpx")), "state-card" to _pS(_uM("paddingTop" to "70rpx", "paddingRight" to "30rpx", "paddingBottom" to "70rpx", "paddingLeft" to "30rpx", "textAlign" to "center", "color" to "#909399", "fontSize" to "27rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "16rpx", "borderTopRightRadius" to "16rpx", "borderBottomRightRadius" to "16rpx", "borderBottomLeftRadius" to "16rpx", "marginBottom" to "20rpx")), "state-title" to _pS(_uM("color" to "#606266", "fontSize" to "34rpx", "fontWeight" to 600, "marginBottom" to "16rpx")), "state-desc" to _pS(_uM("color" to "#909399")), "modal-mask" to _pS(_uM("position" to "fixed", "left" to 0, "right" to 0, "top" to 0, "bottom" to 0, "display" to "flex", "alignItems" to "center", "justifyContent" to "center", "backgroundColor" to "rgba(0,0,0,0.5)", "zIndex" to 1000)), "sharees-modal" to _pS(_uM("width" to "680rpx", "maxHeight" to "1200rpx", "backgroundColor" to "#ffffff", "borderTopLeftRadius" to "18rpx", "borderTopRightRadius" to "18rpx", "borderBottomRightRadius" to "18rpx", "borderBottomLeftRadius" to "18rpx", "overflow" to "hidden")), "modal-header" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "28rpx", "paddingRight" to "28rpx", "paddingBottom" to "28rpx", "paddingLeft" to "28rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#eeeeee")), "modal-close" to _pS(_uM("color" to "#909399", "fontSize" to "46rpx", "lineHeight" to "36rpx")), "sharees-list" to _pS(_uM("maxHeight" to "700rpx")), "sharee-row" to _pS(_uM("display" to "flex", "flexDirection" to "row", "justifyContent" to "space-between", "alignItems" to "center", "paddingTop" to "24rpx", "paddingRight" to "28rpx", "paddingBottom" to "24rpx", "paddingLeft" to "28rpx", "borderBottomWidth" to "1rpx", "borderBottomStyle" to "solid", "borderBottomColor" to "#f0f0f0")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
