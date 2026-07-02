import { WsResponse } from '@/core/models/ws-response'
import { Websocket } from '@/core/servies/websocket'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'
import { MessageResponse } from '../model/message-response'
import { CreateMessageRequest } from '../model/create-message-request'

@Injectable()
export class MessageWs {
	ws = inject(Websocket)

	watchMessages(teamId: string, projectId: string, channelId: string) {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/${channelId}/messages`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<MessageResponse>))
	}

	sendMessage(payload: CreateMessageRequest) {
		this.ws.publish('/app/message.create', payload)
	}
}
