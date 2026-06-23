import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMoreHorizontal, lucidePencil, lucideTrash2 } from '@ng-icons/lucide'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmCardImports } from '@spartan-ng/helm/card'

export interface MockBoard {
	id: string
	title: string
	thumbnailUrl: string | null
}

export interface MockFolder {
	id: string
	name: string
	boards: MockBoard[]
}

@Component({
	selector: 'app-folder-card',
	imports: [NgIcon, HlmDropdownMenuImports, HlmCardImports],
	providers: [provideIcons({ lucideMoreHorizontal, lucidePencil, lucideTrash2 })],
	templateUrl: './folder-card.html',
})
export class FolderCardComponent {
	@Input() folder: MockFolder = {
		id: 'folder-1',
		name: 'Team project',
		boards: [
			{
				id: 'b1',
				title: 'Board Login',
				thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
			},
			{
				id: 'b2',
				title: 'Board Ui',
				thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&q=80',
			},
		],
	}

	@Output() folderClick = new EventEmitter<string>() // string porque tu id es string

	readonly gridSlots = [0, 1, 2, 3]
}
