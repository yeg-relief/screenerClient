import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '@angular/material';
import { DataService } from './data.service';
import { EditQuestionEffects } from './master-screener/edit-question/edit-question.effects';
import { KeyEffects } from './master-screener/keys/key.effects';
import { AdminCoreModule } from './core/admin-core.module';
import { ProgramOverviewEffects } from './programs/program-overview/effects';
import { ProgramEditEffects } from './programs/program-edit/effects';
import { ProgramDeleteEffects } from './programs/program-overview/delete-confirmation/effects';
import { KeyResolverService } from './keys/overview/key-resolver.service';
import { ProgramsModule } from './programs/programs.module';
import { MasterScreenerModule } from './master-screener/master-screener.module';
import { KeysModule } from './keys/keys.module';
import { HttpModule } from '@angular/http';

import { MasterScreenerResolverService } from './master-screener/master-screener-resolver.service';
import { EditResolveService } from './master-screener/edit/edit-resolve.service';
import { EditQuestionResolverService } from './master-screener/edit-question/edit-question-resolver.service';

import { ProgramsResolverService } from './programs/program-overview/programs-resolver.service';
import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component';
import { QuestionModule } from '../shared/modules/question.module';
import { ScreenerModel } from './screener/screener-model';
import { ScreenerToolbarComponent } from './screener/screener-toolbar/screener-toolbar.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScreenerQuestionComponent } from './screener/screener-question/screener-question.component';
import { UserQuestionComponent } from './screener/screener-question/user-question/user-question.component';
import { InputQuestionComponent } from './screener/screener-question/user-question/input-question/input-question.component';
import { CheckboxQuestionComponent } from './screener/screener-question/checkbox-question/checkbox-question.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule.forRoot(),
    StoreModule.provideStore(reducer),
    EffectsModule.run(EditQuestionEffects),
    EffectsModule.run(KeyEffects),
    EffectsModule.run(ProgramOverviewEffects),
    EffectsModule.run(ProgramEditEffects),
    EffectsModule.run(ProgramDeleteEffects),
    AdminCoreModule,
    ProgramsModule,
    MasterScreenerModule,
    KeysModule,
    QuestionModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AdminComponent,
    ScreenerOverviewComponent,
    ScreenerToolbarComponent,
    ScreenerQuestionComponent,
    UserQuestionComponent,
    InputQuestionComponent,
    CheckboxQuestionComponent,
  ],
  providers: [
    DataService, 
    HttpModule, 
    MasterScreenerResolverService,
    EditResolveService,
    EditQuestionResolverService,
    KeyResolverService,
    ProgramsResolverService,
    ScreenerModel
  ]
})
export class AdminModule { }
