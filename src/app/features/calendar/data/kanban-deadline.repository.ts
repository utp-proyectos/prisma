import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import type { KanbanDeadline } from '../models/kanban-deadline'

export abstract class KanbanDeadlineRepository {
	abstract list(projectId: string, startDate: Date, endDate: Date): Observable<KanbanDeadline[]>
}

@Injectable()
export class EmptyKanbanDeadlineRepository extends KanbanDeadlineRepository {
	override list(
		_projectId: string,
		_startDate: Date,
		_endDate: Date,
	): Observable<KanbanDeadline[]> {
		return of([])
	}
}

function dayThisMonth(day: number): Date {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth(), day)
}

@Injectable()
export class MockKanbanDeadlineRepository extends KanbanDeadlineRepository {
	private deadlines: KanbanDeadline[] = [
		{
			id: crypto.randomUUID(),
			title: 'Deadline: Desarrollo Backend',
			date: dayThisMonth(13),
			boardName: 'Proyecto API',
			cardId: 'card-201',
		},
		{
			id: crypto.randomUUID(),
			title: 'Deadline: Funcionalidad API',
			date: dayThisMonth(20),
			boardName: 'Proyecto API',
			cardId: 'card-202',
		},
	]

	override list(
		_projectId: string,
		_startDate: Date,
		_endDate: Date,
	): Observable<KanbanDeadline[]> {
		return of(this.deadlines.map((d) => ({ ...d })))
	}
}