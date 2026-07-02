import { Injectable, signal } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Injectable()
export class CreateChannelDialog {
	state = signal<BrnDialogState | null>(null)

	open() {
		this.state.set('open')
	}

	close() {
		this.state.set('closed')
	}
}
