import { Component, effect, inject, input, output, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolder } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { BoardApiService } from '../../service/board-api.service'
import { FolderRequest } from '../../models/folder/folder-request'
import { disabled, form, required, FormRoot, FormField } from '@angular/forms/signals'
import { toast } from '@spartan-ng/brain/sonner'
import { FolderModalState } from '../../service/create-folder-modal-state'

@Component({
	selector: 'app-folder-create-dialog',
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmButtonImports,
		FormRoot,
		FormField,
	],
	providers: [provideIcons({ lucideFolder })],
	templateUrl: './folder-create-dialog.html',
})
export class FolderCreateDialog {
	private boardApiService = inject(BoardApiService)
	folderModalState = inject(FolderModalState)

	projectId = input.required<string>()
	teamId = input.required<string>()
	folderCreated = output<void>()

	folderModel = signal<FolderRequest>({ name: '', isPrivate: false })

	constructor() {
		effect(() => {
			if (this.folderModalState.isEditMode() && this.folderModalState.dialogState() === 'open') {
				const folder = this.folderModalState.folder()
				if (folder) {
					this.folderModel.set({ name: folder.name, isPrivate: folder.isPrivate })
				}
			} else if (this.folderModalState.dialogState() === 'closed') {
				this.folderModel.set({ name: '', isPrivate: false })
			}
		})
	}

	folderForm = form(
		this.folderModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre del folder es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async () => {
					const isEdit = this.folderModalState.isEditMode()
					if (isEdit) {
						this.boardApiService.updateFolder(
							this.folderModalState.folder()!.id,
							this.teamId(),
							this.projectId(),
							this.folderModel().name,
						)
						console.log('projectId al actualizar:', this.projectId())
					} else {
						const dto: FolderRequest = {
							name: this.folderModel().name,
							isPrivate: this.folderModalState.isPrivate(),
						}
						this.boardApiService.sendFolder(dto, this.teamId(), this.projectId())
						this.folderCreated.emit()
					}
					this.folderModalState.close()
					this.folderForm.name().reset('')
					toast.success(isEdit ? 'Folder actualizado' : 'Folder creado')
				},
			},
		},
	)
}
