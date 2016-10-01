import 'rxjs/add/operator/let';
import { Component, OnInit, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { MasterScreenerActionsTypes } from '../master-screener.actions';
import { Key } from '../../models/key';
import { Question } from '../../../shared/models';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  keyToggle: BehaviorSubject<boolean>;
  questionToggle: BehaviorSubject<boolean>;
  versions$: Observable<number[]>;
  workingVersion$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string>;
  keys$: Observable<Key[]>;
  creationDate$: Observable<string>;
  questionCount$: Observable<number>;
  // flattened array of all questions in screener
  questions$: Observable<Question[]>;
  constructor(private store: Store<fromRoot.State>) { }

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
    // move these calls into an activate route guard 
    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION,
      // shouldn't be hardcoded just doing it for now
      payload: 3
    });
    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_VERSIONS_INFO
    });
  }

}
