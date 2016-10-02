import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducer';
import * as masterScreener from './master-screener.actions';
import { DataService } from '../data.service';

@Injectable()
export class MasterScreenerGuardService implements CanActivate {

  constructor(private store: Store<fromRoot.State>, private data: DataService) {}

  canActivate(): boolean {
    this.store.dispatch(new masterScreener.LoadScreenerVersion(3));
    return true;
  }
}
