import { Routes } from '@angular/router'

export const invitationRoutes: Routes = [
	{
		path: 'accept',
		loadComponent: () =>
			import('./pages/accept-invitation/accept-invitation').then((m) => m.AcceptInvitation),
	},
]
