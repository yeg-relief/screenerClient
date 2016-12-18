import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromEdit from './edit.actions';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
@Injectable()
export class EditResolveService {

  constructor(
    private data: DataService,
    private store: Store<fromRoot.State>
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    console.log('EDIT RESOLVE CALLED');
    const version = +route.params['version'];
    return this.data.loadScreener(version)
            .do( () => this.store.dispatch(new fromEdit.InitEdit(version)))
            .do(screener => this.store.dispatch(new fromEdit.LoadScreener(screener)))
            .switchMap(() => this.store.let(fromRoot.getPresentEditScreener))
            .take(1)
            .toPromise();
  }
}
