import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionModule } from '../../shared/modules/question.module';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { MasterScreenerService } from './master-screener.service';
import { MasterScreenerComponent } from './master-screener.component';
import { HttpModule } from '@angular/http';
import { QuestionsResolverService } from './questions/questions-resolver.service';
import { RouterModule } from '@angular/router';
import { MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    QuestionModule,
    UserFacingProgramModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MdButtonModule.forRoot()
  ],
  declarations: [
    QuestionsComponent,
    ResultsComponent,
    MasterScreenerComponent
  ],
  providers: [ 
    MasterScreenerService, 
    QuestionsResolverService
  ]
})
export class MasterScreenerModule {}
