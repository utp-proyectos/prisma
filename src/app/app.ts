import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronRight, lucideArrowUp } from '@ng-icons/lucide'
import { HlmIcon } from '@spartan-ng/helm/icon'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { type BrnDialogState } from '@spartan-ng/brain/dialog'

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, HlmButtonImports, HlmIcon, NgIcon, HlmDialogImports],
	providers: [provideIcons({ lucideChevronRight, lucideArrowUp })],
	templateUrl: './app.html',
})
export class App {
	protected readonly title = signal('prisma')

	protected readonly modal = signal<BrnDialogState>('closed')
}
