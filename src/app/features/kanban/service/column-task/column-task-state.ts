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

	replaceColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => list.map((c) => (c.id === column.id ? column : c)))
	}

	removeColumn(column: ColumnKanbanDetailResponse) {
		this.columns.update((list) => list.filter((c) => c.id !== column.id))
	}

	replaceColumns(columns: ColumnKanbanDetailResponse[]) {
		this.columns.set(columns)
	}

	findTask(taskId: string): TaskDetailResponse | undefined {
		for (const column of this.columns()) {
			const task = column.tasks.find((t) => t.id === taskId)
			if (task) return task
		}
		return undefined
	}

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
