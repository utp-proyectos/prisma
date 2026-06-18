import { NavHeader } from '@/shared/components/nav-header/nav-header'
import { NavUser } from '@/shared/components/nav-user/nav-user'
import { SidebarContent } from '@/shared/components/sidebar-content/sidebar-content'
import { SidebarFooter } from '@/shared/components/sidebar-footer/sidebar-footer'
import { SidebarHeader } from '@/shared/components/sidebar-header/sidebar-header'
import { SidebarItem, SidebarItemProps } from '@/shared/components/sidebar-item/sidebar-item'
import { Sidebar } from '@/shared/components/sidebar/sidebar'
import { Component, computed, model, signal } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideTriangle,
	lucideClock,
	lucidePlus,
	lucideUsers,
	lucideChevronDown,
	lucideLayoutGrid,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSelectImports } from '@spartan-ng/helm/select'

@Component({
	selector: 'app-home-layout',
	imports: [
		RouterOutlet,
		Sidebar,
		SidebarHeader,
		SidebarContent,
		SidebarFooter,
		HlmButtonImports,
		NgIcon,
		HlmSelectImports,
		SidebarItem,
		NavUser,
		NavHeader,
		RouterLink,
	],
	providers: [
		provideIcons({
			lucideTriangle,
			lucideClock,
			lucidePlus,
			lucideUsers,
			lucideChevronDown,
			lucideLayoutGrid,
		}),
	],
	templateUrl: './home-layout.html',
	styles: ``,
})
export class HomeLayout {
	protected teamId = signal<string | null>(null)

	protected readonly items: SidebarItemProps[] = [
		{
			icon: 'lucideClock',
			title: 'Recientes',
			to: '/',
		},
	]

	protected readonly teams = [
		{ label: 'Team 1', value: '1' },
		{ label: 'Team 2', value: '2' },
		{ label: 'Team 3', value: '3' },
	]

	protected readonly isTeamSelected = computed(() => this.teamId() !== null)

	protected readonly itemToString = (value: string) =>
		this.teams.find((item) => item.value === value)?.label || ''
}
