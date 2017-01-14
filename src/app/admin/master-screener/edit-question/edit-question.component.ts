import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromEditQuestion from './edit-question.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Question } from '../../../shared/models';
import { Key } from '../../models/key';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';
import { DataService } from '../../data.service';
import * as fromKeys from '../keys/key.actions';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  editQuestion$: Observable<Question>;
  availableKeys$: Observable<Key[]>;
  originalEditQuestionKey$: Observable<string>;
  showKeys = true;
  showControlType = true;
  showQuestionType = true;
  showExpand = true;
  showLabel = true;
  showErrors = true;

  subscription: Subscription
  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.subscription = this.route.data
      .map(data => data['question'])
      .do(() => this.store.dispatch(new fromKeys.LoadKeys({})))
      .subscribe(key => {
        this.store.dispatch(new fromEditQuestion.EditQuestionInit({
          originalQuestionKey: key,
          expandableQuestionKey: ''
        }));
      });

    this.editQuestion$ = this.store.let(fromRoot.getPresentQuestionEdit)
      .map(val => val.question)
      .multicast(new ReplaySubject(1)).refCount();
    this.originalEditQuestionKey$ = this.store.let(fromRoot.getOriginalKeyQuestionEdit);
    this.availableKeys$ = this.store.let(fromRoot.getPresentQuestionEdit)
      .map(val => val.unusedKeys);
  }

  ngOnDestroy() {
    if (!this.subscription.closed){
      this.subscription.unsubscribe();
    }
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
