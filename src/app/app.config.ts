import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { baseUrlInterceptor } from './core/interceptors/api.interceptor'
import { authInterceptor } from './core/interceptors/auth.interceptor'
import { unauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor'

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(
			withInterceptors([baseUrlInterceptor, authInterceptor, unauthorizedInterceptor]),
		),
	],
}
