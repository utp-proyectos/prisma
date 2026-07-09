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
		const previousContainerData = event.previousContainer.data
		const containerData = event.container.data

		if (event.previousContainer === event.container) {
			// Movimiento en la misma columna
			moveItemInArray(containerData, event.previousIndex, event.currentIndex)
		} else {
			// Movimiento entre columnas diferentes (incluyendo la fija)
			transferArrayItem(
				previousContainerData,
				containerData,
				event.previousIndex,
				event.currentIndex,
			)
		}

		// Actualizamos los datos de las tareas en TODAS las columnas afectadas
		// (tanto el origen como el destino si son distintas)
		const sourceColumnId = event.previousContainer.id
		const targetColumnId = event.container.id

		this.columns.update((columns) =>
			columns.map((col) => {
				if (col.id === sourceColumnId) {
					return { ...col, tasks: [...previousContainerData] }
				}
				if (col.id === targetColumnId) {
					return { ...col, tasks: [...containerData] }
				}
				return col
			}),
		)

		return containerData.map((task, index) => ({
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
