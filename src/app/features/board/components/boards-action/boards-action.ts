import { Component, output } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'

@Component({
	selector: 'app-boards-action',
	imports: [HlmInputGroupImports, NgIcon, HlmButtonImports, HlmIconImports, HlmSelectImports],
	providers: [
		provideIcons({
			lucideSearch,
		}),
	],
	templateUrl: './boards-action.html',
	styles: ``,
})
export class BoardsAction {
	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]
	modal = output<void>()
}
