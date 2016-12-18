import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as editQuestion from './edit-question.actions';

@Injectable()
export class EditQuestionGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('in EDIT canActivate');

    const splitUrl = state.url.split('/');
    // the version number
    const last = splitUrl.length - 1;
    return this.loadScreener(splitUrl[last]);
  }

  loadScreener(key: string): boolean {
    this.store.dispatch(new editQuestion.EditQuestionInit({originalQuestionKey: key, expandableQuestionKey: ''}));
    return true;
  }
}
