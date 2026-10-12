// 获取用户当前位置（GCJ02 / 腾讯系，与后端设备坐标经 CoordTransform 转换后的坐标系一致）
export type UserLocation = {
	latitude: number
	longitude: number
}

let cachedUserLocation: UserLocation | null = null

// 获取用户当前位置；失败（如未授权）返回 null。结果会缓存，避免重复弹授权
export function getUserCurrentLocation(): Promise<UserLocation | null> {
	return new Promise<UserLocation | null>((resolve) => {
		if (cachedUserLocation != null) {
			resolve(cachedUserLocation)
			return
		}
		uni.getLocation({
			type: 'gcj02',
			provider: 'system',
			success: (res: any) => {
				const loc: UserLocation = {
					latitude: res.latitude as number,
					longitude: res.longitude as number
				}
				cachedUserLocation = loc
				resolve(loc)
			},
			fail: (err: any) => {
				console.warn('获取用户当前位置失败:', err)
				resolve(null)
			}
		})
	})
}

// 设备经纬度是否有效（NaN / 越界 / (0,0) 均视为无效位置）
export function isValidLatLng(latitude: number, longitude: number): boolean {
	if (isNaN(latitude) || isNaN(longitude)) return false
	if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return false
	if (latitude == 0 && longitude == 0) return false
	return true
}
