import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	NavUser,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'

import { Component, computed, input, Signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { provideIcons } from '@ng-icons/core'
import {
	lucideCalendar,
	lucideHome,
	lucideMessageCircle,
	lucidePresentation,
	lucideSquareKanban,
	lucideTriangle,
} from '@ng-icons/lucide'

@Component({
	selector: 'app-app-layout',
	imports: [
		RouterOutlet,
		Sidebar,
		SidebarHeader,
		SidebarContent,
		SidebarFooter,
		NavUser,
		NavHeader,
	],
	providers: [
		provideIcons({
			lucideTriangle,
			lucideMessageCircle,
			lucideSquareKanban,
			lucideCalendar,
			lucidePresentation,
			lucideHome,
		}),
	],
	templateUrl: './app-layout.html',
	styles: ``,
})
export class AppLayout {
	teamId = input<string>()
	projectId = input<string>()

	protected readonly items: Signal<SidebarItemProps[]> = computed(() => [
		{
			icon: 'lucideHome',
			title: 'Proyecto',
			to: `/team/${this.teamId()}/project/${this.projectId()}`,
			exact: true,
		},
		{
			icon: 'lucideMessageCircle',
			title: 'Chat',
			to: `/team/${this.teamId()}/project/${this.projectId()}/chat`,
		},
		{
			icon: 'lucideSquareKanban',
			title: 'Kanban',
			to: `/team/${this.teamId()}/project/${this.projectId()}/kanban`,
		},
		{
			icon: 'lucideCalendar',
			title: 'Calendario',
			to: `/team/${this.teamId()}/project/${this.projectId()}/calendar`,
		},
		{
			icon: 'lucidePresentation',
			title: 'Pizarra',
			to: `/team/${this.teamId()}/project/${this.projectId()}/board`,
		},
	])
}
