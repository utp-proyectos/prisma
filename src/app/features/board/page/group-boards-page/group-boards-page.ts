import { Component, inject, signal } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardsAction } from '../../components/boards-action/boards-action'
import { BoardCard } from '../../components/board-card/board-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { provideIcons, NgIcon } from '@ng-icons/core'
import { lucideSearch, lucideUsers } from '@ng-icons/lucide'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { FolderCreateDialog } from '../../components/folder-create-dialog/folder-create-dialog'
interface BoardsProps {
	id: number
	name: string
	description: string
}
@Component({
	selector: 'app-group-boards-page',
	imports: [
		NgIcon,
		HlmSeparatorImports,
		BoardsAction,
		BoardCard,
		HlmButtonImports,
		FolderCreateDialog,
	],
	providers: [
		provideIcons({
			lucideSearch,
			lucideUsers,
		}),
	],
	templateUrl: './group-boards-page.html',
	styles: ``,
})
export class GroupBoardsPage {
	modal = signal<BrnDialogState>('closed')
	createBoardModalState = inject(CreateBoardModalState)
	createFolderModal = signal<BrnDialogState>('closed')

	boards = signal<BoardsProps[]>([])
}
