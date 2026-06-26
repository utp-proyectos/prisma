import { Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable({ providedIn: 'root' })
export class CreateBoardModalState {
	createBoardModal = signal<BrnDialogState | null>(null)
	isPrivate = signal<boolean>(false)

	folderId = signal<string | null>(null)

	open(isPrivate: boolean, folderId: string | null = null) {
		this.isPrivate.set(isPrivate)
		this.folderId.set(folderId)
		this.createBoardModal.set('open')
	}
	close() {
		this.createBoardModal.set('closed')
	}
}
