import { Component, computed, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { HlmItemImports } from '@spartan-ng/helm/item'

export interface SidebarItemProps {
	icon: string
	title: string
	to: string
}

@Component({
	selector: 'sidebar-item',
	imports: [RouterLink, NgIcon, HlmItemImports, RouterLinkActive],
	templateUrl: './sidebar-item.html',
	styles: ``,
})
export class SidebarItem {
	readonly icon = input<string>('')
	readonly title = input.required<string>()
	readonly to = input<string>('')
	readonly disabled = input<boolean>(false)
	readonly isExpanded = input<boolean>(true)

	protected disabledClass = computed(() => ({
		'pointer-events-none': this.disabled(),
		'opacity-50': this.disabled(),
	}))

	protected expandedClass = computed(() => (this.isExpanded() ? 'w-full' : 'w-8'))
}
