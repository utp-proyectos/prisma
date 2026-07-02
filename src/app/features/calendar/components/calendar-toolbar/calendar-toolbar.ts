import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronLeft, lucideChevronRight, lucidePlus } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { type CalendarViewMode, VIEW_MODE_LABELS } from '../../models/calendar-view-mode'

@Component({
	selector: 'app-calendar-toolbar',
	imports: [NgIcon, HlmButtonImports],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-toolbar.html',
})
export class CalendarToolbar {
	readonly title = input<string>('')
	readonly activeView = input<CalendarViewMode>('month')

	readonly previous = output<void>()
	readonly today = output<void>()
	readonly next = output<void>()
	readonly viewSelected = output<CalendarViewMode>()
	readonly newEvent = output<void>()

	readonly views = Object.entries(VIEW_MODE_LABELS) as Array<[CalendarViewMode, string]>
}
