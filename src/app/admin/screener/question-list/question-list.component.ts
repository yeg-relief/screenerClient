import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question, ID, QuestionType, QUESTION_TYPE_CONDITIONAL, QUESTION_TYPE_CONSTANT } from '../../models';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionListComponent implements OnInit {
  @Input() questions: Question[];
  @Input() form: FormGroup;
  @Input() type: QuestionType; // are these conditional or constant questions in the list?
  @Input() host_id: ID | undefined; // undefined if these are constant questions
  @Output() questionSelect = new EventEmitter<ID>();
  @Output() addQuestion = new EventEmitter<{[key: string]: QuestionType | ID }>();

  private constant_type: QuestionType = QUESTION_TYPE_CONSTANT;
  private conditional_type: QuestionType = QUESTION_TYPE_CONDITIONAL;

  handleAddQuestion() {
    if (this.type === QUESTION_TYPE_CONSTANT ) {
      this.addQuestion.emit({type: QUESTION_TYPE_CONSTANT});
      return;
    } else if (this.type === QUESTION_TYPE_CONDITIONAL ) {
      this.addQuestion.emit({type: QUESTION_TYPE_CONDITIONAL, host_id: this.host_id})
    } else {
      console.warn('[QuestionList]: unkown type @Input()');
    }
  } 

  ngOnInit(){
    console.log('question-list init');
    console.log(this.form);
    console.log(this.type);
    console.log(this.host_id);
    console.log(this.questions);
  }
}
