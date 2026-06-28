import { Injectable, Service, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable()
export class CreateTeamModalState {
	createTeamModal = signal<BrnDialogState | null>(null)

	open() {
		this.createTeamModal.set('open')
	}

	close() {
		this.createTeamModal.set('closed')
	}
}
