import { Injectable }   from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { QuestionBase } from '../base/question-base';
import { QuestionGroup } from '../group/question-group';
import { RadioButtonState } from '@angular/common';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toControlGroup(questions: QuestionGroup<any>[]) {
    let cGroup = {};
    questions.forEach( (qGroup) => {
      cGroup[qGroup.leadingQuestion.key] = qGroup.leadingQuestion.required ? 
                            [qGroup.leadingQuestion.value || '', Validators.required] : 
                            [qGroup.leadingQuestion.value || ''];
    });
    /*
    qGroup.followingQuestions.forEach(question => {
      cGroup[question.key] = question.required ? 
                            [question.value || '', Validators.required] : [question.value || ''];
      
      });
    })
    */
    return this.fb.group(cGroup);
  }
}