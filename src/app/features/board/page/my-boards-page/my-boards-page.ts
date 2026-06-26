import { Component, computed, inject, signal } from '@angular/core'
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
	providers: [
		provideIcons({
			lucideUser,
			lucideSearch,
			lucidePlus,
		}),
	],
	templateUrl: './my-boards-page.html',
	styles: `
		.cdk-drag-placeholder {
			opacity: 0;
		}
	`,
})
export class MyBoardsPage {
	//inyeccion de dependecias
	private boardApiService = inject(BoardApiService)
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	createBoardModalState = inject(CreateBoardModalState)

	//mock
	private projectId = 'test-project-1' // temporal

	//signals
	createFolderModal = signal<BrnDialogState>('closed')
	boards = signal<Board[]>([])
	folders = signal<Folder[]>([])
	draggingOverFolder = signal<string | null>(null)

	constructor() {
		this.loadBoards()
		this.loadFolders()
	}

	//api - carga de datos
	loadBoards() {
		this.boardApiService.getBoards(this.projectId, true).subscribe((boards) => {
			this.boards.set(boards)
		})
	}

	loadFolders() {
		this.boardApiService.getFolders(this.projectId, true).subscribe((folders) => {
			this.folders.set(folders)
		})
	}

	// api - navegacion
	openFolder(folderId: string) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}

	//api - acciones
	onDeleteBoard(boardId: string) {
		console.log('id' + boardId)
		this.boardApiService.deleteBoard(boardId).subscribe(() => {
			this.boards.update((boards) => boards.filter((b) => b.id !== boardId))
		})
	}
	onDeleteFolder(folderId: string) {
		this.boardApiService.deleteFolder(folderId).subscribe(() => {
			this.folders.update((folders) => folders.filter((f) => f.id !== folderId))
		})
	}

	//drag and drop - board dentro de folder
	folderDropLists = computed(() => this.folders().map((f) => f.id))

	dropIntoFolder(event: CdkDragDrop<any[]>, folderId: string) {
		this.draggingOverFolder.set(null)
		const board = event.item.data
		this.boardApiService.moveToFolder(board.id, folderId).subscribe(() => {
			this.boards.update((boards) => boards.filter((b) => b.id !== board.id))
			this.folders.update((folders) =>
				folders.map((folder) =>
					folder.id === folderId
						? {
								...folder,
								boards: [...folder.boards, { ...board, folderId }],
							}
						: folder,
				),
			)
		})
	}
}
