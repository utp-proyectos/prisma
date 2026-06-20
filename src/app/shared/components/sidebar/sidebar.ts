import { Component, computed, effect, inject, input, OnInit } from '@angular/core'
import { SidebarService } from './sidebar.service'

@Component({
	selector: 'app-sidebar',
	imports: [],
	providers: [SidebarService],
	templateUrl: './sidebar.html',
	styles: ``,
})
export class Sidebar implements OnInit {
	sidebarService = inject(SidebarService)

	canCollapse = input<boolean>(false)
	expandedClass = computed(() => (this.sidebarService.isCollapsed() ? 'w-12' : 'w-60'))

	ngOnInit() {
		this.sidebarService.setCanCollpase(this.canCollapse())
	}
}
