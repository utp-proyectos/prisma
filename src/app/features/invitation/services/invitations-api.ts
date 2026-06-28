import { ApiReponse } from '@/core/models/api-response.model'
import { HttpClient } from '@angular/common/http'
import { inject, Service } from '@angular/core'
import { map } from 'rxjs'
import { type AcceptInvitationResponse } from '../model/aceept-invitation-response'

@Service()
export class InvitationsApi {
	private http = inject(HttpClient)

	accept = (token: string) =>
		this.http
			.get<ApiReponse<AcceptInvitationResponse>>(`/invitations/accept?token=${token}`)
			.pipe(map((res) => res.data))
}
