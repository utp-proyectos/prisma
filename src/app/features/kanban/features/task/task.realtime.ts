import { inject, Injectable } from '@angular/core'
import { Subscription } from 'rxjs'
import { TaskApi } from './task.api'
import { ColumnTaskState } from '../column-task/column-task-state'

@Injectable()
export class TaskRealtime {
	private readonly api = inject(TaskApi)
	private readonly columnTaskState = inject(ColumnTaskState)

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
		this.taskSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
	}
}
