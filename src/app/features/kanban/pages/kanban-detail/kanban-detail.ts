import { Component, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideClock, lucidePlus, lucideSearch, lucidePanelLeft } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'

@Component({
	selector: 'app-kanban-detail',
	standalone: true,
	imports: [
		NgIcon,
		HlmButtonImports,
		HlmSelectImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmSeparatorImports,
		HlmCardImports,
	],
	providers: [provideIcons({ lucidePlus, lucideSearch, lucideClock, lucidePanelLeft })],
	templateUrl: './kanban-detail.html',
	styles: ``,
})
export class KanbanDetail {
	protected readonly activeTab = signal<string>('hitos')

	protected changeTab(tabName: string): void {
		this.activeTab.set(tabName)
	}
}
