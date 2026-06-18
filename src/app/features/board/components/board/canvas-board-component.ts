import { Component, ViewChild, signal, HostListener, Input, AfterViewInit } from '@angular/core'
import { CoreShapeComponent, StageComponent } from 'ng2-konva'
import { StageConfig } from 'konva/lib/Stage'
import Konva from 'konva'
import { TextConfig } from 'konva/lib/shapes/Text'

//tipos de figura
export type ShapeType = 'CIRCLE' | 'RECT' | 'TEXT'
//figuras validas
export interface Shape {
	name: string
	type: ShapeType
	x: number
	y: number
	fill?: string
	stroke?: string
	strokeWidth?: number
	draggable?: boolean
	rotation?: number
	scaleX?: number
	scaleY?: number
	radius?: number
	width?: number
	height?: number
	points?: number[]
	dash?: number[]
	text?: string
	fontSize?: number
	fontFamily?: string
}

@Component({
	selector: 'app-canvas-board',
	host: { class: 'block w-full h-full' },
	imports: [StageComponent, CoreShapeComponent],
	templateUrl: './canvas-board-component.html',
})
export class CanvasBoardComponent implements AfterViewInit {
	@ViewChild('transformer') transformer!: any

	// tamañoi inicial del escenario
	configstage: StageConfig = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	//estados
	selectedTool = signal<'NONE' | 'CIRCLE' | 'RECT' | 'HAND' | 'TEXT' | 'SELECT'>('NONE')
	shapes = signal<Shape[]>([])
	//figura preview
	previewShape = signal<any | null>(null)

	private startPos = { x: 0, y: 0 }
	private isDrawing = false
	private isPanning = false
	private lastPanPos = { x: 0, y: 0 }

	// Para selección grupal
	private isSelecting = false
	private selectionRect!: Konva.Rect
	private selectionStartPos = { x: 0, y: 0 }

	//cambio de herramientras
	@Input() set activeTool(tool: string) {
		switch (tool) {
			case 'RECT':
				this.selectedTool.set(tool)
				break
			case 'CIRCLE':
				this.selectedTool.set(tool)
				break
			case 'HAND':
				this.selectedTool.set('HAND')
				break
			case 'TEXT':
				this.selectedTool.set('TEXT')
				break
			case 'SELECT':
				this.selectedTool.set('SELECT')
				break
			default:
				this.selectedTool.set('NONE')
		}
		setTimeout(() => this.updateCursor(tool), 0)
	}
	//selector grupal
	ngAfterViewInit() {
		this.selectionRect = new Konva.Rect({
			fill: 'rgba(99, 102, 241, 0.1)',
			stroke: '#6366f1',
			strokeWidth: 1,
			dash: [4, 4],
			visible: false,
			listening: false,
		})

		const stage = this.getStage()
		if (stage) {
			stage.getLayers()[0].add(this.selectionRect)
		}
	}
	//obtener el posicion del mouse
	private getStage(): Konva.Stage {
		return this.transformer?.getStage()?.getStage()
	}
	//convertir la posicion del mouse a coordenadas del konva, para pizarra infinita
	private getRelativePos() {
		const stage = this.getStage()
		const transform = stage.getAbsoluteTransform().copy().invert()
		const pos = stage.getPointerPosition()!
		return transform.point(pos)
	}
	//actualizar cursor css
	updateCursor(tool: string) {
		const stage = this.getStage()
		if (!stage) return
		stage.container().style.cursor =
			tool === 'HAND'
				? 'grab'
				: tool === 'SELECT'
					? 'default'
					: tool === 'RECT' || tool === 'TEXT' || tool === 'CIRCLE'
						? 'crosshair'
						: 'default'
	}

	asText(c: any): TextConfig {
		return c
	}

	// ─── MOUSE DOWN ───────────────────────────────────────────────────────────

