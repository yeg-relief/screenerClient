import { Component }            from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { QuestionService }      from './Question/data/question.service';
import { QuestionGroup }        from './Question/group/question-group';
@Component({
  selector: 'my-app',
  template: `
    <div>
      <h2>Dev Test Form</h2>
      <dynamic-form [questions]="questions"></dynamic-form>
    </div>
  `,
  directives: [DynamicFormComponent],
  providers:  [QuestionService]
})
export class AppComponent {
  questions: QuestionGroup<any>[];
  constructor(service: QuestionService) {
    this.questions = service.getQuestions();
  }
}
