import { Component, computed, inject, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { HlmItemImports } from '@spartan-ng/helm/item'
import { SidebarService } from '../../sidebar.service'

export interface SidebarItemProps {
	icon: string
	title: string
	to: string | any[]
	exact?: boolean
}

@Component({
	selector: 'sidebar-item',
	imports: [RouterLink, NgIcon, HlmItemImports, RouterLinkActive],
	templateUrl: './sidebar-item.html',
	styles: ``,
})
export class SidebarItem {
	sidebarService = inject(SidebarService)

	readonly icon = input<string>('')
	readonly title = input.required<string>()
	readonly to = input<string | any[]>('')
	readonly exact = input<boolean | undefined>(false)

	readonly disabled = input<boolean>(false)

	protected sidebarItemClasses = computed(() => ({
		'pointer-events-none': this.disabled(),
		'opacity-50': this.disabled(),
		'w-8': this.sidebarService.isCollapsed(),
		'w-full': !this.sidebarService.isCollapsed(),
	}))

	isCollapsed = computed(() => this.sidebarService.isCollapsed())
}
