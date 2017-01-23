import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { LoginComponent } from './core/login/login.component';

import { MasterScreenerComponent } from './master-screener/master-screener.component';
import { OverviewComponent } from './master-screener/overview/overview.component';
import { EditComponent } from './master-screener/edit/edit.component';
import { EditResolveService } from './master-screener/edit/edit-resolve.service';
import { MasterScreenerResolverService } from './master-screener/master-screener-resolver.service';

import { ProgramsComponent } from './programs/programs.component';
import { ProgramOverviewComponent } from './programs/program-overview/program-overview.component';
import { ProgramEditComponent } from './programs/program-edit/program-edit.component';
import { DeleteConfirmationComponent } from './programs/program-overview/delete-confirmation/delete-confirmation.component';
import { QueryEditComponent } from './programs/program-edit/query-edit/query-edit.component';
import { ProgramsResolverService } from './programs/program-overview/programs-resolver.service';

import { KeyResolverService } from './keys/overview/key-resolver.service';

import { KeysComponent } from './keys/keys.component';
import { KeysOverviewComponent } from './keys/overview/overview.component';
import { KeyEditComponent } from './keys/edit/key-edit.component';
import { EditQuestionComponent } from './master-screener/edit-question/edit-question.component'
import { EditQuestionResolverService } from './master-screener/edit-question/edit-question-resolver.service'
import { EditConditionalComponent } from './master-screener/edit-conditional/edit-conditional.component';


import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component'


export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'screener',
        component: MasterScreenerComponent,
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'edit',
            component: ScreenerOverviewComponent
          }
        ]
      },
      {
        path: 'programs',
        component: ProgramsComponent,
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'overview',
            component: ProgramOverviewComponent,
            resolve: {
              programs: ProgramsResolverService
            }
          },
          {
            path: 'edit/:guid',
            component: ProgramEditComponent,
          },
          {
            path: 'delete/:guid',
            component: DeleteConfirmationComponent,
          },
          {
            path: 'query-edit/:guid/:id',
            component: QueryEditComponent
          },
          {
            path: '', pathMatch: 'full', redirectTo: 'overview'
          },
        ]
      },
      {
        path: 'keys',
        component: KeysComponent,
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'overview',
            component: KeysOverviewComponent,
            resolve: {
              keys: KeyResolverService
            }
          },
          {
            path: 'edit/:id',
            component: KeyEditComponent
          }
        ]
      },
    ]
  },
  { path: 'login', component: LoginComponent },
]);
