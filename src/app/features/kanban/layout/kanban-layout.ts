import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideTriangle,
	lucidePlus,
	lucideMoreHorizontal,
	lucidePanelLeft,
	lucideLayoutDashboard,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { KanbanModalState } from '../service/kanban-modal-state'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSwitch } from '@spartan-ng/helm/switch'
import { KanbanApi } from '../service/kanban-api'

import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'
import { CreateKanbanRequest } from '../models/kanban-request.model'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { toast } from '@spartan-ng/brain/sonner'
import { Subscription } from 'rxjs'
import { KanbanResponse } from '../models/kanban-response.model'
import { AuthService } from '@/core/servies/auth.serive'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'
import { TeamApi } from '@/features/home/services/team-api'

@Component({
	selector: 'app-kanban-layout',
	standalone: true,
	imports: [
		RouterOutlet,
		Sidebar,
		SidebarHeader,
		SidebarContent,
		NavHeader,
		HlmButtonImports,
		HlmFieldImports,
		NgIcon,
		HlmDialogImports,
		HlmInputImports,
		HlmSwitch,
		FormField,
		FormRoot,
		DeleteModalComponent,
	],
	providers: [
		KanbanApi,
		TeamApi,
		KanbanModalState,
		AuthService,
		provideIcons({
			lucideTriangle,
			lucidePanelLeft,
			lucidePlus,
			lucideMoreHorizontal,
			lucideLayoutDashboard,
		}),
	],
	templateUrl: './kanban-layout.html',
})
export class KanbanLayout implements OnDestroy {
	//---------- Para ver los tableros de bd
	private kanbanSub?: Subscription

	// Input para el ws
	teamId = input.required<string>()
	projectId = input.required<string>()

	kanbanApi = inject(KanbanApi)
	teamApi = inject(TeamApi)
	kanbans = signal<KanbanResponse[]>([])

	//---------- Sidebar
	kanbansResource = this.kanbanApi.kanbansResource(this.projectId)
	projectsResource = this.teamApi.projectsResource(this.teamId)

	projectName = computed(() => {
		const resource = this.projectsResource.value()
		const projects = resource?.data || []
		const currentProjectId = this.projectId()

		const currentProject = projects.find((p) => p.id === currentProjectId)
		console.log('currentProject', currentProject)
		return currentProject ? currentProject.name : 'Cargando proyecto...'
	})

	readonly kanbanItems = computed<SidebarItemProps[]>(() => {
		const kanbans = this.kanbans()

		return [
			{
				icon: 'lucideLayoutDashboard',
				title: 'Tablero general',
				to: `/team/${this.teamId()}/project/${this.projectId()}/kanban/general`,
				canAction: false,
				privateAction: false,
			},
			...kanbans.map((kanban) => ({
				icon: 'lucidePanelLeft',
				title: kanban.name,
				to: `/team/${this.teamId()}/project/${this.projectId()}/kanban/${kanban.id}`,
				canAction: true,
				rawQuery: kanban,
				privateAction: kanban.privateSwitch || false,
			})),
		]
	})

	//---------- Modal CREAR y EDITAR tablero
	kanbanModalState = inject(KanbanModalState)
	kanbanModal = this.kanbanModalState.dialogState

	kanbanModel = signal<Omit<CreateKanbanRequest, 'projectId'>>({
		name: '',
		privateSwitch: false,
	})

	kanbanForm = form(
		this.kanbanModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre es requerido' })
			minLength(schemaPath.name, 2, { message: 'El nombre debe tener al menos 2 caracteres' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					const values = data().value()
					const currentKanban = this.kanbanModalState.kanban()

					if (this.kanbanModalState.isEditMode()) {
						this.kanbanApi.updateKanban({
							kanbanId: currentKanban!.id,
							name: values.name,
							privateSwitch: values.privateSwitch,
						})
						toast.success('Tablero modificado')
					} else {
						this.kanbanApi.createKanban({
							projectId: this.projectId()!,
							...values,
						})
						toast.success('Tablero creado')
					}
					this.kanbanModalState.close()
				},
			},
		},
	)

	//---------- Eliminar tablero
	deleteModalState = signal<'open' | 'closed'>('closed')
	kanbanToDelete = signal<KanbanResponse | null>(null)

	onDeleteKanbanClick(kanban: KanbanResponse) {
		this.kanbanToDelete.set(kanban)
		this.deleteModalState.set('open')
	}

	confirmDeleteKanban() {
		const kanban = this.kanbanToDelete()
		if (!kanban) return

		this.kanbanApi.deleteKanban(kanban.id)
		toast.success('Tablero eliminado')

		this.closeDeleteModal()
	}

	closeDeleteModal() {
		this.deleteModalState.set('closed')
		this.kanbanToDelete.set(null)
	}

	constructor() {
		effect(() => {
			if (!this.kanbansResource.hasValue()) return
			this.kanbans.set(this.kanbansResource.value().data)
		})

		effect(() => {
			if (!this.kanbanModalState.dialogState()) return

			if (this.kanbanModalState.isEditMode()) {
				const kanban = this.kanbanModalState.kanban()

				if (!kanban) return

				this.kanbanForm().reset({
					name: kanban.name,
					privateSwitch: kanban.privateSwitch || false,
				})
			} else {
				this.kanbanForm().reset({
					name: '',
					privateSwitch: false,
				})
			}
		})

		effect(() => {
			if (!this.projectId()) return

			this.kanbanSub?.unsubscribe()

			this.kanbanSub = this.kanbanApi
				.getKanbans(this.projectId(), this.teamId())
				.subscribe((event) => {
					switch (event.action) {
						case 'CREATE':
							this.kanbans.update((list) => [event.payload, ...list])
							this.kanbansResource.reload()
							break

						case 'UPDATE':
							this.kanbans.update((list) =>
								list.map((k) => (k.id === event.payload.id ? event.payload : k)),
							)

							this.kanbansResource.reload()
							break

						case 'DELETE':
							this.kanbans.update((list) => list.filter((k) => k.id !== event.payload.id))
							this.kanbansResource.reload()
							break
					}
				})
		})
	}

	ngOnDestroy() {
		this.kanbanSub?.unsubscribe()
	}
}
