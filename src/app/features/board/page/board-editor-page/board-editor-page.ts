import { Component, inject, OnDestroy, signal, viewChild } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowLeft, lucidePanelRight } from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { CanvasBoardComponent } from '../../components/board/canvas-board-component'
import { BoardDetail } from '../../models/board-detail'
import { BoardApiService } from '../../service/board-api.service'
import { ActivatedRoute } from '@angular/router'
import { BoardStateService } from '../../service/board-canvas.service'
import { CanvasWsService } from '../../service/canvas-ws-service'

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
export class BoardEditorPage implements OnDestroy {
	//inyeccion de dependecias
	private route = inject(ActivatedRoute)
	private boardApiService = inject(BoardApiService)
	private boardStateService = inject(BoardStateService)
	private canvasWsService = inject(CanvasWsService)
	//parametros de ruta
	boardId = this.route.snapshot.params['boardId']
	//estados
	board = signal<BoardDetail | null>(null)
	private canvasBoard = viewChild(CanvasBoardComponent)
	private saveInterval: any

	constructor() {
		this.boardStateService.setBoardId(this.boardId)
		this.loadBoard()
		this.subscribeToCanvas()

		// guarda cada 10 segundos
		this.saveInterval = setInterval(() => {
			const data = this.boardStateService.saveBoard()
			this.boardApiService.saveCanvas(this.boardId, data).subscribe()
		}, 10000)
	}
	subscribeToCanvas() {
		this.canvasWsService.watchCanvas(this.boardId).subscribe((message) => {
			if (message.type === 'CREATE') {
				this.boardStateService.shapes.update((s) => [...s, message.shape])
			} else if (message.type === 'UPDATE') {
				this.boardStateService.updateShape(message.shape, true) // true = remoto
			} else if (message.type === 'DELETE') {
				this.boardStateService.shapes.update((s) =>
					s.filter((sh) => sh.name !== message.shape.name),
				)
			}
		})
	}

	//api- carga de datos
	loadBoard() {
		this.boardStateService.loadBoard({
			shapes: [],
			backgroundColor: '#121212',
			strokeColor: '#121212',
		})
		this.boardApiService.getCanvas(this.boardId).subscribe((konvaData) => {
			// si devuelve algo lo transforma de string a json
			if (konvaData) {
				this.boardStateService.loadBoard(JSON.parse(konvaData))
			}
		})
	}
	ngOnDestroy() {
		clearInterval(this.saveInterval)

		const data = this.boardStateService.saveBoard()
		//hace la peticion cuando se salga del konba
		console.log(data)
		this.boardApiService.saveCanvas(this.boardId, data).subscribe()
	}

	openSheet() {
		this.canvasBoard()?.openSheet()
	}
}
