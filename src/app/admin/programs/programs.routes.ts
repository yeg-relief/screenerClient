import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';
import { ProgramOverviewGuardService } from './program-overview/route-guard';
import { ProgramEditComponent } from './program-edit/program-edit.component';
import { ProgramEditGuardService } from './program-edit/route-guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: ProgramsComponent,
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
        path: '', pathMatch: 'full', redirectTo: 'overview'
      }
    ]
  }
]);
