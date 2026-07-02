import { Component, Input, Output, EventEmitter, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideFolder,
	lucideFolderOpen,
	lucideMoreHorizontal,
	lucidePencil,
	lucideTrash2,
} from '@ng-icons/lucide'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { Folder } from '../../models/folder.model'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'

@Component({
	selector: 'app-folder-card',
	imports: [NgIcon, HlmDropdownMenuImports, HlmCardImports, DeleteModalComponent],
	providers: [
		provideIcons({
			lucideMoreHorizontal,
			lucidePencil,
			lucideTrash2,
			lucideFolder,
			lucideFolderOpen,
		}),
	],
	templateUrl: './folder-card.html',
})
export class FolderCardComponent {
	// entradas (Inputs) y salidas (Outputs)
	@Input() folder!: Folder
	@Input() isReceiving = false
	@Output() folderClick = new EventEmitter<string>()
	@Output() deleteFolder = new EventEmitter<string>()
	deleteModalState = signal<'open' | 'closed'>('closed')

	// grid
	readonly gridSlots = [0, 1, 2, 3]
	confirmDelete() {
		this.deleteFolder.emit(this.folder.id)
	}
}
