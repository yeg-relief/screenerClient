import { Injectable }       from '@angular/core';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';
import { CheckboxQuestion } from './question-checkbox';
@Injectable()
export class QuestionService {
  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  getQuestions() {
    let questions: QuestionBase<any>[] = [
      new CheckboxQuestion({
        key: 'children',
        label: 'Do you have children under 18?',
        value: 'children',
        order: 3
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      })
    ];
    return questions.sort((a, b) => a.order - b.order);
  }
}
