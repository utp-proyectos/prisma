import { Routes } from '@angular/router'
import { AppLayout } from './layout/app-layout/app-layout'
import { BoardEditorPage } from './features/board/page/board-editor-page/board-editor-page'
import { authGuard, publicGuard } from './core/guards/auth.guard'

export const routes: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
	},
	{
		path: 'team/:teamId/project/:projectId',
		canActivate: [authGuard],
		component: AppLayout,
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/resume/pages/project-resume/project-resume').then(
						(m) => m.ProjectResume,
					),
			},
			{
				path: 'chat',
				title: 'Chat',
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
			{
				path: 'calendar',
				loadChildren: () =>
					import('./features/calendar/calendar.routes').then((m) => m.calendarRoutes),
			},
		],
	},
	{
		path: 'auth',
		canActivate: [publicGuard],
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
	},
	{
		path: 'invitations',
		canActivate: [authGuard],
		loadChildren: () =>
			import('./features/invitation/invitation.routes').then((m) => m.invitationRoutes),
	},
	{
		path: 'board/:boardId',
		component: BoardEditorPage,
	},
]
