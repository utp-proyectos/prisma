import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarItem,
	NavUser,
	NavHeader,
	type SidebarItemProps,
} from '@/shared/components/sidebar'
import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { Router, RouterLink, RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
	lucideTriangle,
	lucideClock,
	lucidePlus,
	lucideUsers,
	lucideChevronDown,
	lucideLayoutGrid,
} from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { CreateTeamModalState } from '../../services/create-team-modal-state'
import { TeamApi } from '../../services/team-api'
import { TeamRequest } from '../../models/team-request.model'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { toast } from '@spartan-ng/brain/sonner'
import { TeamIdState } from '../../services/team-id-state'

@Component({
	selector: 'app-home-layout',
	imports: [
		RouterOutlet,
		Sidebar,
		SidebarHeader,
		SidebarContent,
		SidebarFooter,
		HlmButtonImports,
		NgIcon,
		HlmSelectImports,
		SidebarItem,
		NavUser,
		NavHeader,
		RouterLink,
		HlmFieldImports,
		HlmInputImports,
		HlmDialogImports,
		FormField,
		FormRoot,
	],
	providers: [
		CreateTeamModalState,
		TeamApi,
		TeamIdState,
		provideIcons({
			lucideTriangle,
			lucideClock,
			lucidePlus,
			lucideUsers,
			lucideChevronDown,
			lucideLayoutGrid,
		}),
	],
	templateUrl: './home-layout.html',
	styles: ``,
})
export class HomeLayout {
	protected teamId = signal<string | null>(null)

	createTeamModalState = inject(CreateTeamModalState)
	teamApi = inject(TeamApi)
	router = inject(Router)
	teamIdState = inject(TeamIdState)

	createTeamModal = computed(() => this.createTeamModalState.createTeamModal())

	teamResource = this.teamApi.teamResource

	protected readonly items: SidebarItemProps[] = [
		{
			icon: 'lucideClock',
			title: 'Recientes',
			to: '/',
			exact: true,
		},
	]

	teamModel = signal<TeamRequest>({ name: '' })

	teamForm = form(
		this.teamModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre es requerido' })
			minLength(schemaPath.name, 2, { message: 'El nombre debe tener al menos 2 caracteres' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					try {
						const team = await this.teamApi.createTeam(data().value())

						this.createTeamModalState.close()

						toast.success('Equipo creado')

						this.router.navigate(['/team', team.id])

						this.teamId.set(team.id)
					} catch (error) {
						// const err = error as HttpErrorResponse
						toast.error('Error al crear el equipo')
					}
				},
			},
		},
	)

	protected readonly isTeamSelected = computed(() => this.teamId() !== null)

	protected readonly itemToString = (value: string) =>
		this.teamResource.value()?.data.find((item) => item.id === value)?.name || ''

	closeCreateTeamModal() {
		this.createTeamModalState.close()
		this.teamForm().reset({ name: '' })
	}

	constructor() {
		effect(() => {
			if (this.teamResource.hasValue() && this.teamResource.value().data.length) return
			const id = this.teamIdState.teamId()

			if (id) {
				this.teamId.set(id)
			}
		})
	}
}
