import { Component, effect, inject, input, output, signal } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { CreateMilestoneRequest } from '@/features/kanban/models/milestone/milestone-request.model'
import { MilestoneFacade } from '../milestone.facade'

@Component({
	selector: 'app-milestone-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDatePickerImports,
		HlmDialogImports,
		FormField,
		FormRoot,
	],
	templateUrl: './milestone-modal.html',
})
export class MilestoneModalComponent {
	// Input para el ws
	readonly teamId = input.required<string>()
	readonly projectId = input.required<string>()
	readonly kanbanId = input.required<string>()

	// Estado del modal milestone
	readonly milestoneFacade = inject(MilestoneFacade)

	milestoneModel = signal<Omit<CreateMilestoneRequest, 'kanbanId'>>({
		title: '',
		deadline: '',
	})

	milestoneForm = form(
		this.milestoneModel,
		(schemaPath) => {
			required(schemaPath.title, {
				message: 'El nombre es requerido',
			})

			minLength(schemaPath.title, 2, {
				message: 'Debe tener al menos 2 caracteres',
			})

			required(schemaPath.deadline, {
				message: 'La fecha límite es requerida',
			})

			disabled(schemaPath, {
				when: ({ state }) => state.submitting(),
			})
		},
		{
			submission: {
				action: async (data) => {
					this.milestoneFacade.save(data().value(), this.kanbanId())
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.milestoneFacade.milestoneDialogState()) return

			if (this.milestoneFacade.isEditMode()) {
				const milestone = this.milestoneFacade.milestone()

				if (!milestone) return

				this.milestoneForm().reset({
					title: milestone.title,
					deadline: milestone.deadline,
				})
			} else {
				this.milestoneForm().reset({
					title: '',
					deadline: '',
				})
			}
		})
	}
}
