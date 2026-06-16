import { Routes } from '@angular/router'
import { Login } from './pages/login/login'
import { Register } from './pages/register/register'
import { AuthLayout } from './layout/auth-layout/auth-layout'

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
		],
	},
]
