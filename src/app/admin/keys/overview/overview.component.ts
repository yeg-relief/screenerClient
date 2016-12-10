import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Key } from '../../models/key';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-keys-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class KeysOverviewComponent implements OnInit {
  loadedKeys$: Observable<Key[]>;

  constructor(private store: Store<fromRoot.State>, private data: DataService) { }

  ngOnInit() {
    this.loadedKeys$ = this.store.let(fromRoot.allLoadedKeys);
  }

  removeKey(key) {
    console.log(`removeKey called on ${key.name} with ${key.type}`);
    this.store.dispatch(new keysActions._DeleteKey(key));
    this.data.delete(key);
  }
}
