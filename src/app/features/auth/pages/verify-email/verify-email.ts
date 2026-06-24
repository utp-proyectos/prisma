import { Component, computed, effect, inject, input } from '@angular/core'
import { AuthApiService } from '../../services/auth-api.service'
import { HttpErrorResponse, httpResource } from '@angular/common/http'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { lucideCheck, lucideCircleX } from '@ng-icons/lucide'
import { RouterLink } from '@angular/router'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'

@Component({
	selector: 'app-verify-email',
	imports: [RouterLink, NgIcon, HlmButtonImports, HlmSpinnerImports],
	providers: [provideIcons({ lucideCheck, lucideCircleX })],
	templateUrl: './verify-email.html',
	styles: ``,
})
export class VerifyEmail {
	readonly authService = inject(AuthApiService)

	readonly token = input<string | undefined>()

	readonly verificationResource = this.authService.getVerificationEmailResource(this.token())

	readonly hasToken = computed(() => !!this.token())

	protected hasValue = computed(() => this.verificationResource.hasValue())
	protected isLoading = this.verificationResource.isLoading
	protected error = this.verificationResource.error

	protected errorMessage = computed(() => {
		const errorObj = this.error() as HttpErrorResponse

		if (!errorObj) return null

		return errorObj.error?.message || 'Ocurrió un error inesperado'
	})
}
