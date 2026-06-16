import { Component, input } from '@angular/core'
import { HlmIcon } from '@spartan-ng/helm/icon'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangle } from '@ng-icons/lucide'

@Component({
	selector: 'auth-header',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideTriangle })],
	templateUrl: './auth-header.html',
	styles: ``,
})
export class AuthHeader {
	title = input.required<string>()
	description = input.required<string>()
}
