export interface CalendarItemResponse {
	id: string
	title: string
	start: string
	end: string | null
	allDay: boolean
	type: 'EVENT' | 'DEADLINE'
	sourceId: string
	editable: boolean
	color: string
	notes?: string | null
}

export interface CalendarEventRequest {
	title: string
	startDate: string
	endDate: string
	startTime: string | null
	endTime: string | null
	allDay: boolean
	notes?: string | null
}