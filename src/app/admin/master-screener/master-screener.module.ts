import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterScreenerComponent } from './master-screener.component';
import { OverviewComponent } from './overview/overview.component';
import { routing } from './master-screener.routes';
import { ScreenerStatsComponent } from './overview/screener-stats/screener-stats.component';
import { OverviewControlsComponent } from './overview/controls/controls.component';
import { KeyComponent } from './overview/key/key.component';
import { OverviewQuestionComponent } from './overview/question/question.component';
import { EditComponent } from './edit/edit.component';
import { MdProgressCircleModule } from '@angular/material';
import { MdCheckboxModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdRadioModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { EditGuardService } from './edit/edit-guard.service';
import { EditControlsComponent } from './edit/controls/controls.component';
import { EditQuestionsComponent } from './edit/edit-questions/edit-questions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { QuestionModule } from '../../shared/modules/question.module';
import { EditQuestionControlsComponent } from './edit/edit-question-controls/edit-question-controls.component';
import { BreadCrumbComponent } from '../core/bread-crumb/bread-crumb.component';
import { MasterScreenerGuardService } from './master-screener.guard.service';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditQuestionGuardService } from './edit-question/edit-question.guard.service';
import { EditQuestionToolbarControlsComponent }
  from './edit-question/edit-question-toolbar-controls/edit-question-toolbar-controls.component';
import { EditQuestionTypeComponent } from './edit-question/edit-question-type/edit-question-type.component';
import { EditQuestionLabelComponent } from './edit-question/edit-question-label/edit-question-label.component';
import { EditQuestionKeyComponent } from './edit-question/edit-question-key/edit-question-key.component';
import { EditQuestionControlTypeComponent } from './edit-question/edit-question-control-type/edit-question-control-type.component';
import { EditQuestionExpandableComponent } from './edit-question/edit-question-expandable/edit-question-expandable.component';
import { EditQuestionDisplayControlsComponent }
  from './edit-question/edit-question-display-controls/edit-question-display-controls.component';
import { QuestionErrorsComponent } from './edit-question/question-errors/question-errors.component';
import { EditConditionalComponent } from './edit-conditional/edit-conditional.component';
import { ConditionalGuardService } from './edit-conditional/guard.service';
import { EditConditionalDisplayControlsComponent } from './edit-conditional/edit-conditional-display-controls/edit-conditional-display-controls.component';
import { EditConditionalToolbarControlsComponent } from './edit-conditional/edit-conditional-toolbar-controls/edit-conditional-toolbar-controls.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MdProgressCircleModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    MdRadioModule.forRoot(),
    MdInputModule.forRoot(),
    ReactiveFormsModule,
    UserFacingProgramModule,
    QuestionModule
  ],
  declarations: [
    MasterScreenerComponent,
    OverviewComponent,
    ScreenerStatsComponent,
    OverviewControlsComponent,
    KeyComponent,
    OverviewQuestionComponent,
    EditComponent,
    EditControlsComponent,
    EditQuestionsComponent,
    EditQuestionControlsComponent,
    BreadCrumbComponent,
    EditQuestionComponent,
    EditQuestionToolbarControlsComponent,
    EditQuestionTypeComponent,
    EditQuestionLabelComponent,
    EditQuestionKeyComponent,
    EditQuestionControlTypeComponent,
    EditQuestionExpandableComponent,
    EditQuestionDisplayControlsComponent,
    QuestionErrorsComponent,
    EditConditionalComponent,
    EditConditionalDisplayControlsComponent,
    EditConditionalToolbarControlsComponent,
  ],
  providers: [
    EditGuardService,
    MasterScreenerGuardService,
    EditQuestionGuardService,
    ConditionalGuardService
  ]
})
export class MasterScreenerModule { }
