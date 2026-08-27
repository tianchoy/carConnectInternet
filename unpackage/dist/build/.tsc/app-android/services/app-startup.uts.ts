import {
	initPush,
	refreshPushClientId,
	clearPushBadge,
	markPushSessionAuthenticated
} from './push.uts'
import { initPushBinding } from './push-binding.uts'

const POST_LOGIN_INITIALIZATION_DELAY = 1200

let pushServicesInitialized = false
let pushServicesInitializationScheduled = false
let pushServicesInitializationTimer: number | null = null

function startupLog(message: string): void {
	console.log('[AppStartup] ' + message)
}

function hasLoginToken(): boolean {
	const token = uni.getStorageSync('token')
	return token != null && token.toString() != ''
}

function initializePushServices(): void {
	pushServicesInitializationScheduled = false
	pushServicesInitializationTimer = null
	if (!hasLoginToken()) {
		startupLog('当前未登录，跳过推送初始化')
		return
	}
	if (pushServicesInitialized) {
		markPushSessionAuthenticated()
		clearPushBadge()
		return
	}

	pushServicesInitialized = true
	startupLog('开始登录后的推送初始化')
	initPushBinding()
	initPush()
	clearPushBadge()
	markPushSessionAuthenticated()
	startupLog('登录后的推送初始化已触发')
}

/**
 * 推送和 APNs 注册不影响账户登录，因此在登录成功并完成首屏跳转后再初始化。
 * 已登录用户重新冷启动时，首页也会调用此方法作为兜底。
 */
export function schedulePostLoginInitialization(): void {
	if (!hasLoginToken()) return
	if (pushServicesInitialized) {
		markPushSessionAuthenticated()
		clearPushBadge()
		return
	}
	if (pushServicesInitializationScheduled) return

	pushServicesInitializationScheduled = true
	startupLog('已安排登录后的推送初始化')
	pushServicesInitializationTimer = setTimeout(() => {
		initializePushServices()
	}, POST_LOGIN_INITIALIZATION_DELAY) as number
}

export function refreshInitializedPushServices(): void {
	if (!pushServicesInitialized) return
	refreshPushClientId()
}

export function clearInitializedPushBadge(): void {
	if (!pushServicesInitialized) return
	clearPushBadge()
}
