import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import { MasterScreenerActionsTypes } from '../../master-screener.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let';

@Component({
  selector: 'app-screener-stats',
  templateUrl: './screener-stats.component.html',
  styleUrls: ['./screener-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerStatsComponent implements OnInit {
  questionCount$: Observable<number>;
  creationDate$: Observable<string>;
  versionNumber$: Observable<number>;
  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.questionCount$ = this.store.let(fromRoot.getWorkingQuestionCount);
    this.creationDate$ = this.store.let(fromRoot.getWorkingCreationDate);
    this.versionNumber$ = this.store.let(fromRoot.getWorkingNumber);
  }

}
