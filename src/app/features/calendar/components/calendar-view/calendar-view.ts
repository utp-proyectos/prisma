import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	output,
	viewChild,
} from '@angular/core'
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular'
import type { CalendarOptions, DatesSetArg, EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarStore } from '../../store/calendar-store'
import { type CalendarViewMode, VIEW_MODE_TO_FULLCALENDAR } from '../../models/calendar-view-mode'
import { deadlineToFullCalendar, eventToFullCalendar } from './event-mapper'

import type { EventClickArg } from '@fullcalendar/core'
import type { EventDropArg } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'

@Component({
	selector: 'app-calendar-view',
	imports: [FullCalendarModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-view.html',
	styleUrl: './calendar-view.css',
	host: { class: 'dark block h-full' },
})
export class CalendarView {
	private readonly store = inject(CalendarStore)
	private readonly calendarComponent = viewChild(FullCalendarComponent)

	readonly titleChange = output<string>()
	readonly viewChange = output<CalendarViewMode>()
	readonly rangeChange = output<{ start: Date; end: Date }>()

	protected readonly fcEvents = computed<EventInput[]>(() => [
		...this.store.events().map(eventToFullCalendar),
		...this.store.deadlines().map(deadlineToFullCalendar),
	])

	protected readonly calendarOptions: CalendarOptions = {
		plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		height: '100%',
		headerToolbar: false,
		locale: 'es',
		dayMaxEvents: false,
		expandRows: true,
		editable: true,
		eventResizableFromStart: true,
		datesSet: (arg) => this.onDatesSet(arg),
		eventClick: (args) => this.onEventClick(args),
		dateClick: (arg) => this.store.openCreate(arg.date),
		eventDrop: (arg) => this.onEventChanged(arg),
		eventResize: (arg) => this.onEventChanged(arg),
	}

	goNext(): void {
		this.api()?.next()
	}
	goPrev(): void {
		this.api()?.prev()
	}
	goToday(): void {
		this.api()?.today()
	}
	changeView(view: CalendarViewMode): void {
		this.api()?.changeView(VIEW_MODE_TO_FULLCALENDAR[view])
	}

	private api() {
		return this.calendarComponent()?.getApi()
	}

	private onDatesSet(arg: DatesSetArg): void {
		this.titleChange.emit(arg.view.title)
		this.viewChange.emit(this.fullCalendarToViewMode(arg.view.type))
		this.rangeChange.emit({
			start: arg.start,
			end: arg.end,
		})
	}

	private fullCalendarToViewMode(type: string): CalendarViewMode {
		switch (type) {
			case 'timeGridWeek':
				return 'week'
			case 'timeGridDay':
				return 'day'
			case 'listWeek':
				return 'agenda'
			default:
				return 'month'
		}
	}

	private onEventClick(arg: EventClickArg): void {
		const source = arg.event.extendedProps['source']

		if (source === 'calendar') {
			const event = this.store.events().find((e) => e.id === arg.event.id)
			if (event) this.store.openEdit(event)
			return
		}

		if (source === 'kanban-deadline') {
			const deadline = this.store.deadlines().find((d) => d.id === arg.event.id)
			if (deadline) this.store.openDeadlineInfo(deadline)
		}
	}

	private onEventChanged(arg: EventDropArg | EventResizeDoneArg): void {
		if (arg.event.extendedProps['source'] !== 'calendar') {
			arg.revert()
			return
		}

		const id = arg.event.id
		const newStart = arg.event.start
		const newEnd = arg.event.end
		if (!newStart) return

		this.store.moveEvent(id, newStart, newEnd)
	}
}
