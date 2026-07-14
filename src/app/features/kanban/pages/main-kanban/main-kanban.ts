import { Component, computed, effect, inject, input, OnDestroy } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideClock, lucidePlus, lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmEmpty } from '@spartan-ng/helm/empty'
import { KanbanApi } from '../../features/kanban/kanban.api'
import { TaskCardComponent } from '@/shared/components/task-card/task-card'
import { KanbanFacade } from '../../features/kanban/kanban.facade'
import { TaskRealtime } from '../../features/task/task.realtime'
import { AuthService } from '@/core/servies/auth.serive'
import { DashboardRefresh } from '../../features/task/dashboard.refresh'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { NgScrollbarModule } from 'ngx-scrollbar'

@Component({
	selector: 'app-main-kanban',
	imports: [
		NgIcon,
		HlmButtonImports,
		HlmSelectImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmSeparatorImports,
		HlmCardImports,
		HlmEmpty,
		HlmSeparatorImports,
		HlmScrollAreaImports,
		NgScrollbarModule,
		TaskCardComponent,
	],
	providers: [provideIcons({ lucidePlus, lucideSearch, lucideClock })],
	templateUrl: './main-kanban.html',
})
export class MainKanban {
	// Inputs obligatorios
	teamId = input.required<string>()
	projectId = input.required<string>()
	kanbanId = input.required<string>()

	// Inyecciones
	readonly authService = inject(AuthService)
	readonly kanbanApi = inject(KanbanApi)
	readonly kanbanFacade = inject(KanbanFacade)
	readonly taskRealtime = inject(TaskRealtime)

	// 1. Inyectamos el servicio de refresco
	private readonly dashboardRefresh = inject(DashboardRefresh)

	// Único recurso necesario para estructurar las columnas y tarjetas
	readonly myTasksResource = this.kanbanApi.myTasksResource()

	readonly myTasks = computed(() => {
		if (!this.myTasksResource.hasValue()) return []
		return this.myTasksResource.value()?.data ?? []
	})

	constructor() {
		effect(() => {
			this.dashboardRefresh.refresh()
			this.myTasksResource.reload()
		})
	}
}
