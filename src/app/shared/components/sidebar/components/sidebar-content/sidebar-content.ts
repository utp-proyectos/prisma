import { Component, input } from '@angular/core'
import { SidebarItem, SidebarItemProps } from '../sidebar-item/sidebar-item'

@Component({
	selector: 'sidebar-content',
	imports: [SidebarItem],
	templateUrl: './sidebar-content.html',
	styles: ``,
	host: { class: 'p-2 flex-1 overflow-y-auto flex flex-col gap-1 ' },
})
export class SidebarContent {
	readonly items = input<SidebarItemProps[]>([])
}
