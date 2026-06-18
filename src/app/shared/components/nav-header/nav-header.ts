import { Component, input, model } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'

@Component({
	selector: 'nav-header',
	imports: [NgIcon, HlmButtonImports],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	templateUrl: './nav-header.html',
	styles: ``,
})
export class NavHeader {
	readonly icon = input<string>('')
	readonly title = input<string>('')
	readonly expand = input<boolean>(false)
	public isExpanded = model<boolean>(true)
}
