import { Component, viewChild } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowLeft, lucidePanelRight } from '@ng-icons/lucide'
import { BrnSheet } from '@spartan-ng/brain/sheet'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { CanvasBoardComponent } from '../../components/board/canvas-board-component'

@Component({
	selector: 'app-board-editor-page',
	imports: [HlmSheetImports, HlmButtonImports, NgIcon, HlmAvatarImports, CanvasBoardComponent],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucidePanelRight,
		}),
	],
	templateUrl: './board-editor-page.html',
	styles: ``,
})
export class BoardEditorPage {
	private board = viewChild(CanvasBoardComponent)

	openSheet() {
		this.board()?.openSheet()
	}
}
