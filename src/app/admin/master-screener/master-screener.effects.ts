import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreenerMetaData, MasterScreener } from '../models/master-screener';
import { DataService } from '../data.service';
import { MasterScreenerActionsTypes } from './master-screener.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class MasterScreenerEffects {

  @Effect() loadMeta$ = this.actions$
    .ofType(MasterScreenerActionsTypes.LOAD_META_DATA)
    .switchMap( () => this.data.loadVersionMetaData())
    .switchMap( (res: MasterScreenerMetaData ) => {
      return Observable.of({
        type: MasterScreenerActionsTypes.LOAD_META_DATA_SUCCESS,
        payload: res
      });
    });

  @Effect() loadVersion$ = this.actions$
    .ofType(MasterScreenerActionsTypes.LOAD_VERSION)
    .map<number>(action => action.payload)
    .switchMap(version => this.data.loadScreener(version))
    .switchMap( (masterScreener: MasterScreener | boolean) => {
      if (typeof masterScreener === 'boolean') {
        return Observable.of({
          type: MasterScreenerActionsTypes.LOAD_VERSION_FAILURE,
          payload: false
        });
      }
      return Observable.of({
        type: MasterScreenerActionsTypes.LOAD_VERSION_SUCCESS,
        payload: masterScreener
      });
    })
    .switchMap(action => Observable.of({
        type: MasterScreenerActionsTypes.CHANGE_VERSION,
        payload: action.payload
      })
    );

  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
