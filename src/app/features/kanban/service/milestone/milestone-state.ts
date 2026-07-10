import { computed, Injectable, signal } from '@angular/core'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { MilestoneDetailResponse } from '../../models/milestone/milestone-detail-response.model'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'

@Injectable()
export class MilestoneState {
	readonly milestones = signal<MilestoneSummaryResponse[]>([])
	readonly selectedMilestoneId = signal<string | null>(null)
	readonly milestoneDetail = signal<MilestoneDetailResponse | null>(null)

	readonly selectedMilestone = computed(() => {
		const id = this.selectedMilestoneId()
		if (!id) return null
		return this.milestones().find((m) => m.id === id) ?? null
	})

	setMilestones(milestones: MilestoneSummaryResponse[]) {
		this.milestones.set(milestones)
	}

	setDetail(detail: MilestoneDetailResponse | null) {
		this.milestoneDetail.set(detail)
	}

	// --- METODOS PARA LOS HITOS ---
	addMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => {
			if (list.some((m) => m.id === milestone.id)) return list
			return [milestone, ...list]
		})
	}

	updateMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) =>
			list.map((m) => {
				if (m.id !== milestone.id) return m
				return {
					...m,
					...milestone,
					totalTasks: m.totalTasks,
					completedTasks: m.completedTasks,
					progress: m.progress,
				}
			}),
		)

		this.milestoneDetail.update((detail) => {
			if (!detail || detail.id !== milestone.id) return detail
			return {
				...detail,
				title: milestone.title,
			}
		})
	}

	removeMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => list.filter((m) => m.id !== milestone.id))

		if (this.selectedMilestoneId() === milestone.id) {
			this.select(null)
		}
	}

	// --- MÉTODOS PÚBLICOS DE ENTRADA ---
	addTask(task: TaskDetailResponse) {
		this.addTaskToMilestone(task)
	}

	removeTask(task: TaskDetailResponse) {
		this.removeTaskFromMilestone(task)
	}

	replaceTask(oldTask: TaskDetailResponse, newTask: TaskDetailResponse) {
		// Escenario A: Cambió información interna pero sigue en el mismo hito
		if (oldTask.milestoneId === newTask.milestoneId) {
			this.replaceTaskInsideMilestone(oldTask, newTask)
			return
		}

		// Escenario B: La tarea saltó de un hito a otro diferente
		this.removeTaskFromMilestone(oldTask)
		this.addTaskToMilestone(newTask)
	}

	// --- OPERACIONES PRIVADAS ATÓMICAS ---
	private buildMetrics(
		milestone: MilestoneSummaryResponse,
		total: number,
		completed: number,
	): MilestoneSummaryResponse {
		return {
			...milestone,
			totalTasks: total,
			completedTasks: completed,
			progress: total === 0 ? 0 : Math.round((completed * 100) / total),
		}
	}

	private addTaskToMilestone(task: TaskDetailResponse) {
		if (!task.milestoneId) return

		this.milestoneDetail.update((detail) => {
			if (!detail || detail.id !== task.milestoneId) return detail
			return {
				...detail,
				tasks: [...(detail.tasks || []), task],
			}
		})

		this.milestones.update((list) =>
			list.map((m) => {
				if (m.id !== task.milestoneId) return m

				return this.buildMetrics(m, m.totalTasks + 1, m.completedTasks + (task.completed ? 1 : 0))
			}),
		)
	}

	private removeTaskFromMilestone(task: TaskDetailResponse) {
		if (!task.milestoneId) return

		this.milestoneDetail.update((detail) => {
			if (!detail || detail.id !== task.milestoneId) return detail
			return {
				...detail,
				tasks: detail.tasks?.filter((t) => t.id !== task.id),
			}
		})

		this.milestones.update((list) =>
			list.map((m) => {
				if (m.id !== task.milestoneId) return m

				return this.buildMetrics(
					m,
					Math.max(0, m.totalTasks - 1),
					Math.max(0, m.completedTasks - (task.completed ? 1 : 0)),
				)
			}),
		)
	}

	private replaceTaskInsideMilestone(oldTask: TaskDetailResponse, newTask: TaskDetailResponse) {
		if (!newTask.milestoneId) return

		this.milestoneDetail.update((detail) => {
			if (!detail || detail.id !== newTask.milestoneId) return detail
			return {
				...detail,
				tasks: detail.tasks?.map((t) => (t.id === newTask.id ? newTask : t)),
			}
		})

		if (oldTask.completed !== newTask.completed) {
			this.milestones.update((list) =>
				list.map((m) => {
					if (m.id !== newTask.milestoneId) return m

					const diff = newTask.completed ? 1 : -1

					return this.buildMetrics(m, m.totalTasks, Math.max(0, m.completedTasks + diff))
				}),
			)
		}
	}

	select(id: string | null) {
		this.selectedMilestoneId.set(id)

		if (id == null) {
			this.milestoneDetail.set(null)
		}
	}
}
