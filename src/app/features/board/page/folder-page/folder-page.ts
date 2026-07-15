import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
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
import { Board } from '../../models/board/board-response'
import { Folder } from '../../models/folder/folder.model'
import { Subscription } from 'rxjs'

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
export class FolderPage implements OnDestroy {
	private route = inject(ActivatedRoute)
	private boardApiService = inject(BoardApiService)
	createBoardModalState = inject(CreateBoardModalState)
	private subs: Subscription[] = []

	projectId = input<string>()
	teamId = input<string>()
	folderId = input<string>() // ← desde la ruta en lugar de snapshot

	boards = signal<Board[]>([])
	folder = signal<Folder | null>(null)

	searchQuery = signal<string>('')
	sortBy = signal<string>('Todos')

	public readonly items = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Nombre', value: 'Nombre' },
		{ label: 'Abierto recientemente', value: 'Abierto recientemente' },
	]
	filteredBoards = computed(() => {
		let list = [...this.boards()]
		const query = this.searchQuery().toLowerCase().trim()

		// 1. Filtrar por término de búsqueda (nombre)
		if (query) {
			list = list.filter((b) => b.name.toLowerCase().includes(query))
		}

		// 2. Ordenar según la opción seleccionada
		if (this.sortBy() === 'Nombre') {
			list.sort((a, b) => a.name.localeCompare(b.name))
		} else if (this.sortBy() === 'Abierto recientemente') {
			// Ordenamos de más reciente a más antiguo
			list.sort(
				(a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
			)
		}

		return list
	})
	constructor() {
		effect(() => {
			if (!this.folderId() || !this.teamId() || !this.projectId()) return

			this.subs.forEach((s) => s.unsubscribe())
			this.subs = []

			this.loadBoards()

			this.subs.push(
				this.boardApiService.watchBoards(this.teamId()!, this.projectId()!).subscribe((board) => {
					if (board.folderId === this.folderId()) {
						// reemplaza si existe, agrega si es nuevo
						this.boards.update((boards) => {
							const exists = boards.some((b) => b.id === board.id)
							return exists
								? boards.map((b) => (b.id === board.id ? board : b))
								: [board, ...boards]
						})
					}
				}),
				this.boardApiService
					.watchBoardDeletes(this.teamId()!, this.projectId()!)
					.subscribe(({ boardId }) => {
						this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
					}),
			)
		})
	}
	// --- MANEJADORES DE ENTRADA ---
	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value
		this.searchQuery.set(value)
	}

	onSort(value: string) {
		this.sortBy.set(value)
	}
	ngOnDestroy() {
		this.subs.forEach((s) => s.unsubscribe())
	}

	onRemoveFromFolder(boardId: string) {
		this.boardApiService.removeFromFolder(boardId, this.teamId()!, this.projectId()!)
		this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
	}

	onDeleteBoard(boardId: string) {
		this.boardApiService.deleteBoard(boardId, this.teamId()!, this.projectId()!)
		this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
	}
	loadBoards() {
		this.boardApiService.getFolder(this.folderId()!).subscribe((f) => {
			this.folder.set(f)
			this.boards.set(f.boards)
		})
	}
	onEditBoard(board: Board) {
		this.createBoardModalState.openForEdit(board)
	}
}
