import { Component, input, output } from '@angular/core'
import { lucideCalendar, lucideFlag, lucideMoreHorizontal, lucideUsers } from '@ng-icons/lucide'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { TaskDetailResponse } from '@/features/kanban/models/task/task-detail-response.model'

@Component({
	selector: 'app-task-card',
	standalone: true,
	templateUrl: './task-card.html',
	imports: [NgIcon, HlmCardImports],
	providers: [
		provideIcons({
			lucideMoreHorizontal,
			lucideUsers,
			lucideCalendar,
			lucideFlag,
		}),
	],
})
export class TaskCardComponent {
	task = input.required<TaskDetailResponse>()

	opened = output<TaskDetailResponse>()

	protected onCardClick(event: MouseEvent) {
		const target = event.target as HTMLElement
		if (target.closest('button')) return

		this.opened.emit(this.task())
	}
}
