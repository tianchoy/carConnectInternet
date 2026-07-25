export class AppModalSuccess {
	confirm: boolean = false
	cancel: boolean = false
}

export type AppModalOptions = {
	title?: string
	content?: string
	showCancel?: boolean
	confirmText?: string
	cancelText?: string
	success?: (res: AppModalSuccess) => void
}

const modalHandlers: Array<(options: AppModalOptions) => void> = []

export function registerAppModalHandler(handler: (options: AppModalOptions) => void): void {
	if (modalHandlers.indexOf(handler) == -1) modalHandlers.push(handler)
}

export function unregisterAppModalHandler(handler: (options: AppModalOptions) => void): void {
	const index = modalHandlers.indexOf(handler)
	if (index >= 0) modalHandlers.splice(index, 1)
}

export function showAppModal(options: AppModalOptions): void {
	const handler = modalHandlers.length > 0 ? modalHandlers[modalHandlers.length - 1] : null
	if (handler != null) {
		handler(options)
		return
	}

	uni.showModal({
		title: options.title ?? '',
		content: options.content ?? '',
		showCancel: options.showCancel ?? true,
		confirmText: options.confirmText,
		cancelText: options.cancelText,
		success: (res: ShowModalSuccess) => {
			const result = new AppModalSuccess()
			result.confirm = res.confirm
			result.cancel = res.cancel
			if (options.success != null) options.success(result)
		}
	})
}
