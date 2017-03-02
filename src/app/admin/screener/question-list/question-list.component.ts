import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionThumbNail, ID } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent {
  @Input() questions: QuestionThumbNail[];
  @Input() form: FormGroup
  @Output() questionSelect = new EventEmitter<ID>();
}
