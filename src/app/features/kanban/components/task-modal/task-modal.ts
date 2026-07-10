import { Component, computed, effect, inject, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCalendar, lucideCalendarX, lucideFlag, lucidePlus } from '@ng-icons/lucide'

import { input, output } from '@angular/core'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmLabel } from '@spartan-ng/helm/label'
import { HlmRadioGroup, HlmRadio } from '@spartan-ng/helm/radio-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmSwitch } from '@spartan-ng/helm/switch'
import { hlm } from '@spartan-ng/helm/utils'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { KanbanApi } from '../../service/kanban-api'
import { TaskDetailResponse } from '../../models/task/task-detail-response.model'
import { ColumnKanbanDetailResponse } from '../../models/column-kanban/column-kanban-detail-response.model'
import { MilestoneSummaryResponse } from '../../models/milestone/milestone-summary-response.model'
import { TeamMemberResponse } from '@/features/home/models/team-member-response'
import { UpdateTaskRequest } from '../../models/task/task-request.model'
import { TaskModalState } from '../../service/task/task-modal-state'

type DateType = 'none' | 'manual' | 'milestone'

@Component({
	selector: 'app-task-modal',
	standalone: true,
	imports: [
		NgIcon,
		HlmDialogImports,
		HlmButtonImports,
		HlmFieldImports,
		HlmSeparatorImports,
		HlmSelectImports,
		HlmLabel,
		HlmSwitch,
		HlmInputImports,
		HlmInputGroupImports,
		HlmDropdownMenuImports,
		HlmRadioGroup,
		HlmDatePickerImports,
		HlmRadio,
	],
	providers: [
		KanbanApi,
		provideIcons({
			lucidePlus,
			lucideCalendarX,
			lucideCalendar,
			lucideFlag,
		}),
	],
	templateUrl: './task-modal.html',
})
export class TaskModal {
	//Informacion del padre
	readonly columns = input.required<ColumnKanbanDetailResponse[]>()
	readonly milestones = input.required<MilestoneSummaryResponse[]>()
	readonly workspaceMembers = input.required<TeamMemberResponse[]>()
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	// Conexion bd
	kanbanApi = inject(KanbanApi)
	taskModalState = inject(TaskModalState)
	readonly task = this.taskModalState.task

	// Señal para guardar la tarea que se va a editar
	readonly title = signal('')
	readonly description = signal('')
	readonly isGroupTask = signal(false)
	readonly isCompleted = signal(false)
	readonly dateType = signal<DateType>('none')
	readonly assignedMembers = signal<TeamMemberResponse[]>([])
	readonly priority = signal<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA')
	readonly selectedColumnId = signal('')
	readonly selectedMilestoneId = signal<string | null>(null)
	readonly deadline = signal<string | null>(null)
	readonly editingField = signal<string | null>(null)

	private updateTask(changes: Partial<UpdateTaskRequest>) {
		const task = this.task()

		if (!task) return

		const assignedUserIds = this.assignedMembers().map((m) => m.id)

		this.kanbanApi.updateTask({
			id: task.id,

			title: this.title(),

			description: this.description(),

			priority: this.priority(),

			deadline: this.deadline(),

			milestoneId: this.selectedMilestoneId(),

			groupTask: this.isGroupTask(),

			completed: this.isCompleted(),

			columnId: this.selectedColumnId(),

			kanbanId: this.kanbanId(),

			projectId: this.projectId(),

			teamId: this.teamId(),

			assignedUserIds,

			...changes,
		})
	}

	startEditing(field: string) {
		this.editingField.set(field)
	}

	stopEditing() {
		this.editingField.set(null)
	}

	saveTitle(value: string) {
		const title = value.trim()

		this.title.set(title)

		this.updateTask({
			title,
		})

		this.stopEditing()
	}

	saveDescription(value: string) {
		this.description.set(value)

		this.updateTask({
			description: value,
		})

		this.stopEditing()
	}

	changeGroupTask(isGroup: boolean) {
		this.isGroupTask.set(isGroup)

		let membersPayload = this.assignedMembers()
		if (!isGroup && membersPayload.length > 1) {
			membersPayload = [membersPayload[0]]
			this.assignedMembers.set(membersPayload)
		}

		this.updateTask({
			groupTask: isGroup,
		})
	}

	changePriority(priority: 'BAJA' | 'MEDIA' | 'ALTA' | null | undefined) {
		if (!priority) return

		this.priority.set(priority)

		this.updateTask({
			priority,
		})
	}

	changeColumn(columnId: string | null | undefined) {
		console.log('changeColumn', columnId)
		if (!columnId) return

		this.selectedColumnId.set(columnId)

		const targetColumn = this.columns().find((c) => c.id === columnId)
		const isCompletedColumn = targetColumn?.ColumnType === 'COMPLETED'

		this.updateTask({
			columnId,
			completed: isCompletedColumn,
		})
	}

	//----------- Logica de los miembros
	readonly memberSearch = signal('')

	// Miembros filtrados
	readonly filteredMembers = computed(() => {
		const search = this.memberSearch().toLowerCase()
		return this.workspaceMembers().filter(
			(member) =>
				member.name.toLowerCase().includes(search) ||
				member.lastName.toLowerCase().includes(search),
		)
	})

