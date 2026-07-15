import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardsAction } from '../../components/boards-action/boards-action'
import { BoardCard } from '../../components/board-card/board-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideSearch, lucideUser } from '@ng-icons/lucide'
import { FolderCardComponent } from '../../components/folder-card/folder-card'
import { ActivatedRoute, Router } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { FolderCreateDialog } from '../../components/folder-create-dialog/folder-create-dialog'
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop'
import { BoardApiService } from '../../service/board-api.service'
import { Board } from '../../models/board/board-response'
import { Folder } from '../../models/folder/folder.model'
import { Subscription } from 'rxjs'
import { toast } from '@spartan-ng/brain/sonner'
import { FolderModalState } from '../../service/create-folder-modal-state'
import { AuthService } from '@/core/servies/auth.serive'

@Component({
	selector: 'app-my-boards-page',
	imports: [
		HlmSeparatorImports,
		BoardsAction,
		BoardCard,
		NgIcon,
		FolderCardComponent,
		HlmButtonImports,
		FolderCreateDialog,
		CdkDrag,
		CdkDropList,
	],
	providers: [provideIcons({ lucideUser, lucideSearch, lucidePlus })],
	templateUrl: './my-boards-page.html',
	styles: `
		.cdk-drag-placeholder {
			opacity: 0;
		}
	`,
})
export class MyBoardsPage {
	private boardApiService = inject(BoardApiService)
	private folderModalState = inject(FolderModalState)
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	private authService = inject(AuthService)
	createBoardModalState = inject(CreateBoardModalState)

	projectId = input<string>()
	teamId = input<string>()

	createFolderModal = signal<BrnDialogState>('closed')
	boards = signal<Board[]>([])
	folders = signal<Folder[]>([])
	draggingOverFolder = signal<string | null>(null)

	private subs: Subscription[] = []

	constructor() {
		effect(() => {
			if (!this.projectId() || !this.teamId()) return

			this.subs.forEach((s) => s.unsubscribe())
			this.subs = []

			this.loadBoards()
			this.loadFolders()

			// Obtener el ID del usuario actualmente logueado
			const currentUserId = this.authService.currentUser()?.id

			this.subs.push(
				this.boardApiService.watchBoards(this.teamId()!, this.projectId()!).subscribe((board) => {
					// --- VALIDACIÓN DE PRIVACIDAD ---
					// Si es privado y no soy el creador, lo ignoramos por completo
					if (board.isPrivate && board.creatorId !== currentUserId) {
						console.log('Ignorando tablero privado ajeno')
						return
					}

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
						this.folders.update((folders) =>
							folders.map((folder) => ({
								...folder,
								boards: folder.boards.filter((b) => b.id !== board.id),
							})),
						)
						// reemplaza si existe, agrega si es nuevo
						this.boards.update((boards) => {
							const exists = boards.some((b) => b.id === board.id)
							return exists
								? boards.map((b) => (b.id === board.id ? board : b))
								: [board, ...boards]
						})
					}
				}),
				this.boardApiService.watchFolders(this.teamId()!, this.projectId()!).subscribe((folder) => {
					// --- VALIDACIÓN DE PRIVACIDAD PARA FOLDERS ---
					// (Si tus carpetas también tienen creador e 'isPrivate', aplica el mismo filtro)
					if (folder.isPrivate && folder.creatorId !== currentUserId) {
						console.log('Ignorando folder privado ')
						return
					}

					this.folders.update((folders) => {
						const exists = folders.some((f) => f.id === folder.id)
						return exists
							? folders.map((f) => (f.id === folder.id ? { ...folder, boards: f.boards } : f))
							: [{ ...folder, boards: folder.boards ?? [] }, ...folders]
					})
				}),
				this.boardApiService
					.watchBoardDeletes(this.teamId()!, this.projectId()!)
					.subscribe(({ boardId }) => {
						this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
					}),
				this.boardApiService
					.watchFolderDeletes(this.teamId()!, this.projectId()!)
					.subscribe(({ folderId }) => {
						this.folders.update((folders) => folders.filter((f) => f.id !== folderId))
					}),
			)
		})
	}
	onEditBoard(board: Board) {
		this.createBoardModalState.openForEdit(board)
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
		this.folders.update((folders) =>
			folders.map((folder) =>
				folder.id === folderId
					? { ...folder, boards: [...folder.boards, { ...board, folderId }] }
					: folder,
			),
		)
	}

	ngOnDestroy() {
		this.subs.forEach((s) => s.unsubscribe())
	}
	loadBoards() {
		this.boardApiService.getBoards(this.projectId()!, true).subscribe((boards) => {
			this.boards.set(boards)
		})
	}

	loadFolders() {
		this.boardApiService.getFolders(this.projectId()!, true).subscribe((folders) => {
			this.folders.set(folders)
		})
	}

	openFolder(folderId: string) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}

	folderDropLists = computed(() => this.folders().map((f) => f.id))

	// --- SEÑALES PARA LOS FILTROS ---
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

	// --- MANEJADORES DE EVENTOS EMITIDOS POR BOARDS-ACTION ---
	onSearchChanged(query: string) {
		this.searchQuery.set(query)
	}

	onSortChanged(criteria: string) {
		this.sortBy.set(criteria)
	}
}
