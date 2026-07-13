import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { ColumnKanbanDetailResponse } from '../../../models/column-kanban/column-kanban-detail-response.model'

export type ColumnModalMode = 'CREATE' | 'EDIT'

export interface ColumnModalStateStructure {
	opened: BrnDialogState
	mode: ColumnModalMode
	column: ColumnKanbanDetailResponse | null
}

@Injectable()
export class ColumnModalState {
	private state = signal<ColumnModalStateStructure>({
		opened: 'closed',
		mode: 'CREATE',
		column: null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly column = computed(() => this.state().column)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate() {
		this.state.set({
			opened: 'open',
			mode: 'CREATE',
			column: null,
		})
	}

	openForEdit(column: ColumnKanbanDetailResponse) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			column: column,
		})
	}

	close() {
		this.state.update((current) => ({
			...current,
			opened: 'closed',
		}))
	}
}
