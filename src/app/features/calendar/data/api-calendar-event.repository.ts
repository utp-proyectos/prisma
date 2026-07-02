import { ApiResponse } from '@/core/models/api-response.model'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import type { CalendarEvent } from '../models/calendar-event'
import type { CalendarEventRequest, CalendarItemResponse } from '../models/calendar-api'
import { CalendarEventRepository } from './calendar-event.repository'

@Injectable()
export class ApiCalendarEventRepository extends CalendarEventRepository {
	private readonly http = inject(HttpClient)

	override list(projectId: string, startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
		return this.http
			.get<ApiResponse<CalendarItemResponse[]>>(`/projects/${projectId}/calendar`, {
				params: {
					startDate: toDateOnly(startDate),
					endDate: toDateOnly(endDate),
				},
			})
			.pipe(
				map((res) => res.data),
				map((items) =>
					items.filter((item) => item.type === 'EVENT').map((item) => calendarItemToEvent(item)),
				),
			)
	}

	override create(projectId: string, event: CalendarEvent): Observable<CalendarEvent> {
		const request = eventToRequest(event)

		return this.http
			.post<ApiResponse<CalendarItemResponse>>(`/projects/${projectId}/calendar/events`, request)
			.pipe(
				map((res) => res.data),
				map((item) => calendarItemToEvent(item)),
			)
	}

	override update(projectId: string, event: CalendarEvent): Observable<CalendarEvent> {
		const eventId = getBackendEventId(event)
		const request = eventToRequest(event)

		return this.http
			.put<
				ApiResponse<CalendarItemResponse>
			>(`/projects/${projectId}/calendar/events/${eventId}`, request)
			.pipe(
				map((res) => res.data),
				map((item) => calendarItemToEvent(item)),
			)
	}

	override remove(projectId: string, event: CalendarEvent): Observable<void> {
		const eventId = getBackendEventId(event)

		return this.http
			.delete<ApiResponse<void>>(`/projects/${projectId}/calendar/events/${eventId}`)
			.pipe(map(() => void 0))
	}
}

function calendarItemToEvent(item: CalendarItemResponse): CalendarEvent {
	return {
		id: item.id,
		sourceId: item.sourceId,
		title: item.title,
		start: parseBackendDate(item.start),
		end: item.end ? parseBackendDate(item.end) : null,
		allDay: item.allDay,
		description: item.notes ?? undefined,
		color: item.color === '#3788d8' ? undefined : item.color,
	}
}

function eventToRequest(event: CalendarEvent): CalendarEventRequest {
	const backendEndDate =
		event.allDay && event.end ? addDays(event.end, -1) : (event.end ?? event.start)

	return {
		title: event.title,
		startDate: toDateOnly(event.start),
		endDate: toDateOnly(backendEndDate),
		startTime: event.allDay ? null : toTimeOnly(event.start),
		endTime: event.allDay ? null : toTimeOnly(event.end ?? event.start),
		allDay: event.allDay,
		notes: event.description ?? null,
	}
}

function getBackendEventId(event: CalendarEvent): string {
	if (event.sourceId) return event.sourceId
	if (event.id.startsWith('event-')) return event.id.replace('event-', '')
	return event.id
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

function toTimeOnly(date: Date): string {
	const hours = `${date.getHours()}`.padStart(2, '0')
	const minutes = `${date.getMinutes()}`.padStart(2, '0')

	return `${hours}:${minutes}`
}

function addDays(date: Date, days: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}
