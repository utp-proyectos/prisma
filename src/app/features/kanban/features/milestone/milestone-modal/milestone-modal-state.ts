import { MilestoneSummaryResponse } from '@/features/kanban/models/milestone/milestone-summary-response.model'
import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

export type MilestoneModalMode = 'CREATE' | 'EDIT'

export interface MilestoneModalStateStructure {
	opened: BrnDialogState
	mode: MilestoneModalMode
	milestone: MilestoneSummaryResponse | null
}

@Injectable()
export class MilestoneModalState {
	private state = signal<MilestoneModalStateStructure>({
		opened: 'closed',
		mode: 'CREATE',
		milestone: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly milestone = computed(() => this.state().milestone)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate() {
		this.state.set({
			opened: 'open',
			mode: 'CREATE',
			milestone: null,
		})
	}

	openForEdit(milestone: MilestoneSummaryResponse) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			milestone: milestone,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
