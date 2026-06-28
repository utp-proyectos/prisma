import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'
import { AuthService } from '../servies/auth.serive'

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService)
	const router = inject(Router)

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			const isAuthRequest = req.url.includes('/auth/')

			if (error.status === 401 && !isAuthRequest) {
				authService.clearSession()
				router.navigate(['/auth/login'])
			}

			return throwError(() => error)
		}),
	)
}
