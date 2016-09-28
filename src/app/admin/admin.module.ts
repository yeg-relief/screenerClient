import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';
import { MasterScreenerDataService } from './master-screener/master-screener-data.service';
import { LoginComponent } from './core/login/login.component';
import { MdCardModule } from '@angular2-material/card';
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { SidenavSectionComponent }from './core/sidenav/sidenav-section/sidenav-section.component';
import { BreadCrumbComponent } from './core/bread-crumb/bread-crumb.component';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { MasterScreenerEffects } from './master-screener/master-screener.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdCardModule.forRoot(),
    MdCheckboxModule.forRoot(),
    routing,
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
  providers: [AuthGuardService, AuthService, MasterScreenerDataService]
})
export class AdminModule { }
