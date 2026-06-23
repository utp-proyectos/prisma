export interface Task {
	id: number
	name: string
	assignedTo: string
	dueDate: string
	priority: 'Alta' | 'Media' | 'Baja'
	status: 'Completado' | 'En curso' | 'Pendiente'
}
