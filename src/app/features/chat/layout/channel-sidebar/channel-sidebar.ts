import { Sidebar, SidebarContent, SidebarHeader } from '@/shared/components/sidebar'
import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core'
import { disabled, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals'
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideHash, lucidePlus, lucideSettings } from '@ng-icons/lucide'
import { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInput } from '@spartan-ng/helm/input'
import { ChannelApi } from '../../services/channel-api'
import { ChannelResponse } from '../../model/channel-response'
import { ChannelWs } from '../../services/channel-ws'
import { Subscription } from 'rxjs'
import { CreateChannelRequest } from '../../model/create-channel-request'
import { CreateChannelDialog } from '../../services/create-chanel-dialog'

@Component({
	selector: 'app-channel-sidebar',
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		Sidebar,
		SidebarHeader,
		SidebarContent,
		HlmButtonImports,
		NgIcon,
		HlmDialogImports,
		HlmInput,
		HlmFieldImports,
		FormRoot,
		FormField,
		RouterLinkActive,
	],
	providers: [provideIcons({ lucidePlus, lucideSettings, lucideHash }), CreateChannelDialog],
	templateUrl: './channel-sidebar.html',
	styles: ``,
	host: { class: 'flex h-full gap-5' },
})
export class ChannelSidebar implements OnDestroy {
	channelSub?: Subscription

	channelApi = inject(ChannelApi)
	ChannelWs = inject(ChannelWs)
	createChannelDialog = inject(CreateChannelDialog)
	router = inject(Router)

	projectId = input<string>()
	teamId = input<string>()

	createChannelDialogState = computed(() => this.createChannelDialog.state())

	channelResource = this.channelApi.getChannels(this.projectId)

	channels = signal<ChannelResponse[]>([])

	channelModel = signal<Omit<CreateChannelRequest, 'teamId' | 'projectId'>>({
		name: '',
	})

	transaction = false

	channelForm = form(
		this.channelModel,
		(schemaPath) => {
			required(schemaPath.name, { message: 'El nombre es requerido' })
			minLength(schemaPath.name, 3, { message: 'El nombre debe tener al menos 3 caracteres' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					const teamId = this.teamId()
					const projectId = this.projectId()

					if (!teamId || !projectId) return

					this.transaction = true

					this.ChannelWs.sendChannel({
						teamId,
						projectId,
						...data().value(),
					})

					this.closeCreateChannelDialog()
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (this.channelResource.hasValue()) {
				this.channels.set(this.channelResource.value().data)
			}
		})

		effect(() => {
			const teamId = this.teamId()
			const projectId = this.projectId()

			if (!teamId || !projectId) return

			this.channelSub = this.ChannelWs.watchChannels(teamId, projectId).subscribe(
				({ action, payload }) => {
					if (action === 'CREATE') {
						this.channels.update((channels) => [...channels, payload])
						if (this.transaction) {
							this.transaction = false
							this.router.navigate([`/team/${teamId}/project/${projectId}/chat/${payload.id}`])
						}
					}
				},
			)
		})
	}

	closeCreateChannelDialog() {
		this.createChannelDialog.close()
		this.channelForm().reset({ name: '' })
	}

	ngOnDestroy() {
		this.channelSub?.unsubscribe()
	}
}
