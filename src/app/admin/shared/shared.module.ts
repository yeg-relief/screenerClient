import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavSectionComponent } from './sidenav/sidenav-section/sidenav-section.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    SidenavComponent,
    SidenavSectionComponent
  ],
  exports: [
    SidenavComponent,
    SidenavSectionComponent
  ]
})
export class SharedModule { }
