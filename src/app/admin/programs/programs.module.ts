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
    OverviewControlsComponent
  ],
  providers: [ProgramOverviewGuardService]
})
export class ProgramsModule { }
