import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-type',
  templateUrl: './edit-question-type.component.html',
  styleUrls: ['./edit-question-type.component.css']
})
export class EditQuestionTypeComponent implements OnInit {
  @Input() type: string;
  currentValue: string;
  private options = [
    {display: 'true/false', value: 'boolean'},
    {display: 'number', value: 'number'},
    {display: 'text', value: 'text'}
  ];

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.currentValue = this.type;
  }

  changeType($event) {
    if (typeof $event !== 'undefined' && this.currentValue !== $event) {
      this.store.dispatch(new editQuestion.EditQuestionChangeQuestionType($event));
      this.currentValue = $event;
    }
  }

}
