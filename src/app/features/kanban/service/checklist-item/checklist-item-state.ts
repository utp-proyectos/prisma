import { Injectable, signal } from '@angular/core'
import { ChecklistItemResponse } from '../../models/checklist-item/checklist-item-response.model'

@Injectable()
export class ChecklistItemState {
	private readonly itemsByChecklist = signal(new Map<string, ChecklistItemResponse[]>())

	getByChecklist(checklistId: string) {
		return this.itemsByChecklist().get(checklistId) ?? []
	}

	setItems(items: ChecklistItemResponse[]) {
		const map = new Map<string, ChecklistItemResponse[]>()

		for (const item of items) {
			const list = map.get(item.checklistId)

			if (list) {
				list.push(item)
			} else {
				map.set(item.checklistId, [item])
			}
		}

		this.itemsByChecklist.set(map)
	}

	addItem(item: ChecklistItemResponse) {
		this.itemsByChecklist.update((current) => {
			const map = new Map(current)

			const list = map.get(item.checklistId) ?? []

			map.set(item.checklistId, [...list, item])

			return map
		})
	}

	updateItem(item: ChecklistItemResponse) {
		this.itemsByChecklist.update((current) => {
			const map = new Map(current)

			const list = map.get(item.checklistId)

			if (!list) return map

			map.set(
				item.checklistId,
				list.map((i) => (i.id === item.id ? item : i)),
			)

			return map
		})
	}

	removeItem(id: string, checklistId: string) {
		this.itemsByChecklist.update((current) => {
			const map = new Map(current)

			const list = map.get(checklistId)

			if (!list) return map

			const updated = list.filter((i) => i.id !== id)

			if (updated.length === 0) {
				map.delete(checklistId)
			} else {
				map.set(checklistId, updated)
			}

			return map
		})
	}

	progress(checklistId: string) {
		const items = this.getByChecklist(checklistId)

		const completed = items.filter((i) => i.completedItem).length

		return {
			total: items.length,
			completed,
			percentage: items.length ? Math.round((completed / items.length) * 100) : 0,
		}
	}
}
