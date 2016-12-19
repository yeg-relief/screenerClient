import { Component, Input } from '@angular/core';
import { QuestionOption } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-control-type',
  templateUrl: './edit-question-control-type.component.html',
  styleUrls: ['./edit-question-control-type.component.css']
})
export class EditQuestionControlTypeComponent {
  @Input() controlType: string;
  @Input() questionOptions: QuestionOption[];
  private options = [
    {display: 'button', value: 'radio'},
    {display: 'text', value: 'input'},
  ];
  // it is possible to refactor this component such that "button options" 
  // are in their own component
  private optionDisplay = '';
  private optionValue = '';

  constructor(private store: Store<fromRoot.State>) { }

  dispatchChange(newValue) {
    if (newValue !== this.controlType) {
      this.controlType = newValue;
      this.store.dispatch(new fromEditQuestion.EditQuestionChangeControl(newValue));
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
    const checkForBlank = () => newOption.value !== '' && newOption.display !== '';
    const findDuplicate = (option) => option.value === newOption.value || option.display === newOption.display;
    
    if (checkForBlank() && this.questionOptions.findIndex(findDuplicate) === -1) {
      this.store.dispatch(new fromEditQuestion.AddOption(newOption));
      this.questionOptions.push(newOption);
      this.optionDisplay = '';
      this.optionValue = '';
    }
  }

  removeOption(index: number) {
    if(index > -1){
      this.store.dispatch(new fromEditQuestion.RemoveOption(this.questionOptions[index]));
      this.questionOptions.splice(index, 1);
    }
  }
}
