import { Component, computed, signal } from '@angular/core'
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
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmTabsImports } from '@spartan-ng/helm/tabs'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { HlmEmptyImports } from '@spartan-ng/helm/empty'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmSwitch } from '@spartan-ng/helm/switch'
import { HlmLabel } from '@spartan-ng/helm/label'

import {
	CdkDrag,
	CdkDropList,
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop'

export interface Task {
	id: number
	name: string
	assignedTo: string
	dueDate: string

	priority: 'Alta' | 'Media' | 'Baja'

	status: 'Completado' | 'En curso' | 'Pendiente'
}

export interface Milestone {
	id: number
	name: string
	deadline: string
	progress: number
	totalTasks: number
	completedTasks: number
	status: 'Completado' | 'A tiempo' | 'Retrasado'
	tasks?: Task[]
}

export interface KanbanColumn {
	id: string
	name: string
	isFixed?: boolean
	tasks: Task[]
}

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
		HlmCardImports,
		HlmTabsImports,
		HlmTableImports,
		HlmDropdownMenuImports,
		HlmEmptyImports,
		HlmSwitch,
		HlmLabel,
		CdkDrag,
		CdkDropList,
	],
	providers: [
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
	styles: ``,
})
export class KanbanDetail {
	protected readonly activeTab = signal<string>('hitos')

	protected readonly selectedMilestone = signal<Milestone | null>(null)

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
		{
			id: 2,
			name: 'Hito 2',
			deadline: 'Jul 23, 2026',
			progress: 50,
			totalTasks: 4,
			completedTasks: 2,
			status: 'A tiempo',
			tasks: [
				{
					id: 201,
					name: 'Configurar base de datos',
					assignedTo: 'user',
					dueDate: '22 Jun 2026',
					priority: 'Alta',
					status: 'Completado',
				},
				{
					id: 202,
					name: 'Crear endpoints de Auth',
					assignedTo: 'user',
					dueDate: '22 Jun 2026',
					priority: 'Media',
					status: 'En curso',
				},
			],
		},
		{
			id: 3,
			name: 'Hito 3',
			deadline: 'May 22, 2026',
			progress: 50,
			totalTasks: 4,
			completedTasks: 2,
			status: 'Retrasado',
			tasks: [],
		},
	]

	protected readonly columns = signal<KanbanColumn[]>([
		{
			id: 'prueba',
			name: 'Prueba',
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
