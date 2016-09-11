import { RouterConfig } from '@angular/router';
import { 
  KeyEdit, MasterScreenerEdit, 
  ProgramsEdit, NewQuestion, 
  KeyEditorAdd, KeyOverview,
  KeyDetailEdit, QuestionPreview,
  ProgramOverview } from '../../components';
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
          {path: 'edit', component: KeyDetailEdit},
          {path: 'preview-question', component: QuestionPreview }
        ] 
      },
      {
        path: 'programs', component: ProgramsEdit,
        children: [
          {path: '', component: ProgramOverview}
        ]
      },
      {path: 'new-question', component: NewQuestion},
    ]
  }
];