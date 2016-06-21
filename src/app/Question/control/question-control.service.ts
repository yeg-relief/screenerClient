import { Injectable }   from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { QuestionBase } from '../base/question-base';
import { QuestionGroup } from '../group/question-group';
import { RadioButtonState } from '@angular/common';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toControlGroup(questions: QuestionGroup<any>) {
    let group = {};
    group[questions.leadingQuestion.key] = questions.leadingQuestion.required ? 
                            [questions.leadingQuestion.value || '', Validators.required] : 
                            [questions.leadingQuestion.value || ''];

    questions.followingQuestions.forEach(question => {
      group[question.key] = question.required ? 
                            [question.value || '', Validators.required] : [question.value || ''];
      
    });
    return this.fb.group(group);
  }
}