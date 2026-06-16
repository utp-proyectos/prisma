import { Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMoreHorizontal, lucidePencil, lucideStar, lucideTrash2 } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'

@Component({
	selector: 'app-board-card',
	imports: [NgIcon, HlmDropdownMenuImports, HlmCardImports],
	providers: [
		provideIcons({
			lucidePencil,
			lucideStar,
			lucideTrash2,
			lucideMoreHorizontal,
		}),
	],
	templateUrl: './board-card.html',
})
export class BoardCard {}
