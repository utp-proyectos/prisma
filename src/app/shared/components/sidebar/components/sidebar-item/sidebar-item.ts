import { Component, computed, inject, input, output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmItemImports } from '@spartan-ng/helm/item'
import { SidebarService } from '../../sidebar.service'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { lucideEdit, lucideLock, lucideMoreVertical, lucideTrash } from '@ng-icons/lucide'

export interface SidebarItemProps {
	icon: string
	title: string
	to: string | any[]
	exact?: boolean
	canAction?: boolean
	rawQuery?: any
	privateAction?: boolean
}

@Component({
	selector: 'sidebar-item',
	imports: [RouterLink, NgIcon, HlmItemImports, HlmDropdownMenuImports, RouterLinkActive],
	providers: [
		provideIcons({
			lucideEdit,
			lucideTrash,
			lucideMoreVertical,
			lucideLock,
		}),
	],
	templateUrl: './sidebar-item.html',
	styles: ``,
})
export class SidebarItem {
	sidebarService = inject(SidebarService)

	readonly icon = input<string>('')
	readonly title = input.required<string>()
	readonly to = input<string | any[]>('')
	readonly exact = input<boolean | undefined>(false)

	readonly canAction = input<boolean>(false)
	readonly rawQuery = input<any | null>(null)
	readonly privateAction = input<boolean>(false)

	editRequested = output<any>()
	deleteRequested = output<any>()

	readonly disabled = input<boolean>(false)

	protected sidebarItemClasses = computed(() => ({
		'pointer-events-none': this.disabled(),
		'opacity-50': this.disabled(),
		'w-8': this.sidebarService.isCollapsed(),
		'w-full': !this.sidebarService.isCollapsed(),
	}))

	isCollapsed = computed(() => this.sidebarService.isCollapsed())
}
