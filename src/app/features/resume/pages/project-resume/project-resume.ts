import { TeamApi } from '@/features/home/services/team-api'
import { Component, computed, effect, inject, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideCalendar,
	lucideCalendarDays,
	lucideClipboardList,
	lucideClock3,
	lucideEllipsis,
	lucideImage,
	lucideLayoutDashboard,
} from '@ng-icons/lucide'

import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmEmptyImports } from '@spartan-ng/helm/empty'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { NgScrollbarModule } from 'ngx-scrollbar'

import { NgScrollbar } from 'ngx-scrollbar'

@Component({
	selector: 'app-project-resume',
	imports: [
		NgIcon,

		HlmCardImports,
		HlmButtonImports,
		HlmBadgeImports,
		HlmEmptyImports,
		HlmSeparatorImports,
		HlmScrollAreaImports,
		NgScrollbarModule,

		NgScrollbar,
	],
	providers: [
		TeamApi,
		provideIcons({
			lucideImage,
			lucideCalendar,
			lucideCalendarDays,
			lucideClock3,
			lucideEllipsis,
			lucideClipboardList,
			lucideLayoutDashboard,
		}),
	],
	templateUrl: './project-resume.html',
	styles: ``,
})
export class ProjectResume {
	readonly teamId = input.required<string>()
	readonly projectId = input.required<string>()
	private readonly teamApi = inject(TeamApi)

	readonly dashboardResource = this.teamApi.dashboardResource(this.teamId, this.projectId)

	readonly dashboard = computed(() => {
		if (!this.dashboardResource.hasValue()) {
			return null
		}

		return this.dashboardResource.value()!.data
	})

	readonly taskStats = computed(() => this.dashboard()?.taskStats)
	readonly upcomingTasks = computed(() => this.dashboard()?.upcomingTasks ?? [])
	readonly todaysEvents = computed(() => this.dashboard()?.todaysEvents ?? [])
	readonly completedPercentage = computed(() => this.taskStats()?.completedPercentage ?? 0)
	readonly remainingPercentage = computed(() => this.taskStats()?.remainingPercentage ?? 0)

	constructor() {
		effect(() => {
			if (!this.dashboardResource.hasValue()) return

			console.log(this.dashboard())
		})
	}
}
