import { Injectable, inject, signal, computed } from '@angular/core'
import { AuthService } from '@/core/servies/auth.serive'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'

@Injectable()
export class TaskFilterService {
	private readonly authService = inject(AuthService)

	readonly taskSearch = signal('')
	readonly onlyMyTasks = signal(false)

	matches(task: TaskDetailResponse): boolean {
		const search = this.taskSearch().trim().toLowerCase()

		if (search) {
			const title = task.title.toLowerCase()
			const description = (task.description ?? '').toLowerCase()
			const priority = task.priority.toLowerCase()
			const members =
				task.assignments?.map((a) => `${a.name} ${a.lastName}`.toLowerCase()).join(' ') ?? ''

			const matchSearch =
				title.includes(search) ||
				description.includes(search) ||
				priority.includes(search) ||
				members.includes(search)

			if (!matchSearch) return false
		}

		if (this.onlyMyTasks()) {
			const myId = this.authService.currentUser()?.id
			const assigned = task.assignments?.some((a) => a.userId === myId)
			if (!assigned) return false
		}

		return true
	}

	filterTasks(tasks: TaskDetailResponse[]): TaskDetailResponse[] {
		return tasks.filter((task) => this.matches(task))
	}
}
