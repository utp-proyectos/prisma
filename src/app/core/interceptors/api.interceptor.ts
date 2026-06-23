import { HttpInterceptorFn } from '@angular/common/http'

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
	const baseUrl = 'http://localhost:8080/api'

	if (req.url.startsWith('/')) {
		const apiReq = req.clone({
			url: `${baseUrl}${req.url}`,
		})

		return next(apiReq)
	}

	return next(req)
}
