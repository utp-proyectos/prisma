import { inject, Injectable } from '@angular/core'
import { KanbanApi } from './kanban.api'
import { KanbanState } from './kanban.state'
import { Subscription } from 'rxjs'
import { AuthService } from '@/core/servies/auth.serive'

@Injectable()
export class KanbanBoardRealtime {
	private readonly api = inject(KanbanApi)
	private readonly kanbanState = inject(KanbanState)
	private readonly authService = inject(AuthService)

	private kanbanSub?: Subscription

	connect(teamId: string, projectId: string) {
		this.kanbanSub?.unsubscribe()

		this.kanbanSub = this.api.getKanbans(projectId, teamId).subscribe((event) => {
			const currentUserId = this.authService.currentUser()?.id

			switch (event.action) {
				case 'CREATE':
					if (event.payload.privateSwitch && event.payload.creatorId !== currentUserId) {
						break
					}
					this.kanbanState.addKanban(event.payload)
					break

				case 'UPDATE':
					if (event.payload.privateSwitch && event.payload.creatorId !== currentUserId) {
						this.kanbanState.removeKanban(event.payload.id)
					} else {
						const exists = this.kanbanState.kanbanIds().has(event.payload.id)
						if (exists) {
							this.kanbanState.updateKanban(event.payload)
						} else {
							this.kanbanState.addKanban(event.payload)
						}
					}
					break

				case 'DELETE':
					this.kanbanState.removeKanban(event.payload.id)
					break
			}
		})
	}

	disconnect() {
		this.kanbanSub?.unsubscribe()
	}
}
