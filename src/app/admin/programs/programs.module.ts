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
import { ProgramListPaginatorComponent } from './program-overview/program-list-paginator/program-list-paginator.component';
import { QueryDialogComponent } from './program-overview/program-detail/query-dialog/query-dialog.component';
import { QueryDisplayComponent } from './common/query-display/query-display.component';
import { QueryEditV2Component } from './program-edit/query-edit-v2/query-edit-v2.component';
import { ConditionEditV2Component } from './program-edit/condition-edit-v2/condition-edit-v2.component';
import { NewConditionComponent } from './program-edit/new-condition/new-condition.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
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
    QueryEditComponent,
    ProgramListPaginatorComponent,
    QueryDialogComponent,
    QueryDisplayComponent,
    QueryEditV2Component,
    ConditionEditV2Component,
    NewConditionComponent,
  ],
  entryComponents: [
    QueryDialogComponent
  ],
  providers: []
})
export class ProgramsModule { }
