import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import { Question } from '../../../shared';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions$: Observable<Question[]>): Promise<FormGroup> {
    return questions$
        //flatten array   
        .mergeMap<Question>((question: Question[]) => question)
        .reduce<any>((acc: any, value: Question) => {
          acc[value.key] = new FormControl('');
          return acc;
        }, {})
        .map((group: any) => new FormGroup(group))
        .toPromise();

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
