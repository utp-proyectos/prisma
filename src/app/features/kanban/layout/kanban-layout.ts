import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangle, lucidePlus, lucideMoreHorizontal, lucidePanelLeft } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'

import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'

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
	],
	providers: [
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
	protected readonly kanbanItems = signal<SidebarItemProps[]>([
		{
			icon: 'lucidePanelLeft',
			title: 'Tablero general',
			to: '/team/project/kanban/general',
		},
		{
			icon: 'lucidePanelLeft',
			title: 'Tablero 1',
			to: '/team/project/kanban/tablero-1',
		},
	])

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
