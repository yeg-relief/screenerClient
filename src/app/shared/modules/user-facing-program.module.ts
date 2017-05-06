import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFacingProgramComponent } from
  '../components/program/user-facing-program/user-facing-program.component';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    UserFacingProgramComponent
  ],
  exports: [
    UserFacingProgramComponent
  ]
})
export class UserFacingProgramModule {};
