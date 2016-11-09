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
    const splitUrl = state.url.split('/');
    // the guid
    const last = splitUrl.length - 1;
    this.program$ =
      fromRoot.findProgram(this.store, splitUrl[last])
        // get rid of object reference
        .map(program => cloneDeep(program))
        .take(1);

    return true;
  }

  save(program: ApplicationFacingProgram) {
    console.log(program);
    if (program.guid === 'new') {
      this.store.dispatch(new fromOverview.CreateProgram(program));
    } else {
      this.store.dispatch(new fromOverview.UpdateProgram(program));
    }
  }

}
