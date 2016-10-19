import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';
import { Question } from '../../../../shared/models';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent implements OnInit {
  @Input() expandable: boolean;
  @Input() controlType: string;
  @Input() questionType: string;
  @Input() questionKey: string;
  @Input() conditionalQuestions: Question[];

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  checkboxChange(value) {
    this.store.dispatch(new editQuestion.EditQuestionChangeExpand(value));
  }

  deleteConditional(question: Question) {
    this.store.dispatch(new editQuestion.RemoveConditional(question));
  }

}
