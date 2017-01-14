import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Key } from '../../models/key';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-keys-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class KeysOverviewComponent implements OnInit {
  loadedKeys$: Observable<Key[]>;

  constructor(private store: Store<fromRoot.State>, private data: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    const keys = this.route.snapshot.data['keys'];
    console.log(`keys: ${keys}`);
    this.store.dispatch(new keysActions._LoadKeys({}));
    if (keys !== undefined) {
      this.store.dispatch(new keysActions._LoadKeysSuccess(keys));
    } else {
      this.store.dispatch(new keysActions._LoadKeysFailure({}));
    }
    this.loadedKeys$ = this.store.let(fromRoot.allLoadedKeys);
  }

  removeKey(key) {
    console.log(`removeKey called on ${key.name} with ${key.type}`);
    
    this.data.deleteKey(key)
      .then(success => {
        if (success) {
          this.store.dispatch(new keysActions._DeleteKey(key));
        }
      })
      .catch(error => console.log(error));
  }
}
