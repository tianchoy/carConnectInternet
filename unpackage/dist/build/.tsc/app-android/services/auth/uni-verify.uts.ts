import { uniVerifyLogin } from '../../api/request.uts'

export type UniVerifyPreLoginResult = {
	ok: boolean
	message: string
}

export type UniVerifyResult = {
	ok: boolean
	cancelled: boolean
	message: string
	token: string
}

let manager: UniVerifyManager | null = null
let preLoginReady = false
let requesting = false

function getPlatform(): string {

	return 'android'




	return ''
}

function getManager(): UniVerifyManager {
	if (manager == null) {
		manager = uni.getUniVerifyManager()
	}
	return manager!
}

function getErrorMessage(error: UniVerifyManagerLoginFail): string {
	const errCode = error.errCode
	console.error('Uni Verify 授权失败:', errCode, error.errMsg)
	if (errCode == 30001) return '已取消本机号码授权'
	if (errCode == 30004 || errCode == 30005 || errCode == 30006) return '运营商认证失败，请检查 SIM 卡、移动网络后重试'
	if (errCode == 30007) return '本机号码授权已过期，请重试'
	if (errCode == 30008) return '正在进行本机号码授权，请稍候'
	if (errCode == 40001 || errCode == 40002) return '网络异常，请检查移动网络后重试'
	return '本机号码授权失败（错误码：' + errCode + '），请使用验证码登录'
}

function getPreLoginErrorMessage(error: UniVerifyManagerPreLoginFail): string {
	const errCode = error.errCode
	const errMsg = error.errMsg || ''
	const cause = error.cause || ''
	console.error('Uni Verify 预取号失败:', 'platform=' + getPlatform(), 'errCode=' + errCode, 'errMsg=' + errMsg, 'cause=' + cause)
	if (errCode == 30005) return '本机号码预取失败，请检查本地包签名与 Uni Verify 配置，或确认 SIM 卡和移动数据可用'
	if (errCode == 1000 || errCode == 1001 || errCode == 1002) return '一键登录服务未正确配置，请检查应用签名与 Uni Verify 控制台配置'
	if (errCode == 1004) return '一键登录服务已禁用，请检查 Uni Verify 服务状态'
	if (errCode == 30001) return '本机号码预取已取消'
	if (errCode == 30004) {
		if (errMsg.indexOf('-20102') >= 0) return '一键登录应用签名或控制台配置不匹配，请安装使用正式签名构建的 APK'
		if (errMsg.indexOf('-20201') >= 0) return '未检测到可用 SIM 卡，请使用验证码登录'
		if (errMsg.indexOf('-20202') >= 0) return '未开启蜂窝移动网络，请开启移动数据后重试'
		if (errMsg.indexOf('-20203') >= 0) return '当前运营商暂不支持一键登录，请使用验证码登录'
		return '本机号码预取失败，请稍后重试或使用验证码登录'
	}
	if (errCode == 40001 || errCode == 40002) return '网络异常，无法获取本机号码，请检查移动网络后重试'
	return '本机号码预取失败（错误码：' + errCode + '），请使用验证码登录'
}

function createPreLoginResult(ok: boolean, message: string): UniVerifyPreLoginResult {
	return { ok: ok, message: message }
}

function ensurePreLogin(): Promise<UniVerifyPreLoginResult> {
	return new Promise<UniVerifyPreLoginResult>((resolve) => {
		try {
			const uniVerifyManager = getManager()
			if (preLoginReady || uniVerifyManager.isPreLoginValid()) {
				preLoginReady = true
				resolve(createPreLoginResult(true, ''))
				return
			}
			uniVerifyManager.preLogin({
				success: () => {
					preLoginReady = true
					resolve(createPreLoginResult(true, ''))
				},
				fail: (error: UniVerifyManagerPreLoginFail) => {
					preLoginReady = false
					resolve(createPreLoginResult(false, getPreLoginErrorMessage(error)))
				}
			})
		} catch (error) {
			preLoginReady = false
			console.error('Uni Verify 管理器初始化失败:', error)
			resolve(createPreLoginResult(false, '一键登录初始化失败，请确认 uni-verify 模块、应用签名与控制台配置'))
		}
	})
}

export function prefetchUniVerify(): void {
	ensurePreLogin()
}

function createResult(ok: boolean, cancelled: boolean, message: string, token: string): UniVerifyResult {
	return { ok: ok, cancelled: cancelled, message: message, token: token }
}

function closeLoginPage(uniVerifyManager: UniVerifyManager | null): void {
	if (uniVerifyManager != null) uniVerifyManager.close()
}

export function loginByUniVerify(clientVersion: string): Promise<UniVerifyResult> {
	return new Promise<UniVerifyResult>((resolve) => {
		if (requesting) {
			resolve(createResult(false, false, '正在进行本机号码授权，请稍候', ''))
			return
		}

		requesting = true
		ensurePreLogin().then((preLoginResult) => {
			if (!preLoginResult.ok) {
				requesting = false
				resolve(createResult(false, false, preLoginResult.message, ''))
				return
			}

			let uniVerifyManager: UniVerifyManager | null = null
			try {
				uniVerifyManager = getManager()
				uniVerifyManager.login({
					uniVerifyStyle: {
						fullScreen: false,
						loginBtnText: '本机号码一键登录'
					},
					success: (result: UniVerifyManagerLoginSuccess) => {
						uniVerifyLogin({
							openId: result.openId,
							accessToken: result.accessToken,
							platform: getPlatform(),
							clientVersion: clientVersion
						}).then((response) => {
							const loginData = response.data
							const token = loginData != null ? loginData.getString('token', '') : ''
							if (response.code == 0 && token != '') {
								resolve(createResult(true, false, '', token))
							} else {
								resolve(createResult(false, false, response.msg || '本机号码登录失败，请使用验证码登录', ''))
							}
						}).catch(() => {
							resolve(createResult(false, false, '登录服务连接失败，请使用验证码登录', ''))
						}).finally(() => {
							closeLoginPage(uniVerifyManager)
							requesting = false
						})
					},
					fail: (error: UniVerifyManagerLoginFail) => {
						preLoginReady = false
						resolve(createResult(false, error.errCode == 30001, getErrorMessage(error), ''))
						closeLoginPage(uniVerifyManager)
						requesting = false
					}
				})
			} catch (error) {
				resolve(createResult(false, false, '当前设备不支持本机号码一键登录，请使用验证码登录', ''))
				requesting = false
			}
		}).catch(() => {
			requesting = false
			resolve(createResult(false, false, '一键登录预取号异常，请检查 SIM 卡、移动网络及服务配置', ''))
		})
	})
}
