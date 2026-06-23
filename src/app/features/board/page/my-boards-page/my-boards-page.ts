import { Component, inject, signal } from '@angular/core'
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

interface BoardsProps {
	id: number
	name: string
	description: string
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
	],
	providers: [
		provideIcons({
			lucideUser,
			lucideSearch,
			lucidePlus,
		}),
	],
	templateUrl: './my-boards-page.html',
	styles: ``,
})
export class MyBoardsPage {
	createFolderModal = signal<BrnDialogState>('closed')
	boards = signal<BoardsProps[]>([
		{ id: 12, name: 'Ideas uix ', description: 'Ideas del modulo board' },
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

	openFolder(folderId: string) {
		this.router.navigate(['folders', folderId], { relativeTo: this.route })
	}
}
