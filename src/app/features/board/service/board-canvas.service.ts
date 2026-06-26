import { Injectable, signal, computed } from '@angular/core'

export type ShapeType = 'CIRCLE' | 'RECT' | 'TEXT' | 'ARROW' | 'START' | 'POLYGON'
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
}

@Injectable({ providedIn: 'root' })
export class BoardStateService {
	//  Herramienta activa
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

	setColor(color: string): void {
		this.activeColor.set(color)
	}

	setBackgroundColor(color: string): void {
		this.backgroundColor.set(color)
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
		}
	}
	// cargar lienzo
	loadBoard(data: any): void {
		this.shapes.set(data.shapes)
		this.backgroundColor.set(data.backgroundColor)
	}
	//socket
	addShape(shape: Shape): void {
		this.shapes.update((current) => [...current, shape])
		console.log('Listo para enviar creación por socket:', shape)
	}

	updateShape(payload: Partial<Shape> & { name: string }): void {
		this.shapes.update((current) =>
			current.map((s) => (s.name === payload.name ? ({ ...s, ...payload } as Shape) : s)),
		)
		console.log('Listo para enviar actualización por socket:', payload)
	}

	updateShapesBatch(names: string[], payload: Partial<Shape>): void {
		this.shapes.update((current) =>
			current.map((s) => (names.includes(s.name) ? ({ ...s, ...payload } as Shape) : s)),
		)
		console.log('Listo para enviar actualización batch por socket:', names, payload)
	}

	removeShape(name: string): void {
		this.shapes.update((current) => current.filter((s) => s.name !== name))
		console.log('Listo para enviar eliminación por socket:', name)
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
