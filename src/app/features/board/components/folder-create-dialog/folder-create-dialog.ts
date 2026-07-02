import { Component, inject, input, model, output, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolder } from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { BoardApiService } from '../../service/board-api.service'
import { FolderRequest } from '../../models/folder-request'
import { disabled, form, required, FormRoot, FormField } from '@angular/forms/signals'
import { firstValueFrom } from 'rxjs'
import { toast } from '@spartan-ng/brain/sonner'

@Component({
	selector: 'app-folder-create-dialog',
	imports: [
		NgIcon,
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
			lucideFolder,
		}),
	],
	templateUrl: './folder-create-dialog.html',
})
export class FolderCreateDialog {
	//inyecciones de Dependencias
	private boardApiService = inject(BoardApiService)

	projectId = input.required<string>() // ✅ Obligatorio desde el HTML del padre
	teamId = input.required<string>()
	//  (Inputs) y Salidas (Outputs)
	state = input<BrnDialogState>('closed') // método para abrir y cerrar
	isPrivate = input<boolean>(false)
	closed = output<void>()
	folderCreated = output<void>()

	// estados del Componente (Signals)
	folderModel = signal<FolderRequest>({
		name: '',
		isPrivate: false,
	})

	//configuración y Acción del Formulario (Signals Forms)
	folderForm = form(
		this.folderModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre del folder es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async () => {
					const dto: FolderRequest = {
						name: this.folderModel().name,
						isPrivate: this.isPrivate(),
					}
					this.boardApiService.sendFolder(dto, this.teamId(), this.projectId())
					this.closed.emit()
					this.folderForm.name().reset('')
					toast.success('Folder creado')
				},
			},
		},
	)
}
