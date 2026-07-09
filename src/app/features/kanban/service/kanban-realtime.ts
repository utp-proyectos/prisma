import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban-api'
import { MilestoneState } from './milestone/milestone-state'
import { Subscription } from 'rxjs'
import { ColumnTaskState } from './column-task/column-task-state'

@Injectable()
export class KanbanRealtime {
	private readonly api = inject(KanbanApi)
	private readonly milestoneState = inject(MilestoneState)
	private readonly columnTaskState = inject(ColumnTaskState)

	private milestoneSub?: Subscription
	private columnSub?: Subscription
	private taskSub?: Subscription
	private columnReorderSub?: Subscription
	private taskReorderSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectMilestones(teamId, projectId, kanbanId)
		this.connectColumns(teamId, projectId, kanbanId)
		this.connectTasks(teamId, projectId, kanbanId)
		this.connectColumnReorder(teamId, projectId, kanbanId)
		this.connectTaskReorder(teamId, projectId, kanbanId)
	}

	connectMilestones(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneSub?.unsubscribe()

		this.milestoneSub = this.api.getMilestones(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.milestoneState.addMilestone(event.payload)
					break

				case 'UPDATE':
					this.milestoneState.updateMilestone(event.payload)
					break

				case 'DELETE':
					this.milestoneState.removeMilestone(event.payload)
					break
			}
		})
	}

	connectColumns(teamId: string, projectId: string, kanbanId: string) {
		this.columnSub?.unsubscribe()

		this.columnSub = this.api.getColumnsKanban(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addColumn(event.payload)
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
					const previousTask = this.columnTaskState.findTask(event.payload.id)

					this.columnTaskState.updateTask(event.payload)

					if (previousTask) {
						this.milestoneState.updateTask(previousTask, event.payload)
					}
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
		this.milestoneSub?.unsubscribe()
		this.columnSub?.unsubscribe()
		this.taskSub?.unsubscribe()
		this.columnReorderSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
	}
}
