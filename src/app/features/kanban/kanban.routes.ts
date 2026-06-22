import { Routes } from '@angular/router'
import { KanbanLayout } from './layout/kanban-layout'
import { MainKanban } from './pages/main-kanban/main-kanban'
import { KanbanDetail } from './pages/kanban-detail/kanban-detail'

export const kanbanRoutes: Routes = [
	{
		path: '',
		component: KanbanLayout,
		children: [
			{
				path: 'general',
				component: MainKanban,
			},
			{
				path: 'tablero-1',
				component: KanbanDetail,
			},
		],
	},
]
