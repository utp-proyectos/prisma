import { KanbanColumn } from './kanban-column.model'

export interface KanbanResponse {
	id: string
	name: string
	isPrivate: boolean

	projectId: string

	creatorId: string
	creatorName: string

	columns: KanbanColumn[]
}
