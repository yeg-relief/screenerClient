import { RouterConfig } from '@angular/router';
import { 
  KeyEdit, MasterScreenerEdit, 
  ProgramsEdit, NewQuestion, 
  KeyEditorAdd, KeyOverview,
  KeyDetailEdit } from '../../components';
import { Editor } from './editor.component';

export const EditorRoutes: RouterConfig = [
  {
    path: 'editor',
    component: Editor,
    children: [
      {path: 'master-screener', component: MasterScreenerEdit},
      {
        path: 'keys', component: KeyEdit, 
        children: [
          {path: 'add', component: KeyEditorAdd},
          {path: '', component: KeyOverview },
          {path: 'edit', component: KeyDetailEdit}
        ] 
      },
      {path: 'programs', component: ProgramsEdit},
      {path: 'new-question', component: NewQuestion},
    ]
  }
];