import { Injectable, signal, computed } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { Folder } from '../models/folder/folder.model'

@Injectable({ providedIn: 'root' })
export class FolderModalState {
	private state = signal({
		opened: 'closed' as BrnDialogState,
		mode: 'CREATE' as 'CREATE' | 'EDIT',
		folder: null as Folder | null,
		isPrivate: false,
	})

	readonly dialogState = computed(() => this.state().opened)
	readonly mode = computed(() => this.state().mode)
	readonly folder = computed(() => this.state().folder)
	readonly isPrivate = computed(() => this.state().isPrivate)
	readonly isEditMode = computed(() => this.state().mode === 'EDIT')

	openForCreate(isPrivate: boolean) {
		this.state.set({ opened: 'open', mode: 'CREATE', folder: null, isPrivate })
	}

	openForEdit(folder: Folder) {
		this.state.set({ opened: 'open', mode: 'EDIT', folder, isPrivate: folder.isPrivate })
	}

	close() {
		this.state.update((s) => ({ ...s, opened: 'closed' }))
	}
}
