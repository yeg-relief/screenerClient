import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as programOverview from './actions';

@Injectable()
export class ProgramOverviewGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>) {}

  canActivate(): boolean {
    this.store.dispatch(new programOverview.LoadPrograms({}));
    return true;
  }
}
