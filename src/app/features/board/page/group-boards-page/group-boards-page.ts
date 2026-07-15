import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardsAction } from '../../components/boards-action/boards-action'
import { BoardCard } from '../../components/board-card/board-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { provideIcons, NgIcon } from '@ng-icons/core'
import { lucideSearch, lucideUsers } from '@ng-icons/lucide'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { FolderCreateDialog } from '../../components/folder-create-dialog/folder-create-dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop'
import { FolderCardComponent } from '../../components/folder-card/folder-card'
import { BoardApiService } from '../../service/board-api.service'
import { Board } from '../../models/board/board-response'
import { Folder } from '../../models/folder/folder.model'
import { Subscription } from 'rxjs'
import { toast } from '@spartan-ng/brain/sonner'
import { FolderModalState } from '../../service/create-folder-modal-state'

@Component({
	selector: 'app-group-boards-page',
	imports: [
		NgIcon,
		HlmSeparatorImports,
		BoardsAction,
		BoardCard,
		HlmButtonImports,
		FolderCreateDialog,
		FolderCardComponent,
		CdkDrag,
		CdkDropList,
	],
	providers: [
		provideIcons({
			lucideSearch,
			lucideUsers,
		}),
	],
	templateUrl: './group-boards-page.html',
	styles: `
		.cdk-drag-placeholder {
			opacity: 0;
		}
	`,
})
export class GroupBoardsPage implements OnDestroy {
	private boardApiService = inject(BoardApiService)
	private folderModalState = inject(FolderModalState)
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	createBoardModalState = inject(CreateBoardModalState)
	private subs: Subscription[] = []

	projectId = input<string>()
	teamId = input<string>()

	createFolderModal = signal<BrnDialogState>('closed')
	boards = signal<Board[]>([])
	folders = signal<Folder[]>([])
	draggingOverFolder = signal<string | null>(null)

	constructor() {
		effect(() => {
			if (!this.projectId() || !this.teamId()) return

			this.subs.forEach((s) => s.unsubscribe())
			this.subs = []

			this.loadBoards()
			this.loadFolders()

			this.subs.push(
				//  escucha boards creados, movidos o sacados de folder
				this.boardApiService.watchBoards(this.teamId()!, this.projectId()!).subscribe((board) => {
					if (board.isPrivate !== false) return
					if (board.folderId) {
						this.boards.update((boards) => boards.filter((b) => b.id !== board.id))
						this.folders.update((folders) =>
							folders.map((folder) =>
								folder.id === board.folderId
									? { ...folder, boards: [...folder.boards, board] }
									: folder,
							),
						)
					} else {
						// board sacado del folder, actualiza todos los folders quitándolo
						this.folders.update((folders) =>
							folders.map((folder) => ({
								...folder,
								boards: folder.boards.filter((b) => b.id !== board.id),
							})),
						)
						this.boards.update((boards) => [board, ...boards])
					}
				}),
				//escucha folders creados
				this.boardApiService.watchFolders(this.teamId()!, this.projectId()!).subscribe((folder) => {
					if (folder.isPrivate !== false) return
					this.folders.update((folders) => {
						const exists = folders.some((f) => f.id === folder.id)
						return exists
							? folders.map((f) => (f.id === folder.id ? { ...folder, boards: f.boards } : f))
							: [{ ...folder, boards: folder.boards ?? [] }, ...folders]
					})
				}),
				//escucha boards eliminados
				this.boardApiService
					.watchBoardDeletes(this.teamId()!, this.projectId()!)
					.subscribe(({ boardId }) => {
						this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
						this.folders.update((folders) =>
							folders.map((folder) => ({
								...folder,
								boards: folder.boards.filter((b) => b.id !== boardId),
							})),
						)
					}),
				// escucha folders eliminados
				this.boardApiService
					.watchFolderDeletes(this.teamId()!, this.projectId()!)
					.subscribe(({ folderId }) => {
						this.folders.update((folders) => folders.filter((f) => f.id !== folderId))
					}),
			)
		})
	}

	ngOnDestroy() {
		this.subs.forEach((s) => s.unsubscribe())
	}
	onEditFolder(folder: Folder) {
		this.folderModalState.openForEdit(folder)
	}
	onDeleteBoard(boardId: string) {
		this.boardApiService.deleteBoard(boardId, this.teamId()!, this.projectId()!)
		this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
		toast.success('Pizarra eliminada')
	}

	onDeleteFolder(folderId: string) {
		this.boardApiService.deleteFolder(folderId, this.teamId()!, this.projectId()!)
		this.folders.update((folders) => folders.filter((f) => f.id !== folderId))
		toast.success('Folder eliminado')
	}

	dropIntoFolder(event: CdkDragDrop<any[]>, folderId: string) {
		this.draggingOverFolder.set(null)
		const board = event.item.data
		this.boardApiService.moveToFolder(board.id, folderId, this.teamId()!, this.projectId()!)
		this.boards.update((boards) => boards.filter((b) => b.id !== board.id))
	}
	loadBoards() {
		this.boardApiService.getBoards(this.projectId()!, false).subscribe((boards) => {
			this.boards.set(boards)
		})
	}

	loadFolders() {
		this.boardApiService.getFolders(this.projectId()!, false).subscribe((folders) => {
			this.folders.set(folders)
		})
	}

	openFolder(folderId: string) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}

	folderDropLists = computed(() => this.folders().map((f) => f.id))
	searchQuery = signal<string>('')
	sortBy = signal<string>('Todos') // 'Todos' | 'Nombre' | 'Abierto recientemente'

	// --- LISTAS FILTRADAS Y ORDENADAS REACTIVAMENTE ---
	filteredBoards = computed(() => {
		let list = [...this.boards()]
		const query = this.searchQuery().toLowerCase().trim()

		// 1. Aplicar filtro de búsqueda
		if (query) {
			list = list.filter((b) => b.name.toLowerCase().includes(query))
		}

		// 2. Aplicar ordenamiento
		if (this.sortBy() === 'Nombre') {
			list.sort((a, b) => a.name.localeCompare(b.name))
		} else if (this.sortBy() === 'Abierto recientemente') {
			// Ajusta el campo de orden según tus fechas (ej. updatedAt o createdAt)
			list.sort(
				(a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
			)
		}

		return list
	})

	filteredFolders = computed(() => {
		let list = [...this.folders()]
		const query = this.searchQuery().toLowerCase().trim()

		// Filtrar carpetas por nombre
		if (query) {
			list = list.filter((f) => f.name.toLowerCase().includes(query))
		}

		// Ordenar carpetas
		if (this.sortBy() === 'Nombre') {
			list.sort((a, b) => a.name.localeCompare(b.name))
		}

		return list
	})
	onSearchChanged(query: string) {
		this.searchQuery.set(query)
	}

	onSortChanged(criteria: string) {
		this.sortBy.set(criteria)
	}
}
