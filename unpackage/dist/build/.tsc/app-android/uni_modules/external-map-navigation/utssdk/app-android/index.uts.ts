import Intent from 'android.content.Intent'
import Uri from 'android.net.Uri'
import Activity from 'android.app.Activity'
import { ExternalMapNavigationParams, ExternalMapNavigationResult } from '../interface.uts'

function result(code: string): ExternalMapNavigationResult {
	return { code: code }
}

function isValidCoordinate(latitude: number, longitude: number): boolean {
	return !isNaN(latitude) && !isNaN(longitude) &&
		latitude >= -90 && latitude <= 90 &&
		longitude >= -180 && longitude <= 180 &&
		!(latitude == 0 && longitude == 0)
}

export function openExternalMap(params: ExternalMapNavigationParams): ExternalMapNavigationResult {
	if (!isValidCoordinate(params.latitude, params.longitude)) {
		return result('invalid_coordinate')
	}

	const activity = UTSAndroid.getUniActivity()
	if (activity == null) {
		console.error('获取当前页面失败，无法打开地图')
		return result('launch_failed')
	}

	try {
		const currentActivity = activity as Activity
		const geoUri = 'geo:0,0?q=' + params.latitude.toString() + ',' + params.longitude.toString()
		const mapIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(geoUri))
		const handlers = currentActivity.getPackageManager().queryIntentActivities(mapIntent, 0)
		if (handlers.size == 0) {
			return result('no_map_app')
		}

		const chooser = Intent.createChooser(mapIntent, '选择地图应用')
		currentActivity.startActivity(chooser)
		console.log('已请求打开外部地图:', geoUri)
		return result('opened')
	} catch (error) {
		console.error('打开外部地图失败:', error)
		return result('launch_failed')
	}
}
