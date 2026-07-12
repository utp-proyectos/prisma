export interface CreateChecklistRequest {
	title: string
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
	taskId: string
}

export interface UpdateChecklistRequest {
	checklistId: string
	title: string
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
}

export interface DeleteChecklistRequest {
	checklistId: string
}
