import { Component, OnInit, Input } from '@angular/core';
import { QuestionBase } from '../Question/base/question-base';

@Component({
  selector: 'df-question-group',
  templateUrl: 'dynamic-question-group.component.html',
  styleUrls: ['dynamic-question-group.component.css']
})
export class DynamicQuestionGroupComponent implements OnInit {
  @Input() group: QuestionBase<any>[] = [];

  ngOnInit() {
  }

}
