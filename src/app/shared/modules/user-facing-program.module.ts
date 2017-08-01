import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFacingProgramComponent } from
  '../components/program/user-facing-program/user-facing-program.component';
import { MaterialModule } from '@angular/material';
import { ProgramRowComponent } from 
  '../components/program/user-facing-program/program-row/program-row.component'
import { DetailModalComponent } from '../components/program/detail-modal/detail-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,

  ],
  declarations: [
    UserFacingProgramComponent,
    ProgramRowComponent,
    DetailModalComponent
  ],
  exports: [
    UserFacingProgramComponent,
    ProgramRowComponent
  ],
  entryComponents: [
    DetailModalComponent
  ]
})
export class UserFacingProgramModule {};
