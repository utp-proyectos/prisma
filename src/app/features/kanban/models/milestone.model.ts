import { Task } from './task.model'

export interface Milestone {
	id: number
	name: string
	deadline: string
	progress: number
	totalTasks: number
	completedTasks: number
	status: 'Completado' | 'A tiempo' | 'Retrasado'
	tasks?: Task[]
}
