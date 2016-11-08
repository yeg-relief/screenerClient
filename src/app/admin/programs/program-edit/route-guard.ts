import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOverview from '../program-overview/actions';
import { ApplicationFacingProgram } from '../../models/program';
import { Observable } from 'rxjs/Observable';
import { cloneDeep } from 'lodash';
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramEditGuardService implements CanActivate {
  program$: Observable<ApplicationFacingProgram>;

  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // reset saved to false because this subject may not have been garbage collected since 
    // last navigation
    const splitUrl = state.url.split('/');
    // the guid
    const last = splitUrl.length - 1;
    this.program$ =
      fromRoot.findProgram(this.store, splitUrl[last])
        .map(program => cloneDeep(program))
        .take(1);

    return true;
  }

  updateProgram(program) {
    console.log('update program called');
    this.store.dispatch(new fromOverview.UpdateProgram(program));
  }

  createProgram(program) {
    console.log('create program called');
    this.store.dispatch(new fromOverview.CreateProgram(program));
  }

}
