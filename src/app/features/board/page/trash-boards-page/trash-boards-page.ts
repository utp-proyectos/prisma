import { Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSearch } from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'

@Component({
	selector: 'app-trash-boards-page',
	imports: [HlmSelectImports, HlmInputGroupImports, NgIcon, HlmIconImports, HlmBadgeImports],
	providers: [
		provideIcons({
			lucideSearch,
		}),
	],
	templateUrl: './trash-boards-page.html',
	styles: ``,
})
export class TrashBoardsPage {
	public readonly items = [
		{ label: 'Mas antiguo primero', value: 'apple' },
		{ label: 'Mas reciente primero', value: 'banana' },
	]
	public readonly createds = [
		{ label: 'Creado por ti', value: 'creado por ti' },
		{
			label: 'Creado por el grupo',
			value: 'Creado por el grupo',
		},
	]
}
