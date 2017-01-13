import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdProgressBarModule } from '@angular/material';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavSectionComponent } from './sidenav/sidenav-section/sidenav-section.component';
import { LoginComponent } from './login/login.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    MdInputModule.forRoot(),
    MdProgressBarModule.forRoot()
  ],
  declarations: [
    SidenavComponent,
    LoginComponent,
    BreadCrumbComponent,
    SidenavSectionComponent
  ],
  exports: [
    SidenavComponent,
    LoginComponent,
    BreadCrumbComponent
  ]
})
export class AdminCoreModule {};
