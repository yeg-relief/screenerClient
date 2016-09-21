import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Question } from '../../shared';

@Injectable()
export class QuestionControlService {
  form$: Observable<FormGroup>;
  constructor() { }

  toFormGroup(questions: Observable<Question[]>): Observable<FormGroup> {
    this.form$ = questions
      .mergeMap((question: Question[]) => question)
      .reduce<any>((acc: any, value: Question) => {
        acc[value.key] = new FormControl('');
        return acc;
      }, {})
      .map((group: any) => new FormGroup(group));
    return this.form$;
  }

  addQuestions(questions: Question[], form: FormGroup) {
    questions.filter( (question: Question) => {
      return !form.contains(question.key);
    })
    .forEach( (question: Question) => {
      form.addControl(question.key, new FormControl(''));
    });
  }

  removeQuestions(questions: Question[], form: FormGroup) {
    questions.filter( (question: Question) => {
      return form.contains(question.key);
    })
    .forEach( (question: Question) => {
      form.removeControl(question.key);
    });
  }
}
