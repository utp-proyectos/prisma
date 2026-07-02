export interface MilestoneSummaryResponse {
	id: string
	title: string
	deadline: string
	progress: number
	totalTasks: number
	completedTasks: number
	state: 'COMPLETADO' | 'A_TIEMPO' | 'RETRASADO'
}
