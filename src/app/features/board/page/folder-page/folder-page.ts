import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolder, lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { BoardCard } from '../../components/board-card/board-card'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { BoardApiService } from '../../service/board-api.service'
import { Board } from '../../models/board-response'
import { Folder } from '../../models/folder.model'

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
	//inyeccion de dependencias
	private route = inject(ActivatedRoute)
	private boardApiService = inject(BoardApiService)
	createBoardModalState = inject(CreateBoardModalState)

	// parametros de ruta
	folderId = this.route.snapshot.params['folderId']

	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]

	//signal
	boards = signal<Board[]>([])
	folder = signal<Folder | null>(null)

	constructor() {
		this.loadBoards()
	}

	//api - carga de datos
	loadBoards() {
		this.boardApiService.getFolder(this.folderId).subscribe((f) => {
			console.log('folder:', f)
			this.folder.set(f)
			this.boards.set(f.boards)
		})
	}
	// api - acciones de las cards
	onDeleteBoard(boardId: string) {
		console.log('id' + boardId)
		this.boardApiService.deleteBoard(boardId).subscribe(() => {
			this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
		})
	}
	onRemoveFromFolder(boardId: string) {
		this.boardApiService.removeFromFolder(boardId).subscribe(() => {
			this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
		})
	}
}
