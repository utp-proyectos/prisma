import { TaskDetailResponse } from './task/task-detail-response.model'

export interface KanbanMyTasksResponse {
	id: string
	name: string
	tasks: TaskDetailResponse[]
}
