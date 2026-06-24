import { AuthService } from '@/core/servies/auth.serive'
import { Component, inject, input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthApiService } from '../../services/auth-api.service'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'

@Component({
	selector: 'app-auth-callback',
	imports: [HlmSpinnerImports],
	template: '<hlm-spinner />',
	host: { class: ' flex justify-center' },
	styles: '',
})
export class AuthCallback implements OnInit {
	private router = inject(Router)
	private authService = inject(AuthService)
	private authApiService = inject(AuthApiService)

	token = input<string | undefined>()
	error = input<string | undefined>()

	ngOnInit() {
		const token = this.token()
		const error = this.error()

		if (token) {
			this.authApiService.getCurrentUser(token).subscribe({
				next: (user) => {
					this.authService.saveSession({ ...user, token })
					this.router.navigate(['/'])
				},
				error: (err) => this.router.navigate(['/auth/login']),
			})
		} else if (error) {
			this.router.navigate(['/auth/login'], {
				queryParams: { error },
			})
		} else {
			this.router.navigate(['/auth/login'])
		}
	}
}
