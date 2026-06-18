import { Component, signal, viewChild } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideArrowLeft,
	lucidePanelRight,
	lucideHand,
	lucideSquare,
	lucideCircle,
	lucidePencil,
	lucideMousePointer,
	lucidePlus,
	lucideType,
} from '@ng-icons/lucide'
import { BrnSheet } from '@spartan-ng/brain/sheet'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { CanvasBoardComponent } from '../../components/board/canvas-board-component'

@Component({
	selector: 'app-board-editor-page',
	imports: [
		HlmSheetImports,
		HlmFieldImports,
		HlmButtonImports,
		HlmInputImports,
		NgIcon,
		HlmAvatarImports,
		HlmButtonGroupImports,
		CanvasBoardComponent,
	],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucidePanelRight,
			lucideHand,
			lucideSquare,
			lucideCircle,
			lucidePencil,
			lucideMousePointer,
			lucidePlus,
			lucideType,
		}),
	],
	templateUrl: './board-editor-page.html',
	styles: ``,
})
export class BoardEditorPage {
	protected readonly sheetOpen = viewChild(BrnSheet)

	openSheet() {
		this.sheetOpen()?.open()
	}

	activeTool = signal<'HAND' | 'SELECT' | 'RECT' | 'CIRCLE' | 'TEXT' | 'PENCIL'>('HAND')

	setTool(tool: 'HAND' | 'SELECT' | 'RECT' | 'CIRCLE' | 'TEXT' | 'PENCIL') {
		this.activeTool.set(tool)
	}
}
