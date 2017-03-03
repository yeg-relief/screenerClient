import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question, ID, QuestionType, QUESTION_TYPE_CONDITIONAL, QUESTION_TYPE_CONSTANT } from '../../models';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit {
  @Input() questions: ID[];
  @Input() form: FormGroup;
  @Input() type: QuestionType; // are these conditional or constant questions in the list?
  @Input() host_id: ID | undefined; // undefined if these are constant questions
  @Output() questionSelect = new EventEmitter<ID>();
  @Output() addQuestion = new EventEmitter<{[key: string]: QuestionType | ID }>();

  private classes: { [key: string]: {[key: string]: boolean} } = { };
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

  handleSelect(questionID: ID) {
    console.log(`question selected id: ${questionID}`);
    for (const key in this.classes) {
      if (this.classes[key]['selected'] === true) this.classes[key]['selected'] = false;
    }

    if (this.classes[questionID] === undefined) this.classes[questionID] = { };

    this.classes[questionID]['selected'] = true;
    this.questionSelect.emit(questionID);
  }
  
  ngOnInit(){ }
}
