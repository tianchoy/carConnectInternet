// utils/cameraPermission.uts

export type CameraPermissionStatus = 'granted' | 'denied' | 'settingsRequired' | 'unavailable'
export type LocationPermissionStatus = CameraPermissionStatus


import Activity from 'android.app.Activity'

const CAMERA_PERMISSION = 'android.permission.CAMERA'
const COARSE_LOCATION_PERMISSION = 'android.permission.ACCESS_COARSE_LOCATION'
const FINE_LOCATION_PERMISSION = 'android.permission.ACCESS_FINE_LOCATION'

function hasPermission(activity: Activity, permissions: Array<string>): boolean {
	return UTSAndroid.checkSystemPermissionGranted(activity, permissions)
}

function requestAndroidPermission(
	permissions: Array<string>,
	name: string,
	callback: (status: CameraPermissionStatus) => void,
	isGranted: (activity: Activity) => boolean
): void {
	const activity = UTSAndroid.getUniActivity()
	if (activity == null) {
		__f__('error','at utils/cameraPermission.uts:25','❌ [' + name + '] 获取 Activity 失败')
		callback('unavailable')
		return
	}
	const currentActivity = activity as Activity

	try {
		if (isGranted(currentActivity)) {
			callback('granted')
			return
		}
	} catch (error) {
		__f__('error','at utils/cameraPermission.uts:37','❌ [' + name + '] 检查权限失败:', error)
		callback('unavailable')
		return
	}

	try {
		UTSAndroid.requestSystemPermission(
			currentActivity,
			permissions,
			(allRight: boolean, grantedPermissions: Array<string> | null) => {
				__f__('log','at utils/cameraPermission.uts:47','[' + name + '] 权限请求结果:', allRight, grantedPermissions)
				try {
					callback(isGranted(currentActivity) ? 'granted' : 'denied')
				} catch (error) {
					__f__('error','at utils/cameraPermission.uts:51','❌ [' + name + '] 请求后检查权限失败:', error)
					callback('unavailable')
				}
			},
			(doNotAskAgain: boolean, deniedPermissions: Array<string> | null) => {
				__f__('warn','at utils/cameraPermission.uts:56','[' + name + '] 权限被拒绝:', deniedPermissions)
				callback(doNotAskAgain ? 'settingsRequired' : 'denied')
			}
		)
	} catch (error) {
		__f__('error','at utils/cameraPermission.uts:61','❌ [' + name + '] 请求权限异常:', error)
		callback('unavailable')
	}
}

export function ensureCameraPermission(callback: (status: CameraPermissionStatus) => void): void {
	requestAndroidPermission(
		[CAMERA_PERMISSION],
		'ensureCameraPermission',
		callback,
		(activity: Activity): boolean => hasPermission(activity, [CAMERA_PERMISSION])
	)
}

export function ensureLocationPermission(callback: (status: LocationPermissionStatus) => void): void {
	requestAndroidPermission(
		[COARSE_LOCATION_PERMISSION, FINE_LOCATION_PERMISSION],
		'ensureLocationPermission',
		callback,
		(activity: Activity): boolean => {
			return hasPermission(activity, [COARSE_LOCATION_PERMISSION]) ||
				hasPermission(activity, [FINE_LOCATION_PERMISSION])
		}
	)
}

export function openCameraPermissionSettings(): void {
	const activity = UTSAndroid.getUniActivity()
	if (activity == null) return
	try {
		UTSAndroid.gotoSystemPermissionActivity(activity as Activity, [CAMERA_PERMISSION])
	} catch (error) {
		__f__('error','at utils/cameraPermission.uts:93','❌ [openCameraPermissionSettings] 打开权限设置失败:', error)
	}
}















