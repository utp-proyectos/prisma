import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { computed, Injectable, signal } from '@angular/core'
import { ChecklistItemResponse } from '../../../models/checklist-item/checklist-item-response.model'

export type ChecklistItemModalMode = 'CREATE' | 'EDIT'

export interface ChecklistItemModalStateStructure {
	opened: BrnDialogState
	mode: ChecklistItemModalMode
	checklistItem: ChecklistItemResponse | null
	checklistId: string | null
}

@Injectable({
	providedIn: 'root',
})
export class ChecklistItemModalState {
	private state = signal<ChecklistItemModalStateStructure>({
		opened: 'closed',
		mode: 'CREATE',
		checklistItem: null,
		checklistId: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly checklistItem = computed(() => this.state().checklistItem)
	readonly checklistId = computed(() => this.state().checklistId)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate(checklistId: string) {
		this.state.set({
			opened: 'open',
			mode: 'CREATE',
			checklistItem: null,
			checklistId: checklistId,
		})
	}

	openForEdit(checklistItem: ChecklistItemResponse) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			checklistItem: checklistItem,
			checklistId: null,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
