import { Routes } from '@angular/router'
import { Login } from './pages/login/login'
import { Register } from './pages/register/register'
import { AuthLayout } from './layout/auth-layout/auth-layout'
import { VerifyEmail } from './pages/verify-email/verify-email'
import { AuthCallback } from './pages/auth-callback/auth-callback'

export const authRoutes: Routes = [
	{
		path: '',
		component: AuthLayout,
		children: [
			{
				path: 'login',
				component: Login,
			},
			{
				path: 'register',
				component: Register,
			},
			{
				path: 'verify-email',
				component: VerifyEmail,
			},
			{
				path: 'callback',
				component: AuthCallback,
			},
		],
	},
]
