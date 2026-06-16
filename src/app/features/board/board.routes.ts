import { Routes } from '@angular/router'
import { BoardsLayout } from './layout/boards-layout/boards-layout'
import { MyBoardsPage } from './page/my-boards-page/my-boards-page'
import { TrashBoardsPage } from './page/trash-boards-page/trash-boards-page'
import { FolderPage } from './page/folder-page/folder-page'
import { BoardEditorPage } from './page/board-editor-page/board-editor-page'
import { GroupBoardsPage } from './page/group-boards-page/group-boards-page'

export const boardRoutes: Routes = [
	{
		path: '',
		component: BoardsLayout,
		children: [
			{
				path: '',
				redirectTo: 'my',
				pathMatch: 'full',
			},
			{
				path: 'my',
				component: MyBoardsPage,
			},
			{
				path: 'group',
				component: GroupBoardsPage,
			},
			{
				path: 'trash',
				component: TrashBoardsPage,
			},
			{
				path: 'folders/:folderId',
				component: FolderPage,
			},
		],
	},
	{
		path: ':boardId',
		component: BoardEditorPage,
	},
]
