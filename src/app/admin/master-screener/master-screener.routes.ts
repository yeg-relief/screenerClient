import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { MasterScreenerComponent } from './master-screener.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditConditionalComponent } from './edit-conditional/edit-conditional.component';
import { EditQuestionGuardService } from './edit-question/edit-question.guard.service';
import { ConditionalGuardService } from './edit-conditional/guard.service';

export const MasterScreenerRoutes = [
  {
    path: 'master-screener/question/edit/:key', component: EditQuestionComponent, canActivate: [EditQuestionGuardService]
  },
  {
    path: 'master-screener/question/new', component: EditQuestionComponent, canActivate: [EditQuestionGuardService]
  },
  {
    path: 'master-screener/question/edit/conditionals/:key', component: EditConditionalComponent, canActivate: [ConditionalGuardService]
  }
];
