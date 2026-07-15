import { computed, Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { Board } from '../../board/models/board/board-response'

@Injectable({ providedIn: 'root' })
export class CreateBoardModalState {
	private state = signal({
		opened: 'closed' as BrnDialogState,
		mode: 'CREATE' as 'CREATE' | 'EDIT',
		board: null as Board | null,
		isPrivate: false,
		folderId: null as string | null,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly board = computed(() => this.state().board)
	readonly isPrivate = computed(() => this.state().isPrivate)
	readonly folderId = computed(() => this.state().folderId)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate(isPrivate: boolean, folderId: string | null = null) {
		this.state.set({ opened: 'open', mode: 'CREATE', board: null, isPrivate, folderId })
	}

	openForEdit(board: Board) {
		this.state.set({
			opened: 'open',
			mode: 'EDIT',
			board,
			isPrivate: board.isPrivate,
			folderId: board.folderId,
		})
	}

	close() {
		this.state.update((s) => ({ ...s, opened: 'closed' }))
	}
}
