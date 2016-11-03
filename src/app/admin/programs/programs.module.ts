import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';
import { routing } from './programs.routes';
import { MaterialModule } from '@angular/material';
import { AdminCoreModule } from '../core/admin-core.module';
import { ProgramDetailComponent } from './program-overview/program-detail/program-detail.component';
import { ProgramOverviewGuardService } from './program-overview/route-guard';
import { ProgramDetailControlComponent } from './program-overview/program-detail-control/program-detail-control.component';
import { OverviewControlsComponent } from './program-overview/overview-controls/overview-controls.component';
import { ProgramEditComponent } from './program-edit/program-edit.component';
import { ProgramEditGuardService } from './program-edit/route-guard';
import { DeleteConfirmationComponent } from './program-overview/delete-confirmation/delete-confirmation.component';
import { ProgramDeleteGuardService } from './program-overview/delete-confirmation/route-guard';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule.forRoot(),
    AdminCoreModule
  ],
  declarations: [
    ProgramsComponent,
    ProgramOverviewComponent,
    ProgramDetailComponent,
    ProgramDetailControlComponent,
    OverviewControlsComponent,
    ProgramEditComponent,
    DeleteConfirmationComponent,
  ],
  providers: [
    ProgramOverviewGuardService,
    ProgramEditGuardService,
    ProgramDeleteGuardService
  ]
})
export class ProgramsModule { }
