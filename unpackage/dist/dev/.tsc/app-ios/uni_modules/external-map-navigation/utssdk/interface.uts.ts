export type ExternalMapNavigationParams = {
	latitude: number
	longitude: number
	name: string
	providerId?: string
	wgs84Latitude?: number
	wgs84Longitude?: number
}

export type ExternalMapNavigationResult = {
	code: string
}

export type IOSMapProvider = {
	id: string
	name: string
}
