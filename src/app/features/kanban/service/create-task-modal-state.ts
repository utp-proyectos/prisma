import { Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable()
export class CreateTaskModalState {
	createTaskModal = signal<BrnDialogState | null>(null)

	open() {
		this.createTaskModal.set('open')
	}

	close() {
		this.createTaskModal.set('closed')
	}
}
