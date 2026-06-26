import { Board } from './board-response'

export interface Folder {
	id: string
	name: string
	isPrivate: boolean
	boards: Board[]
	createdAt: string
	updatedAt: string
}
