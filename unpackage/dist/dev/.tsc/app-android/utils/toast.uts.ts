type IosToastHandler = (options: ShowToastOptions) => boolean

const iosToastHandlers: Array<IosToastHandler> = []
const pendingIosToasts: Array<ShowToastOptions> = []
const maxPendingToastCount = 10

function dispatchIosToast(options: ShowToastOptions): boolean {
	const handler = iosToastHandlers.length > 0 ? iosToastHandlers[iosToastHandlers.length - 1] : null
	return handler != null && handler(options)
}

function flushPendingIosToasts(): void {
	while (pendingIosToasts.length > 0) {
		const options = pendingIosToasts[0]
		if (!dispatchIosToast(options)) return
		pendingIosToasts.splice(0, 1)
	}
}

export function registerIosToastHandler(handler: IosToastHandler): void {





}

export function unregisterIosToastHandler(handler: IosToastHandler): void {




}

export function showAppToast(options: ShowToastOptions): void {








	uni.showToast(options)

}
