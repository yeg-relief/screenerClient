import { Injectable }   from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { QuestionBase } from '../base/question-base';
import { RadioButtonState } from '@angular/common';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toControlGroup(questions: QuestionBase<any>[] ) {
    let group = {};

    questions.forEach(question => {
      if(question.conditon !== ''){
        //return;
      }
      group[question.key] = question.required ? 
                            [question.value || '', Validators.required] : [question.value || ''];
      
    });
    return this.fb.group(group);
  }
}