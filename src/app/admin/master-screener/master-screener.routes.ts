import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { MasterScreenerComponent } from './master-screener.component';
import { EditGuardService } from './edit/edit-guard.service';
import { MasterScreenerGuardService } from './master-screener.guard.service';

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
  }
]);
