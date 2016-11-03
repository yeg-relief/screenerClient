import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { UserFacingProgram } from '../../../shared/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProgramEditGuardService implements CanActivate {
  program: Observable<UserFacingProgram>;
  constructor(private store: Store<fromRoot.State>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const splitUrl = state.url.split('/');
    // the guid
    const last = splitUrl.length - 1;
    this.program = fromRoot.findProgram(this.store, splitUrl[last]).take(1);
    return true;
  }
}
