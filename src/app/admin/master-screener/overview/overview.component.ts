import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { MasterScreenerActionsTypes } from '../master-screener.actions';
import { Key } from '../../models/key';
import { Question } from '../../../shared/models';
import { ActivatedRoute } from '@angular/router';
import * as masterScreener from '../master-screener.actions';
import * as fromKeys from '../keys/key.actions';
import { DataService } from '../../data.service';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  keyToggle: BehaviorSubject<boolean>;
  questionToggle: BehaviorSubject<boolean>;
  versions$: Observable<number[]>;
  workingVersion$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string>;
  keys$: Observable<Key[]>;
  creationDate$: Observable<number>;
  questionCount$: Observable<number>;
  // flattened array of all questions in screener
  questions$: Observable<Question[]>;
  subscription: Subscription;
  constructor(
    private store: Store<fromRoot.State>, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.keyToggle = new BehaviorSubject<boolean>(true);
    this.questionToggle = new BehaviorSubject<boolean>(true);
    this.keyToggle.next(true);
    this.questionToggle.next(true);
    this.versions$ = this.store.let(fromRoot.getVersions);
    this.workingVersion$ = this.store.let(fromRoot.getWorkingNumber);
    this.loading$ = this.store.let(fromRoot.getLoading);
    this.error$ = this.store.let(fromRoot.getErrors);
    this.keys$ = this.store.let(fromRoot.getKeys);
    this.questions$ = this.store.let(fromRoot.flattenedQuestions);
    this.questionCount$ = this.store.let(fromRoot.getWorkingQuestionCount);
    this.creationDate$ = this.store.let(fromRoot.getWorkingCreationDate);
    // add error catching etc
    const data = this.route.snapshot.data['masterScreener'];
    if (data !== undefined){
      this.store.dispatch(new masterScreener.ChangeScreenerVersion(data));
    }
    this.store.dispatch(new fromKeys.LoadKeys({}));
  }

  ngOnDestroy() {
    if (this.subscription !== undefined && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

}
