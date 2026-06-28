import { Component, computed, inject, signal } from '@angular/core'
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
import { KanbanColumn, Milestone, Task } from '../../models'
import { MilestoneModalComponent } from '../../components/milestone-modal/milestone-modal'

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
	],
	providers: [
		CreateTaskModalState,
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
export class KanbanDetail {
	// Tabs
	protected readonly activeTab = signal<string>('hitos')

	// Hito seleccionado
	protected readonly selectedMilestone = signal<Milestone | null>(null)

	// Modales
	createMilestoneModal = signal<BrnDialogState>('closed')

	createTaskModalState = inject(CreateTaskModalState)
	createTaskModal = computed(() => this.createTaskModalState.createTaskModal())

	protected changeTab(tabName: string): void {
		this.activeTab.set(tabName)

		if (tabName !== 'hitos') {
			this.selectedMilestone.set(null)
		}
	}

	protected viewMilestoneDetail(milestone: Milestone): void {
		this.selectedMilestone.set(milestone)
	}

	protected closeDetail(): void {
		this.selectedMilestone.set(null)
	}

	protected readonly onlyMyTasks = signal(false)

	protected dropColumn(event: CdkDragDrop<KanbanColumn[]>) {
		const movable = [...this.movableColumns()]

		moveItemInArray(movable, event.previousIndex, event.currentIndex)

		const completed = this.completedColumn()

		this.columns.set([...movable, completed])
	}

	protected readonly movableColumns = computed(() =>
		this.columns().filter((column) => !column.isFixed),
	)

	protected readonly completedColumn = computed(
		() => this.columns().find((column) => column.isFixed)!,
	)

	protected readonly connectedLists = computed(() => this.columns().map((column) => column.id))

	protected dropTask(event: CdkDragDrop<Task[]>) {
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
	}

	protected readonly milestones: Milestone[] = [
		{
			id: 1,
			name: 'Hito 1',
			deadline: 'Jun 1, 2026',
			progress: 100,
			totalTasks: 2,
			completedTasks: 2,
			status: 'Completado',
			tasks: [
				{
					id: 101,
					name: 'Tarea 1',
					assignedTo: 'user',
					dueDate: '22 Jun 2026',
					priority: 'Alta',
					status: 'Completado',
				},
				{
					id: 102,
					name: 'Tarea 2',
					assignedTo: 'user',
					dueDate: '22 Jun 2026',
					priority: 'Baja',
					status: 'Completado',
				},
			],
		},
	]

	protected readonly columns = signal<KanbanColumn[]>([
		{
			id: 'pending',
			name: 'Pendiente',
			tasks: [
				{
					id: 1,
					name: 'Diseñar login',
					assignedTo: 'Alex',
					dueDate: '22 Jun 2026',
					priority: 'Alta',
					status: 'Pendiente',
				},
			],
		},
		{
			id: 'progress',
			name: 'En curso',
			tasks: [
				{
					id: 2,
					name: 'Implementar JWT',
					assignedTo: 'Alex',
					dueDate: '22 Jun 2026',
					priority: 'Media',
					status: 'En curso',
				},
			],
		},
		{
			id: 'completed',
			name: 'Completado',
			isFixed: true,
			tasks: [
				{
					id: 3,
					name: 'Crear base de datos',
					assignedTo: 'Alex',
					dueDate: '22 Jun 2026',
					priority: 'Alta',
					status: 'Completado',
				},
			],
		},
	])
}
