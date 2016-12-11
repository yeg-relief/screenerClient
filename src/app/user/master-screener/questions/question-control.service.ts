import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Question } from '../../../shared';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: Question[]): FormGroup {
    const group = questions
      .reduce((acc, question) => {
        acc[question.key] = new FormControl('');
        return acc;
      }, {});
    return new FormGroup(group);
  }

  addQuestions(questions: Question[], form: FormGroup) {
    questions
      .filter(question => !form.contains(question.key))
      .forEach( question => form.addControl(question.key, new FormControl('')));
  }

  removeQuestions(questions: Question[], form: FormGroup) {
    questions
      .filter(question => form.contains(question.key))
      .forEach(question => form.removeControl(question.key));
  }
}
