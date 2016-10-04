import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-control-type',
  templateUrl: './edit-question-control-type.component.html',
  styleUrls: ['./edit-question-control-type.component.css']
})
export class EditQuestionControlTypeComponent implements OnInit {
  private options = [
    {display: 'button', value: 'radio'},
    {display: 'text', value: 'text'},
  ];
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  changeType($event) {
    this.store.dispatch(new editQuestion.EditQuestionChangeControl($event));
  }
}
