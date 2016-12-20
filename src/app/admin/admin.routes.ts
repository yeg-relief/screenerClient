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
import { EditGuardService } from './master-screener/edit/edit-guard.service';

import { ProgramsComponent } from './programs/programs.component';
import { ProgramOverviewComponent } from './programs/program-overview/program-overview.component';
import { ProgramOverviewGuardService } from './programs/program-overview/route-guard';
import { ProgramEditComponent } from './programs/program-edit/program-edit.component';
import { ProgramEditGuardService } from './programs/program-edit/route-guard';
import { DeleteConfirmationComponent } from './programs/program-overview/delete-confirmation/delete-confirmation.component';
import { ProgramDeleteGuardService } from './programs/program-overview/delete-confirmation/route-guard';
import { QueryEditComponent } from './programs/program-edit/query-edit/query-edit.component';

import { KeysComponent } from './keys/keys.component';
import { KeysOverviewComponent } from './keys/overview/overview.component';
import { KeyRouteGuard } from './keys/route-guard.service';
import { KeyEditComponent } from './keys/edit/key-edit.component';
import { EditQuestionComponent } from './master-screener/edit-question/edit-question.component'
import { EditQuestionResolverService } from './master-screener/edit-question/edit-question-resolver.service'
import { EditConditionalComponent } from './master-screener/edit-conditional/edit-conditional.component';
import { ConditionalGuardService } from './master-screener/edit-conditional/guard.service';

export const routing: ModuleWithProviders = RouterModule.forChild([
  // commented out for development cycle
  //{ path: '', component: AdminComponent, canActivate: [AuthGuardService] },
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'master-screener',
        component: MasterScreenerComponent,
        children: [
          {
            path: 'overview', component: OverviewComponent,
            resolve: {
              masterScreener: MasterScreenerResolverService
            }
          },
          {
            path: 'edit/version/:version',
            component: EditComponent,
            resolve: {
              screener: EditResolveService
            },
            children: []
          },
          {
            path: 'edit/version/:version/question/:key',
            component: EditQuestionComponent,
            //canActivate: [EditQuestionGuardService],
            resolve: {
              question: EditQuestionResolverService
            }
          },
          {
            path: 'edit/version/:version/conditionals/question/:key',
            component: EditConditionalComponent,
            //canActivate: [ConditionalGuardService]
          },
          {
            path: '', pathMatch: 'full', redirectTo: 'overview',
            resolve: {
              masterScreener: MasterScreenerResolverService
            }
          },
          /*
          {
            path: 'master-screener/question/edit/:version/:key',
            component: EditQuestionComponent,
            //canActivate: [EditQuestionGuardService],
            resolve: {
              question: EditQuestionResolverService
            }
          },
          
          {
            path: 'master-screener/question/edit/conditionals/:version/:key',
            component: EditConditionalComponent,
            canActivate: [ConditionalGuardService]
          }
          */
        ]
      },
      {
        path: 'programs',
        component: ProgramsComponent,
        children: [
          {
            path: 'overview',
            component: ProgramOverviewComponent,
            canActivate: [ProgramOverviewGuardService]
          },
          {
            path: 'edit/:guid',
            component: ProgramEditComponent,
            canActivate: [ProgramEditGuardService]
          },
          {
            path: 'delete/:guid',
            component: DeleteConfirmationComponent,
            canActivate: [ProgramDeleteGuardService]
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
        canActivate: [KeyRouteGuard],
        children: [
          {
            path: 'overview',
            component: KeysOverviewComponent
          },
          {
            path: 'edit/:id',
            component: KeyEditComponent
          }
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
]);
