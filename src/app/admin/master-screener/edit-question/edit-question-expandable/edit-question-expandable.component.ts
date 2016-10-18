import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';
import { Question } from '../../../../shared/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent implements OnInit {
  @Input() expandable: boolean;
  @Input() controlType: string;
  @Input() questionType: string;
  @Input() conditionalQuestions: Question[];
  alwaysTrue$ = new BehaviorSubject<boolean>(true);
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  checkboxChange(value) {
    this.store.dispatch(new editQuestion.EditQuestionChangeExpand(value));
  }

}
