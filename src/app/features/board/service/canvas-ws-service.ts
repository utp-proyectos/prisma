import { Websocket } from '@/core/servies/websocket'
import { TeamIdState } from '@/features/home/services/team-id-state'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CanvasWsService {
	private ws = inject(Websocket)
	private teamIdState = inject(TeamIdState)

	sendShape(boardId: string, type: string, shape: any) {
		const teamId = this.teamIdState.teamId() ?? localStorage.getItem('teamId')
		console.log('teamId al enviar:', teamId)
		this.ws.publish('/app/canvas.update', {
			teamId,
			boardId,
			type,
			shape,
		})
	}

	watchCanvas(boardId: string): Observable<any> {
		const teamId = this.teamIdState.teamId() ?? localStorage.getItem('teamId')
		return this.ws
			.watch(`/topic/${teamId}/canvas/${boardId}`)
			.pipe(map((res) => JSON.parse(res.body)))
	}

	watchPresence(boardId: string): Observable<any> {
		const teamId = this.teamIdState.teamId() ?? localStorage.getItem('teamId')
		// Usamos un patrón consistente con tus tópicos
		return this.ws
			.watch(`/topic/${teamId}/presence/${boardId}`)
			.pipe(map((res) => JSON.parse(res.body)))
	}

	publishPresence(boardId: string, user: any) {
		const teamId = this.teamIdState.teamId() ?? localStorage.getItem('teamId')
		this.ws.publish(`/app/boards/${boardId}/presence.join`, {
			teamId,
			...user,
		})
	}

	publishLeave(boardId: string, userId: string) {
		const teamId = this.teamIdState.teamId() ?? localStorage.getItem('teamId')
		this.ws.publish(`/app/boards/${boardId}/presence.leave`, {
			teamId,
			id: userId,
		})
	}
}
