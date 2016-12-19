import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../../../shared/models';
import { Key } from '../../../models/key';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-type',
  templateUrl: './edit-question-type.component.html',
  styleUrls: ['./edit-question-type.component.css']
})
export class EditQuestionTypeComponent{
  @Output() booleanSelected = new EventEmitter<boolean>();
  @Input() type: string;
  constructor(private store: Store<fromRoot.State>) { }

  private options = [
    {display: 'true/false', value: 'boolean'},
    {display: 'number', value: 'number'},
    {display: 'text', value: 'text'}
  ];

  dispatchChange(newValue) {
    this.store.dispatch(new fromEditQuestion.EditQuestionChangeQuestionType(newValue));
    this.type = newValue;
    if(newValue === 'boolean'){
      this.booleanSelected.emit(true);
    } else {
      this.booleanSelected.emit(false);
    }
  }
}
