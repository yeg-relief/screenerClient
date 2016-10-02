import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as editScreener  from './edit.actions';

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
    this.store.dispatch(new editScreener.InitEdit(version));
    let loaded = false;
    const sub = this.store.select('editScreener').map( (store: any) => store.present)
      .subscribe(
        (val) => {
          if (typeof val !== 'undefined'){
            loaded = true;
          }
        }
      );
    while (!loaded) {}
    sub.unsubscribe();
    return true;
  }
}
