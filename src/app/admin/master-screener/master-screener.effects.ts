import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataService } from '../data.service';
import * as masterScreener from './master-screener.actions';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class MasterScreenerEffects {

  @Effect() loadMeta$ = this.actions$
    .ofType(masterScreener.MasterScreenerActionsTypes.LOAD_VERSIONS_INFO)
    .switchMap( () => this.data.loadVersionMetaData())
    .map( (res: number[] ) => new masterScreener.ChangeScreenerVersionInfo(res));

  @Effect() loadVersion$ = this.actions$
    .ofType(masterScreener.MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION)
    .map<number>(action => action.payload)
    .switchMap(version => this.data.loadScreener(version))
    .map(values => new masterScreener.ChangeScreenerVersion(values));

  @Effect() loadLatestVersion$ = this.actions$
    .ofType(masterScreener.MasterScreenerActionsTypes.LOAD_LATEST_SCREENER_VERSION)
    .switchMap( () => this.data.loadLatestScreener())
    .map(values => new masterScreener.ChangeScreenerVersion(values));


  constructor(
    private data: DataService,
    private actions$: Actions
  ) { }
}
