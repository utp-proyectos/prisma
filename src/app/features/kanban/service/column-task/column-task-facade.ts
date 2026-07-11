import { inject, Injectable } from '@angular/core'
import { ColumnTaskState } from './column-task-state'
import { KanbanApi } from '../kanban-api'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'

@Injectable()
export class ColumnTaskFacade {
	private columnTaskState = inject(ColumnTaskState)
	private kanbanApi = inject(KanbanApi)

	dropTask(
		event: CdkDragDrop<TaskDetailResponse[]>,
		ctx: { teamId: string; projectId: string; kanbanId: string },
	) {
		const columnsClone = structuredClone(this.columnTaskState.columns())

		const sourceCol = columnsClone.find((c) => c.id === event.previousContainer.id)
		const targetCol = columnsClone.find((c) => c.id === event.container.id)

		if (!sourceCol || !targetCol) return

		if (event.previousContainer === event.container) {
			moveItemInArray(targetCol.tasks, event.previousIndex, event.currentIndex)
		} else {
			transferArrayItem(sourceCol.tasks, targetCol.tasks, event.previousIndex, event.currentIndex)

			const movedTask = targetCol.tasks[event.currentIndex]
			if (movedTask) {
				movedTask.columnId = targetCol.id
				movedTask.completed = targetCol.fixed || false
			}
		}

		this.columnTaskState.setColumns(columnsClone)

		const targetTasksPayload = targetCol.tasks.map((task, index) => ({
			id: task.id,
			position: index,
		}))

		const movedTask = targetCol.tasks[event.currentIndex]
		if (!movedTask) return

		this.kanbanApi.reorderTasks({
			taskId: movedTask.id,
			targetColumnId: targetCol.id,
			targetTasks: targetTasksPayload,
			kanbanId: ctx.kanbanId,
			projectId: ctx.projectId,
			teamId: ctx.teamId,
		})
	}

	dropColumn(
		event: CdkDragDrop<ColumnKanbanDetailResponse[]>,
		ctx: { teamId: string; projectId: string; kanbanId: string },
	) {
		const columns = this.columnTaskState.columns()
		const movable = columns.filter((c) => !c.fixed)
		const fixed = columns.find((c) => c.fixed)

		// Reordenamos solo las movibles
		moveItemInArray(movable, event.previousIndex, event.currentIndex)

		// Re-ensamblamos manteniendo la fija al final
		const newOrder = fixed ? [...movable, fixed] : [...movable]
		this.columnTaskState.setColumns(newOrder)

		const payload = movable.map((col, index) => ({
			id: col.id,
			position: index,
		}))

		this.kanbanApi.reorderColumns({
			columns: payload,
			kanbanId: ctx.kanbanId,
			projectId: ctx.projectId,
			teamId: ctx.teamId,
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
}
