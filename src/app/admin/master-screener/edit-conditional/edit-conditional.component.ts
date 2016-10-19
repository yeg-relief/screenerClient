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
  selector: 'app-edit-conditional',
  templateUrl: './edit-conditional.component.html',
  styleUrls: ['./edit-conditional.component.css']
})
export class EditConditionalComponent implements OnInit, OnDestroy {
  editQuestion$: Observable<{question: Question, unusedKeys: Key[]}>;
  expandableQuestionKey: Observable<string>;
  showKeys = true;
  showControlType = true;
  showQuestionType = true;
  showLabel = true;
  showErrors = true;
  savedQuestion: Subscription;
  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  ngOnInit() {
    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit);
    this.expandableQuestionKey = this.store.let(fromRoot.expandableKey).take(1);
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

  labelToggle($event) {
    this.showLabel = $event;
  }

  errorsToggle($event) {
    this.showErrors = $event;
  }


  focusOnError(sections: string[]) {
    this.showKeys = false;
    this.showControlType = false;
    this.showQuestionType = false;
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

        default:
          break;
      }
    }
  }
}
