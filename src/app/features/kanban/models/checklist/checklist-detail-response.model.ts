import { ChecklistItemResponse } from '../checklist-item/checklist-item-response.model'

export interface ChecklistDetailResponse {
	id: string
	title: string
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
	taskId: string
	items: ChecklistItemResponse[]
}
