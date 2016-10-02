import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MasterScreener } from '../../models/master-screener';
import { DataService } from '../../data.service';
import  * as editScreener from './edit.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/let';

@Injectable()
export class EditScreenerEffects {

  @Effect() initEdit$ = this.actions$
    .ofType(editScreener.EditScreenerActionsTypes.INIT_EDIT)
    .map<number>(action => action.payload)
    .switchMap( (version: number) => this.data.loadScreener(version))
    .map((screener: MasterScreener) => new editScreener.LoadScreener(screener));


  constructor(
    // DataService is provided via the admin module
    private data: DataService,
    private actions$: Actions
  ) { }
}
