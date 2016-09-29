import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';
import { LoginComponent } from './core/login/login.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { SidenavSectionComponent }from './core/sidenav/sidenav-section/sidenav-section.component';
import { BreadCrumbComponent } from './core/bread-crumb/bread-crumb.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { MasterScreenerEffects } from './master-screener/master-screener.effects';
import { EffectsModule } from '@ngrx/effects';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdProgressBarModule } from '@angular/material';
import { DataService } from './data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    MdInputModule.forRoot(),
    MdProgressBarModule.forRoot(),
    StoreModule.provideStore(reducer),
    EffectsModule.run(MasterScreenerEffects)
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    SidenavSectionComponent,
    SidenavComponent,
    BreadCrumbComponent
  ],
  providers: [AuthGuardService, AuthService, DataService]
})
export class AdminModule { }
