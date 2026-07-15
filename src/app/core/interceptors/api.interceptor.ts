import { HttpInterceptorFn } from '@angular/common/http'
import { environment } from '../../../environments/environment'
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
	const baseUrl = `${environment.apiUrl}/api`

	if (req.url.startsWith('/')) {
		const apiReq = req.clone({
			url: `${baseUrl}${req.url}`,
		})

		return next(apiReq)
	}

	return next(req)
}
