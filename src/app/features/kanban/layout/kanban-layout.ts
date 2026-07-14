import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
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
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSwitch } from '@spartan-ng/helm/switch'
import { KanbanApi } from '../features/kanban/kanban.api'

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
import { KanbanResponse } from '../models/kanban-response.model'
import { AuthService } from '@/core/servies/auth.serive'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'
import { TeamApi } from '@/features/home/services/team-api'
import { KanbanFacade } from '../features/kanban/kanban.facade'
import { KanbanBoardRealtime } from '../features/kanban/kanban.realtime'
import { KanbanModalState } from '../features/kanban/kanban-modal/kanban-modal-state'
import { KanbanState } from '../features/kanban/kanban.state'
import { TaskApi } from '../features/task/task.api'
import { TaskFacade } from '../features/task/task.facade'
import { TaskModalState } from '../features/task/task-modal/task-modal-state'
import { TaskRealtime } from '../features/task/task.realtime'
import { ColumnTaskState } from '../features/column-task/column-task-state'
import { DashboardRefresh } from '../features/task/dashboard.refresh'
import { KanbanRealtime } from '../service/kanban-realtime'
import { ChecklistRealtime } from '../features/checklist/checklist.realtime'
import { ChecklistModalState } from '../features/checklist/checklist-modal/checklist-modal.state'
import { ChecklistFacade } from '../features/checklist/checklist.facade'
import { ChecklistState } from '../features/checklist/checklist.state'
import { ChecklistApi } from '../features/checklist/checklist.api'
import { ChecklistItemRealtime } from '../features/checklist-item/checklist-item.realtime'
import { ChecklistItemModalState } from '../features/checklist-item/checklist-item-modal/checklist-item-modal.state'
import { ChecklistItemFacade } from '../features/checklist-item/checklist-item.facade'
import { ChecklistItemState } from '../features/checklist-item/checklist-item.state'
import { ChecklistItemApi } from '../features/checklist-item/checklist-item.api'
import { TaskFilterService } from '../features/column-task/task-filter-service'
import { ColumnTaskFacade } from '../features/column-task/column-task-facade'
import { ColumnRealtime } from '../features/column/column.realtime'
import { ColumnModalState } from '../features/column/column-modal/column-modal.state'
import { ColumnFacade } from '../features/column/column.facade'
import { ColumnApi } from '../features/column/column.api'
import { MilestoneRealtime } from '../features/milestone/milestone.realtime'
import { MilestoneModalState } from '../features/milestone/milestone-modal/milestone-modal-state'
import { MilestoneFacade } from '../features/milestone/milestone.facade'
import { MilestoneState } from '../features/milestone/milestone.state'
import { MilestoneApi } from '../features/milestone/milestone.api'
import { kanbanRoutes } from '../kanban.routes'
import { toSignal } from '@angular/core/rxjs-interop'
import { filter, map } from 'rxjs'

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
		TeamApi,
		AuthService,

		KanbanApi,
		KanbanFacade,
		KanbanState,
		KanbanModalState,
		KanbanBoardRealtime,

		TaskApi,
		TaskFacade,
		TaskModalState,
		TaskRealtime,

		ColumnTaskState,
		DashboardRefresh,

		MilestoneApi,
		MilestoneState,
		MilestoneFacade,
		MilestoneModalState,
		MilestoneRealtime,

		ColumnApi,
		ColumnFacade,
		ColumnModalState,
		ColumnRealtime,

		ColumnTaskFacade,
		TaskFilterService,

		ChecklistItemApi,
		ChecklistItemState,
		ChecklistItemFacade,
		ChecklistItemModalState,
		ChecklistItemRealtime,

		ChecklistApi,
		ChecklistState,
		ChecklistFacade,
		ChecklistModalState,
		ChecklistRealtime,

		KanbanRealtime,

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
	// Inputs obligatorios
	teamId = input.required<string>()
	projectId = input.required<string>()

	// Servicios APIs requeridos
	readonly teamApi = inject(TeamApi)
	readonly kanbanApi = inject(KanbanApi)

	// ÚNICO ORQUESTADOR
	readonly kanbanFacade = inject(KanbanFacade)
	readonly kanbanRealtime = inject(KanbanBoardRealtime)

	//---------- Sidebar
	readonly kanbansResource = this.kanbanApi.kanbansResource(this.projectId)
	readonly projectsResource = this.teamApi.projectsResource(this.teamId)

	// Atajos directos al estado de la Fachada
	readonly kanbans = this.kanbanFacade.state.kanbans
	readonly kanbanModal = this.kanbanFacade.kanbanDialogState

	readonly projectName = computed(() => {
		const resource = this.projectsResource.value()
		const projects = resource?.data || []
		const currentProjectId = this.projectId()

		const currentProject = projects.find((p) => p.id === currentProjectId)
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

	//---------- Formulario del Modal de Kanban
	readonly kanbanModel = signal<Omit<CreateKanbanRequest, 'projectId'>>({
		name: '',
		privateSwitch: false,
	})

	readonly kanbanForm = form(
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

					this.kanbanFacade.save(values, this.projectId())
				},
			},
		},
	)

	//---------- Eliminar tablero (Control local del diálogo)
	readonly deleteModalState = signal<'open' | 'closed'>('closed')
	readonly kanbanToDelete = signal<KanbanResponse | null>(null)

	onDeleteKanbanClick(kanban: KanbanResponse) {
		this.kanbanToDelete.set(kanban)
		this.deleteModalState.set('open')
	}

	confirmDeleteKanban() {
		const kanban = this.kanbanToDelete()
		if (!kanban) return

		this.kanbanFacade.delete(kanban.id)
		toast.success('Tablero eliminado')

		this.closeDeleteModal()
	}

	closeDeleteModal() {
		this.deleteModalState.set('closed')
		this.kanbanToDelete.set(null)
	}

	private readonly router = inject(Router)
	private readonly route = inject(ActivatedRoute)

	readonly currentKanbanId = toSignal(
		this.router.events.pipe(
			filter((e) => e instanceof NavigationEnd),
			map(() => {
				const url = this.router.url
				const segments = url.split('/')
				const last = segments.at(-1)
				return last === 'general' ? null : last
			}),
		),
		{
			initialValue: null,
		},
	)

	constructor() {
		effect(() => {
			if (!this.kanbansResource.hasValue()) return

			this.kanbanFacade.setKanbans(this.kanbansResource.value()!.data)
		})

		effect(() => {
			if (!this.kanbanModal()) return

			if (this.kanbanFacade.isEditMode()) {
				const kanban = this.kanbanFacade.kanban()
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

			this.kanbanRealtime.connect(this.teamId(), this.projectId())
		})

		effect(() => {
			if (!this.kanbansResource.hasValue()) return

			const kanbanId = this.currentKanbanId()

			if (!kanbanId) return

			const exists = this.kanbans().some((k) => k.id === kanbanId)

			if (exists) return

			this.router.navigate([
				'/team',
				this.teamId(),
				'project',
				this.projectId(),
				'kanban',
				'general',
			])
		})
	}

	ngOnDestroy() {
		this.kanbanRealtime.disconnect()
	}
}
