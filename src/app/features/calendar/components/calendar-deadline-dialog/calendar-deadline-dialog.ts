import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { DatePipe } from '@angular/common'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { CalendarStore } from '../../store/calendar-store'

@Component({
	selector: 'app-calendar-deadline-dialog',
	imports: [DatePipe, HlmDialogImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-deadline-dialog.html',
})
export class CalendarDeadlineDialog {
	private readonly store = inject(CalendarStore)

	protected readonly deadline = this.store.selectedDeadline
	protected readonly dialogState = this.store.deadlineDialogState

	protected readonly formattedDate = computed(() => {
		const deadline = this.deadline()
		if (!deadline) return ''
		return deadline.date
	})

	close(): void {
		this.store.closeDeadlineInfo()
	}
}