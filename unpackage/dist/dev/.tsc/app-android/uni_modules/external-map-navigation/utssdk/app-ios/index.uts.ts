import { ExternalMapNavigationParams, ExternalMapNavigationResult } from '../interface.uts'

export function openExternalMap(params: ExternalMapNavigationParams): ExternalMapNavigationResult {
	return { code: 'unsupported_platform' }
}
