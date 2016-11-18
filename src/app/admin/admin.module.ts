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
import { AdminCoreModule } from './core/admin-core.module';
import { ProgramOverviewEffects } from './programs/program-overview/effects';
import { ProgramEditEffects } from './programs/program-edit/effects';
import { ProgramDeleteEffects } from './programs/program-overview/delete-confirmation/effects';

import { ProgramsModule } from './programs/programs.module';
import { MasterScreenerModule } from './master-screener/master-screener.module';
import { KeysModule } from './keys/keys.module';

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
    EffectsModule.run(ProgramEditEffects),
    EffectsModule.run(ProgramDeleteEffects),
    AdminCoreModule,
    ProgramsModule,
    MasterScreenerModule,
    KeysModule
  ],
  declarations: [
    AdminComponent,
  ],
  providers: [AuthGuardService, AuthService, DataService]
})
export class AdminModule { }
