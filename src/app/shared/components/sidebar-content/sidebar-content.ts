import { Component, input } from '@angular/core'
import { SidebarItem, SidebarItemProps } from '../sidebar-item/sidebar-item'

@Component({
	selector: 'sidebar-content',
	imports: [SidebarItem],
	templateUrl: './sidebar-content.html',
	styles: ``,
})
export class SidebarContent {
	readonly items = input<SidebarItemProps[]>([])
}
