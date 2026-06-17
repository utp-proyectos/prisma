import { Routes } from '@angular/router'
import { RecentProjects } from './pages/recent-projects/recent-projects'
import { Team } from './pages/team/team'

export const homeRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: RecentProjects,
			},
			{
				path: 'team',
				component: Team,
			},
		],
	},
]
