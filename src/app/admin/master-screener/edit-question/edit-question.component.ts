import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  editQuestion$: Observable<{question: Question, unusedKeys: Key[]}>;
  originalEditQuestionKey$: Observable<string>;
  showKeys = true;
  showControlType = true;
  showQuestionType = true;
  showExpand = true;
  showLabel = true;
  showErrors = true;
  savedQuestion: Subscription;
  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
    this.originalEditQuestionKey$ = this.store.let(fromRoot.getOriginalKeyQuestionEdit).take(1);
    this.savedQuestion = Observable.combineLatest(
        this.store.let(fromRoot.questionSaved),
        this.store.let(fromRoot.getWorkingNumber).take(1)
    )
      .subscribe(([saved, currentVersion]) => {
        if (saved) {
          this.router.navigateByUrl(`/admin/master-screener/edit/version/${currentVersion}`);
        }
      });
  }

  ngOnDestroy() {
    this.savedQuestion.unsubscribe();
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

  errorsToggle($event) {
    this.showErrors = $event;
  }

  showExpandedSection($event) {
    this.showExpand = $event;
  }

  focusOnError(sections: string[]) {
    this.showKeys = false;
    this.showControlType = false;
    this.showQuestionType = false;
    this.showExpand = false;
    this.showLabel = false;
    this.showErrors = true;
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
