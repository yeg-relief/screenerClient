import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreener } from '../models/master-screener';
import { DataService } from '../data.service';
import * as masterScreener from './master-screener.actions';
import { Observable } from 'rxjs/Observable';
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
    .do(version => console.log(`requesting version number: ${version}`))
    .switchMap(version => this.data.loadScreener(version))
    .do(resp => console.log(`data service response: ${resp}`))
    .map((values: any) => new masterScreener.ChangeScreenerVersion(values));

  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
