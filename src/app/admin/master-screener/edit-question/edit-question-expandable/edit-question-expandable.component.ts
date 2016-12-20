import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent implements OnInit{
  @Input() expandable: boolean;
  @Input() controlType: string;
  @Input() questionType: string;
  @Input() questionKey: string;
  @Input() conditionalQuestions: Question[];
  version: number;
  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit(){
    this.version = +this.route.snapshot.params['version'];
  }

  checkboxChange(value) {
    this.store.dispatch(new fromEditQuestion.EditQuestionChangeExpand(value));
    this.expandable = value;
  }

  deleteConditional(question: Question, index: number) {
    this.store.dispatch(new fromEditQuestion.RemoveConditional(question));
    this.conditionalQuestions.splice(index, 1);
  }

}
