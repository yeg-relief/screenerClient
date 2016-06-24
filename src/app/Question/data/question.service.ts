import { Injectable }       from '@angular/core';
import { ExpandableGroup }     from '../group/expandable-group';
import { TextboxQuestion }  from '../ControlType/textbox/question-textbox';
import { CheckboxQuestion } from '../ControlType/checkbox/question-checkbox';
import { QuestionBase } from '../question-base';
@Injectable()
export class QuestionService {
  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  getQuestions() {
    let questions: ExpandableGroup[] = [
      new ExpandableGroup(
        new CheckboxQuestion({
          key: 'expand',
          label: 'expand group 0?',
          value: false,
          checked: false,
          required: false,
          lead: true,
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
            value: '',
            required: false,
            order: 3
          }),
          new TextboxQuestion({
            key: 'numberChildren',
            label: "How many children under 18?",
            required: true,
            value: '',
            order: 4
          })
        ]
      )
    ];
    return questions;
  }
}
