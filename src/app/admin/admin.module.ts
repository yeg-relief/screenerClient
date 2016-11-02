import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';
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
import { AdminCoreModule } from './core/admin-core.module';
import { ProgramOverviewEffects } from './programs/program-overview/effects';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    MdInputModule.forRoot(),
    MdProgressBarModule.forRoot(),
    StoreModule.provideStore(reducer),
    EffectsModule.run(MasterScreenerEffects),
    EffectsModule.run(EditScreenerEffects),
    EffectsModule.run(EditQuestionEffects),
    EffectsModule.run(KeyEffects),
    EffectsModule.run(ProgramOverviewEffects),
    AdminCoreModule
  ],
  declarations: [
    AdminComponent,
  ],
  providers: [AuthGuardService, AuthService, DataService]
})
export class AdminModule { }
