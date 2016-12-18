import { Component, Input } from '@angular/core';
import { QuestionOption } from '../../../../shared/models';

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

  dispatchChange(newValue) {
    if (newValue !== this.controlType) {
      this.controlType = newValue;
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
      this.questionOptions.push(newOption)
      this.optionDisplay = '';
      this.optionValue = '';
    }
  }

  removeOption(index: number) {
    if(index > -1){
      this.questionOptions.splice(index, 1);
    }
  }
}
