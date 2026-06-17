import { Component, model, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSquareMousePointer } from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'

@Component({
	selector: 'app-board-create-dialog',
	imports: [
		NgIcon,
		HlmTextareaImports,
		HlmInputGroupImports,
		HlmInputImports,
		HlmFieldImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmButtonImports,
	],
	providers: [
		provideIcons({
			lucideSquareMousePointer,
		}),
	],

	templateUrl: './board-create-dialog.html',
})
export class BoardCreateDialog {
	state = model<BrnDialogState>('closed')
	open() {
		this.state.set('open')
	}
}
