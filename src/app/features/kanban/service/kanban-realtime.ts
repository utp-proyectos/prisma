import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban-api'
import { Subscription } from 'rxjs'
import { ColumnTaskState } from './column-task/column-task-state'
import { MilestoneRealtime } from '../features/milestone/milestone.realtime'
import { ChecklistItemRealtime } from '../features/checklist-item/checklist-item.realtime'
import { ChecklistRealtime } from '../features/checklist/checklist.realtime'

@Injectable()
export class KanbanRealtime {
	private readonly api = inject(KanbanApi)
	private readonly columnTaskState = inject(ColumnTaskState)

	readonly milestoneRealtime = inject(MilestoneRealtime)
	readonly checklistItemRealtime = inject(ChecklistItemRealtime)
	readonly checklistRealtime = inject(ChecklistRealtime)

	private columnSub?: Subscription
	private taskSub?: Subscription
	private columnReorderSub?: Subscription
	private taskReorderSub?: Subscription
	private checklistSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneRealtime.connect(teamId, projectId, kanbanId)
		this.checklistRealtime.connect(teamId, projectId, kanbanId)
		this.checklistItemRealtime.connect(teamId, projectId, kanbanId)
		this.connectColumns(teamId, projectId, kanbanId)
		this.connectTasks(teamId, projectId, kanbanId)
		this.connectColumnReorder(teamId, projectId, kanbanId)
		this.connectTaskReorder(teamId, projectId, kanbanId)
	}

	connectColumns(teamId: string, projectId: string, kanbanId: string) {
		this.columnSub?.unsubscribe()

		this.columnSub = this.api.getColumnsKanban(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addColumn(event.payload)
					break

				case 'UPDATE':
					this.columnTaskState.replaceColumn(event.payload)
					break

				case 'DELETE':
					this.columnTaskState.removeColumn(event.payload)
					break
			}
		})
	}

	connectTasks(teamId: string, projectId: string, kanbanId: string) {
		this.taskSub?.unsubscribe()

		this.taskSub = this.api.getTasks(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addTask(event.payload)
					break

				case 'UPDATE':
					const oldTask = this.columnTaskState.findTask(event.payload.id)
					if (!oldTask) return

					this.columnTaskState.replaceTask(oldTask, event.payload)
					break

				case 'DELETE':
					this.columnTaskState.removeTask(event.payload)
					break
			}
		})
	}

	connectColumnReorder(teamId: string, projectId: string, kanbanId: string) {
		this.columnReorderSub?.unsubscribe()

		this.columnReorderSub = this.api
			.getColumnsReorder(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action === 'REORDER') {
					this.columnTaskState.replaceColumns(event.payload)
				}
			})
	}

	connectTaskReorder(teamId: string, projectId: string, kanbanId: string) {
		this.taskReorderSub?.unsubscribe()

		this.taskReorderSub = this.api
			.getTasksReorder(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action === 'REORDER') {
					this.columnTaskState.replaceColumns(event.payload)
				}
			})
	}

	disconnect() {
		this.milestoneRealtime.disconnect()
		this.checklistRealtime.disconnect()
		this.checklistItemRealtime.disconnect()
		this.columnSub?.unsubscribe()
		this.taskSub?.unsubscribe()
		this.columnReorderSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
		this.checklistSub?.unsubscribe()
	}
}
