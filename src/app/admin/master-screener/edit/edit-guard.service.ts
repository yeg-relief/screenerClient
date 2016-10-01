import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { EditScreenerActionsTypes } from './edit.actions';

@Injectable()
export class EditGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const splitUrl = state.url.split('/');
    // the version number
    const last = splitUrl.length - 1;
    return this.loadScreener(parseInt(splitUrl[last], 10));
  }

  loadScreener(version: number): boolean {
    this.store.dispatch({
      type: EditScreenerActionsTypes.INIT_EDIT,
      payload: version
    });
    return true;
  }
}
