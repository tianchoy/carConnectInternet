export type CameraPermissionStatus = 'granted' | 'denied' | 'settingsRequired' | 'unavailable'

const CAMERA_PERMISSION: Array<string> = ['android.permission.CAMERA']

export function ensureCameraPermission(callback: (status: CameraPermissionStatus) => void): void {

	const activity = UTSAndroid.getUniActivity()
	if (activity == null) {
		callback('unavailable')
		return
	}

	if (UTSAndroid.checkSystemPermissionGranted(activity, CAMERA_PERMISSION)) {
		callback('granted')
		return
	}

	UTSAndroid.requestSystemPermission(
		activity,
		CAMERA_PERMISSION,
		(allRight, _) => {
			callback(allRight ? 'granted' : 'denied')
		},
		(doNotAskAgain, _) => {
			callback(doNotAskAgain ? 'settingsRequired' : 'denied')
		}
	)
	return


	callback('granted')
}

export function openCameraPermissionSettings(): void {

	const activity = UTSAndroid.getUniActivity()
	if (activity != null) UTSAndroid.gotoSystemPermissionActivity(activity, CAMERA_PERMISSION)

}
