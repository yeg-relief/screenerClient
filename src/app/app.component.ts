import { Component }            from '@angular/core';
import { QuestionService }      from './Question/data/question.service';

@Component({
  selector: 'my-app',
  template: `
    <div>
      hi this is working
    </div>
  `,
  directives: [],
  providers:  [QuestionService]
})
export class AppComponent {
  constructor() {
  }
}
