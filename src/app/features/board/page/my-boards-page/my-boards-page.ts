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
import { Board } from '../../models/board-response'
import { Folder } from '../../models/folder.model'
import { Subscription } from 'rxjs'
import { toast } from '@spartan-ng/brain/sonner'

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
	private router = inject(Router)
	private route = inject(ActivatedRoute)
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

			this.subs.push(
				this.boardApiService.watchBoards(this.teamId()!, this.projectId()!).subscribe((board) => {
					if (board.isPrivate !== true) return
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
						this.boards.update((boards) => [board, ...boards])
					}
				}),
				this.boardApiService.watchFolders(this.teamId()!, this.projectId()!).subscribe((folder) => {
					if (folder.isPrivate !== true) return
					this.folders.update((folders) => [{ ...folder, boards: folder.boards ?? [] }, ...folders])
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
}
