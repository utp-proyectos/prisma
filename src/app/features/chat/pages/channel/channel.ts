import { Component, computed, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideHash, lucidePlus } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { CreateChannelDialog } from '../../services/create-chanel-dialog'

@Component({
	selector: 'app-channel',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideHash })],
	templateUrl: './channel.html',
	styles: ``,
	host: { class: 'h-full flex flex-col justify-center items-center gap-4' },
})
export class Channel {
	createChannelDialog = inject(CreateChannelDialog)
}
