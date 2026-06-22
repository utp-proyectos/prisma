import {
	Component,
	ViewChild,
	signal,
	effect,
	HostListener,
	AfterViewInit,
	inject,
	viewChild,
} from '@angular/core'
import { CoreShapeComponent, StageComponent } from 'ng2-konva'
import { StageConfig } from 'konva/lib/Stage'
import Konva from 'konva'
import { TextConfig } from 'konva/lib/shapes/Text'
import { BoardStateService, Shape } from '../../service/board.service'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideArrowRight,
	lucideCircle,
	lucideDonut,
	lucideDownload,
	lucideGhost,
	lucideHand,
	lucideHexagon,
	lucideMousePointer,
	lucidePaintBucket,
	lucidePalette,
	lucidePencil,
	lucideSquare,
	lucideStar,
	lucideType,
	lucideRabbit,
} from '@ng-icons/lucide'
import { HlmSelectImports } from '../../../../../../libs/ui/select/src/index'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { BrnSheet } from '@spartan-ng/brain/sheet'

@Component({
	selector: 'app-canvas-board',
	host: { class: 'block w-full h-full' },
	imports: [
		StageComponent,
		CoreShapeComponent,
		NgIcon,
		HlmSelectImports,
		HlmSheetImports,
		HlmButtonImports,
		HlmFieldImports,
	],
	providers: [
		provideIcons({
			lucideHand,
			lucideMousePointer,
			lucideSquare,
			lucideCircle,
			lucidePencil,
			lucideType,
			lucidePalette,
			lucideStar,
			lucideHexagon,
			lucideGhost,
			lucideDonut,
			lucideDownload,
			lucideArrowRight,
			lucidePaintBucket,
			lucideRabbit,
		}),
	],
	templateUrl: './canvas-board-component.html',
})
export class CanvasBoardComponent implements AfterViewInit {
	//apertura del sheet
	private sheet = viewChild(BrnSheet)
	openSheet() {
		this.sheet()?.open()
	}

	//referencia al tronsformador de konva
	@ViewChild('transformer') transformer!: any

	//service
	board = inject(BoardStateService)

	//tamaño inicial del konva
	configstage: StageConfig = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	//preview de la creacion de figuras
	previewShape = signal<any | null>(null)

	//implementacion del hand
	private startPos = { x: 0, y: 0 }
	private isDrawing = false
	private isPanning = false
	private lastPanPos = { x: 0, y: 0 }

	//grupo de figuras
	private isSelecting = false
	private selectionRect!: Konva.Rect
	private selectionStartPos = { x: 0, y: 0 }

	//actualizacion de herramientas
	constructor() {
		effect(() => {
			const tool = this.board.activeTool()
			setTimeout(() => this.updateCursor(tool), 0)
		})
		// bunny
		effect(() => {
			if (this.board.bunnyMode()) {
				this.loadAndStartBunnies()
			} else {
				this.stopBunnies()
			}
		})
	}
	//obtiene el canvas(mapa) en objeto
	private getStage(): Konva.Stage {
		return this.transformer?.getStage()?.getStage()
	}
	// implementacion de colores figuras
	private lastColor = ''
	private lastSelectedNames: string[] = []

	onColorInput(event: Event) {
		const color = (event.target as HTMLInputElement).value
		this.lastColor = color
		this.lastSelectedNames = this.board.selectedShapeNames() // guarda antes de que se limpie
		this.board.setColor(color)
		this.applyColorVisual(color)
	}

	onColorChange(event: Event) {
		if (!this.lastColor || this.lastSelectedNames.length === 0) return
		this.board.setColor(this.lastColor)
		this.board.updateShapesBatch(this.lastSelectedNames, {
			[this.board.colorTarget()]: this.lastColor,
		})
	}

