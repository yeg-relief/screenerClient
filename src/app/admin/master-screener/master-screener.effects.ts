import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreener } from '../models/master-screener';
import { DataService } from '../data.service';
import { MasterScreenerActionsTypes } from './master-screener.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class MasterScreenerEffects {

  @Effect() loadMeta$ = this.actions$
    .ofType(MasterScreenerActionsTypes.LOAD_VERSIONS_INFO)
    .switchMap( () => this.data.loadVersionMetaData())
    .switchMap( (res: number[] ) =>
      Observable.of({
        type: MasterScreenerActionsTypes.CHANGE_VERSIONS_INFO,
        payload: res
      })
    );

  @Effect() loadVersion$ = this.actions$
    .ofType(MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION)
    .map<number>(action => action.payload)
    .do(version => console.log(`requesting version number: ${version}`))
    .switchMap(version => this.data.loadScreener(version))
    .do(resp => console.log(`data service response: ${resp}`))
    .switchMap( (masterScreener: MasterScreener | boolean) => {
      if (typeof masterScreener === 'boolean') {
        return Observable.of(false);
      }
      return Observable.of(masterScreener);
    })
    .switchMap(res => Observable.of({
        type: MasterScreenerActionsTypes.CHANGE_MASTER_SCREENER_VERSION,
        payload: res
      })
    );

  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
