import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowseComponent } from './browse.component';
import { CategoryComponent } from './category/category.component';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { MdButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { BrowseService } from './browse.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    UserFacingProgramModule,
    MdButtonModule.forRoot()
  ],
  declarations: [
    BrowseComponent,
    CategoryComponent
  ],
  providers: [
    BrowseService
  ]
})
export class BrowseModule { }
