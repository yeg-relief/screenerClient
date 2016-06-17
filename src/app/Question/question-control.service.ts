import { Injectable }   from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { QuestionBase } from './question-base';
import { RadioButtonState } from '@angular/common';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toControlGroup(questions: QuestionBase<any>[] ) {
    let group = {};

    questions.forEach(question => {
      const controlType: string = question.controlType;
      switch(controlType){
        case 'checkbox':
          group[question.key] = new RadioButtonState(true, question.value);
          break;
        case 'textbox':
          group[question.key] = question.required ? [question.value || '', Validators.required] : [question.value || ''];
          break;
        default:
          console.log(`${question.key} does not have a valid controlType, found: ${controlType}`); 
      }
    });
    return this.fb.group(group);
  }
}