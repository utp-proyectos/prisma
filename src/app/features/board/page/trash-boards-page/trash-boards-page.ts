import { Component, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSearch, lucideTrash2 } from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardCard } from '../../components/board-card/board-card'
interface BoardsProps {
	id: number
	name: string
	description: string
}

@Component({
	selector: 'app-trash-boards-page',
	imports: [
		HlmSelectImports,
		HlmInputGroupImports,
		NgIcon,
		HlmIconImports,
		HlmBadgeImports,
		HlmSeparatorImports,
		BoardCard,
	],
	providers: [
		provideIcons({
			lucideSearch,
			lucideTrash2,
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
	boards = signal<BoardsProps[]>([
		{ id: 1, name: 'Board Login', description: 'Funcionalidades del logica' },
		{ id: 2, name: 'Board Ui', description: 'Estilos' },
		{ id: 3, name: 'Board Api', description: 'Diseño de la api' },
	])
}
