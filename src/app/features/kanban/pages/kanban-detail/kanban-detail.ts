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
import { TaskCardComponent } from '@/shared/components/task-card/task-card'
import { TaskModal } from '../../components/task-modal/task-modal'
import { TaskModalState } from '../../service/column-task/task-modal-state'
import { KanbanApi } from '../../service/kanban-api'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { ColumnKanbanModalComponent } from '../../components/column-kanban-modal/column-kanban-modal'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { TeamApi } from '@/features/home/services/team-api'
import { KanbanRealtime } from '../../service/kanban-realtime'
import { ColumnTaskState } from '../../service/column-task/column-task-state'
import { ColumnTaskFacade } from '../../service/column-task/column-task-facade'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { toast } from '@spartan-ng/brain/sonner'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'
import { HlmAvatar, HlmAvatarGroup, HlmAvatarGroupCount } from '@spartan-ng/helm/avatar'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { getAssignmentInitials } from '../../utils/string.utils'
import { ColumnModalState } from '../../service/column-task/column-modal-state'
import { TaskFilterService } from '../../service/column-task/task-filter-service'
import { DeleteDialogState } from '@/shared/components/delete/DeleteDialogState'
import { ChecklistState } from '../../features/checklist/checklist.state'
import { KanbanDetailResponse } from '../../models/kanban-detail-response.model'
import { ChecklistItemState } from '../../features/checklist-item/checklist-item.state'
import { MilestoneModalComponent } from '../../features/milestone/milestone-modal/milestone-modal'
import { MilestoneFacade } from '../../features/milestone/milestone.facade'
import { MilestoneRealtime } from '../../features/milestone/milestone.realtime'
import { MilestoneApi } from '../../features/milestone/milestone.api'
import { MilestoneState } from '../../features/milestone/milestone.state'
import { MilestoneModalState } from '../../features/milestone/milestone-modal/milestone-modal-state'
import { ChecklistItemFacade } from '../../features/checklist-item/checklist-item.facade'
import { ChecklistItemApi } from '../../features/checklist-item/checklist-item.api'
import { ChecklistItemModalState } from '../../features/checklist-item/checklist-item-modal/checklist-item-modal.state'
import { ChecklistItemRealtime } from '../../features/checklist-item/checklist-item.realtime'
import { ChecklistApi } from '../../features/checklist/checklist.api'
import { ChecklistFacade } from '../../features/checklist/checklist.facade'
import { ChecklistModalState } from '../../features/checklist/checklist-modal/checklist-modal.state'
import { ChecklistRealtime } from '../../features/checklist/checklist.realtime'

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
		HlmAvatarGroupCount,
	],
	providers: [
		MilestoneApi,
		MilestoneState,
		MilestoneFacade,
		MilestoneModalState,
		MilestoneRealtime,

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

		TaskModalState,
		KanbanApi,
		TeamApi,
		KanbanRealtime,
		ColumnTaskState,
		ColumnTaskFacade,
		ColumnModalState,
		TaskFilterService,
		ChecklistState,
		ChecklistItemState,
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
	// Inputs obligatorios
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	// Inyecciones de control y estado
	readonly filterService = inject(TaskFilterService)
	readonly columnTaskState = inject(ColumnTaskState)
	readonly columnTaskFacade = inject(ColumnTaskFacade)
	readonly kanbanApi = inject(KanbanApi)
	readonly teamApi = inject(TeamApi)
	readonly realtime = inject(KanbanRealtime)

	// FACHADAS ORQUESTADORAS
	readonly milestoneFacade = inject(MilestoneFacade)
	private readonly milestoneRealtime = inject(MilestoneRealtime)

	readonly checklistItemFacade = inject(ChecklistItemFacade)
	private readonly checklistItemRealtime = inject(ChecklistItemRealtime)

	readonly checklistFacade = inject(ChecklistFacade)
	private readonly checklistRealtime = inject(ChecklistRealtime)

	// Tabs de navegación
	protected readonly activeTab = signal<string>('hitos')

	protected changeTab(tabName: string): void {
		this.activeTab.set(tabName)
		if (tabName !== 'hitos') {
			this.selectedMilestoneId.set(null)
		}
	}

	protected readonly getInitials = getAssignmentInitials

	// MILESTONES (Bindeados directamente desde el Facade)
	readonly milestones = this.milestoneFacade.milestones
	readonly selectedMilestoneId = this.milestoneFacade.selectedMilestoneId
	readonly milestoneDetail = this.milestoneFacade.milestoneDetail

	// Modales de creacion / edicion
	protected readonly taskModalState = inject(TaskModalState)
	taskModal = this.taskModalState.dialogState

	protected readonly columnModalState = inject(ColumnModalState)
	columnModal = this.columnModalState.dialogState

	// Modales de eliminación
	protected readonly milestoneDeleteCtrl = new DeleteDialogState<MilestoneSummaryResponse>()
	protected readonly columnDeleteCtrl = new DeleteDialogState<ColumnKanbanDetailResponse>()
	protected readonly taskDeleteCtrl = new DeleteDialogState<TaskDetailResponse>()

	// Recursos Api y computados
	private readonly kanbanDetailResource = this.kanbanApi.kanbanDetailResource(this.kanbanId)
	private readonly teamDetailResource = this.teamApi.teamDetailResource(this.teamId)

	protected readonly milestoneDetailRes = this.milestoneFacade.milestoneDetailResource

	readonly kanbanName = computed(() => {
		const resource = this.kanbanDetailResource.value()
		return resource?.data?.name || 'Cargando tablero...'
	})

	workspaceMembers = computed(() => {
		if (!this.teamDetailResource.hasValue()) return []
		return this.teamDetailResource.value()!.data.members || []
	})

	kanbanResource = this.kanbanApi.kanbanDetailResource(this.kanbanId)

	// Buscador de hitos
	readonly milestoneSearch = signal('')

	readonly filteredMilestones = computed(() => {
		const search = this.milestoneSearch().trim().toLowerCase()
		if (!search) return this.milestones()
		return this.milestones().filter((milestone) => milestone.title.toLowerCase().includes(search))
	})

	columns = this.columnTaskState.columns
	connectedLists = this.columnTaskState.connectedLists

	readonly displayColumns = computed(() => {
		const columns = this.columnTaskState.columns()
		const fixed = columns.find((c) => c.fixed)
		const movable = columns.filter((c) => !c.fixed)
		return fixed ? [...movable, fixed] : [...movable]
	})

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

	openCreateTask(column: ColumnKanbanDetailResponse) {
		this.columnTaskFacade.createTask(column, {
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	protected openCreateTaskFromMilestone() {
		const milestone = this.milestoneFacade.milestoneDetail()
		if (!milestone) return

		const firstColumn = this.displayColumns().find((c) => !c.fixed)
		if (!firstColumn) return

		this.kanbanApi.createTask({
			title: 'Nueva tarea',
			description: '',
			priority: 'BAJA',
			groupTask: false,
			deadline: milestone.deadline,
			milestoneId: milestone.id,
			columnId: firstColumn.id,
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	protected openEditTask(task: TaskDetailResponse): void {
		this.taskModalState.openForEdit(task)
	}

	protected confirmDeleteMilestone() {
		const m = this.milestoneDeleteCtrl.item()
		if (m) {
			this.milestoneFacade.delete(m.id)
			this.milestoneDeleteCtrl.close()
		}
	}

	protected confirmDeleteColumn() {
		const c = this.columnDeleteCtrl.item()
		if (c) {
			this.kanbanApi.deleteColumn({ columnId: c.id })
			toast.success('Columna eliminada')
			this.columnDeleteCtrl.close()
		}
	}

	protected confirmDeleteTask() {
		const t = this.taskDeleteCtrl.item()
		if (t) {
			this.kanbanApi.deleteTask({
				id: t.id,
				kanbanId: this.kanbanId(),
				projectId: this.projectId(),
				teamId: this.teamId(),
			})
			toast.success('Tarea eliminada')
			this.taskDeleteCtrl.close()
		}
	}

	normalizeKanban(data: KanbanDetailResponse) {
		const checklistItems = data.columns.flatMap((column) =>
			column.tasks.flatMap((task) => task.checklists.flatMap((checklist) => checklist.items)),
		)

		const checklists = data.columns.flatMap((column) =>
			column.tasks.flatMap((task) =>
				task.checklists.map((checklist) => ({
					...checklist,
					items: [],
				})),
			),
		)

		const columns = data.columns.map((column) => ({
			...column,
			tasks: column.tasks.map((task) => ({
				...task,
				checklists: [],
			})),
		}))

		this.columnTaskState.setColumns(columns)
		this.checklistFacade.setChecklists(checklists)
		this.checklistItemFacade.setItems(checklistItems)
		this.milestoneFacade.setMilestones(data.milestones)
	}

	constructor() {
		effect(() => {
			if (!this.kanbanResource.hasValue()) return
			this.normalizeKanban(this.kanbanResource.value()!.data)
		})

		effect(() => {
			if (!this.teamId() || !this.projectId() || !this.kanbanId()) return
			this.realtime.connect(this.teamId(), this.projectId(), this.kanbanId())
			this.milestoneRealtime.connect(this.teamId(), this.projectId(), this.kanbanId())
			this.checklistRealtime.connect(this.teamId(), this.projectId(), this.kanbanId())
			this.checklistItemRealtime.connect(this.teamId(), this.projectId(), this.kanbanId())
		})
	}

	ngOnDestroy() {
		this.realtime.disconnect()
		this.milestoneRealtime.disconnect()
		this.checklistRealtime.disconnect()
		this.checklistItemRealtime.disconnect()
	}
}
