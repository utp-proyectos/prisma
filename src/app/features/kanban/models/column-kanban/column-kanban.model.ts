import { Task } from '../task.model'

export interface ColumnKanban {
	id: string
	name: string
	isFixed?: boolean
	tasks: Task[]
}
