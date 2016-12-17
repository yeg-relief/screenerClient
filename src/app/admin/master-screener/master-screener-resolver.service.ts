import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducer';
import * as masterScreener from './master-screener.actions';
import { DataService } from '../data.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Injectable()
export class MasterScreenerResolverService {

  constructor(
    private store: Store<fromRoot.State>,
    private data: DataService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.data.loadLatestScreener();
  }

}