	// Asignar miembro
	assignMember(member: TeamMemberResponse) {
		let updatedList: TeamMemberResponse[] = []

		if (this.isGroupTask()) {
			if (this.assignedMembers().some((m) => m.id === member.id)) return
			updatedList = [...this.assignedMembers(), member]
		} else {
			updatedList = [member]
		}

		this.assignedMembers.set(updatedList)

		this.updateTask({
			assignedUserIds: updatedList.map((m) => m.id),
		})
	}

	// Quitar miembro
	removeMember(member: TeamMemberResponse) {
		const updatedList = this.assignedMembers().filter((m) => m.id !== member.id)
		this.assignedMembers.set(updatedList)

		this.updateTask({
			assignedUserIds: updatedList.map((m) => m.id),
		})
	}

	readonly visibleMembers = computed(() => this.assignedMembers().slice(0, 3))
	readonly hiddenMembers = computed(() => this.assignedMembers().slice(3))

	//----------- Logica para la fecha
	changeDateType(type: 'none' | 'manual' | 'milestone') {
		this.dateType.set(type)

		if (type === 'none') {
			this.deadline.set(null)
			this.selectedMilestoneId.set(null)

			this.updateTask({
				deadline: null,
				milestoneId: null,
			})
		}
	}

	changeMilestone(milestoneId: string | null | undefined) {
		if (!milestoneId) {
			this.selectedMilestoneId.set(null)
			this.updateTask({
				milestoneId: null,
			})
			return
		}

		this.selectedMilestoneId.set(milestoneId)

		const milestone = this.milestones().find((m) => m.id === milestoneId)
		if (milestone) {
			this.deadline.set(milestone.deadline || null)
		}

		this.updateTask({
			milestoneId,
			deadline: null,
		})
	}

	changeManualDeadline(date: Date | string | null) {
		let formattedDate: string | null = null

		if (date) {
			const d = new Date(date)
			formattedDate = d.toISOString().split('T')[0]
		}

		this.deadline.set(formattedDate)
		this.selectedMilestoneId.set(null)

		this.updateTask({
			deadline: formattedDate,
			milestoneId: null,
		})
	}

	getInitials(member: TeamMemberResponse | null | undefined): string {
		if (!member) return '??'

		const firstNameChar = member.name && member.name.charAt(0) ? member.name.charAt(0) : ''
		const lastNameChar =
			member.lastName && member.lastName.charAt(0) ? member.lastName.charAt(0) : ''

		const initials = `${firstNameChar}${lastNameChar}`.trim().toUpperCase()

		if (!initials) {
			if (member.username && member.username.charAt(0))
				return member.username.charAt(0).toUpperCase()
			if (member.email && member.email.charAt(0)) return member.email.charAt(0).toUpperCase()
			return '??'
		}

		return initials
	}
	//--------- Selects de tableros y estados
	protected readonly priorities = [
		{ label: 'Baja', value: 'BAJA' },
		{ label: 'Media', value: 'MEDIA' },
		{ label: 'Alta', value: 'ALTA' },
	]

	// Funciones formateadoras requeridas por el componente hlm-select de Spartan
	protected selectToString(value: string, items: { label: string; value: string }[]): string {
		return items.find((item) => item.value === value)?.label || ''
	}
	protected readonly columnToString = (id: string) =>
		this.columns().find((c) => c.id === id)?.title ?? ''

	protected readonly milestoneToString = (id: string) =>
		this.milestones().find((m) => m.id === id)?.title ?? ''

	protected readonly priorityToString = (v: string) => this.selectToString(v, this.priorities)

	//--------- Logica para la fecha

	// Para el diseño de cartas
	readonly radioCardClass = hlm(
		'relative flex flex-col items-center justify-center rounded-lg border p-4 text-center',
		'border-border bg-card hover:bg-accent/10 cursor-pointer transition-colors',
		'has-data-[checked=true]:border-primary',
		`has-data-[checked=true]:bg-primary/3`,
	)

	constructor() {
		effect(() => {
			const task = this.task()

			if (!task) return

			this.title.set(task.title)
			this.description.set(task.description ?? '')
			this.priority.set(task.priority)
			this.selectedColumnId.set(task.columnId)
			this.selectedMilestoneId.set(task.milestoneId)
			this.deadline.set(task.deadline)
			this.isGroupTask.set(task.groupTask)

			if (task.milestoneId) {
				this.dateType.set('milestone')
			} else if (task.deadline) {
				this.dateType.set('manual')
			} else {
				this.dateType.set('none')
			}

			if (task.assignments && task.assignments.length > 0) {
				const assignedIds = task.assignments.map((a) => a.userId)

				const initialMembers = this.workspaceMembers().filter((member) =>
					assignedIds.includes(member.id),
				)
				this.assignedMembers.set(initialMembers)
			} else {
				this.assignedMembers.set([])
			}
		})

		effect(() => {
			if (!this.isGroupTask() && this.assignedMembers().length > 1) {
				const firstMember = [this.assignedMembers()[0]]
				this.assignedMembers.set(firstMember)

				this.updateTask({
					assignedUserIds: firstMember.map((m) => m.id),
				})
			}
		})
	}
}
