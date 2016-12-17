import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../data.service';
import { Store } from '@ngrx/store';
import * as keysActions from './actions';
import * as fromRoot from '../reducer';
// do i even need to import these? 
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

@Injectable()
export class KeyRouteGuard implements CanActivate {

  constructor(private store: Store<fromRoot.State>, private service: DataService) { }

  canActivate(): boolean {
    this.store.dispatch(new keysActions._LoadKeys({}));
    this.service.getKeys()
      .do(keys => this.store.dispatch(new keysActions._LoadKeysSuccess(keys)))
      .take(1)
      .subscribe();
    return true;
  }
}
