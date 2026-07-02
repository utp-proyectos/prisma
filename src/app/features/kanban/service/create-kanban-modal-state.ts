import { Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable()
export class CreateKanbanModalState {
	createKanbanModal = signal<BrnDialogState | null>(null)

	open() {
		this.createKanbanModal.set('open')
	}

	close() {
		this.createKanbanModal.set('closed')
	}
}
