import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_uv_list_item from '@/uni_modules/uv-list/components/uv-list-item/uv-list-item.vue'
import _easycom_uv_list from '@/uni_modules/uv-list/components/uv-list/uv-list.vue'
import _easycom_uv_load_more from '@/uni_modules/uv-load-more/components/uv-load-more/uv-load-more.vue'
import _easycom_uv_modal from '@/uni_modules/uv-modal/components/uv-modal/uv-modal.vue'
import { ref, onActivated, onDeactivated } from 'vue'
	import { getUserMsgList, setMsgState } from '../../api/request.uts'
	
	
const __sfc__ = defineComponent({
  __name: 'message',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const modal = ref(null);
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
	let checkTimer: number | null = null
	const isPageActive = ref(false) // 页面是否处于活动状态
		
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
			console.log('页面显示 - 启动自动刷新', " at pages/message/message.uvue:95")
			isPageActive.value = true
			startNewMessageCheck()
			// 立即检查一次新消息
			checkNewMessages()
		}
	})
	
	// 页面隐藏时停止定时器
	onHide(() => {
		console.log('页面隐藏 - 停止自动刷新', " at pages/message/message.uvue:105")
		if (Login.value) {
			console.log('页面隐藏 - 停止自动刷新', " at pages/message/message.uvue:107")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})
	
	// 页面卸载时清理资源
	onUnload(() => {
		console.log('页面卸载 - 清理资源', " at pages/message/message.uvue:115")
		if (Login.value) {
			console.log('页面卸载 - 清理资源', " at pages/message/message.uvue:117")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})
	
	onActivated(() => {
		console.log('页面激活 - 启动自动刷新', " at pages/message/message.uvue:124")
		if (Login.value) {
			console.log('页面激活 - 启动自动刷新', " at pages/message/message.uvue:126")
			isPageActive.value = true
			startNewMessageCheck()
			// 立即检查一次新消息
			checkNewMessages()
		}
	})
	
	onDeactivated(() => {
		console.log('页面停用 - 停止自动刷新', " at pages/message/message.uvue:135")
		if (Login.value) {
			console.log('页面停用 - 停止自动刷新', " at pages/message/message.uvue:137")
			isPageActive.value = false
			stopNewMessageCheck()
		}
	})
	
	// 下拉刷新处理
	const onRefresherRefresh = () => {
		console.log('下拉刷新触发', " at pages/message/message.uvue:145")
		refresherTriggered.value = true
		loadMsgList(true).then(() => {
			refresherTriggered.value = false
		}).catch(() => {
			refresherTriggered.value = false
		})
	}
	
	// 滚动到底部加载更多
	const onScrollToLower = () => {
		console.log('滚动到底部 - 当前页:', currPage.value, '总页数:', totalPage.value, " at pages/message/message.uvue:156")
		if (loadStatus.value == 'loadmore' && !isLoading.value) {
			loadMore()
		}
	}
	
	// 启动新消息检查
	const startNewMessageCheck = () => {
		if (checkTimer) {
			stopNewMessageCheck()
		}
		
		console.log('启动定时消息检查', " at pages/message/message.uvue:168")
		// 每30秒检查一次新消息
		checkTimer = setInterval(() => {
			if (isPageActive.value) {
				console.log('定时检查新消息...', " at pages/message/message.uvue:172")
				checkNewMessages()
			}
		}, 10000)
	}
	
	// 停止新消息检查
	const stopNewMessageCheck = () => {
		if (checkTimer) {
			console.log('停止定时消息检查', " at pages/message/message.uvue:181")
			clearInterval(checkTimer)
			checkTimer = null
		}
	}
	
	// 检查新消息
	const checkNewMessages = async () => {
		// 如果页面不活跃，不执行检查
		if (!isPageActive.value) {
			console.log('页面不活跃，跳过新消息检查', " at pages/message/message.uvue:191")
			return
		}
		
		// 如果正在加载中，跳过检查
		if (isLoading.value) {
			console.log('正在加载中，跳过新消息检查', " at pages/message/message.uvue:197")
			return
		}
		
		try {
			console.log('开始检查新消息...', " at pages/message/message.uvue:202")
			const res = await getUserMsgList({
				page: 1,
				pageSize: 1
			})
			
			if (res.code == 0 && res.msg == 'success') {
				const data = res.data || { list: [], total: 0 }
				const latestMessage = data.list?.[0]
				
				if (latestMessage && latestMessage.createTime) {
					const messageTime = new Date(latestMessage.createTime).getTime()
					if (messageTime > lastUpdateTime.value) {
						// 有新消息
						hasNewMessages.value = true
						// 触发震动报警
						vibrateAlert()
						// 获取新消息数量
						const countRes = await getUserMsgList({
							page: 1,
							pageSize: 50
						})
						if (countRes.code == 0) {
							const newMessages = countRes.data?.list?.filter((msg: UTSJSONObject) => {
								return new Date(msg.createTime).getTime() > lastUpdateTime.value
							}) || []
							newMessageCount.value = newMessages.length
							console.log('新消息数量:', newMessageCount.value, " at pages/message/message.uvue:229")
						}
					} else {
						console.log('没有发现新消息', " at pages/message/message.uvue:232")
					}
				}
			}
		} catch (error) {
			console.error('检查新消息失败:', error, " at pages/message/message.uvue:237")
		}
	}
	
	// 震动报警函数
	const vibrateAlert = () => {
		for (let i = 0; i < 3; i++) {
			uni.vibrateLong()
		}
	}
	
	// 加载新消息
	const loadNewMessages = () => {
		console.log('加载新消息', " at pages/message/message.uvue:250")
		loadMsgList(true).then(() => {
			hasNewMessages.value = false
			newMessageCount.value = 0
			lastUpdateTime.value = new Date().getTime()
			console.log('新消息加载完成', " at pages/message/message.uvue:255")
		})
	}
	
	// 加载消息列表
	const loadMsgList = async (isInit = false) => {
		if (isInit) {
			currPage.value = 1
			msgList.value = []
			loadStatus.value = 'loadmore'
		}
		
		if (isLoading.value) return
		isLoading.value = true
		
		try {
			if (!isInit) {
				loadStatus.value = 'loading'
			}
			
			console.log('请求数据 - 页码:', currPage.value, " at pages/message/message.uvue:275")
			
			// 调用接口
			const res = await getUserMsgList({
				page: currPage.value,
				pageSize: pageSize.value
			})
			
			if (res.code == 0 && res.msg == 'success') {
				const data = res.data || { list: [], totalPage: 0 }
				totalPage.value = data.totalPage || 1
				
				console.log('第', currPage.value, '页接口返回:', data, " at pages/message/message.uvue:287");
				console.log('第', currPage.value, '页列表长度:', data.list?.length, " at pages/message/message.uvue:288");
				
				if (isInit) {
					msgList.value = data.list || []
					// 更新最后更新时间
					if (data.list && data.list.length > 0) {
						lastUpdateTime.value = new Date().getTime()
					}
				} else {
					const newData = data.list || []
					console.log('即将添加的新数据长度:', newData.length, " at pages/message/message.uvue:298")
					
					// 去重处理：基于 messageId
					const existingIds = new Set(msgList.value.map(item => item.messageId))
					const uniqueNewData = newData.filter((item: UTSJSONObject) => !existingIds.has(item.messageId))
					
					if (uniqueNewData.length > 0) {
						msgList.value = [...msgList.value, ...uniqueNewData]
					}
				}
				
				// 更新状态
				if (currPage.value >= totalPage.value) {
					loadStatus.value = 'nomore'
				} else {
					loadStatus.value = 'loadmore'
				}
				
				// 重置新消息提示
				if (isInit) {
					hasNewMessages.value = false
					newMessageCount.value = 0
				}
			} else {
				loadStatus.value = 'loadmore'
				console.error('接口返回错误:', res.msg, " at pages/message/message.uvue:323")
			}
		} catch (error) {
			loadStatus.value = 'loadmore'
			console.error('请求异常:', error, " at pages/message/message.uvue:327")
		} finally {
			isLoading.value = false
		}
	}
	
	// 加载更多
	const loadMore = () => {
		console.log('准备加载更多 - 当前页:', currPage.value, '总页数:', totalPage.value, " at pages/message/message.uvue:335")
		if (currPage.value < totalPage.value) {
			currPage.value++
			loadMsgList()
		} else {
			loadStatus.value = 'nomore'
		}
	}
	
	// 处理消息点击
	const handleItemClick = async (item) => {
		modalContent.value = item
		modal.value?.open();
		
		if (item.status == 1) {
			try {
				const res = await setMsgState(item.messageId)
				if (res.msg == 'success') {
					const index = msgList.value.findIndex(msg => msg.messageId == item.messageId)
					if (index !== -1) {
						msgList.value[index].status = 0
						// 触发视图更新
						msgList.value = [...msgList.value]
					}
				}
			} catch (error) {
				console.error('更新状态失败:', error, " at pages/message/message.uvue:361")
			}
		}
	}
	
	const ReadIt = () => {
		modal.value?.close();
	}
	
	// 工具函数
	const getMessageTypeText = (type: number) => {
		switch(type) {
			case 1: return '警告'
			case 2: return '事件'
			default: return '通知'
		}
	}
	
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
const _component_uv_list_item = resolveEasyComponent("uv-list-item",_easycom_uv_list_item)
const _component_uv_list = resolveEasyComponent("uv-list",_easycom_uv_list)
const _component_uv_load_more = resolveEasyComponent("uv-load-more",_easycom_uv_load_more)
const _component_uv_modal = resolveEasyComponent("uv-modal",_easycom_uv_modal)

  return _cE(Fragment, null, [
    _cV(_component_custom_navBar, _uM({
      title: "消息中心",
      "show-back": false,
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
            return _cV(_component_uv_list, _uM({
              key: item.messageId || index
            }), _uM({
              default: withSlotCtx((): any[] => [
                _cV(_component_uv_list_item, _uM({
                  title: getMessageTypeText(item.messageType) + ' - ' + item.createTime,
                  note: item.content,
                  onClick: () => {handleItemClick(item)},
                  clickable: true,
                  "show-badge": item.status == 1,
                  badge: {value: '未读'}
                }), _uM({
                  right: withSlotCtx((): any[] => [
                    _cE("text", _uM({ class: "time-text" }), _tD(formatTime(item.createTime)), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }), 1032 /* PROPS, DYNAMIC_SLOTS */, ["title", "note", "onClick", "show-badge"])
              ]),
              _: 2 /* DYNAMIC */
            }), 1024 /* DYNAMIC_SLOTS */)
          }), 128 /* KEYED_FRAGMENT */),
          isTrue(Login.value)
            ? _cV(_component_uv_load_more, _uM({
                key: 2,
                status: loadStatus.value
              }), null, 8 /* PROPS */, ["status"])
            : _cC("v-if", true)
        ])
      ], 40 /* PROPS, NEED_HYDRATION */, ["refresher-triggered"]),
      _cV(_component_uv_modal, _uM({
        ref_key: "modal",
        ref: modal,
        title: getMessageTypeText(modalContent.value.messageType),
        content: modalContent.value.content,
        onConfirm: ReadIt
      }), null, 8 /* PROPS */, ["title", "content"])
    ])
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesMessageMessageStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["backgroundColor", "#f5f5f5"], ["marginTop", "170rpx"], ["position", "relative"]]))], ["scroll-container", _uM([[".container ", _uM([["height", "100%"], ["width", "100%"]])]])], ["list-box", _uM([[".container ", _uM([["width", "100%"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["position", "relative"]])]])], ["uv-list", _uM([[".container .list-box ", _uM([["marginBottom", "20rpx"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundColor", "#ffffff"]])]])], ["empty-state", _uM([[".container .list-box ", _uM([["textAlign", "center"], ["paddingTop", "50rpx"], ["paddingRight", 0], ["paddingBottom", "50rpx"], ["paddingLeft", 0], ["color", "#999999"], ["fontSize", "28rpx"]])]])], ["new-message-tip", _uM([[".container .list-box ", _uM([["backgroundImage", "linear-gradient(135deg, #2979ff, #07c160)"], ["backgroundColor", "rgba(0,0,0,0)"], ["color", "#FFFFFF"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["textAlign", "center"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["marginBottom", "20rpx"], ["fontSize", "26rpx"], ["animation", "pulse 2s infinite"], ["cursor", "pointer"]])]])], ["time-text", _uM([[".container .list-box ", _uM([["fontSize", "24rpx"], ["color", "#999999"]])]])], ["uv-load-more", _uM([[".container .list-box ", _uM([["paddingTop", "30rpx"], ["paddingRight", 0], ["paddingBottom", "30rpx"], ["paddingLeft", 0], ["textAlign", "center"]])]])]])]
