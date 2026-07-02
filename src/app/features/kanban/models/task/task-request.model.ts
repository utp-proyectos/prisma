export interface CreateTaskRequest {
	title: string
	description: string
	deadline: string
	columnId: string
	milestoneId: string
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
	groupTask: boolean
	kanbanId: string
	projectId: string
	teamId: string
}

export interface UpdateTaskRequest {
	id: string
	title: string
	description: string
	priority: 'ALTA' | 'MEDIA' | 'BAJA'
	deadline: string | null
	milestoneId: string | null
	groupTask: boolean
	completed: boolean
	columnId: string
	kanbanId: string
	projectId: string
	teamId: string
	assignedUserIds: string[]
}
