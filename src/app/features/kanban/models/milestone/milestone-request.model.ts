export interface CreateMilestoneRequest {
	title: string
	deadline: string
	kanbanId: string
}

export interface UpdateMilestoneRequest {
	milestoneId: string
	title: string
	deadline: string
}

export interface DeleteMilestoneRequest {
	milestoneId: string
}
