import { computed, effect, inject, Injectable } from '@angular/core'
import { MilestoneApi } from './milestone.api'
import { MilestoneModalState } from './milestone-modal/milestone-modal-state'
import {
	CreateMilestoneRequest,
	UpdateMilestoneRequest,
} from '../../models/milestone/milestone-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { MilestoneState } from './milestone.state'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'

@Injectable()
export class MilestoneFacade {
	private readonly api = inject(MilestoneApi)
	private readonly modalState = inject(MilestoneModalState)
	private readonly state = inject(MilestoneState)

	readonly milestones = this.state.milestones
	readonly selectedMilestoneId = this.state.selectedMilestoneId
	readonly selectedMilestone = this.state.selectedMilestone
	readonly milestoneDetail = this.state.milestoneDetail

	readonly milestoneDetailResource = this.api.milestoneDetailResource(
		this.state.selectedMilestoneId,
	)

	readonly isEditMode = this.modalState.isEditMode
	readonly milestoneDialogState = this.modalState.dialogState
	readonly milestone = this.modalState.milestone

	create(values: Omit<CreateMilestoneRequest, 'kanbanId'>, kanbanId: string) {
		this.api.createMilestone({
			kanbanId,
			...values,
		})

		toast.success('Hito creado')

		this.modalState.close()
	}

	update(values: Omit<UpdateMilestoneRequest, 'milestoneId'>) {
		const milestone = this.modalState.milestone()

		if (!milestone) return

		this.api.updateMilestone({
			milestoneId: milestone.id,
			...values,
		})

		toast.success('Hito modificado')

		this.modalState.close()
	}

	save(values: Omit<CreateMilestoneRequest, 'kanbanId'>, kanbanId: string) {
		if (this.modalState.isEditMode()) {
			this.update(values)
		} else {
			this.create(values, kanbanId)
		}
	}

	delete(milestoneId: string) {
		this.api.deleteMilestone({ milestoneId })
		toast.success('Hito eliminado')
	}

	select(id: string | null) {
		this.state.select(id)
	}

	openCreate() {
		this.modalState.openForCreate()
	}

	openEdit(milestone: MilestoneSummaryResponse) {
		this.modalState.openForEdit(milestone)
	}

	closeModal() {
		this.modalState.close()
	}

	setMilestones(milestones: MilestoneSummaryResponse[]) {
		this.state.setMilestones(milestones)
	}

	initialize(milestones: MilestoneSummaryResponse[]) {
		this.state.setMilestones(milestones)
	}

	constructor() {
		effect(() => {
			if (!this.milestoneDetailResource.hasValue()) return

			this.state.setDetail(this.milestoneDetailResource.value()!.data)
		})
	}
}
