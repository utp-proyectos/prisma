import { inject, Injectable } from '@angular/core'
import { Subscription } from 'rxjs'
import { TaskApi } from './task.api'
import { ColumnTaskState } from '../column-task/column-task-state'
import { DashboardRefresh } from './dashboard.refresh'

@Injectable()
export class TaskRealtime {
	private readonly api = inject(TaskApi)
	private readonly columnTaskState = inject(ColumnTaskState)

	private readonly dashboardRefresh = inject(DashboardRefresh)

	private taskSub?: Subscription
	private taskReorderSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectTasks(teamId, projectId, kanbanId)
		this.connectTaskReorder(teamId, projectId, kanbanId)
	}

	connectTasks(teamId: string, projectId: string, kanbanId: string) {
		this.taskSub?.unsubscribe()

		this.taskSub = this.api.getTasks(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.columnTaskState.addTask(event.payload)
					this.dashboardRefresh.notify()
					break

				case 'UPDATE':
					const oldTask = this.columnTaskState.findTask(event.payload.id)
					if (!oldTask) return

					this.columnTaskState.replaceTask(oldTask, event.payload)
					this.dashboardRefresh.notify()
					break

				case 'DELETE':
					this.columnTaskState.removeTask(event.payload)
					this.dashboardRefresh.notify()
					break
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
					this.dashboardRefresh.notify()
				}
			})
	}

	disconnect() {
		this.taskSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
	}
}
