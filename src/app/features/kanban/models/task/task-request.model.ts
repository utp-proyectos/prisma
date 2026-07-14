export interface CreateTaskRequest {
	title: string
	description: string
	deadline: string | null
	columnId: string | null
	milestoneId: string | null
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

export interface DeleteTaskRequest {
	id: string
	kanbanId: string
	projectId: string
	teamId: string
}
