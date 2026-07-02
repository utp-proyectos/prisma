import { WsResponse } from '@/core/models/ws-response'
import { Websocket } from '@/core/servies/websocket'
import { inject, Service } from '@angular/core'
import { ChannelResponse } from '../model/channel-response'
import { map } from 'rxjs'
import { CreateChannelRequest } from '../model/create-channel-request'

@Service()
export class ChannelWs {
	ws = inject(Websocket)

	watchChannels(teamId: string, projectId: string) {
		return this.ws
			.watch(`/topic/${teamId}/${projectId}/channels`)
			.pipe(map((res) => JSON.parse(res.body) as WsResponse<ChannelResponse>))
	}

	sendChannel(payload: CreateChannelRequest) {
		this.ws.publish('/app/channel.create', payload)
	}
}
