export interface ColumnOrderRequest {
	id: string
	position: number
}

export interface ReorderColumnsRequest {
	teamId: string
	projectId: string
	kanbanId: string
	columns: ColumnOrderRequest[]
}

export interface TaskOrderRequest {
	id: string
	position: number
}

export interface ReorderTasksRequest {
	teamId: string
	projectId: string
	kanbanId: string
	taskId: string
	targetColumnId: string
	targetTasks: TaskOrderRequest[]
}
