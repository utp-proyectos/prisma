import { Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangle } from '@ng-icons/lucide'
import { remixGithubFill, remixGoogleFill } from '@ng-icons/remixicon'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { RouterLink } from '@angular/router'
import { AuthHeader } from '@/features/auth/components/auth-header/auth-header'

@Component({
	selector: 'app-register',
	imports: [AuthHeader, NgIcon, HlmFieldImports, HlmButtonImports, HlmInputImports, RouterLink],
	providers: [provideIcons({ lucideTriangle, remixGithubFill, remixGoogleFill })],
	templateUrl: './register.html',
})
export class Register {}
