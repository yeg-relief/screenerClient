import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '../base/question-base';
import { QuestionGroup } from '../group/question-group';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionGroup<any>[]) {
    let group: any = {};
    questions.forEach( (qGroup) => {
      group[qGroup.leadingQuestion.key] = qGroup.leadingQuestion.required ? 
                            new FormControl(qGroup.leadingQuestion.value || '', Validators.required) : 
                            new FormControl(qGroup.leadingQuestion.value || '');
    });
    return new FormGroup(group);
  }
}