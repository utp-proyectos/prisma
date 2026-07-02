import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideFolderMinus,
	lucideMonitor,
	lucideMoreHorizontal,
	lucidePencil,
	lucideStar,
	lucideTrash2,
} from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { Board } from '../../models/board-response'
import { Router } from '@angular/router'
import { DeleteModalComponent } from '@/shared/components/delete/DeleteModalComponent'

@Component({
	selector: 'app-board-card',
	imports: [NgIcon, HlmDropdownMenuImports, HlmCardImports, DeleteModalComponent],
	providers: [
		provideIcons({
			lucidePencil,
			lucideStar,
			lucideTrash2,
			lucideMoreHorizontal,
			lucideMonitor,
			lucideFolderMinus,
		}),
	],
	templateUrl: './board-card.html',
})
export class BoardCard {
	// inyecciones de Dependencias
	private router = inject(Router)

	// entradas (Inputs) y salidas (Outputs)
	@Input() board!: Board
	@Input() insideFolder = false
	@Output() deleteBoard = new EventEmitter<string>()
	@Output() removeFromFolder = new EventEmitter<string>()
	deleteModalState = signal<'open' | 'closed'>('closed')

	// navegacion
	openBoard() {
		this.router.navigate(['/board', this.board.id])
	}
	confirmDelete() {
		this.deleteBoard.emit(this.board.id)
	}
}
