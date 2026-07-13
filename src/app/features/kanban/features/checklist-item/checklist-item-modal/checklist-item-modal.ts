import { Component, effect, inject, input, signal } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { CreateChecklistItemRequest } from '../../../models/checklist-item/checklist-item-request.model'
import { ChecklistItemFacade } from '../checklist-item.facade'

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
	templateUrl: './checklist-item-modal.html',
})
export class ChecklistItemModalComponent {
	// Inputs requeridos para el contexto del WebSocket
	readonly kanbanId = input.required<string>()
	readonly projectId = input.required<string>()
	readonly teamId = input.required<string>()

	readonly checklistItemFacade = inject(ChecklistItemFacade)

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
					this.checklistItemFacade.save(data().value())
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.checklistItemFacade.checklistItemDialogState()) return

			if (this.checklistItemFacade.isEditMode()) {
				const item = this.checklistItemFacade.checklistItem()
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
