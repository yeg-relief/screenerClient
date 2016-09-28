import 'rxjs/add/operator/let';
import { Component, OnInit, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { MasterScreenerActionsTypes } from '../master-screener.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  keyToggle: BehaviorSubject<boolean>;
  questionToggle: BehaviorSubject<boolean>;
  versions$: Observable<number[]>;
  workingVersion$: Observable<number>;
  loading$: Observable<boolean>;
  keys = [];
  questions = [];
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.keyToggle = new BehaviorSubject<boolean>(true);
    this.questionToggle = new BehaviorSubject<boolean>(true);
    this.keyToggle.next(true);
    this.questionToggle.next(true);
    this.versions$ = this.store.let(fromRoot.getVersions);
    this.workingVersion$ = this.store.let(fromRoot.getWorkingNumber);
    this.loading$ = this.store.let(fromRoot.getLoading);

    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_VERSION,
      payload: 8
    });
    this.store.dispatch({
      type: MasterScreenerActionsTypes.LOAD_META_DATA
    });
  }

}
