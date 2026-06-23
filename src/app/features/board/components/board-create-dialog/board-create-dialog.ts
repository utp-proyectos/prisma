import { Component, inject, model, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSquareMousePointer } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { CreateBoardModalState } from '../../service/create-board-modal-state'

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
	createBoardModalState = inject(CreateBoardModalState)
}
