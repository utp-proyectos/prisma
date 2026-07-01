import { Task } from '../task.model'

export interface MilestoneDetailResponse {
	id: number
	title: string
	deadline: string
	progress: number
	totalTasks: number
	completedTasks: number
	state: 'COMPLETADO' | 'A_TIEMPO' | 'RETRASADO'
	tasks?: Task[]
}
