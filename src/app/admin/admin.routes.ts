import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: '', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent }
]);
