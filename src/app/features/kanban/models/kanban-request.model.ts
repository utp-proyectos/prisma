export interface CreateKanbanRequest {
	projectId: string
	name: string
	privateSwitch: boolean
}

export interface UpdateKanbanRequest {
	kanbanId: string
	name: string
	privateSwitch: boolean
}

export interface DeleteKanbanRequest {
	kanbanId: string
}
