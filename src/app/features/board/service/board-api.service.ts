// board.service.ts
import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Board } from '../models/board-response'
import { BoardRequest } from '../models/board-request'
import { Folder } from '../models/folder.model'
import { BoardDetail } from '../models/board-detail'
import { FolderRequest } from '../models/folder-request'

@Injectable({ providedIn: 'root' })
export class BoardApiService {
	private http = inject(HttpClient)
	private baseUrl = 'http://localhost:8080/api'

	private projectId = 'test-project-1' // temporal
	getCanvas(boardId: string) {
		return this.http.get(
			`${this.baseUrl}/boards/${boardId}/canvas`,
			//el backend va devolver un string
			{ responseType: 'text' },
		)
	}

	// guarda canva
	saveCanvas(boardId: string, konvaData: object) {
		return this.http.patch(`${this.baseUrl}/boards/${boardId}/canvas`, JSON.stringify(konvaData), {
			// lo pasa como string para el redis
			headers: { 'Content-Type': 'application/json' },
		})
	}
	//getAllBoards
	getBoards(projectId: string, isPrivate: boolean) {
		return this.http.get<Board[]>(`${this.baseUrl}/projects/${projectId}/boards`, {
			params: { isPrivate },
		})
	}

	//getAllFolder
	getFolders(projectId: string, isPrivate: boolean) {
		return this.http.get<Folder[]>(`${this.baseUrl}/projects/${projectId}/folders`, {
			params: { isPrivate },
		})
	}

	getBoardDetail(boardId: string) {
		return this.http.get<BoardDetail>(`${this.baseUrl}/boards/${boardId}`)
	}

	//getFolder{id}
	getFolder(folderId: string) {
		return this.http.get<Folder>(`${this.baseUrl}/folders/${folderId}`)
	}

	//create board
	createBoard(projectId: string, dto: BoardRequest) {
		return this.http.post<Board>(`${this.baseUrl}/projects/${projectId}/boards`, dto)
	}

	//create folder
	createFolder(projectId: string, dto: FolderRequest) {
		return this.http.post<Folder>(`${this.baseUrl}/projects/${projectId}/folders`, dto)
	}

	//moveBoardToFolder
	moveToFolder(boardId: string, folderId: string) {
		return this.http.patch<Board>(`${this.baseUrl}/boards/${boardId}/move-to-folder`, null, {
			params: { folderId },
		})
	}
	//sacar del folder
	removeFromFolder(boardId: string) {
		return this.http.patch(`${this.baseUrl}/boards/${boardId}/remove-from-folder`, null)
	}
	//deleteBoard
	deleteBoard(boardId: string) {
		return this.http.delete(`${this.baseUrl}/boards/${boardId}`)
	}

	//deleteFolder
	deleteFolder(folderId: string) {
		return this.http.delete(`${this.baseUrl}/folders/${folderId}`)
	}
}
