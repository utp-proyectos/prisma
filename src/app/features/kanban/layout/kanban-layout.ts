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
import { CreateKanbanModalState } from '../service/create-kanban-modal-state'
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
	],
	providers: [
		KanbanApi,
		CreateKanbanModalState,
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
	createKanbanModalState = inject(CreateKanbanModalState)
	createKanbanModal = computed(() => this.createKanbanModalState.createKanbanModal())

	//---------- Para ver los tableros de bd
	private kanbanSub?: Subscription

	teamId = input.required<string>()
	projectId = input.required<string>()

	kanbanApi = inject(KanbanApi)

	kanbans = signal<KanbanResponse[]>([])
	kanbansResource = this.kanbanApi.kanbansResource(this.projectId)

	readonly kanbanItems = computed<SidebarItemProps[]>(() => {
		const kanbans = this.kanbans()

		return [
			{
				icon: 'lucideLayoutDashboard',
				title: 'Tablero general',
				to: `/team/${this.teamId()}/project/${this.projectId()}/kanban/general`,
			},
			...kanbans.map((kanban) => ({
				icon: 'lucidePanelLeft',
				title: kanban.name,
				to: `/team/${this.teamId()}/project/${this.projectId()}/kanban/${kanban.id}`,
			})),
		]
	})

	//---------- Modal crear tablero
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
					try {
						console.log('kanban', data().value())

						this.kanbanApi.createKanban({
							projectId: this.projectId()!,
							...data().value(),
						})
						this.createKanbanModalState.close()
						toast.success('Tablero creado')
					} catch (error) {
						toast.error('Error al crear el tablero')
					}
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (!this.kanbansResource.hasValue()) return
			this.kanbans.set(this.kanbansResource.value().data)
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
							break

						case 'UPDATE':
							this.kanbans.update((list) =>
								list.map((k) => (k.id === event.payload.id ? event.payload : k)),
							)
							break

						case 'DELETE':
							this.kanbans.update((list) => list.filter((k) => k.id !== event.payload.id))
							break
					}
				})
		})
	}

	ngOnDestroy() {
		this.kanbanSub?.unsubscribe()
	}

	closeCreateKanbanModal() {
		this.createKanbanModalState.close()
		this.kanbanForm().reset({ name: '', privateSwitch: false })
	}
}
