import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as editScreener from './edit.actions';
import * as keys from '../keys/key.actions';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

@Injectable()
export class EditGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const splitUrl = state.url.split('/');
    // the version number
    const last = splitUrl.length - 1;
    return this.loadScreener(parseInt(splitUrl[last], 10));
  }

  loadScreener(version: number): boolean {
    this.store.let(fromRoot.getCurrentEditWorkingVersion)
      .take(1)
      .subscribe(
      (workingVersion: number) => {
        if (workingVersion !== version) {
          this.store.dispatch(new editScreener.InitEdit(version));
          this.store.dispatch(new keys.LoadKeys({}));
        }
      },
      (error) => console.log(`error retrieving working edit version from state: ${error}`)
      );
    return true;
  }
}
