import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as programOverview from './actions';
import * as fromKeys from '../../master-screener/keys/key.actions';

@Injectable()
export class ProgramOverviewGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>) {}

  canActivate(): boolean {
    this.store.dispatch(new programOverview.LoadPrograms({}));
    //this.store.dispatch(new fromKeys.LoadKeys({}));
    return true;
  }
}
