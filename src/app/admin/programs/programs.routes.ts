import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: ProgramsComponent,
    children: [
      {
          path: 'overview', component: ProgramOverviewComponent,
      },
      {
        path: '', pathMatch: 'full', redirectTo: 'overview'
      }
    ]
  }
]);
