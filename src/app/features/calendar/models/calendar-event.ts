export interface CalendarEvent {
	id: string
	sourceId?: string
	title: string
	start: Date
	end: Date | null
	allDay: boolean
	description?: string
	color?: string
}