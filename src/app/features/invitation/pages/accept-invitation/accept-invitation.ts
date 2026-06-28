import { Component, inject, input, OnInit } from '@angular/core'
import { InvitationsApi } from '../../services/invitations-api'
import { Router } from '@angular/router'

@Component({
	selector: 'app-accept-invitation',
	imports: [],
	templateUrl: './accept-invitation.html',
	styles: ``,
})
export class AcceptInvitation implements OnInit {
	token = input<string>()
	invitationsApi = inject(InvitationsApi)
	router = inject(Router)

	ngOnInit() {
		const token = this.token()

		if (!token) {
			this.router.navigate(['/'])
			return
		}

		this.invitationsApi.accept(token).subscribe({
			next: (res) => {
				this.router.navigate(['/team', res.teamId])
			},
			error: () => {
				this.router.navigate(['/'])
			},
		})
	}
}
