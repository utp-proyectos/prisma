export interface TaskStats {
	totalTasks: number
	completedTasks: number
	remainingTasks: number
	completedPercentage: number
	remainingPercentage: number
}

export interface DashboardTask {
	taskId: string
	taskTitle: string
	kanbanName: string
	deadline: string
	status: string
}

export interface DashboardEvent {
	eventId: string
	title: string
	startDate: string
	endDate: string
	startTime?: string
	endTime?: string
}

export interface ProjectDashboardResponse {
	projectId: string
	projectName: string
	description: string
	coverImageUrl: string
	taskStats: TaskStats
	upcomingTasks: DashboardTask[]
	todaysEvents: DashboardEvent[]
}
