import { computed, Injectable, signal } from '@angular/core'
import { ChecklistDetailResponse } from '../../models/checklist/checklist-detail-response.model'

@Injectable()
export class ChecklistState {
	private readonly checklistsByTask = signal(new Map<string, ChecklistDetailResponse[]>())

	getByTask(taskId: string) {
		return this.checklistsByTask().get(taskId) ?? []
	}

	setChecklists(checklists: ChecklistDetailResponse[]) {
		const map = new Map<string, ChecklistDetailResponse[]>()

		for (const checklist of checklists) {
			const list = map.get(checklist.taskId)

			if (list) {
				list.push(checklist)
			} else {
				map.set(checklist.taskId, [checklist])
			}
		}

		this.checklistsByTask.set(map)
	}

	addChecklist(checklist: ChecklistDetailResponse) {
		this.checklistsByTask.update((current) => {
			const map = new Map(current)

			const list = map.get(checklist.taskId) ?? []

			map.set(checklist.taskId, [...list, checklist])

			return map
		})
	}

	updateChecklist(checklist: ChecklistDetailResponse) {
		this.checklistsByTask.update((current) => {
			const map = new Map(current)

			const list = map.get(checklist.taskId)

			if (!list) return map

			map.set(
				checklist.taskId,
				list.map((c) => (c.id === checklist.id ? checklist : c)),
			)

			return map
		})
	}

	removeChecklist(id: string, taskId: string) {
		this.checklistsByTask.update((current) => {
			const map = new Map(current)

			const list = map.get(taskId)

			if (!list) return map

			const updated = list.filter((c) => c.id !== id)

			if (updated.length === 0) {
				map.delete(taskId)
			} else {
				map.set(taskId, updated)
			}

			return map
		})
	}
}
