import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducer';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class MasterScreenerResolverService {

  constructor(private data: DataService, private store: Store<fromRoot.State>) {}

  resolve(route: ActivatedRouteSnapshot) {
    /*
    return this.store.select(s => s.masterScreener)
      .filter(masterScreenerState => masterScreenerState.cachedVersions.length === 0)
      .switchMap(masterScreenerState => this.data.loadAllScreeners());
    */
    return this.data.loadAllScreeners();
}

}
