import { Routes } from '@angular/router'
import { HomeLayout } from './layout/home-layout/home-layout'

export const homeRoutes: Routes = [
	{
		path: '',
		component: HomeLayout,
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./pages/recent-projects/recent-projects').then((m) => m.RecentProjects),
			},
			{
				path: 'team/:teamId',
				loadComponent: () => import('./pages/team/team').then((m) => m.Team),
			},
		],
	},
]
