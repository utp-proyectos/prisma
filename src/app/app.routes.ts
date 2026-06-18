import { Routes } from '@angular/router'
import { AppLayout } from './layout/app-layout/app-layout'

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
	},
	{
		path: 'team/project',
		component: AppLayout,
		children: [
			{
				path: 'chat',
				loadChildren: () => import('./features/chat/chat.routes').then((m) => m.chatRoutes),
			},
		],
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
