export interface KanbanDeadline {
	id: string
	title: string
	date: Date
	cardId: string
	boardName?: string
	description?: string
	color?: string
}