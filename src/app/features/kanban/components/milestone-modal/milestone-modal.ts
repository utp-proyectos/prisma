import { Component, inject, input, output, signal } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { CreateMilestoneRequest } from '../../models/milestone/milestone-request.model'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { KanbanApi } from '../../service/kanban-api'
import { toast } from '@spartan-ng/brain/sonner'

@Component({
	selector: 'app-milestone-modal',
	standalone: true,
	imports: [
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmDialogImports,
		HlmDatePickerImports,
		FormField,
		FormRoot,
	],
	providers: [KanbanApi],
	templateUrl: './milestone-modal.html',
})
export class MilestoneModalComponent {
	readonly state = input.required<BrnDialogState | null>()
	readonly kanbanId = input.required<string>()
	readonly closed = output<void>()

	kanbanApi = inject(KanbanApi)

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
					console.log(data().value())

					try {
						this.kanbanApi.createMilestone({
							kanbanId: this.kanbanId(),
							...data().value(),
						})

						toast.success('Hito creado')

						this.close()
					} catch {
						toast.error('Error al crear el hito')
					}
				},
			},
		},
	)

	close() {
		this.milestoneForm().reset({
			title: '',
			deadline: '',
		})

		this.closed.emit()
	}
}
