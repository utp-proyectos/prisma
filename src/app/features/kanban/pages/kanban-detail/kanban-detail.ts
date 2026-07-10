import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideClock,
	lucidePlus,
	lucideSearch,
	lucidePanelLeft,
	lucideMoreHorizontal,
	lucideCalendarDays,
	lucideRotate3d,
	lucideArrowBigUpDash,
	lucideFlag,
	lucideInfo,
	lucideArrowLeft,
	lucideUsers,
	lucideCalendar,
	lucideEdit,
	lucideTrash,
	lucideWrench,
	lucideUser,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmTabsImports } from '@spartan-ng/helm/tabs'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { HlmEmptyImports } from '@spartan-ng/helm/empty'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmSwitch } from '@spartan-ng/helm/switch'
import { HlmLabel } from '@spartan-ng/helm/label'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { HlmSelectImports } from '@spartan-ng/helm/select'

import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop'
import { TaskCardComponent } from '@/shared/components/sidebar/components/task-card/task-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { TaskModal } from '../../components/task-modal/task-modal'
import { TaskModalState } from '../../service/task/task-modal-state'
import { MilestoneModalComponent } from '../../components/milestone-modal/milestone-modal'
import { KanbanApi } from '../../service/kanban-api'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { ColumnKanbanModalComponent } from '../../components/column-kanban-modal/column-kanban-modal'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { TeamApi } from '@/features/home/services/team-api'
import { MilestoneState } from '../../service/milestone/milestone-state'
import { KanbanRealtime } from '../../service/kanban-realtime'
import { ColumnTaskState } from '../../service/column-task/column-task-state'
import { ColumnTaskFacade } from '../../service/column-task/column-task-facade'
import { MilestoneModalState } from '../../service/milestone/milestone-modal-state'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { toast } from '@spartan-ng/brain/sonner'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'
import { HlmAvatar, HlmAvatarGroup } from '@spartan-ng/helm/avatar'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { getAssignmentInitials } from '../../utils/string.utils'

@Component({
	selector: 'app-kanban-detail',
	standalone: true,
	imports: [
		NgIcon,
		HlmButtonImports,
		HlmSelectImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmSeparatorImports,
		HlmTabsImports,
		HlmTableImports,
		HlmDatePickerImports,
		HlmDropdownMenuImports,
		HlmEmptyImports,
		HlmDialogImports,
		HlmSwitch,
		HlmLabel,
		CdkDrag,
		CdkDropList,
		HlmScrollAreaImports,
		NgScrollbarModule,
		TaskCardComponent,
		HlmFieldImports,
		TaskModal,
		MilestoneModalComponent,
		ColumnKanbanModalComponent,
		DeleteModalComponent,
		HlmAvatar,
		HlmAvatarGroup,
		HlmBadge,
	],
	providers: [
		TaskModalState,
		KanbanApi,
		TeamApi,
		MilestoneState,
		KanbanRealtime,
		ColumnTaskState,
		ColumnTaskFacade,
		MilestoneModalState,
		provideIcons({
			lucidePlus,
			lucideSearch,
			lucideClock,
			lucidePanelLeft,
			lucideMoreHorizontal,
			lucideCalendarDays,
			lucideRotate3d,
			lucideArrowBigUpDash,
			lucideFlag,
			lucideInfo,
			lucideArrowLeft,
			lucideUser,
			lucideUsers,
			lucideCalendar,
			lucideEdit,
			lucideTrash,
			lucideWrench,
		}),
	],
	templateUrl: './kanban-detail.html',
	styles: `
		.cdk-drop-list-dragging .cdk-drag {
			transition: transform 250ms ease;
		}

		.cdk-drag-animating {
			transition: transform 250ms ease;
		}
		.cdk-drag-preview {
			border-radius: 12px;
			box-shadow:
				0 10px 15px -3px rgb(0 0 0 / 0.3),
				0 4px 6px -4px rgb(0 0 0 / 0.3);
		}

		.cdk-drag-placeholder {
			opacity: 0.25;
		}
	`,
})
export class KanbanDetail implements OnDestroy {
	// Input para el ws
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	// Tabs
	protected readonly activeTab = signal<string>('hitos')
	protected readonly onlyMyTasks = signal(false)

	// Modales
	createColumnKanbanModal = signal<BrnDialogState>('closed')

	// ESTADOS, CONEXIONES Y FACADES
	milestoneState = inject(MilestoneState)
	columnTaskState = inject(ColumnTaskState)
	columnTaskFacade = inject(ColumnTaskFacade)
	realtime = inject(KanbanRealtime)

	// CONEXION BD
	kanbanApi = inject(KanbanApi)
	teamApi = inject(TeamApi)

	// ------------ NOMBRE DEL TABLERO
	readonly kanbanDetailResource = this.kanbanApi.kanbanDetailResource(this.kanbanId)

