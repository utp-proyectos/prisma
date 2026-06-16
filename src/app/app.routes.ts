import { Routes } from '@angular/router'
<<<<<<< HEAD
import { BoardPage } from './features/board/page/board-page'

export const routes: Routes = [
	{
		path: 'Board',
		component: BoardPage,
=======

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth/login',
	},
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
>>>>>>> 0c364fe3089b5e58419d8c4c640771003bf885f2
	},
]
