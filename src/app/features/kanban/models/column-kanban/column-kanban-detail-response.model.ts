import { TaskDetailResponse } from '../task/task-detail-response.model'

export interface ColumnKanbanDetailResponse {
	id: string
	title: string
	position: number
	fixed?: boolean
	ColumnType?: 'PENDING' | ' IN_PROGRESS' | 'COMPLETED' | 'CUSTOM'
	tasks: TaskDetailResponse[]
}
