import type { CalendarItemResponse } from './calendar-api'

export type CalendarSocketAction = 'CREATED' | 'UPDATED' | 'DELETED'

export interface CalendarSocketMessage {
	action: CalendarSocketAction
	projectId: string
	sourceId?: string
	item?: CalendarItemResponse
}