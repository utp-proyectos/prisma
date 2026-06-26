export interface Board {
	id: string
	name: string
	description: string
	isPrivate: boolean
	folderId: string | null
	thumbnailUrl: string | null
	createdAt: string
	updatedAt: string
}
