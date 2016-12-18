import { Component, Input } from '@angular/core';
import { Question } from '../../../../shared/models';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent {
  @Input() expandable: boolean;
  @Input() controlType: string;
  @Input() questionType: string;
  @Input() questionKey: string;
  @Input() conditionalQuestions: Question[];

  checkboxChange(value) {
    this.expandable = value;
  }

  deleteConditional(question: Question, index: number) {
    this.conditionalQuestions.splice(index, 1);
  }

}
