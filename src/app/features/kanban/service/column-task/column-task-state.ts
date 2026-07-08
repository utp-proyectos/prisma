import { computed, Injectable, signal } from '@angular/core'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

@Injectable()
export class ColumnTaskState {
	readonly columns = signal<ColumnKanbanDetailResponse[]>([])

	readonly movableColumns = computed(() => this.columns().filter((column) => !column.fixed))
	readonly completedColumn = computed(() => this.columns().find((column) => column.fixed)!)
	readonly connectedLists = computed(() => this.columns().map((column) => column.id))

	setColumns(columns: ColumnKanbanDetailResponse[]) {
		this.columns.set(columns)
	}

	addColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => [...list, column])
	}

	replaceColumns(columns: ColumnKanbanDetailResponse[]) {
		this.columns.set(columns)
	}

	addTask(task: TaskDetailResponse) {
		this.columns.update((columns) =>
			columns.map((column) =>
				column.id === task.columnId
					? {
							...column,
							tasks: [...column.tasks, task],
						}
					: column,
			),
		)
	}

	updateTask(task: TaskDetailResponse) {
		this.columns.update((columns) => {
			const previousColumn = columns.find((column) => column.tasks.some((t) => t.id === task.id))

			if (previousColumn?.id === task.columnId) {
				return columns.map((column) => {
					if (column.id !== task.columnId) return column

					return {
						...column,
						tasks: column.tasks.map((t) => (t.id === task.id ? task : t)),
					}
				})
			}

			return columns.map((column) => {
				const tasksWithout = column.tasks.filter((t) => t.id !== task.id)

				if (column.id === task.columnId) {
					return {
						...column,
						tasks: [...tasksWithout, task],
					}
				}

				return {
					...column,
					tasks: tasksWithout,
				}
			})
		})
	}

	// Actualización optimista de tareas
	moveTaskOptimistic(event: CdkDragDrop<TaskDetailResponse[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			)
		}

		return event.container.data.map((task, index) => ({
			id: task.id,
			position: index,
		}))
	}

	// Actualización optimista de columnas
	moveColumnOptimistic(event: CdkDragDrop<ColumnKanbanDetailResponse[]>) {
		const movable = [...this.movableColumns()]
		moveItemInArray(movable, event.previousIndex, event.currentIndex)

		const completed = this.completedColumn()
		this.columns.set([...movable, completed])

		return movable.map((col, index) => ({
			id: col.id,
			position: index,
		}))
	}
}