	//implementacion color pizarra
	onBackgroundColorChange(event: Event) {
		const color = (event.target as HTMLInputElement).value
		this.board.setBackgroundColor(color)
		const stage = this.getStage()
		stage.container().style.backgroundColor = color
	}
	//despues de inicializar el template aplicar estos metodos por defecto
	ngAfterViewInit() {
		//creacion de la seleccion multiple por defecteo invisiable asta arrastrar
		this.selectionRect = new Konva.Rect({
			fill: 'rgba(99, 102, 241, 0.1)',
			stroke: '#6366f1',
			strokeWidth: 1,
			dash: [4, 4],
			visible: false, //
			listening: false,
		})

		//obtiene la referencia al mapa, y si existe instancia el cuadrado invisble al arbol
		const stage = this.getStage()
		if (stage) {
			//agrega el cuadrado invisible al arbol de kanva
			stage.getLayers()[0].add(this.selectionRect)
		}

		//inicializa el pciker de colores --fill
	}

	// captura las cooredenadas exactas de donde se hace click, considerando el hand
	private getRelativePos() {
		const stage = this.getStage()
		const transform = stage.getAbsoluteTransform().copy().invert()
		const pos = stage.getPointerPosition()!
		return transform.point(pos)
	}

	// aplica el color activo a todas las figuras que an sido agrupadas
	// solo actualiza Konva visualmente, sin tocar el board
	private applyColorVisual(color: string): void {
		const nodes = this.getTransformerNode()?.nodes() ?? []
		nodes.forEach((node: any) => {
			if (this.board.colorTarget() === 'fill') node.fill(color)
			else node.stroke(color)
		})
		this.getStage().getLayers()[0].batchDraw()
	}

	// actualiza board y emite socket

	updateCursor(tool: string) {
		const stage = this.getStage()
		if (!stage) return
		stage.container().style.cursor =
			tool === 'HAND'
				? 'grab'
				: tool === 'SELECT'
					? 'default'
					: tool === 'RECT' ||
						  tool === 'TEXT' ||
						  tool === 'CIRCLE' ||
						  tool === 'ARROW' ||
						  tool === 'START' ||
						  tool === 'POLYGON'
						? 'crosshair'
						: 'default'
	}

	asText(c: any): TextConfig {
		return c
	}

