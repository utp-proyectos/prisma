import { Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable({ providedIn: 'root' })
export class CreateBoardModalState {
	createBoardModal = signal<BrnDialogState | null>(null)

	open() {
		this.createBoardModal.set('open')
	}
	close() {
		this.createBoardModal.set(null)
	}
}
