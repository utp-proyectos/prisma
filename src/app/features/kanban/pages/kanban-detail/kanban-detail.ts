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

import {
	CdkDrag,
	CdkDropList,
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop'
import { TaskCardComponent } from '@/shared/components/sidebar/components/task-card/task-card'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { TaskModal } from '../../components/task-modal/task-modal'
import { CreateTaskModalState } from '../../service/create-task-modal-state'
import { MilestoneModalComponent } from '../../components/milestone-modal/milestone-modal'
import { KanbanApi } from '../../service/kanban-api'
import { MilestoneDetailResponse } from '../../models/milestone/milestone-detail-response.model'
import { Subscription } from 'rxjs'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { ColumnKanbanModalComponent } from '../../components/column-kanban-modal/column-kanban-modal'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { TeamApi } from '@/features/home/services/team-api'

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
	],
	providers: [
		CreateTaskModalState,
		KanbanApi,
		TeamApi,
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
			lucideUsers,
			lucideCalendar,
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
	createMilestoneModal = signal<BrnDialogState>('closed')
	createColumnKanbanModal = signal<BrnDialogState>('closed')

	// conexion bd
	kanbanApi = inject(KanbanApi)
	teamApi = inject(TeamApi)
	milestones = signal<MilestoneSummaryResponse[]>([])
	columns = signal<ColumnKanbanDetailResponse[]>([])

	protected readonly selectedMilestoneId = signal<string | null>(null)

	protected readonly milestoneDetailRes = this.kanbanApi.milestoneDetailResource(
		this.selectedMilestoneId,
	)

	protected readonly selectedMilestone = computed(() => {
		if (!this.milestoneDetailRes.hasValue()) return null

		return this.milestoneDetailRes.value()?.data ?? null
	})

	protected changeTab(tabName: string): void {
		this.activeTab.set(tabName)
		if (tabName !== 'hitos') {
			this.selectedMilestoneId.set(null)
		}
	}

	protected viewMilestoneDetail(milestone: MilestoneSummaryResponse): void {
		this.selectedMilestoneId.set(milestone.id)
	}

	protected closeDetail(): void {
		this.selectedMilestoneId.set(null)
	}

	protected dropColumn(event: CdkDragDrop<ColumnKanbanDetailResponse[]>) {
		const movable = [...this.movableColumns()]
		moveItemInArray(movable, event.previousIndex, event.currentIndex)

		const completed = this.completedColumn()
		this.columns.set([...movable, completed])

		const reorderedColumns = movable.map((col, index) => ({
			id: col.id,
			position: index,
		}))

		this.kanbanApi.reorderColumns({
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
			columns: reorderedColumns,
		})
	}

	protected readonly movableColumns = computed(() =>
		this.columns().filter((column) => !column.fixed),
	)

	protected readonly completedColumn = computed(
		() => this.columns().find((column) => column.fixed)!,
	)

	protected readonly connectedLists = computed(() => this.columns().map((column) => column.id))

	protected dropTask(event: CdkDragDrop<TaskDetailResponse[]>) {
		const targetColumnId = event.container.id

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			)
		}

		const targetTasks = event.container.data.map((task, index) => ({
			id: task.id,
			position: index,
		}))

		this.kanbanApi.reorderTasks({
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
			taskId: event.item.data.id,
			targetColumnId: targetColumnId,
			targetTasks: targetTasks,
		})
	}

	// Renderizar hitos, columnas y tareas
	private milestoneSub?: Subscription
	private columnSub?: Subscription
	private taskSub?: Subscription
	private columnReorderSub?: Subscription
	private taskReorderSub?: Subscription

	teamDetailResource = this.teamApi.teamDetailResource(this.teamId)

	workspaceMembers = computed(() => {
		if (!this.teamDetailResource.hasValue()) return []
		return this.teamDetailResource.value()!.data.members || []
	})
	kanbanResource = this.kanbanApi.kanbanDetailResource(this.kanbanId)

	openCreateTask(column: ColumnKanbanDetailResponse) {
		this.kanbanApi.createTask({
			title: 'Nueva tarea',
			description: '',
			deadline: '',
			priority: 'BAJA',
			groupTask: false,
			milestoneId: '',
			columnId: column.id,
			teamId: this.teamId(),
			projectId: this.projectId(),
			kanbanId: this.kanbanId(),
		})
	}

	// Señal para guardar la tarea que se va a editar
	protected readonly selectedTask = signal<TaskDetailResponse | null>(null)

	// Estado del modal de la tarea
	createTaskModalState = inject(CreateTaskModalState)
	protected readonly createTaskModal = computed(() => this.createTaskModalState.createTaskModal())

	// Método para abrir el modal con la información cargada
	protected openEditTask(task: TaskDetailResponse): void {
		this.selectedTask.set(task)
		this.createTaskModalState.open()
	}

	constructor() {
		effect(() => {
			if (!this.kanbanResource.hasValue()) return

			const data = this.kanbanResource.value()!.data

			this.milestones.set(data.milestones)
			this.columns.set(data.columns)
		})

		effect(() => {
			if (!this.kanbanId() || !this.projectId() || !this.teamId()) return

			this.milestoneSub?.unsubscribe()

			this.milestoneSub = this.kanbanApi
				.getMilestones(this.teamId(), this.projectId(), this.kanbanId())
				.subscribe((event) => {
					switch (event.action) {
						case 'CREATE':
							this.milestones.update((list) => [event.payload, ...list])
							break
					}
				})
		})

		effect(() => {
			if (!this.kanbanId() || !this.projectId() || !this.teamId()) return

			this.columnSub?.unsubscribe()

			this.columnSub = this.kanbanApi
				.getColumnsKanban(this.teamId(), this.projectId(), this.kanbanId())
				.subscribe((event) => {
					switch (event.action) {
						case 'CREATE':
							this.columns.update((list) => [...list, event.payload])
							break
					}
				})
		})

		effect(() => {
			if (!this.kanbanId() || !this.projectId() || !this.teamId()) return

			this.taskSub?.unsubscribe()

			this.taskSub = this.kanbanApi
				.getTasks(this.teamId(), this.projectId(), this.kanbanId())
				.subscribe((event) => {
					switch (event.action) {
						case 'CREATE':
							this.columns.update((columns) =>
								columns.map((column) =>
									column.id === event.payload.columnId
										? {
												...column,
												tasks: [...column.tasks, event.payload],
											}
										: column,
								),
							)
							break

						case 'UPDATE':
							this.columns.update((columns) => {
								const previousColumn = columns.find((column) =>
									column.tasks.some((task) => task.id === event.payload.id),
								)

								if (previousColumn?.id === event.payload.columnId) {
									return columns.map((column) => {
										if (column.id !== event.payload.columnId) return column

										return {
											...column,
											tasks: column.tasks.map((task) =>
												task.id === event.payload.id ? event.payload : task,
											),
										}
									})
								}

								return columns.map((column) => {
									const tasksWithout = column.tasks.filter((task) => task.id !== event.payload.id)

									if (column.id === event.payload.columnId) {
										return {
											...column,
											tasks: [...tasksWithout, event.payload],
										}
									}

									return {
										...column,
										tasks: tasksWithout,
									}
								})
							})

							if (this.selectedMilestoneId()) {
								this.milestoneDetailRes.reload()
							}

							this.kanbanResource.reload()

							break
					}
				})
		})

		effect(() => {
			if (!this.kanbanId() || !this.projectId() || !this.teamId()) return

			this.columnReorderSub?.unsubscribe()

			this.columnReorderSub = this.kanbanApi
				.getColumnsReorder(this.teamId(), this.projectId(), this.kanbanId())
				.subscribe((event) => {
					if (event.action === 'REORDER') {
						this.columns.set(event.payload)
					}
				})
		})

		effect(() => {
			if (!this.kanbanId() || !this.projectId() || !this.teamId()) return

			this.taskReorderSub?.unsubscribe()

			this.taskReorderSub = this.kanbanApi
				.getTasksReorder(this.teamId(), this.projectId(), this.kanbanId())
				.subscribe((event) => {
					if (event.action === 'REORDER') {
						this.columns.set(event.payload)
					}
				})
		})
	}

	ngOnDestroy() {
		this.milestoneSub?.unsubscribe()
		this.columnSub?.unsubscribe()
		this.taskSub?.unsubscribe()
		this.columnReorderSub?.unsubscribe()
		this.taskReorderSub?.unsubscribe()
	}
}
