import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from '../servies/auth.serive'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService)

	if (req.url.includes('/auth/')) return next(req)

	const user = authService.currentUser()

	if (user && user.token) {
		const authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${user.token}`,
			},
		})
		return next(authReq)
	}

	return next(req)
}
