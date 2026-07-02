import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CalendarEventDialog } from '../../components/calendar-event-dialog/event-dialog'
import { CalendarToolbar } from '../../components/calendar-toolbar/calendar-toolbar'
import { CalendarView } from '../../components/calendar-view/calendar-view'
import type { CalendarViewMode } from '../../models/calendar-view-mode'
import { CalendarStore } from '../../store/calendar-store'
import { CalendarDeadlineDialog } from '../../components/calendar-deadline-dialog/calendar-deadline-dialog'

@Component({
	selector: 'app-calendar-page',
	imports: [CalendarToolbar, CalendarView, CalendarEventDialog, CalendarDeadlineDialog],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-page.html',
})
export class CalendarPage {
	private readonly calendarView = viewChild(CalendarView)
	private readonly route = inject(ActivatedRoute)
	private readonly store = inject(CalendarStore)

	protected readonly title = signal('')
	protected readonly activeView = signal<CalendarViewMode>('month')

	onPrevious(): void {
		this.calendarView()?.goPrev()
	}

	onToday(): void {
		this.calendarView()?.goToday()
	}

	onNext(): void {
		this.calendarView()?.goNext()
	}

	onViewSelected(view: CalendarViewMode): void {
		this.calendarView()?.changeView(view)
	}

	onNewEvent(): void {
		this.store.openCreate()
	}

	onTitleChange(title: string): void {
		this.title.set(title)
	}

	onViewChange(view: CalendarViewMode): void {
		this.activeView.set(view)
	}

	onRangeChange(range: { start: Date; end: Date }): void {
		const teamId = this.getRouteParam('teamId')
		const projectId = this.getRouteParam('projectId')

		if (!teamId || !projectId) return

		this.store.connectRealtime(teamId, projectId)
		this.store.loadRange(projectId, range.start, range.end)
	}

	private getRouteParam(paramName: string): string | null {
		let currentRoute: ActivatedRoute | null = this.route

		while (currentRoute) {
			const value = currentRoute.snapshot.paramMap.get(paramName)
			if (value) return value

			currentRoute = currentRoute.parent
		}

		return null
	}
}