import { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
	},
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
	},
	{
		path: 'boards',
		loadChildren: () => import('./features/board/board.routes').then((m) => m.boardRoutes),
	},
]
