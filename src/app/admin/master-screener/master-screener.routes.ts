import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { MasterScreenerComponent } from './master-screener.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditGuardService } from './edit/edit-guard.service';
import { MasterScreenerGuardService } from './master-screener.guard.service';
import { EditQuestionGuardService } from './edit-question/edit-question.guard.service';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: MasterScreenerComponent,
    children: [
      {
        path: 'overview', component: OverviewComponent, canActivate: [MasterScreenerGuardService]
      },
      {
        path: 'edit/version/:id', component: EditComponent, canActivate: [EditGuardService]
      },
      {
        path: '', pathMatch: 'full', redirectTo: 'overview'
      }
    ]
  },
  {
    path: 'question/edit/:key', component: EditQuestionComponent, canActivate: [EditQuestionGuardService]
  },
  {
    path: 'question/new', component: EditQuestionComponent, canActivate: [EditQuestionGuardService]
  }
]);
