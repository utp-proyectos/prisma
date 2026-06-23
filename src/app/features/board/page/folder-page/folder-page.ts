import { Component, inject, signal } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolder, lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { BoardCard } from '../../components/board-card/board-card'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
interface BoardsProps {
	id: number
	name: string
	description: string
}
@Component({
	selector: 'app-folder-page',
	imports: [
		NgIcon,
		BoardCard,
		HlmSeparatorImports,
		HlmButtonImports,
		HlmIconImports,
		HlmInputGroupImports,
		HlmSelectImports,
	],
	providers: [provideIcons({ lucideFolder, lucideSearch, lucidePlus })],
	templateUrl: './folder-page.html',
	styles: ``,
})
export class FolderPage {
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]
	createBoardModalState = inject(CreateBoardModalState)

	boards = signal<BoardsProps[]>([
		{ id: 1, name: 'Board Login', description: 'Funcionalidades del logica' },
		{ id: 2, name: 'Board Ui', description: 'Estilos' },
		{ id: 3, name: 'Board Api', description: 'Diseño de la api' },
	])
	openFolder(folderId: number) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}
}
