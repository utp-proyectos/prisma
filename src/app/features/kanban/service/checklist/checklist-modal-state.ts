import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { ChecklistDetailResponse } from '../../models/checklist/checklist-detail-response.model'

export type ChecklistModalMode = 'CREATE' | 'EDIT'

export interface ChecklistModalStateStructure {
	opened: BrnDialogState
	mode: ChecklistModalMode
	checklist: ChecklistDetailResponse | null
	taskId: string | null
}

@Injectable({
	providedIn: 'root',
})
export class ChecklistModalState {
	private state = signal<ChecklistModalStateStructure>({
		opened: 'closed',
		mode: 'CREATE',
		checklist: null,
		taskId: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly checklist = computed(() => this.state().checklist)
	readonly taskId = computed(() => this.state().taskId)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate(taskId: string) {
		this.state.set({
			opened: 'open',
			mode: 'CREATE',
			checklist: null,
			taskId: taskId,
		})
	}

	openForEdit(checklist: ChecklistDetailResponse) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			checklist: checklist,
			taskId: null,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
