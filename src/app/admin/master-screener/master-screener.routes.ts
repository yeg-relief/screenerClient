import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { MasterScreenerComponent } from './master-screener.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: MasterScreenerComponent,
    children: [
      {
        path: 'overview', component: OverviewComponent,
      },
      {
        path: 'edit/version/:id', component: EditComponent
      },
      {
        path: '', pathMatch: 'full', redirectTo: 'overview'
      }
    ]
  }
]);
