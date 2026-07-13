import { ColumnKanbanDetailResponse } from '@/features/kanban/models/column-kanban/column-kanban-detail-response.model'
import { MilestoneSummaryResponse } from '@/features/kanban/models/milestone/milestone-summary-response.model'
import { TaskDetailResponse } from '@/features/kanban/models/task/task-detail-response.model'
import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

export interface TaskModalStateStructure {
	opened: BrnDialogState
	task: TaskDetailResponse | null
	column: ColumnKanbanDetailResponse | null
	milestone: MilestoneSummaryResponse | null
}

@Injectable()
export class TaskModalState {
	private state = signal<TaskModalStateStructure>({
		opened: 'closed',
		task: null,
		column: null,
		milestone: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly task = computed(() => this.state().task)
	readonly column = computed(() => this.state().column)
	readonly milestone = computed(() => this.state().milestone)

	openForEdit(task: TaskDetailResponse) {
		this.state.set({
			opened: 'open',
			task,
			column: null,
			milestone: null,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
