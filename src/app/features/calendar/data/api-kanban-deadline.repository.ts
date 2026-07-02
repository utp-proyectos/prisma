import { ApiReponse } from '@/core/models/api-response.model'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import type { CalendarItemResponse } from '../models/calendar-api'
import type { KanbanDeadline } from '../models/kanban-deadline'
import { KanbanDeadlineRepository } from './kanban-deadline.repository'

@Injectable()
export class ApiKanbanDeadlineRepository extends KanbanDeadlineRepository {
	private readonly http = inject(HttpClient)

	override list(
		projectId: string,
		startDate: Date,
		endDate: Date,
	): Observable<KanbanDeadline[]> {
		return this.http
			.get<ApiReponse<CalendarItemResponse[]>>(`/projects/${projectId}/calendar`, {
				params: {
					startDate: toDateOnly(startDate),
					endDate: toDateOnly(endDate),
				},
			})
			.pipe(
				map((res) => res.data),
				map((items) =>
					items
						.filter((item) => item.type === 'DEADLINE')
						.map((item) => calendarItemToDeadline(item)),
				),
			)
	}
}

function calendarItemToDeadline(item: CalendarItemResponse): KanbanDeadline {
	return {
		id: item.id,
		title: item.title,
		date: parseBackendDate(item.start),
		cardId: item.sourceId,
		description: item.notes ?? undefined,
		color: item.color || '#f59e0b',
	}
}

function parseBackendDate(value: string): Date {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [year, month, day] = value.split('-').map(Number)
		return new Date(year, month - 1, day)
	}

	return new Date(value)
}

function toDateOnly(date: Date): string {
	const year = date.getFullYear()
	const month = `${date.getMonth() + 1}`.padStart(2, '0')
	const day = `${date.getDate()}`.padStart(2, '0')

	return `${year}-${month}-${day}`
}