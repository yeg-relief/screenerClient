import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreenerMetaData } from '../models';
import { MasterScreenerDataService } from '../../master-screener/master-screener-data.service';
import { MasterScreenerActionsTypes } from '../actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class MasterScreenerEffects {

  @Effect() loadMeta$ = this.actions$
    .ofType(MasterScreenerActionsTypes.LOAD_META_DATA)
    .do( () => console.log('loadMeta$ called'))
    .switchMap( () => this.data.loadVersionMetaData())
    .switchMap( (res: MasterScreenerMetaData ) => {
      return Observable.of({
        type: MasterScreenerActionsTypes.LOAD_META_DATA_SUCCESS,
        payload: res
      });
    });

  constructor(
    private data: MasterScreenerDataService,
    private actions$: Actions
  ) { }
}
