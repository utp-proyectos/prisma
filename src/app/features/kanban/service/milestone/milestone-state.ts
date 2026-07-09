import { computed, Injectable, signal } from '@angular/core'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { MilestoneDetailResponse } from '../../models/milestone/milestone-detail-response.model'

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

	addMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => [milestone, ...list])
	}

	updateMilestone(milestone: MilestoneSummaryResponse) {
		this.milestones.update((list) => list.map((m) => (m.id === milestone.id ? milestone : m)))
	}

	select(id: string | null) {
		this.selectedMilestoneId.set(id)
	}
}
