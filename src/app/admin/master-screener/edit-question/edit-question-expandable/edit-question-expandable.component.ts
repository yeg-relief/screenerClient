import { Component, Input } from '@angular/core';
import { Question } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent {
  @Input() expandable: boolean;
  @Input() controlType: string;
  @Input() questionType: string;
  @Input() questionKey: string;
  @Input() conditionalQuestions: Question[];

  constructor(private store: Store<fromRoot.State>) { }

  checkboxChange(value) {
    this.store.dispatch(new fromEditQuestion.SetExpandableKey(value));
    this.expandable = value;
  }

  deleteConditional(question: Question, index: number) {
    this.store.dispatch(new fromEditQuestion.RemoveConditional(question));
    this.conditionalQuestions.splice(index, 1);
  }

}
