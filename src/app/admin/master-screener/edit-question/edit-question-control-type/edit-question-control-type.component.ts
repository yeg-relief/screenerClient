import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-control-type',
  templateUrl: './edit-question-control-type.component.html',
  styleUrls: ['./edit-question-control-type.component.css']
})
export class EditQuestionControlTypeComponent implements OnInit {
  @Input() controlType: string;
  private options = [
    {display: 'button', value: 'radio'},
    {display: 'text', value: 'input'},
  ];
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  dispatchChange(newValue) {
    if (newValue !== this.controlType) {
      this.store.dispatch(new editQuestion.EditQuestionChangeControl(newValue));
    }
  }
}
