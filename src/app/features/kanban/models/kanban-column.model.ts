import { Task } from './task.model'

export interface KanbanColumn {
	id: string
	name: string
	isFixed?: boolean
	tasks: Task[]
}
