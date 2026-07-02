import { Injectable, signal, computed, inject } from '@angular/core'
import { CanvasWsService } from './canvas-ws-service'

export type ShapeType =
	| 'CIRCLE'
	| 'RECT'
	| 'TEXT'
	| 'ARROW'
	| 'START'
	| 'POLYGON'
	| 'LINE'
	| 'PENCIL'
export type ToolType =
	| 'NONE'
	| 'HAND'
	| 'SELECT'
	| 'RECT'
	| 'CIRCLE'
	| 'TEXT'
	| 'PENCIL'
	| 'ARROW'
	| 'START'
	| 'POLYGON'
	| 'LINE'
export type ColorTarget = 'fill' | 'stroke'

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
	lineCap?: 'butt' | 'round' | 'square'
	lineJoin?: 'round' | 'bevel' | 'miter'
	tension?: number
}

@Injectable({ providedIn: 'root' })
export class BoardStateService {
	//  Herramienta activa
	private canvasWsService = inject(CanvasWsService)
	private boardId = signal<string | null>(null)

	activeTool = signal<ToolType>('HAND')

	setTool(tool: ToolType): void {
		this.activeTool.set(tool)
	}

	// Estilo activo iniciado - toda figura o letra tomas estos valores por default
	activeColor = signal<string>('#6366f1')
	colorTarget = signal<ColorTarget>('fill')
	fontFamily = signal<string>('Arial')
	fontSize = signal<number>(20)

	// cambio de fondo
	backgroundColor = signal<string>('#121212')
	strokeColor = signal<string>('#121212')
	setColor(color: string): void {
		this.activeColor.set(color)
	}

	setBackgroundColor(color: string): void {
		this.backgroundColor.set(color)
	}
	setStrokeColor(color: string): void {
		this.strokeColor.set(color)
	}
	setColorTarget(target: ColorTarget): void {
		this.colorTarget.set(target)
	}

	setFontFamily(font: string): void {
		this.fontFamily.set(font)
	}

	setFontSize(size: number): void {
		this.fontSize.set(size)
	}

	//  Shapes
	shapes = signal<Shape[]>([])
	selectedShapeNames = signal<string[]>([])

	selectedShapes = computed(() => {
		const names = this.selectedShapeNames()
		return this.shapes().filter((s) => names.includes(s.name))
	})
	//api - save y load
	// metodo para guardar las figuars
	saveBoard(): object {
		return {
			shapes: this.shapes(),
			backgroundColor: this.backgroundColor(),
			strokeColor: this.strokeColor(),
		}
	}
	// cargar lienzo
	loadBoard(data: any): void {
		this.shapes.set(data.shapes)
		this.backgroundColor.set(data.backgroundColor)
		this.strokeColor.set(data.strokeColor)
	}
	//socket
	setBoardId(id: string) {
		this.boardId.set(id)
	}

	addShape(shape: Shape): void {
		this.shapes.update((current) => [...current, shape])
		console.log('enviando shape, boardId:', this.boardId())
		this.canvasWsService.sendShape(this.boardId()!, 'CREATE', shape)
	}

	updateShape(payload: Partial<Shape> & { name: string }, remote = false): void {
		this.shapes.update((current) =>
			current.map((s) => (s.name === payload.name ? ({ ...s, ...payload } as Shape) : s)),
		)
		if (!remote) {
			this.canvasWsService.sendShape(this.boardId()!, 'UPDATE', payload)
		}
	}
	removeShape(name: string): void {
		this.shapes.update((current) => current.filter((s) => s.name !== name))
		this.canvasWsService.sendShape(this.boardId()!, 'DELETE', { name })
	}

	updateShapesBatch(names: string[], payload: Partial<Shape>): void {
		this.shapes.update((current) =>
			current.map((s) => (names.includes(s.name) ? ({ ...s, ...payload } as Shape) : s)),
		)
		names.forEach((name) => {
			this.canvasWsService.sendShape(this.boardId()!, 'UPDATE', { name, ...payload })
		})
	}

	// ─── Selección
	setSelectedShapes(names: string[]): void {
		this.selectedShapeNames.set(names)
	}

	clearSelection(): void {
		this.selectedShapeNames.set([])
	}

	//anti estres
	bunnyMode = signal(false)

	activateBunnyMode() {
		this.bunnyMode.set(true)
		setTimeout(() => this.bunnyMode.set(false), 10000)
	}
}
