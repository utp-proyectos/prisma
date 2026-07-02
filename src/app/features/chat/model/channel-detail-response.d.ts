import { MessageResponse } from './message-response'

export interface ChannelDetailResponse {
	id: string
	name: string
	messages: MessageResponse[]
}
