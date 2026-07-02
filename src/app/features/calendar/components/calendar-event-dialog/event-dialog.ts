import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core'
import { form, FormField, required, submit } from '@angular/forms/signals'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDatePickerImports, provideHlmDateRangePickerConfig } from '@spartan-ng/helm/date-picker'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { CalendarStore } from '../../store/calendar-store'
import type { EventFormModel } from '../../models/event-form'
import type { CalendarEvent } from '../../models/calendar-event'

function emptyForm(seed?: Date): EventFormModel {
	const base = seed ?? new Date()
	const day = new Date(base.getFullYear(), base.getMonth(), base.getDate())
	return {
		title: '',
		dateRange: [day, day],
		allDay: false,
		startTime: '10:00',
		endTime: '11:00',
		description: '',
	}
}

@Component({
	selector: 'app-calendar-event-dialog',
	imports: [
		FormField,
		HlmDialogImports,
		HlmButtonImports,
		HlmFieldImports,
		HlmInputImports,
		HlmTextareaImports,
		HlmDatePickerImports,
	],
	providers: [
		provideHlmDateRangePickerConfig<Date>({
			formatDates: (dates) => {
				const fmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
				const [start, end] = dates
				if (start && end && start.getTime() !== end.getTime()) {
					return `${fmt.format(start)} - ${fmt.format(end)}`
				}
				if (start) return fmt.format(start)
				return ''
			},
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-event-dialog.html',
})
export class CalendarEventDialog {
	private readonly store = inject(CalendarStore)

	readonly isEditing = computed(() => this.store.dialogMode() === 'edit')
	readonly dialogState = computed(() => (this.store.dialogMode() === 'closed' ? 'closed' : 'open'))

	private readonly model = signal<EventFormModel>(emptyForm())

	readonly eventForm = form(this.model, (path) => {
		required(path.title, { message: 'El título es obligatorio' })
	})

	constructor() {
		effect(() => {
			const mode = this.store.dialogMode()
			if (mode === 'edit') {
				const ev = this.store.editingEvent()
				if (ev) this.model.set(this.eventToForm(ev))
			} else if (mode === 'create') {
				this.model.set(emptyForm(this.store.seedDate() ?? undefined))
			}
		})
	}

	save(): void {
		submit(this.eventForm, async () => {
			const v = this.model()
			const event = this.formToEvent(v)
			if (this.isEditing()) {
				const editing = this.store.editingEvent()
				if (editing) this.store.updateEvent({ ...event, id: editing.id, color: editing.color })
			} else {
				this.store.createEvent(event)
			}
			this.store.closeDialog()
		})
	}

	delete(): void {
		const ev = this.store.editingEvent()
		if (ev) this.store.removeEvent(ev.id)
		this.store.closeDialog()
	}

	close(): void {
		this.store.closeDialog()
	}


	private eventToForm(ev: CalendarEvent): EventFormModel {
		const start = ev.start
		const end = ev.allDay ? this.addDays(ev.end ?? ev.start, -1) : ev.end ?? ev.start

		const hhmm = (d: Date) =>
			`${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`

		return {
			title: ev.title,
			dateRange: [start, end],
			allDay: ev.allDay,
			startTime: hhmm(start),
			endTime: hhmm(end),
			description: ev.description ?? '',
		}
	}

	private formToEvent(v: EventFormModel): CalendarEvent {
		const [rangeStart, rangeEnd] = v.dateRange

		const start = v.allDay
			? new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate())
			: this.withTime(rangeStart, v.startTime)

		const end = v.allDay
			? this.addDays(new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()), 1)
			: this.withTime(rangeEnd, v.endTime)

		return {
			id: crypto.randomUUID(),
			title: v.title.trim() || 'Sin título',
			start,
			end,
			allDay: v.allDay,
			description: v.description.trim() || undefined,
			color: '#3788d8',
		}
	}

	private withTime(date: Date, time: string): Date {
		const [h, m] = time.split(':').map((n) => Number.parseInt(n, 10) || 0)
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m)
	}

	private addDays(date: Date, days: number): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
	}
}
