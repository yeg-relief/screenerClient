import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { routing } from './master-screener.routes';
import { QuestionModule } from '../../shared/modules/question.module';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { MasterScreenerService } from './master-screener.service';
import { MdButtonModule } from '@angular/material';
import { MasterScreenerComponent } from './master-screener.component';
import { HttpModule } from '@angular/http';
import { QuestionsResolverService } from './questions/questions-resolver.service';
import { ResultsResolverService } from './results/results-resolver.service';


@NgModule({
  imports: [
    CommonModule,
    QuestionModule,
    UserFacingProgramModule,
    routing,
    ReactiveFormsModule,
    MdButtonModule.forRoot(),
    HttpModule
  ],
  declarations: [
    QuestionsComponent,
    ResultsComponent,
    MasterScreenerComponent
  ],
  providers: [ 
    MasterScreenerService, 
    QuestionsResolverService,
    ResultsResolverService 
  ]
})
export class MasterScreenerModule {}
