import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	NavUser,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'

import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { provideIcons } from '@ng-icons/core'
import {
	lucideCalendar,
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
		}),
	],
	templateUrl: './app-layout.html',
	styles: ``,
})
export class AppLayout {
	protected readonly items: SidebarItemProps[] = [
		{
			icon: 'lucideMessageCircle',
			title: 'Chat',
			to: '/team/project/chat',
		},
		{
			icon: 'lucideSquareKanban',
			title: 'Kanban',
			to: '/team/project/kanban',
		},
		{
			icon: 'lucideCalendar',
			title: 'Calendario',
			to: '/team/project/calendar',
		},
		{
			icon: 'lucidePresentation',
			title: 'Pizarra',
			to: '/team/project/board',
		},
	]
}
