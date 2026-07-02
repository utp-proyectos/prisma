import { ColumnKanbanDetailResponse } from './column-kanban/column-kanban-detail-response.model'
import { MilestoneDetailResponse } from './milestone/milestone-detail-response.model'

export interface KanbanDetailResponse {
	id: string
	name: string
	isPrivate: boolean
	projectId: string
	creatorId: string

	columns: ColumnKanbanDetailResponse[]
	milestones: MilestoneDetailResponse[]
}
