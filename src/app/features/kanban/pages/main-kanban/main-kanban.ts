import { Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideClock, lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { CreateKanbanModalState } from '../../service/create-kanban-modal-state'

@Component({
	selector: 'app-main-kanban',
	imports: [
		NgIcon,
		HlmButtonImports,
		HlmSelectImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmSeparatorImports,
		HlmCardImports,
	],
	providers: [provideIcons({ lucidePlus, lucideSearch, lucideClock })],
	templateUrl: './main-kanban.html',
	styles: ``,
})
export class MainKanban {
	createKanbanModalState = inject(CreateKanbanModalState)
}
