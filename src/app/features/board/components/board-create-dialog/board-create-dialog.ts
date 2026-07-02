import { Component, inject, input, model, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSquareMousePointer } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { CreateBoardModalState } from '../../service/create-board-modal-state'
import { disabled, form, required, FormField, FormRoot } from '@angular/forms/signals'
import { BoardRequest } from '../../models/board-request'
import { BoardApiService } from '../../service/board-api.service'
import { firstValueFrom } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
	selector: 'app-board-create-dialog',
	imports: [
		NgIcon,
		HlmTextareaImports,
		HlmInputGroupImports,
		HlmInputImports,
		HlmFieldImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmButtonImports,
		FormRoot,
		FormField,
	],
	providers: [
		provideIcons({
			lucideSquareMousePointer,
		}),
	],
	templateUrl: './board-create-dialog.html',
})
export class BoardCreateDialog {
	createBoardModalState = inject(CreateBoardModalState)
	private boardApiService = inject(BoardApiService)
	private router = inject(Router)

	projectId = input.required<string>()
	teamId = input.required<string>()

	boardModel = signal<BoardRequest>({
		name: '',
		isPrivate: false,
		description: '',
		folderId: null,
	})

	boardForm = form(
		this.boardModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre de la pizarra es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async () => {
					const dto: BoardRequest = {
						name: this.boardModel().name,
						isPrivate: this.createBoardModalState.isPrivate(),
						description: this.boardModel().description,
						folderId: this.createBoardModalState.folderId(),
					}

					const board = await firstValueFrom(
						this.boardApiService.createBoard(this.projectId(), this.teamId(), dto),
					)

					this.router.navigate(['/board', board.id])
					this.createBoardModalState.close()
				},
			},
		},
	)
}
