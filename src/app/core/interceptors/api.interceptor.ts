import { HttpInterceptorFn } from '@angular/common/http'
import { config } from '../config'

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
	const baseUrl = `${config.apiUrl}/api`

	if (req.url.startsWith('/')) {
		const apiReq = req.clone({
			url: `${baseUrl}${req.url}`,
		})

		return next(apiReq)
	}

	return next(req)
}
