import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { LoginComponent } from './core/login/login.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
   // commented out for development cycle
  //{ path: '', component: AdminComponent, canActivate: [AuthGuardService] },
  {
    path: '', component: AdminComponent,
      children: [
        {
          path: 'master-screener',
          loadChildren: 'app/admin/master-screener/master-screener.module#MasterScreenerModule'
        },
        {
          path: 'programs',
          loadChildren: 'app/admin/programs/programs.module#ProgramsModule'
        }
    ]
  },
  { path: 'login', component: LoginComponent },
]);
