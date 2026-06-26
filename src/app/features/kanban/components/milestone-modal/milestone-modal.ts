import { Component, input, output } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Component({
	selector: 'app-milestone-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmDatePickerImports,
	],
	templateUrl: './milestone-modal.html',
})
export class MilestoneModalComponent {
	readonly state = input.required<BrnDialogState | null>()
	readonly closed = output<void>()
}
