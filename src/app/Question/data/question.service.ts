import { Injectable }       from '@angular/core';
import { QuestionGroup }     from '../group/question-group';
import { TextboxQuestion }  from '../textbox/question-textbox';
import { CheckboxQuestion } from '../checkbox/question-checkbox';
@Injectable()
export class QuestionService {
  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  getQuestions() {
    let questions: QuestionGroup<any>[] = [
      new QuestionGroup(
        new CheckboxQuestion({
          key: 'expand',
          label: 'expand group 0?',
          value: 'groupZero',
          checked: false,
          order: 1
        }),
        [
          new TextboxQuestion({
          key: 'firstName',
          label: 'First name',
          value: 'Bombasto',
          required: true,
          order: 2
          }),
          new TextboxQuestion({
            key: 'emailAddress',
            label: 'Email',
            type: 'email',
            order: 3
          }),
          new TextboxQuestion({
            key: 'numberChildren',
            label: "How many children under 18?",
            required: true,
            order: 4
          })
        ]
      )
    ];
    return questions;
  }
}
