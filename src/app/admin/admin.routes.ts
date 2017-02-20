import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { LoginComponent } from './core/login/login.component';

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


import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component'


export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'screener/edit',
        component: ScreenerOverviewComponent,
        canActivate: [AuthGuardService],
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
