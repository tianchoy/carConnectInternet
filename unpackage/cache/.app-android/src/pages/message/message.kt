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
import io.dcloud.uniapp.extapi.getStorageSync as uni_getStorageSync
import io.dcloud.uniapp.extapi.vibrateLong as uni_vibrateLong
open class GenPagesMessageMessage : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {}
    companion object {
        @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
        var setup: (__props: GenPagesMessageMessage) -> Any? = fun(__props): Any? {
            val __ins = getCurrentInstance()!!
            val _ctx = __ins.proxy as GenPagesMessageMessage
            val _cache = __ins.renderCache
            val modal = ref(null)
            val modalContent = ref(_uO())
            val refresherTriggered = ref(false)
            val msgList = ref(_uA<UTSJSONObject>())
            val currPage = ref(1)
            val pageSize = ref(10)
            val totalPage = ref(1)
            val loadStatus = ref("loadmore")
            val isLoading = ref(false)
            val hasNewMessages = ref(false)
            val newMessageCount = ref(0)
            val lastUpdateTime = ref(Date().getTime())
            val Login = ref(false)
            var checkTimer: Number? = null
            val isPageActive = ref(false)
            onLoad(fun(_options){
                val token = uni_getStorageSync("token")
                if (isTruthy(token)) {
                    Login.value = true
                    loadMsgList(true)
                } else {
                    Login.value = false
                }
            }
            )
            onShow(fun(){
                if (Login.value) {
                    console.log("页面显示 - 启动自动刷新", " at pages/message/message.uvue:101")
                    isPageActive.value = true
                    startNewMessageCheck()
                    checkNewMessages()
                }
            }
            )
            onHide(fun(){
                console.log("页面隐藏 - 停止自动刷新", " at pages/message/message.uvue:111")
                if (Login.value) {
                    console.log("页面隐藏 - 停止自动刷新", " at pages/message/message.uvue:113")
                    isPageActive.value = false
                    stopNewMessageCheck()
                }
            }
            )
            onUnload(fun(){
                console.log("页面卸载 - 清理资源", " at pages/message/message.uvue:121")
                if (Login.value) {
                    console.log("页面卸载 - 清理资源", " at pages/message/message.uvue:123")
                    isPageActive.value = false
                    stopNewMessageCheck()
                }
            }
            )
            onActivated(fun(){
                console.log("页面激活 - 启动自动刷新", " at pages/message/message.uvue:130")
                if (Login.value) {
                    console.log("页面激活 - 启动自动刷新", " at pages/message/message.uvue:132")
                    isPageActive.value = true
                    startNewMessageCheck()
                    checkNewMessages()
                }
            }
            )
            onDeactivated(fun(){
                console.log("页面停用 - 停止自动刷新", " at pages/message/message.uvue:141")
                if (Login.value) {
                    console.log("页面停用 - 停止自动刷新", " at pages/message/message.uvue:143")
                    isPageActive.value = false
                    stopNewMessageCheck()
                }
            }
            )
            val onRefresherRefresh = fun(){
                console.log("下拉刷新触发", " at pages/message/message.uvue:151")
                refresherTriggered.value = true
                loadMsgList(true).then(fun(){
                    refresherTriggered.value = false
                }
                ).`catch`(fun(){
                    refresherTriggered.value = false
                }
                )
            }
            val onScrollToLower = fun(){
                console.log("滚动到底部 - 当前页:", currPage.value, "总页数:", totalPage.value, " at pages/message/message.uvue:162")
                if (loadStatus.value == "loadmore" && !isLoading.value) {
                    loadMore()
                }
            }
            val startNewMessageCheck = fun(){
                if (isTruthy(checkTimer)) {
                    stopNewMessageCheck()
                }
                console.log("启动定时消息检查", " at pages/message/message.uvue:174")
                checkTimer = setInterval(fun(){
                    if (isPageActive.value) {
                        console.log("定时检查新消息...", " at pages/message/message.uvue:178")
                        checkNewMessages()
                    }
                }
                , 10000)
            }
            val stopNewMessageCheck = fun(){
                if (isTruthy(checkTimer)) {
                    console.log("停止定时消息检查", " at pages/message/message.uvue:187")
                    clearInterval(checkTimer)
                    checkTimer = null
                }
            }
            val checkNewMessages = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (!isPageActive.value) {
                            console.log("页面不活跃，跳过新消息检查", " at pages/message/message.uvue:197")
                            return@w1
                        }
                        if (isLoading.value) {
                            console.log("正在加载中，跳过新消息检查", " at pages/message/message.uvue:203")
                            return@w1
                        }
                        try {
                            console.log("开始检查新消息...", " at pages/message/message.uvue:208")
                            val res = await(getUserMsgList(_uO("page" to 1, "pageSize" to 1)))
                            if (res.code == 0 && res.msg == "success") {
                                val data = if (isTruthy(res.data)) {
                                    res.data
                                } else {
                                    _uO("list" to _uA(), "total" to 0)
                                }
                                val latestMessage = data.list?.get(0)
                                if (isTruthy(latestMessage) && isTruthy(latestMessage.createTime)) {
                                    val messageTime = Date(latestMessage.createTime).getTime()
                                    if (messageTime > lastUpdateTime.value) {
                                        hasNewMessages.value = true
                                        vibrateAlert()
                                        val countRes = await(getUserMsgList(_uO("page" to 1, "pageSize" to 50)))
                                        if (countRes.code == 0) {
                                            val newMessages = countRes.data?.list?.filter(fun(msg: UTSJSONObject): Boolean {
                                                return Date(msg["createTime"]).getTime() > lastUpdateTime.value
                                            }
                                            ) || _uA()
                                            newMessageCount.value = newMessages.length
                                            console.log("新消息数量:", newMessageCount.value, " at pages/message/message.uvue:235")
                                        }
                                    } else {
                                        console.log("没有发现新消息", " at pages/message/message.uvue:238")
                                    }
                                }
                            }
                        }
                         catch (error: Throwable) {
                            console.error("检查新消息失败:", error, " at pages/message/message.uvue:243")
                        }
                })
            }
            val vibrateAlert = fun(){
                run {
                    var i: Number = 0
                    while(i < 3){
                        uni_vibrateLong()
                        i++
                    }
                }
            }
            val loadNewMessages = fun(){
                console.log("加载新消息", " at pages/message/message.uvue:256")
                loadMsgList(true).then(fun(){
                    hasNewMessages.value = false
                    newMessageCount.value = 0
                    lastUpdateTime.value = Date().getTime()
                    console.log("新消息加载完成", " at pages/message/message.uvue:261")
                }
                )
            }
            val loadMsgList = fun(isInit: Boolean = false): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        if (isInit) {
                            currPage.value = 1
                            msgList.value = _uA()
                            loadStatus.value = "loadmore"
                        }
                        if (isLoading.value) {
                            return@w1
                        }
                        isLoading.value = true
                        try {
                            if (!isInit) {
                                loadStatus.value = "loading"
                            }
                            console.log("请求数据 - 页码:", currPage.value, " at pages/message/message.uvue:281")
                            val res = await(getUserMsgList(_uO("page" to currPage.value, "pageSize" to pageSize.value)))
                            if (res.code == 0 && res.msg == "success") {
                                val data = if (isTruthy(res.data)) {
                                    res.data
                                } else {
                                    _uO("list" to _uA(), "totalPage" to 0)
                                }
                                totalPage.value = if (isTruthy(data.totalPage)) {
                                    data.totalPage
                                } else {
                                    1
                                }
                                console.log("第", currPage.value, "页接口返回:", data, " at pages/message/message.uvue:293")
                                console.log("第", currPage.value, "页列表长度:", data.list?.length, " at pages/message/message.uvue:294")
                                if (isInit) {
                                    msgList.value = if (isTruthy(data.list)) {
                                        data.list
                                    } else {
                                        _uA()
                                    }
                                    if (isTruthy(data.list) && data.list.length > 0) {
                                        lastUpdateTime.value = Date().getTime()
                                    }
                                } else {
                                    val newData = if (isTruthy(data.list)) {
                                        data.list
                                    } else {
                                        _uA()
                                    }
                                    console.log("即将添加的新数据长度:", newData.length, " at pages/message/message.uvue:304")
                                    val existingIds = Set(msgList.value.map(fun(item): Any {
                                        return item["messageId"]
                                    }))
                                    val uniqueNewData = newData.filter(fun(item: UTSJSONObject): Boolean {
                                        return !existingIds.has(item["messageId"])
                                    })
                                    if (uniqueNewData.length > 0) {
                                        msgList.value = msgList.value.concat(uniqueNewData)
                                    }
                                }
                                if (currPage.value >= totalPage.value) {
                                    loadStatus.value = "nomore"
                                } else {
                                    loadStatus.value = "loadmore"
                                }
                                if (isInit) {
                                    hasNewMessages.value = false
                                    newMessageCount.value = 0
                                }
                            } else {
                                loadStatus.value = "loadmore"
                                console.error("接口返回错误:", res.msg, " at pages/message/message.uvue:329")
                            }
                        }
                         catch (error: Throwable) {
                            loadStatus.value = "loadmore"
                            console.error("请求异常:", error, " at pages/message/message.uvue:333")
                        }
                         finally {
                            isLoading.value = false
                        }
                })
            }
            val loadMore = fun(): UTSPromise<Unit> {
                return wrapUTSPromise(suspend w1@{
                        console.log("准备加载更多 - 当前页:", currPage.value, "总页数:", totalPage.value, " at pages/message/message.uvue:341")
                        if (isLoading.value || loadStatus.value != "loadmore" || currPage.value >= totalPage.value) {
                            if (currPage.value >= totalPage.value) {
                                loadStatus.value = "nomore"
                            }
                            return@w1
                        }
                        currPage.value++
                        await(loadMsgList())
                })
            }
            val handleItemClick = fun(item): UTSPromise<Unit> {
                return wrapUTSPromise(suspend {
                        modalContent.value = item
                        modal.value?.open()
                        if (item.status == 1) {
                            try {
                                val res = await(setMsgState(item.messageId))
                                if (res.msg == "success") {
                                    val index = msgList.value.findIndex(fun(msg): Boolean {
                                        return msg["messageId"] == item.messageId
                                    }
                                    )
                                    if (index !== -1) {
                                        msgList.value[index]["status"] = 0
                                        msgList.value = msgList.value.slice()
                                    }
                                }
                            }
                             catch (error: Throwable) {
                                console.error("更新状态失败:", error, " at pages/message/message.uvue:370")
                            }
                        }
                })
            }
            val ReadIt = fun(){
                modal.value?.close()
            }
            val getMessageTypeText = fun(type: Number): String {
                when (type) {
                    1 -> 
                        return "警告"
                    2 -> 
                        return "事件"
                    else -> 
                        return "通知"
                }
            }
            val formatTime = fun(timeString: String): String {
                if (!(timeString != "")) {
                    return ""
                }
                try {
                    val date = Date(timeString)
                    val now = Date()
                    val diff = now.getTime() - date.getTime()
                    val minutes = Math.floor(diff / 60000)
                    val hours = Math.floor(diff / 3600000)
                    val days = Math.floor(diff / 86400000)
                    if (minutes < 1) {
                        return "刚刚"
                    }
                    if (minutes < 60) {
                        return "" + minutes + "分钟前"
                    }
                    if (hours < 24) {
                        return "" + hours + "小时前"
                    }
                    if (days < 7) {
                        return "" + days + "天前"
                    }
                    return "" + (date.getMonth() + 1) + "-" + date.getDate()
                }
                 catch (error: Throwable) {
                    return timeString
                }
            }
            return fun(): Any? {
                val _component_custom_navBar = resolveEasyComponent("custom-navBar", GenComponentsCustomNavBarCustomNavBarClass)
                val _component_i_modal = resolveEasyComponent("i-modal", GenUniModulesIUiXComponentsIModalIModalClass)
                return _cE(Fragment, null, _uA(
                    _cV(_component_custom_navBar, _uM("title" to "消息中心", "show-back" to true, "backgroundColor" to "#fff", "textColor" to "#333", "showCapsule" to false, "isShowStyle" to true)),
                    _cE("view", _uM("class" to "container"), _uA(
                        _cE("scroll-view", _uM("scroll-y" to "", "class" to "scroll-container", "refresher-enabled" to "", "refresher-triggered" to refresherTriggered.value, "lower-threshold" to 100, "onRefresherrefresh" to onRefresherRefresh, "onScrolltolower" to onScrollToLower), _uA(
                            _cE("view", _uM("class" to "list-box"), _uA(
                                if (isTrue(msgList.value.length == 0 && !isLoading.value)) {
                                    _cE("view", _uM("key" to 0, "class" to "empty-state"), _uA(
                                        _cE("text", null, "暂无消息")
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                                ,
                                if (isTrue(hasNewMessages.value)) {
                                    _cE("view", _uM("key" to 1, "class" to "new-message-tip", "onClick" to loadNewMessages), _uA(
                                        _cE("text", null, "有 " + _tD(newMessageCount.value) + " 条新消息，点击查看", 1)
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                                ,
                                _cE(Fragment, null, RenderHelpers.renderList(msgList.value, fun(item, index, __index, _cached): Any {
                                    return _cE("view", _uM("key" to if (isTruthy(item["messageId"])) {
                                        item["messageId"]
                                    } else {
                                        index
                                    }
                                    , "class" to "message-item", "onClick" to fun(){
                                        handleItemClick(item)
                                    }
                                    ), _uA(
                                        _cE("view", _uM("class" to "message-header"), _uA(
                                            _cE("text", _uM("class" to "message-title"), _tD(getMessageTypeText(item["messageType"]) + " - " + item["createTime"]), 1),
                                            _cE("text", _uM("class" to "time-text"), _tD(formatTime(item["createTime"])), 1)
                                        )),
                                        _cE("view", _uM("class" to "message-content-row"), _uA(
                                            _cE("text", _uM("class" to "message-content"), _tD(item["content"]), 1),
                                            if (item["status"] == 1) {
                                                _cE("text", _uM("key" to 0, "class" to "unread-badge"), "未读")
                                            } else {
                                                _cC("v-if", true)
                                            }
                                        ))
                                    ), 8, _uA(
                                        "onClick"
                                    ))
                                }
                                ), 128),
                                if (isTrue(Login.value)) {
                                    _cE("view", _uM("key" to 2, "class" to "load-more"), _uA(
                                        if (loadStatus.value == "loading") {
                                            _cE("text", _uM("key" to 0), "加载中...")
                                        } else {
                                            if (loadStatus.value == "nomore") {
                                                _cE("text", _uM("key" to 1), "没有更多了")
                                            } else {
                                                _cE("text", _uM("key" to 2), "上拉加载更多")
                                            }
                                        }
                                    ))
                                } else {
                                    _cC("v-if", true)
                                }
                            ))
                        ), 40, _uA(
                            "refresher-triggered"
                        )),
                        _cV(_component_i_modal, _uM("ref_key" to "modal", "ref" to modal, "title" to getMessageTypeText(modalContent.value["messageType"]), "content" to modalContent.value["content"], "onConfirm" to ReadIt), null, 8, _uA(
                            "title",
                            "content"
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
                return _uM("container" to _pS(_uM("width" to "100%", "height" to "100%", "backgroundColor" to "#f5f5f5", "marginTop" to "170rpx", "position" to "relative")), "scroll-container" to _uM(".container " to _uM("height" to "100%", "width" to "100%")), "list-box" to _uM(".container " to _uM("width" to "100%", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "position" to "relative")), "message-item" to _uM(".container .list-box " to _uM("marginBottom" to "20rpx", "paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "backgroundColor" to "#ffffff")), "message-header" to _uM(".container .list-box " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between")), "message-content-row" to _uM(".container .list-box " to _uM("display" to "flex", "flexDirection" to "row", "alignItems" to "center", "justifyContent" to "space-between", "marginTop" to "16rpx")), "message-title" to _uM(".container .list-box " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "fontSize" to "30rpx", "color" to "#333333", "whiteSpace" to "nowrap", "textOverflow" to "ellipsis", "overflow" to "hidden")), "message-content" to _uM(".container .list-box " to _uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "fontSize" to "26rpx", "color" to "#666666", "whiteSpace" to "nowrap", "textOverflow" to "ellipsis", "overflow" to "hidden")), "unread-badge" to _uM(".container .list-box " to _uM("marginLeft" to "16rpx", "paddingTop" to "4rpx", "paddingRight" to "12rpx", "paddingBottom" to "4rpx", "paddingLeft" to "12rpx", "borderTopLeftRadius" to "20rpx", "borderTopRightRadius" to "20rpx", "borderBottomRightRadius" to "20rpx", "borderBottomLeftRadius" to "20rpx", "backgroundColor" to "#f56c6c", "color" to "#ffffff", "fontSize" to "22rpx")), "empty-state" to _uM(".container .list-box " to _uM("textAlign" to "center", "paddingTop" to "50rpx", "paddingRight" to 0, "paddingBottom" to "50rpx", "paddingLeft" to 0, "color" to "#999999", "fontSize" to "28rpx")), "new-message-tip" to _uM(".container .list-box " to _uM("backgroundImage" to "linear-gradient(135deg, #2979ff, #07c160)", "backgroundColor" to "rgba(0,0,0,0)", "color" to "#FFFFFF", "paddingTop" to "20rpx", "paddingRight" to "20rpx", "paddingBottom" to "20rpx", "paddingLeft" to "20rpx", "textAlign" to "center", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "marginBottom" to "20rpx", "fontSize" to "26rpx")), "load-more" to _uM(".container .list-box " to _uM("paddingTop" to "30rpx", "paddingRight" to 0, "paddingBottom" to "30rpx", "paddingLeft" to 0, "textAlign" to "center", "color" to "#999999", "fontSize" to "26rpx")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
