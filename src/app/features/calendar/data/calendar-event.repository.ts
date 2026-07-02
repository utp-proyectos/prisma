import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import type { CalendarEvent } from '../models/calendar-event'

export abstract class CalendarEventRepository {
	abstract list(projectId: string, startDate: Date, endDate: Date): Observable<CalendarEvent[]>
	abstract create(projectId: string, event: CalendarEvent): Observable<CalendarEvent>
	abstract update(projectId: string, event: CalendarEvent): Observable<CalendarEvent>
	abstract remove(projectId: string, event: CalendarEvent): Observable<void>
}

function dayThisMonth(day: number, hour = 0, minute = 0): Date {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth(), day, hour, minute)
}

@Injectable()
export class MockCalendarEventRepository extends CalendarEventRepository {
	private events: CalendarEvent[] = [
		{
			id: crypto.randomUUID(),
			title: 'Reunión de equipo',
			start: dayThisMonth(10, 10, 0),
			end: dayThisMonth(10, 11, 30),
			allDay: true,
			description: 'Sincronización semanal',
			color: '#caff3d',
		},
	]

	override list(): Observable<CalendarEvent[]> {
		return of(this.events.map((e) => ({ ...e })))
	}

	override create(_projectId: string, event: CalendarEvent): Observable<CalendarEvent> {
		this.events = [...this.events, event]
		return of({ ...event })
	}

	override update(_projectId: string, event: CalendarEvent): Observable<CalendarEvent> {
		this.events = this.events.map((e) => (e.id === event.id ? { ...event } : e))
		return of({ ...event })
	}

	override remove(_projectId: string, event: CalendarEvent): Observable<void> {
		this.events = this.events.filter((e) => e.id !== event.id)
		return of(void 0)
	}
}