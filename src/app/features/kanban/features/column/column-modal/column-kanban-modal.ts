import { Component, effect, inject, input, output, signal } from '@angular/core'
import { KanbanApi } from '../../../service/kanban-api'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { CreateColumnKanbanRequest } from '../../../models/column-kanban/column-kanban-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { ColumnModalState } from './column-modal.state'
import { ColumnFacade } from '../column.facade'

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
	templateUrl: './column-kanban-modal.html',
})
export class ColumnKanbanModalComponent {
	// Input para el ws
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	kanbanApi = inject(KanbanApi)

	// FACADE
	readonly columnFacade = inject(ColumnFacade)

	columnKanbanModel = signal<Omit<CreateColumnKanbanRequest, 'kanbanId'>>({
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
					this.columnFacade.save(data().value(), this.kanbanId())
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.columnFacade.columnDialogState()) return

			if (this.columnFacade.isEditMode()) {
				const column = this.columnFacade.column()

				if (!column) return

				this.columnKanbanForm().reset({
					title: column.title,
				})
			} else {
				this.columnKanbanForm().reset({
					title: '',
				})
			}
		})
	}
}
