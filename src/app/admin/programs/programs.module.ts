import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { AdminCoreModule } from '../core/admin-core.module';
import { ProgramDetailComponent } from './program-overview/program-detail/program-detail.component';
import { ProgramDetailControlComponent } from './program-overview/program-detail-control/program-detail-control.component';
import { OverviewControlsComponent } from './program-overview/overview-controls/overview-controls.component';
import { ProgramEditComponent } from './program-edit/program-edit.component';
import { DeleteConfirmationComponent } from './program-overview/delete-confirmation/delete-confirmation.component';
import { ApplicationSideComponent } from './program-edit/application-side/application-side.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConditionEditComponent } from './program-edit/condition-edit/condition-edit.component';
import { QueryEditComponent } from './program-edit/query-edit/query-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
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
    ApplicationSideComponent,
    ConditionEditComponent,
    QueryEditComponent
  ],
  providers: []
})
export class ProgramsModule { }
