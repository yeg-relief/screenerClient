import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';
import { QuestionOption } from '../../../../shared/models';

@Component({
  selector: 'app-edit-question-control-type',
  templateUrl: './edit-question-control-type.component.html',
  styleUrls: ['./edit-question-control-type.component.css']
})
export class EditQuestionControlTypeComponent implements OnInit {
  @Input() controlType: string;
  @Input() questionOptions: QuestionOption;
  private options = [
    {display: 'button', value: 'radio'},
    {display: 'text', value: 'input'},
  ];
  // it is possible to refactor this component such that "button options" 
  // are in their own component
  private optionDisplay = '';
  private optionValue = '';
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  dispatchChange(newValue) {
    if (newValue !== this.controlType) {
      this.store.dispatch(new editQuestion.EditQuestionChangeControl(newValue));
      if (newValue !== 'radio') {
        this.optionDisplay = '';
        this.optionValue = '';
      }
    }
  }

  updateValue($event) {
    this.optionValue = $event;
  }

  updateDisplay($event) {
    this.optionDisplay = $event;
  }

  saveOption() {
    const newOption: QuestionOption = {
      value: this.optionValue,
      display: this.optionDisplay
    };
    if (newOption.value !== '' && newOption.display !== '') {
      this.store.dispatch(new editQuestion.AddOption(newOption));
      this.optionDisplay = '';
      this.optionValue = '';
    }
  }

  removeOption(option: QuestionOption) {
    this.store.dispatch(new editQuestion.RemoveOption(option));
  }
}
