import { Component, inject, input, output } from '@angular/core'
import { lucideCalendar, lucideFlag, lucideMoreHorizontal, lucideUsers } from '@ng-icons/lucide'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { TaskDetailResponse } from '@/features/kanban/models/task/task-detail-response.model'
import { getAssignmentInitials } from '@/features/kanban/utils/string.utils'
import { HlmAvatarGroup, HlmAvatar, HlmAvatarGroupCount } from '@spartan-ng/helm/avatar'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { TaskFacade } from '@/features/kanban/features/task/task.facade'

@Component({
	selector: 'app-task-card',
	standalone: true,
	templateUrl: './task-card.html',
	imports: [
		NgIcon,
		HlmCardImports,
		HlmDropdownMenuImports,
		HlmAvatarGroup,
		HlmAvatar,
		HlmAvatarGroupCount,
	],
	host: {
		class: 'block w-full',
	},
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

	showActions = input<boolean>(true)

	taskFacade = inject(TaskFacade)

	protected onCardClick(event: MouseEvent) {
		const target = event.target as HTMLElement
		if (target.closest('button')) return

		this.opened.emit(this.task())
	}

	// Formato de avatar
	readonly getInitials = getAssignmentInitials

	readonly delete = output<TaskDetailResponse>()

	onDeleteClick(event: Event) {
		event.stopPropagation()
		this.delete.emit(this.task())
	}
}
