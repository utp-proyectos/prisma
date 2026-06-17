import { Routes } from '@angular/router'
import { RecentProjects } from './pages/recent-projects/recent-projects'
import { Team } from './pages/team/team'
import { HomeLayout } from './layout/home-layout/home-layout'

export const homeRoutes: Routes = [
	{
		path: '',
		component: HomeLayout,
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
