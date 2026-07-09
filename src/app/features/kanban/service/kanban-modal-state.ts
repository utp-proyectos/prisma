import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { KanbanResponse } from '../models/kanban-response.model'

export type KanbanModalMode = 'CREATE' | 'EDIT'

export interface KanbanModalStateStructure {
	opened: BrnDialogState
	mode: KanbanModalMode
	kanban: KanbanResponse | null
}

@Injectable()
export class KanbanModalState {
	private state = signal<KanbanModalStateStructure>({
		opened: 'closed',
		mode: 'CREATE',
		kanban: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly kanban = computed(() => this.state().kanban)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate() {
		this.state.set({
			opened: 'open',
			mode: 'CREATE',
			kanban: null,
		})
	}

	openForEdit(kanban: KanbanResponse) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			kanban: kanban,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
