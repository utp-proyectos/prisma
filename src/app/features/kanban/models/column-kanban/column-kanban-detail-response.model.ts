import { Task } from '../task.model'

export interface ColumnKanbanDetailResponse {
	id: string
	title: string
	position: number
	fixed?: boolean
	ColumnType?: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO'
	tasks: Task[]
}
