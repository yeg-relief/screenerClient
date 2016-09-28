import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './browse.routes';
import { BrowseComponent } from './browse.component';
import { CategoryComponent } from './category/category.component';
import { UserFacingProgramModule } from '../shared/modules/user-facing-program.module';
import { MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    routing,
    UserFacingProgramModule,
    MdButtonModule.forRoot()
  ],
  declarations: [
    BrowseComponent,
    CategoryComponent
  ]
})
export class BrowseModule { }
