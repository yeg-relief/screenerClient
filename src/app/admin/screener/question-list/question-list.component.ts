import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionThumbNail, ID } from '../../models';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent {
  @Input() questions: QuestionThumbNail[];
  @Output() questionSelect = new EventEmitter<ID>();
}
