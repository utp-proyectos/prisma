import { Routes } from '@angular/router'
import { AppLayout } from './layout/app-layout/app-layout'
import { BoardEditorPage } from './features/board/page/board-editor-page/board-editor-page'

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
			{
				path: 'board',
				loadChildren: () => import('./features/board/board.routes').then((m) => m.boardRoutes),
			},
			{
				path: 'kanban',
				loadChildren: () => import('./features/kanban/kanban.routes').then((m) => m.kanbanRoutes),
			},
		],
	},
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
	},
	{
		path: 'board/:boardId',
		component: BoardEditorPage,
	},
]
