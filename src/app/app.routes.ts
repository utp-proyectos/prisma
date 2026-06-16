import { Routes } from '@angular/router'
import { AuthLayout } from '@/layouts'

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth/login',
	},
	{
		path: 'auth',
		component: AuthLayout,
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
	},
]
