import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import 'rxjs/add/operator/take';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  editQuestion$: Observable<{question: Question, unusedKeys: Key[]}>;
  originalEditQuestionKey$: Observable<string>;
  showKeys = false;
  showControlType = false;
  showQuestionType = false;
  showExpand = false;
  showLabel = false;
  showDetails = true;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
    this.originalEditQuestionKey$ = this.store.let(fromRoot.getOriginalKeyQuestionEdit).take(1);
    this.originalEditQuestionKey$
    .subscribe(
      (key) => {
        if (key === 'new') {
          this.showGuide();
        } else {
          this.hideGuide();
        }
      },
      (error) => console.log(error),
      () => console.log('original edit key sub completed')
    );
  }

  showGuide() {
    this.showKeys = false;
    this.showControlType = false;
    this.showQuestionType = false;
    this.showExpand = false;
    this.showLabel = false;
    this.showDetails = true;
  }

  hideGuide() {
    this.showKeys = true;
    this.showControlType = true;
    this.showQuestionType = true;
    this.showExpand = true;
    this.showLabel = true;
    this.showDetails = false;
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

  showExpandedSection($event) {
    this.showExpand = $event;
  }

  focusOnDetails(sections: string[]) {
    this.showKeys = false;
    this.showControlType = false;
    this.showQuestionType = false;
    this.showExpand = false;
    this.showLabel = false;
    this.showDetails = true;
    for (let section of sections) {
      switch (section) {
        case 'key':
          this.showKeys = true;
          break;

        case 'label':
          this.showLabel = true;
          break;

        case 'control':
          this.showControlType = true;
          break;

        case 'type':
          this.showQuestionType = true;
          break;

        case 'expandable':
          this.showExpand = true;
          break;

        default:
          break;
      }
    }
  }
}
