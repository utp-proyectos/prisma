import { computed, Injectable, signal } from '@angular/core'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'

@Injectable()
export class ColumnTaskState {
	readonly columns = signal<ColumnKanbanDetailResponse[]>([])

	readonly connectedLists = computed(() => this.columns().map((column) => column.id))

	setColumns(columns: ColumnKanbanDetailResponse[]) {
		this.columns.set(columns)
	}

	addColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => [...list, column])
	}

	replaceColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => list.map((c) => (c.id === column.id ? column : c)))
	}

	removeColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => list.filter((c) => c.id !== column.id))
	}

	replaceColumns(columns: ColumnKanbanDetailResponse[]) {
		this.columns.set(columns)
	}

	findTask(id: string) {
		return this.taskIndex().get(id)
	}

	readonly taskIndex = computed(() => {
		const map = new Map<string, TaskDetailResponse>()

		for (const column of this.columns()) {
			for (const task of column.tasks) {
				map.set(task.id, task)
			}
		}

		return map
	})

	addTask(task: TaskDetailResponse) {
		this.columns.update((cols) =>
			cols.map((c) => {
				if (c.id !== task.columnId) return c
				return { ...c, tasks: [...c.tasks, task] }
			}),
		)
	}

	replaceTask(oldTask: TaskDetailResponse, newTask: TaskDetailResponse) {
		this.columns.update((cols) =>
			cols.map((c) => {
				if (c.id === oldTask.columnId && oldTask.columnId !== newTask.columnId) {
					return { ...c, tasks: c.tasks.filter((t) => t.id !== oldTask.id) }
				}
				if (c.id === newTask.columnId) {
					const exists = c.tasks.some((t) => t.id === newTask.id)
					return {
						...c,
						tasks: exists
							? c.tasks.map((t) => (t.id === newTask.id ? newTask : t))
							: [...c.tasks, newTask],
					}
				}
				return c
			}),
		)
	}

	removeTask(task: TaskDetailResponse) {
		this.columns.update((cols) =>
			cols.map((c) => {
				if (c.id !== task.columnId) return c
				return { ...c, tasks: c.tasks.filter((t) => t.id !== task.id) }
			}),
		)
	}

	disassociateMilestoneFromTasks(milestoneId: string) {
		this.columns.update((columns) =>
			columns.map((column) => ({
				...column,
				tasks: column.tasks.map((task) => {
					if (task.milestoneId !== milestoneId) return task
					return {
						...task,
						milestoneId: null,
						deadline: null,
					}
				}),
			})),
		)
	}
}
