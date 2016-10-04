import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  editQuestion$: Observable<{question: Question, unusedKeys: Key[]}>;
  showKeys = true;
  showControlType = true;
  showQuestionType = true;
  showExpand = true;
  showLabel = true;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
  }

  keyToggle($event) {
    this.showKeys = $event;
  }

  controlTypeToggle($event) {
    this.showControlType = $event;
  }

  questionTypeToggle($event) {
    this.showQuestionType = $event;
  }

  expandToggle($event) {
    this.showExpand = $event;
  }

  labelToggle($event) {
    this.showLabel = $event;
  }
}
