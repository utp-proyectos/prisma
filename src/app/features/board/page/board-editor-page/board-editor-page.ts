import { Component, inject, OnDestroy, signal, viewChild } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowLeft, lucidePanelRight } from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { CanvasBoardComponent } from '../../components/board/canvas-board-component'
import { BoardDetail } from '../../models/board/board-detail'
import { BoardApiService } from '../../service/board-api.service'
import { ActivatedRoute } from '@angular/router'
import { BoardStateService } from '../../service/board-canvas.service'
import { CanvasWsService } from '../../service/canvas-ws-service'
import { Location } from '@angular/common'
import { AuthService } from '@/core/servies/auth.serive'
import { Subscription } from 'rxjs'

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
	private route = inject(ActivatedRoute)
	private boardApiService = inject(BoardApiService)
	private boardStateService = inject(BoardStateService)
	private canvasWsService = inject(CanvasWsService)
	private location = inject(Location)
	private authService = inject(AuthService) // Inyectado

	boardId = this.route.snapshot.params['boardId']
	board = signal<BoardDetail | null>(null)
	private canvasBoard = viewChild(CanvasBoardComponent)
	private saveInterval: any

	// --- SEÑAL DE USUARIOS CONECTADOS ---
	activeUsers = signal<any[]>([])
	private presenceSub?: Subscription

	regresar() {
		this.location.back()
	}

	constructor() {
		this.boardStateService.setBoardId(this.boardId)
		this.loadBoard()
		this.subscribeToCanvas()
		this.subscribeToPresence() // Conectar presencia al iniciar

		// guarda cada 10 segundos
		this.saveInterval = setInterval(() => {
			const data = this.boardStateService.saveBoard()
			this.boardApiService.saveCanvas(this.boardId, data).subscribe()
		}, 10000)
	}

	getInitials(name: string): string {
		if (!name) return 'U'
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase()
	}

	subscribeToPresence() {
		//  Escuchar la presencia usando el canal modificado de canvasWsService
		this.presenceSub = this.canvasWsService.watchPresence(this.boardId).subscribe((users) => {
			this.activeUsers.set(users)
		})

		//  Avisamos al backend quién entra
		const currentUser = this.authService.currentUser()
		if (currentUser) {
			this.canvasWsService.publishPresence(this.boardId, {
				id: currentUser.id,
				name: currentUser.name,
				avatar: currentUser.avatar,
			})
		}
	}

	subscribeToCanvas() {
		this.canvasWsService.watchCanvas(this.boardId).subscribe((message) => {
			if (message.type === 'CREATE') {
				this.boardStateService.shapes.update((s) => [...s, message.shape])
			} else if (message.type === 'UPDATE') {
				this.boardStateService.updateShape(message.shape, true)
			} else if (message.type === 'DELETE') {
				this.boardStateService.shapes.update((s) =>
					s.filter((sh) => sh.name !== message.shape.name),
				)
			}
		})
	}

	loadBoard() {
		this.boardStateService.loadBoard({
			shapes: [],
			backgroundColor: '#121212',
			strokeColor: '#121212',
		})
		this.boardApiService.getCanvas(this.boardId).subscribe((konvaData) => {
			if (konvaData) {
				this.boardStateService.loadBoard(JSON.parse(konvaData))
			}
		})
	}

	ngOnDestroy() {
		clearInterval(this.saveInterval)

		const currentUser = this.authService.currentUser()
		if (currentUser) {
			this.canvasWsService.publishLeave(this.boardId, currentUser.id)
		}

		this.presenceSub?.unsubscribe()

		const data = this.boardStateService.saveBoard()
		this.boardApiService.saveCanvas(this.boardId, data).subscribe()
	}

	openSheet() {
		this.canvasBoard()?.openSheet()
	}
}
