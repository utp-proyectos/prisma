import { TaskDetailResponse } from '../task/task-detail-response.model'

export interface MilestoneDetailResponse {
	id: string
	title: string
	deadline: string
	progress: number
	totalTasks: number
	completedTasks: number
	state: 'COMPLETADO' | 'A_TIEMPO' | 'RETRASADO'
	tasks?: TaskDetailResponse[]
}
