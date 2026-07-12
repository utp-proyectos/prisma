import { Component, effect, inject, input, signal } from '@angular/core'
import { KanbanApi } from '../../service/kanban-api'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { CreateChecklistItemRequest } from '../../models/checklist-item/checklist-item-request.model'
import { ChecklistItemModalState } from '../../service/checklist-item/checklist-item-modal-state'
import { toast } from '@spartan-ng/brain/sonner'

@Component({
	selector: 'app-checklist-item-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDatePickerImports,
		HlmDialogImports,
		HlmSelectImports,
		FormField,
		FormRoot,
	],
	providers: [KanbanApi],
	templateUrl: './checklist-item-modal.html',
})
export class ChecklistItemModalComponent {
	// Inputs requeridos para el contexto del WebSocket
	readonly kanbanId = input.required<string>()
	readonly projectId = input.required<string>()
	readonly teamId = input.required<string>()

	private readonly kanbanApi = inject(KanbanApi)
	readonly checklistItemModalState = inject(ChecklistItemModalState)

	// Modelo inicial reactivo para el formulario
	readonly checklistItemModel = signal<Omit<CreateChecklistItemRequest, 'checklistId'>>({
		content: '',
	})

	// Estructura de control y envío del formulario
	readonly checklistItemForm = form(
		this.checklistItemModel,
		(schemaPath) => {
			required(schemaPath.content, { message: 'El contenido es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					const values = data().value()
					const currentItem = this.checklistItemModalState.checklistItem()

					if (this.checklistItemModalState.isEditMode()) {
						this.kanbanApi.updateChecklistItem({
							checklistItemId: currentItem!.id,
							content: values.content,
							completedItem: currentItem!.completedItem ?? false,
						})
						toast.success('Elemento modificado')
					} else {
						this.kanbanApi.createChecklistItem({
							checklistId: this.checklistItemModalState.checklistId()!,
							content: values.content,
						})
						toast.success('Elemento creado')
					}

					this.checklistItemModalState.close()
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (this.checklistItemModalState.dialogState() !== 'open') return

			if (this.checklistItemModalState.isEditMode()) {
				const item = this.checklistItemModalState.checklistItem()
				if (!item) return

				this.checklistItemForm().reset({
					content: item.content,
				})
			} else {
				this.checklistItemForm().reset({
					content: '',
				})
			}
		})
	}
}
