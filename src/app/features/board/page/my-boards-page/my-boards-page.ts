import { Component, computed, inject, signal } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardsAction } from '../../components/boards-action/boards-action'
import { BoardCard } from '../../components/board-card/board-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideSearch, lucideUser } from '@ng-icons/lucide'
import { FolderCardComponent, MockFolder } from '../../components/folder-card/folder-card'
import { ActivatedRoute, Router } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { FolderCreateDialog } from '../../components/folder-create-dialog/folder-create-dialog'
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop'

interface BoardsProps {
	id: number
	name: string
	description: string
	thumbnailUrl: string
}

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
	createFolderModal = signal<BrnDialogState>('closed')
	boards = signal<BoardsProps[]>([
		{
			id: 12,
			name: 'Ideas uix ',
			description: 'Ideas del modulo board',
			thumbnailUrl: 'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887',
		},
		{
			id: 13,
			name: 'Idedddas uix ',
			description: 'Ideas del modulo board',
			thumbnailUrl: 'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887',
		},
		{
			id: 13,
			name: 'Idedddas uix ',
			description: 'Ideas del modulo board',
			thumbnailUrl: 'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887',
		},
		{
			id: 13,
			name: 'Idedddas uix ',
			description: 'Ideas del modulo board',
			thumbnailUrl: 'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887',
		},
	])
	folders = signal<MockFolder[]>([
		{
			id: 'folder-1',
			name: 'Team Project',
			boards: [
				{ id: 'b1', title: 'Board Login', thumbnailUrl: null },
				{ id: 'b2', title: 'Board Ui', thumbnailUrl: null },
			],
		},
		{
			id: 'folder-2',
			name: 'Design System',
			boards: [],
		},
	])
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	createBoardModalState = inject(CreateBoardModalState)
	draggingOverFolder = signal<string | null>(null)

	openFolder(folderId: string) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}
	folderDropLists = computed(() => this.folders().map((f) => f.id))
	dropIntoFolder(event: CdkDragDrop<any[]>, folderId: string) {
		this.draggingOverFolder.set(null)

		const board = event.item.data

		this.boards.update((boards) => boards.filter((b) => b.id !== board.id))

		this.folders.update((folders) =>
			folders.map((folder) =>
				folder.id === folderId
					? {
							...folder,
							boards: [
								...folder.boards,
								{
									id: String(board.id),
									title: board.name,
									thumbnailUrl: board.thumbnailUrl ?? null,
								},
							],
						}
					: folder,
			),
		)
	}
}
