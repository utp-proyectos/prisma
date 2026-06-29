export interface CreateKanbanRequest {
	name: string
	isPrivate: boolean
	projectId: string
}

export interface UpdateKanbanRequest {
	kanbanId: string
	name: string
	isPrivate: boolean
}

export interface DeleteKanbanRequest {
	kanbanId: string
}
