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
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { MasterScreenerEffects } from './master-screener/master-screener.effects';
import { EditScreenerEffects } from './master-screener/edit/edit.effects';
import { EffectsModule } from '@ngrx/effects';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdProgressBarModule } from '@angular/material';
import { DataService } from './data.service';
import { EditQuestionEffects } from './master-screener/edit-question/edit-question.effects';
import { KeyEffects } from './master-screener/keys/key.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

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
    EffectsModule.run(MasterScreenerEffects),
    EffectsModule.run(EditScreenerEffects),
    EffectsModule.run(EditQuestionEffects),
    EffectsModule.run(KeyEffects)
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    SidenavSectionComponent,
    SidenavComponent,
  ],
  providers: [AuthGuardService, AuthService, DataService]
})
export class AdminModule { }
