import { Component, effect, inject, input, signal } from '@angular/core'
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { KanbanApi } from '../../../service/kanban-api'
import { ChecklistModalState } from './checklist-modal.state'
import { CreateChecklistRequest } from '../../../models/checklist/checklist-request.model'
import { toast } from '@spartan-ng/brain/sonner'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { ChecklistFacade } from '../checklist.facade'

@Component({
	selector: 'app-checklist-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDatePickerImports,
		HlmDialogImports,
		FormField,
		FormRoot,
		HlmSelectImports,
	],
	templateUrl: './checklist-modal.html',
})
export class ChecklistModalComponent {
	// Input para el ws
	readonly kanbanId = input.required<string>()
	readonly projectId = input.required<string>()
	readonly teamId = input.required<string>()

	readonly checklistFacade = inject(ChecklistFacade)

	// Lista para el selector de prioridad
	protected readonly priorities = [
		{ label: 'Baja', value: 'BAJA' },
		{ label: 'Media', value: 'MEDIA' },
		{ label: 'Alta', value: 'ALTA' },
	]

	protected readonly priorityToString = (value: string) => {
		return this.priorities.find((item) => item.value === value)?.label ?? ''
	}

	checklistModel = signal<Omit<CreateChecklistRequest, 'taskId'>>({
		title: '',
		priority: 'BAJA',
	})

	checklistForm = form(
		this.checklistModel,
		(schemaPath) => {
			required(schemaPath.title, { message: 'El nombre es requerido' })
			required(schemaPath.priority, { message: 'La prioridad es requerida' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					this.checklistFacade.save(data().value())
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.checklistFacade.checklistDialogState()) return

			if (this.checklistFacade.isEditMode()) {
				const checklist = this.checklistFacade.checklist()

				if (!checklist) return

				this.checklistForm().reset({
					title: checklist.title,
					priority: checklist.priority,
				})
			} else {
				this.checklistForm().reset({
					title: '',
					priority: 'BAJA',
				})
			}
		})
	}
}
