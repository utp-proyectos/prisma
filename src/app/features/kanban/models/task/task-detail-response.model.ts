import { ChecklistDetailResponse } from '../checklist/checklist-detail-response.model'
import { TaskAssignmentDetailResponse } from './task-assignment-detail-response.model'

export interface TaskDetailResponse {
	id: string
	title: string
	description: string
	position: number
	deadline: string | null
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
	completed: boolean
	groupTask: boolean
	columnId: string
	milestoneId: string | null
	assignments: TaskAssignmentDetailResponse[]
	checklists: ChecklistDetailResponse[]
}
