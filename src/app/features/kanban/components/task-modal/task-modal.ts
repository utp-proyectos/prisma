import { Component, computed, effect, signal } from '@angular/core'
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
import { Member } from '../../models'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'

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
	// Modal
	readonly state = input.required<BrnDialogState | null>()
	readonly closed = output<void>()

	// Para editar los campos
	readonly title = signal('Tarea 1')

	readonly description = signal(`
		Subtareas:
		Creado desde GitHub...
	`)

	readonly editingField = signal<string | null>(null)

	startEditing(field: string) {
		this.editingField.set(field)
	}

	stopEditing() {
		this.editingField.set(null)
	}

	saveTitle(value: string) {
		this.title.set(value.trim())
		this.stopEditing()

		// TODO: backend
	}

	saveDescription(value: string) {
		this.description.set(value)
		this.stopEditing()

		// TODO: backend
	}

	//----------- Logica de los miembros
	constructor() {
		effect(() => {
			if (!this.isGroupTask() && this.assignedMembers().length > 1) {
				this.assignedMembers.set([this.assignedMembers()[0]])
			}
		})
	}

	readonly isGroupTask = signal(false)
	readonly memberSearch = signal('')

	readonly workspaceMembers = signal<Member[]>([
		{ id: 1, name: 'Alex Valera', initials: 'AV' },
		{ id: 2, name: 'Juan Pérez', initials: 'JP' },
		{ id: 3, name: 'María López', initials: 'ML' },
		{ id: 4, name: 'Carlos Ruiz', initials: 'CR' },
		{ id: 5, name: 'Ana Torres', initials: 'AT' },
	])

	readonly assignedMembers = signal<Member[]>([])

	// Miembros filtrados
	readonly filteredMembers = computed(() => {
		const search = this.memberSearch().toLowerCase()

		return this.workspaceMembers().filter((member) => member.name.toLowerCase().includes(search))
	})

	// Asignar miembro
	assignMember(member: Member) {
		if (this.isGroupTask()) {
			if (this.assignedMembers().some((m) => m.id === member.id)) {
				return
			}

			this.assignedMembers.update((list) => [...list, member])
			return
		}

		this.assignedMembers.set([member])
	}

	// Quitar miembro
	removeMember(member: Member) {
		this.assignedMembers.update((list) => list.filter((m) => m.id !== member.id))
	}

	// Ver los tres primeros miembros
	readonly visibleMembers = computed(() => this.assignedMembers().slice(0, 3))
	readonly hiddenMembers = computed(() => this.assignedMembers().slice(3))

	//--------- Selects de tableros y estados
	protected readonly tableros = [
		{ label: 'Tablero 1', value: '1' },
		{ label: 'Tablero 2', value: '2' },
		{ label: 'Tablero 3', value: '3' },
	]

	protected readonly states = [
		{ label: 'Pendiente', value: 'pending' },
		{ label: 'En curso', value: 'progress' },
		{ label: 'Completado', value: 'completed' },
	]

	protected readonly priorities = [
		{ label: 'Baja', value: '1' },
		{ label: 'Media', value: '2' },
		{ label: 'Alta', value: '3' },
	]

	readonly milestones = [
		{ label: 'Sprint 1', value: '1' },
		{ label: 'Sprint 2', value: '2' },
		{ label: 'Entrega Final', value: '3' },
	]

	// Funciones formateadoras requeridas por el componente hlm-select de Spartan
	protected selectToString(value: string, items: { label: string; value: string }[]): string {
		return items.find((item) => item.value === value)?.label || ''
	}

	protected readonly tableroToString = (v: string) => this.selectToString(v, this.tableros)
	protected readonly stateToString = (v: string) => this.selectToString(v, this.states)
	protected readonly priorityToString = (v: string) => this.selectToString(v, this.priorities)
	protected readonly milestoneToString = (v: string) => this.selectToString(v, this.milestones)

	//--------- Logica para la fecha

	readonly dateType = signal<DateType>('none')

	// Para el diseño de cartas
	readonly radioCardClass = hlm(
		'relative flex flex-col items-center justify-center rounded-lg border p-4 text-center',
		'border-border bg-card hover:bg-accent/10 cursor-pointer transition-colors',
		'has-data-[checked=true]:border-primary',
		`has-data-[checked=true]:bg-primary/3`,
	)
}
