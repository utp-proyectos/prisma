import { Component, computed, inject, input, model } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { SidebarService } from '../../sidebar.service'
import { RouterLink } from '@angular/router'

@Component({
	selector: 'nav-header',
	imports: [NgIcon, HlmButtonImports, RouterLink],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	templateUrl: './nav-header.html',
	styles: ``,
})
export class NavHeader {
	readonly icon = input<string>('')
	readonly title = input<string>('')

	sidebarService = inject(SidebarService)

	canCollapse = computed(() => this.sidebarService.canCollapse())
	isCollapsed = computed(() => this.sidebarService.isCollapsed())

	collapse(event: MouseEvent) {
		event.stopPropagation()
		this.sidebarService.toggleCollapse()
	}
}
