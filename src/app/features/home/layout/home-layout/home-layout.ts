import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarItem,
	NavUser,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'
import { Component, computed, inject, signal } from '@angular/core'
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
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { CreateTeamModalState } from '../../service/create-team-modal-state'

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
		HlmFieldImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmDialogImports,
	],
	providers: [
		CreateTeamModalState,
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
	createTeamModalState = inject(CreateTeamModalState)
	createTeamModal = computed(() => this.createTeamModalState.createTeamModal())

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
