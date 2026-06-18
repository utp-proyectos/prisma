import { NavHeader } from '@/shared/components/nav-header/nav-header'
import { NavUser } from '@/shared/components/nav-user/nav-user'
import { SidebarContent } from '@/shared/components/sidebar-content/sidebar-content'
import { SidebarFooter } from '@/shared/components/sidebar-footer/sidebar-footer'
import { SidebarHeader } from '@/shared/components/sidebar-header/sidebar-header'
import { SidebarItemProps } from '@/shared/components/sidebar-item/sidebar-item'
import { Sidebar } from '@/shared/components/sidebar/sidebar'
import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
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

	isExpanded = signal<boolean>(true)
}
