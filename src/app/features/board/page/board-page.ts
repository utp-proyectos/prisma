import { Component, signal } from '@angular/core'

import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '../../../../../libs/ui/select/src/index'

import { lucideSearch } from '@ng-icons/lucide'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardCard } from '../components/board-card/board-card'
import { BoardCreateDialog } from '../components/board-create-dialog/board-create-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'

@Component({
	selector: 'app-board-page',
	imports: [
		HlmInputGroupImports,
		NgIcon,
		HlmIconImports,
		HlmSelectImports,
		HlmSeparatorImports,
		HlmButtonImports,
		BoardCard,
		BoardCreateDialog,
	],
	providers: [
		provideIcons({
			lucideSearch,
		}),
	],

	templateUrl: './board-page.html',
})
export class BoardPage {
	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]
}
