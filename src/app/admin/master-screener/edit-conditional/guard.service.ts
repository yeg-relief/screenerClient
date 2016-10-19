import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as editQuestion from '../edit-question/edit-question.actions';
@Injectable()
export class ConditionalGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const splitUrl = state.url.split('/');
    // the version number
    const last = splitUrl.length - 1;
    console.log(splitUrl[last]);
    this.store.dispatch(new editQuestion.SetExpandableKey(splitUrl[last]));
    this.store.dispatch(new editQuestion.EditQuestionInit('new'));
    return true;
  }
}
