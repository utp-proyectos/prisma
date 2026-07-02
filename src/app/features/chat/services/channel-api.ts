import { ApiResponse } from '@/core/models/api-response.model'
import { HttpClient, httpResource } from '@angular/common/http'
import { inject, Service, Signal } from '@angular/core'
import { ChannelResponse } from '../model/channel-response'
import { ChannelDetailResponse } from '../model/channel-detail-response'

@Service()
export class ChannelApi {
	http = inject(HttpClient)

	getChannels(projectId: Signal<string | undefined>) {
		return httpResource<ApiResponse<ChannelResponse[]>>(() => `/projects/${projectId()}/channels`)
	}

	getChannel(projectId: Signal<string | undefined>, channelId: Signal<string | undefined>) {
		return httpResource<ApiResponse<ChannelDetailResponse>>(
			() => `/projects/${projectId()}/channels/${channelId()}`,
		)
	}
}