	handleMouseDown(event: any): void {
		//captura exacta donde ocurrio el clic, si es igual al stage fue en vacio
		const e = event.target ? event : event.event ? event.event : event
		const stage = e.target?.getStage()
		const target = e.target

		//Default
		if (this.selectedTool() === 'NONE') return

		// HAND: pan del mapa
		if (this.selectedTool() === 'HAND') {
			this.isPanning = true
			const pos = stage.getPointerPosition()
			this.lastPanPos = { x: pos.x, y: pos.y }
			stage.container().style.cursor = 'grabbing'
			return
		}

		// SELECT: selección individual o inicio de selección grupal
		if (this.selectedTool() === 'SELECT') {
			// caso a, si se hizo una seleccion individual, el propio handleShapeClick lo maneja
			if (target !== stage) return

			// caso b, seleccion total
			this.getTransformerNode()?.nodes([])

			// Inicia el rectángulo de selección grupal
			const pos = this.getRelativePos()
			this.isSelecting = true
			this.selectionStartPos = { x: pos.x, y: pos.y }

			this.selectionRect.setAttrs({
				x: pos.x,
				y: pos.y,
				width: 0,
				height: 0,
				visible: true,
			})
			stage.getLayers()[0].batchDraw()
			return
		}

		// TEXT: crea texto con un click
		if (this.selectedTool() === 'TEXT') {
			const pos = this.getRelativePos()
			if (!pos) return
			const newShape: Shape = {
				name: `shape-${crypto.randomUUID()}`, //socket
				type: 'TEXT',
				x: pos.x,
				y: pos.y,
				fill: '#fff',
				fontSize: 14,
				text: 'Texto',
				draggable: false,
			}

			this.shapes.update((s) => [...s, newShape])
			// this.boardSocket.createShape(newShape)
			console.log('Listo para enviar creación por socket:', newShape)
			return
		}

		// RECT / CIRCLE: dibuja con arrastre
		if (target !== stage) return

		const pos = this.getRelativePos()
		if (!pos) return

		this.isDrawing = true
		this.startPos = { x: pos.x, y: pos.y }

		//configuracion del preview
		this.previewShape.set({
			name: 'preview',
			type: this.selectedTool(),
			x: pos.x,
			y: pos.y,
			width: 0,
			height: 0,
			radius: 0,
			fill: 'none',
			stroke: '#D1FC57',
			strokeWidth: 2,
			dash: [5, 5],
		})
	}

	// ─── MOUSE MOVE ───────────────────────────────────────────────────────────

	@HostListener('window:mousemove', ['$event'])
	handleMouseMove(event: MouseEvent): void {
		// hand
		if (this.selectedTool() === 'HAND' && this.isPanning) {
			const stage = this.getStage()
			const pos = stage.getPointerPosition()!
			stage.x(stage.x() + pos.x - this.lastPanPos.x)
			stage.y(stage.y() + pos.y - this.lastPanPos.y)
			this.lastPanPos = { x: pos.x, y: pos.y }
			stage.batchDraw()
			return
		}

		// seleccion grupal
		if (this.selectedTool() === 'SELECT' && this.isSelecting) {
			const pos = this.getRelativePos()
			const sx = this.selectionStartPos.x
			const sy = this.selectionStartPos.y

			this.selectionRect.setAttrs({
				x: Math.min(pos.x, sx),
				y: Math.min(pos.y, sy),
				width: Math.abs(pos.x - sx),
				height: Math.abs(pos.y - sy),
			})
			this.getStage().getLayers()[0].batchDraw()
			return
		}

		// DIBUJO
		if (!this.isDrawing || !this.previewShape()) return

		const pos = this.getRelativePos()
		const newWidth = pos.x - this.startPos.x
		const newHeight = pos.y - this.startPos.y

		if (this.selectedTool() === 'RECT') {
			this.previewShape.update((s) => ({ ...s, width: newWidth, height: newHeight }))
		} else if (this.selectedTool() === 'CIRCLE') {
			const r = Math.sqrt(Math.pow(newWidth, 2) + Math.pow(newHeight, 2))
			this.previewShape.update((s) => ({ ...s, radius: r }))
		}
	}

	// ─── MOUSE UP ─────────────────────────────────────────────────────────────

	@HostListener('window:mouseup')
	handleMouseUp(): void {
		// Termina PAN
		if (this.isPanning) {
			this.isPanning = false
			this.updateCursor(this.selectedTool())
			return
		}

		// Termina SELECCIÓN GRUPAL
		if (this.isSelecting) {
			this.isSelecting = false
			this.selectionRect.visible(false)

			const box = this.selectionRect.getClientRect()
			const stage = this.getStage()
			const layer = stage.getLayers()[0]

			// Busca todos los nodos del layer que intersecten con el rectángulo
			const selected = layer.getChildren((node) => {
				if (node === this.selectionRect) return false //excluye el rectangulo del marcado
				if (node instanceof Konva.Transformer) return false // excluye el transformador
				if ((node as any).name?.() === 'preview') return false // excluye el preview
				if (!node.isVisible()) return false

				return Konva.Util.haveIntersection(box, node.getClientRect())
			})
			selected.forEach((node) => node.draggable(true)) // una ves seleccionados se activda el drag
			this.getTransformerNode()?.nodes(selected)
			layer.batchDraw()
			return
		}

		// Termina DIBUJO
		if (!this.isDrawing) return

		const finalPreview = this.previewShape()
		if (finalPreview) {
			if (Math.abs(finalPreview.width) > 5 || finalPreview.radius > 5) {
				this.addFinalShape(finalPreview)
			}
		}

		this.isDrawing = false
		this.previewShape.set(null)
	}

	// ─── SELECCIÓN INDIVIDUAL ─────────────────────────────────────────────────

