import { Component, effect, inject, input, output, signal } from '@angular/core'
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
	readonly closed = output<void>()

	// Input para el ws
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	kanbanApi = inject(KanbanApi)

	milestoneModel = signal<Omit<CreateMilestoneRequest, 'kanbanId' | 'projectId' | 'teamId'>>({
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
							projectId: this.projectId(),
							teamId: this.teamId(),
							...data().value(),
						})

						toast.success('Hito creado')

						this.closeCreateMilestoneModal()
					} catch {
						toast.error('Error al crear el hito')
					}
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (this.state() === 'closed') {
				this.milestoneForm().reset({ title: '', deadline: '' })
			}
		})
	}

	closeCreateMilestoneModal() {
		this.closed.emit()
	}
}
