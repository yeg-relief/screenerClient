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
  showKeys = false;
  showControlType = false;
  showQuestionType = false;
  showExpand = false;
  showLabel = false;
  showDetails = true;
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

  detailsToggle($event) {
    this.showDetails = $event;
  }

  focusOnDetails(sections: string[]) {
    this.showKeys = false;
    this.showControlType = false;
    this.showQuestionType = false;
    this.showExpand = false;
    this.showLabel = false;
    this.showDetails = true;
    for (let section of sections) {
      console.log(section);
      if (section === 'key') {
        this.showKeys = true;
      }
    }
  }
}
