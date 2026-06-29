import { Component, computed, inject, input, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangle, lucidePlus, lucideMoreHorizontal, lucidePanelLeft } from '@ng-icons/lucide'
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
import { ProjectResponse } from '@/features/home/models/project-response'

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
	],
	providers: [
		CreateKanbanModalState,
		provideIcons({
			lucideTriangle,
			lucidePanelLeft,
			lucidePlus,
			lucideMoreHorizontal,
		}),
	],
	templateUrl: './kanban-layout.html',
})
export class KanbanLayout {
	createKanbanModalState = inject(CreateKanbanModalState)
	createKanbanModal = computed(() => this.createKanbanModalState.createKanbanModal())

	// Para ver los tableros de bd
	teamId = input<string>()
	projectId = input<string>()

	kanbanApi = inject(KanbanApi)
	kanbansResource = this.kanbanApi.kanbansResource(this.projectId)

	readonly kanbanItems = computed<SidebarItemProps[]>(() => {
		const kanbans = this.kanbansResource.value()?.data ?? []

		return kanbans.map((kanban) => ({
			icon: 'lucidePanelLeft',
			title: kanban.name,
			to: `/team/${this.teamId()}/project/${this.projectId()}/kanban/${kanban.id}`,
		}))
	})

	protected readonly privateKanban = signal(false)

	// protected createNewBoard(): void {
	// 	const currentBoards = this.tusTableros()
	// 	const newId = currentBoards.length + 1

	// 	this.tusTableros.set([
	// 		...currentBoards,
	// 		{
	// 			icon: 'lucidePanelLeft',
	// 			title: `Tablero ${newId}`,
	// 			to: `/kanban/tablero-${newId}`,
	// 		},
	// 	])
	// }
}