	readonly kanbanName = computed(() => {
		const resource = this.kanbanDetailResource.value()

		return resource?.data?.name || 'Cargando tablero...'
	})

	// ------------ MILESTONES

	// Modal de crear y editar hitos
	milestoneModalState = inject(MilestoneModalState)
	milestoneModal = this.milestoneModalState.dialogState

	// Modal de eliminar hitos
	deleteMilestoneModalState = signal<'open' | 'closed'>('closed')
	milestoneToDelete = signal<MilestoneSummaryResponse | null>(null)

	onDeleteMilestoneClick(milestone: MilestoneSummaryResponse) {
		this.milestoneToDelete.set(milestone)
		this.deleteMilestoneModalState.set('open')
	}

	confirmDeleteMilestone() {
		const milestone = this.milestoneToDelete()
		if (!milestone) return

		this.kanbanApi.deleteMilestone({
			milestoneId: milestone.id,
		})
		toast.success('Hito eliminado')

		this.closeDeleteMilestoneModal()
	}

	closeDeleteMilestoneModal() {
		this.deleteMilestoneModalState.set('closed')
		this.milestoneToDelete.set(null)
	}

	// Milestone seleccionado
	milestones = this.milestoneState.milestones
	selectedMilestoneId = this.milestoneState.selectedMilestoneId

	milestoneDetailRes = this.kanbanApi.milestoneDetailResource(
		this.milestoneState.selectedMilestoneId,
	)

	// formato de avatar
	readonly getInitials = getAssignmentInitials

	// ------------ COLUMNS y TASKS
	columns = this.columnTaskState.columns
	movableColumns = this.columnTaskState.movableColumns
	completedColumn = this.columnTaskState.completedColumn
	connectedLists = this.columnTaskState.connectedLists

	protected dropTask(event: CdkDragDrop<TaskDetailResponse[]>) {
		this.columnTaskFacade.dropTask(event, {
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	protected dropColumn(event: CdkDragDrop<ColumnKanbanDetailResponse[]>) {
		this.columnTaskFacade.dropColumn(event, {
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	protected changeTab(tabName: string): void {
		this.activeTab.set(tabName)
		if (tabName !== 'hitos') {
			this.selectedMilestoneId.set(null)
		}
	}

	teamDetailResource = this.teamApi.teamDetailResource(this.teamId)

	workspaceMembers = computed(() => {
		if (!this.teamDetailResource.hasValue()) return []
		return this.teamDetailResource.value()!.data.members || []
	})
	kanbanResource = this.kanbanApi.kanbanDetailResource(this.kanbanId)

	// --- MODAL DE LA TAREA
	taskModalState = inject(TaskModalState)
	taskModal = this.taskModalState.dialogState

	// Método para abrir el modal con la información cargada
	openCreateTask(column: ColumnKanbanDetailResponse) {
		this.columnTaskFacade.createTask(column, {
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	openCreateTaskFromMilestone() {
		const milestone = this.milestoneState.milestoneDetail()

		if (!milestone) return

		this.columnTaskFacade.createTaskFromMilestone(milestone, {
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	protected openEditTask(task: TaskDetailResponse): void {
		this.taskModalState.openForEdit(task)
	}

	// MODAL DE ELIMINACIÓN TAREAS
	deleteTaskModalState = signal<'open' | 'closed'>('closed')
	taskToDelete = signal<TaskDetailResponse | null>(null)

	onDeleteTaskClick(task: TaskDetailResponse) {
		this.taskToDelete.set(task)
		this.deleteTaskModalState.set('open')
	}

	confirmDeleteTask() {
		const task = this.taskToDelete()
		if (!task) return

		this.kanbanApi.deleteTask({
			id: task.id,
			kanbanId: this.kanbanId(),
			projectId: this.projectId(),
			teamId: this.teamId(),
		})
		toast.success('Tarea eliminada')

		this.closeDeleteTaskModal()
	}

	closeDeleteTaskModal() {
		this.deleteTaskModalState.set('closed')
		this.taskToDelete.set(null)
	}

	constructor() {
		effect(() => {
			if (!this.kanbanResource.hasValue()) return

			const data = this.kanbanResource.value()!.data

			this.milestoneState.setMilestones(data.milestones)
			this.columnTaskState.setColumns(data.columns)
		})

		effect(() => {
			if (!this.milestoneDetailRes.hasValue()) return

			this.milestoneState.setDetail(this.milestoneDetailRes.value()!.data)
		})

		effect(() => {
			if (!this.teamId() || !this.projectId() || !this.kanbanId()) {
				return
			}

			this.realtime.connect(this.teamId(), this.projectId(), this.kanbanId())
		})
	}

	ngOnDestroy() {
		this.realtime.disconnect()
	}
}
