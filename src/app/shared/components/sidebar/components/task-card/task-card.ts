import { Component, input } from '@angular/core'
import { Task } from './task.model'
import { lucideCalendar, lucideFlag, lucideMoreHorizontal, lucideUsers } from '@ng-icons/lucide'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmCardImports } from '@spartan-ng/helm/card'

@Component({
	selector: 'app-task-card',
	standalone: true,
	templateUrl: './task-card.html',
	imports: [NgIcon, HlmCardImports],
	providers: [
		provideIcons({
			lucideMoreHorizontal,
			lucideUsers,
			lucideCalendar,
			lucideFlag,
		}),
	],
})
export class TaskCardComponent {
	task = input.required<Task>()
}
