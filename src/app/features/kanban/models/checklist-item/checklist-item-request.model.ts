export interface CreateChecklistItemRequest {
	checklistId: string
	content: string
}

export interface UpdateChecklistItemRequest {
	checklistItemId: string
	content: string
	completedItem: boolean
}

export interface DeleteChecklistItemRequest {
	checklistItemId: string
}
