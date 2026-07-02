// board.service.ts
import { Injectable, Signal, inject } from '@angular/core'
import { HttpClient, httpResource } from '@angular/common/http'
import { Board } from '../models/board-response'
import { BoardRequest } from '../models/board-request'
import { Folder } from '../models/folder.model'
import { BoardDetail } from '../models/board-detail'
import { FolderRequest } from '../models/folder-request'
import { Websocket } from '@/core/servies/websocket'
import { map, Observable, tap } from 'rxjs'
import { ApiReponse } from '../../../core/models/api-response.model'

@Injectable({ providedIn: 'root' })
export class BoardApiService {
	private http = inject(HttpClient)
	private ws = inject(Websocket)

	boardsResource = (projectId: Signal<string | undefined>, isPrivate: boolean) =>
		httpResource<ApiReponse<Board[]>>(() =>
			// ← ApiReponse<Board[]>
			projectId() ? `projects/${projectId()}/boards?isPrivate=${isPrivate}` : undefined,
		)

	foldersResource = (projectId: Signal<string | undefined>, isPrivate: boolean) =>
		httpResource<ApiReponse<Folder[]>>(() =>
			// ← ApiReponse<Folder[]>
			projectId() ? `projects/${projectId()}/folders?isPrivate=${isPrivate}` : undefined,
		)

	//  maneja el canvas de Konva
	getCanvas(boardId: string) {
		return this.http.get(`/boards/${boardId}/canvas`, { responseType: 'text' })
	}

	saveCanvas(boardId: string, konvaData: object) {
		return this.http.patch(`/boards/${boardId}/canvas`, JSON.stringify(konvaData), {
			headers: { 'Content-Type': 'application/json' },
		})
	}
	//  obtiene detalle de un board o folder
	getBoardDetail(boardId: string) {
		return this.http.get<BoardDetail>(`/boards/${boardId}`)
	}

	getFolder(folderId: string) {
		return this.http.get<Folder>(`/folders/${folderId}`)
	}
	// crea un board y devuelve el id para navegar al editor
	createBoard(projectId: string, teamId: string, dto: BoardRequest) {
		return this.http.post<Board>(`/projects/${projectId}/boards`, { ...dto, teamId })
	}

	createFolder(projectId: string, dto: FolderRequest) {
		return this.http.post<Folder>(`/projects/${projectId}/folders`, dto)
	}

	//carga inicial de de datos
	getBoards(projectId: string, isPrivate: boolean) {
		return this.http.get<Board[]>(`/projects/${projectId}/boards`, {
			params: { isPrivate },
		})
	}

	getFolders(projectId: string, isPrivate: boolean) {
		return this.http.get<Folder[]>(`/projects/${projectId}/folders`, {
			params: { isPrivate },
		})
	}

	// boards creados, movidos
	watchBoards(teamId: string, projectId: string): Observable<Board> {
		return this.ws.watch(`/topic/${teamId}/project/${projectId}/boards`).pipe(
			tap((msg) => console.log('mensaje boards:', msg.body)),
			map((res) => JSON.parse(res.body) as Board),
		)
	}

	//boards eliminados
	watchBoardDeletes(teamId: string, projectId: string): Observable<{ boardId: string }> {
		return this.ws
			.watch(`/topic/${teamId}/project/${projectId}/boards/delete`)
			.pipe(map((res) => JSON.parse(res.body)))
	}

	// folders creados
	watchFolders(teamId: string, projectId: string): Observable<Folder> {
		return this.ws
			.watch(`/topic/${teamId}/project/${projectId}/folders`)
			.pipe(map((res) => JSON.parse(res.body) as Folder))
	}

	// folders eliminados
	watchFolderDeletes(teamId: string, projectId: string): Observable<{ folderId: string }> {
		return this.ws
			.watch(`/topic/${teamId}/project/${projectId}/folders/delete`)
			.pipe(map((res) => JSON.parse(res.body)))
	}

	//enviar acciones al servidor
	sendBoard(dto: BoardRequest, teamId: string, projectId: string) {
		this.ws.publish('/app/board.create', { ...dto, teamId, projectId })
	}

	deleteBoard(boardId: string, teamId: string, projectId: string) {
		this.ws.publish('/app/board.delete', { boardId, teamId, projectId })
	}

	moveToFolder(boardId: string, folderId: string, teamId: string, projectId: string) {
		this.ws.publish('/app/board.move', { boardId, folderId, teamId, projectId })
	}

	removeFromFolder(boardId: string, teamId: string, projectId: string) {
		this.ws.publish('/app/board.move', { boardId, folderId: null, teamId, projectId })
	}

	sendFolder(dto: FolderRequest, teamId: string, projectId: string) {
		this.ws.publish('/app/folder.create', { ...dto, teamId, projectId })
	}

	deleteFolder(folderId: string, teamId: string, projectId: string) {
		this.ws.publish('/app/folder.delete', { folderId, teamId, projectId })
	}
}
