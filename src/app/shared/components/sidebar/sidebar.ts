import { Component, computed, input } from '@angular/core'

@Component({
	selector: 'app-sidebar',
	imports: [],
	templateUrl: './sidebar.html',
	styles: ``,
})
export class Sidebar {
	isExpanded = input<boolean>(true)

	expandedClass = computed(() => (this.isExpanded() ? 'w-60' : 'w-12'))
}
