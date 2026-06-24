import { Routes } from '@angular/router'
import { AuthLayout } from './layout/auth-layout/auth-layout'

export const authRoutes: Routes = [
	{
		path: '',
		component: AuthLayout,
		children: [
			{
				path: 'login',
				loadComponent: () => import('./pages/login/login').then((m) => m.Login),
			},
			{
				path: 'register',
				loadComponent: () => import('./pages/register/register').then((m) => m.Register),
			},
			{
				path: 'verify-email',
				loadComponent: () => import('./pages/verify-email/verify-email').then((m) => m.VerifyEmail),
			},
			{
				path: 'callback',
				loadComponent: () =>
					import('./pages/auth-callback/auth-callback').then((m) => m.AuthCallback),
			},
		],
	},
]
