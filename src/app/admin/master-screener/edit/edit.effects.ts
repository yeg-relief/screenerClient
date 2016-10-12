import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreener } from '../../models/master-screener';
import { DataService } from '../../data.service';
import * as editScreener from './edit.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';

@Injectable()
export class EditScreenerEffects {

  @Effect() initEdit$ = this.actions$
    .ofType(editScreener.EditScreenerActionsTypes.INIT_EDIT)
    .map<number>(action => action.payload)
    .switchMap( (version: number) => this.data.loadScreener(version))
    .map((screener: MasterScreener) => new editScreener.LoadScreener(screener));

  @Effect() saveScreener$ = this.actions$
    .ofType(editScreener.EditScreenerActionsTypes.SAVE_SCREENER)
    .map<MasterScreener>(action => action.payload)
    .switchMap(masterScreener => this.data.saveScreener(masterScreener))
    .map(() => new editScreener.SaveScreenerSuccess({}));

  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
