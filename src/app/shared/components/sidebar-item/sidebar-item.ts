import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { HlmItemImports } from '@spartan-ng/helm/item'

export interface SidebarItemProps {
	icon: string
	title: string
	to: string
}

@Component({
	selector: 'sidebar-item',
	imports: [RouterLink, NgIcon, HlmItemImports],
	templateUrl: './sidebar-item.html',
	styles: ``,
})
export class SidebarItem {
	readonly icon = input<string>('')
	readonly title = input.required<string>()
	readonly to = input<string>('')
	readonly disabled = input<boolean>(false)
}
