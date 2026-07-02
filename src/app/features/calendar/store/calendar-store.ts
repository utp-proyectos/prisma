import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core'
import { CalendarEventRepository } from '../data/calendar-event.repository'
import { KanbanDeadlineRepository } from '../data/kanban-deadline.repository'
import type { CalendarEvent } from '../models/calendar-event'
import type { KanbanDeadline } from '../models/kanban-deadline'

import { Websocket } from '@/core/servies/websocket'
import { Subscription } from 'rxjs'
import type { CalendarSocketMessage } from '../models/calendar-socket'

export type DialogMode = 'closed' | 'create' | 'edit'

interface CalendarRange {
	startDate: Date
	endDate: Date
}

@Injectable()
export class CalendarStore {
	private readonly eventsRepo = inject(CalendarEventRepository)
	private readonly deadlinesRepo = inject(KanbanDeadlineRepository)

	private readonly websocket = inject(Websocket)
	private readonly destroyRef = inject(DestroyRef)

	private realtimeSubscription?: Subscription
	private realtimeKey: string | null = null											

	private readonly _projectId = signal<string | null>(null)
	private readonly _range = signal<CalendarRange | null>(null)

	private readonly _events = signal<CalendarEvent[]>([])
	private readonly _deadlines = signal<KanbanDeadline[]>([])

	readonly events = this._events.asReadonly()
	readonly deadlines = this._deadlines.asReadonly()

	readonly totalCount = computed(() => this._events().length + this._deadlines().length)

	private readonly _dialogMode = signal<DialogMode>('closed')
	private readonly _editingEvent = signal<CalendarEvent | null>(null)
	private readonly _seedDate = signal<Date | null>(null)

	readonly dialogMode = this._dialogMode.asReadonly()
	readonly editingEvent = this._editingEvent.asReadonly()
	readonly seedDate = this._seedDate.asReadonly()

	private readonly _selectedDeadline = signal<KanbanDeadline | null>(null)
	readonly selectedDeadline = this._selectedDeadline.asReadonly()
	readonly deadlineDialogState = computed(() =>
		this._selectedDeadline() ? 'open' : 'closed',
	)

	constructor() {
		this.destroyRef.onDestroy(() => {
			this.realtimeSubscription?.unsubscribe()
		})
	}

	

	connectRealtime(teamId: string, projectId: string): void {
		const key = `${teamId}:${projectId}`

		if (this.realtimeKey === key) return

		this.realtimeSubscription?.unsubscribe()
		this.realtimeKey = key

		const topic = `/topic/${teamId}/projects/${projectId}/calendar`

		this.realtimeSubscription = this.websocket.watch(topic).subscribe((message) => {
			const payload = JSON.parse(message.body) as CalendarSocketMessage

			if (payload.projectId !== projectId) return

			this.refresh()
		})
	}

	loadRange(projectId: string, startDate: Date, endDate: Date): void {
		this._projectId.set(projectId)
		this._range.set({ startDate, endDate })

		this.eventsRepo.list(projectId, startDate, endDate).subscribe((events) => {
			this._events.set(events)
		})

		this.deadlinesRepo.list(projectId, startDate, endDate).subscribe((deadlines) => {
			this._deadlines.set(deadlines)
		})
	}

	createEvent(event: CalendarEvent): void {
		const projectId = this._projectId()
		if (!projectId) return

		this.eventsRepo.create(projectId, event).subscribe((created) => {
			this._events.update((list) => [...list, created])
		})
	}

	updateEvent(event: CalendarEvent): void {
		const projectId = this._projectId()
		if (!projectId) return

		this.eventsRepo.update(projectId, event).subscribe((saved) => {
			this._events.update((list) => list.map((e) => (e.id === saved.id ? saved : e)))
		})
	}

	removeEvent(id: string): void {
		const projectId = this._projectId()
		if (!projectId) return

		const event = this._events().find((e) => e.id === id)
		if (!event) return

		this.eventsRepo.remove(projectId, event).subscribe(() => {
			this._events.update((list) => list.filter((e) => e.id !== id))
		})
	}

	moveEvent(id: string, newStart: Date, newEnd: Date | null): void {
		const event = this._events().find((e) => e.id === id)
		if (!event) return

		this.updateEvent({ ...event, start: newStart, end: newEnd })
	}

	refresh(): void {
		const projectId = this._projectId()
		const range = this._range()

		if (!projectId || !range) return

		this.loadRange(projectId, range.startDate, range.endDate)
	}

	openCreate(seedDate?: Date): void {
		this._editingEvent.set(null)
		this._seedDate.set(seedDate ?? null)
		this._dialogMode.set('create')
	}

	openEdit(event: CalendarEvent): void {
		this._editingEvent.set(event)
		this._seedDate.set(null)
		this._dialogMode.set('edit')
	}

	closeDialog(): void {
		this._dialogMode.set('closed')
		this._editingEvent.set(null)
		this._seedDate.set(null)
	}

	openDeadlineInfo(deadline: KanbanDeadline): void {
		this._selectedDeadline.set(deadline)
	}

	closeDeadlineInfo(): void {
		this._selectedDeadline.set(null)
	}
}