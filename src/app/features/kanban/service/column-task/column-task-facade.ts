import { inject, Injectable } from '@angular/core'
import { ColumnTaskState } from './column-task-state'
import { KanbanApi } from '../kanban-api'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { MilestoneDetailResponse } from '../../models/milestone/milestone-detail-response.model'

@Injectable()
export class ColumnTaskFacade {
	private columnTaskState = inject(ColumnTaskState)
	private kanbanApi = inject(KanbanApi)

	dropTask(
		event: CdkDragDrop<TaskDetailResponse[]>,
		params: { teamId: string; projectId: string; kanbanId: string },
	) {
		// 1. UI Optimista + Obtener el DTO directamente de la columna destino
		const targetTasks = this.columnTaskState.moveTaskOptimistic(event)

		// 2. Llamar a la API
		this.kanbanApi.reorderTasks({
			...params,
			taskId: event.item.data.id,
			targetColumnId: event.container.id,
			targetTasks: targetTasks,
		})
	}

	dropColumn(
		event: CdkDragDrop<ColumnKanbanDetailResponse[]>,
		params: { teamId: string; projectId: string; kanbanId: string },
	) {
		// 1. UI Optimista + Obtener el DTO
		const reorderedColumns = this.columnTaskState.moveColumnOptimistic(event)

		// 2. Llamar a la API
		this.kanbanApi.reorderColumns({
			...params,
			columns: reorderedColumns,
		})
	}

	createTask(
		column: ColumnKanbanDetailResponse,
		params: { teamId: string; projectId: string; kanbanId: string },
	) {
		this.kanbanApi.createTask({
			title: 'Nueva tarea',
			description: '',
			deadline: '',
			priority: 'BAJA',
			groupTask: false,
			milestoneId: '',
			columnId: column.id,
			...params,
		})
	}

	createTaskFromMilestone(
		milestone: MilestoneDetailResponse,
		params: { teamId: string; projectId: string; kanbanId: string },
	) {
		const firstColumn = this.columnTaskState.movableColumns()[0]

		if (!firstColumn) return

		this.kanbanApi.createTask({
			title: 'Nueva tarea',
			description: '',
			priority: 'BAJA',
			groupTask: false,
			deadline: milestone.deadline,
			milestoneId: milestone.id,
			columnId: firstColumn.id,
			...params,
		})
	}
}
