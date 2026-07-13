import { inject, Injectable } from '@angular/core'
import { MilestoneApi } from './milestone.api'
import { MilestoneState } from './milestone.state'
import { ColumnTaskState } from '../../service/column-task/column-task-state'
import { Subscription } from 'rxjs'

@Injectable()
export class MilestoneRealtime {
	private readonly api = inject(MilestoneApi)
	private readonly milestoneState = inject(MilestoneState)
	private readonly columnTaskState = inject(ColumnTaskState)

	private milestoneSub?: Subscription
	private milestoneDetailSub?: Subscription

	connect(teamId: string, projectId: string, kanbanId: string) {
		this.connectMilestones(teamId, projectId, kanbanId)
		this.connectMilestoneDetail(teamId, projectId, kanbanId)
	}

	private connectMilestones(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneSub?.unsubscribe()

		this.milestoneSub = this.api.getMilestones(teamId, projectId, kanbanId).subscribe((event) => {
			switch (event.action) {
				case 'CREATE':
					this.milestoneState.addMilestone(event.payload)
					break

				case 'UPDATE':
					this.milestoneState.updateMilestone(event.payload)
					break

				case 'DELETE':
					this.milestoneState.removeMilestone(event.payload)
					this.columnTaskState.disassociateMilestoneFromTasks(event.payload.id)

					break
			}
		})
	}

	private connectMilestoneDetail(teamId: string, projectId: string, kanbanId: string) {
		this.milestoneDetailSub?.unsubscribe()

		this.milestoneDetailSub = this.api
			.getMilestoneDetail(teamId, projectId, kanbanId)
			.subscribe((event) => {
				if (event.action !== 'UPDATE') return

				const selected = this.milestoneState.selectedMilestoneId()

				if (!selected) return

				if (selected !== event.payload.id) return

				this.milestoneState.setDetail(event.payload)
			})
	}

	disconnect() {
		this.milestoneSub?.unsubscribe()
		this.milestoneDetailSub?.unsubscribe()
	}
}
