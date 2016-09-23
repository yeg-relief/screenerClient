import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
   // commented out for development cycle
  //{ path: '', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: '', component: AdminComponent  },
  { path: 'login', component: LoginComponent },
  /*
    {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  */
  { path: 'master-screener',
    loadChildren: 'app/admin/master-screener/master-screener.module#MasterScreenerModule' }
]);
