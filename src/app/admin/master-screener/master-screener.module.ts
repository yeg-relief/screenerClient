import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MasterScreenerComponent } from './master-screener.component';
import { OverviewComponent } from './overview/overview.component';
import { ScreenerStatsComponent } from './overview/screener-stats/screener-stats.component';
import { OverviewControlsComponent } from './overview/controls/controls.component';
import { KeyComponent } from './overview/key/key.component';
import { OverviewQuestionComponent } from './overview/question/question.component';
import { EditComponent } from './edit/edit.component';
import { MaterialModule } from '@angular/material';
import { EditControlsComponent } from './edit/controls/controls.component';
import { EditQuestionsComponent } from './edit/edit-questions/edit-questions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { QuestionModule } from '../../shared/modules/question.module';
import { EditQuestionControlsComponent } from './edit/edit-question-controls/edit-question-controls.component';
import { MasterScreenerResolverService } from './master-screener-resolver.service';
import { EditQuestionComponent } from './edit-question/edit-question.component';
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
import { EditConditionalDisplayControlsComponent }
  from './edit-conditional/edit-conditional-display-controls/edit-conditional-display-controls.component';
import { EditConditionalToolbarControlsComponent }
  from './edit-conditional/edit-conditional-toolbar-controls/edit-conditional-toolbar-controls.component';
import { AdminCoreModule } from '../core/admin-core.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    UserFacingProgramModule,
    QuestionModule,
    AdminCoreModule,
    RouterModule
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
  ]
})
export class MasterScreenerModule { }
