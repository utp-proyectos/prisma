import { Component, input, model, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolder } from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'

@Component({
	selector: 'app-folder-create-dialog',
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmInputImports,
		HlmFieldImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmButtonImports,
	],
	providers: [
		provideIcons({
			lucideFolder,
		}),
	],

	templateUrl: './folder-create-dialog.html',
})
export class FolderCreateDialog {
	state = input<BrnDialogState>('closed')
	closed = output<void>()
}
