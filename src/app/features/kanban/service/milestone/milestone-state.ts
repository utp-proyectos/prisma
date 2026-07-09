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

	// Metodos del milestone
	addMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => [milestone, ...list])
	}

	updateMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => list.map((m) => (m.id === milestone.id ? milestone : m)))
	}

	removeMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => list.filter((m) => m.id !== milestone.id))
	}

	// Metodos del task
	updateTask(oldTask: TaskDetailResponse, newTask: TaskDetailResponse) {
		this.milestoneDetail.update((detail) => {
			if (!detail) return detail

			if (detail.id === newTask.milestoneId) {
				return {
					...detail,
					tasks: detail.tasks?.map((t) => (t.id === newTask.id ? newTask : t)),
				}
			}

			if (detail.id === oldTask.milestoneId) {
				return {
					...detail,
					tasks: detail.tasks?.filter((t) => t.id !== newTask.id),
				}
			}

			return detail
		})

		this.milestones.update((milestones) => {
			return milestones.map((milestone) => {
				let total = milestone.totalTasks
				let completed = milestone.completedTasks

				// ---------- salió del milestone ----------
				if (milestone.id === oldTask.milestoneId) {
					total--

					if (oldTask.completed) {
						completed--
					}
				}

				// ---------- entró al milestone ----------
				if (milestone.id === newTask.milestoneId) {
					total++

					if (newTask.completed) {
						completed++
					}
				}

				// ---------- mismo milestone pero cambió estado ----------
				if (oldTask.milestoneId === newTask.milestoneId && milestone.id === newTask.milestoneId) {
					if (!oldTask.completed && newTask.completed) {
						completed++
					}

					if (oldTask.completed && !newTask.completed) {
						completed--
					}
				}

				return {
					...milestone,
					totalTasks: total,
					completedTasks: completed,
					progress: total === 0 ? 0 : Math.round((completed * 100) / total),
				}
			})
		})
	}

	select(id: string | null) {
		this.selectedMilestoneId.set(id)

		if (id == null) {
			this.milestoneDetail.set(null)
		}
	}
}
