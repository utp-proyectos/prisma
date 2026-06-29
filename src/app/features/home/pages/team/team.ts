import {
	Component,
	computed,
	effect,
	inject,
	input,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { CreateTeamModalState } from '../../services/create-team-modal-state'
import {
	lucideChevronDown,
	lucidePen,
	lucideSearch,
	lucideTrash2,
	lucideUsers,
} from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { TeamApi } from '../../services/team-api'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmItemImports } from '@spartan-ng/helm/item'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import {
	disabled,
	email,
	form,
	FormField,
	FormRoot,
	minLength,
	required,
} from '@angular/forms/signals'
import { ProjectRequest } from '../../models/project-request'
import { Subscription } from 'rxjs'
import { ProjectResponse } from '../../models/project-response'
import { TeamMemberResponse } from '../../models/team-member-response'
import { InviteMemberRequest } from '../../models/invite-member-request'
import { toast } from '@spartan-ng/brain/sonner'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'
import { TeamIdState } from '../../services/team-id-state'
import { RouterLink } from '@angular/router'

interface ProjectProps {
	id: number
	title: string
}

@Component({
	selector: 'app-team',
	imports: [
		NgIcon,
		HlmCardImports,
		HlmButtonImports,
		HlmSeparatorImports,
		HlmInputImports,
		HlmTextareaImports,
		HlmInputGroupImports,
		HlmDropdownMenuImports,
		HlmFieldImports,
		HlmSelectImports,
		HlmAvatarImports,
		HlmItemImports,
		HlmDialogImports,
		HlmSpinnerImports,
		FormRoot,
		FormField,
		RouterLink,
	],
	providers: [
		provideIcons({ lucideSearch, lucideUsers, lucidePen, lucideTrash2, lucideChevronDown }),
	],
	templateUrl: './team.html',
	styles: ``,
})
export class Team implements OnDestroy {
	projectSub?: Subscription

	teamId = input<string>()
	teamIdstate = inject(TeamIdState)
	teamApi = inject(TeamApi)

	teamResource = this.teamApi.teamDetailResource(this.teamId)
	projects = signal<ProjectResponse[]>([])
	members = signal<TeamMemberResponse[]>([])

	projectModel = signal<Omit<ProjectRequest, 'teamId'>>({ name: '', description: '' })

	inviteMemberModel = signal<InviteMemberRequest>({ email: '', role: null })

	createProjectModal = signal<BrnDialogState>('closed')

	inviteMemberModal = signal<BrnDialogState>('closed')

	projectForm = form(
		this.projectModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre es requerido' })
			minLength(schemaPath.name, 2, { message: 'El nombre debe tener al menos 2 caracteres' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					this.teamApi.sendProject({ teamId: this.teamId()!, ...data().value() })
					this.closeCreateProjectModal()
				},
			},
		},
	)

	inviteMemberForm = form(
		this.inviteMemberModel,
		(schemaPath) => {
			required(schemaPath.email, { message: 'El email es requerido' })
			email(schemaPath.email, { message: 'El email no es valido' })
			required(schemaPath.role, { message: 'El rol es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					await this.teamApi.inviteMember(this.teamId()!, data().value())
					this.closeInviteMemberModal()
					toast.success('Invitación enviada')
				},
			},
		},
	)

	memberRoleOptions = [
		{ label: 'Editor', value: 'EDITOR' },
		{ label: 'Miembro', value: 'MEMBER' },
	]

	public readonly sortByOptions = [
		{ label: 'Ultimo modificado', value: 'last-modified' },
		{ label: 'Alfabeticamente', value: 'name' },
	]

	constructor() {
		effect(() => {
			const id = this.teamId()

			if (id && !this.teamIdstate.teamId()) {
				this.teamIdstate.teamId.set(id)
			}
		})

		effect(() => {
			if (!this.teamResource.hasValue()) return

			this.projects.set(this.teamResource.value().data.projects)
			this.members.set(this.teamResource.value().data.members)
		})

		effect(() => {
			if (!this.teamId()) return

			this.projectSub?.unsubscribe()

			this.projectSub = this.teamApi.getProjects(this.teamId()!).subscribe((res) => {
				this.projects.update((projects) => [res, ...projects])
			})
		})
	}

	ngOnDestroy() {
		this.projectSub?.unsubscribe()
	}

	public readonly optionToString = (value: string) =>
		this.sortByOptions.find((option) => option.value === value)?.label || ''

	public readonly roleOptionToString = (value: string) =>
		this.memberRoleOptions.find((option) => option.value === value)?.label || ''

	closeCreateProjectModal() {
		this.createProjectModal.set('closed')
		this.projectForm().reset({ name: '', description: '' })
	}

	closeInviteMemberModal() {
		this.inviteMemberModal.set('closed')
		this.inviteMemberForm().reset({ email: '', role: null })
	}
}
