import { Component, computed, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronsUpDown, lucideLogOut, lucideUser } from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { SidebarService } from '../../sidebar.service'

@Component({
	selector: 'nav-user',
	imports: [HlmButtonImports, HlmDropdownMenuImports, HlmAvatarImports, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown, lucideUser, lucideLogOut })],
	templateUrl: './nav-user.html',
	styles: ``,
})
export class NavUser {
	sidebarService = inject(SidebarService)
	isCollapsed = computed(() => this.sidebarService.isCollapsed())
}
