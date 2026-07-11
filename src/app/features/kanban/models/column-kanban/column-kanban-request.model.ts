export interface CreateColumnKanbanRequest {
	title: string
	kanbanId: string
}

export interface UpdateColumnKanbanRequest {
	columnId: string
	title: string
}

export interface DeleteColumnKanbanRequest {
	columnId: String
}
