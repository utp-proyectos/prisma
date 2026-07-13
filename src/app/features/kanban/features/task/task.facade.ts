import { inject, Injectable } from '@angular/core'
import { TaskApi } from './task.api'
import { TaskModalState } from './task-modal/task-modal-state'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { toast } from '@spartan-ng/brain/sonner'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { ColumnTaskState } from '../column-task/column-task-state'

@Injectable()
export class TaskFacade {
	private readonly api = inject(TaskApi)
	private readonly modalState = inject(TaskModalState)
	private readonly state = inject(ColumnTaskState)

	readonly task = this.modalState.task
	readonly dialogState = this.modalState.dialogState

	findTask(id: string) {
		return this.state.findTask(id)
	}

	// ===========================
	// MODAL
	// ===========================

	open(task: TaskDetailResponse) {
		this.modalState.openForEdit(task)
	}

	close() {
		this.modalState.close()
	}

	// ===========================
	// CRUD
	// ===========================

	create(
		column: ColumnKanbanDetailResponse,
		params: {
			teamId: string
			projectId: string
			kanbanId: string
		},
	) {
		this.api.createTask({
			title: 'Nueva tarea',
			description: '',
			deadline: '',
			priority: 'BAJA',
			groupTask: false,
			milestoneId: '',
			columnId: column.id,
			...params,
		})

		toast.success('Tarea creada')
	}

	createByMilestone(
		milestone: { id: string; deadline: string | null },
		firstColumn: { id: string },
		params: { teamId: string; projectId: string; kanbanId: string },
	) {
		this.api.createTask({
			title: 'Nueva tarea',
			description: '',
			priority: 'BAJA',
			groupTask: false,
			deadline: milestone.deadline,
			milestoneId: milestone.id,
			columnId: firstColumn.id,
			...params,
		})

		toast.success('Tarea creada para el hito')
	}

	delete(
		id: string,
		params: {
			teamId: string
			projectId: string
			kanbanId: string
		},
	) {
		this.api.deleteTask({
			id,
			...params,
		})

		toast.success('Tarea eliminada')
	}
}
