import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_i_modal from '@/uni_modules/i-ui-x/components/i-modal/i-modal.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { ref, onActivated, onDeactivated } from 'vue'
	import { getUserMsgList, setMsgState } from '../../api/request.uts'

	type ModalInstance = { __$originalPosition?: UTSSourceMapPosition<"ModalInstance", "pages/message/message.uvue", 62, 7>;
		open: () => void
		close: () => void
	}

	type MessageData = { __$originalPosition?: UTSSourceMapPosition<"MessageData", "pages/message/message.uvue", 86, 7>;
		list: Array<UTSJSONObject>
		total: number
		totalPage: number
	};
	type MessageResponse = { __$originalPosition?: UTSSourceMapPosition<"MessageResponse", "pages/message/message.uvue", 91, 7>;
		code: number
		msg: string
		data: MessageData
	};

	// 停止新消息检查
	
const __sfc__ = defineComponent({
  __name: 'message',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const modal = ref<boolean>(false)
	const modalContent = ref<UTSJSONObject>({})
	const refresherTriggered = ref(false)

	// 消息列表相关
	const msgList = ref<UTSJSONObject[]>([])
	const currPage = ref(1)          // 当前页码
	const pageSize = ref(10)         // 每页条数
	const totalPage = ref(1)         // 总页数
	const loadStatus = ref('loadmore') // 加载状态
	const isLoading = ref(false)     // 是否正在加载中
	const hasNewMessages = ref(false) // 是否有新消息
	const newMessageCount = ref(0)   // 新消息数量
	const lastUpdateTime = ref(new Date().getTime()) // 最后更新时间
	const Login = ref(false)

	// 定时器相关
	let checkTimer: number = 0
	const isPageActive = ref(false)
	function stopNewMessageCheck() : void {
		if (checkTimer > 0) {
			console.log('停止定时消息检查', " at pages/message/message.uvue:100")
			clearInterval(checkTimer)
			checkTimer = 0
		}
	}

	// 震动报警函数
	function vibrateAlert() : void {
		for (let i = 0; i < 3; i++) {
			uni.vibrateLong({})
		}
	}

	// 检查新消息
	async function checkNewMessages() : Promise<void> {
		if (!isPageActive.value || isLoading.value) return
		try {
			const res = await getUserMsgList({ page: 1, pageSize: 1 })
			const code = res.code
			if (code != 0) return
			const data = res.data
			const list = data.list
			if (list == null || list.length == 0) return
			const latestMessage = list[0]
			const createTime = latestMessage.getString('createTime', '')
			if (createTime == '') return
			const messageTime = new Date(createTime).getTime()
			if (messageTime <= lastUpdateTime.value) return
			hasNewMessages.value = true
			vibrateAlert()
			const countRes = await getUserMsgList({ page: 1, pageSize: 50 })
			const newList = countRes.data.list
			if (newList != null) {
				let count = 0
				newList.forEach((message : UTSJSONObject) : void => {
					if (new Date(message.getString('createTime', '')).getTime() > lastUpdateTime.value) count++
				})
				newMessageCount.value = count
			}
		} catch (error) {
			console.error('检查新消息失败:', error, " at pages/message/message.uvue:140")
		}
	}

	// 启动新消息检查
	function startNewMessageCheck() : void {
		if (checkTimer > 0) {
			stopNewMessageCheck()
		}

		console.log('启动定时消息检查', " at pages/message/message.uvue:150")
		// 每10秒检查一次新消息
		checkTimer = setInterval(() => {
			if (isPageActive.value) {
				console.log('定时检查新消息...', " at pages/message/message.uvue:154")
				checkNewMessages()
			}
		}, 10000)
	}


	// 加载消息列表
	async function loadMsgList(isInit : boolean = false) : Promise<void> {
		if (isInit) {
			currPage.value = 1
			msgList.value = []
			loadStatus.value = 'loadmore'
		}
		if (isLoading.value) return
		isLoading.value = true
		try {
			if (!isInit) loadStatus.value = 'loading'
			const res = await getUserMsgList({
				page: currPage.value,
				pageSize: pageSize.value
			})
			if (res.code != 0) {
				loadStatus.value = 'loadmore'
				return
			}
			const data = res.data
			const totalPages = data.totalPage > 0 ? data.totalPage : 1
			totalPage.value = totalPages
			const newData : Array<UTSJSONObject> = data.list
			if (isInit) {
				msgList.value = newData
				if (newData.length > 0) lastUpdateTime.value = new Date().getTime()
			} else {
				newData.forEach((item : UTSJSONObject) : void => {
					const messageId = item.getString('messageId', '')
					const exists = msgList.value.some((existing : UTSJSONObject) : boolean => existing.getString('messageId', '') == messageId)
					if (!exists) msgList.value.push(item)
				})
			}
			loadStatus.value = currPage.value >= totalPage.value ? 'nomore' : 'loadmore'
			if (isInit) {
				hasNewMessages.value = false
				newMessageCount.value = 0
			}
		} catch (error) {
			loadStatus.value = 'loadmore'
			console.error('请求异常:', error, " at pages/message/message.uvue:201")
		} finally {
			isLoading.value = false
		}
	}

	// 加载新消息
	async function loadNewMessages() : Promise<void> {
		console.log('加载新消息', " at pages/message/message.uvue:209")
		await loadMsgList(true)
		hasNewMessages.value = false
		newMessageCount.value = 0
		lastUpdateTime.value = new Date().getTime()
		console.log('新消息加载完成', " at pages/message/message.uvue:214")
	}


	// 页面加载时初始化数据
	onLoad(() => {
		// 获取 token
		const token = uni.getStorageSync('token')
		// 如果有 token，加载消息列表
		if (token) {
			Login.value = true
			loadMsgList(true)
		} else {
			Login.value = false
		}
	})

		const gotoLogin = () => {
			uni.redirectTo({ url: '/pages/login/login' })
		}

	// 页面显示时启动定时器
	onShow(() => {
		if (Login.value) {
			console.log('页面显示 - 启动自动刷新', " at pages/message/message.uvue:238")
			isPageActive.value = true
			startNewMessageCheck()
			// 立即检查一次新消息
			checkNewMessages()
		}
	})

	// 页面隐藏时停止定时器
	onHide(() => {
		console.log('页面隐藏 - 停止自动刷新', " at pages/message/message.uvue:248")
		if (Login.value) {
			console.log('页面隐藏 - 停止自动刷新', " at pages/message/message.uvue:250")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})

	// 页面卸载时清理资源
	onUnload(() => {
		console.log('页面卸载 - 清理资源', " at pages/message/message.uvue:258")
		if (Login.value) {
			console.log('页面卸载 - 清理资源', " at pages/message/message.uvue:260")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})

	onActivated(() => {
		console.log('页面激活 - 启动自动刷新', " at pages/message/message.uvue:267")
		if (Login.value) {
			console.log('页面激活 - 启动自动刷新', " at pages/message/message.uvue:269")
			isPageActive.value = true
			startNewMessageCheck()
			// 立即检查一次新消息
			checkNewMessages()
		}
	})

	onDeactivated(() => {
		console.log('页面停用 - 停止自动刷新', " at pages/message/message.uvue:278")
		if (Login.value) {
			console.log('页面停用 - 停止自动刷新', " at pages/message/message.uvue:280")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})

	// 下拉刷新处理
	const onRefresherRefresh = () => {
		console.log('下拉刷新触发', " at pages/message/message.uvue:288")
		refresherTriggered.value = true
		loadMsgList(true).then(() => {
			refresherTriggered.value = false
		}).catch(() => {
			refresherTriggered.value = false
		})
	}

	// 加载更多
	const loadMore = async () => {
		console.log('准备加载更多 - 当前页:', currPage.value, '总页数:', totalPage.value, " at pages/message/message.uvue:299")
		if (isLoading.value || loadStatus.value != 'loadmore' || currPage.value >= totalPage.value) {
			if (currPage.value >= totalPage.value) {
				loadStatus.value = 'nomore'
			}
			return
		}

		currPage.value++
		await loadMsgList()
	}

	// 滚动到底部加载更多
	const onScrollToLower = () => {
		console.log('滚动到底部 - 当前页:', currPage.value, '总页数:', totalPage.value, " at pages/message/message.uvue:313")
		if (loadStatus.value == 'loadmore' && !isLoading.value) {
			loadMore()
		}
	}



	// 处理消息点击
	const handleItemClick = async (item : UTSJSONObject) : Promise<void> => {
		modalContent.value = item
		modal.value = true
		if (item.getNumber('status', 0) == 1) {
			try {
				const messageId = item.getString('messageId', '')
				const res = await setMsgState(messageId)
				if (res.code == 0 || res.msg == 'success') {
					const index = msgList.value.findIndex((message : UTSJSONObject) : boolean => message.getString('messageId', '') == messageId)
					if (index != -1) {
						msgList.value[index].set('status', 0)
						msgList.value = [...msgList.value]
					}
				}
			} catch (error) {
				console.error('更新状态失败:', error, " at pages/message/message.uvue:337")
			}
		}
	}

	const ReadIt = () => {
		modal.value = false
	}

	const getMessageId = (item : UTSJSONObject, index : number) : string => {
		const messageId = item.getString('messageId', '')
		return messageId != '' ? messageId : index.toString()
	}

	const getMessageCreateTime = (item : UTSJSONObject) : string => {
		return item.getString('createTime', '')
	}

	const getMessageContent = (item : UTSJSONObject) : string => {
		return item.getString('content', '')
	}

	const isMessageUnread = (item : UTSJSONObject) : boolean => {
		return item.getNumber('status', 0) == 1
	}

	const getMessageTypeText = (type: number) : string => {
		switch(type) {
			case 1: return '警告'
			case 2: return '事件'
			default: return '通知'
		}
	}

	const getMessageTitle = (item : UTSJSONObject) : string => {
		return getMessageTypeText(item.getNumber('messageType', 0)) + ' - ' + getMessageCreateTime(item)
	}

	// 工具函数
	const formatTime = (timeString: string) => {
		if (!timeString) return ''
		try {
			const date = new Date(timeString)
			const now = new Date()
			const diff = now.getTime() - date.getTime()
			const minutes = Math.floor(diff / 60000)
			const hours = Math.floor(diff / 3600000)
			const days = Math.floor(diff / 86400000)

			if (minutes < 1) return '刚刚'
			if (minutes < 60) return `${minutes}分钟前`
			if (hours < 24) return `${hours}小时前`
			if (days < 7) return `${days}天前`

			return `${date.getMonth() + 1}-${date.getDate()}`
		} catch (error) {
			return timeString
		}
	}

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_i_modal = resolveEasyComponent("i-modal",_easycom_i_modal)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cV(_component_custom_navBar, _uM({
      title: "消息中心",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false,
      isShowStyle: true
    })),
    _cE("view", _uM({ class: "container" }), [
      _cE("scroll-view", _uM({
        "scroll-y": "",
        class: "scroll-container",
        "refresher-enabled": "",
        "refresher-triggered": refresherTriggered.value,
        "lower-threshold": 100,
        onRefresherrefresh: onRefresherRefresh,
        onScrolltolower: onScrollToLower
      }), [
        _cE("view", _uM({ class: "list-box" }), [
          isTrue(msgList.value.length == 0 && !isLoading.value)
            ? _cE("view", _uM({
                key: 0,
                class: "empty-state"
              }), [
                _cE("text", null, "暂无消息")
              ])
            : _cC("v-if", true),
          isTrue(hasNewMessages.value)
            ? _cE("view", _uM({
                key: 1,
                class: "new-message-tip",
                onClick: loadNewMessages
              }), [
                _cE("text", null, "有 " + _tD(newMessageCount.value) + " 条新消息，点击查看", 1 /* TEXT */)
              ])
            : _cC("v-if", true),
          _cE(Fragment, null, RenderHelpers.renderList(msgList.value, (item, index, __index, _cached): any => {
            return _cE("view", _uM({
              key: getMessageId(item, index),
              class: "message-item",
              onClick: () => {handleItemClick(item)}
            }), [
              _cE("view", _uM({ class: "message-header" }), [
                _cE("text", _uM({ class: "message-title" }), _tD(getMessageTitle(item)), 1 /* TEXT */),
                _cE("text", _uM({ class: "time-text" }), _tD(formatTime(getMessageCreateTime(item))), 1 /* TEXT */)
              ]),
              _cE("view", _uM({ class: "message-content-row" }), [
                _cE("text", _uM({ class: "message-content" }), _tD(getMessageContent(item)), 1 /* TEXT */),
                isTrue(isMessageUnread(item))
                  ? _cE("text", _uM({
                      key: 0,
                      class: "unread-badge"
                    }), "未读")
                  : _cC("v-if", true)
              ])
            ], 8 /* PROPS */, ["onClick"])
          }), 128 /* KEYED_FRAGMENT */),
          isTrue(Login.value)
            ? _cE("view", _uM({
                key: 2,
                class: "load-more"
              }), [
                loadStatus.value == 'loading'
                  ? _cE("text", _uM({
                      key: 0,
                      class: "tips-text"
                    }), "上拉加载更多")
                  : loadStatus.value == 'nomore'
                    ? _cE("text", _uM({
                        key: 1,
                        class: "tips-text"
                      }), "没有更多了")
                    : _cE("text", _uM({
                        key: 2,
                        class: "tips-text"
                      }), "加载中...")
              ])
            : _cC("v-if", true)
        ])
      ], 40 /* PROPS, NEED_HYDRATION */, ["refresher-triggered"]),
      _cV(_component_i_modal, _uM({
        show: modal.value,
        title: getMessageTypeText(modalContent.value.getNumber('messageType', 0)),
        content: modalContent.value.getString('content', ''),
        onConfirm: ReadIt
      }), null, 8 /* PROPS */, ["show", "title", "content"])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesMessageMessageStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["height", "100%"], ["backgroundColor", "#f5f5f5"], ["marginTop", "170rpx"], ["position", "relative"]]))], ["scroll-container", _uM([[".container ", _uM([["height", "100%"], ["width", "100%"]])]])], ["list-box", _uM([[".container ", _uM([["width", "100%"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["position", "relative"]])]])], ["message-item", _uM([[".container .list-box ", _uM([["marginBottom", "20rpx"], ["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundColor", "#ffffff"]])]])], ["message-header", _uM([[".container .list-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"]])]])], ["message-content-row", _uM([[".container .list-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "space-between"], ["marginTop", "16rpx"]])]])], ["message-title", _uM([[".container .list-box ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["fontSize", "30rpx"], ["color", "#333333"], ["whiteSpace", "nowrap"], ["textOverflow", "ellipsis"], ["overflow", "hidden"]])]])], ["message-content", _uM([[".container .list-box ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["fontSize", "26rpx"], ["color", "#666666"], ["whiteSpace", "nowrap"], ["textOverflow", "ellipsis"], ["overflow", "hidden"]])]])], ["unread-badge", _uM([[".container .list-box ", _uM([["marginLeft", "16rpx"], ["paddingTop", "4rpx"], ["paddingRight", "12rpx"], ["paddingBottom", "4rpx"], ["paddingLeft", "12rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundColor", "#f56c6c"], ["color", "#ffffff"], ["fontSize", "22rpx"]])]])], ["empty-state", _uM([[".container .list-box ", _uM([["textAlign", "center"], ["paddingTop", "50rpx"], ["paddingRight", 0], ["paddingBottom", "50rpx"], ["paddingLeft", 0], ["color", "#999999"], ["fontSize", "28rpx"]])]])], ["new-message-tip", _uM([[".container .list-box ", _uM([["backgroundImage", "linear-gradient(135deg, #2979ff, #07c160)"], ["backgroundColor", "rgba(0,0,0,0)"], ["color", "#FFFFFF"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["textAlign", "center"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginBottom", "20rpx"], ["fontSize", "26rpx"]])]])], ["load-more", _uM([[".container .list-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "center"], ["alignItems", "center"], ["paddingTop", "30rpx"], ["paddingRight", 0], ["paddingBottom", "30rpx"], ["paddingLeft", 0], ["textAlign", "center"]])]])], ["tips-text", _uM([[".container .list-box .load-more ", _uM([["color", "#999999"], ["fontSize", "26rpx"], ["textAlign", "center"]])]])]])]
