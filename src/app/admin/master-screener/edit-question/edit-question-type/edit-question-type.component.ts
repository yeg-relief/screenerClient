import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../../../shared/models';
import { Key } from '../../../models/key';


@Component({
  selector: 'app-edit-question-type',
  templateUrl: './edit-question-type.component.html',
  styleUrls: ['./edit-question-type.component.css']
})
export class EditQuestionTypeComponent implements OnInit {
  @Output() booleanSelected = new EventEmitter<boolean>();
  @Input() type: string;
  editQuestion$: Observable<{question: Question, unusedKeys: Key[]}>;
  userChangedValue$: Observable<Event>;
  private options = [
    {display: 'true/false', value: 'boolean'},
    {display: 'number', value: 'number'},
    {display: 'text', value: 'text'}
  ];

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
  }

  dispatchChange(newValue) {
    if (newValue !== this.type) {
      this.store.dispatch(new editQuestion.EditQuestionChangeQuestionType(newValue));
    }
  }
}
