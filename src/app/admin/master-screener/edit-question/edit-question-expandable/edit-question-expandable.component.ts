import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../edit-question.actions';

@Component({
  selector: 'app-edit-question-expandable',
  templateUrl: './edit-question-expandable.component.html',
  styleUrls: ['./edit-question-expandable.component.css']
})
export class EditQuestionExpandableComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  checkboxChange(value) {
    this.store.dispatch(new editQuestion.EditQuestionChangeExpand(value));
  }

}