	handleStageClick(event: any): void {
		const e = event.target ? event : event.event
		if (e.target === e.target.getStage()) {
			// Quita draggable de todas las shapes y limpia el transformer
			const transformer = this.getTransformerNode()
			transformer?.nodes().forEach((node: Konva.Node) => node.draggable(false))
			transformer?.nodes([])
		}
	}

	handleShapeClick(event: any): void {
		if (this.selectedTool() !== 'SELECT') return

		const e = event.target ? event : event.event
		e.cancelBubble = true

		const shape = e.target
		const transformer = this.getTransformerNode()

		// Shift + click agrega a la selección existente
		const isShiftPressed = e.evt?.shiftKey
		if (isShiftPressed) {
			const currentNodes = transformer?.nodes() ?? []
			const alreadySelected = currentNodes.includes(shape)
			if (alreadySelected) {
				// Deselecciona esa figura
				shape.draggable(false)
				transformer?.nodes(currentNodes.filter((n: Konva.Node) => n !== shape))
			} else {
				shape.draggable(true)
				transformer?.nodes([...currentNodes, shape])
			}
		} else {
			// Click normal — selecciona solo esta figura
			transformer?.nodes().forEach((node: Konva.Node) => node.draggable(false))
			shape.draggable(true)
			transformer?.nodes([shape])
		}
	}

	handleDragStart(): void {
		// No limpiamos el transformer al arrastrar para mantener la selección múltiple
	}

	//atrastar - cuando termian de mover una figura dispara el evento
	handleDragEnd(event: any): void {
		const e = event.target ? event : event.event
		const shape = e.target

		const payload: Partial<Shape> = {
			name: shape.name(),
			x: shape.x(),
			y: shape.y(),
		}

		this.updateLocalShape(payload)
		// this.boardSocket.updateShape(payload)
		console.log('Listo para enviar actualización de arrastre por socket:', payload)
	}

	//si hubo cambios en las figuras - dispara el evento
	handleTransformEnd(event: any): void {
		const e = event.target ? event : event.event
		const shape = e.target

		const payload: Partial<Shape> = {
			name: shape.name(),
			x: shape.x(),
			y: shape.y(),
			scaleX: shape.scaleX(),
			scaleY: shape.scaleY(),
			rotation: shape.rotation(),
		}

		this.updateLocalShape(payload)
		//  this.boardSocket.updateShape(payload)
		console.log('Listo para enviar actualización de transformación por socket:', payload)
	}

	// texto con doble click en el stage - dispara el evento cuando se termine de escribir
	handleTextDblClick(event: any, name: string): void {
		const e = event.event ?? event
		const textNode = e.target as Konva.Text
		const stage = this.getStage()

		textNode.hide()

		const textPosition = textNode.absolutePosition()
		const stageBox = stage.container().getBoundingClientRect()

		const textarea = document.createElement('textarea')
		document.body.appendChild(textarea)

		textarea.value = textNode.text()
		textarea.style.position = 'absolute'
		textarea.style.top = `${stageBox.top + textPosition.y}px`
		textarea.style.left = `${stageBox.left + textPosition.x}px`
		textarea.style.fontSize = `${textNode.fontSize()}px`
		textarea.style.background = 'transparent'
		textarea.style.border = '1px solid #74b9ff'
		textarea.style.color = '#fff'
		textarea.style.resize = 'none'
		textarea.style.outline = 'none'
		textarea.style.padding = '0'
		textarea.focus()

		textarea.addEventListener('blur', () => {
			textNode.text(textarea.value)
			textNode.show()
			this.shapes.update((shapes) =>
				shapes.map((s) => (s.name === name ? { ...s, text: textarea.value } : s)),
			)
			document.body.removeChild(textarea)
			// this.boardSocket.updateShape({ name, text: textarea.value })
			console.log('Listo para enviar actualización por socket:', { name, text: textarea.value })
		})

		textarea.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) textarea.blur()
			if (e.key === 'Escape') {
				textNode.show()
				document.body.removeChild(textarea)
			}
		})
	}

	//axuxiliadores para saber que figura esta tocando el usuario
	private getTransformerNode(): Konva.Transformer | null {
		return (this.transformer?.getNode() as Konva.Transformer) ?? null
	}
	// cuando se termina de crear una figura - dispara el  evento
	private addFinalShape(preview: any): void {
		const newShape: Shape = {
			...preview,
			name: `shape-${crypto.randomUUID()}`,
			fill: 'transparent',
			dash: [],
			draggable: false, // draggable solo cuando está en SELECT
		}

		this.shapes.update((currentShapes) => [...currentShapes, newShape])
		//  this.boardSocket.createShape(newShape)
		console.log('Listo para enviar creación por socket:', newShape)
	}

	private updateLocalShape(payload: Partial<Shape>): void {
		this.shapes.update((currentShapes) =>
			currentShapes.map((s) => (s.name === payload.name ? ({ ...s, ...payload } as Shape) : s)),
		)
	}
}
