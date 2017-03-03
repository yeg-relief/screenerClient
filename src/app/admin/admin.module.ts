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
import { AdminCoreModule } from './core/admin-core.module';
import { ProgramOverviewEffects } from './programs/program-overview/effects';
import { ProgramEditEffects } from './programs/program-edit/effects';
import { ProgramDeleteEffects } from './programs/program-overview/delete-confirmation/effects';
import { KeyResolverService } from './keys/overview/key-resolver.service';
import { ProgramsModule } from './programs/programs.module';
import { KeysModule } from './keys/keys.module';
import { HttpModule } from '@angular/http';

import { ProgramsResolverService } from './programs/program-overview/programs-resolver.service';
import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component';
import { ScreenerModel } from './screener/services/screener-model';
import { ScreenerController } from './screener/services/screener-controller';
import { ScreenerNetwork } from './screener/services/screener-network';
import { ScreenerToolbarComponent } from './screener/screener-toolbar/screener-toolbar.component';
import { ScreenerEffects } from './screener/store/screener-effects';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScreenerQuestionComponent } from './screener/screener-question/screener-question.component';
import { UserQuestionComponent } from './screener/screener-question/user-question/user-question.component';
import { ConditionalQuestionsComponent } from './screener/screener-question/conditional-questions/conditional-questions.component';
import { OverviewControlsComponent } from './screener/screener-overview/overview-controls/overview-controls.component';
import { QuestionListComponent } from './screener/question-list/question-list.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    StoreModule.provideStore(reducer),
    EffectsModule.run(ProgramOverviewEffects),
    EffectsModule.run(ProgramEditEffects),
    EffectsModule.run(ProgramDeleteEffects),
    EffectsModule.run(ScreenerEffects),
    AdminCoreModule,
    ProgramsModule,
    KeysModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AdminComponent,
    ScreenerOverviewComponent,
    ScreenerToolbarComponent,
    ScreenerQuestionComponent,
    UserQuestionComponent,
    ConditionalQuestionsComponent,
    OverviewControlsComponent,
    QuestionListComponent,
  ],
  providers: [
    DataService, 
    HttpModule, 
    KeyResolverService,
    ProgramsResolverService,
    ScreenerModel, ScreenerNetwork, ScreenerController,
  ]
})
export class AdminModule { }
