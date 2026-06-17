import { Component, signal } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { BoardsAction } from '../../components/boards-action/boards-action'
import { BoardCard } from '../../components/board-card/board-card'
import { BoardCreateDialog } from '../../components/board-create-dialog/board-create-dialog'
import { BrnDialogState } from '@spartan-ng/brain/dialog'

@Component({
	selector: 'app-group-boards-page',
	imports: [HlmSeparatorImports, BoardsAction, BoardCard, BoardCreateDialog],

	templateUrl: './group-boards-page.html',
	styles: ``,
})
export class GroupBoardsPage {
	modal = signal<BrnDialogState>('closed')
}
