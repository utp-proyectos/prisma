import type { EventInput } from '@fullcalendar/core'
import type { CalendarEvent } from '../../models/calendar-event'
import type { KanbanDeadline } from '../../models/kanban-deadline'

const EVENT_COLORS = [
	'#3b82f6', // blue
	'#22c55e', // green
	'#a855f7', // purple
	'#ec4899', // pink
	'#14b8a6', // teal
	'#f97316', // orange
	'#6366f1', // indigo
]

function stableColorFromId(id: string): string {
	let hash = 0

	for (let i = 0; i < id.length; i++) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash)
	}

	const index = Math.abs(hash) % EVENT_COLORS.length
	return EVENT_COLORS[index]
}

export function eventToFullCalendar(event: CalendarEvent): EventInput {
	const color = event.color || stableColorFromId(event.sourceId ?? event.id)

	return {
		id: event.id,
		title: event.title,
		start: event.start,
		end: event.end ?? undefined,
		allDay: event.allDay,
		editable: true,
		backgroundColor: color,
		borderColor: color,
		classNames: ['calendar-event-owned'],
		extendedProps: {
			source: 'calendar',
			sourceId: event.sourceId,
			description: event.description ?? '',
		},
	}
}

export function deadlineToFullCalendar(deadline: KanbanDeadline): EventInput {
	const color = deadline.color || '#f59e0b'

	return {
		id: deadline.id,
		title: deadline.title,
		start: deadline.date,
		allDay: true,
		editable: false,
		display: 'block',
		backgroundColor: 'transparent',
		borderColor: color,
		textColor: color,
		classNames: ['calendar-deadline-event'],
		extendedProps: {
			source: 'kanban-deadline',
			boardName: deadline.boardName ?? 'Kanban',
			cardId: deadline.cardId,
			description: deadline.description ?? '',
		},
	}
}