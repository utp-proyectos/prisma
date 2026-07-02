export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda'

export const VIEW_MODE_LABELS: Record<CalendarViewMode, string> = {
	month: 'Mes',
	week: 'Semana',
	day: 'Dia',
	agenda: 'Agenda',
}

export const VIEW_MODE_TO_FULLCALENDAR: Record<CalendarViewMode, string> = {
	month: 'dayGridMonth',
	week: 'timeGridWeek',
	day: 'timeGridDay',
	agenda: 'listWeek',
}
