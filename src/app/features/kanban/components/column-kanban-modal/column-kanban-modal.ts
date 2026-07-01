import { Component, inject, input, output, signal } from '@angular/core'
import { KanbanApi } from '../../service/kanban-api'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { CreateColumnKanbanRequest } from '../../models/column-kanban/column-kanban-request.model'
import { toast } from '@spartan-ng/brain/sonner'

@Component({
	selector: 'app-column-kanban-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDialogImports,
		FormField,
		FormRoot,
	],
	providers: [KanbanApi],
	templateUrl: './column-kanban-modal.html',
})
export class ColumnKanbanModalComponent {
	readonly state = input.required<BrnDialogState | null>()
	readonly closed = output<void>()

	// Input para el ws
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	kanbanApi = inject(KanbanApi)

	columnKanbanModel = signal<Omit<CreateColumnKanbanRequest, 'kanbanId' | 'projectId' | 'teamId'>>({
		title: '',
	})

	columnKanbanForm = form(
		this.columnKanbanModel,
		(schemaPath) => {
			required(schemaPath.title, { message: 'El nombre es requerido' })
			minLength(schemaPath.title, 2, { message: 'El nombre debe tener al menos 2 caracteres' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					console.log(data().value())

					try {
						this.kanbanApi.createColumn({
							kanbanId: this.kanbanId(),
							projectId: this.projectId(),
							teamId: this.teamId(),
							...data().value(),
						})

						this.closeCreateColumnKanbanModal()
						toast.success('Columna creada')
					} catch {
						toast.error('Error al crear la columna')
					}
				},
			},
		},
	)

	closeCreateColumnKanbanModal() {
		this.closed.emit()
		this.columnKanbanForm().reset({ title: '' })
	}
}