	//metodo que controla que pasa cuando el usuario presiona el mouse sobre el canvas - antes de ejecutar esta funcion las opciones ya fueron seleccionda
	//metodo previo, cuando se preciona, prepara todo, despues pasamos al movimiento
	handleMouseDown(event: any): void {
		const e = event.target ? event : event.event ? event.event : event //capturas el evento
		const stage = e.target?.getStage() // captura el canvas completo
		const target = e.target // el elemento clickeado
		const tool = this.board.activeTool() // que herramienta esta activa

		//si no ay herramienta,acaba todo
		if (tool === 'NONE') return

		// El click que hagas con la herramienta hand, pasara por este if
		if (tool === 'HAND') {
			this.isPanning = true
			const pos = stage.getPointerPosition()
			this.lastPanPos = { x: pos.x, y: pos.y } // guarda la posicion inicial del pan
			stage.container().style.cursor = 'grabbing'
			return
		}

		//El click que haces con el select - seleccion grupal
		if (tool === 'SELECT') {
			if (target !== stage) return // si no haces click en el escenario se ingora todo, porque ya lo maneja el konva

			//limpia todo lo seleccionado
			this.getTransformerNode()?.nodes([])
			this.board.clearSelection()

			// captura donde empezo el arrastre para despues delegarlo al metodo que lo mueve
			const pos = this.getRelativePos()
			this.isSelecting = true
			this.selectionStartPos = { x: pos.x, y: pos.y }

			//activa el cuadrado invicivle previamente definido, el metodo mouse lo movera
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

		if (tool === 'TEXT') {
			//captura la posicion de la coordenada, se hizo cuando se cleco
			const pos = this.getRelativePos()
			if (!pos) return //si fallo sale
			const newShape: Shape = {
				name: `shape-${crypto.randomUUID()}`, // se le asigna un name util para el socket
				type: 'TEXT',
				x: pos.x, //pone la posicion actual
				y: pos.y, //pone la pisicion actual
				fill: this.board.activeColor(), // se le asgina el color que esta seleccionado el picket el servicio lo guardo y lo persistio
				fontSize: this.board.fontSize(),
				fontFamily: this.board.fontFamily(),
				text: 'Texto',
				draggable: false,
			}

			this.board.addShape(newShape) // lo guarda en el servicio
			this.selectShapeAfterCreate(newShape.name) // lo seleccionado de imnediato
			return
		}

		// si clickeaste una forma no pasa nada
		if (target !== stage) return
		//Despues los if previos solo quedan para las figuras rect o circle lo que se valla a dibujar
		const pos = this.getRelativePos() // captura la posicion
		if (!pos) return
		this.isDrawing = true // se activia el dibujo
		this.startPos = { x: pos.x, y: pos.y } // almacena el click
		//prepara el preview, con metodos vacios pero capturando la posicion donde empezara a dibujarse
		if (tool === 'ARROW') {
			this.previewShape.set({
				name: 'preview',
				type: tool,
				x: 0,
				y: 0,
				points: [pos.x, pos.y, pos.x, pos.y],
				pointerLength: 15,
				pointerWidth: 15,
				fill: 'none',
				stroke: this.board.activeColor(),
				strokeWidth: 5,
				dash: [5, 5],
			})
		} else {
			this.previewShape.set({
				name: 'preview',
				type: tool,
				x: pos.x,
				y: pos.y,
				width: 0,
				height: 0,
				radius: 0,
				fill: 'none',
				stroke: this.board.activeColor(),
				strokeWidth: 2,
				dash: [5, 5],
				numPoints: 5,
				innerRadius: 0,
				outerRadius: 0,
				sides: 6,
			})
		}
	}

	//movimiento en la pizarra
	@HostListener('window:mousemove', ['$event'])
	handleMouseMove(event: MouseEvent): void {
		const tool = this.board.activeTool()

		if (tool === 'HAND' && this.isPanning) {
			const stage = this.getStage()
			const pos = stage.getPointerPosition()!
			stage.x(stage.x() + pos.x - this.lastPanPos.x) //mueve el canvas calculando la posicion anterior con la actual y recalculando el desplazamineto
			stage.y(stage.y() + pos.y - this.lastPanPos.y) // igual aqui
			this.lastPanPos = { x: pos.x, y: pos.y }
			stage.batchDraw() // agrupa todos los cambios y los redibuja
			return
		}

		if (tool === 'SELECT' && this.isSelecting) {
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

		if (!this.isDrawing || !this.previewShape()) return // si no existe preview no dibuja nada

		//si la figura se estira o achica captura el tamaño nuevo
		const pos = this.getRelativePos()
		const newWidth = pos.x - this.startPos.x
		const newHeight = pos.y - this.startPos.y
		const newPoints = [this.startPos.x, this.startPos.y, pos.x, pos.y]
		if (tool === 'RECT') {
			this.previewShape.update((s) => ({ ...s, width: newWidth, height: newHeight })) // mantiene lo anterior ...s , y solo actualiza el tamaño
		} else if (tool === 'CIRCLE') {
			const r = Math.sqrt(Math.pow(newWidth, 2) + Math.pow(newHeight, 2)) // pitagoras para calcular el radio para tomar el tamaño
			this.previewShape.update((s) => ({ ...s, radius: r }))
		} else if (tool === 'ARROW') {
			this.previewShape.update((s) => ({
				...s,
				points: newPoints,
			}))
		} else if (tool === 'START') {
			this.previewShape.update((s) => ({
				...s,
				numPoints: 5, // número de puntas
				innerRadius: newWidth / 2, // radio interior
				outerRadius: Math.sqrt(Math.pow(newWidth, 2) + Math.pow(newHeight, 2)), // radio exterior igual que el círculo
			}))
		} else if (tool === 'POLYGON') {
			const r = Math.sqrt(Math.pow(newWidth, 2) + Math.pow(newHeight, 2)) // pitagoras para calcular el radio para tomar el tamaño

			this.previewShape.update((s) => ({
				...s,
				radius: r,
			}))
		}
	}

	@HostListener('window:mouseup')
	handleMouseUp(): void {
		//cuando se suelta el hand actualiza el curso y se actualiza la bandera isPannig
		if (this.isPanning) {
			this.isPanning = false
			this.updateCursor(this.board.activeTool())
			return
		}

		//cuando se suelta el select, ya termino de agrupar a las figuras, muestra un cuadro con las figuras agrupadas
		if (this.isSelecting) {
			this.isSelecting = false
			this.selectionRect.visible(false) //oculta el cuadrado grupal y actualiza el estado

			const box = this.selectionRect.getClientRect() // obtiene las coordenadas finales del cudrado que agrupo a todoas las formas
			const stage = this.getStage()
			const layer = stage.getLayers()[0]

			// filtra los nodos de layer y devuelve solo nodos que interceptaron con el rectangulo de agrupamiento
			const selected = layer.getChildren((node) => {
				if (node === this.selectionRect) return false
				if (node instanceof Konva.Transformer) return false
				if ((node as any).name?.() === 'preview') return false
				if (!node.isVisible()) return false

				return Konva.Util.haveIntersection(box, node.getClientRect())
			})
			// despues detener todos los nodos nos permite mover todas las figuras agrupadas como una sola
			selected.forEach((node) => node.draggable(true))
			this.getTransformerNode()?.nodes(selected)
			this.board.setSelectedShapes(selected.map((n) => (n as any).name()))
			layer.batchDraw()
			return
		}

		if (!this.isDrawing) return // si no esta dibujando sale

		const finalPreview = this.previewShape()
		//dibuja el preview, si es menos a 5 no lo dibuja evitando accidentes de click y solo pintando lo necesario
		if (finalPreview) {
			if (
				Math.abs(finalPreview.width) > 5 ||
				finalPreview.radius > 5 ||
				finalPreview.outerRadius > 5 ||
				(finalPreview.points &&
					Math.hypot(
						finalPreview.points[2] - finalPreview.points[0],
						finalPreview.points[3] - finalPreview.points[1],
					) > 5)
			) {
				this.addFinalShape(finalPreview)
			}
		}

		//terminando de dibujar, se actualiza la bandera y desaparece el preview
		this.isDrawing = false
		this.previewShape.set(null)
	}
	@HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent): void {
		const tag = (event.target as HTMLElement).tagName
		if (tag === 'TEXTAREA' || tag === 'INPUT') return //  ignora si estás escribiendo

		if (event.key !== 'Delete' && event.key !== 'Backspace') return

		const names = this.board.selectedShapeNames()
		if (names.length === 0) return

		names.forEach((name) => this.board.removeShape(name))
		this.getTransformerNode()?.nodes([])
		this.board.clearSelection()
	}
	//cuando se preciona el canvas,este metodo deselecciona lo que se aya seleccionado
	handleStageClick(event: any): void {
		const e = event.target ? event : event.event
		if (e.target === e.target.getStage()) {
			//verifica que el click sea en el canvas y no en una figura
			const transformer = this.getTransformerNode()
			transformer?.nodes().forEach((node: Konva.Node) => node.draggable(false)) // las formas vuelven a ser estaticas
			transformer?.nodes([]) //sele quita las manijas alas figuras osea se borra la seleccion de las dinmensiones
			this.board.clearSelection() // se limpia la seleccion
		}
	}

	//metodos shift para seleccion multiple
	handleShapeClick(event: any): void {
		if (this.board.activeTool() !== 'SELECT') return // si no esta en la herramineta select se ignora

		const e = event.target ? event : event.event
		e.cancelBubble = true // cancela que el metodo del handleStangeClick, osea permite que la seleccion exista cuando se seleccione otra figura
		// solo habil para el metodo swift si no existe el swhit entonce este metodo se tiene que habilitar denuevo
		const shape = e.target
		const transformer = this.getTransformerNode()

		const isShiftPressed = e.evt?.shiftKey //captura el swhit
		if (isShiftPressed) {
			const currentNodes = transformer?.nodes() ?? []
			const alreadySelected = currentNodes.includes(shape)
			let newNodes: Konva.Node[]
			if (alreadySelected) {
				shape.draggable(false)
				newNodes = currentNodes.filter((n: Konva.Node) => n !== shape)
			} else {
				shape.draggable(true)
				newNodes = [...currentNodes, shape]
			}
			transformer?.nodes(newNodes)
			this.board.setSelectedShapes(newNodes.map((n: any) => n.name()))
		} else {
			transformer?.nodes().forEach((node: Konva.Node) => node.draggable(false))
			shape.draggable(true)
			transformer?.nodes([shape])
			this.board.setSelectedShapes([shape.name()])
		}
	}

	handleDragStart(): void {
		// No limpiamos el transformer al arrastrar para mantener la selección múltiple
	}

	//sockets---
	//guarda la nueva posicion en el servicio util para el socket
	handleDragEnd(event: any): void {
		const e = event.target ? event : event.event
		const shape = e.target
		console.log('dragEnd x:', shape.x(), 'y:', shape.y()) // qué guarda

		this.board.updateShape({
			name: shape.name(),
			x: shape.x(),
			y: shape.y(),
			scaleX: shape.scaleX(),
			scaleY: shape.scaleY(),
			width: shape.width(),
			height: shape.height(),
			...(shape.radius && typeof shape.radius === 'function' && { radius: shape.radius() }),
		})
	}

	//guarda la nueva figura en el serivico util para el socket
	handleTransformEnd(event: any): void {
		const e = event.target ? event : event.event
		const shape = e.target

		const payload: Partial<Shape> & { name: string } = {
			name: shape.name(),
			x: shape.x(),
			y: shape.y(),
			scaleX: shape.scaleX(),
			scaleY: shape.scaleY(),
			rotation: shape.rotation(),
			...(shape.radius && typeof shape.radius === 'function' && { radius: shape.radius() }),
		}

		if (shape.className === 'Rect') {
			payload.width = shape.width() * shape.scaleX()
			payload.height = shape.height() * shape.scaleY()
			payload.scaleX = 1
			payload.scaleY = 1
			shape.width(payload.width)
			shape.height(payload.height)
			shape.scaleX(1)
			shape.scaleY(1)
		}

		this.board.updateShape(payload)
	}

	//implementacion del texto
	handleTextDblClick(event: any, name: string): void {
		const e = event.event ?? event
		const textNode = e.target as Konva.Text
		const stage = this.getStage()

		textNode.hide()

		const textPosition = textNode.absolutePosition()
		const stageBox = stage.container().getBoundingClientRect()
		const areaPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y,
		}

		const textarea = document.createElement('textarea')

		document.body.appendChild(textarea)

		textarea.value = textNode.text()
		textarea.style.position = 'absolute'
		textarea.style.top = areaPosition.y + 'px'
		textarea.style.left = areaPosition.x + 'px'
		textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`
		textarea.style.fontSize = `${textNode.fontSize()}px`
		textarea.style.border = 'none'
		textarea.style.padding = '0px'
		textarea.style.margin = '0px'
		textarea.style.overflow = 'hidden'
		textarea.style.background = 'none'
		textarea.style.outline = 'none'
		textarea.style.resize = 'none'
		textarea.style.lineHeight = textNode.lineHeight().toString()
		textarea.style.fontFamily = textNode.fontFamily()
		textarea.style.transformOrigin = 'left top'
		textarea.style.textAlign = textNode.align()
		textarea.style.color = textNode.fill().toString()

		const rotation = textNode.rotation()
		if (rotation) {
			textarea.style.transform = `rotateZ(${rotation}deg)`
		}

		// auto ajuste inicial
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight + 3}px`
		textarea.focus()

		// auto ajuste mientras escribe
		textarea.addEventListener('input', () => {
			const scale = textNode.getAbsoluteScale().x
			textarea.style.width = `${textNode.width() * scale}px`
			textarea.style.height = 'auto'
			textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()}px`
		})

		// blur con comparación
		const originalText = textNode.text()
		textarea.addEventListener('blur', () => {
			textNode.show()
			document.body.removeChild(textarea)
			if (textarea.value === originalText) return
			textNode.text(textarea.value)
			this.board.updateShape({ name, text: textarea.value })
		})

		textarea.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) textarea.blur()
			if (e.key === 'Escape') {
				textNode.show()
				document.body.removeChild(textarea)
			}
		})
	}
	//metodo que permite que todas las formas esten selecciondas visualmente en el canvas
	private getTransformerNode(): Konva.Transformer | null {
		return (this.transformer?.getNode() as Konva.Transformer) ?? null
	}

	//convierte el preview eun una forma real
	private addFinalShape(preview: any): void {
		const newShape: Shape = {
			...preview, //copia el tamaño del preview
			name: `shape-${crypto.randomUUID()}`, //se le asigna un identificador util para el socket
			fill: this.board.activeColor(), // se le asigan un color del picker seleccionado
			dash: [], // se le quita los puntitos del preview
			draggable: false, //empieza estatica
		}

		// se guarda en el servicio
		this.board.addShape(newShape)
		//despues de crear pasara al metodo que lo va poner en seleccion listo para arrastrar
		this.selectShapeAfterCreate(newShape.name)
	}

	private selectShapeAfterCreate(name: string): void {
		//despues de crear cambia la opcion a select
		this.board.setTool('SELECT')
		//aplica un tiempo
		setTimeout(() => {
			const stage = this.getStage()
			const layer = stage?.getLayers()[0]
			//busca el elemnto por el nombre para encontrar el nodo
			const node = layer?.findOne(`.${name}`)
			if (!node) return // si no existe retorna

			node.draggable(true) //permitie moverlo
			this.getTransformerNode()?.nodes([node]) //muestra las manijas
			this.board.setSelectedShapes([name]) //
			layer?.batchDraw()
		}, 0)
	}

	// conejos
	private bunnies: Array<{ x: number; y: number; speedX: number; speedY: number }> = []
	private bunnyNodes: Konva.Image[] = []
	private bunnyAnimationId = 0
	private bunnyImage!: HTMLImageElement

	private loadAndStartBunnies() {
		if (this.bunnyImage) {
			this.startBunnies()
			return
		}
		const img = new Image()
		img.src = 'https://konvajs.org/assets/bunny.png'
		img.onload = () => {
			this.bunnyImage = img
			this.startBunnies()
		}
	}

	private startBunnies() {
		const stage = this.getStage()
		const layer = stage.getLayers()[0]

		// crea 100 conejitos
		this.bunnies = Array(100)
			.fill(0)
			.map(() => ({
				x: Math.random() * stage.width(),
				y: Math.random() * stage.height(),
				speedX: Math.random() * 10,
				speedY: Math.random() * 10 - 5,
			}))

		// agrega nodos Konva directamente
		this.bunnyNodes = this.bunnies.map((bunny) => {
			const node = new Konva.Image({
				image: this.bunnyImage,
				x: bunny.x,
				y: bunny.y,
				listening: false, // no interfiere con clicks
			})
			layer.add(node)
			return node
		})

		const w = stage.width()
		const h = stage.height()
		const iw = this.bunnyImage.width
		const ih = this.bunnyImage.height

		const update = () => {
			this.bunnies.forEach((bunny, i) => {
				bunny.x += bunny.speedX
				bunny.y += bunny.speedY
				bunny.speedY += 0.75 // gravedad

				if (bunny.x > w - iw) {
					bunny.speedX *= -1
					bunny.x = w - iw
				} else if (bunny.x < 0) {
					bunny.speedX *= -1
					bunny.x = 0
				}

				if (bunny.y > h - ih) {
					bunny.speedY *= -0.85
					bunny.y = h - ih
					if (Math.random() > 0.5) bunny.speedY -= Math.random() * 6
				} else if (bunny.y < 0) {
					bunny.speedY = 0
					bunny.y = 0
				}

				this.bunnyNodes[i]?.x(bunny.x)
				this.bunnyNodes[i]?.y(bunny.y)
			})

			layer.batchDraw()
			this.bunnyAnimationId = requestAnimationFrame(update)
		}

		update()
	}

	private stopBunnies() {
		cancelAnimationFrame(this.bunnyAnimationId)
		const stage = this.getStage()
		if (!stage) return
		// elimina los nodos del layer
		this.bunnyNodes.forEach((node) => node.destroy())
		this.bunnyNodes = []
		this.bunnies = []
		stage.getLayers()[0].batchDraw()
	}
}
