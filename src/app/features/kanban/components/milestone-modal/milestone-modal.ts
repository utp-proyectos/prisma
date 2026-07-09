import { Component, effect, inject, input, output, signal } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { CreateMilestoneRequest } from '../../models/milestone/milestone-request.model'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { KanbanApi } from '../../service/kanban-api'
import { toast } from '@spartan-ng/brain/sonner'
import { MilestoneModalState } from '../../service/milestone/milestone-modal-state'

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
	providers: [KanbanApi],
	templateUrl: './milestone-modal.html',
})
export class MilestoneModalComponent {
	// Input para el ws
	readonly teamId = input.required<string>()
	readonly projectId = input.required<string>()
	readonly kanbanId = input.required<string>()

	kanbanApi = inject(KanbanApi)

	// Estado del modal milestone
	readonly milestoneModalState = inject(MilestoneModalState)

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
					const values = data().value()
					const currentMilestone = this.milestoneModalState.milestone()

					if (this.milestoneModalState.isEditMode()) {
						this.kanbanApi.updateMilestone({
							milestoneId: currentMilestone!.id,
							...values,
						})
						toast.success('Hito modificado')
					} else {
						this.kanbanApi.createMilestone({
							kanbanId: this.kanbanId()!,
							...values,
						})
						toast.success('Hito creado')
					}
					this.milestoneModalState.close()
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.milestoneModalState.dialogState()) return

			if (this.milestoneModalState.isEditMode()) {
				const milestone = this.milestoneModalState.milestone()

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
