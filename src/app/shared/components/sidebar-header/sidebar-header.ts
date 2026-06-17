import { Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'

@Component({
	selector: 'sidebar-header',
	imports: [NgIcon],
	templateUrl: './sidebar-header.html',
	styles: ``,
})
export class SidebarHeader {
	readonly icon = input<string>('')
	readonly title = input<string>('')
}
