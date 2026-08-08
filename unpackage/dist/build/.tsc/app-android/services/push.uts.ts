const PUSH_CLIENT_ID_KEY = 'push_client_id'
const PUSH_PENDING_MESSAGE_ID_KEY = 'push_pending_message_id'
const PUSH_MESSAGE_STALE_KEY = 'push_message_stale'
const PUSH_SESSION_KEY = 'push_session_key'


import AndroidLog from 'android.util.Log'


let initialized = false
let pushClientIdRequesting = false
let pushClientIdRetryCount = 0
let pushClientIdRetryTimer: number = 0
let pushClientIdRequestTimeout: number = 0
const PUSH_CLIENT_ID_MAX_RETRY_COUNT = 5
const PUSH_CLIENT_ID_RETRY_DELAY = 3000
const PUSH_CLIENT_ID_REQUEST_TIMEOUT = 18000

function pushDebug(message: string): void {

	AndroidLog.e('UniPushDebug', message)

	console.error('[UniPushDebug]', message)
}

function clearPushClientIdTimers(): void {
	if (pushClientIdRetryTimer > 0) {
		clearTimeout(pushClientIdRetryTimer)
		pushClientIdRetryTimer = 0
	}
	if (pushClientIdRequestTimeout > 0) {
		clearTimeout(pushClientIdRequestTimeout)
		pushClientIdRequestTimeout = 0
	}
}

function schedulePushClientIdRetry(reason: string): void {
	if (pushClientIdRetryCount >= PUSH_CLIENT_ID_MAX_RETRY_COUNT) {
		pushDebug('UniPush CID 获取超时，已停止重试。原因: ' + reason)
		return
	}
	if (pushClientIdRetryTimer > 0) return
	pushClientIdRetryCount += 1
	pushDebug('UniPush CID 将在 ' + PUSH_CLIENT_ID_RETRY_DELAY.toString() + 'ms 后重试，第 ' + pushClientIdRetryCount.toString() + ' 次。原因: ' + reason)
	pushClientIdRetryTimer = setTimeout(() => {
		pushClientIdRetryTimer = 0
		refreshPushClientId()
	}, PUSH_CLIENT_ID_RETRY_DELAY)
}

function stringValue(value: any): string {
	if (value == null) return ''
	return value.toString()
}

function payloadValue(payload: any, key: string): string {
	if (payload == null) return ''
	if (typeof payload == 'string') {
		try {
			const parsedPayload = JSON.parse(payload)
			if (parsedPayload == null) return ''
			return payloadValue(parsedPayload, key)
		} catch (error) {
			return ''
		}
	}
	try {
		const object = payload as UTSJSONObject
		return object.getString(key, '')
	} catch (error) {
		return ''
	}
}

function pushMessageId(message: any): string {
	let id = payloadValue(message, 'messageId')
	if (id == '') id = payloadValue(message, 'message_id')
	if (id == '') id = payloadValue(message, 'id')
	if (id == '') {
		const data = payloadValue(message, 'data')
		if (data != '') id = payloadValue(data, 'messageId')
	}
	return id
}

function savePushEvent(event: any): string {
	const messageId = pushMessageId(event)
	if (messageId != '') uni.setStorageSync(PUSH_PENDING_MESSAGE_ID_KEY, messageId)
	uni.setStorageSync(PUSH_MESSAGE_STALE_KEY, true)
	return messageId
}

function isNotificationClick(event: any): boolean {
	return payloadValue(event, 'type').toLowerCase() == 'click'
}

function registerPushListener(): void {
	if (initialized) return
	initialized = true

	try {
		uni.onPushMessage((event: any) => {
			console.log('收到 UniPush 消息')
			savePushEvent(event)
			if (isNotificationClick(event)) {
				uni.switchTab({ url: '/pages/message/message' })
			}
		})
	} catch (error) {
		console.error('注册 UniPush 监听失败:', error)
	}

}

export function initPush(): void {

	registerPushListener()
	refreshPushClientId()

}

export function refreshPushClientId(): void {

	if (pushClientIdRequesting) {
		pushDebug('UniPush CID 正在获取，跳过重复请求')
		return
	}
	pushClientIdRequesting = true
	clearPushClientIdTimers()
	try {
		pushDebug('开始获取 UniPush CID')
		pushClientIdRequestTimeout = setTimeout(() => {
			pushClientIdRequestTimeout = 0
			if (!pushClientIdRequesting) return
			pushClientIdRequesting = false
			pushDebug('UniPush getPushClientId 回调超时')
			schedulePushClientIdRetry('回调超时')
		}, PUSH_CLIENT_ID_REQUEST_TIMEOUT)
		uni.getPushClientId({
			success: (result) => {
				pushClientIdRequesting = false
				if (pushClientIdRequestTimeout > 0) {
					clearTimeout(pushClientIdRequestTimeout)
					pushClientIdRequestTimeout = 0
				}
				const clientId = result.cid
				pushDebug('UniPush getPushClientId success')
				if (clientId == '') {
					pushDebug('UniPush CID 为空')
					schedulePushClientIdRetry('CID 为空')
					return
				}
				const cachedClientId = getCachedPushClientId()
				pushDebug('UniPush CID=' + clientId)
				if (clientId != cachedClientId) {
					pushDebug('UniPush CID 已更新')
				}
				pushClientIdRetryCount = 0
				uni.setStorageSync(PUSH_CLIENT_ID_KEY, clientId)
			},
			fail: (error: any) => {
				pushClientIdRequesting = false
				if (pushClientIdRequestTimeout > 0) {
					clearTimeout(pushClientIdRequestTimeout)
					pushClientIdRequestTimeout = 0
				}
				pushDebug('UniPush getPushClientId failed: ' + error.toString())
				schedulePushClientIdRetry('调用失败')
			}
		})
	} catch (error) {
		pushClientIdRequesting = false
		if (pushClientIdRequestTimeout > 0) {
			clearTimeout(pushClientIdRequestTimeout)
			pushClientIdRequestTimeout = 0
		}
		pushDebug('调用 getPushClientId 异常: ' + error.toString())
		schedulePushClientIdRetry('调用异常')
	}

}

export function markPushSessionAuthenticated(): void {
	// The CID identifies the installation. The backend binding endpoint is intentionally
	// not called here because this project does not currently expose one.

	uni.setStorageSync(PUSH_SESSION_KEY, 'authenticated')
	refreshPushClientId()

}

export function clearPushSessionState(): void {
	uni.removeStorageSync(PUSH_SESSION_KEY)
	uni.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY)
	uni.removeStorageSync(PUSH_MESSAGE_STALE_KEY)
}

export function consumePendingMessageId(): string {
	const rawValue = uni.getStorageSync(PUSH_PENDING_MESSAGE_ID_KEY)
	const value = rawValue == null ? '' : stringValue(rawValue)
	uni.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY)
	return value
}

export function consumePushStaleFlag(): boolean {
	const value = uni.getStorageSync(PUSH_MESSAGE_STALE_KEY)
	uni.removeStorageSync(PUSH_MESSAGE_STALE_KEY)
	return value != null && value.toString() == 'true'
}

export function getCachedPushClientId(): string {
	const value = uni.getStorageSync(PUSH_CLIENT_ID_KEY)
	return value == null ? '' : value.toString()
}
