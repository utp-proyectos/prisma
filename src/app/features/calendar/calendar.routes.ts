import { Routes } from '@angular/router'
import { ApiCalendarEventRepository } from './data/api-calendar-event.repository'
import { CalendarEventRepository } from './data/calendar-event.repository'
import { ApiKanbanDeadlineRepository } from './data/api-kanban-deadline.repository'
import { KanbanDeadlineRepository } from './data/kanban-deadline.repository'
import { CalendarStore } from './store/calendar-store'

import { Websocket } from '@/core/servies/websocket'

export const calendarRoutes: Routes = [
	{
		path: '',
		providers: [
			Websocket,
			{ provide: CalendarEventRepository, useClass: ApiCalendarEventRepository },
			{ provide: KanbanDeadlineRepository, useClass: ApiKanbanDeadlineRepository },
			CalendarStore,
		],
		loadComponent: () =>
			import('./pages/calendar-page/calendar-page').then((m) => m.CalendarPage),
	},
]