import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Key } from '../../models/key';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-keys-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class KeysOverviewComponent implements OnInit, OnDestroy {
  loadedKeys$: Observable<Key[]>;
  destroy$ = new Subject();

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.loadedKeys$ = this.store.let(fromRoot.allLoadedKeys).take(1);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
