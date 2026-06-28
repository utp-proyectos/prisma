import { Component, input } from '@angular/core'

@Component({
	selector: 'app-project-resume',
	imports: [],
	templateUrl: './project-resume.html',
	styles: ``,
})
export class ProjectResume {
	teamId = input<string>()
	projectId = input<string>()
}
