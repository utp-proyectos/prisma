import {
	Component,
	effect,
	ElementRef,
	inject,
	input,
	OnDestroy,
	signal,
	viewChild,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideHash, lucidePlus, lucideSettings } from '@ng-icons/lucide'
import { ChannelApi } from '../../services/channel-api'
import { MessageResponse } from '../../model/message-response'
import { MessageWs } from '../../services/message-ws'
import { Subscription } from 'rxjs'
import { CreateMessageRequest } from '../../model/create-message-request'
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals'
import { DatePipe } from '@angular/common'

@Component({
	selector: 'app-chat',
	imports: [NgIcon, FormRoot, FormField, DatePipe],
	providers: [provideIcons({ lucideHash, lucidePlus, lucideSettings }), MessageWs],
	templateUrl: './chat.html',
	styles: ``,
	host: { class: 'flex flex-col h-full gap-5' },
})
export class Chat implements OnDestroy {
	messageSub?: Subscription

	teamId = input<string>()
	projectId = input<string>()
	channelId = input<string>()

	channelApi = inject(ChannelApi)
	messageWs = inject(MessageWs)

	chatContainer = viewChild<ElementRef>('chatContainer')

	channelResource = this.channelApi.getChannel(this.projectId, this.channelId)

	messages = signal<MessageResponse[]>([])

	messageModel = signal<Omit<CreateMessageRequest, 'teamId' | 'projectId' | 'channelId'>>({
		content: '',
	})

	messageForm = form(
		this.messageModel,
		(schemaPath) => {
			required(schemaPath.content, { message: 'El mensaje es requerido' })
			disabled(schemaPath, { when: ({ state }) => state.submitting() })
		},
		{
			submission: {
				action: async (data) => {
					const teamId = this.teamId()
					const projectId = this.projectId()
					const channelId = this.channelId()

					if (!teamId || !projectId || !channelId) return

					this.messageWs.sendMessage({ teamId, projectId, channelId, ...data().value() })

					this.messageForm().reset({ content: '' })
				},
			},
		},
	)

	constructor() {
		effect(() => {
			if (this.channelResource.hasValue()) {
				this.messages.set(this.channelResource.value().data.messages ?? [])
				// this.scrollToBottom()
			}
		})

		effect(() => {
			const teamId = this.teamId()
			const projectId = this.projectId()
			const channelId = this.channelId()

			if (!teamId || !projectId || !channelId) return

			this.messageSub?.unsubscribe()

			this.messageSub = this.messageWs
				.watchMessages(teamId, projectId, channelId)
				.subscribe(({ action, payload }) => {
					if (action === 'CREATE') {
						this.messages.update((messages) => [...messages, payload])
						setTimeout(() => this.scrollToBottom(), 0)
					}
				})
		})

		effect(() => {
			if (this.chatContainer()) {
				this.scrollToBottom()
			}
		})
	}

	scrollToBottom() {
		const chatContainer = this.chatContainer()

		if (!chatContainer) return

		chatContainer.nativeElement.scrollTop = chatContainer.nativeElement.scrollHeight
	}

	ngOnDestroy() {
		this.messageSub?.unsubscribe()
	}
}
