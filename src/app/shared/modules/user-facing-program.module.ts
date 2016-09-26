import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFacingProgramComponent } from
  '../components/program/user-facing-program/user-facing-program.component';
import { MdCardModule } from '@angular2-material/card';

@NgModule({
  imports: [
    CommonModule,
    MdCardModule.forRoot(),
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
